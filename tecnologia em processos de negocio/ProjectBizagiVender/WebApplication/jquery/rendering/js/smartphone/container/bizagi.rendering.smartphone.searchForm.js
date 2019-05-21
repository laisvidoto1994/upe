/*
*   Name: BizAgi Smartphone Search Form Extension
*   Author: Oscar O
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
            type: 'grid',
            xpath: 'searchForm' + properties.id,
            id: properties.id,
            skipInitialLoad: true,
            rowsPerPage: 10,
            overrideGetRemoteData: function (params) { return self.getRemoteData(params); }
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

            data.elements.push(column);
        });

        var grid = self.renderFactory.getRender({
            type: "grid",
            data: data,
            parent: self,
            mode: self.getMode()
        });


        grid.properties.allowAdd = false;
        grid.properties.allowEdit = false;
        grid.properties.allowDelete = false;
        // Saves reference
        self.resultsGrid = grid;

        return grid.render();
    },

    /*
    *   Template method to implement in each device to customize each container after processed
    */
    postRenderContainer: function (container) {

        var self = this;
        self._super(container);

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
    },


    /*
    *   Refresh the result panel, making it to query data with current criteria
    */
    refreshResults: function () {
        var self = this;
        self.trigger("instancerefresh");
        $.when(self.resultsGrid.refresh()).done(function () {
            self.trigger("instancerefreshdone");
            if (self.resultsGrid.properties.data && self.resultsGrid.properties.data.records == 0 && self.resultsGrid.properties.data.rows.length == 0) {
                alert(bizagi.localization.getResource("workportal-menu-search-found-no-cases"));
            }
        });
    }

});
