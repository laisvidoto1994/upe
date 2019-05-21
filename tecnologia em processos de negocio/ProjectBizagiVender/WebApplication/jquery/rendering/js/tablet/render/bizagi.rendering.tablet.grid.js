/*
*   Name: BizAgi Tablet Render Grid Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the grid render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.grid.extend("bizagi.rendering.grid", {}, {

    /*
    *   Constructor
    */
    init: function (params) {
        var self = this;
        var data = params.data;

        // Create a single instance for each cell
        data.properties.singleInstance = false;
        // Call base
        this._super(params);

        // Create a data-structure to keep track of each cell properties
        this.cellMetadata = {};

        // Fill default properties
        var properties = this.properties;
        var form = self.getFormContainer();

        // If not helptext configured, Just apply display-type: vertical, align it to the left
        if (self.properties.helpText && self.properties.helpText != null && self.properties.helpText != "") {
            properties.displayType = "value";
        } else {
            properties.displayType = "vertical";
        }

        properties.labelAlign = "left";

        if (properties.groupBy || properties.groupSummary) {
            // Add warning
            form.addWarning(self.getResource("render-tablet-warning-grid"));
        }
    },

    /* method overrides
    *  from base or virtual
    */


    /*
    *   Update or init the element data
    */
    initializeData: function (data) {

        // Create a single instance for each cell
        data.properties.singleInstance = false;

        // Call base
        this._super(data);
    },

    /*
    * Updates manually the affected cell 
    */
    updateAffectedCellManually: function () { },

    /*
    * Get the row index using the key as a reference
    */
    getRowIndexByKey: function () { },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        
        self.initialLoadDone = false;
        
        // Call base 
        self._super();

        // Find component holder
        self.grid = $(">div", control);
	
        // Hide common label
        self.getLabel().hide();   
	     
        // Grid plugin
        self.applyGridPlugin();

        // Set initial data
        if (properties.data) {
            self.updateData(properties.data);

            // Trigger change in order to start up the actions when the controls is ready
            $.when(self.ready())
        	.done(function () {
        	    self.triggerRenderChange({ changed: false });
        	});
        }

        // Execute pending actions
        self.initialLoadDone = true;

        for (var i in self.pendingActions) {
            if (self.pendingActions.hasOwnProperty(i)) {
                self.pendingActions[i].method.apply(self, self.pendingActions[i].arguments);
            }
        }

    },

    /**
     * Method to render non editable values
     * @returns {} 
     */
    applyGridPlugin: function () {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var grid = self.grid;

        // Check is offline form        
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        // Build column metadata
        var columns = self.buildColumnModel();

        // Apply grid plugin
        grid.bizagi_grid_tablet({
            columns: columns,
            maxColumns: 4,
            title: properties.displayName,
            isOfflineForm: isOfflineForm || false,
            mode: mode,
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
                pager: self.renderFactory.getTemplate("bizagi.grid.pager"),
                buttons: self.renderFactory.getTemplate("bizagi.grid.buttons"),
                dynamicPager: self.renderFactory.getTemplate("bizagi.grid.dynamicpager")
            },
            actions: {
                add: properties.allowAdd, //|| properties.inlineAdd,
                edit: (properties.allowEdit && properties.withEditForm && properties.data != null), //|| properties.inlineEdit,
                remove: properties.allowDelete,
                inlineAdd: false, //properties.inlineAdd,
                allowMore: properties.allowMore,
                enableXlsExport: false,
                enablePdfExport: false
            },
            pageRequested: function (ui) {
                if (mode != "execution") return;
                self.fetchData(ui.page, ui.sortBy, ui.sortType);
            },
            sortRequested: function (ui) {
                if (mode != "execution") return;
                self.fetchData(ui.page, ui.sortBy, ui.sortType);
            },
            drawCell: function (ui) {
                return self.drawCell(ui.column, ui.key, ui.value, ui.isNewRow);
            },
            cellReady: function (ui) {
                return self.onCellReady(ui.column, ui.key, ui.cell, ui.isNewRow);
            },
            rowSelected: function (ui) {
                if (mode != "execution") return;                
                self.triggerHandler("rowSelected", { id: ui.key, data: ui });
            },
            addRow: function (ui) {
                if (mode != "execution") return;
                self.addRow();
            },
            editRow: function (ui) {
                if (mode != "execution") return;
                self.editRow(ui.key);
            },
            deleteRow: function (ui) {
                if (mode != "execution") return;
                self.deleteRow(ui.key);
            },
            moreRows: function (ui) {
                if (mode != "execution")
                    return;
                self.moreRows(ui);
            },
            showMore: function (ui) {
                self.showMore(ui.key);
            }
        });
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
        var self = this;        
        var columns = self.columns;

        // Create id column first
        var keyColumn = {
            name: "id",
            index: 0,
            label: "id",
            hidden: true,
            align: "center",
            key: true
        };

        // Add to column model
        var columnModel = [];
        columnModel.push(keyColumn);

        $.each(columns, function (index, column) {

            // Set grid column
            column.columnIndex = index + 1;

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
            grid.bizagi_grid_tablet("setData", data);

            var androidVersion = self.getAndroidVersion();
            androidVersion = androidVersion ? androidVersion.substring(0, 3) : null;

            if (self.properties.data && self.properties.data.total > 1 && bizagi.detectDevice() == "tablet_android" && androidVersion && Number(androidVersion) <= 4.2) {
                self.alternativePaginator();
            }


        }
    },

    /*
    *   Method to fetch data from the server and then update the data
    */
    fetchData: function (page, sortBy, sortType) {
        var self = this;
        var properties = self.properties;
        self.dataReadyDeferred = new $.Deferred();

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
            if (data) {
                if (data.deviceMaxRecordsExceeded) {
                    alert(bizagi.localization.getResource("render-search-maximum-records-allowed"));
                } else {
                    self.loadChanges(data.rows);
                    self.updateData(data);
                    self.triggerRenderChange();
                    self.dataReadyDeferred.resolve();

                    //focus on page clicked
                    var pageSelected = $(".ui-bizagi-grid-pager", self.element).find("li[data-page-number=" + data.page + "]");
                    var pageLeftPosition = pageSelected.length > 0 ? pageSelected.position().left : 0;

                    var androidVersion = self.getAndroidVersion();
                    androidVersion = androidVersion ? androidVersion.substring(0, 3) : null;

                    if (bizagi.detectDevice() == "tablet_android" && androidVersion && Number(androidVersion) <= 4.2) {
                        pageLeftPosition = Number(pageLeftPosition - 30) * -1;
                        var pagerContentWidth = Number($(".ui-bizagi-grid .ui-bizagi-grid-pager", self.getControl()).css("width").replace(/[^-\d\.]/g, ''));
                        var lastLiElementPosition = $(".ui-bizagi-grid .ui-bizagi-grid-pager ul li:last", self.getControl());
                        lastLiElementPosition = lastLiElementPosition.length > 0 ? lastLiElementPosition.position().left : 0;
                        var pagerMarginAnimate = (-lastLiElementPosition + pagerContentWidth) - 90;

                        if (pagerContentWidth < lastLiElementPosition && pageLeftPosition < pagerMarginAnimate) {
                            pageLeftPosition = pagerMarginAnimate;
                            $(".ui-bizagi-grid .ui-bizagi-grid-pager ul", self.getControl()).animate({ "margin-left": pageLeftPosition + "px" });
                        }
                    } else {
                        $(".ui-bizagi-grid-pager", self.element).find("ul").scrollLeft(pageLeftPosition);
                    }
                }
            }
        });
    },


    /*
    *   Add the render data to the given collection in order to send data to the server
    */
    collectData: function (renderValues) {
        var self = this;
        var grid = self.grid;

        // Save pending inline add rows
        if (self.grid && (self.properties.inlineAdd || self.properties.inlineEdit)) {
            var newKeys = grid.bizagi_grid_tablet("getNewRowKeys");

            // Save new rows then save the whole screen
            if (newKeys.length > 0 && !self.properties.alreadySaved && self.isValid()) {
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

    /*
    *   Customizes the content drawing inside the cell
    */
    drawCell: function (column, key, value, isNewRow) {
        var self = this;
        if (column.key) return value;

        self.newRecords = self.newRecords || {};
        // Get render column
        var columnIndex = column.index - 1;
        var renderColumn = self.columns[columnIndex];

        // Get cell properties
        if (!self.cellMetadata[key]) self.cellMetadata[key] = {};
        if (!self.cellMetadata[key][columnIndex]) self.cellMetadata[key][columnIndex] = {};
        var properties = self.cellMetadata[key][columnIndex].properties || renderColumn.originalProperties;

        var visible = properties.visible !== undefined ? properties.visible : true;
        var editable = properties.editable !== undefined ? properties.editable : true;
        properties.editable = false;

        // Show editable cell when we are performing inline add operation
        if (isNewRow) editable = true;
        renderColumn.properties.displayType = 'value';

        if (key == "summary") {
            editable = false;
        }


        renderColumn.setValue(key, value);
        renderColumn.setSurrogateKey(key);

        if (properties.visible) {
            renderColumn.properties = properties;
            var defer = new $.Deferred();

            $.when(renderColumn.renderReadOnly(key, value)).done(function (cell) {
                // Register array with new records

                for (var j = 0; j < self.columns.length; j++) {
                    self.cellOverrides[key] = self.cellOverrides[key] || {};
                    self.getCellOverride(key, j).visible = true;
                }
                defer.resolve(cell);
            });
            //return renderColumn.renderReadOnly(key, value);
            return defer.promise();
        } else {

            return "";
        }
    },


    /*
    *   Executes when the cell is ready and inserted into the DOM
    */
    onCellReady: function (column, key, cell, isNewRow) {
        var self = this;

        // Get render column
        var columnIndex = column.index - 1;
        var renderColumn = self.columns[columnIndex];
        var properties = ((self.cellMetadata[key][columnIndex] != undefined) ? self.cellMetadata[key][columnIndex].properties : undefined) || renderColumn.originalProperties;
        var visible = properties.visible !== undefined ? properties.visible : true;
        var editable = properties.editable !== undefined ? properties.editable : true;

        // Show editable cell when we are performing inline add operation
        if (isNewRow) editable = true;
        else editable = false;
        if (visible) {
            if (editable) {
                // Set editable
                var originalEditable = renderColumn.properties.editable;
                renderColumn.properties.editable = editable;

                if (renderColumn.properties.submitOnChange) {
                    var control = renderColumn.getDecorated(key);
                    if (control) {
                        control.properties.submitOnChangexpathContext = self.properties.xpath + "[]";
                    }
                }


                // Execute cell post render
                renderColumn.postRender(key, cell);

                // Restore editable
                renderColumn.properties.editable = originalEditable;
            } else {
                renderColumn.postRenderReadOnly(key, cell);
            }
        }
    },

    /**
    *  Adds a row to the grid
    */
    addRow: function () {
        var self = this;
        var properties = self.properties;

        // Send add request
        $.when(self.submitAddRequest())
        .done(function (newid) {

            // Show a slide with new form after that
            var slide = new bizagi.rendering.tablet.slideForm(self.dataService, self.renderFactory, {
                container: self.getFormContainer().container,
                showSaveButton: true,
                onSave: function (data) {
                    return self.submitSaveRequest(newid, data);
                }
            });

            var recordXpath = properties.xpath + "[id=" + newid + "]";
            slide.render({
                idRender: properties.id,
                recordXPath: recordXpath,
                xpathContext: properties.xpathContext,
                idPageCache: properties.idPageCache,
                requestedForm: "addForm",
                url: properties.addPage
            })
            .done(function () {

                if (!properties.submitOnChange) {
                    // Reload grid
                    self.fetchData();

                } else {
                    // Submits the entire form
                    self.submitOnChange();
                }
            })
            .fail(function () {
                self.submitRollbackRequest();
            });
        });

    },

    /**
    *  Edits a row in the grid
    */
    editRow: function (id) {

        if (id == 0) {
            bizagi.showMessageBox(bizagi.localization.getResource("render-grid-message-no-selected-row"), bizagi.localization.getResource("render-grid-header-no-selected-row"));
            return;
        }

        var self = this;
        var properties = self.properties;

        // Use tablet inline edit when there are no edit form
        if (properties.inlineEdit == true && properties.allowEdit == false) {
            self.editInline(id);
            return;
        }


        if (self.cleanActionChanges && self.cleanActionChanges[id] !== undefined) {

            self.changes = self.cleanActionChanges;
            var data = $.extend(self.changes[id], {});
            data.idPageCache = properties.idPageCache;

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
        } else {
            self.executeSubmitEditRequest(id);
        }
        
        
    },

    executeSubmitEditRequest: function (id) {
        var self = this;
        var properties = self.properties;


        var slide = new bizagi.rendering.tablet.slideForm(self.dataService, self.renderFactory, {
            container: self.getFormContainer().container,
            showSaveButton: true,
            onSave: function (data) {
                return self.submitSaveRequest(id, data);
            }
        });
        
        $.when(self.submitEditRequest(id))
        .done(function () {

            // Show dialog with new form after that
            var recordXpath = properties.xpath + "[id=" + id + "]";

            slide.render({
                idRender: properties.id,
                recordXPath: recordXpath,
                xpathContext: properties.xpathContext,
                idPageCache: properties.idPageCache,
                requestedForm: "editForm",
                url: properties.editPage
            })
            .done(function () {
                if (!properties.submitOnChange) {
                    // Reload grid
                    self.fetchData();

                } else {
                    // Submits the entire form
                    self.submitOnChange();
                }
            })
            .fail(function () {
                self.submitRollbackRequest();
            });
        });
    },
    /**
    *  Deletes  a row to the grid
    */
    deleteRow: function (id) {

        if (id == 0) {
            bizagi.showMessageBox(bizagi.localization.getResource("render-grid-message-no-selected-row"), bizagi.localization.getResource("render-grid-header-no-selected-row"));
            return;
        }

        var self = this;

        bizagi.showConfirmationBox(this.getResource("render-grid-delete-confirmation"))
        .done(function () {
            // Do a grid record deletion
            $.when(self.submitDeleteRequest(id))
            .done(function () {
                // Reload grid
                self.fetchData();
            });
        });
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
            action: "SUBMITONCHANGE",
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

    /**
    *  Shows more info about a grid row
    */
    showMore: function (id) {
        var self = this;
        var data = self.properties.data;
        var form = self.getFormContainer();
        var properties = self.properties;

        // Search row
        var currentRow = [];
        for (var i = 0; i < data.rows.length; i++) {
            if (data.rows[i][0] == id) {
                currentRow = data.rows[i];
                break;
            }
        }

        // Render grid view
        var slide = new bizagi.rendering.tablet.slide.gridView(self.dataService, self.renderFactory, {
            container: self.getFormContainer().container,
            allowEdition: false
        });

        slide.render({
            row: currentRow,
            columns: self.columns,
            pageCacheId: properties.idPageCache,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
            sessionId: form.properties.sessionId,
            actions: form.actions
        });
    },

    /**
    *  Edits the entire row (inline) in another slide
    */
    editInline: function (id) {
        var self = this;
        var data = self.properties.data;
        var properties = self.properties;
        var form = self.getFormContainer();

        // Search row
        var currentRow = [];
        for (var i = 0; i < data.rows.length; i++) {
            if (data.rows[i][0] == id) {
                currentRow = data.rows[i];
                break;
            }
        }

        // Render grid view
        var slide = new bizagi.rendering.tablet.slide.gridView(self.dataService, self.renderFactory, {
            container: self.getFormContainer().container,
            allowEdition: true
        });

        // Render the editable view
        $.when(
            slide.render({
                row: currentRow,
                columns: self.columns,
                pageCacheId: properties.idPageCache,
                xpath: properties.xpath,
                xpathContext: properties.xpathContext,
                sessionId: form.properties.sessionId,
                actions: form.actions,
                validations: form.validations
            })
		).done(function (data) {
		    // This code is executed when the user press save on the slide

		    // Update internal data
		    for (xpath in data) {
		        self.collectGridChange({ id: id, xpath: xpath, value: data[xpath], trigger: false });
		    }

		    // Prepare grid data
		    var dataToSend = {};
		    self.collectData(dataToSend);

		    // Send the data
		    self.dataService.submitData({
		        action: "SUBMITONCHANGE",
		        data: dataToSend,
		        idRender: properties.id,
		        xpath: properties.xpath,
		        xpathContext: properties.xpathContext,
		        idPageCache: properties.idPageCache
		    })
            .done(function () {
                // After successfully response refresh the grid
                self.fetchData();
            });
		});
    },

    /*
    *   Changes the background for a cell
    */
    changeCellBackgroundColor: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {
            for (var j = 0; j < self.columns.length; j++) {
                var isVisible = self.getCellOverride(key, j).visible;
                if (self.columns[j].properties.xpath == xpath && isVisible) {
                    var cell = self.grid.bizagi_grid_tablet('getCell', key, xpath, j);

                    if (self.properties.editable) {
                        cell = cell.find("input");
                    }

                    cell.css("background-color", argument);
                    break;
                }
            }

        } else {
            if (self.pendingActions) {
                self.pendingActions.push({
                    method: sel * f.changeCellBackgroundColor,
                    arguments: arguments
                });
            }
        }
    },

    /*
    *   Changes the background for a cell
    */
    changeCellColor: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {
            for (var j = 0; j < self.columns.length; j++) {
                if (self.columns[j].properties.xpath == xpath) {
                    var cell = self.grid.bizagi_grid_tablet('getCell', key, xpath, j);

                    if (self.properties.editable) {
                        cell = cell.find("input");
                    }

                    cell.css("color", argument);
                    break;
                }
            }
        } else {
            if (self.pendingActions) {
                self.pendingActions.push({
                    method: self.changeCellColor,
                    arguments: arguments
                });
            }
        }
    },

    /*
    *   Changes the visibility for a cell
    */
    changeCellVisibility: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {
            for (var j = 0; j < self.columns.length; j++) {
                if (self.columns[j].properties.xpath == xpath) {
                    var cell = self.grid.bizagi_grid_tablet('getCell', key, xpath, j);
                    // Change visibility
                    if (argument == true) {
                        cell.show();
                    } else {
                        cell.hide();
                    }

                    self.cellOverrides[key] = self.cellOverrides[key] || {};
                    self.getCellOverride(key, j).visible = argument;
                    break;
                }
            }
        } else {
            if (self.pendingActions) {
                self.pendingActions.push({
                    method: self.changeCellVisibility,
                    arguments: arguments
                });
            }
        }
    },

    /*
    *   Sets an error on the cell
    */
    setError: function (key, xpath) {
        var self = this;

        if (self.initialLoadDone) {
            for (var j = 0; j < self.columns.length; j++) {
                var isVisible = self.getCellOverride(key, j).visible;
                if (self.columns[j].properties.xpath == xpath && isVisible) {
                    var cell = self.grid.bizagi_grid_tablet('getCell', key, xpath, j);
                    cell.parent().addClass("ui-bizagi-render-grid-cell-error");
                    break;
                }
            }

        } else {
            if (self.pendingActions) {
                self.pendingActions.push({
                    method: self.setError,
                    arguments: arguments
                });
            }
        }
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

    alternativePaginator: function () {
        var self = this;
        var control = self.getControl();
        var totalPages = self.properties.data.total;
        var pagerWidth = (totalPages * 60) + (totalPages * 12);

        $(".ui-bizagi-grid-pagerArrowLeftFast", control).css("display", "inline");
        $(".ui-bizagi-grid-pagerArrowLeft", control).css("display", "inline");
        $(".ui-bizagi-grid-pagerArrowRightFast", control).css("display", "inline");
        $(".ui-bizagi-grid-pagerArrowRight", control).css("display", "inline");

        $(".ui-bizagi-grid .ui-bizagi-grid-pager", control).addClass("ui-bizagi-grid-alternativePaginator");
        $(".ui-bizagi-grid .ui-bizagi-grid-pager ul", control)[0].style.removeProperty("white-space");


        $(".ui-bizagi-grid .ui-bizagi-grid-pager ul", control).css("width", pagerWidth);
        $(".ui-bizagi-grid .ui-bizagi-grid-pager", control).draggable();

        $(".ui-bizagi-grid-pagerArrowRight", control).on('click', function (e) {

            var pagerMarginLeft = Number($(".ui-bizagi-grid .ui-bizagi-grid-pager ul", control).css("margin-left").replace(/[^-\d\.]/g, ''));
            var pagerContentWidth = Number($(".ui-bizagi-grid .ui-bizagi-grid-pager", control).css("width").replace(/[^-\d\.]/g, ''));
            var pagerMarginAnimate = pagerMarginLeft - pagerContentWidth + 120;
            var lastLiElementPosition = $(".ui-bizagi-grid .ui-bizagi-grid-pager ul li:last", control).position().left;

            if (pagerMarginAnimate < (-lastLiElementPosition + pagerContentWidth)) {
                pagerMarginAnimate = (-lastLiElementPosition + pagerContentWidth) - 90;
            }

            $(".ui-bizagi-grid .ui-bizagi-grid-pager ul", control).animate({ "margin-left": pagerMarginAnimate + "px" });

        });
        $(".ui-bizagi-grid-pagerArrowRightFast", control).on('click', function (e) {

            var pagerContentWidth = Number($(".ui-bizagi-grid .ui-bizagi-grid-pager", control).css("width").replace(/[^-\d\.]/g, ''));
            var lastLiElementPosition = $(".ui-bizagi-grid .ui-bizagi-grid-pager ul li:last", control).position().left;
            var pagerMarginAnimate = (-lastLiElementPosition + pagerContentWidth) - 90;

            $(".ui-bizagi-grid .ui-bizagi-grid-pager ul", control).animate({ "margin-left": pagerMarginAnimate + "px" });
        });

        $(".ui-bizagi-grid-pagerArrowLeft", control).on('click', function (e) {

            var pagerMarginLeft = Number($(".ui-bizagi-grid .ui-bizagi-grid-pager ul", control).css("margin-left").replace(/[^-\d\.]/g, ''));
            var pagerContentWidth = Number($(".ui-bizagi-grid .ui-bizagi-grid-pager", control).css("width").replace(/[^-\d\.]/g, ''));
            var pagerMarginAnimate = pagerMarginLeft + pagerContentWidth - 120;

            if (pagerMarginAnimate > 0) {
                pagerMarginAnimate = 30;
            }

            $(".ui-bizagi-grid .ui-bizagi-grid-pager ul", control).animate({ "margin-left": pagerMarginAnimate + "px" });

        });

        $(".ui-bizagi-grid-pagerArrowLeftFast", control).on('click', function (e) {
            var pagerMarginAnimate = 30;
            $(".ui-bizagi-grid .ui-bizagi-grid-pager ul", control).animate({ "margin-left": pagerMarginAnimate + "px" });
        });
    },
    
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
                var rows = self.properties.data.rows;
                var i = 0;
                var rowLength = rows.length;
                for (; i < rowLength; i++) {
                    if (Number(key) === rows[i][0]) {
                        rows[i][j + 1] = [["", ""]];
                        break;
                    }
                }
                self.cellOverrides[key] = self.cellOverrides[key] || {};
                self.getCellOverride(key, j).value = null;

                if (!self.cleanActionChanges) {
                    self.cleanActionChanges = {};
                }
                if (!self.cleanActionChanges[key]) {
                    self.cleanActionChanges[key] = {};
                }
                self.cleanActionChanges[key][xpath] = "";
            }
        } else {
            self.pendingActions.push({
                method: self.cleanData,
                arguments: ""
            });
        }
    },

    getAndroidVersion: function () {
        var navUserAgent = (navigator.userAgent).toLowerCase();
        var match = navUserAgent.match(/android\s([0-9\.]*)/);
        return match ? match[1] : false;
    }

});
