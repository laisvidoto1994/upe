/*
*   Name: BizAgi Render Image Class
*   Author: Edward J Morales
*   Comments:
*   -   This script will redefine the image render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.image.extend("bizagi.rendering.image", {}, {

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Call base 
        self._super();        
        if (bizagi.util.isCordovaSupported())
            self.activeUploadNative();
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        // Call base
        self._super();
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour when rendering in design mode
    */
    configureDesignView: function () {
        var self = this;
        // Call base
        self._super();
    },
    /*
    *   Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();
        var template = self.renderFactory.getTemplate("image");
        var mode = self.getMode();

        $.when(self.buildItemUrl()).done(function (dataUrl) {
            var url = (dataUrl != "") ? dataUrl : url;
            // Render template
            var html = $.fasttmpl(template, {
                xpath: bizagi.util.encodeXpath(self.getUploadXpath()),
                editable: false,
                url: url,
                allowDelete: false,
                mode: mode
            });
            control.append(html);
        });
    },

    activeUploadNative: function() {
	    var self = this;
	    var container = self.getControl();
	    var body = $("body");

	    self.itemAddfile = $(".image-file", container);
	    self.itemResolutionUpload = $(".ui-bizagi-resolutionUploadFrame", container);

	    if (self.itemAddfile.length == 0)
		    self.itemAddfile = $("img", container);

	    self.itemsUpload = {
		    "image": $(".image", container),
		    "cimage": $(".cimage", container)
	    };

	    self.itemAddfile.bind("click", function(e) {

		    var containerUploadItems = $(".bz_rn_upload_container_upload_items", container);
		    //mejorar la implementacion cuando abro varios casos especiales al tiempo            
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

			    self.itemsUpload = {
				    "image": $(".image", cloneUpload),
				    "cimage": $(".cimage", cloneUpload)
			    };

		    }
		    self.addListener();
	    });
    },


    removeListener: function () {
    	var self = this;

        self.itemsUpload.image.unbind("click");
        self.itemsUpload.cimage.unbind("click");
    },

    addListener: function () {
    	var self = this;
    	var isOfflineForm = typeof (bizagi.context.isOfflineForm) !== "undefined"
		   && bizagi.context.isOfflineForm || false;

        self.itemsUpload.image.bind("click", function () {

            navigator.camera.getPicture(function (dataImage) {

                $.when(self.checkMaxSize(dataImage)).done(function (resp) {
                    if (resp) {

                        self.dataImage = dataImage;

                        // "new Blob" constructor is not supported in android version 4.2.2
                        if ((bizagi.detectSO() == "android" && bizagi.util.detectAndroidVersion() <= 422) || isOfflineForm) {
                            self.saveImage(self, self.dataImage);
                        } else {
                            var resolutionDiv = $(".ui-bizagi-resolution-container", self.getControl()).clone();
                            $("body").append(resolutionDiv);
                            $(resolutionDiv).css("display", "block");

                            $(".ui-bizagi-resolution-button", resolutionDiv).bind("click", function (e) {
                                self.resolutionButtonHandler(this);
                            });

                            $(".ui-bizagi-resolution-button-cancel", resolutionDiv).bind("click", function (e) {
                                $(".ui-bizagi-resolution-container").css("display", "none");
                                bizagi.util.smartphone.stopLoading();
                                $("body>.ui-bizagi-resolution-container").remove();
                            });
                        }
                    }
                    self.itemAddfile.click();
                });

            }, self.onFail, {
                quality: self.Class.QUALITY_PICTURE,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            });

        });

        //capture image from camera
        self.itemsUpload.cimage.bind("click", function () {

            navigator.camera.getPicture(function (dataImage) {
                $.when(self.checkMaxSize(dataImage)).done(function (resp) {
                    if (resp) {
                        self.saveImage(self, dataImage);
                    }
                    self.itemAddfile.click();
                });
            },
                self.onFail,
                { quality: self.Class.QUALITY_PICTURE, targetWidth: 1280, targetHeight: 960 });

        });


    },

    resolutionButtonHandler: function (buttonSelected) {
        var self = this;
        var buttonOrdinal = $(buttonSelected).attr("data-bz-ordinal");

        bizagi.util.smartphone.startLoading();
        var objWidth = 0;
        var objHeight = 0;


        if (buttonOrdinal == 1) {
            objWidth = 320;
            objHeight = 240;
        } else if (buttonOrdinal == 2) {
            objWidth = 640;
            objHeight = 480;
        } else if (buttonOrdinal == 3) {
            objWidth = 1280;
            objHeight = 960;
        }

        //if original, save image normally, if not, reduce quality and size
        if (buttonOrdinal == 4) {
            self.saveImage(self, self.dataImage);
        }
        else {
            $.when(self.transformImageSize(self.dataImage, objWidth, objHeight)).done(function () {
                self.saveImage(self, self.dataImage);
            }).fail(function () {
                bizagi.util.smartphone.stopLoading();
            });
        }

        $(".ui-bizagi-resolution-container").css("display", "none");
        $("body>.ui-bizagi-resolution-container").remove();
    },
    
    saveImage: function(context, dataImage) {
        var self = context;
        var properties = self.properties;
        var data = self.buildAddParams();

        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });
        data.queueID = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());;

        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = dataImage.substr(dataImage.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.params = data;

        if (self.editedImageURL) {
            dataImage = self.editedImageURL;
        }

        // Fix android 4.4 getting images from recent folder	    
        dataImage = bizagi.util.mobileImagePath(dataImage);

        if (!isOfflineForm) {
            var ft = new FileTransfer();
            ft.upload(dataImage, properties.addUrl,
                function(r) {
                    self.onUploadFileCompleted(context, JSON.parse(decodeURIComponent(r.response)));
                },
                function(error) {
                    bizagi.log("An error has occurred: Code = " + error.code);
                    bizagi.util.smartphone.stopLoading();
                }, options);

        } else {
            var img = new Image();
            var control = self.getControl();

            $(img).on("load", function() {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");

                canvas.width = this.width;
                canvas.height = this.height;
                ctx.drawImage(img, 0, 0);

                var dataURL = canvas.toDataURL("image/png", 1);
                dataURL = dataURL.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                self.setValue(dataURL);
            });

            img.src = dataImage;
            control.find("img").replaceWith(img);
            control.find(".bz-cm-icon.image-file").replaceWith(img);

            self.removeListener();
            self.activeUploadNative();

            //enables canbesent on offline mode
            self.canBeSent = function () {
                $.forceCollectData = true;
                return true;
            };
        }
    },

    onFail: function (error) {
        bizagi.log('Error code: ' + error.code);
    },

    onUploadFileCompleted: function (context, response) {
        var self = context;
        try {
            self.submitOnChange();
            self.editedImageURL = null;
            bizagi.util.smartphone.stopLoading();
        } catch (e) {
            self.getFormContainer().refreshForm();
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
                        console.log('Write completed.');
                    };

                    writer.onerror = function (e) {
                        console.log('Write failed: ' + e.toString());
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
                root.getFile(newId + '.jpg', { create: true }, createWriter, null);
            },
            function () { });
    },
    /*
    *
    */
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
    /*
    *
    */
    checkMaxSize: function (objectUri) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();

        if (properties.maxSize == "undefined" || properties.maxSize == null || properties.maxSize == "") {
            defer.resolve(true);
        }

        window.resolveLocalFileSystemURI(objectUri, function (fileEntry) {
            fileEntry.file(function (fileObj) {
                if (fileObj.size >= properties.maxSize) {
                    //'the file is heavier than allowed: ' + properties.maxSize +"Bytes");
                    bizagi.showMessageBox(self.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize), "Error");
                    defer.resolve(false);
                }
                else {
                    defer.resolve(true);
                }

            });
        });
        return defer.promise();
    }
});
