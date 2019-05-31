/*
*   Name: BizAgi FormModeler Editor Communication Protocol Open Form 
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for openform protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.openform", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "OpenForm";

    },

    /*
    *   Builds the request
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        self.parameters.push(self.createParameterItem("id", self.args.idform ));
        
    }
})