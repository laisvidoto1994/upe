/*
 *   Name: BizAgi Desktop Render Grid Extension
 *   Author: oscaro
 *   Comments:
 *   -   This script will redefine the grid render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.grid.extend("bizagi.rendering.grid.bizagi", {}, {
    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        self.showActionColumn(data);
        // Create a single instance for each cell
        data.properties.singleInstance = false;

        // Call base
        this._super(data);

        // Create a data-structure to keep track of each cell properties
        this.cellMetadata = {};

        // Create a collection to save grid cell changes to execute after it is loaded
        this.pendingActions = [];

        // Fill default properties
        var properties = this.properties;
        var form = self.getFormContainer();

        // set collapse grid
        this.collapseState = properties.collapseState;

        // Just apply display-type: vertical, align it to the left
        properties.displayType = "vertical";
        properties.labelAlign = "left";

    },

    /*
      If grid has allow some action (Delete, Edit or Detail action), show the action column in grid render.
     */
    showActionColumn: function (data) {
        var self = this;
        var mode = self.getMode();
        var editableGrid = bizagi.util.parseBoolean(data.properties.editable) != null ? bizagi.util.parseBoolean(data.properties.editable) : true;
        self.columnActionParams = {
            columnActions:(typeof data.properties.columnActions == "undefined") ? false : true,
            allowDelete: (typeof data.properties.allowDelete == "undefined" && editableGrid) ? true : false,
            allowEdit: (typeof data.properties.allowEdit == "undefined" && editableGrid) ? true : false,
            allowDetail: (typeof data.properties.allowDetail == "undefined") ? false : true,
            withEditForm: (typeof data.properties.withEditForm == "undefined") ? false : true
        };
        if (self.hasActions() && mode == "execution") {
            var actionsColumn = {
                "render": {
                    "properties": {
                        "id": "e51580f3-fd6c-49c0-8c69-73dff93723e5",
                        "type": "columnActions",
                        "xpath-column": "constant(\"\")",
                        "displayName": "",
                        "submitOnChange": false,
                        "totalize": {
                            "format": {}
                        },
                        "hasTotalizer": false,
                        "preventDefault": true,
                        "columnwidth": "90px"
                    }
                }
            };
            data.elements.push(actionsColumn);
            self.spliceRowData(data.properties.data);
        }
    },
    /*
     *   hasActions
     */
    hasActions: function (columnActionParams) {
        var self = this;
        if (typeof(columnActionParams) === undefined) {
            return false;
        }
        return self.columnActionParams.columnActions && (self.columnActionParams.allowDelete || (self.columnActionParams.allowEdit && self.columnActionParams.withEditForm ) || self.columnActionParams.allowDetail);
    },

    getGridTemplate: function () {
        return this.renderFactory.getTemplate("grid.bizagi");
    },
    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this,
            properties = self.properties,
            control = self.getControl(),
            mode = self.getMode();

        // Call base 
        this._super();

        // Find component holder
        var grid = self.grid = $(">div", control);
        // Build column metadata
        var columns = self.buildColumnModel();

        // Hide common label
        self.getLabel().hide();

        self.applyGridPlugin();

        // Set initial data
        if (properties.data) {
            if (properties.data == "" || (properties.data.rows).length == 0 && properties.data.page > 1) {
                self.fetchData(undefined, self.sortBy, self.sortType);

            } else {
                self.updateData(properties.data);

                // Trigger change in order to start up the actions when the controls is ready
                $.when(self.ready())
                    .done(function () {
                        self.triggerRenderChange({ changed: false });
                    });
            }
        }

        self.initialLoadDone = true;
        for (var i in self.pendingActions) {
            if (typeof self.pendingActions[i].method == "function") {
                self.pendingActions[i].method.apply(self, self.pendingActions[i].arguments);
            }
        }

        // Set tooltip
        var buttonsComponent = $("[data-bizagi-component='buttons'] li[title!='']", self.getControl());
        buttonsComponent.tooltip();

        buttonsComponent = $("[data-bizagi-component='cellContent'] button[title!='']", self.getControl());
        buttonsComponent.tooltip();

        //apply columns width
        self.applyColumnsWidth(grid, columns);
    },

    /*
    * Apply grid plugin
    */
    applyGridPlugin: function () {
        var self = this,
            grid = self.grid,
            properties = self.properties,
            mode = self.getMode();

        var pager = self.renderFactory.getTemplate("bizagi.grid.pagination");

        grid.bizagi_grid_desktop({
            columns: self.buildColumnModel(),
            showSummary: properties.showSummary,
            title: properties.displayName,
            mode: self.getMode(),
            tableCssClass: "",
            sortBy: properties.sortBy || "",
            collapse: (mode !== "execution") ? false : true, // por defecto las grillas seran colapsables en ejecucion
            collapseState: (mode !== "execution") ? false : self.collapseState,
            buttonsPst: (mode !== "execution") ? false : properties.buttonsPst,
            sortOrder: properties.sortOrder || "",
            smartPagination: true,
            sortType: bizagi.override.gridDefaultSortBy || "asc",
            headerStyles: self.getHeaderStyles(),
            orientation: properties.orientation || "ltr",
            template: {
                grid: self.renderFactory.getTemplate("bizagi.grid.grid"),
                gridRtl: self.renderFactory.getTemplate("bizagi.grid.grid.rtl"),
                waiting: self.renderFactory.getTemplate("bizagi.grid.waiting"),
                table: self.renderFactory.getTemplate("bizagi.grid.table"),
                emptyTable: self.renderFactory.getTemplate("bizagi.grid.table.empty"),
                column: self.renderFactory.getTemplate("bizagi.grid.column"),
                specialColumn: self.renderFactory.getTemplate("bizagi.grid.column.special"),
                row: self.renderFactory.getTemplate("bizagi.grid.row"),
                rowButtons: self.renderFactory.getTemplate("bizagi.grid.row.buttons"),
                rowButtonsRtl: self.renderFactory.getTemplate("bizagi.grid.row.buttons.rtl"),
                cell: self.renderFactory.getTemplate("bizagi.grid.cell"),
                specialCell: self.renderFactory.getTemplate("bizagi.grid.cell.special"),
                pager: pager,
                buttons: self.renderFactory.getTemplate("bizagi.grid.buttons"),
                buttonsRtl: self.renderFactory.getTemplate("bizagi.grid.buttons.rtl"),
                dynamicPager: self.renderFactory.getTemplate("bizagi.grid.dynamicpager"),
                summary: self.renderFactory.getTemplate("bizagi.grid.summary"),
                summaryCell: self.renderFactory.getTemplate("bizagi.grid.summaryCell"),
                exportOptions: self.renderFactory.getTemplate("bizagi.grid.exportOptions"),
            },
            actions: {
                add: properties.allowAdd,
                edit: (properties.allowEdit && properties.withEditForm && properties.data != null),
                remove: properties.allowDelete,
                details: properties.allowDetail,
                inlineAdd: properties.inlineAdd,
                allowMore: properties.allowMore,
                enableXlsExport: properties.enableXlsExport,
                enablePdfExport: properties.enablePdfExport,
            },
            tooltips: {
                addLabel: properties.addLabel,
                editLabel: properties.editLabel,
                deleteLabel: properties.deleteLabel,
                detailLabel: properties.detailLabel,
                exportOptionsLabel: properties.exportOptionsLabel,
            },
            isValid: function () {
                // Validate records 
                var errorsMessage = [];
                var form = self.getFormContainer();

                // fix for SUITE-8696
                if (form.validationController !== undefined) {
                    form.validationController.clearValidationMessages();
                }

                self.isValid(errorsMessage);

                if (errorsMessage.length > 0) {
                    // Show validation message
                    for (var i = 0; i < errorsMessage.length; i++) {
                        form.validationController.showValidationMessage(errorsMessage[i].message, errorsMessage[i].xpath);
                    }

                    return false;
                } else {
                    return true;
                }
            },
            pageRequested: function (ui) {
                if (mode != "execution") {
                    return;
                }

                if(self.changes && Object.keys(self.changes).length >= 1) {
                    $.when(self.getFormContainer().saveForm()).done(function () {
                        self.sortRequestedPage(ui);
                    });
                }else{
                    self.sortRequestedPage(ui);
                }
            },
            sortRequested: function (ui) {
                if (mode != "execution" || typeof ui.sortBy === "undefined") {
                    return;
                }

                // Get column sort xpath
                var sortName;
                var getColumn = self.getColumn(ui.sortBy);
                if (getColumn) {
                    sortName = getColumn.getSortName();
                } else {
                    getColumn = self.getColumn(ui.sortBy.split(".")[0]);
                    if (getColumn) {
                        sortName = getColumn.getSortName();
                    }
                }

                if (ui.sortBy.split(".").length > 1) {
                    if (ui.sortBy.split(".")[0] == sortName) {
                        sortName = ui.sortBy;
                    }
                }

                // Perform the sort
                self.fetchData(ui.page, sortName, ui.sortType);
            },
            drawCell: function (ui) {
                return self.drawCell(ui.column, ui.key, ui.value, ui.isNewRow);
            },
            cellReady: function (ui) {
                return self.onCellReady(ui.column, ui.key, ui.cell, ui.isNewRow);
            },
            rowSelected: function (ui) {
                if (mode != "execution") {
                    return;
                }
                self.triggerHandler("rowSelected", { id: ui.key });
            },
            addRow: function () {
                if (mode != "execution") {
                    return;
                }
                self.addRow.apply(self, arguments);
            },
            editRow: function (ui) {
                if (mode != "execution") {
                    return;
                }

                if (self.properties.withEditForm) {
                    self.editRow(ui.key);
                }
            },
            deleteRow: function (ui) {
                if (mode != "execution") {
                    return;
                }
                self.deleteRow(ui.key);
            },
            moreRows: function (ui) {
                if (mode != "execution") {
                    return;
                }
                self.moreRows(ui);
            },
            saveAddedRows: function (ui) {
                self.saveInlineAddedRows(ui.keys);
            },
            beforeInlineAdd: function () {
                self.inlineAddDeferred = new $.Deferred();
            },
            afterInlineAdd: function () {
                if (self.inlineAddDeferred) {
                    self.inlineAddDeferred.resolve();
                    self.properties.canBeExported = $("li[data-action='save']", self.grid).is(":visible") ? false : true;
                }
            },
            showFormDetails: function (id) {
                self.showFormDetails(id.key);
            },
            cancelEdition: function (ui) {
                self.removeNewRecords(ui);
            },
            removeNewRecords: function (ui) {
                self.removeNewRecords(ui);
            },
            showGridExportOptions: function () {
                self.showGridExportOptions();
            },
            performExportGrid: function (printParams) {
                self.performExportGrid(printParams);
            },
            performCollapseGrid: function () {
                self.performCollapseGrid();
            }
        });

    },

    /*
    *   Triggers the grid plugin event
    */
    triggerGridPluginHandler: function () {
        var self = this;
        var args = Array.prototype.slice.call(arguments, 0);

        return self.grid.bizagi_grid_desktop.apply(self.grid, args);
    },

    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function () {
        var self = this;

        // Do the same as the post-render            
        self.postRender();
    },
    /**
    *   Creates the column model required to initialize the grid plugin
    */
    buildColumnModel: function () {
        var self = this,
            properties = self.properties,
            columns = self.columns;

        // Create id column first
        var keyColumn = {
            name: "id",
            index: 0,
            label: "id",
            hidden: true,
            key: true
        };

        // Add to column model
        var columnModel = [];
        columnModel.push(keyColumn);

        $.each(columns, function (index, column) {

            // Set grid column
            column.columnIndex = index + 1;
            //   column.properties.cssclass = self.getAlignClass('right');

            var columnLabel = !bizagi.util.isEmpty(column.properties.displayName) ? column.properties.displayName : " ";
            var gridColumn = {
                name: column.properties.xpath,
                index: index + 1,
                label: columnLabel,
                key: false,
                hidden: (!column.properties.visible || column.properties.type == "columnHidden" || column.properties.columnVisible == false),
                summarizeBy: (column.properties.totalize && column.properties.totalize.operation ? column.properties.totalize.operation : undefined),
                bizAgiProperties: column.properties
            };

            columnModel.push(gridColumn);
        });

        return columnModel;
    },
    /**
    * Makes the grid to refresh
    */
    refresh: function () {
        var self = this;
        if (self.parent && self.parent.properties && self.parent.properties.searchParams && self.parent.properties.searchParams.searchTriggeredBy) {
            self.fetchData(1);
        } else {
            self.fetchData();
        }
    },
    /*
    *   Holds the execution until the grid data is ready after a load operation
    */
    dataReady: function () {
        var self = this;

        return self.dataReadyDeferred != null ? self.dataReadyDeferred.promise() : null;
    },
    /*
    * Update data from local changes
    */
    loadChanges: function (rows) {
        var self = this;
        var idRow = [], i;
        // get data from the rows
        for (i = 0; i < rows.length; i++) {
            idRow.push([rows[i][0], i]); // save id and index
        }
        for (i = 0; i < idRow.length; i++) {
            var properties = self.changes[idRow[i][0]];
            var index;
            // search for changes
            if (properties !== undefined) {
                var xpath, columnNumber;
                index = idRow[i][1];
                // update all properties in data
                for (xpath in properties) {
                    if (properties.hasOwnProperty(xpath)) {
                        columnNumber = self.getColumn(xpath).columnIndex;
                        rows[index][columnNumber] = properties[xpath];
                    }
                }
            }
        }
    },
    /*
    *   Method to set data and update the grid
    */
    updateData: function (data) {
        var self = this;
        var grid = self.grid;
        var columns = self.columns;

        // Set value in control
        if (data) {
            self.properties.data = data;
            self.setCellOverrides(data, columns);
            self.triggerGridPluginHandler("setData", data);

            //apply columns width
            self.applyColumnsWidthUpdate(grid, columns);
        }
    },
    /*
    *   Method to fetch data from the server and then update the data
    */
    fetchData: function (page, sortBy, sortType) {
        var self = this;
        var properties = self.properties;
        self.dataReadyDeferred = new $.Deferred();
        self.sortBy = sortBy;
        self.sortType = sortType;

        // Define defaults
        page = page || (properties.page || 1);
        sortBy = sortBy || (properties.sortBy || "id");
        sortType = sortType || (properties.sortOrder || "asc");

        // Update control properties
        properties.page = page;
        properties.sortBy = sortBy;
        properties.sortType = sortType;
        properties.sort = sortBy + " " + sortType;

        // Start loading to avoid multiple calls to the server
        self.startLoading();

        $.when(self.getRemoteData())
            .then(function (data) {
                self.endLoading();
                if (self.disposed) return;
                if (data) {
                    if (self.hasActions()) {
                        self.spliceRowData(data);
                    }
                    $.each(self.columns, function (i, column) {
                        var columnProperties = column.properties;
                        if(columnProperties.type==="columnLabel"){
                            self.spliceRowData(data,i+1);
                        }
                    });
                    if (self.isRTL()) {
                        //remove one extra column from backend. A unnecessary guid to Front-End.
                        //In BPM Project a note says:
                        ////NOTES: At this time there is no way to know whether an Entity has Localized attributes,
                        ////so, the Query Engine will always get Guid values for every Parametric Entity
                        data.rows = self.removeRemainingColumns(data.rows, self.columns.length);

                        data.rows = self.changeOrderData(data.rows);
                    }
                    self.loadChanges(data.rows);
                    self.updateData(data);
                    if (self.properties.changed !== false || self.properties.method === "delete") {
                        self.triggerRenderChange();
                        delete self.properties.changed;
                        delete self.properties.method;
                    }
                    self.dataReadyDeferred.resolve();
                }
            });
    },
    /*
    *   Returns a promise that will resolve when the element is ready to save
    */
    isReadyToSave: function () {
        var self = this;

        // Save pending inline add rows
        if (self.grid && self.properties.inlineAdd && self.properties.allowEdit) {
            var newKeys = self.triggerGridPluginHandler("getNewRowKeys");
            var errorsMessage = [];
            var form = self.getFormContainer();

            // Save new rows then save the whole screen
            if (newKeys.length > 0 && self.isValid(errorsMessage)) {
                self.properties.alreadySaved = true;
                return self.saveInlineAddedRows(newKeys, true);
            }

            if (errorsMessage.length > 0) {
                // Show validation message
                var errDef = $.Deferred();
                for (var i = 0; i < errorsMessage.length; i++) {
                    form.validationController.showValidationMessage(errorsMessage[i].message, errorsMessage[i].xpath);
                }                
                errDef.reject("error");
                return errDef.promise();
            }
        }

        return null;
    },
    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectData: function (renderValues) {
        var self = this;
        var grid = self.grid;
        var errorsMessage = [];

        // Save pending inline add rows
        if (self.grid && (self.properties.inlineAdd || self.properties.inlineEdit)) {

            try {
                var newKeys = self.triggerGridPluginHandler("getNewRowKeys");
            } catch (e) {
                newKeys = [];
            }

            // Save new rows then save the whole screen
            if (newKeys.length > 0 && !self.properties.alreadySaved && self.isValid(errorsMessage)) {
                var saveDeferred = self.saveInlineAddedRows(newKeys, true);

                // Add to deferred collections in order to sync when saving
                renderValues.deferreds = renderValues.deferreds || [];
                renderValues.deferreds.push(saveDeferred);
            }

            // Remove adding keys from current changes
            for (var i = 0; i < newKeys.length; i++) {
                if (self.changes[newKeys[i]]) {
                    delete self.changes[newKeys[i]];
                }
            }
        }

        // Call base method
        self._super(renderValues);
    },
    sortRequestedPage : function(ui) {
        var self = this;
        var sortName;
        var getColumn = self.getColumn(ui.sortBy);
        if (getColumn) {
            sortName = getColumn.getSortName();
        } else {
            getColumn = self.getColumn(ui.sortBy.split(".")[0]);
            if (getColumn) {
                sortName = getColumn.getSortName();
            }
        }

        if (ui.sortBy.split(".").length > 1) {
            if (ui.sortBy.split(".")[0] == sortName) {
                sortName = ui.sortBy;
            }
        }

        self.fetchData(ui.page, sortName, ui.sortType);
    },
    /*
    *   Customizes the content drawing inside the cell
    */
    drawCell: function (column, key, value, isNewRow) {
        var self = this;
        if (column.key) {
            return value;
        }

        // Get render column
        var cellOverride = self.getCellOverride(key, column.index - 1);
        var columnIndex = column.index - 1;
        var renderColumn = self.columns[columnIndex];

        // Fix issue suite-8559, data with null records
        /* console.log(self.newRecords);*/
        self.newRecords = self.newRecords || {};

        // Get cell properties
        if (!self.cellMetadata[key]) {
            self.cellMetadata[key] = {};
        }
        if (!self.cellMetadata[key][columnIndex]) {
            self.cellMetadata[key][columnIndex] = {};
        }
        var properties = self.cellMetadata[key][columnIndex].properties || renderColumn.originalProperties;
        var visible = properties.visible !== undefined ? properties.visible : true;
        var editable = properties.editable !== undefined ? properties.editable : true;


        // Apply overrides from cellOverrides
        visible = cellOverride.visible;
        editable = (properties.editable) ? cellOverride.editable : false;

        // Show editable cell when we are performing inline add operation
        if (isNewRow && column.bizAgiProperties.type !== "columnFormLink"){ /*FIX: QAF-1883*/
            editable = true;
        }

        renderColumn.properties.displayType = 'value';

        if (column.bizAgiProperties.type === "columnActions") {
            editable = true;
        }

        // If the cell we are drawing is the summary cell, we need to make it readonly
        if (key == "summary") {
            editable = false;
        }

        // Do the render
        if (visible) {
            if (editable)
                return self.drawEditableCell(renderColumn, properties, key, value, isNewRow);
            else
                return self.drawReadonlyCell(renderColumn, properties, key, value);

        } else {
            return "<label></label>";
        }
    },
    /*
    *   Draws the editable version for the cell
    */
    drawEditableCell: function (renderColumn, properties, key, value, isNewRow) {
        var self = this;
        var defer = new $.Deferred();

        // Set editable
        var originalEditable = renderColumn.properties.editable;
        renderColumn.properties.editable = true;

        // Fix problem when required property lose
        renderColumn.overrideProperties({ required: properties.required });

        // Render cell
        $.when(renderColumn.render(key, value)).done(function (cell) {
            // Register array with new records, just when this is a newrecord
            if (isNewRow && !self.newRecords[key]) {
                self.newRecords[key] = {};
            }


            // convert all row visible
            for (var j = 0; j < self.columns.length; j++) {
                self.cellOverrides[key] = self.cellOverrides[key] || {};
                self.getCellOverride(key, j).visible = (self.getCellOverride(key, j).visible != undefined) ? self.getCellOverride(key, j).visible : true;
            }

            // Add change handler
            renderColumn.getDecorated(key).bind("renderchange", function (render, args) {
                self.onCellChange(renderColumn, cell, key, args);
            });

            // Resolve cell
            defer.resolve(cell);
        });

        // Restore editable
        renderColumn.properties.editable = originalEditable;

        // Return promise
        return defer.promise();
    },
    /*
    *   Draws the readonly version for the cell
    */
    drawReadonlyCell: function (renderColumn, properties, key, value) {
        var self = this;
        var result = "";

        // Use totalizer format when printing summary row
        if (key == "summary") {
            var originalFormat = renderColumn.properties.textFormat;
            if (renderColumn.properties.totalize) {
                renderColumn.properties.textFormat = renderColumn.properties.totalize.format;
            }

            result = renderColumn.renderSummary(key, value);

            // Restore column format
            renderColumn.properties.textFormat = originalFormat;
        } else {
            result = renderColumn.renderReadOnly(key, value);
        }
        return result;
    },
    /*
    *   Defines the handler when a cell changes its value
    */
    onCellChange: function (renderColumn, cell, key, args) {
        var self = this;
        var _value = renderColumn.getValue(key);
        var compositeValue = renderColumn.getCompositeValue(key);

        var isNewRecord = self.triggerGridPluginHandler("isNewRecord", key);
        var newKeys, errorsMessage = [];
        var trigger = isNewRecord ? false : true;

        try {
            if (renderColumn.properties.type == "columnDate" && renderColumn.data.properties.showTime == true) {

                if (!bizagi.util.isEmpty(_value)) {
                    var date = bizagi.util.dateFormatter.getDateFromInvariant(_value, true);
                    //date.setHours(0, 0, 0, 0);
                    _value = bizagi.util.dateFormatter.formatInvariant(date, true);
                } else if (_value === "") {
                    _value = "";
                }
            } else {
                if (renderColumn.properties.type == "columnDate") {

                    if (!bizagi.util.isEmpty(_value)) {
                        var date = bizagi.util.dateFormatter.getDateFromInvariant(_value, false);
                        date.setHours(0, 0, 0, 0);
                        _value = bizagi.util.dateFormatter.formatInvariant(date, true);
                    } else if (_value === "") {
                        _value = "";
                    }
                } else {
                    if (renderColumn.properties.type === "columnSearch") {
                        if (isNewRecord && self.properties.inlineAdd && self.properties.submitOnChange) {
                            self.collectGridChange($.extend(args, {
                                id: key,
                                xpath: renderColumn.properties.xpath || renderColumn.properties.id,
                                value: _value,
                                compositeValue: compositeValue,
                                columnIndex: renderColumn.columnIndex,
                                trigger: trigger
                            }));

                            try {
                                newKeys = self.triggerGridPluginHandler("getNewRowKeys");
                            } catch (e) {
                                newKeys = [];
                            }

                            args.render.startActionExecution();

                            var saveDeferred = self.saveInlineAddedRows(newKeys, true);
                            // Remove adding keys from current changes
                            for (var i = 0; i < newKeys.length; i++) {
                                if (self.changes[newKeys[i]]) {
                                    delete self.changes[newKeys[i]];
                                }
                            }
                            $.when(saveDeferred).done(function(){
                                args.render.endActionExecution();
                            });
                            return;
                        }
                    }
                }
            }

            var isExclusiveControl = renderColumn.properties.type == "columnBoolean" && renderColumn.properties.isExclusive;
            if (!isExclusiveControl && (self.properties.allowEdit || isNewRecord)) {
                self.collectGridChange($.extend(args, {
                    id: key,
                    xpath: renderColumn.properties.xpath || renderColumn.properties.id,
                    value: _value,
                    compositeValue: compositeValue,
                    columnIndex: renderColumn.columnIndex,
                    trigger: trigger
                }));
            }

            // Update change in grid's component data
            self.triggerGridPluginHandler("changeCellValue", key, renderColumn.columnIndex, _value);

            // If the column has totalizers then we need to refresh the summary
            if (renderColumn.properties.totalize && renderColumn.properties.totalize.operation) {
                self.triggerGridPluginHandler("refreshSummary", renderColumn.columnIndex);
            }
        } catch (error) {
            bizagi.log(error.message);
        }
    },
    /*
    *   Executes when the cell is ready and inserted into the DOM
    */
    onCellReady: function (column, key, cell, isNewRow) {
        var self = this;

        // Get render column
        var columnIndex = column.index - 1;
        var cellOverride = self.getCellOverride(key, columnIndex);
        var renderColumn = self.columns[columnIndex];
        var properties = self.cellMetadata[key][columnIndex].properties || renderColumn.originalProperties;
        var visible = properties.visible !== undefined ? properties.visible : true;
        var editable = properties.editable !== undefined ? properties.editable : true;

        // apply overrides
        visible = cellOverride.visible;

        // If the cell we are drawing is the summary cell, we need to make it readonly
        if (key == "summary")
            editable = false;

        // Show editable cell when we are performing inline add operation
        if (isNewRow) {
            editable = true;
        }

        // Show editable cell when we are performing inline add operation
       if (column.bizAgiProperties.type==="columnActions") {
            editable = true;
        }

        if (visible) {

            var aligningClass = (properties.columnAlign) ? properties.columnAlign : "center";
            var titleAligningClass = (properties.columntitlealign) ? properties.columntitlealign : "center";

            self.changeTitleAligningClass(column.index, titleAligningClass);
            self.changeAligningClass(cell, aligningClass);

            if (editable) {

                // Set editable
                var originalEditable = renderColumn.properties.editable;
                renderColumn.properties.editable = editable;

                // Set xpath context for submitonchange action
                if (renderColumn.properties.submitOnChange) {
                    var control = renderColumn.getDecorated(key);
                    if (control) {
                        control.properties.submitOnChangexpathContext = self.properties.xpath + "[]";
                        control.properties.submitOnChangexpathContextRow = self.properties.xpath + "[id=" + key + "]";
                    }
                }

                // Execute cell post render
                renderColumn.postRender(key, cell);

                // Restore editable
                renderColumn.properties.editable = originalEditable;

            } else {

                if (key == "summary") {
                    //apply styles to summary cells
                    if (!renderColumn.postRenderSummary(key, cell)) {
                        self.applySummaryColumnStyles(cell, properties);
                    }

                } else {
                    // Call post-render
                    renderColumn.postRenderReadOnly(key, cell);
                }

            }

        }
    },

    /*
    *
    * Change title aligning class
    */
    changeTitleAligningClass: function (index, titleAligningClass) {
        var self = this;
        var control = self.getControl();

        $.when(self.ready()).
            done(function () {
                var columnTitle = $('[data-bizagi-component=columns]', control).find('[data-column-index="' + index + '"]');
                columnTitle.addClass(self.getTitleAlignClass(titleAligningClass));
            });

    },

    /*
    *
    * Change aligning class
    */
    changeAligningClass: function (cell, aligningClass) {

        var self = this;
        cell.addClass(self.getAlignClass(aligningClass));

    },
    /*
    *   Get title aligning class
    */
    getTitleAlignClass: function (alignType) {


        switch (alignType) {
            case 'right':
                return "ui-bizagi-grid-title-align-right";
                break;
            case 'left':
                return "ui-bizagi-grid-title-align-left";
                break;
            case 'center':
                return "ui-bizagi-grid-title-align-center";
                break;
            case 'justify':
                return "ui-bizagi-grid-title-align-justify";
                break;
        }

    },
    /*
    *   Get aligning class
    */
    getAlignClass: function (alignType) {


        switch (alignType) {
            case 'right':
                return "ui-bizagi-grid-align-right";
                break;
            case 'left':
                return "ui-bizagi-grid-align-left";
                break;
            case 'center':
                return "ui-bizagi-grid-align-center";
                break;
            case 'justify':
                return "ui-bizagi-grid-align-justify";
                break;
        }

    },
    /**
    *  Adds a row to the grid
    */
    addRow: function (addFormDialog) {
        var self = this;
        var properties = self.properties;
        var reverseButtons = properties.orientation == "rtl" ? true : false;
        var buttons = [];

        if (addFormDialog) {
            // Send add request
            if (addFormDialog.open) {
                return;
            } else {
                addFormDialog.open = true;
            }
        }
        $.when(self.submitAddRequest())
            .done(function (newid) {

                // Show dialog with new form after that
                var dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
                    title: properties.addLabel,
                    orientation: properties.orientation || "ltr",
                    onSave: function (data) {
                        if (properties.contextType) {
                            data[self.dataService.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = properties.contextType;
                        }
                        return self.submitSaveRequest(newid, data);
                    },
                    onCancel: function () {
                        //self.submitRollbackRequest();
                    }
                });

                buttons[0] = {
                    text: bizagi.localization.getResource("render-form-dialog-box-save"),
                    click: function (data) {
                        if (properties.contextType) {
                            data[self.dataService.Class.BA_CONTEXT_PARAMETER_PREFIX + "contexttype"] = properties.contextType;
                        }
                        return self.submitSaveRequest(newid, data);
                    }
                }

                buttons[1] = {
                    text: bizagi.localization.getResource("render-form-dialog-box-cancel"),
                    click: function () {
                        self.submitRollbackRequest();
                    }
                }

                if (reverseButtons)
                    buttons.reverse();

                var recordXpath = properties.xpath + "[id=" + newid + "]";
                dialog.render({
                    idRender: properties.id,
                    recordXPath: recordXpath,
                    xpathContext: properties.xpathContext,
                    idPageCache: properties.idPageCache,
                    requestedForm: "addForm",
                    contextType: properties.contextType,
                    url: properties.addPage
                })
                .done(function () {
                    // Set loading status
                    self.startLoading();

                    if (!properties.submitOnChange) {
                        // Reload grid
                        self.fetchData();

                    } else {
                        // Submits the entire form
                        self.submitOnChange().always(function () {
                            self.endLoading();
                        });
                    }
                })
                .fail(function () {
                    addFormDialog.open = false;
                    self.submitRollbackRequest();
                });
            });
    },
    /**
    *  Edits a row in the grid with Form
    *
    */
    editRow: function (id) {

        if (id == 0 || id == undefined) {
            bizagi.showMessageBox(bizagi.localization.getResource("render-grid-message-no-selected-row"), bizagi.localization.getResource("render-grid-header-no-selected-row"));
            return;
        }

        var self = this;
        var properties = self.properties;

        //Checks if there is any pending changes in the selected row
        if (self.changes[id] !== undefined) {

            var data = $.extend(self.changes[id], {});
            data.idPageCache = properties.idPageCache;
            data.disableServerGridValidations = true;

            $(".ui-tooltip").remove();

            $.when(self.submitSaveRequest(id, data)).done(function () {

                // Set loading status
                self.startLoading();

                if (!properties.submitOnChange) {
                    // Reload grid
                    self.fetchData();

                } else {
                    // Submits the entire form
                    self.submitForGridChange().always(function () {
                        self.endLoading();

                        // Send edit request
                        self.executeSubmitEditRequest(id);
                    });
                }
            });
        }
        else {
            self.executeSubmitEditRequest(id);
        }
    },


    /*
    * Gets the format header and builds a object with a css string for label and header
    */
    getHeaderStyles: function () {
        var self = this,
            label = "",
            header = "",
            properties = self.properties;

        if (properties.headerFormat) {
            var format = properties.headerFormat;

            if (format.color) {
                label += "color: " + format.color + ";";
            }

            if (format.background) {
                header += "background-color: " + format.background + ";";
            }

            if (format.bold) {
                label += "font-weight: bold; ";
            }

            if (format.italic) {
                label += "font-style: italic; ";
            }

            if (format.underline || format.strikethru) {
                var strikethru = bizagi.util.parseBoolean(format.strikethru) ? "line-through " : "";
                var underline = bizagi.util.parseBoolean(format.underline) ? "underline " : "";

                label += "text-decoration: " + strikethru + underline + ";";
            }

            if (format.size && format.size != "0") {
                var newFontSize = (100 + Number(format.size) * 10) + "%";
                label += "font-size: " + newFontSize + ";";
            }

        }

        return {
            label: label,
            header: header
        };
    },
    /**
    * Deprecated method
    *
    * Edit record without form
    * @param int id
    * @returns
    */
    editInlineRow: function (id) {
        var self = this;
        var control = self.getControl();


        if (id == 0 || id == undefined) {
            bizagi.showMessageBox(bizagi.localization.getResource("render-grid-message-no-selected-row"), bizagi.localization.getResource("render-grid-header-no-selected-row"));
            return;
        }

        // Show save and cancel buttons
        var buttons = $("[data-bizagi-component=buttons]", control);
        buttons.find("[data-action=save]").css("display", "inline-block");
        buttons.find("[data-action=cancel]").css("display", "inline-block");

        // Change row to editable
        self.changeRowEditable(id, true);

    },
    /*
    * Change all cells in the row
    */
    changeRowEditable: function (id, editable) {

        // NOT IMPLEMENTED YET, ITS NOT POSIBLE CHANGE NO EDITABLE CELL TO EDITABLE
        /* DRAFT 
        var self = this;

        for (var j = 0; j < self.columns.length; j++) {
        var cellValue = self.getCellValue(id, self.columns[j].properties.xpath);
        var container = self.grid.bizagi_grid('getCell', id, self.columns[j].properties.xpath, cellValue);
        var cell = self.columns[j];

        cell.overrideDecoratedRenderProperties({editable: editable});

        cell.postRender($('"[data-bizagi-component=cells]"',container));
        self.postRender();
        cell.postRender();
        console.log(cell.getControl());
        // Change visibility
        if (visible == true) {
        cell.show();
        } else {
        cell.hide();
        }
        cell.editable = true;
        cell.css('background-color','red');

        self.cellOverrides[id] = self.cellOverrides[id] || {};
        self.getCellOverride(id, j).visible = visible;
        }*/
    },
    /*
    *   Changes the background for a cell
    */
    changeCellBackgroundColor: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {
            var control = self.getControlCell(key, xpath);
            if (control) {
                control.changeCellBackgroundColor(argument);
            }
        } else {
            self.pendingActions.push({
                method: self.changeCellBackgroundColor,
                arguments: arguments
            });
        }


    },
    /*
    *   Changes the background for a cell
    */
    changeCellColor: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {
            var control = self.getControlCell(key, xpath);
            if (control)
                control.changeCellColor(argument);
        } else {
            self.pendingActions.push({
                method: self.changeCellColor,
                arguments: arguments
            });
        }
    },
    /*
    *   Changes the visibility for a cell
    */
    changeCellVisibility: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {

            var control = self.getControlCell(key, xpath);
            if (control) {
                control.changeCellVisibility(argument);
                for (var j = 0; j < self.columns.length; j++) {
                    if (self.columns[j].properties.xpath == xpath) {
                        break;
                    }
                }
                self.cellOverrides[key] = self.cellOverrides[key] || {};
                self.getCellOverride(key, j).visible = argument;
            }
        } else {
            self.pendingActions.push({
                method: self.changeCellVisibility,
                arguments: arguments
            });
        }
    },

    /*
    *   Changes the editability for a cell
    */
    changeCellEditability: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {

            var control = self.getControlCell(key, xpath);
            if (control && control.control) {
                control.changeEditabilityCellControl(argument, key, xpath);
                //control.changeEditability(argument);
                for (var j = 0; j < self.columns.length; j++) {
                    if (self.columns[j].properties.xpath == xpath) {
                        break;
                    }
                }
                self.cellOverrides[key] = self.cellOverrides[key] || {};
                self.getCellOverride(key, j).editable = argument;
            }
        } else {
            self.pendingActions.push({
                method: self.changeEditability,
                arguments: arguments
            });
        }
    },
    /*
    *  Clean data of cell
    */
    cleanCellData: function (key, xpath) {
        var self = this;

        if (self.initialLoadDone) {
            var control = self.getControlCell(key, xpath);
            if (control) {
                control.cleanData();
                for (var j = 0; j < self.columns.length; j++) {
                    if (self.columns[j].properties.xpath == xpath) {
                        break;
                    }
                }
                var rows = self.properties.data.rows, i = 0, rowLength = rows.length;
                for (; i < rowLength; i++) {
                    if (Number(key) === rows[i][0]) {
                        rows[i][j + 1] = [["", ""]];
                        break;
                    }
                }
                self.cellOverrides[key] = self.cellOverrides[key] || {};
                self.getCellOverride(key, j).value = null;
            }
        } else {
            self.pendingActions.push({
                method: self.cleanData,
                arguments: ""
            });
        }
    },
    /*
    *  Changes the required for cell
    */
    changeCellRequired: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {
            var control = self.getControlCell(key, xpath);
            if (control) {
                control.changeCellRequired(argument);
                for (var j = 0; j < self.columns.length; j++) {
                    if (self.columns[j].properties.xpath == xpath) {
                        break;
                    }
                }
                self.cellOverrides[key] = self.cellOverrides[key] || {};
                self.getCellOverride(key, j).required = argument;
            }
        } else {
            self.pendingActions.push({
                method: self.changeCellRequired,
                arguments: arguments
            });
        }
    },
    /*
    *  Changes the required for cell
    */
    changeCellValue: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {
            var control = self.getControlCell(key, xpath);
            if (control) {
                control.setDisplayValue(argument);
                /*ISUPP 3866 */
                var _value = control.column.getValue(key);
                var compositeValue = control.column.getCompositeValue(key);
                control.setDisplayValue(argument);
                var trigger = false;
                control.triggerHandler("renderchange", { render: self, changed: true });
                self.collectGridChange({ id: key, xpath: xpath, value: _value, compositeValue: compositeValue, columnIndex: control.column, trigger: trigger });
            }
        } else {
            self.pendingActions.push({
                method: self.setDisplayValue,
                arguments: arguments
            });
        }

    },
    /*
     *   Changes the max value for a cell
     */
    changeCellMaxValue: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {
            var control = self.getControlCell(key, xpath);
            if (control) {
                control.changeMaxValue(argument);
            }
        } else {
            self.pendingActions.push({
                method: self.changeMaxValue,
                arguments: arguments
            });
        }


    },
    /*
     *   Changes the min value for a cell
     */
    changeCellMinValue: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {
            var control = self.getControlCell(key, xpath);
            if (control) {
                control.changeMinValue(argument);
            }
        } else {
            self.pendingActions.push({
                method: self.changeMinValue,
                arguments: arguments
            });
        }


    },
    /**
    *  Deletes  a row to the grid
    */
    deleteRow: function (id) {
        if (!id || id == 0) {
            bizagi.showMessageBox(bizagi.localization.getResource("render-grid-message-no-selected-row"), bizagi.localization.getResource("render-grid-header-no-selected-row"));
            return;
        }
        var self = this;
        bizagi.showConfirmationBox(this.getResource("render-grid-delete-confirmation"))
            .done(function () {
                // Do a grid record deletion
                $.when(self.submitDeleteRequest(id))
                    .done(function (data) {
                        // Remove temporal record
                        self.removeNewRecords({ keys: [id] });

                        // Check if the answer of request was valid
                        // if there an rule validation on delete action, the answer could be invalid
                        // data.type == "validationMessage"
                        if (data.type == "success") {
                            // Trigger the event
                            //'key' must be included to trigger a single call to actions and validations
                            //line 310 bizagi.command.controllers.action
                            self.triggerRenderChange({rowDeleted: true, changed: false, key: id});
                        }

                        // Reload grid
                        self.properties.changed = false;
                        self.properties.method = "delete";
                        
                        self.calculateFetchData(data, id);
                    });
            });
    },

    calculateFetchData: function (data, id) {
        var self = this, rows;
        var properties = self.properties;

        if (data.type === "success") {
            rows = properties.data && properties.data.rows;
            if (rows.length === 1 && rows[0][0] === Number(id)) {
                if (properties.page > 1) {
                    return self.fetchData(properties.page - 1);
                }
            }
        }

        return self.fetchData();
    },

    moreRows: function (ui) {
        var self = this;
        var properties = self.properties;

        if (typeof properties.originalrowsPerPage === "undefined") {
            properties.originalrowsPerPage = properties.rowsPerPage;
        }
        properties.rowsPerPage += properties.originalrowsPerPage;

        var dataToSend = {};
        self.collectData(dataToSend);

        if (jQuery.isEmptyObject(dataToSend)) {
            self.moreRowsCommon(ui);
            return;
        }
        // Send the data
        self.dataService.submitData({
            action: "SUBMITDATA",
            data: dataToSend,
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache
        }).done(function () {
            self.moreRowsCommon(ui);
        });

    },
    moreRowsCommon: function (ui) {
        var self = this;
        var properties = self.properties;

        self.fetchData(ui.page, ui.sortBy, ui.sortType);

        $.when(self.dataReadyDeferred).done(function () {

            if (properties.records != 0)
                if (properties.records + 1 <= properties.rowsPerPage) {
                    $(".ui-bizagi-grid-dynamic-pager", self.getControl()).hide();
                }

        });
    },

    /*
    *
    */
    executeSubmitEditRequest: function (id) {
        var self = this;
        var properties = self.properties;
        var reverseButtons = properties.orientation == "rtl" ? true : false;
        var buttons = [];

        var showSaveButton = self.getFormContainer().properties.displayAsReadOnly == true ? false : true;

        $.when(self.submitEditRequest(id))
            .done(function () {
                // Show dialog with new form after that
                var recordXpath = properties.xpath + "[id=" + id + "]";

                var dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
                    title: properties.editLabel,
                    showSaveButton: showSaveButton,
                    orientation: properties.orientation || "ltr",
                    onSave: function (data) {
                        return self.submitSaveRequest(id, data);
                    }, //Setup the print functionality
                    extraButtons: (bizagi.override.enablePrintFromEditForm) ? {
                        "workportal-widget-dialog-box-print": function () {
                            self.printFormCommand = new bizagi.workportal.command.printform(self.renderFactory);

                            var printParams = {
                                idRender: properties.id,
                                recordXPath: recordXpath,
                                xpathContext: properties.xpathContext,
                                idPageCache: properties.idPageCache,
                                requestedForm: "editForm",
                                contextType: properties.contextType
                            };

                            self.printFormCommand.print(printParams);
                        }
                    } : {}
                });

                buttons[0] = {
                    text: bizagi.localization.getResource("render-form-dialog-box-save"),
                    click: function (data) {
                        return self.submitSaveRequest(id, data);
                    }
                };

                if (reverseButtons)
                    buttons.reverse();

                dialog.render({
                    idRender: properties.id,
                    recordXPath: recordXpath,
                    xpathContext: properties.xpathContext,
                    idPageCache: properties.idPageCache,
                    requestedForm: "editForm",
                    url: properties.editPage,
                    contextType: properties.contextType
                })
                    .done(function () {
                        // Set loading status
                        self.startLoading();

                        if (!properties.submitOnChange) {
                            // Reload grid
                            self.fetchData();

                        } else {
                            // Submits the entire form
                            self.submitOnChange().always(function () {
                                self.endLoading();
                            });
                        }

                    })
                    .fail(function () {
                        self.submitRollbackRequest();
                    });
            });
    },
    /**
    *  Show details with record information
    */
    showFormDetails: function (id) {
        var self = this;
        var properties = self.properties;

        if (id == 0 || id == undefined) {
            bizagi.showMessageBox(bizagi.localization.getResource("render-grid-message-no-selected-row"), bizagi.localization.getResource("render-grid-header-no-selected-row"));
            return;
        }

        var dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
            title: properties.detailLabel || bizagi.localization.getResource("render-grid-details-form"),
            showSaveButton: false,
            cancelButtonLabel: bizagi.localization.getResource("render-form-dialog-box-close")
        });

        // Show dialog with new form after that
        var recordXpath = properties.xpath + "[id=" + id + "]";

        dialog.render({
            idRender: properties.id,
            recordXPath: recordXpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            requestedForm: "detailForm",
            url: properties.editPage,
            editable: false
        });
    },
    /*
    *   Retrieve the data for the new rows and push them into the server
    */
    saveInlineAddedRows: function (keys, bRefresh) {
        var self = this;
        var queue = [];
        bRefresh = bRefresh !== undefined ? bRefresh : true;
        self.dataReadyDeferred = new $.Deferred();

        for (var i = 0; i < keys.length; i++) {
            queue.push(self.prepareAddAction(keys[i]));
        }

        // Set Flag to prevent duplicate records (modal window)
        self.properties.alreadySaved = true;

        // Perform the batch
        return $.when.apply($, queue).done(function (response) {
            // Refresh
            if (bRefresh) {
                self.properties.changed = false;
                self.refresh();
            }
            $.when(self.dataReady()).
                done(function () {
                    self.triggerRenderChange({ changed: false });
                });
        });
    },
    /*
    *   Prepares the add action
    */
    prepareAddAction: function (key) {
        var self = this;
        var properties = self.properties;

        // Build submit data
        var submitData = self.changes[key];

        return self.dataService.multiaction().addGridRecordData({
            url: properties.addUrl,
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
            contexttype: properties.contexttype,
            idPageCache: properties.idPageCache,
            submitData: submitData
        });
    },
    /*
    * Removes invalid records
    */
    removeNewRecords: function (ui) {
        var self = this;

        if (ui && ui.keys) {
            $.each(ui.keys, function (_, key) {
                if (self.newRecords[key]) {
                    delete self.newRecords[key];
                }
            });
        }
    },
    /*
    * Show the print menu options
    */
    showGridExportOptions: function () {
        var self = this, content, exportPst, changes, container;
        var form = self.getFormContainer();
        var expMenuDirection = (self.properties.buttonsPst === true) ? "top" : "bottom";
        if (self.properties.orientation == "rtl") {

            content = self.getControl();
            exportPst = (self.properties.buttonsPst === true) ? $('.ui-bizagi-grid-export-options-wrapper-rtl', content).outerHeight() : -1 * $('.ui-bizagi-grid-export-options-content-rtl', content).outerHeight();
            
            changes = [];

            //Adjust the print options wrapper to the required position, upper the print options button        
            $('.ui-bizagi-grid-export-options-content-rtl', content).css(
                expMenuDirection, exportPst
            );

            if ($('.ui-bizagi-grid-export-options-content-rtl', content).hasClass('hidden')) {
                if (typeof (Windows) != "undefined") {
                    self.grid.find(".bz-rn-grid-data-wraper").addClass("bz-rn-grid-data-wraper-fix-w8-scroll");
                }
                $('.ui-bizagi-grid-export-options-content-rtl', content).removeClass('hidden');
                $('.ui-bizagi-grid-export-options-content-rtl', content).show();
            } else {
                $('.ui-bizagi-grid-export-options-content-rtl', content).addClass('hidden');
                self.grid.find(".bz-rn-grid-data-wraper").removeClass("bz-rn-grid-data-wraper-fix-w8-scroll");
            }
            if (form) {
                container = $(form.container);

                if ((self.hasChanged(changes) && self.properties.alreadySaved === false && form.properties.editable) || (self.properties.canBeExported === false && form.properties.editable)) {
                    if (self.properties.alreadySaved === false && !$("li[data-action='save']", self.grid).is(":visible")) {
                        self.properties.canBeExported = true;
                    } else {
                        //when the table has totalizer counts as change,  although that is not a change
                        if (!(Object.keys(self.changes).length == 1 && self.changes.summary)) {
                            $("#print-grid-save-first", content).show();
                            $("#print-grid-pdf", content).hide();
                            $("#print-grid-xls", content).hide();
                        }
                    }
                } else {
                    self.properties.canBeExported = true;
                }
            }
        } else {

            content = self.getControl();
            exportPst = (self.properties.buttonsPst === true) ? $('.ui-bizagi-grid-export-options-wrapper', content).outerHeight() : -1 * $('.ui-bizagi-grid-export-options-content', content).outerHeight();
            changes = [];

            //Adjust the print options wrapper to the required position, upper the print options button        
            $('.ui-bizagi-grid-export-options-content', content).css(
                expMenuDirection, exportPst
            );

            if ($('.ui-bizagi-grid-export-options-content', content).hasClass('hidden')) {
                if (typeof (Windows) != "undefined") {
                    self.grid.find(".bz-rn-grid-data-wraper").addClass("bz-rn-grid-data-wraper-fix-w8-scroll");
                }
                $('.ui-bizagi-grid-export-options-content', content).removeClass('hidden');
                $('.ui-bizagi-grid-export-options-content', content).show();
            } else {
                $('.ui-bizagi-grid-export-options-content', content).addClass('hidden');
                self.grid.find(".bz-rn-grid-data-wraper").removeClass("bz-rn-grid-data-wraper-fix-w8-scroll");
            }
            if (form) {
                container = $(form.container);

                if ((self.hasChanged(changes) && self.properties.alreadySaved === false && form.properties.editable) || (self.properties.canBeExported === false && form.properties.editable)) {
                    if (self.properties.alreadySaved === false && !$("li[data-action='save']", self.grid).is(":visible")) {
                        self.properties.canBeExported = true;
                    } else {
                        //when the table has totalizer counts as change,  although that is not a change
                        if (!(Object.keys(self.changes).length == 1 && self.changes.summary)) {
                            $("#print-grid-save-first", content).show();
                            $("#print-grid-pdf", content).hide();
                            $("#print-grid-xls", content).hide();
                        }
                    }
                } else {
                    self.properties.canBeExported = true;
                }
            }

        }

    },

    /*
    * Executes collapse grid
    */
    performCollapseGrid: function () {
        var self = this;

        if (self.properties.orientation == "rtl") {
            content = self.getControl(),
            $gridWrapper = $(".bz-rn-grid-wrapper", content),
            $collapseIcon = $(".bz-rn-grid-cn-header-rtl .ui-icon", content);


            $collapseIcon.toggleClass("ui-state-collapse").toggleClass("ui-state-expand");
            $gridWrapper.toggleClass("bz-rn-grid-body-collapse");

            self.collapseState = $gridWrapper.hasClass("bz-rn-grid-body-collapse");
            self.triggerGridPluginHandler("updateCollapseState", self.collapseState);
            self.updateCollapseState();

        } else {
            content = self.getControl(),
            $gridWrapper = $(".bz-rn-grid-wrapper", content),
            $collapseIcon = $(".bz-rn-grid-cn-header .ui-icon", content);

            $collapseIcon.toggleClass("ui-state-collapse").toggleClass("ui-state-expand");
            $gridWrapper.toggleClass("bz-rn-grid-body-collapse");

            self.collapseState = $gridWrapper.hasClass("bz-rn-grid-body-collapse");
            self.triggerGridPluginHandler("updateCollapseState", self.collapseState);
            self.updateCollapseState();
        }
    },
    /*
     * Update collapse grid state
     */
    updateCollapseState: function () {

        var self = this,
            properties = self.properties;

        params = {};

        $.extend(params, {
            url: properties.dataUrl,
            xpath: properties.xpath,
            idRender: properties.id,
            xpathContext: properties.xpathContext,
            contexttype: properties.contextType,
            idPageCache: properties.idPageCache,
            collapseState: self.collapseState
        });

        // example of process property value
        return self.dataService.multiaction().getCollapseData(params);
    },
    /*
    *Executes the grid export
    * @param params (Object) exportType: "pdfExport" Handles the print functionality showing a message warning the user
    * to install Adobe Acrobat, if he haven't installed
    */
    performExportGrid: function (params) {

        var self = this,
            result = true;

        var filePrintUrl = self.getGridExportUrl(params);

        if (params.exportType == "pdfExport") {
            var isAcrobatInstalled = self.checkAdobePlugin();
            if ($.browser.msie && !isAcrobatInstalled) {
                result = false;

                $.when(bizagi.showMessageBox(bizagi.localization.getResource("workportal-acrobat-message")))
                    .done(function () {
                        self.downloadExportedGrid(filePrintUrl);
                    });
            }
        }

        if (result)
            self.downloadExportedGrid(filePrintUrl);
    },

    /*
    * Updates manually the affected cell 
    * @param key: the key of the affected cells's column
    * @param newValue: the new value to store in the affected cell
    * @param columnIndex: the column index of the cells's column
    */
    updateAffectedCellManually: function (key, newValue, columnIndex) {
        var self = this;

        var i = self.columns.length;
        var rowIndex = self.getRowIndexByKey(key);

        //updates the value manually if is different than the current
        if (self.properties.data.rows[rowIndex][columnIndex] !== newValue) {
            self.properties.data.rows[rowIndex][columnIndex] = newValue;

            //Refresh the summary
            var summary = $(".ui-bizagi-grid-summary", self.grid);
            summary.empty();
            summary.html(self.grid.bizagi_grid_desktop("drawSummary"));
            self.grid.bizagi_grid_desktop("postRenderSummary", summary);
        }
    },

    /*
    * Get the row index using the key as a reference
    */
    getRowIndexByKey: function (key) {
        var self = this;
        var i = self.properties.data.rows.length;

        while (i-- > 0) {
            if (key == self.properties.data.rows[i][0]) {
                return i;
            }
        }
    },

    /*
    *   Checks if the Adobe Acrobat is installed
    */
    checkAdobePlugin: function (filePrintUrl) {
        var installed;
        try {
            installed = new ActiveXObject('AcroPDF.PDF');
        }
        catch (e) {
            bizagi.log(e);
        }
        if (!installed) {
            try {
                // Older Ie
                installed = new ActiveXObject('PDF.PdfCtrl');
            }
            catch (e) {
                bizagi.log(e);
            }
        }
        return installed;
    },
    /*
    *   open a new window whith the created file
    */
    downloadExportedGrid: function (filePrintUrl) {
        window.open(filePrintUrl);
    },

    /*
    *
    */
    formatGrid: function (control) {
        //var control = printContent,
        var tableControl = $('.ui-bizagi-grid-table', control),
            pageContent = $('.ui-pg-table', control),
            closeButton = $('.ui-jqgrid-titlebar-close', control);

        $("th.ui-bizagi-column-hidden, td.ui-bizagi-grid-key, .bz-rn-grid-container-foother", control).remove();

        //Remove click event
        $("[data-action], ul li, .ui-bizagi-grid-column, tr, th", tableControl).unbind("click");
        // Remove close button
        $(closeButton).remove();
    },
    /*
    *   Returns a promise that will resolve when the element is ready
    */
    ready: function () {
        var self = this;
        var parentPromise = self._super();
        var inlineAddPromise = self.inlineAddDeferred ? self.inlineAddDeferred.promise() : null;
        return $.when(parentPromise, inlineAddPromise);
    },

    /*
    * Apply Columns Width in postrender
    */
    applyColumnsWidth: function (grid, columns) {

        for (var i = 0; i < columns.length; i++) {
            var column = grid.find(".resizableColumn")[i];

            if (column) {
                var columnIndex = $(column).find(">.ui-bizagi-grid-column");
                var index = columnIndex.length == 1 ? Number($(column).find(">.ui-bizagi-grid-column").data("column-index")) : i;
                var columnWidth = columns[index].bizAgiProperties.columnwidth;
                var widthToApply = "auto";

                if (columns[index].bizAgiProperties && columnWidth && columnWidth != "auto") {
                    widthToApply = columnWidth;
                }
                $(column).css("width", widthToApply);
                $(column).find(".ui-bizagi-grid-column").css("width", "auto");
            }

        }

    },

    /*
    * Apply Columns Width in update (add or delete a row)
    */
    applyColumnsWidthUpdate: function (grid, columns) {

        var self = this, index = null, column = null, columnIndex = null, columnWidth = null, widthToApply = null;
        var resizableColumns = grid.find(".resizableColumn");
        var length = resizableColumns.length;

        for (var i = 0; i < length; i++) {
            column = resizableColumns[i];
            columnIndex = $(column).find(">.ui-bizagi-grid-column");
            index = columnIndex.length == 1 ? (Number($(column).find(">.ui-bizagi-grid-column").data("column-index")) - 1) : i;

            columnWidth = columns[index].properties.columnwidth;
            widthToApply = "auto";

            if (columns[index].properties && columnWidth && columnWidth != "auto") {
                widthToApply = columnWidth;
            }
            $(column).css("width", widthToApply);
            $(column).find(".ui-bizagi-grid-column").css("width", "auto");
        }

    },

    /*
    *   Apply summary column styles to a specified element
    */
    applySummaryColumnStyles: function (element, properties) {
        var self = this;
        var elementChild = element.find(".ui-bizagi-grid-summary-readonly");

        if (properties.totalize != null && properties.totalize.format != null) {
            var format = properties.totalize.format;
            var textDecorator = "";

            // Set cell back color
            if (format.background) {
                element.css("background-color", format.background);
                element.css("background-image", "none");
            }
            if (format.size && format.size != "0") {
                var size = format.size.toString();
                var operator = size.substring(0, 1);
                var value = size.substring(1, size.length);
                value = operator == "+" ? 100 + (10 * Number(value)) : 100 - (10 * Number(value));
                elementChild.css("font-size", value + "%");
            }
            if (format.italic) {
                elementChild.css("font-style", "italic");
            }
            if (format.color) {
                elementChild.css("color", format.color);
            }
            if (format.underline) {
                textDecorator += "underline ";
            }
            if (format.strikethru) {
                textDecorator += "line-through";
            }
            if (format.bold == true || format.bold == undefined) {
                elementChild.css("font-weight", "bold");
            }
            elementChild.css("text-decoration", textDecorator);
        }
    }
});
