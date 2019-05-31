/*
 *   Name: BizAgi Desktop Render Upload Extension (noflash compatibility)
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the upload render class in order to provide a compatibility to browsers without flash installed
 */

// Extends itself
bizagi.rendering.upload.extend("bizagi.rendering.uploadNoFlash", {}, {
    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this,
                properties = self.properties;


        var template = self.renderFactory.getTemplate("upload.noFlash");

        // Render template
        var html = $.fasttmpl(template, {
            xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
            editable: properties.editable,
            haveFiles: (self.filesCount != 0),
            allowSendInMail: properties.allowSendInMail
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
        self.isClicked = false;

        if (self.properties.allowSendInMail) {
            self.bindEmailDialog();
        }

        self.checkMaxFiles();

        //Set control container to behave as a block 
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-upload");
    },
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();

        if (self.properties.allowSendInMail) {
            self.bindEmailDialog();
        }

        // Set control container to behave as a block 
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-upload");
    },
    /*
    *  Bind dialog for send email
    */
    bindEmailDialog: function () {
        var self = this;
        var control = self.getControl();      
        var xpathContext = self.getXpathContext() || "";
        var xpath = self.properties.xpath;
        var template = self.properties.orientation == "rtl" ? "dialog-send-email-rtl" : "dialog-send-email";

        $(".ui-bizagi-render-upload-sendmail", control).bizagiSendEmail({
            tmpl: self.renderFactory.getTemplate(template),
            value: self.value,
            self: self,
            dataService: self.dataService,
            properties: self.properties,                
            xpath: xpath,
            xpathContext: xpathContext 
        });
    
    },
    bindExternalPopup: function () {
        var self = this;
        var control = self.getControl();
        var params = self.getParams();
        var properties = self.properties;
        var isInGrid = (self.grid) ? true : false;
        var options = {
            idCase: params.idCase || bizagi.context.idCase,
            idWorkitem: params.idWorkitem || bizagi.context.idWorkitem,
            field: properties.xpath.split(".")[properties.xpath.split(".").length - 1]
        };
        var xpathContext = self.getXpathContext();

        if (isInGrid || xpathContext != "") {
            if (typeof xpathContext == "string") {
                $.extend(options, { xPath: xpathContext.split("[")[0] + "." + properties.xpath });
            } else {
                $.extend(options, { xPath: self.grid.properties.xpath + "." + properties.xpath });
            }
        } else {
            $.extend(options, { xPath: properties.xpath });
        }

        $(".ui-bizagi-render-upload-sendmail", control).tooltip();

        $(".ui-bizagi-render-upload-sendmail", control).click(function () {
            var url = "App/Upload/SendAttachedDocs.aspx?";
            url += "idCase=" + options.idCase;
            url += "&idWorkitem=" + options.idWorkitem;
            url += "&xPath=" + options.xPath;
            url += "&field=" + options.field;

            self.dataService.getCaseNumber({
                idCase: options.idCase
            }).done(function (response) {
                var caseNumber = response.caseNumber;
                caseNumber = caseNumber ? caseNumber : options.idCase;
                url += "&radNumber=" + caseNumber;

                // fix for SUITE-8927
                var values = [];
                if (self.value) {
                    for (var i = 0; i < self.value.length; i++) {
                        values.push(self.value[i][1]);
                    }
                }

                self.currentPopup = "genericiframe";
                $(document).triggerHandler("showDialogWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
                    widgetURL: url,
                    injectCss: [".ui-bizagi-old-render*", ".ui-bizagi-old-render-upload"],
                    modalParameters: {
                        title: "Send attached documents",
                        id: "sendEmail"
                    },
                    afterLoad: function (params) {
                        var input = document.getElementById("btnClose");
                        if (input) {
                            input.style.display = "none";
                        }
                        input = document.getElementById("btnCloseConfirm");
                        if (input) {
                            input.style.display = "none";
                        }

                        // fix for SUITE-8927
                        if (params) {
                            if (params.values) {
                                var values = params.values;
                                var labels = document.getElementsByTagName("label");
                                if (labels) {
                                    for (var i = 0; i < labels.length; i++) {
                                        var label = labels[i];
                                        // fix for SUITE-8927
                                        if (label.innerText !== undefined) {
                                            if (values.indexOf(label.innerText) === -1) {
                                                if (label.control) {
                                                    label.control.checked = false;
                                                    label.parentElement.style.display = "none";
                                                } else {
                                                    label.previousSibling.checked = false;
                                                    label.parentElement.style.display = "none";
                                                }

                                            }
                                        }
                                        if (label.textContent !== undefined) {
                                            if (values.indexOf(label.textContent) === -1) {
                                                if (label.control) {
                                                    label.control.checked = false;
                                                    label.parentElement.style.display = "none";
                                                } else {
                                                    label.previousSibling.checked = false;
                                                    label.parentElement.style.display = "none";
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    afterLoadParams: {
                        values: values
                    }
                });
            });

        });
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;

        // Call base
        self._super();

        
        self.pluginUpload = $(".ui-bizagi-render-upload-wrapper", control).bizagiUpload({
            renderReference: this,
            dialogTemplate: self.renderFactory.getTemplate("upload.dialog"),
            properties: {
                url: properties.addUrl,
                xpath: properties.xpath,
                idRender: properties.id,
                xpathContext: self.getXpathContext() || properties.xpathContext,
                idPageCache: properties.idPageCache,
                idSession: properties.sessionId,
                validExtensions: properties.validExtensions,
                maxSize: properties.maxSize,
                contexttype: properties.contexttype,
                networkSpeed: networkSpeed()
            },
            onUploadFileCompletedCallback: self.onUploadFileCompleted,
            onChangeFile: self.onChangeFile,
            onCheckMaxSize: self.checkMaxSize,
            maxAllowedFiles: properties.maxfiles,
            uploadedFiles: self.filesCount,
            dialogTitle: self.getResource("render-upload-link-label")
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
                self.checkMaxFiles();                    

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

        // Reset Flag
        self.isClicked = false;

        var dialogBox = self.dialogBox = $("<div class='ui-bizagi-component-loading'/>");
        dialogBox.empty();
        dialogBox.appendTo("body", doc);

        // Define buttons
        var buttons = {};

        // Select button
        buttons[self.getResource("render-upload-dialog-select")] = function (e) {
            e.stopPropagation();
            if (!self.isClicked) {
                self.isClicked = true;
                if (self.checkMaxSize() && self.checkFileTypes() && !self.maxFilesLimit()) {
                    $.when(self.processUploadFile()).done(function (data) {
                        self.onUploadFileCompleted(data);
                        self.closeUploadDialog();
                    });
                } else {
                    self.isClicked = false;
                }
            }
        };

        // Cancel button
        buttons[self.getResource("text-cancel")] = function () {
            self.closeUploadDialog();
        };

        // Creates a dialog
        dialogBox.dialog({
            width: 500,
            height: 350,
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
        var dialogTemplate = self.renderFactory.getTemplate("upload.dialog");
        $.tmpl(dialogTemplate, {
            url: properties.addUrl,
            xpath: properties.xpath,
            idRender: properties.id,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            idSession: properties.sessionId,
            validExtensions: properties.validExtensions.replace(";", ","),
            maxSize: properties.maxSize,
            contexttype: properties.contexttype
        }).appendTo(dialogBox);
        $('.ui-bizagi-loading-message').remove();

    },

    /*
    *   Process an upload file into the server
    */
    processUploadFile: function () {
        var self = this;
        var defer = new $.Deferred();
        var dialogBox = self.dialogBox;
        var uploadForm = $("form", dialogBox);
        var uploadIFrame = $("iframe", uploadForm);

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
                window.alert("Error:" + e.toString());
            }
        };
        // Execute the timed function in order to check when the response has arrived
        timeoutFn();

        // Submit the form
        uploadForm.submit();

        return defer.promise();
    },

    /*
    *   Close the upload dialog
    */
    closeUploadDialog: function () {
        var self = this;
        self.isClicked = false;
        self.dialogBox.dialog('destroy');
        self.dialogBox.remove();
    },

    /**
    * Verify if control reached maximum number of files
    */
    maxFilesLimit: function () {
        var self = this;
        var properties = self.properties;

        if (self.filesCount >= properties.maxfiles) {
            return true;
        } else {
            return false;
        }
    },

    /*
    *   Check if the max files condition is true to hide the upload link
    */
    checkMaxFiles: function () {
        var self = this,
                properties = self.properties,
                control = self.getControl(),
                uploadField = $(".ui-bizagi-render-upload-wrapper", control);

        if (self.maxFilesLimit()) {
            //Hide upload element             
            bizagi.util.cssExtended(uploadField.find("a"), 'display:none!important');

            //Disable the control, to prevent further click events
            self.enabled = false;
            
        } else {
            // show upload element
            bizagi.util.cssExtended(uploadField.find("a"), 'display:block!important');

            //Enable the control, to prevent further click events
            self.enabled = true;
        }

        //Checks if the files count is equals to 0, to show the no files dialog
        if(self.filesCount == 0) {
            $("#no-files", control).show();
        }
        else{
            $("#no-files", control).hide();
        }
    },

    onChangeFile: function (files) {
        var self = this, i = 0, length, file, maxSize = self.properties.maxSize;
        if (files) {
            length = files.length;
            for (; i < length; ) {
                file = files[i++];
                if (file.size > maxSize) {
                    self.previousCheck = false;
                    return;
                }
            }
        }
        self.previousCheck = true;
    },

    /*
    *   Handler to process server response after a file has been uploaded
    */
    onUploadFileCompleted: function (renderReference, response) {
        var self = renderReference,
                control = self.getControl();

        var uploadWrapper = $(".ui-bizagi-render-upload-wrapper", control);

        // Pre-parse response because in IE sometimes the server returns the JSON enclosed with some weird <FONT> tags
        response = response.replace(/<.+>({.*})\r?\n?.*<.+>/gm, "$1");

        // Check if previous call return a valid json
        try {
            var result = JSON.parse(response);
        } catch (e) {
            // Invalid json, try to catch error response
            var errorList = [
                {
                    toFind: "Maximum request length",
                    message: self.getResource("render-upload-alert-maxsize").replace("{0}", self.properties.maxSize)
                }];

            $.each(errorList, function (key, validation) {
                if (response.indexOf(validation.toFind) >= 0 && !result) {
                    result = {
                        type: "error",
                        message: validation.message
                    };
                }
            });
            if (!result) {
                // Dont mapped 
                result = {
                    type: "error",
                    message: "Error:" + result
                };
            }
        }

        if (result.type != "error") {
            var newItem = self.renderUploadItem({ id: result.id, fileName: result.fileName });

            //Add jQuery Reference
            var $newItem = $(newItem);

            // Locate it before the upload wrapper
            $($newItem).insertBefore(uploadWrapper);

            // Increment counter
            self.filesCount = self.filesCount + 1;

            //Copy the files value but not its reference
            var files = self.files.slice();

            //Add the new item to this temporal array
            files.push(new Array(result.id, result.fileName));

            // Check maxFiles
            self.checkMaxFiles();

            //Set Value
            self.setValue(files, false);
                    
            // Trigger change
            self.triggerRenderChange();
            if (typeof (self.grid) != "undefined") if (typeof (self.grid.properties) != "undefined") self.grid.properties.canBeExported = true;
        } else {

            //HTTP Error 404.13 is launched when the max file size configurated for iis is reached. the Request to the server is blocked 
            if (result.message == "Error:undefined" && response.indexOf("HTTP Error 404.13") > -1)
                result.message = self.getResource("render-upload-iis-maxsize");
            // Show server error
            bizagi.showMessageBox(result.message);
        }
    },

    /*
    *
    */
    checkMaxSize: function (renderReference) {
        var self = renderReference;
        var properties = self.properties;
        var dialogBox = self.dialogBox;
        var fileControl = $("input[type=file]", dialogBox).get(0);

        // Dont exist any fucking way to know file size in IEx, just skip this validation
        if (fileControl.files != undefined) {
            if (fileControl.files.length > 0) {
                if (fileControl.files[0].size == 0)
                {
                    self.showError(self.getResource("render-upload-error-file-empty").replace("%s", fileControl.files[0].name));
                    return false;
                }
                if (fileControl.files[0].size > properties.maxSize) {
                    self.showError(self.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize));
                    return false;
                }
                return true;
            }
            else {
                self.showError(self.getResource("render-required-upload").replace("#label#", ""));
                return false;
            }
        } else {
            if (bizagi.util.isIE()) {
                if (fileControl.value === "" || !fileControl.value) {
                    self.showError(self.getResource("render-required-upload").replace("#label#", ""));
                    return false;
                } else {
                    if (self.previousCheck) {
                        return true;
                    } else {
                        if (document.documentMode > 9) {
                            self.showError(self.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize));
                            return false;
                        } else {
                            return true;
                        }
                    }
                }
            } else {
                return true;
            }
        }
    },

    /*
    *
    */
    checkFileTypes: function () {
        var self = this;
        var properties = self.properties;
        var dialogBox = self.dialogBox;
        var file = $("input[type=file]", dialogBox).val();
        if (properties.validExtensions && properties.validExtensions.length > 0) {
            var validExtensions = properties.validExtensions.replaceAll("*.", "").split(";");
            if (!self.stringEndsWithValidExtension(file, validExtensions, true)) {
                self.showError(self.getResource("render-upload-allowed-extensions") + properties.validExtensions);
                return false;
            }
        }
        return true;
    },

    /*
    *
    */
    stringEndsWithValidExtension: function (stringToCheck, acceptableExtensionsArray, required) {
        if (required == false && stringToCheck.length == 0) {
            return true;
        }
        for (var i = 0; i < acceptableExtensionsArray.length; i++) {
            if (acceptableExtensionsArray[i].toLowerCase() == "*") {
                return true
            }
            if (stringToCheck.toLowerCase().endsWith(acceptableExtensionsArray[i].toLowerCase())) {
                return true;
            }
        }
        return false;
    },

    /*
    *
    */
    showError: function (message) {
        var self = this;
        var errorContainer = $("#alert-file-upload", self.dialogBox);

        // Empty container
        errorContainer.empty();
        errorContainer.show();

        errorContainer.html(message);
    },

    /*
     * Cleans current value
     */
    cleanData: function () {
        var self = this;

        self.setValue(null);
        self.clearDisplayValue();
    },

    /*
     *   Sets the value in the rendered control
     */
    clearDisplayValue: function () {
        var self = this;
        var control = self.getControl();

        var arrayItems = control.find(".ui-bizagi-render-upload-item");
        var length = arrayItems.length - 1;

        $.each(arrayItems, function (index, value) {
            var item = $(value);
            var file = item.data();

            if(file){
                $.when(self.deleteUploadItem(item, file.id)).done(function () {
                    // Detach item
                    item.remove();

                    // Trigger change
                    self.triggerRenderChange();
                });
            }
        });

        // Remove items
        arrayItems.hide();

        // Check maxFiles
        self.filesCount = 0;
        self.checkMaxFiles();

    },

    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties, control, item;

        if (properties.editable) {
            if (value && value.length === 0) {
                control = self.getControl();
                item = control.find(".ui-bizagi-render-upload-item");
                item.hide();
                item.remove();
                self.checkMaxFiles();
            }
        }

        self._super(value);
    }
});