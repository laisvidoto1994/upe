/*
 *   Name: BizAgi Render Layout Simple Link Class
 *   Author: Andrés Fernando Muñoz
 *   Comments:
 *   -   This script will define basic stuff for non editable link renders inside templates
 */

bizagi.rendering.layoutRender.extend("bizagi.rendering.layoutLink", {}, {
    /*
     * Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);
    },

    /*
     * Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("layout-link");
        // Render template
        var html = $.fasttmpl(template, {displayName: self.properties.displayName});
        return html;
    }
});