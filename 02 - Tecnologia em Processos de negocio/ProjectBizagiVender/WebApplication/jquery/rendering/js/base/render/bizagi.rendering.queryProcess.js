/*
 *   Name: BizAgi Render Query Process
 *   Author: Jeison Borja
 *   Comments:
 *   -   This script will define basic stuff for query process renders
 */

bizagi.rendering.render.extend("bizagi.rendering.queryProcess", {}, {
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
        var template = self.renderFactory.getTemplate("queryProcess");
        var html = $.fasttmpl(template, {});
        return html;
    },
    loadtemplates: function () { }
});