/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Metadata Attribute Display Name Value
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for metadatadisplayatrib protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getmetadataattributedisplayname", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetMetadataAttributeDisplayName";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];

        var xpathAttribute = bizagi.editor.utilities.resolveComplexXpath(self.args.xpath);
        xpathAttribute = xpathAttribute.replace(/\./g, '_').replace("@", '');

        self.parameters.push(self.createParameterItem("xpathattribute", xpathAttribute));

        if (bizagi.editorLanguage.key !== "default") {
            self.parameters.push(self.createParameterItem("language", bizagi.editorLanguage.displayname));
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
    }



})