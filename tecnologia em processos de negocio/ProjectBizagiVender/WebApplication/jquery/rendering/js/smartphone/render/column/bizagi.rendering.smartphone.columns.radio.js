/*
*   Name: BizAgi Smartphone Radio Column Decorator Extension
*   Author: Richar Urbano
*   Comments:
*   -   This script will redefine the text column decorator class to adjust to smartphone devices
*/

// Extends from column
bizagi.rendering.columns.combo.extend("bizagi.rendering.columns.radio", {}, {
    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
        this._super(decorated);
    }
});
