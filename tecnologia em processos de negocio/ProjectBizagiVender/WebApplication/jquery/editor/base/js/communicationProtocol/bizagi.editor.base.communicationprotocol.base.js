/*
*   Name: BizAgi FormModeler Editor Communication Protocol Base
*   Author: Alexander Mejia
*   Comments:
*   -   This script will define basic stuff for any communication protocol
*/

bizagi.editor.observableClass.extend("bizagi.editor.base.protocol.base", {}, {

    /*
    *   Constructor
    */
    init: function (data) {
        var self = this;

        self._super();
        self.args = data;
        self.context = data.context;
        self.parameters = [];
        self.answerParameters = [];

        //Services
        self._ResourcesServices = bizagi.editor.base.services.resourcesServices;

        self._editorInfo = bizagi.editor.base.info;


    },

    /*
    *   Process the request info and execexute it in BAS
    */
    processRequest: function () {
        var self = this,
            defer = new $.Deferred(),
            basRequest;

        self.buildRequest();
        self.parameters.push(self.createParameterItem("guidContext", BIZAGI_IDENTIFIER_MODEL));
        self.parameters.push(self.createParameterItem("user", BIZAGI_USER));

        basRequest = self.requestForBAS();

        var promiseRequest = self.callRestService(basRequest) ||
                             bizagi.editor.base.HostFacade.executeBasActions(basRequest);

        $.when(promiseRequest)
        .done(function (basAnswer) {
            defer.resolve(self.processBasAnswer(basAnswer));
        });

        return defer.promise();
    },

    /*
    *   Process BAS answer in order to transform the result, can be overriden for each protocol
    */
    processBasAnswer: function (basAnswer) {
        return basAnswer;
    },

    /*
    *  Creates a parameter for the BAS request
    */
    createParameterItem: function (key, value) {
        var parameterItem = {};

        parameterItem.key = key;
        parameterItem.value = value;

        return parameterItem;
    },

    /*
    *   Wrap request info for BAS
    */
    requestForBAS: function () {
        var self = this,
            basRequest = {};

        basRequest.actiontype = self.actiontype;
        basRequest.parameters = self.parameters;

        return basRequest;
    },

    /*
    *   Builds the request info for the protocol
    */
    buildRequest: function () {
        var self = this;

        self.parameters = [];
    },

    callRestService: function (basRequest) {
        var self = this;

        if (self.context == "adhocform") {
            return self._ResourcesServices.getResource(basRequest);
        }

        return !self._editorInfo.isCloud() && self._ResourcesServices.getResource(basRequest);
    },

    /*
    *   Iterate over response parameter array to find a ky
    */
    findKeyInParameters: function (key) {
        var self = this,
            itemParameter = null;

        for (var i = 0, l = self.answerParameters.length; i < l; i += 1) {
            if (self.answerParameters[i].key === key) {
                itemParameter = self.answerParameters[i];
            }
        }

        return itemParameter;
    }
});
