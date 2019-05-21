/*
*   Name: BizAgi Smartphone Render Yes-No Extension
*   Author: Oscar O
*   Comments:
*   -   This script will redefine the Yes-No render class to adjust to smartphone devices
*/

// Extends itself
bizagi.rendering.yesno.extend("bizagi.rendering.yesno", {}, {

    renderSingle: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var container = self.getContainerRender();

        if (properties.editable) {

            self.getArrowContainer().css("visibility", "hidden");

            if ((self.value == null || self.value === undefined) && (self.properties.value != null)) {
                self.value = properties.value;
            }

            self.input = self.getControl().find("> span");
            container.addClass("bz-command-edit-inline");

            self.input.change(function () {
                var selectedRadio = self.input.find('input:radio:checked');
                var nValue = selectedRadio.prop('value');
                if (self.value != nValue) {
                    self.setValue(nValue);
                    self.setDisplayValue(nValue);

                    if (self.properties.submitOnChange) {
                        self.submitOnChange();
                    }

                }
            });

        }
        else {
            container.addClass("bz-command-not-edit");
            self.input = control.append("<span class=\"bz-command-not-edit bz-rn-text\"></span>").find("span");


        }
        /*   var newValue = { 
        id: selectedRadio.prop('value'), // The value is the Id LOL
        value: selectedRadio.siblings('label').text()
        };
        var allInputs = $('input[type=radio]', element)*/

    },

    /* SETS THE VALUE IN THE RENDERED CONTROL
    =====================================================*/
    setDisplayValue: function (value) {

        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        // Call base
        // this._super(value);
        self.setValue(value.toString().toLowerCase(), false);


        // Set value in control
        if (properties.editable) {

            var parsedValue = bizagi.util.parseBoolean(value);
            if (parsedValue == true) {
                self.input.find(".bz-radio-true").prop('checked', true);
                self.input.find(".bz-radio-false").prop('checked', false);
            } else {
                self.input.find(".bz-radio-false").prop('checked', true);
                self.input.find(".bz-radio-true").prop('checked', false);
            }
        }
        else {
            // self.input.html(value);
            //self.input.html(value.toString());
            // self.input.val(value);
            // control.find("span").html(value.toString());
            // Call base
            this._super(value);
        }
    }

});
