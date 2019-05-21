/*
 *   Name: BizAgi Desktop Render Query Radio Extension
 *   Author: Paola Herrera
 *   Comments:
 *   -   This script will redefine the query list render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.radio.extend("bizagi.rendering.queryRadio", {}, {
    /*
     *   Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Call base
        this._super();

        // Remove yesno class
        control.removeClass("ui-bizagi-render-boolean-yesno");
    }
});

