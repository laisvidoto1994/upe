/*
*   Name: BizAgi Editor Component Properties  Commands rule
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for command
*/

bizagi.editor.component.properties.commands.base.extend("bizagi.editor.component.properties.commands.rule", {

    rulePropertiesCache: {}

},
{

    /*
    *   Executes the command
    */
    execute: function () {
        var self = this;

        var value = bizagi.editor.utilities.resolveProperty(self.properties, self.key);

        if (bizagi.editor.utilities.isObject(value) &&
            bizagi.editor.utilities.isObject(value.baref)) {
            return self.updateRuleDisplayName(value);
        }

        return value;
    },

    /*
    * Updates displayName Rule, the valid format is {value: { baref: ref }}
    */
    updateRuleDisplayName: function (value) {
        var self = this;

        var guidRule = bizagi.editor.utilities.resolveComplexReference(value);

        if (self.Class.rulePropertiesCache[guidRule]) {
            value = self.Class.rulePropertiesCache[guidRule];
            self.element.assignProperty(self.key, value , false);
            return value;
        }

        var ruleDisplayNameProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "getruledisplayname", guid: guidRule });
        $.when(ruleDisplayNameProtocol.processRequest()).
            done(function (data) {
                value.displayName = (data) ? data.displayName : rule.displayName;
                self.element.assignProperty(self.key, value, false);    
                self.Class.rulePropertiesCache[guidRule] = value;
            });

        

        return value;
    }

});

