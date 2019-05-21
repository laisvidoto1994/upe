/*
*   Name: BizAgi FormModeler Editor Communication Protocol Grid Validations
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for gridvalidations protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.documenttemplates", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "LoadDocumentTemplates";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        self.parameters.push(self.createParameterItem("append", self.args.append));
        self.parameters.push(self.createParameterItem("xpath", self.args.xpath));
        if (self.args.idContextEntity) { self.parameters.push(self.createParameterItem("idContextEntity", self.args.idContextEntity)); };
        if (self.args.groupmapping) { self.parameters.push(self.createParameterItem("groupmapping", bizagi.editor.utilities.resolveComplexReference(self.args.groupmapping))); };
    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            itemParameter,
            result = basAnswer.result;

        if (result.success) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("id");
            return itemParameter.value;
        }

        return result.success;
    }

})