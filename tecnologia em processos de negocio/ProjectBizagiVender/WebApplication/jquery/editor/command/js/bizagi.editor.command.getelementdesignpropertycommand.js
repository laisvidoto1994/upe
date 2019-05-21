
/*
*   Name: BizAgi FormModeler Editor Get Element Property Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will retrieve the property for a desired element
* 
*   guid
*   property
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getElementDesignPropertyCommand", {}, {

    /*
    *   Gets the element property for a given element guid
    */
    execute: function () {
        var self = this,
            args = self.arguments;

     
        // Prepare result
        self.arguments.result = typeof args.guids ==="undefined" ? false:self.model.getElement(args.guids[0]).getRenderingModel();

        return true;
    }
})