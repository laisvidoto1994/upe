/*
* jQuery BizAgi Render Search Widget 0.1 
* Copyright (c) http://www.bizagi.com
*
* Depends:
*	jquery.ui.core.js
*	jquery.ui.widget.js
*	jquery.ui.autocomplete.js
*	jquery.metadata.js
*	bizagi.ui.render.base.js
*/

var DEFAULT_SEARCH_URL = "äjax/AjaxListHandler.aspx";
var DEFAULT_ITEM_ICON = "css/bizagi/images/bizagi_xpress.png";
var BIZAGI_RENDER_ADVANCED_SEARCH_ID = -1;
var BIZAGI_RENDER_ADVANCED_ADDITION_ID = -2;
var BIZAGI_SEARCH_ADVANCED_PAGE = "misc/Search.html";
var BIZAGI_SEARCH_ADDITION_PAGE = "misc/SearchAdd.html";
var BIZAGI_SEARCH_MIN_LENGTH = 2;

(function ($) {
    $.ui.baseRender.subclass('ui.searchRender', {
        /* Renders the control*/
        _render: function () {
            var self = this,
            properties = self.options.properties,
            control = self.control;

            // Define control settings & defaults
            self.dataUrl = properties.dataUrl || DEFAULT_SEARCH_URL;

            // Creates control
            self.input = $('<input class="ui-bizagi-render-search" type="text" />')
                .appendTo(control);

            // Apply autocomplete plugin
            self._applyAutocompletePlugin(self.input);

            // Bind select event
            self.input.bind("autocompleteselect", function (e, ui) {
                self._setInternalValue(ui.item.id);
                self._setDisplayValue(ui.item.label);
            });

        },

        /* Internally sets the value */
        _setValue: function (value) {
            var self = this,
                properties = self.options.properties;

            // Call base
            $.ui.baseRender.prototype._setValue.apply(this, arguments);

            // Set value in control
            if (value && properties.editable) {
                self.input.val(value.label);
                self._setInternalValue(value.id);
                self._setDisplayValue(value.label);
            }
        },

        /* Internally sets the display value */
        _setDisplayValue: function (value) {
            var self = this;
            $(self).data("displayValue", value);
        },

        /* Internally gets the display value */
        _getDisplayValue: function () {
            var self = this;
            return $(self).data("displayValue");
        },

        /* Apply autocomplete capabilities to a single input*/
        _applyAutocompletePlugin: function (input) {
            var self = this,
            properties = self.options.properties;

            // Apply autocomplete plugin 
            input.autocomplete({
                source: function (req, add) {
                    self._processRequest(req, add);
                },
                open: function (event, ui) {
                    // Fix width
                    var suggestMenu = input.data("autocomplete").menu.element;
                    var itemWidth = self._calculateSuggestionWidth();

                    // Apply with to menu and items
                    $(".ui-bizagi-render-search-item", suggestMenu).width(itemWidth);
                    suggestMenu.width(itemWidth);
                },
                minLength: 0
            })

            // Special rendering
            input.data("autocomplete")._renderItem = function (ul, item) {
                // Render for advanced search
                if (item.id == BIZAGI_RENDER_ADVANCED_SEARCH_ID) {
                    return self._renderAdvancedItem(ul, item);
                }

                // Render for allow addition
                if (item.id == BIZAGI_RENDER_ADVANCED_ADDITION_ID) {
                    return self._renderAddItem(ul, item);
                }

                // normal rendering
                return $('<li class="ui-bizagi-render-search-item" style="width: auto"></li>')
				    .data("item.autocomplete", item)
                    .append('<a><img class="ui-bizagi-render-search-item-icon" src="' + DEFAULT_ITEM_ICON + '"/><label class="ui-bizagi-render-search-item-label">' + item.label + '</label></a>')
				    .appendTo(ul);
            };


            // Bind click event
            input.click(function () {
                // close if already visible
                if (input.autocomplete("widget").is(":visible")) {
                    input.autocomplete("close");
                    return;
                }

                input.autocomplete("search", $(input).val());
            });
        },

        /* Returns the desired width for the suggestion menu*/
        _calculateSuggestionWidth: function () {
            var self = this;
            var suggestMenu = self.input.data("autocomplete").menu.element;

            return suggestMenu.width()
        },

        /* Process the request data for the autocomplete control*/
        _processRequest: function (req, add) {
            var self = this,
            properties = self.options.properties;

            // Create array for response objects   
            var suggestions = [];

            if (req.term.length >= BIZAGI_SEARCH_MIN_LENGTH) {
                // Pass request to server 
                $.ajax({
                    url: urlMergeQueryString(self.dataUrl, "xpath=" + properties.xpath + "&idRender=" + properties.id),
                    data: $.extend(req, {xpath: properties.xpath}),
                    dataType: $.bizAgiCommunication.dataType,
                    jsonp: $.bizAgiCommunication.jsonpParam,
                    success: function (data) {
                        // Set data in the control
                        $(self).data("suggestions", data);

                        // Process response to highlight matches
                        $.each(data, function (i, val) {
                            suggestions.push({
                                id: val.id,
                                label: val.value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(req.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
                                value: val.value
                            });
                        });

                        addToSuggestions(suggestions)
                    }
                });

            } else {
                addToSuggestions(suggestions)
            }

            /* Method to add the special items to the suggestions */
            function addToSuggestions(suggestions) {
                // Add additional option if advanced search is on
                if (properties.advancedSearch) {
                    suggestions.push({ id: BIZAGI_RENDER_ADVANCED_SEARCH_ID, label: '', value: '' });
                }

                // Add additional option if allow addition is on
                if (properties.allowAdd) {
                    suggestions.push({ id: BIZAGI_RENDER_ADVANCED_ADDITION_ID, label: '', value: '' });
                }

                // Pass array to callback   
                add(suggestions);
            }
        },

        /* Renders the advanced item */
        _renderAdvancedItem: function (ul, item) {
            var self = this;

            var li = $('<li class="ui-bizagi-render-search-item-special" ></li>')
				                .data("item.autocomplete", item)
                                .append('<a><label class="ui-bizagi-render-search-item-label">' + $.bizAgiResources["bizagi-ui-render-search-advanced-label"] + '</label></a>')
				                .appendTo(ul);

            // Bind click event
            li.click(function () {
                self._showSearchDialog();
            });

            return li;
        },

        /* Renders the add item*/
        _renderAddItem: function (ul, item) {
            var self = this;

            var li = $('<li class="ui-bizagi-render-search-item-special" ></li>')
				                .data("item.autocomplete", item)
                                .append('<a><label class="ui-bizagi-render-search-item-label">' + $.bizAgiResources["bizagi-ui-render-search-add-label"] + '</label></a>')
				                .appendTo(ul);

            // Bind click event
            li.click(function () {
                self._showAddDialog();
            });
            return li;
        },

        /* Opens the search dialog*/
        _showSearchDialog: function () {
            var self = this;
            var doc = self.element.ownerDocument;
            var searchDialog = $('<div></div>')
                .appendTo("body", doc);

            searchDialog.load(BIZAGI_SEARCH_ADVANCED_PAGE, function () {
                var searchContainer = $(".ui-bizagi-container-search", searchDialog);

                // Do dialog
                searchContainer
                    .baseContainer()
                    .dialog({
                        show: 'blind',
                        width: BIZAGI_RENDER_POPUP_WIDTH,
                        height: 550,
                        title: 'Bizagi',
                        modal: true,
                        buttons: {
                            "Cerrar": function () {
                                searchContainer.dialog("close");
                            },
                            "Buscar": function () {
                                // TODO: Set autocomplete value
                                alert("TODO: This needs to be implemented after grid widget has been introduced");

                                // DUMMY: Set "Selected" as a value with id -1
                                self._setValueFromDialog({ id: -1, label: 'Selected', value: 'Selected' });
                            }
                        },
                        close: function (ev, ui) {
                            // Close and destroy dialog 
                            searchContainer.dialog('destroy');
                            searchDialog.detach();
                        }
                    });
            });
        },

        /* Set the value from the dialogs*/
        _setValueFromDialog: function (item) {
            var self = this;
            self._setValue(item);
        },

        /* Opens the add form*/
        _showAddDialog: function () {
            var self = this,
                properties = self.options.properties;

            self._showFormPopup({
                url: urlMergeQueryString(BIZAGI_SEARCH_ADDITION_PAGE, "xpath=" + properties.xpath + "&idRender=" + properties.id),
                onSave: function (popupForm) {
                    // TODO: Set autocomplete value
                    alert("TODO: This is a dummy value simulating a new value");

                    // DUMMY: Set "Selected" as a value with id -2
                    self._setValueFromDialog({ id: -2, label: $("#name", popupForm).val(), value: $("#name", popupForm).val() });
                }
            });
        }
    });

})(jQuery);