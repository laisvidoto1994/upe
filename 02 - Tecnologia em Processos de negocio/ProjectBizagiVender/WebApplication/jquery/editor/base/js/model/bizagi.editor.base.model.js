/*
*   Name: BizAgi FormModeler Editor Model
*   Author: Alexander Mejia, Diego Parra
*   Comments:
*   -   This script will define basic stuff for the main model
*/

bizagi.editor.observableClass.extend("bizagi.editor.model", {}, {

    /*
    *   Constructor, creates an instance for the element factory which will be used to create elements for the model
    */
    init: function (params) {
        var self = this;
        var definitions = params && params.definitions ? params.definitions : {};
        var editorLanguages = params.languages;

        self.context = params.context;
        self.isActivityForm = params.isActivityForm;
        self.hasOfflineForm = params.hasOfflineForm;
        self.isOfflineAsOnline = params.isOfflineAsOnline;

        self.flags = params.flags;

        // Call base
        this._super();

        // Creates a element factory based on the definitions
        self.elementFactory = new bizagi.editor.base.elementFactory({ definitions: definitions, controls: params.controls });

        // Creates an empty form
        var data = {
            contextentity: params.contextentity,
            scopedefinition: params.scopedefinition,
            isActivityForm: params.isActivityForm,
            version: params.version
        };

        // Create base element
        self.form = self.createFormElement(params.context, data);

        // Adds init form options to model 
        if (self.isInitForm()) {
            self.addInitFormOptionsToRibbon();
        }
        // Adds languajes to model
        if (editorLanguages && $.isArray(editorLanguages) && self.context != "adhocform") { self.addLanguagesToRibbonModel(editorLanguages); }

	
        if (params.isActivityForm && self.context == "form") { 
		    self.addCustomButtonsSwitchToRibbon();
		    self.addEmailOptionsToRibbonModel();
	     }

        // If the model is for a start form, add use offline option to ribbon
        if (self.context == "startform" && self.flags["UseOfflineForms"]) {
            self.addUseOfflineFormSwitchToRibbon();
        }
    },

    /*
    * Returns true if the form is offline or startform
    */
    isInitForm: function () {
        var self = this;

        return (self.context == "offlineform" || self.context == "startform");
    },

    /*
    *   Checks if the current model actually is an activityForm
    */
    checkActivityForm: function () {
        var self = this;

        return bizagi.util.parseBoolean(self.isActivityForm) == true;
    },


    /*
    *   Checks if the current model actually has a offlineform
    */
    checkOfflineForm: function () {
        var self = this;

        return bizagi.util.parseBoolean(self.hasOfflineForm);
    },

    /*
    *   Checks if the current model actually use the offline form as online form
    */
    checkOfflineAsOnline: function () {
        var self = this;

        return bizagi.util.parseBoolean(self.isOfflineAsOnline);
    },

    /*
    * Updates value of offlineAsOnline flag
    */
    updateOfflineAsOnline: function (value) {
        var self = this;

        self.isOfflineAsOnline = value;
    },

    /*
    *   Create form element
    */
    createFormElement: function (context, data) {
        var self = this;
        var form;

        context = context || "form";

        // Create element
        form = self.createElement(context, data);

        // Create default buttons
        if (self.isActivityForm) {
            form.createDefaultButtons();
        }


        // Add ready handler
        form.subscribe("refresh", function (event, args) { self.publish("refresh", args); });
        form.subscribe("getDefaultDisplayName", function (ev, args) { return self.publish("getDefaultDisplayName", args); });
        form.subscribe("getContextXpath", function (ev, args) { return self.publish("getContextXpath", args); });
        form.subscribe("getNodeInfo", function (ev, args) { return self.publish("getNodeInfo", args); });
        form.subscribe("findXpathAttributes", function (ev, args) { return self.publish("findXpathAttributes", args); });
        form.subscribe("resizeHeigthCanvas", function (event, args) { self.publish("resizeHeigthCanvas", args); });
        form.subscribe("isReadOnlyForm", function (event, args) { return self.publish("isReadOnlyForm", args); });
        form.subscribe("getContextEntityType", function (ev, args) { return self.publish("getContextEntityType", args); });
        form.subscribe("getControllerInfo", function (ev, args) { return self.publish("getControllerInfo", args); });
        form.subscribe("refreshElement", function (ev, args) { return self.publish("refreshElement", args); });
        form.subscribe("formIsLoaded", function (ev, args) { return self.publish("formIsLoaded", args); });

        return form;
    },

    /*  
    *   Creates a default metadata for buttons [SAVE - NEXT]
    */
    createDefaultButtons: function (parent) {
        var self = this;

        var buttons = [];
        var saveButtonGuid = Math.guid();
        var saveButton = self.createElement("formbutton", {
            guid: saveButtonGuid,
            properties: {
                caption: bizagi.editor.utilities.buildComplexLocalizable(bizagi.localization.getResource("render-form-button-save"), saveButtonGuid, "caption"),
                actions: ["submitData", "refresh"]
            }
        });

        saveButton.setParent(parent);

        var nextButtonGuid = Math.guid();
        var nextButton = self.createElement("formbutton", {
            guid: nextButtonGuid,
            properties: {
                caption: bizagi.editor.utilities.buildComplexLocalizable(bizagi.localization.getResource("render-form-button-next"), nextButtonGuid, "caption"),
                actions: ["validate", "submitData", "next"]
            }
        });

        nextButton.setParent(parent);

        buttons.push(saveButton);
        buttons.push(nextButton);

        return buttons;
    },

    /*
    *   Get form instancde
    */
    getForm: function () {
        return this.form;
    },

    /*
    *   Create layout element
    */
    createLayoutElement: function (definition) {
        var self = this;
        var container = self.createElement("horizontal");

        for (var i = 0, l = definition.childrens.length; i < l; i = i + 1) {
            var child = self.createChildElement(definition.childrens[i]);
            container.addElement(child);
        }

        return container;
    },


    /*
    *  creates child for a control layout
    */
    createChildElement: function (child) {
        var self = this;

        var childProperties = $.extend(child.properties, { type: child.type });
        return self.createElement(child.type, { properties: childProperties });
    },

    /*
    *   Loads an entire model from the persistence model
    */
    loadModel: function (context, data) {
        var self = this;

        // Create model
        self.form = self.createElement(context, data);

        // Create default buttons
        if (self.isActivityForm && self.form.buttons.length == 0) {
            self.form.createDefaultButtons();
        }

        // Add ready handler
        self.form.subscribe("refresh", function (event, args) { self.publish("refresh", args); });
        self.form.subscribe("getDefaultDisplayName", function (ev, args) { return self.publish("getDefaultDisplayName", args); });
        self.form.subscribe("getContextXpath", function (ev, args) { return self.publish("getContextXpath", args); });
        self.form.subscribe("getNodeInfo", function (ev, args) { return self.publish("getNodeInfo", args); });
        self.form.subscribe("findXpathAttributes", function (ev, args) { return self.publish("findXpathAttributes", args); });
        self.form.subscribe("resizeHeigthCanvas", function (event, args) { self.publish("resizeHeigthCanvas", args); });
        self.form.subscribe("isReadOnlyForm", function (event, args) { return self.publish("isReadOnlyForm", args); });
        self.form.subscribe("getContextEntityType", function (ev, args) { return self.publish("getContextEntityType", args); });
        self.form.subscribe("getControllerInfo", function (ev, args) { return self.publish("getControllerInfo", args); });
        self.form.subscribe("refreshElement", function (ev, args) { return self.publish("refreshElement", args); });
        self.form.subscribe("formIsLoaded", function (ev, args) { return self.publish("formIsLoaded", args); });
    },

    /*
    *   Saves the entire model
    */
    saveModel: function () {

        return this.form.getPersistenceModel();
    },

    /*
    *   Creates an element using the element factory
    */
    createElement: function (name, data, regenerateGuid) {
        var self = this;
        return self.elementFactory.createElement(name, data, regenerateGuid);
    },

    /*
    *   Return the ribbon model data to be used in the form modeler 
    */
    getRibbonModelData: function () {
        var self = this

        if (self.context == "offlineform")
            return this.Class.ribbonModelDataOffline;
        else if (self.context == "template")
            return this.Class.ribbonModelTemplateData;
        else if (self.context == "adhocform")
            // TO FIX BUG WHERE LANGUAGES ARE BEING ADDED EVERY TIME THE FORM IS RENDERED
            return this.Class.ribbonModelAdhoc;
        else
            return this.Class.ribbonModelData;
    },

    /*
    *   Adds widgets loaded by demand
    */
    addWidgets: function (widgets) {
        var self = this;

        self.elementFactory.addWidgetsControls(widgets);
    },

    /*
    * Gets currents flags (turn on/off functionality)
    */
    getFlags: function () {
        return this.flags;
    },
    
    addEmailOptionsToRibbonModel: function () {
        var self = this;

        var ribbonModel = self.getRibbonModelData();

        var element = {
            caption: "formmodeler-component-ribbon-caption-email",
            css: "bz-studio bz-newSystemConfiguration_32x32_standard",
            hide: true,
            name: "email",
            elements: [
                { caption: "formmodeler-component-ribbon-caption-emailtemplate", style: "email-template", action: "emailTemplate", align: "vertical", disabled: "disabled", css: "bz-studio bz-newSystemConfiguration_32x32_standard" }
            ]
        };

        ribbonModel.elements.push(element);

    },

    /*
    * Adds init form options to ribbon
    */
    addInitFormOptionsToRibbon: function () {
        var self = this;

        var ribbonModel = self.getRibbonModelData();

        var element = {
            caption: (self.context == "offlineform") ? "formmodeler-component-ribbon-caption-initform-offline" : "formmodeler-component-ribbon-caption-initform-online",
            name: "initForm",
            hide: true,
            elements: [{
                caption: (self.context == "offlineform") ? "formmodeler-component-ribbon-initform-caption-setonline" : "formmodeler-component-ribbon-initform-caption-setoffline",
                style: (self.context == "offlineform") ? "online" : "offline",
                css: "bz-studio bz-forms-offline_16x16_standard",
                action: "switchForm",
                tooltip: "formmodeler-component-ribbon-offline-caption-designform-tooltip", 
                isButton: true
            }]
        };

        ribbonModel.elements.push(element);

    },

    /*
    *   Adds languages to ribbon model
    */
    addLanguagesToRibbonModel: function (languages) {
        var self = this;

        var ribbonModel = self.getRibbonModelData();

        // If the languages are already added, skip this step
        var ribbonLanguages = ribbonModel.elements.filter(function (e) { return e.name == "languages" });
        if (ribbonLanguages != null && ribbonLanguages.length > 0) return;

        var elements = [];

        // Add default option
        elements.push({
            caption: "formmodeler-component-ribbon-caption-default",
            style: "language",
            property: "language",
            css: "bz-studio bz-world_16x16_standard",
            action: "Language",
            value: { displayname: "default", IsRightToLeft: false, key: "default" }
        });

        for (var i = 0, l = languages.length; i < l; i += 1) {
            var value = JSON.parse(languages[i].value);

            elements.push({
                caption: value.displayname,
                style: value.displayname,
                property: "language",
                action: "Language",
                value: value
            });
        }

        var element = {
            caption: "formmodeler-component-ribbon-caption-languages",
            name: "languages",
            css: "bz-studio bz-world_16x16_standard",
            elements: [
                {
                    caption: "formmodeler-component-ribbon-caption-language", style: "language", property: "language", css: "bz-studio bz-world_16x16_standard",
                    elements: elements
                }

            ]
        };

        ribbonModel.elements.push(element);
    },

    /*
    *   If the model is for an activity form, add a nother button to the ribbon
    */
    addCustomButtonsSwitchToRibbon: function () {
        var self = this;

        var ribbonModel = self.getRibbonModelData();

        var element =
                {
                    caption: "formmodeler-component-ribbon-caption-useCustomButtons",
                    style: "validate",
                    action: "useCustomButtons",
                    disabled: "disabled",
                    css: "bz-studio bz-form-buttons_16x16_standard",
                    checked: false,
                    name: "customButtons"
                };

        for (var x = 0; x < ribbonModel.elements.length; x++) {

            if (ribbonModel.elements[x].caption == "formmodeler-component-ribbon-caption-show") {

                ribbonModel.elements[x].elements.push(element);
            }
        }
    },

    /*
    *   If the model is for a startform form, add a nother button to the ribbon
    */
    addUseOfflineFormSwitchToRibbon: function () {
        var self = this;

        var ribbonModel = self.getRibbonModelData();

        var element =
                {
                    caption: "formmodeler-component-ribbon-caption-useofflineform",
                    style: "validate",
                    action: "useOfflineForm",
                    css: "bz-studio bz-forms-offline_16x16_standard",
                    tooltip: "formmodeler-component-ribbon-offline-caption-useoffline-tooltip",
                    checked: false
                };

        for (var x = 0; x < ribbonModel.elements.length; x++) {

            if (ribbonModel.elements[x].caption == "formmodeler-component-ribbon-caption-show") {

                ribbonModel.elements[x].elements.push(element);
            }
        }
    }
});

