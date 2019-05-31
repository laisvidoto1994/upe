

/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Parent Entities
*   Author: Diego Parra
*   Comments:
*   -   This script will define basic stuff for getparententities protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getparententities", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetParentEntities";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this,
            parameterItem;

        self.parameters = [];
        self.parameters.push(self.createParameterItem("id", self.args.id));
        self.parameters.push(self.createParameterItem("xpath", self.args.xpath));       

    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            itemParameter;
        if (!basAnswer) return {};

        var result = basAnswer.result;
        if (result.success) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("values");

            if (bizagi.util.isEmpty(itemParameter.value)) { return { isEmpty: true }; }

            return JSON.parse(itemParameter.value);
        }

        return result.success;
    }

})