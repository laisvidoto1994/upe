
/*
*   Name: BizAgi FormModeler Editor Get Property Is Required Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will check is the property is required for a desired element
*
*   Arguments
*   -   guid
*   -   property
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.propertyIsRequiredCommand", {}, {


    /*
    *   Gets the element required properties for a given element guid
    */
    execute: function () {
        var self = this;
        var args = self.arguments;

        var element = self.model.getElement(args.guid);

        // Prepare result
        args.result = element.isRequiredProperty(args.property);

        return true;
    }


})

