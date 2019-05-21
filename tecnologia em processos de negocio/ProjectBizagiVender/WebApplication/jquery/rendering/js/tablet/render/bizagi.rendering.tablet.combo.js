/*
*   Name: BizAgi Tablet Render option select
*   Author: Andres Valencia
*   Comments:
*   -   Renders an option html input with attached handlers
*/

// Extends itself
bizagi.rendering.combo.extend("bizagi.rendering.combo", {}, {

    /* POSTRENDER 
    =====================================================*/
    postRender: function () {
        var self = this;

        // Call base 
        this._super();

        self.combo = $("select", self.getControl());
        // Remove default lines from the item 0 '----' looks ugly on iPad
        self.combo.find('option:first').empty();

        // Set initial value to nothing
        //self.combo.selectmenu("index", -1);

        // Attach handler to update internal value
        self.combo.change(function () {

            if (self.combo.val() != '') {
                // Object with values to update
                var selection = {
                    value: self.combo.val(),
                    text: self.combo.find('option:selected').text()
                };

                // Update values
                self.onComboChange(selection.value, selection.text);
            }
            else {
                self.onComboChange('', '');
            }
        });
    },

    /* SETS THE VALUE IN THE RENDERED CONTROL
    =====================================================*/
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        if (properties.editable) {
            if (value) {
                // Check if the value is a json object
                if ((value.id != undefined) && (value.id != null)) {
                    self.combo.val(value.id);
                } else {
                    // If the value is the key then assign it
                    self.combo.val(value.value);
                }

                // Trigger event
                self.triggerHandler("select", value);
            }
        }
    },

    /* RETURNS THE SELECTED VALUE
    =====================================================*/
    getSelectedValue: function () {
        var self = this;
        return self.selectedValue;
    },

    /* HANDLER FOR COMBO CHANGE
    =====================================================*/
    onComboChange: function (id, value) {
        var self = this;

        // Update values
        self.setValue({ id: id, value: value });
        self.selectedValue = value;
    }
});
 