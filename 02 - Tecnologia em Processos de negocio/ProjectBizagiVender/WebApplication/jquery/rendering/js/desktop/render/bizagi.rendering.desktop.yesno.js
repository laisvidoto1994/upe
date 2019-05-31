/*
*   Name: BizAgi Desktop Render Yes-No Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the Yes-No render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.yesno.extend("bizagi.rendering.yesno", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Call base 
        this._super();

        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-boolean-yesno");

        // Remove data for cell refresh
        if (control[0]) {
            $.removeData(control[0]);
        }        

        // Apply plugins
        control.optiongroup({ orientation: self.properties.orientation });
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();

        // Call base
        self._super();

        // Bind change event
        control.bind("optiongroupchange", function (evt, ui) {
            // Only change the internal value when it truly changes
            if (bizagi.util.parseBoolean(self.value) != bizagi.util.parseBoolean(ui.value)) {
                self.setValue(ui.value);
            }
        });
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
    */
    configureDesignView: function () {
        var self = this;
        var control = self.getControl();

        // Unbind plugin handlers
        control.find("input").unbind("click");
    },

    /*
    *   Sets the value in the rendered control
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        // Call base
        this._super(value);

        // Set value in control
        if (value != null && properties.editable) {
            var parsedValue = bizagi.util.parseBoolean(value);
            if (parsedValue != null) {
                control.optiongroup("setValue", parsedValue.toString());
            }
        }
    },

    /*
     * Cleans current value
     */
    cleanData: function () {
        var self = this;
        var value = { id: "", label: "" };

        self.setDisplayValue(value);
        self.setValue(value,false);
        self.clearDisplayValue();
    },

    /*
     *   Sets the value in the rendered control
     */
    clearDisplayValue: function () {
        var self = this;
        var selectedItem = self.element.find(".ui-radio-state-checked");
        selectedItem.removeClass("ui-radio-state-checked");
    }
});
