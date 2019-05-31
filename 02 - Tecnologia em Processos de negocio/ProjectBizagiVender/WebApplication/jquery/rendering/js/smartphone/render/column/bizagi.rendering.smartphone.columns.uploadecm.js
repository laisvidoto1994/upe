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
        var self = this;
        self._super(decorated);

        if (decorated && decorated.getControl) {
            self.originalGetControl = decorated.getControl;
            decorated.getControl = self.getControl;
        }

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
            var self = this,
                    properties = self.properties,
                    data = {};
            data.fileExt = properties.validExtensions;
            data.fileDesc = properties.validExtensions ? self.getResource("render-upload-allowed-extensions") + properties.validExtensions : "",
            data.xPath = self.getXpathContext() + "." + properties.xpath;
            data.idAttrib = properties.idAttrib;
            data.xpathContext = properties.xpathContext;
            data.metaValues = [];
            data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = properties.idPageCache;

            return data;
        };

        decorated.getXpathContext = function () {
            var self = this;
            var properties = self.properties;
            return properties.xpathContext.length > 0 ? properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + self.surrogateKey + "]" : self.grid.properties.xpath + "[id=" + self.surrogateKey + "]";
        };
    },

    /*
    *   Post process the element after it has been rendered
    */

    getUploadXpath: function (surrogateKey) {
        surrogateKey = this.surrogateKey || surrogateKey || "";
        return this.grid.properties.xpath + "[id=" + surrogateKey + "]." + this.properties.xpath;
    },



    getControl: function () {
        var self = this;
        var result = self._super();

        if (!result || result.length == 0) {
            return  $(".ui-bizagi-cell-readonly", self.element || self.observableElement);
        } else {
            return  $(".ui-bizagi-render-control", self.element || self.observableElement);
        }
        
    }


});
