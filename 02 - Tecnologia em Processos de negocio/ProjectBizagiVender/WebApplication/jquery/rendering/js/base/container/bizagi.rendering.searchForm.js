/*
*   Name: BizAgi Panel Container Class
*   Author: Diego Parra
*   Comments:
*   -   This script will define a panel container class for all devices
*/

bizagi.rendering.form.extend("bizagi.rendering.searchForm", {}, {

    /*
    *   Render the container layout
    */
    renderContainer: function () {
        var self = this;
        var properties = this.properties;
        var template = self.renderFactory.getTemplate("searchForm");


        if (properties.contexttype != "entity" && self.parent) {
            properties.contexttype = (typeof self.parent.getContextType == 'function') ? self.parent.getContextType() : "";
        } 

        // Render the panel
        var html = $.fasttmpl(template, {
            displayName: properties.displayName,
            uniqueId: properties.uniqueId
        });

        // Render children
        html = self.replaceChildrenHtml(html, self.renderChildrenHtml());

        // Render result
        html = html.replace("{{result}}", self.renderResult());

        return html;
    },

    /*
    *   Perform a search and render the results
    */
    performSearch: function (searchParams) {
        var self = this;
        var properties = self.properties;

        // Set parameter to search
        properties.searchParams = searchParams;

        // Submit the search to the server
        self.submitSearch();
    },

    /*
    *   Submits the query to the server
    */
    submitSearch: function () {
        var self = this;

        // Makes the results to update its contents
        self.refreshResults();
    },

    /*
    *   Returns a promise that will resolve when the element is ready
    */
    ready: function () {
        var self = this;
        return self.parent.ready();
    },

    /*
    *   Method to fill the result data
    *   (THIS IS CALLED WITHIN GRID RENDER SCOPE)
    */
    getRemoteData: function (params) {
        var self = this;
        var properties = self.properties;
        var defer = new $.Deferred();

        // Collect data
        var data = self.collectSearchValues();

        if (bizagi.util.isMapEmpty(data)) {
            bizagi.showMessageBox(this.getResource("render-search-advanced-no-filters"), this.getResource("render-form-dialog-box-search"), "error");
            return null;
        }

        params.rows = (properties.searchParams && properties.searchParams.maxRecords && properties.searchParams.maxRecords > 0) ? properties.searchParams.maxRecords : params.rows;

        // The Grid only support one row per page in smartphone (DRAGON-41733 / QAF-3916)         
        if (properties.searchParams && typeof(properties.searchParams.maxRows) !== "undefined") {
            params.rows = properties.searchParams.maxRows || params.rows;
        }

        // Resolve with remote data
        self.dataService.submitSearch($.extend(params, {
            url: properties.dataUrl,
            idRender: properties.idRender,
            idPageCache: properties.idPageCache,
            idSearchForm: properties.id,
            allowFullSearch: (properties.searchParams.allowFullSearch ? properties.searchParams.allowFullSearch : null),
            maxRecords: (properties.searchParams.maxRecords > 0 ? properties.searchParams.maxRecords : null),
            criteria: data

        })).done(function (response) {

            // Resolve with fetched data    
            properties.page = response.page;
            properties.records = response.records;
            properties.totalPages = response.totalPages || 0;

            //In tablets are allowed about 10000 records as maximum
            if (response.records > 10000) {
                properties.deviceMaxRecordsExceeded = true;
                response.deviceMaxRecordsExceeded = true;
            } else {
                delete properties.deviceMaxRecordsExceeded;
            }
            
            defer.resolve(response);

            // Call virtual method
            self.onSearchFinished();
        }).fail(function (errorObject) {
            bizagi.showErrorAlertDialog = false;
            if (errorObject.responseText) {
                try {
                    var message = JSON.parse(errorObject.responseText).message;
                    bizagi.showMessageBox(message, "", "error");
                } catch (e) { }
            }
            defer.reject();
        });

        return defer.promise();
    },

    /*
    *   Iterate through all the renders in the container and fills the hashtable
    *   - Overriden because server needs this in array
    */
    collectSearchValues: function () {
        var self = this;

        // Collect data
        var data = {};
        this.collectRenderValues(data);

        // Changes to array
        var submitArray = [];
        for (key in data) {
            var xpath = key;
            var value = data[key];
            var operation = self.getCriteriaOperation(self.getRender(xpath));
            var criteriaData = {};
            if (!bizagi.util.isEmpty(value)) {
                criteriaData["xpath"] = xpath;
                criteriaData["value"] = value;
                criteriaData["operation"] = operation;
                submitArray.push(criteriaData);
            }
        }

        return submitArray;
    },

    /*
    *   This method find out the criterial operation to be executed according to
    *   data type. Text renders use LIKE operation, but other data types such like
    *   numerics use exact match operatiors
    */
    getCriteriaOperation: function (render) {
        var self = this,
            properties = self.properties;

        var dataType = render.properties.dataType;
        var operation = "EQUALS";
        if (dataType == "15") {
            if (properties.allowFullSearch) {
                operation = "FULLLIKE";
            }
            else {
                operation = "LIKE";
            }
        }
        return operation;
    },

    /*
    *   Render the result controls for the query
    *   Resolved in each device
    */
    renderResult: function () { },

    /*
    *   Refresh the result panel, making it to query data with current criteria
    */
    refreshResults: function () { },

    /*
    *   Function to parse the dataType
    */
    parseAdditionalProperties: function (dataType) {

        // Number
        if (dataType == 1 || dataType == 2 || dataType == 3 ||
            dataType == 4 || dataType == 6 || dataType == 7 ||
            dataType == 10 || dataType == 11 ) {

            return { type: "columnNumber" };
        }


        // Oracle Number
        if (dataType == 29) {

            return { type: "columnNumberScientificNotation" };
        }

        // Money
        if (dataType == 8) {

            return { type: "columnMoney" };
        }

        // Date
        if (dataType == 12 || dataType == 13) {

            return { type: "columnDate" };
        }

        // Boolean
        if (dataType == 5) {

            return { type: "columnBoolean" };
        }

        // Text
        return { type: "columnText" };
    },

    /*
    *
    */
    onSearchFinished: function () {
        // Empty function, overrided for Tablet version for now
    }


});

