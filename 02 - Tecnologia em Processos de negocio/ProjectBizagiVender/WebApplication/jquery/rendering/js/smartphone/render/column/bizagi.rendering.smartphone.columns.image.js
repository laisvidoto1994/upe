/*
*   Name: BizAgi smartphone Column Decorator Extension
*   Author: oscaro
*   Comments:
*   -   This script will redefine the column decorator class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.image", {}, {

    applyOverrides: function (decorated) {
        var self = this;
        var properties = self.properties;
        this._super(decorated);
        var propertiesGrid = (self.grid.properties != "undefined") ? self.grid.properties : decorated.grid.properties;
        decorated.getUploadXpath = this.getUploadXpath;
        decorated.properties.xpathContext = properties.xpathContext.length > 0 ?
                                                properties.xpathContext + "." + propertiesGrid.xpath + "[id=" + decorated.surrogateKey + "]" :
                                                propertiesGrid.xpath + "[id=" + decorated.surrogateKey + "]";
        decorated.setDisplayValue = function () { return true; };
    },

    /*
    *   Returns the xpath to be used  
    */
    getUploadXpath: function () {
        return this.grid.properties.xpath + "[id=" + this.surrogateKey + "]." + this.properties.xpath;
    }

});