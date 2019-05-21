/*
 *   Name: BizAgi Render Image Class
 *   Author: Bizagi Mobile Team
 *   Comments:
 *   -   This script will redefine the image render class to adjust to smathphone devices
 */

// Extends itself
//noinspection JSValidateTypes
bizagi.rendering.image.extend("bizagi.rendering.image", {
    QUALITY_PICTURE: 80,
    EXTENSIONSIMG: ["jpeg", "jpg", "png"]
}, {
    /**
     * Just listing the order of function calls (bizagi.rendering.render)
     * 1. renderControl (found it on bizagi.rendering.image)
     * 2. postRender / postRenderReadOnly / postRenderPrintVersion
     * 3. configureHandlers / configureHandlersReadOnly
     *
     * Other functions are just local implementation
     *
     */

    /**
     * DOM elements to use as an ADD option button
     * @var $actionImage jQuery DOM
     */
    $addImage: null,
    /**
     * DOM elements to use as a REMOVE option button
     * @var $actionImage jQuery DOM
     */
    $deleteImage: null,
    /**
     * DOM input to handle HTML uploads
     * @var $inputFile jQuery DOM
     */
    $inputFile: null,
    /**
     * Whether or not is a native device 'Just a shortcut
     * @var isNative boolean
     */
    isNative: false,
    /**
     * Whether or not we are offline 'Just a shortcut
     * @var isOfflineForm boolean
     */
    isOfflineForm: false,

    /**
     * This method tries to get the HTML template an render the current object inside
     * @return {jQuery} $.Deferred()
     */
    renderControl: function() {
        var self = this;
        var properties = self.properties;

        /**
         * Check if this is an offline form
         * It doesn't validate if the device goes offline so.. (but smartphone)
         */
        //this.isOfflineForm = bizagi.util.isOfflineForm({ context: this });
        this.isOfflineForm = false;
        this.isNative = bizagi.util.isCordovaSupported();

        var template = self.renderFactory.getTemplate("image");

        var allowDelete = self.isOfflineForm ? false : properties.allowDelete && properties.editable;
        var html = $.fasttmpl(template, {
            url: "",
            allowDelete: allowDelete,
            editable: properties.editable
        });

        return html;
    },

    /**
     * There is no difference when rendering a readonly image, so ...
     * @return {jQuery} $.Deferred()
     */
    renderReadOnly: function() {
        return this.renderControl();
    },

    /**
     * After rendering element
     */
    postRender: function() {
    },

    /**
     * After rendering a readonly element
     */
    postRenderReadOnly: function() {
        // Just a little colors
        this.element.addClass("bz-rn-read-only bz-rn-non-editable");
    },

    /**
     * Add action handlers
     */
    configureHandlers: function() {
        var self = this;
        var resolutionUpload = [];
        var version = bizagi.util.getAndroidVersion();

        this.$addImage = $(".ui-bizagi-render-upload-wrapper", this.getControl());
        this.$deleteImage = $(".bz-rn-image-actions-delete", this.getControl());
        this.$inputFile = $(".bz-rn-upload-image-web", this.getControl());

        this._super();

        if (this.isNative) {
            // Upload Image Options
            this.$addImage.actionSheet({
                actions: [
                    {
                        "guid": 1,
                        "displayName": bizagi.localization.getResource("workportal-actionsheet-upload-choose-photo")
                    },
                    {
                        "guid": 2,
                        "displayName": bizagi.localization.getResource("workportal-actionsheet-upload-take-photo")
                    }
                ],
                actionClicked: function(action) {
                    switch (action.guid) {
                    case 1:
                        self.imageAdd();
                        break;
                    case 2:
                        self.imageAdd(true);
                        break;
                    default:
                    }
                }
            });
        } else {
            if (bizagi.util.media.fileAPISupported()) {
                this.$addImage.on("click", ".bz-rn-image-actions-add", function() {
                    self.$inputFile.click();
                });
            } else {
                // Opaco y sin opción de carga
                this.postRenderReadOnly();
                this.$addImage.find(".bz-rn-image-actions-add").hide();
            }
        }

        // remove Image
        this.$deleteImage.click(function() { self.imageDelete(); });
        // Image change (Hybrid only)
        this.$inputFile.on("change", function() {
            self.imageAdd();
            this.value = "";
        });

        // Just in case
        this.$inputFile.on("change", function() {
            self.imageAdd();
            this.value = "";
        });

        // Resolution upload menu
        // If android version is less than 4.4 avoid to show upload sizes due to compatibility with blob files
        if (version && version <= 4.4) {
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

        $(".bz-resolution-container", self.getControl()).actionSheet({
            actions: resolutionUpload,
            actionClicked: function(action) {
                $.when(self.resolutionButtonHandler(action.guid))
                    .done(function() {
                    }).fail(function() {
                    });
            }
        });
    },

    clearDisplayValue: function(){
        var self = this;

        this.$deleteImage.click();
    },

    clearDisplayValue: function(){
        var self = this;

        this.$deleteImage.click();
    },

    /**
     * Add an image
     * @param useCamera boolean Whether or not to use device's camera
     */
    imageAdd: function(useCamera) {

        var self = this;

        if (!this.isNative) {
            var dataFile = this.$inputFile[0].files[0];
            dataFile.fullPath = this.$inputFile[0].value;
            var extensions = this.Class.EXTENSIONSIMG;

            bizagiLoader().start();
            if (bizagi.util.media.checkMaxSizeFile(dataFile, self.properties) && bizagi.util.media
                .checkFileTypes(dataFile, self.properties, extensions)) {

                $.when(self.uploadFile(dataFile)).done(function(result) {
	                self.uploadFileCompleted(self, result);
                }).fail(function(error) {
                    if (error.statusText !== "Unauthorized") {
                        bizagi.showMessageBox(self.getResource("workportal-widget-admin-language-error"));
                    }
                }).always(function() {
                    bizagiLoader().stop();
                });

            } else {
                bizagiLoader().stop();
            }
        } else {

            var options = {
                quality: self.Class.QUALITY_PICTURE,
                targetWidth: 1280,
                targetHeight: 960
            };

            if (!useCamera) {
                var coordinates = self.control[0].getBoundingClientRect();
                //noinspection JSUnresolvedVariable,JSUnresolvedFunction
                options = {
                    quality: self.Class.QUALITY_PICTURE,
                    sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                    popoverOptions: new CameraPopoverOptions(coordinates.left, coordinates.top - 20, 200, 100, 4),
                    destinationType: navigator.camera.DestinationType.FILE_URI
                };
            }


            //noinspection JSUnresolvedFunction,JSUnresolvedVariable
            navigator.camera.getPicture(function(dataImage) {
                $.when(bizagi.util.media.checkMaxSize(dataImage, self.properties)).done(function() {
                    self.dataImage = dataImage;
                    // "new Blob" constructor is not supported in android version 4.2.2
                    var version = bizagi.util.getAndroidVersion();
                    if ((version && version <= 4.2) || self.isOfflineForm) {


                        $.when(self.uploadFile(self.dataImage)).done(function(result) {
                            self.uploadFileCompleted(self, result);
                        }).fail(function(error) {
                            if (error.statusText !== "Unauthorized") {
                                bizagi.showMessageBox(self.getResource("workportal-widget-admin-language-error"));
                            }
                        }).always(function() {
                            bizagiLoader().stop();
                        });

                    } else {

                        // force click to show actionsheet menu
                        $(".bz-resolution-container", self.getControl()).click();
                    }
                });
            }, self.onFail, options);

        }
    },

    /**
     * Remove the current image
     */
    imageDelete: function() {
        var self = this;
        bizagi.showConfirmationBox(this.getResource("render-grid-delete-confirmation"))
            .done(function() {
                bizagiLoader().start();
                $.when(self.dataService.deleteImage({
                    url: self.properties.deleteUrl,
                    idRender: self.properties.id,
                    xpath: self.properties.xpath,
                    xpathContext: self.properties.xpathContext,
                    idPageCache: self.properties.idPageCache,
                    contexttype: self.properties.contexttype
                })).done(function() {
                    self.uploadFileCompleted(self);
                }).fail(function(msg) {
                    var message;
                    var responseText = msg.responseText;

                    try {
                        message = JSON.parse(responseText);
                        message = message.message || responseText;
                    } catch (e) {
                        message = responseText;
                    }
                    bizagi.showMessageBox(message, "Error");

                }).always(function() {
                    bizagiLoader().stop();
                });
            });
    },

    /**
     * Send file using HTTP
     * @param dataFile
     * @return {jQuery} $.Deferred()
     */
    uploadFile: function(dataFile) {

        var self = this;
        var defer = new $.Deferred();

        if (!this.isOfflineForm) {

            // Fix android 4.4 getting images from recent folder
            if (this.isNative) {

                //noinspection JSUnresolvedFunction
                var params = {
                    dataFile: dataFile,
                    data: self.buildAddParams(),
                    options: new FileUploadOptions(),
                    properties: self.properties,
                    extensions: self.Class.EXTENSIONSIMG
                };

                params.data.queueID = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());
                params.options.fileKey = "file";
                params.options.fileName = params.dataFile.substr(params.dataFile.lastIndexOf('/') + 1);
                params.options.mimeType = "image/jpeg";
                params.options.params = params.data;

                if (self.editedImageURL) {
                    params.dataFile = self.editedImageURL;
                }

                // Fix android 4.4 getting images from recent folder
                params.dataFile = bizagi.util.media.getImagePath(params.dataFile);

                $.when(bizagi.util.media.uploadFile(params)).done(function(r) {
                    var response = JSON.parse(decodeURIComponent(r.response));
                    if (response.type === "error") {
                        defer.reject(response);
                    } else {
                        defer.resolve(response);
                    }
                }).fail(function(error) {
                    defer.reject(error);
                }).always(function() {
                });

            } else {

                if (bizagi.util.media.checkMaxSizeFile(dataFile, self.properties) && bizagi.util.media
                    .checkFileTypes(dataFile, self.properties, self.Class.EXTENSIONSIMG)) {

                    // Get form data for POSTing
                    var formData = new FormData();
                    var form = self.getFormContainer();

                    // Build add params to send to the server
                    formData.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath", self.properties.xpath);
                    formData.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender", self.properties.id);
                    formData.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext", self.properties.xpathContext);
                    formData.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE, self.properties.idPageCache);
                    formData.append(self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId", form.properties.sessionId);
                    formData.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action", 'savefile');
                    formData.append(self.properties.xpath, dataFile);

                    if (self.properties.contexttype) {
                        formData.append(self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype", self.properties.contexttype);
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

                    self.dataService.processUploadFile({
                        url: self.properties.addUrl,
                        formData: formData
                    }).done(function(response) {
                        defer.resolve(response);
                    }).fail(function(error) {
                        defer.reject(error);
                    });

                } else {
                    bizagiLoader().stop();
                }

            }

        } else {
            // Load image
            self.saveImageOffline(self, dataFile, function(dataUrl) {
                self.setValue(dataUrl);
                defer.resolve();
            });

            // Enables canbesent on offline mode
            self.canBeSent = function() {
                return true;
            };
        }

        return defer.promise();
    },

    /**
     * File upload is done
     * @param context
     * @param response
     */
    uploadFileCompleted: function(context, response) {
        var self = context;

        try {
            self.showAsyncImage();
            self.editedImageURL = null;
        } catch (error) {
            self.getFormContainer().refreshForm();
        }
    },

    /**
     * Show async image
     * */
    showAsyncImage: function(){
        var self = this;
        var control = self.getControl();

        $.when(self.buildItemUrl()).done(function(dataUrl) {
            if (!self.isDisposed()) {
                self.properties.url = (dataUrl !== "") ? dataUrl : "";
                self.properties.value = self.value = (self.properties.url.length > 0) ? [self.properties.url] : null;
                self.setValue(self.properties.value);

                if (self.isOfflineForm && dataUrl.indexOf("Invalid case id") !== -1) {
                    self.properties.url = "";
                }

                control.find(".bz-rn-image-container img").css("display", "inherit").attr("src", self.properties.url);
                control.find(".bz-rn-image-container").toggleClass("bz-rn-image-actions-add", self.properties.editable && self.properties.url === "");

                if(self.properties.url !== ""){
                    control.find(".bz-rn-image-container img").off("click").click(function(){self.renderEdition()});
                    control.find(".bz-rn-image-actions-add").toggle(self.properties.editable);
                    control.find(".bz-rn-image-actions-delete").toggle(self.properties.allowDelete && self.properties.editable);
                }else{
                    control.find(".bz-rn-image-actions-add.bz-upload").hide();
                    control.find(".bz-rn-image-actions-delete").hide();
                }
            }
        }).fail(function() {});
    },

    /**
     * Create an image offline
     * @param context
     * @param url
     * @param callback
     */
    saveImageOffline: function(context, url, callback) {
        var control = this.getControl();
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
        control.find("img").replaceWith(image);
        control.find(".bz-cm-icon.image-file").replaceWith(image);
    },

    /**
     * resolutionButtonHandler
     * @param buttonOrdinal
     */
    resolutionButtonHandler: function(buttonOrdinal) {
        var self = this;
        var objWidth = 0;
        var objHeight = 0;
        var defer = new $.Deferred();

        bizagiLoader().start();

        switch (buttonOrdinal) {
        case 1:
            objWidth = 320;
            objHeight = 240;
            break;
        case 2:
            objWidth = 640;
            objHeight = 480;
            break;
        case 3:
            objWidth = 1280;
            objHeight = 960;
            break;
        }

        // If original, save image normally, if not, reduce quality and size
        if (buttonOrdinal === 4) {

            $.when(self.uploadFile(self.dataImage)).done(function(result) {
                self.uploadFileCompleted(self, result);
            }).fail(function(error) {
                if (error.statusText !== "Unauthorized") {
                    bizagi.showMessageBox(self.getResource("workportal-widget-admin-language-error"));
                }
            }).always(function() {
                bizagiLoader().stop();
            });

            defer.resolve();
        } else {
            $.when(self.transformImageSize(self.dataImage, objWidth, objHeight))
                .done(function() {

                    $.when(self.uploadFile(self.dataImage)).done(function(result) {
                        self.uploadFileCompleted(self, result);
                    }).fail(function(error) {
                        if (error.statusText !== "Unauthorized") {
                            bizagi.showMessageBox(self.getResource("workportal-widget-admin-language-error"));
                        }
                    }).always(function() {
                        bizagiLoader().stop();
                    });

                }).fail(function() {

                }).always(function() {
                    bizagiLoader().stop();
                    defer.resolve();
                });
        }

        return defer.promise();
    },

    /**
     * saveBlobToFile
     * @param blob
     * @param defer
     */
    saveBlobToFile: function(blob, defer) {
        var self = this;

        //noinspection JSUnresolvedFunction,JSUnresolvedVariable
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                var root = fileSystem.root;

                // writes a file
                var writeFile = function(writer) {
                    writer.onwriteend = function() {
                        //noinspection JSUnresolvedVariable
                        self.editedImageURL = writer.localURL;
                        defer.resolve();
                    };
                    // write to file
                    writer.write(blob);
                };

                // creates a FileWriter object
                var createWriter = function(fileEntry) {
                    //noinspection JSUnresolvedFunction
                    fileEntry.createWriter(writeFile, null);
                };

                var newId = "bizagiImgTmp";

                // create a file and write to it
                root.getFile(newId + ".jpg", { create: true }, createWriter, null);
            },
            function() {});
    },

    /**
     * Change image size
     * @param objectUri
     * @param objWidth
     * @param objHeight
     */
    transformImageSize: function(objectUri, objWidth, objHeight) {
        var self = this;
        var defer = new $.Deferred();

        //noinspection JSUnresolvedFunction
        window.resolveLocalFileSystemURL(objectUri, function(fileEntry) {
            fileEntry.file(function(fileObj) {

                var reader = new FileReader();

                // Create a function to process the file once it's read
                reader.onloadend = function() {
                    // Create an image element that we will load the data into
                    var image = new Image();
                    image.onload = function() {

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

                        if (self.value && self.properties.value) {
                            self.value[0] = self.properties.value[0] =
                                self.properties.url = canvas.toDataURL("image/jpeg", 0.5);
                        } else {
                            self.properties.url = canvas.toDataURL("image/jpeg", 0.5);
                        }

                        var imageToSaveLocal = self.properties.url.replace("data:image/jpeg;base64,", "");
                        var imageBlob = bizagi.util.b64toBlob(imageToSaveLocal);
                        self.saveBlobToFile(imageBlob, defer);

                        image = null;

                    };
                    // Load the read data into the image source. It's base64 data
                    image.src = objectUri;
                };

                // Read from disk the data as base64
                reader.readAsDataURL(fileObj);

            });
        });
        return defer.promise();
    },

    /**
     * Smartphone compatibility mode
     */
    postRenderSingle: function() {
        var self = this;

        self._super();

        self.configureHandlers();
        self.configureHelpText();

        // Some compat for the smartphone weird behavior
        if (!self.properties.editable) {
            self.postRenderReadOnly();
        }

        self.showAsyncImage();
    },

    /**
     * Render edition view
     * @returns {}
     */
    renderEdition: function() {
        var self = this;
        var properties = self.properties;

        // TODO Creates a container, be careful you must destroy it later
        var baseParams = self.getParams();
        var container = baseParams.navigation.createRenderContainer(
            {
                title: properties.displayName,
                view: {
                    zoom: true,
                    useNativeScrolling: false
                }
            }
        );

        var img = $.tmpl(self.renderFactory.getTemplate("image-preview"), { 'url': self.value[0] });
        self.inputEdition = container.element.html(img);
        baseParams.navigation.navigate(container.id);

        self.kendoViewFinish = function() {
            var originalImageWidth = self.inputEdition.width();
            var view = bizagi.kendoMobileApplication.view().element;
            var adjustedImageWidthScale = (view.width() < originalImageWidth) ? (view.width() / originalImageWidth) : 1;

            if (bizagi.kendoMobileApplication.scroller() && bizagi.kendoMobileApplication.scroller().movable) {
                bizagi.kendoMobileApplication.scroller().movable.scaleTo(adjustedImageWidthScale);
            }

            $(".ui-bizagi-container-inputs", view).css("padding", 0);
        };

        $.when(self.buildFullItemUrl()).done(function(dataUrl) {
            if (dataUrl.indexOf("error") < 0) {
                var $preview = $(".bz-rn-image-render-preview:first", container.element).attr("src", dataUrl);
                var originalImageWidth = $preview.css("width");
                originalImageWidth = Number(originalImageWidth.substring(0, originalImageWidth.length - 2));

                if (self.properties.width !== -1 && self.properties.width < originalImageWidth) {
                    $preview.css("width", "100%");
                }
            }
        });
    },

    /**
     * postRenderEdition
     */
    postRenderEdit: function() {
        //Override the super behavior and do nothing, it is ok to do this don't remove.
    },

});
