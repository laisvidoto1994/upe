/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Entity Type
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for getentitytype protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getentitytype", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetEntityType";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        self.parameters.push(self.createParameterItem("EntityGuid", self.args.entityGuid));
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
            entityType: self.findKeyInParameters("entityType").value
        }
    }

    return result.success;
}
})