/*
*   Name: BizAgi FormModeler Editor Communication Protocol Check Flags
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for checkflags protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.checkflags", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "CheckFlags";


    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        var flags = self.args.flags;

        if (!!flags) {
            for (var flag in flags) {
                self.parameters.push(self.createParameterItem(flag, true));
            }
        }
    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;

        if (result.success) {
            var flags = {};
            for (var i = 0, l = result.parameters.length; i < l; i++) {
                flags[result.parameters[i].key] = bizagi.util.parseBoolean(result.parameters[i].value);
            }

            return self.processFlags(flags);
        }

        return result.success;
    },

    /*
    * Located controls, enabled by key (appSettings)
    */
    processFlags: function (flags) {

        if (flags["EnableGroupedGridControl"] !== undefined) {
            flags["groupedgrid"] = !flags["EnableGroupedGridControl"];
        }
        
        if (flags["EnableCollectionNavigatorControl"] !== undefined) {
            flags["collectionnavigator"] = !flags["EnableCollectionNavigatorControl"];
        }

        if (flags["EnableAssociationControl"] !== undefined) {
            flags["association"] = !flags["EnableAssociationControl"];
        }
        
        return flags;
    }
})