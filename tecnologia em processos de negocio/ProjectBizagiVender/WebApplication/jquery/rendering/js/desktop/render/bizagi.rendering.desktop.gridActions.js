/*
*   Name: BizAgi Desktop grid Actions Extension
*    Author: Cristian Olaya
 *           Iván Ricardo Taimal
*
*/

// Extends itself
bizagi.rendering.render.extend("bizagi.rendering.gridActions", {}, {

    renderControl: function () {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("gridActions");

        // Render template
        var html = $.fasttmpl(template, {});
        return html;
    }
});
