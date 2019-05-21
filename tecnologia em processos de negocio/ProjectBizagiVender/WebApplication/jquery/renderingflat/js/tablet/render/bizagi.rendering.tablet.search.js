/*
*   Name: BizAgi Tablet Render Join Search Dialog Extension
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script will redefine the Join Search Dialog render class to adjust to tablet devices
*/

// Extends itself
bizagi.rendering.search.extend("bizagi.rendering.search", {
    ADVANCED_SEARCH_ID: -1,
    ADVANCED_ADDITION_ID: -2,
    SEARCH_MIN_LENGTH: 3,
    SEARCH_DELAY: 750

}, {

    /*
    *   Constructor
    */
    init: function (params) {
        var self = this;

        // Call base
        self._super(params);
    },

    /**
     * When the render isn't editable
     */
    renderReadOnly: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("readonlySearch");
        var value = self.properties.value && self.hasValue() ? self.properties.value.label : "";
        // Render template
        return $.fasttmpl(template, {value: value});
    },

    /**
     * When the render isn't editable
     */
    postRenderReadOnly: function(){
        var self = this;
        var control = self.getControl();

        self.input = $(".bz-rn-text", control);
        control.closest(".ui-bizagi-render").addClass("bz-rn-read-only");
    },

    /*
    *   Template method to implement in each device to customize each render after processed
    */
    postRender: function () {
        var self = this;
        var control = self.getControl();

        // Check is offline form        
        var isOfflineForm = bizagi.util.isOfflineForm({ context: self });

        // Call base 
        self._super();

        self.input = $(".bz-rn-container-control-search", control);
        self.searchInput = $("input", control);
        self.isOfflineForm = isOfflineForm || false;

        if (self.isOfflineForm) {
            self.properties.submitOnChange = false;
            self._simplySuggestOffline();
        } else if (self.properties.advancedSearch) {
            self._advanceSearch();
        } else {
            self._simplySearch();
        }
    },

    /*
    *
    */
    configureHandlers: function () {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();

        if (properties.editable) {
            $(".bz-rn-search-control-icons-clear", control).bind("click", function (e) {
                e.stopPropagation();
                self.setValue({ id: "" });
                self.searchInput.prop("value", "");
                $(this).addClass("hidden");
                self.input.find(".bz-rn-input-search-text").removeClass("hasValue");
            });
        }
    },

    /*
    *
    */
    renderControl: function () {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("search");

        var params = {
            allowSuggest: properties.allowSuggest,
            editable: properties.editable,
            allowClear: properties.allowClear,
            id: properties.id,
            xpath: properties.xpath,
            hasValue: (typeof (properties.value) !== "undefined" && properties.value !== null) &&
                typeof (properties.value.label) !== "undefined" && properties.value.label !== "",
            allowTyping: properties.allowTyping,
            advancedSearch: properties.advancedSearch,
            hasMozillaHelpText: ($.browser && $.browser.mozilla &&
                properties.helpText !== null && properties.helpText !== "") ? true : false
        };

        return $.fasttmpl(template, params);
    },

    /*Simply suggest autocomplete offline*/
    _simplySuggestOffline: function () {
        var self = this;
        var control = self.getControl();

        $(".bz-wp-search-control-search-icon", control).addClass("disable-search");
        self.applyAutocompletePlugin();
    },

    /*Simply search autocomplete*/
    _simplySearch: function () {
        var self = this;
        var control = self.getControl();

        $(".bz-wp-search-control-search-icon", control).addClass("disable-search");
        self.applyAutocompletePlugin();
    },

    _advanceSearch: function () {
        var self = this;
        // Set readonly property
        self.searchInput.attr("readonly", "true");

        //Bind search click button
        self.input.bind("click", function () {
            //Call showSlideSearch method
            self.showSlideSearch();
        });
    },

    /**
    * Sets the value in the rendered control
    * @param {objec} value 
    * @example 
    * value = {value: "xx",
    *           label: "yy",
                additionallabel: "zz"} (optional) 
    */
    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        var label = "";

        if (value !== null && typeof value !== "undefined" && typeof value.id !== "undefined") {
            if (value.additionallabel && value.label) {
                label = value.label + "," + value.additionallabel;
            } else if(value.label) {
                label = value.label;
            } else {
                label = "";
            }

            if (properties.editable) {
                self.searchInput.val(label);

                if(typeof value !== "undefined"){
                    self.input.find(".bz-rn-input-search-text").addClass("hasValue");
                } else{
                    self.input.find(".bz-rn-input-search-text").removeClass("hasValue");
                }
            } else {
                self.input.text(label);
            }
        }
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
        var self = this;
        var properties = self.properties;
        var slideParams = $.extend({}, self.getParams(), {
            container: self.getFormContainer().container,
            title: properties.displayName || "",
            allowNew: properties.allowNew
        });

        // Show search dialog
        // Create slide search object
        var slideView = new bizagi.rendering.tablet.slide.view.search(self.dataService, self.renderFactory,
            properties.searchForms, {
                allowFullSearch: properties.allowFullSearch,
                maxRecords: properties.maxRecords,
                idRender: properties.id,
                navigation: self.getParams().navigation,
                idPageCache: properties.idPageCache,
                orientation: properties.orientation || "ltr"
            }, slideParams);

        // Render the search form
        slideView.render({
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
        self.searchInput.parent().find(".bz-rn-autocomplete-wrapper").addClass("hidden");

        searchInput.addClass("ui-autocomplete-input");
        searchInput.on("click keyup", function () {
            self.autoCompleteSearchResults();
        });

        control.on("click mousedown", "li", function () {
            var elemObject = $.data(this).itemautocomplete;
            var label = Array.isArray(elemObject.value) ? elemObject.value.join(",") : elemObject.value;

            self.setValue({ id: elemObject.id, label: elemObject.value }, true);
            self.setDisplayValue({ id: elemObject.id, label: label });

            if (self.isOfflineForm) {
                $(this).parent().hide();
            } else {
                if (typeof self.properties.submitOnChange !== "undefined" && self.properties.submitOnChange) {
                    self.submitOnChange();
                }

                $(this).parent().hide();
            }

            self.getControl().find(".bz-rn-search-control-icons-clear").removeClass("hidden");
            self.input.find(".bz-rn-input-search-text").addClass("hasValue");
        });

        control.on("focusout", "input", function () {
            control.find("ul").hide();
            self.searchInput.parent().find(".bz-rn-autocomplete-wrapper").addClass("hidden");
        });
    },

    /* Search results on keyup or click the input field*/
    autoCompleteSearchResults: function () {
        var self = this;
        var searchInput = self.searchInput;
        var currentValue = self.searchInput.val();

        if(currentValue === ""){
            self.input.find(".bz-rn-search-control-icons-clear").addClass("hidden");
        }

        $.when(
            self.processRequest({ term: searchInput.val() }, function () { })
        ).done(function (resp) {
            var wrapper = self.searchInput.parent().find(".bz-rn-autocomplete-wrapper");
            if(resp.length > 0){
                wrapper.removeClass("hidden");
            } else{
                if(!wrapper.hasClass("hidden")){
                    wrapper.addClass("hidden");
                }
            }

            var elementUl = searchInput.parent().find("ul");
            elementUl.find("li").remove();

            elementUl.css({
                display: "inline-block",
                left: searchInput.position().left,
                top: searchInput.position().top + 15
            });

            var length = resp.length;
            if (length > 0) {
                //display the wrapper
                self.control.find(".bz-rn-autocomplete-wrapper").show();

                for (var i = 0; i < length; i++) {
                    var searchItem = self.renderSearchItem(resp[i]);
                    $(searchItem).addClass("bz-rn-autocomplete-item");
                    searchItem.appendTo(elementUl);
                }
            }
        });
    },

    processRequest: function (req) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();

        // Create array for response objects   
        var suggestions = [];

        /* 
        *   Method to add the special items to the suggestions 
        */
        function addToSuggestions(alSuggestions) {

            // Add the clear option - TODO: To implement            
            /* if (properties.allowClear && (self.value !== undefined)) { 
                alSuggestions.push({ id: self.Class.CLEAR_SEARCH_ID, label: "", value: "" });
            }*/

            // Add additional option if advanced search is on
            if (properties.advancedSearch) {
                alSuggestions.push({ id: self.Class.ADVANCED_SEARCH_ID, label: "", value: "" });
            }
            // Add additional option if allow addition is on
            if (properties.allowAdd) {
                alSuggestions.push({ id: self.Class.ADVANCED_ADDITION_ID, label: "", value: "" });
            }
            // Pass array to callback   
            defer.resolve(alSuggestions);
        }

        if ((req.term.length >= this.Class.SEARCH_MIN_LENGTH)) {
            // Update term property to reflect the search
            properties.term = req.term;
            if (self.isOfflineForm) {

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

                    var isSuggestMatch = parseValue !== undefined &&
                        parseValue.toLowerCase().indexOf(properties.term.toLowerCase()) !== -1;

                    if (isSuggestMatch) {
                        suggestions.push({
                            id: current.id !== undefined ? current.id : "",
                            label: parseValue !== undefined ? parseValue.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" +
                                    $.ui.autocomplete.escapeRegex(properties.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"),
                                "<strong>$1</strong>") : "",
                            value: parseValue !== undefined ? current.value : ""
                        });
                    }
                });

                addToSuggestions(suggestions);
            } else {
                this.getData()
                    .done(function (data) {
                        // Process response to highlight matches
                        var i = -1;
                        var item;

                        while ((item = data[++i]) && properties.maxRecords > i && i < 10) {
                            suggestions.push({
                                id: item.id,
                                label: item.value.toString()
                                    .replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" +
                                            $.ui.autocomplete.escapeRegex(req.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"),
                                        "<strong>$1</strong>"),
                                value: item.value
                            });
                        }

                        addToSuggestions(suggestions);
                    }).fail(function () {
                        // fail
                        defer.reject();
                    });
            }
        } else {
            addToSuggestions(suggestions);
        }

        return defer.promise();
    },

    renderSearchItem: function (item) {
        var self = this;
        var searchItem = $.tmpl(self.renderFactory.getTemplate("searchItem"), {
            id: item.id,
            label: item.label,
            value: item.value
        });

        searchItem.data("itemautocomplete", item);

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
                            contexttype: "entity"
                        };

                        $.when(
                            self.dataService.submitData(params)
                        ).done(function () {
                            // SUCCESS
                        });
                    }
                });

                dialog.render({
                    idRender: properties.id,
                    idPageCache: properties.idPageCache,
                    requestedForm: "addForm",
                    guidEntity: properties.entity,
                    contextType: "entity"
                }).fail(function () {

                });
            }
        };

        return {
            buttons: buttons
        };
    }
});