/*
*   Name: BizAgi Desktop JQGrid BizAgi Extension
*   Author: Diego Parra
*   Comments:
*   -   JQQGrid plugin for inline edition and quick search 
*/
(function ($) {
    $ = jQuery;

    /**
    * jqGrid extension for manipulating Grid Data
    * made by and for BizAgi
    * Depends on the BizAgi Rendering Plugin
    **/
    $.jgrid.extend({

        /*  
        *   Returns the internal column model
        */
        getColumnModel: function () {
            return this[0].p.colModel;
        },

        /*  
        *   Returns the internal data
        */
        getData: function () {
            return this[0].p.data;
        },

        /*  
        *   Returns the internal data
        */
        getCellOverride: function (key, column) {
            if (this[0].p.getCellOverride) return this[0].p.getCellOverride(key, column);
        },

        /*  
        *   Sets internal data into the grid
        */
        setInternalData: function (data) {
            var t = this[0];
            var i, val;
            t.p.data = data;

            // Refresh indexes
            var datalen = t.p.data.length;
            t.p._index = {};
            for (i = 0; i < datalen; i++) {
                val = t.p.data[i][0];
                t.p._index[val] = i;
            }
        },

        /*  
        *   Returns the visible table from the grid
        */
        getVisibleTable: function () {
            return $(".ui-jqgrid-btable", this[0].grid.bDiv);
        },

        /*  
        *   Strange fix for grid reloading
        */
        fixForDeleteLastRowInPage: function (pageNumber) {
            this[0].p.page = pageNumber;
            this[0].p.lastpage = pageNumber;
            this[0].p.records--;
            this[0].updatepager(true, false);
            this[0].grid.populate(pageNumber);
        },

        /*  
        *   Returns a grid table cell
        */
        getTableCell: function (row, column) {
            var tr = $(this).jqGrid("getInd", row, true);

            // If a tr has been found search for the columns
            if ($(tr).length && $(tr).length > 0) return $("td", tr).eq(column);
            // Else return a new in-memory-TD
            else return $("<td/>");
        },

        /* 
        *   This method converts each column in a full bizagi render 
        */
        editRow: function (rowId, id, columnId, renderColumns, cellChanged) {
            return this.each(function () {
                var columnModel = this.p.colModel;
                var t = this;
                var tr = $(this).jqGrid("getInd", id, true);
                $(tr).addClass("ui-state-active");

                // Get row data, if the grid is local all the data is allocated in this.p.data, when the grid is remote, just the page is allocated there
                var rowData;
                $.each(this.p.data, function (i, row) {
                    if (row[0] == id) {
                        rowData = row;
                    }
                });

                // Iterate each column in the row
                $('td', tr).each(function (i) {
                    var column = columnModel[i];
                    var td = $(this);

                    // Read metadata set when building the grid
                    if (column.key == true) {
                        td.text(rowData[i]);

                    } else {

                        // Clear current
                        td.empty();

                        // Apply bizagi rendering
                        var renderColumn = renderColumns[i - 1];
                        $(t).renderCell(td, renderColumn, id, rowData[i], true);

                        // If the column is the one that were clicked focus the render
                        if (renderColumn.columnIndex == columnId) {
                            var focusableElements = $("input, textarea, select", td);
                            if (focusableElements.length > 0) {
                                setTimeout(function () {
                                    $(focusableElements[0]).focus();
                                }, 10);
                            }
                        }

                        // Add change handler
                        renderColumn.bind("renderchange", function () {
                            if (cellChanged) {
                                // Call cell changed to update grid internal values
                                cellChanged(renderColumn);
                            }
                        });
                    }
                });
            });
        },

        finishRowEdition: function (id, renderColumns, callback) {
            return this.each(function () {
                var columnModel = this.p.colModel;
                var data = {};
                var key;
                var t = this;

                var tr = $(this).jqGrid("getInd", id, true);
                $(tr).removeClass("ui-state-active");
                var pos = t.p._index[id];

                // Iterate each column in the row
                $('td', tr).each(function (i) {
                    var td = $(this);
                    var column = columnModel[i];

                    if (column.key == true) {
                        // Read key
                        key = Number(td.text());
                        data[column.name] = key;

                    } else {

                        // Set new value 
                        var renderColumn = renderColumns[i - 1];

                        // Unbind  change handler
                        renderColumn.unbind("renderchange");

                        // Add data
                        t.p.data[pos][i] = data[column.name] = renderColumn.getCompositeValue(id);
                    }
                });

                // Call event
                if (callback)
                    callback(key, data);
            });
        },

        /*  
        *   Redraw all visible cells after the data has been set
        */
        reDraw: function (renderColumns, rowId) {
            return this.each(function () {
                var columnModel = this.p.colModel;
                var t = this;
                var data = t.p.data;
                $.each(data, function (i, item) {
                    var key = item[0];
                    var tr = $(t).jqGrid("getInd", key, true);

                    if (tr) {

                        // Iterate each column in the row
                        $('td', tr).each(function (j) {
                            var td = $(this);
                            var column = columnModel[j];

                            if (column != undefined && column.key == false) {

                                // Render cell, if a row id has been given only redraw that row
                                var renderColumn = renderColumns[j - 1];
                                if (rowId) {
                                    if (rowId == key) {
                                        $(t).renderCell(td, renderColumn, key, item[j], false);
                                    }
                                } else {
                                    $(t).renderCell(td, renderColumn, key, item[j], false);
                                }
                            }
                        });
                    }
                });

                if (rowId === undefined || Number(rowId) == 0) t.p.selrow = null;
            });
        },

        //end inline edit

        // Quick search
        /* 
        *   This method sets the layout to create a quick search box
        */
        enableQuickSearch: function () {
            return this.each(function () {
                var $t = this;
                var header = $($t.grid.cDiv);

                // Add span 
                var input = $('<input class="ui-corner-all ui-bizagi-render-grid-search-input" type="text" value="" />');
                var icon = $('<span class="ui-icon ui-icon-search" />');
                var span = $('<span class="ui-bizagi-render-grid-header-search" />')
                .append(input)
                .append(icon)
                .appendTo(header);

                icon.click(function () {
                    $t.p.onQuickSearch.call($t, input.val());
                });

                input.keydown(function (event) {
                    (event.which == 13) ? $t.p.onQuickSearch.call($t, input.val()) : $(this).removeClass("ui-bizagi-no-results");
                });

            });
        },

        // Bug Fixes overrides
        // DEPL: We overrided this method because in jqGrid 4.0 it was not working properly
        showHideCol: function (colname, show) {
            return this.each(function () {
                var $t = this, fndh = false, brd = $.browser.webkit || $.browser.safari ? 0 : $t.p.cellLayout, cw;
                if (!$t.grid) {
                    return;
                }
                if (typeof colname === 'string') {
                    colname = [colname];
                }
                show = show != "none" ? "" : "none";
                var sw = show === "" ? true : false;
                $(this.p.colModel).each(function (i) {
                    if ($.inArray(this.name, colname) !== -1 && this.hidden === sw) {
                        $("tr", $t.grid.hDiv).each(function () {
                            $(this).children("th:eq(" + i + ")").css("display", show);
                        });
                        $($t.rows).each(function (j) {
                            $(this).children("td:eq(" + i + ")").css("display", show);
                        });

                        // DEPL: Commented next line for fix
                        // Mounted jqGrid 3.x version

                        //if ($t.p.footerrow) { $($t.grid.sDiv).children("td:eq(" + i + ")").css("display", show); }
                        if ($t.p.footerrow) {
                            $("td:eq(" + i + ")", $t.grid.sDiv).css("display", show);
                        }

                        cw = this.widthOrg ? this.widthOrg : parseInt(this.width, 10);
                        if (show === "none") {
                            $t.p.tblwidth -= cw + brd;
                        } else {
                            $t.p.tblwidth += cw + brd;
                        }
                        this.hidden = !sw;
                        fndh = true;
                    }
                });
                if (fndh === true) {
                    if ($t.grid.width !== $t.p.tblwidth) {
                        $($t).jqGrid("setGridWidth", $t.p.shrinkToFit === true ? $t.grid.width : $t.p.tblwidth, true);
                    }
                }
            });
        },

        /*
        *   Method to add a row click hook into the grid
        */
        onRowClick: function (activate, desactivate) {
            var doc = window.document;
            var grid = $(this);
            // Set a variable to hold the current editing row
            grid.data("clickedRow", null);

            // Delegate the click method
            grid.delegate("tr.jqgrow td", "click", function () {
                var tr = $(this).parent();
                var rowIndex = tr[0].rowIndex;
                var columnIndex = $(this).data("columnIndex");
                var id = tr[0].id;
                var clickedRow = grid.data("clickedRow");

                // If the row has changed desactivate edition for last editing row
                if (clickedRow != null && clickedRow.rowIndex != rowIndex) {
                    desactivate(clickedRow.rowIndex, clickedRow.id);
                    $(doc).unbind("click");
                    clickedRow = null;
                    grid.data("clickedRow", clickedRow);
                }

                // Edit the row when there is no active row editing
                if (clickedRow == null || clickedRow.rowIndex != rowIndex) {
                    activate(rowIndex, id, columnIndex);
                    grid.data("clickedRow", {
                        rowIndex: rowIndex,
                        id: id
                    });

                    // Handle internal clicks to avoid finish edition
                    grid.click(function (e) {
                        e.stopPropagation();
                    });

                    // Set a handler for on-time execution to handle clicks outside grid
                    $(doc).one("click", function () {
                        clickedRow = grid.data("clickedRow");
                        if (clickedRow) {
                            desactivate(clickedRow.rowIndex, clickedRow.id);
                            grid.data("clickedRow", null);
                        }
                    });
                }

                return true;
            });
        },

        /*
        *   Method to reset all the inline editions when the grid is going to be reloaded
        */
        prepareForRefresh: function () {
            var grid = $(this);

            grid.data("clickedRow", null);
        },

        getCellProperties: function (td, renderColumn, key, column) {
            var properties = td.data("properties");
            if (!properties) {
                properties = $.extend(JSON.parse(JSON.encode(renderColumn.originalProperties)), this.getCellOverride(key, column));
            }

            return properties;
        },

        /*
        *   Changes the background for a cell
        */
        changeCellBackgroundColor: function (rowIndex, columnIndex, renderColumn, value, argument) {
            return this.each(function () {
                var t = this;
                var td = $(t).jqGrid("getTableCell", rowIndex, columnIndex);

                // Change properties
                var properties = $(t).getCellProperties(td, renderColumn, rowIndex, columnIndex - 1);

                // Check if it has been changed
                var textFormat = properties.textFormat || {};
                if (textFormat.background == argument) return;

                // Change properties
                if (textFormat) properties.textFormat.background = argument;
                td.data("properties", properties);

                // Render cell
                var editable = td.data("editable");
                $(t).renderCell(td, renderColumn, rowIndex, value, editable);
            });
        },

        /*
        *   Changes the forecolor for a cell
        */
        changeCellColor: function (rowIndex, columnIndex, renderColumn, value, argument) {
            return this.each(function () {
                var t = this;
                var td = $(t).jqGrid("getTableCell", rowIndex, columnIndex);

                // Change properties

                var properties = $(t).getCellProperties(td, renderColumn, rowIndex, columnIndex - 1);

                // Check if it has been changed
                var textFormat = properties.textFormat || {};
                if (textFormat.color == argument) return;

                // Change properties
                if (textFormat) properties.textFormat.color = argument;
                td.data("properties", properties);

                // Render cell
                var editable = td.data("editable");
                $(t).renderCell(td, renderColumn, rowIndex, value, editable);
            });
        },

        /*
        *   Changes the visibility for a cell
        */
        changeCellVisibility: function (rowIndex, columnIndex, renderColumn, value, argument) {
            return this.each(function () {
                var t = this;
                var td = $(t).jqGrid("getTableCell", rowIndex, columnIndex);

                // Change properties
                var properties = $(t).getCellProperties(td, renderColumn, rowIndex, columnIndex - 1);

                // Check if it has been changed
                if (properties.visible == argument) return;

                // Change properties
                properties.visible = argument;
                td.data("properties", properties);

                // Render cell
                var editable = td.data("editable");
                $(t).renderCell(td, renderColumn, rowIndex, value, editable);
            });
        },

        /*
        *   Refresh a cell
        */
        refreshCell: function (rowIndex, columnIndex, renderColumn, value) {
            return this.each(function () {
                var t = this;
                var td = $(t).jqGrid("getTableCell", rowIndex, columnIndex);

                // Render cell
                var editable = td.data("editable");
                $(t).renderCell(td, renderColumn, rowIndex, value, editable);
            });
        },

        /*
        *   Renders a single cell
        */
        renderCell: function (td, renderColumn, key, value, editable) {
            return this.each(function () {
                var t = this;
                var html, cell;

                // Fix jqGrid styles
                td.addClass("ui-bizagi-cell");
                td.empty();

                // Render cell again
                var properties = $(t).getCellProperties(td, renderColumn, key, renderColumn.columnIndex - 1);
                if (properties.visible) {
                    td.removeClass("ui-state-default");

                    // Render the cell with the column render
                    renderColumn.properties = properties;

                    // Set render properties
                    renderColumn.properties.displayType = 'value';
                    renderColumn.setValue(key, value);
                    renderColumn.setSurrogateKey(key);

                    if (editable && properties.editable) {
                        // Cancel error when editing
                        if ($(t).getCellOverride(key, renderColumn.columnIndex - 1).error) {
                            $(t).getCellOverride(key, renderColumn.columnIndex - 1).error = false;
                            td.css("background-color", '');
                        }

                        td.data("properties", properties);

                        // Render editable control
                        html = renderColumn.render(key, value, td);
                        cell = $(html);
                        td.append(cell);
                        renderColumn.postRender(key, cell, td);
                    } else {

                        // Check if the render has an error
                        if ($(t).getCellOverride(key, renderColumn.columnIndex - 1).error) {
                            td.css("background-color", 'pink');
                        }

                        // Render read-only control
                        html = renderColumn.renderReadOnly(key, value, td);
                        cell = $(html);
                        td.append(cell);
                        renderColumn.postRenderReadOnly(key, cell, td);
                    }
                    renderColumn.trigger("rendered");
                }

                // Save editable property in td internal data
                td.data("editable", editable);
                td.data("columnIndex", renderColumn.columnIndex);
            });
        }

    });

})(jQuery);