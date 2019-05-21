/*
*   Name: BizAgi Tablet Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the column decorator class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.image", {}, {

    applyOverrides: function(decorated) {
        var properties = this.properties;
        this._super(decorated);

        decorated.getXpathContext = this.getImageXpathContext;

        decorated.getUploadXpath = this.getUploadXpath;

        decorated.setDisplayValue = function () {
            return true;
        };

        // Change xpath context
        // Taken from desktop version to fix non existence of "xpathContext" property
        if ( this.getMode() === "execution") {
            decorated.properties.xpathContext = ( properties.xpathContext ? properties.xpathContext + "." : "" ) + this.grid.properties.xpath + "[id=" + decorated.surrogateKey + "]";
        }
    },

    /**
     * Returns the xpath to be used
     * @returns string
     */
    getUploadXpath: function () {
        return this.grid.properties.xpath + "[id=" + this.surrogateKey + "]." + this.properties.xpath;
    },

    getImageXpathContext: function () {
        return ( this.column.properties.xpathContext ? this.column.properties.xpathContext + "." : "" ) + this.column.grid.properties.xpath + "[id=" + this.surrogateKey + "]";
    }

});
