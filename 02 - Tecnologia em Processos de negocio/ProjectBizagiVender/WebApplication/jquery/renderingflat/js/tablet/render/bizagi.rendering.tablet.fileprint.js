/*
 *   Name: BizAgi Desktop Render fileprint Extension
 *   Author: Christian Collazos
 *   Comments:
 *   -   This script will redefine the fileprint render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.fileprint.extend("bizagi.rendering.fileprint", {}, {
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        self.getControl().parent().hide();
    }

});
