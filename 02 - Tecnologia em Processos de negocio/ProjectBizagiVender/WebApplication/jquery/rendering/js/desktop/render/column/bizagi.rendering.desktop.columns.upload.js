/*
 *   Name: BizAgi Desktop Text Column Decorator Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the text column decorator class to adjust to desktop devices
 */

// Extends from column
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.upload", {}, {
    /*
    *   Apply custom overrides to each decorated instance
    */
    applyOverrides: function (decorated) {
        var self = this;
        this._super(decorated);
        var mode = self.getMode();
        // Hacks the upload render to add features
        decorated.getUploadXpath = this.getUploadXpath;
        // hack apply upload plugin method in order to execute it only when the control is inserted in the DOM
        if (mode != "design" && mode != "layout") {

            var originalMethod = decorated.applyUploadPlugin;

            decorated.getXpathContext = function () {
                var surrogateKey = this.surrogateKey || "";
                var self = this;
                var properties = self.properties;
                return properties.xpathContext.length > 0 ? properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + self.surrogateKey + "]" : self.grid.properties.xpath + "[id=" + self.surrogateKey + "]";
            };

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

                $(".ui-bizagi-render-upload-queue", control).css({
                    'max-width': "150px"
                });

            };

            decorated.postRender = function () {
                var self = this;
                var control = self.getControl();

                if (self.properties.allowSendInMail) {                   
                    self.bindEmailDialog();
                }

                //Set control container to behave as a block 
                control.addClass("ui-bizagi-render-display-block");
                control.addClass("ui-bizagi-render-upload");
                self.checkMaxFiles();
            };

            decorated.buildItemUrl = function (file) {
                var self = this,
                        properties = self.properties;

                var form = self.getFormContainer();

                return self.dataService.getUploadFileUrl({
                    idRender: properties.id,
                    xpath: self.getUploadXpath(),
                    xpathContext: properties.xpathContext,
                    idPageCache: properties.idPageCache,
                    fileId: file.id,
                    sessionId: form.properties.sessionId,
                    contexttype: properties.contexttype
                });
            };
        }

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

        decorated.processUploadFile = function () {
            var self = this;
            var dialogBox = self.dialogBox;
            var defer = new $.Deferred();
            var uploadForm = $("form", dialogBox);
            var uploadIFrame = $("iframe", uploadForm);
            var xpathContext = self.getXpathContext();

            // Change xpath context within form element
            $("[name=h_xpathContext]", uploadForm).val(xpathContext);


            // When the iframe loads the user we need to evaluate the response and close the dialog
            var timeoutFn = function () {
                try {
                    var response = "";
                    if (uploadIFrame[0].contentWindow) {
                        var iframeContent = bizagi.util.isIE8() ? $(uploadIFrame[0].contentWindow.document.body) : $(uploadIFrame[0].contentWindow.eval("document.body"));

                        response = iframeContent.text();
                        //response = $("pre", iframeContent).length == 0 ? iframeContent[0].innerHTML : $("pre", iframeContent)[0].innerHTML;
                    }
                    if (response.length > 0) {
                        defer.resolve(response);
                    } else {
                        setTimeout(timeoutFn, 50);
                    }
                } catch (e) {
                    // Nothing todo, just close the window and show error message
                    self.closeUploadDialog();
                    window.alert(e.toString());
                }
            };
            // Execute the timed function in order to check when the response has arrived
            timeoutFn();

            // Submit the form
            uploadForm.submit();

            return defer.promise();
        };
    },
    /*
    *   Returns the in-memory processed element when the element is read-only
    */
    renderReadOnly: function (surrogateKey, value) {
        var self = this;
        var cell;

        var decorated = this.getDecorated(surrogateKey);
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
            decorated.properties.editable = editable;
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
        this._super(surrogateKey, cell);

        var self = this;
        var mode = self.getMode();

        this.setSurrogateKey(surrogateKey);
        
        if (mode != "design") {

            var decorated = this.getDecorated(surrogateKey);
            var control = decorated.getControl();

            // Check if its new row
            if (control.parents("tr").data("new-row")) {
                // Show message:  Please save record before to upload a file
                control.html(bizagi.localization.getResource('render-grid-column-upload-mandatory-key'));

                //Set the column with this attribute, so when the control is evaluated in isValid(), validated
                //also if it is required, and belongs from a new row
                self.isNewRow = true;
            }
            else{
                self.isNewRow = false;
            }
        }
    },
    /*
    *   Returns the xpath to be used  
    */
    getUploadXpath: function () {
        return this.grid.properties.xpath + "[id=" + this.surrogateKey + "]." + this.properties.xpath;
    }
});
