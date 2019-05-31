/*
*   Name: BizAgi Horizontal Container Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define a tab item class for all devices
*/


bizagi.rendering.container.extend("bizagi.rendering.horizontal", {}, {

    /*
    *   Render the container layout
    */
    renderContainer: function () {
        var self = this;
        var properties = this.properties;
        var template = self.renderFactory.getTemplate("horizontal");

        // Render the container
        var html = $.fasttmpl(template, {
            uniqueId: properties.uniqueId
        });

        // Render children
        html = self.replaceChildrenHtml(html, self.renderChildrenHtml());
        return html;
    }

});
