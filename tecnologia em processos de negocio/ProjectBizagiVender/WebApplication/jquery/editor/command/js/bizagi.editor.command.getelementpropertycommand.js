
/*
*   Name: BizAgi FormModeler Editor Get Element Property Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will retrieve the property for a desired element
* 
*   guid
*   property
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getElementPropertyCommand", {}, {

    /*
    *   Gets the element property for a given element guid
    */
    execute: function () {
        var self = this,
            args = self.arguments;

     
        // Prepare result
        var element = self.model.getElement(args.guid);
        self.arguments.result = element.getProperty(args.property);

        return true;
    }

})