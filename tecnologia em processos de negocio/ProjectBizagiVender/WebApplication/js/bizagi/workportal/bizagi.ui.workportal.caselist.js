/*
* jQuery BizAgi Case List Widget 0.1
*
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.metadata.js
*/
(function ($) {

    var DEFAULT_CASELIST_URL = "ajax/CaseHandler.aspx";
    var CASE_TEMPLATE =
            '<div class="ui-bizagi-workportal-case-item-process">#processName#</div>' +
            '<div class="ui-bizagi-workportal-case-item-state case-state-#state#"></div>' +
            '<div class="ui-bizagi-workportal-case-item-radicationdate">#radicationDate#</div>' +
            '<div class="ui-bizagi-workportal-case-item-radicationnumber">#radicationNumber#</div>' +
            '<div class="ui-bizagi-workportal-case-item-description ellipsis">#description#</div>';

    // Base widget definition
    $.ui.widget.subclass("ui.caseList", {
        /* Default options here*/
        options: {
            template: CASE_TEMPLATE,

            orderColumns: [{ value: 'id', label: 'Id' },
                            { value: 'processName', label: 'Process' },
                            { value: 'radicationNumber', label: 'Radication Number' },
                            { value: 'radicationDate', label: 'Radication Date'}],

            groupColumns: [{ value: '', label: '-- None --' },
                            { value: 'processName', label: 'Process' },
                            { value: 'radicationDate', label: 'Radication Date'}]
        },

        /* Constructor */
        _create: function () {
            var self = this,
            element = self.element;

            // Clean container
            self._clean();

            // Set defaults
            self.url = DEFAULT_CASELIST_URL;
            self.rowcount = 12;
            self.page = 1;
            self.orderBy = "";
            self.groupBy = "";
            self.orderDirection = "";
            self.filter = "";
            self.template = self.options.template;
            self.tokens = self.template.match(/#\w+#/g);

            // Draw header
            self.header = self._buildHeader()
                      .appendTo(element);

            // Draw item container
            self.itemContainer = $('<div class="ui-bizagi-workportal-case-item-container" />')
                            .appendTo(element);

            // Draw loading animation
            self.loadingAnimation = $('<div class="ui-bizagi-workportal-case-list-loading" />')
                            .appendTo(element);

            // Draw link
            self.addMoreLink = $('<a class= "ui-bizagi-workportal-case-loadItems-anchor" href="javascript:;">More cases ... </a>')
                            .click(function () {
                                self.page = self.page + 1;
                                self._fillItems();
                            })
                            .appendTo(element);

            // Fill Data
            self._fillItems();
        },

        _clean: function () {
            var self = this,
            element = self.element;

            element.empty();
        },

        _fillItems: function () {
            var self = this;
            var url = self.url;

            // Set loading animation
            self.loadingAnimation.show();
            self.addMoreLink.show();

            // Create accordion if the list is grouped
            if (self.groupBy.length > 0) {
                if (self.groupAccordion == null) {
                    self.groupAccordion = $('<div />').appendTo(self.itemContainer);
                }
            }

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: { page: self.page, rowcount: self.rowcount, filter: self.filter, order: self.orderBy, orderDirection: self.orderDirection },
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        self._createItemTemplate(data[i]);
                    }

                    if (data.length < self.rowcount) {
                        // Hide add more anchor when there are no more records
                        self.addMoreLink.hide();
                    }

                    // Hide loading animation
                    self.loadingAnimation.hide();
                }
            });
        },

        /*
        *   ITEM DEFINITION:
        *       id
        *       radicationNumber
        *       processName
        *       radicationDate
        *       state
        *       description
        */
        _createItemTemplate: function (data) {
            var self = this,
            element = self.element;

            var container = self.itemContainer;

            if (self.groupBy.length > 0) {
                var groupingKey = data[self.groupBy];
                var groupLabel = groupingKey;

                if (self.groupBy.toLowerCase().indexOf("date") != -1) {
                    groupingKey = formatDate(eval(data[self.groupBy].replace(/\/Date\((\d+)\)\//gi, "new Date($1)")), 'dd-MM-yyyy')
                    groupLabel = formatDate(eval(data[self.groupBy].replace(/\/Date\((\d+)\)\//gi, "new Date($1)")), 'dd/MM/yyyy')
                }

                // References the group
                var container = $(".ui-bizagi-workportal-case-group-" + groupingKey, self.groupAccordion);
                if (container.length == 0) {
                    var accordionContainer = $('<h3><a href="#">' + groupLabel + '</a></h3><div class="ui-bizagi-workportal-case-group-' + groupingKey + '"></div>');
                    self.groupAccordion.append(accordionContainer);

                    // Apply accordion plugin
                    self.groupAccordion.accordion('destroy');
                    self.groupAccordion.accordion({
                        autoHeight: false,
                        collapsible: true,
                        clearStyle: true
                    });

                    // Assign container
                    container = $(".ui-bizagi-workportal-case-group-" + groupingKey, self.groupAccordion);
                }
            }

            var item = $('<div class="ui-bizagi-workportal-case-item" />')
                    .addClass("ui-widget-content")
                    .addClass("ui-corner-all")
                    .mouseover(function () {
                        $(this).addClass("ui-state-hover");
                    })
                    .mouseout(function () {
                        $(this).removeClass("ui-state-hover");
                    })
                    .click(function () {
                        $(".ui-bizagi-workportal-case-item-description", item).text(data.description);
                        $(".ui-bizagi-workportal-case-item-description", item).css("white-space", "normal");
                    })
                    .appendTo(container);

            // fill template
            var template = self.template;

            // Do replaces
            for (var i = 0; i < self.tokens.length; i++) {
                var dataKey = self.tokens[i].substring(1, self.tokens[i].length - 1);
                var value = data[dataKey];
                if (dataKey.toLowerCase().indexOf("date") != -1) {
                    value = formatDate(eval(data[dataKey].replace(/\/Date\((\d+)\)\//gi, "new Date($1)")), 'dd/MM/yyyy')
                }

                // Highlights filter match
                if (self.filter && self.filter.length > 0)
                    value = value.toString().replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(self.filter) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");

                template = template.replaceAll(self.tokens[i], value);
            }

            item.append(template);

            // Add ellipsis on firefox
            $(".ui-bizagi-workportal-case-item-description", item).ellipsis(true);
        },

        _buildHeader: function () {
            var self = this;

            var header = $('<div class="ui-bizagi-workportal-case-list-header ui-widget-header" />');

            /* ORDER BY BOX */
            var orderBySelect = self._buildOrderColumnOptions("idCase")
                                .attr("id", "ui-bizagi-workportal-case-list-order-columns");

            var orderByDirection = $('<select id="ui-bizagi-workportal-case-list-order-direction"><option value="ASC" selected>Ascending</option><option value="DESC">Descending</option></select>');

            var orderByBox = $('<span class="ui-bizagi-workportal-case-list-order" />')
                         .append('<label for="ui-bizagi-workportal-case-list-order-columns">Order by:</label>')
                         .append(orderBySelect)
                         .append('<label for="ui-bizagi-workportal-case-list-order-direction"></label>')
                         .append(orderByDirection)
                         .appendTo(header);

            $("#ui-bizagi-workportal-case-list-order-columns", orderByBox).selectmenu({ width: 150 });
            $("#ui-bizagi-workportal-case-list-order-direction", orderByBox).selectmenu({ width: 100 });

            // Handlers
            $("#ui-bizagi-workportal-case-list-order-columns", orderByBox).change(function () {
                // Clean container
                self._clearList();

                // Send ajax request including filter
                self.page = 1;
                self.orderBy = $(this).val();
                self._fillItems();
            });

            $("#ui-bizagi-workportal-case-list-order-direction", orderByBox).change(function () {
                // Clean container
                self._clearList();

                // Send ajax request including filter
                self.page = 1;
                self.orderDirection = $(this).val();
                self._fillItems();
            });

            /* GROUP BOX */

            var groupBySelect = self._buildGroupColumnOptions("")
                                .attr("id", "ui-bizagi-workportal-case-list-group-columns");



            var groupByBox = $('<span class="ui-bizagi-workportal-case-list-group" />')
                         .append('<label for="ui-bizagi-workportal-case-list-group-columns">Group by:</label>')
                         .append(groupBySelect)
                         .appendTo(header);

            $("#ui-bizagi-workportal-case-list-group-columns", groupByBox).selectmenu({ width: 150 });

            // Handlers
            $("#ui-bizagi-workportal-case-list-group-columns", groupByBox).change(function () {
                // Clean container
                self._clearList();

                // Send ajax request including filter
                self.page = 1;
                self.groupBy = $(this).val();
                self._fillItems();
            });

            /* SEARCH BOX*/
            var inputBox = $('<input type="text" class="ui-bizagi-workportal-case-list-search-box" />');
            var searchIcon = $('<span class="ui-icon ui-icon-search" />');

            var searchBox = $('<span class="ui-bizagi-workportal-case-list-search ui-corner-all ui-state-default"></span>')
                        .append(inputBox)
                        .append(searchIcon)
                        .appendTo(header);

            // Attach click handler
            searchIcon.click(function () {
                if (self.filter == inputBox.val()) return;

                // Clean container
                self._clearList();

                // Send ajax request including filter
                self.filter = inputBox.val();
                self.page = 1;

                self._fillItems();
            });
                
            return header;
        },

        _buildOrderColumnOptions: function (selected) {
            var self = this;
            var select = $("<select/>")
            for (var i = 0; i < self.options.orderColumns.length; i++) {
                var option = $('<option value="' + self.options.orderColumns[i].value + '">' + self.options.orderColumns[i].label + '</option>');

                if (selected == self.options.orderColumns[i].value) {
                    option.attr("selected", "true");
                }

                option.appendTo(select);
            }

            return select;
        },

        _buildGroupColumnOptions: function (selected) {
            var self = this;
            var select = $("<select/>")
            for (var i = 0; i < self.options.groupColumns.length; i++) {
                var option = $('<option value="' + self.options.groupColumns[i].value + '">' + self.options.groupColumns[i].label + '</option>');

                if (selected == self.options.groupColumns[i].value) {
                    option.attr("selected", "true");
                }

                option.appendTo(select);
            }

            return select;
        },

        _clearList: function(){
            var self = this;
            
            self.itemContainer.empty();
            
            // Remove accordion
            self.groupAccordion = null;
        },

        /*  Destructor */
        destroy: function () {
            var self = this;

            // Cleans the render contents 
            self._clean();

            return this;
        }
    });
})(jQuery);