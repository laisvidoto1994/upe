
/*
*   Name: BizAgi FormModeler Editor Component Properties Commands Factory
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for factory
*/

// Make sure the namespaces exists
bizagi.editor = bizagi.editor || {};
bizagi.editor.component = bizagi.editor.component || {};
bizagi.editor.component.properties = bizagi.editor.component.properties || {};
bizagi.editor.component.properties.commands = bizagi.editor.component.properties.commands || {};

bizagi.editor.component.properties.commands.factory = (function () {
  
    /*
    *
    */
    this.createRuleCommand = function (args) {
        return new bizagi.editor.component.properties.commands.rule(args);
    };


    /*
    *   Creates a new action command based on the parameter command from the arguments
    */
    this.createCommand = function (args) {

        if (args.command !== undefined) {
            try {
                args.command = args.command.replace("-", "");

                var fn = eval("var bafn = function(args) { " +
                    " return new bizagi.editor.component.properties.commands." + args.command + "(args);" +
                    "};bafn");

                var command = fn(args);
                return command;

            } catch (e) {
                return null;
            }
        }

        return null;
    };


    return {
        createCommand: this.createCommand,        
        createRuleCommand: this.createRuleCommand
    };

})();
