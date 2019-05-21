/*
*   Name: BizAgi Desktop Render Button Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the button render class to adjust to desktop devices
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

        if (typeof (Windows) != "undefined") {
            $(control.find("input")).addClass("ui-button-windows8");
        } else {
            $(control.find("input")).addClass("ui-button-desktop-ellipsis");
            $(control.find("input")).attr("title", $(control.find("input")).val());
        }
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();
        var button = $(":button", control);

        // Call base
        self._super();

        // Bind event
        button.on("click", function () {
            //disable button to avoid multiple clicks
            $("input", self.element).attr("disabled", true);

            // Process button actions
            self.processButton();

            setTimeout(function () {
                //allow button to be clickeable again
                $("input", self.element).removeAttr("disabled");
            }, 1500);
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
                var htmlMessage = $("<div>").append(properties.userConfirmationMessage);
                var defer = $.Deferred();

                $(htmlMessage).dialog({
                    modal: true,
                    width: 500,
                    height: 250,
                    draggable: false,
                    resizable: true,
                    maximize: false,
                    title: properties.caption || properties.displayName,
                    buttons: [{
                        text: bizagi.localization.getResource("confirmation-box-ok"),
                        click: function () {
                            defer.resolve();
                            self.triggerRenderChange({ pressed: true });
                            $(this).dialog("close");
                        }
                    }, {
                        text: bizagi.localization.getResource("confirmation-box-cancel"),
                        click: function () {
                            defer.reject();
                            $(this).dialog("close");
                        }
                    }]
                });

                if (!properties.preventDefault) {
                    $.when(defer.promise()).done(function () {
                        self.runButtonAction();
                    });
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
    }
});
