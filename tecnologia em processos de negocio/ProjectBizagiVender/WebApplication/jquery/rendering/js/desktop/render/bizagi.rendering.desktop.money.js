/*
*   Name: BizAgi Desktop Render Money Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the money render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.money.extend("bizagi.rendering.money", {}, {

    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        // Call base
        this._super(value);

        // Set value in input
        if (value !== undefined && value !== null && properties.editable) {
            self.numericInput.val(value);

            // Formats the input
            self.executeFormatCurrencyPlugin();
        }
    }
});