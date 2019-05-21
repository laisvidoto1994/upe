/*
*   Name: BizAgi smartphone Text Column Decorator Extension
*   Author: OscarO
*   Comments:
*   -   This script will redefine the text column decorator class to adjust to smartphones devices
*/

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.upload", {}, {
    applyOverrides: function (decorated) {
        this._super(decorated);
        var self = this,
            mode = self.getMode();

        if (mode != "design" && mode != "layout") {

            decorated.getUploadXpath = this.getUploadXpath;

            decorated.getXpathContext = function () {

                var surrogateKey = this.surrogateKey || "",
                    properties = self.properties,
                    columnXpath = self.getUploadXpath(decorated),
                    columnXpathSplit = columnXpath.split("."),
                    nameFile = columnXpathSplit[columnXpathSplit.length - 1],
                    xpathContext = properties.xpathContext.length > 0 ? properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + surrogateKey + "]" : self.grid.properties.xpath + "[id=" + surrogateKey + "]";

                return { xpathContext: xpathContext, nameFile: nameFile };
            };



            decorated.buildItemUrl = function (file) {
                var selfIntern = this;
                var properties = selfIntern.properties;

                var form = selfIntern.getFormContainer();
                var context = selfIntern.getXpathContext();

                return selfIntern.dataService.getUploadFileUrl({
                    idRender: properties.id,
                    xpath: context.nameFile,
                    xpathContext: context.xpathContext,
                    idPageCache: properties.idPageCache,
                    fileId: file.id,
                    sessionId: form.properties.sessionId,
                    contexttype: properties.contexttype
                });
            };

        }
    },

    /*
    *   Returns the xpath to be used  
    */
    getUploadXpath: function (decorated) {
        return (decorated || this).grid.properties.xpath + "[id=" + (decorated || this).surrogateKey + "]." + (decorated || this).properties.xpath;
    }
});
