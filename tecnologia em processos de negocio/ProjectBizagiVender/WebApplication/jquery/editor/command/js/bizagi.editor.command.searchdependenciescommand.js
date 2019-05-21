
/*
*   Name: BizAgi FormModeler Editor Search Dependencies Command
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for searchdependenciescommand
*/

bizagi.editor.notUndoableCommand.extend("bizagi.editor.searchDependenciesCommand", {}, {

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;
        var args = self.arguments;
        var actionValidationsModel = self.model.getActionValidationsModel();
        var context = self.controller.isGridContext() ? bizagi.editor.utilities.resolveComplexXpath(self.controller.getContextInfo().xpath) + "[]."
                                                      : "";

        self.actions = actionValidationsModel.actions;
        self.validations = actionValidationsModel.validations;
        self.mapXpath = actionValidationsModel.mapXpaths;

        if (!$.isArray(args.guids) && typeof args.guid == "string") {
            args.guids = [args.guid];
        }

        for (var i = 0; i < args.guids.length; i++) {

            var element = self.model.getElement(args.guids[i]);
            if (self.processElement(element, context)) { return true; }

        }

        args.result = { result: true };
        return true;

    },

    /*
    *   Checks is the element is related in actions & validations
    */
    processElement: function (element, context) {
        var self = this,
            args = self.arguments;

        context = context || "";

        if (!element) {
            return false;
        }

        var properties = element.properties;
        var xpath = self.xpath = context + bizagi.editor.utilities.resolveComplexXpath(properties.xpath);        

        if (self.isUniqueXpath(xpath)) {

            self.idElement = element.guid;
            var displayName = element.resolveDisplayNameProperty();

            if (!self.processActions()) {
                self.showMessage(displayName);
                args.result = { result: false, fail: "Actions" };
                return true;
            }

            if (!self.processValidations()) {
                self.showMessage(displayName);
                args.result = { result: false, fail: "Validations" };
                return true;
            }

            // Check if the current control has elements (grid) 
            if (element.elements) {
                for (var i = 0, l = element.elements.length; i < l; i++) {
                    if (self.processElement(element.elements[i], xpath + "[].")) { return true; }
                }
            }
        }

        return false;

    },


    /*
    * Search element in actions
    */
    processActions: function () {
        var self = this;

        for (var i = 0, l = self.actions.length; i < l; i++) {
            var action = self.actions[i];

            // Dependencies
            if (self.seachInDependencies(action.dependencies)) {
                return false;
            }

            // Commands
            if (self.searchInCommands(action.commands)) {
                return false;
            }

            // Else commands
            if (self.searchInCommands(action.elseCommands)) {
                return false;
            }
        }

        return true;
    },


    /*
    * Returns true is the xpath is the unique in the current form
    */
    isUniqueXpath: function (xpath) {
        var self = this;
        
        // don't apply if the element hasn't xpath assigned
        if (!xpath) return true;
        if (!self.mapXpath[xpath]) return true;

        var elements = self.mapXpath[xpath].elements;
        if (elements.length == 1) return true;

        var i = 0, length = elements.length, result = { form: 0, nestedForm: 0 }, element;
        for (; i < length;) {
            element = elements[i++];
            element.nestedForm ? result.nestedForm++ : result.form++;
        }
        if (result.form === 1) {
            return true;
        } else {
            return false;
        }

        // remove element
        elements.splice(0, 1);
        return false;

    },

    /*
    * Find out dependences with validations configurated
    */
    processValidations: function () {
        var self = this;

        for (var i = 0, l = self.validations.length; i < l; i++) {
            var validation = self.validations[i];
            if (self.searchInConditions(validation.conditions)) {

                return false;
            }
        }

        return true;

    },

    /*
    * Search element in dependecies
    */
    seachInDependencies: function (dependencies) {
        var self = this;
        var result = false;

        if (dependencies) {
            $.each(dependencies, function (_, value) {
                if (self.xpath === bizagi.editor.utilities.resolveComplexXpath(value)) {
                    result = true;
                    return false;
                }
                if (self.idElement === bizagi.editor.utilities.resolveComplexXpath(value)) {
                    result = true;
                    return false;
                }
            });
        }

        return result;
    },

    /*
    * Seach element in commands
    */
    searchInCommands: function (commands) {
        var self = this;
        var result = false;

        if (commands) {
            $.each(commands, function (_, command) {
                if (command.xpath && self.xpath === bizagi.editor.utilities.resolveComplexXpath(command.xpath)) {
                    result = true;
                    return false;
                }

                if (command.container && command.container === self.idElement) {
                    result = true;
                    return false;
                }
            });
        }

        return result;
    },

    /*
    * Search xpath in conditions
    */
    searchInConditions: function (conditions) {
        var self = this;
        var result = false;

        var expressions = conditions.expressions;
        $.each(expressions, function (_, expression) {
            if (expression.simple) {

                if (self.xpath === bizagi.editor.utilities.resolveComplexXpath(expression.simple.xpath)) {
                    result = true;
                    return false;
                }
            }
            else if (expression.complex) {
                return self.searchInConditions(expression.complex.conditions);
            }

        });
        return result;
    },

    /*
    * Show message 
    */
    showMessage: function (displayName) {
        var self = this;
        var massageTmpl = self.arguments.message;
        var message = bizagi.localization.getResource("formmodeler-command-searchdependencies-error").replace("{0}", displayName);
        if(massageTmpl){
            message = massageTmpl.replace("{0}", displayName);
        }

        bizagi.showMessageBox(message, "info", "info", false);
    }
});
