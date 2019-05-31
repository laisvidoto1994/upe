/*
*   Name: BizAgi Desktop Render Grid Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the grid render class to adjust to desktop devices
*/

// Extends itself
bizagi.rendering.grid.extend("bizagi.rendering.grid.jqgrid", {}, {
    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;

        // Define control settings & defaults
        properties.jqGridId = "ui-bizagi-grid-table-" + bizagi.util.encodeXpath(properties.xpath) + "-" + properties.id;
        properties.jqGridPagerId = "ui-bizagi-grid-pager-" + bizagi.util.encodeXpath(properties.xpath) + "-" + properties.id;
        properties.jqGridDataType = "custom";

        // Just apply display-type: value, align it to the left
        properties.displayType = "value";
        properties.labelAlign = "left";

        // Create a collection to collect row changes
        this.visualChanges = [];

        // Create a collection to save grid cell changes to execute after it is loaded
        this.pendingActions = [];

        // Variable to check if the plugin has been applied, we will only apply the plugin when there are data to draw
        this.pluginUsed = false;
    },

    /*
    *   Applies the template to the render and returns the resolved element
    */
    applyTemplate: function (template) {
        var self = this,
        properties = self.properties;

        return $.fasttmpl(template, {
            id: properties.jqGridId,
            pagerId: properties.jqGridPagerId,
            displayName: bizagi.util.encodeXpath(properties.displayName),
            allowAdd: properties.allowAdd,
            addLabel: properties.addLabel
        });
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        self.initialLoadDone = false;

        // Call base 
        this._super();

        // DiegoP: jqGrid plugin does not work if the object does not exist in the dom so 
        // we need to run this when the form has been set in the dom
        self.ready().done(function () {

            if (self.properties.data && self.properties.data.rows.length > 0) {
                //try {
                // Apply grid plugin
                self.applyGridPlugin();
                //} catch (e) {
                // This could happen when the grid is being rendered and the source element is not in the DOM
                // Maybe the grid was being loaded in another tab, and the page was redirected to another place of the application
                //}
            }
        });


    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;

        // Call base
        self._super();

        // Bind add link click
        $(".ui-bizagi-render-grid-add", self.getControl()).click(function () {
            self.gridRowAdd();
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

    /*
    *   Aply grid plugin
    */
    applyGridPlugin: function () {
        var self = this,
    	mode = self.getMode(),
        properties = self.properties,
        control = self.getControl();

        // Load column model
        var columnModel = self.buildColumnModel();

        // Locate elements
        var grid = $(".ui-bizagi-render-grid", control);
        var pager = $("#" + properties.jqGridPagerId, control);

        // Save reference to grid
        self.grid = grid;
        self.pager = pager;

        // Apply jqgrid plugin
        grid.jqGrid({
            data: [],
            datatype: properties.jqGridDataType,
            colModel: columnModel,
            jsonReader: {
                repeatitems: true,
                cell: "",
                id: "0"
            },
            localReader: {
                repeatitems: true,
                cell: "",
                id: "0"
            },
            pager: pager,
            pgbuttons: (properties.allowMore ? false : true),
            pginput: (properties.allowMore ? false : true),
            recordtext: (properties.allowMore ? "" : $.jgrid.defaults.recordtext),
            height: "100%",
            sortname: properties.sortBy,
            sortOrder: properties.sortOrder,
            viewrecords: true,
            forceFit: true,
            caption: properties.displayName,
            autowidth: true,
            rowNum: properties.rowsPerPage,
            grouping: properties.allowGrouping,
            groupingView: {
                groupField: [properties.groupBy],
                groupText: [properties.groupText],
                groupCollapse: properties.groupCollapsed,
                groupOrder: [properties.groupOrder],
                groupSummary: [properties.groupSummary ? true : false],
                groupColumnShow: [false],
                showSummaryOnHide: true,
                groupDataSorted: true
            },
            footerrow: properties.allowGrouping && properties.groupSummary,
            userDataOnFooter: properties.allowGrouping,
            onSelectRow: function (rowId) {
                if (mode != "execution") {
                    return;
                }

                var rowData = grid.jqGrid("getRowData", rowId);
                self.triggerHandler("rowSelected", {
                    id: rowData.id,
                    data: rowData
                });
            },
            loadComplete: function (data) {
                self.gridLoadComplete(data);
            },
            onPaging: function () {
                if (mode != "execution") {
                    return;
                }

                // Change default jqgrid handler for our own 
                // so we can have much more control
                var pageToLoad = Number(this.p.page);

                // Check if it is a valid page, else we don't do anything
                if (pageToLoad > 0 && pageToLoad <= self.properties.totalPages) {

                    properties.page = pageToLoad;

                    // Fetch new data
                    self.startLoading();
                    self.fetchRemoteData();
                } else {
                    // Restore number
                    grid[0].p.page = properties.page;
                    $(".ui-pg-input", self.pager).val(properties.page);
                }

                return "stop";
            },
            onSortCol: function (index, iCol, sortorder) {
                if (mode != "execution") {
                    return;
                }

                // Fetch new data, after calculating the new sort
                properties.sort = self.getSortParam(index, sortorder);

                self.startLoading();
                self.fetchRemoteData();
                return "stop";
            },
            onQuickSearch: function (searchFilter) {
                if (mode != "execution") {
                    return;
                }

                if (properties.allowFilter == true) {
                    // Fetch new data, after setting the search filter, and reset page to 1
                    properties.searchFilter = $.trim(searchFilter);
                    properties.page = 1;

                    self.startLoading();
                    self.fetchRemoteData();
                }
            },
            getCellOverride: function (key, column) {
                return self.getCellOverride(key, column);
            }
        });

        // Configure grid direct edition
        if (properties.inlineEdit && mode == "execution") {
            grid.jqGrid("onRowClick",
            // Activation method
                function (rowId, id, columnId) {
                    grid.jqGrid('editRow', rowId, id, columnId, self.columns, function (renderColumn) {
                        // Add change to grid changes
                        var xpath = renderColumn.properties.xpath;
                        var value = renderColumn.getValue(id);
                        var compositeValue = renderColumn.getCompositeValue(id);

                        if (renderColumn.properties.type == "columnDate") {
                            if (!bizagi.util.isEmpty(value)) {
                                // Formats the value in full invariant (with time) in order to send to the server
                                var date = bizagi.util.dateFormatter.getDateFromInvariant(value, false);
                                date.setHours(0, 0, 0, 0);
                                value = bizagi.util.dateFormatter.formatInvariant(date, true);

                            } else if (value === "") {
                                value = "";
                            }
                        }

                        // Collect grid change to save data when needed
                        self.collectGridChange({ id: id, xpath: xpath, value: value, compositeValue: compositeValue, columnIndex: renderColumn.columnIndex });
                    });
                },
            // De-activation method
                function (rowId, id) {
                    grid.jqGrid('finishRowEdition', id, self.columns, function (key, data) {
                        // Set data in grid
                        grid.jqGrid("setRowData", key, data);
                        self.reDraw(id);
                    });
                }
            );

            // Show editable icon for each cell when editable
            grid.delegate(".jqgrow", "mouseenter", function () {
                $("td .ui-bizagi-cell-icon .ui-icon", $(this)).show();
            });
            grid.delegate(".jqgrow", "mouseleave", function () {
                $("td .ui-bizagi-cell-icon .ui-icon", $(this)).hide();
            });
        }

        // Configure pager
        self.originalPager = $("#" + properties.jqGridPagerId).html();
        if (mode == "execution") {
            self.configurePager();
        }

        // Configure dinamic pager
        if (properties.allowMore == true && mode == "execution") {
            self.configureDynamicPager();
        }

        // Allow search
        if (properties.allowFilter == true && mode == "execution") {
            grid.jqGrid("enableQuickSearch");
            // Highlight match
            grid.jqGrid("setGridParam",
            {
                afterInsertRow: function (id, rowdata) {
                    var searchValue = $(".ui-bizagi-render-grid-search-input", self.element).val();

                    if (searchValue && searchValue.length > 0) {
                        for (var item in rowdata) {
                            if (rowdata[item]) rowdata[item] = rowdata[item].toString().replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(searchValue) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
                        }

                        self.grid.jqGrid("setRowData", id, rowdata);
                    }
                }
            });
        }

        if (mode == "execution") {
            // Enable row hovering
            $("tr", grid)
	    		.hover(function () {
	    		    var tr = $(this);
	    		    $("td .ui-bizagi-cell-readonly", tr).addClass("ui-bizagi-cell-readonly-hovered");

	    		}, function () {
	    		    var tr = $(this);
	    		    $("td .ui-bizagi-cell-readonly", tr).removeClass("ui-bizagi-cell-readonly-hovered");

	    		});
        }

        // Hide add link, and no records label
        $(".ui-bizagi-render-grid-norecords", control).hide();
        $(".ui-bizagi-render-grid-add", control).hide();


        // Set plugin used variable
        self.pluginUsed = true;

        // Fills data
        if (!properties.skipInitialLoad) {
            if (!properties.data) {
                self.fetchRemoteData();
            } else {
                self.updateData(properties.data);
            }
        }

        // Execute pending actions
        self.initialLoadDone = true;
        for (var i in self.pendingActions) {
            if (self.pendingActions.hasOwnProperty(i)) {
                self.pendingActions[i].method.apply(self, self.pendingActions[i].arguments);
            }
        }
    },

    /*
    *   Fetch the data again and updates the content
    */
    refresh: function () {
        var self = this;

        // Reload grid
        self.fetchRemoteData();
    },

    /*
    *   Holds the execution until the grid data is ready after a load operation
    */
    dataReady: function () {
        var self = this;

        return self.dataReadyDeferred != null ? self.dataReadyDeferred.promise() : null;
    },

    /*
    *   Request data from the server and then updates the grid
    */
    fetchRemoteData: function () {
        var self = this;
        self.dataReadyDeferred = new $.Deferred();

        $.when(self.getRemoteData())
        .then(function (data) {
            if (self.disposed) return;
            if (data) {
                if (data.rows.length > 0) {
                    $(".ui-bizagi-render-grid-search-input", self.element).removeClass("ui-bizagi-no-results");
                    self.updateData(data);
                    self.dataReadyDeferred.resolve();
                }
                else {
                    $(".ui-bizagi-render-grid-search-input", self.element).addClass("ui-bizagi-no-results");
                    if (!self.properties.allowEdit) {
                        self.updateData(data);
                        self.dataReadyDeferred.resolve();
                    }
                }
            } else {
                self.dataReadyDeferred.reject();
            }

            // End loading
            self.endLoading();
        });
    },

    /* 
    *   Internally sets the data
    */
    updateData: function (data) {
        var self = this;

        // Set value in control
        if (data) {
            self.properties.data = data;

            // Set cell overrides
            self.setCellOverrides(data);

            // Update total pages
            self.properties.totalPages = data.total;

            // If no plugin has been applied the apply plugin
            if (self.pluginUsed == false) {
                self.applyGridPlugin();
            }

            self.reDraw();
        }
    },

    /*
    *   Redraws the entire grid
    */
    reDraw: function (rowId) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        var grid = self.grid;
        var data = self.properties.data;

        // Set value in control
        if (data) {
            // Apply grid row changes made locally to server data
            if (data.rows) {
                for (key in self.visualChanges) {
                    for (var j = 0; j < data.rows.length; j++) {
                        if (key == data.rows[j][0]) {
                            for (index in self.visualChanges[key]) {
                                data.rows[j][index] = self.visualChanges[key][index];
                            }
                        }
                    }
                }
            }

            // This sets the full jqgrid object including page, rows, etc
            if (properties.allowGrouping) grid.jqGrid('groupingSetup');
            if (rowId !== undefined) {
                var rowData = {};
                for (j = 0; j < data.rows.length; j++) {
                    if (rowId == data.rows[j][0]) {
                        rowData = data.rows[j];
                    }
                }
                grid.jqGrid("setRowData", rowId, rowData);
            } else {
                grid[0].addJSONData(data);
            }

            // Save data in the grid when it is remote
            self.grid.jqGrid('prepareForRefresh');
            self.grid.jqGrid('setInternalData', data.rows);

            // Render cells
            if (data.rows) {
                self.grid.jqGrid('reDraw', self.columns, rowId);
                self.triggerRenderChange();
            }

            // Toggle "more" icon if present
            self.toggleMoreIcon(data);

            // Toogle add link / grid
            if (data.rows.length > 0) {
                if (properties.allowAdd) $(".ui-bizagi-render-grid-add", control).hide();
                $(".ui-bizagi-render-grid-norecords", control).hide();
                $("#gbox_" + self.grid.attr("id") + ".ui-jqgrid", control).show();
            } else {
                if (properties.allowAdd) $(".ui-bizagi-render-grid-add", control).show();
                $(".ui-bizagi-render-grid-norecords", control).show();
                $("#gbox_" + self.grid.attr("id") + ".ui-jqgrid", control).hide();
            }
        }
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
                        var result;
                        if (self.visualChanges[key] !== undefined && self.visualChanges[key][j + 1] !== undefined) {
                            result = self.visualChanges[key][j + 1];
                        } else {
                            result = data[i][j + 1];
                        }

                        return result;
                    }
                }
            }
        }
        return null;
    },

    /*
    *   Redraw a cell
    */
    refreshCell: function (key, columnIndex) {
        var self = this;
        if (self.initialLoadDone) {
            var column = self.columns[columnIndex];
            self.grid.jqGrid('refreshCell', key, columnIndex + 1, self.getColumn(column.properties.xpath), self.getCellValue(key, column.properties.xpath));
        }
    },

    /*
    *   Sets an error on the cell
    */
    setError: function (key, columnXpath) {
        var self = this;

        var columnIndex = self.getColumn(columnXpath).columnIndex;
        self.getCellOverride(key, columnIndex - 1).error = true;
        self.refreshCell(key, columnIndex - 1);
    },

    /*
    *   Changes the background for a cell
    */
    changeCellBackgroundColor: function (key, xpath, argument) {
        var self = this;

        if (self.initialLoadDone) {
            for (var j = 0; j < self.columns.length; j++) {
                if (self.columns[j].properties.xpath == xpath) {
                    self.grid.jqGrid('changeCellBackgroundColor', key, j + 1, self.getColumn(xpath), self.getCellValue(key, xpath), argument);
                    break;
                }
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
            for (var j = 0; j < self.columns.length; j++) {
                if (self.columns[j].properties.xpath == xpath) {
                    self.grid.jqGrid('changeCellColor', key, j + 1, self.getColumn(xpath), self.getCellValue(key, xpath), argument);
                    break;
                }
            }
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
            for (var j = 0; j < self.columns.length; j++) {
                if (self.columns[j].properties.xpath == xpath) {
                    self.grid.jqGrid('changeCellVisibility', key, j + 1, self.getColumn(xpath), self.getCellValue(key, xpath), argument);
                    self.cellOverrides[key] = self.cellOverrides[key] || {};
                    self.getCellOverride(key, j).visible = argument;
                    break;
                }
            }
        } else {
            self.pendingActions.push({
                method: self.changeCellVisibility,
                arguments: arguments
            });
        }
    },

    /* 
    *   Process internal columns needed by jqGrid
    *   Returns a promise because the columns maybe need to load async stuff (ex. combos)
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
            align: "center",
            key: true,
            formatter: function (cellvalue) {
                return cellvalue;
            }
        };

        // Add to column model
        var colModel = [];
        colModel.push(keyColumn);

        $.each(columns, function (index, column) {

            // Check if it has a group summary
            var summary = "";
            if (properties.groupSummary) {
                for (var i = 0; i < properties.groupSummary.length; i++) {
                    if (properties.groupSummary[i].xpath == column.properties.xpath) {
                        summary = properties.groupSummary[i].type;
                    }
                }
            }

            // Set grid column
            column.columnIndex = index + 1;
            var columnLabel = !bizagi.util.isEmpty(column.properties.displayName) ? column.properties.displayName : " ";
            var gridColumn = {
                name: column.properties.xpath,
                index: index + 1,
                label: columnLabel,
                key: false,
                hidden: (!column.properties.visible || column.properties.type == "columnHidden" || column.properties.columnVisible == false),
                bizAgiProperties: column.properties,
                summaryType: summary,
                summaryTpl: self.formatSummary(summary),
                formatter: function (cellvalue, options, rowObject) {
                    // Bizagi column formatter
                    return self.renderFormatter(cellvalue, options, rowObject, column);
                }
            };

            colModel.push(gridColumn);
        });

        return colModel;
    },


    /* 
    *   Resizes the grid adjusting it to the container
    */
    resize: function (size) {
        var self = this;
        var grid = self.grid;

        if (grid && size.width > 0) {
            grid.jqGrid("setGridWidth", size.width);
        }
    },

    /*
    *   Show a notification icon
    */
    showIcon: function (icon) {
        var self = this;
        var grid = self.grid;
        if (!grid) return;

        if (icon == "error") {
            $(".ui-bizagi-render-icon-error", self.element).css("display", "inline-block");
        }
        if (icon == "help") {
            $(".ui-bizagi-render-icon-help", self.element).css("display", "inline-block");
        }

        // Make sure that icon container is visible
        self.iconContainerVisible = self.iconContainerVisible || false;
        if (self.iconContainerVisible == false) {
            $(".ui-bizagi-render-icons", self.element).css("display", "inline-table");

            // Reduce grid width
            var currentWidth = $(".ui-jqgrid-view", self.element).width();
            grid.jqGrid("setGridWidth", currentWidth - 48);
            self.iconContainerVisible = true;
        }
    },

    /*
    *   Show a notification icon
    */
    hideIcon: function (icon) {
        var self = this;
        var grid = self.grid;
        if (!grid) return;

        if (icon == "error") {
            $(".ui-bizagi-render-icon-error", self.element).css("display", "none");
        }
        if (icon == "help") {
            $(".ui-bizagi-render-icon-help", self.element).css("display", "none");
        }

        // Hide icon container if no icons are shown
        if ($(".ui-bizagi-render-icons span:visible", self.element).length == 0) {
            if (self.iconContainerVisible == true) {
                $(".ui-bizagi-render-icons", self.element).css("display", "none");

                // Add grid width
                var currentWidth = $(".ui-jqgrid-view", self.element).width();
                grid.jqGrid("setGridWidth", currentWidth + 48);
                self.iconContainerVisible = false;
            }
        }
    },

    /* 
    *  Customizes pager control
    */
    configurePager: function () {
        var self = this;
        var properties = self.properties;
        var grid = self.grid;

        // Task #1995, if allow edit is false and allow delete is true => allow edit is true
        properties.allowDelete = (!properties.allowEdit && properties.allowDelete) ? true : properties.allowDelete;


        // Enable pager icons
        grid.jqGrid('navGrid', "#" + properties.jqGridPagerId,
        {
            edit: properties.allowEdit,
            add: properties.allowAdd,
            del: properties.allowDelete,
            search: false,
            refresh: false,
            delfunc: function (id) {
                self.gridRowDelete(id);
            },
            addfunc: function () {
                self.gridRowAdd();
            },
            editfunc: function () {
                self.gridRowEdit();
            }
        });
    },

    /* 
    *   Customizes dinamic pager 
    */
    configureDynamicPager: function () {
        var self = this;
        var properties = self.properties;
        var grid = self.grid;

        // Enable icons
        grid.jqGrid('navButtonAdd', "#" + properties.jqGridPagerId,
        {
            id: "ui-bizagi-grid-pager-next",
            caption: self.getResource("render-grid-dynamic-pager"),
            buttonicon: "ui-icon-triangle-1-e",
            onClickButton: function () {
                self.gridMoreClick();
            },
            position: "last",
            title: "More",
            cursor: "pointer"
        });
    },

    /* 
    *   Hides or show the more icon in the pager 
    */
    toggleMoreIcon: function (data) {
        var self = this;
        var grid = self.grid;
        var pager = self.pager;

        // Check if there are more items
        if (grid.jqGrid("getGridParam", "reccount") == data.records) {

            // Hide more icon
            $("#ui-bizagi-grid-pager-next", pager).hide();

        } else {
            // Show more icon
            $("#ui-bizagi-grid-pager-next", pager).show();
        }
    },

    /* 
    *   After load event handler
    */
    gridLoadComplete: function (data) {
        var self = this;
        var grid = self.grid;

        // Trigger change event to perform actions and validations
        // Save data in the grid when it is remote
        grid.jqGrid('setInternalData', data.rows);

        self.triggerRenderChange();
    },


    /* 
    *   Handler for grid row deletion
    */
    gridRowDelete: function (id) {
        var self = this;

        bizagi.showConfirmationBox(this.getResource("render-grid-delete-confirmation"))
        .done(function () {
            // Set loading status
            self.startLoading();
            // Do a grid record deletion
            $.when(self.submitDeleteRequest(id))
            .done(function () {
                // Reload grid
                // Partly changed because of the multi-table grids
                var properties = self.properties;
                var form = self.getFormContainer();
                // If only grid is required to change
                if (!properties.submitOnChange) {
                    self.removeGridChange(id);
                    self.fetchRemoteData();
                }
                else {
                    // Just in case all the form is due to  refresh
                    form.refreshForm(properties.id);
                }
            });
        });
    },

    /* 
    *   Handler for grid row adding
    */
    gridRowAdd: function () {
        var self = this;
        var properties = self.properties;

        // Send add request
        //$.when(self.submitAddRequest())
        // If the grid has submit on change configured, then send all the data, else return null as a promise, so the "when" clause calls the pipe immediately
        var submitOnChangePromise = properties.submitOnChange ? self.submitOnChange() : null;
        $.when(submitOnChangePromise)
        .pipe(function () {
            // Send add request
            return self.submitAddRequest();
        })
        .done(function (newid) {

            // Show dialog with new form after that
            var dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
                title: properties.addLabel,
                onSave: function (data) {
                    return self.submitSaveRequest(newid, data);
                }
            });


            var recordXpath = properties.xpath + "[id=" + newid + "]";
            dialog.render({
                idRender: properties.id,
                recordXPath: recordXpath,
                xpathContext: properties.xpathContext,
                idPageCache: properties.idPageCache,
                requestedForm: "addForm",
                url: properties.addPage
            })
            .done(function () {
                // Set loading status
                self.startLoading();

                if (!properties.submitOnChange) {
                    // If no plugin has been applied the apply plugin
                    if (self.pluginUsed == false) {
                        self.applyGridPlugin();
                    }

                    // Reload grid
                    self.fetchRemoteData();

                } else {
                    // Submits the entire form
                    self.submitOnChange();
                }
                dialog.dispose();
            })
            .fail(function () {
                self.submitRollbackRequest();
                dialog.dispose();
            });
        });
    },

    /* 
    *   Handler for grid row edition
    */
    gridRowEdit: function () {
        var self = this;
        var grid = self.grid;

        // Get selected row
        var id = grid.jqGrid('getGridParam', 'selrow');

        var customHandler = self.getCustomHandler("onGridEdit");
        if (customHandler) return customHandler(id);

        var properties = self.properties;
        var showSaveButton = self.getFormContainer().properties.displayAsReadOnly == true ? false : true;

        // Get selected row
        var id = grid.jqGrid('getGridParam', 'selrow');
        var dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
            title: properties.editLabel,
            showSaveButton: showSaveButton,
            onSave: function (data) {
                return self.submitSaveRequest(id, data);
            }
        });

        // Send edit request
        //$.when(self.submitEditRequest(id))
        // If the grid has submit on change configured, then send all the data, else return null as a promise, so the "when" clause calls the pipe immediately
        var submitOnChangePromise = properties.submitOnChange ? self.submitOnChange() : null;
        $.when(submitOnChangePromise)
        .pipe(function () {
            // Send edit request
            return self.submitEditRequest(id);
        })
        .done(function () {

            // Show dialog with new form after that
            var recordXpath = properties.xpath + "[id=" + id + "]";

            dialog.render({
                idRender: properties.id,
                recordXPath: recordXpath,
                xpathContext: properties.xpathContext,
                idPageCache: properties.idPageCache,
                requestedForm: "editForm",
                url: properties.editPage
            })
            .done(function () {
                // Set loading status
                self.startLoading();

                if (!properties.submitOnChange) {
                    // Reload grid
                    self.removeGridChange(id);
                    self.fetchRemoteData();

                } else {
                    // Submits the entire form
                    self.submitOnChange();
                }
                dialog.dispose();
            })
            .fail(function () {
                self.submitRollbackRequest();
                dialog.dispose();
            });
        });
    },

    /* 
    *   Handler for more icon in the pager
    */
    gridMoreClick: function () {
        var self = this;
        var properties = self.properties;

        // Set next page
        var columnModel = self.grid.jqGrid("getColumnModel");
        properties.page++;
        self.grid.jqGrid("setGridParam", {
            page: properties.page
        });

        // Fetch next page
        $.when(self.getRemoteData())
        .then(function (data) {
            if (self.disposed) return;
            for (var i = 0; i < data.rows.length; i++) {
                var transformedRow = {};

                for (j in data.rows[i]) {
                    transformedRow[columnModel[j].name] = data.rows[i][j];
                }

                // Get key
                key = data.rows[i][0];

                // Add tow to grid
                self.grid.jqGrid("addRowData", key, transformedRow, "last");
            }

            // Check if there are more items to show / hide the more icon
            self.toggleMoreIcon(data);
        });
    },

    /*
    *   Get sort param
    */
    getSortParam: function (sortColumn, sortOrder) {
        var self = this;
        var properties = self.properties;

        // Event customization to send custom data to the server
        var columnModel = self.grid.jqGrid("getColumnModel");

        // Traslate column number to column name when it is a number
        if (bizagi.util.isNumeric(sortColumn.toString())) {
            sortColumn = columnModel[Number(sortColumn)].name;

        } else if (properties.allowGrouping) {
            // When the column is grouped we append both sorts
            return properties.groupBy + " " + properties.groupOrder + "," + sortColumn + " " + sortOrder;

        }

        return sortColumn + " " + sortOrder;
    },

    /*
    *   Ordinary cell formatter definition
    */
    renderFormatter: function (cellvalue, options, rowObject, column) {
        var self = this;

        // Get formatting mode
        var mode = self.getFormatterMode(cellvalue, options, rowObject);

        // Special formatting when not group header or summary
        if (mode == "FORMATTING") {
            // Don't do anything here, because we will overwrite the values when all the table has been included
            return "";
        }

        // Render just the text
        return bizagi.util.isEmpty(cellvalue) ? "&#160;" : (options.autoencode ? $.jgrid.htmlEncode(cellvalue) : cellvalue + "");
    },

    /*
    *   Helper method to detect when we are rendering inside a group header, group summary or normal cell
    */
    getFormatterMode: function (cellvalue, options) {
        var result;

        // Formatting modes enumeration
        var formatModes = {
            SUMMARY: 'SUMMARY',
            GROUPING: 'GROUPING',
            FORMATTING: 'FORMATTING'
        };

        if (options.rowId.toString().indexOf("ghead") > 0) {
            result = formatModes.GROUPING;

        } else if (options.rowId.toString().length == 0) {
            result = formatModes.SUMMARY;

        } else {
            result = formatModes.FORMATTING;
        }
        return result;
    },

    /*
    * Helper to get the format summary needed
    */
    formatSummary: function (summary) {
        if (summary == "count")
            return "({0}) total";
        else
            return "{0}";
    },

    /*
    *   Collect a single cell change made in the grid to send the data when the user saves the form
    */
    collectGridChange: function (params) {
        var self = this;
        params = params || {}; 
        var id = params.id;
        var columnIndex = params.columnIndex;
        var compositeValue = params.compositeValue;

        // Additionaly save cell change
        self.visualChanges[id] = self.visualChanges[id] || {};
        self.visualChanges[id][columnIndex] = compositeValue;

        // Call base method
        self._super(params);
    },

    /*
    *   Remove a grid change when a edit or delete has been made for that record
    */
    removeGridChange: function (id) {
        var self = this;

        // Remove from visual changes
        delete self.visualChanges[id];

        // Remove from grid changes
        delete self.changes[id];
    }
});
