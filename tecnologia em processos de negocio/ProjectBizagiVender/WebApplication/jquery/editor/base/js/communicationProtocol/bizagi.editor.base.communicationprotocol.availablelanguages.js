/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Available Languages
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for availablelanguages protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.availablelanguages", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetAvailableLanguages";

    },

    processBasAnswer: function (basAnswer) {
        var result = basAnswer.result;

        if (result.success) {
            return result.parameters;
        }

        return result.success;
    }
})