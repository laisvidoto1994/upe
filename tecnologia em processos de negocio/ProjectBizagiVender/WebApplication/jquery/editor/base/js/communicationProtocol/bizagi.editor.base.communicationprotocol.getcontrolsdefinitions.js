/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Controls Definitions
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for getControlsDefinitions protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getcontrolsdefinitions", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetControlDefinitions";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];        
    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;


        if (result.success) {
            self.answerParameters = result.parameters;
            return JSON.parse(self.findKeyInParameters("definitions").value);
        }

        return result.success;
    },


    /*
    *   Process the request info and execexute it in BAS
    */
    processRequest: function () {
        var self = this,
            defer = new $.Deferred();
        // Remove Cache for load the widgets 
        // Go to the server / bas
        $.when(bizagi.editor.base.protocol.base.prototype.processRequest.apply(self, arguments))
        .done(function (response) {
            definitions = response;
            defer.resolve(definitions);
        });        

        return defer.promise();
    }
})