/*
*   Name: 
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This widget will extend the bizagi grid widget to specialize into a tablet view
*
*   Markup: <div></div>
*
*   Styles:
*   - css/bizagi/tablet/controls/bizagi.grid.css
*/

(function($) {
    $.widget("ui.bizagi_grid_tablet", $.ui.bizagi_grid, {

        /**
         * Method to attach any handler to the grid
         * @returns {} 
         */
        attachHandlers: function() {
            var self = this;

            // Add paging events
            self._getComponent("pager").find("ul li").bind("click", function() {
                var pageNumber = $(this).attr("data-page-number");
                self.changePage(pageNumber);
            });

            //TODO falta implementar
            self._getComponent("dynamicPager").find("input").bind("click", function() {
                // var pageNumber = $(this).attr("data-page-number");
                self.selectDynamicPager();
            });

            // Add sort events
            self._getComponent("columns").find(".ui-bizagi-grid-column").bind("click", function() {
                if (self.isModeOnline()) {
                    var columnIndex = $(this).attr("data-column-index");
                    self.sortBy(columnIndex);
                }
            });

            // Add selection events
            self._getComponent("rows").find("tr").bind("click", function() {
                var key = $(this).attr("data-key");
                var businessKey = $(this).attr("data-business-key");
                self.selectRow(key, businessKey);
            });

            // Bind button actions
            self._getComponent("buttons").find("[data-action]").bind("click", function() {
                if ($(this).attr("data-action") === "totalizer") {
                    self.totalizer();
                } else {
                    self.processAction($(this).attr("data-action"));
                    self.unselectRow();
                }
            });

            self._getComponent("rowButtons").find("[data-action]").bind("click", function() {
                self.processAction($(this).attr("data-action"));
                self.unselectRow();
            });

            // Bind special cell button action
            self._getComponent("rows").find("[data-action=more]").bind("click", function(e) {
                e.stopPropagation();
                var businessKey = $(this).parents("[data-bizagi-component=cells]").attr("data-business-key");
                self.processAction($(this).attr("data-action"), { key: businessKey });
            });
        },

        /**
         * Popup Total
         * @returns {} 
         */
        totalizer: function() {
            var self = this;
            self.options.totalData();
        },
        /**
         * Executes the row selected handler
         * @returns {} 
         */
        onRowSelected: function() {
            var self = this;

            // Call base
            $.ui.bizagi_grid.prototype.onRowSelected.apply(self, arguments);

            // Show row buttons             
            self._showRowButtons();
        },

        /**
         * Executes the row un-selected handler
         * @returns {} 
         */
        onRowUnselected: function() {
            var self = this;

            // Call base
            $.ui.bizagi_grid.prototype.onRowUnselected.apply(self, arguments);

            // Hide row buttons           
            self._hideRowButtons();
        },

        getCell: function(key, xpath, index) {
            var self = this;
            var row = self._getComponent("rows").find("[data-business-key=" + key + "]");
            var allVisibleTd, cell = "";

            if (index < 4) {
                allVisibleTd = $("td", $(row));
                cell = allVisibleTd[index + 1];
            } else {
                allVisibleTd = $("td:visible", $(row));
                cell = allVisibleTd[index];
            }

            return $(cell);
        },

        /**
         * Template method to check if buttons component must be rendered
         * @returns {} 
         */
        _canShowButtons: function() {
            var self = this;
            var actions = self.options.actions;

            if (!self.isModeOnline()) {
                return actions["add"] || actions["remove"] || actions["edit"] || actions["inlineAdd"];
            } else {
                return actions["add"];
            }
        },

        /**
         * Template method to check if row buttons must be displayed when the row is selected
         * @returns {} 
         */
        _canShowRowButtons: function() {
            var self = this;
            var actions = self.options.actions;

            if (!self.isModeOnline()) {
                return false;
            } else {
                return actions["edit"] || actions["remove"];
            }
        },

        /**
         * Show the row buttons
         * @returns {} 
         */
        _showRowButtons: function() {
            var self = this;
            var doc = window.document;
            var element = self.element;

            // Add selected style to row
            var tr = element.find("[data-bizagi-component=rows] tr[data-key=" + self.selectedRow + "]");
            tr.addClass("ui-bizagi-state-selected");

            if (!self.isModeOnline()) {
                var buttons = self._getComponent("buttons");
                buttons.find("[data-action=remove]").removeClass("ui-grid-buttons-hidden");
            } else {
                // Locate floating buttons for the row
                var floatingButtons = self._getComponent("rowButtons");

                floatingButtons.show();
                floatingButtons.find(".ui-bizagi-grid-row-buttons").show();
                floatingButtons.position({
                    my: "right",
                    at: "left", //bottom
                    of: tr,
                    collision: "none",
                    offset: "-5 0"
                });

                if (floatingButtons.css("left") && Number(floatingButtons.css("left").replace("px", "")) < 0) {
                    floatingButtons.css("left", "0");
                }

                // Define handler to close the item
                setTimeout(function() {
                    // Capture all click elements inside the popup element
                    floatingButtons.click(function(e) {
                        e.stopPropagation();
                    });

                    element.find("[data-bizagi-component=rows]").click(function(e) {
                        e.stopPropagation();
                    });

                    // Make a document click, if the event bubbles up to here then the click was made outside popup boundaries
                    $(doc).one("click", function() {
                        self.unselectRow();
                    });
                }, 100);
            }
        },

        /**
         * Hide the row buttons
         * @returns {} 
         */
        _hideRowButtons: function() {
            var self = this;

            // Call base
            $.ui.bizagi_grid.prototype.onRowUnselected.apply(self, arguments);

            var tr = self._getComponent("rows").find("tr[data-key=" + self.selectedRow + "]");
            tr.removeClass("ui-bizagi-state-selected");

            // Hide floating buttons for the row
            if (!self.isModeOnline()) {
                var buttons = self._getComponent("buttons");
                buttons.find("[data-action=remove]").addClass('ui-grid-buttons-hidden');
            } else {
                var floatingButtons = self._getComponent("rowButtons");
                floatingButtons.hide();
            }
        },

        /**
         * Return the new created ids
         * @param {} rows 
         * @returns {} 
         */
        getNewRowKeys: function(rows) {
            var self = this;

            rows = rows || self._getComponent("rows").find("[data-new-row=true]");

            return $.map(rows, function(row, i) {
                return $(row).data("business-key");
            });
        },

        /**
         * Process an action in order to do something with the grid
         * @param {} action 
         * @returns {} 
         */
        processAction: function(action) {
            var self = this;

            // Call base
            $.ui.bizagi_grid.prototype.processAction.apply(self, arguments);

            if (action === "save") {
                self.onSaveAddedRows();
            }
            if (action === "cancel") {
                self.onCancelEdition();
            }
        },

        /**
         * Check if row its new
         * @param {} businessKey 
         * @returns {} 
         */
        isNewRecord: function(businessKey) {
            var self = this;
            var row = self._getComponent("rows");

            if (row) {
                businessKey = row.find("[data-business-key='" + businessKey + "']");
                if ($(businessKey).data("new-row")) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Add inline row
         * @returns {} 
         */
        addInlineRow: function() {
            var self = this;

            // Draw the new row
            self._triggerHandler("beforeInlineAdd");
            var html = self.drawRow(self.createAddRowData(), true);
            var newRow = $(html);

            // Execute the postrender
            self.postRenderRow(newRow);

            // Append to rows component
            self._getComponent("rows").append(newRow);

            var buttons = self._getComponent("buttons");

            if (!self.isModeOnline()) {
                buttons.find("[data-action=save]").removeClass("ui-grid-buttons-hidden");
                buttons.find("[data-action=cancel]").removeClass("ui-grid-buttons-hidden");
            } else {
                buttons.find("[data-action=save]").css("display", "inline-block");
                buttons.find("[data-action=cancel]").css("display", "inline-block");
            }

            // Show table component if there are no rows
            if (self.data.rows.length === 0) {
                self._getComponent("table").show();
                self._getComponent("emptyTable").hide();
            }

            self._triggerHandler("afterInlineAdd");
        },

        /**
         * Creates a dummy data for the new row
         * @returns {} 
         */
        createAddRowData: function() {
            var self = this;
            var options = self.options;
            var row = [];

            $.each(options.columns, function(i) {

                if (i === self.columnKeyIndex) {
                    // Add random key so we can identify them later
                    var key = Math.ceil(Math.random() * 100000);
                    row.push(key);
                } else {
                    // Add null value
                    row.push(null);
                }
            });

            return row;
        },

        /**
         * Executes the on add row handler
         * @returns {} 
         */
        onAddRow: function() {
            var self = this;

            // Allow add
            if (self.options.actions.add) {
                if (self.options.actions.inlineAdd) {
                    return self.addInlineRow();
                } else {
                    // Open dialog with addform
                    return self._triggerHandler("addRow");
                }
            }
        },

        /**
         * Executes when the user presses the cancel button, after inline add edition
         * @returns {} 
         */
        onCancelEdition: function() {
            var self = this;

            // Remove zero key rows
            var rows = self._getComponent("rows").find("[data-new-row=true]");
            var savedRows = self._getComponent("rows").find("[data-new-row=false]");
            rows.detach();

            // Hide buttons
            var buttons = self._getComponent("buttons");

            if (!self.isModeOnline()) {
                buttons.find("[data-action=save]").addClass("ui-grid-buttons-hidden");
                buttons.find("[data-action=cancel]").addClass("ui-grid-buttons-hidden");
            } else {
                buttons.find("[data-action=save]").hide();
                buttons.find("[data-action=cancel]").hide();
            }

            // Show table component if there are no rows
            if (savedRows.length === 0) {
                self._getComponent("table").hide();
                self._getComponent("emptyTable").show();
            }

            return self._triggerHandler("cancelEdition", { keys: self.getNewRowKeys(rows) });
        },

        /**
         * Executes when the user presses the save button, after inline add edition		
         * @returns {} 
         */
        onSaveAddedRows: function() {
            var self = this;

            // Retrieve key of added rows
            var newRowKeys = self.getNewRowKeys();
            var buttons = self._getComponent("buttons");

            // Hide buttons         
            if (newRowKeys.length >= 1 && self.isValid()) {

                var row = self._getComponent("rows");

                if (!self.isModeOnline()) {
                    $.each(newRowKeys, function(key, value) {
                        var businessKey = row.find("[data-business-key='" + value + "']");
                        $(businessKey).attr("data-new-row", 'false');
                    });

                    buttons.find("[data-action=save]").addClass("ui-grid-buttons-hidden");
                    buttons.find("[data-action=cancel]").addClass("ui-grid-buttons-hidden");
                    self._triggerHandler("saveAddedRows", { keys: newRowKeys });
                    return true;
                } else {
                    buttons.find("[data-action=save]").hide();
                    buttons.find("[data-action=cancel]").hide();

                    self._triggerHandler("saveAddedRows", { keys: newRowKeys });
                    return self._triggerHandler("removeNewRecords", { keys: newRowKeys });
                }

            } else {
                return true;
            }
        },

        /**
         * Check connection state
         * @returns {} 
         */
        isModeOnline: function() {
            var self = this;

            var isOfflineForm = typeof (self.options.isOfflineForm) !== "undefined"
                && bizagi.util.parseBoolean(self.options.isOfflineForm);

            return !isOfflineForm;
        }
    });

})(jQuery);
