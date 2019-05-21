/*
*   Name: BizAgi Tablet Text Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the text column decorator class to adjust to tablet devices
*/

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.upload", {}, {
     applyOverrides: function (decorated) {
        this._super(decorated);
    
        decorated.getUploadXpath = this.getUploadXpath;
        // hack apply upload plugin method in order to execute it only when the control is inserted in the DOM
         var originalMethod = decorated.applyUploadPlugin;

            decorated.getXpathContext = function () {
                var surrogateKey = this.surrogateKey || "";
                var self = this;
                var properties = self.properties;
                return properties.xpathContext.length > 0 ? properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + self.surrogateKey + "]" : self.grid.properties.xpath + "[id=" + self.surrogateKey + "]";
            };

            decorated.buildItemUrl = function (file) {
                var self = this;
                var properties = self.properties;

                var form = self.getFormContainer();
                var xpathContext = self.getXpathContext();
                var contextXpath = "";

                return self.dataService.getUploadFileUrl({
                    idRender: properties.id,
                    xpath: properties.xpath,
                    xpathContext: xpathContext,
                    idPageCache: properties.idPageCache,
                    fileId: file.id,
                    sessionId: form.properties.sessionId,
                    contexttype: properties.contexttype
                });
            };
   },

   getUploadXpath: function () {
        return this.grid.properties.xpath + "[id=" + this.surrogateKey + "]." + this.properties.xpath;
    }
    
});
