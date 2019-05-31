/*
*   Name: BizAgi Render Layout Money Class
*   Author: Andrés Fernando Muñoz
*   Comments:
*   -   This script will define basic stuff for money renders inside templates
*/

bizagi.rendering.layoutNumber.extend("bizagi.rendering.layoutMoney", {}, {
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

        // Configures symbol
        properties.showsymbol = typeof (properties.showsymbol) !== "undefined" ? properties.showsymbol : true;

        if (properties.showsymbol) {
            properties.symbol = properties.currencySymbol ? properties.currencySymbol :
                (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.symbol : format.symbol);
        }
        else {
            properties.symbol = "";
        }
        properties.groupDigits = true;
    }
});