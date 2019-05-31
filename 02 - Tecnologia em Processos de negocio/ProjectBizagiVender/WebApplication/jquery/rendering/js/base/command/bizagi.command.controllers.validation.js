/*
*   Name: BizAgi Rendering Validation controller 
*   Author: Diego Parra
*   Comments:
*   -   This script will parse and execute all the validations defined for the form
*/

bizagi.command.controllers.controller.extend("bizagi.command.controllers.validation", {}, {

    /* 
    *   Constructor
    */
    init: function (form, validations, mainForm) {
        var self = this;

        // Enable evalValidation function with console log trace
        self.enableDebug = false;

        // Call base
        this._super(form);

        var container = mainForm != undefined ? mainForm.container : form.container;

        var validationBox = $('<div />').appendTo(container);

        // Apply plugin
        validationBox.bizagi_notifications({
            itemIcon: "ui-icon-circle-close",
            minimized: false,
            clearEnabled: false,
            title: form.getResource("render-form-validations-header-text"),
            device: bizagi.util.detectDevice(),
            orientation: form.properties.orientation

        });

        // Bind click
        validationBox.bind("itemClick", function (e, ui) {
            self.onNotificationClick(ui.data);
        });

        // Build validations
        if (validations)
            self.buildValidations(validations);

        // Keep references
        self.validationBox = validationBox;
        self.validations = validations || [];
    },


    /* 
    *   Method to incorporate automatic validation rules 
    */
    buildValidations: function (validations) {
        var self = this;

        var fnValidations = self.buildAllValidations(validations);
        self.form.bind("rendervalidate", function () {
            return fnValidations(self);
        });
    },

    /* 
    *   Method to add a simple error message in the validation box
    */
    showErrorMessage: function (message) {
        bizagi.showErrorAlertDialog = false;
        this.showValidationMessage(message, null, "ui-icon-circle-close", "ui-state-error");
    },

    /* 
    *   Method to add a simple alert message in the validation box
    */
    showAlertMessage: function (message) {
        this.showValidationMessage(message, null, "ui-icon-alert", "ui-state-highlight");
    },

    /* 
    *   Method to add a simple info message in the validation box
    */
    showInfoMessage: function (message) {
        this.showValidationMessage(message, null, "ui-icon-info", "ui-state-highlight");
    },

    /* 
    *   Method to add a simple validation message in the validation box
    */
    showValidationMessage: function (message, focus, icon, itemAdditionalClass) {
        var self = this;
        var form = self.form;
        var render = focus ? form.getRender(focus) : null;

        bizagi.showErrorAlertDialog = false;

        // Method to perform validations after the render has been changed, or the notifications has been clicked
        var performValidationFn = function () {
            // First hide and clear validation box
            self.clearValidationMessages();

            // Run validations
            self.validating = true;
            self.performValidations();
            self.validating = false;

            // Attempt to hide if there are no validations
            if (self.countValidationMessages() == 0) {
                self.hideValidationMessages();
            }
        };

        // Add message
        self.validationBox.bizagi_notifications("addNotification", message, focus, icon, itemAdditionalClass, performValidationFn);

        if (render) {
            // Add error message to render
            render.setValidationMessage(message);

            if (!bizagi.util.isIE8()) {
                
                // Bind event when render change
                if (!self.validating) render.one("rendervalidate", performValidationFn);
            }
        }
    },

    /*
    *   Count the number of validation messages
    */
    countValidationMessages: function () {
        var self = this;
        return self.validationBox.bizagi_notifications("count");
    },

    /*
    *   Remove all the validations
    */
    clearValidationMessages: function () {
        var self = this;
        var validationsBoxes = $(".ui-bizagi-notifications-container", "body").not(".ui-bizagi-log-container");

        return validationsBoxes.bizagi_notifications("clearAll");
    },

    /*
    *   Hide the validation notifications box
    */
    hideValidationMessages: function () {
        var self = this;
        return self.validationBox.bizagi_notifications("hide");
    },

    /*
    *   Show the validation notifications box
    */
    showValidationMessages: function () {
        var self = this;
        return self.validationBox.bizagi_notifications("show");
    },

    /*
    *   Expand the notification box
    */
    expandNotificationBox: function (autofocus) {
        var self = this;
        // Select first error and expand notifications
        if (autofocus !== false) {
            self.validationBox.bizagi_notifications("autoFocusFirstError");
        }
        return self.validationBox.bizagi_notifications("expand");
    },

    /*
    *   Run all validation rules in the form container
    */
    performValidations: function () {
        var self = this;

        // First hide and clear validation box
        self.clearValidationMessages();
        self.validationBox.bizagi_notifications("initBatch");

        // Run render validations
        var bRendersValid = self.validateRenders();

        // Run form validations
        var bFormValid = self.validations.length > 0 ? self.form.triggerHandler("rendervalidate") : true;
        self.validationBox.bizagi_notifications("endBatch");

        // Show validations if invalid
        if (!bFormValid || !bRendersValid) {
            self.validationBox.bizagi_notifications("show");
            return false;
        }

        return true;
    },

    /* PRIVATE METHODS */

    /*  
    *   Construct validations javascript rules
    */
    buildAllValidations: function (validations) {
        var self = this;
        var sJSCode = "";

        for (var i = 0; i < validations.length; i++) {

            var isEnabled = (validations[i].enabled != undefined ) ? validations[i].enabled : true;
            if (isEnabled)
            {
                // If validation is not "valid" we can omit that instruction
                try { sJSCode += self.buildValidation(validations[i].conditions, validations[i].validationCommand); } catch (e) {
                    if (e.message != "RenderNotFoundException") {
                        bizagi.logError("Validation cannot be parsed: " + e.message, validations[i]);
                    }
                }
            }
        }

        // Build final function
        var sStatement = "var baTmpFn = function(self){\r\n var bValid = true;\r\n " + sJSCode + "\r\n return bValid;}; baTmpFn";

        // Return interpreted function
        return self.evalValidation(sStatement);
    },

    /*
    *   Build a single javascript validation rule
    */
    buildValidation: function (conditions, validationCommand) {
        var self = this;
        var sJsCondition = "";
        var sJsValidation = "";

        // Detect grid references
        var gridReference = self.searchForGridReference(conditions);
        var bGridDetected = (gridReference != null);

        // Build Conditions
        sJsCondition += "( " + self.buildConditions(conditions, bGridDetected, true) + " )";

        // Fix message for quotes and break lines
        validationCommand.message = validationCommand.message.replace(/'/g, "\\'");
        validationCommand.message = validationCommand.message.replace(/\n/g, " ");
        
        // Build Message
        var focus = validationCommand.focus || "";
        if (bGridDetected) focus = gridReference;
        if (validationCommand.tokens)
            sJsValidation += "self.showValidationMessage(' " + validationCommand.message + "', '" + focus + "', JSON.parse('" + JSON.encode(validationCommand.tokens) + "')); bValid = false;\r\n";
        else
            sJsValidation += "self.showValidationMessage(' " + validationCommand.message + "', '" + focus + "'); bValid = false;\r\n";

        // Build final statement
        if (!bGridDetected) {


            return "if (" + sJsCondition + "){\r\n " + sJsValidation + " \r\n}";
        } else {
            var sGridStatement = "var grid = self.form.getRender('" + gridReference + "');\r\n";
            sGridStatement += "if(grid === null) return true;\r\n";
            sGridStatement += "var data = grid.getIndexes();\r\n";
            sGridStatement += "var bGridValid = true;\r\n";
            sGridStatement += "$.each(data, function(_, i) {\r\n";
            sGridStatement += "if (" + sJsCondition + "){\r\n bGridValid = false; \r\n}";
            sGridStatement += "});\r\n";
            sGridStatement += "if (bGridValid == false){\r\n " + sJsValidation + "\r\n}";
            return sGridStatement;
        }
    },

    /* 
    *   Method triggered when the validation item has been clicked
    */
    onNotificationClick: function (focus) {
        var self = this;
        var form = self.form;

        if (focus) {
            var render = form.getRender(focus);
            if (render) {
                render.focus();
            }
        }
    },

    /* 
    *   Method to loop
    */
    validateRenders: function () {
        var self = this;
        var invalidElements = [];

        // Do a check
        var bValid = self.form.isValid(invalidElements);
        if (!bValid) {
            for (var i = 0; i < invalidElements.length; i++) {
                self.showValidationMessage(invalidElements[i].message, invalidElements[i].xpath);
            }
        }

        return bValid;
    },

    /*
    *	Eval validation string, for debug purposes
    */
    evalValidation: function (command) {
        var self = this;

        if (self.enableDebug && console != undefined) {
            console.log(command);
        }

        return eval(command);
    }
});
