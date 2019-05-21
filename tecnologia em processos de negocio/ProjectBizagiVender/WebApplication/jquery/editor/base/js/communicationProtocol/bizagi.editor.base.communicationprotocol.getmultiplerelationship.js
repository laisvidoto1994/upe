/*
*   Name: BizAgi FormModeler Editor Communication Protocol Get Multiple Relationship Form 
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for getmultiplerelationship protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.getmultiplerelationship", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "GetMultipleRelationship";

    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        self.parameters.push(self.createParameterItem("leftEntityId", self.args.leftEntityId));
        if(self.args.rightEntityId) self.parameters.push(self.createParameterItem("rightEntityId", self.args.rightEntityId));
    },

    /*
    *   Process BAS answer 
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;

        if (result.success) {
            self.answerParameters = result.parameters;

            var leftfact = [];
            if (self.findKeyInParameters("leftfact")) {
                leftfact = self.findKeyInParameters("leftfact").value;
                leftfact = JSON.parse(leftfact);
            }

            var rightfact = [];
            if (self.findKeyInParameters("rightfact")) {
                rightfact = self.findKeyInParameters("rightfact").value;
                rightfact = JSON.parse(rightfact);
            }

            return {
                leftfact: leftfact,
                rightfact: rightfact
            };
        }

        return result.success;
    }
})