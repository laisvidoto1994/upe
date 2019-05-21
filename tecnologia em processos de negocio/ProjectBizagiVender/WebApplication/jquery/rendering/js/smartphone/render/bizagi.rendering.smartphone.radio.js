/*  
 *   Name: BizAgi Smartphone Render list Extension
 *   Author: oscar o
 *   Comments:
 *   -   This script will redefine the list render class to adjust to tablet devices
 */

// Extends from base list
bizagi.rendering.radio.extend('bizagi.rendering.radio', {}, {

    /* POSTRENDER
    ======================================================*/
    renderSingle: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var container = self.getContainerRender();
        var deferred = $.Deferred();
        self.getArrowContainer().css("visibility", "hidden");
        $.when(self.renderControl()).done(function () {
            self.input = self.combo = $(".ui-bz-render-radio", self.getControl());

            if (self.value)
                self.setValue(self.value, false);

            if (properties.editable) {
                container.addClass("bz-command-edit-inline");
                // self.input = self.combo;
                //un bug iphone 4
                //bizagi.util.isIphoneAndLessIOS4 
                self.input.change(function () {
                    var selectedRadio = self.input.find('input:radio:checked');
                    self.input.find(".checked").removeClass("checked");
                    selectedRadio.closest("div").addClass('checked');
                    var newValue = {
                        id: selectedRadio.prop('value'),
                        value: selectedRadio.parent().text()
                    };
                    self.setValue(newValue);
                    if (self.properties.submitOnChange) {
                        self.submitOnChange();
                    }


                });

            } else {

                container.addClass("bz-command-not-edit");
                self.input = self.combo = self.getControl().html("<span class=\"bz-command-not-edit bz-rn-text\"></span>").find("span");
               // self.getControl().find(".bz-rn-cm-text-label").parent().addClass("disabled");
               //  self.getControl().find(".bz-rn-cm-text-label").closest(".bz-rn-combo-cn-select-div").addClass("disabled");
            }
            deferred.resolve();

        });

        return deferred.promise();
    },

    /* SETS DISPLAY VALUE
    ======================================================*/
    setDisplayValue: function (value) {

        var self = this;
        var properties = self.properties;

        if (properties.editable) {
            if (value !== undefined && value.id != null) {
                var radioItem = self.input.find('input[type="radio"][value="' + value.id + '"]');
                // Find the control to check where value is
                radioItem.prop('checked', 'checked');
                radioItem.closest("div").addClass('checked');


            }
        } else {

            if (value !== undefined && value.id != null) {
                // Find the control to check where value is
                self.input.html((value.value ? value.value.toString() : ""));
                self.input.attr("id", value.id);
                //self.combo.find('input[type="radio"][value=' + value.id + ']').prop('checked', 'checked');
            }

        }
    }
});
