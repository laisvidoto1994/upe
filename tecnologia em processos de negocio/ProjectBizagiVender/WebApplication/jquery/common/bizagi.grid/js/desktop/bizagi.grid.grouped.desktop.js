/*
*   Name:
*   Author: Diego Parra
*   Comments:
*   -   This widget will extend the bizagi grid widget to specialize into a desktop view
*
*   Markup: <div></div>
*
*   Styles:
*   - css/bizagi/desktop/controls/bizagi.grid.css
*/

(function ($) {
    $.widget('ui.bizagi_grid_grouped_desktop', $.ui.bizagi_grid_desktop, {
        options: $.extend($.ui.bizagi_grid.prototype.options, {
            smartPagination: false
        }),

        /*
        *   This method draws the table body
        */
        drawBody: function () {
            var self = this;
            self.groupByValues = {};
            self.groupByPreviousValues = {};
            self.rowsGroupData = {};
            self.summaryGroup = 0;

            // Resolve rows
            self.rows = "";
            $.each(self.data.rows, function (i, row) {
                if (self.isNewGroup(row)) {
                    // Resolve summary
                    if (self.isNewSummarygroup()) {
                        self.drawSummaryRows(row);
                    }

                    self.rows += self.drawGroupingRows(row, false);
                }

                self.addRowGroupData(row);
                self.rows += self.drawRow(row);
            });

            //Replace totalizer value
            self.groupByValues = {};
            $.each(self.data.rows, function (i, row) {
                 self.drawGroupingRows(row, true);
            });

            return self.rows;
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
                tableCssClass: options.tableCssClass,
                groupByColumns: options.groupByColumns || []
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
        *   This method draws a column header
        */
        drawColumn: function (column) {
            var self = this;
            var options = self.options;
            var cssClass = (typeof column.bizAgiProperties != "undefined" && column.bizAgiProperties.cssclass) ? column.bizAgiProperties.cssclass : "";

            if (self.showColumn(column)) {
                // Resolve column template
                return $.fasttmpl(options.template.column, $.extend({}, column, {
                    sortActive: column.name == options.sortBy ? column.name == options.sortBy : column.name == options.sortBy.split(".")[0] && !self.exactMatch ? column.name == options.sortBy.split(".")[0] : false,
                    sortType: options.sortOrder,
                    columnCssClass: cssClass,
                    headerLabelStyles: options.headerStyles ? options.headerStyles.label : '',
                    headerStyles: options.headerStyles ? options.headerStyles.header : ''
                }));
            } else {
                return "";
            }
        },

        /*
        *   This method draws a grid row
        */
        drawRow: function (rowData, isNewRow) {
            var self = this;
            var options = self.options;
            var key = rowData[self.columnKeyIndex];
            var groupByColumns = options.groupByColumns ? options.groupByColumns.length : 0;
            var newRow = isNewRow || false;
            var rnd = Math.floor(Math.random() * 10000);
            var row = $.fasttmpl(options.template.row, {
                key: rnd,
                isNewRow: isNewRow,
                businessKey: key
            });

            row = self._replaceElement(row, "empty-cells", self.drawEmptyCells({ cells: groupByColumns, conectorV: true }));

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
        *   This method draws the grid cell
        */
        drawCell: function (columnIndex, key, value, isNewRow) {
            var self = this;

            if (self.showColumn(self.columnByIndex[columnIndex])) {
                return self._super(columnIndex, key, value, isNewRow);
            }

            return "";
        },
        /*
        * This method draws the rows of grouping
        */
        drawGroupingRows: function (row, drawTotalizer) {
            var self = this;
            var levels = self.getGroupLevels(row);
            var rows = "";

            if(drawTotalizer)self.setGroupByValues(row);

            for (var i = 0, l = levels.length; i < l; i++) {
                var level = levels[i];
                rows += self.drawGroupRow(level.deep, l - i, level.position, row, drawTotalizer);
            }

            if(!drawTotalizer)self.setGroupByValues(row);
            return rows;
        },

        /*
        * This method returns true if the current row, begins a new row grouped
        */
        isNewGroup: function (row) {
            var self = this;
            var options = self.options;
            var groupByColumns = options.groupByColumns;

            if (groupByColumns.length == 0) {
                return false;
            }

            if (self.areIdenticalValues(row)) {
                return false;
            }

            return true;
        },


        /*
        * This method returns true if the current row, begins a new summary row grouped
        */
        isNewSummarygroup: function () {
            var self = this,
                options = self.options;

            if (!options.showSummary) {
                return false;
            }

            if (!self.areIdenticalValues(self.groupByPreviousValues)) {
                return true;
            }
            return false;
        },

        /*
        * This method sets the values for row grouped
        */
        setGroupByValues: function (row) {
            var self = this;
            var options = self.options;
            var groupByColumns = options.groupByColumns;

            self.groupByPreviousValues = bizagi.clone(self.groupByValues);

            for (var i = 0, l = groupByColumns.length; i < l; i++) {
                var groupByColumn = groupByColumns[i];
                self.groupByValues[groupByColumn] = self.getColumnValue(row[groupByColumn]);
            }
        },

        /*
        * This method returns true if the values of current row are identical to values group
        * otherwise it returns false
        */
        areIdenticalValues: function (row) {
            var self = this;
            var options = self.options;
            var result = true;
            var groupByColumns = options.groupByColumns;

            for (var i = 0, l = groupByColumns.length; i < l; i++) {
                var groupByColumn = groupByColumns[i];
                result &= (self.groupByValues[groupByColumn] === self.getColumnValue(row[groupByColumn]));
            }

            return result;
        },

        /*
        * This method returns an array with the level of grouping
        */
        getGroupLevels: function (row) {
            var self = this,
                options = self.options,
                groupLevel = [],
                reset = false,
                groupByColumns = options.groupByColumns;

            for (var i = 0, l = groupByColumns.length; i < l; i++) {
                var groupByColumn = groupByColumns[i];

                if (reset || (self.groupByValues[groupByColumn] != self.getColumnValue(row[groupByColumn]))) {
                    groupLevel.push({ deep: i, position: groupByColumn });
                    reset = true;
                }
            }

            return groupLevel;
        },

        /*
        * This method returns true id the current columns should be displayed
        */
        showColumn: function (column) {

            if (typeof column.bizAgiProperties == "undefined") {
                return true;
            }

            return column.bizAgiProperties.showColumn;

        },

        /*
        *   This method gets the columns enabled to dispay
        */
        getValidColumns: function () {
            var self = this,
                options = self.options;

            self.validColumns = self.validColumns || [];

            if (self.validColumns.length == 0) {
                self.validColumns = $.grep(options.columns, function (column) {
                    return self.showColumn(column);
                });
            }

            return self.validColumns;
        },

        /*
        *   This method draws a grid grouped row
        */
        drawGroupRow: function (emptyCells, level, position, row, drawTotalizer) {
            var self = this,
                options = self.options,
                result, groupData, totalizer="";

            realColumnsData = self.options.columns.filter(function (obj) {
                var showColumn = obj.bizAgiProperties ? obj.bizAgiProperties.showColumn : false;
                return (obj.index !== 0 && showColumn);
            });

            if (drawTotalizer) {

                groupData = self.getRowsGroupData(emptyCells);

                $.each(realColumnsData, function (i, column) {
                    if (column.summarizeBy) {
                        totalizer = self.calculateSummaryGroup(column, groupData);
                        if (column.summarizeBy !== "count") {
                            totalizer = self.getFormatedValue(column, totalizer);
                        }
                        self.rows = self._replaceElement(self.rows, "cellContent", totalizer);
                    }
                });
            }
            else{
                    var headerRow = $.fasttmpl(options.template.headerRow, {
                        columnTitle: self.getColumnTitle(row, position),
                        colspan: level + 1,
                        columns:realColumnsData,
                        level: emptyCells
                    });

                    result = self._replaceElement(headerRow, "empty-cells", self.drawEmptyCells({ cells: emptyCells, conectorV: true }));
            }


            return result;
        },

        /*
        * This Method draws empty cells for grouping
        */
        drawEmptyCells: function (params) {
            var self = this,
                options = self.options;

            params = params || {};
            params.cells = params.cells || 0;

            var cells = "";

            for (var i = 0; i < params.cells; i++) {
                cells += $.fasttmpl(options.template.emptyCell, {
                    conectorV: options.showSummary && params.conectorV,
                    conectorCorner: options.showSummary && params.conectorCorner,
                    conectorH: options.showSummary && params.conectorH
                });
            }

            return cells;
        },

        /*
        * This method gets a title of column grouped
        */
        getColumnTitle: function (row, position) {
            var self = this,
                options = self.options;

            var value = self.getFormatedValue(options.columns[position], self.getColumnValue(row[position]));
            var columnName = self.getColumnName(position);
            var displayType = options.columns[position] && options.columns[position].bizAgiProperties.displayTypeHeader;


            if (displayType == "label") {
                return columnName;
            }

            if (displayType == "value") {
                return value;
            }

            if (displayType == "reversed") {
                return value + ": " + columnName;
            }

            return columnName + ": " + value;

        },

        getFormatedValue: function (column, value) {
            var properties, type, options = {};
            if (column) {
                properties = column.bizAgiProperties;
                type = properties.type;
                switch (type) {
                    case "columnMoney":
                        var format = bizagi.localization.getResource("numericFormat");
                        properties.allowDecimals = properties.allowDecimals ? (properties.numDecimals ? properties.numDecimals : (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits : 2)) : 0;
                        properties.numDecimals = properties.allowDecimals ? (properties.numDecimals ? properties.numDecimals : (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits : 2)) : 0;
                        options.positiveFormat = format.positiveFormat;
                        options.negativeFormat = format.negativeFormat;
                        options.decimalSymbol = typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator : format.decimalSymbol;
                        options.digitGroupSymbol = typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.groupSeparator : format.digitGroupSymbol;
                        options.groupDigits = true;
                        options.colorize = false;
                        options.roundToDecimalPlace = properties.numDecimals
                        options.symbol = typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.symbol : format.symbol;
                        var label = $('<label/>').html(value);
                        label.formatCurrency(options);
                        value = label.text();
                        break;
                    case "columnBoolean":
                        if (bizagi.util.parseBoolean(value) == true) {
                            value = bizagi.localization.getResource("render-boolean-yes");
                        } else if (bizagi.util.parseBoolean(value) == false) {
                            value = bizagi.localization.getResource("render-boolean-no");
                        } else {
                            value = "";
                        }
                        break;
                    case "columnSearch":
                        if (value) {
                            if (value.value) {
                                value = value.value;
                            } else {
                                if (value.label) {
                                    value = value.label;
                                } else {
                                    value = "";
                                }
                            }
                        } else {
                            value = "";
                        }
                        break;
                    case "columnNumber":
                        var format = bizagi.localization.getResource("numericFormat");
                        properties.allowDecimals = properties.allowDecimals ? (properties.numDecimals ? properties.numDecimals : (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits : 2)) : 0;
                        properties.numDecimals = properties.allowDecimals ? (properties.numDecimals ? properties.numDecimals : (typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits : 2)) : 0;
                        options.positiveFormat = format.positiveFormat;
                        options.negativeFormat = format.negativeFormat;
                        options.decimalSymbol = typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator : format.decimalSymbol;
                        options.digitGroupSymbol = typeof (BIZAGI_DEFAULT_CURRENCY_INFO) !== "undefined" ? BIZAGI_DEFAULT_CURRENCY_INFO.groupSeparator : format.digitGroupSymbol;
                        options.groupDigits = true;
                        options.colorize = false;
                        options.symbol = "";
                        options.roundToDecimalPlace = properties.numDecimals
                        var label = $('<label/>').html(value);
                        if (properties.dataType == 6 || properties.dataType == 8 || properties.dataType == 10 || properties.dataType == 11) {
                            label.formatCurrency(options);
                        }
                        value = label.text();
                        if (column.bizAgiProperties.percentage) {
                            value += "%";
                        }
                        break;
                    case "columnDate":
                        if (value) {
                            var dateObj;
                            var defaultDateFormat = bizagi.localization.getResource("dateFormat");
                            var defaultTimeFormat = bizagi.localization.getResource("timeFormat");
                            properties.dateFormat = properties.dateFormat || defaultDateFormat;
                            properties.timeFormat = properties.timeFormat || defaultTimeFormat;
                            properties.fullFormat = properties.dateFormat;
                            if (properties.timePickerFormat !== undefined) {
                                dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value, true);
                            } else {
                                if (properties.showTime) {
                                    var INVARIANT_FORMAT = "MM/dd/yyyy H:mm:ss";
                                    if (properties.fullFormat.search(/[h|H]+/ig) === -1) {
                                        properties.fullFormat = properties.fullFormat + ' ' + properties.timeFormat;
                                    }
                                    if (typeof value == "string") {
                                        if (value.length == INVARIANT_FORMAT.length || value.length == (INVARIANT_FORMAT.length + 1)) {
                                            dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value, true);
                                        } else {
                                            dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value);
                                            dateObj.setHours(0, 0, 0, 0);
                                        }
                                    } else {
                                        dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value, true);
                                    }
                                } else {
                                    dateObj = bizagi.util.dateFormatter.getDateFromInvariant(value);
                                }
                            }
                            value = bizagi.util.dateFormatter.formatDate(dateObj, properties.fullFormat, self.i18n);
                        }
                        break;
                }
            }
            return value;
        },

        /*
        * This method gets displayName of the column grouped
        */
        getColumnName: function (position) {
            var self = this,
                options = self.options;

            var column = options.columns[position];

            return column.bizAgiProperties.displayName;
        },

        /*
        * This method gets the current value of the column grouped
        */
        getColumnValue: function (value) {
            var self = this;

            if (typeof value == "object" && value != null) {
                if (value.length == 0) {
                    return "";
                } else if (value.length == 2) {
                    return self.getColumnValue(value[1]);
                } else if (typeof value[0] == "object") {
                    return self.getColumnValue(value[0]);
                } else {
                    return value;
                }
            } else {
                return value;
            }
        },



        /*
        * This method return the colspan number, it is necessary to draw the grouped row
        */
        getColSpan: function (level) {
            var self = this,
                options = self.options;
            var length = options.columns.length - 1;

            for (var i = 0, l = options.columns.length; i < l; i++) {
                var column = options.columns[i];
                if (!self.showColumn(column)) {
                    length = length - 1;
                }
            }

            return length + level;
        },

        /*
        * This method builds the tree of data used for totalize in subgroups
        */
        addRowGroupData: function (row) {
            var self = this,
                valuesGroup = self.rowsGroupData,
                values = self.groupByValues;

            for (var key in values) {
                var value = values[key];
                valuesGroup[value] = valuesGroup[value] || {};
                valuesGroup = valuesGroup[value];
            }

            valuesGroup.data = valuesGroup.data || [];
            valuesGroup.data.push(row);
        },

        /*
        * This method builds a tree with the data
        */
        getRowsGroupData: function (deep) {
            var self = this,
                valuesGroup = self.rowsGroupData,
                i = 0,
                values = self.groupByValues;

            for (var key in values) {
                var value = values[key];
                valuesGroup = valuesGroup[value];
                if (i == deep) {
                    break;
                }
                i++;
            }

            if (valuesGroup.data) {
                return valuesGroup.data;
            }

            return self.getNestedRows(valuesGroup);
        },

        /*
        *This method builds a tree with the data
        */
        getNestedRows: function (group, data) {
            var self = this;
            data = data || [];

            for (var item in group) {
                if (group[item].data) {
                    data = data.concat(group[item].data);
                } else {
                    data = self.getNestedRows(group[item], data);
                }
            }

            return data;
        },


        /*
        * This method draws a summary grouped row
        */
        drawSummaryRows: function (row) {
            var self = this;
            var levels = self.getGroupLevels(row);
            var rows = "";
            for (var i = 0, l = levels.length; l > i; l--) {
                var level = levels[l - 1];
                rows += self.drawSummaryRow(level.deep);
            }

            return rows;
        },

        /*
        * This method draws a summary group
        */
        drawSummaryRow: function (deep) {
            var self = this,
                options = self.options,
                groupByColumns = options.groupByColumns ? options.groupByColumns.length : 0;

            var groupData = self.getRowsGroupData(deep);
            var row = $.fasttmpl(options.template.summary, {
                level: deep
            });

            var cells = "";
            var conectorH = false;
            var conectorCorner;

            for (var i = 0; i < groupByColumns; i++) {

                conectorCorner = (i == deep);
                cells += self.drawEmptyCells({
                    cells: 1,
                    conectorCorner: conectorCorner,
                    conectorH: conectorH,
                    conectorV: !conectorH && !conectorCorner
                });

                if (i == deep) {
                    conectorH = true;
                }
            }

            row = self._replaceElement(row, "empty-cells", cells);
            cells = "";

            // Resolve summary cells
            $.each(options.columns, function (i, column) {
                // Draw summary group column
                cells += self.drawSummaryGroupCell(column, groupData);

            });

            // Resolve cells template
            row = self._replaceElement(row, "summary-cells", cells);
            return row;

        },

        /*
        *   This method draws the cells for summary
        */
        drawSummary: function () {
            var self = this,
                options = self.options,
                groupByColumns = options.groupByColumns ? options.groupByColumns.length : 0;

            var row = $.fasttmpl(options.template.summary);

            row = self._replaceElement(row, "empty-cells", self.drawEmptyCells({ cells: groupByColumns }));

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

            if (!self.showColumn(column)) {
                return "";
            }

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
        * This method draws a grouped cell
        */
        drawSummaryGroupCell: function (column, groupData) {
            var self = this;
            var options = self.options;
            var summaryKey = "summary " + self.summaryGroup++;

            if (!self.showColumn(column)) {
                return "";
            }

            // Resolve cell template
            var cell = $.fasttmpl(options.template.summaryCell, {
                hidden: column.hidden || false,
                summarizeBy: column.summarizeBy,
                summary: summaryKey
            });

            var result = self.onDrawCell(column, summaryKey, self.calculateSummaryGroup(column, groupData), false);
            result = (result != undefined && typeof (result) != "number") ? result.replace("summaryValue", self.calculateSummaryGroup(column, groupData)) : result;

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
        *   Calculates the summary for a column given the data
        */
        calculateSummaryGroup: function (column, dataRowsgroup) {
            var self = this;
            var operation = column.summarizeBy;
            dataRowsgroup = dataRowsgroup || [];

            //Consider the default values in the operations
            $.each(dataRowsgroup, function (i, value) {
                if (typeof dataRowsgroup[i][column.index] != "undefined" && dataRowsgroup[i][column.index] == null && column.bizAgiProperties.defaultvalue != null) {
                    dataRowsgroup[i][column.index] = column.bizAgiProperties.defaultvalue;
                }
            });
            var columnValues = $.map(dataRowsgroup, function (row, i) { return row[column.index]; });
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
                columnValues = dataRowsgroup;

                for (var i = 0; i < columnValues.length; i++) {
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
        *   Execute post-renders in each cell after the element has been created
        */
        postRenderRow: function (row) {
            var self = this;
            var columns = self.getValidColumns();
            var key = row.attr("data-business-key");
            var isNewRow = row.attr("data-new-row");
            var cells = row.is("[data-bizagi-component=cells]") ? row.children() : row.find("[data-bizagi-component=cells]").children();
            cells = cells.not(".ui-bizagi-grid-ignore");
            $.each(cells, function (i, cell) {
                var column = columns[i];
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
        *   Execute post-renders in all the grid
        */
        postRender: function () {
            var self = this;
            var options = self.options;

            self._super();

            // Get grid grouped rows
            if (options.showSummary) {
                var rows = self._getComponent("grouped-summary-cells");
                if (rows) {
                    $.each(rows, function (i, row) {
                        row = $(row);
                        self.postRenderGroupedSummary(row);
                    });
                }
            }

        },

        /*
        *   Execute post-renders in each summary cell after the element has been created
        */
        postRenderGroupedSummary: function (row) {
            var self = this;
            var columns = self.getValidColumns();
            var cells = row.is("[data-bizagi-component=grouped-summary-cells]") ? row.children().not(".ui-bizagi-grid-ignore") : [];
            $.each(cells, function (i, cell) {
                var column = columns[i];
                if (column.key) return; // Omit key column

                var key = $(cell).attr("data-grouped-summary-key");
                if (key) {
                    // Check if the cell has an async result
                    var asyncResult = self.asyncCells[key + "-" + column.index];
                    if (asyncResult) {
                        $.when(asyncResult)
                            .done(function (html) {
                                // Append async result
                                cell = $(cell);
                                cell.append(html);
                                self.onCellReady(column, key, cell, false);
                            });
                    } else {
                        self.onCellReady(column, key, $(cell), false);
                    }
                }
            });
        },


        /*
        *   Execute post-renders in each summary cell after the element has been created
        */
        postRenderSummary: function (summary) {
            var self = this;
            var columns = self.getValidColumns();
            var cells = summary.is("[data-bizagi-component=grouped-summary-cells]") ? summary.children() : summary.find("[data-bizagi-component=grouped-summary-cells]").children();
            cells = cells.not(".ui-bizagi-grid-ignore");
            $.each(cells, function (i, cell) {
                var column = columns[i];
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
        * This method binds events
        */
        attachHandlers: function () {
            var self = this;

            self._super();

            // Add selection events
            self._getComponent("rows").find(".ui-bizagi-grid-grouped-header").bind("click", function () {
                var level = $(this).attr("data-grouped-level");
                var visibility = $(this).data("grouped-visibility");
                var group = $(this)
                            .nextUntil("[data-grouped-level = '" + level + "']")
                            .filter(function () {
                                var result = true;

                                var groupedLevel = $(this).attr("data-grouped-level");
                                var summaryLevel = $(this).attr("data-summary-grouped-level");

                                if (groupedLevel) {
                                    if (parseInt(groupedLevel) < level) {
                                        result = false;
                                    }
                                }

                                if (summaryLevel) {
                                    if (parseInt(summaryLevel) < level) {
                                        result = false;
                                    }
                                }

                                return result;
                                //return !($(this).attr("data-grouped-level") < level);
                            });

                $(this).data("grouped-visibility", !visibility);
                if (visibility) {
                    $(".ui-icon", this).removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
                    $(".ui-icon", group).removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
                    $(group).hide();
                } else {
                    $(".ui-icon", this).removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
                    $(".ui-icon", group).removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
                    $(group).show();
                }

            });


        }

    });

})(jQuery);