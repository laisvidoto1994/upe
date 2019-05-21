bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getpredefinedvalues", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetPredefinedValues";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        self.parameters.push(self.createParameterItem("adhocProcessId", self.args.adhocProcessId));
        self.parameters.push(self.createParameterItem("property", self.args.property));
    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
        result = basAnswer.result;
        
        if (result.success && result.parameters.length > 0) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("predefinedValues");
            return itemParameter.value;
        }

        return result.success;
    }

})