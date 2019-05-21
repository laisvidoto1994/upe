/**
*   Name: BizAgi Tablet Render Check
*   Author: Bizagi Mobile Team
*   Comments: Check implementation for tablet
*/

// Extends itself
bizagi.rendering.check.extend("bizagi.rendering.check", {}, {

    /**
     * Post render control
     * @returns {} 
     */
    postRender: function() {
        var self = this;

        // Call base
        self._super();

        self.input = self.getControl().find("input");

        // Bind changes to set value
        self.input.change(function() {
            var isChecked = self.input.is(":checked");
            if (isChecked) {
                self.input.removeClass("bz-unchecked").addClass("bz-check");
            } else {
                self.input.addClass("bz-unchecked").removeClass("bz-check");
            }
            self.setValue(isChecked);
        });
    },

    /**
     * Set display value
     * @param {} value 
     * @returns {} 
     */
    setDisplayValue: function(value) {
        var self = this;
        var properties = self.properties;
        var input = self.getControl().find("input");

        self.setValue(value, false);

        var parsedValue = "";
        if (properties.editable) {
            parsedValue = bizagi.util.parseBoolean(value);
        } else {
            parsedValue = bizagi.util.parseBoolean(self.properties.value);
        }

        input.prop("checked", parsedValue === true);
        input.toggleClass("bz-check", parsedValue === true).toggleClass("bz-unchecked", parsedValue !== true);
    }
});
