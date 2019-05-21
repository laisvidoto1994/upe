/*
*   Name: BizAgi Desktop Panel Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to desktop devices
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
            type: 'grid',
            xpath: 'searchForm' + properties.id,
            id: properties.id,
            skipInitialLoad: true,
            rowsPerPage: 10,
            inlineAdd: false,
            allowDelete: false,
            allowAdd: false,
            sortBy: properties.sortBy,
            sortOrder: properties.sortOrder,
            overrideGetRemoteData: function (params) {
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
            //TODO insert dataType and TextFormat properties
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
            //if column is number or monetary push allowDecimals property
            if (columns[i].dataType == 7 || columns[i].dataType == 8) {
                column.render.properties.allowDecimals = columns[i].allowDecimals;
            }

            //if column is real or float set allowDecimals property to true
            if (columns[i].dataType == 10 || columns[i].dataType == 11) column.render.properties.allowDecimals = true;

            //if column is date push showtime property
            if (columns[i].dataType == 12) {
                column.render.properties.showTime = columns[i].showTime;
            }
            
            data.elements.push(column);
        });

        var grid = self.renderFactory.getRender({
            type: "grid",
            data: data,
            parent: self,
            mode: self.getMode(),
            jqgrid: false
        });

        // Saves reference
        self.resultsGrid = grid;

        return grid.render();
    },

    /*
    *   Template method to process each jquery object
    *   must be overriden in each container
    */
    postRenderContainer: function (container) {
        var self = this;
        var properties = self.properties;
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
            if (self.properties.searchParams.hasOwnProperty('multiSelect')) {
                self.trigger("multiSelect", ui);
            } else {
                // Trigger event to bubble up to main container
                self.trigger("instanceSelected", ui);
            }
        });

        return self;
    },

    /*
    *   Refresh the result panel, making it to query data with current criteria
    */
    refreshResults: function () {
        var self = this;
        var resultsGrid = self.resultsGrid;

        // Makes the grid to refresh
        resultsGrid.refresh();
        $.when(resultsGrid.dataReady())
        .done(function () {

            // Shows result container
            self.resultsContainer.show();

            self.resizeResults();
        });
    },

    /* 
    *   Resizes the container to adjust it to the container
    */
    resize: function (size) {
        var self = this;

        // Resize results
        self.resizeResults();
    },

    /* 
    Resizes the container to split the view
    */
    resizeResults: function () {
        var self = this;
        var resultsGrid = self.resultsGrid;

        if (self.resultsContainer.is(':visible')) {
            self.criteriaContainer.height("auto");

        } else {
            self.criteriaContainer.height("100%");
        }

        // Resize grid results
        resultsGrid.resize({
            width: self.criteriaContainer.width(),
            onSearchFinished: function () {
                var self = this;
                if (self.properties)
                    if (self.properties.records == 0) {
                        $(".ui-bizagi-container-search-results", self.container).show();
                        $(".ui-bizagi-container-search-results .ui-jqgrid-title", self.container).hide();
                    } else {
                        $(".ui-bizagi-container-search-results .ui-jqgrid-title", self.container).show();
                    }
            }
        });
    }
});