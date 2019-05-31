
/*
*   Name: BizAgi FormModeler Editor Remove Element Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for removeelementcommand
*   
*   Arguments:
*   -   parent
*   -   position
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.removeElementCommand", {}, {

    /*
    *   Removes an element from the parent
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var contextInfo = self.controller.getContextInfo();
        var parent = self.arguments.parent || contextInfo.guid;

        args.canValidate = true;

        // Removes the element from the model
        if (self.arguments.position !== undefined)
            self.model.removeElement(args.position, parent, args.element);
        else {
            self.model.removeLastElement(parent);
        }

        return true;
    },

    /*
    *   Undoes the command
    */
    undo: function () {
        //TODO: Implement?
        return true;
    }

})
