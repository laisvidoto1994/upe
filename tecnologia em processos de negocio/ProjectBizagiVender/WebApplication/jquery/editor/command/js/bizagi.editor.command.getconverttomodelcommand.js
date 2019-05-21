
/*
*   Name: BizAgi FormModeler Editor Get ConvertTo Model Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will retrieve the convertTo model for a desired element
*
*   Arguments
*   -   guid
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getConvertToModelCommand", {

    renderTypeMapping: {
        "text": "string",
        "currency": "number",
        "float": "number",
        "attachment": "upload",
        "entity-master": ["combo", "formlink", "list", "search", "radio", "suggest", "searchsuggest", "searchcombo", "entitytemplate", "actionlauncher"],
        "entity-stakeholder": ["combo", "formlink", "list", "search", "radio", "suggest", "searchsuggest", "searchcombo", "entitytemplate", "actionlauncher"],
        "entity-system": ["combo", "formlink", "list", "search", "radio", "suggest", "searchsuggest", "searchcombo", "entitytemplate", "actionlauncher"],
        "entity-parametric": ["cascadingcombo", "combo", "formlink", "list", "search", "radio", "suggest", "searchsuggest", "searchcombo", "entitytemplate", "actionlauncher"]
    },

    renderTypeOfflineMapping: {
        "currency": "number",
        "float": "number",
        "attachment": "upload",
        "entity-master": ["offlinecombo", "offlineradio", "offlinesuggest", "offlinelist"],
        "entity-stakeholder": ["offlinecombo", "offlineradio", "offlinesuggest", "offlinelist"],
        "entity-parametric": ["offlinecombo", "offlineradio", "offlinesuggest", "offlinelist"]
    },

    renderTypeQueryMapping: {
        "currency": "querynumber",
        "float": "querynumber",
        "entity-master": ["querycombo", "queryradio", "querysuggest", "querylist"],
        "entity-stakeholder": ["querycombo", "queryradio", "querysuggest", "querylist"],
        "entity-parametric": ["querycascadingcombo", "querycombo", "queryradio", "querysuggest", "querylist"]
    }
},
{

    /*
    *   Gets the element properties for a given element guid
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var defer = new $.Deferred();
        var element = self.model.getElement(args.guid);

        if (element) {
            var properties = element.properties;
            var xpath = properties["xpath"];
            self.model = element.getConvertToModel();
            args.result = self.model;
            if (xpath) {
                // Wait until the xpath navigator model is loaded
                var getXpathModel = (self.controller.isGridContext()) ? self.controller.getXpathNavigatorModelGrid() : self.controller.getXpathNavigatorModel();
                $.when(getXpathModel)
                .done(function (xpathNavigatorModel) {

                    // Check xpath sub-model
                    var xpathNode = xpathNavigatorModel.getNodeByXpath(bizagi.editor.utilities.resolveComplexXpath(xpath));
                    if (xpathNode) {
                        var type = xpathNode.getRenderType();
                        args.result = self.getModel(type);
                    }

                    // Resolve command
                    defer.resolve(true);
                });
            }
            else {
                // Resolve command
                defer.resolve(true);
            }
        }
        else {
            args.result = [];

            // Resolve command
            defer.resolve(true);
        }

        return defer.promise();
    },

    /*
    * Gets ConverTo Model
    */
    getModel: function (type) {
        var self = this;
        var model = self.model;
        type = self.resolveType(type);

        if ($.isArray(type)) {
            return $.grep(model, function (control, _) {
                return ($.inArray(control.controlName, type) >= 0);
            });
        }
        else {
            return $.grep(model, function (control, _) {
                return (control.controlName === type || ($.inArray(type, control.filterBy) >= 0));
            });
        }

    },

    /*
    * Match type
    */
    resolveType: function (type) {
        var self = this;

        var renderTypeMapping = (self.controller.isOfflineContext()) ? self.Class.renderTypeOfflineMapping :
                                (self.controller.isQueryFormContext()) ? self.Class.renderTypeQueryMapping :self.Class.renderTypeMapping;

        if (renderTypeMapping[type]) {

            var typeMap = renderTypeMapping[type];

            if (self.controller.isGridContext()) {
                if ($.isArray(typeMap)) {
                    typeMap = $.map(typeMap, function (item, _) { return "column" + item; });
                }
            }

            return typeMap;
        }

        return type;
    }
   
})

