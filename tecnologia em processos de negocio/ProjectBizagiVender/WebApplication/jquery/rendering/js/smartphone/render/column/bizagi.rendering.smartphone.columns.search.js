/*
*   Name: BizAgi Tablet Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the column decorator class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.columns.search.extend("bizagi.rendering.columns.search", {}, {

    applyOverrides: function (decorated) {

        var self = this;
        self._super(decorated);


        self.originaldisplayType = decorated.properties.displayType ;
        decorated.properties.displayType ="normal";//smartphone requires to show it's label

    }





});
