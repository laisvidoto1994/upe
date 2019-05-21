/*
*   Name: BizAgi FormModeler Editor Communication Protocol Verify Letters
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for verifyletters protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.verifyletters", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "VerifyLetters";

    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;

        if (result.success) {
            self.answerParameters = result.parameters;
            var hasLetterParameter = bizagi.util.parseBoolean(self.findKeyInParameters("hasLetters").value);
            if (hasLetterParameter === undefined || hasLetterParameter === null) { hasLetterParameter = true; }
            return { letter: !hasLetterParameter, columnletter: !hasLetterParameter };
        }

        return result.success;
    }

})