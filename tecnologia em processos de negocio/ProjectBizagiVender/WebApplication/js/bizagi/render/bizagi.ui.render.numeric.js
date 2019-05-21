/*
 * jQuery BizAgi Render Numeric Widget 0.1
 * Copyright (c) http://www.bizagi.com
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.metadata.js
 *	jquery.formatCurrency.js
 *	jquery.numeric.js
 *	bizagi.ui.render.base.js
 */
(function ($) {
    $.ui.baseRender.subclass('ui.numericRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Define format settings
            var format = $.formatCurrency.regions[BA_CURRENT_CULTURE];
            var isMoney = properties.isMoney;
            self.allowDecimals = properties.allowDecimals || true;
            self.numDecimals = (self.allowDecimals ? (properties.decimals || 2) : -1);
            self.symbol = (properties.isMoney ? (properties.currencySymbol || format.symbol) : '');
            self.positiveFormat = format.positiveFormat;
            self.negativeFormat = format.negativeFormat;
            self.decimalSymbol = format.decimalSymbol;
            self.digitGroupSymbol = format.digitGroupSymbol;
            self.groupDigits = properties.isMoney || false;
            self.colorize = properties.colorizeOnNegative || false;

            // Creates control
            self.input = $('<input class="ui-bizagi-render-numeric" type="text" />')
                .appendTo(control);

            // Set value
            self._setValue(properties.value);

            // Add numeric plugin to avoid invalid keystrokes
            self.input.numeric(self.decimalSymbol);

            // Attach Format Currency Plugin to format the input
            self._attachFormatCurrency();
        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Call base
            $.ui.baseRender.prototype._setValue.apply(this, arguments);

            // Set value in control
            if (value != undefined && properties.editable) {
                var self = this;
                self.input.val(value);
            }
        },

        /* Internally gets the value */
        _getValue: function () {
            /* Override in each render type if needed*/
            var self = this;
            if (self.internalValue.val() == undefined ||
                self.internalValue.val() == null ||
                self.internalValue.val() == "" ) 
            {        
                return 0;
            } 
            
            return self.internalValue.val();
        },

        _attachFormatCurrency: function () {
            var self = this;

            // Attach events
            self.input
                .blur(function () {
                    executeFormatCurrencyPlugin()
                })
			    .keyup(function (e) {
			        var e = window.event || e;
			        var keyUnicode = e.charCode || e.keyCode;
			        if (e !== undefined) {
			            switch (keyUnicode) {
			                case 16: break; // Shift
			                case 17: break; // Ctrl
			                case 18: break; // Alt
			                case 27: this.value = ''; break; // Esc: clear entry
			                case 35: break; // End
			                case 36: break; // Home
			                case 37: break; // cursor left
			                case 38: break; // cursor up
			                case 39: break; // cursor right
			                case 40: break; // cursor down
			                case 78: break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
			                case 110: break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
			                case 190: break; // .
			                default: executeFormatCurrencyPlugin();
			            }
			        }
			    })
                .bind("change", function () {
                    // Fix decimals
                    self.input.val(self.input.asNumber({ region: BA_CURRENT_CULTURE }).toFixed(self.numDecimals));
                    executeFormatCurrencyPlugin();

                    // Updates internal value
                    self._setInternalValue(self.input.asNumber({ region: BA_CURRENT_CULTURE }));
                });

            function executeFormatCurrencyPlugin() {
                self.input.formatCurrency(
                {
                    symbol: self.symbol,
                    positiveFormat: self.positiveFormat,
                    negativeFormat: self.negativeFormat,
                    decimalSymbol: self.decimalSymbol,
                    digitGroupSymbol: self.digitGroupSymbol,
                    groupDigits: self.groupDigits,
                    roundToDecimalPlace: -1,
                    colorize: self.colorize
                });
            }
        },

        /* 
        * Public method to determine if a value is valid or not
        */
        isValid: function (invalidElements) {
            var self = this,
                properties = self.options.properties;

            // Call base
            var bValid = $.ui.baseRender.prototype.isValid.apply(this, arguments);
            var value = self.input.asNumber({ region: BA_CURRENT_CULTURE });
            // Check min value
            if (properties.minValue) {
                if (value < properties.minValue) {
                    var message = $.bizAgiResources["bizagi-ui-render-numeric-minimum-validation"].replaceAll("#label#", properties.label).replaceAll("#minValue#", properties.minValue);
                    invalidElements.push({ xpath: properties.xpath, message: message });
                    bValid = false;
                }
            }
            // Check max value
            if (properties.maxValue) {
                if (value > properties.maxValue) {
                    var message = $.bizAgiResources["bizagi-ui-render-numeric-maximum-validation"].replaceAll("#label#", properties.label).replaceAll("#maxValue#", properties.maxValue);
                    invalidElements.push({ xpath: properties.xpath, message: message });
                    bValid = false;
                }
            }

            return false;
        }
    });

})(jQuery);