/*
*   Name: BizAgi Tablet Render Label Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the label render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.label.extend("bizagi.rendering.label", {}, {
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;

        // Apply a css class
        self.getLabel().addClass("ui-bizagi-render-label");
    },

    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function () {
        var self = this;

        // Apply a css class
        self._super();
        self.getLabel().addClass("ui-bizagi-render-label");
    }
});