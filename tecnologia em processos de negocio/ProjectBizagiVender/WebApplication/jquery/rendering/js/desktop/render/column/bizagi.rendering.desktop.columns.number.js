/*
*   Name: BizAgi Desktop Number Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the number column decorator class to adjust to desktop devices
*/

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.number", {}, {

    /*
    *   Post process the element after it has been rendered
    */
    postRender: function (surrogateKey, cell) {
        // Call base
        this._super(surrogateKey, cell);

        // Apply styles to input
        var input = $("input", cell);
        this.applyColumnStyles(input);
    },
    renderSummary: function (key, value) {
        var self = this;
        return self.renderReadOnly(key, value);
    },
    postRenderSummary: function (key, value) {
        var self = this;
        self.postRenderReadOnly(key, value);
        return true;
    }
});
