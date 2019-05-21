/*
*   Name: BizAgi FormModeler Editor Communication Protocol openwidgetstore
*   Author: CarlosM
*   Comments:
*   -   This script will define basic stuff for gridvalidations protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.openwidgetstore", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "OpenWidgetstore";
    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
   
        var result = basAnswer.result;
        return result.success;
    }
})