/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Templates
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for gettemplates protocol
*   - returns a list od templates related with an entity
*   - example [{ guid: <guid>, displayName: <displayName>}]
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.gettemplates", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetTemplatesByEntity";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        self.parameters.push(self.createParameterItem("entityGuid", self.args.entityGuid));
        
    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
        result = basAnswer.result;
        
        if (result.success) {
            self.answerParameters = result.parameters;
            itemParameter = self.findKeyInParameters("templates");
            return JSON.parse(itemParameter.value);
        }

        return result.success;
    }

})