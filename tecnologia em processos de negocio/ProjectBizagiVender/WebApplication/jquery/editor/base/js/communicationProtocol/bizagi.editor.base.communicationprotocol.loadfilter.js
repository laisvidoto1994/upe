/*
*   Name: BizAgi FormModeler Editor Communication Protocol Load Filter
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for load filter protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.loadfilter", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "LoadFilterEditor";
        self.bafilter = self.args.data.bafilter;
        self.xpathNode = self.args.xpathNode;
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this,
            parameterFilter,
            parameterItem;

        self.parameters = [];

        if (!self.isNewExpression()) {
            parameterFilter = self.createParameterItem("filter", bizagi.util.unicode2htmlencode(self.bafilter.filter));
            self.parameters.push(parameterFilter);
        }
        
        if (self.args.idcontextentity) { self.parameters.push(self.createParameterItem("idcontextentity", self.args.idcontextentity)); }

        parameterItem = self.createParameterItem("idrelatedentity", self.xpathNode.guidRelatedEntity);
        self.parameters.push(parameterItem);
    },

    /*
    *   Check if actually exists an empty expression or not
    */
    isNewExpression: function () {
        var self = this;

        if (self.bafilter.filter === "filter") return true;
        return false;
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
            itemParameter = self.findKeyInParameters("filter");
            if (bizagi.util.isEmpty(itemParameter.value)) { return { isEmpty: true }; }
            return itemParameter.value;
        }

        return result.success;
    }
})