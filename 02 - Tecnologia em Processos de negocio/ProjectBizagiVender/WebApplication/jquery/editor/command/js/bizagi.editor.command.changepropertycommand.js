/*
*   Name: BizAgi FormModeler Editor Change Property Command
*   Author: Alexander Mejia, Diego Parra (refactor)
*   Comments:
*   -   This script will define basic stuff for changepropertycommand
*
*   Arguments
*   -   guid
*   -   property
*   -   value
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.changePropertyCommand", {}, {

    /*
    *   Perform property change
    */
    execute: function () {
        var self = this;
        var args = self.arguments;

        if (!$.isArray(args.guids) && typeof args.guid === "string") {
            args.guids = [args.guid];
        }
        
        if (self.controller.getContext() !== 'template' &&
            !self.checksDependenciesInAV()) {
                return false;
        }
        

        // Save original value for redo
        if (!self.originalValue) { self.originalValue = {}; }

        for (var i = 0, l = args.guids.length; i < l; i++) {

            var guid = args.guids[i];
            var element = self.model.getElement(guid);


            if (!self.originalValue[guid]) {

                self.originalValue = self.originalValue || {};
                self.property = (args.exclusive) ? element.getExclusiveProperty(args.property) : args.property;
                self.originalValue[guid] = element.getProperty(self.property);
                args.canValidate = true;

                // If this command is executed after showing the localization editor, args.value is an object
                if (element.isLocalizableProperty(args.property)) {
                    args.value = (typeof args.value === "string") ? self.processLocalizableProperty(element, self.originalValue[guid]) : self.verifyFormat(args.value, element);
                }
            }

            // Perform change property
            element.assignProperty(args.property, args.value, args.exclusive);

            if (self.controller.isAdhocFormContext() && args.property === "displayName") {
                self.controller.executeCommand({ command: "changeProperty", guids: args.guids, property: "xpathAdhoc", value: args.newValue });                
            }

            if (args.property === "xpath") {
                self.controller.executeCommand({ command: "applyOverridesElement", element: element });
                args.refreshProperties = args.refreshProperties || element.properties.type == "number";
            }

            // Remove default display name cache
            if (args.removeDefaultDisplayName) { element.removeDefaultDisplayName(); }

            // If the property has a design value linked, then this command need to refresh the view
            if (element.hasDesignValue(self.arguments.property)) {
                self.arguments.refresh = true;
            }
        }



        // Check Dependencies
        if (self.hasDependencies(args.property)) {
            args.refreshProperties = true;
        }

        // Needs execute validations;
        if (args.validateForm && (element.isRequiredProperty(args.property) || element.isDependentProperty(args.property))) {
            self.controller.executeCommand({ command: "formValidations", validations: ["RequiredProperties", "RequiredDependentProperties", "SameXpath", "ElementsInContainers"], canRefresh: false });
            args.refreshProperties = true;
        }

        return true;
    },

    /*
    *   Undo property change
    */
    undo: function () {
        var self = this,
            args = self.arguments;

        for (var i = 0, l = args.guids.length; i < l; i++) {
            var guid = args.guids[i];
            var element = self.model.getElement(guid);

            // Perform change property
            element.assignProperty(self.property, self.originalValue[guid], args.exclusive);

            if (args.property === "xpath") {
                self.controller.executeCommand({ command: "applyOverridesElement", element: element });
            }
        }

        return true;
    },

    /*
    *   Check if a property needs to refresh the property box
    */
    hasDependencies: function (type) {
        //TODO: Find a way to check this with only the render definitions
        if (type == "typedinamic" || type == "allowdinamiclabel" || type == "multipleselection" || type == "allowactions" || type == "selecttemplate" || type == "ishorizontal" || type == "showtime" || type == "dateformat" || type == "rule" || type == "interface" || type == "allowadd" || type == "displayName" || type == "helptext" ||
            type == "allowedit" || type == "allowdecimals" || type == "advancedsearch.advancedsearch" || type == "newrecords.allownew" || type == "userconfirmation.needsuserconfirmation" ||
            type == "format" || type == "allowgenerate" || type == "delete.allowdelete" || type == "add.withform" || type == "allowdetail" || type == "buttonrule.rule" || type == "buttonrule.rule90" ||
            type == "buttonrule.interface" || type == "data.filter" || type == "buttonrule" || type == "add.allowadd" || type == "navigationform" || type == "add.addform" || type == "xpathActions" ||
            type == "inlineadd" || type == "add.withform" || type == "detail.withform" || type == "isextended" || type == "totalize.operation" || type == "edit.editform" || type == "data.sortattribute") {
            return true;
        }
        return false;
    },

    /*
    *  Sets value depending language
    */
    processLocalizableProperty: function (element, originalValue) {
        var self = this;
        var args = self.arguments;

        var language = bizagi.editorLanguage.key;
        var i18nObject;
        if (typeof (originalValue) == "string") {
            i18nObject = bizagi.editor.utilities.buildComplexLocalizable(originalValue, element.guid, args.property);

        } else {
            i18nObject = originalValue ? $.extend({}, self.verifyFormat(originalValue, element)) : { i18n: { "default": element.getDefaultLocalizableProperty(args.property), languages: {}, uri: element.guid.toString() + ":" + args.property} };
        }

        if (language === "default") { i18nObject["i18n"]["default"] = args.value; }
        else { i18nObject["i18n"]["languages"][language] = args.value; }

        return i18nObject;
    },

    /*
    * Check fortam i18n
    */
    verifyFormat: function (obj, element) {
        var self = this;
        var args = self.arguments;

        if (obj && obj["i18n"]) {
            // Check uri attribute
            if (!obj["i18n"]["uri"] || obj.i18n.uri.indexOf("undefined") >= 0) {
                obj["i18n"]["uri"] = args.guid + ":" + args.property;
            }

            // Check defaul value
            if (!obj["i18n"]["default"] || obj["i18n"]["default"].length === 0) {
                obj["i18n"]["default"] = element.getDefaultLocalizableProperty(args.property);
            }

            // Removes empty languages
            if (obj["i18n"]["languages"]) {
                var languages = {};
                for (var key in obj["i18n"]["languages"]) {
                    if (obj["i18n"]["languages"][key]) { languages[key] = obj["i18n"]["languages"][key]; }
                }
                obj["i18n"]["languages"] = languages;
            }
        }
        return obj;
    },

    /*
    * check if control is related in V&A
    */
    checksDependenciesInAV: function () {
        var self = this;
        var args = self.arguments;

        if (self.controller.hasEnableCommandsEditor() && args.property === "xpath") {
            var commandResult = self.resolveResult(self.controller.executeCommand({
                command: "searchDependencies",
                guids: args.guids
            }));
            if (!commandResult.result) { return false; }
        }

        return true;
    }

})


