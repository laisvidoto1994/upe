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
    $.widget('ui.bizagi_grid_desktop', $.ui.bizagi_grid, {
        options: $.extend($.ui.bizagi_grid.prototype.options, {
            smartPagination: false
        }),

        attachHandlers: function () {
            var self = this;

            // Add paging events
            self._getComponent("pager").find("ul li:not(.prev):not(.next)").bind("click", function (e) {
                if (e.isPropagationStopped()) {
                    return;
                }
                e.stopPropagation();

                var pageNumber = $(this).data("page");
                if (self.isValid()) {
                    self.changePage(pageNumber);
                }

            });

            //TODO: implement dynamicPager behavior
            self._getComponent("dynamicPager").find("input").bind("click", function () {
                // var pageNumber = $(this).attr("data-page-number");
                self.selectDynamicPager();
            });

            self._getComponent("header").on("click", function () {

                if ($(this).hasClass("bz-rn-grid-header-collapse") && self.options.mode === "execution") {
                    self.onCollapseGrid();
                }
            });

            // Add sort events
            self._getComponent("columns").find(".ui-bizagi-grid-column").bind("click", function () {
                var columnIndex = $(this).attr("data-column-index");
                var xpath;
                try {
                    xpath = (columnIndex >= 0 && self.columnByIndex[columnIndex].bizAgiProperties.xpath) ? self.columnByIndex[columnIndex].bizAgiProperties.xpath : false;
                } catch (e) {
                    return;
                }

                if (typeof bizagi.context.isOfflineForm === "undefined" || !bizagi.context.isOfflineForm && xpath) {
                    self.onSaveAddedRows();
                    self.sortBy(columnIndex);

                    $(this).unbind("click");

                    //Execute cancel edition
                    self.onCancelEdition();
                }
            });

            // Add selection events
            self._getComponent("rows").find("tr").bind("click", function () {
                var key = $(this).attr("data-key");
                var businessKey = $(this).attr("data-business-key");
                self.selectRow(key, businessKey);
            });

            // Bind button actions
            self._getComponent("buttons").find("[data-action]").bind("click", function () {
                self.processAction($(this).attr("data-action"));
                self.unselectRow();
            });

            //Grid Export Events
            if (self.options.actions.enableXlsExport || self.options.actions.enablePdfExport) {
                var gridExportOptionsContent = (self._getComponent("gridExportOptions").find(".ui-bizagi-grid-export-options-content"));


                self._getComponent("gridExportOptions").find("[data-action]").bind("click", function () {
                    self.processAction($(this).attr("data-action"));
                    self.unselectRow();
                });

                //bind mouseleave event just in desktop app, this event fires in w8 tablet after click with the fingers so the options never display
                if (typeof (Windows) == "undefined") {
                    self._getComponent("gridExportOptions").mouseleave(function () {
                        gridExportOptionsContent.addClass('hidden');

                        // Fix overflow windows 8 by gridExportOptions
                        /*if (typeof(Windows) != "undefined" && self.grid.find(".bz-rn-grid-data-wraper").hasClass("bz-rn-grid-data-wraper-fix-w8-scroll")) {
                        self.grid.find(".bz-rn-grid-data-wraper").removeClass("bz-rn-grid-data-wraper-fix-w8-scroll");
                        }*/
                    });
                }

                if (self.options.actions.enableXlsExport) {

                    //gridExportOptionsContent.css("top", gridExportOptionsContent.height);

                    self._getComponent("gridExportOptions").find('#print-grid-xls').click(function (e) {
                        self._triggerHandler("performExportGrid", { disposition: "attachment", exportType: "xlsExport" });

                        gridExportOptionsContent.hide();
                    });
                }

                if (self.options.actions.enablePdfExport) {
                    self._getComponent("gridExportOptions").find('#print-grid-pdf').click(function (e) {
                        self._triggerHandler("performExportGrid", { disposition: "inline", exportType: "pdfExport" });

                        gridExportOptionsContent.hide();
                    });
                }
            }

        },
        /*
        *  Template method to check if buttons component must be rendered
        */
        _canShowButtons: function () {
            var self = this;
            var actions = self.options.actions;
            return actions["add"] || actions["remove"] || actions["edit"] || actions["inlineAdd"] || actions["details"] || actions["enablePdfExport"] || actions["enableXlsExport"];
        },
        /*
        *   Process an action in order to do something with the grid
        */
        processAction: function (action) {
            var self = this;

            // Call base
            $.ui.bizagi_grid.prototype.processAction.apply(self, arguments);

            if (action == "save") {
                self.onSaveAddedRows();
            }
            if (action == "cancel") {
                self.onCancelEdition();
            }
        },
        attachPaginator: function () {

            var self = this;

            //Append navigation buttons for the pager
            if (self.options.smartPagination) {

                if (self.data.total > 1) {

                    var ul = self._getComponent("pager").find("ul");

                    // Create pagination control 
                    ul.bizagiPagination({
                        maxElemShow: 50,
                        totalPages: self.data.total,
                        actualPage: self.data.page,
                        listElement: ul
                    });
                }
                else {
                    //Makes room to other elements in the grid footer
                    self._getComponent("pager").parent().hide();
                }
            }
            else {
                if (self.data.total <= 1) {
                    //Makes room to other elements in the grid footer
                    self._getComponent("pager").parent().hide();
                }
            }
        },
        /*
        *   Draw Pagination Grid
        */
        drawPager: function () {

            var self = this;
            var options = self.options;
            var pdata = {};

            if (self.options.smartPagination) {


                var nElemToShow = 10;
                pdata.pagination = (self.data.total > 1) ? true : false;
                pdata.page = self.data.page;

                if (self.options.orientation == "rtl" && self.data.rows.length > 0) {
                    // set total pages
                    pdata.pages = {};

                    var pageToshow = (nElemToShow > self.data.total) ? self.data.total : nElemToShow;
                    var pageToshowRtl = pageToshow;
                    for (var i = 1; i <= pageToshow; i++) {
                        pdata.pages[i] = {
                            "pageNumber": pageToshowRtl
                        };
                        pageToshowRtl--;
                    }

                } else {
                    // set total pages
                    pdata.pages = {};
                    var pageToshow = (nElemToShow > self.data.total) ? self.data.total : nElemToShow;
                    for (var i = 1; i <= pageToshow; i++) {
                        pdata.pages[i] = {
                            "pageNumber": i
                        };
                    }
                }

                // Set style pagination
                pdata["gridPagination"] = "gridCasePagination";
                pdata.previousPage = (self.data.page > 1) ? self.data.page - 1 : 1;
                pdata.nextPage = (self.data.page < self.data.total) ? self.data.page + 1 : self.data.total;
                pdata.totalPages = self.data.total;

                return $.fasttmpl(options.template.pager, pdata);
            } else {

                // Call base
                return $.ui.bizagi_grid.prototype.drawPager.apply(self, arguments);
            }
        },

        /*
        *   Add inline row
        */
        addInlineRow: function () {
            var self = this;

            // Draw the new row
            self._triggerHandler("beforeInlineAdd");
            var html = self.drawRow(self.createAddRowData(), true);
            var newRow = $(html);

            // Execute the postrender
            self.postRenderRow(newRow);

            // Append to rows component
            self._getComponent("rows").append(newRow);

            // Show save and cancel buttons
            var buttons = self._getComponent("buttons");
            buttons.find("[data-action=save]").css("display", "inline-block");
            buttons.find("[data-action=cancel]").css("display", "inline-block");

            // Show table component if there are no rows
            if (self.data.rows.length == 0) {
                self._getComponent("table").show();
                self._getComponent("emptyTable").hide();
            }
            self._triggerHandler("afterInlineAdd");
        },
        /*
        *   Creates a dummy data for the new row
        */
        createAddRowData: function () {
            var self = this;
            var options = self.options;
            var row = [];
            $.each(options.columns, function (i) {

                if (i == self.columnKeyIndex) {
                    // Add random key so we can identify them later
                    var key = Math.ceil(Math.random() * 100000);
                    row.push(key);
                }
                else {
                    // Add null value
                    row.push(null);
                }
            });
            return row;
        },
        /*
        *   Executes the on add row handler
        */
        onAddRow: function () {
            var self = this;
            // Allow add
            if (self.options.actions.add) {
                if (self.options.actions.inlineAdd) {
                    return self.addInlineRow();
                } else {
                    // Open dialog with addform
                    self.options.addFormDialog = self.options.addFormDialog || {};
                    return self._triggerHandler("addRow", self.options.addFormDialog);
                }
            }
        },
        /*
        *   Executes when the user presses the cancel button, after inline add edition
        */
        onCancelEdition: function () {
            var self = this;

            // Remove zero key rows
            var rows = self._getComponent("rows").find("[data-new-row]");
            rows.detach();

            // Hide buttons
            var buttons = self._getComponent("buttons");
            buttons.find("[data-action=save]").hide();
            buttons.find("[data-action=cancel]").hide();

            // Show table component if there are no rows
            if (self.data.rows.length == 0) {
                self._getComponent("table").hide();
                self._getComponent("emptyTable").show();
            }

            return self._triggerHandler("cancelEdition", { keys: self.getNewRowKeys(rows) });
        },
        /*
        *   Executes when the user presses the save button, after inline add edition
        */
        onSaveAddedRows: function () {
            var self = this;

            // Retrieve key of added rows
            var newRowKeys = self.getNewRowKeys();
            var buttons = self._getComponent("buttons");

            // Hide buttons         
            if (newRowKeys.length >= 1 && self.isValid()) {
                buttons.find("[data-action=save]").hide();
                buttons.find("[data-action=cancel]").hide();

                if (typeof bizagi.context.isOfflineForm === "undefined" || !bizagi.context.isOfflineForm) {
                    self._triggerHandler("saveAddedRows", { keys: newRowKeys });
                    return self._triggerHandler("removeNewRecords", { keys: newRowKeys });
                } else {
                    return true;
                }
            } else {
                return;
            }
        },
        onRowSelected: function () {
            var self = this;
            var element = self.element;
            // Call base
            $.ui.bizagi_grid.prototype.onRowSelected.apply(self, arguments);
            // Add selected style to row
            var tr = element.find("[data-bizagi-component=rows] tr[data-key=" + self.selectedRow + "]");
            tr.addClass("ui-bizagi-state-selected");
        },
        onRowUnselected: function () {
            var self = this;
            // Call base
            $.ui.bizagi_grid.prototype.onRowUnselected.apply(self, arguments);
            // Hide row buttons
            var tr = self._getComponent("rows").find("tr[data-key=" + self.selectedRow + "]");
            tr.removeClass("ui-bizagi-state-selected");
        },
        /*
        *   Return the new created ids
        */
        getNewRowKeys: function (rows) {

            var self = this;
            rows = rows || self._getComponent("rows").find("[data-new-row=true]");

            return $.map(rows, function (row, i) {
                return $(row).data("business-key");
            });
        },
        /*
        ** Collapse Grid
        */
        onCollapseGrid: function () {

            var self = this;
            $.ui.bizagi_grid.prototype.onCollapseGrid.apply(self, arguments);
        },

        /*
        *   Return cell object
        */
        getCell: function (key, xpath, index) {
            var self = this;
            var row = self._getComponent("rows").find("[data-business-key=" + key + "]");
            var allVisibleTd = $("td:visible", $(row));
            var cell = allVisibleTd[index];

            return $(cell);
        },
        /*
        *   Return cell header object
        */
        getCellHeader: function (index) {
            var self = this;
            var rowHeader = self._getComponent("columns");
            var allVisibleTd = $("td:visible", $(rowHeader));
            var cell = allVisibleTd[index];

            return $(cell);
        },
        /*
        *   Check if row its new
        */
        isNewRecord: function (businessKey) {
            var self = this;
            var row = self._getComponent("rows");

            if (row) {
                var businessKey = row.find("[data-business-key='" + businessKey + "']");
                if ($(businessKey).data('new-row')) {
                    return true;
                }
            }
            return false;
        },

        /*
        * This method allows update the collapse state
        */
        updateCollapseState: function (collapseState) {

            var self = this;
            self.collapseState = collapseState;
        }
    });

})(jQuery);