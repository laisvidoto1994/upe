/*
*   Name: BizAgi FormModeler Get Button Model Command
*   Author: Diego Parra
*   Comments:
*   -   This command will retrieve the button model from the current form when it is an activity form
*
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getButtonModelCommand", {}, {

    /*
    *   Return the button model from the current activity form
    */
    execute: function () {
        var self = this;
        var defer = $.Deferred();

        if (!self.controller.isActivityForm()) {
            throw "bizagi.editor.getButtonModelCommand - To use this command you must use an activity form";
        }

        // Define result
        self.arguments.result = $.when(self.model.getButtonRenderingModel());

        return true;
    }
});