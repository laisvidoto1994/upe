/*
*   Name: BizAgi Render Yes-no Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for yes-no renders
*/

bizagi.rendering.render.extend("bizagi.rendering.yesno", {}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        properties.value = typeof (properties.value) != "undefined" ? bizagi.util.parseBoolean(properties.value) : null;
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;       
        var template = self.renderFactory.getTemplate("yesno");

        // Render template
        var randomId = bizagi.util.randomNumber(100,10000000);
        var html = $.fasttmpl(template, {
            id: randomId  // A random id 
        });
        return html;
    },

    /* 
    *   Gets the display value of the render
    */
    getDisplayValue: function () {
        var self = this;
        var value = self.getValue();

        if (bizagi.util.parseBoolean(value) == true) {
            return this.getResource("render-boolean-yes");

        } else if (bizagi.util.parseBoolean(value) == false) {
            return this.getResource("render-boolean-no");

        } else {
            return "";
        }
    }

});
