/*
*   Name: BizAgi FormModeler Editor Communication Protocol Grid Validations
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for gridvalidations protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.gridvalidations", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "LoadGridValidations";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        self.parameters.push(self.createParameterItem("xpath", self.args.xpath));
        self.parameters.push(self.createParameterItem("guidRender", self.args.guidRender));

        if ( bizagi.editor.utilities.isObject(self.args.gridValidations) && self.args.gridValidations.validations) {
            self.parameters.push(self.createParameterItem("validations", bizagi.util.unicode2htmlencode(JSON.stringify(self.args.gridValidations))));    
        }
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
            var itemParameter = self.findKeyInParameters("validations");
            return JSON.parse(itemParameter.value);
        }

        return result.success;
    }

})