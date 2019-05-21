/*
*   Name: BizAgi Tablet Link Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the link column decorator class to adjust to tablet devices
*/

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.link", {}, {
    applyOverrides: function(decorated) {
        var self = this;
        var mode = self.getMode();

        self._super(decorated);

        if (mode !== "design" && mode !== "layout") {
            self.surrogateKey = decorated.surrogateKey;
            decorated.getXpath = self.getXpath;
            decorated.getContextXpath = self.getContextXpath;
            decorated.properties.xpathContext = self.getContextXpath();
        }
    },

    /*
    *   Apply custom overrides to each decorated instance
    */
    getXpath: function(xpath) {
        var self = this;
        var xpathPath = xpath;
        var index = xpathPath.indexOf(self.grid.properties.xpath);

        if (index !== -1) {
            xpathPath = xpathPath.substr(index + self.grid.properties.xpath.length + 1);
        }

        return self.grid.properties.xpath + "[id=" + self.surrogateKey + "]." + xpathPath;
    },

    /*
    *   Returns the xpath to be used  
    */
    getContextXpath: function() {
        var self = this;

        return self.grid.properties.xpath + "[id=" + self.surrogateKey + "]";
    }
});
