/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Status Form
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for getstatusform protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getstatusform", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetStatusForm";


    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;

        if (result.success) {
            self.answerParameters = result.parameters;           
            var isInCheckout = bizagi.util.parseBoolean(self.findKeyInParameters("isInCheckout").value);            
            return {
                isInCheckout: isInCheckout                
            };
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

        return flags;
    }

})