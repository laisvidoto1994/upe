/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Attribute Display Name Value
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for displayatrib protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getattributedisplayname", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetAttributeDisplayName";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        
        self.parameters.push(self.createParameterItem("xpathattribute", bizagi.editor.utilities.resolveComplexXpath(self.args.xpath)));
        self.parameters.push(self.createParameterItem("guidentity", self.geGuidEntity()));

        var isScope = self.isScope();

        self.parameters.push(self.createParameterItem("isscope", isScope));

        if (bizagi.editorLanguage.key !== "default") {
            self.parameters.push(self.createParameterItem("language", bizagi.editorLanguage.displayname));
        }

        if (isScope) {
            self.parameters.push(self.createParameterItem("scopeDefinition", bizagi.editor.utilities.resolveScopeContextFromXpath(self.args.xpath)));
        }

    },

    /*
    *   Process BAs answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;

        if (!result) return basAnswer;
        if (result.success) {
            self.answerParameters = result.parameters;
            return {
                displayName: self.findKeyInParameters("displayname").value,
                defaultValue: self.findKeyInParameters("default").value
            };

        }

        return result.success;
    },

    /*
    * Get the guid entity or itemScope
    */
    geGuidEntity: function () {
        var self = this;

        return bizagi.editor.utilities.resolveContextEntityFromXpath(self.args.xpath) || bizagi.editor.utilities.resolveScopeContextFromXpath(self.args.xpath);
    },

    /*
    *  Returns true if the xpath is an scope attribute
    */
    isScope: function () {
        var self = this;

        if (bizagi.editor.utilities.resolveScopeContextFromXpath(self.args.xpath)) { return true; }
        return false;
    }



})