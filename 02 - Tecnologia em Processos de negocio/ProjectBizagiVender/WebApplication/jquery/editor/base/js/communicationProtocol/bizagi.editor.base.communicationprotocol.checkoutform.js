/*
*   Name: BizAgi FormModeler Editor Communication Protocol Checkout Form
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for checkoutform protocol
*/

bizagi.editor.base.protocol.base.extend("bizagi.editor.base.protocol.checkoutform", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super(data);
        self.actiontype = "CheckoutForm";
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
        if (self.args.loadForm) {
            self.parameters.push(self.createParameterItem("loadForm", true));
        };
        
    },

    /*
    *   Process BAS answer to use in the modeler
    */
    processBasAnswer: function (basAnswer) {
        var self = this,
            result = basAnswer.result;

        if (result.success) {
            self.answerParameters = result.parameters;

            var isInCheckout = self.findKeyInParameters("userInfo") ? bizagi.util.parseBoolean(self.findKeyInParameters("isInCheckout").value) : false;

            var userInfo = null;
            if (self.findKeyInParameters("userInfo")) {
                userInfo = self.findKeyInParameters("userInfo").value;
                userInfo = JSON.parse(userInfo);
            }

            var form = null;
            if (self.findKeyInParameters("form")) {
                form = self.findKeyInParameters("form").value;
                form = JSON.parse(form);
            }

            return {
                isInCheckout: isInCheckout,
                userInfo: userInfo,
                form: form
            };
        }

        return result.success;
    }

})