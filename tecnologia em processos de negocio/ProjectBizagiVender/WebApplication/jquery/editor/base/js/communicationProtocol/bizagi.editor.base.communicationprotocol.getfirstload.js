/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get First Load
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for getFirstLoad protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getfirstload", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "XpathNavigatorFirstLoad";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        if (self.args.adhocProcessId) {
            self.parameters.push(self.createParameterItem("adhocProcessId", self.args.adhocProcessId));
        }
    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;

        if (result.success) {
            self.answerParameters = result.parameters;
            return JSON.parse(self.findKeyInParameters("root").value);
        }

        return result.success;
    }
    
})