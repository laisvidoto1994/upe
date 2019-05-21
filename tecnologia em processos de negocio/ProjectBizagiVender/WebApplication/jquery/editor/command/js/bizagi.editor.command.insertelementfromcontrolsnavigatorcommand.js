
/*
*   Name: BizAgi FormModeler Editor Insert Element From Controls Navigator Command
*   Author: Alexander Mejia, Diego Parra (refactor)
*   Comments:
*   -   This script will define basic stuff for insertelementfromcontrolsnavigatorcommand
*
*   COMMAND ARGUMENTS
*
*   - position
*   - parent
*   - data
*       -   name
*       -   displayName
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.insertElementFromControlsNavigatorCommand", {
    map: {
        "querycascadingcombo": "cascadingcombo",
        "columnsearchlist": "searchlist"
    }
}, {

    /*
    *   Validate each argument, can be overriden in order to apply further validations in each command implementation
    */
    validateArguments: function () {
        var self = this;

        if (self.arguments.data === undefined || self.arguments.data.name === undefined) {
            return false;
        }

        return true;
    },

    /*
    *   Inserts the control element in the model
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var control = args.data.name;

        // Validate arguments
        if (!self.validateArguments()) { return false; }

        var useWizard = false;
        if (self.needsWizard(control)) {
            useWizard = true;
            if (!self.precondition)
                self.precondition = self.controller.publish("showControlWizard", {
                    control: self.Class.map[control] || control
                });
        }

        // After precondition is evaluated (can be async), the result is processed
        // This command returns an async result
        return $.when(self.precondition)
                .pipe(function (result) {
                    if (useWizard) {
                        // This code processes wizard response
                        if (result.success === undefined || result.success == false) return true;

                        // Process wizard result for each control
                        return self.processWizardResult(control, result);
                    }

                    // Perform normal insert element
                    self.insertElement(args, control);
                    return true;
                });
    },

    /*
    *   Insert element in a container
    */
    insertElement: function (args, control) {
        var self = this;

        if (!args.element) {
            // Create a new element if none has been provided
            args.element = self.createElement({
                type: control
            });

            if (!args.element.isVisualProperty("xpath") || self.needsDisplayName(control)) {
                args.element.properties.displayName = bizagi.editor.utilities.buildComplexLocalizable(args.data.displayName, args.element.guid, "displayName");
                if (self.model.context == "adhocform") {
                    args.element.properties.displayName = args.element.properties.displayName.i18n.default;
                }
            }

            if (self.model.context == "adhocform" || self.model.context == "adhocgrid") {
                self.setXpathAdhoc(args.element);
            }

            args.canValidate = true;

            // Validate if it is a special element to perform "special" stuff
            self.isSpecialElement(self.arguments.data.name, args.element);
            self.parent = args.parent || self.controller.getContextInfo().guid;
        }

        // Execute insert element command
        self.controller.executeCommand({
            command: "insertElement",
            position: args.position,
            parent: self.parent,
            element: args.element,
            canUndo: false
        });

        self.controller.setLastInsertedElement(args.element.guid);
    },

    /*
    *  Check if an element type needs displayName 
    */
    needsDisplayName: function (type) {
        if (type === "link" || type === "formlink" || type === "columnformlink" ||
            type === "columnlink" || type === "") {
            return true;
        }

        return false;
    },

    /*
    *   Undo element creation
    */
    undo: function () {
        var self = this,
            args = self.arguments;

        // Execute remove element command
        var commandResult = self.controller.executeCommand({
            command: "removeElementById",
            position: args.position,
            parent: self.parent,
            element: args.element,
            guid: args.element.guid,
            searchformresult: args.searchformresult,
            canUndo: false
        });

        commandResult = self.resolveResult(commandResult);
        if (commandResult.error) { return false; }

        return true;
    },

    /*
    *   Check if an element type needs a wizard or not before being inserted
    */
    needsWizard: function (type) {
        if (type == "cascadingcombo") {
            return true;
        }
        if (type == "association") {
            return true;
        }
        if (type == "querycascadingcombo") {
            return true;
        }
        if (type == "searchlist") {
            return true;
        }
        if (type == "columnsearchlist") {
            return true;
        }

        return false;
    },

    /*
    *   Process each wizard result
    */
    processWizardResult: function (control, result) {
        var self = this;
        if (control == "cascadingcombo") {
            return self.processCascadingCombo(control, result);
        }
        if (control == "querycascadingcombo") {
            return self.processCascadingCombo(control, result);
        }
        if (control == "association") {
            return self.processMultipleRelation(control, result);
        }
        if (control == "searchlist") {
            return self.processMultipleRelation(control, result);
        }
        if (control == "columnsearchlist") {
            return self.processMultipleRelation(control, result);
        }
    },

    /*
    *   Process the cascading combo control special case
    */
    processCascadingCombo: function (control, result) {
        var self = this;
        var args = self.arguments;
        var parent = args.parent || self.controller.getContextInfo().guid;

        // Create protocol
        var getParentEntities = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getparententities", id: result.guidRelatedEntity, xpath: result.xpath });

        // Execute protocol
        return $.when(getParentEntities.processRequest())
            .pipe(function (entities) {

                // Check that the selected entity has set a parent entity
                if (entities.length < 2) {
                    var message = bizagi.localization.getResource("bizagi-editor-form-validation-cascadingcombo");
                    bizagi.showMessageBox(message, "Bizagi", "error", false);
                    return true;
                }

                // Process result, create an element for each array entry
                var lastControlGuid;
                var lastElement;
                self.cascadingComboElement = {};
                $.each(entities, function (i, entity) {

                    if (!self.cascadingComboElement[i]) {
                        // Create a new element if none has been provided
                        args.element = self.createElement({
                            type: control,
                            xpath: bizagi.editor.utilities.buildComplexXpath(entity.xpath, result.contextEntity, false, entity.guid),
                            parentcombo: lastControlGuid,
                            parentrelation: (entity.parentRelation ? bizagi.editor.utilities.buildComplexXpath(entity.parentRelation, entity.id, false, entity.parentEntity) : undefined)
                        });

                        self.cascadingComboElement[i] = args.element;
                    }
                    else { args.element = self.cascadingComboElement[i]; }

                    // Execute insert element command
                    self.controller.executeCommand({
                        command: "insertElement",
                        parent: parent,
                        element: args.element,
                        position: args.position + i,
                        canUndo: false
                    });

                    // Relate child combo to make deletion easy
                    if (lastElement != null) {
                        lastElement.setProperty("childcombo", args.element.guid);
                    }

                    // Save last control guid
                    lastControlGuid = args.element.guid;
                    lastElement = self.model.getElement(lastControlGuid);
                });

                return true;
            });

        return false;
    },

    /*
    *  Process the association control special case
    */
    processMultipleRelation: function (control, result) {
        var self = this;
        var args = self.arguments;
        var model = result.model;

        bizagi.log('model is;' ,model);

        var parent = args.parent || self.controller.getContextInfo().guid;
        var leftXpath = model.leftxpath;
        var factXpath = bizagi.clone(leftXpath);
        var baXpath = factXpath.xpath.baxpath;
        baXpath.xpath = baXpath.xpath + "." + model.factxpath;
        model.xpath = factXpath;
        model.type = control;

        return $.when(self.getFactNames(model))
            .pipe(function () {

                bizagi.log("ASSOCIATION MODEL", model);
                // Create a association element
                args.element = self.createElement(model);

                if (control == "searchlist") args.element.properties.displayName = bizagi.editor.utilities.buildComplexLocalizable(model.factxpath, args.element.guid, "displayName");

                // Execute insert element command
                self.controller.executeCommand({
                    command: "insertElement",
                    parent: parent,
                    element: args.element,
                    position: args.position,
                    canUndo: false
                });

                return true;
            });
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
