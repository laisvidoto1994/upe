/*
*   Name: BizAgi FormModeler Validation Editor Model
*   Author: Diego Parra
*   Comments:
*   -   This script will define the underground model used to design a validation
*/

bizagi.editor.component.baseeditor.model.extend("bizagi.editor.component.validationeditor.model", {

    action: "validation"

}, {

    /*
    *   Cosntructor
    */
    init: function (data, fullModel) {

        // Call base
        this._super(data, fullModel);

        // Initialize operators
        this.operators = bizagi.editor.component.commandseditor.model.operators.validation;
    },

    /*
    *   Get view model
    */
    getViewModel: function () {
        var self = this;
        var data = self.data;

        var validation = $.extend(self._super(), {
            message: bizagi.editor.utilities.resolveComplexLocalizable(data.validationCommand.message)
        });

        return validation;
    },

    /*
    *   Get the validation message
    */
    getMessage: function () {
        var self = this;
        var data = self.data;

        return data.validationCommand.message;
    },

    /*
    *   Update the validation message
    */
    updateMessage: function (value) {
        var self = this;
        var data = self.data;

        if (typeof value === "object" && value["i18n"]) {
            data.validationCommand.message = value;
        } else {
            data.validationCommand.message["i18n"]["default"] = value;
        }

    },

    /*
    *   Returns the operator name
    */
    getOperatorName: function (operator) {
        return this.fullModel.getOperatorName(operator, "validation");
    },

    /*
    *   Is unary operator
    */
    isUnaryOperator: function (operator) {
        return this.fullModel.isUnaryOperator(operator, "validation");
    },

    /*
    *   Validate the model
    */
    validate: function () {
        var self = this;
        var data = self.data;
        var result = self._super(self.Class.action);

        if (!result.isValid) { return result; }

        var message = bizagi.editor.utilities.resolveComplexLocalizable(data.validationCommand.message);

        // Validate message
        if (message == null || message.length == 0) result.isValid = false;

        return result;
    }




});


