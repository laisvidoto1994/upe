
/*
*   Name: BizAgi FormModeler Editor Add Control Layout In Model Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for addControlLayoutInModelCommand
*
*   COMMAND ARGUMENTS
*
*   - ID controlLayout
*   
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.addControlLayoutInModelCommand", {}, {

    execute: function () {
        var self = this,
            args = self.arguments;

        if (typeof (self.layout) === "undefined") {

            var definition = self.controller.getLayoutNavigatorModel().findControlById(args.id);
            if (typeof definition === "object") {
                self.layout = self.model.createLayoutElement(definition);
            }
        }

        self.model.addElement(self.layout);

        return true;

    },

    undo: function () {
        var self = this;

        self.model.removeLastElement();

        return true;
    }

})

