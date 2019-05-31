/*
*   Name: BizAgi Accordion Item Container Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define a accordion item class for all devices
*/

bizagi.rendering.container.extend("bizagi.rendering.accordionItem", {}, {

    /*
    *   Render the container layout
    */
    renderContainer: function () {
        var self = this;
        var properties = this.properties;
        var template = self.renderFactory.getTemplate("accordionItem");

        // Render the accordionItem
        var html = $.fasttmpl(template, {
            id: properties.id,
            ordinal: properties.ordinal,
            displayName: properties.displayName,
            orientation: properties.orientation,
            uniqueId: properties.uniqueId
        });

        // Render children
        html = self.replaceChildrenHtml(html, self.renderChildrenHtml());
        return html;
    },

    /*
    *   Fires when the accordionItem is selected 
    */
    activate: function () {
        var self = this;
        self.active = true;
    },

    /*  
    *   Return the current focuses container
    */
    getFocus: function () {
        var self = this;
        var focus = self._super();
        if (bizagi.util.isEmpty(focus) && self.active) {
            focus = self.properties.id;
        }

        return focus;
    }


});

