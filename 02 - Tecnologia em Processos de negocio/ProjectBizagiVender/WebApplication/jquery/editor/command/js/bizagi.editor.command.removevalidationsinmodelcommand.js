
/*
*   Name: BizAgi FormModeler Editor Remove Validations In Model Command
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for removevalidationsimodelcommand
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.removeValidationsInModelCommand", {}, {

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this,
            args = self.arguments;

        args.refresh = args.canRefresh;
        self.model.removeValidations();

        return true;
    }
})
