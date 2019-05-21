
/*
*   Name: BizAgi FormModeler Editor Refresh Control Command
*   Author: Alexander Mejia
*   Date : 02-12-2013
*   Comments:
*   -   This script will define basic stuff for refreshcontrolcommand
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.refreshControlCommand", {}, {

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;
        var args = self.arguments;

        var element = self.model.getElement(args.guid);
        if (element && element.refreshControl) {
            element.refreshControl(args);
        }

        return true;
    }
})
