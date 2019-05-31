/*
*   Name: BizAgi Tablet Render Yes-No Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the Yes-No render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.yesno.extend("bizagi.rendering.yesno", {}, {

    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Call base 
        this._super();

        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-boolean-yesno");

        // Apply plugins
        //control.optiongroup();

        // Bind change event
        control.bind("optiongroupchange", function (evt, ui) {
            // Only change the internal value when it truly changes
            if (self.value != ui.value) {
                self.setValue(ui.value);
            }
        });
        
        control.find(".ui-bizagi-render-boolean-radio").bind("click", function () {
            self.getControl().find(".ui-bizagi-render-boolean-radio").removeClass("ui-radio-state-checked");
            $(this).addClass("ui-radio-state-checked");
            var val = $(this).attr("value");
            if (self.value != val) {
                self.setValue(val);
            }
        });
    },

    /* SETS THE VALUE IN THE RENDERED CONTROL
    =====================================================*/
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
                var radioValue = parsedValue ? ".yes" : ".no";
                control.find(".ui-bizagi-render-boolean-radio" + radioValue).addClass("ui-radio-state-checked");
                //control.optiongroup("setValue", parsedValue.toString());
            }
        }
    }
});
