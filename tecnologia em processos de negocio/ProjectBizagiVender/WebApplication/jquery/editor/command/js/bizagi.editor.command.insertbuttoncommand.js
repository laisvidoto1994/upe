
/*
*   Name: BizAgi FormModeler Editor Insert Button Command
*   Author: Diego Parra
*   Comments:
*   -   This command inserts a button
*
*   Command Arguments
*
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.insertButtonCommand", {}, {

    /*
    *   Adds the element in the model, using the arguments
    */
    execute: function () {
        var self = this;
        var contextInfo = self.controller.getContextInfo();
        var parent = self.arguments.parent || contextInfo.guid;

        // Add the button in the model
        var newButtonGuid = Math.guid();
        var button = self.createElement({
            guid: newButtonGuid,
            type: "formbutton",
            caption: bizagi.editor.utilities.buildComplexLocalizable(bizagi.localization.getResource("formmodeler-component-editor-newbutton"), newButtonGuid, "caption")
        });
        self.model.addButton(button);

        // Save guid for undo
        self.arguments.guid = button.guid;

        return true;
    },

    /*
    *   Undo last action
    */
    undo: function () {
        var self = this;
        
        self.model.removeElementById(self.arguments.guid);

        return true;
    }
});


