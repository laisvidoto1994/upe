/*
 *   Name: BizAgi Desktop Render Template number Extension
 *   Author: Mauricio Sanchez
 *   Comments:
 *   -   This script will redefine the number render class inside templates to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.layoutNumber.extend("bizagi.rendering.layoutNumber", {}, {
    /*
     *   Sets the value in the rendered control
     */
    setValue: function (value, triggerEvents) {
        var self = this;
        value = value ? self.getDisplayValue(value) : self.getDisplayValue(0);
        self.properties.displayName = value;
        this._super(value, triggerEvents);
        var control = self.getControl();
        if(control) {
            $(".ui-bizagi-render-number", control).text(value);
        }
    }
});