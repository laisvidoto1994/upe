/*
*   Name: BizAgi Desktop querySuggest
*   Author: Ivan Ricardo Taimal Narvaez
*   Comments:querySuggest
*   -
*/

bizagi.rendering.search.extend("bizagi.rendering.querySuggest", {}, {
//h_contexttype:metadata

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
            contexttype:'metadata',
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
            self.setDisplayValue("");
        });

        return searchItem;
    }
});

