/*
 *   Name: BizAgi Desktop Render Yes-No Extension
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will redefine the Yes-No render class to adjust to desktop devices
 */

// Extends itself
bizagi.rendering.search.extend("bizagi.rendering.search", {
    ADVANCED_SEARCH_ID: -1,
    ADVANCED_ADDITION_ID: -2,
    CLEAR_SEARCH_ID: -3,
    NO_RESULTS_SEARCH_ID: -4,
    SEARCH_DELAY: 750
}, {
    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        properties.searchImage = properties.searchImage || this.dataService.getSearchDefaultImage();

        // Store reference of all ajax request in order to run only one instance of them
        var deferredReference = null;
    },
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

    },
    postRenderReadOnly: function () {

        var self = this;
        var properties = this.properties;
        self.setDisplayValue(properties.value);
    },

    /*
    *   Template method to implement in each device to customize the render's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;

        // Call base
        self._super();

        // Bind select event
        var searchInput = self.searchInput;
        searchInput.bind("autocompleteselect", function (e, ui) {
            // ui.item.id == self.Class.CLEAR_SEARCH_ID || was taken off in order to allow rule execution when clicking on clear
            if (ui.item.id == self.Class.ADVANCED_SEARCH_ID || ui.item.id == self.Class.ADVANCED_ADDITION_ID || ui.item.id == self.Class.CLEAR_SEARCH_ID || ui.item.id == self.Class.NO_RESULTS_SEARCH_ID)
                return false;

            // Set data    
            if (self.isOffline) {
                ui.item.label = ui.item.label.replace(/<\/?[^>]+(>|$)/g, "");
            }

            self.setValue(ui.item);
            self.selectedValue = ui.item.value;

            //IE 8 Focus fix - SUITE-9517
            if (document.selection) {
                // Set focus on the element
                searchInput.focus();

                // Create empty selection range
                var oSel = document.selection.createRange();

                // Move selection start and end to 0 position
                oSel.moveStart('character', -self.selectedValue.length);

                // Move selection start and end to desired position
                oSel.moveStart('character', 0);
                oSel.moveEnd('character', self.selectedValue.length);
                oSel.select();
            }


            // Submit info to server
            /* Comment because make double submitonchange             
            if (self.properties.submitOnChange) {
            self.submitData();
            }*/
            return true;
        });
        self.bind("onSearchError", function (e, data) {
            var form = self.getFormContainer();
            form.clearValidationMessages();
            try {
                //Add information of cotrol
                var msgObj = self.properties.displayName + ": ";
                msgObj += JSON.parse(data.responseText).message;
                form.addValidationMessage(msgObj, "", "ui-icon-alert");
            } catch (e) {
                // If data does not json string, show data content
                form.addValidationMessage(data);
            }

            self.hideAutocompleteLoading();
        });
        // Attach blur event
        if (!self.properties.advancedSearch) {
            /*         self.searchInput.bind("blur", function () {

            // Updates internal value
            var selectedValue = "";
            if (self.searchInput.val() != self.selectedValue) {
            self.searchInput.val("");
            self.setValue(null);
            }

            self.searchInput.removeClass('ui-autocomplete-loading');

            });*/
        }

        // Bind click event
        searchInput.click(function () {
            // close if already visible
            if (searchInput.autocomplete("widget").is(":visible")) {
                searchInput.autocomplete("close");
                return;
            }

            searchInput.autocomplete("search", $(searchInput).val());
        });

        // Bind click event
        self.advancedSearch.click(function () {
            self.showSearchDialog();
        });
    },
    /* Apply autocomplete capabilities to a single input*/
    applyAutocompletePlugin: function () {
        var self = this,
            searchInput = self.searchInput,
            orientation = self.getFormContainer().properties.orientation,
            alignForSuggest = orientation == "rtl" ? "right" : "left",
            rtlClassForSuggest = orientation == "rtl" ? " suggest-rtl" : "";

        // Apply autocomplete plugin 
        searchInput.autocomplete({
            autoFocus: true,
            messages: {
                noResults: null, //"No search results.",
                results: function () {
                }
            },
            search: function (event, ui) {
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
                    $(this).addClass(rtlClassForSuggest);
                    if ($(this).index() % 2 < 1)
                        $(this).addClass('biz-ui-even');
                });

                // Fix position to prevent the scroll of autocomplete
                suggestMenu.css(suggestStyles);
                suggestContainer.addClass("ac-is-visible");
                controlContainer.addClass("ac-is-visible ac-clear-floats");

                suggestMenu.appendTo(suggestContainer).position({
                    my: alignForSuggest + " top",
                    at: alignForSuggest + " bottom",
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
            delay: this.Class.SEARCH_DELAY           
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
            self.setValue({ id: "" });

            // Submit info to server
            self.readyActionExecution().done(function () {
                if (!self.properties.submitOnChange) {
                    self.submitData();
                }
            });
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
        // Create array for response objects   
        var suggestions = [];

        if (self.properties.allowSuggest && (req.term.length >= self.properties.searchLength)) {
            self.showAutocompleteLoading();

            // Update term property to reflect the search
            properties.term = req.term;

            if (self.isOffline) {
                var dataOffline = self.properties.data;

                if (dataOffline && dataOffline.length > 0) {
                    $.each(dataOffline, function (index, current) {

                        var parseValue;
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
                } else {
                    suggestions.push({
                        id: self.Class.NO_RESULTS_SEARCH_ID,
                        label: self.getResource("render-grid-no-records"),
                        value: ''
                    });
                }

                addToSuggestions(suggestions);
                self.hideAutocompleteLoading();
            } else {

                /**
                * Cancel previous request in order to improve the performance
                */
                if (this.deferredReference && typeof this.deferredReference.reject === "function" && this.deferredReference.state() !== "resolved") {
                    this.deferredReference.reject({ hideStatus: true });
                }

                self.deferredReference = this.getData()
                    .done(function (data) {
                        if (data && data.length > 0) {
                            data = data.slice(0, properties.maxRecords);
                            if (data.length > 50) {
                                data = data.slice(0, 50);
                                suggestions.push({
                                    id: self.Class.NO_RESULTS_SEARCH_ID,
                                    label: self.getResource("render-search-maximum-records-allowed"),
                                    value: ''
                                });
                            } else data = data.slice(0, properties.maxRecords);
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
                    });
            }
        } else {
            addToSuggestions(suggestions, req.term);
        }

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
        var label = "";
        if (value != undefined && value != null) {
            if (properties.editable) {
                if (typeof (value.value) != "undefined" && value.value) {
                    self.searchInput.val(value.value);
                } else if (value.additionallabel && value.label) {
                    label = value.label + "," + value.additionallabel;
                    self.searchInput.val(label);
                } else if (typeof value.label != "undefined") {
                    self.searchInput.val(value.label);
                } else if (typeof value.id != "undefined") {
                    self.searchInput.val(value.id);
                } else {
                    self.searchInput.val(value);
                }
            } else {
                var control = self.getControl();
                label = value.label;

                if (typeof label == "string") {
                    label = label.replaceAll("&", "&amp;");
                    label = label.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
                    label = label.replaceAll("\"", "&#34;").replaceAll("'", "&#39;").replaceAll("/", "&#47;");
                }
                else if(typeof label == "undefined"){
                    label = "";
                }

                control.html(label);
            }
        }
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
                    orientation: self.properties.orientation || "ltr",
                    onSave: function (data) {
                        // Remove pagecache from data
                        var idPageCache = data.idPageCache;
                        var defer = $.Deferred();

                        var params = {
                            action: "SAVE",
                            data: data,
                            idPageCache: idPageCache,
                            guidEntity: properties.entity,
                            contexttype: 'entity'
                        };

                        // Check if the add form has data
                        var formData = {};
                        // Turn on flag to force to collect all data on the form
                        $.forceCollectData = true;

                        dialog.form.collectRenderValues(formData);

                        // Turn off flag
                        $.forceCollectData = false;

                        if (!bizagi.util.isMapEmpty(formData)) {
                            $.when(self.dataService.submitData(params)).done(function (response) {

                                // Set the previous added record to search grid form 
                                function dataHasXpath(xpath) {
                                    var render = self.searchDialog.currentSearchForm.getRender(xpath);

                                    if (typeof render == "object" && render != null) {
                                        return { "found": true, "obj": render };
                                    }

                                    return { "found": false, "obj": {} };
                                }

                                for (var i in formData) {
                                    var mapping = dataHasXpath(i);
                                    if (mapping.found) {
                                        mapping.obj.setValue(formData[i]);
                                        self.setDisplayValueToControl(mapping.obj, dialog.form, i, formData);
                                    }
                                }

                                self.searchDialog.currentSearchForm.performSearch({
                                    allowFullSearch: properties.allowFullSearch,
                                    maxRecords: properties.maxRecords
                                });

                                defer.resolve(data);
                                dialog.closeDialogBox();
                            }).fail(function (jqXHR, type, message) {
                                if (type == "parsererror") {
                                    defer.resolve({
                                        type: "error",
                                        message: message.message
                                    });
                                } else {
                                    defer.reject(arguments);
                                }
                            });
                        } else {
                            // Form has not data
                            bizagi.showMessageBox(self.getResource("render-search-advanced-no-filters"), "", "error");
                            defer.resolve();
                        }

                        return defer.promise();
                    },
                    close: function () {
                        dialog.dialog('destroy');
                        dialog.remove();
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
        };
        return {
            buttons: buttons
        };
    },

    /***
     * Set display value by control type, when add new record
     * @param renderControlSearchForm
     * @param addForm
     * @param xpath
     * @param formData
     */
    setDisplayValueToControl: function (renderControlSearchForm, addForm, xpath, formData){
        if(renderControlSearchForm.properties.type === "searchSuggest"){
            renderControlSearchForm.setDisplayValue(addForm.getRender(xpath).getDisplayValue());
        }
        else{
            renderControlSearchForm.setDisplayValue(formData[xpath]);
        }
    },

    /* 
    *   Opens the search dialog
    */
    showSearchDialog: function () {
        var self = this,
            properties = self.properties,
            extraButtons,
            contextType = (properties.searchForms.length > 0 && properties.searchForms[0].type == "searchForm") ? "metadata" : "entity";

        // Define add button
        if (properties.allowNew) {
            extraButtons = self.showAddRecordDialog();
        }

        // Show search dialog
        self.searchDialog = new bizagi.rendering.dialog.search(self.dataService, self.renderFactory, properties.searchForms, {
            allowFullSearch: properties.allowFullSearch,
            maxRecords: properties.maxRecords,
            orientation: properties.orientation || "ltr"
        }, extraButtons);

        self.searchDialog.render({
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            contexttype: contextType,
            orientation: properties.orientation || "ltr"
        }).done(function (item) {
            // Set data
            self.setValue(item);
            self.readyActionExecution().done(function () {
                if (!self.properties.submitOnChange) {
                    self.submitData();
                }
            });
        });
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
    * Cleans current data
    */
    cleanData: function () {
        var self = this;
        var control = self.getControl();
        var value = { id: "" };
        self.setDisplayValue(value);
        self.setValue(value, false);
        if (!self.properties.editable) {
            $(control).html("<label class='readonly-control'></label>");
        }
    }

});
