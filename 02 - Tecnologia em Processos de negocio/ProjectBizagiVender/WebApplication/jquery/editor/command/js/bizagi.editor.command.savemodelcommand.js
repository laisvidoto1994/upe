
/*
*   Name: BizAgi FormModeler Editor Save Model Command
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for savemodelcommand
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.saveModelCommand", {}, {

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var dataModel = args.dataModel;

        // saves the model
        args.dataModel = self.model.saveModel();

        self.controller.setOriginalModel(args.dataModel);
        args.result = args.dataModel;
        return true;
    }
})
