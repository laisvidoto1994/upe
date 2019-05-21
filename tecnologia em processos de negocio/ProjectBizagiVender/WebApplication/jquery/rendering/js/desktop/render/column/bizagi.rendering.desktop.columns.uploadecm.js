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
        this._super(decorated);

        // Hacks the upload render to add features
        decorated.getUploadXpath = this.getUploadXpath;
        // hack apply upload plugin method in order to execute it only when the control is inserted in the DOM
        var originalMethod = decorated.applyUploadPlugin;
        decorated.applyUploadPlugin = function () {
            var uploadRender = this;
            var control = uploadRender.getControl();

            originalMethod.apply(decorated, arguments);
            control.undelegate(".ui-bizagi-render-upload-item", "mouseover");
            control.undelegate(".ui-bizagi-render-upload-item", "mouseout");
            $(".ui-bizagi-render-upload-icon", control).css("display", "inline-block");

            // fix to firefox and chrome
            $(".ui-bizagi-render-upload-wrapper object", control).css({
                position: 'relative'
            });
        };

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
                    form = self.getFormContainer(),
                    data = {};

            var columnXpath = self.getUploadXpath(self.surrigateKey);
            columnXpath = columnXpath.split(".");
            var nameFile = columnXpath[columnXpath.length - 1];
            var xpathContext = self.getXpathContext(self.surrigateKey);

            data.url = properties.addUrl;
            data.xpath = properties.xpath;
            data.idAttrib = properties.idAttrib;
            data.xpathContext = xpathContext;
            data.metaValues = [];
            data.idPageCache = properties.idPageCache;
            data.idSession = form.properties.sessionId;
            data.contexttype = "entity";
            data.validExtensions =  properties.validExtensions,
            data.maxSize = properties.maxSize;

            return data;
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
        var cell;

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

        // Attach rendered handler
        self.bind("rendered", function () {
            self.readyDeferred.resolve();
        });

        return cell;
    },
    /*
    *   Post process the element after it has been rendered
    */
    postRenderReadOnly: function (surrogateKey, cell) {
        // Call base
        this._super(surrogateKey, cell);

        var self = this;
        var decorated = this.getDecorated(surrogateKey);
        if (decorated.files.length == 0) {
            var message = self.getResource("render-upload-no-files");
            $(".ui-bizagi-cell-readonly", cell).html(message);

            // Set cell icon to the right
            var cellIcon = $(".ui-bizagi-cell-icon", cell);
            cellIcon.addClass("ui-bizagi-cell-icon-right");
        } else {
            // Just draw render if the cell layout has been filled
            if (cell && cell.length > 0) {
                // Apply styles to cell
                self.applyColumnStyles(cell);
            }
        }
    },
    /*
    *   Post process the element after it has been rendered
    */
    postRender: function (surrogateKey, cell) {
        // Call base
        // this.postRenderReadOnly(surrogateKey, cell);

        // Call base
        this._super(surrogateKey, cell);

        var self = this;
        var mode = self.getMode();

        this.setSurrogateKey(surrogateKey);
        if (mode == "execution") {

            var decorated = this.getDecorated(surrogateKey);
            var control = decorated.getControl();

            // Check if its new row
            if (control.parents("tr").data("new-row")) {
                // Show message:  Please save record before to upload a file
                control.html(bizagi.localization.getResource('render-grid-column-upload-mandatory-key'));

                //Set the column with this attribute, so when the control is evaluated in isValid(), validated
                //also if it is required, and belongs from a new row
                self.isNewRow = true;
            } else {
                self.isNewRow = false;
            }
        }
    },
    /*
    *   Returns the xpath to be used  
    */
    getUploadXpath: function (surrogateKey) {
        surrogateKey = this.surrogateKey || surrogateKey || "";
        var self = this;
        var properties = self.properties;
        return properties.xpathContext.length > 0 ? properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + self.surrogateKey + "]." + self.properties.xpath : self.grid.properties.xpath + "[id=" + self.surrogateKey + "]." + self.properties.xpath;

    }


});
