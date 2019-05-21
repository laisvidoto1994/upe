/*
*   Name: BizAgi Tablet Render Association
*   Author: Andres Valencia
*   Comments: Defines the ECM control for iPad
*/

bizagi.rendering.ecm.extend('bizagi.rendering.ecm', {
    BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
    BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX,
    QUALITY_PICTURE: 80,
    LIMIT: 1,
//limit: The maximum number of audio clips,video clips,etc in the device user can record in a single capture operation.
    EXTENSIONSIMG: ["image/jpeg", "jpeg", "image", "png", "jpg"],
    EXTENSIONSVIDEO: ["video/quicktime", "quicktime", "qt", "mov"],
    EXTENSIONSAUDIO: ["audio/wav", "audio", "wav"]
}, {
    postRender: function() {
        var self = this; // Call base 
        self._super();       

        self.activateUploadNative();
    },

    postRenderReadOnly: function() {
        var self = this;
        if (!bizagi.util.isCordovaSupported())
            self.addEventToOpenSlide();

    },


    addEventToOpenSlide: function() {
        var self = this;
        var mode = self.getMode();
        var control = self.getControl();
        var container = self.getControl();
        self.itemAddfile = $(".bz-rn-upload-show-menu", container);
        self.itemAddfile.hide();
        $("li", control).click(function() {
            var url = $(this).data('url');
            if (mode == "execution") {
                var slide = new bizagi.rendering.tablet.slide.upload(self.dataService, self.renderFactory, {
                    container: self.getFormContainer().container,

                    url: url
                });
                slide.render({
                    url: url
                });
            }
        });
    },


    activateUploadNative: function() {
        var self = this;
        var properties = self.properties;
        var container = self.getControl();
        var body = $("body");
        var control = self.getControl();

        control.css('display', 'block');
        control.css('width', '100%');
        control.css("padding", "0");

        if (self.getLabel()) {
            self.getLabel().hide();
        }

        self.itemAddfile = $(".bz-rn-ecm-upload", container);

        $(".bz-rn-ecm-activate-menu", control).bind("click", function() {
            var elementBase = $(this);
            var parents = elementBase.parents(".bz-rn-ecm-metadata");
            var menu = $(".bz-rn-ecm-menu-container", parents);
            menu.css("top", "0").css("left", "0");
            menu.toggle();


            menu.position({
                of: elementBase,
                my: "right right",
                at: "left left",
                offset: "-8px",
                collision: "flipfit flipfit"
            });


            /*
            .bz-ecm-delete, 
            .bz-ecm-edit,
            .bz-ecm-lock,
            .bz-ecm-unlock,
            .bz-ecm-upgrade
            */
            var tmpidElement = elementBase.parent().data("idfileupload") || "";
            self.elementsEvent = {
                "menu": menu,
                "lock": $(".bz-ecm-lock", menu),
                "unlock": $(".bz-ecm-unlock", menu),
                "del": $(".bz-ecm-delete", menu),
                "edit": $(".bz-ecm-edit", menu),
                "element": {
                    "id": tmpidElement,
                    "filename": elementBase.parent().attr("title") || "",
                    elementReference: this
                },
                "params": {
                    idFileUpload: tmpidElement,
                    xPath: self.properties.xpath,
                    idAttrib: self.properties.idAttrib,
                    idPageCache: self.properties.idPageCache,
                    xpathContext: self.getXpathContext()
                },
                "panelMetadata": $(".bz-rn-ecm-metadata-container", parents),
                "btnCancel": $(".bz-rn-ecm-btn-cancel", parents),
                "btnSave": $(".bz-rn-ecm-btn-save", parents)
            };


            if (menu.is(":visible")) {
                self.addEventsEcm();
            } else {
                self.removeEventsEcm();
            }


        });

        if (!bizagi.util.isCordovaSupported() || properties.editable == false) {
            self.itemAddfile.hide();
            return;
        }

        if (bizagi.detectDevice() == "tablet_android") {

            self.uploadEcmLink = $(".bz-rn-ecm-url > span", container);
            self.uploadEcmLink.bind("click", function(e) {
                window.open(encodeURI(this.getAttribute("href")), '_system', 'location=yes');
            });
        }

        self.itemsUpload = {
            "file": $(".file", container),
            "image": $(".image", container),
            "cimage": $(".cimage", container),
            "caudio": $(".caudio", container),
            "cvideo": $(".cvideo", container)
        };
        self.itemAddfile.show();
        self.itemAddfile.bind("click", function(e) {
            var containerUploadItems = $(".bz_rn_upload_container_upload_items", container);
            //mejorar la implementacion cuando abro varios casos especiales al tiempo
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
                "file": $(".file", cloneUpload || containerUploadItems),
                "image": $(".image", cloneUpload || containerUploadItems),
                "cimage": $(".cimage", cloneUpload || containerUploadItems),
                "caudio": $(".caudio", cloneUpload || containerUploadItems),
                "cvideo": $(".cvideo", cloneUpload || containerUploadItems)
            };

            self.addListener();
        });

        self.checkExtensions();
        self.checkMaxFiles();
    },

    addEventsEcm: function() {
        var self = this;
        self.elementsEvent.lock.click(function() {
            $.when(self.dataService.checkOutFile(self.elementsEvent.params)).done(function() {
                self.elementsEvent.lock.removeClass("bz-ecm-item-menu-enable");
                self.elementsEvent.unlock.addClass("bz-ecm-item-menu-enable");

            });
        });
        self.elementsEvent.unlock.click(function() {
            $.when(self.dataService.cancelCheckOut(self.elementsEvent.params)).done(function() {
                self.elementsEvent.unlock.removeClass("bz-ecm-item-menu-enable");
                self.elementsEvent.lock.addClass("bz-ecm-item-menu-enable");
            });
        });
        self.elementsEvent.del.bind("click", function() {
            $.when(self.dataService.deleteECMFile(self.elementsEvent.params)).done(function() {
                self.removeEventsEcm();
                $(self.elementsEvent.element.elementReference).parents(".bz-rn-ecm-metadata").remove();

            });
        });
        self.elementsEvent.edit.click(function() {
            self.elementsEvent.panelMetadata.show();
            self.elementsEvent.menu.hide();
        });
        self.elementsEvent.btnSave.click(function() {
            var properties = self.properties;
            var elementsToCheck = $(".bz-rn-ecm-metadata-value", self.elementsEvent.panelMetadata);
            var metadata = [];
            var isInvalid = false;
            for (var metadataelement = 0; metadataelement < elementsToCheck.length; metadataelement++) {
                var tmpElement = elementsToCheck[metadataelement];
                var oldValue = $(tmpElement).data("value");
                var type = $(tmpElement).data("metadatatype");
                var required = $(tmpElement).data("required");
                var readonly = $(tmpElement).data("readonly");
                var description = $(tmpElement).data("description");
                var idmetadata = $(tmpElement).data("idmetadata");
                var actualValue = null;

                if (readonly)
                    return true;

                if (type == "STRING" || type == "DECIMAL") {
                    actualValue = $("input", tmpElement).val();
                } else if (type == "BOOL") {
                    actualValue = $('input[name=ecm-radio]:checked', tmpElement).val();
                } else if (type == "DATETIME") {
                    actualValue = $("input", tmpElement).attr("value");
                    actualValue = $.scroller.formatDate("d. m. yy", $.scroller.parseDate("yy-mm-dd", actualValue));
                }
                if (required && (actualValue == "" || actualValue == null)) {
                    alert(description + ": " + self.getResource("render-ecm-tooltip-mandatory"));
                    isInvalid = true;
                }
                if (!isInvalid && actualValue != oldValue) {
                    metadata.push({
                        idMetadata: idmetadata,
                        value: actualValue
                    });
                }
            }

            if (!isInvalid) {
                params = self.buildAddParams();
                params.fileName = self.elementsEvent.element.filename;
                params.idFileUpload = self.elementsEvent.element.id;
                params.idPageCache = properties.idPageCache;
                params.metaValues = JSON.encode({
                    metadataValues: metadata
                });

                $.when(self.dataService.updateECMMetadata(params)).done(
                    function(fileProperties) {

                    });
                self.elementsEvent.panelMetadata.hide();
                self.removeEventsEcm();
            }


        });

        self.elementsEvent.btnCancel.click(function() {
            self.elementsEvent.panelMetadata.hide();
            self.removeEventsEcm();
        });

    },
    removeEventsEcm: function() {
        var self = this;
        self.elementsEvent.lock.unbind("click");
        self.elementsEvent.unlock.unbind("click");
        self.elementsEvent.del.unbind("click");
        self.elementsEvent.edit.unbind("click");
        self.elementsEvent.btnSave.unbind("click");
        self.elementsEvent.btnCancel.unbind("click");
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
        var self = this;
        self.itemsUpload.image.bind("click", function() {

            navigator.camera.getPicture(function(dataImage) {

                $.when(self.checkMaxSize(dataImage)).done(function(responseInternal) {
                    if (responseInternal)
                        self.saveImage(self, dataImage);
                });
                self.itemAddfile.click();

            }, self.onFail, {
                quality: self.Class.QUALITY_PICTURE,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            });

        });

        //capture file
        self.itemsUpload.file.bind("click", function() { alert("in development"); });
        //capture image from camera
        self.itemsUpload.cimage.bind("click", function() {
            navigator.camera.getPicture(function(dataImage) {

                    $.when(self.checkMaxSize(dataImage)).done(function(responseInternal) {
                        if (responseInternal)
                            self.saveImage(self, dataImage);
                    });
                    self.itemAddfile.click();
                },
                self.onFail,
                { quality: self.Class.QUALITY_PICTURE });

        });

        //capture audio
        self.itemsUpload.caudio.bind("click", function() {
            navigator.device.capture.captureAudio(function(dataImage) {

                $.when(self.checkMaxSize(dataImage)).done(function(responseInternal) {
                    if (responseInternal)
                        self.saveAudio(self, dataImage);
                });
                self.itemAddfile.click();
            }, self.onFail, { limit: self.Class.LIMIT });

        });

        //capture video 
        self.itemsUpload.cvideo.bind("click", function() {
            navigator.device.capture.captureVideo(function(dataImage) {

                $.when(self.checkMaxSizeVideo(dataImage)).done(function(responseInternal) {
                    if (responseInternal)
                        self.saveVideo(self, dataImage);
                });
                self.itemAddfile.click();
            }, self.onFail, { limit: self.Class.LIMIT });

        });

    },

    renderUploadItem: function(file) {
        var self = this;
        var properties = self.properties;
        var html = self._super(file);
        return html;
    },


    saveImage: function(context, dataImage) {
        var self = context;
        var properties = self.properties;
        var data = self.buildAddParams();
        var queueID = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());

        data.queueID = queueID;

        var options = new FileUploadOptions();

        options.fileKey = "file";
        options.fileName = dataImage.substr(dataImage.lastIndexOf('/') + 1);
        data.filename = options.fileName;
        options.mimeType = "image/jpeg";
        options.params = data;

        var ft = new FileTransfer();

        //url: self.dataService.serviceLocator.getUrl("render-ecm-upload-url") + "?action=updateECMFileContent"
        //self.dataService.serviceLocator.getUrl("render-ecm-upload-url") + "?action=uploadECMFile"

        //self.startLoading();
        ft.upload(dataImage, properties.addUrl,
            function(r) {

                self.onUploadFileCompleted(context, r);
                //self.endLoading();
            },
            function(error) {
                if (error.code == 3) {
                    alert(self.getResource("render-ecm-service-not-available"));
                } else {
                    alert(self.getResource("render-ecm-service-general-error"));
                }
                bizagi.log("An error has occurred: Code = " + error.code);
                //self.endLoading();
            }, options);

    },

    saveAudio: function(context, dataAudio) {

        var self = context;
        var properties = self.properties;
        var data = self.buildAddParams();
        var queueID = "q_" + bizagi.util.encodeXpath(properties.xpath);

        data.queueID = queueID;

        var options = new FileUploadOptions();

        options.fileName = dataAudio[0].name;
        //options.mimeType = "audio/wav";
        data.filename = options.fileName;
        options.params = data;

        var ft = new FileTransfer();

        //self.startLoading();
        ft.upload(dataAudio[0].fullPath, properties.addUrl,
            function(r) {
                self.onUploadFileCompleted(context, r);
                //self.endLoading();
            },
            function(error) {
                if (error.code == 3) {
                    alert(self.getResource("render-ecm-service-not-available"));
                } else {
                    alert(self.getResource("render-ecm-service-general-error"));
                }
                bizagi.log("An error has occurred: Code = " + error.code);
                //self.endLoading();
            }, options);

    },

    saveVideo: function(context, dataVideo) {

        var self = context;
        var properties = self.properties;
        var data = self.buildAddParams();
        var queueID = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());

        data.queueID = queueID;

        var options = new FileUploadOptions();

        options.fileName = dataVideo[0].name;
        // options.mimeType = "video/quicktime";
        data.filename = options.fileName;
        options.params = data;

        var ft = new FileTransfer();

        // self.startLoading();
        ft.upload(dataVideo[0].fullPath, properties.addUrl,
            function(r) {
                self.onUploadFileCompleted(context, r);
                //self.endLoading();
            },
            function(error) {
                if (error.code == 3) {
                    alert(self.getResource("render-ecm-service-not-available"));
                } else {
                    alert(self.getResource("render-ecm-service-general-error"));
                }
                bizagi.log("An error has occurred: Code = " + error.code);
                //self.endLoading();
            }, options);

    },

    onFail: function(error) {
        bizagi.log('Error code: ' + error.code);
    },

    onUploadFileCompleted: function(context, response) {
        var self = this;

        try {
            response = JSON.parse(decodeURI(response.response));
            if (response.idFileUpload != "undefined" && response.idFileUpload != null) {
                self.submitOnChange();
            } else {
                throw "not present idFileUpload";
            }
        } catch (e) {
            alert(self.getResource("render-ecm-service-not-available"));
            bizagi.log("Error ECM:");
            bizagi.log(e);
        }
    },


    checkMaxFiles: function() {
        var self = this;
        var properties = self.properties;
        var maxFiles = properties.maxfiles;
        var actualFiles = properties.value.length;

        if (maxFiles != 0 && (actualFiles >= maxFiles)) {
            self.itemAddfile.hide();
            self.removeListener();
        }
    },

    checkExtensions: function() {
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

        if (!enableAudio)
            self.itemsUpload.caudio.hide();
        if (!enableImage) {
            self.itemsUpload.image.hide();
            self.itemsUpload.cimage.hide();
        }
        if (!enableVideo)
            self.itemsUpload.cvideo.hide();

        if (!enableAudio && !enableImage && !enableVideo) {
            self.itemAddfile.hide();
            self.removeListener();
        }

    },

    checkMaxSize: function(objectUri) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();
        if (properties.maxSize == "undefined" || properties.maxSize == null || properties.maxSize == "") {
            defer.resolve(true);
        }

        window.resolveLocalFileSystemURI(objectUri, function(fileEntry) {
            fileEntry.file(function(fileObj) {

                if (fileObj.size >= properties.maxSize) {
                    //'the file is heavier than allowed: ' + properties.maxSize +"Bytes");                    
                    bizagi.showMessageBox(self.getResource("render-upload-alert-maxsize").replace("{0}", properties
                        .maxSize), "Error");
                    defer.resolve(false);
                } else {
                    defer.resolve(true);
                }

            });
        });
        return defer.promise();
    },


    checkMaxSizeVideo: function(objectVideo) {

        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();
        var size = objectVideo[0].size;

        if (properties.maxSize == "undefined" || properties.maxSize == null || properties.maxSize == "") {
            defer.resolve(true);
        }

        if (size >= properties.maxSize) {
            //'the file is heavier than allowed: ' + properties.maxSize +"Bytes");            
            bizagi.showMessageBox(self.getResource("render-upload-alert-maxsize").replace("{0}", properties.maxSize),
                "Error");
            defer.resolve(false);
        } else {
            defer.resolve(true);
        }


        return defer.promise();

    },

    /*
    *   Starts waiting signal for async stuff
    */
    startLoading: function() {
        var self = this;

        // Remove loading class
        if (self.element) {
            self.element.addClass("ui-bizagi-state-loading");

            // Create loading
            var loadingDiv = $('<div class="ui-bizagi-render-loading ui-bizagi-loading"></div>');
            self.element.prepend(loadingDiv);
        }
    }

});