/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Children Nodes
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for getChildrenNodes protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getchildrennodes", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "XpathNavigatorExpandLoad";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this,
            node = self.args.node;

        var xpath = node.xpath;
        if (node.isRootNode) {
            xpath = "";
        }

        self.parameters = [];        

        self.parameters.push(self.createParameterItem("contextScope", node.contextScope));
        self.parameters.push(self.createParameterItem("guid", node.guidRelatedEntity));
        self.parameters.push(self.createParameterItem("xpath", xpath));
        self.parameters.push(self.createParameterItem("style", node.style));
        self.parameters.push(self.createParameterItem("isScopeAttribute", node.isScopeAttribute));
        if (node.entityContext) self.parameters.push(self.createParameterItem("entityContext", node.entityContext));
        if (node.xpathAdhoc) self.parameters.push(self.createParameterItem("xpathAdhoc", node.xpathAdhoc));
    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;

        if (result.success) {
            self.answerParameters = result.parameters;
            return JSON.parse(self.findKeyInParameters("children").value);
        }

        return result.success;
    }    
})