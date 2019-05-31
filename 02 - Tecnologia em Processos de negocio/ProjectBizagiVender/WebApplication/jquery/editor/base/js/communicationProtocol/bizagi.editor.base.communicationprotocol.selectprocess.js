/*
*   Name: BizAgi FormModeler Editor Communication Protocol Select Process
*   Author: Andrés Fernando Muñoz
*   Comments:
*   -   This script will define basic stuff for selectprocess protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.selectprocess", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "SelectProcess";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;
    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
         var self = this;
    }

})