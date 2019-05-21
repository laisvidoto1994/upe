/*
*   Name: BizAgi FormModeler Editor Communication Protocol Edit Nested Form
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for edit nested form protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.opennestedform", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "OpenNestedForm";
        self.refForm = self.args.refForm;
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];

        self.parameters.push(self.createParameterItem("id", self.refForm.baref.ref));
        self.parameters.push(self.createParameterItem("guidRender", self.args.idForm));
    }

})