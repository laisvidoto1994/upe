

/*
*   Name: BizAgi FormModeler Editor Communication Protocol Show Wizard Templates
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for showwizardtemplates protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.showwizardtemplates", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "OpenWizardTemplates";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this,
            args = self.args,
            parameterItem;

        self.parameters = [];

        if (args.xpath) { self.parameters.push(self.createParameterItem("xpath", args.xpath)); };
        if (args.relatedEntity) { self.parameters.push(self.createParameterItem("relatedEntity", args.relatedEntity)); };
        if (args.isScopeAttribute) { self.parameters.push(self.createParameterItem("isScopeAttribute", args.isScopeAttribute)); };
        if (args.guidControl) { self.parameters.push(self.createParameterItem("guidControl", args.guidControl)); };
        if (args.propertyName) { self.parameters.push(self.createParameterItem("propertyName", args.propertyName)); };
                
    }
})