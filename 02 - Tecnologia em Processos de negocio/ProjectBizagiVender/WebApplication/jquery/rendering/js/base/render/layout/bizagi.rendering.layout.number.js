/*
*   Name: BizAgi Render Layout number Class
*   Author: Andres Fernando Muñoz
*   Comments:
*   -   This script will define basic stuff for text renders inside templates
*/

bizagi.rendering.layoutRender.extend("bizagi.rendering.layoutNumber", {}, {
    /*
     * Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);
    },
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

        properties.allowDecimals = typeof (properties.allowDecimals) !== "undefined" ? bizagi.util.parseBoolean(properties.allowDecimals) : this.getDefaultAllowDecimals(properties.dataType);
        properties.numDecimals = properties.allowDecimals ? (properties.numDecimals ? properties.numDecimals : (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits : 2)) : 0;
        properties.symbol = '';
        properties.positiveFormat = format.positiveFormat;
        properties.negativeFormat = format.negativeFormat;
        properties.decimalSymbol = typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator : format.decimalSymbol;
        properties.digitGroupSymbol = typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.groupSeparator : format.digitGroupSymbol;
        properties.groupDigits = this.getDefaultGroupDigits(properties.dataType);
        properties.colorize = properties.colorizeOnNegative || false;
    },

    /*
     * Template method to implement in each children to customize each control
     */
    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("layout-number");
        // Render template
        var html = $.fasttmpl(template, {value: self.properties.value});
        return html;
    },
    /*
     *   Method to render non editable values
     */
    renderReadOnly: function() {
        var self = this;
        // Executes the same template than normal render
        return self.renderControl();
    },

    /*
     *   Returns the display value of the render
     */
    getDisplayValue: function (value) {
        var self = this,
            properties = self.properties,
            control = self.getControl();

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

        return label.text();
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
            // Decimal data types
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
    }
});