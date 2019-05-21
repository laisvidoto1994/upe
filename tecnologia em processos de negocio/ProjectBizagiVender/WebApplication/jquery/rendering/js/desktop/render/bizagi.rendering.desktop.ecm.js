/*
 *   Name: BizAgi Desktop Render ECM file upload control
 *   Author: Edward Morales
 *   Comments:
 *   -   This script extend some functionalities of file upload control
 */

// Extends itself
bizagi.rendering.ecm.extend("bizagi.rendering.ecm", {
    // Statics
    BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
    BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX,
    BA_PAGE_CACHE: bizagi.render.services.service.BA_PAGE_CACHE
}, {
    renderControl: function (listControl, fileProperties) {
    },
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var dateFormat = this.getResource("dateFormat");
        var timeFormat = this.getResource("timeFormat");
        var mode = self.getMode();

        // Call base
        this._super();

        properties.maxSize = Number(properties.maxSize) || (typeof (BIZAGI_SETTINGS) !== "undefined" && typeof (BIZAGI_SETTINGS.UploadMaxFileSize) !== "undefined" ? Number(BIZAGI_SETTINGS.UploadMaxFileSize) : properties.maxSize = Number(properties.maxSize) || 4091904);
        properties.maxFiles = Number(properties.maxfiles) || 999;
        properties.validExtensions = properties.validExtensions || "";
        if (properties.validExtensions.length > 0 && properties.validExtensions.indexOf(".") < 0) {
            var singleExtensions = properties.validExtensions.split(";");
            for (var i = 0; i < singleExtensions.length; i++) {
                singleExtensions[i] = "*." + singleExtensions[i];
            }
            properties.validExtensions = singleExtensions.join(";");
        }
        properties.addUrl = properties.addUrl || self.dataService.getUploadAddUrl();
        properties.deleteUrl = properties.deleteUrl || undefined;
        properties.allowDelete = bizagi.util.parseBoolean(properties.allowDelete) !== null ? bizagi.util.parseBoolean(properties.allowDelete) : true;
        //   properties.xpath = bizagi.util.encodeXpath(properties.xpath);
        properties.q_xpath = bizagi.util.encodeXpath(self.getUploadXpath());


        // We will hold here the value to display
        properties.displayValue = "";
        properties.showTime = properties.showTime !== undefined ? bizagi.util.parseBoolean(properties.showTime) : false;
        properties.dateFormat = properties.dateFormat || dateFormat;
        properties.timeFormat = properties.timeFormat || timeFormat;
        properties.fullFormat = properties.dateFormat;

        // Fix dateFormat for datepicker
        properties.datePickerFormat = properties.dateFormat.replaceAll("M", "m"); // Fix months
        properties.datePickerFormat = properties.datePickerFormat.replaceAll("yyyy", "yy"); // Fix years
        properties.datePickerFormat = properties.datePickerFormat.replaceAll("dddd", "DD"); // Fix days
        properties.datePickerFormat = properties.datePickerFormat.replaceAll("mmmm", "MM"); // Fix days

        // Set files property
        self.files = properties.value || [];
        self.filesCount = self.files.length;

        // define xpath context if comming from grid column
        properties.xpathContext = this.parent.properties.xpathContext || properties.xpathContext || "";


        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-upload");
        control.addClass("ui-bizagi-render-ecm");
        $(control).closest(".ui-bizagi-control-wrapper").addClass("ui-bizagi-control-wrapper-ecm");

        // First run show render options
        self.properties.showRenderOptions = true;


        // Call service and render control
        if (mode == "execution") {
            self.renderUploadItem();
        } else {
            control.append("<div class='ui-icon ecm-file'></div>");
        }

        // Check number of files and hide or show button to upload
        self.checkMaxFiles();
    },
    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;

        // Call base
        self._super();

        data = self.buildAddParams();
        data.networkSpeed = networkSpeed();

        $(".biz-render-ecm-upload-wrapper", control).bizagiUpload({
            renderReference: this,
            dialogTemplate: self.renderFactory.getTemplate("upload.ecm.dialog"),

            properties: data,
            uploadedFiles: self.filesCount,
            isECM: true,

            onUploadFileCompletedCallback: self.onUploadFileCompleted,
            dialogTitle: self.getResource("render-upload-link-label")
        });
    },

    configureUploadHandlers: function (reference, extraData, control) {

        var self = reference;
        var properties = self.properties;
        var data = self.buildUpgradeParams(control);

        $(control).bizagiUpload({
            renderReference: self,
            dialogTemplate: self.renderFactory.getTemplate("upload.ecm.dialog"),

            properties: data,
            uploadedFiles: self.filesCount,
            isECM: true,
            isUpdatingECM: true,

            onUploadFileCompletedCallback: self.onUpdateUploadFileCompleted,
            dialogTitle: self.getResource("render-upload-link-label")
        });

    },


    onUpdateUploadFileCompleted: function (renderReference, data, control, response) {
        var self = renderReference;

        control.empty();
        self.waiting(control, true);
        self.filesCount++;

        self.renderFileLayout(self, data, control, response);
    },

    renderUploadItem: function (listControl, fileProperties) {
        var self = this;
        var mode = self.getMode();
        var control = self.getControl();
        var template = self.renderFactory.getTemplate("upload-ecm-view-default");
        var properties = self.properties;
        properties.value = (fileProperties) ? [[fileProperties.idFileUpload, fileProperties.fileName]] : self.value;

        // If there's an error it displays a dialog and stops this method
        if (typeof (fileProperties) != "undefined")
            if (typeof (fileProperties.status) != "undefined")
                if (fileProperties.status == "error") {
                    bizagi.showMessageBox(fileProperties.message);
                    return;
                }
        $.when($.tmpl(template, properties,
                {
                    getFileExtension: self.getFileExtension,
                    isImage: self.isImage,
                    allowSendInMail: properties.allowSendInMail
                }
        )).done(function (controlContent) {
            // Append content
            if (listControl && listControl.length > 0) {
                controlContent.insertAfter(listControl.last());
            } else {
                control.append(controlContent);
            }

            //Remove load information tab
            control.find(".uploadifyQueueItem").remove();

            // Load metadata for each file
            if (self.properties.value != undefined) {
                $.each(self.properties.value, function (key, value) {
                    var data = {};

                    data.idFileUpload = value[0] || value.uploadId;
                    data.fileName = value[1] || value.fileName;
                    data.idPageCache = self.properties.idPageCache;
                    data.xpathContext = self.getXpathContext(); //self.properties.xpathContext;

                    data.xPath = self.properties.xpath;
                    data.idAttrib = self.properties.idAttrib;

                    if (mode == "execution") {
                        self.renderFileLayout(self, data, $("." + self.properties.id + "-" + data.idFileUpload, control), fileProperties);
                    }

                });
            }

            // set event sendmail
            if (self.properties.allowSendInMail) {
                self.bindEmailDialog();
                //self.bindExternalPopup();
            }
        });

    },

    /*
    *  Bind dialog for send email
    */
    bindEmailDialog: function () {
        var self = this;
        var control = self.getControl();
        var xpathContext = self.getXpathContext() || "";
        var xpath = self.properties.xpath;

        $(".ui-bizagi-render-ecm-sendmail", control).bizagiSendEmail({
            tmpl: self.renderFactory.getTemplate("dialog-send-email"),
            value: self.value,
            self: self,
            dataService: self.dataService,
            properties: self.properties,
            xpath: xpath,
            xpathContext: xpathContext
        });

    },


    /*
    * Render file layout
    */
    renderFileLayout: function (self, data, fileControl, fileProperties) {
        
        self = self || this;
        var form = self.getFormContainer();
        var metadataTemplate = self.renderFactory.getTemplate("upload-ecm-view-default-metadata");

        $.when(self.dataService.getECMMetadata(data), (fileProperties) ? [fileProperties] : self.dataService.getFileProperties(data)).done(function (metaData, fileProperties) {

            if (typeof (Windows) != undefined && self.properties.displayType === "normal") {
                $("ul", self.getControl()).closest(".ui-bizagi-control").css("width", "100%");
            }

            self.waiting(fileControl, true);

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
            metaData[0].ecm_allowEdit = fileProperties[0].allowEdit;
            metaData[0].ecm_ecmStatus = fileProperties[0].ecmStatus;
            metaData[0].idFileUploads = fileProperties[0].idFileUpload;
            metaData[0].xpath = fileProperties[0].xpath;
            metaData[0].value = bizagi.util.parseBoolean(fileProperties[0].value);

            // Check if file its image
            var container = fileControl.parent().find('.extension:last');
            if (self.isImage(metaData[0].filename)) {
                // Append image
                container.empty();
                container.append('<img>');
                var image = container.find('img');

                // Add class thumbnail
                container.addClass('thumb-image');

                image.attr({
                    src: metaData[0].url,
                    width: 32,
                    height: 32
                });

                image.imageZoom();

                $(".checkuot , .readonly", fileControl.parent()).bind('click', function () {
                    image.click();
                });
            } else {
                fileControl.parent().find('li:first').unbind('click');
                fileControl.parent().find('li:first').bind('click', function (e) {
                    e.stopPropagation();
                    window.open(metaData[0].url);
                });
            }

            // Check if file is visible
            if (fileProperties[0].isVisible) {
                fileControl.empty();
                $.when($.tmpl(metadataTemplate, $.extend(metaData[0], { showMetadata: self.properties.showMetadata, orientation: form.properties.orientation || "ltr" })).appendTo(fileControl)).done(function () {
                    // Bind options
                    $(".ecm-options-slide li", fileControl).hover(function () {
                        $(this).toggleClass("ecm-options-slide-hover");
                    });

                    // Check if file its image
                    if (self.isImage(metaData[0].filename)) {
                        $(".filename a", fileControl).imageZoom();
                    }

                    // Set global events
                    self.setControlEvents(fileControl, data);
                    // Make Instance of file upload
                    if (metaData[0].ecm_allowUpdateContent) {
                        self.configureUploadHandlers(self, data, fileControl, fileProperties);
                    }

                    // Verify security of file
                    switch (fileProperties[0].ecmStatus) {
                        case 1: //LOCAL
                            break;
                        case 2: //PERSISTED
                            fileControl.parent().find(".checkuot").css("visibility", "hidden");
                            fileControl.parent().find(".checkuot").hide();

                            break;
                        case 3: //DELETED
                            break;
                        case 4: //READONLY
                            // Hide control options
                            $(".emc-options", fileControl).hide();

                            // Disable event to edit meta data
                            $(".emc-options", fileControl).hide();
                            fileControl.parent().find(".readonly").css("visibility", "visible");
                            fileControl.parent().find(".readonly").show();
                            break;
                        case 5: //CHECKEDOUT
                            fileControl.parent().find(".checkuot").css("visibility", "visible");
                            fileControl.parent().find(".checkuot").show();
                            break;
                        case 6: //UNDEFINED
                            bizagi.debug("ECM control return undefined status", fileProperties);
                            break;
                        default:
                            fileControl.parent().find(".checkuot").css("visibility", "hidden").hide();
                            fileControl.parent().find(".readonly").css("visibility", "hidden").hide();
                            break;
                    }

                    // Set Events
                    // Check if the control its readonly
                    if (bizagi.util.parseBoolean(self.properties.editable)) {
                        var multiClickControl = true;
                        fileControl.data("pluginAvailable", false);

                        $(".emc-options", fileControl).bind('click', function () {
                            // Block multi click
                            if (multiClickControl) {
                                multiClickControl = false;
                                var toggleOptions = function (fileControl) {
                                    var def = new $.Deferred();
                                    var modalEcm = $(".modal-ecm", fileControl);
                                    var control = self.control;
                                    // Show slide options
                                    if (modalEcm.is(":visible")) {
                                        $(".modal-ecm", control).hide();
                                        $(".ecm-options-slide", modalEcm).hide();
                                        modalEcm.hide();
                                        def.resolve(true);
                                    } else {

                                        var displayOptionsContent = function () {
                                            $(".modal-ecm", control).hide();
                                            $(".ecm-options-slide", modalEcm).show();
                                            modalEcm.show().position({
                                                my: "center top",
                                                at: "center bottom",
                                                of: $(".emc-options", fileControl),
                                                collision: "none"


                                            });
                                        }
                                        //  Hides the control when click somewhere else
                                        $(document.body).click(function (e, modalEcm) {
                                            if (!$(e.target).hasClass("emc-options") && !$(e.target).hasClass("ui-icon-gear")) {
                                                $(".modal-ecm", this).hide();
                                                $(document.body).unbind('click');
                                            }
                                        });

                                        def.resolve(true);

                                        //Check if is the ECM is Async 
                                        if (self.properties.isAsync !== undefined) {

                                            if (!metaData[0].ecm_allowUpdateContent)
                                                $(".ecm-options-upgrade", modalEcm).hide();

                                            //it's a flag to prevent multiple sever queries
                                            if (self.asynCheckEnabled === undefined) {

                                                self.asynCheckEnabled = true;

                                                self.asyncCheckTimeout = setTimeout(function () {
                                                    //Clear the flag, to enable the interaction
                                                    self.asynCheckEnabled = undefined;
                                                    self.asyncCheckTimeout = undefined;
                                                }, 2000);



                                                //Checks if the control already have check if the file is on ECM
                                                if (!data.IsFileOnECM) {

                                                    //Pre hide the elements, so when the services response, show or hide the elements we need
                                                    $(".ecm-options-checkout", modalEcm).hide();
                                                    $(".ecm-options-cancelcheckout", modalEcm).hide();
                                                    $(".ecm-options-upgrade", modalEcm).hide();

                                                    //invokes the server to retrieve the file status
                                                    $.when(self.dataService.isFileOnECM({ "idUpload": data.idFileUpload })).done(function (result) {

                                                        //Checks the service response, and show/hide the desired controls
                                                        if (result.IsFileOnECM) {

                                                            if (metaData[0].ecm_allowUpdateContent)
                                                                $(".ecm-options-upgrade", modalEcm).show();

                                                            if (metaData[0].ecm_allowCheckOut)
                                                                $(".ecm-options-checkout", modalEcm).show();

                                                            if (metaData[0].ecm_allowCancelCheckOut)
                                                                $(".ecm-options-cancelcheckout", modalEcm).show();
                                                        }

                                                        //Stores the server response, so if the response is true, prevents the service recall
                                                        data.IsFileOnECM = result.IsFileOnECM;

                                                        //Show the content
                                                        displayOptionsContent();

                                                    }).fail(function (error) {
                                                        bizagi.log("isFileOnECM error");
                                                    });
                                                } else {
                                                    displayOptionsContent();
                                                }
                                            }
                                        }
                                        else {
                                            displayOptionsContent();
                                        }
                                    }

                                    return def.promise();
                                };

                                $.when(toggleOptions(fileControl)).done(function () {
                                    // $(".filename",fileControl).fadeToggle(400);
                                    multiClickControl = true;
                                });
                            }
                        });
                    } else {
                        $(".emc-options", fileControl).hide();
                        $(self.getControl()).trigger('ecmLoaded', { container: container });
                    }
                });

            }
        });
    },

    /*
    * Bind events for control
    */
    setControlEvents: function (control, params) {
        var self = this;
        var properties = self.properties;
        var globalControl = self.getControl();
        // Bind for delete options
        $(".ecm-options-delete", control).bind('click', function () {
            $(".emc-options", control).click();
            var message = $(".biz-render-ecm-delete-confirmation", globalControl).first().clone();
            message.dialog({
                resizable: false,
                modal: true,
                title: self.getResource("render-ecm-confirm-title"),
                buttons: [
                    {
                        text: self.getResource("render-ecm-confirm-bt-delete"),
                        click: function () {
                            self.dataService.deleteECMFile(params);
                            $(this).dialog("close");
                            control.parent("ul").hide("highlight", {}, 100);

                            //Set files in a temporal array
                            var files = [].concat(self.files);

                            //Remove element form files array
                            for (var i = 0; i < files.length; i++) {

                                if (files[i][0] == params.idFileUpload) files.splice(i, 1);

                            }

                            //Set Value
                            self.setValue(files);

                            // Check maxFiles
                            self.checkMaxFiles();
                        }
                    },
                    {
                        text: self.getResource("render-ecm-confirm-bt-cancel"),
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        });

        // Bind for upgrade options
        $(".ecm-options-upgrade", control).bind('click', function () {
            // Nothing to do
        });

        // Bind for cancelcheckout options
        $(".ecm-options-cancelcheckout", control).bind('click', function () {
            //Close popup
            $(".emc-options", control).click();

            self.waiting(control, false);
            control.find(".filename").empty();
            
            //control
            $.when(self.dataService.cancelCheckOut(params)).done(
                    function (fileProperties) {
                        // self.submitOnChange();
                        self.renderFileLayout(self, params, control, fileProperties);
                    });
        });

        // Bind for checkout options
        $(".ecm-options-checkout", control).bind('click', function () {
            //Close popup
            $(".meta-data-wrapper", control).click();
            self.waiting(control, false);
            control.find(".filename").empty();



            $.when(self.dataService.checkOutFile(params)).done(
                    function (fileProperties) {
                        //     self.submitOnChange();
                        self.renderFileLayout(self, params, control, fileProperties);
                    });
        });

        // Bind for edit metadata
        // Check if the ECM status is READONLY = 4
        if ($(".ecm-metadata-value", control).data("ecmstatus") != 4 && $(".ecm-metadata-value", control).data("allowupdatemetadata")) {
            $(".ecm-metadata-value", control).bind('activeeditmode', function (e) {
                e.stopPropagation();

                // Check read only
                if (!$(this).data("readonly")) {
                    // Check propagation
                    if ($(this).data("edit-mode") == "false" || $(this).data("edit-mode") == "") {
                        $(this).data("edit-mode", "true");

                        switch ($(this).data("metadatatype")) {
                            case "STRING":
                                self.makeStringMetaDataControler($(this), control);
                                break;
                            case "INTEGER":
                                self.makeStringMetaDataControler($(this), control, function (value) {
                                    // validation function
                                    var valueMatch = value.match(/\d+/);
                                    return (valueMatch != null && valueMatch[0] == valueMatch['input']);
                                });
                                break;
                            case "DATETIME":
                                self.makeDatetimeMetaDataControler($(this), control);
                                break;
                            case "DECIMAL":
                                //self.makeDecimalMetaDataControler($(this),control);
                                self.makeStringMetaDataControler($(this), control, function (value, separator) {
                                    // validation function
                                    var numericFormat = self.getResource('numericFormat');

                                    var reg = new RegExp("\\d+(\\" + numericFormat.decimalSymbol + "\\d)*");
                                    var valueMatch = value.match(reg);
                                    try {
                                        var lastChar = value.substr(value.length - 1, 1);
                                    } catch (e) {
                                        return false;
                                    }
                                    return (valueMatch != null && (valueMatch[0] == valueMatch['input'] || lastChar == numericFormat.decimalSymbol));
                                });
                                break;
                            case "BOOL":
                                self.makeBooleanMetaDataControler($(this), control);
                                break;
                            default:
                                self.makeStringMetaDataControler($(this), control);
                                break;
                        }
                    }
                }
            });
        }

        // Set events for done and cancel button
        $(".ecm-metadata-done", control).bind('click', function (e) {
            e.stopPropagation();
            var control = $(this).parent('td');
            var ecmMetaDataFieldEdit = $(".ecm-metadata-field-edit", control);
            var metadatavalue = "";
            var metadatapostvalue = "";

            // Define metadataValue
            switch (control.data('metadatatype')) {
                case 'STRING':
                case 'DECIMAL':
                case 'INTEGER':
                    metadatavalue = $(".ecm-metadata-input", control).val();
                    metadatapostvalue = $(".ecm-metadata-input", control).val();
                    break;
                case 'BOOL':
                    metadatavalue = $(".biz-render-ecm-upload-boolean input:checked", control).val();
                    metadatapostvalue = (bizagi.util.parseBoolean($(".biz-render-ecm-upload-boolean input:checked", control).val())) ? 'True' : 'False';
                    metadatavalue = (metadatavalue == 'False') ? self.getResource('render-boolean-no') : self.getResource('render-boolean-yes');
                    break;
                case 'DATETIME':
                    metadatavalue = $(".ecm-metadata-input", control).val();
                    if (metadatavalue) {
                        var date = bizagi.util.dateFormatter.getDateFromFormat(metadatavalue, self.properties.datePickerFormat);
                        metadatapostvalue = bizagi.util.dateFormatter.formatInvariant(date, true);
                    }
                    break;
            }
            // Update metadata
            control.data('value', metadatapostvalue);

            var spanMetaDataValue = $("<span></span>").addClass("ecm-metadata-text").text(metadatavalue);
            ecmMetaDataFieldEdit.replaceWith(spanMetaDataValue);

            // Show and hide elements
            $(".ecm-metadata-edit", control).css('display', 'block');
            $(".ecm-metadata-done", control).hide();
            $(".ecm-metadata-cancel", control).hide();
            control.data("edit-mode", "false");
        });

        $(".ecm-options-edit", control).bind('click', function (e) {
            e.stopPropagation();
            var modalEcm = control;

            //Close popup
            $(".emc-options", control).click();

            if ($(".ecm-options-edit", modalEcm).data('editmode') == 'true') {
                return;
            } else {
                //active edit mode
                $(".ecm-options-edit", modalEcm).data('editmode', 'true');
            }

            var template = self.renderFactory.getTemplate("upload-ecm-view-default-edit-buttons");
            var metadata = [];

            // Render template
            var editButtons = $.tmpl(template);


            // Enable edit mode for all elements available in the control
            $(".ecm-metadata-value[data-allowUpdateMetadata=true]", control).trigger('activeeditmode');

            // Show save and cancel buttons
            editButtons.insertAfter($('table', control));
            $(".biz-render-ecm-metadata-edit", control).show(500);

            //Set events to save and cancel buttons
            $(".biz-render-ecm-metadata-edit button:first", control).bind('click', function (e) { //Save button
                e.stopPropagation();
                var error = false,
                        modalEcm = control;

                // verify all mandatory fields
                $.each($(".ecm-metadata-value[data-mandatory='true']", control), function (key, field) {
                    if ($(field).find('.ecm-metadata-field-edit').val() == '') {
                        $(field).find('input').attr('placeholder', self.getResource("render-ecm-tooltip-mandatory"));
                        $(field).parent().find('.ecm-metadata-key').addClass("mandatory-error");
                        $(field).parent().effect('highlight', 500);

                        error = true;
                    } else {
                        $(field).parent().find('.ecm-metadata-key').removeClass("mandatory-error");
                    }
                });

                if (error) {
                    return;
                }


                $(".ecm-metadata-done", control).click();
                $(".biz-render-ecm-metadata-edit", control).hide(300, function () {
                    $(".biz-render-ecm-metadata-edit", control).remove();
                });

                $.each($(".ecm-metadata-value", control), function (key, value) {
                    //uses the key as an index for the  ecm-metadata-key and ecm-metadata-value
                    metadata.push({
                        idMetadata: $($(".ecm-metadata-key", control)[key]).data("idmetadata"),
                        value: $(value).find('.ecm-metadata-text').html()
                    });
                });


                params.metaValues = JSON.encode({
                    metadataValues: metadata
                });

                $.when(self.dataService.updateECMMetadata(params)).done(
                        function (fileProperties) {
                            $(".ecm-options-edit", modalEcm).data('editmode', 'false');
                        });

            });

            $(".biz-render-ecm-metadata-edit button:last", control).bind('click', function (e) { //Cancel button
                e.stopPropagation();
                var modalEcm = control;
                $(".ecm-metadata-cancel", control).click();
                $(".biz-render-ecm-metadata-edit button:first", control).unbind('click');
                if ($('.ecm-options-slide', modalEcm).is(':visible')) {
                    $(".emc-options", control).click();
                }
                $(".biz-render-ecm-metadata-edit", control).hide(500, function () {
                    $(".biz-render-ecm-metadata-edit", control).remove();
                });
                $(".ecm-options-edit", modalEcm).data('editmode', 'false');
            });

        });

        $(".ecm-metadata-cancel", control).bind('click', function (e) {
            e.stopPropagation();
            var control = $(this).parent('td');
            var inputMetaDataValue = $(".ecm-metadata-field-edit", control);
            var spanMetaDataValue = $("<span></span>").addClass("ecm-metadata-text").text(inputMetaDataValue.data('original-value'));
            inputMetaDataValue.replaceWith(spanMetaDataValue);

            // Show and hide elements
            $(".ecm-metadata-edit", control).css('display', 'block');
            $(".ecm-metadata-done", control).hide();
            $(".ecm-metadata-cancel", control).hide();
            control.data("edit-mode", "false");
        });
    },
    /*
    * Make input field for edit string metadata
    */
    makeStringMetaDataControler: function (field, control, validationFunction) {
        var spanMetaDataValue = $(".ecm-metadata-text", field);
        var inputMetaDataValue = $("<input></input>").addClass("ecm-metadata-field-edit ecm-metadata-input").val(spanMetaDataValue.text());

        // Persist in data tag the original value
        inputMetaDataValue.data('original-value', spanMetaDataValue.text());
        // Change element
        spanMetaDataValue.replaceWith(inputMetaDataValue);

        inputMetaDataValue.focus();

        // Show and hide elements
        $(".ecm-metadata-edit", field).hide();
        $(".ecm-metadata-done", field).css('visibility', 'visible').show();
        $(".ecm-metadata-cancel", field).css('visibility', 'visible').show();

        // Set event for enter key press
        $(".ecm-metadata-input", field).bind("keyup", function (e) {
            var inputValue = inputMetaDataValue.val();
            if (validationFunction) {
                if (validationFunction(inputValue) || inputValue == "" ) {
                    inputMetaDataValue.data("latestdonevalue", inputValue);
                } else {
                    inputMetaDataValue.val(inputMetaDataValue.data("latestdonevalue") || "");
                }
            }
        });
    },
    /*
    * Make input field for edit string metadata
    */
    makeDatetimeMetaDataControler: function (field, control) {
        var self = this;
        var spanMetaDataValue = $(".ecm-metadata-text", field);
        var inputMetaDataValue = $("<input></input>").addClass("ecm-metadata-field-edit ecm-metadata-input").val(spanMetaDataValue.text());

        // Persist in data tag the original value
        inputMetaDataValue.data('original-value', spanMetaDataValue.text());
        // Change element
        spanMetaDataValue.replaceWith(inputMetaDataValue);
        inputMetaDataValue.datepicker({
            dateFormat: self.properties.datePickerFormat,
            changeYear: true,
            onSelect: function (dateText, inst) {
                inputMetaDataValue.val(dateText + " 00:00 AM");
            }
        });

        // Show and hide elements
        $(".ecm-metadata-edit", field).hide();
        $(".ecm-metadata-done", field).css('visibility', 'visible').show();
        $(".ecm-metadata-cancel", field).css('visibility', 'visible').show();

        // Set event for enter key press
        $(".ecm-metadata-input", field).bind("keypress", function (e) {
            //var inputValue= inputMetaDataValue.val();
            if (e.keyCode == 13) {
                $(".ecm-metadata-done", control).trigger('click');
            }
        });
    },
    /*
    * Make input field for edit string metadata
    */
    makeDecimalMetaDataControler: function (field, control) {
        var self = this;
        var separator = self.getResource('decimalSymbol');
        self.makeStringMetaDataControler($(this), control, function (value, separator) {
            // validation function
            var reg = new RegExp("\\d+(\\" + separator + "\\d)*");
            var valueMatch = value.match(reg);
            return (valueMatch != null && (valueMatch[0] == valueMatch['input'] || valueMatch[1] == undefined));
        });

    },
    /*
    * Make input field for edit string metadata
    */
    makeBooleanMetaDataControler: function (field, control) {
        var self = this;
        var template = self.renderFactory.getTemplate("upload-ecm-view-default-yesno");
        var spanMetaDataValue = $(".ecm-metadata-text", field);
        var checked = (spanMetaDataValue.text() == self.getResource('render-boolean-yes')) ? '1' : '0';
        var rnd = Math.ceil(Math.random() * 100);
        var inputMetaDataValue = $.tmpl(template, {
            id: self.properties.id,
            checked: checked,
            rnd: rnd
        });

        // Persist in data tag the original value
        inputMetaDataValue.data('original-value', spanMetaDataValue.text());
        // Change element
        spanMetaDataValue.replaceWith(inputMetaDataValue);

        // Show and hide elements
        $(".ecm-metadata-edit", field).hide();
        $(".ecm-metadata-done", field).css('visibility', 'visible').show();
        $(".ecm-metadata-cancel", field).css('visibility', 'visible').show();

    },
    /*
    * Check if file its image or not
    */
    isImage: function (file) {
        var self = this;
        var extension = self.getFileExtension(file);
        var image = ["JPG", "JPEG", "GIF", "PNG", "BMP"];

        return ($.inArray(extension.toUpperCase(), image) > -1) ? true : false;
    },
    /*
    *      Template method to implement in each device to customize each render after processed in read-only mode
    */
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();
        var mode = self.getMode();

        if (mode != "execution") {
            control.append("<div class='ui-icon upload-file'></div>");
            return;
        }

        // Set control container to behave as a block
        control.addClass("ui-bizagi-render-display-block");
        control.addClass("ui-bizagi-render-upload");

        // Remove upload wrapper
        $(".biz-render-ecm-upload-wrapper", control).remove();

        // First run show render options
        self.properties.showRenderOptions = false;

        // Call service and render control
        self.renderUploadItem();

        $(".emc-options", control).remove();
    },

    /*
    *   Build add params to send to the server
    */
    buildAddParams: function () {
        var self = this,
                properties = self.properties,
                form = self.getFormContainer(),
                data = {};

        data = {
            url: properties.addUrl,
            xPath: properties.xpath,
            idAttrib: properties.idAttrib,
            xpathContext: properties.xpathContext,
            metaValues: [],
            idPageCache: properties.idPageCache,
            idSession: form.properties.sessionId,
            folder: BIZAGI_PATH_TO_BASE,

            contexttype: properties.contexttype,

            validExtensions: properties.validExtensions,
            maxSize: properties.maxSize
        };

        var scriptData = {};
        $.extend(scriptData, scriptData, data);
        data.scriptData = scriptData;

        return data;
    },
    /*
    *   Build add params to send to the server
    */
    buildUpgradeParams: function (fileControl) {
        var self = this,
                properties = self.properties,
                form = self.getFormContainer(),
                data = {};

        data = {
            url: properties.editUrl,

            xPath: properties.xpath,
            idFileUpload: $(".ecm-options-upgrade > input", fileControl).data("idfileupload"),
            idPageCache: properties.idPageCache,
            idAttrib: properties.idAttrib,
            xpathContext: self.getXpathContext(),
            idSession: form.properties.sessionId,
            folder: BIZAGI_PATH_TO_BASE,

            validExtensions: properties.validExtensions,
            maxSize: properties.maxSize
        };

        var scriptData = {};
        $.extend(scriptData, scriptData, data);
        data.scriptData = scriptData;

        return data;
    },
    /*
    *   Check if the max files condition is true to hide the upload link
    */
    checkMaxFiles: function () {
        var self = this,
                properties = self.properties,
                control = self.getControl();
        var uploadWrapper = $(".biz-render-ecm-upload-wrapper", control);
        var fileInput = $("a", uploadWrapper);

        if (properties.maxFiles > 0 && self.filesCount >= properties.maxFiles) {
            uploadWrapper.hide();
        } else if (self.filesCount < properties.maxFiles) {
            // Show upload link
            uploadWrapper.show();
        }
    },
    /*
    *   Handler to process server response after a file has been uploaded
    */
    onUploadFileCompleted: function (renderReference, result) {

        var self = renderReference;
        var control = self.getControl();

        if (result.type != "error") {

            self.properties.showRenderOptions = false;
            var controlList = $(".biz-render-ecm-view-default", control);
            controlList = (controlList.length > 0) ? controlList : $(".biz-render-ecm-delete-confirmation", control);

            // Increment counter
            self.filesCount = self.filesCount + 1;

            // Check maxFiles
            self.checkMaxFiles();

            //Set files in temporal array
            var files = [].concat(self.files);
            files.push([result.idFileUpload, result.fileName]);

            //Set Value
            self.setValue(files, false);

            // Trigger change
            self.triggerRenderChange();

            self.renderUploadItem(controlList, result);


        } else {
            if (result.cause == "iframeW8") {
                self.getFormContainer().refreshForm();
            } else {
                // Show server error
                bizagi.showMessageBox(result.message);
            }
        }
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

            if (self.filesCount == 0 && bValid) {

                invalidElements.push({
                    xPath: properties.xpath,
                    message: self.getResource('render-required-text').replaceAll('#label#', properties.displayName)
                });
                bValid = false;
            }            
        }

        if (properties.editable) {
            var $arrayEcmControls = $("ul:visible", control).find(".ecm-metadata-value[data-mandatory='true']");
            $.each($arrayEcmControls, function (key, value) {
                if ($('.ecm-metadata-text', value).text() == "") {
                    message.push($(value).data("mandatoryfield"));
                    error = true;
                }
            });
        }

        if (error) {
            var errorMessage = self.getResource('render-required-text').replaceAll('#label#', message.join(', '));
            invalidElements.push({
                xPath: properties.xpath,
                message: errorMessage
            });

            // If it has error, enable editable view.
            // open popup
            $(".ecm-options-edit", control).click();
        }

        return bValid;
    },
    /*
     * Cleans current value
     */
    cleanData: function () {
        var self = this;

        self.setValue(null);
        self.clearDisplayValue();
    },
    /*
     *   Sets the value in the rendered control
     */
    clearDisplayValue: function () {
        var self = this;
        var control = self.getControl();

        var arrayItems = control.find(".biz-render-ecm-view-default");
        var length = arrayItems.length - 1;

        $.each(arrayItems, function (index, value) {
            var item = $(value);
            var file = item.data();

            if (file) {
                $.when(self.deleteUploadItem(item, file.id)).done(function () {
                    // Detach item
                    item.remove();

                    // Trigger change
                    self.triggerRenderChange();
                });
            }
        });

        // Remove items
        arrayItems.hide();

        // Check maxFiles
        self.filesCount = 0;
        self.checkMaxFiles();

    },

    waiting: function (ctrl,visible) {
        ctrl.find(".ecm-file-name").css("visibility", visible ? "visible" : "hidden");
        ctrl.find("table").css("visibility", visible ? "visible" : "hidden");
        ctrl.css("background", visible ? "" : "transparent");
        if(visible)
            ctrl.removeClass("waiting")
        else {
            ctrl.addClass("waiting")
        }
    }
});