/*
*   Name: BizAgi Desktop Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the column decorator class to adjust to desktop devices
*/


// Extends itself
bizagi.rendering.columns.search.extend("bizagi.rendering.columns.search", {}, {

    /*
    *   Post process the element after it has been rendered
    */
    postRender: function (surrogateKey, cell) {
        // Call base
        this._super(surrogateKey, cell);

        var decorated = this.getDecorated(surrogateKey);
        // Apply styles to input
        var input = $(".ui-selectmenu-status", decorated.getControl());
        this.applyColumnStyles(input);

        // Remove padding for td
        if (this.properties.editable) {
            decorated.getControl().addClass("ui-bizagi-cell-search");
        }
    },

    /*
    *   Post process the element after it has been rendered
    */
    postRenderReadOnly: function (surrogateKey, cell, tableCell) {
        // Call base
        this._super(surrogateKey, cell);

        // Apply styles to input
        var input = $(".ui-selectmenu-status", cell);
        this.applyColumnStyles(input);
        // Add padding for td
    }
});
