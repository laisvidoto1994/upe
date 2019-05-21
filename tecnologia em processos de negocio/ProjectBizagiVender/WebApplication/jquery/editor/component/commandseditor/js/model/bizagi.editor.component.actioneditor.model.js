/*
*   Name: BizAgi FormModeler Action Editor Model
*   Author: Diego Parra
*   Comments:
*   -   This script will define the underground model used to design an action
*/

bizagi.editor.component.baseeditor.model.extend("bizagi.editor.component.actioneditor.model", {

    action: "action"

}, {

    /*
    *   Cosntructor
    */
    init: function (data, fullModel) {

        // Call base
        this._super(data, fullModel);

        // Initialize operators
        this.operators = bizagi.editor.component.commandseditor.model.operators.action;

        // Initialize action commands
        this.actionCommands = bizagi.editor.component.commandseditor.model.actionCommands;

        // Initialize else actions
        this.elseActions = bizagi.editor.component.commandseditor.model.elseActions;

        // Create some indexes
        this.statements = {};

        //Create context
        this.context = null;
    },

    /*
    *   Returns the data model, recalculate the dependencies
    */
    getData: function () {
        var self = this;
        var data = this.data;
        var dependencies = [];

        // Iterate over expressions
        if (data.conditions.expressions.length == 0) return false;
        for (var i = 0; i < data.conditions.expressions.length; i++) {
            self.findDependencies(data.conditions.expressions[i], dependencies);
        }

        data.dependencies = dependencies;
        data.context = self.context;
        return data;
    },

    /*
    *   Returns the selected commands
    */
    getSelectedCommands: function () {
        var data = this.data;
        return data.commands;
    },

    /*
    *   Returns the list of the available commands
    */
    getCommands: function () {
        var self = this;
        var result = {};

        // TODO: Cache this?
        for (var key in self.actionCommands) {
            if (!self.actionCommands[key].hidden) { result[key] = bizagi.localization.getResource(self.actionCommands[key].label); }
        }

        return result;
    },

    /*
    *   Return an indexed statement
    */
    getStatement: function (guid) {
        return this.statements[guid];
    },

    /*
    *   Return the expression current type (data type)
    */
    getStatementType: function (guid) {
        var self = this;
        var statement = self.statements[guid];
        if (bizagi.util.isEmpty(statement.command)) return null;

        var type = this.actionCommands[statement.command].type;

        if (type == "argument") {
            if (bizagi.util.isEmpty(self.resolveXpath(statement.xpath))) return null;
            type = self.fullModel.getXpath(self.resolveXpath(statement.xpath)).type;
        }

        return type;
    },

    /*
    *   Return the expression current command
    */
    getStatementCommand: function (guid) {
        var self = this;
        var statement = self.statements[guid];
        var command = this.actionCommands[statement.command];

        var result = {
            label: command ? command.label : "",
            filterBy: command.filterBy,
            exclude: command.exclude,
            checkContext: true,
            checkGridContainer: true
        };

        for (var i = 0; i < command.appliesTo.length; i++) {
            if (command.appliesTo[i] == "render") result.appliesToRender = true;
            if (command.appliesTo[i] == "container") result.appliesToContainer = true;
        }

        return result;
    },

    /*
    *   Return the property to update 
    */
    getStatementProperty: function (guid) {
        var self = this;

        var statement = self.statements[guid];

        if (!statement) { return "xpath"; }
        if (statement.propertyToUpdate) { return statement.propertyToUpdate; }
        else { return "xpath"; }
    },

    /*
    *   Return true if ALL selected commands have Reverese option
    */
    haveAllCommandsReverse: function () {
        var self = this;
        var selectedCommands = self.getSelectedCommands();

        for (i = 0; i < selectedCommands.length; i++) {
            var command = selectedCommands[i].command;
            if (command != null && !self.actionCommands[command].hasReverse) {
                return false;
            }
        }
        return true;

    },


    /*
    *   Validate if any form of the project is using 'reverse' option
    */
    verifyFormHasReverse: function () {
        var self = this;
        return self.fullModel.data.flags.EnableShowAlwaysReverseAction || self.fullModel.data.enableReverse;
    },

    /*
    *   Return the available else actions
    */
    getElseActions: function () {

        var self = this;
        var result = {};

        // TODO: Cache this?
        for (var key in self.elseActions) {
            result[key] = bizagi.localization.getResource(self.elseActions[key]);
        }

        if (!self.verifyFormHasReverse() || (self.verifyFormHasReverse() && !self.haveAllCommandsReverse())) {
            delete result["automatic"];
        }

        return result;
    },


    /*
    *   Return the current else acion
    */
    getElseAction: function () {
        return this.fullModel.getElseActionType(this.data);
    },

    /*
    *   Resolves an xpath's name 
    */
    getXpathName: function (xpath) {
        return this.fullModel.getXpathName(xpath);
    },

    /*
    * Return the current context
    */
    getContextAction: function () {
        var self = this;
        self.context = self.context || self.data.context;
        var context = self.context;

        if (!context) { return { label: "Form", value: "Form" }; }
        else { return { label: self.getXpathName(context) || context, value: context }; }
    },

    /*
    *   Get view model
    */
    getViewModel: function () {
        var self = this;
        var data = self.data;

        // Set else action
        var elseAction = self.getElseAction();
        var action = $.extend(self._super(), {
            commands: [],
            elseCommands: (data.elseCommands ? [] : undefined),
            elseAction: { label: bizagi.localization.getResource(self.elseActions[elseAction]), value: elseAction },
            context: self.getContextAction()
        });

        for (var j = 0; j < data.commands.length; j++) {
            action.commands.push(self.getViewCommand(data.commands[j]));
        }
        if (action.elseCommands) {
            for (var k = 0; k < data.elseCommands.length; k++) {
                action.elseCommands.push(self.getViewCommand(data.elseCommands[k]));
            }
        }

        return action;
    },

    /*
    *   Returns the model for a command
    */
    getViewCommand: function (data) {
        var self = this;

        // Set a guid in order to index the statement
        data.guid = data.guid || Math.guid();
        self.statements[data.guid] = data;

        var command = {
            xpath: {
                label: self.fullModel.getXpathName(self.resolveCommand(data)),
                value: self.resolveCommand(data)
            },
            command: {
                label: bizagi.localization.getResource(self.fullModel.getCommandName(data.command)),
                value: data.command,
                isUnary: self.fullModel.isUnaryCommand(data.command),
                isOnlyCommand: self.fullModel.isOnlyCommand(data.command),
                isOnlyArgument: self.fullModel.isOnlyArgument(data.command),
                hidden: self.fullModel.isHiddenCommand(data.command)
            },
            argument: {
                label: self.fullModel.getArgumentName(data.argument, data.argumentType),
                value: (data.argument && data.argument.value ? data.argument.value : data.argument)
            },
            guid: data.guid
        };

        return command;
    },


    /*
    *   Update a statement data
    */
    updateStatement: function (guid, property, value, controlWithoutXpath) {
        var self = this;
        var statement = self.statements[guid];

        self.removeAttributesStatement(statement, property, controlWithoutXpath);

        if (property == "xpath") {
            var control = self.getControl(value);
            statement[property] = control.baxpath;
            statement["xpathContainer"] = control.xpathContainer;
        }
        else {

            // Update property
            statement[property] = value;

            // ex button, label, containers 
            if (controlWithoutXpath) {
                statement["propertyToUpdate"] = property;
            }
        }
    },
    /*
     *   Update a statement data, for activityFlowButton
     */
    updateButtonsStatement: function (guid, value) {
        var self = this;
        var statement = self.statements[guid];
        var data = self.fullModel.data.controls[value];
        if(data.controlType==="activityFlowButton"){
            statement.controlType = data.controlType;
        }
    },

    /*
    *   Add a statement
    */
    addStatement: function (section) {
        var self = this;
        var data = self.data;
        var statementCollection = section == "then" ? data.commands : data.elseCommands;

        // Add the new statement
        var guid = Math.guid();
        var statement = { xpath: null, command: null, argument: null, argumentType: "const", guid: guid };
        statementCollection.push(statement);
        self.statements[guid] = statement;
    },

    /*
    *   Remove a statement
    */
    removeStatement: function (guid, section) {
        var self = this;
        var data = self.data;
        var statementCollection = section == "then" ? data.commands : data.elseCommands;

        var hasDependencies = self.statementhasDependencies(self.statements[guid]);

        // Remove the statement
        delete self.statements[guid];
        var index = self.findCommandPosition(guid, section);
        if (index >= 0) statementCollection.splice(index, 1);
        if (hasDependencies) self.removeSubmitDataStatement(statementCollection, section);
    },

    /*
    * Returns true if the command has any kind of dependency with other commands
    * Ex.. submitData exist only if there is a command execute-rule or refresh
    */
    statementhasDependencies: function (statement) {
        return (statement.command == "execute-rule" ||
                 statement.command == "refresh" ||
                 statement.command == "execute-interface" ||
                 statement.command == "execute-connector");
    },

    /*
    * if there aren't any command executeRule or refresh configurated in the current set of commands
    * then the submitData command is removed
    */
    removeSubmitDataStatement: function (statementCollection, section) {
        var self = this;

        var commands = $.grep(statementCollection, function (statement, _) {
            return statement.command == "execute-rule" ||
                   statement.command == "refresh" ||
                   statement.command == "execute-interface" ||
                   statement.command == "execute-connector";
        });

        var index = -1;
        if (commands.length === 0) {

            for (var i = 0; i < statementCollection.length; i++) {
                if (statementCollection[i].command == "submit-data") {
                    index = i;
                    break;
                }
            }

            if (index >= 0) self.removeStatement(statementCollection[index].guid, section);
        }

    },


    /*
    * Removes statement's attributes according to property 
    */
    removeAttributesStatement: function (statement, property, controlWithoutXpath) {

        // If the property is command, then nullify the xpath and the argument   
        if (property == "command") {
            delete statement.argument;
            delete statement.xpath;
            delete statement["xpathContainer"];
        }

        // if the control hasn't xpath property then remove it
        if (controlWithoutXpath) {
            delete statement.xpath;
        }

        if ((property == "command" || property == "xpath" || controlWithoutXpath) &&
            statement["propertyToUpdate"]) {
            delete statement[statement["propertyToUpdate"]];
            delete statement["propertyToUpdate"];
        }
    },

    /*  
    *   Changes the option for else action
    */
    updateElseAction: function (elseAction) {
        var self = this;
        var data = self.data;
        var currentElseAction = self.getElseAction();

        if (currentElseAction == elseAction) return;

        data.elseAction = elseAction;
        if (elseAction == "automatic") {
            data.elseCommands = undefined;
        }
        else {
            data.elseCommands = [];
        }
    },

    /*
    * Returns true if the current context is grid
    */
    isGridContext: function () {
        return (typeof this.context == "string" && this.context != "Form");
    },

    /*
    * Returns true if there are any column control, in current condition 
    */
    areThereGridAttributes: function () {
        var self = this;
        var result = false;

        if (bizagi.editor.utilities.isObject(self.data.conditions) && $.isArray(self.data.conditions.expressions)) {
            var expressions = self.data.conditions.expressions;
            for (var i = 0, l = expressions.length; i < l; i++) {
                var gridContainer = self.findGridContainer(expressions[i]);
                if (typeof gridContainer == "string") {
                    self.gridContainer = gridContainer;
                    result = true;
                    break;
                }
            }
        }

        return result;
    },

    /*
    * 
    */
    findGridContainer: function (expression) {
        var self = this;
        var gridContainer = null;

        if (expression.simple) {
            gridContainer = expression.simple.xpathContainer;
        } else if (expression.complex) {
            // Validate a complex expression
            if (expression.complex.conditions.expressions.length > 0) {
                for (var i = 0; i < expression.complex.conditions.expressions.length; i++) {
                    gridContainer = self.findGridContainer(expression.complex.conditions.expressions[i]);
                    if (typeof gridContainer == "string") {
                        break;
                    }
                }
            }
        }

        return gridContainer;
    },

    /*
    *
    */
    getGridContainer: function () {
        return this.gridContainer || null;
    },

    /*
    *   Validate the model
    */
    validate: function () {
        var self = this;
        var data = self.data;
        var result = self._super(self.Class.action);

        if (!result.isValid) { return result; }

        // Validate commands
        if (data.commands.length == 0) result.isValid = false;
        for (var j = 0; j < data.commands.length; j++) {
            result = self.validateCommand(data.commands[j]);
            if (!result.isValid) return result;
        }
        if (data.elseCommands) {
            for (var k = 0; k < data.elseCommands.length; k++) {
                result = self.validateCommand(data.elseCommands[k]);
                if (!result.isValid) return result;
            }
        }

        return result;
    },

    /*
    * Update current Context
    */
    updateContext: function (context) {
        var self = this;

        if (self.context != context) {
            self.context = context;
            self.cleanModel();
        }

    },

    /*
    * Cleans current data
    */
    cleanModel: function () {
        var self = this;


        self.data.commands = [];
        self.data.elseCommands = [];
        self.data.conditions.expressions = [];
        self.data.conditions.operator = "and";
        self.statements = {};
    },

    /*
    *   Validate a single command
    */
    validateCommand: function (command) {
        var self = this;

        var property = self.getStatementProperty(command.guid);

        if (self.fullModel.isOnlyCommand(command)) {
            return { isValid: true };
        }

        if (!self.fullModel.isOnlyArgument(command)) {
            if (command[property] == null || command[property].length == 0) return { isValid: false };
        }

        if (!self.fullModel.isUnaryCommand(command)) {
            if (command.argument == null || command.argument.length == 0) return { isValid: false };
        }

        return { isValid: true };
    },

    /*
    *   Finds the dependencies for the current action
    */
    findDependencies: function (expression, dependencies) {
        var self = this;
        if (expression.simple) {
            if (expression.simple.xpath) dependencies.push(expression.simple.xpath);
            if (expression.simple.propertyToUpdate) dependencies.push(expression.simple[expression.simple.propertyToUpdate]);
            if (expression.simple.argument && expression.simple.argumentType == "xpath") {
                var control = self.getControl(expression.simple.argument);
                if (control && control.baxpath) {
                    dependencies.push(control.baxpath);
                }
            }
        } else {
            // Validate a complex expression
            if (expression.complex.conditions.expressions.length > 0) {
                for (var i = 0; i < expression.complex.conditions.expressions.length; i++) {
                    self.findDependencies(expression.complex.conditions.expressions[i], dependencies);
                }
            }
        }
    },

    /*
    * Returns the current position of command in the collection 
    */
    findCommandPosition: function (guid, section) {
        var self = this;
        var data = self.data;
        var statementCollection = section == "then" ? data.commands : data.elseCommands;

        var index = -1;
        for (var i = 0, l = statementCollection.length; i < l; i++) {
            if (statementCollection[i].guid == guid) {
                index = i;
                break;
            }
        }

        return index;
    },


    /*
    * Sort current commands, depends of section 
    */
    sortCommands: function (params) {
        var self = this;
        var data = self.data;
        var statementCollection = params.section == "then" ? data.commands : data.elseCommands;

        statementCollection.move(params.initialPosition, params.finalPosition);

        if (self.statementhasDependencies(statementCollection[params.finalPosition])) self.moveSubmitDataStatement(statementCollection, params.finalPosition);
    },

    /*
    * The submitData command must always come before the commands execute-rule or refresh 
    */
    moveSubmitDataStatement: function (statementCollection, finalPosition) {
        var index = -1;
        for (var i = 0, l = statementCollection.length; i < l; i++) {
            if (statementCollection[i].command == "submit-data") {
                index = i;
                break;
            }
        }

        if (index > finalPosition) statementCollection.move(index, finalPosition);
    }

});


