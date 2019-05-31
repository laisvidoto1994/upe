/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Layouts Definitions
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for getLayoutsDefinitions protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getlayoutsdefinitions", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetLayoutDefinitions";
    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;

        if (result.success) {
            self.answerParameters = result.parameters;
            return JSON.parse(self.findKeyInParameters("layouts").value);
        }

        return result.success;
    }
    
})