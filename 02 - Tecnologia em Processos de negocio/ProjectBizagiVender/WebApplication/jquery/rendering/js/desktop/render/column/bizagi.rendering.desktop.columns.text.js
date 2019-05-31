/*
*   Name: BizAgi Desktop Text Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the text column decorator class to adjust to desktop devices
*/

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.text", {}, {

    /*
    *   Post process the element after it has been rendered
    */
    postRender: function (surrogateKey, cell) {
        // Call base
        this._super(surrogateKey, cell);

        // Apply styles to input
        var input = $("input, textarea", cell);
        this.applyColumnStyles(input);
    },

    postRenderReadOnly: function (surrogateKey, cell) {
        var self = this;
        var properties = self.properties;

        if (properties.autoExtend) {
            var readOnly = cell.find(".ui-bizagi-cell-readonly");
            if (readOnly.length > 0) {
                readOnly.css("max-height", "none");
            }
        }

        self._super(surrogateKey, cell);
    },

    attachRetypeDouble: function () {
        var self = this;
        var element = self.element;

        var input = $("input", element);
        if (!input || input.length == 0) return;

        // Apply blur handler to check value
        input.blur(function () {
            var control = $(this);
            var previousValue = self.previousValue;
            var value = self.value;
            
            if (previousValue != null && value != previousValue) {
                if ($(this).data("newValue") != undefined && control.val() != $(this).data("newValue")) {
                    $(this).data().newValue = undefined;
                }
            }
            self.retypeDouble(control);
           
        });
    }
});
