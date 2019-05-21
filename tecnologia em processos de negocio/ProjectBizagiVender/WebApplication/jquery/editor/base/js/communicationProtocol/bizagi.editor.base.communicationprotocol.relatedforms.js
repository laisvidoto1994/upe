/*
*   Name: BizAgi FormModeler Editor Communication Protocol Related Forms Values
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for relatedForms protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.relatedforms", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetReleatedEntityForms";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];

        if (self.args.xpath) { self.parameters.push(self.createParameterItem("xpath", self.args.xpath)); };
        if (self.args.relatedEntity) { self.parameters.push(self.createParameterItem("relatedEntity", self.args.relatedEntity)); }
        if (self.args.isScopeAttribute) { self.parameters.push(self.createParameterItem("isScopeAttribute", self.args.isScopeAttribute)); }
        self.parameters.push(self.createParameterItem("context", self.args.context));

    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            itemParameter,
            result = basAnswer.result;

        if (!result) return basAnswer;
        if (result.success) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("forms");
            return JSON.parse(itemParameter.value);
        }

        return result.success;
    }

})