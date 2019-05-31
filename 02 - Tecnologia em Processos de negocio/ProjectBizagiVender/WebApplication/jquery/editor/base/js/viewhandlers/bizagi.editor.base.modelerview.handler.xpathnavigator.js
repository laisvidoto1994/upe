/*
*   Name: BizAgi Form Modeler View Xpath Handlers
*   Author: Diego Parra
*   Comments:
*   -   This script will handler modeler view xpath navigator handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Draws the xpath navigator component in the layout
    */
    drawXpathNavigator: function () {
        var self = this;

        // Define canvas
        var canvas = $("<div />")
            .addClass("bizagi_editor_xpathnavigator_container")
            .appendTo(self.mainContainer.find("#left-tab-data-bind"));

        // Define model
        $.when(self.executeCommand({ command: "getXpathNavigatorModel" }), self.controller.getContext())
        .pipe(function (model, context) {

            self.xpathNavigatorModel = model;
            var presenter = self.xpathNavigator = new bizagi.editor.component.xpathnavigator.presenter({ canvas: canvas, model: model, scope: context });

            if (self.controller.isGridContext()) { self.controller.setXpathNavigatorModelGrid(model); }

            self.attachHandlersXpathNavigator();

            // Render and return 
            return presenter.render({
                isReadOnly: self.controller.isReadOnlyForm(),
                scope: self.controller.getContext()
            });
        });
    },


    /*
    * This method attachs handlers to events related with the editor
    */
    attachHandlersXpathNavigator: function () {
        var self = this;
        var presenter = self.xpathNavigator;

        if (!self.controller.isReadOnlyForm()) {
            // Define handlers            
            presenter.subscribe("nodeDoubleClick", function (e, args) { self.onNodeDoubleClick(args); });
            presenter.subscribe("contextMenuItemClick", function (e, args) { self.onContextMenuItemClick(args); });
            presenter.subscribe("controlRefreshCanvas", function (e, args) { self.refreshCanvas(args); });
        }
    },

    /*
    *   Locate the given xpath in the navigator.
    */
    showElementXpath: function (xpath) {
        var self = this;

        if (xpath) { self.changeXpathNavigatorView(bizagi.clone(xpath)); }
        return self.xpathNavigator.showXpath(xpath);
    },

    /*
    * Locate the nested form guid given in the navigator
    */
    showElementGuid: function (form, xpath) {
        var self = this;

        if (xpath) { self.changeXpathNavigatorView(bizagi.clone(xpath)); }
        self.xpathNavigator.showXpathByGuid(form, xpath);
    },

    /*
    * Locate the metadata xpath given in the navigator
    */
    showMetadataXpath: function (xpath) {
        var self = this;

        return self.xpathNavigator.showMetadataXpath(xpath);
    },

    /*
    *  Checks if is necessary change the current view in the xpath navigator component
    */
    changeXpathNavigatorView: function (xpath) {
        var self = this;

        // Only apply in form context
        if (self.controller.isGridContext()) { return false; }
        if (self.controller.getContext() == 'template') { return false; }

        xpath = bizagi.editor.utilities.resolveComplexXpath(xpath);
        if (xpath) {
            xpath = xpath.split(".")[0];
            if (!self.xpathNavigatorModel.processEntityRelated(xpath) &&
                self.controller.getXpathNavigatorView() === bizagi.editor.component.xpathnavigator.model.view["onlyProcessEntity"]) {
                self.performViewAll(self.xpathNavigatorModel.getRootNode());
                return true;
            }
        }
        return false;
    },

    /*
    *   Change xpath navigator tree when the context has been changed
    */
    refreshXpathNavigator: function (params) {
        var self = this;

        // Fetch the model
        $.when(self.executeCommand({ command: "getXpathNavigatorModel" }))
        .done(function (model) {

            if (self.controller.isGridContext()) { self.controller.setXpathNavigatorModelGrid(model); }


            var options = {
                model: (params && params.model) || model,
                context: params ? params.context : undefined,
                scope: self.controller.getContext(),
                isReadOnly: self.controller.isReadOnlyForm()
            };
            self.xpathNavigator.render(options);
        });
    },

    /*
    *   Reload the node selected in xpath navigator
    */
    reloadXpathNode: function (node) {
        var self = this;

        if (node) {

            // Fetch the model
            $.when(self.controller.getXpathNavigatorModel())
                .done(function (xpathModel) {
                    if (xpathModel) {
                        $.when(xpathModel.getChildren(node.id, true))
                            .done(function () {
                                self.refreshXpathNavigator();
                            });
                    }
                });
        }
    },

    /*
    *   Adds a xpath navigator element to the model
    */
    insertXpathElement: function (node) {
        var self = this;
        var command = {
            command: "insertElementFromXpathNavigator",
            data: {
                renderType: node.renderType,
                nodeSubtype: node.nodeSubtype,
                name: node.displayName,
                xpath: bizagi.editor.utilities.buildComplexXpath(node.xpath, node.contextScope, node.isScopeAttribute, node.guidRelatedEntity),
                guid: node.guid
            }
        };

        if (node.renderType.indexOf("adhoc") !== -1) {
            command.data.context = node.renderType.indexOf("adhoccolumn") !== -1 ? "adhocgrid" : "adhocform";
            command.data.displayName = node.displayName;
            if (node.parent) command.data.parent = { guidRelatedEntity: node.parent.guidRelatedEntity };
            if (node.guidRelatedEntity) {
                command.data.guidRelatedEntity = node.guidRelatedEntity;
                command.data.entityContext = node.entityContext;
                if (node.predefinedValues) {
                    command.data.predefinedValues = node.predefinedValues;
                }
            }
        }

        // Executes the command and refreshes the view
        return self.executeCommand(command);
    },

    /*
    *   Process node double click
    */
    onNodeDoubleClick: function (args) {
        var self = this;

        if (!self.controller.isTemplateContext()) {
            self.insertXpathElement(args);
        }
    },

    /*
    *   Process context menu node clicks
    */
    onContextMenuItemClick: function (args) {
        var self = this;
        var action = args.action;

        // Execute actions
        if (action == "editentity") self.performEditEntity(args.node);
        if (action == "viewall") self.performViewAll(args.node);
        if (action == "refresh") self.performRefresh(args.node);
        if (action == "addelement") self.performAddElement(args.node);
        if (action == "addchildelements") self.performAddChildElements(args.node);
        if (action == "editvalues") self.performEditValues(args.node);
        if (action == "newForm") self.performNewForm(args.node);
    },

    /*
    *   Show entity edition form in BAS
    */
    performEditEntity: function (node) {
        var self = this;

        // Create protocol
        var editEntityProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "editentity", id: node.guidRelatedEntity });

        // Execute protocol
        $.when(editEntityProtocol.processRequest())
        .done(function () {
            self.reloadXpathNode(node);
        });
    },

    /*
    *   Shows all entities besides process entity
    */
    performViewAll: function (node) {
        var self = this;

        // Changes caption item
        node.setCaptionViewContextMenu();
        $.when(self.executeCommand({ command: "getXpathNavigatorModel", toogleView: true }))
            .done(function (model) {
                self.xpathNavigator.render({ model: model, scope: self.controller.getContext() });
            });

    },

    performRefresh: function (node) {
        //TODO: Implement here
        this.reloadXpathNode(node);
    },

    performAddElement: function (node) {
        this.insertXpathElement(node);
    },

    performAddChildElements: function (node) {
        var self = this;

        self.executeCommand({ command: "addEntityChildren", node: node });
        
    },

    /*
    *   Show entity edition form in BAS
    */
    performEditValues: function (node) {
        var self = this;

        // Create protocol
        var editEntityvaluesProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "editentityvalues", id: node.guidRelatedEntity });

        // Execute protocol
        $.when(editEntityvaluesProtocol.processRequest())
        .done(function () {

        });
    },

    performNewForm: function (node) {

        // Create protocol
        var newFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "newform", node: node });

        // Execute protocol
        $.when(newFormProtocol.processRequest())
        .done(function () {

        });

    }
});