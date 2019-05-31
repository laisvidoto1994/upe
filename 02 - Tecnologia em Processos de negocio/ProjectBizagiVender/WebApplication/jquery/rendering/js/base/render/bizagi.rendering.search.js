/*
 *   Name: BizAgi Render Search Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define basic stuff for search renders
 */

bizagi.rendering.render.extend("bizagi.rendering.search", {}, {
    /*
    *   Update or init the element data
    */
    initializeData: function (data) {
        var self = this;
        // Call base
        this._super(data);

        // Fill default properties
        var properties = this.properties;
        properties.searchForms = properties.searchForms || [];
        // Default maxRecords is 20
        properties.maxRecords = Number(properties.maxRecords) || 20;
        properties.advancedSearch = (bizagi.util.parseBoolean(properties.advancedSearch) === null) ? false : bizagi.util.parseBoolean(properties.advancedSearch);
        properties.allowSuggest = bizagi.util.parseBoolean(properties.allowSuggest) !== null ? bizagi.util.parseBoolean(properties.allowSuggest) : false;
        properties.allowFullSearch = properties.allowFullSearch || false;
        properties.allowAdd = bizagi.util.parseBoolean(properties.allowAdd) || false;
        properties.allowTyping = bizagi.util.parseBoolean(properties.allowTyping) !== null ? bizagi.util.parseBoolean(properties.allowTyping) : false;
        properties.allowTyping = bizagi.util.parseBoolean(properties.allowSuggest) ? true : properties.allowTyping;
        properties.allowClear = bizagi.util.parseBoolean(properties.allowClear) !== null ? bizagi.util.parseBoolean(properties.allowClear) : false;
        properties.editable = bizagi.util.parseBoolean(properties.editable) !== null ? bizagi.util.parseBoolean(properties.editable) : true;
        // This length defines the behavior of the suggest, 2 characters are used by default meaning after 2 characters are written the search will take place
        properties.searchLength = properties.searchLength || 2;

        // Expire local storage cache
        properties.enableLocalStorage = false;
        properties.expireCache = 1000 * 60 * 15; // 15 minutes
    },
    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("search");

        return $.fasttmpl(template, {
            id: properties.id,
            xpath: properties.xpath,
            allowTyping: properties.allowTyping,
            advancedSearch: properties.advancedSearch,
            hasMozillaHelpText: $.browser ? (($.browser.mozilla && properties.helpText != null && properties.helpText != "") ? true : false): false
        });
    },
    /*
    *   Fetch the data into a deferred
    */
    getData: function (params) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();
        var form = self.getFormContainer();
        var contextType = form.getContextType() || form.params.contexttype || false;
        params = params || {};

        // Verify context type
        if (self.properties.contexttype) {
            params.h_contexttype = self.properties.contexttype;
        } else if (contextType) {
            params.h_contexttype = contextType;
        }

        // QA-471 When the contexttype is metadata it does not
        // send xpathcontext
        if(params && params.h_contexttype && params.h_contexttype === 'metadata'){
            properties.xpathContext = '';
        }

        // Resolve with remote data
        self.dataService.multiaction().getSearchData({
            url: properties.dataUrl,
            xpath: properties.xpath,
            idRender: properties.id,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            term: (properties.allowFullSearch) ? "%" + properties.term : properties.term,
            extra: params
        }).done(function (data) {
            // Resolve with fetched data
            properties.data = data;
            defer.resolve(properties.data);
        }).fail(function (data) {
            var hideStatus = data.hideStatus || false;
            defer.resolve({});
            if (!hideStatus) {
                self.trigger("onSearchError", data);
            }
        });
        return defer.promise(defer);
    },
    /*
    *   Sets the internal value
    */
    setValue: function (value, triggerEvents) {
        var self = this;
        triggerEvents = triggerEvents !== undefined ? triggerEvents : true;

        self._super(value, triggerEvents);

        if (value != undefined) {
            this.value = value;
            this.selectedValue = value.label;
        } else {
            this.value = null;
            this.selectedValue = null;
        }


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

        if (self.controlValueIsChanged()) {
            // Filter by valid xpaths and valid values
            // Remove empty validation for value for combos
            if (!bizagi.util.isEmpty(xpath) && value !== null && typeof (value) !== "undefined") {
                // Add a validation because sometimes value contains an empty not null object
                if (typeof (value) == "object" && value.id === undefined)
                    return;
                // Add the value to the server
                renderValues[properties.xpath] = value;
            }
        }
    },
    /*
    *   Submits the selected data to the server in order to be saved
    */
    submitData: function () {
        var self = this;
        var properties = self.properties;

        // Add current data
        var data = {};
        if (!self.grid) {
            data[properties.xpath] = self.getValue();
        }
        // Executes submit on change
        self.submitOnChange(data, undefined, false);
    },
    /*
    * Check if control is valid or not
    */
    isValid: function (invalidElements) {
        return this._super(invalidElements);
    }
});
