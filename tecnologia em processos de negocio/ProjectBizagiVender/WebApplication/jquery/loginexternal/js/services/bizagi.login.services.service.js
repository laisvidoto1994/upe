/**
 * Services for login
 */

$.Class.extend("bizagi.login.services.service", {}, {
    /**
    * Constructor
    */
    init: function (params) {
        this.serviceLocator = new bizagi.render.services.context(params);
    },
    /**
    * Get bizagi configuration
    * @param {Function}   type    callback function when the file load is succed
    * @return {deferred} ajax object with JSON content
    */
    getConfiguration: function () {
        // Check session storage
        var bizagiConfig = window.sessionStorage.getItem("BizagiConfiguration");
        if(bizagiConfig){
            var def = new $.Deferred();
            def.resolve(JSON.parse(bizagiConfig));
            return def.promise()
        }else{
            var self = this;
            var url = self.serviceLocator.getUrl("authenticationConfig");

            return $.read(url);
        }
    },
    /**
    * Login user 
    * @loginParams {object} loginParams Object with login credentials
    * @return {deferred} ajax object with JSON content
    */
    userLogin: function (loginParams) {
        var self = this;
        var url = self.serviceLocator.getUrl("authenticationUser");
        var type = loginParams.type || "";        

        if (type && (type == 'oauth2AsServer' || type == 'oauth2AsBridge')) {
            var oAuth2InternalState = loginParams.oAuth2InternalState || "";
            if (oAuth2InternalState) {
                loginParams.oAuth2InternalState = oAuth2InternalState;
                url = self.serviceLocator.getUrl("oauth2IdPServerLoginPage");
            }
        }

        //Call to the restfull service for authentication
        return $.create(url, loginParams);
    },    
    /**
    * Get json with bizagi domains list
    * @return {deferred} ajax object with JSON content
    */
    getDomainList: function () {
        var self = this;
        var url = self.serviceLocator.getUrl("authenticationDomains");

        return $.read(url);
    },
    /**
    * Unlock user account 
    *  
    * @param {object} loginParams Object with login credentials
    * @return {deferred} ajax object with JSON content
    */
    unlockAccount: function (loginParams) {
        var self = this;
        var data = {};
	    var url = self.serviceLocator.getUrl("unlockAccount");

        // Set password information on data request for security reasons
        data.domain = loginParams.domain;
        data.user = loginParams.user;
        data.password = loginParams.password;
        data.observation = loginParams.observation;

        return $.create(url, data);
    },
    /**
    * Get list of bizagi users
    * 
    * @return {deferred} ajax object with JSON content
    */
    getQuickLoginUserList: function () {
        var self = this;
        var url = self.serviceLocator.getUrl("quickLoginUsers");

        return $.read(url);

    },
    /**
    * Unlock user account 
    *  
    * @param {object} loginParams Object with login credentials
    * @return {deferred} ajax object with JSON content
    */
    changePassword: function (loginParams) {
        var self = this;
        var data = {};
        var url = self.serviceLocator.getUrl("changePassword");

        // Set password information on data request for security reasons
        data.domain = loginParams.domain;
        data.user = loginParams.user;
        data.password = loginParams.password;
        data.newPassword = loginParams.newPassword;
        data.passwordConfirmation = loginParams.passwordConfirmation;

        data.secretQuestion = loginParams.secretQuestion;
        data.secretAnswer = loginParams.secretAnswer;

        return $.create(url, data);
    },

    /*
    *
    */
    forgotPassword: function (userParams) {
        var self = this;
        var data = {};
        var url = self.serviceLocator.getUrl("forgotPassword");

        data.secretAnswer = userParams.secretAnswer;
        data.domain = userParams.domain;
        data.user = userParams.user;

        return $.create(url, data);
    },

    /*
    *
    */
    secretQuestion: function (userParams) {
        var self = this;
	    var url = self.serviceLocator.getUrl("secretQuestion");
        var data = {};

        data.user = userParams.user;
        data.domain = userParams.domain;

        return $.read(url, userParams);
    },

    /*
    *   Return the state of the login cookie
    */
    readUserCookies: function () {
        var self = this;
        var url = self.serviceLocator.getUrl("readUserCookies");
        return $.read(url);
    },
    /*
    *   Gets the current working user
    */
    getCurrentUser: function (params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("userHandlerGetCurrentUser"));
    },
    getUserSamlSession: function (params) {
        var self = this;
        return $.read(self.serviceLocator.getUrl("userSamlSession"));
    },
    getOAuth2RedirectAuthorizacionData: function (params) {
        var self = this;
        return $.read(self.serviceLocator.getUrl("oauth2RedirectAuthorizacionData"));
    },
    getOAuth2RedirectAuthorizacionDataAsServer: function (params) {
        var self = this;
        return $.read(self.serviceLocator.getUrl("oauth2RedirectAuthorizacionDataAsServer"), params);
    },
    getOAuth2AuthFromSyncToken: function (params) {
        var self = this;
        var data = {};
        data.syncToken = params;

        return $.create(self.serviceLocator.getUrl("oauth2AuthSynctoken"), data);
    },
    oauth2SSOValidateSession: function (params) {
        var self = this;
        return $.create(self.serviceLocator.getUrl("oauth2IdPServerValidateSession"), params);
    },
    isAuthenticatedWithPrincipalInjection: function (params) {
        var self = this;
        return $.read(self.serviceLocator.getUrl("isAuthenticatedWithPrincipalInjection"), params);
    }
});
