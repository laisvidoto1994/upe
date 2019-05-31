/*
@title: Search Result Edition Component
@authors: Diego Parra 
@date: 17-ago-12
*/

bizagi.editor.component.controller("bizagi.editor.component.searchresulteditor", {
    /*
    *   Constructor
    */
    init: function (canvas, params) {
        params = params || {};

        // Call super
        this._super(canvas);

        // Set up the variables
        this.model = params.model;
        this.canvas = canvas;
        this.presenter = params.presenter;
        this.options = params.options;
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {
        // Define mapping
        var templateMap = {
            "searchresulteditor": (bizagi.getTemplate("bizagi.editor.component.searchresulteditor") + "#searchresulteditor-container")
        };

        // Fetch templates
        return this._super(templateMap);
    },

    /*
    *   Refresh the view
    */
    refresh: function (options) {
        this.render(options);
    },

    /*
    *   Renders the view
    */
    render: function (params) {
        var self = this;
        params = params || {};

        // Check options
        self.options = $.extend(self.options, params.options);

        // Update model if a new search result model has been supplied
        if (params.searchResultModel) self.model.update(params.searchResultModel);

        // Clear container 
        self.canvas.empty();

        // Load templates and then render
        $.when(self.loadTemplates())
        .done(function () {
            // Render grid
            var grid = self.renderGrid();

            if (grid.children().length === 0) {
                grid.addClass('children');
            }

            grid.appendTo(self.canvas);

            if (params.currentSelectElement) {
                self.selectColumnByGuid(params.currentSelectElement);
            }

        });
    },

    /*
    *   Render the grid 
    */
    renderGrid: function () {
        var self = this,
            grid;

        // Render grid from template
        grid = self.grid = $.tmpl(self.getTemplate("searchresulteditor"), self.model.getViewModel());

        // Apply tooltip plugin
        $('[title]', grid).tooltip();

        // Append to canvas
        grid.appendTo(self.canvas);

        // Make the grid sortable
        self.addGridSortBehaviour(grid);
        return grid;
    },

    /*
    *   Adds the sortable behaviour to the grid
    */
    addGridSortBehaviour: function (container) {
        var self = this;

        // Execute plugin
        container.sortable({
            items: ".ui-bizagi-draggable-item",
            revert: true,
            connectWith: ".ui-bizagi-container-connectedSortable",
            distance: 10,
            cursorAt: { top: -3, left: 0 },
            placeholder: "bz-fm-searchresult-placeholder",
            delay: 150,
            helper: "clone"
        });

        // Disabel selection for this container
        container.disableSelection();

        // Add sort handlers
        container.bind("sortstart", function (e, ui) { self.onSortStart(ui); });
        container.bind("sortactivate", function (e, ui) { self.onSortActivate(ui); });
        container.bind("sortstop", function (e, ui) { self.onSortStop(ui); });
    },

    /*
    *   Reacts to sort start event
    */
    onSortStart: function (ui) {
        var self = this;
        var index = $(ui.item).parent().children(".ui-bizagi-itemfordrag").index(ui.item);
        self.initialPosition = index;
    },

    /*
    *   Reacts to sort activate event
    */
    onSortActivate: function (ui) {
        var self = this;

        if ($(ui.item).hasClass("bizagi_editor_xpathnavigator_data")) {
            self.sourceData = $(ui.item).data();
            self.source = "xpathNavigator";

        } else {
            self.source = "searchResultEditor";
        }
    },


    /*
    *   Reacts to sort stop event
    */
    onSortStop: function (ui) {
        var self = this,
            initialPosition = self.initialPosition,
            source = self.source,
            sourceData = self.sourceData;

        var finalPosition = $(ui.item).parent().children(".ui-bizagi-itemfordrag").not(".ui-sortable-placeholder").index(ui.item);
        self.finalPosition = finalPosition;

        if (source == "searchResultEditor") {
            // Move a column
            self.presenter.publish("moveColumn", { data: sourceData, initialPosition: initialPosition, finalPosition: finalPosition });

        } else if (source == "xpathNavigator") {
            // Drag from xpath navigator
            self.presenter.publish("insertXpath", { data: sourceData, position: finalPosition });
        }
    },

    /*
    *   Selects a column in the editor
    */
    selectColumn: function (element) {
        var self = this;
        var offset = element.offset();

        // Publihs an event so the modeler can react to
        self.presenter.publish("selectColumn", {
            position: {
                top: offset.top,
                left: offset.left,
                width: element.outerWidth(),
                height: element.outerHeight()
            },
            element: element,
            guid: element.data("id")
        });
    },

    /*
    * Unselects a column in the editor
    */
    unSelectColumn: function () {
        var self = this;

        //Publish an event so the modeler can reac to
        self.presenter.publish("unSelectColumn", {});

    },

    /*
    *   Selects a column in the editor
    */
    selectColumnByGuid: function (currentSelectElement) {
        var self = this;

        var selected = $('.bz-searchresult-column[data-id = "' + currentSelectElement + '"]', self.canvas);
        if (selected.length > 0) {
            var element = $(selected[0]);
            element.toggleClass("ui-state-active");
            self.selectColumn(element);
        }
    },

    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/

    ".bz-searchresult-column click": function (element) {
        var self = this;

        // Highlight element
        $("#bz-fm-searchresult-editor > .bz-searchresult-column").not(element).removeClass("ui-state-active");
        element.toggleClass("ui-state-active");

        if (element.hasClass("ui-state-active")) {
            // Selects the column in the component
            self.selectColumn(element);
        } else {
            // Unselect the column in the component
            self.unSelectColumn(element);
        }
    }
});