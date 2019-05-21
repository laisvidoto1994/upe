/*
*   Name: BizAgi FormModeler Editor Communication Protocol Relate Entity Values
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for relateEntityValues protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.relatedentity", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "LoadEntityValues";
        self.xpath = bizagi.editor.utilities.resolveComplexXpath(data.xpath);
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this,
            parameterItem;

        self.parameters = [];

        parameterItem = self.createParameterItem("xpath", self.replaceFilterCollectionInXpath());
        self.parameters.push(parameterItem);

    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            itemParameter;
        if (!basAnswer) return {};

        var result = basAnswer.result;
        if (result.success) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("values");
            return self.transformResult(JSON.parse(itemParameter.value));
        }

        return result.success;
    },


    replaceFilterCollectionInXpath: function () {
        var self = this;
        
        return self.args.xpath.replace("[]", "");
    },


    /*
    *   Helper to transform the result
    */
    transformResult: function (values) {
        var hash = {};

        for (var i = 0, l = values.length; i < l; i += 1) {
            hash[values[i].id] = values[i].displayName;
        }

        return hash;
    }

})