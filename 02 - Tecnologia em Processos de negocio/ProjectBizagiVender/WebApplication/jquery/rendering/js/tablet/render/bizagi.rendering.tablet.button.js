/*
*   Name: BizAgi Tablet Render Button Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the button render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.button.extend("bizagi.rendering.button", {}, {
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        var button = $(":button", control);

        // Stylize button
        button.button();
        button.removeClass("ui-state-default");
        // Bind event
        button.click(function () {
            // Process button actions
            self.processButton();
        });
    },



    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();

        // Execute the same as post-render
        self.postRender();

        // Set as disabled
        var button = $(":button", control);
        button.button("option", "disabled", "true");
    },
    /*
    *   Process the button actions workflow
    */
    processButton: function () {
        var self = this;
        var properties = self.properties;

        if (properties.editable) {
            // Check if action need conformation
            if (properties.needsUserConfirmation) {
                var result = window.confirm(properties.userConfirmationMessage);

                if (result == true) {
                    // Trigger change
                    self.triggerRenderChange({ pressed: true });
                    self.runButtonAction();
                }

            } else {
                if (!properties.preventDefault) {
                    self.runButtonAction();
                }

                // Trigger change
                self.triggerRenderChange({ pressed: true });
            }

        } 
    },

    runButtonAction: function () {
        var self = this;
        // Save the form prior opening the dialog
        self.getFormContainer().clearValidationMessages();
        self.saveForm().pipe(function () {
            return self.executeButton();
        }).done(function (result) {
            if (result == null || result == true || result.result == "success" || result.type == "success") {
                return self.refreshForm();
            } else if (result.type == "validationMessages") {
                // Add validation messages 
                self.getFormContainer().addValidationMessage(result.messages);
            }
        }).fail(function (a, b, message) {
            // Add error messages 
            self.getFormContainer().addErrorMessage(message);
        });
    },

    // rewrite method to prevent the button on the tablet be affected when customizing on other platforms

    processLayout: function () {
        var self = this;
        var properties = self.properties;

        
        // Set required and visiblity
        properties.required = properties.required != undefined ? bizagi.util.parseBoolean(properties.required) : false;
        var visible = properties.visible != undefined ? bizagi.util.parseBoolean(properties.visible) : true;
        if (properties.required) {
            self.changeRequired(properties.required);
        }
        if (!visible) {
            self.changeVisibility(visible);
        }
    }

});
