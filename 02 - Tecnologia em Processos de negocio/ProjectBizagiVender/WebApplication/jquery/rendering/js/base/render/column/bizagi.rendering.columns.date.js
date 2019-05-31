/*
*   Name: BizAgi Render Date Column Decorator Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for Date Columns
*/


bizagi.rendering.columns.column.extend("bizagi.rendering.columns.date", {}, {

    /*
    *   Sets the internal value
    */
    setValue: function (surrogateKey, value) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        if (decorated === null) return;

        self._super(surrogateKey, value);
        if ((value === null || value === undefined) && self.properties.defaultvalue !== undefined) {
            value = self.setDefaultValue(surrogateKey, decorated);
        }

        // Perform default set value when rendering summary row
        if (surrogateKey == "summary") return self._super(surrogateKey, value);

        if (value == null) {
            decorated.setValue(value, false);
            decorated.properties.displayValue = "";
        }

        var date = bizagi.util.dateFormatter.getDateFromInvariant(value, decorated.properties.showTime);

        if (date == 0) {
            // force another attempt in order to check invariant format for the value with time or without time (reverse option)
            date = bizagi.util.dateFormatter.getDateFromInvariant(value, !decorated.properties.showTime);
        }
        // Format date to current format
        if (date != 0) {
            var datePickerRegional = bizagi.localization.getResource("datePickerRegional");
            var formattedDate = bizagi.util.dateFormatter.formatDate(date, decorated.properties.fullFormat, datePickerRegional);

            // Set formatted value in display value property
            decorated.properties.displayValue = formattedDate;

            // Send original value to decorated control, because it must be with invariant format
            decorated.setValue(value, false);
        }
    },

    /*
    * Set the cell default value and make this action as a change to send it to server
    */
    setDefaultValue: function (surrogateKey, decorated) {
        var self = this,
            value = self.properties.defaultvalue;

        decorated.grid.changes[surrogateKey] = decorated.grid.changes[surrogateKey] || {};
        value = bizagi.util.dateFormatter.getDateFromInvariant(value, false);
//        value.setHours(0, 0, 0, 0);
        value = bizagi.util.dateFormatter.formatInvariant(value, true);
        decorated.grid.changes[surrogateKey][self.properties.xpath] = value;

        return value;
    }
});

