/*
*   Name: BizAgi Render Number Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for numbers
*/

bizagi.rendering.render.extend("bizagi.rendering.number", {}, {
    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        var format = this.getResource("numericFormat");

        properties.allowDecimals = (typeof (properties.allowDecimals) !== "undefined") ? bizagi.util.parseBoolean(properties.allowDecimals) : this.getDefaultAllowDecimals(properties.dataType);
        properties.numDecimals = properties.allowDecimals ? (properties.numDecimals ? properties.numDecimals : (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits : 2)) : 0;
        properties.symbol = '';
        properties.positiveFormat = format.positiveFormat;
        properties.negativeFormat = format.negativeFormat;
        properties.decimalSymbol = typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator : format.decimalSymbol;
        properties.digitGroupSymbol = typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.groupSeparator : format.digitGroupSymbol;
        properties.groupDigits = this.setGroupDigits();
        properties.colorize = properties.colorizeOnNegative || false;
        properties.dataTypeMinValue = this.calculateMinValue(properties.dataType);
        properties.dataTypeMaxValue = this.calculateMaxValue(properties.dataType);
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function() {
        var self = this;

        var template = self.renderFactory.getTemplate("number");
        var deviceType = bizagi.util.detectDevice();
        var options = {};

        // Change type control for android device
        if (deviceType !== "desktop") {
            options = { type: deviceType.indexOf("android") !== -1 ? "tel" : "text" };
        }

        // Render template
        var html = $.fasttmpl(template, options);
        return html;
    },
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        self._super();
        var control = self.getControl();
        var properties = self.properties;
        self.numericInput = control.find("input");

        // Add numeric plugin to avoid invalid keystrokes
        self.numericInput.numeric(self.properties.decimalSymbol);

        // Attach Format Currency Plugin to format the input
        self.attachFormatCurrency();

        //Attach event for retype double
        if (properties.retype == "double") {
            self.attachRetypeDouble();
        }

    },

    /* Removes Val Messages */
    removeValidations: function () {
        var self = this;
        var form = self.getFormContainer().parent ||  self.getFormContainer() ;
        self.setValue("");
        self.numericInput.val("");
        form.clearValidationMessages();
    },
    //function virtual implements on children (desktop,samrtphone...).
    attachRetypeDouble: function () {
    },
    /*
    *   Adds the format currency plugin
    */
    attachFormatCurrency: function () {
        var self = this;
        var properties = self.properties;
        var message = bizagi.localization.getResource("render-number-retype-fail");
        var control = self.getControl();

        // Extend formatCurrency language
        if ($.formatCurrency.regions[bizagi.language] == null)
            $.formatCurrency.regions[bizagi.language] = this.getResource("numericFormat");

        // Attach events
        self.numericInput.blur(function () {
            if (typeof (self.getFormContainer().validationController) == "undefined") self.getFormContainer().validationController = new bizagi.command.controllers.validation(self.getFormContainer(), self.validations);
            var validationController = self.getFormContainer().validationController || self.getFormContainer().parent.validationController;
            var decimalSeparator = ".";
            var digitGroupSeparator = ",";
            if (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) == "undefined") {
                decimalSeparator = self.getResource("numericFormat").decimalSymbol || ".";
                digitGroupSeparator = self.getResource("numericFormat").digitGroupSymbol || ",";
            }
            else {
                decimalSeparator = BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator;
                digitGroupSeparator = BIZAGI_DEFAULT_CURRENCY_INFO.groupSeparator;
            }
            if(properties.percentage)self.numericInput.val(self.numericInput.val().replace("%", ""));
            var inputValue = self.numericInput.val();
            inputValue = (decimalSeparator == ",") ? inputValue.replace(/\,0+$/, '') : inputValue.replace(/\.0+$/, '');
            inputValue = inputValue.replace(properties.symbol, "");
            //Replace all the ocurrences of the digitGroupSeparator
            inputValue = bizagi.util.replaceAll(inputValue, digitGroupSeparator, "");
            if (inputValue.toString().indexOf(decimalSeparator) != -1) {
                if (decimalSeparator == ",") inputValue = inputValue.replace(/([0-9]+(\,[0-9]+[1-9])?)(\,?0+$)/, '$1');
                if (decimalSeparator == ".") inputValue = inputValue.replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');
            }
            
            if (inputValue!=undefined && inputValue.length>0) self.numericInput.val(inputValue);
            var inputLength = inputValue.replace(/[^0-9]+/g, "").length;
            var xPath = self.properties.xpath;
            var oldVal = self.numericInput.val();


            if ((self.isInvalidFormat != null && self.isInvalidFormat == true)
            || (["$", "£", "€", "¥", properties.symbol].indexOf(inputValue) != -1)) {
                self.setValue("");
                self.getControl().find("input").val("");
                self.numericInput.val("");
                return;
            }

            if (bizagi.util.trim(inputValue) == "") {
                self.setValue("");
                return;
            }



            if ((properties.dataTypeMinValue !== undefined && properties.dataTypeMinValue !== null && parseFloat(inputValue) < properties.dataTypeMinValue)) {
                message = bizagi.localization.getResource("render-numeric-minimum-validation")
                            .replaceAll("#label#", properties.displayName + " (" + oldVal + ")")
                            .replaceAll("#minValue#", properties.dataTypeMinValue.toString());
            }
            else if ((properties.dataTypeMaxValue !== undefined && properties.dataTypeMaxValue !== null && parseFloat(inputValue) > properties.dataTypeMaxValue)) {
                message = bizagi.localization.getResource("render-numeric-maximum-validation")
                            .replaceAll("#label#", properties.displayName + " (" + oldVal + ")")
                            .replaceAll("#maxValue#", properties.dataTypeMaxValue.toString());
            } else
                message = message + " " + oldVal + "";


            // Do datatype validations
            if (
                    (properties.dataTypeMinValue !== undefined && properties.dataTypeMinValue !== null && parseFloat(inputValue) < properties.dataTypeMinValue)
                    || (properties.dataTypeMaxValue !== undefined && properties.dataTypeMaxValue !== null && parseFloat(inputValue) > properties.dataTypeMaxValue)
                    || (self.properties.dataType == 10 && inputLength > 15)
                    || (self.properties.dataType == 1 && inputLength > 19)
                    || (self.properties.dataType == 11 && inputLength > 7)
                    || (self.properties.dataType == 11 && inputLength > 7)
                    || (oldVal.match(/[^$£€¥,-.()\d]/))
                   ) {
                if (typeof validationController != "undefined" && validationController != null) {
                    self.removeValidations();

                    var messageToShow = message;
                    if(messageToShow.indexOf(oldVal) === -1){
                        messageToShow = message + " " + oldVal + "";
                    }

                    validationController.showValidationMessage(messageToShow, xPath);
                    self.isValidRender = false;
                    self.isValidRenderMessage = messageToShow;
                }
                message = message.replace(oldVal, "");
                return;
            }
            else {
                self.isValidRender = true;  
            }

            // Fix decimals specially when it starts with 0 (0000234 -> 234, 00000 -> 0)
            if (this.value.toString().length > 0 && !properties.allowDecimals && !properties.groupDigits) {
                this.value = this.value.toString().replace(/^0+/, '');
                if (properties.symbol.length > 0) this.value = this.value.toString().replace(properties.symbol + "0", properties.symbol);
                this.value = this.value.toString().replace(/^0+/, '');
                if (this.value.replaceAll('0', '').length == 0)
                    this.value = properties.symbol + "0";
                else if (this.value.toString() == parseInt(this.value)) this.value = properties.symbol + this.value;
            } else {
                //Fix type money when number start with 0 (0000234 -> 234, 00000 -> 0)
                if(self.properties.type === "money" || self.properties.type === "number" || self.properties.type === "columnMoney" || self.properties.type === "columnNumber"){
                    this.value = this.value.toString().replace(/^0+/, '');
                    if(this.value === ""){
                        this.value = 0;
                    }
                }
            }
            self.executeFormatCurrencyPlugin();

            // Updates internal value
            self.setValue(self.numericInput.asNumber({
                symbol: properties.symbol,
                positiveFormat: properties.positiveFormat,
                negativeFormat: properties.negativeFormat,
                decimalSymbol: properties.decimalSymbol,
                digitGroupSymbol: properties.digitGroupSymbol,
                groupDigits: properties.groupDigits
            }));

            if (properties.percentage) {
                if (self.numericInput && self.numericInput.val().indexOf("%") == -1)
                    self.numericInput.val(self.numericInput.val() + '%');
            }
            message = message.replace(oldVal, "");
        })

        // Avoiding pasting invalid characters
        .bind('paste', function (e) {
            try {
                var tmpData = (bizagi.util.isIE() || bizagi.util.isIE11()) ? window.clipboardData.getData("text") : e.originalEvent.clipboardData.getData("Text");


                
                // Next lines checks if there is something different to numbers symbol, decimalSymbol and digitGroupSybol 
                var totalVal = "/[^0-9";
                if (properties.decimalSymbol.length > 0) {
                    totalVal += properties.decimalSymbol;
                }
                // Next lines only for currency type
                if (properties.dataType == 8) {
                    if (properties.symbol.length > 0) {
                        totalVal += properties.symbol;
                    }
                    if (properties.digitGroupSymbol.length > 0) {
                        totalVal += properties.digitGroupSymbol;
                    }
                }
                totalVal += "\\-\\s]/gi";
                try {
                    if (tmpData.replace(eval(totalVal), '').length != tmpData.length)
                        e.preventDefault();
                }
                catch (e) {
                }
            }
            catch (e) {
                bizagi.log("Error to pasting content");
                self.isInvalidFormat = true;
            }
        })
        // Now we implement keydown instead of keyup in order to include preventDefault
                .keydown(function (e) {
                    self.previousValue = this.value;
                    e = (window.event && window.event.preventDefault) ? window.event : e;
                    var keyUnicode = e.charCode || e.keyCode;
                    // Validation for currency info
                    if (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) != "undefined")
                        if (BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits == 0) properties.allowDecimals = false;
                    if (properties.dataType < 5 || (properties.dataType == 8 && properties.allowDecimals == false))
                        if (keyUnicode == 188 || keyUnicode == 190 || keyUnicode == 110)
                            e.preventDefault();
                    if (this.value)
                        if (e !== undefined && this.value.length > 0 && properties.dataType == 8) {
                            // Just numbers
                            if (keyUnicode > 47 && keyUnicode < 58) {
                                if (self.formatTimeout) {
                                    clearTimeout(self.formatTimeout);
                                }

                                var floatPart = this.value + "";
                                //var  floatPart = stringPart.replaceAll(properties.digitGroupSymbol, "").replaceAll(properties.symbol,"").trim().replaceAll(properties.decimalSymbol,"."); 
                                if (properties.digitGroupSymbol && properties.digitGroupSymbol.length > 0) {
                                    floatPart = floatPart.replaceAll(properties.digitGroupSymbol, "");
                                }
                                if (properties.symbol.length > 0) {
                                    floatPart = floatPart.replaceAll(properties.symbol, "");
                                }

                                floatPart = $.trim(floatPart);
                                if (properties.decimalSymbol && properties.decimalSymbol.length > 0) {
                                    floatPart = floatPart.replaceAll(properties.decimalSymbol, ".");
                                }
                                // If increasing one digit (x10) will overtake the maxValue
                                if (floatPart * 10 > properties.dataTypeMaxValue) {
                                    e.preventDefault();
                                }
                            }
                            else if (keyUnicode == 109 || keyUnicode == 189) {
                                // Add negative Value
                                this.value = properties.symbol + "-" + this.value.replace(properties.symbol, "");
                            }
                        }
                })

                .keyup(function (e) {
                    e = window.event || e;
                    var keyUnicode = e.charCode || e.keyCode;
                    if (e !== undefined) {
                        switch (keyUnicode) {
                            case 16:
                                break; // Shift
                            case 17:
                                break; // Ctrl
                            case 13:
                                break; // Intro
                            case 18:
                                break; // Alt
                            case 27:
                                this.value = '';
                                break; // Esc: clear entry
                            case 35:
                                break; // End
                            case 36:
                                break; // Home
                            case 37:
                                break; // cursor left
                            case 38:
                                break; // cursor up
                            case 39:
                                break; // cursor right
                            case 40:
                                break; // cursor down
                            case 78:
                                break; // N (Opera 9.63+ maps the "." from the number key section to the "N" key too!) (See: http://unixpapa.com/js/key.html search for ". Del")
                            case 110:
                                break; // . number block (Opera 9.63+ maps the "." from the number block to the "N" key (78) !!!)
                            case 188:
                                break; // , comma
                            case 190:
                                break; // .
                            default:
                                {
                                   
                                }
                        }
                    }
                }).keypress(function (e) {
                    e = (window.event && window.event.preventDefault) ? window.event : e;
                    var keyUnicode = e.charCode || e.keyCode;
                    if (typeof (e) !== "undefined") {
                        if (keyUnicode == 35 || keyUnicode == 37 || keyUnicode == 39) {
                            e.preventDefault();
                        } else if (properties.dataType != 8 && keyUnicode == 36) {
                            e.preventDefault();
                        }

                        // When no decimals are permited
                        var character = String.fromCharCode(keyUnicode);
                        if (properties.allowDecimals === false && properties.numDecimals === 0 && character === properties.decimalSymbol)
                            e.preventDefault();
                }
            });

    },
    executeFormatCurrencyPlugin: function () {
        var self = this;
        var properties = self.properties;

        if (self.numericInput) {
            self.numericInput.formatCurrency(
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
        }
        if (properties.dataType != 8 && bizagi.override.removeTrailingZeros === true) {
            var value = self.numericInput.val();
            var positive = true;
            if (value.indexOf(")") != -1) {
                positive = false;
                value = value.replace("(", "").replace(")", "")
            }
            var re = new RegExp("("+properties.decimalSymbol+"\\d*?[1-9])0+$", "g");
            value = value.replace(re, "$1");
            re = new RegExp("\\"+properties.decimalSymbol+"0+$", "g");
            value = value.replace(re, "");
            self.numericInput.val(value);

            if (!positive) self.numericInput.val("(" + value + ")");
        }
        if (properties.percentage)
            self.numericInput.val(self.numericInput.val() + '%');
    },
    /*
    *   Returns the display value of the render
    */
    getDisplayValue: function () {
        var self = this,
                properties = self.properties,
                control = self.getControl(),
                value = self.getValue() !== undefined ? self.getValue() : $("input", control).val() || "";

        // Workaround to get the display value by the format currency plugin, because it requires a control
        var label = $('<label/>').html(value);
        label.formatCurrency(
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
        if(properties.percentage){
            label = $('<label/>').html(label.text()+'%');
        }
        // Removing unrequired zeros as requested by BA26331
        if (properties.editable == false && properties.dataType != 8 && bizagi.override.removeTrailingZeros === true) {
            value = label.text();
            var positive = true;
            if (value.toString().indexOf(")") != -1) {
                positive = false;
                value = value.replace("(", "").replace(")", "");
            }
            var re = new RegExp("("+properties.decimalSymbol+"\\d*?[1-9])0+$", "g");
            value = value.replace(re, "$1");
            re = new RegExp("\\"+properties.decimalSymbol+"0+$", "g");
            value = value.replace(re, "");

            if (!positive) value = "(" + value + ")";
            return value;
        }
        return label.text();
    },
    /* 
    * Public method to determine if a value is valid or not
    */
    isValid: function (invalidElements) {
        var self = this,
                properties = self.properties;

        // Call base
        var bValid = this._super(invalidElements);
        var value = self.getValue();
        var display = self.getDisplayValue();
        var message;
        if (typeof (value) == "string" && value != "") {
            value = Number(value);
        }

        // Check min value
        if (self.hasValue()) {
            if (!bizagi.util.isEmpty(properties.minValue)) {
                if (value < properties.minValue) {
                    message = this.getResource("render-numeric-minimum-validation").replaceAll("#label#", properties.displayName.toString()).replaceAll("#minValue#", properties.minValue.toString());
                    invalidElements.push({ xpath: properties.xpath, message: message });
                    bValid = false;
                }
            }
            // Check max value
            if (!bizagi.util.isEmpty(properties.maxValue)) {
                if (value > properties.maxValue) {
                    message = this.getResource("render-numeric-maximum-validation").replaceAll("#label#", properties.displayName.toString()).replaceAll("#maxValue#", properties.maxValue.toString());
                    invalidElements.push({ xpath: properties.xpath, message: message });
                    bValid = false;
                }
            }

        }
        
        if (self.isValidRender === false) {
            bValid = false;
            var validMessage = self.isValidRenderMessage ? self.isValidRenderMessage : "error";
            invalidElements.push({ xpath: properties.xpath, message: validMessage });
        }
        return bValid;
    },
    /*
    *   Return the allow decimals default property based on the datatype
    */
    getDefaultAllowDecimals: function (dataType) {
        if (dataType) {
            // Integer data types
            if (dataType == 1 || dataType == 2 || dataType == 3 || dataType == 4 || dataType == 7) {
                return false;
            }
            // Decimal and money data types
            if (dataType == 6 || dataType == 8 || dataType == 10 || dataType == 11) {
                return true;
            }
        }
        return false;
    },
    /*
    *   Return the group digits default property based on the datatype
    */
    getDefaultGroupDigits: function (dataType) {
        if (dataType) {
            // Integer data types
            if (dataType == 1 || dataType == 2 || dataType == 3 || dataType == 4 || dataType == 7) {
                return false;
            }
            // Decimal data types
            if (dataType == 6 || dataType == 8 || dataType == 10 || dataType == 11) {
                return true;
            }
        }
        return false;
    },

    /**
     * Return the group digits default property based on digitGroupSymbol
     */

    setGroupDigits: function(){
        var self = this;
        if(typeof (self.properties.thousands) !== "undefined"){
            if(self.properties.digitGroupSymbol){//some cultures
                return bizagi.util.parseBoolean(self.properties.thousands);
            }
            else{
                return false;
            }
        }else if(self.properties.digitGroupSymbol){//some cultures
            return this.getDefaultGroupDigits(self.properties.dataType);
        }else{
            return false;
        }
    },

    /*
    *
    */
    calculateMinValue: function (dataType) {
        if (dataType == 8) {
            return -922337203685477; // Money
        }
        if (dataType == 4) {
            return 0; // tinyint
        }
        if (dataType == 3) {
            return -32768; // smallint
        }
        if (dataType == 2) {
            return -2147483648; // int
        }
        if (dataType == 1) {
            return -999999999999999; // bigint
        }
        return null;
    },
    /*
    *
    */
    calculateMaxValue: function (dataType) {
        if (dataType == 8) {
            return 922337203685477; // Money
        }
        if (dataType == 4) {
            return 255; // tinyint
        }
        if (dataType == 3) {
            return 32767; // smallint
        }
        if (dataType == 2) {
            return 2147483647; // int
        }
        if (dataType == 1) {
            return 999999999999999; // bigint
        }
        return null;
    },
    changeMinValue: function (value) {
        var self = this;
        self.properties.minValue = self.properties.dataTypeMinValue = Number(value) || self.calculateMinValue(self.properties.dataType);
    },
    changeMaxValue: function (value) {
        var self = this;
        self.properties.maxValue = self.properties.dataTypeMaxValue = Number(value) || self.calculateMaxValue(self.properties.dataType);
    }
});

