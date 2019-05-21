/*
*   Name: BizAgi FormModeler Editor Validate Grid Column Model Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will validate the grid column model
*
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.validateGridColumnModelCommand", {}, {

    /*
    *   Performs validation of model
    */
    execute: function () {
        var self = this,
            args = self.arguments;

        var contextInfo = self.controller.getContextInfo();
        var model = self.model.getElement(contextInfo.guid);

        args.result = true;
        
        if (!self.validateGroupBy(model)) {
            args.result = false;
        }
        
        return true;
    },

    /*
    *   Only one column
    */
    validateGroupBy: function (model) {
        var result = true;

        if (model && model.elements) {
            var arrayResult = $.grep(model.elements, function (element, index) {
                if (element.properties && element.properties.groupby) return (element.properties.groupby === true);

            });

            result = (arrayResult.length <= 1);
        }

        return result;
    }
})