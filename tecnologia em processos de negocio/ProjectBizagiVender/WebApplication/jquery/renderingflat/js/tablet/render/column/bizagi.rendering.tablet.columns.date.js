/*
*   Name: BizAgi Desktop Date Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the date column decorator class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.date", {}, {
    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
        this._super(decorated);
    }   
});