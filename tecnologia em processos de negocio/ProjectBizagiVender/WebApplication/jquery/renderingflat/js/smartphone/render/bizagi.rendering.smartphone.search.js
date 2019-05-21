/*
 *   Name: BizAgi Smartphone Render Join Aearch Dialog Extension
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
     *
     * */
    renderReadOnly: function () {
        var self = this;
        var template = self.renderFactory.getTemplate("readonlySearch");
        var value = self.properties.value && self.hasValue() ? self.properties.value.label : "";

        return $.fasttmpl(template, {value: value});
    },

    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();

        //Getting the control content
        self.input = $(".bz-rn-container-search", control);
        self.inputText = self.input.find(".bz-rn-input-search-text");

        if (!properties.editable) {
            container.addClass("bz-rn-non-editable");
            self.inputText = $('.bz-rn-text', control);
        }

        if (properties.allowSuggest) {
            container.addClass("bz-command-edit-inline");
            if (properties.editable) {
                self._simplySearch();
            }
        }

        self.configureHandlers();
    },

    configureHandlers: function(){
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();

        if (self.properties.advancedSearch && properties.editable) {
            container.addClass("bz-command-edit-inline");
            self.input.bind("click", function () {
                self.renderSearchForm();
            });
        }

        if(properties.editable){
            self.input.on("click", ".bz-rn-search-control-icons-clear", function(e){
                e.stopPropagation();
                self.setValue({id: ""});
                self.inputText.prop("value", "");
                $(this).addClass("hidden");
                self.inputText.removeClass("hasValue");
            });
        }
    },

    hasValue: function(){
        var self = this;
        return self.getValue().id !== "" && typeof self.getValue().id !== "undefined";
    },

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
            hasValue: typeof properties.value !== "undefined" && typeof properties.value.label !== "undefined" && properties.value.label !== "",
            allowTyping: properties.allowTyping,
            advancedSearch: properties.advancedSearch,
            hasMozillaHelpText: ($.browser && $.browser.mozilla && properties.helpText !== null && properties.helpText != "") ? true : false
        };

        return $.fasttmpl(template, params);
    },

    /*
     *   Add the render data to the given collection in order to send data to the server
     */
    collectData: function (renderValues) {
        var self = this;
        var properties = self.properties;

        // Add the render value
        var xpath = properties.xpath;
        var value = self.getValue();
        var compareValue = properties.originalValue;

        // Filter by valid xpaths and valid values
        // Remove empty validation for value for combos
        if (!compareValue || compareValue.id !== value.id || $.forceCollectData) { //if original value is equal to value
            if (!bizagi.util.isEmpty(xpath) && value !== null && typeof (value) !== "undefined") {
                // Add a validation because sometimes value contains an empty not null object
                if (typeof (value) == "object" && value.id === undefined)
                    return;
                // Add the value to the server
                renderValues[properties.xpath] = value;
            }
        }
    },

    /**
     * Sets the value to show and calls the method to sets the control value
     * @param {object} value
     * @param {int} value.id
     * @param {string} value.label
     * @param {string=} value.additionallabel
     * @example
     *   value = {
     *     id: 123,
     *     label: "xx",
     *     additionallabel: "yyyy"
     *   }
    */

    setDisplayValue: function (value) {
        var self = this;
        var label = "";
        if (value !== null && typeof value !== "undefined" && typeof value.id !== "undefined") {
            if (value.additionallabel && value.label) {
                label = value.label + "," + value.additionallabel;
            } else if(value.label) {
                label = value.label;
            }else{
                label = "";
            }

            if (self.properties.editable) {
                self.setValue(value, true);
                self.inputText.val(label);
                self.inputText.attr("id", value.id);
                self.inputText.html(label);

                if(typeof value !== "undefined"){
                    self.inputText.addClass("hasValue");
                }else{
                    self.inputText.removeClass("hasValue");
                }
            } else {
                self.inputText.text(label);
            }
        }
    },

    _simplySearch: function () {
        var self = this;
        var control = self.getControl();

        self.inputText.on("click keyup", function () {
            self.autoCompleteSearchResults();
        });

        control.on("click mousedown", "li", function () {
            var elemObject = $.data(this).itemautocomplete;
            var label = Array.isArray(elemObject.value) ? elemObject.value.join(",") : elemObject.value;
            self.setDisplayValue({ id: elemObject.id, label: label });
            $(this).parent().hide();
            self.input.find(".bz-rn-search-control-icons-clear").removeClass("hidden");
            self.inputText.addClass("hasValue");
        });

        control.on("focusout", "input", function () {
            control.find("ul").hide();
            self.inputText.parent().find(".bz-rn-autocomplete-wrapper").addClass("hidden");
        });
    },

    /* Apply autocomplete capabilities to a single input*/
    autoCompleteSearchResults: function () {
        var self = this;
        var currentValue = self.inputText.val();
        if(currentValue === ""){
            self.input.find(".bz-rn-search-control-icons-clear").addClass("hidden");
        }

        $.when(
            self.processRequest({ term: currentValue }, function () { })
        ).done(function (resp) {
            var wrapper = self.inputText.parent().find(".bz-rn-autocomplete-wrapper");
            if(resp.length > 0){
                wrapper.removeClass("hidden");
            }else{
                if(!wrapper.hasClass("hidden")){
                    wrapper.addClass("hidden");
                }
            }

            var elementUl = self.inputText.parent().find("ul");
            elementUl.find("li").remove();

            elementUl.css({
                display: "inline-block",
                left: self.inputText.position().left,
                top: self.inputText.position().top + 15,
                width: self.inputText.css("width")
            });

            for (var i = 0, length = resp.length ; i < length; i++) {
                var searchItem = self.renderSearchItem(resp[i]);
                $(searchItem).addClass("bz-rn-autocomplete-item");
                searchItem.appendTo(elementUl);
            }
        });
    },

    renderSearchForm: function () {
        var self = this;
        var properties = self.properties;

        var formSearchParams = $.extend({}, self.getParams(), {
            navigation: self.getFormContainer().getNavigation()
        });

        var searchForm = new bizagi.rendering.smartphone.helpers.searchForm(self.dataService, self.renderFactory, properties.searchForms, {
                allowFullSearch: properties.allowFullSearch,
                maxRecords: properties.maxRecords,
                allowNew: properties.allowNew || false,
                orientation: properties.orientation || "ltr"
            },
            formSearchParams
        );

        searchForm.renderEdition({
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
            displayName: properties.displayName,
            idPageCache: properties.idPageCache
        }).done(function (itemId) {
            self.setValue({ id: itemId });

            //send the item selected
            properties.submitOnChange = true;

            self.submitData();
        });
    },

    renderSearchItem: function (item) {
        var self = this;
        var searchItem = $.tmpl(self.renderFactory.getTemplate("edition.search.item"), {
            id: item.id,
            label: item.label,
            value: item.value
        });

        searchItem.data("itemautocomplete", item);

        return searchItem;
    },

    processRequest: function (req, add) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();

        // Create array for response objects   
        var suggestions = [];

        // Add to suggestions function                
        function addToSuggestions(alSuggestions) {

            // Add the clear option             
            /*
             // TODO: To implement allowClear
             if (properties.allowClear && (self.value !== undefined)) {
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
            this.getData()
                .done(function (data) {
                    // Process response to highlight matches

                    var i = -1;
                    var a;
                    while (a = data[++i] && properties.maxRecords > i && i < 10) {
                        suggestions.push({
                            id: data[i].id,
                            label: data[i].value.toString().replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + $.ui.autocomplete.escapeRegex(req.term) + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>"),
                            value: data[i].value
                        });
                    }

                    addToSuggestions(suggestions);

                }).fail(function () {
                //fail
                defer.reject();
            });

        } else {
            addToSuggestions(suggestions);
        }

        /* 
         *   Method to add the special items to the suggestions
         */
        return defer.promise();
    },

    setDisplayValueEdit: function (value) {
        var self = this;

        self.inputEdition.find(".ui-bizagi-render-search").val(self.selectedValue);
    },

    //on the desktop only sends the id to submit 
    //in the smartphone it send the id and the value
    submitData: function () {
        var self = this;
        var properties = self.properties;

        // Add current data
        var data = {};

        data[properties.xpath] = self.getValue();

        // Executes submit on change
        if (properties.submitOnChange && data[properties.xpath].id != undefined)
            self.submitOnChange(data, true);
    },

    actionSave: function () {
        var self = this;

        self.inputText.html(self.value.value || self.value.label);
        self.inputText.val(self.value.value || self.value.label);
        self.inputText.attr("id", self.value.id);
    }
});