/**
*   Name: BizAgi Smartphone Render Check
*   Author: Bizagi Mobile Team
*   Comments: Check implementation for smartphone
*/

// Extends itself
bizagi.rendering.check.extend("bizagi.rendering.check", {}, {
    postRenderSingle: function() {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var container = self.getContainerRender();
        self.configureHelpText();

        //self.getArrowContainer().hide();
        // Personalize display of render
        self.element.find(".bz-container-render-cell > .ui-bizagi-render-control").addClass("bz-check-control");
        self.element.find(".bz-container-render-cell > .ui-bizagi-label").addClass("bz-check-label");
        self.element.find(".bz-container-render-cell > .ui-bizagi-render-control").insertBefore(self.element.find(".bz-container-render-cell > .ui-bizagi-label"));
        self.input = self.getControl().find("input");

        if (properties.editable) {
            container.addClass("bz-command-edit-inline");

            self.input.bind("click", function() {
                var isChecked = self.input.is(":checked");

                self.setValue(isChecked, true);
                isChecked ? self.input.removeClass("bz-unchecked").addClass("bz-check") : self.input.addClass("bz-unchecked").removeClass("bz-check");

                if (self.properties.submitOnChange) {
                    self.submitOnChange();
                }

                if(self.properties.required && !isChecked){
                    var requiredElement = self.element.find(".ui-bizagi-label .bz-rn-required");
                    requiredElement.length > 0 ? requiredElement.show() : self.element.find(".ui-bizagi-label").prepend('<div class="bz-rn-required"></div>');
                }
            });
        } else {
            container.addClass("bz-rn-non-editable");
        }
    },

    /* SET DISPLAY VALUE
    ======================================================*/
    setDisplayValue: function(value) {
        var self = this;
        var properties = self.properties;

        
        self.setValue(value, false);

        var parsedValue = "";
        if (properties.editable) {
            parsedValue = bizagi.util.parseBoolean(value);
        } else {
            parsedValue = bizagi.util.parseBoolean(self.properties.value);
        }

        self.input.prop("checked", parsedValue === true);
        self.input.toggleClass("bz-check", parsedValue === true).toggleClass("bz-unchecked", parsedValue !== true);
    }
});
