/*
*   Name: BizAgi FormModeler Editor Command Factory
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for command factory
*/

bizagi.editor.observableClass.extend("bizagi.editor.commandfactory", {}, {

    /*
    *   Constructor
    */
    init: function (controller) {

        // Call base
        this._super();

        this.controller = controller;
    },

    /*
    *   Creates automatically a command based in the command parameter from the arguments
    */
    create: function (args) {
        if (typeof (args.command) === "undefined")
            throw "The argument must contain a command to perform";

        try {
            var fn = eval("var bafn = function(args, controller, model) { \n" +
                        " return new bizagi.editor." + args.command + "Command({arguments: args, controller: controller, model: model }); \n" +
                      "};\n" +
				"bafn");

            var command = fn(args, this.controller, this.controller.getModel());
            return command;

        } catch (e) {
            throw "Can't create a comand for " + args.command;
        }
    }

});
