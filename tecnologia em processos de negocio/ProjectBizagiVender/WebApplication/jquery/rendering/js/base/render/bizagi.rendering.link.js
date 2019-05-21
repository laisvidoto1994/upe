/*
 *   Name: BizAgi Render Simple Link Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define basic stuff for link renders
 */

bizagi.rendering.render.extend("bizagi.rendering.link", {}, {
    /*
    *   Update or init the element data
     */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Set properties
        this.properties.displayType = "value";

        // Calculate layout properties
        this.calculateInitialLayoutProperties();
    },
    /*
     *   Template method to implement in each children to customize each control
     */
    renderControl: function() {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("link");

        // Render template
        return $.fasttmpl(template, {
            displayName: properties.displayName,
            align: properties.valueAlign
        });
    },
    /*
     *   Method to render non editable values
     */
    renderReadOnly: function() {
        var self = this;

        // Executes the same template than normal render
        return self.renderControl();
    },
    /* 
     * Public method to determine if a value is valid or not
     */
    isValid: function(invalidElements) {
        // Automatically this render is valid, so we can't check a required link
    },
    /*
     *   Sets the value in the rendered control
     */
    setDisplayValue: function(value) {
        // Do nothing
    },
    /* 
     *  Method to determine if the render value can be sent to the server or not
     */
    canBeSent: function() {
        return false;
    }

});