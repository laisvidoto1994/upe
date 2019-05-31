/**
 *   Name: BizAgi smartphone Render Upload Extension
 *   Author: Bizagi Mobile Team
 *   Comments:
 *   -   This script will redefine the upload render class to adjust to smartphones devices
 */

// Extends itself
bizagi.rendering.upload.extend("bizagi.rendering.upload", {
    BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
    BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX,
    QUALITY_PICTURE: 80,
    LIMIT: 1, // Limit: The maximum number of audioclips, videoclips, etc.
    // in the device user can record in a single capture operation.
    EXTENSIONSIMG: ["jpeg", "image", "png", "jpg"],
    EXTENSIONSFILE: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "zip", "rar", "txt"],
    EXTENSIONSVIDEO: ["quicktime", "qt", "mov"],
    EXTENSIONSAUDIO: ["audio", "wav"]
}, {

    /**
     * Template method to implement in each children to customize each control
     * @returns {}
     */
    renderControl: function () {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("upload");

        // Render template
        var html = $.fasttmpl(template, {
            xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
            editable: properties.editable,
            noFiles: (self.filesCount === 0),
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

    /**
     * Renders a single upload item
     * @param {} file
     * @returns {}
     */
    renderUploadItem: function (file) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var image = false;

        var template = self.renderFactory.getTemplate("uploadItem");
        var url = self.buildItemUrl(file);

        // Don't render urls when not running in execution mode
        if (mode !== "execution") {
            url = "javascript:void(0);";
        }

        if (self.checkImageFile(file.fileName)) {
            image = true;
        }

        var html = $.fasttmpl(template, {
            url: url,
            image: image,
            allowDelete: properties.allowDelete,
            filename: file.fileName,
            editable: properties.editable,
            isCordovaSupported: bizagi.util.isCordovaSupported(),
            id: file.id,
            mode: mode
        });

        return html;
    },

    /**
     * Template method to implement in each device to customize each render after processed
     * @returns {}
     */
    postRenderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getControl();
        var containerRender = self.getContainerRender();

        self.configureHelpText();

        self.itemAddfile = $(".bz-rn-upload-show-menu", container);

        if (!properties.editable || self.itIsMaxNumberFilesReached() || ( !bizagi.util.isCordovaSupported( ) && !bizagi.util.media.fileAPISupported() ) ) {
            self.itemAddfile.hide();
        }

        if (!properties.editable || ( !bizagi.util.isCordovaSupported( ) && !bizagi.util.media.fileAPISupported()) ) {
            containerRender.addClass("bz-rn-non-editable");
        } else {
            containerRender.addClass("bz-command-edit-inline");
            self.buildUploadControl();
        }

        self.addInteractions();
    },

    buildUploadControl: function () {
        var self = this;
        var container = self.getControl();
        var fileInput = $(".bz-rn-upload-web", container);

        // Resolution upload menu
        var resolutionUpload = [
            { "guid": 1, "displayName": bizagi.localization.getResource("workportal-size-small") },
            { "guid": 2, "displayName": bizagi.localization.getResource("workportal-size-medium") },
            { "guid": 3, "displayName": bizagi.localization.getResource("workportal-size-large") },
            { "guid": 4, "displayName": bizagi.localization.getResource("workportal-size-original") }
        ];

        if ( bizagi.util.isCordovaSupported( ) ) {
            // Upload image
            $(self.itemAddfile).actionSheet({
                actions: self.getUploadChoices(),
                actionClicked: function(action) {
                    // Action for web file upload
                    if (action.guid === 5) {
                        fileInput.click();
                    }else{
                        self.handlerUploadImage(action.guid);
                    }
                },
                appear: function(action) {
                    self.triggerGlobalHandler("modalViewDidAppear", {});
                },
                cancelClicked: function(action) {
                    self.triggerGlobalHandler("modalViewDidDisappear", {});
                }
            });

            // Resolution image
            $(".bz-rn-upload-resolution-container", container).actionSheet({
                actions: resolutionUpload,
                actionClicked: function (action) {
                    self.handlerResolutionUpload(action.guid);
                },
                appear: function(action) {
                    self.triggerGlobalHandler("modalViewDidAppear", {});
                },
                cancelClicked: function(action) {
                    self.triggerGlobalHandler("modalViewDidDisappear", {});
                }
            });
        }
        else {
            $(self.itemAddfile).click(function(){
                fileInput.click();
            });
        }

        fileInput.on("click", function (e) {
            e.stopPropagation();
        });

        // Attach event to web upload-control
        fileInput.on("change", function () {
            var that = this;
            var dataFile = that.files[0];
            var extensions = self.Class.EXTENSIONSIMG.concat(self.Class.EXTENSIONSFILE,
                self.Class.EXTENSIONSAUDIO, self.Class.EXTENSIONSVIDEO);

            dataFile.fullPath = that.value;
            bizagi.util.smartphone.startLoading();

            if (bizagi.util.media.checkMaxSizeFile(dataFile, self.properties)
                && bizagi.util.media.checkFileTypes(dataFile, self.properties, extensions)) {

                $.when(self.processUploadFile(dataFile))
                    .done(function (result) {
                        self.onUploadFileCompleted(self, JSON.parse(decodeURIComponent(result)));
                    }).fail(function (error) {
                    if (error.statusText !== "Unauthorized") {
                        bizagi.showMessageBox(self.getResource("workportal-widget-admin-language-error"));
                    }
                }).always(function() {
                    bizagi.util.smartphone.stopLoading();
                });
            } else {
                bizagi.util.smartphone.stopLoading();
            }

            // Clearing input Values
            $(that).val("");
        });

        // Check files number
        self.checkMaxFiles();

        // Attach delete option
        self.attachDeleteHandler();
    },

    /**
     * Add the interactions to the upload control items
     * @return {}
     */
    addInteractions: function () {
        var self = this;
        var container = self.getControl();

        //Handler to download the file
        $("ul.files", container).on("click", ".ui-bizagi-render-link.button", function () {
            if (bizagi.util.isNativePluginSupported()) {
                // ios native behaviour, should open files through a webview
                bizagiapp.openFileWebView({ "itemUrl": $(this).attr("data-url") });
            } else {
                // Android
                bizagi.util.media.downloadFile($(this).attr("data-url"), this.title);
            }
        });
    },

    /**
     * Handler of delete action
     * @returns {}
     */
    attachDeleteHandler: function () {
        var self = this;
        var control = self.getControl();

        $(".bz-rn-upload-delete-icon", control).on("click", function() {
            var item = $(this).parent(".ui-bizagi-render-upload-item");
            var file = item.data();
            $.when(self.deleteUploadItem(item, file.id))
                .done(function () {
                    // Remove item
                    item.hide();
                    item.remove();

                    // Update value
                    self.setValue(self.files, false);

                    // Check maxFiles
                    self.checkMaxFiles();

                    // Trigger change
                    self.triggerRenderChange();
                });
        });
    },

    /**
     * Handler of upload image
     * @param {} ordinal
     * @returns {}
     */
    handlerUploadImage: function(ordinal) {
        var self = this;

        var actionSelected = ordinal || 0;

        switch (actionSelected) {
            case 2:
                navigator.camera.getPicture(function (dataImage) {
                    self.dataImage = dataImage;
                    var extensions = self.Class.EXTENSIONSIMG.concat(self.Class.EXTENSIONSAUDIO, self.Class.EXTENSIONSVIDEO);
                    bizagi.util.smartphone.startLoading();

                    $.when(bizagi.util.media.checkMaxSize(dataImage, self.properties))
                        .done(function () {
                            //Gets the real properties for the file
                            $.when(bizagi.util.media.getFileDataInfo(self.dataImage))
                                .then(function(file) {
                                    self.fileProperties = file;
                                    if (bizagi.util.media.checkFileTypes(file, self.properties, extensions)) {
                                        // Force click to show actionsheet menu
                                        $(".bz-rn-upload-resolution-container", self.getContainerRender()).click();
                                    }
                                });
                        }).always(function() {
                        bizagi.util.smartphone.stopLoading();
                    });
                }, self.onFail.bind(self), {
                    quality: self.Class.QUALITY_PICTURE,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY
                });
                break;
            case 1:
                navigator.camera.getPicture(function(dataImage) {
                        bizagi.util.smartphone.startLoading();
                        $.when(bizagi.util.media.checkMaxSize(dataImage, self.properties))
                            .done(function() {
                                $.when(bizagi.util.media.getFileDataInfo(dataImage)).then(function(file) {
                                    self.fileProperties = file;
                                    self.saveImage(self, dataImage);
                                });
                            }).always(function() {
                            bizagi.util.smartphone.stopLoading();
                        });
                    },
                    self.onFail.bind(self),
                    {
                        quality: self.Class.QUALITY_PICTURE,
                        sourceType: navigator.camera.PictureSourceType.CAMERA,
                        mediaType: navigator.camera.MediaType.PICTURE,
                        destinationType: Camera.DestinationType.FILE_URI,
                        correctOrientation: true,
                        targetWidth: 1280,
                        targetHeight: 960
                    });
                break;
            case 3:
                navigator.device.capture.captureVideo(function(dataImage) {
                    bizagi.util.smartphone.startLoading();

                    $.when(bizagi.util.media.checkMaxSizeVideo(dataImage, self.properties))
                        .done(function() {
                            self.saveVideo(self, dataImage);
                        }).always(function() {
                        bizagi.util.smartphone.stopLoading();
                    });
                }, self.onFail.bind(self), { limit: self.Class.LIMIT });
                break;
            case 4:
                navigator.device.capture.captureAudio(function(mediaFiles) {

                    bizagi.util.smartphone.startLoading();
                    var audioUrl = mediaFiles[0].localURL;

                    $.when(bizagi.util.media.checkMaxSize(audioUrl, self.properties))
                        .done(function() {
                            self.saveAudio(self, mediaFiles);
                        }).always(function() {
                        bizagi.util.smartphone.stopLoading();
                    });

                }, self.onFail.bind(self), { limit: self.Class.LIMIT });
                break;
        }
    },

    /**
     * Handler of resolution upload
     * @param {} ordinal
     * @returns {}
     */
    handlerResolutionUpload: function(ordinal) {
        var self = this;
        var actionSelected = ordinal || 0;

        bizagi.util.smartphone.startLoading();

        //if original, save image normally, if not, reduce quality and size
        if (actionSelected === 4) {
            self.saveImage(self, self.dataImage);
        } else {
            var resolution = bizagi.util.media.getImageResolution(actionSelected);
            $.when(self.transformImageSize(self.dataImage, resolution.width, resolution.height))
                .done(function() {
                    self.saveImage(self, self.dataImage);
                    bizagi.util.smartphone.stopLoading();
                });
        }
    },

    /**
     * CheckImageFile
     * @param {} fileName
     * @returns {}
     */
    checkImageFile: function (fileName) {
        var self = this;
        var validExtensions = self.Class.EXTENSIONSIMG;

        if (!fileName || bizagi.util.isObjectEmpty(fileName)) return false;

        for (var i = 0, length = validExtensions.length; i < length; i++) {
            var image = fileName.indexOf("." + validExtensions[i]);

            if (image >= 0) {
                return true;
            }
        }

        return false;
    },

    /**
     * Templates
     * @returns {}
     */
    getTemplateName: function () {
        return "upload";
    },

    getTemplateItemName: function () {
        return "uploadItem";
    },

    getTemplateEditionName: function () {
        return "edition.upload";
    },

    getTemplateEditionMenu: function () {
        return "edition.upload.menu";
    },

    /**
     * saveImage
     * @param {} context
     * @param {} dataImage
     * @returns {}
     */
    saveImage: function(context, dataImage) {
        var self = context;
        var params = {
            dataFile: dataImage,
            data: self.buildAddParams(),
            options: new FileUploadOptions(),
            properties: self.properties,
            extensions: self.Class.EXTENSIONSIMG.concat(self.Class.EXTENSIONSFILE,
                self.Class.EXTENSIONSAUDIO, self.Class.EXTENSIONSVIDEO)
        };

        params.data.queueID = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());
        params.options.fileKey = "file";
        params.options.fileName = self.fileProperties.name;
        params.options.mimeType = "image/jpeg";
        params.options.params = params.data;

        if (self.editedImageURL) {
            params.dataFile = self.editedImageURL;
            self.editedImageURL = null;
        } else {
            params.dataFile = self.fileProperties.url;
        }

        // Fix android 4.4 getting images from recent folder        
        params.dataFile = bizagi.util.media.getImagePath(params.dataFile);

        $.when(bizagi.util.media.uploadFile(params)).done(function(r) {
            var response = JSON.parse(decodeURIComponent(r.response));
            if (response.type === "error") {
                bizagi.showMessageBox(response.message, response.errorType);
                bizagi.util.smartphone.stopLoading();
            } else {
                self.onUploadFileCompleted(context, response);
            }
        }).fail(function(error) {
            var response = JSON.parse(decodeURIComponent(error.responseText));
            bizagi.showMessageBox(response.message, response.type);
        }).always(function() {
            bizagi.util.smartphone.stopLoading();
        });
    },

    /**
     * saveAudio
     * @param {} context
     * @param {} dataAudio
     * @returns {}
     */
    saveAudio: function (context, dataAudio) {
        var self = context;
        var params = {
            data: self.buildAddParams(),
            options: new FileUploadOptions(),
            properties: self.properties
        };

        params.data.queueID = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());
        params.options.fileName = dataAudio[0].name;
        params.options.params = params.data;
        params.dataFile = dataAudio[0].fullPath;

        $.when(bizagi.util.media.uploadFile(params)).done(function(r){
            var response = JSON.parse(decodeURIComponent(r.response));
            if (response.type === "error") {
                bizagi.showMessageBox(response.message, response.errorType);
            } else {
                self.onUploadFileCompleted(context, response);
            }
        }).fail(function() {
        }).always(function() {
            bizagi.util.smartphone.stopLoading();
        });
    },

    /**
     * saveVideo
     * @param {} context
     * @param {} dataVideo
     * @returns {}
     */
    saveVideo: function (context, dataVideo) {
        var self = context;
        var params = {
            data: self.buildAddParams(),
            options: new FileUploadOptions(),
            properties: self.properties
        };

        params.data.queueID = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());
        params.options.fileName = dataVideo[0].name;
        params.options.params = params.data;
        params.dataFile = dataVideo[0].fullPath;

        $.when(bizagi.util.media.uploadFile(params)).done(function(r){
            var response = JSON.parse(decodeURIComponent(r.response));
            if (response.type === "error") {
                bizagi.showMessageBox(response.message, response.errorType);
            } else {
                self.onUploadFileCompleted(context, response);
            }
        }).fail(function() {
        }).always(function() {
            bizagi.util.smartphone.stopLoading();
        });
    },

    /**
     * onFail
     * @param {} error
     * @returns {}
     */
    onFail: function(error) {
        bizagi.util.smartphone.stopLoading();
        bizagi.log("Error: " + error.code);

        var messageError = bizagi.util.processFailMessage(error);
        var message;

        if (messageError.indexOf("No Activity found to handle Intent") !== -1) {
            message = bizagi.util.isValidResource("render-upload-error-media-app") ?
                bizagi.localization.getResource("render-upload-error-media-app") :
                "Your device does not have an app to execute this action.";
            bizagi.showMessageBox(message);

        }
    },

    /**
     * onUploadFileCompleted
     * @param {} context
     * @param {} response
     * @returns {}
     */
    onUploadFileCompleted: function (context, response) {
        var self = context;
        var control = self.getControl();
        var result = response;
        var properties = self.properties;
        var uploadWrapper = $(".ui-bizagi-render-upload-container .files", control);

        if (result.id && result.fileName) {
            // Locate it before the upload wrapper
            var newItem = self.renderUploadItem(result);
            uploadWrapper.append(newItem);

            // Increment counter
            self.filesCount = self.filesCount + 1;

            // Copy the files value but not its reference
            var files = self.files.slice();

            //Add the new item to this temporal array
            files.push([result.id, result.fileName]);

            // Update value
            self.setValue(files, false);

            // Check maxFiles
            self.checkMaxFiles();

            // Trigger change
            self.triggerRenderChange();

            if (properties.allowDelete && properties.editable) {
                self.attachDeleteHandler();
            }

            if (self.properties.type === "columnUpload") {
                // Refresh to have synchronized the file between sever and client
                setTimeout(function () {
                    self.getFormContainer().refreshForm();
                }, 200);
            }

            self.editedImageURL = null;
            bizagi.util.smartphone.stopLoading();

        } else {
            bizagi.log("Error:" + result.message);
            bizagi.showMessageBox(result.message, "Error");
        }
    },

    /**
     * Check maximum number of files
     * @returns {}
     */
    checkMaxFiles: function () {
        var self = this;
        var maxFiles = self.properties.maxfiles;
        var actualFiles = self.properties.value?self.properties.value.length:0;

        if (maxFiles !== 0 && ((self.filesCount >= maxFiles && actualFiles >= maxFiles))) {
            self.itemAddfile.hide();
        } else {
            self.itemAddfile.show();
        }
    },

    /**
     * Check allow extensions and define possible choices
     * @returns {}
     */
    getUploadChoices: function () {
        var self = this;
        var validExtensions = self.properties.validExtensions;

        var enableFiles = false;
        var enableVideo = false;
        var enableAudio = false;
        var enableImage = false;

        var itemsUpload = [];

        if (typeof (validExtensions) === "undefined" || validExtensions === "") {
            enableFiles = enableVideo = enableAudio = enableImage = true;
        } else {

            validExtensions = validExtensions.split(";");
            if (validExtensions.length === 1 && validExtensions[0].indexOf("*.*") !== -1) {
                enableVideo = enableAudio = enableImage = true;
            } else {

                for (var i = 0, length = validExtensions.length; i < length; i++) {
                    validExtensions[i] = validExtensions[i].replace("*.", "");

                    if (self.Class.EXTENSIONSFILE.toString().indexOf(validExtensions[i]) >= 0) {
                        enableFiles = true;
                    }

                    if (self.Class.EXTENSIONSIMG.toString().indexOf(validExtensions[i]) >= 0) {
                        enableImage = true;
                    }

                    if (self.Class.EXTENSIONSAUDIO.toString().indexOf(validExtensions[i]) >= 0) {
                        enableAudio = true;
                    }

                    if (self.Class.EXTENSIONSVIDEO.toString().indexOf(validExtensions[i]) >= 0) {
                        enableVideo = true;
                    }
                }
            }
        }

        if (!enableFiles && !enableAudio && !enableImage && !enableVideo) {
            self.itemAddfile.hide();
        }

        // Add upload options
        if (enableFiles && bizagi.util.media.fileAPISupported() && (bizagi.util.detectDevice() === "smartphone_android" && !bizagi.util.isCordovaSupported( ))) {
            //Upload any file
            itemsUpload.push({ "guid": 5, "displayName": bizagi.localization.getResource("render-upload-link-label") });
        }

        if ( bizagi.util.isCordovaSupported( ) ) {
            if (enableImage) {
                //Take photo, Choose photo
                itemsUpload.push({
                    "guid": 1,
                    "displayName": bizagi.localization.getResource("workportal-actionsheet-upload-take-photo")
                });
                itemsUpload.push({
                    "guid": 2,
                    "displayName": bizagi.localization.getResource("workportal-actionsheet-upload-choose-photo")
                });
            }

            if (enableVideo) {
                //Take video
                itemsUpload.push({
                    "guid": 3,
                    "displayName": bizagi.localization.getResource("workportal-actionsheet-upload-take-video")
                });
            }

            if (enableAudio) {
                //Take audio
                itemsUpload.push({
                    "guid": 4,
                    "displayName": bizagi.localization.getResource("workportal-actionsheet-upload-record-audio")
                });
            }
        }


        return itemsUpload;
    },

    /**
     * Save blob to file
     * @param {} blob
     * @param {} defer
     * @returns {}
     */
    saveBlobToFile: function(blob, defer) {
        var self = this;
        var newId = "bizagiImgTmp";
        var fileExtension = ".jpg";

        // Root file system entry
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fileSystem) {
                var root = fileSystem.root;
                // writes a file
                var writeFile = function (writer) {

                    writer.onwriteend = function () {
                        self.editedImageURL = writer.localURL;
                        bizagi.log("Write completed.");

                        defer.resolve();
                    };

                    writer.onerror = function (e) {
                        bizagi.log("Write failed: " + e.toString());
                    };

                    // write to file
                    writer.write(blob);
                };

                // creates a FileWriter object
                var createWriter = function (fileEntry) {
                    fileEntry.createWriter(writeFile, null);
                };

                // create a file and write to it
                root.getFile(newId + fileExtension, { create: true }, createWriter, null);
            },
            function () {

            });
    },

    /**
     * Transform image size
     * @param {} objectUri
     * @param {} objWidth
     * @param {} objHeight
     * @returns {}
     */
    transformImageSize: function (objectUri, objWidth, objHeight) {
        var self = this;
        var defer = new $.Deferred();

        window.resolveLocalFileSystemURL(objectUri, function (fileEntry) {
            fileEntry.file(function (fileObj) {

                var reader = new FileReader();

                // Create a function to process the file once it's read
                reader.onloadend = function () {
                    // Create an image element that we will load the data into
                    var image = new Image();
                    image.onload = function () {

                        var width = image.width;
                        var height = image.height;

                        if (objWidth !== 0) {

                            if (width > height) {
                                if (width > objWidth) {
                                    height *= objWidth / width;
                                    width = objWidth;
                                }
                            } else {
                                if (height > objHeight) {
                                    width *= objHeight / height;
                                    height = objHeight;
                                }
                            }
                        }

                        var canvas = document.createElement("canvas");

                        canvas.width = width;
                        canvas.height = height;
                        canvas.getContext("2d").drawImage(this, 0, 0, width, height);

                        self.properties.url = canvas.toDataURL("image/jpeg", 0.5);
                        
                        var imageToSaveLocal = self.properties.url.replace("data:image/jpeg;base64,", "");
                        var imageBlob = bizagi.util.b64toBlob(imageToSaveLocal);
                        self.saveBlobToFile(imageBlob, defer);

                        image = null;

                    };

                    // Load the read data into the image source. It's base64 data
                    image.src = bizagi.util.media.getImagePath(objectUri);
                };

                // Read from disk the data as base64
                reader.readAsDataURL(fileObj);
            });
        });

        return defer.promise();
    },

    /**
     * Check if the maximun number of files than can be uploaded has been reached
     * @returns {}
     */
    itIsMaxNumberFilesReached: function () {
        var self = this;
        var properties = self.properties;
        var maxFiles = properties.maxfiles;
        var actualFiles = properties.value?properties.value.length:0;
        return (maxFiles !== 0 && (actualFiles >= maxFiles));
    },

    /**
     * Build add params to send to the server
     * @param {} dataFile
     * @returns {}
     */
    buildAddFileParams: function (dataFile) {
        var self = this;
        var properties = self.properties;

        // Get form data for POSTing
        var formData = new FormData();
        var form = self.getFormContainer();

        // Build add params to send to the server
        formData.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath", self.getUploadXpath());
        formData.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender", properties.id);
        formData.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext", properties.xpathContext);
        formData.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE, properties.idPageCache);
        formData.append(self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId", form.properties.sessionId);
        formData.append(properties.xpath, dataFile);

        if (properties.contexttype) {
            formData.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype", properties.contexttype);
        }

        try {
            if (typeof (BIZAGI_SESSION_NAME) !== "undefined") {
                formData.append(BIZAGI_SESSION_NAME, form.properties.sessionId);
            } else {
                formData.append("JSESSIONID", form.properties.sessionId);
            }
        } catch (e) {
            formData.append("JSESSIONID", form.properties.sessionId);
        }

        return formData;
    },

    /**
     * Process an upload file into the server
     * @param {} context
     * @param {} dataFile
     * @returns {}
     */
    processUploadFile: function(dataFile) {
        var self = this;

        return self.dataService.processUploadFile({
            url: self.properties.addUrl,
            formData: self.buildAddFileParams(dataFile)
        });
    },

    clearDisplayValue: function(){
        var self = this;
        var items = $(".ui-bizagi-render-upload-item", self.getControl());

        items.each(function(index,  item){
            item = $(item);
            var file = item.data();
            $.when(self.deleteUploadItem(item, file.id)).done(function () {
                // Remove item
                item.hide();
                item.remove();

                // Update value
                self.setValue(self.files, false);

                // Check maxFiles
                self.checkMaxFiles();

                // Trigger change
                self.triggerRenderChange();
            });
        })
    }
});