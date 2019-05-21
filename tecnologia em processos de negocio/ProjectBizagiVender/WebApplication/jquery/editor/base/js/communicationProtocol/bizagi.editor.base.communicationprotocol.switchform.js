/*
*   Name: BizAgi FormModeler Editor Communication Protocol Switch Form
*   Author: Mauricio Sánchez
*   Comments:
*   -   This script will define basic stuff for switchform protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.switchform", {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "SwitchForm";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
    },


    /*
    *   Process BAS answer 
    */
    processBasAnswer: function (basAnswer) {
    }
})