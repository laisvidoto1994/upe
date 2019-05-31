/*
*   Name: Bizagi Rendering Smartphone numberScientificNotation
*   Author: Luis Cabarique - LuisCE
*   Comments:
*   -   This script will define a base class to define the Scientific number notation
*/

bizagi.rendering.numberScientificNotation.extend("bizagi.rendering.numberScientificNotation", {}, {

    /*
     * Template method to implement in each device to customize each render after processed
     */
    renderSingle: function() {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var container = self.getContainerRender();
        self.inputDisplay = $("input", control).first();
        self.numericInput = self.input = (control.find("input").length > 1) ? $("input", control).last() : control.append("<span class=\"bz-rn-non-editable bz-rn-align-class bz-rn-text\"></span>").find("span");

        // Add numeric plugin to avoid invalid keystrokes
        self.numericInput.numericSN(self.properties.decimalSymbol);

        // Attach Format Currency Plugin to format the input
        self.attachFormatSientificNotation();

        if (!properties.editable) {
            container.addClass("bz-rn-non-editable");
            self.numericInput.addClass("bz-rn-icon-readonly").addClass("bz-mo-icon").addClass("bz-specialnumbers-input");
            self.numericInput.attr("readonly", "readonly");
            self.inputDisplay.attr("readonly", "readonly");
        } else {
            container.addClass("bz-command-edit-inline");
            self.numericInput.removeAttr("readonly");
            self.inputDisplay.removeAttr("readonly");
        }
    },

    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var value = bizagi.util.scientificNotationFormat(value, properties.decimalSymbol, 38);
        var displayValue = bizagi.util.scientificNotationFormat(value, properties.decimalSymbol, 15);

        // Set value in input
        self.numericInput.val(value);
        self.inputDisplay.val(displayValue);
        self.numericInput.html(displayValue);
        self.value = self.properties.value = value;
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
            var scientificNotationNumberDisplay = bizagi.util.scientificNotationFormat(self.inputDisplay.val(), self.properties.decimalSymbol, 15);

            self.numericInput.val(scientificNotationNumber);
            self.inputDisplay.val(scientificNotationNumberDisplay);

            // Updates internal value
            self.setValue(scientificNotationNumber);
        });
    }
});