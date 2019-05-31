
/*
*   Name: BizAgi FormModeler Editor Component CommandsEditor Action Commands Factory
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for factory
*/

// Make sure the namespaces exists
bizagi.editor = bizagi.editor || {};
bizagi.editor.component = bizagi.editor.component || {};
bizagi.editor.component.commandseditor = bizagi.editor.component.commandseditor || {};
bizagi.editor.component.commandseditor.actioncommands = bizagi.editor.component.commandseditor.actioncommands || {};

bizagi.editor.component.commandseditor.actioncommands.factory = (function () {

    return {

        /*
        *   Creates a new action command based on the parameter command from the arguments
        */
        createCommand: function (args) {

            if (args.command !== undefined) {
                try {
                    args.command = args.command.replace("-", "");
                    
                    var fn = eval("var bafn = function(args) { " +
                        " return new bizagi.editor.component.commandseditor.actioncommands." + args.command + "(args);" +
                      "};bafn");

                    var command = fn(args);
                    return command;

                } catch (e) {
                    return null;
                }
            }

            return null;
        }
    };

})();
