/*
 *   Name: BizAgi Desktop Render Template number Extension
 *   Author: Mauricio Sanchez
 *   Comments:
 *   -   This script will redefine the number render class inside templates to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.layoutNumber.extend("bizagi.rendering.layoutNumber", {}, {
    /**
     * Sets the value in the rendered control
     */
    setValue: function(val, triggerEvents) {
        var self = this;
        var control = self.getControl();
        val = (typeof val === "undefined" || val === null) ?  "" : self.getDisplayValue(val);
        self.properties.displayName = val;

        this._super(val, triggerEvents);
        if(control) {
            $(".ui-bizagi-render-number", control).text(val);
        }
    },

    /**
     * Returns the display value of the render
     */
    getDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var label = $('<label/>').html(value); // To get the display value by the format currency plugin, because it requires a control

        label.formatCurrency({
            symbol: properties.symbol,
            positiveFormat: properties.positiveFormat,
            negativeFormat: properties.negativeFormat,
            decimalSymbol: properties.decimalSymbol,
            digitGroupSymbol: properties.digitGroupSymbol,
            groupDigits: properties.groupDigits,
            roundToDecimalPlace: properties.numDecimals,
            colorize: properties.colorize
        });

        return [label.text()];
    }
});