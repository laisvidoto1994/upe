/*
*   Name: BizAgi Desktop Render Query Money Extension
*   Author: Paola Herrera
*   Comments:
*   -   This script will redefine the query money render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.money.extend("bizagi.rendering.queryMoney", {}, {
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
    /*
   *   Adds the format currency plugin
   */
    attachFormatCurrency: function () {
        var self = this;
        var properties = self.properties;
        if (properties.showSymbol) {
            if (properties.symbol == '') {
                if (typeof (bizagi) != "undefined")
                    if (properties.dataType == 8 && typeof (bizagi.currentUser) != "undefined") {
                        if (typeof (bizagi.currentUser.symbol) != "undefined") properties.symbol = bizagi.currentUser.symbol;
                    }
            }
        }

        // Call base
        this._super();
    }
});
