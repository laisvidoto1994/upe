/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Available Languages
*   Author: Cristian Olaya - Andrés Muñoz
*   Comments:
*   -   This script will define basic stuff for availablelanguages protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.gettags", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetTags";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = self.args.parameters || [];
    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var result = basAnswer.result;
        
        if (result.success) {
            return  result.parameters;
        } 

        return result.success;
    }

})