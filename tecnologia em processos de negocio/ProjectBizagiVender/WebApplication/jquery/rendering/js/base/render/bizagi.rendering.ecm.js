/*
 *   Name: BizAgi Render ECM upload control
 *   Author: Edward morales
 *   Comments:
 *   -   This script will define basic stuff for ECM Control
 */

bizagi.rendering.render.extend("bizagi.rendering.ecm", {
    BA_ACTION_PARAMETER_PREFIX: bizagi.render.services.service.BA_ACTION_PARAMETER_PREFIX,
    BA_CONTEXT_PARAMETER_PREFIX: bizagi.render.services.service.BA_CONTEXT_PARAMETER_PREFIX,
    BA_PAGE_CACHE: bizagi.render.services.service.BA_PAGE_CACHE
}, {

    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        var self = this;
        var properties = self.properties;

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

        properties.addUrl = self.dataService.serviceLocator.getUrl("render-ecm-upload-url") + "?action=uploadECMFile"; //properties.addUrl || self.dataService.getUploadAddUrl();
        properties.editUrl = self.dataService.serviceLocator.getUrl("render-ecm-upload-url") + "?action=updateECMFileContent";
        properties.deleteUrl = properties.deleteUrl || undefined;
        properties.allowDelete = bizagi.util.parseBoolean(properties.allowDelete) !== null ? bizagi.util.parseBoolean(properties.allowDelete) : true;
        properties.q_xpath = bizagi.util.encodeXpath(properties.xpath);
        properties.showMetadata = properties.showMetadata === undefined || properties.showMetadata === null ? true : bizagi.util.parseBoolean(properties.showMetadata);


        var dateFormat = this.getResource("dateFormat");
        var timeFormat = this.getResource("timeFormat");


        // We will hold here the value to display
        properties.displayValue = "";
        properties.showTime = properties.showTime !== undefined ? bizagi.util.parseBoolean(properties.showTime) : false;
        properties.dateFormat = properties.dateFormat || dateFormat;
        properties.timeFormat = properties.timeFormat || timeFormat;
        properties.fullFormat = properties.dateFormat;

        // Set files property
        self.files = properties.value || [];
        self.filesCount = self.files.length;


        //review 
        properties.xpathContext = this.parent.properties.xpathContext || properties.xpathContext || "";
        // First run show render options
        //self.properties.showRenderOptions = true;
        //  properties.renderReady = $.Deferred();

    },
    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function (listControl, fileProperties) {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("ecm");
        var mode = self.getMode();
        // var control = self.getControl(); //es vacio
        var defer = new $.Deferred();

        properties.value = (fileProperties) ? [[fileProperties.idFileUpload, fileProperties.fileName]] : self.value;
        var html = $.fasttmpl(template, properties,
                {
                    getFileExtension: self.getFileExtension,
                    isImage: self.isImage
                });

        if (self.properties.value != undefined) {


            var lengthValues = self.properties.value.length;

            if (lengthValues == 0) {
                defer.resolve(html);
            }

            $.each(self.properties.value, function (key, value) {
                var data = {};

                data.idFileUpload = value[0];
                data.fileName = value[1];
                data.idPageCache = self.properties.idPageCache;
                data.xpathContext = self.getXpathContext();
                data.xPath = self.properties.xpath;
                data.editable = self.properties.editable;
                data.idAttrib = self.properties.idAttrib;

                var form = self.getFormContainer();
                if (form && form.properties && form.properties.sessionId) {
                    data.sessionId = form.properties.sessionId;
                }

                if (mode == "execution") {
                    $.when(self.renderFileLayout(data, fileProperties)).done(function (item) {
                        lengthValues--;

                        if (bizagi.loader.productBuildToAbout && bizagi.loader.productBuildToAbout.indexOf("10.4") == 0) {
                            item = item.replaceAll("Handlers/MetadataFile", "Handlers/Metadata");
                        }

                        html = self.replaceItemHtml(html, self.properties.id + "-" + data.idFileUpload, item);
                        if (lengthValues == 0) {
                            defer.resolve(html);
                        }
                    });
                }
            });
        } else {
            defer.resolve(html);
        }
        return defer.promise();
    },
    replaceItemHtml: function (html, id, replace) {
        return html.replace("{{" + id + "}}", replace);
        ;
    },
    renderFileLayout: function (data, fileProperties) {
        var self = this;
        var form = self.getFormContainer();
        var metadataTemplate = self.renderFactory.getTemplate("ecm-metadata");
        var control = self.getControl();
        //ecm-metadata
        // var html = "";
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

                    var html = $.fasttmpl(metadataTemplate, metaData[0]);
                    deferred.resolve(html);
                });

        return deferred.promise();
    },
    isImage: function (file) {
        var self = this;
        var extension = self.getFileExtension(file);
        var image = ["JPG", "JPEG", "GIF", "PNG", "BMP"];

        return (image.indexOf(extension.toUpperCase()) > -1) ? true : false;
    },
    replaceFilesHtml: function (html, replace) {
        return html.replace("{{files}}", replace);
    },
    /*
    *   Method to render non editable values
    */
    renderReadOnly: function () {
        return this.renderControl();
    },
    /* 
    *  Method to determine if the render value can be sent to the server or not
    */
    canBeSent: function () {
        // This render cannot be sent because it is full ajax
        return false;
    },
    /* 
    *   Builds the upload item url
    */
    buildItemUrl: function (file) {
        var self = this;
        var p_sessionId = bizagi.cookie("JSESSIONID");


        return self.dataService.getECMFileUrl({
            idFileUpload: file.idFileUpload,
            xPath: file.xpath,
            xpathContext: file.xpathContext,
            idAttrib: file.data.idAttrib,
            idPageCache: self.properties.idPageCache,
            fileName: file.data.fileName.replace(/ /g, "_"),
            p_sessionId: p_sessionId,
            sessionId: file.data.sessionId || ""
        });
    },

    buildAddParams: function () {
        var self = this,
                properties = self.properties,
                data = {};


        data.fileExt = properties.validExtensions;
        data.fileDesc = properties.validExtensions ? self.getResource("render-upload-allowed-extensions") + properties.validExtensions : "",
                data.xPath = properties.xpath;
        data.idAttrib = properties.idAttrib;
        data.xpathContext = properties.xpathContext;
        data.metaValues = [];
        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = properties.idPageCache;

        return data;
    },
    /*
    * Get name of file extension
    */
    getFileExtension: function (fileName) {
        fileName = fileName || "";
        return fileName.split(".").pop();
    },
    /*
    *   Sets the internal value
    */
    setValue: function (value, triggerEvents) {
        var self = this,
                properties = self.properties;

        // Call base
        self._super(value, triggerEvents);

        // Set files property
        self.files = properties.value || [];
        self.filesCount = (self.files.length) ? self.files.length : properties.value;
    },
    /*
    * Gets xpath context
    */
    getXpathContext: function () {
        var self = this;
        return self.properties.xpathContext || "";
    },
    /*
    *   Returns the xpath to be used  
    */
    getUploadXpath: function () {
        var self = this;
        return this.properties.xpath;
    },
    /*
    *   Removes a file from the upload control
    *   Returns a deferred
    */
    deleteUploadItem: function (item, fileId) {
        var self = this,
                properties = self.properties;

        var params = {
            idFileUpload: fileId,
            xPath: properties.xpath,
            idAttrib: properties.idAttrib,
            idPageCache: properties.idPageCache,
            xpathContext: self.getXpathContext()
        };

        return self.dataService.deleteECMFile(params).pipe(function () {

            // Substract counter
            self.filesCount = self.filesCount - 1;

            // Remove from local collection
            self.files = $.grep(self.files, function (fileItem) {
                return fileItem[0] != fileId;
            });
        });
    }
});