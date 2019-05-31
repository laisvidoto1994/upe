
/*
*   Name: BizAgi FormModeler Editor View
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for base view
*/

bizagi.editor.observableClass.extend("bizagi.editor.view", {}, {

    /*
    *   Constructor, sets up the controller
    */
    init: function (params) {

        var self = this;

        // call base
        this._super();

        if (params.context != "adhocform") {
            this.controller = new bizagi.editor.base.controller(params);
            self.controller.subscribe("getNodeInfo", function (ev, args) { return self.getNodeInfo(args); });
            self.controller.subscribe("findXpathAttributes", function (ev, args) { return self.findXpathAttributes(args); });
        } else {
            this.controller = new bizagi.editor.adhoc.controller(params);            
        }

        // Bind events
        self.controller.subscribe("commandExecuted", function (event, args) { self.commandExecuted(args);});
        self.controller.subscribe("refresh", function (event, args) { self.refresh();});
        self.controller.subscribe("showControlWizard", function (event, args) { return self.showControlWizard(args);});
        self.controller.subscribe("getExternalData", function (event, args) { return self.getExternalData(args); });
        self.controller.subscribe("getDefaultDisplayName", function (event, args) { return self.getDefaultDisplayName(args); });        
        self.controller.subscribe("resizeHeigthCanvas", function (ev, args) { return self.refreshCanvas(args); });
        self.controller.subscribe("refreshElement", function (ev, args) { return self.refreshElement(args); });
        self.controller.subscribe("formIsLoaded", function (ev, args) { return self.formIsLoaded();});
        
    },

    /*
    *   Checks if the class has been finished initialization
    */
    ready: function () {
        return this.controller.ready();
    },

    /*
    *   Refreshes the view
    */
    refresh: function (args) {
        var self = this;

        args = args || {};

        $.when(self.preRender(args))
            .pipe(function () {
                self.render(args);
                self.postRender();
            });
    },

    /*
    *   Executes a command in the controller, also refresh the main view if the command needs to
    */
    executeCommand: function (args) {
        var self = this;
        if(args.command){
            args.gridGuid = args.command === "changeContext"? self.guid:null;
        }

        // Execute
        var commandResult = $.when(self.controller.executeCommand(args))
                            .pipe(function (result) {
                                // Optionally we would like to render after a main command has been executed
                                if (args.success && args.refresh) {
                                    self.refresh(args);
                                }

                                return result;
                            });

        // Manage result
        var async = typeof (commandResult) === "object" && commandResult.done;
        if (async) {
            if (commandResult.state() == "resolved") {
                // When the result is a deferred, but its already resolved, return the resolved value
                return bizagi.resolveResult(commandResult);
            }
        }

        return commandResult;
    },

    /*
    *   Undoes a command
    */
    undo: function () {
        var that = this,
            success;

        success = that.controller.undo();
        if (success) {
            // TODO: Only refresh when the arguments indicates that need refresh
            this.refresh();
        }
    },

    /*
    *   Redoes a command
    */
    redo: function () {
        var success;
        success = this.controller.redo();

        if (success) {
            // TODO: Only refresh when the arguments indicates that need refresh
            this.refresh();
        }
    },

    /*
    *   Main render function, needs to be overriden in order to use autmatic refreshing
    */
    render: function () { },

    /*
    *   Show control wizard method, needs to be overriden in order to use control wizards
    */
    showControlWizard: function () { },

    /*
    *   Get external data, needs to be overriden in order to get data for several controls
    */
    getExternalData: function () { },

    /*
    *   This automated routine helps to execute handlers when a command has been executed
    */
    commandExecuted: function (args) {
        var self = this;

        if (typeof self[args.command + "Executed"] === "function") {
            self[args.command + "Executed"](args.result, args);
        }
    }

})