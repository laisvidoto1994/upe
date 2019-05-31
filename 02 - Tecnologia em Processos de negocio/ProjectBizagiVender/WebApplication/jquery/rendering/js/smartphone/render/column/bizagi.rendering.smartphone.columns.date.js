/*
*   Name: BizAgi tablet Date Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the date column decorator class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.date", {}, {
    applyOverrides: function (decorated) {
        this._super(decorated);
    }
	
});