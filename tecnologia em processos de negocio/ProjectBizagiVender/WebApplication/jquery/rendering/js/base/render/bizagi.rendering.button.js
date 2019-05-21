/*
 *   Name: BizAgi Render Button Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define basic stuff for button renders
 */

bizagi.rendering.render.extend("bizagi.rendering.button", {}, {
    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        properties.caption = properties.caption || "";

        // set default value from normal to value
        properties.displayType = "value";

        // Calculate layout properties
        //this.calculateInitialLayoutProperties();

        // A button cannot be required
        properties.required = false;
        
        // This flag enable/disable default behaviors of buttons
        // auto save and axecute rule
        properties.preventDefault = properties.preventDefault || false;
    },
    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("button");

        // Render template
        return $.fasttmpl(template, {
            caption: properties.caption,
            cssClass: properties.cssclass || ""
        });
    },
    /*
    *   Method to render non editable values
    */
    renderReadOnly: function () {
        var self = this;

        // Executes the same template than normal render
        return self.renderControl();
    },
    /*
    *   Saves the form
    */
    saveForm: function () {
        var self = this;
        var form = self.getFormContainer();
        return form.saveForm();
    },
    /*
    *   Executes the button action
    */
    executeButton: function () {
        var self = this;
        var properties = self.properties;

        var xpathContext = properties.xpathContext  || "";
        if (properties.submitOnChangexpathContextRow) {
            xpathContext = (xpathContext) ? xpathContext + "." + properties.submitOnChangexpathContextRow : properties.submitOnChangexpathContextRow;
        }

        // Set the loading feedback
        self.getFormContainer().startLoading();

        return self.dataService.multiaction().executeButton({
            idRender: properties.id,
            xpath: properties.xpath || "",
            xpathContext: xpathContext || "",
            idPageCache: properties.idPageCache
        }).always(function () {
            self.getFormContainer().endLoading();
            return arguments ? arguments[0] : undefined;
        });
    },
    /*
    *   Refresh the current form
    */
    refreshForm: function () {
        var self = this;
        var properties = self.properties;

        var form = self.getFormContainer();
        form.refreshForm(properties.id);
    },
    /*
    *   Process the button actions workflow
    */
    processButton: function () {
        var self = this;
        var properties = self.properties;

        if (properties.editable) {
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
    },
    
    /*
    *   Triggers the render change event
    */
    triggerRenderChange: function (params) {
        var self = this;
        params = params || {};
        var pressed =  params.pressed || false;
        self.triggerHandler("renderchange", { render: self, pressed: pressed});
    },
    
    /* 
     *  Method to determine if the render value can be sent to the server or not
     */
    canBeSent: function() {
        // This render cannot be sent because it is full ajax
        return false;
    }
});