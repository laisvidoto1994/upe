/*
*   Name: BizAgi Tablet Render Join Aearch Dialog Extension
*   Author: Edward Morales
*   Comments:
*   -   This script will redefine the Join Search Dialog render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.search.extend("bizagi.rendering.search", {
    ADVANCED_SEARCH_ID: -1,
    ADVANCED_ADDITION_ID: -2,
    SEARCH_MIN_LENGTH: 3,
    SEARCH_DELAY: 700

}, {

    /*
    *   Constructor
    */
    init: function (params) {
        // Call base
        this._super(params);

        // Fill default properties
        var properties = this.properties;
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Call base 
        this._super();

        self.searchInput = $("input", control);
        self.isOffline = typeof bizagi.context.isOfflineForm != "undefined" && bizagi.context.isOfflineForm;

        if (self.isOffline) {
            self.properties.submitOnChange = false;
            self._simplySuggestOffline();
        } else if (self.properties.advancedSearch) {
            self._advanceSearch();
        } else {
            self._simplySearch();
        }
    },

    /*Simply suggest autocomplete offline*/
    _simplySuggestOffline: function () {
        var self = this;
        var control = self.getControl();

        $(".bt-search", control).hide();
        self.applyAutocompletePlugin();
    },

    /*Simply search autocomplete*/
    _simplySearch: function () {
        var self = this;
        var control = self.getControl();

        $(".bt-search", control).hide();
        self.applyAutocompletePlugin();

    },

    _advanceSearch: function () {
        var self = this;
        var control = self.getControl();
        // Set readonly property
        self.searchInput.attr("readonly", "true");

        //Bind search click button
        $(".bt-search", control).click(function () {
            //Call showSlideSearch method
            self.showSlideSearch();
        });
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
        this._super(value);
    },

    /*
    *   Returns the value to display, ex. non-editable renders
    */
    getDisplayValue: function () {
        return this.selectedValue;
    },

    /* 
    *   Opens the search slide
    */
    showSlideSearch: function () {
        var self = this,
        properties = self.properties,
        slideParams = {
            container: self.getFormContainer().container
            //TODO:SUITE-6187 out of reach of delivery
            //   extraButtons: (properties.allowNew) ? self.showAddRecordDialog() : false
        };

        // Show search dialog
        // Create slide search object
        var slideForm = new bizagi.rendering.slide.search(self.dataService, self.renderFactory, properties.searchForms, {
            allowFullSearch: properties.allowFullSearch,
            maxRecords: properties.maxRecords
        },
        slideParams
        );


        // Render the search form
        slideForm.render({
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache
        }).done(function (item) {
            // Set data                 
            self.setValue(item);

            // Submit info to server
            self.submitData();
        });
    },

    /* Apply autocomplete capabilities to a single input*/
    applyAutocompletePlugin: function () {

        var self = this;
        var control = self.getControl();
        var searchInput = self.searchInput;

        searchInput.autocomplete({
            messages: {
                noResults: null, //"No search results.",
                results: function () { }
            },
            delay: this.Class.SEARCH_DELAY,
            minLength: this.Class.SEARCH_MIN_LENGTH,
            source: function (req, add) {
                self.processRequest(req, add);
            },
            appendTo: self.element.find(".ui-bizagi-render-control"),
            autoFocus: true,
            select: function (event, item) {
                if (self.isOffline) {
                    self.setValue({ id: item.item.id, label: item.item.value }, true);
                    //self.triggerHandler("renderchange", { render: self, changed: true });
                    return;
                }

                self.setDisplayValue({ id: item.item.id, label: item.item.value });
                if (typeof self.properties.submitOnChange != "undefined" && self.properties.submitOnChange == true) {
                    self.submitOnChange();
                }

            }
        });

        searchInput.data("ui-autocomplete")._renderItem = function (ul, item) {
            return self.renderSearchItem(item).appendTo(ul);
        };

    },

    processRequest: function (req, add) {
        var self = this,
        properties = self.properties;
        // Create array for response objects   
        var suggestions = [];
        //self.properties.allowSuggest &&
        if ((req.term.length >= this.Class.SEARCH_MIN_LENGTH)) {
            // Update term property to reflect the search
            properties.term = req.term;
            if (self.isOffline) {

                var dataOffline = self.properties.data;

                $.each(dataOffline, function (index, current) {

                    var parseValue = "";
                    switch (typeof current.value) {
                        case "number":
                            parseValue = current.value;
                            break;
                        case "object":
                            parseValue = current.value.toString();
                            break;
                        case "string":
                            parseValue = current.value;
                            break;
                        default:
                            parseValue = current.value;
                            break;
                    }

                    var isSuggestMatch = parseValue !== undefined && parseValue.toLowerCase().indexOf(properties.term.toLowerCase()) !== -1;

                    if (isSuggestMatch) {
                        suggestions.push({
                            id: current.id !== undefined ? current.id : '',
                            label: parseValue !== undefined ? parseValue.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(properties.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>") : '',
                            value: parseValue !== undefined ? current.value : ''
                        });
                    }
                });

                addToSuggestions(suggestions);
            } else {
                this.getData()
                    .done(function (data) {
                        // Process response to highlight matches
                        $.each(data, function (i, val) {
                            suggestions.push({
                                id: val.id,
                                label: val.value.toString().replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(req.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
                                value: val.value
                            });
                        });

                        addToSuggestions(suggestions);
                    }).fail(function () {
                        // fail
                    });
            }
        } else {
            addToSuggestions(suggestions);
        }

        /* 
        *   Method to add the special items to the suggestions 
        */
        function addToSuggestions(alSuggestions) {

            // Add the clear option
            if (properties.allowClear && (self.value !== undefined)) {
                alSuggestions.push({ id: self.Class.CLEAR_SEARCH_ID, label: '', value: '' });
            }
            // Add additional option if advanced search is on
            if (properties.advancedSearch) {
                alSuggestions.push({ id: self.Class.ADVANCED_SEARCH_ID, label: '', value: '' });
            }
            // Add additional option if allow addition is on
            if (properties.allowAdd) {
                alSuggestions.push({ id: self.Class.ADVANCED_ADDITION_ID, label: '', value: '' });
            }
            // Pass array to callback   
            add(alSuggestions);
        }
    },

    renderSearchItem: function (item) {
        var self = this;
        var properties = self.properties;
        var searchItem = $.tmpl(self.renderFactory.getTemplate("searchItem"), {
            id: item.id,
            label: item.label,
            value: item.value
        });
        searchItem.data("ui-autocomplete-item", item);
        return searchItem;
    },

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
                        };

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

                });
            }
        }
        return {
            buttons: buttons
        };
    }

});
