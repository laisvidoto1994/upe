/*
*   Name: BizAgi Desktop Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the column decorator class to adjust to desktop devices
*/


// Extends itself
bizagi.rendering.columns.combo.extend("bizagi.rendering.columns.combo", {}, {

    /*
    *   Post process the element after it has been rendered
    */
    postRender: function (surrogateKey, cell, tableCell) {
        // Call base
        this._super(surrogateKey, cell, tableCell);

        var self = this,
            mode = self.getMode();

        // Apply styles to input
        var input = $(".ui-selectmenu-status", cell);
        this.applyColumnStyles(input);

        // Remove padding for td
        if (this.properties.editable && tableCell) {
            tableCell.addClass("ui-bizagi-cell-combo");
        }

        if (mode == "execution") {

            var decorated = this.getDecorated(surrogateKey),
                control = decorated.getControl();

            // Check if its new row
            if (control.parents("tr").data("new-row")) {
                //Set the column with this attribute, so when the control is evaluated in isValid(), validated
                //also if it is required, and belongs from a new row
                self.isNewRow = true;
            } else {
                self.isNewRow = false;
            }
        }
    },
    /*renderReadOnly: function (surrogateKey, value) {
        var self = this;
        return value
    },*/
    /*
    *   Post process the element after it has been rendered
    */
    postRenderReadOnly: function (surrogateKey, cell, tableCell) {
        // Call base
        this._super(surrogateKey, cell, tableCell);

        // Apply styles to input
        var input = $(".ui-selectmenu-status", cell);
        this.applyColumnStyles(input);

        // Add padding for td
        if (tableCell)
            tableCell.removeClass("ui-bizagi-cell-combo");
    },

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

            self.value = self.properties.value = self.selectedValue = { id: 0, value: self.getResource("render-combo-empty-value") };
            self.setValue(self.value);
            var control = self.getControl();
            var input = control.find("input");
            if (input) {
                input.val(self.getValue().value);
            }
        };
    }
});
