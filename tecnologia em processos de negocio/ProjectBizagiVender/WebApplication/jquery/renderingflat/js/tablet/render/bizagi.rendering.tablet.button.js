/*
*   Name: BizAgi Tablet Render Button Extension
*   Author: Bizagi Bizagi Team
*   Comments:
*   -   This script will redefine the button render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.button.extend("bizagi.rendering.button", {}, {
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function() {
        var self = this;
        var control = self.getControl();
        var button = $(":button", control);

        // Stylize button
        button.button();
        button.removeClass("ui-state-default");

        // Bind event
        button.click(function() {
            // Process button actions
            self.processButton();
        });
    },

    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function() {
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
    processButton: function() {
        var self = this;
        var properties = self.properties;

        if (properties.editable) {

            // Check if action need conformation
            if (properties.needsUserConfirmation) {
                $.when(bizagi.showConfirmationBox(properties.userConfirmationMessage, "Bizagi", "warning"))
                    .done(function() {
                        // Trigger change
                        self.triggerRenderChange({ pressed: true });
                    });
            } else if (!properties.preventDefault) {
                self.runButtonAction();
            }

            // Trigger change
            self.triggerRenderChange({ pressed: true });
        }
    },

    runButtonAction: function() {
        var self = this;

        // Save the form prior opening the dialog
        self.getFormContainer().clearValidationMessages();

        self.saveForm().pipe(function() {
            return self.executeButton();
        }).done(function(result) {
            if (result == null || result == true || result.result == "success" || result.type == "success") {
                return self.refreshForm();
            } else if (result.type == "validationMessages") {
                try {
                    // Add validation messages 
                    self.getFormContainer().addValidationMessage(result.messages);
                } catch (e) {
                    bizagi.showMessageBox(result.messages, "Error");
                }
            }
        }).fail(function(a, b, message) {
            // Add error messages 
            try {
                self.getFormContainer().addErrorMessage(message);
            } catch (e) {
                bizagi.showMessageBox(message, "Error");
            }
        });
    },

    // rewrite method to prevent the button on the tablet be affected when customizing on other platforms
    processLayout: function() {
        var self = this;
        var properties = self.properties;
        var visible = properties.visible != undefined ? bizagi.util.parseBoolean(properties.visible) : true;

        // Set required and visiblity
        properties.required = properties.required != undefined ? bizagi.util.parseBoolean(properties.required) : false;

        if (properties.required) {
            self.changeRequired(properties.required);
        }

        if (!visible) {
            self.changeVisibility(visible);
        }
    }

});
