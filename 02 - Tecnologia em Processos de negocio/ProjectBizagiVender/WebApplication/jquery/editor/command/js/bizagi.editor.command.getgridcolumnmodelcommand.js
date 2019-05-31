/*
*   Name: BizAgi FormModeler Editor Get Grid Column Model Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will retrieve a grid model for sub-edition
*
*   Arguments
*   -   guid
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getGridColumnModelCommand", {}, {

    /*
    *   Search the grid, and returns its persistence model
    */
    execute: function () {
        var self = this;
        var defer = $.Deferred();
        var element = self.model.getElement(self.arguments.guid);

        // Define result
        $.when(element.getGridColumnModel())
        .done(function (model) {
            defer.resolve(model);
        });

        self.arguments.result = defer.promise();
        return true;
    }


});