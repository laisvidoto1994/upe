/*
*   Name: BizAgi Desktop Seacrh List Column Decorator Extension
*   Author: Paola Herrera
*   Comments:
*   -   This script will redefine the text column decorator class to adjust to desktop devices
*/

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.searchList", {}, {

    /*
     *   Constructor
     */
    init: function (params) {
        // Call base
        this._super(params);

        // Set base column styles
        var properties = this.properties;
    },
    /*
     *   Returns the in-memory processed element
     *   so the caller could append it to any place
     */
    render: function (surrogateKey, value, tableCell) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        var properties = self.properties;

        // If the control needs to recalculate data, reset it on the decorated render
        if (properties.recalculate) {
            decorated.resetData();
        }

        // Change the xpath context
        var xpathContext = properties.xpathContext.length > 0 ? properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + surrogateKey + "]" : self.grid.properties.xpath + "[id=" + surrogateKey + "]";
        decorated.properties.xpathContext = xpathContext;

        // Render the control
        var result = this._super(surrogateKey, value, tableCell);

        return result;
    },

    /*
     *   Sets the internal value, only must be called internally
     */
    setValue: function (surrogateKey, value) {
        var self = this;

        var decorated = self.getDecorated(surrogateKey);
        if (decorated != "undefined" && decorated != null) {

            decorated.properties.originalValue = value;
            decorated.properties.previousValue = value;

            if ((value === null || value === undefined) && self.properties.defaultvalue !== undefined && decorated.grid != undefined) {
                value = self.setDefaultValue(surrogateKey, decorated);
            }

            if (value === null || value === undefined) value = [];

            decorated.properties.value = value;
            decorated.setValue(value, false);
        }
    }
});
