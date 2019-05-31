
/*
*   Name: BizAgi FormModeler Editor Form
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for Form Button(model)
*/

bizagi.editor.base.render.extend("bizagi.editor.base.formbutton", {}, {

    /*
    *   Constructor
    */
    init: function (data, elementFactory, regenerateGuid) {
        var self = this;

        // Call base
        self._super(data, elementFactory, regenerateGuid);

        // fix properties
        self.fixProperties();
    },

    /*
    * Migrate properties to new format
    */
    fixProperties: function () {
        var self = this;
        var properties = self.properties;

        if (properties.buttonrule) {
            self.fixButtonRuleProperty(properties.buttonrule);
        }

    },

    /*
    * The format of button rule property changed to support interfaces
    * old format buttontrule : {baref : {ref: <GUID>}}
    * new format buttontrule : {rule : {baref : {ref: <GUID>}}} or
    *            buttontrule : {interface : {baref : {ref: <GUID>}}}      
    */
    fixButtonRuleProperty: function (value) {
        var self = this;

        if (value["baref"]) {
            value = { rule: value };
            self.assignProperty("buttonrule", value);
        }
    }
});