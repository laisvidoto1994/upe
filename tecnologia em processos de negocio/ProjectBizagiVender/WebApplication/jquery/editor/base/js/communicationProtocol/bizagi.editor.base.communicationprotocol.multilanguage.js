/*
*   Name: BizAgi FormModeler Editor Communication Protocol Multi Languajes
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for multilanguage protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.multilanguage", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "LoadLocalizationForm";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this,
            parameterItem;

        self.parameters = [];

        parameterItem = self.createParameterItem("values", bizagi.util.unicode2htmlencode(JSON.stringify(self.args.i18n)));
        self.parameters.push(parameterItem);

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
            itemParameter = self.findKeyInParameters("localization");
            return JSON.parse(itemParameter.value);
        }

        return result.success;
    }

})