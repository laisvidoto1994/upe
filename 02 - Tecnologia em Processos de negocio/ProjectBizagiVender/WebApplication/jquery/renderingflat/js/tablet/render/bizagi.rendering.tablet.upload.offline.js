/*
*   Name: BizAgi Tablet Render upload Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the label render class to adjust to smartphones devices
*/

// Extends itself
bizagi.rendering.upload.extend("bizagi.rendering.upload.offline", {
    BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
    BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX,
    QUALITY_PICTURE: 80,
    LIMIT: 1, //limit: The maximum number of audio clips,video clips, etc. 
    // in the device user can record in a single capture operation.
    EXTENSIONSIMG: ["image/jpeg", "jpeg", "image", "png", "jpg"],
    EXTENSIONSVIDEO: ["video/quicktime", "quicktime", "qt", "mov"],
    EXTENSIONSAUDIO: ["audio/wav", "audio", "wav"]
}, {
    postRender: function() {
        var self = this;
        var properties = self.properties;

        if (!bizagi.util.isCordovaSupported() || !properties.editable) {
            self.addEventToOpenSlide();
        } else {
            self.activateUploadNative();
        }

        // Attach Events
        self.configureHelpText();
    },

    /**
     * Attach open slide
     * @returns {} 
     */
    addEventToOpenSlide: function() {
        var self = this;
        var container = self.getControl();

        self.itemAddfile = $(".bz-rn-upload-show-menu", container);
        self.itemAddfile.hide();
    },

    /**	 
     *  Template method to implement in each children to customize each control
     * @returns {} 
     */
    renderControl: function() {
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
            var item = self.renderUploadItem(self.files[i]);
            items += item;
        }

        html = self.replaceFilesHtml(html, items);
        return html;
    },

    /**
     * Render readonly
     * @returns {} 
     */
    postRenderReadOnly: function() {
        var self = this;

        self._super();
    },

    /**
     * Active upload by native mode
     * @returns {} 
     */
    activateUploadNative: function() {
        var self = this;

        self._super();
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

        // Fix android 4.4 getting images from recent folder		
        dataImage = bizagi.util.media.getImagePath(dataImage);

        // Load image
        self.getDataUri(dataImage, function(dataUrl) {
            if (bizagi.util.isEmpty(self.fileExtension)) {
                self.fileExtension = bizagi.util.media.getFileExtension(dataImage);
            }

            var fileName = bizagi.util.uniqueID() + self.fileExtension;
            self.fileExtension = null;

            self.onUploadFileCompletedOffline(fileName, dataUrl);
        });
    },

    /**
    * Create an offline image
    * @param {} context 
    * @param {} url 
    * @param {} callback 
    * @returns {} 
    */
    getDataUri: function(url, callback) {
        var image = new Image();

        $(image).on("load", function() {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            canvas.getContext("2d").drawImage(this, 0, 0);

            // Get raw image data
            var dataUrl = canvas.toDataURL("image/png");
            callback(dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""));
        });

        image.src = url;
    },

    saveAudio: function(context, dataAudio) {
        var self = context;

        window.resolveLocalFileSystemURI(dataAudio[0].fullPath, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(evt) {
                    var fileExtension = bizagi.util.media.getFileExtension(dataAudio[0].name);
                    var fileName = bizagi.util.uniqueID() + fileExtension;

                    self.onUploadFileCompletedOffline(fileName, evt.target.result);
                };

                reader.readAsDataURL(file);
            }, self.failReadFile);
        }, self.failReadFile);
    },

    saveVideo: function(context, dataVideo) {
        var self = context;

        window.resolveLocalFileSystemURI(dataVideo[0].fullPath, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();

                reader.onloadend = function(evt) {
                    var fileExtension = bizagi.util.media.getFileExtension(dataVideo[0].name);
                    var fileName = bizagi.util.uniqueID() + fileExtension;

                    self.onUploadFileCompletedOffline(fileName, evt.target.result);
                };

                reader.readAsDataURL(file);
            }, self.failReadFile);
        }, self.failReadFile);
    },

    renderUploadItem: function(objectUpload) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var template = self.renderFactory.getTemplate("uploadItem");

        var html = $.fasttmpl(template, {
            url: "javascript:void(0);",
            image: false,
            allowDelete: properties.allowDelete || false,
            id: bizagi.util.randomNumber(),
            mode: mode,
            editable: properties.editable,
            filename: objectUpload[0].value,
            isNativeContext: false,
            isOfflineForm: true,
            isCordovaSupported: bizagi.util.isCordovaSupported()
        });

        return html;
    },

    /**
     * Collect Data
     * @param {} renderValues 
     * @returns {} 
     */
    collectData: function(renderValues) {
        var self = this;

        if (self.filesCount > 0) {
            renderValues[self.properties.xpath] = self.files;
        } else if (self.properties.method === "delete") {
            renderValues[self.properties.xpath] = [];

            delete self.properties.method;
        }
    },

    onUploadFileCompletedOffline: function(name, dataimage) {
        var self = this;
        var control = self.getControl();
        var uploadWrapper = $(".bz-rn-upload-show-menu", control);
        var dataUrltoSave = dataimage.replace(/^data:.*;base64,/, "");
        var properties = self.properties;

        var fileToSave = [
            { xpath: "fileName", DataType: "15", value: name },
            { xpath: "data", DataType: "19", value: dataUrltoSave }
        ];

        // Locate it before the upload wrapper
        var newItem = self.renderUploadItem(fileToSave);
        $(newItem).insertBefore(uploadWrapper);

        // Copy the files value but not its reference
        var files = self.files.slice();

        //Add the new item to this temporal array
        files.push(fileToSave);

        // Increment counter
        self.filesCount = self.filesCount + 1;

        // Update value
        self.setValue(files, false);

        // Check maxFiles
        self.checkMaxFiles();

        self.triggerRenderChange();

        control.find(".ui-bizagi-render-upload-item-no-upload").hide();

        if (properties.allowDelete && properties.editable) {
            self.attachDeleteHandler();
        }

        // Close modalview
        self.closeModalView();
        bizagi.util.tablet.stopLoading();
    },

    failReadFile: function(evt) {
        try {
            bizagi.log("Error code: " + evt.target.error.code);
        } catch (e) {
        }
    },

    onFail: function(error) {
        this._super(error);
        this.closeModalView();
    },

    checkMaxFiles: function() {
        bizagi.rendering.upload.prototype.checkMaxFiles.apply(this, arguments);
    },

    checkExtensions: function() {
        bizagi.rendering.upload.prototype.checkExtensions.apply(this, arguments);
    },

    checkMaxSize: function(objectUri) {
        var self = this;
        return bizagi.util.media.checkMaxSize(objectUri, self.properties);
    },

    checkMaxSizeVideo: function(objectVideo) {
        var self = this;
        return bizagi.util.media.checkMaxSizeVideo.apply(objectVideo, self.properties);
    },

    /**	 
     * This render cannot be sent because it is full ajax
     * @returns {} 
     */
    canBeSent: function() {
        return true;
    },

    /**
     * Attach delete option & Removes a file from the upload control
     * @returns {} 
     */
    attachDeleteHandler: function() {
        var self = this;
        var control = self.getControl();

        $(".bz-rn-upload-delete-icon", control).bind("click", function() {
            var context = $(this);
            var item = context.parent(".ui-bizagi-render-upload-item");
            var file = item.data();
            var fileIndex = item.index();

            // Substract counter
            self.filesCount = self.filesCount - 1;

            if (self.filesCount === 0) {
                self.properties.method = "delete";
            }

            // Remove from local collection
            self.files = $.grep(self.files, function(fileItem, index) {
                return (index !== fileIndex && fileItem !== file.name);
            });

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
    }
});
