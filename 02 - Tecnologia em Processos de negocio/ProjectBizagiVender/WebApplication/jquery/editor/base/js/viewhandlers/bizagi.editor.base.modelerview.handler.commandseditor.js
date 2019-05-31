/*
*   Name: BizAgi Form Modeler Commands Editor Handlers
*   Author: Alexander Mejia
*   Comments:
*   -   This script will handler modeler view commands editor drawing and handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Draws the commands editor
    */
    drawCommandsEditor: function () {
        var self = this;

        var commandsEditorPresenter = new bizagi.editor.component.commandseditor.presenter();
        $.when(self.controller.getCommandsModel())
            .done(function (model) {

                // Define handlers
                commandsEditorPresenter.subscribe("getContext", function (e, args) { return self.onGetContext(args); });

                // Show the editor and update the changes when done
                $.when(commandsEditorPresenter.show(model))
                    .done(function (updatedModel) {
                        self.controller.setCommandsModel(updatedModel);
                        self.refreshRibbon();
                    });
            });



    },
   
    /*
    *   Reacts to get context event
    */
    onGetContext: function () {
        var self = this;

        return self.controller.getContext();
    }

})
