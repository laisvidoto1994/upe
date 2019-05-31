/* 
 * Simple Grid Control for Bizagi Mobile
 * @author: Richar Urbano <Richar.Urbano@Bizagi.com>
 */

(function ($) {
    $.fn.mobileGrid = function (options) {

        var defaultOptions = {
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
            title: "",
            tableCssClass: "",
            headerStyles: "",
            columnKeyStyle: "bz-rn-grid-column-key",
            columnHiddenStyle: "bz-rn-grid-column-hidden",
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
                details: true
            },
            mode: "execution"
        };

        var self = this;
        self.element = this;
        self.options = $.extend(defaultOptions, options || {});        

        // Init plugin
        init();

        return {
            setData: setData,
            getData: getData,
            getNewRowKeys: getNewRowKeys,
            changeCellValue: changeCellValue,
            refreshSummary: refreshSummary,
            getContainer: getContainer,
            processAction: processAction
        };

        /**
         * Constructor
         * @returns {} 
         */
        function init() {
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
            //element.addClass("ui-bizagi-grid-wrapper");
            element.attr("data-bizagi-id", options.id);

            // Calculate
            calculateKeyIndex();

            //collapse state
            self.collapseState = options.collapseState;

            // Start waiting signal 
            //self.startLoading(false);
        }        

        /**
         * Method to start loading for ajax data and update the ui
         * @returns {} 
         */
        function startLoading(bUseTimeout) {
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
        }

        /**
         * Method to remove the loading message
         * @returns {} 
         */
        function endLoading() {
            var element = self.element;

            // Remove waiting timeout
            if (self.waitingTimeout) {
                clearTimeout(self.waitingTimeout);
                self.waitingTimeout = null;
            }

            // Remove everything
            element.empty();
        }

        /**
         * This method updates the data and refreshes the grid
         * @param {} data 
         * @returns {} 
         */
        function setData(data) {
            // Set internal data
            self.data = data;
            calculateKeyIndex();

            // Call refresh
            refresh();
        }

        /**
         * This method retrieves the actual data from the grid
         * @returns {} 
         */
        function getData() {
            // Return internal data
            return self.data;
        }

        /**
         * Calculate key index
         * @returns {} 
         */
        function calculateKeyIndex() {
            var options = self.options;
            var columns = options.columns;
            var data = self.data;
            var indexedData = {};

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
        }

        /**
         * This method refreshes the grid
         * @returns {} 
         */
        function refresh() {
            // Cleans components
            _cleanComponents();
            //_cleanButtons();

            // Call the draw method
            self.components = {};
            draw();
        }

        /**
         * This method refreshes only the summary
         * @param {} columnIndex 
         * @returns {} 
         */
        function refreshSummary(columnIndex) {
            //var self = this;
            var options = self.options;
            var summary = _getComponent("summary");

            // Do nothing if the component is drawing or there is no summary
            if (self.drawing) return;
            if (!summary) return;

            // Resolve summary
            if (options.showSummary) {

                if (columnIndex) {
                    // Refresh an specific summary
                    refreshSummaryCell(columnIndex);

                } else {
                    // Clean and re-draw summary
                    summary.empty();
                    summary.append(drawSummary());

                    // Execute post-render
                    postRenderSummary(summary);
                }
            }
        }

        /**
         * This method changes a cell value in the grid
         * @param {} key 
         * @param {} columnIndex 
         * @param {} value 
         * @returns {} 
         */
        function changeCellValue(key, columnIndex, value) {
            if (self.indexedData[key]) {
                self.indexedData[key][columnIndex] = value;
            }
        }

        /**
         * This method draws the full grid associated with the data
         * @returns {} 
         */
        function draw() {
            var options = self.options;
            var element = self.element;

            // Start global drawing flag
            self.drawing = true;

            // Ends waiting signal
            endLoading();

            // Resolve grid template
            var html = $.fasttmpl(options.template.grid, {
                label: options.title,
                buttonsPst: options.buttonsPst,
                collapse: options.collapse,
                collapseState: self.collapseState,
                isDesign: (options.mode === "design")
            });

            // Call sub-drawers
            html = drawTable(html);
            self.grid = $(html).appendTo(element);

            // Post render the grid
            postRender(self.grid);

            // Attach paginator desktop
            attachPaginator();

            // Attach handlers
            attachHandlers();

            // Toggle visibility depending from row count
            if (self.data.rows.length === 0) {
                _getComponent("table").hide();
                _getComponent("pager").hide();

                _getComponent("emptyTable").show();

            } else {
                _getComponent("table").show();
                _getComponent("pager").show();

                //_getComponent("dynamicPager").hide();
                _getComponent("emptyTable").hide();
            }

            // End global drawing flag
            self.drawing = false;
        }

        /**
         * This method draws the table associated with the data
         * @param {} html 
         * @returns {} 
         */
        function drawTable(html) {
            var options = self.options;

            // Resolve table template
            var table = $.fasttmpl(options.template.table, {
                showSummary: options.showSummary,
                tableCssClass: options.tableCssClass
            });

            var emptyTable = $.fasttmpl(options.template.emptyTable);

            // Resolve header
            table = _replaceElement(table, "columns", drawHeader());

            // Resolve body
            table = _replaceElement(table, "rows", drawBody());

            // Resolve pager
            html = _replaceElement(html, "pager", drawPager());

            // Perform grid replaces
            html = _replaceElement(html, "table", table);
            html = _replaceElement(html, "emptyTable", emptyTable);

            return html;
        }

        /*
        *   Execute post-renders in all the grid
        */
        function postRender() {
            //var options = self.options;

            // Get grid rows
            var rows = _getComponent("cells");
            if (rows) {
                $.each(rows, function (i, row) {
                    row = $(row);
                    postRenderRow(row);
                });
            }
        }

        /**
        * Find if a column has a exact match for sort it
        * @returns {} 
        */
        function isExactMatch() {
            var options = self.options;
            var columns = options.columns;
            var sortBy = options.sortBy;

            var i = 0;
            var length = columns.length;

            for (; i < length;) {
                if (sortBy === columns[i++].name) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Execute post-renders in each cell after the element has been created
         * @param {} row 
         * @returns {} 
         */
        function postRenderRow(row) {
            //var self = this;
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
                            onCellReady(column, key, cell, isNewRow);
                        });
                } else {
                    onCellReady(column, key, $(cell), isNewRow);
                }
            });
        }

        /**
         * This method draws the table body
         * @returns {} 
         */
        function drawBody() {
            // Resolve rows
            var rows = "";

            $.each(self.data.rows, function (i, row) {
                rows += drawRow(row);
            });

            return rows;
        }

        /**
         * This method draws a grid row
         * @param {} rowData 
         * @param {} isNewRow 
         * @returns {} 
         */
        function drawRow(rowData, isNewRow) {
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

                if (options.maxColumns > 0) {
                    if (i < options.maxColumns + 1) {
                        // Draw normal cell
                        cells += drawCell(i, key, cell, newRow);
                    } else {
                        // Draw special cell
                        cells += drawSpecialCell(i, key, cell);
                        bSpecialCellAdded = true;
                    }
                } else {
                    // Draw normal cell
                    cells += drawCell(i, key, cell, newRow);
                }
            });

            // Resolve cells template
            row = _replaceElement(row, "cells", cells);
            return row;
        }

        /**
         * This method draws the grid header
         * @returns {} 
         */
        function drawHeader() {
            var options = self.options;

            // Resolve columns
            var columns = "";
            var bSpecialColumnAdded = false;

            self.exactMatch = isExactMatch();

            $.each(options.columns, function (i, column) {
                if (bSpecialColumnAdded) {
                    return;
                }

                if (options.maxColumns > 0) {
                    if (i <= self.options.maxColumns) {
                        // Draw normal column
                        columns += drawColumn(column);
                    } else {
                        // Draw special column
                        columns += drawSpecialColumn(column);
                        bSpecialColumnAdded = true;
                    }
                } else {
                    // Draw normal column
                    columns += drawColumn(column);
                }
            });

            return columns;
        }

        /**
         * This method draws a column header
         * @param {} column 
         * @returns {} 
         */
        function drawColumn(column) {
            var options = self.options;
            var cssClass;

            if (column.key) {
                cssClass = options.columnKeyStyle;
            } else {
                if (column.hidden) {
                    cssClass = options.columnHiddenStyle;
                } else {
                    cssClass = (typeof column.bizAgiProperties != "undefined" && column.bizAgiProperties.cssclass) ? column.bizAgiProperties.cssclass : "";
                }
            }

            // Resolve column template
            var sortActive = column.name === options.sortBy ? column.name === options.sortBy : column.name === options.sortBy.split(".")[0] && !self.exactMatch ? column.name === options.sortBy.split(".")[0] : false;

            return $.fasttmpl(options.template.column, $.extend({}, column, {
                sortActive: sortActive,
                sortType: options.sortOrder,
                headerLabelStyles: options.headerStyles ? options.headerStyles.label : "",
                headerStyles: options.headerStyles ? options.headerStyles.header : "",
                columnCssClass: cssClass
            }));
        }

        /**
         * This method draws the grid cell
         * @param {} columnIndex 
         * @param {} key 
         * @param {} value 
         * @param {} isNewRow 
         * @returns {} 
         */
        function drawCell(columnIndex, key, value, isNewRow) {
            var options = self.options;
            var messageValidation = "";

            isNewRow = isNewRow || false;

            // Ensure that data is mapped into a column
            if (!self.columnByIndex[columnIndex]) {
                return "";
            }

            // Get message
            if (columnIndex > 0) {
                messageValidation = self.columnByIndex[columnIndex].bizAgiProperties && self.columnByIndex[columnIndex].bizAgiProperties.messageValidation;
            }

            var isKey = self.columnByIndex[columnIndex].key;
            var hidden = options.columns[columnIndex].hidden || false;
            var cssClass;

            if (isKey) {
                cssClass = options.columnKeyStyle;
            } else {
                if (hidden) {
                    cssClass = options.columnHiddenStyle;
                } else {
                    cssClass = (typeof self.columnByIndex[columnIndex].bizAgiProperties != "undefined" && self.columnByIndex[columnIndex].bizAgiProperties.cssclass) ? self.columnByIndex[columnIndex].bizAgiProperties.cssclass : "";
                }
            }

            // Resolve cell template
            var cell = $.fasttmpl(options.template.cell, {
                isKey: isKey,
                hidden: hidden,
                isDesign: (options.mode === "design"),
                messageValidation: messageValidation,
                columnCssClass: cssClass
            });

            var result = onDrawCell(self.columnByIndex[columnIndex], key, value, isNewRow);
            if (!result) {
                result = "";
            }

            var async = typeof (result) === "object" && result.done;
            if (async) {
                if (result.state() === "resolved") {
                    // Fetch resolved result
                    cell = _replaceElement(cell, "cellContent", resolveResult(result));
                } else {
                    // Wait for result
                    cell = _replaceElement(cell, "cellContent", "");
                    self.asyncCells[key + "-" + columnIndex] = result;
                }

            } else {
                // Resolve cell content
                cell = _replaceElement(cell, "cellContent", result);
            }

            self.columnByIndex[columnIndex]["cell"] = $(cell);

            return cell;
        }

        /**
         * This method draws a grid pager
         * @returns {} 
         */
        function drawPager() {
            var options = self.options;
            var pagerData = {};

            pagerData.hasPagination = self.data.total > 1 ? true : false;
            pagerData.page = Number(self.data.page);

            // Calculate pages
            pagerData.pages = [];
            for (var i = 1; i <= self.data.total; i++) {
                pagerData.pages.push({
                    number: i,
                    active: (i === pagerData.page)
                });
            }

            // Set style pagination            
            pagerData.previousPage = (self.data.page > 1) ? self.data.page - 1 : 1;
            pagerData.nextPage = (self.data.page < self.data.total) ? self.data.page + 1 : self.data.total;
            pagerData.totalPages = self.data.total;

            return $.fasttmpl(options.template.pager, pagerData);
        }

        /**
         * Returns the resolved result from a promise when the promise has been executed already
         * @param {} promise 
         * @returns {} 
         */
        function resolveResult(promise) {
            var result;

            promise.done(function (data) {
                result = data;
            });

            return result;
        }

        /**
         * Method to attach any handler to the pager grid
         * @returns {} 
         */
        function attachPaginator() {
            if (self.data.total > 1) {

                var pagerContainer = _getComponent("pager").find("ul");
                var pagerOptions = {
                    totalPages: self.data.total,
                    actualPage: Number(self.data.page),
                    listElement: pagerContainer,
                    clickCallBack: function (options) {
                        changePage(options.page);
                    }
                };

                // Create pagination control 
                pagerContainer.mobilePagination(pagerOptions);
            }
        }

        /**
         * Method to attach any handler to the grid
         * @returns {} 
         */
        function attachHandlers() {

            // Add selection events
            _getComponent("rows").find("tr").on("click", function () {
                var key = $(this).attr("data-key");
                var businessKey = $(this).attr("data-business-key");

                selectRow(key, businessKey);
            });

            // Add sort events
            _getComponent("columns").find(".bz-rn-grid-column").on("click", function () {
                var columnIndex = $(this).attr("data-column-index");

                sortBy(columnIndex);
            });

            // ActionSheet to process actions
            _getComponent("rows").find("tr").actionSheet({
                actions: _showActions(),
                titleLabel: "Selected Row",
                setDataToShow: function (evt) {
                    var that = this;
                    var key = $(evt.target).closest("tr").attr("data-key");
                    var businessKey = $(evt.target).closest("tr").attr("data-business-key");

                    that.params = { key: key, businessKey: businessKey };
                },
                actionClicked: function (action) {
                    var that = this;

                    processAction(action.guid, that.params);
                    unselectRow();
                },
                cancelClicked: function (event) {
                    unselectRow();
                }
            });
        }

        /**
         *  Method to get the valid options to the grid
         * @returns {} 
         */
        function _showActions() {
            var actions = [];
            var options = self.options;
            var tooltips = options.tooltips || {};
            var parameters = $.extend(options.actions, tooltips);

            if (parameters.edit) {
                actions.push({ guid: "edit", displayName: parameters.editLabel });
            }

            if (parameters.remove) {
                actions.push({ guid: "remove", displayName: parameters.deleteLabel });
            }

            if (parameters.details) {
                actions.push({ guid: "details", displayName: parameters.detailLabel });
            }

            return actions;
        }

        /**
         * Process an action in order to do something with the grid
         * @param {} action 
         * @param {} params 
         * @returns {} 
         */
        function processAction(action, params) {

            if (action === "edit") {
                onEditRow(params);
            }

            if (action === "remove") {
                onDeleteRow();
            }

            if (action === "details") {
                onShowDetails(params);
            }
        }

        /**
         * Changes the current page in the grid
         * @param {} page 
         * @returns {} 
         */
        function changePage(page) {
            var currentPage = Number(self.data.page);
            var total = self.data.total;
            var newPage = page;

            if (newPage === currentPage || newPage < 1 || newPage > total)
                return;

            //refresh components cells and rows
            _cleanComponents();

            // Update internal options
            self.page = Number(newPage);

            // Execute handler
            onPageRequested();
        }

        /**
         * Sort the grid by a column
         * @param {} columnIndex 
         * @param {} sortType 
         * @returns {} 
         */
        function sortBy(columnIndex, sortType) {
            var options = self.options;
            var column = self.columnByIndex[columnIndex];

            if (typeof (options.sortBy) === "undefined") {
                return;
            }

            // Set new sort type reversed to current, if the sort column has not changed
            if (typeof (column.name) === "undefined") {
                column.name = column.label;
            }

            if (column.name === options.sortBy) {
                sortType = sortType || (options.sortOrder === "asc" ? "desc" : "asc");
            } else {
                if (column.name === options.sortBy.split(".")[0]) {
                    sortType = sortType || (options.sortType === "asc" ? "desc" : "asc");
                } else {
                    sortType = sortType || options.sortType;
                }
            }

            // Update internal options
            if (options.sortBy.split(".").length > 1) {
                if (options.sortBy.split(".")[0] !== column.name) {
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
            _cleanComponents();

            // Execute handler
            onSortRequested();
        }

        /**
         *  Selects a row in the grid
         * @param {} key 
         * @param {} businessKey 
         * @returns {} 
         */
        function selectRow(key, businessKey) {

            if (self.selectedRow === key) {
                // Invoke un-select handler
                onRowUnselected();

                // Update internal options
                self.selectedRow = 0;
                self.selectedBusinessKey = 0;
            } else {
                if (self.selectedRow !== 0) {
                    // Invoke un-select handler
                    onRowUnselected();
                }

                // Update internal options
                self.selectedRow = key;
                self.selectedBusinessKey = businessKey;

                // Invoke select handler
                onRowSelected();
            }
        }

        /**
         * Unselects a row in the grid
         * @returns {} 
         */
        function unselectRow() {
            if (self.selectedRow !== 0) {
                // Invoke un-select handler
                onRowUnselected();

                self.selectedRow = 0;
                self.selectedBusinessKey = 0;
            }
        }

        /**
         * Executes the on draw cell handler
         * @param {} column 
         * @param {} key 
         * @param {} value 
         * @param {} isNewRow 
         * @returns {} 
         */
        function onDrawCell(column, key, value, isNewRow) {
            return _triggerHandler("drawCell", { column: column, key: key, value: value, isNewRow: isNewRow });
        }

        /**
         * Executes on cell ready handler
         * @param {} column 
         * @param {} key 
         * @param {} cell 
         * @param {} isNewRow 
         * @returns {} 
         */
        function onCellReady(column, key, cell, isNewRow) {
            return _triggerHandler("cellReady", { column: column, key: key, cell: cell, isNewRow: isNewRow });
        }

        /**
         * Executes the row selected handle
         * @returns {} 
         */
        function onRowSelected() {
            return _triggerHandler("rowSelected", { key: self.selectedRow });
        }

        /**
         * Executes the row un-selected handler
         * @returns {} 
         */
        function onRowUnselected() {
            return _triggerHandler("rowUnselected", { key: self.selectedRow });
        }

        /**
         * Executes the on delete row handler
         * @returns {} 
         */
        function onDeleteRow() {
            return _triggerHandler("deleteRow", { key: self.selectedBusinessKey });
        }

        /**
         * Executes the on show details handler
         * @returns {} 
         */
        function onShowDetails() {
            return _triggerHandler("showFormDetails", { key: self.selectedBusinessKey });
        }

        /**
         * Executes the on edit row handler
         * @returns {} 
         */
        function onEditRow() {
            return _triggerHandler("editRow", { key: self.selectedBusinessKey });
        }

        /**
         * Executes the page requested handler
         * @returns {} 
         */
        function onPageRequested() {
            // Start loading signal 
            //startLoading();

            // Trigger handler
            return _triggerHandler("pageRequested", _buildRefreshParameters());
        }

        /**
         * Executes the sort requested handler
         * @returns {} 
         */
        function onSortRequested() {
            // Start loading signal 
            //startLoading();


            // Trigger handler
            return _triggerHandler("sortRequested", _buildRefreshParameters());
        }

        /**
         * Calls directly to handler callback
         * @param {} type 
         * @param {} data 
         * @returns {} 
         */
        function _triggerHandler(type, data) {
            var callback = options[type];

            if (!callback) {
                return null;
            }
            return callback.call(self.element, data);
        }

        /**
         * Cleans the components 
         * @returns {} 
         */
        function _cleanComponents() {
            self.components = {};
        }

        /**
         * Gets the component
         * @param {} component 
         * @returns {} 
         */
        function _getComponent(component) {
            var element = self.element;

            if (!self.components[component]) {
                var foundComponent = $("[data-bizagi-component=" + component + "]", element);
                if (foundComponent != null && foundComponent.length > 0) {
                    self.components[component] = foundComponent;
                }
            }
            return self.components[component];
        }

        /**
         * Replaces a matched element in the container for the specified "replace" element
         * @param {} html 
         * @param {} element 
         * @param {} replace 
         * @returns {} 
         */
        function _replaceElement(html, element, replace) {
            return html.replace("{{element " + element + "}}", replace);
        }

        /**
         * Return the event handler parameters object
         * @returns {} 
         */
        function _buildRefreshParameters() {
            var options = self.options;
            var sortColumn = (options.sortColumn != undefined) ? options.sortColumn.index : 1;
            return { page: self.page, sortBy: options.sortBy, sortType: options.sortOrder, sortColumnIndex: sortColumn };
        }

        /**
         * Return the new created ids
         * @returns {} 
         */
        function getNewRowKeys() {
            var rows = _getComponent("rows").find("[data-new-row]");

            return $.map(rows, function (row, i) {
                return $(row).data("business-key");
            });
        }

        /**
         * Get current content 
         * @returns {} 
         */
        function getContainer() {
            return $(self.element);
        }


    }
})(jQuery);