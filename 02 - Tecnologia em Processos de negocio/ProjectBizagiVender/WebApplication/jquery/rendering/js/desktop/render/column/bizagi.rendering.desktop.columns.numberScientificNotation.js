/*
 *   Name: BizAgi Desktop NumberScientificNotation Column Decorator Extension
 *   Author: Laura Ariza
 *   Comments:
 *   -   This script define a render control that support scientific notation format in a column
 */

bizagi.rendering.columns.column.extend("bizagi.rendering.columns.numberScientificNotation", {}, {
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