/*
*   Name: BizAgi FormModeler Editor Communication Protocol Save Form 
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for saveform protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.saveform", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "SaveForm";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        self.parameters.push(self.createParameterItem("json", bizagi.util.unicode2htmlencode(JSON.stringify(self.args.jsonForm))));
        if (self.args.adhocTaskId || self.args.isAdhocSummaryForm) {
            self.parameters.push(self.createParameterItem("adhocTaskId", self.args.adhocTaskId));
            self.parameters.push(self.createParameterItem("adhocProcessId", self.args.adhocProcessId));
            self.parameters.push(self.createParameterItem("isAdhocSummaryForm", self.args.isAdhocSummaryForm));
        }
    }
})