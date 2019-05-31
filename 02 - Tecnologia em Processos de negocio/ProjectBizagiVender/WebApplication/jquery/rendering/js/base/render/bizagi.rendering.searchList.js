/*
*   Name: BizAgi Render Search List Control
*   Author: Edward Morales
*/

bizagi.rendering.render.extend("bizagi.rendering.searchList", {}, {
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
        properties.maxRecords = Number(properties.maxRecords) || 20;
        properties.advancedSearch = bizagi.util.parseBoolean(properties.advancedSearch) || false;
        properties.allowSuggest = bizagi.util.parseBoolean(properties.allowSuggest) !== null ? bizagi.util.parseBoolean(properties.allowSuggest) : false;
        properties.allowFullSearch = properties.allowFullSearch || false;
        properties.allowAdd = bizagi.util.parseBoolean(properties.allowAdd) || false;
        properties.allowTyping = bizagi.util.parseBoolean(properties.allowTyping) !== null ? bizagi.util.parseBoolean(properties.allowTyping) : true;
        properties.allowClear = bizagi.util.parseBoolean(properties.allowClear) !== null ? bizagi.util.parseBoolean(properties.allowClear) : false;

        // Set value
        self.setValue(properties.value);
    },

    /*
    *   Template method to implement in each children to customize each control
    */
    renderControl: function () {
        var self = this;
        var properties = self.properties;
        var template = self.renderFactory.getTemplate("searchList");

        return $.fasttmpl(template, {
            id: properties.id,
            xpath: properties.xpath,
            allowTyping: properties.allowTyping,
            value: properties.value,
            hasSearchForm: (properties.searchForms) ? true : false,
            editable: true
        });
    },

    /*
    *   Sets the internal value
    */
    setValue: function (value) {
        var self = this;

        this.value = JSON.encode({
            "value": value
        });

        self.triggerRenderChange();
    },

    /*
    * Add elements to global value
    * @param value = { id:integer,value:[string || array ] }
    */
    addElement: function (value) {
        var list = JSON.parse(this.value);
        list.value.push(value);
        this.setValue(list.value);
    },

    /*
    * Remove elements to global value
    * @param value = { id:integer }
    */
    removeElement: function (value) {
        var list = JSON.parse(this.value);
        var result = [];
        $.each(list.value, function (key, val) {
            if (val.id != value.id) {
                result.push({
                    id: val.id,
                    value: val.value
                });
            }
        });
        this.setValue(result);
    },

    /*
     * Remove last element to global value
     */
    removeLastElement: function () {
        var list = JSON.parse(this.value);
        if (list.value.length > 0){
            list.value.pop();
            this.setValue(list.value);
        }
    },

    /*
    *   Fetch the data into a deferred
    */
    getData: function (params) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();

        // Resolve with remote data
        self.dataService.getSearchData({
            url: properties.dataUrl,
            xpath: properties.xpath,
            idRender: properties.id,
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            term: properties.term,
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
        return defer.promise();
    },

    /*
    *   Submits the selected data to the server in order to be saved
    */
    submitData: function () {
        var self = this;
        var properties = self.properties;

        // Add current data
        var data = {};
        data[properties.xpath] = self.getValue();

        // Executes submit on change
        self.submitOnChange(data);
    },

    /* 
    *  Method to determine if the render value can be sent to the server or not
    */
    canBeSent: function () {
        return true;
    }

});
