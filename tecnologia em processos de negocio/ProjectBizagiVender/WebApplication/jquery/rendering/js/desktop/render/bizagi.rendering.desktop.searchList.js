/*
 *   Name: BizAgi Desktop Render Yes-No Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the Yes-No render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.searchList.extend("bizagi.rendering.searchList", {
    ADVANCED_SEARCH_ID: -1,
    ADVANCED_ADDITION_ID: -2,
    CLEAR_SEARCH_ID: -3,
    SEARCH_MIN_LENGTH: 2
}, {

    /*
     *   Template method to implement in each device to customize each render after processed
     */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Call base 
        this._super();

        // Apply plugin
        self.searchInput = $("input", control);
        self.advancedSearch = $("button", control);

        self.isOffline = typeof bizagi.context.isOfflineForm != "undefined" && bizagi.context.isOfflineForm;

        if (self.isOffline) {
            self.properties.submitOnChange = false;
            $('.ui-bizagi-render-icon-search', control).hide();
        } else if (self.properties.advancedSearch) {
            control.addClass('ui-bizagi-advanced-search');
        } else {
            $(control).find("input").css({ "width": "100%", "padding-right": "25px" });
        }

        self.applyAutocompletePlugin();
        self.attachKeyEvents();
    },

    /* Attaches key events to the control */
    attachKeyEvents: function () {
        var self = this;
        self.element.keydown(function (e) {
            e = window.event || e;
            var keyUnicode = e.charCode || e.keyCode;
            if (e !== undefined) {
                switch (keyUnicode) {
                    case 8: // Backspace
                        var caretPos = $("input:first", self.element)[0].selectionStart;
                        if (caretPos === 0) {
                            self.removeLastElement();
                            $("li:nth-last-child(2)", self.element).remove();
                            $(".biz-render-input-search", self.getControl()).focus();
                        }
                        break;
                }
            }
        });
    },

    /* Apply autocomplete capabilities to a single input*/
    applyAutocompletePlugin: function () {
        var self = this,
        control = self.getControl(),
        searchInput = self.searchInput;

        searchInput.autocomplete({
            autoFocus: true,
            messages: {
                noResults: null, //"No search results.",
                results: function () { }
            },
            source: function (req, add) {
                // active search
                self.activeRequestTerm = req.term;

                // Check local storage
                var now = new Date().getTime();
                var parseRequest = encodeURIComponent(req.term);
                var expireKey = self.properties.xpath + "_" + parseRequest + "_expire";
                var requestKey = self.properties.xpath + "_" + parseRequest;
                var expire = bizagi.util.getItemLocalStorage(expireKey);
                if (expire && self.properties.enableLocalStorage && now < expire) {
                    try {
                        var data = JSON.parse(bizagi.util.getItemLocalStorage(requestKey));
                        add(data);
                        self.hideAutocompleteLoading();
                    } catch (e) {
                        self.processRequest(req, add);
                    }
                } else {
                    self.processRequest(req, add);
                }
            },
            select: function (event, ui) {

                var selectedValues = JSON.parse(self.getValue()).value;
                var isNewItem = true;

                $.each(selectedValues, function (i, val) {
                    if (ui.item.id == val.id) {
                        isNewItem = false;
                        return isNewItem;
                    }

                });

                if (isNewItem) {
                    self.appendFoundItem(event, ui);
                }

                searchInput.autocomplete('close');
                ui.item.value = "";
            },
            open: function () {
                var suggestMenu = searchInput.data("ui-autocomplete").menu.element,
                    suggestStyles = {
                        top: 0,
                        left: 0
                    },
                    suggestContainer = searchInput.closest(".ui-bizagi-control"),
                    controlContainer = suggestContainer.parent(),
                    itemWidth = self.calculateSuggestionWidth(),
                    menu = searchInput.data("ui-autocomplete").menu;

                $('li', suggestMenu).each(function () {
                    if ($(this).index() % 2 < 1)
                        $(this).addClass('biz-ui-even');
                });

                // Fix position to prevent the scroll of autocomplete
                suggestMenu.css(suggestStyles);
                suggestContainer.addClass("ac-is-visible");
                controlContainer.addClass("ac-is-visible ac-clear-floats");

                suggestMenu.appendTo(suggestContainer).position({
                    my: "left top",
                    at: "left bottom",
                    of: this,
                    collision: "flipfit"
                });
                suggestMenu.css("z-index", $.getMaxZindex() + 10);

                // Add data to check if element is visible
                suggestMenu.attr("visible", true);

                // Apply with to menu and items
                $(".ui-bizagi-render-search-item", suggestMenu).width(itemWidth);
                suggestMenu.width(itemWidth);
                self.hideAutocompleteLoading();

            },
            close: function () {
                searchInput.data("ui-autocomplete").menu.element.attr("visible", false);
            },
            delay: this.Class.SEARCH_DELAY,
            minLength: self.Class.SEARCH_MIN_LENGTH
        });


        // Special rendering
        searchInput.data("ui-autocomplete")._renderItem = function (ul, item) {
            // Render for clear search
            if (item.id == self.Class.CLEAR_SEARCH_ID) {
                return self.renderClearItem(ul, item).appendTo(ul);
            }
            // Render for advanced search
            if (item.id == self.Class.ADVANCED_SEARCH_ID) {
                return self.renderAdvancedItem(ul, item).appendTo(ul);
            }

            // Render for allow addition
            if (item.id == self.Class.ADVANCED_ADDITION_ID) {
                return self.renderAddItem(ul, item).appendTo(ul);
            }

            // Normal rendering
            return self.renderSearchItem(item).appendTo(ul);
        };

        // Set close event
        $('.closebutton', control).click(function () {
            self.deleteItem($(this));
        });

        // Open advanced search
        $('.button-search', control).click(function () {
            self.showSearchDialog();
        });
    },
    /*
     * Append matched element
     */
    appendFoundItem: function (event, ui) {
        var self = this;

        if (self.properties.orientation == "rtl") {

            var control = this.getControl();
            var ul = $('.biz-render-input-search', control).closest('ul');
            var last = $('li:last', ul);
            var newElement = $('<li style="float:right;" "data-id="' + ui.item.id + '"><label class= "biz-render-searchlist label">' + ui.item.value + '</label><a class="closebuttonRtl"></a></li>');

            // Append new li with match word
            $(last).before(newElement);

            // Set close event
            $('.closebuttonRtl:last', ul).click(function () {
                self.deleteItem($(this));
            });

            // Set selected flag
            $('.biz-render-input-search', control).data('selected', '1');

            // Set focus on input field
            $('.biz-render-input-search', control).focus();


            // Remove selected css class from all elements
            $('li', ul).removeClass('selected');

            // Set value
            this.addElement({
                id: ui.item.id,
                value: ui.item.value
            });
        } else {

            var control = this.getControl();
            var ul = $('.biz-render-input-search', control).closest('ul');
            var last = $('li:last', ul);
            var newElement = $('<li data-id="' + ui.item.id + '"><label>' + ui.item.value + '</label><a class="closebutton"></a></li>');

            // Append new li with match word
            $(last).before(newElement);

            // Set close event
            $('.closebutton:last', ul).click(function () {
                self.deleteItem($(this));
            });

            // Set selected flag
            $('.biz-render-input-search', control).data('selected', '1');

            // Set focus on input field
            $('.biz-render-input-search', control).focus();


            // Remove selected css class from all elements
            $('li', ul).removeClass('selected');

            // Set value
            this.addElement({
                id: ui.item.id,
                value: ui.item.value
            });
        }

    },

    deleteItem: function (element) {
        var self = this;
        var control = self.getControl();

        var li = element.parent('li');
        // Remove from main memory and set the new value
        self.removeElement({
            id: li.data('id')
        });

        // Remove list element
        li.remove();

        // Set focus on input element
        $('.biz-render-input-search', control).focus();
    },

    /* 
     *   Renders a search item
     */
    renderSearchItem: function (item) {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("searchItem");

        var searchItem = $.tmpl(template, {
            image: properties.searchImage,
            label: item.label,
            orientation: self.properties.orientation || "lrt"
        });

        searchItem.data("item.autocomplete", item);

        return searchItem;
    },

    /* Renders the advanced item */
    renderAdvancedItem: function () {
        var self = this;
        var searchItem = self.renderSearchItem({
            id: self.Class.ADVANCED_SEARCH_ID,
            label: this.getResource("render-search-advanced-label")
        });

        // Bind click event
        searchItem.click(function () {
            self.showSearchDialog();
        });

        return searchItem;
    },

    /* Renders the advanced item */
    renderClearItem: function () {
        var self = this;
        var searchItem = self.renderSearchItem({
            id: self.Class.CLEAR_SEARCH_ID,
            label: this.getResource("render-search-clear-label")
        });

        // Bind click event
        searchItem.click(function () {
            self.setValue(null);

            // Submit info to server
            self.submitData();
        });

        return searchItem;
    },

    /* Renders the add item*/
    renderAddItem: function () {
        var self = this;
        var searchItem = self.renderSearchItem({
            id: self.Class.ADVANCED_ADDITION_ID,
            label: this.getResource("render-search-add-label")
        });

        // Bind click event
        searchItem.click(function () {
            // TODO: Implement this
        });

        return searchItem;
    },


    /* 
     *   Process the request data for the autocomplete control
     */
    processRequest: function (req, add) {
        var self = this,
        properties = self.properties;

        self.showAutocompleteLoading();
        // Create array for response objects
        var suggestions = [];

        if ((req.term.length >= this.Class.SEARCH_MIN_LENGTH)) {

            // Update term property to reflect the search
            properties.term = req.term;
            $.when(this.getData())
                .done(function (data) {
                    data = data.slice(0, properties.maxRecords);
                    if (data.length > 50) {
                        data = data.slice(0, 50);
                        suggestions.push({
                            id: self.Class.NO_RESULTS_SEARCH_ID,
                            label: self.getResource("render-search-maximum-records-allowed"),
                            value: ''
                        });
                    } else data = data.slice(0, properties.maxRecords);
                    if (data && data.length > 0) {
                        $.each(data, function (i, val) {
                            if (properties.maxRecords == 0 || i < properties.maxRecords) {
                                var parseValue;
                                switch (typeof val.value) {
                                    case "number":
                                        parseValue = val.value;
                                        break;
                                    case "object":
                                        parseValue = val.value.toString();
                                        break;
                                    case "string":
                                        parseValue = val.value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(req.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
                                        break;
                                    default:
                                        parseValue = val.value;
                                        break;
                                }

                                suggestions.push({
                                    id: val.id,
                                    label: parseValue,
                                    value: val.value
                                });
                            }
                        });
                    } else {
                        suggestions.push({
                            id: self.Class.NO_RESULTS_SEARCH_ID,
                            label: self.getResource("render-grid-no-records"),
                            value: ''
                        });
                    }

                    addToSuggestions(suggestions, req.term);

                    self.hideAutocompleteLoading();

                    /*
                     *   Method to add the special items to the suggestions
                     */
                    function addToSuggestions(allSuggestions, request) {
                        // Add the clear option
                        if (properties.allowClear && (self.value !== undefined)) {
                            allSuggestions.push({
                                id: self.Class.CLEAR_SEARCH_ID,
                                label: '',
                                value: ''
                            });
                        }
                        // Add additional option if advanced search is on
                        if (properties.advancedSearch) {
                            allSuggestions.push({
                                id: self.Class.ADVANCED_SEARCH_ID,
                                label: '',
                                value: ''
                            });
                        }

                        // Add additional option if allow addition is on
                        if (properties.allowAdd) {
                            allSuggestions.push({
                                id: self.Class.ADVANCED_ADDITION_ID,
                                label: '',
                                value: ''
                            });
                        }

                        // Create local storage to improve the speed
                        var expireTime = new Date().getTime() + self.properties.expireCache;
                        var parseRequest = encodeURIComponent(request);

                        if (self.properties.enableLocalStorage) {
                            var expireKey = self.properties.xpath + "_" + parseRequest + "_expire";
                            var requestKey = self.properties.xpath + "_" + parseRequest;

                            bizagi.util.setItemLocalStorage(expireKey, expireTime);
                            bizagi.util.setItemLocalStorage(requestKey, JSON.encode(allSuggestions));
                        }
                        // Pass array to callback
                        add(allSuggestions);
                    }
                });

        } else {
            //    addFunctionCallBack(suggestions);
        }
    },

    showAutocompleteLoading: function () {
        var self = this;
        var control = self.getControl();
        $('i', control).addClass('ui-autocomplete-loading');
    },
    hideAutocompleteLoading: function () {
        var self = this;
        var control = self.getControl();
        $('i', control).removeClass('ui-autocomplete-loading');
    },
    /* 
     *   Returns the desired width for the suggestion menu
     */
    calculateSuggestionWidth: function () {
        var self = this;
        var suggestMenu = self.searchInput.data("ui-autocomplete").menu.element;

        return suggestMenu.width();
    },

    /*
     *   Sets the value in the rendered control
     */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;

        if (value !== undefined) {
            if (properties.editable) {
                self.searchInput.val(value.label);
            }
        }

        // Call base
        //this.setValue(value);
        //this._super(value);
    },

    /*
     *   Returns the value to display, ex. non-editable renders
     */
    getDisplayValue: function () {
        return this.selectedValue;
    },

    /**
     * Open Add new record dialog 
     */
    showAddRecordDialog: function () {
        var self = this;
        var properties = self.properties;
        var buttons = {
            text: bizagi.localization.getResource("render-form-dialog-box-add"),
            click: function () {
                // Show dialog with add form
                var dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
                    showSaveButton: properties.editable,
                    title: bizagi.localization.getResource("render-dialog-entity"),
                    onSave: function (data) {
                        // Remove pagecache from data
                        var idPageCache = data.idPageCache;

                        var params = {
                            action: "SAVE",
                            data: data,
                            idPageCache: idPageCache,
                            guidEntity: properties.entity,
                            contexttype: 'entity'
                        }

                        $.when(
                            self.dataService.submitData(params)
                            ).done(function (data) {
                                // SUCCESS
                            });
                    }
                });

                dialog.render({
                    idRender: properties.id,
                    idPageCache: properties.idPageCache,
                    requestedForm: "addForm",
                    guidEntity: properties.entity,
                    contextType: 'entity'
                }).fail(function () {
                    //console.log("failed");
                });
            }
        }
        return {
            buttons: buttons
        };
    },

    /* 
     *   Opens the search dialog
     */
    showSearchDialog: function () {
        var self = this,
        control = self.getControl(),
        properties = self.properties,
        li = $('li:[data-id]', control),
        canBeAdd = true,
        extraButtons;

        // Define add button
        if (properties.allowNew) {
            extraButtons = self.showAddRecordDialog();
        }

        // Show search dialog
        var dialog = new bizagi.rendering.dialog.search(self.dataService, self.renderFactory, properties.searchForms, {
            allowFullSearch: properties.allowFullSearch,
            maxRecords: properties.maxRecord,
            multiSelect: true
        }, extraButtons);

        dialog.render({
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache
        })
        .done(function (item) {
            var label = [];

            // Parse label
            $.each(item.label, function (key, value) {
                if (key != 'id') {
                    label.push($(value).text());
                }
            });

            // check if element is already appended in the list
            $.each(li, function (key, value) {
                if ($(value).data('id') == item.id) {
                    canBeAdd = false;
                }
            });

            if (canBeAdd) {
                self.appendFoundItem('', {
                    item: {
                        id: item.id,
                        value: label.join(',')
                    }
                });
            }
        });
    },


    /*
     *   Method to render non editable values
     */
    postRenderReadOnly: function () {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("searchList");

        // Clear base actions
        control.empty();

        return $.tmpl(template, {
            value: properties.value,
            hasSearchForm: (properties.searchForms) ? true : false,
            editable: false
        }).appendTo(control);
    }
});
