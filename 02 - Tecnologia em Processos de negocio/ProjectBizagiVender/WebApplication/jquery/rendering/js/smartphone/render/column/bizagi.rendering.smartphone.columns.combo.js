/*
*   Name: BizAgi Tablet Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the column decorator class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.columns.combo.extend("bizagi.rendering.columns.combo", {}, {

    applyOverrides: function (decorated) {
        // Hacks the getControl method in the decorated render to add features
        var self = this;
        self._super(decorated);
        if (decorated && decorated.getControl) {
            self.originalGetControl = decorated.getControl;
            decorated.getControl = self.getControl;
            decorated.properties.displayType = "normal";
        }
    },

    /*
    *   Template method to get the control element
    *   This code runs under the decorated element context
    */
    getControl: function () {
        var self = this;
        var result = self._super();

        if (!result || result.length == 0) {
            result = $(".ui-bizagi-cell-readonly", self.element || self.observableElement);
        }

        return result;
    }

});
