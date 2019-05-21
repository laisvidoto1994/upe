/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Form Display Name Value
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for getformdisplayname protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getformdisplayname", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetFormDisplayName";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];          
        self.parameters.push(self.createParameterItem("guidForm", self.args.guid));
              
    },
    /*
    callRestService: function (basRequest) {
        var self = this;

        return !self._editorInfo.isCloud() && self._ResourcesServices.getMultiResources(basRequest);

    },*/

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