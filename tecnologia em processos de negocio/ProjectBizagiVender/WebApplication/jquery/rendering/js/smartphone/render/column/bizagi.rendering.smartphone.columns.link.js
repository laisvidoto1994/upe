/*
*   Name: BizAgi Tablet Link Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the link column decorator class to adjust to tablet devices
*/

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.link", {}, {
    applyOverrides: function (decorated) {
        this._super(decorated);

        var self = this,
            mode = self.getMode();

        if (mode != "design" && mode != "layout") {
            self.surrogateKey = decorated.surrogateKey;
            decorated.getXpath = this.getXpath;
            decorated.getContextXpath = this.getContextXpath;
            decorated.properties.xpathContext = self.getContextXpath();
        }
    },

    /*
    *   Apply custom overrides to each decorated instance
    */
    getXpath: function (xpath) {
        var xpathPath = xpath,
        	index = xpathPath.indexOf(this.grid.properties.xpath);

        if (index != -1) {
            xpathPath = xpathPath.substr(index + this.grid.properties.xpath.length + 1);
        }

        return this.grid.properties.xpath + "[id=" + this.surrogateKey + "]." + xpathPath;
    },

    /*
    *   Returns the xpath to be used  
    */
    getContextXpath: function () {
        return this.grid.properties.xpath + "[id=" + this.surrogateKey + "]";
    }
});
