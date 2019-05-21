/*
*   Name: BizAgi Form Modeler View Layout Navigator Handlers
*   Author: ALexander Mejia
*   Comments:
*   -   This script will handler modeler view xpath navigator handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Draws the layout navigator component in the layout
    */
    drawLayoutNavigator: function () {
        var self = this;

        // Define canvas
        var canvas = $("<div />")
            .addClass("bizagi_editor_layoutnavigator_container")
            .appendTo(self.mainContainer.find("#left-tab-layout"));

        // Define model
        $.when(self.controller.getLayoutNavigatorModel())
        .pipe(function (model) {
            var presenter = self.layoutNavigator = new bizagi.editor.component.layoutnavigator.presenter({ canvas: canvas, model: model });

            self.attachHandlersLayoutNavigator();

            // Render and return 
            return presenter.render({ isReadOnly: self.controller.isReadOnlyForm() });
        });
    },


    /*
    * This method attachs handlers to events related with the editor
    */
    attachHandlersLayoutNavigator: function () {
        var self = this;
        var presenter = self.layoutNavigator;

        if (!self.controller.isReadOnlyForm()) {
            // Define handlers
            presenter.subscribe("layoutDoubleClick", function (e, args) { self.onLayoutDoubleClick(args); });
            presenter.subscribe("controlRefreshCanvas", function (e, args) { self.refreshCanvas(args); });
        }
    },

    /*
    *   Process layout double click
    */
    onLayoutDoubleClick: function (args) {
        var self = this;
        var command = {
            command: "addControlLayoutInModel",
            id: args.id
        };

        // Executes the command and refreshes the view
        self.executeCommand(command);
    },

    /*
    *   Change controls navigator accordion when the context has been changed
    */
    refreshLayoutNavigator: function () {
        var self = this;

        // Fetch the model
        $.when(self.controller.getLayoutNavigatorModel())
        .done(function (model) {
            self.layoutNavigator.render({ model: model, isReadOnly: self.controller.isReadOnlyForm() });
        });
    }
});