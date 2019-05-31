/*
*   Name: BizAgi Tablet Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the column decorator class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.columns.combo.extend("bizagi.rendering.columns.combo", {}, {
    /*
    *   Sets the internal value
    */
    setValue: function (surrogateKey, value) {
        var self = this;
        var decorated = self.getDecorated(surrogateKey);
        // Check is offline form	    
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        if (decorated === null) {
            return;
        }

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
        } else if (isOfflineForm && (value !== null && typeof (value) === "object" && value.value)) {
            self._super(surrogateKey, value.value);
            decorated.selectedValue = value.value;
        } else {
            // Set null values when the entry array is null
            self._super(surrogateKey, null);
            decorated.selectedValue = "";
        }
    }
});
