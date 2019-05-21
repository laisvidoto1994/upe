/*
*   Name: BizAgi Render Layout Boolean Class
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for boolean renders inside templates
*/

bizagi.rendering.layoutRender.extend("bizagi.rendering.layoutBoolean", {}, {
    /*
     * Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);
    },

    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        properties.editable = false;
    },

    /*
     * Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("layout-boolean");
        // Render template
        var html = $.fasttmpl(template, {value: this.properties.value});
        return html;
    },
    /*
     *   Method to render non editable values
     */
    renderReadOnly: function() {
        var self = this;
        // Executes the same template than normal render
        return self.renderControl();
    },

    setValue: function (value, triggerEvents) {
        if(value === null || value === ""){
            this.properties.value = "";
        }
        else if (value.toString().toLowerCase() === "true" || value.toString().toLowerCase() === "false"){
            this.properties.value = bizagi.util.parseBoolean(value) ? this.getResource("render-boolean-yes") : this.getResource("render-boolean-no");
        }
        this._super(this.properties.value, triggerEvents);
    }
});