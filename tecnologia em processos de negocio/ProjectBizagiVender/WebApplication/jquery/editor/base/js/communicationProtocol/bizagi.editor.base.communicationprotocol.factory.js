/*
*   Name: BizAgi FormModeler Editor Communication Protocol Factory
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for factory
*/

// Make sure the namespaces exists
bizagi.editor = bizagi.editor || {};
bizagi.editor.communicationprotocol = bizagi.editor.communicationprotocol || {};

bizagi.editor.communicationprotocol.factory = (function () {

    return {

        setContext(context) {
            this.context = context;
        },

        /*
        *   Creates a new protocol based on the parameter protocol from the arguments
        */
        createProtocol: function (args) {
            if (typeof (args.protocol) === "undefined")
                throw "The argument must contain a protocol to create the protocol instance";

            try {
                var fn = eval("var bafn = function(args) { " +
                        " return new bizagi.editor.base.protocol." + args.protocol + "(args);" +
                      "};bafn");


                var arguments = args.context ? args : $.extend(args, { context: this.context });

                var command = fn(arguments);
                return command;

            } catch (e) {
                throw "Can't create a protocol for " + args.protocol;
            }
        }
    };

})();
