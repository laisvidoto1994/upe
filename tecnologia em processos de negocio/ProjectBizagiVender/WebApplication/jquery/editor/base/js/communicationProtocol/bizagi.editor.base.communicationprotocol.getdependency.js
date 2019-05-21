/*
*   Name: BizAgi FormModeler Editor Communication Protocol GetDependency
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for getdependency protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getdependency", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetDependency";

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
            return bizagi.util.parseBoolean(self.findKeyInParameters("canBeChanged").value);
        }

        return result.success;
    }




})