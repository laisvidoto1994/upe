/*
 *   Name: Bizagi Rendering Tablet numberScientificNotation
 *   Author: Luis Cabarique - LuisCE
 *   Comments:
 *   -   This script will define a base class to define the Scientific number notation
 */


bizagi.rendering.numberScientificNotation.extend("bizagi.rendering.numberScientificNotation", {}, {

    /*
     * Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        self.inputDisplay = $("input", control).first();
        self.numericInput = self.input = $("input", control).last();
        self.numericIcon = $("span", self.getControl());

        // Add numeric plugin to avoid invalid keystrokes
        self.numericInput.numericSN(self.properties.decimalSymbol);

        // Attach Format Currency Plugin to format the input
        self.attachFormatSientificNotation();

    },

    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var value = bizagi.util.scientificNotationFormat(value, properties.decimalSymbol, 38);
        var displayValue = bizagi.util.scientificNotationFormat(value, properties.decimalSymbol, 20);


        this._super(displayValue);

        // Set value in input
        if (value != null && properties.editable) {
            self.numericInput.val(value);
            self.inputDisplay.val(displayValue);
        }

    },

    attachFormatSientificNotation: function () {
        var self = this;

        self.inputDisplay.focus(function () {
            $(this).val(self.getDisplayValue());
        });

        // Attach events
        self.inputDisplay.blur(function () {
            if (typeof (self.getFormContainer().validationController) == "undefined") self.getFormContainer().validationController = new bizagi.command.controllers.validation(self.getFormContainer(), self.validations);

            var scientificNotationNumber = bizagi.util.scientificNotationFormat(self.inputDisplay.val(), self.properties.decimalSymbol, 38);
            var scientificNotationNumberDisplay = bizagi.util.scientificNotationFormat(self.inputDisplay.val(), self.properties.decimalSymbol, 20);

            self.numericInput.val(scientificNotationNumber);
            self.inputDisplay.val(scientificNotationNumberDisplay);
            // Updates internal value
            self.setValue(scientificNotationNumber);
        });
    }
});