/*
 *   Name: BizAgi Render Grid Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define basic stuff for grids
 */

bizagi.rendering.render.extend("bizagi.rendering.grid", {}, {

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


        /** Edit properties 
        * @default editable true
        */
        properties.editable = bizagi.util.parseBoolean(properties.editable) || false;
        properties.allowEdit = bizagi.util.parseBoolean(properties.allowEdit) != null ? bizagi.util.parseBoolean(properties.allowEdit) : true;
        properties.inlineEdit = bizagi.util.parseBoolean(properties.inlineEdit) != null ? bizagi.util.parseBoolean(properties.inlineEdit) : true;
        properties.withEditForm = bizagi.util.parseBoolean(properties.withEditForm) != null ? bizagi.util.parseBoolean(properties.withEditForm) : false;

        /** Add properties 
        * @default  allowAdd true 
        */
        properties.allowAdd = bizagi.util.parseBoolean(properties.allowAdd) != null ? bizagi.util.parseBoolean(properties.allowAdd) : true;
        properties.inlineAdd = (properties.allowAdd) ? (bizagi.util.parseBoolean(properties.inlineAdd) != null) ? bizagi.util.parseBoolean(properties.inlineAdd) : true : false;

        /* Define Delete properties */
        properties.allowDelete = bizagi.util.parseBoolean(properties.allowDelete) != null ? bizagi.util.parseBoolean(properties.allowDelete) : true;

        /* Define details properties*/
        properties.allowDetail = bizagi.util.parseBoolean(properties.allowDetail) != null ? bizagi.util.parseBoolean(properties.allowDetail) : false;

        /* Define general properties */
        properties.keyColumn = "id";
        properties.data = properties.data || null;
        properties.displayType = "value";
        properties.skipInitialLoad = properties.skipInitialLoad || false;
        properties.allowMore = bizagi.util.parseBoolean(properties.allowMore) || false;
        properties.allowFilter = bizagi.util.parseBoolean(properties.allowFilter) || false;
        properties.allowGrouping = false;
        properties.groupBy = "";
        properties.groupSummary = properties.groupSummary || null;
        properties.groupText = this.getResource("render-grid-group-text");
        properties.groupCollapsed = bizagi.util.parseBoolean(properties.groupCollapsed) || false;
        properties.groupOrder = properties.groupOrder || "asc";
        properties.formShowMode = bizagi.util.parseBoolean(properties.formShowMode) || "popup";

        properties.sortBy = properties.sortBy ? properties.sortBy : properties.data && properties.data.sort ? properties.data.sort : properties.keyColumn;
        properties.sortOrder = properties.sortOrder !== undefined && properties.sortOrder !== null ? (properties.sortOrder === "True" ? "asc" : "desc") : properties.data && properties.data.order ? properties.data.order : "asc";
        properties.sort = properties.sortBy + " " + properties.sortOrder;

        properties.rowsPerPage = properties.allowGrouping ? 1000 : (properties.rowsPerPage || 20);
        properties.page = 1;
        properties.records = 0;
        properties.totalPages = 0;

        properties.addLabel = properties.addLabel || this.getResource("render-grid-add-label") + properties.displayName;
        properties.editLabel = properties.editLabel || $.trim(this.getResource("render-grid-edit-label")) + " " + properties.displayName;
        properties.deleteLabel = properties.deleteLabel || this.getResource("render-ecm-confirm-bt-delete") + " " + properties.displayName;
        properties.exportOptionsLabel = properties.exportOptionsLabel || this.getResource("render-grid-export-options-label") + properties.displayName;
        properties.detailLabel = properties.detailLabel || this.getResource("render-collection-navigator-details-form");


        // Apply style to entire table
        properties.tableCssClass = properties.cssClass || "";

        properties.alreadySaved = false;

        // When grid open in modal window and the parent is entity
        if (properties.contexttype != "entity") {
            properties.contexttype = (typeof self.parent.getContextType == 'function') ? self.parent.getContextType() : "";
        }

        // Define if it is editable or not        
        /* This part change all cells in the table to no editable,
        * you must use it when the parent container has noeditable property,
        * so this table is noeditable too.
        */
        try {
            if ((self.parent && typeof self.parent.properties.editable == "boolean" && !self.parent.properties.editable) || !properties.editable) {
                properties.allowAdd = false;
                properties.allowEdit = false;
                properties.allowDelete = false;
                properties.inlineEdit = false;
                properties.inlineAdd = false;
                properties.editable = false;
            }
        } catch (e) {
        }


        // If grid has not allowEdit property in true, all fields within the grid
        // must be no editables, so these lines changes this behavior
        if (!properties.allowEdit || (!properties.inlineEdit && !properties.withEditForm)) {
            properties.editable = false;
        }

        // Calculate render width
        properties.labelWidth = 0;
        properties.valueWidth = "100%";

        // This property will be used to make custom grids with another data source
        properties.overrideGetRemoteData = properties.overrideGetRemoteData || undefined;
        //this property use to create a single decorated or a array of decorated
        properties.singleInstance = bizagi.util.isEmpty(properties.singleInstance) ? true : properties.singleInstance;
        // Set columns
        var areThereEditableColumns;
        var areThereTotalizedColumns;
        self.columns = [];
        self.enabledChecks = {};
        self.exclusiveChanges = {};
        self.originalEnabledChecks=[];
        $.each(data.elements, function (i, column) {
            var columnProperties = column.render.properties;

            // the groupby property is taken of column
            if (columnProperties.groupBy) {
                properties.groupBy = columnProperties.xpath || "";
                properties.allowGrouping = !bizagi.util.isEmpty(properties.groupBy) ? true : false;
            }
            if(columnProperties.type==="columnLabel"){
                self.spliceRowData(data.properties.data,i+1);
            }
            if (columnProperties.type === "columnBoolean" && columnProperties.isExclusive) {
                var params = {
                    xpath: columnProperties.xpath
                };
                if(data.properties.data){
                    self.enabledChecks[columnProperties.xpath] = [];
                    for (var j = 0; j < data.properties.data.rows.length; j++) {
                        var row = data.properties.data.rows[j];
                        var item = row[i + 1];
                        if(item){
                            self.originalEnabledChecks.push(row[0]);
                            self.enabledChecks[columnProperties.xpath].push([row[0], item]);
                        }
                    }
                }
            }

            // If inlineEdit is false then all columns must be read only
            if (!self.properties.inlineEdit) {
                column.render.properties.editable = false;
            }

            // Create renderColumns
            var columnRender = self.renderFactory.getColumn({
                type: columnProperties.type,
                data: column.render,
                parent: self,
                singleInstance: properties.singleInstance
            });

            self.columns.push(columnRender);

            if (columnProperties.editable) {
                areThereEditableColumns = true;
            }

            if (columnProperties.totalize && columnProperties.totalize.operation) {
                areThereTotalizedColumns = true;

                // Default summary format
                columnProperties.totalize.format = columnProperties.totalize.format || {};
                columnProperties.totalize.format.bold = columnProperties.totalize.format.bold !== undefined ? columnProperties.totalize.format.bold : true;
            }
        });

        // Reverse columns when using right to left orientation
        if (properties.orientation == "rtl")
            self.columns = self.columns.reverse();

        // Turn off inline edit if there are any editable columns        
        if (properties.inlineEdit && !areThereEditableColumns) {
            properties.inlineEdit = false;
            properties.allowEdit = false;
        }

        // Check if the grid has totalizers
        if (areThereTotalizedColumns) {
            properties.showSummary = true;
            properties.rowsPerPage = 0;
        }


        // Check if the grid its opened whitin dialog form and has contextType
        properties.contextType = (form.params && form.params.data && form.params.data.contextType) ? form.params.data.contextType : null;

        // Create a collection to collect changes
        self.changes = {};

        // Create a collection to override properties per cell
        self.cellOverrides = {};


        // Check orientation and change order of data if its necesary (rtl)
        if (self.isRTL() && properties.data != null) {
            properties.data.rows = self.changeOrderData(properties.data.rows);
        }
    },

    isRTL: function () {
        var properties = this.properties;
        if (!properties) return true;
        return (typeof properties.orientation == "string" && properties.orientation.toUpperCase() == "RTL") ? true : false;
    },
    changeOrderData: function (data) {
        var reverseDataRows = [];
        var rows = data || [];
        var rowKey;

        $.each(rows, function (key, value) {
            // Extract row key
            rowKey = value.shift();
            reverseDataRows = value.reverse();
            // add element in the start
            reverseDataRows.unshift(rowKey);

            rows[key] = reverseDataRows;
        });

        return rows;
    },

    /**
     * Specific fix RTL with localizated
     * @param data
     * @returns {*|Array}
     */
    removeRemainingColumns: function (data, numColumns) {
        var rows = data || [];
        var remainingColumns = 0;
        if(rows.length > 0){
            // "- 1" because the first column represent id row
            remainingColumns = rows[0].length - numColumns - 1;
        }
        if(remainingColumns > 0){
            $.each(rows, function (key, value) {
                // Remove remaining columns
                for(var i = 0; i < remainingColumns; i++){
                    value.pop();
                }
            });
        }
        return rows;
    },

    /* 
    *   Gets a column definition by xpath
    */
    getColumn: function (xpath) {
        var self = this;
        var result = null;
        $.each(self.columns, function (i, column) {
            if (column.properties.xpath == xpath || column.properties.id == xpath) {
                result = column;
            }
        });

        return result;
    },
    /*
    *   Template method to implement in each children to customize each control
    *   Returns a promise that will be resolved when all the columns has been loaded
    */
    renderControl: function () {
        var self = this;
        var properties = this.properties;
        var defer = new $.Deferred();

        // Set dummy data when not in execution mode
        var mode = self.getMode();
        if (mode != "execution") {
            properties.data = self.getDummyData();
        }

        var template = self.getGridTemplate();

        // Render template
        var html = self.applyTemplate(template);

        // Initialize columns
        var columnInitializers = [];
        $.each(self.columns, function (i, column) {

            // Add to column initializer array so we can synch out the promises
            var result = column.initialize();
            if (result)
                columnInitializers.push(result);
        });

        // Resolve when all columns has been loaded
        jQuery.when.apply($, columnInitializers).done(function () {
            defer.resolve(html);
        });

        return defer.promise();
    },
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Call base
        this._super();

        // Make control to behave as a block container
        control.addClass("ui-bizagi-render-grid-container")
                .addClass("ui-bizagi-render-display-block");
    },

    /*
    *   Returns the grid template to be used
    */
    getGridTemplate: function () {
        return this.renderFactory.getTemplate("grid");
    },

    /*
    *   Applies the template to the render and returns the resolved element
    */
    applyTemplate: function (template) {
        var self = this,
                properties = self.properties;
                orientation = self.properties.orientation;

        return $.fasttmpl(template, {
            id: bizagi.util.encodeXpath(properties.xpath),
            displayName: bizagi.util.encodeXpath(properties.displayName),
            allowAdd: properties.allowAdd,
            addLabel: properties.addLabel
        });
    },
    /*
    *   Method to render non editable values
    *   Returns a promise that will be resolved when all the columns has been loaded
    */
    renderReadOnly: function () {
        var self = this;
        var properties = self.properties;

        // Override read-only presets
        //  properties.allowAdd = false;
        // Render the same, just change some presets
        return self.renderControl();
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
            contexttype: properties.contextType,
            idPageCache: properties.idPageCache,
            sort: properties.sortBy,
            order: properties.sortType,
            page: properties.page,
            rows: properties.rowsPerPage,
            searchFilter: properties.searchFilter,
            orientation: properties.orientation || "ltr"
        });

        // Check if a custom method has been given
        if (properties.overrideGetRemoteData) {
            var result = properties.overrideGetRemoteData(params);
            return result != null ? result.promise() : null;
        }

        // Default ajax call
        var defer = new $.Deferred();

        // Resolve with remote data
        self.dataService.multiaction().getGridData(params).done(function (data) {

            // Resolve with fetched data    
            properties.page = data.page;
            properties.records = data.records;
            properties.totalPages = data.totalPages;

            // Check RTL commented by Case QA-2583
            //if (self.isRTL()) {
            //    data.rows = self.changeOrderData(data.rows);
            //}

            defer.resolve(data);
        });

        return defer.promise();
    },
    /*
     insert a blank item in the selected column in the data matrix
     */
    spliceRowData: function (data,index) {
        var self = this;
        var mode = self.getMode();
        if (mode == "execution") {
            $.each(data.rows, function (key, value) {
                var spliceIndex= index || data.rows[key].length;
                data.rows[key].splice(spliceIndex,0,"");
            });
        }
    },
    /*
    *   Creates a set of dummy data in order to display it when rendering in design or layout mode
    */
    getDummyData: function () {
        var self = this;
        var properties = self.properties;
        if (properties.data) {
            return properties.data;

        } else {
            var rowTemplate = ["1"];

            // Add a value for each column
            for (var i = 0; i < self.columns.length; i++) {
                rowTemplate.push("");
            }

            var data = {
                "page": 1,
                "total": 1,
                "records": 1,
                "rows": [rowTemplate]
            };

            return data;
        }
    },
    /*
    *   Submits a grid edit record request for the given id 
    *   Returns a deferred
    */
    submitEditRequest: function (id) {
        var self = this,
                properties = self.properties;

        var xpath = properties.xpath + self.buildCellXpathFilter(id);

        return self.dataService.editGridRecord({
            url: properties.editUrl,
            idRender: properties.id,
            xpath: xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            contexttype: properties.contextType
        });
    },
    /*
    *   Submits a grid edit record request for the given id 
    *   Returns a deferred
    */
    submitSaveRequest: function (id, data) {
        var self = this,
                properties = self.properties;

        // Check if there are deferreds to wait
        var deferredsToWait = null;
        if (data.deferreds) {
            deferredsToWait = $.when.apply($, data.deferreds);
            delete data.deferreds;
        }

        // Calculate xpath context
        var xpathContext = properties.xpathContext.length > 0 ? properties.xpathContext + "." + properties.xpath + self.buildCellXpathFilter(id) : properties.xpath + self.buildCellXpathFilter(id);
              
        return $.when(deferredsToWait).pipe(function () {
            self.startLoading();
            return self.dataService.saveGridRecord({
                url: properties.saveUrl,
                idRender: properties.id,
                xpath: properties.xpath,
                xpathContext: xpathContext,
                submitData: data,
                contexttype: properties.contextType,
                disableServerGridValidations: data.disableServerGridValidations || false
            }).pipe(function (dataResp) {
                self.endLoading();
                return dataResp;
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
        });
    },
    /*
    *   Submits a grid delete record request for the given id 
    *   Returns a deferred
    */
    submitDeleteRequest: function (id) {
        var self = this,
                properties = self.properties;

        var xpath = properties.xpath + self.buildCellXpathFilter(id);

        return self.dataService.deleteGridRecord({
            url: properties.deleteUrl,
            idRender: properties.id,
            xpath: xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            contexttype: properties.contextType
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
    *   Submits a grid add record request
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
            contexttype: properties.contextType,
            idPageCache: properties.idPageCache
        });

        var filterResponse = request.pipe(function (data) {
            // Parses response
            return data.idEntity;
        });

        return filterResponse.promise();
    },
    /*
    *   Submits a grid rollback request
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
    *   Collect a single cell change made in the grid to send the data when the user saves the form
    */
    collectGridChange: function (params) {
        var self = this;
        params = params || {};
        var id = params.id;
        var xpath = params.xpath;
        var value = params.value;
        var trigger = typeof (params.trigger) !== "undefined" ? params.trigger : true;
        var isPressed = params.pressed || false;

        self.changes[id] = self.changes[id] || {};
        self.changes[id][xpath] = value;
        if (trigger)
            self.triggerRenderChange({
                key: id,
                column: xpath,
                pressed: isPressed
            });
    },
    /*
    *   Configures a column to perform a submit on change when the user changes a cell
    */
    configureColumnSubmitOnChange: function (xpath) {
        var self = this;
        var properties = self.properties;

        // Build action
        var action = {
            commands: [{
                xpath: properties.xpath,
                command: 'submit-value',
                argument: 'all'
            }],
            conditions: {
                operator: 'and',
                expressions: [
                    { simple: { operator: 'cell-change', xpath: properties.xpath + '[].' + xpath, argumentType: 'text', argument: xpath} }
                ]
            },
            dependencies: [properties.xpath]
        };

        // Add action when form ends its rendering
        $.when(self.ready())
                .done(function () {
                    var form = self.getFormContainer();
                    form.addSubmitAction(xpath, action);
                });
    },
    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectData: function (renderValues) {
        var self = this;
        var properties = self.properties;
        var keysToDelete = [];

        for (var id in self.changes) {
            // Dont collect data from totalizers 
            if (id != "summary") {
                for (var columnXpath in self.changes[id]) {
                    // Check if the render can submit data
                    if (self.canColumnBeSent(id, columnXpath)) {
                        var xpath = properties.xpath + self.buildCellXpathFilter(id) + "." + columnXpath;
                        var columnSimpleXpath = properties.xpath + self.buildCellXpathFilter(id) + "." + (columnXpath.substr(columnXpath.lastIndexOf('.') + 1, columnXpath.length) || columnXpath);
                        var value = self.changes[id][columnXpath];

                        renderValues[xpath] = value;
                    }
                }
            }
            // Clean changes 
            keysToDelete.push(id);

        }

        if (self.exclusiveChanges) {
            for (var id in self.exclusiveChanges) {
                var columnExclusiveChanges = self.exclusiveChanges[id];
                var columnEnabledChecks = self.enabledChecks[id];
                if (columnExclusiveChanges && columnEnabledChecks) {
                    for (var i = 0; i < columnEnabledChecks.length; i++) {
                        var columnSimpleXpathEnabled = properties.xpath + self.buildCellXpathFilter(columnEnabledChecks[i][0]) + "." + id;
                        renderValues[columnSimpleXpathEnabled] = false;
                    }
                    var columnSimpleXpath = properties.xpath + self.buildCellXpathFilter(columnExclusiveChanges.key) + "." + columnExclusiveChanges.xpath;
                    renderValues[columnSimpleXpath] = columnExclusiveChanges.value;
                }
            }
        }

        // Clean changes array in order to prevent duplicate data
        // when execute SUBMITDATA in multiaction, that make and error
        // in circular dependencies, specially when we add inline record
        $.each(keysToDelete, function (key, v) {
            delete self.changes[v];
            var a;
        });
    },

    hasChanged: function (result) {
        var self = this;
        if (!$.isEmptyObject(self.changes)) {
            result.push(true);
            return true;
        } else {
            return false;
        }
    },

    /*
    *   Check if a column data can be sent to the server
    */
    canColumnBeSent: function (id, columnXpath) {
        var self = this, i, j, xpath;
        for (i in self.columns) {
            if (self.columns.hasOwnProperty(i)) {
                var column = self.columns[i];
                if (column.properties.type !== "columnUserfield") {
                    if (column.properties.xpath == columnXpath) {
                        var cellOverride = self.getCellOverride(id, column.columnIndex - 1);
                        return column.canBeSent(id, cellOverride);
                    }
                } else {
                    for (j in column.properties) {
                        if (column.properties.hasOwnProperty(j)) {
                            if (Object.prototype.toString.apply(column.properties[j]) === "[object String]") {
                                xpath = column.properties[j].substr(column.properties[j].lastIndexOf(".") + 1);
                                if (xpath === columnXpath) {
                                    return true;
                                }
                            }
                        }
                    }
                }

            }
        }

        return false;
    },
    /* 
    *  Method to determine if the render value can be sent to the server or not
    */
    canBeSent: function () {
        var self = this;
        var properties = self.properties;
        var displayOnly = bizagi.util.parseBoolean(properties.displayOnly) || false;

        // The render can be sent if it is "display only" and inline Edit is available
        if (!displayOnly && (properties.inlineEdit || properties.inlineAdd || !$.isEmptyObject(self.changes))) {
            return true;
        }
        return false;
    },
    /*
    *   Return the value for a requested cell
    */
    getCellValue: function (key, xpath) {
        var self = this;
        var data = self.properties.data.rows;
        for (var i = 0; i < data.length; i++) {
            if (data[i][0] == key) {
                for (var j = 0; j < self.columns.length; j++) {
                    if (self.columns[j].properties.xpath == xpath) {
                        var result = data[i][j + 1];
                        return result;
                    }
                }
            }
        }
        return null;
    },
    /*
    *
    */
    getCellCurrentValue: function (key, xpath) {
        var self = this;

        var control = self.getControlCell(key, xpath);
        if (control && typeof control.getValue === "function") {
            return control.getValue();
        }
        return null;
    },
    /*
    *   Gets control
    */
    getControlCell: function (key, xpath) {
        var self = this;
        var control = null;
        if (typeof(self.columns)!="undefined")
        for (var j = 0; j < self.columns.length; j++) {
            if (self.columns[j].properties.xpath == xpath || self.columns[j].properties.id == xpath) {
                control = self.columns[j].getDecorated(key);
                break;
            }
        }


        return control;
    },
    /*
    *   Fetch the data again and updates the content
    */
    refresh: function () {
    },
    /*
    *   Sets an error on the cell
    */
    setError: function (key, columnXpath) {
    },
    /*
    *   Changes the background for a cell
    */
    changeCellBackgroundColor: function (key, xpath, argument) {
    },
    /*
    *   Changes the background for a cell
    */
    changeCellColor: function (key, xpath, argument) {
    },
    /*
    *   Changes the visibility for a cell
    */
    changeCellVisibility: function (key, xpath, argument) {
    },
    /*
    *   Changes the editability for a cell
    */
    changeCellEditability: function (key, xpath, argument) {
    },
    /*
    *  Changes the required for cell
    */
    changeCellRequired: function (key, xpath, argument) {
    },
    /*
    *  Refresh behaviors of cell
    */
    changeCellProperties: function (key, xpath, argument) {

    },
    /*
     *  Changes the max value for a cell
     */
    changeCellMaxValue: function (key, xpath, argument) {

    },
    /*
     *  Changes the min value for a cell
     */
    changeCellMinValue: function (key, xpath, argument) {

    },
    /*
    *  Clean data of cell
    */
    cleanCellData: function (key, xpath) {
    },


    /**
    *   Refresh behaviors of cell
    */
    refreshCell: function (params) {
        var self = this;
        var properties = self.properties;
        var key = params.key;
        var column = params.column;
        var xpathContext = (params.xpathContext !== "") ? params.xpathContext + "." + self.properties.xpath + self.buildCellXpathFilter(key) : self.properties.xpath + self.buildCellXpathFilter(key);
        var cell = self.getControlCell(key, params.column);
		var form = self.getFormContainer();
		var idForm = form.properties.id;

		if (!cell) {
		    return;
		}

        // Execute personalized stuff before to refresh it
        cell.beforeToRefresh();

        // Call service
        return $.when(self.dataService.multiaction().refreshGridCell({
            idRender: properties.id,
            column: cell.properties.id,
            idPageCache: properties.idPageCache,
            xpathContext: xpathContext,
			idForm: idForm
        })).done(function (data) {
            // Extract values
            var getDepthData = function (target) { if (target && typeof target == "object" && target.length >= 1) { return (target[0].length >= 1) ? target[0][0] : target[0]; } return ""; };
            var newValue = getDepthData(data.rows);
            var editable = getDepthData(data.editable) || true;
            editable = (editable && (typeof cell.column != "undefined" && typeof cell.column.properties != "undefined" && cell.column.properties.editable)) ? true : false;
            var visible = getDepthData(data.visible) || true;

            // Change Visibility & Editability
            self.changeCellVisibility(key, column, visible);
            cell.changeEditability(editable);

            // Change control value
            cell.setValue(newValue);
            cell.setDisplayValue(newValue);

            // Trigger grid change
            self.triggerRenderChange({ key: key, column: column, changed: false });

            // Update the affected cell manualy after a refresh
            //TODO:temporary solution
            //review the DRAGON-5982 
            if (cell.column != undefined && bizagi.util.detectDevice() == "desktop") {
                self.updateAffectedCellManually(key, newValue, cell.column.columnIndex);
            }


            // Execute personalized stuff after to refresh it
            cell.afterToRefresh();
        });
    },

    /*
    *   Triggers the render change event
    */
    triggerRenderChange: function (params) {
        var self = this;
        params = params || {};
        // Property to verify exporting updated grids
        if (!bizagi.util.isEmpty(params) && params.changed != false)
            self.properties.canBeExported = false;
        self.triggerHandler("renderchange", {
            render: self,
            surrogateKey: params.key,
            column: params.column,
            changed: params.changed,
            rowDeleted: params.rowDeleted,
            pressed: params.pressed
        });
    },

    /*
    *   Validate the grid
    */
    validate: function () {
        this.isValid([]);
    },
    /* 
    * Public method to determine if a value is valid or not
    */
    isValid: function (invalidElements) {
        var self = this;
        var bValid = true;

        // Clear error message
        self.hasErrors = false;
        self.setValidationMessage("");

        // Check for required columns and null values
        if (self.properties.data && self.properties.data.rows) {
            // Preserve elements in data.rows
            var data = $.merge($.merge([], self.properties.data.rows), self.getDataNewRows());

            for (var i = 0; i < self.columns.length; i++) {
                var messages = [];
                var uniqueMessages = {};

                for (var j = 0; j < data.length; j++) {
                    var value = data[j][i + 1];
                    var key = data[j][0];
                    var xpath = self.columns[i].properties.xpath;
                    if (self.changes[key] !== undefined && self.changes[key][self.columns[i].properties.xpath] !== undefined) {
                        value = self.changes[key][self.columns[i].properties.xpath];
                    }

                    // Check if the column is valid
                    var valueValid = self.columns[i].isValueValid(key, value, messages, self.getCellOverride(key, i));
                    if (!valueValid) {
                        bValid = false;

                        self.hasErrors = true;
                        self.setError(key, self.columns[i].properties.xpath);
                    }
                }
                for (var k = 0, messagesLength = messages.length; k < messagesLength; k++) {
                    if (uniqueMessages[messages[k]] == null) {
                        uniqueMessages[messages[k]] = messages[k];
                    }
                }

                if (messages.length > 0) {
                    var gridValidationMessage = self.getResource("render-grid-validation").replaceAll("#grid#", self.properties.displayName);
                    for (key in uniqueMessages) {
                        invalidElements.push({ xpath: self.properties.xpath, message: gridValidationMessage + " " + key });
                    }
                }
            }
        }

        return bValid;
    },
    /*
    *   Enables submit on change feature for the current render
    */
    configureSubmitOnChange: function () {
        // Don't do anything we will trigger submit on change manually only when the grid add or edit form has been edited   
    },
    /*
    *   Get cell override
    */
    getCellOverride: function (key, column) {
        var self = this;

        // Convert to numbers
        key = Number(key);
        column = Number(column);

        // Find overrides
        var columnProperties = self.columns[column].properties;
        if (!self.cellOverrides[key])
            self.cellOverrides[key] = {};
        if (!self.cellOverrides[key][column]) {
            self.cellOverrides[key][column] = {
                visible: columnProperties.visible,
                editable: columnProperties.editable,
                required: columnProperties.required
            };
        }

        return self.cellOverrides[key][column];
    },

    /*
    * Set cell overrides based on the data
    */
    setCellOverrides: function (data, columns) {
        var self = this;
        var key, i, j;

        // Init visibility overrides
        if (data.visible) {
            for (i in data.visible) {
                key = data.visible[i][0];
                for (j in data.visible[i]) {
                    // Skip key columns
                    if (j > 0)
                        self.getCellOverride(key, j - 1).visible = bizagi.util.parseBoolean(data.visible[i][j]);
                }
            }
        }

        // Init editability overrides
        if (data.editable) {
            for (i in data.editable) {
                if (data.editable.hasOwnProperty(i)) {
                    key = data.editable[i][0];
                    for (j in data.editable[i]) {
                        // Skip key columns
                        if (data.editable[i].hasOwnProperty(j)) {
                            if (j > 0) {
                                var columnEditable = columns ? bizagi.util.parseBoolean(columns[j - 1].properties.editable) : true;
                                self.getCellOverride(key, j - 1).editable = columnEditable ? bizagi.util.parseBoolean(data.editable[i][j]) : false;
                            }
                        }
                    }
                }
            }
        }

        // Init required overrides
        if (data.required) {
            for (i in data.required) {
                key = data.required[i][0];
                for (j in data.required[i]) {
                    // Skip key columns
                    if (j > 0)
                        self.getCellOverride(key, j - 1).required = bizagi.util.parseBoolean(data.required[i][j]);
                }
            }
        }
    },
    /*
    *   Returns the row indexes for the data
    */
    getIndexes: function () {
        var self = this;
        var data = $.merge(self.properties.data.rows, self.getDataNewRows());
        return $.map(data, function (item, i) {
            return item[0];
        });
    },
    /**
    *  Return object with value of all new records unsaved within the grid
    *  @return {object} all new records
    */
    getDataNewRows: function () {
        var self = this;
        var newRows = [];

        if (typeof self.newRecords == "object" && !$.isEmptyObject(self.newRecords)) {
            $.each(self.newRecords, function (rowKey) {
                var cellValue = [];
                cellValue.push(Number(rowKey));
                for (var i = 0, length = self.columns.length; i < length; i++) {
                    cellValue.push(self.getCellCurrentValue(rowKey, self.columns[i].properties.xpath));
                }
                // Add cell value row to new rows
                newRows.push(cellValue);
            });
        }
        return newRows;
    },

    /*
    * Return the object with the required url to access the exported grid to the desired format
    *  @return {object} render attributes, including id, xpathContext, idPagecache, disposition (inline or attachment), and exportType (XLS or PDF)
    */
    getGridExportUrl: function (params) {
        var self = this;
        var properties = self.properties;

        return self.dataService.getGridExportUrl({
            idRender: properties.id,
            xpathContext: properties.xpathContext || "",
            idPageCache: properties.idPageCache,
            disposition: params.disposition,
            exportType: params.exportType,
            sort: properties.sort,
            sessionId: self.getSessionId(),
            idForm: self.getFormContainer().properties.id

        });
    },

    submitForGridChange: function () {
        var self = this;
        return self.submitOnChange(null, false);
    },

    dispose: function () {
        var self = this;

        setTimeout(function () {
            if (self.columns) {
                $.each(self.columns, function (i, column) {
                    column.dispose();
                });
            }
        }, bizagi.override.disposeTime || 50);

        // Call base
        self._super();
    },

    getEnabledChecks: function (params) {
        var self = this;
        var properties = self.properties;
        params = params || {};
        $.extend(params, {
            url: properties.dataUrl,
            xpath: properties.xpath,
            idRender: properties.id,
            xpathContext: properties.xpathContext,
            contexttype: properties.contextType,
            idPageCache: properties.idPageCache,
            rows: properties.rowsPerPage,
            xpathfilter: params.xpath
        });
        // Default ajax call
        var defer = new $.Deferred();
        // Resolve with remote data
        self.dataService.multiaction().getGridDataExclusivesSelected(params).done(function (data) {
            // Resolve with fetched data
            properties.page = data.page;
            properties.records = data.records;
            properties.totalPages = data.totalPages;

            // Check RTL
            if (self.isRTL()) {
                data.rows = self.changeOrderData(data.rows);
            }
            defer.resolve(data);
        });
        return defer.promise();
    },

    buildCellXpathFilter: function (key) {
        if (bizagi.util.isNumeric(key)) return "[id=" + key + "]";
        return "[id='" + key + "']";
    }
});
