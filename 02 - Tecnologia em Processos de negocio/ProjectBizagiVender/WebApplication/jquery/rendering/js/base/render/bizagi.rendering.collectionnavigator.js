bizagi.rendering.render.extend("bizagi.rendering.collectionnavigator", {}, {

    initializeData: function (params) {
        var self = this;

        self._super(params);

        var properties = self.properties;
        properties.allowAdd = (typeof properties.allowAdd != "undefined") ? bizagi.util.parseBoolean(properties.allowAdd) : true;
        properties.withAddForm = properties.withAddForm && properties.allowAdd;
        properties.allowEdit = (typeof properties.allowEdit != "undefined") ? bizagi.util.parseBoolean(properties.allowEdit) : true;
        properties.withEditForm = properties.withEditForm && properties.allowEdit;
        properties.allowDetail = (typeof properties.allowDetail != "undefined") ? bizagi.util.parseBoolean(properties.allowDetail) : false;
        properties.inlineAdd = (typeof properties.inlineAdd != "undefined") ? bizagi.util.parseBoolean(properties.inlineAdd) : true;
        properties.inlineAdd = properties.inlineAdd && properties.allowAdd;
        properties.inlineEdit = (typeof properties.inlineEdit != "undefined") ? bizagi.util.parseBoolean(properties.inlineEdit) : true;
        properties.inlineEdit = properties.inlineEdit && properties.allowEdit;
        properties.allowDelete = (typeof properties.allowDelete != "undefined") ? bizagi.util.parseBoolean(properties.allowDelete) : true;

        self.orientation = self.properties.orientation || "ltr",
        self.data = self.properties.data;
        self.keys = self.data ? self.getKeys(self.data.rows) : [];
        self.pointer = 0;
        self.totalRows = 0;
        self.inlineAddRecords = [];

        if (self.data) {
            self.totalRows = self.data.rows.length;
        }
    },
    /*
    * Normalize keys
    */
    getKeys: function (rows) {
        rows = rows || [];
        var keys = [];

        for (var i = 0, l = rows.length; i < l; i++) {
            var row = rows[i];
            keys.push(row[0]);
        }
        return keys;
    },

    /*
    *   Render the control
    */
    renderControl: function () {
        var self = this;
        var properties = this.properties;
        var templateItem = "collectionnavigator";
        var template = self.renderFactory.getTemplate(templateItem);
        var mode = self.getMode();

        // Render the container
        var html = $.fasttmpl(template, {
            uniqueId: properties.uniqueId,
            displayName: properties.displayName ? properties.displayName : "",
            id: properties.id,
            guid: properties.guid,
            showPreview: self.showPreview(),
            mode: mode,
            orientation: self.getFormContainer().properties.orientation
        });

        html = self.drawControls(html);

        return html;
    },

    /*
    * Render version readonly of control
    */
    renderReadOnly: function () {
        var self = this;
        return self.renderControl();
    },

    /*
    * Draw navigation controls
    */
    drawControls: function (html) {

    },

    /*
    *  render several actions in the navigation palete
    *  ex. save, cancel 
    */
    drawActions: function (controls) {

    },

    /*
    * Render navigation controls (next, previous, last, first. etc )
    */
    drawControl: function (controls) {

    },

    /*
    * Draw forms options (add form, edit form, navigation form)
    */
    drawForms: function (controls) {

    },

    /*
    * Draw a preview views, it will be show when the collection hasn't records
    */
    drawPreview: function () {
        var self = this;
        var mode = self.getMode();
        var templateItem = (mode === "execution") ? "collectionnavigator-execution" : "collectionnavigator-preview";
        var template = self.renderFactory.getTemplate(templateItem);
        var html = $.tmpl(template);
        self.canvas.append(html);

    },

    /*
    * Returns true if the collection has data
    */
    hasData: function () {
        var self = this;

        return self.getTotalRows() > 0;
    },

    /*
    * Returns the key of current row
    */
    getRow: function () {
        var self = this;

        return self.keys[self.pointer];
    },

    /*
    * Returns the key of next row
    */
    getNextRow: function () {
        var self = this;

        if (self.getTotalRows() > (self.pointer + 1)) {
            self.pointer += 1;
        }
        return self.getRow();
    },

    /*
    * Returns the key of previous row
    */
    getPreviousRow: function () {
        var self = this;

        if (self.pointer > 0) {
            self.pointer -= 1;
        }
        return self.getRow();
    },

    /*
    * Returns the key of first row
    */
    getFirstRow: function () {
        var self = this;

        self.pointer = 0;
        return self.getRow();
    },

    /*
    * Returns the key of last row
    */
    getLastRow: function () {
        var self = this;

        self.pointer = self.keys.length - 1;
        return self.getRow();
    },

    /*
    * Returns the total numbers of rows in collection
    */
    getTotalRows: function () {
        var self = this;

        return self.keys.length;
    },

    getIndexes: function () {
        var self = this;
        return self.properties.data.rows;
    },

    /*
    * Sets the pointer to a specific position
    */
    setPointer: function (index) {
        var self = this;

        self.pointer = index - 1;
    },

    /*
    * Returns true is there is a inline row pending to save
    */
    isTherePendingInlineRow: function () {
        var self = this;

        return (self.inlineAddRecords.length > 0);
    },


    /*
    * Adds new row to collection
    */
    addKey: function (newId) {
        var self = this;

        self.keys.push(newId);
    },

    /*
    * Removes row in collection
    */
    removeKey: function () {
        var self = this;
        var index = self.pointer;

        if (index >= 0) {
            self.keys.splice(index, 1);

            var totalRows = self.getTotalRows();
            if (totalRows > 0 && index >= totalRows) {
                self.setPointer(totalRows);
            }
        }
    },

    /*
    * Returns true if the control should show the preview view
    * ex. if the collection is empty 
    */
    showPreview: function () {
        var self = this;
        var mode = self.getMode();
        var properties = self.properties;

        if (mode == "execution") {
            return !self.hasData();
        } else {
            return !bizagi.util.parseBoolean(properties.navigationform);
        }
    },

    /*
    * Returns the parameters needed for the request
    */
    getParameters: function (params) {
        var self = this;

        var parameters = {};
        var properties = self.properties;
        var recordXpath = properties.xpath + "[id=" + params.id + "]";

        parameters.idRender = properties.id;
        parameters.recordXPath = recordXpath;
        parameters.xpathContext = properties.xpathContext;
        parameters.idPageCache = properties.idPageCache;
        parameters.requestedForm = params.requestedForm;
        parameters.contextType = properties.contextType || properties.contexttype;
        parameters.url = params.url;
        parameters.editable = params.editable;
        orientation: properties.orientation || "ltr";


        return parameters;
    },

    /*
    *   Submits a collection navigator add record request
    *   Returns a deferred when done, the server returns an id for the new record
    */
    submitAddRequest: function () {
        var self = this,
                properties = self.properties;

        var request = self.dataService.addGridRecord({
            url: properties.addUrl,
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
            contexttype: properties.contextType || properties.contexttype,
            idPageCache: properties.idPageCache,
            orientation: properties.orientation || "ltr"
        });

        var filterResponse = request.pipe(function (data) {
            // Parses response
            return data.idEntity;
        });

        return filterResponse.promise();
    },

    /*
    *   Submits a edit record request for the given id 
    *   Returns a deferred
    */
    submitEditRequest: function (id) {
        var self = this,
            properties = self.properties;

        var xpath = properties.xpath + "[id=" + id + "]";

        return self.dataService.editGridRecord({
            url: properties.editUrl,
            idRender: properties.id,
            xpath: xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            contexttype: properties.contextType || properties.contexttype || '',
            orientation: properties.orientation || "ltr"
        });
    },

    /*
    *   Submits a collection delete record request for the given id 
    *   Returns a deferred
    */
    submitDeleteRequest: function (id) {
        var self = this,
                properties = self.properties;

        var xpath = properties.xpath + "[id=" + id + "]";

        return self.dataService.deleteGridRecord({
            url: properties.deleteUrl,
            idRender: properties.id,
            xpath: xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            contexttype: properties.contextType || properties.contexttype
        }).pipe(function (data) {
            if (data.type == "validationMessages") {
                var form = self.getFormContainer();
                var message = data.messages.join(" ");
                form.failHandler({ message: message });
            }

            return data;
        });
    },

    /*
    *   Submits a collection navigator edit record request for the given id 
    *   Returns a deferred
    */
    submitSaveRequest: function (id, data) {
        var self = this,
            properties = self.properties;

        // Calculate xpath context
        var xpathContext = properties.xpathContext.length > 0 ? properties.xpathContext + "." + properties.xpath + "[id=" + id + "]" : properties.xpath + "[id=" + id + "]";

        return self.dataService.saveGridRecord({
            url: properties.saveUrl,
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: xpathContext,
            contexttype: properties.contextType || properties.contexttype || "",
            submitData: data
        }).fail(function (dataFail) {
            var form = self.getFormContainer();
            var message = (dataFail.responseText) ? dataFail.responseText : ((typeof dataFail == "string") ? dataFail : dataFail.toString());
            //Convert String to object
            if (typeof message == "string") {
                try {
                    message = JSON.parse(message).message;
                } catch (e) {
                    message = message.match(/"message":(.*)",/)[0];
                    message = message.substr(11, message.length - 13);
                }

            } else if (!message.message) {
                message = dataFail;
            }
            form.validateForm();
            form.clearValidationMessages();
            form.addValidationMessage(message);
        });
    },

    /*
    *   Submits a collection navigator rollback request
    *   Returns a deferred when done
    */
    submitRollbackRequest: function () {
        var self = this,
            properties = self.properties;

        return self.dataService.rollbackGridAction({
            url: properties.rollbackUrl,
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            contexttype: self.properties.contexttype || ""
        });
    },
    /*
    *   Fetch the data into a deferred
    */
    getRemoteData: function (params) {
        var self = this;
        var properties = self.properties;

        // Set params
        params = params || {};
        $.extend(params, {
            url: properties.dataUrl,
            xpath: properties.xpath,
            idRender: properties.id,
            xpathContext: properties.xpathContext,
            contexttype: properties.contextType || properties.contexttype,
            idPageCache: properties.idPageCache

        });

        return self.dataService.getData(params);
    }

});