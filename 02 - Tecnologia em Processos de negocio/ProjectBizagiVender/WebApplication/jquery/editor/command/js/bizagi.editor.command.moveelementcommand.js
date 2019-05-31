
/*
*   Name: BizAgi Editor Move Element Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script handles element moving between a single container
*
*   Arguments
*   -   parent
*   -   initialPosition
*   -   finalPosition
*   -   elementType
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.moveElementCommand", {}, {

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var contextInfo = self.controller.getContextInfo();
        args.elementType = args.elementType || "render";

        if (!self.parent) {
            self.parent = self.arguments.parent || contextInfo.guid;
        }

        self.model.moveElement(args.initialPosition, args.finalPosition, self.parent, args.elementType);
        return true;
    },

    /*
    *   Undo the command, reverting elements to their initial positions
    */
    undo: function () {
        var self = this,
            args = self.arguments;

        this.model.moveElement(args.finalPosition, args.initialPosition, self.parent, args.searchformresult);
        return true;
    }
})
