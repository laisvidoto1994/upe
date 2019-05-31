/*
*   Name: BizAgi FormModeler Editor Communication Protocol Create Form 
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for createform protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.createform", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "CreateForm";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];

        if (self.args.xpath) { self.parameters.push(self.createParameterItem("xpath", self.args.xpath)); };
        if (self.args.relatedEntity) { self.parameters.push(self.createParameterItem("relatedEntity", self.args.relatedEntity)); };
        if (self.args.isScopeAttribute) { self.parameters.push(self.createParameterItem("isScopeAttribute", self.args.isScopeAttribute)); };
        if (self.args.showForm) { self.parameters.push(self.createParameterItem("showForm", self.args.showForm)); };
        self.parameters.push(self.createParameterItem("guidRender", self.args.guid));
        self.parameters.push(self.createParameterItem("propertyName", self.args.propertyName));
        self.parameters.push(self.createParameterItem("context", self.args.context));
    }
        
})