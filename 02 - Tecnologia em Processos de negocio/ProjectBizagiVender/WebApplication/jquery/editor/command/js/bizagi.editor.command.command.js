/*
*   Name: BizAgi FormModeler Editor Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for command
*/

bizagi.editor.observableClass.extend("bizagi.editor.command", {}, {

    /*
    *   Sets up the command
    */
    init: function (params) {
        params = params || {};

        // Call base
        this._super();

        this.arguments = params.arguments;
        this.controller = params.controller;
        this.model = params.model;
        this.arguments.canUndo = this.arguments.canUndo !== undefined ? this.arguments.canUndo : this.canUndo();
        this.arguments.refresh = this.needRefresh();
        this.arguments.canValidate = false;
        // Validate arguments
        this.validateArguments();
    },

    /*
    *   Returns true if the main view needs to be refreshed after this command execution
    */
    needRefresh: function () { return false; },

    /*
    *   Executes the command, this method must be implemented in all inheritors
    */
    execute: function () { },

    /*
    *   Returns true if the command can be undone
    */
    canUndo: function () { return true; },

    /*
    *   Undoes the command, default behaviour do nothing
    */
    undo: function () { return false; },

    /*
    *   Retries the command
    */
    redo: function () {
        return this.execute();
    },

    /*
    *   Validate each argument, can be overriden in order to apply further validations in each command implementation
    */
    validateArguments: function () {
        if (typeof (this.arguments) === "undefined")
            throw "Argument is not defined";
    },


    /*
    * @description: Factorized from insertElementFromControlsNavigatorCommand because is also used in changeXpath comamnd 
    *
    */
    createElement: function (model, elements) {
        var self = this;
        var data = { properties: model, guid: model.guid, elements: elements };
        var element = self.model.createElement(model.type, data);

        return element;
    },

    /*
    * Add tabItem element when parent is tab
    */
    // TODO: Move to another place?
    isSpecialElement: function (type, element) {
        var self = this;

        if (type !== "tab" && type !== "grid" && type !== "offlinetab") return;

        if (type === "tab" || type === "offlinetab") {
            var elementType = (self.controller.isOfflineFormContext()) ? "offlinetabitem" : "tabitem";
            var tabItem = self.createElement({ type: elementType, displayName: "Tab 1" });
            tabItem.properties.displayName = bizagi.editor.utilities.buildComplexLocalizable("Tab 1", tabItem.guid, "displayName");
            element.addElement(tabItem);
        }      
    },

    /*
    * / Manage result of command
    */
    resolveResult: function (commandResult) {

        var async = typeof (commandResult) === "object" && commandResult.done;
        if (async) {
            if (commandResult.state() == "resolved") {
                // When the result is a deferred, but its already resolved, return the resolved value
                return bizagi.resolveResult(commandResult);
            }
        }
        return commandResult;
    },

    setXpathAdhoc: function (element) {
        var self = this;
        if (element.properties.displayName instanceof Object) {
            xpath = element.properties.displayName.i18n.default.replace(/[(\/[&\/\\#,+()$~%.'":*?<>{}\s@!¡¿.,àèìòùÀÈÌÒÙáéíóúıÁÉÍÓÚİâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]/g, '');
        } else {
            xpath = element.properties.displayName.replace(/[(\/[&\/\\#,+()$~%.'":*?<>{}\s@!¡¿.,àèìòùÀÈÌÒÙáéíóúıÁÉÍÓÚİâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇßØøÅåÆæœ]/g, '');
        }
        xpath = xpath.substr(0, 1).toLowerCase() + xpath.substr(1);
        element.properties.xpathAdhoc = { xpath: xpath, relatedEntity: null };
    }


});

/*
*   Creates a subclass to inherit commands that can't be undone
*/
bizagi.editor.command.extend("bizagi.editor.notUndoableCommand", {}, {
    /*
    *   Returns true if the command can be undone
    */
    canUndo: function () { return false; }
});


/*
*   Creates a subclass to inherit commands that need refresh, so they automatically get this behaviour
*/
bizagi.editor.command.extend("bizagi.editor.refreshableCommand", {}, {
    /*
    *   Returns true if the main view needs to be refreshed after this command execution
    */
    needRefresh: function() { return true; }
});