/*
*   Name: BizAgi Tablet Render upload Extension
*   Author: oscaro
*   Comments:
*   -   This script will redefine the label render class to adjust to smartphones devices
*/

// Extends itself
bizagi.rendering.upload.extend("bizagi.rendering.upload.offline", {
    BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
    BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX,
    QUALITY_PICTURE: 80,
    LIMIT: 1,
//limit: The maximum number of audio clips,video clips,etc in the device user can record in a single capture operation.
    EXTENSIONSIMG: ["image/jpeg", "jpeg", "image", "png", "jpg"],
    EXTENSIONSVIDEO: ["video/quicktime", "quicktime", "qt", "mov"],
    EXTENSIONSAUDIO: ["audio/wav", "audio", "wav"]
}, {
    renderControl: function() {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("upload");

        // Render template
        var html = $.fasttmpl(template, {
            xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
            editable: properties.editable,
            noFiles: (self.filesCount == 0),
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

    postRender: function() {
        var self = this;
        var properties = self.properties;

        // Call base
        self.configureHelpText();

        if (!bizagi.util.isCordovaSupported() || !properties.editable) {
            self.addEventToOpenSlide();
        } else {
            self.activateUploadNative();
        }
    },

    postRenderReadOnly: function() {
        var self = this;
        self._super();
    },

    activateUploadNative: function() {
        var self = this;
        var properties = self.properties;
        var container = self.getControl();
        var body = $("body");

        // self.renderControl();

        self.itemAddfile = $(".bz-rn-upload-show-menu", container);

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

        self.itemAddfile.bind("click", function(e) {
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

            if (containerUploadItems.is(':visible')) {
                containerUploadItems.hide();
                self.removeListener();
                return;
            }
            //this try/catch is use for close other upload controls in the form
            try {
                var formContainer = self.getContainerRender().parent();
                if (formContainer) {
                    formContainer.find(".bz_rn_upload_container_upload_items:visible").hide();
                }
            } catch (e) {
            }

            containerUploadItems.show();

            //verify the visivility for container and puts the class for arrow
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
                //bug IOS : z-inded for first item
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

    removeListener: function() {
        var self = this;
        self.itemsUpload.image.unbind("click");
        self.itemsUpload.file.unbind("click");
        self.itemsUpload.cimage.unbind("click");
        self.itemsUpload.caudio.unbind("click");
        self.itemsUpload.cvideo.unbind("click");
    },

    addListener: function() {
        bizagi.rendering.upload.prototype.addListener.apply(this, arguments);
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
        dataImage = bizagi.util.mobileImagePath(dataImage);

        // Load image
        self.getDataUri(dataImage, function(dataUrl) {
            var fileName = dataImage.substr(dataImage.lastIndexOf("/") + 1);
            fileName += self.fileExtension ? "." + self.fileExtension : "";

            self.onUploadFileCompletedOffline(fileName, dataUrl);
        });
    },

    /**
     * Create an image offline
     * @param {} context 
     * @param {} url 
     * @param {} callback 
     * @returns {} 
     */
    getDataUri: function(url, callback) {
        var image = new Image();

        image.onload = function() {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            canvas.getContext("2d").drawImage(this, 0, 0);

            // Get raw image data
            var dataUrl = canvas.toDataURL("image/png");
            callback(dataUrl.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""));
        };

        image.src = url;
    },

    saveAudio: function(context, dataAudio) {
        var self = context;

        window.resolveLocalFileSystemURI("file://" + dataAudio[0].fullPath, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    self.onUploadFileCompletedOffline(dataAudio[0].name, evt.target.result);
                };
                reader.readAsDataURL(file);
            }, self.failReadFile);
        }, self.failReadFile);
    },

    saveVideo: function(context, dataVideo) {
        var self = context;
        var properties = self.properties;

        window.resolveLocalFileSystemURI("file://" + dataVideo[0].fullPath, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    self.onUploadFileCompletedOffline(dataVideo[0].name, evt.target.result);
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
            allowDelete: false, //properties.allowDelete,
            filename: objectUpload[0].value,
            id: bizagi.util.randomNumber(),
            mode: mode
        });

        return html;

    },
    /*
    *   Collect Data
    */
    collectData: function(renderValues) {
        if (this.filesCount > 0) {
            renderValues[this.properties.xpath] = this.files;
        }
    },

    onUploadFileCompletedOffline: function(name, dataimage) {
        var self = this;
        var control = self.getControl();
        var uploadWrapper = $(".bz-rn-upload-show-menu", control);

        var dataURLtoSave = dataimage.replace(/^data:.*;base64,/, "");
        var fileToSave = [
            { xpath: "fileName", DataType: "15", value: name },
            { xpath: "data", DataType: "19", value: dataURLtoSave }
        ];

        // Copy the files value but not its reference
        var files = self.files.slice();

        files.push(fileToSave);

        self.filesCount = self.filesCount + 1;
        self.setValue(files);

        var newItem = self.renderUploadItem(fileToSave);
        $(newItem).insertBefore(uploadWrapper);

        self.triggerRenderChange();
        control.find(".ui-bizagi-render-upload-item-no-upload").hide();
        self.checkMaxFiles();
    },

    failReadFile: function(evt) {
        bizagi.log(evt);
        try {
            bizagi.log(evt.target.error.code);
        } catch (e) {
        }

    },

    checkMaxFiles: function() {
        bizagi.rendering.upload.prototype.checkMaxFiles.apply(this, arguments);
    },

    checkExtensions: function() {
        bizagi.rendering.upload.prototype.checkExtensions.apply(this, arguments);
    },

    checkMaxSize: function(objectUri) {
        return bizagi.rendering.upload.prototype.checkMaxSize.apply(this, arguments);
    },

    checkMaxSizeVideo: function(objectVideo) {
        return bizagi.rendering.upload.prototype.checkMaxSizeVideo.apply(this, arguments);
    },

    canBeSent: function() {
        // This render cannot be sent because it is full ajax
        return true;
    }
});
