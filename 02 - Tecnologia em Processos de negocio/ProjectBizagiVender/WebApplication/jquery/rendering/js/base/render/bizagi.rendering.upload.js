/*
 *   Name: BizAgi Render Upload Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define basic stuff for uploads
 */

bizagi.rendering.render.extend("bizagi.rendering.upload", {
    // Statics
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

        var form = self.getFormContainer();

        // Fill default properties
        var properties = this.properties;

        properties.maxSize = Number(properties.maxSize) || (typeof (BIZAGI_SETTINGS) !== "undefined" && typeof (BIZAGI_SETTINGS.UploadMaxFileSize) !== "undefined" ? Number(BIZAGI_SETTINGS.UploadMaxFileSize) : properties.maxSize = Number(properties.maxSize) || 4091904);
        properties.maxfiles = Number(properties.maxfiles) || 999;
        properties.validExtensions = properties.validExtensions || "";

        if (properties.validExtensions.length > 0 && properties.validExtensions.indexOf(".") < 0) {
            var singleExtensions = properties.validExtensions.replace(/\ /gi, '').split(";");
            var defExtensions = [];
            for (var i = 0; i < singleExtensions.length; i++) {
                if (singleExtensions[i].length > 0)
                    defExtensions.push("*." + singleExtensions[i]);
                else {
                    //Removes the empty element
                    var index = singleExtensions.indexOf(singleExtensions[i]);
                    singleExtensions.splice(i, 1);
                }
            }
            properties.validExtensions = defExtensions.join(";");
        }
        properties.addUrl = properties.addUrl || self.dataService.getUploadAddUrl();
        properties.deleteUrl = properties.deleteUrl || undefined;
        properties.editable = bizagi.util.parseBoolean(properties.editable) || false;
        properties.allowDelete = (bizagi.util.parseBoolean(properties.allowDelete) !== null && properties.editable) ? bizagi.util.parseBoolean(properties.allowDelete) : false;

        properties.contexttype = (form.params && form.params.data && form.params.data.contextType) ? form.params.data.contextType : "";
        properties.allowSendInMail = properties.allowSendInMail || false;

        // Set files property
        self.files = properties.value || [];
        self.filesCount = self.files.length;
    },
    /*
     *   Template method to implement in each children to customize each control
     */
    renderControl: function () {
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
            var file = { id: self.files[i][0], fileName: self.files[i][1] };
            var item = self.renderUploadItem(file);
            items += item;
        }
        html = self.replaceFilesHtml(html, items);
        return html;
    },
    /*
     *   Method to render non editable values
     */
    renderReadOnly: function () {
        return this.renderControl();
    },
    /* 
     *   Renders a single upload item
     */
    renderUploadItem: function (file) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var targetdefinition = bizagi.util.isIE() ? '_self':'_blank';

        var template = self.renderFactory.getTemplate("uploadItem");
        var url = self.buildItemUrl(file);

        // Don't render urls when not running in execution mode
        if (mode != "execution")
            url = "javascript:void(0);";
     
        var html = $.fasttmpl(template, {
            url: url,
            allowDelete: properties.allowDelete,
            targetdefinition: targetdefinition,
            filename: file.fileName,
            id: file.id,
            mode: mode,
            editable: properties.editable
        });

        return html;
    },
    /* 
     *   Builds the upload item url
     */
    buildItemUrl: function (file) {
        var self = this,
            properties = self.properties;

        var form = self.getFormContainer();

        return self.dataService.getUploadFileUrl({
            idRender: properties.id,
            xpath: self.getUploadXpath(),
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            fileId: file.id,
            sessionId: form.properties.sessionId,
            contexttype: properties.contexttype
        });
    },
    /*
     *   Replaces a {{files}} tag in the container for the specified "replace" element
     */
    replaceFilesHtml: function (html, replace) {
        return html.replace("{{files}}", replace);
    },
    /*
     *   Removes a file from the upload control
     *   Returns a deferred
     */
    deleteUploadItem: function (item, fileId) {
        var self = this,
            properties = self.properties;

        var xpath = self.getUploadXpath() + (bizagi.util.isNumeric(fileId) ? "[id=" + fileId + "]" : "[id='" + fileId + "']");

        return self.dataService.deleteUploadFile({
            url: properties.deleteUrl,
            idRender: properties.id,
            xpath: xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            contexttype: properties.contexttype
        }).pipe(function () {

            // Substract counter
            self.filesCount = self.filesCount - 1;

            // Remove from local collection
            self.files = $.grep(self.files, function (fileItem) {
                return fileItem[0] != fileId;
            });
        });
    },
    /* 
     *  Method to determine if the render value can be sent to the server or not
     */
    canBeSent: function () {
        // This render cannot be sent because it is full ajax
        return false;
    },
    /*
     *   Sets the internal value
     */
    setValue: function (value, triggerEvents) {
        var self = this;

        // Set files property
        self.files = value || []; // Dont remove this line
        self.filesCount = self.files.length;

        // Call base
        self._super(value, triggerEvents);
    },
    /*
     *   Returns the internal value
     */
    getValue: function () {
        return this.files;
    },
    /* 
     * Public method to determine if a value is valid or not
     */
    isValid: function (invalidElements) {
        var self = this,
            properties = self.properties,
            message,
            bValid = true;

        if (properties.required && properties.editable) {
            var newRow = self.grid && self.grid.isFromCreatedRow.apply(self);
            if (self.filesCount <= 0 && !newRow) {
                var inlineEdit = self.grid ? self.grid.properties.inlineEdit : true;
                if (inlineEdit) {
                    message = self.getResource("render-required-upload").replaceAll("#label#", properties.displayName);
                    invalidElements.push({ xpath: properties.xpath, message: message });
                    bValid = false;
                }
            }
        }

        return bValid;
    },

    /*
     *   Build add params to send to the server
     */
    buildAddParams: function () {
        var self = this,
            properties = self.properties,
            form = self.getFormContainer();

        var data = {};
        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpath"] = self.getUploadXpath();
        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idRender"] = properties.id;
        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "xpathContext"] = properties.xpathContext;
        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + self.Class.BA_PAGE_CACHE] = properties.idPageCache;
        data[self.Class.BA_ACTION_PARAMETER_PREFIX + "sessionId"] = form.properties.sessionId;
        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = properties.contexttype;
        try {
            (BIZAGI_SESSION_NAME != undefined) ? data[BIZAGI_SESSION_NAME] = form.properties.sessionId : data["JSESSIONID"] = form.properties.sessionId;
        } catch (e) {
            data["JSESSIONID"] = form.properties.sessionId;
        }

        return data;
    },
    /*
     *   Returns the xpath to be used
     */
    getUploadXpath: function () {
        return this.properties.xpath;
    },

    checkRequired: function (invalidElements) {
        var self = this,
            properties = self.properties;

        if (bizagi.util.parseBoolean(properties.required)) {
            if(self.grid && self.grid.properties.inlineAdd == true){
                if (!self.hasValue() && !(self.getControl().parents("tr").data("new-row"))) {
                    self.setRenderRequired(invalidElements,properties);
                    return false;
                }
            }else{
                if (!self.hasValue()) {
                    self.setRenderRequired(invalidElements,properties);
                    return false;
                }
            }
        }
        return true;
    },

    setRenderRequired:function(invalidElements,properties){
        var self = this;
        message = self.getResource("render-required-text").replaceAll("#label#", properties.displayName);
        invalidElements.push({
            xpath: properties.xpath,
            message: message
        });
    }
});