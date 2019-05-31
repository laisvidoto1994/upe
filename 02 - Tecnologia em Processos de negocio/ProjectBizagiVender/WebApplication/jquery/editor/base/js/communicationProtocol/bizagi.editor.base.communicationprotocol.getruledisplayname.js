/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Attribute Display Name Value
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for displayatrib protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getruledisplayname", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetRuleDisplayName";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        var guidRule = (self.args.rule) ? bizagi.editor.utilities.resolveComplexReference(self.args.rule) : self.args.guid;
        self.parameters.push(self.createParameterItem("guidRule", guidRule));

    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;

        if (!result) return basAnswer;
        if (result.success) {
            self.answerParameters = result.parameters;
            return {
                displayName: self.findKeyInParameters("displayname").value
            };

        }

        return result.success;
    }

})