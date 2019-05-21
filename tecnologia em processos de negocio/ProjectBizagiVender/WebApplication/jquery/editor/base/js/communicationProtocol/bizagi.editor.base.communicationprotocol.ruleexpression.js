/*
*   Name: BizAgi FormModeler Editor Communication Protocol Rule Expression
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for ruleexpression protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.ruleexpression", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.rule = self.args.data.rule || self.args.data;
        self.actiontype = "LoadExpression";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];

        // Add category type
        self.parameters.push(self.createParameterItem("categorytype", self.args.categorytype));

        if (!self.isNewExpression()) {
            // Add id parameter
            self.parameters.push(self.createParameterItem("id", self.rule.baref.ref));
        }

        if (self.args.idcontextentity) {
            self.parameters.push(self.createParameterItem("idcontextentity", self.args.idcontextentity));
        }
    },

    /*
    *   Check if actually exists an empty expression or not
    */
    isNewExpression: function () {
        var self = this;
        return (self.rule.baref.ref === "expression");
    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            itemParameter,
            args = self.args,
            result = basAnswer.result;

        if (result.success) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("id");

            if (bizagi.util.isEmpty(itemParameter.value)) { return { isEmpty: true }; }
           
            // Prepare result
            var displayName = (self.findKeyInParameters("displayname") && self.findKeyInParameters("displayname").value) || null;
            var ruleDefinition = (args.editor == "rule") ? bizagi.editor.utilities.buildComplexReference(itemParameter.value, displayName)
                                                         : self.buildRuleDefinition(itemParameter.value, displayName);
            return ruleDefinition;
        }       
    },

    /*
    *   Builds a complex rule definition
    */
    buildRuleDefinition: function (ruleExpression, displayName) {
        var expression = { rule: { baref: { ref: ruleExpression}} };
        if (displayName) { expression.rule.displayName = displayName; }
        return expression;
    }
})