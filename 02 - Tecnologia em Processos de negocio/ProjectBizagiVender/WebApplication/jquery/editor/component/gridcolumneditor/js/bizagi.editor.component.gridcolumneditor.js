/*
@title: Grid Edition Component
@authors: Alexander Mejia, Diego Parra (refactor)
@date: 03-jul-12
*/

bizagi.editor.component.controller("bizagi.editor.component.gridcolumneditor", {
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
        this.renderArea = params.renderArea;
        this.presenter = params.presenter;
        this.options = params.options;
    },

    /*
    *   Load all needed templates
    */
    loadTemplates: function () {
        // Define mapping
        var templateMap = {
            "gridcolumneditor": (bizagi.getTemplate("bizagi.editor.component.gridcolumneditor") + "#gridcolumneditor-container")
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

        // Update model if a new grid model has been supplied
        if (params.gridModel) {
            self.model.update(params.gridModel);
        }

        // Create overlay
        self.createOverlay();



        // Load templates and then render
        $.when(self.loadTemplates())
        .done(function () {
            // Clear container 
            self.canvas.empty();
            // Render grid
            var grid = self.renderGrid();
            self.renderGridWidths(params.gridModel);
            self.activeState(params, grid);

        });
    },

    /*
    *   Removes and destroy the editor
    */
    destroy: function () {
        var self = this;
        self.overlay.detach();
        self.renderArea.removeClass("bz-edit-mode");

        // Trigger close
        self.presenter.publish("close");
        $(window).unbind("resize.grid");
    },

    /*
    *   Creates an overlay layer
    */
    createOverlay: function () {
        var self = this;
        if (self.overlay) return self.overlay;

        // Create overlay
        var overlay = self.overlay = $("<div />");
        overlay.addClass("bz-grid-columneditor-container-main");
        self.renderArea.addClass("bz-edit-mode");

        overlay.appendTo(self.renderArea);

        // Add current canvas to overlay
        self.canvas.appendTo(overlay);
        return overlay;
    },

    /*
    *   Render the grid 
    */
    renderGrid: function () {
        var self = this,
            grid,
            gridModel;

        // Render grid from template
        gridModel = self.model.getViewModel();


        grid = self.grid = $.tmpl(self.getTemplate("gridcolumneditor"), gridModel);
        grid.offset({ top: self.options.top, left: self.options.left });
        grid.height(self.options.height);
        grid.width(self.options.width);

        grid.attr('difWindow', $(window).width() - (grid.position().left + grid.width()));

        $(window).bind("resize.grid", function() {
            grid.width($(window).width() - grid.attr('difWindow'));
        });

        // Append to canvas
        grid.appendTo(self.canvas);

        if (gridModel.columns.length === 0) {
            grid.addClass('ui-drop-here-layout');
        } else {
            grid.removeClass('ui-double-drop-here-layout');
        }

        grid.find(".ui-icon").css("background-image", "url('')");
        grid.find(".bz-grid-column").css("height", "50px");

        // Make the grid sortable
        self.addGridSortBehaviour(grid);
        return grid;
    },

    /*
    * set width columns
    */
    renderGridWidths: function () {
        var self = this;
        var model = self.model.model;

        $.each($(".bz-grid-column", self.grid), function (key, val) {
            var element = model.columns[key];

            if (element.columnwidth) {
                var width = element.columnwidth;
                var widthValue = parseInt(width).toString();
                var measureType = width.substring(widthValue.length, width.length);

                $(val).css("width", widthValue + measureType);

                if (measureType != "%") {
                    $(val).find("span").css("width", widthValue + measureType);
                }
            } else {
                $(val).css("width", "auto");
            }
        })
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
            distance: 1,
            cursorAt: { top: -3, left: 0 },
            placeholder: "bz-fm-grid-columneditor-placeholder-custom",
            delay: 0,
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
    * 
    */
    activeState: function (params, grid) {
        var self = this;

        var guidSelected = params.guidSelected;

        if ($.isArray(guidSelected) && guidSelected.length > 0) {

            for (var i = 0, l = guidSelected.length; i < l; i++) {
                $('div[data-id="' + guidSelected[i] + '"]', grid).addClass("ui-state-active");
            }
            // 
            self.presenter.publish("processSelectedColumns", { refresh: true });
        }
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

        if ($(ui.item).hasClass("mtool-item")) {
            self.sourceData = $(ui.item).data("render");
            self.source = "controlsNavigator";

        } else if ($(ui.item).hasClass("bizagi_editor_xpathnavigator_data")) {
            self.sourceData = $(ui.item).data();
            self.source = "xpathNavigator";

        } else {
            self.source = "gridColumnEditor";
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

        if (source == "gridColumnEditor") {
            // Move a column
            self.model.moveColumn(initialPosition, finalPosition);
            self.presenter.publish("moveColumn", { guid: self.model.getGuid(), data: sourceData, initialPosition: initialPosition, finalPosition: finalPosition });

        } else if (source == "controlsNavigator") {
            // Drag from controls navigator
            self.model.insertControlColumn(finalPosition, sourceData);
            self.presenter.publish("insertControl", { guid: self.model.getGuid(), data: sourceData, position: finalPosition });

        } else if (source == "xpathNavigator") {
            // Drag from xpath navigator
            self.model.insertXpathColumn(finalPosition, sourceData);
            self.presenter.publish("insertXpath", { guid: self.model.getGuid(), data: sourceData, position: finalPosition });
        }

        // Refresh view
        self.refresh();
    },

    /*
    *   Selects a column in the editor
    */
    selectColumn: function (element, ctrlIsPressed) {
        var self = this;
        var offset = element.offset();
        var options = {
            position: {
                top: offset.top,
                left: offset.left,
                width: element.outerWidth(),
                height: element.outerHeight()
            },
            element: element,
            guid: element.data("id"),
            type: "column",
            grid: self.model.guid
        };

        if (ctrlIsPressed !== undefined) {
            $.extend(options, { ctrlIsPressed: true });
        }


        self.presenter.publish("updateDesignAttributesColumn", {
            guid: element.data("id"),
            property: "columnwidth",
            attributes: {
                isWidthColumnEditable: self.model.isWidthColumnEditable(element.data("id")),
                percentMaxWidth: self.model.getPercentMaxWidth(element.data("id"))
            }
        });

        // Publish an event so the modeler can react to
        self.presenter.publish("selectColumn", options);
    },

    /*
    *   Unselects a column in the editor
    */
    unselectColumn: function (params) {
        var self = this;

        // Publis an event so the modeler can react to
        self.presenter.publish("unselectColumn", params);
    },

    /*
    *   Shows a context menu for the column
    */
    showContextMenu: function (guid, position) {
        var self = this;
        var options = {
            position: position,
            guid: guid,
            type: "column",
            grid: self.model.guid
        };

        // Publis an event so the modeler can react to
        self.presenter.publish("showContextMenu", options);
    },

    /*************************************************************************************************** 
    *   EVENT HANDLERS
    *****************************************************************************************************/

    /*
    *   Handles ok button
    */
    ".biz-action-btn.biz-btn-ok click": function () {
        var self = this;

        self.presenter.publish("performValidationsInModel", { originalGridModel: self.model.originalModel, model: self.model.getViewModel() });

    },

    /*
    *   Handles cancel button
    */
    ".biz-action-btn.biz-btn-cancel click": function () {
        var self = this;

        self.presenter.publish("cancelChangesInModel", { gridModel: self.model.originalModel });
        self.destroy();
    },

    ".bz-grid-column click": function (element, ev) {
        var self = this;

        var isCtrlPressed = self.presenter.publish("checkCtrlKey", {});
        if (isCtrlPressed) {
            element.toggleClass("ui-state-active");

            if (element.hasClass("ui-state-active")) {
                // Selects the column in the component
                self.selectColumn(element, true);
            } else {
                self.unselectColumn({
                    guid: element.data("id"),
                    ctrlIsPressed: true
                });
            }
        } else {
            // Highlight element
            $("#bz-fm-grid-columneditor .bz-grid-column").not(element).removeClass("ui-state-active");
            element.toggleClass("ui-state-active");

            if (element.hasClass("ui-state-active")) {
                // Selects the column in the component
                self.selectColumn(element);
            } else {
                self.unselectColumn();
            }
        }
    },

    /*
    *   Right click for context menu
    */
    ".bz-grid-column mousedown": function (element, ev) {
        var self = this;
        if (ev.button == 2) {

            // Trigger element right click event
            self.showContextMenu(element.data("id"), { x: ev.clientX, y: ev.clientY });

            // Prevent default behaviour
            ev.preventDefault();
            ev.stopPropagation();
            return false;
        }

        return true;
    }
});