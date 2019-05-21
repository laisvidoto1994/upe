/**
 * Define path of REST services
 */

$.Class.extend("bizagi.render.services.context", {}, {
    
    /**
     *  @argument {object} params Configurations params
     */
    init: function(params) {
        params = params || {};
        var proxyPrefix = params.proxyPrefix || "";
        this.endPoint = {            
            generalAuthentication: proxyPrefix + "Rest/Authentication",
            authenticationUser: proxyPrefix + "Api/Authentication/User",
            quickLoginUsers: proxyPrefix + "Rest/Authentication/Users",
            authenticationConfig: proxyPrefix + "Api/Authentication/BizagiConfig",
            authenticationDomains: proxyPrefix + "Rest/Authentication/Domains",
            forgotPassword: proxyPrefix + "Rest/Authentication/ForgottenPassword",
            secretQuestion: proxyPrefix + "Rest/Authentication/SecretQuestion",
            unlockAccount: proxyPrefix + "Rest/Authentication/Unlock",
            changePassword: proxyPrefix + "Rest/Authentication/ChangePassword",
            readUserCookies: proxyPrefix + "Api/Authentication/ReadUserCookies",
            userHandlerGetCurrentUser : proxyPrefix+ "Rest/Users/CurrentUser",
            userSamlSession: proxyPrefix + "Rest/Users/SamlSession",
            oauth2IdPServerLoginPage: proxyPrefix + "Api/Authentication/OAuth2/IdentityProvider/Server/LoginPage",
            oauth2IdPServerValidateSession: proxyPrefix + "Api/Authentication/OAuth2/IdentityProvider/Server/ValidateSession",
            oauth2RedirectAuthorizacionData: proxyPrefix + "Api/Authentication/OAuth2/OAuth2RedirectAuthorizacionData",
            oauth2RedirectAuthorizacionDataAsServer: proxyPrefix + "Api/Authentication/OAuth2/OAuth2RedirectAuthorizacionDataAsServer",
            oauth2AuthSynctoken: proxyPrefix + "Api/Authentication/OAuth2/AuthenticateWithSyncToken",
            isAuthenticatedWithPrincipalInjection: proxyPrefix + "Api/Authentication/IsAuthenticatedWithPrincipalInjection"
        };
    },
    /**
     * This method will return the url defined as endPoint using the parameter "endPoint" name
     */
    getUrl: function(endpoint) {
        var self = this;
        var url = self.endPoint[endpoint] || "";
        return url;
    }
});
