﻿/*
*   Name: BizAgi Render Combo Column Decorator Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for Combo Columns
*/

bizagi.rendering.columns.column.extend("bizagi.rendering.columns.search", {}, {

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
    *   Gets the internal value
    */
    getValue: function (surrogateKey) {
        var self = this;
    	var decorated = self.getDecorated(surrogateKey);
        var value = decorated.getValue();
        if (value && typeof(value) == "object" ) return value.id;
        	
    	return value;
    },
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
        } else if(value && value.id && value.label){
            self._super(surrogateKey, value);
            decorated.selectedValue = value.label;
        }
        else{
            self._super(surrogateKey, value);
            decorated.selectedValue = "";
        }
    }

});
