/*
*   Name: BizAgi FormModeler Base Editor Model
*   Author: Diego Parra
*   Comments:
*   -   This script will define the base underground model used to design an action or a validation
*/

bizagi.editor.observableClass.extend("bizagi.editor.component.baseeditor.model", {

    argumentTypes: {
        "const": "formmodeler-component-commandseditor-argumenttype-constant",
        "xpath": "formmodeler-component-commandseditor-argumenttype-xpath"
    }


}, {

    /*
    *   Cosntructor
    */
    init: function (data, fullModel) {
        // Initialize logic operators
        this.logicOperators = bizagi.editor.component.commandseditor.model.logicOperators;

        // Save data
        this.data = data;

        // Save reference to full model
        this.fullModel = fullModel;

        // Create some indexes
        this.expressions = {};
    },

    /*
    *   Resolves an xpath complex value
    */
    resolveXpath: function (xpathObject) {
        return this.fullModel.resolveXpath(xpathObject);
    },


    /*
    *   Resolves an command
    */
    resolveCommand: function (command) {
        return this.fullModel.resolveCommand(command);
    },

    /*
    * Gets the name of property to update
    */
    getPropertyToUpdate: function (key) {
        var self = this;

        var property = "xpath";
        var data = self.fullModel.data.controls[key];
        if (data && data.propertyToUpdate) { property = data.propertyToUpdate; }

        return property;

    },

    /*
    *   Returns the data model
    */
    getData: function () {
        return this.data;
    },

    /*
    *   Returns a single control object
    */
    getControl: function (xpath) {
        if (!xpath) return null;
        xpath = bizagi.editor.utilities.resolveComplexXpath(xpath);
        var controls = this.fullModel.getControls();
        return controls[xpath];
    },

    /*
    *   Returns the list of the available controls
    */
    getControls: function (params) {
        var controls = this.fullModel.getControls();
        var result = {};
        params = params || {};
        var allowRenders = params.appliesToRender || false;
        var allowContainers = params.appliesToContainer || false;
        var allowedTypes = params.filterBy || null;
        var excludeTypes = params.exclude || null;
        var checkContext = params.checkContext || false;
        var checkGridContainer = false;
        var filterByRelatedEntity = params.filterByRelatedEntity || false;
        var relatedEntity = null;

        if (filterByRelatedEntity) {
            relatedEntity = params.relatedEntity;
        }
        
        if (params.checkGridContainer) {
            checkGridContainer = this.areThereGridAttributes();
        }
       
        for (var key in controls) {
            var control = controls[key];
            var isRender = control.render;
            var isContainer = control.container;
            var type = control.type;
            var xpathContainer = control.xpathContainer;
            var canAdd = false;

            // Set acceptance conditions
            if (allowRenders && isRender) canAdd = true;
            if (allowContainers && isContainer) canAdd = true;
            if (allowedTypes) {
                canAdd = false;
                for (var i = 0; i < allowedTypes.length; i++) {
                    if (allowedTypes[i] == type) {
                        canAdd = true;
                        break;
                    }
                }
            }

            if (canAdd && excludeTypes) {
                for (i = 0; i < excludeTypes.length; i++) {
                    if (excludeTypes[i] == type) {
                        canAdd = false;
                        break;
                    }
                }
            }

            /*
            if (canAdd && checkGridContainer) {
               if (xpathContainer !== this.getGridContainer()) { canAdd = false; }
            }
            */

            if (canAdd && checkContext && this.isGridContext()) {
                var xpathContext = this.getContextAction();
                if (xpathContainer !== xpathContext.value) { canAdd = false; }
            }

            if (canAdd) {
                if (filterByRelatedEntity) {
                    if (relatedEntity === control.relatedEntity) {
                        result[key] = {
                            label: controls[key].label,
                            type: controls[key].controlType,
                            style: controls[key].style
                        };
                    }
                } else {
                    result[key] = {
                        label: controls[key].label,
                        type: controls[key].controlType,
                        style: controls[key].style
                    };
                }
            }
        }

        return result;
    },

    /*
    *   Returns the list of the available operators
    */
    getOperators: function (guid) {
        var self = this;
        var result = {};

        // Retrieve expression
        var type = self.getExpressionType(guid);

        // TODO: Cache this?
        for (var key in self.operators) {
            var isValid = false;
            var operator = self.operators[key];
            for (var i = 0; i < operator.appliesTo.length; i++) {
                if (operator.appliesTo[i] == type) {
                    isValid = true;
                    break;
                }
            }
            if (isValid) {
                result[key] = bizagi.localization.getResource(operator.label);
            }
        }

        return result;
    },

    /*
    *   Return the available logic operators
    */
    getLogicOperators: function () {
        var self = this;
        var result = {};
        for (var key in self.logicOperators) {
            var logicOperator = self.logicOperators[key];
            result[key] = bizagi.localization.getResource(logicOperator);
        }

        return result;
    },

    /*
    *   Return the current logic operator
    */
    getLogicOperator: function (parentExpressionGuid) {
        var self = this;
        var data = self.data;
        return parentExpressionGuid ?
                    self.expressions[parentExpressionGuid].complex.conditions.operator :
                    data.conditions.operator;
    },

    /*
    *   Return an indexed expression
    */
    getExpression: function (guid) {
        return this.expressions[guid].simple;
    },

    /*
    *   Return the expression current type (data type)
    */
    getExpressionType: function (guid) {
        var self = this;
        var expression = self.expressions[guid];

        return self.fullModel.getXpath(self.resolveXpath(self.getXpathExpression(expression.simple))).type;
    },

    /*
    *   Get view model
    */
    getViewModel: function () {
        var self = this;
        var data = self.data;

        var viewModel = {
            hasErrors: !self.validate(),
            guid: data.guid,
            conditions: { expressions: [] }
        };
        for (var i = 0; i < data.conditions.expressions.length; i++) {
            var logicOperator = (i > 0) ? self.fullModel.getLogicOperatorName(data.conditions.operator) : null;
            viewModel.conditions.expressions.push(self.getViewExpression(data.conditions.expressions[i], null, logicOperator));
        }

        return viewModel;
    },

    /*
    *   Returns the model for an expression
    */
    getViewExpression: function (data, parentGuid, logicOperator) {
        var self = this;

        // Set a guid in order to index the expression
        data.guid = data.guid || Math.guid();
        self.expressions[data.guid] = data;

        var expression = {
            simple: (data.simple ? {
                xpath: {
                    label: self.fullModel.getXpathName(self.resolveXpath(self.getXpathExpression(data.simple))),
                    value: self.resolveXpath(data.simple.xpath)
                },
                operator: {
                    label: self.getOperatorName(data.simple.operator),
                    value: data.simple.operator,
                    isUnary: self.isUnaryOperator(data.simple.operator)
                },
                argument: {
                    label: self.fullModel.getArgumentName(data.simple.argument, data.simple.argumentType),
                    value: (data.simple.argument && data.simple.argument.value ? data.simple.argument.value : data.simple.argument)
                },
                argumentType: data.simple.argumentType
            } : null),
            complex: (data.complex ? { conditions: { expressions: []}} : null),
            logicOperator: logicOperator,
            parentGuid: parentGuid,
            guid: data.guid
        };

        if (data.complex) {
            for (var i = 0; i < data.complex.conditions.expressions.length; i++) {
                var innerLogicOperator = (i > 0) ? self.fullModel.getLogicOperatorName(data.complex.conditions.operator) : null;
                expression.complex.conditions.expressions.push(self.getViewExpression(data.complex.conditions.expressions[i], data.guid, innerLogicOperator));
            }
        }

        return expression;
    },

    /*
    * If the control has xpath return it, else return control id
    */
    getXpathExpression: function (expression) {
        return this.fullModel.getXpathExpression(expression);
    },

    /*
    *   Returns the operator name
    */
    getOperatorName: function (operator) {
        return bizagi.localization.getResource(this.fullModel.getOperatorName(operator, "action"));
    },

    /*
    * Returns current xpath container
    */
    getXpathContainer: function () {
        return this.xpathContainer || null;
    },

    /*
    *   Is unary operator
    */
    isUnaryOperator: function (operator) {
        return this.fullModel.isUnaryOperator(operator, "action");
    },

    /*
    * Returns true if the current text is a grid
    */
    isGridContext: function () {
        return false;
    },

    /*
    * Returns true if there are any column control, in current condition 
    */
    areThereGridAttributes: function () {
        return false;
    },

    /*
    *   Update an expression data
    */
    updateExpression: function (guid, property, value, controlWithoutXpath) {
        var self = this;
        var expression = self.expressions[guid];


        if (property == "xpath") {
            // Controls with xpath, ex. text, combos, etc
            var control = self.getControl(value);
            expression.simple[property] = control.baxpath;
            expression.simple.xpathContainer = control.xpathContainer;

            // If the property is xpath, then nullify the operator and argument   
            delete expression.simple.operator;
            delete expression.simple.argument;

            // if the attribute propertyToUpdate is available then nullify it
            if (expression.simple.propertyToUpdate) {
                delete expression.simple[expression.simple.propertyToUpdate];
                delete expression.simple.propertyToUpdate;
            }

        } else if (controlWithoutXpath) {
            // Controls wihtout xpath, ex. buttons, containers

            control = self.getControl(value);
            expression.simple[property] = control[property];
            expression.simple.propertyToUpdate = property;

            delete expression.simple.operator;
            delete expression.simple.argument;
            delete expression.simple.xpath;
        } else {
            // Any other properties like operator
            expression.simple[property] = value;
        }
    },

    /*
    *   Updates the current logic operator
    */
    updateLogicOperator: function (parentExpressionGuid, value) {
        var self = this;
        var data = self.data;
        var parentExpression = parentExpressionGuid ?
                               self.expressions[parentExpressionGuid].complex.conditions :
                               data.conditions;

        parentExpression.operator = value;
    },

    /*
    *   Add an expression
    */
    addExpression: function (parentExpressionGuid) {
        var self = this;
        var data = self.data;
        var parentExpression = parentExpressionGuid ?
                               self.expressions[parentExpressionGuid].complex.conditions.expressions :
                               data.conditions.expressions;

        // Add the new expression
        var guid = Math.guid();
        var expression = { simple: { operator: null, xpath: null, argument: null, argumentType: "const", guid: guid} };
        parentExpression.push(expression);
        self.expressions[guid] = expression;
    },

    /*
    *   Add a complex expression
    */
    addComplexExpression: function (parentExpressionGuid) {
        var self = this;
        var data = self.data;
        var parentExpression = parentExpressionGuid ?
                               self.expressions[parentExpressionGuid].complex.conditions.expressions :
                               data.conditions.expressions;

        // Add the new expression
        var guid = Math.guid();
        var expression = { complex: {
            conditions: {
                operator: "and",
                expressions: [
                                    { simple: { operator: null, xpath: null, argument: null, argumentType: "const", guid: guid} }
                                ]
            }
        }
        };
        parentExpression.push(expression);
        self.expressions[guid] = expression;
    },

    /*
    *   Remove an expression
    */
    removeExpression: function (guid, parentExpressionGuid) {
        var self = this;
        var data = self.data;
        var parentExpression = parentExpressionGuid ?
                               self.expressions[parentExpressionGuid].complex.conditions.expressions :
                               data.conditions.expressions;

        // Remove the expression
        delete self.expressions[guid];
        var index = -1;
        for (var i = 0; i < parentExpression.length; i++) {
            if (parentExpression[i].guid == guid) {
                index = i;
                break;
            }
        }
        if (index >= 0) parentExpression.splice(index, 1);
    },

    /*
    * Updates current xpath container
    */
    setXpathContainer: function (value) {
        this.xpathContainer = value;
    },

    /*
    *   Validate the model
    */
    validate: function (action) {
        var self = this;
        var data = self.data;
        var result = { isValid: true };

        // Initialize xpath container
        self.setXpathContainer(null);

        // Validate expressions
        if (data.conditions.expressions.length == 0) return false;
        for (var i = 0; i < data.conditions.expressions.length; i++) {
            result = self.validateExpression(data.conditions.expressions[i], action);
            if (!result.isValid) return result;
        }

        return result;
    },

    /*
    *   Validate a single expression
    */
    validateExpression: function (expression, action) {
        var self = this;
        var xpathContainer = self.getXpathContainer();
        var result = { isValid: true };

        if (expression.simple) {

            var xpath = self.getXpathExpression(expression.simple);
            // Validate a single expression
            if (xpath == null || xpath.length == 0) return { isValid: false };
            if (expression.simple.operator == null || expression.simple.operator.length == 0) return { isValid: false };

            if (!self.fullModel.isUnaryOperator(expression.simple.operator, action)) {
                if (expression.simple.argument == null || expression.simple.argument.length == 0) return { isValid: false };
            }

            // if there are attributes of grid, validates that these are the same. 
            xpathContainer = (xpathContainer == null) ? expression.simple.xpathContainer || null : xpathContainer;
            if (xpathContainer != null && expression.simple.xpathContainer != null && xpathContainer !== expression.simple.xpathContainer) {
                return { isValid: false, message: bizagi.localization.getResource("formmodeler-component-commandseditor-validate-invalidcondition") };
            }

            // Update xpath container
            self.setXpathContainer(xpathContainer);

        } else {
            // Validate a complex expression
            if (expression.complex.conditions.expressions.length == 0) return { isValid: false };
            for (var i = 0; i < expression.complex.conditions.expressions.length; i++) {
                result = self.validateExpression(expression.complex.conditions.expressions[i], action);
                if (!result.isValid) return { isValid: false };
            }
        }
        return result;
    }


});


