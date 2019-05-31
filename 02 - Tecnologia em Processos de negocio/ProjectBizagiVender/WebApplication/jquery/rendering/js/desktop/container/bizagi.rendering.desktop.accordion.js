/*
*   Name: BizAgi Desktop Accordion Container Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to desktop devices
*/

// Auto extend
bizagi.rendering.accordion.extend("bizagi.rendering.accordion", {}, {

    /* 
    *   Template method to implement in each device to customize each container after processed
    */
    postRenderContainer: function (accordion) {
        var self = this;

        // Call base
        self._super(accordion);

        // Apply accordion widget
        // Enable accordeon
        accordion.accordion({
            autoHeight: false
        });
    },

    /*
    *   Template method to implement in each device to customize the container's behaviour to show layout
    */
    configureLayoutView: function () {
        // Do nothing
    }
});
