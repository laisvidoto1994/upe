/*
*   Name: BizAgi Desktop Text Column Decorator Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the text column decorator class to adjust to desktop devices
*/

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.uploadecm", {}, {
    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
        this._super(decorated);

        decorated.getXpathContext = this.getECMXpathContext;

        decorated.getUploadXpath = this.getUploadXpath;

        decorated.buildItemUrl = function (file) {
            var self = this;
            var properties = self.properties;

            var form = self.getFormContainer();

            var columnXpath = self.getUploadXpath(self.surrigateKey);
            columnXpath = columnXpath.split(".");
            var nameFile = columnXpath[columnXpath.length - 1];
            var xpathContext = self.getXpathContext(self.surrigateKey);

            return self.dataService.getUploadFileUrl({
                idRender: properties.id,
                xpath: nameFile,
                xpathContext: xpathContext,
                idPageCache: properties.idPageCache,
                fileId: file.idFileUpload,
                sessionId: form.properties.sessionId,
                contexttype: properties.contexttype
            });
        };

        decorated.buildAddParams = function () {
            var properties = this.properties,
                form = this.getFormContainer();

            return {
                url: properties.addUrl,
                h_xpath: properties.xpath,
                idAttrib: properties.idAttrib,
                xpathContext: this.getXpathContext(this.surrigateKey),
                xPath: properties.xpath,
                p_sessionId: form.properties.sessionId,
                h_contexttype: "entity",
                h_pageCacheId: properties.idPageCache
            };

        };

    },
 
    /*
    *   Post process the element after it has been rendered
    */
   
    getUploadXpath: function (surrogateKey) {
        surrogateKey = this.surrogateKey || surrogateKey || "";
        return this.grid.properties.xpath + "[id=" + surrogateKey + "]." + this.properties.xpath;
    },


    getECMXpathContext: function () {
        return ( this.column.properties.xpathContext ? this.column.properties.xpathContext + "." : "" ) + this.column.grid.properties.xpath + "[id=" + this.surrogateKey + "]";
    }
});
