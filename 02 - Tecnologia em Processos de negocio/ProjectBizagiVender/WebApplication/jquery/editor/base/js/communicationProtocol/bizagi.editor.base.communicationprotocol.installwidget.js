/*
*   Name: BizAgi FormModeler Editor Communication Protocol installwidget
*   Author: CarlosM
*   Comments:
*   -   This script will define basic stuff for gridvalidations protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.installwidget", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "InstallWidget";
    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;
        return result.success;
    }
})