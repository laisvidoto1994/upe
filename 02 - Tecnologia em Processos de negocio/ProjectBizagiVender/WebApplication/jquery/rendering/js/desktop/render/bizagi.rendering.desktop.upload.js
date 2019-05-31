/*
 *   Name: BizAgi Desktop Render Label Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the label render class to adjust to desktop devices
 */

// TODO: DELETE THIS FILE, WE DONT USE FLASH PLUGIN ANYMORE

// Extends itself
bizagi.rendering.upload.extend("bizagi.rendering.upload", {}, {
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Call base 
        this._super();

        if (self.properties.allowSendInMail) {
            self.bindExternalPopup();
        }

        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-upload");
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
                        if (input) { input.style.display = "none"; }
                        input = document.getElementById("btnCloseConfirm");
                        if (input) { input.style.display = "none"; }

                        // fix for SUITE-8927
                        if (params) {
                            if (params.values) {
                                var values = params.values;
                                var labels = document.getElementsByTagName("label");
                                if (labels) {
                                    for (var i = 0; i < labels.length; i++) {
                                        var label = labels[i];
                                        if (values.indexOf(label.innerText) == -1) {
                                            label.control.checked = false;
                                            label.parentElement.style.display = "none";
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

        // Call base
        self._super();

        // Apply upload plugin

        // DiegoP: swfobject plugin does not work if the object does not exist in the dom so 
        // we need to run this when the form has been set in the dom
        self.ready().done(function () {
            var fileInput = $(".ui-bizagi-render-upload-wrapper input", control);
            if (fileInput.length > 0) {
                self.applyUploadPlugin();
            }
        });
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
    */
    configureDesignView: function () {
        var self = this;
        var control = self.getControl();

        // Call base
        self._super();

        var fileInput = $(".ui-bizagi-render-upload-wrapper input", control);
        fileInput.hide();
    },
    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();

        if (self.properties.allowSendInMail) {
            self.bindExternalPopup();
        }

        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-upload");

        // Remove upload wrapper
        $(".ui-bizagi-render-upload-wrapper", control).remove();
    },
    /*
    *   Applies the upload plugin
    */
    applyUploadPlugin: function () {
        var self = this,
        properties = self.properties,
        control = self.getControl();


        var fileInput = $(".ui-bizagi-render-upload-wrapper input", control);

        // Add some plugin properties
        var swf = properties.swf || self.dataService.getUploadSwfLocation();
        var cancelImage = self.dataService.getUploadCancelImage();

        // We build parameters
        var data = self.buildAddParams();

        // Apply upload plugin
        fileInput.uploadify({
            hideButton: true,
            wmode: 'transparent',
            styleClass: "swfupload ui-icon upload-file",
            uploader: swf,
            script: properties.addUrl,
            scriptData: data,
            scriptAccess: 'always',
            auto: true,
            buttonImg: '',
            cancelImg: cancelImage,
            width: 'inherit',
            height: 32,
            multi: true,
            fileExtErrorMessage: self.getResource("render-upload-error-extensions"),
            sizeLimit: properties.maxSize,
            queueSizeLimit: properties.maxfiles,
            fileExt: properties.validExtensions,
            fileDesc: properties.validExtensions ? self.getResource("render-upload-allowed-extensions") + properties.validExtensions : "",
            queueID: "q_" + bizagi.util.encodeXpath(self.getUploadXpath()),
            onComplete: function (event, queueId, fileObj, response, responseData) {
                if (event.isPropagationStopped())
                    return;
                event.stopPropagation();


                self.onUploadFileCompleted(response);
            },
            onSelect: function (event, ID, fileObj) {
                self.checkMaxFiles();
                return true;
            }
        });

        // Bind handlers

        //  * Item Mouse over
        control.delegate(".ui-bizagi-render-upload-item", "mouseover", function () {
            var item = $(this);
            $(".ui-bizagi-render-upload-icon", item).css("display", "inline-block");
            item.removeClass("ui-state-default").addClass("ui-state-hover");
        });

        //  * Item Mouse out
        control.delegate(".ui-bizagi-render-upload-item", "mouseout", function () {
            var item = $(this);
            $(".ui-bizagi-render-upload-icon", item).css("display", "none");
            item.addClass("ui-state-default").removeClass("ui-state-hover");
        });

        //  * Delete icon
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

                // Trigger change
                self.triggerRenderChange();
            });
        });

        // Restrict maxFiles initially
        self.checkMaxFiles();

    },
    /*
    *   Check if the max files condition is true to hide the upload link
    */
    checkMaxFiles: function () {
        var self = this,
        properties = self.properties,
        control = self.getControl();
        var uploadWrapper = $(".ui-bizagi-render-upload-wrapper", control);
        var fileInput = $("input", uploadWrapper);

        if (properties.maxfiles > 0 && self.filesCount >= properties.maxfiles) {
            // Hide upload link
            try {
                fileInput.uploadifyClearQueue();
            } catch (e) {
            }
            uploadWrapper.css({
                'height': 0,
                'position': 'fixed'
            });
            $("object", uploadWrapper).css("height", "0");
            $("a", uploadWrapper).hide();
            $(".ui-bizagi-label", self.element).css("vertical-align", "top");
            setTimeout(function () {
                $(".ui-bizagi-label", self.element).css("vertical-align", "middle");
            }, 1000);

        } else if (self.filesCount < properties.maxfiles) {
            // Show upload link
            uploadWrapper.css({
                'height': '',
                'position': ''
            });
            $("object", uploadWrapper).css("height", "");
            $("a", uploadWrapper).show();
        }
    },
    /*
    *   Handler to process server response after a file has been uploaded
    */
    onUploadFileCompleted: function (response) {
        var self = this;
        var control = self.getControl();

        var uploadWrapper = $(".ui-bizagi-render-upload-wrapper", control);
        var result = JSON.parse(response);

        if (result.type != "error") {
            var newItem = self.renderUploadItem({
                id: result.id,
                fileName: result.fileName
            });
            self.files.push([result.id, result.fileName]);

            // Locate it before the upload wrapper
            $(newItem).insertBefore(uploadWrapper);

            // Increment counter
            self.filesCount = self.filesCount + 1;

            // Check maxFiles
            self.checkMaxFiles();

            // Trigger change
            self.triggerRenderChange();

        } else {
            // Show server error
            bizagi.showMessageBox(result.message);
        }
    }
});
