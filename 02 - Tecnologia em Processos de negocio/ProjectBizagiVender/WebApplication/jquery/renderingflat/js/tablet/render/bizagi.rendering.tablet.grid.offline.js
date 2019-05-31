/*
*   Name: BizAgi Tablet Render Grid Extension
*   Author: Richar Urbano (based on Diego Parra version)
*   Comments:
*   -   This script will redefine the grid render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.grid.extend("bizagi.rendering.grid.offline", {
    MAX_ROWS_SUPPORTED: 4
}, {
    /*
    *   Constructor
    */
    init: function(params) {
        var self = this;
        var data = params.data;

        // Call base
        this._super(params);

        // Create a data-structure to keep track of each cell properties
        this.cellMetadata = {};

        // Fill default properties
        var properties = this.properties;
        properties.data.originalRows = bizagi.clone(properties.data.rows);
        var form = self.getFormContainer();

        // Just apply display-type: vertical, align it to the left
        properties.displayType = "vertical";
        properties.labelAlign = "left";

        if (properties.groupBy || properties.groupSummary) {
            // Add warning
            form.addWarning(self.getResource("render-tablet-warning-grid"));
        }
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function() {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        self.initialLoadDone = false;

        // Make control to behave as a block container
        control.addClass("ui-bizagi-render-grid-container")
            .addClass("ui-bizagi-render-display-block");

        // Find component holder
        self.grid = $(">div", control);

        // Hide common label
        self.getLabel().hide();

        // Grid plugin
        self.applyGridPlugin();
        self.configureHelpText();

        // Set initial data
        if (properties.data) {

            self.updateData(properties.data);

            // Trigger change in order to start up the actions when the controls is ready
            $.when(self.ready())
                .done(function() {
                    self.triggerRenderChange({ changed: false });
                });
        }

        // Execute pending actions
        self.initialLoadDone = true;
        for (var i in self.pendingActions) {
            self.pendingActions[i].method.apply(self, self.pendingActions[i].arguments);
        }
    },

    /*
    *   Method to render non editable values
    */
    postRenderReadOnly: function() {
        var self = this;

        // Do the same as the post-render            
        self.postRender();
    },

    /*
    *   Method to render non editable values
    */
    applyGridPlugin: function() {
        var self = this;
        var properties = self.properties;
        var grid = self.grid;
        var mode = self.getMode();

        // Check is offline form	    
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        // Build column metadata
        var columns = self.buildColumnModel();

        // Apply grid plugin
        grid.bizagi_grid_tablet({
            columns: columns,
            maxColumns: self.Class.MAX_ROWS_SUPPORTED,
            title: properties.displayName,
            isOfflineForm: isOfflineForm || false,
            mode: self.getMode(),

            template: {
                grid: self.renderFactory.getTemplate("bizagi.grid.grid"),
                waiting: self.renderFactory.getTemplate("bizagi.grid.waiting"),
                table: self.renderFactory.getTemplate("bizagi.grid.table"),
                emptyTable: self.renderFactory.getTemplate("bizagi.grid.table.empty"),
                column: self.renderFactory.getTemplate("bizagi.grid.column"),
                specialColumn: self.renderFactory.getTemplate("bizagi.grid.column.special"),
                row: self.renderFactory.getTemplate("bizagi.grid.row"),
                rowButtons: self.renderFactory.getTemplate("bizagi.grid.row.buttons.offline"),
                cell: self.renderFactory.getTemplate("bizagi.grid.cell"),
                specialCell: self.renderFactory.getTemplate("bizagi.grid.cell.special"),
                pager: self.renderFactory.getTemplate("bizagi.grid.pager"),
                buttons: self.renderFactory.getTemplate("bizagi.grid.buttons.offline"),
                dynamicPager: self.renderFactory.getTemplate("bizagi.grid.dynamicpager")
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

            isValid: function() {
                // Validate records 
                var errorsMessage = [];
                var form = self.getFormContainer();

                if (form.validationController !== undefined) {
                    form.validationController.clearValidationMessages();
                }

                self.isValid(errorsMessage);

                if (errorsMessage.length > 0) {
                    // Show validation message
                    for (var index = 0; index < errorsMessage.length; index++) {
                        form.validationController.showValidationMessage(errorsMessage[index].message,
                            errorsMessage[index].xpath);
                    }

                    return false;
                } else {
                    return true;
                }
            },
            pageRequested: function(ui) {
                if (mode != "execution") return;
                self.fetchData(ui.page, ui.sortBy, ui.sortType);
            },
            drawCell: function(ui) {
                return self.drawCell(ui.column, ui.key, ui.value, ui.isNewRow);
            },
            cellReady: function(ui) {

                return self.onCellReady(ui.column, ui.key, ui.cell, ui.isNewRow);
            },
            rowSelected: function(ui) {
                if (mode != "execution") return;
                var data = ui;
                self.triggerHandler("rowSelected", { id: ui.key, data: ui });
            },
            addRow: function(ui) {
                if (mode != "execution") return;
                self.addRow();
            },
            editRow: function(ui) {
                if (mode != "execution") return;
                self.editRow(ui.key);
            },
            deleteRow: function(ui) {
                if (mode != "execution") return;
                self.deleteRow(ui.key);
            },
            saveAddedRows: function(ui) {
                self.saveInlineAddedRows(ui.keys);
            },
            beforeInlineAdd: function() {
                self.inlineAddDeferred = new $.Deferred();
            },
            afterInlineAdd: function() {
                if (self.inlineAddDeferred) {
                    self.inlineAddDeferred.resolve();
                }
            },
            cancelEdition: function(ui) {
                self.removeNewRecords(ui);
            },
            removeNewRecords: function(ui) {
                self.removeNewRecords(ui);
            }
        });
    },

    /** 
    *   Creates the column model required to initialize the grid plugin
    */

    buildColumnModel: function() {
        return bizagi.rendering.grid.prototype.buildColumnModel.call(this);
    },

    /**
    * Makes the grid to refresh
    */
    refresh: function() {
        var self = this;

        self.fetchData();
    },

    /*
    *   Holds the execution until the grid data is ready after a load operation
    */
    dataReady: function() {
        var self = this;
        return self.dataReadyDeferred != null ? self.dataReadyDeferred.promise() : null;
    },

    /*
    *   Method to set data and update the grid
    */
    updateData: function(data) {
        return bizagi.rendering.grid.prototype.updateData.apply(this, arguments);
    },

    /*
    *   Method to fetch data from the server and then update the data
    */
    fetchData: function(page, sortBy, sortType) {
        var self = this;

        self.dataReadyDeferred = new $.Deferred();

        // Start loading to avoid multiple calls to the server
        self.startLoading();

        $.when(self.getRemoteData())
            .then(function(data) {
                self.endLoading();
                if (data) {
                    self.updateData(data);
                    self.triggerRenderChange();
                    self.dataReadyDeferred.resolve();
                }
            });
    },

    processChanges: function() {
        var self = this;
        var rowsList = [];
        var data = self.properties.data;


        // Save pending inline add rows
        for (var id in self.changes) {
            var sortArray = [];
            sortArray.push(id);

            for (var columnXpath in self.changes[id]) {


                // Check if the render can submit data
                if (self.canColumnBeSent(id, columnXpath)) {
                    var value = self.changes[id][columnXpath];

                    if (typeof value === "string") {
                        if (value.match(/\n/gm) !== null) {
                            value = value.replaceAll("\n", "\\n");
                        }
                    }

                    sortArray.push({
                        value: value,
                        xpath: columnXpath,
                        DataType: self.getColumn(columnXpath).properties.dataType
                    });
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

            rowsList.push(sortArray);
        }

        return rowsList;
    },

    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectData: function(renderValues) {
        var self = this;
        var errorsMessage = [];
        var internalRedersValues = [];
        var properties = self.properties;
        var data = self.properties.data;

        // Save pending inline add rows
        if (self.isValid(errorsMessage)) {
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

                        sortArray[columnNumber] = {
                            value: value,
                            xpath: columnXpath,
                            DataType: self.getColumn(columnXpath).properties.dataType
                        };
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
        if (JSON.stringify(data.rows) !== JSON.stringify(data.originalRows) || internalRedersValues.length > 0) {
            if (typeof (data.rows) !== "undefined" && internalRedersValues.length > 0) {
                renderValues[properties.xpath] = $.merge($.merge([], self.processOldRows(data.rows)),
                    internalRedersValues);
            } else if (typeof (data.rows) !== "undefined" && data.rows.length > 0) {
                renderValues[properties.xpath] = self.processOldRows(data.rows);
            } else {
                renderValues[properties.xpath] = internalRedersValues;
            }
        }

    },

    /*
    *   Delete field id array objects
    */
    processOldRows: function(rows) {
        var newRows = [];
        var tempRows = rows;
        for (var col = 0, leng = tempRows.length; col < leng; col++) {
            var temp = tempRows[col];
            newRows[col] = $.grep(temp, function(n, i) { return i > 0; });
        }

        return newRows;
    },
    /*
    *   Delete field id array
    */
    processRow: function(row) {
        return $.grep(row, function(n, i) { return i > 0; });
    },
    /*
    *   Customizes the content drawing inside the cell
    */
    drawCell: function(column, key, value, isNewRow) {
        var self = this;

        if (column.key) return value;

        if (typeof (value) === "object" && !isNewRow) {
            value = value.hasOwnProperty("value") ? value.value : value;
        }

        // Get render column                
        var columnIndex = column.index - 1;
        var renderColumn = self.columns[columnIndex];
        var cellOverride = self.getCellOverride(key, column.index - 1);

        self.newRecords = self.newRecords || {};

        // Get cell properties
        if (!self.cellMetadata[key]) self.cellMetadata[key] = {};
        if (!self.cellMetadata[key][columnIndex]) self.cellMetadata[key][columnIndex] = {};
        var properties = self.cellMetadata[key][columnIndex].properties || renderColumn.originalProperties;

        var visible = properties.visible !== undefined ? properties.visible : true;
        var editable = properties.editable !== undefined ? properties.editable : true;

        // Apply overrides from cellOverrides
        visible = cellOverride.visible;
        editable = (properties.editable) ? cellOverride.editable : false;

        // Show editable cell when we are performing inline add operation
        if (isNewRow) editable = true;

        // If the cell we are drawing is the summary cell, we need to make it readonly
        if (key == "summary") editable = false;

        renderColumn.properties.displayType = 'value';
        renderColumn.setValue(key, value);
        renderColumn.setSurrogateKey(key);

        // Column search
        if (renderColumn.properties.type == "columnSearch" && value != null) {
            for (var i = 0, len = renderColumn.properties.data.length; i < len; i++) {
                if (renderColumn.properties.data[i].id == value) {
                    value = { id: renderColumn.properties.data[i].id, label: renderColumn.properties.data[i].value };
                }
            }
        }

        if ((renderColumn.properties.type == "columnCombo" || renderColumn.properties.type == "columnList") && value !=
            null) { //|| renderColumn.properties.type == "columnRadio"
            for (var i = 0, len = renderColumn.properties.data.length; i < len; i++) {
                if (renderColumn.properties.data[i].id == value) {
                    value = [[renderColumn.properties.data[i].id, renderColumn.properties.data[i].value]];
                }
            }
        }

        // Do the render
        if (visible) {
            if (editable) {
                return self.drawEditableCell(renderColumn, properties, key, value, isNewRow);
            } else {
                return self.drawReadonlyCell(renderColumn, properties, key, value);
            }
        } else {
            return "";
        }
    },

    /*
    *   Draws the editable version for the cell
    */
    drawEditableCell: function(renderColumn, properties, key, value, isNewRow) {
        var self = this;
        var defer = new $.Deferred();

        // Set editable
        var originalEditable = renderColumn.properties.editable;
        renderColumn.properties.editable = true;

        // Fix problem when required property lose
        renderColumn.overrideProperties({ required: properties.required });

        // Render cell
        $.when(renderColumn.render(key, value)).done(function(cell) {
            // Register array with new records, just when this is a newrecord
            if (isNewRow && !self.newRecords[key]) {
                self.newRecords[key] = {};
            }

            // convert all row visible
            for (var j = 0; j < self.columns.length; j++) {
                self.cellOverrides[key] = self.cellOverrides[key] || {};
                self.getCellOverride(key, j).visible = (self.getCellOverride(key, j).visible != undefined) ? self
                    .getCellOverride(key, j).visible : true;
            }

            // Add change handler  
            renderColumn.getDecorated(key).bind("renderchange", function(render) {
                self.onCellChange(renderColumn, cell, key);
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
    drawReadonlyCell: function(renderColumn, properties, key, value) {
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
    onCellChange: function(renderColumn, cell, key) {

        var self = this;
        var _value = renderColumn.getValue(key);
        var compositeValue = renderColumn.getCompositeValue(key);

        if (renderColumn.properties.type == "columnDate" && renderColumn.data.properties.showTime == true) {

            if (!bizagi.util.isEmpty(_value)) {
                var date = bizagi.util.dateFormatter.getDateFromInvariant(_value, true);
                _value = bizagi.util.dateFormatter.formatInvariant(date, true);
            } else if (_value === "") {
                _value = "";
            }
        } else if (renderColumn.properties.type == "columnDate") {

            if (!bizagi.util.isEmpty(_value)) {
                var date = bizagi.util.dateFormatter.getDateFromInvariant(_value, false);
                date.setHours(0, 0, 0, 0);
                _value = bizagi.util.dateFormatter.formatInvariant(date, true);
            } else if (_value === "") {
                _value = "";
            }
        }

        if (self.properties.allowEdit || self.grid.bizagi_grid_tablet("isNewRecord", key)) {
            var trigger = self.grid.bizagi_grid_tablet("isNewRecord", key) ? false : true;
            self.collectGridChange({
                id: key,
                xpath: renderColumn.properties.xpath,
                value: _value,
                compositeValue: compositeValue,
                columnIndex: renderColumn.columnIndex,
                trigger: trigger
            });
        }

        // Update change in grid's component data
        self.grid.bizagi_grid_tablet("changeCellValue", key, renderColumn.columnIndex, _value);

        // If the column has totalizers then we need to refresh the summary
        if (renderColumn.properties.totalize && renderColumn.properties.totalize.operation) {
            self.grid.bizagi_grid_tablet("refreshSummary", renderColumn.columnIndex);
        }
    },
    /*
    *   Collect a single cell change made in the grid to send the data when the user saves the form
    */
    collectGridChange: function(params) {
        var self = this;
        params = params || {};
        var id = params.id;
        var xpath = params.xpath;
        var value = params.value;
        var trigger = typeof (params.trigger) !== "undefined" ? params.trigger : true;

        self.changes[id] = self.changes[id] || {};
        self.changes[id][xpath] = value;
        if (trigger)
            self.triggerRenderChange({ key: id, column: xpath });
    },
    /*
    *   Executes when the cell is ready and inserted into the DOM
    */
    onCellReady: function(column, key, cell, isNewRow) {
        // Avalaible editable
        isNewRow = true;
        bizagi.rendering.grid.prototype.onCellReady.apply(this, arguments);
    },

    /**
    *  Adds a row to the grid
    */
    addRow: function() {
        bizagi.showMessageBox(bizagi.localization.getResource("render-tablet-error-userfield"), bizagi.localization
            .getResource("render-tablet-error-userfield"));
    },

    /**
    *  Edits a row in the grid
    */
    editRow: function(id) {
    },

    /**
    *  Deletes a row to the grid
    */
    deleteRow: function(id) {
        if (!id || id == 0) {
            bizagi.showMessageBox(bizagi.localization.getResource("render-grid-message-no-selected-row"), bizagi
                .localization.getResource("render-grid-header-no-selected-row"));
            return;
        }

        var self = this;

        bizagi.showConfirmationBox(this.getResource("render-grid-delete-confirmation"))
            .done(function() {
                // Do a grid record deletion
                $.when(self.submitDeleteRequest(id))
                    .done(function() {
                        // Reload grid
                        self.fetchData();
                    });
            });
    },

    /**
    *  Edits the entire row (inline) in another slide
    */
    editInline: function(id) {
    },
    /*
    *   Retrieve the data for the new rows and push them into the server
    */
    saveInlineAddedRows: function(keys, bRefresh) {
        var self = this;
        var rows = self.processChanges();

        if (!bizagi.util.isEmpty(rows)) {
            self.properties.data.rows = $.merge(self.properties.data.rows, rows);;
        }
    },

    /*
    * Removes invalid records 
    */
    removeNewRecords: function(ui) {
        var self = this;

        if (ui && ui.keys) {
            $.each(ui.keys, function(_, key) {
                if (self.newRecords[key]) {
                    delete self.newRecords[key];
                }
            });
        }
    },
    /*
    *   Changes the background for a cell
    */
    changeCellBackgroundColor: function(key, xpath, argument) {
        bizagi.rendering.grid.prototype.changeCellBackgroundColor.apply(this, arguments);
    },

    /*
    *   Changes the background for a cell
    */
    changeCellColor: function(key, xpath, argument) {
        bizagi.rendering.grid.prototype.changeCellColor.apply(this, arguments);
    },

    /*
    * Change the visibility for a cell
    */
    changeCellVisibility: function(key, xpath, argument) {
        bizagi.rendering.grid.prototype.changeCellVisibility.apply(this, arguments);
    },

    /*
    *   Changes the editability for a cell
    */
    changeCellEditability: function(key, xpath, argument) {
        bizagi.rendering.grid.prototype.changeCellEditability.apply(this, arguments);
    },

    /*
    *  Clean data of cell
    */
    cleanCellData: function(key, xpath) {
        bizagi.rendering.grid.prototype.cleanCellData.apply(this, arguments);
    },

    /*
    *  Changes the required for cell
    */
    changeCellRequired: function(key, xpath, argument) {
        bizagi.rendering.grid.prototype.changeCellRequired.apply(this, arguments);
    },
    /*
    *   Sets an error on the cell
    */
    setError: function(key, xpath) {
        bizagi.rendering.grid.prototype.setError.apply(this, arguments);
    },

    /*
    *   Returns a promise that will resolve when the element is ready
    */
    ready: function() {
        var self = this;
        var parentPromise = self._super();
        var inlineAddPromise = self.inlineAddDeferred ? self.inlineAddDeferred.promise() : null;
        return $.when(parentPromise, inlineAddPromise);
    },
    /*
    *   Fetch the data into a deferred
    */
    getRemoteData: function(params) {
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
    *   Submits a grid delete record request for the given id 
    *   Returns a deferred
    */
    submitDeleteRequest: function(id) {
        var self = this,
            data = self.properties.data,
            statusAction = false;

        // Found row by id
        var currentRow = [];
        for (var i = 0; i < data.rows.length; i++) {
            if (data.rows[i][0] == id) {
                currentRow = data.rows[i];

                data.rows.splice(i, 1);
                i--;

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