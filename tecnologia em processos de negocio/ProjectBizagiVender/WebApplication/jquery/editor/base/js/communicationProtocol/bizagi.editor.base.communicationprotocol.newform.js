/*
*   Name: BizAgi FormModeler Editor Communication Protocol New Form 
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for newform protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.newform", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "CreateFormFromXpath";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this,
            node = self.args.node;

        self.parameters = [];
        
        self.parameters.push(self.createParameterItem("context", node.contextScope));
        self.parameters.push(self.createParameterItem("isScopeAttribute", node.isScopeAttribute));
        self.parameters.push(self.createParameterItem("idContextEntity", node.guidRelatedEntity));
        self.parameters.push(self.createParameterItem("guidForm", node.id));                
    }
})