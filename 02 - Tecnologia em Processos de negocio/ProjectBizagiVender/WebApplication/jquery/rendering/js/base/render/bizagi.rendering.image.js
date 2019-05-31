/*
*   Name: BizAgi Render Image Class
*   Author: Edward J Morales
*   Comments:
*   -   This script will define basic stuff for image control
*/

bizagi.rendering.render.extend("bizagi.rendering.image", {
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

        // Fill default properties
        var properties = this.properties;

        properties.editable = bizagi.util.parseBoolean(properties.editable) ? true : false;
        properties.maxSize = Number(properties.maxSize) || (typeof (BIZAGI_SETTINGS) !== "undefined"
            && typeof (BIZAGI_SETTINGS.UploadMaxFileSize) !== "undefined"
            ? Number(BIZAGI_SETTINGS.UploadMaxFileSize) : properties.maxSize = Number(properties.maxSize) || 4091904);
        properties.validExtensions = properties.validExtensions || "";
        if (properties.validExtensions.length > 0 && properties.validExtensions.indexOf(".") < 0) {
            var singleExtensions = properties.validExtensions.replace(/\ /gi, '').split(";");
            for (var i = 0; i < singleExtensions.length; i++) {
                if (singleExtensions[i].length != 0)
                    singleExtensions[i] = "*." + singleExtensions[i].replaceAll(" ", "");
                else {
                    //Removes the empty element
                    var index = singleExtensions.indexOf(singleExtensions[i]);
                    singleExtensions.splice(i, 1);
                }

            }
            properties.validExtensions = singleExtensions.join(";");
        }
        properties.addUrl = properties.addUrl || self.dataService.getUploadAddFileUrl(properties.isUserPreference);
        properties.allowDelete = bizagi.util.parseBoolean(properties.allowDelete) !== null
            ? bizagi.util.parseBoolean(properties.allowDelete) : false;

        properties.isAutoWidth = false; 
        properties.isAutoHeight = false;

        if (properties.width == -1) { 
            properties.width = "99%";
            properties.isAutoWidth = true;
        } else {
            properties.width = properties.width + "px";
        }
        if (properties.height == -1) {
            properties.height = "auto";
            properties.isAutoHeight = true;
        } else {
            properties.height = properties.height + "px";
        }
    },
    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        var def = new $.Deferred(); //design

        var template = self.renderFactory.getTemplate("image");

        // Check is offline form        
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        $.when(self.buildItemUrl()).done(function (dataUrl) {
            if (!self.isDisposed()) {
                self.properties.url = (dataUrl !== "") ? dataUrl : "";
                self.properties.value = self.value = (self.properties.url.length > 0) ? [self.properties.url] : null;
                self.setValue(self.properties.value);

                if (isOfflineForm && dataUrl.indexOf("Invalid case id") !== -1) {
                    self.properties.url = "";
                }

                var html = $.fasttmpl(template, { url: self.properties.url });
                def.resolve(html);
            }
        });

        return def.promise();
    },
    /*
    *   Method to render non editable values
    */
    renderReadOnly: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("image-readonly");
        var html = $.fasttmpl(template);
        return html;
    },
    /*
    * This method return the name of template of items, please 
    * make a override in each device
    */
    getTemplateItem: function () {
        var self = this;
        return self.renderFactory.getTemplate("image-item");
    },
    /* 
    *   Renders a single upload item 
    */
    renderUploadItem: function (file) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var url = "";
        var def = new $.Deferred();
        var template = self.getTemplateItem();

        $.when(self.buildItemUrl()).done(function (dataUrl) {
            url = dataUrl || url;
            var html = $.fasttmpl(template, {
                url: url,
                allowDelete: properties.allowDelete,
                mode: mode
            });

            self.properties.value = (url.length > 0) ? [url] : null;

            def.resolve(html);

        });
        return def.promise();
    },
    /* 
    *   Builds the upload item url
    */
    buildItemUrl: function (params) {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var def = new $.Deferred();
        var url = "";

        // Check is offline form        
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        if (mode !== "execution") {
            url = "javascript:void(0);";
            def.resolve(url);
        } else {
            var parameters = {
                url: properties.dataUrl,
                xpath: properties.xpath,
                idRender: properties.id,
                xpathContext: properties.xpathContext,
                idPageCache: properties.idPageCache,
                property: params && params.property ? params.property : "fileContent",
                dataType: "text"
            };

            (properties.contexttype) ? parameters.contexttype = properties.contexttype : "";

            if (properties.isUserPreference) {
                self.currentUser = bizagi.currentUser.idUser;
                parameters.xpathContext = "@Context.Users[id == " + self.currentUser + "]";
                parameters.contexttype = "entity";
                parameters.surrogatekey = self.currentUser;

            }

            if (isOfflineForm) {
                if (typeof (properties.value) !== "undefined"
                    && !bizagi.util.isEmpty(properties.value)) {
                    var data = properties.value;
                    url = "data:image/png;base64," + data.value;
                } else {
                    url = "";
                }

                def.resolve(url);
            } else {
                self.dataService.multiaction().getPropertyData(parameters, "text").done(function (data) {
                    if (data.charAt(0) === "\"") {
                        data = data.slice(1, -1);
                    }

                    if (data != "") {
                        url = "data:image/png;base64," + data;
                    }

                    def.resolve(url);
                });
            }
        }
        return def.promise();
    },

    /*
    * Builds the upload item url in real size 
    */
    buildFullItemUrl: function () {
        var self = this;
        var def = new $.Deferred();

        $.when(self.buildItemUrl({ "property": "fileFullContent" })).done(function (dataUrl) {
            def.resolve(dataUrl);
        });

        return def.promise();
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
        var self = this,
            properties = self.properties;

        // Call base
        self._super(value, triggerEvents);
    },
    /*
    *   Returns the internal value
    */
    getValue: function () {
        return this.properties.value || [];
    },
    /*
    * Check if control is valid or not
    */
    isValid: function (invalidElements) {
        var self = this,
            properties = self.properties,
            message;

        // Don't check non-editable renders
        if (bizagi.util.parseBoolean(properties.visible) == false) {
            return true;
        }
        // Don't check non- editable renders
        if (bizagi.util.parseBoolean(properties.editable) == false) {
            return true;
        }

        // Clear error message
        self.setValidationMessage("");

        // Check required
        if (properties.required) {
            var newRow = self.grid && self.grid.isFromCreatedRow.apply(self);
            if (!newRow) {
                var value = self.getValue();

                if (value.length === 0) {
                    var message = self.getResource("render-required-text").replaceAll("#label#", self.properties.displayName);
                    invalidElements.push({ xpath: self.properties.xpath, message: message });
                    return false;
                }
            }
        }

        return true;
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
        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "action"] = 'savefile';
        (properties.contexttype) ? data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = properties.contexttype : "";

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

    /**
     * Clean html because some scenarios render twice
     */
    emptyControlByAsyncRenderDeferred: function () {
        var self = this;
        var control = self.getControl();
        control.empty();
    }
});