// Extend model prototype to add a proxy to the form
for (var key in bizagi.editor.base.form.prototype) {
    if (key == "init" || key == "constructor" || key == "Class" || key == "subscribe" || key == "unsubscribe" || key == "publish"){
		continue;
	}

    bizagi.editor.model.prototype[key] = eval('var tmp = function(){ \n' +
		'if (this.getForm()){ \n' +
		'return this.getForm().' + key + '.apply(this.getForm(), arguments); \n' +
		'} \n' +
		'return null;};\n' +
		'tmp \n');
}


bizagi.editor.model.extend("bizagi.editor.model", {

    ribbonModelData:
    {
        elements: [
            {   caption: "formmodeler-component-ribbon-caption-form",
            name: "form",
            css: "bz-sprite-img bz-save_16x16_standard",
                elements: [
                    { caption: "formmodeler-component-ribbon-caption-undo", style: "undo", action: "undo", disabled: "disabled", css: "bz-studio bz-undo_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-redo", style: "redo", action: "redo", disabled: "disabled", css: "bz-studio bz-redo_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-checkout", style: "checkout", action: "checkout", align: "vertical", disabled: "disabled", css: "bz-studio bz-check-out_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-save", style: "save", action: "save", align: "vertical", disabled: "disabled", css: "bz-studio bz-save_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-copyfrom", style: "copy-from", action: "copy-from", align: "vertical", disabled: "disabled", css: "bz-studio bz-copy-form_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-copyformat", style: "copy-format", action: "copy-format", align: "vertical", disabled: "disabled", css: "bz-studio bz-copy-format_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-properties", style: "form-properties", action: "formproperties", align: "vertical", disabled: "disabled", css: "bz-studio bz-form-properties_32x32_standard" }
                ]
            },
            { caption: "formmodeler-component-ribbon-caption-show",
              name: "show",
              css: "bz-studio bz-warning_16x16_standard",
                elements: [
                     { caption: "formmodeler-component-ribbon-caption-validations", style: "validate", action: "validate", checked: false, css: "bz-studio bz-warning_16x16_standard" }
                ]
            },
            {
                caption: "formmodeler-component-ribbon-caption-validation",
                name: "validation",
                elements: [
                    { caption: "formmodeler-component-ribbon-caption-actionsvalidations", style: "actions-validations", action: "actionsvalidations", align: "vertical", disabled: "disabled", css: "bz-studio bz-actions-and-validations_32x32_standard" }

                ]
            },
            { caption: "formmodeler-component-ribbon-caption-element",
            name: "element",
            css: "bz-studio bz-save_16x16_standard",
                elements: [
                    { caption: "formmodeler-component-ribbon-caption-convertto", style: "convert-to", action: "convertto", disabled: "disabled", css: "bz-studio bz-convert-to_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-delete", style: "delete", action: "delete", disabled: "disabled", css: "bz-studio bz-delete_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-rename", style: "rename", action: "rename", disabled: "disabled", css: "bz-studio bz-rename_16x16_standard" },
                    {
                        caption: "formmodeler-component-ribbon-caption-visible", style: "visible", property: "visible", disabled: "disabled", css: "bz-studio bz-visible_16x16_standard",
                        elements: [
                            { caption: "formmodeler-component-ribbon-caption-true", style: "true", property: "visible", value: { "fixedvalue": "true" }, css: "bz-studio bz-yes-no_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-false", style: "false", property: "visible", value: { "fixedvalue": "false" }, css: "bz-studio bz-boolean-remove_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-expression", style: "expression", property: "visible", value: "expression", css: "bz-studio bz-expresion-ex_16x16_standard" }
                        ]
                    },
                        {
                            caption: "formmodeler-component-ribbon-caption-editable", style: "editable", property: "editable", disabled: "disabled", css: "bz-studio bz-editable_16x16_standard",
                        elements: [
                            { caption: "formmodeler-component-ribbon-caption-true", style: "true", property: "editable", value: { "fixedvalue": "true" }, css: "bz-studio bz-yes-no_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-false", style: "false", property: "editable", value: { "fixedvalue": "false" }, css: "bz-studio bz-boolean-remove_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-expression", style: "expression", property: "editable", value: "expression", css: "bz-studio bz-expresion-ex_16x16_standard" }
                        ]
                    },
                    {
                        caption: "formmodeler-component-ribbon-caption-required", style: "required", property: "required", disabled: "disabled", css: "bz-studio bz-required_16x16_standard",
                        elements: [
                            { caption: "formmodeler-component-ribbon-caption-true", style: "true", property: "required", value: { "fixedvalue": "true" }, css: "bz-studio bz-yes-no_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-false", style: "false", property: "required", value: { "fixedvalue": "false" }, css: "bz-studio bz-boolean-remove_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-expression", style: "expression", property: "required", value: "expression", css: "bz-studio bz-expresion-ex_16x16_standard" }
                        ]
                    }
                ]
            }
        ]
    },

    ribbonModelTemplateData:
    {
        elements: [
            {
                caption: "formmodeler-component-ribbon-caption-form",
                name: "form",
                elements: [
                    { caption: "formmodeler-component-ribbon-caption-undo", style: "undo", action: "undo", disabled: "disabled", css: "bz-studio bz-undo_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-redo", style: "redo", action: "redo", disabled: "disabled", css: "bz-studio bz-redo_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-checkout", style: "checkout", action: "checkout", align: "vertical", disabled: "disabled", css: "bz-studio bz-check-out_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-save", style: "save", action: "save", align: "vertical", disabled: "disabled", css: "bz-studio bz-save_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-copyformat", style: "copy-format", action: "copy-format", align: "vertical", disabled: "disabled", css: "bz-studio bz-copy-format_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-properties", style: "form-properties", action: "formproperties", align: "vertical", disabled: "disabled", css: "bz-studio bz-form-properties_32x32_standard" }
                ]
            },
            {
                caption: "formmodeler-component-ribbon-caption-show",
                name: "show",
                css: "bz-studio bz-warning_16x16_standard",
                elements: [
                     { caption: "formmodeler-component-ribbon-caption-validations", style: "validate", action: "validate", checked: false, css: "bz-studio bz-studio bz-warning_16x16_standard" }
                ]
            }
        ]
    },

    ribbonModelDataOffline:
    {
        elements: [
            { caption: "formmodeler-component-ribbon-caption-form",
                name: "form",
                elements: [
                    { caption: "formmodeler-component-ribbon-caption-undo", style: "undo", action: "undo", disabled: "disabled", css: "bz-studio bz-undo_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-redo", style: "redo", action: "redo", disabled: "disabled", css: "bz-studio bz-undo_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-checkout", style: "checkout", action: "checkout", align: "vertical", disabled: "disabled", css: "bz-studio bz-check-out_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-save", style: "save", action: "save", align: "vertical", disabled: "disabled", css: "bz-studio bz-save_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-copyformat", style: "copy-format", action: "copy-format", align: "vertical", disabled: "disabled", css: "bz-studio bz-copy-format_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-properties", style: "form-properties", action: "formproperties", align: "vertical", disabled: "disabled", css: "bz-studio bz-form-properties_32x32_standard" }
                ]
            },
            { caption: "formmodeler-component-ribbon-caption-show",
                name: "show",
                css: "bz-studio bz-warning_16x16_standard",
                elements: [
                     { caption: "formmodeler-component-ribbon-caption-validations", style: "validate", action: "validate", checked: false, css: "bz-studio bz-studio bz-warning_16x16_standard" }
                ]
            },
            { caption: "formmodeler-component-ribbon-caption-validation",
                name: "validation",
                elements: [
                    { caption: "formmodeler-component-ribbon-caption-actionsvalidations", style: "actions-validations", action: "actionsvalidations", align: "vertical", disabled: "disabled", css: "bz-studio bz-actions-and-validations_32x32_standard" }

                ]
            },
            { caption: "formmodeler-component-ribbon-caption-element",
                name: "element",
                css: "bz-studio bz-undo_16x16_standard",
                elements: [
                    { caption: "formmodeler-component-ribbon-caption-convertto", style: "convert-to", action: "convertto", disabled: "disabled", css: "bz-studio bz-convert-to_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-delete", style: "delete", action: "delete", disabled: "disabled", css: "bz-studio bz-delete_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-rename", style: "rename", action: "rename", disabled: "disabled", css: "bz-studio bz-rename_16x16_standard" },
                    {
                        caption: "formmodeler-component-ribbon-caption-visible", style: "visible", property: "visible", disabled: "disabled", css: "bz-studio bz-visible_16x16_standard",
                        elements: [
                            { caption: "formmodeler-component-ribbon-caption-true", style: "true", property: "visible", value: "true", css: "bz-studio bz-yes-no_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-false", style: "false", property: "visible", value: "false", css: "bz-studio bz-boolean-remove_16x16_standard" }
                        ]
                    },
                    {
                        caption: "formmodeler-component-ribbon-caption-editable", style: "editable", property: "editable", disabled: "disabled", css: "bz-studio bz-editable_16x16_standard",
                        elements: [
                            { caption: "formmodeler-component-ribbon-caption-true", style: "true", property: "editable", value: "true", css: "bz-studio bz-yes-no_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-false", style: "false", property: "editable", value: "false", css: "bz-studio bz-boolean-remove_16x16_standard" }
                        ]
                    },
                    {
                        caption: "formmodeler-component-ribbon-caption-required", style: "required", property: "required", disabled: "disabled", css: "bz-studio bz-required_16x16_standard",
                        elements: [
                            { caption: "formmodeler-component-ribbon-caption-true", style: "true", property: "required", value: "true", css: "bz-studio bz-yes-no_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-false", style: "false", property: "required", value: "false", css: "bz-studio bz-boolean-remove_16x16_standard" }
                        ]
                    }
                ]
            }

        ]
    },
    ribbonModelAdhoc:
    {
        elements: [
            {
                caption: "formmodeler-component-ribbon-caption-form",
                name: "form",
                elements: [
                    { caption: "formmodeler-component-ribbon-caption-undo", style: "undo", action: "undo", disabled: "disabled", css: "bz-studio bz-undo_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-redo", style: "redo", action: "redo", disabled: "disabled", css: "bz-studio bz-redo_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-save", style: "save", action: "save", align: "vertical", disabled: "disabled", css: "bz-studio bz-save_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-copyformat", style: "copy-format", action: "copy-format", align: "vertical", disabled: "disabled", css: "bz-studio bz-copy-format_32x32_standard" },
                    { caption: "formmodeler-component-ribbon-caption-properties", style: "form-properties", action: "formproperties", align: "vertical", disabled: "disabled", css: "bz-studio bz-form-properties_32x32_standard" }
                ]
            },
            {
                caption: "formmodeler-component-ribbon-caption-show",
                name: "show",
                css: "bz-studio bz-warning_16x16_standard",
                elements: [
                     { caption: "formmodeler-component-ribbon-caption-validations", style: "validate", action: "validate", checked: false, css: "bz-studio bz-studio bz-warning_16x16_standard" }
                ]
            },
            {
                caption: "formmodeler-component-ribbon-caption-element",
                name: "element",
                css: "bz-studio bz-undo_16x16_standard",
                elements: [
                    { caption: "formmodeler-component-ribbon-caption-delete", style: "delete", action: "delete", disabled: "disabled", css: "bz-studio bz-delete_16x16_standard" },
                    { caption: "formmodeler-component-ribbon-caption-rename", style: "rename", action: "rename", disabled: "disabled", css: "bz-studio bz-rename_16x16_standard" },
                    {
                        caption: "formmodeler-component-ribbon-caption-visible", style: "visible", property: "visible", disabled: "disabled", css: "bz-studio bz-visible_16x16_standard",
                        elements: [
                            { caption: "formmodeler-component-ribbon-caption-true", style: "true", property: "visible", value: "true", css: "bz-studio bz-yes-no_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-false", style: "false", property: "visible", value: "false", css: "bz-studio bz-boolean-remove_16x16_standard" }
                        ]
                    },
                    {
                        caption: "formmodeler-component-ribbon-caption-editable", style: "editable", property: "editable", disabled: "disabled", css: "bz-studio bz-editable_16x16_standard",
                        elements: [
                            { caption: "formmodeler-component-ribbon-caption-true", style: "true", property: "editable", value: "true", css: "bz-studio bz-yes-no_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-false", style: "false", property: "editable", value: "false", css: "bz-studio bz-boolean-remove_16x16_standard" }
                        ]
                    },
                    {
                        caption: "formmodeler-component-ribbon-caption-required", style: "required", property: "required", disabled: "disabled", css: "bz-studio bz-required_16x16_standard",
                        elements: [
                            { caption: "formmodeler-component-ribbon-caption-true", style: "true", property: "required", value: "true", css: "bz-studio bz-yes-no_16x16_standard" },
                            { caption: "formmodeler-component-ribbon-caption-false", style: "false", property: "required", value: "false", css: "bz-studio bz-boolean-remove_16x16_standard" }
                        ]
                    }
                ]
            }

        ]
    }

}, {});


