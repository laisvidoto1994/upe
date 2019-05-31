/*
 *   Name: BizAgi Desktop Radio Column Decorator Extension
 *   Author: Paola Herrera
 *   Comments:
 *   -   This script will redefine the text column decorator class to adjust to desktop devices
 */

// Extends from column
bizagi.rendering.columns.combo.extend("bizagi.rendering.columns.radio", {}, {
    /*
     *   Apply custom overrides to each decorated instance
     */
    applyOverrides: function (decorated) {
        var self = this;
        this._super(decorated);
        // Hacks the upload render to add features
        decorated.getUploadXpath = this.getUploadXpath;

        decorated.cleanData = function () {
            var self = this;
            var value = { id: "", label: "" };
            var selectedItem = self.element.find(".ui-radio-state-checked");

            selectedItem.removeClass("ui-radio-state-checked");
            self.setDisplayValue(value);
            self.setValue(value);
        };
    }
});
