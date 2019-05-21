/*
*   Name: BizAgi FormModeler Editor Communication Protocol Set Use Offline as Online
*   Author: Mauricio Sánchez
*   Comments:
*   -   This script will define basic stuff for Set Use Offline as Online protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.setuseoffline", {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "SetUseOffline";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this,
            parameterItem;

        self.parameters = [];

        parameterItem = self.createParameterItem("value", self.args.value);
        self.parameters.push(parameterItem);
  
    },

    /*
    *   Process BAS answer 
    */
    processBasAnswer: function (basAnswer) {
        return basAnswer.result;
    }
})