/*
*   Name: BizAgi Tablet Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the column decorator class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.image", {}, {

    applyOverrides: function (decorated) {
        var self = this;
        var properties = self.properties;
        this._super(decorated);

        decorated.getUploadXpath = this.getUploadXpath;
        decorated.properties.xpathContext = properties.xpathContext.length > 0 ?
                    properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + decorated.surrogateKey + "]" :
                    self.grid.properties.xpath + "[id=" + decorated.surrogateKey + "]";
    },

    /*
    *   Returns the xpath to be used  
    */
    getUploadXpath: function () {
        return (this.grid.properties.xpath || this.properties.xpath ) + "[id=" + this.surrogateKey + "]." + this.properties.xpath;
    }
    
});
