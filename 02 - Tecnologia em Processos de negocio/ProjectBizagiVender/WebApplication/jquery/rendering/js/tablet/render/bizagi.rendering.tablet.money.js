/*
*   Name: BizAgi Tablet Render Money Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the money render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.money.extend("bizagi.rendering.money", {}, {

    /* POSTRENDER 
    =====================================================*/
    postRender: function () {
        var self = this;

        // Call base
        this._super();

        self.numericInput = $("input", self.getControl());

    },

    /* SETS THE VALUE IN THE RENDERED CONTROL
    =====================================================*/
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        // Call base
        this._super(value);

        // Set value in input
        if (value != null && properties.editable) {
            self.numericInput.val(value);
            // Formats the input
            self.attachFormatCurrency();
            self.executeFormatCurrencyPlugin();
        }
    }
});
