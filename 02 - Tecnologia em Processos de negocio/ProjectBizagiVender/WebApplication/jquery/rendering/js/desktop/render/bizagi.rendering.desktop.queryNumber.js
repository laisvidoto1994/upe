/*
 *   Name: BizAgi Desktop Render Query Number Extension
 *   Author: Paola Herrera
 *   Comments:
 *   -   This script will redefine the number render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.number.extend("bizagi.rendering.queryNumber", {}, {

    /*
     *   Sets the value in the rendered control
     */
    setDisplayValue: function(value) {
        var self = this;
        var properties = self.properties;

        // Call base
        this._super(value);
        if (value !== null && properties.editable) {
            self.setValue(self.numericInput.asNumber({
                symbol: properties.symbol,
                positiveFormat: properties.positiveFormat,
                negativeFormat: properties.negativeFormat,
                decimalSymbol: properties.decimalSymbol,
                digitGroupSymbol: properties.digitGroupSymbol,
                groupDigits: properties.groupDigits
            }));
        }
    }
});

