/*
*   Name: BizAgi Smartphone Render Join Aearch Dialog Extension
*   Author: Oscar o
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

    renderSingle: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();
        var textTmpl = self.renderFactory.getTemplate("text");
        self.input = $.tmpl(textTmpl).appendTo(control);

        if (!properties.editable) {
            container.addClass("bz-command-not-edit");
        }
    },

    setDisplayValue: function (value) {
        var self = this;
        var properties = self.properties;
        var control = self.getControl();
        self.setValue(value, false);
        self.input.html(value.label);
        self.input.val(value.label);
        self.input.attr("id", value.id);
    },

    renderEdition: function () {
        this._super();
        var self = this;
        if (self.properties.advancedSearch)
        { self._advanceSearch(); }
        else
        { self._simplySearch(); }
    },

    _simplySearch: function () {
        var self = this;
        var properties = self.properties;
        var container = self.getContainerRender();
        var control = self.getControl();
        var textTmpl = self.renderFactory.getTemplate("edition.search");
        self.inputEdition = $.tmpl(textTmpl, {
            id: properties.id,
            xpath: properties.xpath,
            allowTyping: properties.allowTyping
        });

        self.inputEdition.find(".ui-bizagi-render-search").autocomplete({
            messages: {
                noResults: null, //"No search results.",
                results: function () { }
            },
            delay: this.Class.SEARCH_DELAY,
            source: function (req, add) {
                self.processRequest(req, add);
            },
            open: function () {
                //todo for the close keyboard android
            },
            select: function (event, item) {
                //self.setDisplayValue({ id: item.item.id, label: item.item.value });
                var inputEditiontmp = self.inputEdition.find("> input");
                inputEditiontmp.html(item.item.value);
                inputEditiontmp.attr("id", item.item.id);
                // inputEditiontmp.data("label", item.item.value);
            },
            minLength: this.Class.SEARCH_MIN_LENGTH
        });

        self.inputEdition.find(".ui-bizagi-render-search").data("ui-autocomplete")._renderItem = function (ul, item) {
            return self.renderSearchItem(item).appendTo(ul);
        };

        self.inputEdition.find(".ui-bizagi-render-search").click(function () {
            if (self.inputEdition.find(".ui-bizagi-render-search").autocomplete("widget").is(":visible")) {
                self.inputEdition.find(".ui-bizagi-render-search").autocomplete("close");
                return;
            }
            self.inputEdition.find(".ui-bizagi-render-search").autocomplete("search", $(self.inputEdition.find(".ui-bizagi-render-search")).val());
        });

        if (typeof self.getValue() !== "undefined" && self.getValue() != null  && self.getValue().id !== null && self.getValue().label !== null) {
            var inputEditiontmp = self.inputEdition.find("> input");
            inputEditiontmp.html(self.getValue().label);
            inputEditiontmp.attr("id", self.getValue().id);
            inputEditiontmp.data("label", self.getValue().label);
        }


    },

    _advanceSearch: function () {

        var self = this,
         properties = self.properties,
         textTmpl = self.renderFactory.getTemplate("edition.search");

        self.inputEdition = $.tmpl(textTmpl, {
            id: properties.id,
            xpath: properties.xpath,
            allowTyping: properties.allowTyping,
            advancedSearch: true
        });

        self.inputEdition.find(".bz-rn-search-button").bind("click", function () {
            self.renderSearchForm();
        });

    },

    renderSearchForm: function () {

        var self = this;
        var properties = self.properties;
        var formSearchParams = $.extend({}, self.getParams(), {
            container: self.getFormContainer().container
        });

        var searchForm = new bizagi.rendering.smartphone.helpers.searchForm(self.dataService, self.renderFactory, properties.searchForms, {
            allowFullSearch: properties.allowFullSearch,
            maxRecords: properties.maxRecords
        },
        formSearchParams
        );

        searchForm.renderEdition({
            idRender: properties.id,
            xpath: properties.xpath,
            xpathContext: properties.xpathContext,
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
        var properties = self.properties;
        var searchItem = $.tmpl(self.renderFactory.getTemplate("edition.search.item"), {
            id: item.id,
            label: item.label,
            value: item.value
        });
        searchItem.data("item.autocomplete", item);
        return searchItem;
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
            //fail
        });

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
            self.submitOnChange(data);
    },

    actionSave: function () {
        var self = this;

        var inputEditiontmp = self.inputEdition.find("> input");
        self.value = self.value ? self.value : {};
        self.value.id = inputEditiontmp.attr("id");
        self.value.label = inputEditiontmp.val(); //.data("label");

        if (self.value.label == "") {
            self.value.id = null;
            self.value.label = null;
        }

        self.input.html(self.value.value || self.value.label);
        self.input.val(self.value.value || self.value.label);
        self.input.attr('id', self.value.id);
        self.setDisplayValue({ id: self.value.id, label: (self.value.value || self.value.label) });
        self.setValue( self.value.id );

    },

    actionBack: function () { },

    changeRequired: function (argument) {
        var self = this,
        properties = self.properties;
        if (typeof properties.value != "object") {
            self.super();
            return;
        }
        var labelElement = $("label", self.getLabel());
        // Update properties
        properties.required = argument;

        // Changes label
        if ($.isEmptyObject(properties.value)) {
            labelElement.text((properties.displayName || "") + ' ');

            labelElement.before('<div class="bz-rn-required" ></div>');

            self.setPlaceHolder();
        } else {
            // labelElement.css("font-weight", "");
            labelElement.text((properties.displayName || "")); //+ ' :'
        }
        // Perform validations again to check if the form is valid after this change
        self.triggerRenderValidate();
    }
});
