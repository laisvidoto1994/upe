/*
*   Name: BizAgi Render Image Whitout flash
*   Author: Ricardo Pérez
*   Comments:
*   -   This script will redefine the image render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.image.extend("bizagi.rendering.imageHtml5", {}, {
    /*
    *   Template method to implement in each device to customize each render after processed
    */

    postRender: function () {
        var self = this;
        this.errorDiv = document.createElement("div");
        this.errorDiv.id = "alert-file-upload";

        var control = self.getControl();
        var properties = self.properties;
        var mode = self.getMode();
        var template = self.renderFactory.getTemplate("image-html5");
        var url = "";

        var containerHeight;
        var imgWidth = self.properties.width;  
        var imgHeight = self.properties.height;

        // Flash to define flash version
        self.properties.flashVersion = false;

        // Render template
        var html = $.fasttmpl(template, {
            xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
            editable: properties.editable,
            url: self.properties.url,
            allowDelete: properties.allowDelete,
            mode: mode
        });

        $(".image-wrapper", control).append(html);

        //If is not any image include, load the default properies of the controls
        if (mode == "design" || mode == "layout" || self.properties.url.length == 0) {

            setTimeout(function () {
                if (imgHeight == "auto") {

                    //if null means that container is the form
                    if (self.parent.properties.type == "grid") {
                        containerHeight = $(control).height() + "px";
                        bizagi.util.cssExtended($(".image-wrapper", control), 'width:100%!important');
                    } else {
                        var parent = (self.parent.properties.type === "panel") ? self.parent.parent : self.parent;
                        var height = control.height();

                        containerHeight = parent.container.height() - 17;

                        var containerChildsSize = self.parent.getChildreCount();
                        var containerChildsHeightSum = self.parent.getChildrenSumHeight("image");

                        if (self.parent.properties.id == self.getFormContainer().properties.id) {
                            containerHeight = 50;
                        } else if (containerChildsSize > 1) {
                            containerHeight = containerHeight - (containerChildsHeightSum - height);
                        }

                        $(".image-wrapper", control).height(containerHeight);
                    }

                    imgHeight = containerHeight;
                }

                $('a', control).css({ width: imgWidth, height: imgHeight });

                $(".resizable-html5", control).css({ width: imgWidth, height: imgHeight });
            }, 150);

            //Creates an image node to store the sample image, and resize it to the control required dimensions
            if ($(".resizable-html5", control).hasClass('background-image')) {
                //Image url pattern
                var pattern = /url\(|\)|"|'/g;
                var baseImageURL = $(".resizable-html5", control).css('background-image').replace(pattern, "");

                //Creates the image node with the base image URL
                var resizableImgNode = $('<img src=' + baseImageURL + '>');

                resizableImgNode.css({ width: imgWidth, height: imgHeight });

                //Append the created node
                $(".resizable_img", control).append(resizableImgNode);

                //Reset the styles, and make room to the created image node
                $(".resizable_img", control).css({
                    'background-image': 'none',
                    'border-top-width': '0',
                    'border-left-width': '0',
                    'border-right-width': '0',
                    'border-down-width': '0',
                    'padding': '0'
                });
            }

            //Otherwise, set the styles to adjust the image in the center, regardless his dimesions
        } else {
            var isImageGreaterThanContainer = false;
            var controlWidth = control.width();

            setTimeout(function () {
                var isAuto = self.properties.isAutoWidth;

                if (isAuto && self.parent.properties.type === "grid") {
                    if ($(".img", control).width() < controlWidth) {
                        imgWidth = $(".img", control).width();
                    } else if ($(".img", control).width() >= controlWidth) {
                        imgWidth = controlWidth - 20;
                        isImageGreaterThanContainer = true;
                    }

                    $('a', control).css({ height: "auto" });

                } else {
                    $('a', control).css({ width: imgWidth, height: "auto" });
                }

                $(".img, .ui-bizagi-render-image-wrapper .image-file", control).css({
                    width: imgWidth,
                    height: "auto"
                });

                var wSize = 48;
                if ((self.properties.width + "").indexOf("px") !== -1) {
                    wSize = (self.properties.width + "").replace("px", "");
                }

                $(".ui-bizagi-render-image-wrapper .image-file", control).addClass('w-size-' + wSize);

                $(".img", control).css({ width: imgWidth, height: "auto" });
                $(".img", control).find("img").attr("width", imgWidth);
                
                if (isAuto && Number($('a', control).css("width").slice(0, -2)) > Number($(".img", control).css("width").slice(0, -2))) {
                    $('a', control).css({ width: $(".img", control).css("width") });
                }
                if (isAuto && isImageGreaterThanContainer && self.parent.properties.type === "grid") {
                    $('a', control).closest(".ui-bizagi-render").css("text-align", "left");
                }
            }, 50);

        }
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();
        // Call base
        self._super();

        $(".ui-bizagi-render-image-wrapper", control).click(function () {
            // Open dialog
            self.openUploadDialog();
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

    },

    /*
    *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
    */
    configureDesignView: function () {
        var self = this;
        var control = self.getControl();
        // Call base
        self._super();
        $("*:not(.ui-bizagi-render-control-required)", control).css({
            padding: "0px",
            margin: "0px",
            border: "0px",
            'line-height': '0px',
            position: 'relative',
            display: 'table',
            top: '0'
        });

        $(".image-file", control).css({
            width: self.properties.width,
            height: self.properties.height
        });
    },

    renderReadOnly: function () {
        var self = this;
        return self.renderControl();
    },
    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();
        var template = self.renderFactory.getTemplate("image-noflash");
        var mode = self.getMode();

        // Render template
        var html = $.fasttmpl(template, {
            xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
            editable: false,
            url: self.properties.url,
            allowDelete: false,
            mode: mode
        });

        $(".ui-bizagi-render-upload-wrapper", control).append(html);

        $("a,.img, .ui-bizagi-render-image-wrapper .image-file, .ui-bizagi-render-image-wrapper", control).css({
            width: self.properties.width,
            height: self.properties.height
        });
    },

    getTemplateItem: function () {
        var self = this;
        return self.renderFactory.getTemplate("image-item-html5");
    },

    /*
    *   Opens a dialog in order to upload file per file
    */
    openUploadDialog: function () {
        var self = this;
        var properties = self.properties;
        var doc = window.document;

        var dialogBox = self.dialogBox = $("<div class='ui-bizagi-component-loading'/>");
        //        dialogBox.empty();
        dialogBox.appendTo("body", doc);

        // Define buttons
        var buttons = {};

        // Select button
        buttons[self.getResource("render-upload-dialog-select")] = function (e) {
            e.stopPropagation();
            if (self.checkMaxSize() && self.checkFileTypes()) {
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
    *   Close the upload dialog
    */
    closeUploadDialog: function () {
        var self = this;
        self.dialogBox.dialog('destroy');
        self.dialogBox.remove();
    },
    /*
    *   Handler to process server response after a file has been uploaded
    */
    onUploadFileCompleted: function (response) {
        var self = this;
        var control = self.getControl();
        var imageWrapper = $(".ui-bizagi-render-image-wrapper", control);
        var result = JSON.parse(response);

        var imgWidth = 0;
        var controlWidth = control.width();
        var isImageLoaded = control.find(".img").size() > 0;
        var widthBase = control.find(".resizable-html5").width();

        if (self.properties.isAutoWidth) {
            imgWidth = self.properties.type != "image" ? control.width() : "99%";
        } else {
            imgWidth = self.properties.width;
        }

        // Set width
        $(".uploadifyQueueItem", control).css({
            width: self.properties.width
        });

        if (result.type !== "error") {
            $.when(self.renderUploadItem()).done(function (htmlImage) {
                // Empty container and add new image
                $(imageWrapper).empty();
                $(imageWrapper).append(htmlImage);

                // Trigger change
                self.triggerRenderChange();

                setTimeout(function () {
                    var isImageGreaterThanContainer = false;
                    var isAuto = self.properties.isAutoWidth;

                    if (isAuto && self.parent.properties.type === "grid") {

                        if ($(".img", control).width() < controlWidth) {
                            imgWidth = $(".img", control).width();
                        } else if ($(".img", control).width() >= controlWidth) {
                            imgWidth = controlWidth - 20;
                            isImageGreaterThanContainer = true;
                        }

                        if (!isImageLoaded) {
                            $('a', control).closest("td").css("width", widthBase);
                        }

                        $('a', control).css({ height: "auto" });

                    } else {
                        $('a', control).css({ width: imgWidth, height: "auto" });
                    }

                    $(".img, .ui-bizagi-render-image-wrapper .image-file", control).css({ width: imgWidth, height: "auto" });

                    var wSize = 48;
                    if ((self.properties.width + "").indexOf("px") !== -1) {
                        wSize = (self.properties.width + "").replace("px", "");
                    }

                    $(".ui-bizagi-render-image-wrapper .image-file", control).addClass('w-size-' + wSize);

                    $("img", control).css("width", imgWidth);
                    $("img", control).css("height", "auto");
                    $('.image-wrapper', control).css("height", "auto");

                    if (isAuto && Number($('a', control).css("width").slice(0, -2)) > Number($(".img", control).css("width").slice(0, -2))) {
                        $('a', control).css({
                            width: $(".img", control).css("width")
                        });
                    }
                    if (self.parent.properties.type === "grid" && isAuto) {
                        if (isImageGreaterThanContainer) {
                            $('a', control).closest(".ui-bizagi-render").css("text-align", "left");
                        } else {
                            if (self.properties.columnAlign) {
                                $('a', control).closest(".ui-bizagi-render").css("text-align", self.properties.columnAlign);
                                $('.image-wrapper', control).css("text-align", self.properties.columnAlign);
                            } else {
                                $('a', control).closest(".ui-bizagi-render").css("text-align", "center");
                            }
                        }
                    }

                }, 50);
                //Set Value
                self.setValue([true]);

            });
        } else {
            // Show server error
            bizagi.showMessageBox(result.message);
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
        } else {
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

    showError: function (message) {
        var self = this;
        var errorContainer = $("#alert-file-upload", self.dialogBox);

        // Empty container
        errorContainer.empty();
        errorContainer.show();

        errorContainer.html(message);
    },

    /*
    *   Process an upload file into the server
    */
    processUploadFile: function () {
        var self = this;
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
        vFD.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action", 'savefile');
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
                try {
                    var result = JSON.parse(this.response);

                    if (result.type != "error") {
                        self.onUploadFileCompleted(this.response);
                        self.closeUploadDialog();
                    } else {
                        // Show server error
                        bizagi.showMessageBox(result.message);
                    }
                } catch (e) {
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

        } else {

            var reader = new FileReader();

            reader.onload = function (e) {

                var dataURL = e.target.result;
                var control = self.getControl();

                var imageWrapper = $(".ui-bizagi-render-upload-wrapper", control);
                var newItem = $.fasttmpl(self.getTemplateItem(), { url: dataURL });

                imageWrapper.html($(newItem));

                self.getControl().find("img").css("width", "100%");
                self.getControl().find("a").css("width", "auto");
                self.getControl().find("a").css("height", "auto");
                self.getControl().find("div.img").css("height", "auto");
                self.getControl().find("div.img").css("width", "auto");

                dataURL = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

                self.setValue(dataURL);

                bizagi.log(dataURL);

                //enables canbesent on offline mode
                self.canBeSent = function () { return true; };

                self.triggerRenderChange();
                self.closeUploadDialog();
            };

            reader.readAsDataURL(input.get(0).files[0]);
        }
    }
});