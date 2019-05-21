/*
*   Name: BizAgi Desktop Radio Column Decorator Extension
*   Author: Maria Camila Angel
*   Comments:
*   -   This script will redefine the text column decorator class to adjust to desktop devices
*/

// Extends from column
bizagi.rendering.columns.combo.extend("bizagi.rendering.columns.list", {}, {
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
            var control = self.getControl();
            var selected = control.find(".ui-state-active");
            var newValue = self.getValue();

            self.value = self.properties.value = self.selectedValue = { id: "", value: "" };
            self.selectedValue = newValue.value;
            selected.removeClass("ui-state-focus ui-selected ui-state-active");
        };
    }
});
