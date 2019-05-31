
/*
*   Name: BizAgi FormModeler Editor Create Control Layout Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for createcontrollayoutcommand

COMMAND ARGUMENTS
*
*   - ID - controlLayout
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.createAndInsertControlLayoutInModelCommand", {}, {

    /*
    *  starts execute process
    */
    execute: function () {
        var self = this,
            args = self.arguments;

        if (typeof (self.layout) === "undefined") {

            var definition = self.controller.getLayoutNavigatorModel().findControlById(args.id);

            if (typeof definition === "object") {
                self.layout = self.model.createLayoutElement(definition);
            }

            
        }

        self.controller.executeCommand({ command: "insertElement", position: self.arguments.position, parent: self.arguments.parent, element: self.layout, canUndo: false });
        
     
        return true;

    },

    /*
    *  undo action
    */
    undo: function () {
        var self = this;

        self.controller.executeCommand({ command: "removeElement", position: self.arguments.position, parent: self.arguments.parent, element: self.layout, canUndo: false });

        return true;
    }

})
