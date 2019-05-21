/*
*   Name: BizAgi Editor Component CommandsEditor Action Commands Base
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for command
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.commandseditor.actioncommands.base", {}, {

    /*
    *   Sets up the command
    */
    init: function (args) {
        args = args || {};

        // Call base
        this._super();

        this.args = args;
        this.model = args.model;
        this.data = this.model.data;
        this.controller = args.controller;
    },



    /*
    *   Executes the command, this method must be implemented in all inheritors
    */
    execute: function () { }

});

