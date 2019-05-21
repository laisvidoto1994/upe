
/*
*   Name: BizAgi Render Number Scientific notation Class
*   Author: Laura Ariza
*   Comments:
*   -   This script will define basic stuff for scientific notation numbers
*/

bizagi.rendering.render.extend("bizagi.rendering.numberScientificNotation", {
    /*
     *   Update or init the element data
     */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = self.properties;

        properties.decimalSymbol = typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator : format.decimalSymbol;
    },

    renderControl: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("numberScientificNotation");

        // Render template
        var html = $.fasttmpl(template, {});
        return html;
    },

    /*
     * Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        self.numericInput = control.find("input");
        // Add numeric plugin to avoid invalid keystrokes
        self.numericInput.numericSN(self.properties.decimalSymbol);

    },

    getDisplayValue: function(){
        var self = this;
        return self.getValue().replace('.', self.properties.decimalSymbol);
    },

    setValue: function (value) {
        var self = this;
        value = (value || '').toString().replace(self.properties.decimalSymbol, '.');
        self._super(value);
    },
    controlValueIsChanged:  function () {
        var self = this;
        var properties = self.properties;
        var value = self.getValue() || "";
        var compareValue = properties.originalValue || "";
        var result = true;

        // Flag to force to collect data
        if ($.forceCollectData) {
            return true;
        }
        result = (compareValue.toLowerCase() == value.toLowerCase()) ? false : true;
        return result;
    }

});