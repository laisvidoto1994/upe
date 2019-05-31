/**
 * Grouped Grid
 * 
 * @author Edward J Morales
 */
bizagi.rendering.grid.bizagi.extend("bizagi.rendering.grid.grouped", {}, {
    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;


        data.properties = self.convertProperties(data.properties);
        // parse data throuht group engine

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

        properties.withEditForm = properties.allowEdit;

        // set collapse grid
        this.collapseState = properties.collapseState;

        // Just apply display-type: vertical, align it to the left
        properties.displayType = "vertical";
        properties.labelAlign = "left";

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
        if (isNewRow)
            editable = true;

        renderColumn.properties.displayType = 'value';

        // If the cell we are drawing is the summary cell, we need to make it readonly
        if (typeof key === "string" && key.indexOf("summary") >= 0 ) {
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
    *   Draws the readonly version for the cell
    */
    drawReadonlyCell: function (renderColumn, properties, key, value) {
        var self = this;
        var result = "";

        // Use totalizer format when printing summary row
        if (typeof key === "string" && key.indexOf("summary") >= 0) {
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
    *   Executes when the cell is ready and inserted into the DOM
    */
    onCellReady: function (column, key, cell, isNewRow) {
        var self = this;

        // Get render column
        var columnIndex = column.index - 1;
        var renderColumn = self.columns[columnIndex];
        var properties = self.cellMetadata[key][columnIndex].properties || renderColumn.originalProperties;
        var visible = properties.visible !== undefined ? properties.visible : true;
        var editable = properties.editable !== undefined ? properties.editable : true;

        // If the cell we are drawing is the summary cell, we need to make it readonly
       if (typeof key === "string" && key.indexOf("summary") >= 0 )
            editable = false;

        // Show editable cell when we are performing inline add operation
        if (isNewRow) {
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
                    }
                }

                // Execute cell post render
                renderColumn.postRender(key, cell);

                // Restore editable
                renderColumn.properties.editable = originalEditable;

            } else {

                if (typeof key === "string" && key.indexOf("summary") >= 0) {
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

    // Reserverd to make convertions of control properties
    convertProperties: function (properties) {

        // Change inline add
        properties.inlineAdd = false;

        // Change inline edit
        properties.inlineEdit = false;

        return properties;
    },


    /*
    * Applies grid plugin 
    */
    applyGridPlugin: function () {
        var self = this,
            grid = self.grid,
            properties = self.properties,
            mode = self.getMode();

        var pager = self.renderFactory.getTemplate("bizagi.grid.pagination");

        // Apply grid plugin
        grid.bizagi_grid_grouped_desktop({
            columns: self.buildColumnModel(),
            showSummary: properties.showSummary,
            title: properties.displayName,
            mode: self.getMode(),
            tableCssClass: "",
            sortBy: properties.sortBy || "",
            sortOrder: properties.sortOrder || "",
            smartPagination: true,
            collapse: (mode !== "execution") ? false : true, // por defecto las grillas seran colapsables en ejecucion
            collapseState: (mode !== "execution") ? false : self.collapseState,
            buttonsPst: (mode !== "execution") ? false : properties.buttonsPst,
            sortType: bizagi.override.gridDefaultSortBy || "asc",
            headerStyles: self.getHeaderStyles(),
            groupByColumns: self.groupByColumns() || [],
            template: {
                grid: self.renderFactory.getTemplate("bizagi.grid.grid"),
                waiting: self.renderFactory.getTemplate("bizagi.grid.waiting"),
                table: self.renderFactory.getTemplate("bizagi.grid.grouped.table"),
                emptyTable: self.renderFactory.getTemplate("bizagi.grid.table.empty"),
                column: self.renderFactory.getTemplate("bizagi.grid.grouped.column"),
                specialColumn: self.renderFactory.getTemplate("bizagi.grid.column.special"),
                row: self.renderFactory.getTemplate("bizagi.grid.grouped.row"),
                headerRow: self.renderFactory.getTemplate("bizagi.grid.grouped.header.row"),
                rowButtons: self.renderFactory.getTemplate("bizagi.grid.row.buttons"),
                cell: self.renderFactory.getTemplate("bizagi.grid.cell"),
                emptyCell: self.renderFactory.getTemplate("bizagi.grid.grouped.emptyCell"),
                specialCell: self.renderFactory.getTemplate("bizagi.grid.cell.special"),
                pager: pager,
                buttons: self.renderFactory.getTemplate("bizagi.grid.buttons"),
                dynamicPager: self.renderFactory.getTemplate("bizagi.grid.dynamicpager"),
                summary: self.renderFactory.getTemplate("bizagi.grid.grouped.summary"),
                summaryCell: self.renderFactory.getTemplate("bizagi.grid.grouped.summaryCell"),
                exportOptions: self.renderFactory.getTemplate("bizagi.grid.exportOptions")
            },
            actions: {
                add: properties.allowAdd,
                edit: (properties.allowEdit && properties.withEditForm && properties.data != null),
                remove: properties.allowDelete,
                details: properties.allowDetail,
                inlineAdd: properties.inlineAdd,
                allowMore: properties.allowMore,
                enableXlsExport: properties.enableXlsExport,
                enablePdfExport: properties.enablePdfExport
            },
            tooltips: {
                addLabel: properties.addLabel,
                editLabel: properties.editLabel,
                deleteLabel: properties.deleteLabel,
                detailLabel: properties.detailLabel,
                exportOptionsLabel: properties.exportOptionsLabel
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
            sortRequested: function (ui) {
                if (mode != "execution") {
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
    * Returns an array with the position of columns set to group by property
    */
    groupByColumns: function () {
        var self = this;
        var groupByColumns = [];

        for (var i = 0, l = self.columns.length; i < l; i++) {
            var column = self.columns[i];
            if (column.properties.groupBy) {
                groupByColumns.push(i + 1);
            }
        }

        return groupByColumns;
    },

    /*
    *
    */
    triggerGridPluginHandler: function () {

        var self = this;
        var args = Array.prototype.slice.call(arguments, 0);

        return self.grid.bizagi_grid_grouped_desktop.apply(self.grid, args);
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
                    if (self.disposed) return;
                    if (data) {
                        self.loadChanges(data.rows);
                        self.updateData(data);
                        self.triggerRenderChange();
                        self.dataReadyDeferred.resolve();
                    }
                });
    }
});