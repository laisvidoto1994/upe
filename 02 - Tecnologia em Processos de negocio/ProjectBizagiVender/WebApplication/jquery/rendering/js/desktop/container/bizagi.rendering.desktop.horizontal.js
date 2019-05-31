/*
*   Name: BizAgi Desktop Horizontal Container Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the horizontal container class to adjust to desktop devices
*/

// Auto extend
bizagi.rendering.horizontal.extend("bizagi.rendering.horizontal", {}, {

    /* 
    *   Template method to implement in each device to customize each container after processed
    */
    postRenderContainer: function (container) {
        var self = this;
        var children = self.children;
        var iCount = children.length;

        // Call base
        self._super(container);

        // Process each child
        $.each(children, function (i, child) {
            // Process width
            var renderWidth = child.properties.width;
            if (renderWidth == null || renderWidth.length == 0) {
                // Set default size
                renderWidth = 100 / iCount;
            } else {
                // Set custom size
                renderWidth = bizagi.util.percent2Number(renderWidth);
            }

            // Set width
            if (i != (iCount - 1)) {
                child.getRenderedElement().css({width:renderWidth + "%"});
            } else {
                child.getRenderedElement().css({width:renderWidth + "%"});
            }

            child.getRenderedElement().addClass('ui-panel-area');

            // Set class for last render
            if (i == iCount - 1) {
                child.getRenderedElement().addClass("ui-bizagi-render-last");
            }
        });
    }
});
