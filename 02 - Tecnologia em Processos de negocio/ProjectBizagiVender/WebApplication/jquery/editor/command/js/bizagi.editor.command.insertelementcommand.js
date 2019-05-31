
/*
*   Name: BizAgi FormModeler Editor Insert Element Command
*   Author: Alexander Mejia
*   Comments:
*   -   This command inserts an element in the model
*
*   Command Arguments
*
*   - parent
*   - position
*   - element
*/

bizagi.editor.refreshableCommand.extend("bizagi.editor.insertElementCommand", {}, {

    /*
    *   Adds the element in the model, using the arguments
    */
    execute: function () {
        var self = this;
        var contextInfo = self.controller.getContextInfo();
        var parent = self.arguments.parent || contextInfo.guid;

        // Validate model
        if (!self.validateModel(parent)) {            
            return false;
        }

        self.arguments.canValidate = true;

        if (self.arguments.position !== undefined)
            self.model.insertElement(self.arguments.position, parent, self.arguments.element);
        else {
            var element = self.model.addElement(self.arguments.element, parent);
            self.arguments.position = element;
        }

        
        self.controller.executeCommand({
            command: "applyOverridesElement",
            overrides: {
                properties: true,
                requiredProperties: true
            },
            guid: self.arguments.element.guid,
            canUndo: false
        });

        return true;
    },

    /*
    *   Undo last action
    */
    undo: function () {
        var self = this;
        var contextInfo = self.controller.getContextInfo();
        var parent = self.arguments.parent || contextInfo.guid;

        self.model.removeElement(self.arguments.position, parent);
        return true;
    },

    /*
    * Validate the model according to context
    * ex. if the context is offlinegrid the max number of columns allowed is 4
    */
    validateModel: function (parent) {
        var self = this;
        var result = true;

        var context = self.controller.getContext();
        if (context == "offlinegrid") {
            var offlineGrid = self.model.getElement(parent);
            if (offlineGrid && $.isArray(offlineGrid.elements)) {                
                result = offlineGrid.elements.length <= 3;
            }

            if (!result) {
                bizagi.showMessageBox(bizagi.localization.getResource("formmodeler-component-gridcolumneditor-offline-max-columns"), '', 'warning', false);
            }            
        }
                        
        return result;
    }
})


