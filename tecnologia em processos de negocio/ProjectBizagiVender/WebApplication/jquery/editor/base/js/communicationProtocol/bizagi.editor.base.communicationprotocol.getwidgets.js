/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Widgets
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for getwidgets protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getwidgets", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetWidgets";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this;

        var result = basAnswer.result;
        if (result.success) {
            self.answerParameters = result.parameters;
            return self.findKeyInParameters("widgets") ? JSON.parse(self.findKeyInParameters("widgets").value) : false;
        }

        return result.success;
    }

})