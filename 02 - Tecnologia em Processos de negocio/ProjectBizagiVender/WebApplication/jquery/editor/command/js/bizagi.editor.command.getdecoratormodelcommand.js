
/*
*   Name: BizAgi FormModeler Editor Get Decorator Model Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will retrieve the decorator model for a desired element
*
*   Arguments
*   - guid
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getDecoratorModelCommand", {}, {


    /*
    *   Gets the element properties for a given element guid
    */
    execute: function () {
        var self = this;
        var guid = self.arguments.guid;
        var element = self.model.getElement(guid);
        
        // Prepare result
        self.arguments.result = element.getDecoratorModel();
        
        return true;
    }
})

