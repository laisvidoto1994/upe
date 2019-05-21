
/*
*   Name: BizAgi FormModeler Editor Get Select Form Model Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command will retrieve the model for select form editor
*
*   Arguments
*   -   guid
*   -   property
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.getSelectFormModelCommand", {}, {


    /*
    *   Executes command
    */
    execute: function () {
        var self = this,
            args = self.arguments;

        var element = self.model.getElement(args.guid);

        var model = {};
        model.value = element.getProperty(args.property);
        model.xpath = element.getProperty("xpath");
        model.name = args.propertyName;
        model.relatedForms = [];
        model.context = self.controller.getContext();

        self.arguments.result = model;
        return true;
    }
})

