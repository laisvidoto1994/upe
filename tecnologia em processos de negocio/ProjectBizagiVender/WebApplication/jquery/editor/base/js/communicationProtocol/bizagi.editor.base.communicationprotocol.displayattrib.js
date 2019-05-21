/*
*   Name: BizAgi FormModeler Editor Communication Protocol Display Attrib Value
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for displayatrib protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.displayattrib", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetDisplayAttrib";
        
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this,
            parameterItem;

        self.parameters = [];

        parameterItem = self.createParameterItem("xpath", self.args.xpath);
        self.parameters.push(parameterItem);

    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            itemParameter,
            result = basAnswer.result;

        if (!result) return basAnswer;
        if (result.success) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("values");
            return itemParameter.value;
        }

        return result.success;
    }

})