/**
*   Name: BizAgi Tablet Render ECM
*   Author: Bizagi Mobile Team
*   Comments: Defines the ECM control for iPad
*/

bizagi.rendering.ecm.extend("bizagi.rendering.ecm", {
    BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
    BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX,
    QUALITY_PICTURE: 80,
    LIMIT: 1,
//limit: The maximum number of audio clips,video clips,etc in the device user can record in a single capture operation.
    EXTENSIONSIMG: ["image/jpeg", "jpeg", "image", "png", "jpg"],
    EXTENSIONSVIDEO: ["video/quicktime", "quicktime", "qt", "mov"],
    EXTENSIONSAUDIO: ["audio/wav", "audio", "wav"]
}, {
    renderControl: function(listControl, fileProperties) {
        var self = this;

        return $.when(self._super(listControl, fileProperties)).done(function(html) {
            return html;
        }).fail(function() {
            return "Error";
        }).always(function(html) {
            self.stopLoading();
            return html;
        });
    },

    postRender: function() {
        var self = this;
        // Call base 
        self._super();

        self.activateUploadNative();
    },

    replaceControlHtml: function(html, replace) {
        html = html || "";
        replace = replace || "";

        var respString = $(html.replace("{{control}}", replace));

        if (typeof replace === "undefined" || replace === "") {
            this.startLoading( respString );
        }

        return respString.get(0).outerHTML;
    },

    /**
     * Override because of the required element
     * @override
     * @param argument
     */
    changeRequired: function(argument) {
        var self = this;
        var labelElement = $("label", self.getLabel());
        var control = self.getControl();
        //Remove the required div from the dom in order to have only one any time
        control.find(".ui-bizagi-render-control-required, .bz-rn-ecm-required").remove();
        var properties = self.properties;

        // Update properties
        properties.required = argument;

        // Changes label
        if (bizagi.util.parseBoolean(argument)) {
            labelElement.text((properties.displayName || "") + " ");
            if (!self.hasValue()) {
                control.prepend("<div class=\"bz-rn-ecm-required\"></div>");
            }else{
                control.prepend("<div class=\"bz-rn-ecm-required\" style=\"display: none\"></div>");
            }
        } else {
            labelElement.text((properties.displayName || "")); //+ ' :'
        }

        // Perform validations again to check if the form is valid after this change
        self.triggerRenderValidate();
    },

    /**
     * Override because of the required element
     * @override
     */
    changeRequiredLabel: function () {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        control.find(".ui-bizagi-render-control-required, .bz-rn-ecm-required").remove();

        if (properties.required) {

            if (!self.checkRequired([])) {
                control.prepend("<div class=\"bz-rn-ecm-required\"></div>");

            } else {
                control.prepend("<div class=\"bz-rn-ecm-required\" style=\"display: none\"></div>");
            }
        }
    },

    startLoading: function( holder ){
        holder = holder || this.getRenderedElement();
        $(".ui-bizagi-render-control", holder).prepend("<div class=\"innerLoader\"></div>").addClass("bz-rn-ecm-control");
    },

    stopLoading: function(){
        $(".innerLoader", this.getControl()).remove();
    },

    startWaiting: function( $button ){
        var $control = $button.closest(".bz-rn-ecm-metadata");
        $button.addClass("loading");
        $control.find("input, a").css("opacity", 0.6);
        $control.find(".ui-bizagi-render-button, button, input").prop("disabled", "disabled");
        $control.find("input").prop("readonly", "readonly");
    },

    stopWaiting: function( $button ){
        var $control = $button.closest(".bz-rn-ecm-metadata");
        $control.find("input, a").css("opacity", 1);
        $control.find(".ui-bizagi-render-button, button, input").prop("disabled", false);
        $control.find("input").prop("readonly", false);
        $control.find(".loading").removeClass("loading");
    },

    postRenderReadOnly: function() {
        var self = this;
        if (!bizagi.util.isCordovaSupported()) {
            self.addEventToOpenSlide();
        }

        self.closeAccordionSection();
    },

    addEventToOpenSlide: function() {
        var self = this;
        var mode = self.getMode();
        var control = self.getControl();
        var container = self.getControl();

        self.itemAddfile = $(".bz-rn-upload-show-menu", container);
        self.itemAddfile.hide();

        $("li", control).click(function() {
            var url = $(this).data("url");
            if (mode == "execution") {

                var slideView = new bizagi.rendering.tablet.slide.view.upload(self.dataService, self.renderFactory, {
                    title: self.properties.displayName || "",
                    container: self.getFormContainer().container,
                    url: url,
                    navigation: self.getParams().navigation
                });

                slideView.render({ url: url });
            }
        });
    },

    activateUploadNative: function() {
        var self = this;
        var properties = self.properties;
        var container = self.getControl();
        var control = self.getControl();

        if (self.getLabel()) {
            self.getLabel().hide();
        }

        self.itemAddfile = $(".bz-rn-ecm-upload", container);
        self.$inputFile = $(".bz-rn-upload-files-web", control);

        $(".bz-rn-ecm-activate-menu", control).bind("click", function() {
            var elementBase = $(this);
            var parents = elementBase.parents(".bz-rn-ecm-metadata");
            var menu = $(".bz-rn-ecm-menu-container", parents);

            if (!$(this).is(".active") && !$(".bz-rn-ecm-metadata-container", parents).is(".active")) {
                self.closeAccordionSection();
                $(this).addClass("active");
                menu.addClass("showMenu");
            } else if (!$(".bz-rn-ecm-metadata-container", parents).is(".active")) {
                $(this).removeClass("active");
                self.closeAccordionSection();
            }

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
                "btnCancel": $(".ecm-btn-cancel", parents),
                "btnSave": $(".ecm-btn-save", parents)
            };

            if (menu.is(":visible")) {
                self.addEventsEcm();
            } else {
                self.removeEventsEcm();
            }

        });

        if (!properties.editable) {
            self.itemAddfile.hide();
            return;
        }

        if (bizagi.util.isCordovaSupported()) {
            if (bizagi.util.isAndroidTabletDevice()) {
                self.uploadEcmLink = $(".bz-rn-ecm-url > span", container);
                self.uploadEcmLink.on("click", function() {
                    window.open(encodeURI(this.getAttribute("href")), "_system", "location=yes");
                });
            } else if (bizagi.util.isNativePluginSupported()) { //ios native behaviour, should open files through a webview
                var filesLinkElements = container.find(".bz-rn-ecm-url > a");

                filesLinkElements.removeAttr("href");
                filesLinkElements.on("click", function() {
                    bizagiapp.openFileWebView({ "itemUrl": $(this).attr("data-url") });
                });
            }

            self.itemsUpload = {
                "file": $(".file", container),
                "image": $(".image", container),
                "cimage": $(".cimage", container),
                "caudio": $(".caudio", container),
                "cvideo": $(".cvideo", container)
            };

            self.itemAddfile.bind("click", function() {
                var modalViewTemplate = kendo.template(self.renderFactory.getTemplate("ecmModalView"),
                    { useWithBlock: false });
                var modalView = $(bizagi.util
                    .trim(modalViewTemplate({
                        "editable": self.properties.editable,
                        "displayName": self.properties.displayName || ""
                    }))).clone();

                modalView.kendoMobileModalView({
                    close: function() {
                        this.destroy();
                        this.element.remove();
                    },
                    modal: false
                });

                self.configureModalViewHandlers(modalView);
                modalView.kendoMobileModalView("open");
            });

            self.checkExtensions();
            self.checkMaxFiles();
        } else {
            if (bizagi.util.media.fileAPISupported()) {
                $(self.itemAddfile).click(function() {
                    self.$inputFile.click();
                });
            } else {
                // Bloquea la acción de carga de archivos
                self.itemAddfile.hide();
            }


            // Just in case
            self.$inputFile.on("click", function(e) { e.stopPropagation(); });

            // Image change (Web only)
            self.$inputFile.on("change", function() {
                var dataFile = self.$inputFile[0].files[0];
                dataFile.fullPath = self.$inputFile[0].value;
                var extensions = [].concat(self.Class.EXTENSIONSIMG, self.Class.EXTENSIONSVIDEO, self.Class.EXTENSIONSAUDIO);

                self.startLoading();
                if (bizagi.util.media.checkMaxSizeFile(dataFile, self.properties) &&
                    bizagi.util.media.checkFileTypes(dataFile, self.properties, extensions)) {

                    $.when(self.uploadFile(dataFile)).done(function(result) {
                        if (typeof result !== "object") {
                            // onUploadFileCompleted 2nd param needs to be a response object
                            result = {
                                response: result
                            };
                        }
                        self.onUploadFileCompleted(self, result);
                    }).fail(function(error) {
                        self.stopLoading();

                        if (error.statusText !== "Unauthorized") {
                            bizagi.showMessageBox(self.getResource("workportal-widget-admin-language-error"));
                        }

                        if (error.code === 3) {
                            bizagi.showMessageBox(self.getResource("render-ecm-service-not-available"), "Error");
                        } else {
                            bizagi.showMessageBox(self.getResource("render-ecm-service-general-error"), "Error");
                        }
                        bizagi.log("An error has occurred: Code = " + error.code);
                    });

                } else {
                    self.stopLoading();
                }
            });
        }
    },

    closeAccordionSection: function(){
        var self = this;
        var control = self.getControl();
        var menuItem = $(".bz-rn-ecm-activate-menu", control);
        var menu = $(".bz-rn-ecm-menu-container", control);
        var metadata = $(".bz-rn-ecm-metadata-container", control);

        menuItem.removeClass("active");
        menu.removeClass("showMenu");

        metadata.removeClass("active");
        metadata.slideUp(300).removeClass("open");
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
            inputContainer.kendoMobileModalView("close");
            self.applyListener($(this).data("role"));
        });

        inputContainer.find(".bz-wp-modalview-close").bind("click", function() {
            inputContainer.kendoMobileModalView("close");
        });
    },

    addEventsEcm: function() {
        var self = this;
        self.removeEventsEcm();

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

        var nTimeoutAccordionSection = null;

        self.elementsEvent.del.bind("click", function () {
            // To avoid to be triggered more than once
            clearTimeout( nTimeoutAccordionSection );
            self.closeAccordionSection();
            self.startLoading();

            $(self.elementsEvent.element.elementReference).closest(".bz-rn-ecm-metadata").css("opacity", 0.5);

            $.when(self.dataService.deleteECMFile(self.elementsEvent.params)).done(function () {
                self.stopLoading();
                self.removeEventsEcm();
                $(self.elementsEvent.element.elementReference).parents(".bz-rn-ecm-metadata").remove();

                //Set files in a temporal array
                var files = [].concat(self.files);

                //Remove element form files array
                for (var i = 0; i < files.length; i++) {
                    if (files[i][0] === self.elementsEvent.params.idFileUpload) {
                        files.splice(i, 1);
                    }
                }

                //Set Value
                self.setValue(files);

                // Check maxFiles
                self.checkMaxFiles();


            });
        });

        self.setMobiscroll();

        self.elementsEvent.edit.click(function () {
            // To avoid to be triggered more than once
            clearTimeout( nTimeoutAccordionSection );
            self.closeAccordionSection();

            if(!self.elementsEvent.panelMetadata.is(".active")) {
                self.elementsEvent.panelMetadata.addClass("active");
                nTimeoutAccordionSection = setTimeout(function(){
                    self.elementsEvent.panelMetadata.stop().slideDown(300).addClass("open");
                }, 200);
            }
        });

        self.elementsEvent.btnSave.click(function () {
            var properties = self.properties;
            var elementsToCheck = $(".bz-rn-ecm-metadata-value", self.elementsEvent.panelMetadata);
            var metadata = [];
            var isInvalid = false;
            var $button = $(this);

            // To avoid to be triggered more than once
            clearTimeout( nTimeoutAccordionSection );
            //self.closeAccordionSection();
            //self.startLoading();
            self.startWaiting( $button );

            for (var metadataelement = 0; metadataelement < elementsToCheck.length; metadataelement++) {
                var tmpElement = elementsToCheck[metadataelement];
                var oldValue = $(tmpElement).data("value");
                var type = $(tmpElement).data("metadatatype");
                var required = $(tmpElement).data("required");
                var readonly = $(tmpElement).data("readonly");
                var description = $(tmpElement).data("description");
                var idmetadata = $(tmpElement).data("idmetadata");
                var actualValue = null;

                if (readonly) {
                    self.stopLoading();
                    self.stopWaiting($button);
                    return true;
                }

                if (type == "STRING" || type == "DECIMAL") {
                    actualValue = $("input", tmpElement).val();
                } else if (type == "BOOL") {
                    actualValue = $("input[name=ecm-radio]:checked", tmpElement).val();
                } else if (type == "DATETIME") {
					var format = ( self.properties.fullFormat ? self.properties.fullFormat : ( self.getResource("fullFormat") != "fullFormat" ? self.getResource("fullFormat") : "yyyy-MM-dd HH:mm:ss" ) );
					actualValue = bizagi.util.dateFormatter.formatDate( bizagi.util.dateFormatter.getDateFromISO( $("input", tmpElement).attr("value"), false ), format );
                }

                if (required && ( actualValue === "" || actualValue === null)) {
                    bizagi.showMessageBox(description + ": " + self.getResource("render-ecm-tooltip-mandatory"), "Error");
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
                var params = self.buildAddParams();
                params.fileName = self.elementsEvent.element.filename;
                params.idFileUpload = self.elementsEvent.element.id;
                params.idPageCache = properties.idPageCache;
                params.metaValues = JSON.encode({
                    metadataValues: metadata
                });

                $.when(self.dataService.updateECMMetadata(params)).done(function () {
                    self.stopLoading();
                    self.stopWaiting($button);
                });
            }
            else {
                self.stopLoading();
                self.stopWaiting($button);
            }
        });

        self.elementsEvent.btnCancel.click(function () {
            self.closeAccordionSection();
            self.removeEventsEcm();
        });
    },

    /**
     * Creates the date picker for the DOM.bz-ecm-metadata-date elements
     */
    setMobiscroll: function(){
        var self = this;
        var metadataElements = self.elementsEvent.panelMetadata.find(".bz-ecm-metadata-date");
        metadataElements.each(function(index, input){
            var $input = $(input);
            var value = $input.attr("value");
            var now = new Date();
            var valueDate = new Date( value ) || now;
            var minDate = ( now.getTime() < valueDate.getTime() ? now : valueDate );
            minDate.setFullYear( minDate.getFullYear() - 2 );
            $input.mobiscroll().calendar({
                mode: "mixed", // Specify scroller mode like: mode: "mixed" or omit setting to use default
                display: "bottom", // Specify display mode like: display: "bottom" or omit setting to use default
                controls: ["calendar"],
                minDate: minDate,
                defaultValue: valueDate,
                lang: bizagi.util.languages[BIZAGI_LANGUAGE] || "en",
                onSelect: function(valueText) {
                    // It seems like the plugin doesn't sets the value
                    $input.attr("value", valueText );
                }
            });
        });
    },

    removeEventsEcm: function () {
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

    applyListener: function(option) {
        var self = this;

        switch (option) {
        case "image":
            navigator.camera.getPicture(function(dataImage) {

                $.when(bizagi.util.media.checkMaxSize(dataImage, self.properties)).done(function() {
                    self.saveImage(self, dataImage);
                });
                self.itemAddfile.click();
            }, self.onFail, {
                quality: self.Class.QUALITY_PICTURE,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            });
            break;

        case "cimage":
            navigator.camera.getPicture(function(dataImage) {
                    $.when(bizagi.util.media.checkMaxSize(dataImage, self.properties)).done(function() {
                        self.saveImage(self, dataImage);
                    });
                    self.itemAddfile.click();
                },
                self.onFail, { quality: self.Class.QUALITY_PICTURE });
            break;

        case "caudio":
            navigator.device.capture.captureAudio(function(dataImage) {
                $.when(bizagi.util.media.checkMaxSize(dataImage, self.properties)).done(function() {
                    self.saveAudio(self, dataImage);
                }).always(function() {
                    bizagiLoader().stop({});
                });
                self.itemAddfile.click();
            }, self.onFail, { limit: self.Class.LIMIT });
            break;

        case "cvideo":
            navigator.device.capture.captureVideo(function(dataImage) {
                $.when(bizagi.util.media.checkMaxSizeVideo(dataImage, self.properties)).done(function() {
                    self.saveVideo(self, dataImage);
                }).always(function() {
                    bizagiLoader().stop({});
                });
                self.itemAddfile.click();
            }, self.onFail, { limit: self.Class.LIMIT });
            break;

        case "file":
            bizagi.showMessageBox("In development", "Error");
            break;

        default:
            break;
        }
    },

    renderUploadItem: function(file) {
        return this._super(file);
    },

    /**
     * Send file using HTTP
     * @param dataFile
     * @return {jQuery} $.Deferred()
     */
    uploadFile: function(dataFile) {
        var self = this;
        var defer = new $.Deferred();

        if (bizagi.util.media.checkMaxSizeFile(dataFile, self.properties) &&
            bizagi.util.media.checkFileTypes(dataFile, self.properties, [].concat( self.Class.EXTENSIONSIMG, self.Class.EXTENSIONSVIDEO, self.Class.EXTENSIONSAUDIO ) )) {

            // Get form data for POSTing
            var formData = new FormData();
            var form = self.getFormContainer();
            var data = self.buildAddParams();

            var keys = Object.keys( data );
            keys.map(function( key ){
                formData.append(key, data[key]);
            });

            formData.append("Filedata", dataFile);
            // It seems like some OS uses \ instead of / so ...
            formData.append("Filename", dataFile.name.substr(dataFile.name.replace(/([\\\/]+)/g, "/").lastIndexOf("/") + 1) );

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

        return defer.promise();
    },

    saveImage: function(context, dataImage) {
        var self = context;
        var params = {
            dataFile: dataImage,
            data: self.buildAddParams(),
            options: new FileUploadOptions(),
            properties: self.properties,
            extensions: self.Class.EXTENSIONSIMG.concat(self.Class.EXTENSIONSAUDIO, self.Class.EXTENSIONSVIDEO)
        };

        // Fix android 4.4 getting images from recent folder
        dataImage = bizagi.util.media.getImagePath(dataImage);

        // Does not has the extension allowed? (self.Class.EXTENSIONSIMG) ... then add jpeg
        if ( !( new RegExp("\\.(" + params.extensions.join("|").replace(/([\/]+)/g,"\\/") + ")$", "i")).test( dataImage ) ) {
            dataImage += ".jpeg";
        }

        params.data.queueID = "q_" + bizagi.util.encodeXpath(self.getUploadXpath());
        params.options.fileKey = "file";
        params.options.fileName = dataImage.substr(dataImage.lastIndexOf("/") + 1);
        params.options.mimeType = "image/jpeg";
        params.options.params = params.data;
        params.data.filename = params.options.fileName;

        // Fix android 4.4 getting images from recent folder
        params.dataFile = bizagi.util.media.getImagePath(params.dataFile);
        bizagiLoader().start();

        $.when(bizagi.util.media.uploadFile(params)).done(function(r) {
            self.onUploadFileCompleted(context, r);
        }).fail(function(error) {
            if (error.code === 3) {
                bizagi.showMessageBox(self.getResource("render-ecm-service-not-available"), "Error");
            } else {
                bizagi.showMessageBox(self.getResource("render-ecm-service-general-error"), "Error");
            }

            bizagi.log("An error has occurred: Code = " + error.code);
        }).always(function() {
            bizagiLoader().stop({});
        });
    },

    saveAudio: function(context, dataAudio) {
        var self = context;
        var params = {
            data: self.buildAddParams(),
            options: new FileUploadOptions(),
            properties: self.properties
        };

        params.data.queueID = "q_" + bizagi.util.encodeXpath(params.properties.xpath);
        params.options.fileName = dataAudio[0].name;
        params.data.filename = params.options.fileName;
        params.options.params = params.data;
        params.dataFile = dataAudio[0].fullPath;

        bizagiLoader().start();
        $.when(bizagi.util.media.uploadFile(params)).done(function(r) {
            self.onUploadFileCompleted(context, r);
        }).fail(function(error) {
            if (error.code === 3) {
                bizagi.showMessageBox(self.getResource("render-ecm-service-not-available"), "Error");
            } else {
                bizagi.showMessageBox(self.getResource("render-ecm-service-general-error"), "Error");
            }
            bizagi.log("An error has occurred: Code = " + error.code);
        }).always(function() {
            bizagiLoader().stop({});
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
        params.options.params = params.data;
        params.data.filename = params.options.fileName;
        params.dataFile = dataVideo[0].fullPath;

        bizagiLoader().start();
        $.when(bizagi.util.media.uploadFile(params)).done(function(r) {
            self.onUploadFileCompleted(context, r);
        }).fail(function(error) {
            if (error.code === 3) {
                bizagi.showMessageBox(self.getResource("render-ecm-service-not-available"), "Error");
            } else {
                bizagi.showMessageBox(self.getResource("render-ecm-service-general-error"), "Error");
            }

            bizagi.log("An error has occurred: Code = " + error.code);
        }).always(function() {
            bizagiLoader().stop({});
        });
    },

    onFail: function(error) {
        bizagi.log("Error code: " + error.code);
    },

    onUploadFileCompleted: function(context, response) {
        var self = this;

        try {
            response = JSON.parse(decodeURI(response.response));
            if ( response.idFileUpload ) {
                self.submitOnChange();
            } else {
                throw "not present idFileUpload";
            }
        } catch (e) {
            bizagi.showMessageBox(self.getResource("render-ecm-service-not-available"), "Error");
            bizagi.log("Error ECM:");
            bizagi.log(e);
        }
    },

    checkMaxFiles: function() {
        var self = this;
        var properties = self.properties;
        var maxFiles = properties.maxfiles;
        var actualFiles = properties.value.length;

        if (maxFiles !== 0 && (actualFiles >= maxFiles)) {
            self.itemAddfile.hide();
            self.removeListener();
        }
    },

    checkExtensions: function() {
        var self = this;
        var properties = self.properties;
        var validExtensions = properties.validExtensions;

        if ( !validExtensions ) {
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
            //var audio = self.Class.EXTENSIONSAUDIO.toString().indexOf(validExtensions[i]);
            //var video = self.Class.EXTENSIONSVIDEO.toString().indexOf(validExtensions[i]);

            if (image >= 0) {
                enableImage = true;
            }
            // Audio & Video options will be disabled for a while
            /*
            if (audio >= 0) {
                enableAudio = true;
            }
            if (video >= 0) {
                enableVideo = true;
            }
            */
        }

        if (!enableImage) {
            self.itemsUpload.image.hide();
            self.itemsUpload.cimage.hide();

            self.itemsUpload.image.parent().addClass("bz-rn-upload-hidden-item");
            self.itemsUpload.cimage.parent().addClass("bz-rn-upload-hidden-item");
        }

        if (!enableAudio) {
            self.itemsUpload.caudio.hide();
            self.itemsUpload.caudio.parent().addClass("bz-rn-upload-hidden-item");
        }

        if (!enableVideo) {
            self.itemsUpload.cvideo.hide();
            self.itemsUpload.cvideo.parent().addClass("bz-rn-upload-hidden-item");
        }


        if (!enableAudio && !enableImage && !enableVideo) {
            self.itemAddfile.hide();
            self.removeListener();
        }
    },

    renderFileLayout: function (data, fileProperties) {
        var self = this;
        var form = self.getFormContainer();
        var metadataTemplate = self.renderFactory.getTemplate("ecm-metadata");
        var deferred = $.Deferred();

        $.when(self.dataService.getECMMetadata(data),
            (fileProperties) ? [fileProperties] : self.dataService.getFileProperties(data)
        ).done(function (metaData, fileProperties) {

            fileProperties[0].data = data;

            // Make xpath context
            fileProperties[0].xpathContext = fileProperties[0].xpathContext || form.properties.xpathContext || "";
            fileProperties[0].xpath = self.properties.xpath;

            metaData[0].filename = data.fileName;
            metaData[0].url = self.buildItemUrl(fileProperties[0]);

            // Define File Properties
            metaData[0].ecm_ecmStatus = fileProperties[0].ecmStatus;
            metaData[0].ecm_isVisible = fileProperties[0].isVisible;
            metaData[0].ecm_allowUpdateMetadata = fileProperties[0].allowUpdateMetadata;
            metaData[0].ecm_allowDelete = fileProperties[0].allowDelete;
            metaData[0].ecm_allowUpdateContent = fileProperties[0].allowUpdateContent;
            metaData[0].ecm_allowView = fileProperties[0].allowView;
            metaData[0].ecm_allowCheckOut = fileProperties[0].allowCheckOut;
            metaData[0].ecm_allowCancelCheckOut = fileProperties[0].allowCancelCheckOut;
            metaData[0].ecm_allowEdit = data.editable && fileProperties[0].allowEdit;
            metaData[0].ecm_ecmStatus = fileProperties[0].ecmStatus;
            metaData[0].idFileUploads = fileProperties[0].idFileUpload;
            metaData[0].xpath = fileProperties[0].xpath;
            metaData[0].value = bizagi.util.parseBoolean(fileProperties[0].value);
            metaData[0].deviceType = bizagi.detectDevice();

            if( metaData[0].metadata && metaData[0].metadata.length ) {
                metaData[0].metadata.map(function shapeMetadataValues( meta ){
                    if( meta.metadataType === "DATETIME" ) {
                        // Format the actual date to ISO, so mobiscroll can useit
                        // Before save the value it has to go back to the original format (cause service will accept any format)
                        meta.dateFormat = ( self.getResource("fullFormat") !== "fullFormat" ? self.getResource("fullFormat") : ( self.properties.fullFormat ? self.properties.fullFormat : "yyyy-MM-dd HH:mm:ss" ) );
                        meta.value = bizagi.util.dateFormatter.formatDate( ( meta.value ? bizagi.util.dateFormatter.getDateFromFormat( meta.value, meta.dateFormat) : new Date() ), "yyyy-MM-dd" );
                    }
                });
            }

            var html = $.fasttmpl(metadataTemplate, metaData[0]);
            deferred.resolve(html);
        });

        return deferred.promise();
    },
    /*Check if all meta data fields that's right */
    isValid: function (invalidElements) {
        var self = this,
            control = self.getControl(),
            message = [],
            error = false,
            properties = self.properties;


        var bValid = true;

        if (properties.required) {
            var newRow = self.grid && self.grid.isFromCreatedRow.apply(self);
            // Call base
            bValid = newRow ? true : this._super(invalidElements);

            if (self.filesCount === 0 && bValid) {

                invalidElements.push({
                    xPath: properties.xpath,
                    message: self.getResource("render-required-text").replaceAll("#label#", properties.displayName)
                });
                bValid = false;
            }
        }

        if (properties.editable) {
            var $arrayEcmControls = $(".bz-rn-ecm-container:visible", control).find(".bz-rn-ecm-metadata-value[data-required='true']");
            $.each($arrayEcmControls, function (key, value) {
                if ($("input", value).val() === "") {
                    message.push($(value).data("description"));
                    error = true;
                }
            });
        }

        if (error) {
            var errorMessage = self.getResource("render-required-text").replaceAll("#label#", message.join(", "));
            invalidElements.push({
                xPath: properties.xpath,
                message: errorMessage
            });

            // If it has error, enable editable view.
            // open popup

        }

        return bValid;
    },

    /**
     * Cleans current value
     */
    cleanData: function () {
        var self = this;

        self.setValue(null);
        self.clearDisplayValue();
    },

    /**
     *   Sets the value in the rendered control
     */
    clearDisplayValue: function () {
        var self = this;
        var control = self.getControl();

        var arrayItems = control.find(".bz-rn-ecm-file-container");
        var length = arrayItems.length - 1;

        $.each(arrayItems, function (index, value) {
            var item = $(value);
            var file = item.data();

            if (file) {
                $.when(self.deleteUploadItem(item, file.idfileupload)).done(function () {
                    // Detach item
                    item.remove();
                });
            }
        });

        // Check maxFiles
        self.filesCount = 0;
    }
});