/**
*   Name: BizAgi Smartphone Render Yes-No Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the Yes-No render class to adjust to smartphone devices
*/
bizagi.rendering.yesno.extend("bizagi.rendering.yesno", {}, {
    renderSingle: function() {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var container = self.getContainerRender();

        if (properties.editable) {
            if ((self.value == null || self.value === undefined) && (self.properties.value != null)) {
                self.value = properties.value;
            }

            self.input = self.getControl().find("> div");
            container.addClass("bz-command-edit-inline");

            self.input.change(function() {
                var selectedRadio = self.input.find("input:radio:checked");
                var nValue = selectedRadio.prop("value");

                if (self.value !== nValue) {
                    self.setValue(nValue);
                    self.setDisplayValue(nValue);

                    if (self.properties.submitOnChange) {
                        self.submitOnChange();
                    }
                }
            });

        } else {
            container.addClass("bz-rn-non-editable");
            self.input = control.append("<span class=\"bz-rn-non-editable bz-rn-align-class bz-rn-text\"></span>").find("span");
        }
    },

    /**
     * set the display value en the rendered control
     * */
    setDisplayValue: function(value) {
        var self = this;
        var properties = self.properties;

        self.setValue(value.toString().toLowerCase(), false);

        if (properties.editable) {
            var parsedValue = bizagi.util.parseBoolean(value);
            self.input.find(".bz-radio-true")
                .prop("checked", parsedValue === true)
                .toggleClass("bz-unchecked", parsedValue !== true)
                .toggleClass("bz-check", parsedValue === true);

            self.input.find(".bz-radio-false")
                .prop("checked", parsedValue === false)
                .toggleClass("bz-unchecked", parsedValue !== false)
                .toggleClass("bz-check", parsedValue === false);
        } else {
            this._super(value);
        }
    }
});