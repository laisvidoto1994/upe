/*
 *   Name: BizAgi Render userPassword class
 *   Author: Paola Herrera
 *   Comments:
 *   -   This script will define basic stuff for userPassword render
 */
bizagi.rendering.render.extend("bizagi.rendering.userPassword", {}, {
    /*
     * Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);
        this.properties.value = null;
        self.properties = this.properties;
    },

    /*
     * Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("render-userPassword");
        // Render template
        var html = $.fasttmpl(template, {valuePassword: self.properties.value});
        return html;
    },

    /*
     * Public method to determine if a value is valid or not
     */
    isValid: function (invalidElements) {
        var self = this,
            properties = self.properties;
        // Call base
        var bValid = this._super(invalidElements);
        var value = self.getValue();

        return bValid;
    }
});