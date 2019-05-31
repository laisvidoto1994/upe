/*  
 *   Name: BizAgi Tablet Render list Extension
 *   Author: Bizagi Mobile Team
 *   Comments:
 *   -   This script will redefine the list render class to adjust to tablet devices
 */

// Extends from base list
bizagi.rendering.radio.extend('bizagi.rendering.radio', {}, {

    /**
     * Post render
     * @returns {} 
     */
    postRender: function () {
        var self = this;

        // Call base 
        this._super();

        self.combo = self.getControl();

        // Set control container to behave as a block
        self.combo.addClass("ui-bizagi-render-control-radio");

        // Help Text Control
        self.configureHelpText();

        // Bind changes to set value
        self.combo.change(function () {
            var selectedRadio = self.combo.find("input:radio:checked");

            self.combo.find(".checked").removeClass("checked");
            self.combo.find(".bz-check").addClass("bz-unchecked").removeClass("bz-check");

            selectedRadio.closest("div").addClass("checked");
            selectedRadio.addClass("bz-check");
            selectedRadio.removeClass("bz-unchecked");

            // The value is the Id LOL
            var newValue = {
                id: selectedRadio.prop("value"),
                value: selectedRadio.siblings("label").text()
            };

            self.setValue(newValue);
        });
    },

    /**
     * Set display value
     * @param {} value 
     * @returns {} 
     */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        if (properties.editable) {
            if (value !== undefined && value.id != null) {
                // Find the control to check where value is
                var comboItem = self.combo.find("input[type='radio'][value='" + value.id + "']");
                comboItem.prop("checked", "checked");
                comboItem.closest("div").addClass("checked");
                comboItem.addClass("bz-check").removeClass("bz-unchecked");
            }
        }
    },

    /**
     * Set display readonly
     * @returns {} 
     */
    postRenderReadOnly: function () {
        var self = this;
        var container = self.getControl();

        self._super();

        container.addClass("bz-rn-read-only");

        // Help Text Control
        self.configureHelpText();
    },

    /**
     * Cleans current data
     */
    cleanData: function () {
        var self = this;
        var value = { id: "", label: "" };
        var selectedItem = self.element.find(".ui-bizagi-render-radio-item .bz-check");

        selectedItem.prop("checked", false).removeClass("bz-check").addClass("bz-unchecked");
        self.setValue(value, false);
    }
});
