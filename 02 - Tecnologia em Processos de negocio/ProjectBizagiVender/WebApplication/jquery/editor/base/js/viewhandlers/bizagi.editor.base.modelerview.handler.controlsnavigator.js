/*
*   Name: BizAgi Form Modeler View Controls Handlers
*   Author: Alexander Mejia
*   Comments:
*   -   This script will handler modeler view controls navigator handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {
    /*
    *   Draws the controls navigator component in the layout
    */
    drawControlsNavigator: function () {
        var self = this;

        // Define canvas
        var canvas = $("<div />")
            .appendTo(self.mainContainer.find("#left-tab-minitoolbar"));

        // Define model
        $.when(self.controller.getControlsNavigatorModel())
        .pipe(function (model) {
            var presenter = self.controlsNavigator = new bizagi.editor.component.controlsnavigator.presenter({ canvas: canvas, model: model });

            self.attachHandlersControlsNavigator();

            // Render and return 
            return presenter.render({ isReadOnly: self.controller.isReadOnlyForm() });
        });
    },

    /*
    * This method attachs handlers to events related with the editor
    */
    attachHandlersControlsNavigator: function () {
        var self = this;
        var presenter = self.controlsNavigator;

        if (!self.controller.isReadOnlyForm()) {
            // Define handlers
            presenter.subscribe("controlDoubleClick", function (e, args) { self.onControlDoubleClick(args); });
            presenter.subscribe("controlRefreshCanvas", function (e, args) { self.refreshCanvas(args); });
        }
    },


    onControlDoubleClick: function (args) {
        var self = this;
        self.executeCommand({ command: "insertElementFromControlsNavigator", data: args });
    },

    /*
    *   Change controls navigator accordion when the context has been changed
    */
    refreshControlsNavigator: function () {
        var self = this;

        // Fetch the model
        $.when(self.controller.getControlsNavigatorModel())
        .done(function (model) {
            self.controlsNavigator.render({ model: model, isReadOnly: self.controller.isReadOnlyForm() });
        });
    }
});
