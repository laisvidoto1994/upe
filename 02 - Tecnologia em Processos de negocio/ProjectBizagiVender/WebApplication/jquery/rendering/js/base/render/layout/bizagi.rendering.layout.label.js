/*
 *   Name: BizAgi Render Layout Label Class
 *   Author: Mauricio Sánchez
 *   Comments:
 *   -   This script will define basic stuff for labels inside templates
 */

bizagi.rendering.layoutRender.extend("bizagi.rendering.layoutLabel", {}, {

    /*
     * Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);

        this.properties.required = false;

        // Set properties
        this.properties.displayType = "label";
        this.properties.labelAlign = this.originalProperties.labelAlign || "left";

        // Calculate layout properties
        this.calculateInitialLayoutProperties();


    },

    /*
     * Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("layout-label");
        var value = self.properties.displayName || self.properties.value || "";
        // Render template
        var html = $.fasttmpl(template, {value: value});
        return html;
    }
});
