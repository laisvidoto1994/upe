/*
*   Name: BizAgi Desktop Render Grid Extension
*   Author: Richar Urbano (based on OscarO version)
*   Comments:
*   -   This script will redefine the grid render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.grid.extend("bizagi.rendering.grid.offline", {
    MAX_ROWS_SUPPORTED: 4
}, {
    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;

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

        // Just apply display-type: vertical, align it to the left
        properties.displayType = "vertical";
        properties.labelAlign = "left";

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

        // Hide common label
        self.getLabel().hide();

        // Grid plugin
        self.applyGridPlugin();

        // Set initial data
        if (properties.data) {
            if (properties.data == "" || (properties.data.rows).length == 0 && properties.data.page > 1) {
                self.fetchData();

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

        //apply columns width
        //self.applyColumnsWidth(grid, columns);
    },
    /*
    *   Method to render non editable values
    */
    applyGridPlugin: function () {
        var self = this,
            grid = self.grid,
            properties = self.properties,
            mode = self.getMode(),
            columns = self.buildColumnModel();

        var pager = self.renderFactory.getTemplate("bizagi.grid.pagination");

        // Apply grid plugin
        grid.bizagi_grid_desktop({
            columns: columns,
            maxColumns: self.Class.MAX_ROWS_SUPPORTED,
            showSummary: properties.showSummary,
            title: properties.displayName,
            mode: self.getMode(),
            tableCssClass: "",

            template: {
                grid: self.renderFactory.getTemplate("bizagi.grid.grid"),
                waiting: self.renderFactory.getTemplate("bizagi.grid.waiting"),
                table: self.renderFactory.getTemplate("bizagi.grid.table"),
                emptyTable: self.renderFactory.getTemplate("bizagi.grid.table.empty"),
                column: self.renderFactory.getTemplate("bizagi.grid.column"),
                specialColumn: self.renderFactory.getTemplate("bizagi.grid.column.special"),
                row: self.renderFactory.getTemplate("bizagi.grid.row"),
                rowButtons: self.renderFactory.getTemplate("bizagi.grid.row.buttons"),
                cell: self.renderFactory.getTemplate("bizagi.grid.cell"),
                specialCell: self.renderFactory.getTemplate("bizagi.grid.cell.special"),
                pager: pager,
                buttons: self.renderFactory.getTemplate("bizagi.grid.buttons"),
                dynamicPager: self.renderFactory.getTemplate("bizagi.grid.dynamicpager"),
                summary: self.renderFactory.getTemplate("bizagi.grid.summary"),
                summaryCell: self.renderFactory.getTemplate("bizagi.grid.summaryCell"),
                exportOptions: self.renderFactory.getTemplate("bizagi.grid.exportOptions")
            },
            actions: {
                add: properties.allowAdd,
                edit: (properties.allowEdit && properties.withEditForm && properties.data != null),
                remove: properties.allowDelete,
                details: false,
                inlineAdd: true, //properties.inlineAdd,
                allowMore: false,
                enableXlsExport: false,
                enablePdfExport: false
            },
            tooltips: {
                addLabel: properties.addLabel,
                editLabel: properties.editLabel,
                deleteLabel: properties.deleteLabel,
                detailLabel: properties.detailLabel
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

                //self.fetchData(ui.page, sortName, ui.sortType);
            },
            drawCell: function (ui) {
                var cell = self.drawCell(ui.column, ui.key, ui.value, ui.isNewRow);
                return cell;
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
                self.addRow();
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
            saveAddedRows: function (ui) {
                self.saveInlineAddedRows(ui.keys);
            },
            beforeInlineAdd: function () {
                self.inlineAddDeferred = new $.Deferred();
            },
            afterInlineAdd: function () {
                if (self.inlineAddDeferred) {
                    self.inlineAddDeferred.resolve();
                }
            },
            cancelEdition: function (ui) {
                self.removeNewRecords(ui);
            },
            removeNewRecords: function (ui) {
                self.removeNewRecords(ui);
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

    postRenderReadOnly: function () {
        var self = this;

        // Do the same as the post-render            
        self.postRender();
    },

    /** 
    *   Creates the column model required to initialize the grid plugin
    */

    buildColumnModel: function () {
        return bizagi.rendering.grid.bizagi.prototype.buildColumnModel.call(this);
    },
    /**
    * Makes the grid to refresh
    */
    refresh: function () {
        var self = this;
        self.fetchData();
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
            self.setCellOverrides(data);
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
        self.dataReadyDeferred = new $.Deferred();

        // Start loading to avoid multiple calls to the server
        self.startLoading();

        $.when(self.getRemoteData())
                .then(function (data) {
                    self.endLoading();
                    if (self.disposed) return;
                    if (data) {
                        self.updateData(data);
                        self.triggerRenderChange();
                        self.dataReadyDeferred.resolve();
                    }
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

        // Check if a custom method has been given
        if (properties.overrideGetRemoteData) {
            var result = properties.overrideGetRemoteData(params);
            return result != null ? result.promise() : null;
        }

        // Default ajax call
        var defer = new $.Deferred();

        // Resolve with remote data
        var data = properties.data;

        // Resolve with fetched data    
        properties.page = data.page;
        properties.records = data.records;
        properties.totalPages = data.totalPages;

        // Check RTL
        if (self.isRTL()) {
            data.rows = self.changeOrderData(data.rows);
        }

        defer.resolve(data);

        return defer.promise();
    },
    /*
    *   Returns a promise that will resolve when the element is ready to save
    */
    isReadyToSave: function () {
        var self = this;

        // Save pending inline add rows
        if (self.grid && self.properties.inlineAdd && self.properties.allowEdit) {
            var newKeys = self.triggerGridPluginHandler("getNewRowKeys");

            // Save new rows then save the whole screen
            if (newKeys.length > 0 && self.isValid()) {
                self.properties.alreadySaved = true;
                return self.saveInlineAddedRows(newKeys, false);
            }
        }

        return null;
    },
    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectData: function (renderValues) {
        var self = this;
        var errorsMessage = [];
        var properties = self.properties;
        var data = self.properties.data;
        var keysToDelete = [];
        var internalRedersValues = [];

        // Save pending inline add rows
        if (self.isValid(errorsMessage)) {
            //var index = 0;
            for (var id in self.changes) {
                var sortArray = [];

                for (var columnXpath in self.changes[id]) {

                    // Check if the render can submit data
                    if (self.canColumnBeSent(id, columnXpath)) {
                        var columnNumber = self.getColumn(columnXpath).columnIndex - 1;
                        var value = self.changes[id][columnXpath];

                        if (typeof value === "string") {
                            if (value.match(/\n/gm) !== null) {
                                value = value.replaceAll("\n", "\\n");
                            }
                        }

                        sortArray[columnNumber] = { value: value, xpath: columnXpath, DataType: self.getColumn(columnXpath).properties.dataType };
                    }
                }

                if (typeof (self.properties.data.rows) !== "undefined" && self.properties.data.rows.length > 0) {
                    // Search row
                    var currentRow = [];
                    for (var i = 0; i < data.rows.length; i++) {
                        if (data.rows[i][0] == id) {
                            currentRow = data.rows[i];

                            // Delete current data
                            data.rows.splice(i, 1);
                            i--;

                            // Mixed data
                            currentRow = self.processRow(currentRow);
                            sortArray = $.extend(true, currentRow, sortArray);

                            break;
                        }
                    }
                }

                internalRedersValues[internalRedersValues.length] = sortArray;
            }
        }

        // Get data
        if (typeof (data.rows) !== "undefined" && internalRedersValues.length > 0) {
            renderValues[properties.xpath] = $.merge($.merge([], self.processOldRows(data.rows)), internalRedersValues);
        } else if (typeof (data.rows) !== "undefined" && data.rows.length > 0) {
            renderValues[properties.xpath] = self.processOldRows(data.rows);
        } else if (internalRedersValues.length > 0) {
            renderValues[properties.xpath] = internalRedersValues;
        }
        else {
            renderValues[properties.xpath] = internalRedersValues;
        }
    },

    /*
    *   Delete field id array objects
    */
    processOldRows: function (rows) {
        var newRows = [];
        var tempRows = rows;
        for (var col = 0; col < tempRows.length; col++) {
            var temp = tempRows[col];
            newRows[col] = $.grep(temp, function (n, i) { return i > 0; });
        }

        return newRows;
    },
    /*
    *   Delete field id array
    */
    processRow: function (row) {
        return $.grep(row, function (n, i) { return i > 0; });
    },
    /*
    *   Customizes the content drawing inside the cell
    */
    drawCell: function (column, key, value, isNewRow) {
        var self = this;

        if (column.key) return value;

        if (typeof (value) === "object" && !isNewRow) {
            value = value.hasOwnProperty("value") ? value.value : value;
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
        if (isNewRow)
            editable = true;

        renderColumn.properties.displayType = 'value';

        // Column search
        if (renderColumn.properties.type == "columnSearch" && value != null) {
            for (var i = 0, len = renderColumn.properties.data.length; i < len; i++) {
                if (renderColumn.properties.data[i].id == value) {
                    value = { id: renderColumn.properties.data[i].id, label: renderColumn.properties.data[i].value };
                }
            }
        }


        // Column combo
        if ((renderColumn.properties.type == "columnList" || renderColumn.properties.type == "columnCombo") && value != null) {
            for (var i = 0, len = renderColumn.properties.data.length; i < len; i++) {
                if (renderColumn.properties.data[i].id == value) {
                    value = [[renderColumn.properties.data[i].id, renderColumn.properties.data[i].value]];
                }
            }
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
        return bizagi.rendering.grid.bizagi.prototype.drawEditableCell.apply(this, arguments);
    },
    /*
    *   Draws the readonly version for the cell
    */
    drawReadonlyCell: function (renderColumn, properties, key, value) {
        return bizagi.rendering.grid.bizagi.prototype.drawReadonlyCell.apply(this, arguments);
    },
    /*
    *   Defines the handler when a cell changes its value
    */
    onCellChange: function (renderColumn, cell, key) {
        bizagi.rendering.grid.bizagi.prototype.onCellChange.apply(this, arguments);
    },
    /*
    *   Executes when the cell is ready and inserted into the DOM
    */
    onCellReady: function (column, key, cell, isNewRow) {
        bizagi.rendering.grid.bizagi.prototype.onCellReady.apply(this, arguments);
    },
    /*
    *
    * Change title aligning class
    */
    changeTitleAligningClass: function (index, titleAligningClass) {
        bizagi.rendering.grid.bizagi.prototype.changeTitleAligningClass.apply(this, arguments);
    },

    /*
    *
    * Change aligning class
    */
    changeAligningClass: function (cell, aligningClass) {
        bizagi.rendering.grid.bizagi.prototype.changeAligningClass.apply(this, arguments);
    },
    /*
    *   Get title aligning class
    */
    getTitleAlignClass: function (alignType) {
        bizagi.rendering.grid.bizagi.prototype.getTitleAlignClass.apply(this, arguments);
    },
    /*
    *   Get aligning class
    */
    getAlignClass: function (alignType) {
        return bizagi.rendering.grid.bizagi.prototype.getAlignClass.call(this, arguments);
    },
    /**
    *  Adds a row to the grid
    */
    addRow: function () {

    },
    /**
    *  Edits a row in the grid with Form
    *  
    */
    editRow: function (id) {
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
        // Not implemented
    },
    /*
    *   Changes the background for a cell
    */
    changeCellBackgroundColor: function (key, xpath, argument) {
        bizagi.rendering.grid.bizagi.prototype.changeCellBackgroundColor.apply(this, arguments);
    },
    /*
    *   Changes the background for a cell
    */
    changeCellColor: function (key, xpath, argument) {
        bizagi.rendering.grid.bizagi.prototype.changeCellColor.apply(this, arguments);
    },
    /*
    *   Changes the visibility for a cell
    */
    changeCellVisibility: function (key, xpath, argument) {
        bizagi.rendering.grid.bizagi.prototype.changeCellVisibility.apply(this, arguments);
    },

    /*
    *   Changes the editability for a cell
    */
    changeCellEditability: function (key, xpath, argument) {
        bizagi.rendering.grid.bizagi.prototype.changeCellEditability.apply(this, arguments);
    },
    /*
    *  Clean data of cell
    */
    cleanCellData: function (key, xpath) {
        bizagi.rendering.grid.bizagi.prototype.cleanCellData.apply(this, arguments);
    },
    /*
    *  Changes the required for cell
    */
    changeCellRequired: function (key, xpath, argument) {
        bizagi.rendering.grid.bizagi.prototype.changeCellRequired.apply(this, arguments);
    },
    /*
    *  Changes the required for cell
    */
    changeCellValue: function (key, xpath, argument) {
        bizagi.rendering.grid.bizagi.prototype.changeCellValue.apply(this, arguments);
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
                        .done(function () {
                            // Remove temporal record
                            self.removeNewRecords({ keys: [id] });

                            // Set flag to mark delete event
                            self.properties.recordHasBeenDeleted = true;

                            // Reload grid
                            self.fetchData();
                        });
                });
    },

    /*
    *
    */
    executeSubmitEditRequest: function (id) {
    },

    /*
    *   Retrieve the data for the new rows and push them into the server
    */
    saveInlineAddedRows: function (keys, bRefresh) {
    },
    /*
    *   Prepares the add action
    */
    prepareAddAction: function (key) {
    },

    processChanges: function (change) {
        return bizagi.rendering.grid.bizagi.prototype.processChanges.call(this, arguments);
    },
    /*
    * Removes invalid records 
    */
    removeNewRecords: function (ui) {
        bizagi.rendering.grid.bizagi.prototype.removeNewRecords.call(this, arguments);
    },

    /*
    *
    */
    formatGrid: function (control) {
        bizagi.rendering.grid.bizagi.prototype.formatGrid.call(this, arguments);
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
        bizagi.rendering.grid.bizagi.prototype.applyColumnsWidth.apply(this, arguments);
    },

    /*
    * Apply Columns Width in update (add or delete a row)
    */
    applyColumnsWidthUpdate: function (grid, columns) {
        bizagi.rendering.grid.bizagi.prototype.applyColumnsWidthUpdate.apply(this, arguments);
    },

    /*
    *   Apply summary column styles to a specified element
    */
    applySummaryColumnStyles: function (element, properties) {
        bizagi.rendering.grid.bizagi.prototype.applySummaryColumnStyles.apply(this, arguments);
    },

    /*
    *   Submits a grid delete record request for the given id 
    *   Returns a deferred
    */
    submitDeleteRequest: function (id) {
        var self = this,
                data = self.properties.data;
        var statusAction = false;
        // Found row by id
        var currentRow = [];
        for (var i = 0; i < data.rows.length; i++) {
            if (data.rows[i][0] == id) {
                currentRow = data.rows[i];

                delete data.rows[i];
                data.rows.splice(i, 1);

                data.records--;
                statusAction = true;
                break;
            }
        }

        // verified status action
        if (!statusAction) {
            bizagi.showMessageBox(this.getResource("workportal-general-no-records-found"));
        }
        return (data.rows);
    }
});