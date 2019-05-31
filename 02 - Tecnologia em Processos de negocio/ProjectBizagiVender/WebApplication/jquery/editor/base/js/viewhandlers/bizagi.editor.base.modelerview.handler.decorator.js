/*
*   Name: BizAgi Form Modeler View Decorator Handlers
*   Author: Alexander Mejia
*   Comments:
*   -   This script will handler modeler view decorator handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Draws the decorator component in the layout
    */
    drawDecorator: function (params) {
        var self = this,
            element = params.element;

        self.removeDecorator();

        // Define canvas
        var canvas = $("<div />")
            .appendTo(element);

        var model = self.executeCommand({ command: "getDecoratorModel", guid: params.guid });
        var presenter = self.decorator = new bizagi.editor.component.decorator.presenter({ canvas: canvas, data: params, model: model });

        // Define handlers
        presenter.subscribe("showProperties", function (e, args) { self.onShowProperties(args); });
        presenter.subscribe("showXpathNavigator", function (e, args) { self.onShowXpathNavigator(args); });
        presenter.subscribe("deleteElement", function (e, args) { self.onDeleteElement(args); });
        presenter.subscribe("openNestedForm", function (e, args) { self.onOpenNestedForm(args); });
        presenter.subscribe("buttonClicked", function (e, args) { self.onButtonClicked(args); });
        presenter.subscribe("close", function () {
            // Remove decorator
            canvas.detach();
        });

        // Render
        $.when(presenter.render())
        .done(function () {
            // if is a new selection
            if (params.IsOnClickEvent) {
                // Show properties
                self.drawPropertyBox({ guid: params.guid });
            }
        });
    },


    /*
    *   Destroys the current component
    */
    destroyDecorator: function () {
        var self = this;

        if (self.decorator) { self.decorator.destroy(); }
    },

    /*
    *  remove  
    */
    removeDecorator: function () {

        if ($(".bizagi_editor_component_decorator").length > 0) {
            $(".bizagi_editor_component_decorator").detach();
        }
    },

    /*
    *   Show the properties box in view 
    */
    onShowProperties: function (args) {
        var self = this;
        self.drawPropertyBox({ guid: args.guid });
    },

    /*
    *   Show the xpathnavigator at the specified position
    */
    onShowXpathNavigator: function (args) {
        var self = this;
        var properties = self.executeCommand({ command: "getElementProperties", guid: args.guid });
        var model = self.controller.model;
        var element = model.getElement(args.guid);
        var indexedProperties = element.propertyModel.indexedProperties || {};
        var indexXpath = indexedProperties['xpath'] || {};

        var filter = {};
        filter.typeFilter = indexXpath['bas-type'];
        
        var editorParameters = indexXpath['editor-parameters'] || {};
        if (editorParameters.types) {
            filter.types = editorParameters.types;
           
            // Add validation
            var options = {
                typeEditor: filter.typeFilter,
                editorParameters: editorParameters
            };
            
            self.editorValidations[args.guid] = options;
        }

        if (typeof properties["xpath"] === "object") { self.changeXpathNavigatorView(properties.xpath); }

        // Fetch model
        $.when(self.controller.getXpathNavigatorModel())
        .done(function (model) {
            var presenter = new bizagi.editor.component.xpathnavigator.presenter({ model: model });
            var xpath = properties.xpath;

            // Define handlers
            presenter.subscribe("nodeDoubleClick", function (_, xpathData) {
                self.changeXpathPropertyForElement(args.guid, 'xpath', xpathData);

                // Close control
                presenter.closePopup();
            });

            // Show xpath navigator and locate xpath
            presenter.renderPopup({
                position: {
                    left: args.position.left,
                    top: args.position.top + args.position.height
                },
                xpath: xpath,
                filter: filter
            });
        });
    },

    /*
    *   Perform change xpath command
    */
    changeXpathForElement: function (guid, xpathData) {
        var self = this;
        var command = {
            command: "changeProperty",
            guid: guid,
            property: "xpath",
            value: bizagi.editor.utilities.buildComplexXpath(xpathData.xpath, xpathData.contextScope, xpathData.isScopeAttribute, xpathData.guidRelatedEntity)
        };

        // Executes the command
        self.executeCommand(command);
    },

    /*
    *   Deletes the selected item
    */
    onDeleteElement: function (guid) {
        var self = this;

        self.hidePropertyBox();
        self.executeCommand({ command: "removeElementById", guid: guid });
    },

    /*
    *  Handles lower dynamic buttons click
    */
    onButtonClicked: function (data) {
        var self = this;
        var decoratedElement = self.decorator.getDecoratedElement();

        if (data.button === "ConfigGrid") {
            // After context changed we need to draw editor
            self.drawGridColumnEditor({
                guid: data.guid,
                element: decoratedElement
            });

            // Hide properties component
            self.hidePropertyBox();

            // Changes modeler context to grid
            self.executeCommand({ command: "changeContext", guid: data.guid, context: self.getGridContext() });

        } else if (data.button === "EditNestedForm") {
            var args = {},
                openNestedForm;

            var propertiesForm = self.executeCommand({ command: "getElementProperties", guid: data.guid });

            args.refForm = propertiesForm.form;
            args.protocol = "opennestedform";
            args.idForm = data.guid;
            openNestedForm = bizagi.editor.communicationprotocol.factory.createProtocol(args);
            openNestedForm.processRequest();

        } else if (data.button === "AddForm") {

            // draws editor
            self.drawSelectFormEditor({
                guid: data.guid,
                element: decoratedElement,
                property: "add.form",
                caption: "Add Form"
            });

        } else if (data.button === "EditForm") {

            // draws editor
            self.drawSelectFormEditor({
                guid: data.guid,
                element: decoratedElement,
                property: "edit.form",
                caption: "Edit Form"
            });
        }
    },

    /*
    * Reviews the current context to find the correct grid context
    * ex if the current context is offlineform the grid context is offlinegrid
    */
    getGridContext: function () {
        var self = this;

        if (self.controller.isOfflineFormContext())
            return "offlinegrid";

        if (self.controller.isAdhocFormContext())
            return "adhocgrid";

        return "grid";
    }

})
