var DEFAULT_CASELIST_URL = "ajax/CaseHandler.aspx";
var DETAIL_CASE_URL = "MobileDetail.html";
var CASE_TEMPLATE = '<h3 class="ui-li-heading"><span class="ui-bizagi-workportal-case-item-state case-state-#state#"></span>&nbsp;#processName#:&nbsp;#radicationNumber#</h3>' +
                    '<p class="ui-li-desc"><strong>#radicationDate#</strong></p>' +
                    '<p class="ui-li-desc">#description#</p>';

    
(function ($) {
    // Base widget definition
    $.widget("mobile.caseList", {
        /* Default options here*/
        options: {
            template: CASE_TEMPLATE
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
            self.itemContainer = $('<ul data-role="listview" class="ui-bizagi-mobile-case-item-container" />')
                            .appendTo(element);

                            // Draw link
            self.addMoreLink = $('<a data-role="button" data-icon="plus">More cases ... </a>')
                            .click(function () {
                                self.page = self.page + 1;
                                self.itemContainer.listview('destroy');
                                self._fillItems();

                                return false;
                            })
                            .appendTo($("div[data-role='footer']"))
                            .customButton();

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

            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: { page: self.page, rowcount: self.rowcount, filter: self.filter, order: self.orderBy, orderDirection: self.orderDirection },
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        self._createItemTemplate(data[i]);
                    }

                    self.itemContainer.listview();
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
            var self = this;
            var element = self.element;
            var container = self.itemContainer;
            var item = $('<li class="ui-bizagi-mobile-case-item" />')
                    .appendTo(container);

            // fill template
            var template = self.template;

            // Do replaces
            if (self.tokens){
                for (var i = 0; i < self.tokens.length; i++) {
                    var dataKey = self.tokens[i].substring(1, self.tokens[i].length - 1);
                    var value = data[dataKey];
                    if (dataKey.toLowerCase().indexOf("date") != -1) {
                        value = formatDate(eval(data[dataKey].replace(/\/Date\((\d+)\)\//gi, "new Date($1)")), 'dd/MM/yyyy')
                    }

                    // Highlights filter match
                    if (self.filter && self.filter.length > 0)
                        value = value.toString().replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + self._escapeRegex(self.filter) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");

                    template = template.replaceAll(self.tokens[i], value);
                }
            }

            var anchor = $('<a href="http://dev-diegop/BizAgiJquery2/' + DETAIL_CASE_URL + '?idCase=' + data.id + '" />')
                         .append(template);

            item.append(anchor);
        },

        _buildHeader: function () {
            var self = this;

            /* SEARCH BOX*/
            var inputContainer = $('<div data-role="fieldcontain" class="ui-bizagi-mobile-case-list-search-box"></div>')
                                 .append('<label for="ui-bizagi-mobile-case-list-search-box-id" class="ui-bizagi-render-hint">Search</label>');
            
            var hint = $(".ui-bizagi-render-hint", inputContainer);

            var searchBox = $('<input type="search" name="ui-bizagi-mobile-case-list-search-box-id" id="ui-bizagi-mobile-case-list-search-box-id" value="" />')
                            .appendTo(inputContainer)
                            .customTextInput();
            
            // Attach click handler
            searchBox.change(function () {
                if (self.filter == searchBox.val()) return;

                // Clean container
                self._clearList();
                self.itemContainer.listview('destroy');

                // Send ajax request including filter
                self.filter = searchBox.val();
                self.page = 1;

                self._fillItems();
            });

            // Creates hint events
            // Bind events
            searchBox.focus(function (i) {
               hint.addClass("focus");
            });
            searchBox.keypress(function (i) {
                hint.addClass("has-text").removeClass("focus");
            });
            searchBox.blur(function (i) {
                if ($(this).val() == "") {
                    hint.removeClass("has-text").removeClass("focus");
                }
            });
            hint.click(function (i) {
                searchBox.focus();
            });
                
            return inputContainer;
        },

        _clearList: function () {
            var self = this;

            self.itemContainer.empty();
        },

        _escapeRegex: function (value) {
            return value.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1");
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