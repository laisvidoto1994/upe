/**
 * Name: BizAgi Desktop Render Template Money Extension
 * Author: Andres Fernando Muñoz
 * Comments:
 * - This script will redefine the money render class inside templates to adjust to desktop devices
 */
bizagi.rendering.layoutMoney.extend("bizagi.rendering.layoutMoney", {}, {
    /**
     * Sets the value in the rendered control
     */
    setValue: function(val, triggerEvents) {
        var self = this;
        var control = self.getControl();

        if (self.getMode() === "execution") {
            val = (val === null || val === "") ? "" : self.getDisplayValue(val);
        }
        self.properties.displayName = val;

        this._super(val, triggerEvents);
        if(control) {
            $(".ui-bizagi-render-number", control).text(val);
        }
    }
});