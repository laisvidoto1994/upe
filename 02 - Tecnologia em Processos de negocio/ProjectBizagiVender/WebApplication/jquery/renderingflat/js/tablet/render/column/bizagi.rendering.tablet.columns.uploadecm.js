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

        decorated.getXpathContext = function () {
            var self = this;
            var properties = self.properties;
            return properties.xpathContext.length > 0 ? properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + self.surrogateKey + "]" : self.grid.properties.xpath + "[id=" + self.surrogateKey + "]";
        };
    },
    /*
    *   Returns the in-memory processed element when the element is read-only
    */
    renderReadOnly: function (surrogateKey, value) {
        var self = this;
        var cell = "<div></div>";

        var decorated = this.getDecorated(surrogateKey);
        decorated.setValue(value);
        self.setValue(surrogateKey, value);
        self.setSurrogateKey(surrogateKey);

        self.applyOverrides(decorated);
        // Set grid and id references to the control in order to render the content
        decorated.grid = this.grid;
        decorated.column = this;
        decorated.surrogateKey = surrogateKey;

        // Set ready deferred
        self.readyDeferred = new $.Deferred();

        // We need to render the inner control as read-only
        if (decorated.files.length > 0) {
            // Changes editable to false to render read-only
            var editable = this.properties.editable;
            decorated.properties.editable = false;
            cell = decorated.render("cell.upload");
        }
        return cell;
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
            return $(".ui-bizagi-cell-readonly", self.element || self.observableElement);
        } else {
            return $(".ui-bizagi-render-control", self.element || self.observableElement);
        }

    }

});
