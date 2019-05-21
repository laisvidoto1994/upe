/*
*   Name: BizAgi FormModeler Editor Communication Protocol Close Form 
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for closeform protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.closeform", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "CloseForm";

    }
})