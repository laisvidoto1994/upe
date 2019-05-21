/*
*   Name: BizAgi Tablet Render Cascading combo Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the cascading combo render class to adjust to tablet devices
*/

// Extends from base cascading combo, then apply tablet combo stuff
bizagi.rendering.cascadingCombo.extend("bizagi.rendering.cascadingCombo", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {

        // Call desktop.combo method
        var self = this;
        bizagi.rendering.combo.prototype.postRender.apply(self, arguments);
        self.processLayout();
    },

    cleanInput: function () {

    },

    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        self.selectedValue = value;

        //console.info("setDisplayValue cascading", value);
        //bizagi.rendering.combo.prototype.setDisplayValue.apply(this, arguments);
        //self.onComboChange(value.id, value.value);
        self.selectedValue = value.value;
        bizagi.rendering.combo.prototype.setDisplayValue.apply(this, arguments);
    },

    /*
    *   Returns the selected value in the template
    */
    getSelectedValue: function () {
        // Call desktop.combo method
        return bizagi.rendering.combo.prototype.getSelectedValue.apply(this, arguments);
    },

    /*
    *   Handler for combo change
    */
    onComboChange: function (id, value) {
        var self = this;
        // Update values
        var newValue = { id: id, value: value };
        self.setValue(newValue, self.initialValueSet);
        self.selectedValue = value;
        // Trigger event
        self.triggerHandler("select", newValue);
    },

    setValue: function (val, triggerEvents) {
        var self = this;
        triggerEvents = triggerEvents !== undefined ? triggerEvents : true;

        if (val === '') {
            val = { id: "", value: "" };
        }

        if (!!val) {
            var id = val.id || "";
            var label = val.value || ""; //self.findDataById(id).value;

            self.selectedValue = { id: id, value: label };
            if (triggerEvents) self.triggerHandler("select", { id: id, value: label });
            this._super(self.selectedValue, triggerEvents);
        }
    },

    findDataById: function () {

        return bizagi.rendering.combo.prototype.findDataById.apply(this, arguments);

    }

});
 