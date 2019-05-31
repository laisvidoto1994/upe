

/*
*   Name: BizAgi FormModeler Editor Change Property Elements Command
*   Author: Alexander Mejia, Diego Parra (refactor)
*   Comments:
*   -   This script will define basic stuff for changepropertyelementscommand
*
*   Arguments
*   -   Array objects {
*            -   guid
*            -   property
*            -   value
*     }    
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.changePropertyElementsCommand", {}, {

    /*
    *   Perform property change
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var elements = args.elements;

        // Save original value for redo
        if (!self.originalValue) { self.originalValue = {}; }

        for (var i = 0, l = elements.length; i < l; i++) {

            var guid = elements[i].guid;
            var property = elements[i].property;
            var value = elements[i].value;   
            var element = self.model.getElement(guid);

            if (!self.originalValue[guid]) {
                self.originalValue[guid] = { property: property, value: element.getProperty(property) };
                args.canValidate = true;
            }

            // Perform change property
            element.assignProperty(property, value);
        }

        return true;
    },

    /*
    *   Undo property change
    */
    undo: function () {
        var self = this;

        for (var guid in self.originalValue) {
            var property = self.originalValue[guid].property;
            var value = self.originalValue[guid].value;

            var element = self.model.getElement(guid);

            // Perform change property
            element.assignProperty(property, value);
        }

        return true;
    }

})


