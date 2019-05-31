/*
*   Name: BizAgi Desktop Render Upload Extension (html5 compatibility)
*   Author: Ricardo Pérez
*   Comments:
*   -   This script will redefine the upload render class in order to provide a compatibility to browsers without flash installed
*/

// Extends itself
bizagi.rendering.upload.extend("bizagi.rendering.uploadHtml5", {}, {
    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        this.errorDiv = document.createElement("div");
        this.errorDiv.id = "alert-file-upload";


        var self = this,
        properties = self.properties;

        var template = self.renderFactory.getTemplate("upload.noFlash");

        // Render template
        var html = $.fasttmpl(template, {
            xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
            editable: (self.filesCount < properties.maxfiles) && properties.editable,
            haveFiles: (self.filesCount != 0)
        });

        // Render current children
        var items = "";
        for (var i = 0; i < self.filesCount; i++) {
            var file = { id: self.files[i][0], fileName: self.files[i][1] };
            var item = self.renderUploadItem(file);
            items += item;
        }
        html = self.replaceFilesHtml(html, items);
        return html;
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-upload");
        control.find("li").css("min-width", "50px;");
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();

        // Call base
        self._super();

        // Attach handler
        var uploadLink = $(".ui-bizagi-render-upload-wrapper", control);
        uploadLink.click(function () {
            self.openUploadDialog();
        });

        control.delegate(".ui-bizagi-render-upload-item-delete", "click", function () {
            var item = $(this).parent(".ui-bizagi-render-upload-item");
            var file = item.data();
            $.when(self.deleteUploadItem(item, file.id)).done(function () {
                // Remove item
                item.hide(); 
                
                // Detach item
                item.remove();

                // Check maxFiles
                //self.checkMaxFiles();

                if (self.files.length == 0) {
                    $("#no-files", control).css("display", "block");
                }

                //Set Value
                self.setValue(self.files, false);

                // Trigger change
                self.triggerRenderChange();
            });
        });
    },

    /*
    *   Opens a dialog in order to upload file per file
    */
    openUploadDialog: function () {
        var self = this;
        var properties = self.properties;
        var doc = window.document;

        var dialogBox = self.dialogBox = $("<div class='ui-bizagi-component-loading-upload'/>");
        dialogBox.appendTo("body", doc);

        // Define buttons
        var buttons = {};

        // Select button
        buttons[self.getResource("render-upload-dialog-select")] = function () {
            if ($("label", dialogBox).text() != "") {
                self.processUploadFile();
            }
        };

        // Cancel button
        buttons[self.getResource("text-cancel")] = function () {
            self.closeUploadDialog();
        };

        // Creates a dialog
        dialogBox.dialog({
            width: 500,
            height: 250,
            resizable: false,
            maximize: false,
            title: self.getResource("render-upload-link-label"),
            modal: true,
            buttons: buttons,
            close: function () {
                self.closeUploadDialog();
            },
            resizeStop: function (event, ui) {
                if (self.form) {
                    self.form.resize(ui.size);
                }
            }
        });

        // Render template
        var dialogTemplate = self.renderFactory.getTemplate("uploadHtml5");
        $.tmpl(dialogTemplate, {
            url: properties.addUrl,
            xpath: properties.xpath
        }).appendTo(dialogBox);

        var progress = self.progress = document.createElement("progress");
        progress.max = "100";
        progress.value = "0";
        progress.id = "determinateProgress";
        progress.style.display = "none";
        $(progress).appendTo(dialogBox);


        // Add button wrapper behaviour
        $("button", dialogBox).button();

        // Simulate input file - click
        $("button", dialogBox).click(function () {
            $("form", dialogBox)[0].reset();
            self.errorDiv.innerHTML = "";
            $("label", dialogBox).text("");
            $("input[type=file]", dialogBox).trigger("click");
        });

        // Show label when the user selects the file
        $("input[type=file]", dialogBox)[0].onchange = function () {
            if (self.checkFileTypes() && self.checkMaxSize()) {
                var file = $("input[type=file]", dialogBox).val();
                var index = file.lastIndexOf("\\") > 0 ? file.lastIndexOf("\\") + 1 : 0;
                file = file.substring(index, file.length);
                $("label", dialogBox).text(file);
            }
        };
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
        var form = self.getFormContainer();

        // get form data for POSTing
        var vFD = new FormData();

        vFD.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath", self.getUploadXpath());
        vFD.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender", self.properties.id);
        vFD.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext", self.properties.xpathContext);
        vFD.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE, self.properties.idPageCache);
        vFD.append(self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId", form.properties.sessionId);
        vFD.append(self.properties.xpath, input.get(0).files[0]);
        (self.properties.contexttype) ? vFD.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype", self.properties.contexttype) : "";

        try {
            (BIZAGI_SESSION_NAME != undefined) ? vFD.append(BIZAGI_SESSION_NAME, form.properties.sessionId) : vFD.append("JSESSIONID", form.properties.sessionId);
        } catch (e) {
            vFD.append("JSESSIONID", form.properties.sessionId);
        }

        if (typeof (bizagi.context.isOfflineForm) === "undefined" || bizagi.context.isOfflineForm == false) {
            // create XMLHttpRequest object, adding few event listeners, and POSTing our data
            var oXHR = new XMLHttpRequest();

            //Attach Handlers events
            oXHR.onload = function (e) {
                control = self.getControl();
                var uploadWrapper = $(".ui-bizagi-render-upload-wrapper", control);
                try {
                    var result = JSON.parse(this.response);

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

                        //Set Value
                        self.setValue(files, false);

                        $("#no-files", control).css("display", "none");

                        // Trigger change
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
                    self.progress.textContent = self.progress.value; // Fallback for unsupported browsers.
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
        }
        else {
            var reader = new FileReader();
            reader.onload = function (e) {
                var dataURL = e.target.result;
                var uploadWrapper = $(".ui-bizagi-render-upload-wrapper", self.getControl());
                var fileLoaded = input.get(0).files[0];
                var id = new Date().toISOString();
                var newItem = self.renderUploadItem({ id: id, fileName: fileLoaded.name });
                self.files.push([id, fileLoaded.name]);
                // Locate it after the upload wrapper
                uploadWrapper.after($(newItem));
                // Increment counter
                self.filesCount = self.filesCount + 1;
                if (self.filesCount >= self.properties.maxfiles)
                    uploadWrapper.remove();
                // Trigger change
                self.triggerRenderChange();
                self.closeUploadDialog();
                $("#no-files", self.getControl()).hide();
                //enables canbesent on offline mode
                //self.canBeSent = function () { return true; };
            };
            reader.readAsDataURL(input.get(0).files[0]);
        }
    },

    checkMaxSize: function () {
        var self = this;
        var properties = self.properties;
        var dialogBox = self.dialogBox;
        var fileControl = $("input[type=file]", dialogBox).get(0);


        if (fileControl.files.length > 0) {
            if (fileControl.files[0].size > properties.maxSize) {
                self.errorDiv.innerHTML = self.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize);
                $(self.errorDiv).appendTo(dialogBox);
                return false;
            }
            return true;
        }
        else {
            self.errorDiv.innerHTML = self.getResource("render-required-upload").replace("#label#", "");
            $(self.errorDiv).appendTo(dialogBox);
            return false;
        }
    },

    checkFileTypes: function () {
        var self = this;
        var properties = self.properties;
        var dialogBox = self.dialogBox;
        var file = $("input[type=file]", dialogBox).val();
        if (properties.validExtensions && properties.validExtensions.length > 0) {
            var validExtensions = properties.validExtensions.replaceAll("*.", "").split(";");
            if (!self.stringEndsWithValidExtension(file, validExtensions, true)) {
                self.errorDiv.innerHTML = self.getResource("render-upload-allowed-extensions") + properties.validExtensions;
                $(self.errorDiv).appendTo(dialogBox);
                return false;
            }
        }
        return true;
    },

    stringEndsWithValidExtension: function (stringToCheck, acceptableExtensionsArray, required) {
        if (required == false && stringToCheck.length == 0) { return true; }
        for (var i = 0; i < acceptableExtensionsArray.length; i++) {
            if (acceptableExtensionsArray[i].toLowerCase() == "*") { return true }
            if (stringToCheck.toLowerCase().endsWith(acceptableExtensionsArray[i].toLowerCase())) { return true; }
        }
        return false;
    },

    /*
    *   Close the upload dialog
    */
    closeUploadDialog: function () {
        var self = this;
        self.dialogBox.dialog('destroy');
        self.dialogBox.remove();
    }

});
