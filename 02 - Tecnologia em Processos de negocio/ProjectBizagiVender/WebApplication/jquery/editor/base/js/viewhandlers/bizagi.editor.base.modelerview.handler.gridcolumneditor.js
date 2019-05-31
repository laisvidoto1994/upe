/*
*   Name: BizAgi Form Modeler Grid Column Editor Handlers
*   Author: Diego Parra
*   Comments:
*   -   This script will handler modeler view grid column editor drawing and handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {

    mappingContext: {
        grid: "form",
        offlinegrid: "offlineform"
    }

}, {

    /*
    *   Draws the grid column editor
    */
    drawGridColumnEditor: function (params) {
        var self = this;
        var element = params.element;
        var renderArea = $("#main-panel");

        // Reset selected elements
        self.controller.removeSelectedElement();

        $.when(self.executeCommand({ command: "getGridColumnModel", guid: params.guid }))
            .done(function (gridModel) {

                var presenter = self.gridcolumneditor = new bizagi.editor.component.gridcolumneditor.presenter({
                    gridModel: gridModel,
                    guid: params.guid,
                    renderArea: renderArea
                });

                // Render the component
                var offset = element.offset();
                presenter.render({
                    options: {
                        top: offset.top,
                        left: offset.left,
                        height: element.outerHeight(),
                        width: element.outerWidth()
                    },
                    guidSelected: self.controller.getGuidsSelected()
                });

                // Define handlers
                presenter.subscribe("moveColumn", function (e, args) { self.onMoveGridColumn(args); });
                presenter.subscribe("insertControl", function (e, args) { self.onInsertControlColumn(args); });
                presenter.subscribe("insertXpath", function (e, args) { self.onInsertXpathColumn(args); });
                presenter.subscribe("selectColumn", function (e, args) { self.onSelectGridColumn(args); });
                presenter.subscribe("unselectColumn", function (e, args) { self.onUnselectGridColumn(args); });
                presenter.subscribe("showContextMenu", function (e, args) { self.onShowGridColumnContextMenu(args); });
                presenter.subscribe("performChangesInModel", function (e, args) { self.onPerformChangesInModel(args); });
                presenter.subscribe("performValidationsInModel", function (e, args) { self.onPerformValidationsInModel(args); });
                presenter.subscribe("cancelChangesInModel", function (e, args) { self.onCancelChangesInModel(args); });
                presenter.subscribe("checkCtrlKey", function (e, args) { return self.controller.isCtrlKeyPressed(); });
                presenter.subscribe("processSelectedColumns", function (e, args) { self.onProcessSelectedColumns(args); });
                presenter.subscribe("updateDesignAttributesColumn", function (e, args) { self.onUpdateDesignAttributesColumn(args); });
            });
    },

    /*
    *   Render the grid editor view
    */
    refreshGridColumnEditor: function () {
        var self = this;
        var presenter = self.gridcolumneditor;
        var guidSelected = self.controller.getGuidsSelected();

        if (presenter) {
            $.when(self.executeCommand({ command: "getGridColumnModel", guid: presenter.getGuid() }))
                .done(function (gridModel) {
                    presenter.refresh({ gridModel: gridModel, guidSelected: guidSelected });
                });

        }
    },

    /*
    *   Reacts to insert xpath event
    */
    onInsertXpathColumn: function (args) {
        var self = this;
        var data = args.data;
        var command = {
            command: "insertElementFromXpathNavigator",
            data: {
                context: data.context,
                renderType: data.renderType,
                nodeSubtype: data.nodeSubtype,
                name: data.displayName,
                xpath: bizagi.editor.utilities.buildComplexXpath(data.xpath, data.contextScope, data.isScopeAttribute, data.guidRelatedEntity)
            },
            position: args.position,
            parent: args.guid
        };

        if (data.renderType.indexOf("adhoccolumn") !== -1) {
            command.data.context = "adhocgrid";
            command.data.displayName = data.displayName;
            if (data.parent) command.data.parent = { guidRelatedEntity: data.parent.guidRelatedEntity };
            if (data.guidRelatedEntity) {
                command.data.guidRelatedEntity = data.guidRelatedEntity;
                command.data.entityContext = data.entityContext;
                if (data.predefinedValues) {
                    command.data.predefinedValues = data.predefinedValues;
                }
            }
        }

        // Executes the command and refreshes the view
        self.executeCommand(command);
    },

    /*
    *   Reacts to insert control event
    */
    onInsertControlColumn: function (args) {
        var self = this;
        var data = args.data;
        var command = {
            command: "insertElementFromControlsNavigator",
            data: {
                renderType: data.name,
                name: data.name,
                displayName: data.displayName && data.displayName.length > 0 ? data.displayName : data.name
            },
            position: args.position,
            parent: args.guid
        };

        // Executes the command and refreshes the view
        self.executeCommand(command);
    },

    /*
    *   Reacts to column swapping
    */
    onMoveGridColumn: function (args) {
        var self = this;
        var command = {
            command: "moveElement",
            initialPosition: args.initialPosition,
            finalPosition: args.finalPosition,
            parent: args.guid
        };

        // Executes the command and refreshes the view
        self.executeCommand(command);
    },

    /*
    *   Reacts to column selection
    */
    onSelectGridColumn: function (args) {

        // Perform element selection
        var self = this,
            properties = self.executeCommand({ command: "getElementProperties", guid: args.guid });

        // Remove selected element flag
        self.currentSelectedElement = args.guid;

        // for multiple selection
        if (args.ctrlIsPressed === undefined) {
            self.controller.removeSelectedElement();
        }

        self.controller.addSelectedElement(args.guid, args);


        $.when(self.showElementXpath(properties.xpath)).
        done(function () {
            self.onDrawComponents(args);
        });

    },

    /*
    *   Reacts to column right click to show context menu
    */
    onShowGridColumnContextMenu: function (args) {
        var self = this;

        //This feature is not enabled for multi-selection at the moment
        if (self.controller.thereAreMultiselection() && self.controller.getSelectedElements(args.guid)) { return; }

        var properties = self.executeCommand({ command: "getElementProperties", guid: args.guid });

        // Destroy the contextmenu if is created to avoid the duplication
        if (self.contextmenu) { self.contextmenu.destroy(); }

        $.when(self.showElementXpath(properties.xpath))
        .done(function () {
            // Draw a new context menu
            self.drawContextMenu({ guid: args.guid, position: args.position });
        });
    },

    /*
    *   Replaces current grid model with the original grid model
    */
    onCancelChangesInModel: function (args) {
        var self = this;

        // Revert changes in the model
        self.executeCommand({ command: "updateGridColumnModel", gridModel: args.gridModel, canUndo: false });

        // Change context in order to end edition
        self.executeCommand({ command: "changeContext", context: self.getContext() });

        self.currentSelectedElement = null;

        self.controller.removeSelectedElement();
    },

    /*
    *   Confirm changes in grid model
    */
    onPerformChangesInModel: function () {
        var self = this;

        // Since this model has already been replied in the form model we only need to change context
        self.executeCommand({ command: "changeContext", context: self.getContext() });
        self.currentSelectedElement = null;
        self.controller.removeSelectedElement();
    },

    /*
    *   Validate changes in grid model
    */
    onPerformValidationsInModel: function () {
        var self = this;

        self.currentSelectedElement = null;
        self.hidePropertyBox();

        self.onPerformChangesInModel();
        self.gridcolumneditor.destroy();
    },

    /*
    *   Activates when an column has been unselected
    */
    onUnselectGridColumn: function (args) {
        var self = this;

        // Remove selected element flag
        self.currentSelectedElement = null;

        if (args && args.ctrlIsPressed !== undefined) {
            self.controller.removeSelectedElement(args.guid);
        } else {
            self.controller.removeSelectedElement();
        }

        // hide property box and refresh ribbon with the new element
        self.hidePropertyBox();
        self.refreshRibbon();
        self.destroyDecorator();

        self.onProcessSelectedColumns(args);
    },

    /*
    * Draws Components in current selection 
    */
    onDrawComponents: function (args) {
        var self = this;

        if (self.controller.thereAreMultiselection()) {
            self.removeDecorator();
            self.drawPropertyBox({ guid: self.controller.getGuidsSelected() });
        }
        else {
            // hide property box and refresh ribbon with the new element
            self.hidePropertyBox();
            self.refreshRibbon(args.guid);
            // Draw decorator 
            self.drawDecorator($.extend(args, { IsOnClickEvent: true }));
        }
    },

    /*
    *  Check if there are elements selected
    */
    onProcessSelectedColumns: function (params) {
        var self = this;

        params = params || {};

        // If there are elements selected, then launch propertybox with ist dependencies
        var guidsSelected = self.controller.getGuidsSelected();

        if (guidsSelected.length === 1) {
            var args = self.controller.getSelectedElements(guidsSelected[0]);
            self.controller.removeSelectedElement();
            self.onSelectGridColumn($.extend({ IsOnClickEvent: true }, args));
        }
        else if (guidsSelected.length > 1) { self.onDrawComponents(params); }

    },

    /*
    *  Update attributes of an specific property
    */
    onUpdateDesignAttributesColumn: function (params) {
        var self = this;

        params.command = "changeDesignAttributes";
        self.executeCommand(params);
    },

    /*
    * Get the context to update
    */
    getContext: function () {
        var self = this;
        return self.controller.getOriginalContext();
    }

})
