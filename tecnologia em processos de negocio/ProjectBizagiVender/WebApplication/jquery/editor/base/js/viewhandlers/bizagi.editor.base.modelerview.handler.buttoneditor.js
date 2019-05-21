/*
*   Name: BizAgi Form Modeler Button Editor Handlers
*   Author: Diego Parra
*   Comments:
*   -   This script will handler modeler view button editor drawing and handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Draw the button editor for first time
    */
    drawButtonEditor: function () {
        var self = this;

        $.when(self.executeCommand({ command: "getButtonModel" }))
        .done(function (buttonModel) {

            // Create button editor canvas
            var canvas = self.createButtonEditorCanvas();

            // Create editor
            var presenter = self.buttoneditor = new bizagi.editor.component.buttoneditor.presenter({
                buttonModel: buttonModel,
                canvas: canvas
            });
            
            // Render the component
            presenter.render({ isReadOnly: self.controller.isReadOnlyForm(), allowAddButtons : self.controller.isFormContext()});

            self.attachHandlersButtonEditor();
            self.refreshButtonEditor();
        });
    },


    /*
    * This method attachs handlers to events related with the editor
    */
    attachHandlersButtonEditor: function () {
        var self = this;
        var presenter = self.buttoneditor;

        if (!self.controller.isReadOnlyForm()) {
            // Define handlers
            presenter.subscribe("selectButton", function (e, args) { self.onSelectButton(args); });
            presenter.subscribe("unselectButton", function (e, args) { self.onUnselectButton(args); });
            presenter.subscribe("addButton", function (e, args) { self.onAddButton(args); });
            presenter.subscribe("moveButton", function (e, args) { self.onMoveButton(args); });
        }
    },
    /*
    *   Refresh button editor view
    */
    refreshButtonEditor: function () {
        var self = this;
        var presenter = self.buttoneditor;
        var guid = self.controller.getContextInfo().guid;
        var enabled = self.executeCommand({ command: "getElementProperty", guid: guid, property: "usecustombuttons" });
        enabled = enabled || self.controller.isStartFormContext();

        if (enabled) {

            self.showButtonEditor();
            if (presenter) {
                $.when(self.executeCommand({ command: "getButtonModel" }))
                .done(function (buttonModel) {
                    var element = self.controller.getGuidsSelected()[0] ? self.controller.getSelectedElements(self.controller.getGuidsSelected()[0]) : null;
                    presenter.refresh({ buttonModel: buttonModel, options: { element: element }, isReadOnly: self.controller.isReadOnlyForm(), allowAddButtons: self.controller.isFormContext() });
                });
            }

        } else {
            self.hideButtonEditor();
        }
    },

    /*
    *
    */
    showButtonEditor: function () {
        $(".wrapper-main-panel").addClass("bz-form-buttons-enabled");
    },

    /*
    *
    */
    hideButtonEditor: function () {
        $(".wrapper-main-panel").removeClass("bz-form-buttons-enabled");
    },

    /*
    *   Creates a canvas for search result editor
    */
    createButtonEditorCanvas: function () {
        var self = this;
        return $("#button-editor-panel", self.mainContainer);
    },

    /*
    *   Reacts to button selection
    */
    onSelectButton: function (args) {

        // Perform element selection
        var self = this;

        // Remove selected element flag
        self.currentSelectedElement = args.guid;
        self.controller.removeSelectedElement();
        self.controller.addSelectedElement(args.guid, args);

        // hide property box and refresh ribbon with the new element
        self.hidePropertyBox();
        self.refreshRibbon(args.guid);

        
        if (self.controller.isFormContext()) {
            // Draw decorator and show element xpath in navigator
            self.drawDecorator($.extend(args, { IsOnClickEvent: true }));
        }
        else {
            // Draw properties of button
            self.drawPropertyBox({ guid: args.guid });    
        }
                

        // Apply format saved, to button
        self.applyCopyFormat(args.guid);
    },

    /*
    *   Activates when an button has been unselected
    */
    onUnselectButton: function () {
        var self = this;

        // Remove selected element flag
        self.currentSelectedElement = null;

        // hide property box and refresh ribbon with the new element
        self.hidePropertyBox();
        self.refreshRibbon();

        self.removeDecorator();
    },

    /*
    *   Handles button adding
    */
    onAddButton: function () {
        var self = this;

        // Hide property box and refresh ribbon with the new element
        self.hidePropertyBox();
        self.removeDecorator();

        // Executes the command and refreshes the view
        self.executeCommand({ command: "insertButton" });
    },

    /*
    *   Reacts to button swapping
    */
    onMoveButton: function (args) {
        var self = this;
        var command = {
            command: "moveElement",
            initialPosition: args.initialPosition,
            finalPosition: args.finalPosition,
            elementType: "button"
        };

        // Executes the command and refreshes the view
        self.executeCommand(command);
    }
})
