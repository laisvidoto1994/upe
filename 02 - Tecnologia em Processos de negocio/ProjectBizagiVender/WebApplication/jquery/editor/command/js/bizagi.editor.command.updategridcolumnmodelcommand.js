
/*
*   Name: BizAgi FormModeler Editor Update Grid Column Model Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command performs a columns update in current grid selected
*
*   Arguments
* 
*   - gridModel
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.updateGridColumnModelCommand", {}, {

    /*
    *   Performs a context change in the controller
    */
    execute: function () {
        var self = this;
        var args = self.arguments;

        // Creates a new element, and replace it in the model
        var guid = args.gridModel.guid;
        var grid = self.model.createElement(args.gridModel.type, args.gridModel);
        if(grid.type != "adhocgrid") grid.restoreDefaultDisplayName();
        self.model.replaceElement(guid, grid);
        return true;
    }
})
