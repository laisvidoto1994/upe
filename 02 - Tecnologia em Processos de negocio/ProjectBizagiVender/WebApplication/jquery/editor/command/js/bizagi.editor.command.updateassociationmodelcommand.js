/*
*   Name: BizAgi FormModeler Editor Update Association Model Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command performs a update to model
*
*   Arguments
* 
*   - model
*/


bizagi.editor.notUndoableCommand.extend("bizagi.editor.updateAssociationModelCommand", {}, {

    /*
    *   Performs a update of proeprties model
    */
    execute: function () {
        var self = this;
        var entitiesProperties = [
            "leftxpath",
            "leftdisplayattrib",
            "leftadditionalattrib",
            "leftfilter",
            "leftcaption",
            "rightxpath",
            "rightdisplayattrib",
            "rightfilter",
            "rightadditionalattrib",
            "rightcaption",
            "factxpath"
        ];
        var args = self.arguments;
        var model = args.model;
        var guid = args.guid;

        self.changes = {};

        var element = self.model.getElement(guid);
        var properties = element.properties;

        for (var i = 0, l = entitiesProperties.length; i < l; i++) {
            var property = entitiesProperties[i];
            if (!bizagi.editor.utilities.objectEquals(model[property], properties[property])) {
                args.refresh = true;
                self.changes[property] = properties[property];
                element.assignProperty(property, model[property]);
            }
        }

        self.calculateXpathControl();

        return true;
    },

    /*
    * This method checks if is necessary recalculate the xpath property
    */
    calculateXpathControl: function () {
        var self = this;
        var args = self.arguments;
        var model = args.model;
        var guid = args.guid;
        var element = self.model.getElement(guid);
        var control = args.control;

        if (self.changes.factxpath) {
            var leftXpath = model.leftxpath;
            var factXpath = bizagi.clone(leftXpath);
            var baXpath = factXpath.xpath.baxpath;
            baXpath.xpath = baXpath.xpath + "." + model.factxpath;
            element.assignProperty("xpath", factXpath);

            if (control == "searchlist") element.assignProperty("displayName", bizagi.editor.utilities.buildComplexLocalizable(model.factxpath, guid, "displayName"));

            $.when(self.getFactNames(model))
                .done(function () {
                    element.assignProperty("leftfactname", model.leftfactname);
                    element.assignProperty("rightfactname", model.rightfactname);
                });
        }
    },

    /*
    * This method builds the xpath of facts names
    */
    getFactNames: function (model) {
        var self = this;
        var leftXpath = model.leftxpath;
        var leffFactName = model.leftfactname;
        var rightXpath = model.rightxpath;
        var rightFactName = model.rightfactname;

        var defer = new $.Deferred();

        $.when(self.controller.getXpathNavigatorModel({ context: leftXpath }),
               self.controller.getXpathNavigatorModel({ context: rightXpath }))
        .done(function (leftModel, rightModel) {
            var leftData = leftModel.getNodeByXpath(leffFactName);
            model.leftfactname = bizagi.editor.utilities.buildComplexXpath(leftData.xpath, leftData.contextScope, leftData.isScopeAttribute, leftData.guidRelatedEntity);

            if (rightFactName) {
                var rightData = rightModel.getNodeByXpath(rightFactName);
                model.rightfactname = bizagi.editor.utilities.buildComplexXpath(rightData.xpath, rightData.contextScope, rightData.isScopeAttribute, rightData.guidRelatedEntity);
            }

            defer.resolve();
        });

        return defer.promise();
    }

})
