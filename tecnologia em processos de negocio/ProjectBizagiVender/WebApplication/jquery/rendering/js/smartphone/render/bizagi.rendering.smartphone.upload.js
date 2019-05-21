/*
*   Name: Bizagi Smartphone Render upload Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the label render class to adjust to smartphones devices
*/

// Extends itself
bizagi.rendering.upload.extend("bizagi.rendering.upload", {
    BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
    BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX,
    QUALITY_PICTURE: 80,
    LIMIT: 1,   // Limit: The maximum number of audio clips,videoclips, etc.
    // in the device user can record in a single capture operation.
    EXTENSIONSIMG: ["image/jpeg", "jpeg", "image", "png", "jpg"],
    EXTENSIONSVIDEO: ["video/quicktime", "quicktime", "qt", "mov"],
    EXTENSIONSAUDIO: ["audio/wav", "audio", "wav"]
}, {

    postRenderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getControl();
        var containerRender = self.getContainerRender();

        self.configureHelpText();
        self.getArrowContainer().css("visibility", "hidden");

        if (!properties.editable) {
            containerRender.addClass("bz-command-not-edit");
        } else {
            containerRender.addClass("bz-command-edit-inline");
        }

        self.itemAddfile = $(".bz-rn-upload-show-menu", container);

        if ((!bizagi.util.isCordovaSupported() && !self.supportFileAPI()) || !properties.editable) {
            self.itemAddfile.hide();
        } else if (!bizagi.util.isCordovaSupported()) {
            self.activeUploadWebControl();
        } else {
            self.activateUploadNative();
        }
    },

    activateUploadNative: function () {
        var self = this;
        var container = self.getControl();
        var body = $("body");

        self.itemsUpload = {
            "file": $(".file", container),
            "image": $(".image", container),
            "cimage": $(".cimage", container),
            "caudio": $(".caudio", container),
            "cvideo": $(".cvideo", container)
        };

        self.itemAddfile.bind("click", function (e) {
            e.stopPropagation();
            var containerUploadItems = $(".bz_rn_upload_container_upload_items", container);

            if (self.hideUploadItems()) {
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
            } catch (e) {
            }

            containerUploadItems.show();
            containerUploadItems.css("z-index", 20);

            // Verify the visivility for container and puts the class for arrow
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

            // If click out the upload (click in document), the upload menu will be removed
            $(document).bind("click", function () {
                self.hideUploadItems();
                $(document).unbind("click");
            });
        });

        self.checkExtensions();
        self.checkMaxFiles();
    },

    hideUploadItems: function () {
        var self = this;
        var container = self.getControl();
        var body = $("body");
        var containerUploadItems = $(".bz_rn_upload_container_upload_items", container);

        if (containerUploadItems.hasClass("bz_clone_active")) {

            containerUploadItems.removeClass("bz_clone_active");
            var divClone = $("#bz_active_clone_Upload", body);

            divClone.hide();
            divClone.remove();

            containerUploadItems.hide();

            self.removeListener();

            return true;
        }

        return false;
    },

    removeListener: function() {
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
        self.itemsUpload.image.bind("click", function () {

            navigator.camera.getPicture(function (dataImage) {

                // A hack that you should include to catch bug on Android 4.4 (bug < Cordova 3.5):
                if (dataImage.substring(0, 21) === "content://com.android") {
                    var photoSplit = dataImage.split("%3A");
                    dataImage = "content://media/external/images/media/" + photoSplit[1];
                }

                $.when(self.checkMaxSize(dataImage)).done(function (responseInternal) {
                    if (responseInternal)
                        self.saveImage(self, dataImage);
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
                self.onFail.bind(self),
                {
                    quality: self.Class.QUALITY_PICTURE,
                    sourceType: navigator.camera.PictureSourceType.CAMERA,
                    mediaType: navigator.camera.MediaType.PICTURE,
                    destinationType: Camera.DestinationType.FILE_URI,
                    correctOrientation: true
                });

        });


        //capture audio
        self.itemsUpload.caudio.bind("click", function () {
            navigator.device.capture.captureAudio(function (dataImage) {
                $.when(self.checkMaxSize(dataImage)).done(function (responseInternal) {
                    if (responseInternal)
                        self.saveAudio(self, dataImage);
                });

                self.itemAddfile.click();

            }, self.onFail.bind(self), { limit: self.Class.LIMIT });


        });

        //capture video 
        self.itemsUpload.cvideo.bind("click", function () {
            navigator.device.capture.captureVideo(function (dataImage) {
                $.when(self.checkMaxSizeVideo(dataImage)).done(function (responseInternal) {
                    if (responseInternal)
                        self.saveVideo(self, dataImage);
                });

                self.itemAddfile.click();
            }, self.onFail.bind(self), { limit: self.Class.LIMIT });

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
        var options = new FileUploadOptions();

        data.queueID = queueId;

        options.fileKey = "file";
        options.fileName = dataImage.substr(dataImage.lastIndexOf('/') + 1);

        window.resolveLocalFileSystemURI(dataImage, function (fileEntry) {

            fileEntry.file(function (file) {

                data.filename = options.fileName;

                if (!self.validateFileExtensions(options.fileName)) {
                    var extension = file.type.substr(file.type.lastIndexOf("/") + 1);
                    options.fileName += "." + extension;
                }

                options.mimeType = "image/jpeg";
                options.params = data;
                var ft = new FileTransfer();

                //fix android 4.4 getting images from recent folder
                if (dataImage.substring(0, 21) === "content://com.android") {
                    var photoSplit = dataImage.split("%3A");
                    dataImage = "content://media/external/images/media/" + photoSplit[1];
                }

                ft.upload(dataImage, properties.addUrl,
                    function (r) {
                        self.onUploadFileCompleted(context, JSON.parse(decodeURIComponent(r.response)));
                    },
                    function (error) {
                        bizagi.log("An error has occurred: " + error.code);
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
        var ft = new FileTransfer();

        data.queueID = queueId;

        options.fileName = dataAudio[0].name;
        options.params = data;

        ft.upload(dataAudio[0].fullPath, properties.addUrl,
            function (r) {
                self.onUploadFileCompleted(context, JSON.parse(decodeURIComponent(r.response)));
            },
            function (error) {
                bizagi.log("An error has occurred: " + error.code);
            }, options);
    },

    saveVideo: function (context, dataVideo) {

        var self = context;
        var properties = self.properties;
        var data = self.buildAddParams();
        var queueId = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());

        var options = new FileUploadOptions();
        var ft = new FileTransfer();

        data.queueID = queueId;
        options.fileName = dataVideo[0].name;
        options.params = data;

        ft.upload(dataVideo[0].fullPath, properties.addUrl,
            function (r) {
                self.onUploadFileCompleted(context, JSON.parse(decodeURIComponent(r.response)));
            },
            function (error) {
                bizagi.log("An error has occurred: " + error.code);
            }, options);
    },

    onFail: function (error) {
        bizagi.log("Error: " + error.code);
        var message;
        if (typeof error === "string"){
            message = bizagi.util.isValidResource("render-upload-error-media-app") ?
                bizagi.localization.getResource("render-upload-error-media-app") :
                "Your device does not have an app to execute this action.";

            if (error.indexOf("No Activity found to handle Intent") !== -1){
                bizagi.showMessageBox(message);
            }
        }
    },

    onUploadFileCompleted: function (context, response) {
        var self = context,

         control = self.getControl();

        var uploadWrapper = $(".bz-rn-upload-show-menu", control);

        var result = response;

        if (result.id && result.fileName) {
            var newItem = self.renderUploadItem(result);

            self.files.push([result.id, result.fileName]);

            // Locate it before the upload wrapper
            $(newItem).insertBefore(uploadWrapper);

            // Increment counter
            self.filesCount = self.filesCount + 1;
            self.triggerRenderChange();

            // Check maxFiles
            self.checkMaxFiles();
        } else {
            bizagi.log("Error:" + result.message);
        }

        self.hideUploadItems();
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

        if (typeof validExtensions === "undefined" || validExtensions == "") {
            return;
        }

        validExtensions = validExtensions.split(";");

        if (validExtensions.length == 1 && validExtensions[0].indexOf("*.*") !== -1) {
            return;
        }

        var enableVideo = false;
        var enableAudio = false;
        var enableImage = false;

        for (var i = 0; i < validExtensions.length; i++) {
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

        if (properties.maxSize === "undefined" || properties.maxSize == null || properties.maxSize === "") {
            defer.resolve(true);
        }

        window.resolveLocalFileSystemURI(objectUri, function (fileEntry) {
            fileEntry.file(function (fileObj) {

                if (fileObj.size >= properties.maxSize) {
                    bizagi.showMessageBox(self.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize)); //'the file is heavier than allowed: ' + properties.maxSize +"Bytes");
                    defer.resolve(false);
                } else {
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
            bizagi.showMessageBox(self.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize)); //'the file is heavier than allowed: ' + properties.maxSize +"Bytes");
            defer.resolve(false);
        } else {
            defer.resolve(true);
        }

        return defer.promise();
    },

    validateFileExtensions: function (nameArchivo) {
        var validExtensions = /(.jpg|.gif|.png|.bmp|.jpeg|.mov|.avi|.mpg|.mpeg|.3gp|.asf|.wmv|.flv|.mp4)$/i;

        return validExtensions.test(nameArchivo);
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
    activeUploadWebControl: function() {
        var self = this;
        var container = self.getControl();
        var uploadfile = $(".bz-rn-upload-web", container);
        var file = $(".bz-rn-upload-show-menu span.bz-cm-icon", container);

        // Check maximum files number
        if (self.maxFilesLimit()) {
            self.itemAddfile.hide();
            return;
        }

        // attach events to file-icon
        file.addClass("bz-rn-upload-native");
        file.on("click", function(event) {
            uploadfile.click();
        });
              
        // Attach event to upload-control
        uploadfile.on("change", function(event) {
            var that = this;

            bizagi.util.smartphone.startLoading();

            var dataFile = that.files[0];
            dataFile.fullPath = that.value;

            if (self.checkMaxSizeFile(dataFile) && self.checkFileTypes(dataFile)) {
                $.when(self.processUploadFile(dataFile))
                    .done(function(result) {
                        self.onUploadFileCompleted(self, JSON.parse(decodeURIComponent(result)));
                        bizagi.util.smartphone.stopLoading();
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
    checkMaxSizeFile: function(file) {
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
    maxFilesLimit: function() {
        var self = this;
        var properties = self.properties;
        var maxFiles = properties.maxfiles;
        var actualFiles = properties.value.length;

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

        var request = new XMLHttpRequest();        
        var uploadUrl = properties.addUrl;
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
