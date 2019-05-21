/*
*   Name: BizAgi Form Modeler Grid Column Editor Handlers
*   Author: Diego Parra
*   Comments:
*   -   This script will handler modeler view search result editor drawing and handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Draws the search result editor
    */
    drawSearchResultEditor: function () {
        var self = this;
        $.when(self.executeCommand({ command: "getSearchResultModel" }))
            .done(function (searchResultModel) {
                // Create search result canvas
                var canvas = self.createSearchResultCanvas();

                // Create editor
                var presenter = self.searchresulteditor = new bizagi.editor.component.searchresulteditor.presenter({
                    searchResultModel: searchResultModel,
                    canvas: canvas
                });

                // Render the component
                presenter.render();

                // Define handlers
                presenter.subscribe("moveColumn", function (e, args) { self.onMoveColumn(args); });
                presenter.subscribe("insertXpath", function (e, args) { self.onInsertXpath(args); });
                presenter.subscribe("selectColumn", function (e, args) { self.onSelectColumn(args); });
                presenter.subscribe("unSelectColumn", function (e, args) { self.onUnSelectColumn(args); });

            });
    },

    /*
    *   Creates a canvas for search result editor
    */
    createSearchResultCanvas: function () {
        var self = this;
        return $("#search-result-panel .bz-fm-searchresult-content", self.mainContainer);
    },

    /*
    *   Refresh the search result editor
    */
    refreshSearchFormResult: function () {
        var self = this;
        var presenter = self.searchresulteditor;

        if (presenter) {
            $.when(self.executeCommand({ command: "getSearchResultModel" }))
                .done(function (searchResultModel) {
                    presenter.refresh({ searchResultModel: searchResultModel, currentSelectElement: self.currentSelectedElement });
                });
        }
    },

    /*
    *   Reacts to insert xpath event
    */
    onInsertXpath: function (args) {
        var self = this;
        var data = args.data;
        var command = {
            command: "insertElementFromXpathNavigator",
            data: {
                renderType: data.renderType,
                name: data.displayName,
                displayName: data.displayName,
                xpath: bizagi.editor.utilities.buildComplexXpath(data.xpath, data.contextScope, data.isScopeAttribute, data.guidRelatedEntity)
            },
            position: args.position,
            searchformresult: true
        };

        // Executes the command and refreshes the view
        self.executeCommand(command);
    },

    /*
    *   Reacts to column swapping
    */
    onMoveColumn: function (args) {
        var self = this;
        var command = {
            command: "moveElement",
            initialPosition: args.initialPosition,
            finalPosition: args.finalPosition,
            elementType: "searchresult"
        };

        // Executes the command and refreshes the view
        self.executeCommand(command);
    },

    /*
    *   Reacts to column selection
    */
    onSelectColumn: function (args) {
        // Perform element selection
        var self = this,
            properties = self.executeCommand({ command: "getElementProperties", guid: args.guid });

        // hide property box and refresh ribbon with the new element
        self.hidePropertyBox();
        self.refreshRibbon(args.guid);

        self.currentSelectedElement = args.guid;

        // Draw decorator and show element xpath in navigator
        self.drawDecorator($.extend(args, { IsOnClickEvent: true }), true);
        self.showElementXpath(properties.xpath);
    },

    /*
    * Reacts to column unselection
    */
    onUnSelectColumn: function () {
        var self = this;

        self.currentSelectedElement = null;
        
        // Remove decorator and decorator
        self.hidePropertyBox();
        self.removeDecorator();
    }
})
