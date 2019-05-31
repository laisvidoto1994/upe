/*
 *   Name: Bizagi Rendering Desktop numberScientificNotation
 *   Author: Laura Ariza
 *   Comments:
 *   -   This script define a render control that support scientific notation format
 */
bizagi.rendering.numberScientificNotation.extend("bizagi.rendering.numberScientificNotation", {}, {

    /*
    * Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        self._super();

        // Attach Format Currency Plugin to format the input
        self.attachFormatScientificNotation();
    },


    setDisplayValue: function (value) {
        var self = this;
        value = bizagi.util.scientificNotationFormat(value.replace(self.properties.decimalSymbol, '.'));
        // Set value in input
        if (value != null && self.properties.editable) {
            self.numericInput.val(value.replace('.', self.properties.decimalSymbol));
            self.setValue(value);

        }
        // Call base
        this._super(value.replace('.', self.properties.decimalSymbol));
    },

    attachFormatScientificNotation: function () {
        var self = this;

        // Attach events
        self.numericInput.blur(function () {
            var inputValue = self.numericInput.val();
            var scientificNotationNumber = bizagi.util.scientificNotationFormat(inputValue, self.properties.decimalSymbol);
            // Updates internal value
            self.setValue(scientificNotationNumber);
            self.numericInput.val(scientificNotationNumber);
        });
    }
});