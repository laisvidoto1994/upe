/*
*   Name: BizAgi Render Layout Text Class
*   Author: Mauricio Sanchez
*   Comments:
*   -   This script will define basic stuff for text renders inside templates
*/

bizagi.rendering.layoutRender.extend("bizagi.rendering.layoutText", {}, {
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
        //properties.editable = false;
    },

    /*
     * Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("layout-text");
        // Render template
        var html = $.fasttmpl(template, {value: self.properties.value,editable: self.properties.editable});
        return html;
    },
    /*
     *   Method to render non editable values
     */
    renderReadOnly: function() {
        var self = this;
        // Executes the same template than normal render
        return self.renderControl();
    }
});