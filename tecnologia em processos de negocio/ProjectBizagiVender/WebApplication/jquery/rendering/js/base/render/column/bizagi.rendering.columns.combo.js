/*
*   Name: BizAgi Render Combo Column Decorator Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for Combo Columns
*/

bizagi.rendering.columns.column.extend("bizagi.rendering.columns.combo", {}, {

    /*
    *   Constructor
    */
    init: function (params) {
        // Call base
        this._super(params);

        // Set base column styles
        var properties = this.properties;
        properties.recalculate = bizagi.util.parseBoolean(properties.recalculate) || false;
    },


    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
        var properties = this.properties;

        this._super(decorated);

        if (!properties.recalculate) {
            decorated.originalGetData = decorated.getData;
            decorated.getData = this.getDataForAllCells;
            decorated.findDataById = this.findDataById;
        }
    },

    findDataById: function (id) {
        var self = this;
        var result = {};
        if (this.column && this.column.comboData) {
            $.each(this.column.comboData, function (key, value) {
                if (value.id == id) {
                    result = value;
                }
            });
        }

        return result;
    },

    /*
    *   Single data fetch for all the cells
    */
    getDataForAllCells: function (params) {
        var column = this.column;
        if (column.comboData) return column.comboData;
        if (column.fetchingData) return column.dataPromise;

        // Start fetching
        column.fetchingData = true;
        column.dataPromise = $.when(this.originalGetData(params))
        .pipe(function (result) {
            column.comboData = result;
            column.fetchingData = false;
            return result;
        });

        return column.dataPromise;
    },

    /*
    *   Sets the internal value
    */
    setValue: function (surrogateKey, value) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        if (decorated === null) { return; }

        // Perform default set value when rendering summary row
        if (surrogateKey == "summary") return self._super(surrogateKey, value);

        if (value && value.length > 0) {

            // Create the value property
            var newValue = {
                id: value[0][0],
                value: value[0].length > 2 ? $.grep(value[0], function (item, i) { return i != 0; }) : value[0][1]
            };
            // Call base
            self._super(surrogateKey, newValue);
            decorated.selectedValue = newValue.value;
        } else if (value && value.id && value.value) {
            self._super(surrogateKey, value);
            decorated.selectedValue = value.value;
        } else if (self.properties.type == "columnRadio") {
            self._super(surrogateKey, null);
            decorated.selectedValue = value;
        } else if (value && typeof (value) == "number") {
            self._super(surrogateKey, value);
            //decorated.selectedValue = newValue.value;
        }
        else {
            // Set null values when the entry array is null
            self._super(surrogateKey, null);
            decorated.selectedValue = "";
        }
    },

    /*
    *   Gets the internal value
    */
    getCompositeValue: function (surrogateKey) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        var value = decorated.getValue();
        var label = decorated.getSelectedValue();

        // Build value for grid data
        var valueForGrid = [];
        if (value && value.id > 0) {
            valueForGrid.push([]);
            valueForGrid[0].push(value.id);
            valueForGrid[0].push(label);
        } else {
            valueForGrid.push([]);
        }

        return valueForGrid;
    },

    /*
    *   Gets the internal value
    */
    getValue: function (surrogateKey) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        var value = decorated.getValue();
        if (value) return value.id;
        return value;
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

    renderReadOnly: function (key, value) {
        var self = this;
        var decorated = self.getDecorated(key);
        var properties = self.properties;

        // Change the xpath context
        var xpathContext = properties.xpathContext.length > 0 ? properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + key + "]" : self.grid.properties.xpath + "[id=" + key + "]";
        decorated.properties.xpathContext = xpathContext;

        // Render the control
        var result = this._super(key, value);

        return result;
    }

});
