/*
*   Name: BizAgi FormModeler Editor Communication Protocol Load Template
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for load template protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.loadtemplate", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.template = self.args.template;
        self.actiontype = "LoadTemplate";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];

        if (!self.isNewTemplate()) {
            self.parameters.push(self.createParameterItem("id", self.template.baref.ref));
        }
    },


    /*
    *   Check if actually exists an empty expression or not
    */
    isNewTemplate: function () {
        var self = this;

        return (self.template.baref.ref === "template");
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

            if (bizagi.util.isEmpty(itemParameter.value)) { return { isEmpty: true }; }

            // Prepare result

            return bizagi.editor.utilities.buildComplexReference(itemParameter.value);

        }

        return result.sucess;
    }

})