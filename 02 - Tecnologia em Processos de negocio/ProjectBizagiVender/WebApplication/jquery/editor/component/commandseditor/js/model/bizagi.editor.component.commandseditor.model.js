/*
*   Name: BizAgi FormModeler Editor Commands Editor Model
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff to design actions and validations
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.commandseditor.model", {
    operators: {
        action: {
            "equals": { label: "formmodeler-component-commandseditor-operators-action-changes-to", appliesTo: ["string", "date", "number", "boolean", "entity"] },
            "not-equals": { label: "formmodeler-component-commandseditor-operators-action-different-to", appliesTo: ["string", "date", "number", "boolean", "entity"] },
            "less-than": { label: "formmodeler-component-commandseditor-operators-action-less-than", appliesTo: ["date", "number"] },
            "less-equals-than": { label: "formmodeler-component-commandseditor-operators-action-less-or-equal-than", appliesTo: ["date", "number"] },
            "greater-than": { label: "formmodeler-component-commandseditor-operators-action-greater-than", appliesTo: ["date", "number"] },
            "greater-equals-than": { label: "formmodeler-component-commandseditor-operators-action-greater-or-equal-than", appliesTo: ["date", "number"] },
            "like": { label: "formmodeler-component-commandseditor-operators-action-like", appliesTo: ["string"] },
            "is-empty": { label: "formmodeler-component-commandseditor-operators-action-is-empty", appliesTo: ["string", "date", "number", "boolean", "entity"], isUnary: true },
            "is-not-empty": { label: "formmodeler-component-commandseditor-operators-action-is-not-empty", appliesTo: ["string", "date", "number", "boolean", "entity"], isUnary: true },
            "is-true": { label: "formmodeler-component-commandseditor-operators-action-is-true", appliesTo: ["boolean"], isUnary: true },
            "is-false": { label: "formmodeler-component-commandseditor-operators-action-is-false", appliesTo: ["boolean"], isUnary: true },
            "does-not-contain": { label: "formmodeler-component-commandseditor-operators-action-does-not-contain", appliesTo: ["string"] },
            "contains": { label: "formmodeler-component-commandseditor-operators-action-contain", appliesTo: ["string"] },
            "begins-with": { label: "formmodeler-component-commandseditor-operators-action-begins-with", appliesTo: ["string"] },
            "does-not-begins-with": { label: "formmodeler-component-commandseditor-operators-action-does-not-begin-with", appliesTo: ["string"] },
            "file-uploaded": { label: "formmodeler-component-commandseditor-operators-action-has-a-file-uploaded", appliesTo: ["upload"], isUnary: true },
            "file-not-uploaded": { label: "formmodeler-component-commandseditor-operators-action-has-no-file-uploaded", appliesTo: ["upload"], isUnary: true },
            "is-invalid-email": { label: "formmodeler-component-commandseditor-operators-action-is-an-invalid-email", appliesTo: ["string"], isUnary: true },
            "letter-edited": { label: "formmodeler-component-commandseditor-operators-action-has-been-edited", appliesTo: ["letter"], isUnary: true },
            "letter-not-edited": { label: "formmodeler-component-commandseditor-operators-action-has-not-been-edited", appliesTo: ["letter"], isUnary: true },
            "changes": { label: "formmodeler-component-commandseditor-operators-action-has-changed", appliesTo: ["string", "date", "number", "boolean", "entity", "letter", "upload"], isUnary: true },
            "on-press": { label: "formmodeler-component-commandseditor-operators-action-on-click", appliesTo: ["button"], isUnary: true },
            "on-deleted-row": { label: "formmodeler-component-commandseditor-operators-action-on-deleted-row", appliesTo: ["collection"], isUnary: true }

        },
        validation: {
            "equals": { label: "formmodeler-component-commandseditor-operators-validation-is-equal-to", appliesTo: ["string", "date", "number", "boolean", "entity"] },
            "not-equals": { label: "formmodeler-component-commandseditor-operators-validation-is-not-equal-to", appliesTo: ["string", "date", "number", "boolean", "entity"] },
            "less-than": { label: "formmodeler-component-commandseditor-operators-validation-less-than", appliesTo: ["date", "number"] },
            "less-equals-than": { label: "formmodeler-component-commandseditor-operators-validation-less-or-equal-than", appliesTo: ["date", "number"] },
            "greater-than": { label: "formmodeler-component-commandseditor-operators-validation-greater-than", appliesTo: ["date", "number"] },
            "greater-equals-than": { label: "formmodeler-component-commandseditor-operators-validation-greater-or-equal-than", appliesTo: ["date", "number"] },
            "like": { label: "formmodeler-component-commandseditor-operators-validation-like", appliesTo: ["string"] },
            "is-empty": { label: "formmodeler-component-commandseditor-operators-validation-is-empty", appliesTo: ["string", "date", "number", "boolean", "entity"], isUnary: true },
            "is-not-empty": { label: "formmodeler-component-commandseditor-operators-validation-is-not-empty", appliesTo: ["string", "date", "number", "boolean", "entity"], isUnary: true },
            "is-true": { label: "formmodeler-component-commandseditor-operators-validation-is-true", appliesTo: ["boolean"], isUnary: true },
            "is-false": { label: "formmodeler-component-commandseditor-operators-validation-is-false", appliesTo: ["boolean"], isUnary: true },
            "begins-with": { label: "formmodeler-component-commandseditor-operators-validation-begins-with", appliesTo: ["string"] },
            "does-not-contain": { label: "formmodeler-component-commandseditor-operators-validation-does-not-contain", appliesTo: ["string"] },
            "contains": { label: "formmodeler-component-commandseditor-operators-validation-contain", appliesTo: ["string"] },
            "does-not-begins-with": { label: "formmodeler-component-commandseditor-operators-validation-does-not-begins-with", appliesTo: ["string"] },
            "file-uploaded": { label: "formmodeler-component-commandseditor-operators-validation-has-a-file-uploaded", appliesTo: ["upload"], isUnary: true },
            "file-not-uploaded": { label: "formmodeler-component-commandseditor-operators-validation-has-no-files-uploaded", appliesTo: ["upload"], isUnary: true },
            "is-invalid-email": { label: "formmodeler-component-commandseditor-operators-validation-invalid-email", appliesTo: ["string"], isUnary: true },
            "letter-edited": { label: "formmodeler-component-commandseditor-operators-validation-has-been-edited", appliesTo: ["letter"], isUnary: true },
            "letter-not-edited": { label: "formmodeler-component-commandseditor-operators-validation-has-not-been-edited", appliesTo: ["letter"], isUnary: true },
            "changes": { label: "formmodeler-component-commandseditor-operators-action-has-changed", appliesTo: ["string", "date", "number", "boolean", "entity", "letter", "upload"], isUnary: true },
            "on-press": { label: "formmodeler-component-commandseditor-operators-action-on-click", appliesTo: ["button"], isUnary: true },
            "on-deleted-row": { label: "formmodeler-component-commandseditor-operators-action-on-deleted-row", appliesTo: ["collection"], isUnary: true }
        }
    },
    logicOperators: {
        "and": "formmodeler-component-commandseditor-logicoperators-and",
        "or": "formmodeler-component-commandseditor-logicoperators-or"
    },
    actionCommands: {
        "background-color": { label: "formmodeler-component-commandseditor-actioncommands-set-background-color", appliesTo: ["render", "container"], exclude: ["nestedform"], type: "color", hasReverse: true },
        "forecolor": { label: "formmodeler-component-commandseditor-actioncommands-set-forecolor-color", appliesTo: ["render"], exclude: ["collection"], type: "color", hasReverse: true },
        "visible": { label: "formmodeler-component-commandseditor-actioncommands-changes-visibility-for", appliesTo: ["render", "container"], type: "boolean", hasReverse: true },
        "readonly": { label: "formmodeler-component-commandseditor-actioncommands-changes-editability-for", appliesTo: ["render", "container"], exclude: ["undefined", "button"], type: "boolean", hasReverse: true },
        "required": { label: "formmodeler-component-commandseditor-actioncommands-set-required-for", appliesTo: ["render"], exclude: ["collection", "undefined", "button","activityFlowButton"], type: "boolean", hasReverse: true },
        "set-value": { label: "formmodeler-component-commandseditor-actioncommands-set-value-for", appliesTo: ["render"], exclude: ["collection", "undefined", "button","activityFlowButton"], type: "argument", hasReverse: false },
        "set-min": { label: "formmodeler-component-commandseditor-actioncommands-set-minimum-value-for", appliesTo: ["render"], filterBy: ["number", "date"], type: "argument", hasReverse: false },
        "set-max": { label: "formmodeler-component-commandseditor-actioncommands-set-maximum-value-for", appliesTo: ["render"], filterBy: ["number", "date"], type: "argument", hasReverse: false },
        "collapse": { label: "formmodeler-component-commandseditor-actioncommands-collapse", appliesTo: ["container"], filterBy: ["group"], type: "boolean", hasReverse: true },
        "set-active": { label: "formmodeler-component-commandseditor-actioncommands-set-as-active", appliesTo: ["container"], filterBy: ["tabItem"], type: "boolean", hasReverse: false },
        "refresh": { label: "formmodeler-component-commandseditor-actioncommands-refresh", appliesTo: ["render", "container"],exclude: ["activityFlowButton"], isUnary: true, hasReverse: false },
        "execute-rule": { label: "formmodeler-component-commandseditor-actioncommands-execute-rule", appliesTo: ["render", "container"], isOnlyArgument: true, type: "rule", hasReverse: false },
        "execute-interface": { label: "formmodeler-component-commandseditor-actioncommands-execute-interface", appliesTo: ["render", "container"], isOnlyArgument: true, type: "interface", hasReverse: false },
        "execute-sap": { label: "formmodeler-component-commandseditor-actioncommands-execute-sap", appliesTo: ["render", "container"], isOnlyArgument: true, type: "sap", hasReverse: false },
        "execute-connector": { label: "formmodeler-component-commandseditor-actioncommands-execute-connector", appliesTo: ["render", "container"], isOnlyArgument: true, type: "connector", hasReverse: false },
        "submit-data": { label: "formmodeler-component-commandseditor-actioncommands-submit-data", appliesTo: ["render", "container"], isOnlyCommand: true, hasReverse: false, hidden: true },
        "clean-data": { label: "formmodeler-component-commandseditor-actioncommands-clean-data", appliesTo: ["render"], exclude: ["collection", "undefined", "button","activityFlowButton"], isUnary: true, hasReverse: false },
        "trigger-click":  { label: "formmodeler-component-commandseditor-actioncommands-trigger-click", appliesTo: ["render"], filterBy: ["activityFlowButton"], isUnary: true, hasReverse: true }
    },
    elseActions: {
        "actions": "formmodeler-component-commandseditor-elseactions-actions",
        "none": "formmodeler-component-commandseditor-elseactions-none",
        "automatic": "formmodeler-component-commandseditor-elseactions-automatic"
    }
}, {

    /*
    *   Cosntructor
    */
    init: function (data) {
        // Call base
        this._super();
        this.actions = {};
        this.validations = {};
        this.data = data;

        // Process data
        this.processData(data);

        // Initialize operators
        this.operators = this.Class.operators;

        // Initialize logic operators
        this.logicOperators = this.Class.logicOperators;

        // Initialize action commands
        this.actionCommands = this.Class.actionCommands;

        this.isReadOnly = (data.isReadOnly != "undefined") ? bizagi.util.parseBoolean(data.isReadOnly) : false;
    },

    /*
    *   Index the data in order to access mini-models
    */
    processData: function (data) {
        var self = this;
        var guid;

        // Index actions
        for (var i = 0; i < data.actions.length; i++) {
            var action = data.actions[i];

            // Resolve guid;
            if (action.guid) guid = action.guid;
            else action.guid = guid = Math.guid();

            // Create action model
            self.actions[guid] = action;
        }

        // Index validations
        for (var j = 0; j < data.validations.length; j++) {
            var validation = data.validations[j];

            // Resolve guid;
            if (validation.guid) guid = validation.guid;
            else validation.guid = guid = Math.guid();

            self.validations[guid] = validation;
        }
    },

    /*
    *   Returns the data model 
    */
    getDataModel: function () {
        var self = this;
        return self.data;
    },

    /*
    *   Returns a model for a simple action
    */
    getAction: function (guid) {
        var self = this;
        return self.actions[guid];
    },

    /*
    *   Return the current else acion
    */
    getElseActionType: function (action) {
        if (action.elseAction) return action.elseAction;

        // When there are no actions, try to guess
        return action.elseCommands ? (action.elseCommands.length > 0 ? "actions" : "none") : "automatic";
    },

    /*
    *   Returns a model for a simple validation
    */
    getValidation: function (guid) {
        var self = this;
        return self.validations[guid];
    },

    /*
    *   Returns the list of the available controls
    */
    getControls: function () {
        var self = this;
        return self.data.controls;
    },

    /*
    *   Returns a read-only model in order to work
    */
    getReadOnlyModel: function () {
        var self = this;
        var data = this.data;
        var roModel = { actions: [], validations: [], isReadOnly: self.isReadOnly };
        for (var i = 0; i < data.actions.length; i++) {
            roModel.actions.push(self.getReadOnlyAction(data.actions[i]));
        }

        // First process non inherent validations
        var j;
        for (j = 0; j < data.validations.length; j++) {
            if (!data.validations[j].inherent) {
                roModel.validations.push(self.getReadOnlyValidation(data.validations[j]));
            }
        }
        // Then process inherent validations in order to keep them down
        for (j = 0; j < data.validations.length; j++) {
            if (data.validations[j].inherent) {
                roModel.validations.push(self.getReadOnlyValidation(data.validations[j]));
            }
        }

        return roModel;
    },

    /*
    *   Returns a read-only model for an action
    */
    getReadOnlyAction: function (action) {
        var self = this;
        var elseAction = self.getElseActionType(action);

        action.isValid = true;

        var roAction = {
            guid: action.guid,
            conditions: { expressions: [] },
            commands: [],
            elseAction: { label: bizagi.localization.getResource(self.Class.elseActions[elseAction]), value: elseAction },
            elseCommands: (action.elseCommands ? [] : undefined),
            isReadOnly: self.isReadOnly
        };
        for (var i = 0; i < action.conditions.expressions.length; i++) {
            var logicOperator = (i > 0) ? self.getLogicOperatorName(action.conditions.operator) : null;
            var expression = self.getReadOnlyExpression(action.conditions.expressions[i], logicOperator, "action");
            action.isValid = action.isValid && expression.isValid;
            roAction.conditions.expressions.push(expression);
        }
        for (var j = 0; j < action.commands.length; j++) {
            var command = self.getReadOnlyCommand(action.commands[j]);
            action.isValid = action.isValid && command.isValid;
            roAction.commands.push(command);
        }
        if (action.elseCommands) {
            for (var k = 0; k < action.elseCommands.length; k++) {
                command = self.getReadOnlyCommand(action.elseCommands[k]);
                action.isValid = action.isValid && command.isValid;
                roAction.elseCommands.push(command);
            }
        }

        return roAction;
    },

    /*
    *   Returns a read-only model for a validation
    */
    getReadOnlyValidation: function (validation) {
        var self = this;

        validation.isValid = true;

        var roValidation = {
            guid: validation.guid,
            conditions: { expressions: [] },
            validationCommand: { message: bizagi.editor.utilities.resolveComplexLocalizable(validation.validationCommand.message) },
            inherent: validation.inherent || false,
            isReadOnly: self.isReadOnly
        };
        for (var i = 0; i < validation.conditions.expressions.length; i++) {
            var logicOperator = (i > 0) ? self.getLogicOperatorName(validation.conditions.operator) : null;
            var expression = self.getReadOnlyExpression(validation.conditions.expressions[i], logicOperator, "validation");
            validation.isValid = validation.isValid && expression.isValid;
            roValidation.conditions.expressions.push(expression);
        }

        return roValidation;
    },

    /*
    *   Returns a read-only model for an expression
    */
    getReadOnlyExpression: function (expression, logicOperator, type) {
        var self = this;

        var roExpression = {
            simple: (expression.simple ? {
                xpath: self.getXpathName(self.resolveXpath(self.getXpathExpression(expression.simple))),
                operator: self.getOperatorName(expression.simple.operator, type),
                argument: self.getArgumentName(expression.simple.argument, expression.simple.argumentType)
            } : null),
            complex: (expression.complex ? { conditions: { expressions: []}} : null),
            logicOperator: logicOperator,
            isValid: true
        };


        if (expression.simple) { roExpression.isValid = (typeof self.getControls()[self.resolveXpath(expression.simple.xpath)] === "object"); }

        if (expression.complex) {
            for (var i = 0; i < expression.complex.conditions.expressions.length; i++) {
                var innerLogicOperator = (i > 0) ? self.getLogicOperatorName(expression.complex.conditions.operator) : null;
                var expressionComplex = self.getReadOnlyExpression(expression.complex.conditions.expressions[i], innerLogicOperator, type);
                roExpression.complex.conditions.expressions.push(expressionComplex);
                roExpression.isValid = roExpression.isValid && expressionComplex.isValid;
            }
        }

        return roExpression;
    },

    /*
    *   Returns a read-only model for a command
    */
    getReadOnlyCommand: function (command) {
        var self = this;
        var roCommand = {
            xpath: self.getXpathName(self.resolveCommand(command)),
            command: self.getCommandName(command.command),
            argument: self.getArgumentName(command.argument, command.argumentType),
            isValid: (typeof self.getControls()[self.resolveXpath(command.xpath)] === "object"),
            isUnary: self.isUnaryCommand(command.command),
            isOnlyArgument: self.isOnlyArgument(command.command),
            isOnlyCommand: self.isOnlyCommand(command.command),
            hidden: self.isHiddenCommand(command.command)

        };

        return roCommand;
    },

    /*
    *   Resolves a logic operator's name
    */
    getLogicOperatorName: function (operator) {
        if (bizagi.util.isEmpty(operator)) return "";
        return bizagi.localization.getResource(this.logicOperators[operator]);
    },

    /*
    *   Resolves an operator's name for actions
    */
    getOperatorName: function (operator, type) {
        if ((typeof operator == 'undefined') || (bizagi.util.isEmpty(operator)) || (!this.operators[type][operator])) return "";
        return bizagi.localization.getResource(this.operators[type][operator].label);
    },

    /*
    *   Returns true if an operator is unary 
    */
    isUnaryOperator: function (operator, type) {
        if (bizagi.util.isEmpty(operator)) return false;
        return this.operators[type][operator] && (this.operators[type][operator].isUnary || false);
    },

    /*
    *   Returns true if a command is unary
    */
    isUnaryCommand: function (command) {
        //Command argument has two types: string and object
        if (command == null) return false;
        if (typeof command == "string" && command) return this.actionCommands[command].isUnary || false;
        if (typeof command == "object" && command.command) return this.actionCommands[command.command].isUnary || false;
        return false;
    },

    /*
    *   Returns true if a command is only command
    */
    isOnlyCommand: function (command) {
        //Command argument has two types: string and object
        if (command == null) return false;
        if (typeof command == "string" && command) return this.actionCommands[command].isOnlyCommand || false;
        if (typeof command == "object" && command.command) return this.actionCommands[command.command].isOnlyCommand || false;
        return false;
    },

    /*
    *   Returns true if a command is only argument
    */
    isOnlyArgument: function (command) {
        //Command argument has two types: string and object
        if (command == null) return false;
        if (typeof command == "string" && command) return this.actionCommands[command].isOnlyArgument || false;
        if (typeof command == "object" && command.command) return this.actionCommands[command.command].isOnlyArgument || false;
        return false;
    },

    /*
    * Returns true if the command isn't visible
    */
    isHiddenCommand: function (command) {

        if (command == null) return false;
        if (typeof command == "string" && command) return this.actionCommands[command].hidden || false;
        if (typeof command == "object" && command.command) return this.actionCommands[command.command].hidden || false;
        return false;
    },

    /*
    *   Resolves an xpath complex value
    */
    resolveXpath: function (xpathObject) {
        if (!xpathObject) return null;
        return bizagi.editor.utilities.resolveComplexXpath(xpathObject);
    },

    resolveCommand: function (data) {
        var self = this;

        if (data.xpath) { return self.resolveXpath(data.xpath); }
        if (data.propertyToUpdate) { return data[data.propertyToUpdate]; }
    },


    /*
    *   Resolves an xpath's name 
    */
    getXpathName: function (xpath) {
        if (bizagi.util.isEmpty(xpath)) return "";
        return this.data.controls[xpath] ? this.data.controls[xpath].label : "";
    },

    /*
    * If the control has xpath return it, else return control id
    */
    getXpathExpression: function (expression) {
        return expression.propertyToUpdate ? expression[expression.propertyToUpdate] : expression.xpath;
    },

    /*
    *   Resolves an xpath's object
    */
    getXpath: function (xpath) {
        if (bizagi.util.isEmpty(xpath)) return "";
        return this.data.controls[xpath];
    },

    /*
    *   Resolves an argument
    */
    getArgumentName: function (argument, argumentType) {

        if (argument === undefined || argument == null) return null;
        if (argumentType == "const" || argumentType == "entity") {
            if (argument !== undefined) {
                if (argument.label) return argument.label;
                return argument;
            }
        }

        return this.getXpathName(this.resolveXpath(argument));
    },

    /*
    *   Resolves a command
    */
    getCommandName: function (command) {
        if (bizagi.util.isEmpty(command) || (!this.actionCommands[command])) return "";
        return bizagi.localization.getResource(this.actionCommands[command].label);
    },

    /*
    *   Creates an empty action data model
    */
    createEmptyAction: function () {
        return {
            guid: Math.guid(),
            conditions: {
                operator: "and",
                expressions: []
            },
            commands: [],
            elseCommands: []
        };
    },


    /*
    *   Adds an action to the current model
    */
    addAction: function (guid, action) {
        var self = this;
        var data = self.data;

        // Append action
        data.actions.push(action);
        self.actions[guid] = action;
    },

    /*
    *   Updates an action
    */
    updateAction: function (guid, action) {
        var self = this;
        var data = self.data;

        // Find action
        for (var i = 0; i < data.actions.length; i++) {
            if (data.actions[i].guid == guid) {
                data.actions[i] = action;
            }
        }
        self.actions[guid] = action;
    },

    /*
    *   Creates an empty validation data model
    */
    createEmptyValidation: function () {
        var guid = Math.guid();

        return {
            guid: guid,
            conditions: {
                operator: "and",
                expressions: []
            },
            validationCommand: { message: bizagi.editor.utilities.buildComplexLocalizable("", guid, "message") }
        };
    },

    /*
     *   Changes state enabled to the actions into current model
     */
    changeActionStateEnabled: function(guid, enabled) {
        var self = this;
        var data = self.data;

        var index = -1;
        for (var i = 0; i < data.actions.length; i++) {
            if (data.actions[i].guid == guid) {
                index = i;
                break;
            }
        }
        if (index >= 0) data.actions[index].enabled = enabled;
    },

    /*
     *   Changes state enabled to all actions into current model
     */
    changeAllActionStateEnabled: function(enabled) {
        var self = this;
        var data = self.data;

        for (var i = 0; i < data.actions.length; i++) {
            data.actions[i].enabled = enabled;
        }
    },

    /*
     *   Changes state enabled to the validations into current model
     */
    changeValidationStateEnabled: function(guid, enabled) {
        var self = this;
        var data = self.data;

        // Remove the statement
        delete self.validations[guid];
        var index = -1;
        for (var i = 0; i < data.validations.length; i++) {
            if (data.validations[i].guid == guid) {
                index = i;
                break;
            }
        }
        if (index >= 0) data.validations[index].enabled = enabled;
    },

    /*
     *   Changes state enabled to all validations into current model
     */
    changeAllValidationStateEnabled: function(enabled) {
        var self = this;
        var data = self.data;

        for (var i = 0; i < data.validations.length; i++) {
            data.validations[i].enabled = enabled;
        }
    },


    /*
    *   Adds a validation to the current model
    */
    addValidation: function (guid, validation) {
        var self = this;
        var data = self.data;

        // Append action
        data.validations.push(validation);
        self.validations[guid] = validation;
    },

    /*
    *   Updates a validation
    */
    updateValidation: function (guid, validation) {
        var self = this;
        var data = self.data;

        // Find action
        for (var i = 0; i < data.validations.length; i++) {
            if (data.validations[i].guid == guid) {
                data.validations[i] = validation;
            }
        }
        self.validations[guid] = validation;
    },

    /*
    *   Delete an action
    */
    deleteAction: function (guid) {
        var self = this;
        var data = self.data;

        // Remove the statement
        delete self.actions[guid];
        var index = -1;
        for (var i = 0; i < data.actions.length; i++) {
            if (data.actions[i].guid == guid) {
                index = i;
                break;
            }
        }
        if (index >= 0) data.actions.splice(index, 1);
    },

    /*
    *   Delete a validation
    */
    deleteValidation: function (guid) {
        var self = this;
        var data = self.data;

        // Remove the statement
        delete self.validations[guid];
        var index = -1;
        for (var i = 0; i < data.validations.length; i++) {
            if (data.validations[i].guid == guid) {
                index = i;
                break;
            }
        }
        if (index >= 0) data.validations.splice(index, 1);
    },

    /*
    *   Reviews the model and placed a flag if the action or validation is invalid
    */
    getInvalidElements: function () {
        var self = this;

        self.getReadOnlyModel();
        return {
            actions: $.grep(self.data.actions, function (action, _) {
                return (!action.isValid);
            }),

            validations: $.grep(self.data.validations, function (validation, _) {
                return (!validation.isValid);
            })
        };
    },
    /*
     *Move action up
     */
    moveActionUp: function (guid) {
        var self = this;
        var data = self.data;
        var index = -1;
        for (var i = 0; i < data.actions.length; i++) {
            if (data.actions[i].guid == guid) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            var element = data.actions[index];
            data.actions.splice(index, 1);
            data.actions.splice(index - 1, 0, element);
        }
    },
    /*
     *Move action down
     */
    moveActionDown: function (guid) {
        var self = this;
        var data = self.data;
        var index = -1;
        for (var i = 0; i < data.actions.length; i++) {
            if (data.actions[i].guid == guid) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            var element = data.actions[index];
            data.actions.splice(index, 1);
            data.actions.splice(index + 1, 0, element);
        }
    },
    /*
     *Move validation up
     */
    moveValidationUp: function (guid) {
        var self = this;
        var data = self.data;
        var index = -1;
        for (var i = 0; i < data.validations.length; i++) {
            if (data.validations[i].guid == guid) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            var element = data.validations[index];
            data.validations.splice(index, 1);
            data.validations.splice(index - 1, 0, element);
        }
    },
    /*
     *Move validation down
     */
    moveValidationDown: function (guid) {
        var self = this;
        var data = self.data;
        var index = -1;
        for (var i = 0; i < data.validations.length; i++) {
            if (data.validations[i].guid == guid) {
                index = i;
                break;
            }
        }
        if (index >= 0) {
            var element = data.validations[index];
            data.validations.splice(index, 1);
            data.validations.splice(index + 1, 0, element);
        }
    }

});