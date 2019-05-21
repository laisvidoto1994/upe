/*
*   Name: BizAgi Accordion Container Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define a accordion container class for all devices
*/

bizagi.rendering.container.extend("bizagi.rendering.accordion", {}, {

    /*
    *   Constructor
    */
    initializeData: function (params) {
        var self = this;

        // Call base
        this._super(params);

        // Enumerate the children appending a property
        $.each(self.children, function (i, child) {
            child.properties.ordinal = i;
        });
    },


    /*
    *   Render the container layout
    */
    renderContainer: function () {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("accordion");

        // Render the accordion
        var html = $.fasttmpl(template, {
            uniqueId: properties.uniqueId
        });

        // Render children
        html = self.replaceChildrenHtml(html, self.renderChildrenHtml());
        return html;
    }

});
