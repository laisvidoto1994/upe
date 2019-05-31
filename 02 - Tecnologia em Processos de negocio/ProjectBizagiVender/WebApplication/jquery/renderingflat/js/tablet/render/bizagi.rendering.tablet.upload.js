/*
 *   Name: BizAgi Tablet Render upload Extension
 *   Author: Bizagi Mobile Team
 *   Comments:
 *   -   This script will redefine the label render class to adjust to smartphones devices
 */

// Extends itself
bizagi.rendering.upload.extend("bizagi.rendering.upload", {
    BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
    BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX,
    QUALITY_PICTURE: 80,
    LIMIT: 1, // limit: The maximum number of audio clips,video clips, etc.
    // in the device user can record in a single capture operation.
    EXTENSIONSIMG: ["image/jpeg", "jpeg", "image", "png", "jpg"],
    EXTENSIONSFILE: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "zip", "rar", "txt"],
    EXTENSIONSVIDEO: ["video/quicktime", "quicktime", "qt", "mov"],
    EXTENSIONSAUDIO: ["audio/wav", "audio", "wav"]
}, {
    postRender: function() {
        var self = this;
        var properties = self.properties;

        // Call base 
        self._super();

        if ((!bizagi.util.isCordovaSupported( ) && !bizagi.util.media.fileAPISupported()) || !properties.editable) {
            self.addEventToOpenSlide();
        } else if ( !bizagi.util.isCordovaSupported( ) ) {
            self.activeUploadWebControl();
        } else {
            self.activateUploadNative();
        }

        //Handler to download the file
        $("ul.files", self.getControl()).on("click", ".ui-bizagi-render-link.button", function (e) {
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
     * Render readonly
     * @returns {}
     */
    postRenderReadOnly: function() {
        var self = this;

        // Call base 
        self._super();

        if (bizagi.util.isNativePluginSupported()) {
            var filesLinkElements = self.getControl().find(".ui-bizagi-render-link");
            filesLinkElements.on("click", function() {
                bizagiapp.openFileWebView({ "itemUrl": $(this).attr("data-url") });
            });
        } else if (!bizagi.util.isCordovaSupported()) {
            if (self.files !== "undefined" && self.files.length > 0) {
                self.addEventToOpenSlide();
            }
        }
    },

    /**
     * Attach open slide
     * @returns {}
     */
    addEventToOpenSlide: function() {
        var self = this;
        var mode = self.getMode();
        var control = self.getControl();
        var container = self.getControl();
        var formParams = self.getFormParams();

        self.itemAddfile = $(".bz-rn-upload-show-menu", container);
        self.itemAddfile.hide();

        if( !bizagi.util.isCordovaSupported( ) && !bizagi.util.media.fileAPISupported() ) {
            self.element.addClass("bz-rn-read-only");
        }

        $("li", control).click(function(event) {
            var url = $(this).data("url");
            if (mode === "execution") {
                // Avoid redirect & download
                event.preventDefault();
                event.stopPropagation();
                var slideView = new bizagi.rendering.tablet.slide.view.upload(self.dataService, self.renderFactory, {
                    title: self.properties.displayName || "",
                    container: self.getFormContainer().container,
                    formParams: formParams,
                    navigation: formParams.navigation,
                    url: url
                });

                slideView.render({ url: url });
            }
        });
    },

    /**
     * Active upload by native mode
     * @returns {}
     */
    activateUploadNative: function() {
        var self = this;
        var properties = self.properties;
        var container = self.getControl();

        self.renderControl();
        self.itemAddfile = $(".bz-rn-upload-show-menu", container);

        if (!bizagi.util.isCordovaSupported() || !properties.editable) {
            self.itemAddfile.hide();
        }

        // Check files number
        self.checkMaxFiles();

        // Attach delete option
        self.attachDeleteHandler();

        // Check files extensions
        self.checkExtensions();

        // Not has valid extensions
        if (self.validOptions && (!self.validOptions.image && !self.validOptions.video && !self.validOptions.audio)) {
            self.itemAddfile.hide();
            return;
        }

        var uploadTemplate = self.renderFactory.getTemplate("uploadModalView");
        var kendoTemplate = kendo.template(uploadTemplate, { useWithBlock: false });

        // Creating modal view  
        var $modalView = $.trim(kendoTemplate({
            editable: self.properties.editable,
            noFiles: self.properties.noFiles,
            displayName: self.properties.displayName || "",
            validExtensions: self.validOptions
        }));

        self.itemAddfile.bind("click", function(e) {
            var modalView = new kendo.mobile.ui.ModalView($modalView, {
                close: function() {
                    this.destroy();
                    this.element.remove();
                },
                modal: false
            });

            self.configureModalViewHandlers(modalView.element);
            modalView.open();
        });
    },

    /**
     * Configure the modalView Handlers for the new combo control.
     * @param {} inputContainer
     * @returns {}
     */
    configureModalViewHandlers: function(inputContainer) {
        var self = this;

        // Getting combo list elements
        self.listOptions = inputContainer.find(".bz-rn-upload-options li");

        // Setting the initial selected display value
        self.listOptions.bind("click", function() {
            self.applyPlugin($(this).data("role"), this.getBoundingClientRect());
        });

        inputContainer.find(".bz-wp-modalview-close").bind("click", function() {
            if (inputContainer.data("kendoMobileModalView")) {
                inputContainer.data("kendoMobileModalView").close();
            }
        });
    },

    /**
     * Attach delete option
     * @returns {}
     */
    attachDeleteHandler: function() {
        var self = this;
        var control = self.getControl();

        $(".bz-rn-upload-delete-icon", control).bind("click", function() {
            var item = $(this).parent(".ui-bizagi-render-upload-item");
            var file = item.data();

            $.when(self.deleteUploadItem(item, file.id))
                .done(function() {
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
     * Apply plugin
     * @param {} option
     * @param {} coordinates
     * @returns {}
     */
    applyPlugin: function(option, coordinates) {
        var self = this;
        var resolutionUpload;

        // If android version is less than 4.4 avoid to show upload sizes due to compatibility with blob files
        var version = bizagi.util.getAndroidVersion();
        var hideUploadSizes = version && version <= 4.4;

        // Resolution upload menu
        if (hideUploadSizes) {
            resolutionUpload = [
                { "guid": 4, "displayName": bizagi.localization.getResource("workportal-size-original") }
            ];
        } else {
            resolutionUpload = [
                { "guid": 1, "displayName": bizagi.localization.getResource("workportal-size-small") },
                { "guid": 2, "displayName": bizagi.localization.getResource("workportal-size-medium") },
                { "guid": 3, "displayName": bizagi.localization.getResource("workportal-size-large") },
                { "guid": 4, "displayName": bizagi.localization.getResource("workportal-size-original") }
            ];
        }

        // Attach document
        $(".bz-resolution-container", self.getControl()).actionSheet({
            actions: resolutionUpload,
            actionClicked: function(action) {
                $.when(self.resolutionButtonHandler(action.guid)).done(function() {
                    self.closeModalView();
                });
            }
        });

        switch (option) {
            case "image":
                // Check is offline form          
                var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

                // Select image
                var popover = new CameraPopoverOptions(coordinates.left, coordinates.top - 20, 200, 100, 4);
                var options = {
                    quality: self.Class.QUALITY_PICTURE,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    popoverOptions: popover
                };

                navigator.camera.getPicture(function(dataImage) {
                    self.dataImage = dataImage;
                    var extensions = self.Class.EXTENSIONSIMG.concat(self.Class.EXTENSIONSAUDIO, self.Class
                        .EXTENSIONSVIDEO);

                    $.when(bizagi.util.media.checkMaxSize(dataImage, self.properties))
                        .done(function() {
                            $.when(bizagi.util.media.getFileDataInfo(self.dataImage))
                                .then(function(file) {

                                    self.fileProperties = file;

                                    if (bizagi.util.media.checkFileTypes(file, self.properties, extensions)) {
                                        // "new Blob" constructor is not supported in android version 4.2.2
                                        var version = bizagi.util.getAndroidVersion();
                                        if ((version && version <= 4.2) || isOfflineForm) {
                                            self.saveImage(self, self.dataImage);
                                            self.closeModalView();
                                        } else {
                                            // Force click to show actionsheet menu
                                            $(".bz-resolution-container", self.getControl()).click();
                                        }
                                    }
                                });
                        });
                }, self.onFail.bind(self), options);
                break;

            case "file":
                bizagi.showMessageBox("In development", "Error");
                break;

            case "cimage":
                navigator.camera.getPicture(function(dataImage) {
                    $.when(bizagi.util.media.checkMaxSize(dataImage, self.properties)).done(function() {
                        $.when(bizagi.util.media.getFileDataInfo(dataImage)).then(function(file) {
                            self.fileProperties = file;
                            self.saveImage(self, dataImage);
                        });
                    }).always(function() {
                        self.closeModalView();
                    });
                }, self.onFail.bind(self), {
                    quality: self.Class.QUALITY_PICTURE,
                    targetWidth: 1280,
                    targetHeight: 960
                });
                break;

            case "caudio":
                navigator.device.capture.captureAudio(function(dataImage) {
                    self.saveAudio(self, dataImage);
                }, self.onFail.bind(self), { limit: self.Class.LIMIT });
                break;

            case "cvideo":
                navigator.device.capture.captureVideo(function(dataImage) {
                    bizagi.util.tablet.startLoading();

                    $.when(bizagi.util.media.checkMaxSizeVideo(dataImage, self.properties)).done(function() {
                        self.saveVideo(self, dataImage);
                    }).always(function() {
                        self.closeModalView();
                        bizagi.util.tablet.stopLoading();
                    });
                }, self.onFail.bind(self), { limit: self.Class.LIMIT });
                break;

            default:
                break;
        }
    },

    closeModalView: function() {
        var self = this;
        var modalView = self.listOptions.closest("#modalview-upload-options");

        if (self.listOptions && modalView) {
            if (modalView.data("kendoMobileModalView")) {
                modalView.data("kendoMobileModalView").close();
            }
        }
    },

    resolutionButtonHandler: function(ordinal) {
        var self = this;
        var defer = new $.Deferred();
        var actionSelected = ordinal || 0;

        bizagi.util.tablet.startLoading();

        // If original, save image normally, if not, reduce quality and size
        if (actionSelected === 4) {
            self.saveImage(self, self.dataImage);
            defer.resolve();
        } else {
            var resolution = bizagi.util.media.getImageResolution(actionSelected);
            $.when(self.transformImageSize(self.dataImage, resolution.width, resolution.height))
                .done(function() {
                    self.saveImage(self, self.dataImage);
                }).fail(function() {
                bizagi.util.tablet.stopLoading();
            }).always(function() {
                defer.resolve();
            });
        }

        $(".ui-bizagi-resolution-container").css("display", "none");
        $(".ui-bizagi-mask").remove();

        return defer.promise();
    },

    renderUploadItem: function(file) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var template = self.renderFactory.getTemplate("uploadItem");

        // Don't render urls when not running in execution mode
        var url = mode !== "execution" ? "javascript:void(0);" : self.buildItemUrl(file);

        var html = $.fasttmpl(template, {
            url: url,
            image: false,
            allowDelete: properties.allowDelete,
            editable: properties.editable,
            filename: file.fileName,
            id: file.id,
            mode: mode,
            isNativeContext: bizagi.util.isNativePluginSupported(),
            isCordovaSupported: bizagi.util.isCordovaSupported()
        });

        return html;

    },

    getTemplateName: function() {
        return "upload";
    },

    getTemplateItemName: function() {
        return "uploadItem";
    },

    getTemplateEditionName: function() {
        return "edition.upload";
    },

    getTemplateEditionMenu: function() {
        return "edition.upload.menu";
    },

    saveImage: function(context, dataImage) {
        var self = context;
        var params = {
            dataFile: dataImage,
            data: self.buildAddParams(),
            options: new FileUploadOptions(),
            properties: self.properties,
            extensions: self.Class.EXTENSIONSIMG.concat(self.Class.EXTENSIONSFILE, self.Class.EXTENSIONSAUDIO, self
                .Class.EXTENSIONSVIDEO)
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
                bizagiLoader().stop();
            } else {
                self.onUploadFileCompleted(context, response);
            }
        }).fail(function(error) {
            var response = JSON.parse(decodeURIComponent(error.responseText));
            bizagi.showMessageBox(response.message, response.type);
        }).always(function() {
            self.closeModalView();
            bizagiLoader().stop();
        });
    },

    saveAudio: function(context, dataAudio) {
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

        $.when(bizagi.util.media.uploadFile(params)).done(function(r) {
            var response = JSON.parse(decodeURIComponent(r.response));
            if (response.type === "error") {
                bizagi.showMessageBox(response.message, response.errorType);
            } else {
                self.onUploadFileCompleted(context, response);
            }
        }).fail(function(error) {
        }).always(function() {
            self.closeModalView();
            bizagiLoader().stop();
        });
    },

    saveVideo: function(context, dataVideo) {
        var self = context;
        var params = {
            data: self.buildAddParams(),
            options: new FileUploadOptions(),
            properties: self.properties
        };

        params.data.queueID = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());
        params.options.fileName = dataVideo[0].name;
        params.options.mimeType = "video/quicktime";
        params.options.params = params.data;
        params.dataFile = dataVideo[0].fullPath;

        $.when(bizagi.util.media.uploadFile(params)).done(function(r) {
            var response = JSON.parse(decodeURIComponent(r.response));
            if (response.type === "error") {
                bizagi.showMessageBox(response.message, response.errorType);
            } else {
                self.onUploadFileCompleted(context, response);
            }
        }).fail(function(error) {
        }).always(function() {
            self.closeModalView();
            bizagiLoader().stop();
        });
    },

    onFail: function(error) {
        bizagi.log("Error: " + error.code);

        var messageError = bizagi.util.processFailMessage(error);
        var message;

        if (messageError.indexOf("No Activity found to handle Intent") !== -1) {
            message = bizagi.util.isValidResource("render-upload-error-media-app") ? bizagi.localization
                .getResource("render-upload-error-media-app")
                : "Your device does not have an app to execute this action.";

            bizagi.showMessageBox(message);
        }
    },

    onUploadFileCompleted: function(context, response) {
        var self = context;
        var control = self.getControl();
        var uploadWrapper = $("ul.files", control);
        var result = response;
        var properties = self.properties;

        if (result.id && result.fileName) {
            // Locate it before the upload wrapper
            var newItem = self.renderUploadItem(result);
            $(uploadWrapper).append(newItem);

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

            control.find(".ui-bizagi-render-upload-item-no-upload").hide();

            if (self.properties.type === "columnUpload") {
                // Refresh to have synchronized the file between sever and client
                bizagiLoader().stop();
                self.getFormContainer().saveForm();
                self.getFormContainer().refreshForm();
            } else {
                if (properties.allowDelete && properties.editable) {
                    self.attachDeleteHandler();
                }
            }

            self.editedImageURL = null;
            bizagiLoader().stop();
        } else {
            bizagi.log("Error:" + result.message);
            bizagi.showMessageBox(result.message, "Error");
        }
    },

    saveBlobToFile: function(blob, defer) {
        // root file system entry
        var self = this;
        var newId = "bizagiImgTmp";
        var fileExtension = ".jpg";

        // root file system entry
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) {
                var root = fileSystem.root;
                // writes a file
                var writeFile = function(writer) {

                    writer.onwriteend = function(e) {
                        self.editedImageURL = writer.localURL;
                        defer.resolve();
                    };

                    writer.onerror = function(e) {
                        //bizagi.log("Write failed: " + e.toString());
                    };

                    // write to file
                    writer.write(blob);
                };

                // creates a FileWriter object
                var createWriter = function(fileEntry) {
                    fileEntry.createWriter(writeFile, null);
                };

                // create a file and write to it
                root.getFile(newId + fileExtension, { create: true }, createWriter, null);
            },
            function() {
            });
    },

    /**
     * Change image size
     * @param {} objectUri
     * @param {} objWidth
     * @param {} objHeight
     * @returns {}
     */
    transformImageSize: function(objectUri, objWidth, objHeight) {
        var self = this;
        var defer = new $.Deferred();

        window.resolveLocalFileSystemURL(objectUri, function(fileEntry) {
            fileEntry.file(function(fileObj) {

                var reader = new FileReader();

                // Create a function to process the file once it's read
                reader.onloadend = function(evt) {
                    // Create an image element that we will load the data into
                    var image = new Image();
                    image.onload = function(evt) {

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
     * Checks if the total files uploaded reachs the maximun supported
     * @returns {}
     */
    checkMaxFiles: function() {
        var self = this;
        var properties = self.properties;
        var maxFiles = properties.maxfiles;
        var actualFiles = properties.value ? properties.value.length : 0;

        if (maxFiles !== 0 && ((self.filesCount >= maxFiles && actualFiles >= maxFiles))) {
            self.itemAddfile.hide();
        } else {
            self.itemAddfile.show();
        }
    },

    /**
     * Checks the file Extension in each filetype that the device supports
     * @returns {}
     */
    checkExtensions: function() {
        var self = this;
        var properties = self.properties;
        var validExtensions = properties.validExtensions;

        validExtensions = validExtensions.split(";");

        self.validOptions = {
            audio: false,
            video: false,
            image: false,
            file: false
        };

        if (typeof (validExtensions) === "undefined" || validExtensions[0] == "") {
            self.validOptions = {
                audio: true,
                video: true,
                image: true,
                file: false
            };
            return;
        }

        if (validExtensions.length === 1 && validExtensions[0].indexOf("*.*") !== -1) {
            return;
        }

        var i = validExtensions.length;

        while(i-- > 0) {
            validExtensions[i] = validExtensions[i].replace("*.", "");

            if (self.Class.EXTENSIONSIMG.toString().indexOf(validExtensions[i]) > 0  && !self.validOptions.image) {
                self.validOptions.image = true;
            } else if (self.Class.EXTENSIONSAUDIO.toString().indexOf(validExtensions[i]) > 0 && !self.validOptions.audio) {
                self.validOptions.audio = true;
            } else if (self.Class.EXTENSIONSVIDEO.toString().indexOf(validExtensions[i]) > 0 && !self.validOptions.video) {
                self.validOptions.video = true;
            }
        }
    },

    /**
     * Active upload web control
     * @returns {}
     */
    activeUploadWebControl: function() {
        var self = this;
        var container = self.getControl();
        var uploadfile = $(".bz-rn-upload-web", container);
        var file = $(".bz-rn-upload-show-menu span.bz-cm-icon", container);

        self.itemAddfile = $(".bz-rn-upload-show-menu", container);

        // Check maximum files number
        if (self.itIsMaxNumberFilesReached()) {
            self.itemAddfile.hide();
        }

        self.itemAddfile.click(function(){
            uploadfile.click();
        });

        // attach events to file-icon
        file.addClass("bz-rn-upload-native");
        file.on("click", function() {
            uploadfile.click();
        });

        // Attach event to upload-control
        uploadfile.on("change", function() {
            var that = this;
            var dataFile = that.files[0];
            var extensions = self.Class.EXTENSIONSIMG.concat(self.Class.EXTENSIONSFILE, self.Class.EXTENSIONSAUDIO, self
                .Class.EXTENSIONSVIDEO);

            bizagiLoader().start();

            dataFile.fullPath = that.value;

            if (bizagi.util.media.checkMaxSizeFile(dataFile, self.properties)
                && bizagi.util.media.checkFileTypes(dataFile, self.properties, extensions)) {
                $.when(self.processUploadFile(dataFile)).done(function(result) {
                    self.onUploadFileCompleted(self, JSON.parse(decodeURIComponent(result)));
                    bizagiLoader().stop();
                }).fail(function(error) {
                    bizagiLoader().stop();
                    if (error.statusText !== "Unauthorized") {
                        bizagi.showMessageBox(self.getResource("workportal-widget-admin-language-error"));
                    }
                });
            } else {
                bizagiLoader().stop();
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
     * Check the maximun file than can be uploaded
     * @returns {}
     */
    itIsMaxNumberFilesReached: function() {
        var self = this;
        var properties = self.properties;
        var maxFiles = properties.maxfiles;
        var actualFiles = properties.value ? properties.value.length : 0;

        return maxFiles !== 0 && (actualFiles >= maxFiles);
    },

    /**
     * Build add params to send to the server
     * @param {} dataFile
     * @returns {}
     */
    buildAddFileParams: function(dataFile) {
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