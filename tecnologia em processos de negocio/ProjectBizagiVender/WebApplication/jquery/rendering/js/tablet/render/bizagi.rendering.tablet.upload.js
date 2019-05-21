/*
*   Name: Bizagi Tablet Render upload Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the label render class to adjust to smartphones devices
*/

// Extends itself
bizagi.rendering.upload.extend("bizagi.rendering.upload", {
    BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
    BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX,
    QUALITY_PICTURE: 80,
    LIMIT: 1, // Limit: The maximum number of audio clips,videoclips, etc.
    // in the device user can record in a single capture operation.
    EXTENSIONSIMG: ["image/jpeg", "jpeg", "image", "png", "jpg"],
    EXTENSIONSVIDEO: ["video/quicktime", "quicktime", "qt", "mov"],
    EXTENSIONSAUDIO: ["audio/wav", "audio", "wav"]
}, {
    postRender: function () {
        var self = this;

        // Call base 
        self._super();

        if (!bizagi.util.isCordovaSupported() && !self.supportFileAPI()) {
            self.addEventToOpenSlide();
        } else if (!bizagi.util.isCordovaSupported()) {
            self.activeUploadWebControl();
        } else {
            self.activateUploadNative();
        }
    },

    postRenderReadOnly: function () {
        var self = this;

        // Call base 
        self._super();

        if (!bizagi.util.isCordovaSupported()) {
            if(self.files && self.files.length > 0){
                self.addEventToOpenSlide();
            }
        }
    },

    addEventToOpenSlide: function () {
        var self = this;
        var mode = self.getMode();
        var control = self.getControl();
        var container = self.getControl();

        self.itemAddfile = $(".bz-rn-upload-show-menu", container);
        self.itemAddfile.hide();

        $("li", control).click(function () {
            var url = $(this).data('url');

            if (mode === "execution") {
                var slide = new bizagi.rendering.tablet.slide.upload(self.dataService, self.renderFactory, {
                    container: self.getFormContainer().container,
                    url: url
                });

                slide.render({ url: url });
            }
        });
    },

    activateUploadNative: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getControl();
        var body = $("body");

        self.renderControl();

        self.itemAddfile = $(".bz-rn-upload-show-menu", container);
        self.itemResolutionUpload = $(".ui-bizagi-resolutionUploadFrame", container);

        if (!bizagi.util.isCordovaSupported() || properties.editable == false) {
            self.itemAddfile.hide();
            return;
        }

        self.itemsUpload = {
            "file": $(".file", container),
            "image": $(".image", container),
            "cimage": $(".cimage", container),
            "caudio": $(".caudio", container),
            "cvideo": $(".cvideo", container)
        };

        self.itemAddfile.bind("click", function (e) {
            var containerUploadItems = $(".bz_rn_upload_container_upload_items", container);

            if (containerUploadItems.hasClass("bz_clone_active")) {
                containerUploadItems.removeClass("bz_clone_active");

                var divClone = $("#bz_active_clone_Upload", body);

                divClone.hide();
                divClone.remove();

                containerUploadItems.hide();

                self.removeListener();

                return;
            }

            if (containerUploadItems.is(":visible")) {
                containerUploadItems.hide();
                self.removeListener();

                return;
            }

            try {
                // This try/catch is use for close other upload controls in the form
                var formContainer = self.getContainerRender().parent();
                if (formContainer) {
                    formContainer.find(".bz_rn_upload_container_upload_items:visible").hide();
                }
            } catch (error) {
                bizagi.log(error);
            }

            // Verify the visivility for container and puts the class for arrow
            containerUploadItems.show();
            var heigthContainer = parseInt(containerUploadItems.css("height"));

            if (((self.itemAddfile.offset().top - 60) - heigthContainer) > 0) {

                containerUploadItems.addClass("bottomArrow");

                containerUploadItems.position({
                    of: self.itemAddfile,
                    my: "center bottom",
                    at: "center top",
                    offset: "-10px",
                    collision: "flipfit flipfit"
                });

            } else {
                containerUploadItems.hide();
                containerUploadItems.addClass("bz_clone_active");

                var cloneUpload = containerUploadItems.clone();

                cloneUpload.attr("id", "bz_active_clone_Upload");
                cloneUpload.addClass("upArrow");
                cloneUpload.appendTo(body);
                cloneUpload.css('display', 'inline-block');

                cloneUpload.position({
                    of: self.itemAddfile,
                    my: "center top",
                    at: "center bottom",
                    offset: "5px",
                    collision: "flipfit flipfit"
                });

            }

            self.itemsUpload = {
                "file": $(".file", cloneUpload),
                "image": $(".image", cloneUpload),
                "cimage": $(".cimage", cloneUpload),
                "caudio": $(".caudio", cloneUpload),
                "cvideo": $(".cvideo", cloneUpload)
            };

            self.addListener();
        });

        self.checkExtensions();
        self.checkMaxFiles();
    },

    removeListener: function () {
        var self = this;

        if (self.itemsUpload) {
            self.itemsUpload.image.unbind("click");
            self.itemsUpload.file.unbind("click");
            self.itemsUpload.cimage.unbind("click");
            self.itemsUpload.caudio.unbind("click");
            self.itemsUpload.cvideo.unbind("click");
        }
    },

    addListener: function () {
    	var self = this;
	var isOfflineForm = typeof(bizagi.context.isOfflineForm) !== "undefined"
		&& bizagi.context.isOfflineForm || false;

        self.itemsUpload.image.bind("click", function () {

            navigator.camera.getPicture(function (dataImage) {                

                $.when(self.checkMaxSize(dataImage))
                    .done(function (responseInternal) {
                        if (responseInternal) {
                            self.dataImage = dataImage;

                            // "new Blob" constructor is not supported in android version 4.2.2
                            if ((bizagi.detectSO() === "android" && bizagi.util.detectAndroidVersion() <= 422) || isOfflineForm) {
                                self.saveImage(self, self.dataImage);
                            } else {
                                if (bizagi.detectSO() !== "ios") {
                                    $("body").append("<div class='ui-bizagi-mask'> </div>");
                                }
                                $(".ui-bizagi-resolution-container").css("display", "block");
                            }
                        }
                    });

                self.itemAddfile.click();

            }, self.onFail.bind(self), {
                quality: self.Class.QUALITY_PICTURE,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            });
        });

        // Capture file
        self.itemsUpload.file.bind("click", function () {
            bizagi.showMessageBox("in development");
        });

        // Capture image from camera
        self.itemsUpload.cimage.bind("click", function () {
            navigator.camera.getPicture(function (dataImage) {

                $.when(self.checkMaxSize(dataImage)).done(function (responseInternal) {
                    if (responseInternal)
                        self.saveImage(self, dataImage);
                });

                self.itemAddfile.click();
            },
                self.onFail.bind(self), {
                    quality: self.Class.QUALITY_PICTURE,
                    targetWidth: 1280,
                    targetHeight: 960
                });
        });

        //capture audio
        self.itemsUpload.caudio.bind("click", function () {
            navigator.device.capture.captureAudio(function (dataImage) {
                self.saveAudio(self, dataImage);

                self.itemAddfile.click();
            }, self.onFail.bind(self), { limit: self.Class.LIMIT });

        });

        //capture video 
        self.itemsUpload.cvideo.bind("click", function () {
            navigator.device.capture.captureVideo(function (dataImage) {
                self.saveVideo(self, dataImage);

                self.itemAddfile.click();
            }, self.onFail.bind(self), { limit: self.Class.LIMIT });

        });

        $(".ui-bizagi-resolutionUploadFrame .ui-bizagi-resolution-button")
            .unbind("click").bind("click", function (e) {
                e.preventDefault();
                e.stopPropagation();

                var buttonOrdinal = $(this).attr("data-bz-ordinal");

                bizagi.util.smartphone.startLoading();

                var objWidth = 0;
                var objHeight = 0;

                if (buttonOrdinal === 1) {
                    objWidth = 320;
                    objHeight = 240;
                } else if (buttonOrdinal === 2) {
                    objWidth = 640;
                    objHeight = 480;
                } else if (buttonOrdinal === 3) {
                    objWidth = 1280;
                    objHeight = 960;
                }

                // If original, save image normally, if not, reduce quality and size
                if (buttonOrdinal === 4) {
                    self.saveImage(self, self.dataImage);
                } else {
                    $.when(self.transformImageSize(self.dataImage, objWidth, objHeight))
                        .done(function () {
                            self.saveImage(self, self.dataImage);
                        }).fail(function () {
                            bizagi.util.smartphone.stopLoading();
                        });
                }

                $(".ui-bizagi-resolution-container").css("display", "none");
                $(".ui-bizagi-mask").remove();

            });

        $(".ui-bizagi-resolutionUploadFrame .ui-bizagi-resolution-button-cancel")
            .bind("click", function (e) {
                $(".ui-bizagi-resolution-container").css("display", "none");
                $(".ui-bizagi-mask").remove();

                bizagi.util.smartphone.stopLoading();
            });
    },

    renderUploadItem: function (file) {
        var self = this;
        var html = self._super(file);

        return html;
    },

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

    saveImage: function (context, dataImage) {
        var self = context;
        var properties = self.properties;
        var data = self.buildAddParams();

        var queueId = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());
        data.queueID = queueId;

        var options = new FileUploadOptions();

        options.fileKey = "file";
        options.fileName = dataImage.substr(dataImage.lastIndexOf("/") + 1);
        options.params = data;

        window.resolveLocalFileSystemURI(dataImage, function (fileEntry) {

            fileEntry.file(function (file) {

                data.filename = options.fileName;

                if (!self.validateFileExtensions(options.fileName)) {
                    var extension = file.type.substr(file.type.lastIndexOf('/') + 1);
                    options.fileName += "." + extension;
                }

                options.mimeType = "image/jpeg";
                options.params = data;

                if (self.editedImageURL) {
                    dataImage = self.editedImageURL;
                }

                // Fix android 4.4 getting images from recent folder
                if (dataImage.substring(0, 21) === "content://com.android") {
                    var photoSplit = dataImage.split("%3A");
                    dataImage = "content://media/external/images/media/" + photoSplit[1];
                }

                var ft = new FileTransfer();
                ft.upload(dataImage, properties.addUrl,
                    function (result) {
                        self.onUploadFileCompleted(context, JSON.parse(decodeURIComponent(result.response)));
                    },
                    function (error) {

                        bizagi.log("An error has occurred: Code = " + error.code);
                        bizagi.util.smartphone.stopLoading();

                    }, options);
            }, function () {
                //error
            });

        }, function () {
            // error 
        });
    },

    saveAudio: function (context, dataAudio) {

        var self = context;
        var properties = self.properties;
        var data = self.buildAddParams();

        var queueId = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());
        var options = new FileUploadOptions();

        data.queueID = queueId;

        options.fileName = dataAudio[0].name;
        options.params = data;

        var ft = new FileTransfer();
        ft.upload(dataAudio[0].fullPath, properties.addUrl,
            function (r) {
                self.onUploadFileCompleted(context, JSON.parse(decodeURIComponent(r.response)));
            },
            function (error) {
                bizagi.log("An error has occurred: Code: " + error.code);
            }, options);
    },

    saveVideo: function (context, dataVideo) {
        var self = context;
        var properties = self.properties;
        var data = self.buildAddParams();

        var queueId = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());
        var options = new FileUploadOptions();

        data.queueID = queueId;

        options.fileName = dataVideo[0].name;
        options.mimeType = "video/quicktime";
        options.params = data;

        var ft = new FileTransfer();
        ft.upload(dataVideo[0].fullPath, properties.addUrl,
            function (r) {
                self.onUploadFileCompleted(context, JSON.parse(decodeURIComponent(r.response)));
            },
            function (error) {
                bizagi.log("An error has occurred: Code: " + error.code);
            }, options);
    },

    onFail: function (error) {
        bizagi.log("Error: " + error.code);

        var message;
        if (typeof error === "string"){
            if (error.indexOf("No Activity found to handle Intent") !== -1){
                message = bizagi.util.isValidResource("render-upload-error-media-app") ?
                    bizagi.localization.getResource("render-upload-error-media-app") :
                    "Your device does not have an app to execute this action.";

                bizagi.showMessageBox(message);
            }
        }
    },

    onUploadFileCompleted: function (context, response) {
        var self = context;
        var control = self.getControl();
        var uploadWrapper = $(".bz-rn-upload-show-menu", control);
        var result = response;

        if (result.id && result.fileName) {
            var newItem = self.renderUploadItem(result);
            self.files.push([result.id, result.fileName]);

            // Locate it before the upload wrapper
            $(newItem).insertBefore(uploadWrapper);

            // Increment counter
            self.filesCount = self.filesCount + 1;

            self.changeRequired(false);
            self.triggerRenderChange();

            control.find(".ui-bizagi-render-upload-item-no-upload").hide();

            // Check maxFiles
            self.checkMaxFiles();

            self.editedImageURL = null;
            bizagi.util.smartphone.stopLoading();
        } else {
            bizagi.log("Error:" + result.message);
            bizagi.util.smartphone.stopLoading();
        }
    },

    saveBlobToFile: function (blob, defer) {
        // root file system entry
        var self = this;

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function (fileSystem) {
                var root = fileSystem.root;
                // writes a file
                var writeFile = function (writer) {

                    writer.onwriteend = function (e) {
                        self.editedImageURL = writer.localURL;
                        defer.resolve();
                        console.log("Write completed.");
                    };

                    writer.onerror = function (e) {
                        console.log("Write failed: " + e.toString());
                    };

                    // write to file
                    writer.write(blob);
                };

                // creates a FileWriter object
                var createWriter = function (fileEntry) {
                    fileEntry.createWriter(writeFile, null);
                };

                var newId = "bizagiImgTmp";

                // create a file and write to it
                root.getFile(newId + ".jpg", { create: true }, createWriter, null);
            },
            function () { });
    },

    transformImageSize: function (objectUri, objWidth, objHeight) {
        var self = this;
        var defer = new $.Deferred();

        window.resolveLocalFileSystemURL(objectUri, function (fileEntry) {
            fileEntry.file(function (fileObj) {

                var reader = new FileReader();

                // Create a function to process the file once it's read
                reader.onloadend = function (evt) {

                    // Create an image element that we will load the data into
                    var image = new Image();
                    image.onload = function (evt) {

                        var width = image.width;
                        var height = image.height;

                        if (objWidth != 0) {

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

                        if (self.value && self.properties.value) {
                            self.value[0] = self.properties.value[0] = self.properties.url = canvas.toDataURL("image/jpeg", 0.5);
                        } else {
                            self.properties.url = canvas.toDataURL("image/jpeg", 0.5);
                        }

                        var imageToSaveLocal = self.properties.url.replace("data:image/jpeg;base64,", "");
                        var imageBlob = bizagi.util.b64toBlob(imageToSaveLocal);
                        self.saveBlobToFile(imageBlob, defer);

                        image = null;

                    };

                    // Load the read data into the image source. It's base64 data
                    image.src = evt.target.result;
                };

                // Read from disk the data as base64
                reader.readAsDataURL(fileObj);

            });
        });

        return defer.promise();
    },

    checkMaxFiles: function () {
        var self = this;
        var properties = self.properties;
        var maxFiles = properties.maxfiles;
        var actualFiles = properties.value.length;

        if (maxFiles !== 0 && (actualFiles >= maxFiles)) {
            self.itemAddfile.hide();
            self.removeListener();
        }
    },

    checkExtensions: function () {
        var self = this;
        var properties = self.properties;
        var validExtensions = properties.validExtensions;

        if (typeof (validExtensions) === "undefined" || validExtensions === "") {
            return;
        }

        validExtensions = validExtensions.split(";");
        if (validExtensions.length === 1 && validExtensions[0].indexOf("*.*") !== -1) {
            return;
        }

        var enableVideo = false;
        var enableAudio = false;
        var enableImage = false;

        for (var i = 0, length = validExtensions.length; i < length; i++) {
            validExtensions[i] = validExtensions[i].replace("*.", "");

            var image = self.Class.EXTENSIONSIMG.toString().indexOf(validExtensions[i]);
            var audio = self.Class.EXTENSIONSAUDIO.toString().indexOf(validExtensions[i]);
            var video = self.Class.EXTENSIONSVIDEO.toString().indexOf(validExtensions[i]);

            if (image >= 0) {
                enableImage = true;
            }

            if (audio >= 0) {
                enableAudio = true;
            }

            if (video >= 0) {
                enableVideo = true;
            }
        }

        if (!enableAudio) {
            self.itemsUpload.caudio.hide();
        }

        if (!enableImage) {
            self.itemsUpload.image.hide();
            self.itemsUpload.cimage.hide();
        }

        if (!enableVideo) {
            self.itemsUpload.cvideo.hide();
        }

        if (!enableAudio && !enableImage && !enableVideo) {
            self.itemAddfile.hide();
            self.removeListener();
        }
    },

    checkMaxSize: function (objectUri) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();

        if (typeof (properties.maxSize) === "undefined" || properties.maxSize == null || properties.maxSize === "") {
            defer.resolve(true);
        }

        window.resolveLocalFileSystemURI(objectUri, function (fileEntry) {
            fileEntry.file(function (fileObj) {

                if (fileObj.size >= properties.maxSize) {
                    bizagi.showMessageBox(self.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize));
                    defer.resolve(false);
                } else {
                	self.fileExtension = fileObj.type ? fileObj.type.substr(fileObj.type.lastIndexOf("/") + 1) : "";
                    defer.resolve(true);
                }
            });
        });

        return defer.promise();
    },

    checkMaxSizeVideo: function (objectVideo) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();
        var size = objectVideo[0].size;

        if (properties.maxSize === "undefined" || properties.maxSize == null || properties.maxSize === "") {
            defer.resolve(true);
        }

        if (size >= properties.maxSize) {
            bizagi.showMessageBox(self.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize));
            defer.resolve(false);
        } else {
            defer.resolve(true);
        }

        return defer.promise();

    },

    validateFileExtensions: function (filename) {
        var pattern = /(.jpg|.gif|.png|.bmp|.jpeg|.mov|.avi|.mpg|.mpeg|.3gp|.asf|.wmv|.flv|.mp4)$/i;

        return pattern.test(filename);
    },

    /**
    * Validate file-api support
    * @returns {} 
    */
    supportFileAPI: function () {
        // Supported
        // !!window.FileReader
        var fi = document.createElement("INPUT");
        fi.type = "file";

        return "files" in fi;
    },

    /**
    * Active upload web control
    * @returns {} 
    */
    activeUploadWebControl: function () {
        var self = this;
        var container = self.getControl();
        var uploadfile = $(".bz-rn-upload-web", container);
        var file = $(".bz-rn-upload-show-menu span.bz-cm-icon", container);

        self.itemAddfile = $(".bz-rn-upload-show-menu", container);

        // Check maximum files number
        if (self.maxFilesLimit()) {
            self.itemAddfile.hide();
            return;
        }

        // attach events to file-icon
        file.addClass("bz-rn-upload-native");
        file.on("click", function (event) {
            uploadfile.click();
        });

        // Attach event to upload-control
        uploadfile.on("change", function (event) {
            var that = this;

            bizagi.util.smartphone.startLoading();

            var dataFile = that.files[0];
            dataFile.fullPath = that.value;

            if (self.checkMaxSizeFile(dataFile) && self.checkFileTypes(dataFile)) {
                $.when(self.processUploadFile(dataFile))
                    .done(function(result) {
                        self.onUploadFileCompleted(self, JSON.parse(decodeURIComponent(result)));
                    }).fail(function(error) {
                        bizagi.util.smartphone.stopLoading();
                        bizagi.showMessageBox(error);
                    });
            } else {
                bizagi.util.smartphone.stopLoading();
            }

            // Clearing input Values
            $(that).val("");
        });
    },

    /**
    * Verifies the maximun file size
    * @param {} file 
    * @returns {} 
    */
    checkMaxSizeFile: function (file) {
        var self = this;
        var properties = self.properties;

        if (typeof (properties.maxSize) === "undefined" || properties.maxSize == null || properties.maxSize === "") {
            return true;
        }

        if (typeof (file) !== "undefined") {
            if (file.size === 0) {
                bizagi.showMessageBox(self.getResource("render-upload-error-file-empty").replace("%s", file.name));
                return false;
            }

            if (file.size >= properties.maxSize) {
                bizagi.showMessageBox(self.getResource("render-upload-alert-maxsize")
                    .replace("{0}", properties.maxSize));
                return false;
            }

            return true;

        } else {
            bizagi.showMessageBox(self.getResource("render-required-upload")
                .replace("#label#", properties.displayName));
            return false;
        }
    },

    /**
    * Check valid extgension
    * @param {} file 
    * @returns {} 
    */
    checkFileTypes: function (file) {
        var self = this;
        var properties = self.properties;

        if (properties.validExtensions && properties.validExtensions.length > 0) {
            var validExtensions = properties.validExtensions.replaceAll("*.", "").split(";");
            if (!self.stringEndsWithValidExtension(file.name, validExtensions, true)) {
                bizagi.showMessageBox(self.getResource("render-upload-allowed-extensions") + properties.validExtensions);
                return false;
            }
        }
        return true;
    },

    /**
    * Check string ends with valid extension
    * @param {} stringToCheck 
    * @param {} acceptableExtensionsArray 
    * @param {} required 
    * @returns {} 
    */
    stringEndsWithValidExtension: function (stringToCheck, acceptableExtensionsArray, required) {
        if (required === false && stringToCheck.length === 0) {
            return true;
        }

        for (var i = 0, length = acceptableExtensionsArray.length; i < length; i++) {
            if (acceptableExtensionsArray[i] === "*" || stringToCheck.toLowerCase().endsWith(acceptableExtensionsArray[i].toLowerCase()))
                return true;
        }

        return false;
    },

    /**
    * Check the maximun file than can be uploaded
    * @returns {} 
    */
    maxFilesLimit: function () {
        var self = this;
        var properties = self.properties;
        var maxFiles = properties.maxfiles;
        var actualFiles = properties.value.length;

        return maxFiles !== 0 && (actualFiles >= maxFiles);
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
    *  Process an upload file into the server    
    * @param {} context 
    * @param {} dataFile 
    * @returns {} 
    */
    processUploadFile: function (dataFile) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();

        // Get form data for POSTing
        var formData = self.buildAddFileParams(dataFile);        
        var uploadUrl = properties.addUrl;
        var request = new XMLHttpRequest();

        request.open("POST", uploadUrl, true);

        // Attach Handlers events
        request.onload = function (event) {
            var result;
            var that = this;

            try {
                result = JSON.parse(that.response);
            } catch (error) {
                // Invalid json, try to catch error response
                result = { type: "error", message: self.getResource("workportal-widget-admin-language-error") };
            }

            if (result.type !== "error") {
                defer.resolve(that.response);
            } else {
                // Show server error
                defer.reject(result.message);
            }
        };

        request.onerror = function (error) {
            defer.reject(error.message);
        };

        // Actually send the request to the server
        request.send(formData);

        return defer.promise();
    }
});
