/*
 *   Name: BizAgi Render Layout Label Class
 *   Author: Mauricio Sánchez
 *   Comments:
 *   -   This script will define basic stuff for labels inside templates
 */

bizagi.rendering.layoutRender.extend("bizagi.rendering.layoutPlaceholder", {}, {

    /*
     * Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);
                
    },

    /*
     *   Update or init the element data
     */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
             
    },

    /*
     * Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("layout-placeholder");
        var value = self.properties.value || self.properties.displayName || "";
        // Render template
        var html = $.fasttmpl(template, {value: value});
        return html;
    }
});