/*
* Extends to support tenplates
*/
bizagi.editor.changePropertyCommand.extend("bizagi.editor.changePropertyCommand", {}, {
    /*
   *   Perform property change
   */
    execute: function () {
        var self = this,        
            args = self.arguments,
            value = args.value,
            property = args.property;
     
        if (self.controller.isTemplateContext()) {
            var guid = args.guid || args.guids[0];
            var element = self.element = self.model.getElement(guid);

            if (!element || property == 'hide') {
                return self._super();
            }
          
            var properties = element.properties || {},
                type = properties.type || '';
         
            if (element.type == "layoutPlaceholder") {
                return self.processLayoutControl(guid);
            }
            
            if (property == 'xpath' && value == undefined) {
                if (type.search(/:image/ig) >= 0) {
                    return self._super();
                }
                return self.processLayoutControl(guid);
            }            
        }

        return self._super();                        
    },

    /*
    * Changes the layoutPlaceholder control with a valid control
    */
    processLayoutControl: function (guid) {
        var self = this,
            args = self.arguments,
            property = args.property;

        args.refreshProperties = true;

        if (property == 'displayName') {
            self.controller.executeCommand({
                command: "updateElement",
                renderType: 'label',
                property: property,
                value: bizagi.editor.utilities.buildComplexLocalizable(args.value, guid, 'displayName'),
                guid: guid,
                canUndo: false
            });
        }
        else if (property == 'xpath' || property == 'link') {
            var xpathModel = self.controller.getXpathNavigatorModel();
            var nodeInfo = xpathModel.getNodeByXpath(bizagi.editor.utilities.resolveComplexXpath(args.value));

            var renderType = (nodeInfo) ? nodeInfo.getRenderType() : 'layoutPlaceholder';
                            
            self.controller.executeCommand({
                command: "updateElement",
                renderType: renderType,
                property: 'xpath',
                value: args.value,
                guid: guid,
                canUndo: false
            });                            
        }
                       
        return true;
    },

    /*
    *   Undo property change
    */
    undo: function () {
        var self = this,
            args = self.arguments,
            property = args.property,
            value = args.value;
                   
        if ( self.controller.isTemplateContext()) {
            
            var properties = self.element.properties || {},
                type = properties.type || '';

            if (property == "hide") {
                return self._super();
            }

            if (self.element.type == 'layoutPlaceholder') {
                self.model.replaceElement(self.element.guid, self.element);
            }

            if (property == 'xpath' && value == undefined) {

                if (type.search(/:image/ig) >= 0) {
                    return self._super();
                }

                self.model.replaceElement(self.element.guid, self.element);
            }
            
            return true;
        }

        return self._super();        
    }
})