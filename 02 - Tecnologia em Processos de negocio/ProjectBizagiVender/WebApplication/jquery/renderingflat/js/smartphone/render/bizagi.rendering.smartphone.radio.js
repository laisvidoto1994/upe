/*  
 *   Name: BizAgi Smartphone Render list Extension
*   Author: Bizagi Mobile Team
 *   Comments:
 *   -   This script will redefine the list render class to adjust to tablet devices
 */

// Extends from base list
bizagi.rendering.radio.extend('bizagi.rendering.radio', {}, {

    /* POSTRENDER
    ======================================================*/
    renderSingle: function() {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var deferred = $.Deferred();

        self.getArrowContainer().hide();
        $.when(self.renderControl()).done(function() {
            self.input = self.combo = $(".ui-bz-render-radio", self.getControl());

            if (self.value)
                self.setValue(self.value, false);

            if (properties.editable) {
                container.addClass("bz-command-edit-inline");

                self.input.change(function() {
                    var selectedRadio = self.input.find("input:radio:checked");
                    self.input.find(".checked").removeClass("checked");
                    self.input.find(".bz-check").addClass("bz-unchecked").removeClass("bz-check");

                    selectedRadio.closest("div").addClass("checked");
                    selectedRadio.addClass("bz-check");
                    selectedRadio.removeClass("bz-unchecked");

                    var newValue = { id: selectedRadio.prop("value"), value: selectedRadio.parent().text() };
                    self.setValue(newValue);

                    if (self.properties.submitOnChange) {
                        self.submitOnChange();
                    }
                });
            } else {
                container.addClass("bz-rn-non-editable");
                self.input = self.combo = self.getControl().html("<span class=\"bz-rn-non-editable bz-rn-align-class bz-rn-text\"></span>").find("span");
            }

            deferred.resolve();

        });

        return deferred.promise();
    },

    /* SETS DISPLAY VALUE
    ======================================================*/
    setDisplayValue: function(value) {

        var self = this;
        var properties = self.properties;

        if (properties.editable) {
            if (value !== undefined && value.id != null) {
                // Find the control to check where value is
                var radioItem = self.input.find("input[type='radio'][value='" + value.id + "']");
                radioItem.prop("checked", "checked");
                radioItem.closest("div").addClass("checked");
                radioItem.addClass("bz-check").removeClass("bz-unchecked");
            }
        } else {
            if (value !== undefined && value.id != null) {
                // Find the control to check where value is
                self.input.html((value.value ? value.value.toString() : ""));
                self.input.attr("id", value.id);
            }
        }
    },

    /**
     * Cleans current data
     */
    cleanData: function () {
        var self = this;
        var value = { id: "", label: "" };
        var selectedItem = self.element.find(".checked").removeClass("checked");

        selectedItem.find(".bz-rn-radio-item").prop("checked", false).removeClass("bz-check").addClass("bz-unchecked");
        self.setValue(value, false);
    }
});
