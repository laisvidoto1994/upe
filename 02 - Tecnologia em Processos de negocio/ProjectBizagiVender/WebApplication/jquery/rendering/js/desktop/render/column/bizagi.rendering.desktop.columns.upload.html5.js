/*
*   Name: BizAgi Desktop Render Column Upload Extension (html5 compatibility)
*   Author: Christian Collazos
*   Comments:
*   -   This script will redefine the upload render class in order to provide a compatibility to browsers without flash installed
*/

// Extends itself
bizagi.rendering.columns.column.extend("bizagi.rendering.columns.uploadHtml5", {}, {
    /*
    *   Template method to implement in each children to customize each control
    */
    applyOverrides: function (decorated) {
        var self = this;
        this._super(decorated);
        var mode = self.getMode();
        // Hacks the upload render to add features
        decorated.processUploadFile = this.processUploadFile;
        decorated.getUploadXpath = this.getUploadXpath;

        if (mode != "design" && mode != "layout") {

            decorated.getXpathContext = function () {
                var surrogateKey = this.surrogateKey || "";
                var self = this;
                var properties = self.properties;
                return properties.xpathContext.length > 0 ? properties.xpathContext + "." + self.grid.properties.xpath + "[id=" + self.surrogateKey + "]" : self.grid.properties.xpath + "[id=" + self.surrogateKey + "]";
            };

            decorated.buildItemUrl = function (file) {
                var self = this,
                        properties = self.properties;

                var form = self.getFormContainer();

                return self.dataService.getUploadFileUrl({
                    idRender: properties.id,
                    xpath: properties.xpath,
                    xpathContext: self.getXpathContext(),
                    idPageCache: properties.idPageCache,
                    fileId: file.id,
                    sessionId: form.properties.sessionId,
                    contexttype: properties.contexttype
                });
            };


        }

    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function (surrogateKey, cell) {

        // Call base
        this._super(surrogateKey, cell);

        var self = this;
        var mode = self.getMode();
        //var control = self.getControl();


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
            else {
                self.isNewRow = false;
            }
        }


        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-upload");
    },

    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();
        self.isClicked = false;

        if (self.properties.allowSendInMail) {
            self.bindEmailDialog();
        }

        //self.checkMaxFiles();

        //Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-upload");
    },

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
    *   Process an upload file into the server
    */
    processUploadFile: function () {
        var self = this;
        // var defer = new $.Deferred();
        var dialogBox = self.dialogBox;
        var uploadForm = $("form", dialogBox);
        var input = $("input:file", uploadForm);
        // get form data for POSTing
        var vFD = new FormData();
        vFD.append("h_xpath", self.getUploadXpath());
        vFD.append("h_idRender", self.properties.idRender);
        vFD.append("h_xpathContext", self.properties.xpathContext);
        vFD.append("h_pageCacheId", self.properties.idPageCache);
        vFD.append("h_sessionId", self.properties.sessionId);
        vFD.append(self.getUploadXpath(), input.get(0).files[0]);

        // create XMLHttpRequest object, adding few event listeners, and POSTing our data
        var oXHR = new XMLHttpRequest();

        //Attach Handlers events
        oXHR.onload = function (e) {
            control = self.getControl();
            var uploadWrapper = $(".ui-bizagi-render-upload-wrapper", control);
            try {
                result = JSON.parse(this.response);

                if (result.type != "error") {
                    var newItem = self.renderUploadItem({ id: result.id, fileName: result.fileName });
                    self.files.push([result.id, result.fileName]);

                    // Locate it after the upload wrapper
                    uploadWrapper.after($(newItem));

                    // Increment counter
                    self.filesCount = self.filesCount + 1;

                    if (self.filesCount >= self.properties.maxfiles) {
                        uploadWrapper.remove();
                    }


                    //Copy the files value but not its reference
                    var files = self.files.slice();

                    //Add the new item to this temporal array
                    files.push(new Array(result.id, result.fileName));

                    // Check maxFiles
                    //self.checkMaxFiles();

                    //Set Value
                    self.setValue(files, false);

                    $("#no-files", control).css("display", "none");

                    self.triggerRenderChange();
                    self.closeUploadDialog();

                }
                else {
                    // Show server error
                    bizagi.showMessageBox(result.message);
                }
            }
            catch (e) {
                bizagi.showMessageBox("Error");
            }
            self.progress.style.display = "none";
        };

        oXHR.onprogress = function (e) {
            if (e.lengthComputable) {
                self.progress.value = (e.loaded / e.total) * 100;
                self.progress.textContent = self.progress.value // Fallback for unsupported browsers.
            }
        };

        oXHR.onerror = function (e) {
            bizagi.logError("Error: " + e.message, e);
        };

        oXHR.onabort = function (e) {
            bizagi.log("Aborted succeded: ", e, "success");
        };

        oXHR.open('POST', self.properties.addUrl, true);
        oXHR.send(vFD);

        self.progress.style.display = "block";
    },

    /*
    *   Returns the xpath to be used  
    */
    getUploadXpath: function () {
        return this.grid.properties.xpath + "[id=" + this.surrogateKey + "]." + this.properties.xpath;
    }

});
