
/*
*   Name: BizAgi FormModeler Editor validate Actions Validations Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will valid the actions and validations model and will remove invalid elements
*
*   Arguments
*   - guid
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.validateActionsValidationsModelCommand", {}, {


    /*
    *   Executes command
    */
    execute: function () {
        var self = this;

        if (self.controller.isFormContext()) {
            $.when(self.controller.getCommandsEditorModel())
                .done(function (commandsEditorModel) {
                    var invalidElements = commandsEditorModel.getInvalidElements();
                    if (invalidElements.actions) { self.removeActions(invalidElements.actions); }
                    if (invalidElements.validations) { self.removeValidations(invalidElements.validations); }
                });

        }
    },

    /*
    *   Removes actions 
    */
    removeActions: function (actions) {
        var self = this;

        for (var i = 0, l = actions.length; i < l; i++) {
            self.model.deleteAction(actions[i].guid);
        }
    },

    /*
    *   Removes validations 
    */
    removeValidations: function (validations) {
        var self = this;

        for (var i = 0, l = validations.length; i < l; i++) {
            self.model.deleteValidation(validations[i].guid);
        }
        
    }

})

