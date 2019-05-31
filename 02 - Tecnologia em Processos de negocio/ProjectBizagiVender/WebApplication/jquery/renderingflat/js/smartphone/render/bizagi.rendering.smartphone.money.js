/*
*   Name: BizAgi smartphone Render Money Extension
*   Author: OscarO
*   Comments:
*   -   This script will redefine the money render class to adjust to smartphone devices
*/

// Extends itself
bizagi.rendering.money.extend("bizagi.rendering.money", {}, {

    /*
    *
    */
    renderReadOnly: function () {
        var self = this;
        var value = self._super();
        var template = self.renderFactory.getTemplate("readonlyNumber");
        var tmpl = $($.fasttmpl(template, {value: value}));
        $(".bz-rn-icon", tmpl).removeClass("bz-rn-icon-number").removeClass("bz-number-icon").addClass("bz-coin-input").addClass("bz-rn-icon-coin");

        return tmpl.get(0).outerHTML;
    },

    /*
    *
    */
    renderSingle: function() {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        if (!properties.editable) {
            self.numericInput = self.input = control.find(".ui-bizagi-render-numeric");
            container.addClass("bz-rn-non-editable");
        } else {
            self.numericIcon = $("span", control);
            self.numericIcon.removeClass("bz-number-icon").addClass("bz-coin-input");

            self.numericInput = self.input = control.find("input");
            container.addClass("bz-command-edit-inline");
            self.input.removeAttr("readonly");
            self.configureHandlers();
        }
    },

    /*
    *
    */
    postRenderSingle: function () {
        var self = this;
        self._super();
    },

    /*
    *
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        self.setValue(value, false);
        
        if (!properties.editable) {
            self.input.text(value);
        } else {
            self.input.html(value);
            self.input.val(value);
        }

        self.executeFormatCurrencyPlugin();
    },

    //override
    executeFormatCurrencyPlugin: function () {
        var self = this;
        var properties = self.properties;

        self.input.formatCurrency({
            symbol: properties.symbol,
            positiveFormat: properties.positiveFormat,
            negativeFormat: properties.negativeFormat,
            decimalSymbol: properties.decimalSymbol,
            digitGroupSymbol: properties.digitGroupSymbol,
            groupDigits: properties.groupDigits,
            roundToDecimalPlace: properties.numDecimals,
            colorize: properties.colorize
        });
    },

    /*
    *
    */
    configureHandlers: function () {
        var self = this;
        var input = self.input;
        var properties = self.properties;

        self.numericInput = input;
        self.attachFormatCurrency();
        self.executeFormatCurrencyPlugin();

        // Add numeric plugin to avoid invalid keystrokes
        self.input.numeric(self.properties.decimalSymbol);

        self.input.blur(function () {
            var inputValue = self.input.val();
            if (inputValue === "" || !bizagi.util.isNumeric(inputValue) && self.properties.value === 0) {
                self.setValue(0, false);
                self.input.html(0);
                self.input.val(0);
                self.executeFormatCurrencyPlugin();
            }
        });
    },

    /*
    *
    */
    getTemplateName: function () {
        return "text";
    }
});