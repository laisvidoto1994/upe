/*
*   Name: BizAgi Render Image Class
*   Author: Edward J Morales
*   Comments:
*   -   This script will redefine the image render class to adjust to smathphone devices
*/

// Extends itself
bizagi.rendering.image.extend("bizagi.rendering.image", {
    QUALITY_PICTURE: 80,
    LIMIT: 1
}, {

    renderSingle: function () {
        var self = this;
        var control = self.getControl();
        self.getArrowContainer().css("visibility", "hidden");
        //bug render image control
        if (control.find(".image-wrapper").length == 1)
            return true;
        $.when(self.renderControl()).done(function (html) {
            control.append(html);
        });
    },
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRenderSingle: function () {
        var self = this;
        var container = self.getContainerRender();
        var control = self.getControl();
        container.addClass("bz-command-edit-inline");
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

    activeUploadNative: function () {
        var self = this;
        var container = self.getContainerRender();
        var body = $("body");
        self.itemAddfile = $(".bz-cm-icon.image-file", container);
        if (self.itemAddfile.length == 0)
            self.itemAddfile = $("img", container);

        self.itemsUpload = {
            "image": $(".image", container),
            "cimage": $(".cimage", container)
        };

        self.itemAddfile.bind("click", function (e) {

            var containerUploadItems = $(".bz_rn_upload_container_upload_items", container);
            //mejorar la implementacion cuando open varios casos especiales al tiempo
            //bug IOS : z-inded for first item
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

            } catch (e) { }

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
            }
            else {
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

        self.itemsUpload.image.bind("click", function () {

            navigator.camera.getPicture(function (dataImage) {

                //A hack that should be included to catch bug on Android 4.4 (bug < Cordova 3.5):
                if (dataImage.substring(0, 21) == "content://com.android") {
                    var photo_split = dataImage.split("%3A");
                    dataImage = "content://media/external/images/media/" + photo_split[1];
                }
                
                $.when(self.checkMaxSize(dataImage)).done(function (resp) {
                    if (resp) {
                        self.saveImage(self, dataImage);
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
                $.when(self.checkMaxSize(dataImage)).done(function(resp) {
                    if (resp) {
                        self.saveImage(self, dataImage);
                    }
                    self.itemAddfile.click();
                });
            },
            self.onFail,
            { quality: self.Class.QUALITY_PICTURE });

        });


    },

    saveImage: function (context, dataImage) {

        var self = context;
        var properties = self.properties;
        var data = self.buildAddParams();
        var queueID = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());
        data.queueID = queueID;
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = dataImage.substr(dataImage.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.params = data;
        var ft = new FileTransfer();

        //fix android 4.4 getting images from recent folder
        if (dataImage.substring(0, 21) == "content://com.android") {
            var photoSplit = dataImage.split("%3A");
            dataImage = "content://media/external/images/media/" + photoSplit[1];
        }
        
        ft.upload(dataImage, properties.addUrl,
         function (r) {
             self.onUploadFileCompleted(context, JSON.parse(decodeURIComponent(r.response)));
         },
         function (error) {
             bizagi.log("An error has occurred: Code = " + error.code);
         }
         , options);
    },

    onFail: function (error) {
        bizagi.log('Error code: ' + error.code);
    },

    onUploadFileCompleted: function (context, response) {
        var self = context;
        try {
            //self.submitOnChange();
            $.when(self.renderUploadItem()).done(function (htmlImage) {

                // Empty container and add new image            	
                var control = self.getControl();
                var imageWrapper = $(".ui-bizagi-render-image-wrapper", control);

                self.removeListener();

                $(imageWrapper).html("");
                $(imageWrapper).append(htmlImage);

                //this is needed to update the state of the control and delete the required icon
                self.setValue([true]);

                //set to the new image the click event
                self.activeUploadNative();
            });
        } catch (e) {
            self.getFormContainer().refreshForm();
        }
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
        var container = self.getContainerRender();
        container.addClass("bz-command-edit-inline");

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
