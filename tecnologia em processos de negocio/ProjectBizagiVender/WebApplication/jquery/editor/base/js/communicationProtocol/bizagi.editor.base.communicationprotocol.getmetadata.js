/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Metadata
*   Author: 
*   Comments:
*   -   This script will define basic stuff for getmetadata protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getmetadata", {
    // Static properties
    context: /\.(\w+)$/
}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetMetadata";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];

        var match = this.Class.context.exec(self.args.xpath);
        var context = (match) ? match[1] : "";
        self.parameters.push(self.createParameterItem("context", context));
    },

    /*
    *   Process BAS answer 
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            itemParameter,
            result = basAnswer.result;

        if (!result) return basAnswer;
        if (result.success) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("data");
            return JSON.parse(itemParameter.value);
        }

        return result.success;
    }
})