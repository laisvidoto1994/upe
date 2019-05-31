/*
*   Name: BizAgi Tablet Search Form Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to tablet devices
*/

// Auto extend
bizagi.rendering.searchForm.extend("bizagi.rendering.searchForm", {}, {
    /*
    *   Render the results of the query
    *   Resolved in each device
    */
    renderResult: function () {
        var self = this;
        var properties = self.properties;

        // Creates grid definition
        var data = {};
        data.properties = {
            displayName: self.getResource("render-search-advanced-results-label"),
            type: "grid",
            visible: false,
            xpath: "searchForm" + properties.id,
            id: properties.id,
            skipInitialLoad: true,
            rowsPerPage: 10,
            overrideGetRemoteData: function(params) {
                return self.getRemoteData(params);
            }
        };

        data.elements = [];

        // Creates columns
        var columns = properties.columns;
        $.each(columns, function (i) {
            var column = {
                render: {}
            };

            column.render.properties = {
                displayName: columns[i].caption,
                xpath: columns[i].xpath,
                editable: false
            };

            $.extend(column.render.properties, self.parseAdditionalProperties(columns[i].dataType));
            // Next conditional added to print only columns and not labels
            // if type = label then column is not rendered on the results table
            if (columns[i].dataType == 0) {
                column.render.properties.columnVisible = false;
            }
            data.elements.push(column);
        });

        var grid = self.renderFactory.getRender({
            type: "grid",
            data: data,
            parent: self,
            mode: self.getMode()
        });

        // Saves reference
        self.resultsGrid = grid;
        grid.properties.allowAdd = false;
        grid.properties.allowDelete = false;
        grid.properties.allowEdit = false;
        grid.properties.inlineAdd = false;

        return grid.render();
    },

    /*
    *   Template method to implement in each device to customize each container after processed
    */
    postRenderContainer: function (container) {
        var self = this;        
        var searchCriteria = container.find(".ui-bizagi-container-search-criteria");
        var results = container.find(".ui-bizagi-container-search-results");
        var childrenElements = searchCriteria.children();
        var mode = self.getMode();

        // Process children elements
        self.container = container;
        $.each(childrenElements, function (i, childElement) {
            childElement = $(childElement);
            var id = Number(childElement.data("unique-id"));
            if (id) {
                var child = self.childrenHash[id];
                if (child) {
                    var type = child.getElementType();
                    if (type == bizagi.rendering.element.ELEMENT_TYPE_RENDER) child.postRenderElement(childElement);
                    if (type == bizagi.rendering.element.ELEMENT_TYPE_CONTAINER) child.postRenderContainer(childElement);
                }
            }
        });

        // Process result
        var grid = $(results.children()[0]);
        self.resultsGrid.postRenderElement(grid);

        if (mode == "execution") {
            // Apply handlers
            self.configureHandlers();
        }
        if (mode == "design") {
            // Configure view
            self.configureDesignView();
        }
        if (mode == "layout") {
            // Configure view
            self.configureDesignView();
            self.configureLayoutView();
        }

    },


    /*
    *   Template method to implement in each device to customize the container's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;

        // Saves reference
        self.criteriaContainer = $(".ui-bizagi-container-search-criteria", self.container);
        self.resultsContainer = $(".ui-bizagi-container-search-results", self.container);

        // Bind to grid row select event
        self.resultsGrid.bind("rowSelected", function (e, ui) {
            if (self.properties.searchParams.hasOwnProperty("multiSelect")) {
                self.trigger("multiSelect", ui);
            } else {
                // Trigger event to bubble up to main container
                self.trigger("instanceSelected", ui);
            }
        });
    },

    /*
    *   Refresh the result panel, making it to query data with current criteria
    */
    refreshResults: function () {
        var self = this;

        self.trigger("instancerefresh");
        self.resultsGrid.refresh();
    },

    /*
    * Method added for IPAD version. Before showing search results form
    */
    onSearchFinished: function() {
        var self = this;

        if (!self.properties.deviceMaxRecordsExceeded) {

            // Next line returns visibility with the results of the search
            self.resultsGrid.changeVisibility(true);

            var self = this;
            if (self.properties)
                if (self.properties.records == 0) {
                    $(".ui-bizagi-container-search-results .ui-bizagi-label", self.container).hide();
                } else {
                    $(".ui-bizagi-container-search-results .ui-bizagi-label", self.container).show();
                }
        }
    }

});
