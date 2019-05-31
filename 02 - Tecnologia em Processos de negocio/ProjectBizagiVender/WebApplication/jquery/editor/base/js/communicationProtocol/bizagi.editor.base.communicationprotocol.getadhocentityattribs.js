bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getadhocentityattribs", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;
        self._super(data);
        self.actiontype = "GetAdhocEntityAttribs";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;
        self.parameters = self.args.parameters || [];
    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this, result = basAnswer.result;        
        if (result.success && result.parameters.length > 0) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("attributes");
            return JSON.parse(itemParameter.value);
        }
        return result.success;
    }

})