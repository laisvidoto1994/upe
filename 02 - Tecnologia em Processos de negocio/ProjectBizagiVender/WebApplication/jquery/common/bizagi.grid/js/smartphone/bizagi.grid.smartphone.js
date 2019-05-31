/*
*   Name: 
*   Author: Oscar O
*   Comments:
*   -   This widget will extend the bizagi grid widget to specialize into a smartPhone view
*
*   
*
*   Styles:
*   - css/bizagi/smarpthone/controls/bizagi.grid.css
*/

(function ($) {
    $.widget('ui.bizagi_grid_smartphone', $.ui.bizagi_grid, {

        /*
        *   Method to attach any handler to the grid
        */
        attachHandlers: function () {
            var self = this;

            // Add paging events
            self._getComponent("pager").find("ul li").bind("click", function () {
                var pageNumber = $(this).attr("data-page-number");
                self.changePage(pageNumber);
            });
            if (self._getComponent("buttons") != undefined)
            self._getComponent("buttons").find("[data-action]").bind("click", function () {
                self.selectedRow = self.element.find("[data-key]").data("key");
                self.selectedBusinessKey = self.element.find("[data-key]").data("business-key");
                if ($(this).attr("data-action") == 'totalizer') {
                    self.totalizer();
                } else{
                    self.processAction($(this).attr("data-action"));
                    self.unselectRow();
                }
            });

            // Bind special cell button action
            self._getComponent("rows").find("[data-action=more]").bind("click", function () {
                var key = $(this).parents("[data-bizagi-component=cells]").attr("data-key");
                self.processAction($(this).attr("data-action"), { key: key });
            });
        },

        /* popup Total
         *
         */
        totalizer: function(){
            var self = this;
                self.options.totalData();
        },

        /*totalData
         *   prepare totalizer
        */
        draw: function(){
            var self = this;
            self._super();
            var verifyTotalizer = self.options.actions.totalizer;

            //Verify totalizer to activate action sheet
            if(verifyTotalizer) {
                if (typeof self.actualActionSheet != "undefined" && !bizagi.util.isObjectEmpty(self.actualActionSheet)) {
                    self.actualActionSheet.data("kendoMobileActionSheet").destroy();
                }

                self.actualActionSheet = self.element.find("#ui-bizagi-menu-totalizer").kendoMobileActionSheet();
            }

            //hide loader
            bizagi.util.smartphone.stopLoading();
        },


        changePage: function (page) {
            var self = this;
            var currentPage = Number(self.data.page);
            //in the smartphone the original  self.data.total is always 1  this change to self.data.records refers in this case a total pages
            var total = self.data.records;
            var newPage = page;

            //show loader
            bizagi.util.smartphone.startLoading();
            setTimeout(function () {
                bizagi.util.smartphone.stopLoading();
            }, 1000);

            // Process previous page
            if (page == "previous") {
                if (currentPage > 1) newPage = currentPage - 1;
                else return;
            }
            // Process next page
            if (page == "next") {
                if (currentPage < total) newPage = currentPage + 1;
                else return;
            }

            // Update internal options
            self.page = Number(newPage);

            // Execute handler
            self.onPageRequested();
        },

        /*
        *   Executes the row selected handler
        */
        onRowSelected: function () {
            var self = this;
            // Call base
           $.ui.bizagi_grid.prototype.onRowSelected.apply(self, arguments);
        },

        /*
        *   Executes the row un-selected handler
        */
        onRowUnselected: function () {
            var self = this;
            // Call base
            $.ui.bizagi_grid.prototype.onRowUnselected.apply(self, arguments);
        },

        /*
        *  Template method to check if buttons component must be rendered
        */
        _canShowButtons: function () {
            var self = this;
            var actions = self.options.actions;
            return actions["add"] || actions["edit"] || actions["remove"];
        },

        /*
        *  Template method to check if row buttons must be displayed when the row is selected
        */
        _canShowRowButtons: function () {
            var self = this;
            var actions = self.options.actions;
            return actions["edit"] || actions["remove"];
        },

        /*
        *   Return the new created ids
        */
        getNewRowKeys: function () {
            var self = this;
            var rows = self._getComponent("rows").find("[data-new-row]");
            return $.map(rows, function (row, i) {
                return $(row).data("business-key");
            });
        },
        
        
        /*
        *   Show the row buttons
        */
        _showRowButtons: function () {

        },

        /*
        *   Hide the row buttons
        */
        _hideRowButtons: function () {

        }
    });

})(jQuery);
