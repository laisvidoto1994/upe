/*
*   Name: BizAgi smartphone Render Money Extension
*   Author: OscarO
*   Comments:
*   -   This script will redefine the money render class to adjust to smartphone devices
*/

// Extends itself
bizagi.rendering.money.extend("bizagi.rendering.money", {}, {


    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        /* var textTmpl = self.renderFactory.getTemplate(self.getTemplateName());
        self.input = $.tmpl(textTmpl).appendTo(control);*/
        self.numericInput = self.input = (control.find("input").length != 0) ? control.find("input") : control.append("<span class=\"bz-command-not-edit bz-rn-text\"></span>").find("span");



        if (!properties.editable) {
            container.addClass("bz-command-not-edit");
            self.input.attr('readonly', "readonly");
        } else {
            container.addClass("bz-command-edit-inline");
            self.input.removeAttr("readonly");
            self.configureHandlers();

        }
    },

    postRenderSingle: function () {
        var self = this;
        self._super();
        // self.attachFormatCurrency();
    },

    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        self.setValue(value, false);
        self.input.html(value);
        self.input.val(value);


        //  self.numericInput = self.input;
        // self.attachFormatCurrency();
        // self.executeFormatCurrencyPlugin();
        self.executeFormatCurrencyPlugin(self.input);
    },

    renderEdition: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        var textTmpl = self.renderFactory.getTemplate(self.getTemplateEditionName());
        self.inputEdition = $.tmpl(textTmpl); //= self.numericInput = $.tmpl(textTmpl);

    },
    setDisplayValueEdit: function (value) {
        var self = this;
        self.inputEdition.val(value);
        self.executeFormatCurrencyPlugin(self.inputEdition); //executeFormatCurrencyPlugin();
    },

    actionSave: function () {

        var self = this;
        var value = self.inputEdition.val();
        self.setValue(value, false);
        self.input.html(value);
        self.input.val(value);
        if (self.properties.submitOnChange)
            self.submitOnChange();
    },


    //override
    executeFormatCurrencyPlugin: function (input) {
        var self = this;
        var properties = self.properties;

        if (typeof input === "undefined")
            input = self.input;


        input.formatCurrency(
        {
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

    configureHandlers: function () {
        var self = this;
        var input = self.input;
        self.numericInput = input;
        self.attachFormatCurrency();
        self.executeFormatCurrencyPlugin();
        // Add numeric plugin to avoid invalid keystrokes
        self.input.numeric(self.properties.decimalSymbol);

        //fix bug in base 
        self.input.blur(function () {
            var inputValue = self.input.val();
            if (inputValue == "" || !bizagi.util.isNumeric(inputValue) && self.properties.value == 0) {
                self.setValue(0, false);
                self.input.html(0);
                self.input.val(0);
                self.executeFormatCurrencyPlugin(self.input);
            }

        });
    },


    getTemplateName: function () {
        return "text";
    },
    getTemplateEditionName: function () {
        return "edition.text";
    }


});
