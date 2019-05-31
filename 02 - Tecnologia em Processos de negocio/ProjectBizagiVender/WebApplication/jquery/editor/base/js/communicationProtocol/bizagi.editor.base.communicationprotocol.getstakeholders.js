/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get stakeholders
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for getstakeholders protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getstakeholders", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetStakeHolders";

    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
        result = basAnswer.result;
        
        if (result.success) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("stakeholders");
            return JSON.parse(itemParameter.value);
        }

        return result.success;
    }

})