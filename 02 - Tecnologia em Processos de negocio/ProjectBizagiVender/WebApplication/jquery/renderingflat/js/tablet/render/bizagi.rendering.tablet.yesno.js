/*
*   Name: BizAgi Tablet Render Yes-No Extension
*   Author: Bizagi Mobile Team
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

        // Bind change event
        control.bind("optiongroupchange", function (evt, ui) {
            // Only change the internal value when it truly changes
            if (self.value != ui.value) {
                self.setValue(ui.value);
            }
        });
        
        control.find(".ui-bizagi-render-boolean-radio").bind("click", function () {
            self.getControl().find(".ui-bizagi-render-boolean-radio").removeClass("ui-radio-state-checked");
            self.getControl().find(".ui-bizagi-render-boolean-radio").removeClass("bz-check").addClass("bz-unchecked");

            $(this).addClass("ui-radio-state-checked");
            $(this).addClass("ui-radio-state-checked").addClass("bz-check").removeClass("bz-unchecked");

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

        self.setValue(value.toString().toLowerCase(), false);

        // Set value in control
        if (value != null && properties.editable) {
            var parsedValue = bizagi.util.parseBoolean(value);
            control.find(".ui-bizagi-render-boolean-radio.yes")
                .prop("checked", parsedValue === true)
                .toggleClass("bz-unchecked", parsedValue !== true)
                .toggleClass("bz-check", parsedValue === true);

            control.find(".ui-bizagi-render-boolean-radio.no")
                .prop("checked", parsedValue === false)
                .toggleClass("bz-unchecked", parsedValue !== false)
                .toggleClass("bz-check", parsedValue === false);
        }else{
            // Call base
            this._super(value);
        }
    }
});
