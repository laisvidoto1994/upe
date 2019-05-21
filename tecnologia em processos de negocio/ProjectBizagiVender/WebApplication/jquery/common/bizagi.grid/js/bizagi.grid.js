/*
 *   Name: 
 *   Author: Diego Parra
 *   Comments:
 *   -   This widget will implement a custom grid for bizagi rendering module
 *
 *   Markup: <div></div>
 *
 *   Styles:
 *   - Desktop: css/bizagi/desktop/controls/bizagi.grid.css
 *   - Tablet: css/bizagi/tablet/controls/bizagi.grid.css
 */

// TODO: Create templates

(function ($) {
    $.widget("ui.bizagi_grid", {
        options: {
            id: "no-id",
            columns: [],
            sortBy: "",
            sortType: "asc",
            showSummary: false,
            collapse: false,
            collapseState: false,
            data: {},
            indexedData: {},
            maxColumns: 0,
            buttonsPst: false,
            title: '',
            tableCssClass: '', // Style for entire table              
            headerStyles: '',
            template: {
                grid: "",
                waiting: "",
                table: "",
                emptyTable: "",
                column: "",
                specialColumn: "",
                row: "",
                rowButtons: "",
                cell: "",
                specialCell: "",
                pager: "",
                buttons: "",
                dynamicPager: "",
                summary: "",
                summaryCell: ""
            },
            actions: {
                add: true,
                edit: true,
                remove: true,
                details: true,
                allowMore: false,
                enableXlsExport: false,
                enablePdfExport: false
            },
            mode: "execution"
        },
        /*
        *   Constructor
        */
        _init: function () {
            var self = this;
            var options = self.options;
            var element = self.element;

            // Set object variables
            self.page = 1;
            self.changes = {};
            self.totalRows = 0;
            self.totalPages = 0;
            self.data = options.data;
            self.selectedRow = 0;
            self.components = {};
            self.buttons = {};
            self.asyncCells = {};

            // Build column indexes
            self.columnByIndex = {};
            self.columnByName = {};
            self.columnKeyIndex = 0;
            $.each(options.columns, function (i, column) {
                // Fix non-present properties
                column.key = typeof (column.key) !== "undefined" ? column.key : false;
                column.label = typeof (column.label) !== "undefined" ? column.label : column.name;
                column.sortType = "asc";

                // Index the column
                self.columnByIndex[column.index] = column;
                self.columnByName[column.name] = column;
                if (column.key) {
                    self.columnKeyIndex = column.index;
                }
            });

            // Set sort options
            options.sortBy = options.sortBy || self.columnByIndex[0].name;
            if (self.columnByName[options.sortBy]) {
                self.columnByName[options.sortBy].sortType = options.sortType;
            } else {
                if (self.columnByName[options.sortBy.split(".")[0]]) {
                    self.columnByName[options.sortBy.split(".")[0]].sortType = options.sortType;
                }
            }

            // Add base classes
            element.addClass("ui-bizagi-grid-wrapper");
            element.attr("data-bizagi-id", options.id);

            // Calculate
            self.calculateKeyIndex();

            //collapse state
            self.collapseState = options.collapseState;

            // Start waiting signal 
            self.startLoading(false);
        },
        /*
        *   Method to start loading for ajax data and update the ui
        */
        startLoading: function (bUseTimeout) {
            var self = this;
            bUseTimeout = typeof (bUseTimeout) !== "undefined" ? bUseTimeout : true;

            if (self.options.mode != "execution" || typeof self.options.sortBy === "undefined") {
                return;
            }

            // Draw the waiting template when the endLoading delays more than 250ms
            var waitingFn = function () {
                var element = self.element;
                var options = self.options;

                // Set null to timeout
                self.waitingTimeout = null;

                element.empty();
                element.append($.fasttmpl(options.template.waiting));
            };

            if (bUseTimeout) {
                self.waitingTimeout = setTimeout(waitingFn, 250);
            } else {
                waitingFn();
            }
        },

        /*
        *   Method to remove the loading message
        */
        endLoading: function () {
            var self = this;
            var element = self.element;

            // Remove waiting timeout
            if (self.waitingTimeout) {
                clearTimeout(self.waitingTimeout);
                self.waitingTimeout = null;
            }

            // Remove everything
            element.empty();
        },

        /*
        *   This method updates the data and refreshes the grid
        */
        setData: function (data) {
            var self = this;

            // Set internal data
            self.data = data;
            self.calculateKeyIndex();

            // Call refresh
            self.refresh();
        },
        /*
        *   This method retrieves the actual data from the grid
        */
        getData: function () {
            var self = this;

            // Return internal data
            return self.data;
        },

        /*
        *   Calculate key index
        */
        calculateKeyIndex: function () {
            var self = this;
            var columns = self.options.columns;
            var data = self.data;
            indexedData = {};

            if (data.rows) {
                $.each(data.rows, function (i, row) {
                    var key;
                    var row
                    $.each(columns, function (j, column) {
                        if (column.key) key = row[j];
                    });
                    indexedData[key] = row;
                });
            }
            self.indexedData = indexedData;
        },

        /*
        *   This method retrieves the changes made by the user
        */
        getChanges: function () {

        },

        /*
        *   This method refreshes the grid
        */
        refresh: function () {
            var self = this;

            // Cleans components
            self._cleanComponents();
            self._cleanButtons();

            // Call the draw method
            self.components = {};
            self.draw();
        },

        /*
        *   This method refreshes only the summary
        */
        refreshSummary: function (columnIndex) {
            var self = this;
            var options = self.options;
            var summary = self._getComponent("summary");

            // Do nothing if the component is drawing or there is no summary
            if (self.drawing) return;
            if (!summary) return;

            // Resolve summary
            if (options.showSummary) {

                if (columnIndex) {
                    // Refresh an specific summary
                    self.refreshSummaryCell(columnIndex);

                } else {
                    // Clean and re-draw summary
                    summary.empty();
                    summary.append(self.drawSummary());

                    // Execute post-render
                    self.postRenderSummary(summary);
                }
            }
        },

        /*
        *   Refresh a single summary cell
        */
        refreshSummaryCell: function (columnIndex) {
            var self = this;
            var options = self.options;
            var summary = self._getComponent("summary");
            var getCell = function (summary, columnIndex) {
                var cells = summary.is("[data-bizagi-component=summary-cells]") ? summary.children() : summary.find("[data-bizagi-component=summary-cells]").children();
                return $(cells[columnIndex]);
            };
            var cell = getCell(summary, columnIndex);

            // Omit index key
            var column = self.columnByIndex[columnIndex];
            if (column.key) return; // Omit key column

            // Clean and Execute render
            var html = self.drawSummaryCell(column);
            cell.replaceWith(html);

            // Recalculate cell
            cell = getCell(summary, columnIndex);

            // Execute post-render
            self.onCellReady(column, "summary", cell, false);
        },

        /*
        *   This method changes a cell value in the grid
        */
        changeCellValue: function (key, columnIndex, value) {
            var self = this;
            if (self.indexedData[key]) {
                self.indexedData[key][columnIndex] = value;
            }
        },

        /*
        *   This method draws the full grid associated with the data
        */
        draw: function () {
            var self = this;
            var options = self.options;
            var element = self.element;

            // Start global drawing flag
            self.drawing = true;

            // Ends waiting signal
            self.endLoading();

            if (options.orientation == "rtl") {

                // Resolve grid template
                var html = $.fasttmpl(options.template.gridRtl, {
                    label: options.title,
                    buttonsPst: options.buttonsPst,
                    collapse: options.collapse,
                    collapseState: self.collapseState,
                    isDesign: (options.mode === "design")
                });

            } else {
                // Resolve grid template
                var html = $.fasttmpl(options.template.grid, {
                    label: options.title,
                    buttonsPst: options.buttonsPst,
                    collapse: options.collapse,
                    collapseState: self.collapseState,
                    isDesign: (options.mode === "design")
                });
            }

            // Call sub-drawers
            html = self.drawTable(html);
            self.grid = $(html).appendTo(element);

            // Post render the grid
            self.postRender(self.grid);

            // Attach paginator desktop
            self.attachPaginator();

            // Attach handlers
            self.attachHandlers();

            // Toggle visibility depending from row count
            if (self.data.rows.length == 0) {
                self._getComponent("table").hide();
                self._getComponent("pager").hide();
                self._getButton("remove").hide();
                self._getButton("edit").hide();
                self._getComponent("dynamicPager").hide();
                self._getComponent("emptyTable").show();

            } else {
                self._getComponent("table").show();
                self._getButton("remove").show();
                self._getButton("edit").show();
                self._getComponent("emptyTable").hide();
                if (options.actions.allowMore) {
                    self._getComponent("dynamicPager").show();
                    self._getComponent("pager").hide();
                }
                else {
                    self._getComponent("pager").show();
                    self._getComponent("dynamicPager").hide();
                }

                if (options.actions.edit) {
                    self._getButton("edit").show();
                }

                if (options.actions.enableXlsExport || options.actions.enablePdfExport) {
                    self._getButton('show-grid-export-options').show();
                }
                else {
                    self._getButton('show-grid-export-options').css('display', 'none');
                }

            }

            //fix to avoid overlapping between table and the scrollbar in windows8
            if (typeof (Windows) != "undefined") {
                self.grid.find(".bz-rn-grid-data-wraper").addClass("bz-rn-grid-data-wraper-fix-w8");
            }

            // End global drawing flag
            self.drawing = false;
        },
        attachPaginator: function () {

        },
        /*
        *   This method draws the table associated with the data
        */
        drawTable: function (html) {
            var self = this;
            var options = self.options;

            // Resolve table template
            var table = $.fasttmpl(options.template.table, {
                showSummary: options.showSummary,
                tableCssClass: options.tableCssClass
            });
            var emptyTable = $.fasttmpl(options.template.emptyTable);

            // Resolve header
            table = self._replaceElement(table, "columns", self.drawHeader());

            // Resolve body
            table = self._replaceElement(table, "rows", self.drawBody());

            // Resolve summary
            if (options.showSummary) {
                table = self._replaceElement(table, "summary", self.drawSummary());
            }

            // Resolve pager
            html = self._replaceElement(html, "pager", self.drawPager());

            // Resolve buttons
            html = self._replaceElement(html, "buttons", self.drawButtons());

            //Resolve export options menu
            html = self._replaceElement(html, "gridExportOptions", self.drawGridExportOptions());

            // Resolve row buttons
            html = self._replaceElement(html, "rowButtons", self.drawRowButtons());

            // Resolve dynamic Pager
            html = self._replaceElement(html, "dynamicPager", self.drawDynamicPager());

            // Perform grid replaces
            html = self._replaceElement(html, "table", table);
            html = self._replaceElement(html, "emptyTable", emptyTable);
            return html;
        },
        /*
        * Find if a column has a exact match for sort it
        */
        isExactMatch: function () {
            var self = this;
            var columns = self.options.columns;
            var sortBy = self.options.sortBy;
            var i = 0, length = columns.length;
            for (; i < length;) {
                if (sortBy == columns[i++].name) {
                    return true;
                }
            }
            return false;
        },
        /*
        *   This method draws the grid header
        */
        drawHeader: function () {
            var self = this;
            var options = self.options;

            // Resolve columns
            var columns = "";
            var bSpecialColumnAdded = false;

            self.exactMatch = self.isExactMatch();

            $.each(options.columns, function (i, column) {
                if (bSpecialColumnAdded) {
                    return;
                }

                if (self.options.maxColumns > 0) {
                    if (i <= self.options.maxColumns) {
                        // Draw normal column
                        columns += self.drawColumn(column);
                    } else {
                        // Draw special column
                        columns += self.drawSpecialColumn(column);
                        bSpecialColumnAdded = true;
                    }
                } else {
                    // Draw normal column
                    columns += self.drawColumn(column);
                }
            });

            return columns;
        },
        /*
        *   This method draws a column header
        */
        drawColumn: function (column) {
            var self = this;
            var options = self.options;
            var cssClass = (typeof column.bizAgiProperties != "undefined" && column.bizAgiProperties.cssclass) ? column.bizAgiProperties.cssclass : "";

            // Resolve column template
            return $.fasttmpl(options.template.column, $.extend({}, column, {
                sortActive: column.name === options.sortBy ? column.name === options.sortBy : column.name === options.sortBy.split(".")[0] && !self.exactMatch ? column.name === options.sortBy.split(".")[0] : false,
                sortType: options.sortOrder,
                columnCssClass: cssClass,
                headerLabelStyles: options.headerStyles ? options.headerStyles.label : "",
                headerStyles: options.headerStyles ? options.headerStyles.header : ""
            }));
        },
        /*
        *   This method draws a special column header that will be drawn when the grid can't show more columns
        */
        drawSpecialColumn: function () {
            var self = this;
            var options = self.options;

            // Resolve column template
            return $.fasttmpl(options.template.specialColumn);
        },

        drawDynamicPager: function () {
            var self = this;
            var options = self.options;

            // Resolve column template
            return $.fasttmpl(options.template.dynamicPager);
        },

        /*
        *   This method draws the table body
        */
        drawBody: function () {
            var self = this;

            // Resolve rows
            var rows = "";
            $.each(self.data.rows, function (i, row) {
                rows += self.drawRow(row);
            });

            return rows;
        },

        /*
        *   This method draws a grid row
        */
        drawRow: function (rowData, isNewRow) {
            var self = this;
            var options = self.options;
            var key = rowData[self.columnKeyIndex];
            var newRow = isNewRow || false;
            var rnd = Math.floor(Math.random() * 10000);
            var row = $.fasttmpl(options.template.row, {
                key: rnd,
                isNewRow: isNewRow,
                businessKey: key
            });

            // Resolve cells
            var cells = "";
            var bSpecialCellAdded = false;
            $.each(rowData, function (i, cell) {
                if (bSpecialCellAdded) {
                    return;
                }

                if (self.options.maxColumns > 0) {
                    if (i < self.options.maxColumns + 1) {
                        // Draw normal cell
                        cells += self.drawCell(i, key, cell, newRow);
                    } else {
                        // Draw special cell
                        cells += self.drawSpecialCell(i, key, cell);
                        bSpecialCellAdded = true;
                    }
                } else {
                    // Draw normal cell
                    cells += self.drawCell(i, key, cell, newRow);
                }
            });

            // Resolve cells template
            row = self._replaceElement(row, "cells", cells);
            return row;
        },

        /*
        *   This method draws the cells for summary
        */
        drawSummary: function () {
            var self = this;
            var options = self.options;
            var row = $.fasttmpl(options.template.summary);
            var cells = "";

            // Resolve summary cells
            $.each(options.columns, function (i, column) {
                if (self.options.maxColumns > 0) {
                    if (i <= self.options.maxColumns) {
                        // Draw summary column
                        cells += self.drawSummaryCell(column);
                    }
                } else {
                    // Draw summary column
                    cells += self.drawSummaryCell(column);
                }
            });

            // Resolve cells template
            row = self._replaceElement(row, "summary-cells", cells);
            return row;
        },

        /*
        *   This method draws a single summary cell
        */
        drawSummaryCell: function (column) {
            var self = this;
            var options = self.options;

            // Resolve cell template
            var cell = $.fasttmpl(options.template.summaryCell, {
                hidden: column.hidden || false,
                summarizeBy: column.summarizeBy
            });

            var result = self.onDrawCell(column, "summary", self.calculateSummary(column), false);
            result = (result != undefined && typeof (result) != "number") ? result.replace("summaryValue", self.calculateSummary(column)) : result;

            if (!result) {
                result = "";
            }

            var async = typeof (result) === "object" && result.done;
            if (async) {
                if (result.state() === "resolved") {
                    // Fetch resolved result
                    cell = self._replaceElement(cell, "cellContent", self.resolveResult(result));
                } else {
                    // Wait for result
                    cell = self._replaceElement(cell, "cellContent", "");
                    self.asyncCells[key + "-" + columnIndex] = result;
                }

            } else {
                // Resolve cell content
                cell = self._replaceElement(cell, "cellContent", result);
            }

            return cell;
        },

        /*
        *   This method draws the grid cell
        */
        drawCell: function (columnIndex, key, value, isNewRow) {
            var self = this;
            var options = self.options;
            isNewRow = isNewRow || false;
            var messageValidation = "";

            // Ensure that data is mapped into a column
            if (!self.columnByIndex[columnIndex]) {
                return "";
            }

            // Get message
            if (columnIndex > 0) {
                messageValidation = self.columnByIndex[columnIndex].bizAgiProperties && self.columnByIndex[columnIndex].bizAgiProperties.messageValidation;
            }


            var cssClass = (typeof self.columnByIndex[columnIndex].bizAgiProperties != "undefined" && self.columnByIndex[columnIndex].bizAgiProperties.cssclass) ? self.columnByIndex[columnIndex].bizAgiProperties.cssclass : "";

            // Resolve cell template
            var cell = $.fasttmpl(options.template.cell, {
                isKey: self.columnByIndex[columnIndex].key,
                hidden: options.columns[columnIndex].hidden || false,
                isDesign: (options.mode === "design"),
                messageValidation: messageValidation,
                columnCssClass: cssClass
            });

            var result = self.onDrawCell(self.columnByIndex[columnIndex], key, value, isNewRow);
            if (!result) {
                result = "";
            }
            var async = typeof (result) === "object" && result.done;
            if (async) {
                if (result.state() === "resolved") {
                    // Fetch resolved result
                    cell = self._replaceElement(cell, "cellContent", self.resolveResult(result));
                } else {
                    // Wait for result
                    cell = self._replaceElement(cell, "cellContent", "");
                    self.asyncCells[key + "-" + columnIndex] = result;
                }

            } else {
                // Resolve cell content
                cell = self._replaceElement(cell, "cellContent", result);
            }

            self.columnByIndex[columnIndex]['cell'] = $(cell);
            return cell;
        },
        /*
        *   Returns the resolved result from a promise when the promise has been executed already
        */
        resolveResult: function (promise) {
            var result;
            promise.done(function (data) {
                result = data;
            });
            return result;
        },
        /*
        *   This method draws a special cell that will be drawn when the grid can't show more columns
        */
        drawSpecialCell: function (columnIndex) {
            var self = this;
            var options = self.options;

            // Ensure that data is mapped into a column
            if (!self.columnByIndex[columnIndex]) {
                return "";
            }

            // Resolve cell template
            var cell = $.fasttmpl(options.template.specialCell);

            return cell;
        },
        /*
        *   This method draws a group header
        */
        drawGroupHeader: function () {
            // TODO: Implement for PC version
        },
        /*
        *   This method draws a footer
        */
        drawFooter: function () {
            // TODO: Implement for PC version
        },
        /*
        *   This method draws a grid pager
        */
        drawPager: function () {
            var self = this;
            var options = self.options;

            // Calculate pages
            var pages = [];
            for (var i = 1; i <= self.data.total; i++) {
                pages.push({
                    number: i,
                    active: (i == self.data.page)
                });
            }

            // Resolve pager template
            return $.fasttmpl(options.template.pager, {
                page: self.data.page,
                pages: pages,
                records: self.data.records
            });
        },
        /*
        *   This method draws a grid button actions
        */
        drawButtons: function () {
            var self = this;
            var options = self.options;
            var tooltips = options.tooltips || {};

            var parameters = $.extend(options.actions, tooltips);

            if (self._canShowButtons()) {
                // Resolve buttons template
                if (options.orientation == "rtl") {
                    return $.fasttmpl(options.template.buttonsRtl, parameters);
                } else {
                    return $.fasttmpl(options.template.buttons, parameters);
                }
            } else {
                return "";
            }
        },

        /*
        * This method draws the export options menu
        */
        drawGridExportOptions: function () {
            var self = this,
                options = self.options,
                actions = options.actions;
            tooltips = options.tooltips || {};

            var parameters = $.extend({ enableXlsExport: actions.enableXlsExport, enablePdfExport: actions.enablePdfExport }, tooltips);

            return $.fasttmpl(options.template.exportOptions, parameters);
        },

        /*
        *   This method draws a row buttons,
        *   those buttons will be invisible, and will be activated when the user selects a row
        */
        drawRowButtons: function () {
            var self = this;
            var options = self.options;

            if (self._canShowRowButtons()) {
                // Resolve row buttons template
                if (options.orientation == "rtl") {
                    return $.fasttmpl(options.template.rowButtons.rtl, options.actions);
                } else {
                    return $.fasttmpl(options.template.rowButtons, options.actions);
                }
            } else {
                return "";
            }
        },
        /*
        *   Execute post-renders in all the grid
        */
        postRender: function () {
            var self = this;
            var options = self.options;

            // Get grid rows
            var rows = self._getComponent("cells");
            if (rows) {
                $.each(rows, function (i, row) {
                    row = $(row);
                    self.postRenderRow(row);
                });
            }

            // Get summary row
            if (options.showSummary) {
                var summary = self._getComponent("summary");
                self.postRenderSummary(summary);
            }

        },

        /*
        *   Execute post-renders in each cell after the element has been created
        */
        postRenderRow: function (row) {
            var self = this;
            var key = row.attr("data-business-key");
            var isNewRow = row.attr("data-new-row");
            var cells = row.is("[data-bizagi-component=cells]") ? row.children() : row.find("[data-bizagi-component=cells]").children();
            $.each(cells, function (i, cell) {
                var column = self.columnByIndex[i];
                if (column.key) return; // Omit key column

                // Check if the cell has an async result
                var asyncResult = self.asyncCells[key + "-" + column.index];
                if (asyncResult) {
                    $.when(asyncResult)
                            .done(function (html) {
                                // Append async result
                                cell = $(cell);
                                cell.append(html);
                                self.onCellReady(column, key, cell, isNewRow);
                            });
                } else {
                    self.onCellReady(column, key, $(cell), isNewRow);
                }
            });
        },

        /*
        *   Execute post-renders in each summary cell after the element has been created
        */
        postRenderSummary: function (summary) {
            var self = this;
            var cells = summary.is("[data-bizagi-component=summary-cells]") ? summary.children() : summary.find("[data-bizagi-component=summary-cells]").children();
            $.each(cells, function (i, cell) {
                var column = self.columnByIndex[i];
                if (column.key) return; // Omit key column

                // Check if the cell has an async result
                var asyncResult = self.asyncCells[key + "-" + column.index];
                if (asyncResult) {
                    $.when(asyncResult)
                            .done(function (html) {
                                // Append async result
                                cell = $(cell);
                                cell.append(html);
                                self.onCellReady(column, "summary", cell, false);
                            });
                } else {
                    self.onCellReady(column, "summary", $(cell), false);
                }
            });
        },

        /*
        *   Method to attach any handler to the grid
        */
        attachHandlers: function () { },

        //TODO IMPELEMNTANDO
        selectDynamicPager: function () {
            var self = this;
            self.onDynamicPager();
        },

        /*
        *   Changes the current page in the grid
        */
        changePage: function (page) {
            var self = this;
            var currentPage = Number(self.data.page);
            var total = self.data.total;
            var newPage = page;

            // Process previous page
            if (page == "previous") {
                if (currentPage > 1) {
                    newPage = currentPage - 1;
                } else {
                    return;
                }
            }
            // Process next page
            if (page == "next") {
                if (currentPage < total) {
                    newPage = currentPage + 1;
                } else {
                    return;
                }
            }

            //refresh components cells and rows
            self._cleanComponents();

            // Update internal options
            self.page = Number(newPage);

            // Execute handler
            self.onPageRequested();
        },

        /*
        *  Verify cells before sumitonchange
        */
        isValid: function () {
            var self = this;
            // Trigger handler
            return self._triggerHandler("isValid");
        },

        /*
        *   Sort the grid by a column
        */
        sortBy: function (columnIndex, sortType) {
            var self = this;
            var options = self.options;
            var column = self.columnByIndex[columnIndex];

            if (typeof options.sortBy === "undefined") {
                return true;
            }

            // Set new sort type reversed to current, if the sort column has not changed
            if (typeof (column.name) == "undefined") column.name = column.label;
            if (column.name == options.sortBy) {
                sortType = sortType || (options.sortOrder == "asc" ? "desc" : "asc");
            } else {
                if (column.name == options.sortBy.split(".")[0]) {
                    sortType = sortType || (options.sortType == "asc" ? "desc" : "asc");
                } else {
                    sortType = sortType || options.sortType;
                }
            }

            // Update internal options
            if (options.sortBy.split(".").length > 1) {
                if (options.sortBy.split(".")[0] != column.name) {
                    options.sortBy = column.name;
                } else {
                    options.sortBy = column.name;
                }
            } else {
                options.sortBy = column.name;
            }

            options.sortColumn = column;
            options.sortType = sortType;
            options.sortOrder = sortType;

            //refresh components cells and rows
            self._cleanComponents();

            // Execute handler
            self.onSortRequested();
        },
        /*
        *   Selects a row in the grid
        */
        selectRow: function (key, businessKey) {
            var self = this;

            if (self.selectedRow == key) {
                // Invoke un-select handler
                self.onRowUnselected();

                // Update internal options
                self.selectedRow = 0;
                self.selectedBusinessKey = 0;
            } else {
                if (self.selectedRow != 0) {
                    // Invoke un-select handler
                    self.onRowUnselected();
                }

                // Update internal options
                self.selectedRow = key;
                self.selectedBusinessKey = businessKey;

                // Invoke select handler
                self.onRowSelected();
            }
        },
        /*
        *   Unselects a row in the grid
        */
        unselectRow: function () {
            var self = this;

            if (self.selectedRow != 0) {
                // Invoke un-select handler
                self.onRowUnselected();
                self.selectedRow = 0;
                self.selectedBusinessKey = 0;
            }
        },

        /*
        *   Calculates the summary for a column given the data
        */
        calculateSummary: function (column) {
            var self = this;
            var operation = column.summarizeBy;
            //Consider the default values in the operations
            $.each(self.data.rows, function (i, value) {
                if (typeof self.data.rows[i][column.index] != "undefined" && self.data.rows[i][column.index] == null && column.bizAgiProperties.defaultvalue != null) {
                    self.data.rows[i][column.index] = column.bizAgiProperties.defaultvalue;
                }
            });
            var columnValues = $.map(self.data.rows, function (row, i) { return row[column.index]; });
            var result;

            // Don't calculate anything if there are no rows
            if (columnValues.length == 0) return 0;

            // Resolve operations
            if (operation == "sum") {
                result = 0;
                $.each(columnValues, function (i, value) { if (null != value) result += Number(value); });

            } else if (operation == "min") {
                result = columnValues[0] || 0;
                $.each(columnValues, function (i, value) { if (typeof (value) == "number" && null != value && (value < result)) result = Number(value); });
                if (result === Math.max()) result = null;

            } else if (operation == "max") {
                result = columnValues[0] || 0;
                $.each(columnValues, function (i, value) { if (typeof (value) == "number" && null != value && (value > result)) result = Number(value); });
                if (result === Math.min()) result = null;

            } else if (operation == "avg") {
                result = 0;
                $.each(columnValues, function (i, value) { if (null != value) result += Number(value); });
                result = result / columnValues.length;

            } else if (operation == "count") {
                result = 0;
                columnValues = self.data.rows;

                for (i = 0; i < columnValues.length; i++) {
                    var columnValue = columnValues[i][column.index];

                    if (columnValue instanceof Array && columnValue.length > 0) {
                        result += 1;
                    }
                    else if (!(columnValue instanceof Array) && columnValue != null) {
                        result += 1;
                    }
                }
            }
            return result;
        },

        /*
        *   Process an action in order to do something with the grid
        */
        processAction: function (action, params) {
            var self = this;

            if (action == "add") {
                self.onAddRow();
            }
            if (action == "edit") {
                self.onEditRow();
            }
            if (action == "remove") {
                self.onDeleteRow();
            }
            if (action == "more") {
                self.onShowMore(params.key);
            }
            if (action == "details") {
                self.onShowDetails(params);
            }

            if (action == "show-grid-export-options") {
                self.onShowExportGridOptions();
            }
        },
        /*
        *   Executes the page requested handler
        */
        onPageRequested: function () {
            var self = this;

            // Start loading signal 
            self.startLoading();

            // Trigger handler
            return self._triggerHandler("pageRequested", self._buildRefreshParameters());
        },
        /*
        *   Executes the sort requested handler
        */
        onSortRequested: function () {
            var self = this;

            // Start loading signal 
            self.startLoading();


            // Trigger handler
            return self._triggerHandler("sortRequested", self._buildRefreshParameters());
        },
        /*
        *   Executes the row selected handler
        */
        onRowSelected: function () {
            var self = this;

            return self._triggerHandler("rowSelected", { key: self.selectedBusinessKey });
        },
        /*
        *   Executes the row un-selected handler
        */
        onRowUnselected: function () {
            var self = this;
            return self._triggerHandler("rowUnselected", { key: self.selectedBusinessKey });
        },

        /*
        * Executes collapse grid
        */
        onCollapseGrid: function () {
            var self = this;
            return self._triggerHandler("performCollapseGrid");
        },

        //TODO:llamar
        onDynamicPager: function () {
            var self = this;
            return self._triggerHandler("moreRows", { key: self.selectedBusinessKey });
        },

        /*
        *   Executes the on draw cell handler
        */
        onDrawCell: function (column, key, value, isNewRow) {
            var self = this;
            return self._triggerHandler("drawCell", { column: column, key: key, value: value, isNewRow: isNewRow });
        },
        /*
        *   Executes on cell ready handler
        */
        onCellReady: function (column, key, cell, isNewRow) {
            var self = this;
            return self._triggerHandler("cellReady", { column: column, key: key, cell: cell, isNewRow: isNewRow });
        },

        /*
        *   Executes the on draw control handler
        */
        onDrawControl: function () {
            //TODO: Implement this
        },
        /*
        *   Executes the on draw group header handler
        */
        onDrawGroupHeader: function () {
            //TODO: Implement this
        },
        /*
        *   Executes the on add row handler
        */
        onAddRow: function () {
            var self = this;
            return self._triggerHandler("addRow");
        },
        /*
        *   Executes the on edit row handler
        */
        onEditRow: function () {
            var self = this;
            return self._triggerHandler("editRow", { key: self.selectedBusinessKey });
        },
        /*
        *   Executes the on delete row handler
        */
        onDeleteRow: function () {
            var self = this;
            return self._triggerHandler("deleteRow", { key: self.selectedBusinessKey });
        },
        /*
        *   Executes the on show more handler
        */
        onShowMore: function (key) {
            var self = this;
            return self._triggerHandler("showMore", { key: key });
        },
        /*
        *   Executes the on show details handler
        */
        onShowDetails: function () {
            var self = this;
            return self._triggerHandler("showFormDetails", { key: self.selectedBusinessKey });
        },
        /*
        * Executes the on show export grid options 
        */
        onShowExportGridOptions: function () {
            var self = this;
            return self._triggerHandler("showGridExportOptions");
        },

        /*
        *   Replaces a matched element in the container for the specified "replace" element
        */
        _replaceElement: function (html, element, replace) {
            return html.replace("{{element " + element + "}}", replace);
        },
        /*
        *   Return the event handler parameters object
        */
        _buildRefreshParameters: function () {
            var self = this;
            var options = self.options;
            var sortColumn = (options.sortColumn != undefined) ? options.sortColumn.index : 1;
            return { page: self.page, sortBy: options.sortBy, sortType: options.sortOrder, sortColumnIndex: sortColumn };
        },
        /*
        *   Calls directly to handler callback
        */
        _triggerHandler: function (type, data) {
            var callback = this.options[type];
            if (!callback) {
                return null;
            }
            return callback.call(this.element[0], data);
        },
        /*
        *   Gets the component
        */
        _getComponent: function (component) {
            var self = this;
            var element = self.element;
            if (!self.components[component]) {
                var foundComponent = $("[data-bizagi-component=" + component + "]", element);
                if (foundComponent != null && foundComponent.length > 0) {
                    self.components[component] = foundComponent;
                }
            }
            return self.components[component];
        },
        /*
        *   Gets the specific Button
        */
        _getButton: function (button) {
            var self = this;
            var element = self.element;
            if (!self.buttons[button])
                self.buttons[button] = $("[data-action=" + button + "]", element);
            return self.buttons[button];
        },
        /*
        * Cleans the components 
        */
        _cleanComponents: function () {
            var self = this;
            self.components = {};
        },
        /*
        * Cleans the buttons 
        */
        _cleanButtons: function () {
            var self = this;
            self.buttons = {};
        },
        /*
        *  Template method to check if buttons component must be rendered
        */
        _canShowButtons: function () {
            return true;
        },
        /*
        *  Template method to check if row buttons must be displayed when the row is selected
        */
        _canShowRowButtons: function () {
            return true;
        }

    });
})(jQuery);
