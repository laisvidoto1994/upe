
/*
*   Name: BizAgi FormModeler Editor Get Context menu Model Command
*   Author: Diego Parra
*   Comments:
*   -   This command will retrieve the context menu model for a desired element
*
*   Arguments
*   - guid
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getContextMenuModelCommand", {}, {


    /*
    *   Gets the element properties for a given element guid
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var guid = args.guid;
        var convertToModel = args.convertToModel;
        
        var element = self.model.getElement(guid);
        var contextMenuModel = element.getContextMenuModel();
        contextMenuModel.addConverToItem(convertToModel);

        self.arguments.result = contextMenuModel;

        return true;
    }
})

