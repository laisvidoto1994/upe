/*
*   Name: BizAgi FormModeler Editor Get Form Properties Model Command
*   Author: Diego Parra
*   Comments:
*   -   This command will retrieve the properties for a the current form properties model
*
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getFormPropertiesModelCommand", {}, {

    /*
    *   Gets the Form properties model
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        
        // Prepare result
        var propertiesModel = self.model.getPropertiesModel();

        if (args.showValidations) {
            var validations = self.model.getFormValidations();
            if (validations) { propertiesModel["validations"] = bizagi.clone(validations); }
        }
        
        self.arguments.result = propertiesModel;
        return true;
    }
})

