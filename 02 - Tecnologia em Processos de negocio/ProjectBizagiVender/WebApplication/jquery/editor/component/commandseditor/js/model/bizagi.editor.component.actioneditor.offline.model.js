/*
*   Name: BizAgi FormModeler Action Editor Offline Model
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define the underground model used to design an action
*/

bizagi.editor.component.actioneditor.model.extend("bizagi.editor.component.actioneditor.offline.model", {}, {

    /*
    *   Constructor
    */
    init: function (data, fullModel) {

        // Call base
        this._super(data, fullModel);       

        // Initialize action commands
        this.actionCommands = bizagi.editor.component.commandseditor.offline.model.actionCommands;
       
    }

});


