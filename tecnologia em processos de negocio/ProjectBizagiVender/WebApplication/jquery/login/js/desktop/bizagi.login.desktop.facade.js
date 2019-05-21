/**
* Login facade for desktop
* 
* @author Edward J Morales
*/

$.Class.extend("bizagi.login.desktop.facade", {}, {
    /* 
    *   Constructor
    */
    init: function (login, dataService) {
        this.templates = {};
        this.login = login;
        this.dataService = dataService;
        this.defaultWidget = "BIZAGI_LOGIN_WIDGET_LOGIN";
    },
    getDefaultWidget: function () {
        var self = this;
        var def = new $.Deferred();
        var isAuthenticated = false;
        var oAuthParameters = self.login.oAuthParameters || {};
        var type = oAuthParameters.type || "";
        var oAuth2InternalState = oAuthParameters.oAuth2InternalState || "";

        if (type == 'oauth2AsServer' && oAuth2InternalState != 'undefined') {
            var oauth2sso = oAuthParameters.oauth2sso;

            var params = {};
            params.oAuth2InternalState = oAuth2InternalState;
            params.oauth2sso = oauth2sso;

            $.when(self.dataService.oauth2SSOValidateSession(params)).done(function (responseValidation) {
                if (responseValidation.isAuthenticate == 'true') {
                    isAuthenticated = true;
                    self.setBizagiAuthentication(responseValidation);
                }
            }).fail(function () { });
        }

        if (!isAuthenticated) {
            // Get login configuration
            $.when(self.dataService.getConfiguration()).done(function (response) {
                self.loginConfig = response;
                var authenticationType = response.authenticationType;
                var isQuickLogin = bizagi.util.parseBoolean(response.isQuickLogin);

                switch (authenticationType) {

                case 'Windows':
                    localStorage.setItem("clientLog", "true");
                    
                    $.when(self.dataService.isAuthenticatedWithPrincipalInjection("")).done(function (response) {
                        if (response.isAuthenticate == 'true') {                            
                            self.setBizagiAuthentication(response);                               
                        }                    
                        else {
                            def.resolve(self.defaultWidget);                            
                        }
                    }).fail(function (error) {                        
                        def.resolve(self.defaultWidget);
                    });  
                    break;
                case 'Custom':
                    $.when(self.dataService.isAuthenticatedWithPrincipalInjection("")).done(function (response) {
                        if (response.isAuthenticate == 'true') {
                            self.setBizagiAuthentication(response);
                        }
                        else {
                            def.resolve(self.defaultWidget);
                        }
                    }).fail(function (error) {
                        def.resolve(self.defaultWidget);
                    });
                    break;
                case 'Federate':
                    localStorage.setItem("clientLog", "true");
                    var params = {};
                    params.user = "";
                    params.domain = "";
                    params.loginOption = "alwaysAsk";

                    $.when(self.dataService.userLogin(params)).done(function (responseLogin) {
                        if (responseLogin.isAuthenticate == 'true') {
                            self.setBizagiAuthentication(responseLogin);
                        } else {
                            window.location.href = "error.html?message=" + bizagi.localization.getMessageFromLocalization(responseLogin.status, "error", ([responseLogin.paramError])) + "&type=" + responseLogin.status;
                        }
                    }).fail(function (responseError) {
                        window.location.href = "error.html?message=" + bizagi.localization.getMessageFromLocalization(responseError.status, "error", ([responseError.paramError])) + "&type=" + responseError.status;
                    });                   
                    break;
                case 'BizAgi':                    
                    self.loginConfig.isBizagiAuthentication = true;

                    if (isQuickLogin) {
                        def.resolve("BIZAGI_LOGIN_WIDGET_QUICKLOGIN");
                    } else {
                        def.resolve(self.defaultWidget);
                    }
                    break;
                case 'Mixed':
                    if (isQuickLogin) {
                        def.resolve("BIZAGI_LOGIN_WIDGET_QUICKLOGIN");
                    } else {
                        $.when(self.dataService.isAuthenticatedWithPrincipalInjection("")).done(function (response) {
                            if (response.isAuthenticate == 'true') {
                                self.setBizagiAuthentication(response);
                            }
                            else {
                                def.resolve(self.defaultWidget);
                            }
                        }).fail(function (error) {
                            def.resolve(self.defaultWidget);
                        });
                    }
                    break;
                    case 'SAML':                        
                        var params = {};
                        params.user = "";
                        params.domain = "";
                        params.loginOption = "alwaysAsk";

                        $.when(self.dataService.userLogin(params)).done(function (responseLogin) {
                            if (responseLogin.isAuthenticate == 'true') {
                                self.setBizagiAuthentication(responseLogin);
                            }
                            else if (responseLogin.samlUrlRedirect && responseLogin.samlUrlRedirect != "") {                                
                                window.location.href = responseLogin.samlUrlRedirect;
                            } else {
                                window.location.href = "error.html?message=" + bizagi.localization.getMessageFromLocalization(responseLogin.status, "error", ([responseLogin.paramError])) + "&type=" + responseLogin.status;
                            }
                        }).fail(function (responseError) {
                            window.location.href = "error.html?message=" + bizagi.localization.getMessageFromLocalization(responseError.status, "error", ([responseError.paramError])) + "&type=" + responseError.status;
                        });

                        break;
                    case 'OAuth2':
                        var oAuthParams = self.login.oAuthParameters || {};
                        var syncToken = oAuthParams.syncToken;
                        var type = oAuthParams.type;
                        if (type == 'oauth2AsClient' && syncToken != 'undefined') {
                            $.when(self.dataService.getOAuth2AuthFromSyncToken(syncToken)).done(function (res) {

                                if (res.isAuthenticate == 'true') {
                                    self.setOAuth2Authentication(res);
                                }
                                else if (res.isAuthenticate == 'false') {
                                    self.getDefaultWidget();
                                }
                                else if (res.status != 'SUCCESS') {
                                    var message = bizagi.localization.getMessageFromLocalization(res.status, "error", ([res.paramError]));
                                    window.location.href = 'oauth2-error.html?error=' + res.status + '&error_description=' + message + '&http_status_code=' + res.httpStatusCode + '&state=';
                                }
                            });
                        }
                        else {
                            $.when(self.dataService.getOAuth2RedirectAuthorizacionData("")).done(function (res) {

                                if (res.isAuthenticate == 'true') {
                                    self.setOAuth2Authentication(res);
                                }
                                else if (res.status == 'SUCCESS') {
                                    //Redirection to OAuth2 Authorization Server
                                    var url = res.authorizationUrl + '?response_type=' + res.responseType + '&client_id=' + res.clientId + '&redirect_uri=' + res.redirectUri + '&scope=' + res.scope;
                                    if (res.isSingleSignOnCookieEnable) {
                                        url += '&sso=' + res.isSingleSignOnCookieEnable;
                                    }
                                    if (res.state) {
                                        url += '&state=' + res.state;
                                    }
                                    if (res.nonce) {
                                        url += '&nonce=' +res.nonce;
                                    }

                                    window.location.href = url;
                                }
                                else if (res.status == 'ERROR') {
                                    //Redirection to OAuth2 Error Page
                                    window.location.href = 'oauth2-error.html?error=' + res.error + '&error_description=' + res.errorDescription + '&http_status_code=' + res.httpStatusCode + '&state=' + res.state;
                                }
                            });
                        }
                        break;
                    default: //'Custom''IntegratedWindowsAuthentication''IntegratedOraclePortal''LDAPAuthentication''OAuth'
                        //Similar Bizagi
                        if (isQuickLogin) {
                            def.resolve("BIZAGI_LOGIN_WIDGET_QUICKLOGIN");
                        } else {
                            def.resolve(self.defaultWidget);
                        }
                        break;
                }

            }).fail(function (message) {
                console.log(message);
            });
        }
        return def.promise();
    },
    /**
    * 
    */
    render: function (widget, params) {

        var self = this;
        var def = new $.Deferred();

        self.session = {};



        $.when(self.dataService.getConfiguration()).done(function (responseConfig) {

            var isRemoteUser = responseConfig.isRemoteUser;
            var isByPassLogin = responseConfig.isByPassLogin;
            
            self.loginConfig = responseConfig;
            self.session.isProduction = responseConfig.isProduction;

            //Ensures if the Bizagi
            if (self.loginConfig.authenticationType == 'BizAgi')
                self.loginConfig.isBizagiAuthentication = true;

            if (isRemoteUser == true || isByPassLogin == true) {
                //force login
                self.session.user = "admon";
                self.session.domain = "domain";
                self.session.loginOption = "admon";
                self.session.selectedCheck = "saveAccount";


                $.when(self.dataService.userLogin(self.session)).done(function (responseLogin) {
                    responseLogin.isAuthenticate = "true";
                    self.setBizagiAuthentication(responseLogin);
                }).fail(function () {
                    self.renderWidget(widget, params, def);
                });

            } else {
                $.when(self.dataService.readUserCookies()).done(function (response) {
                    var loginOption = response.loginOption;

                    if (loginOption == "saveAccountPassword") {
                        //force login
                        self.session.user = response.userName;
                        self.session.domain = response.domain;
                        self.session.selectedCheck = response.loginOption;

                        if (bizagi.util.parseBoolean(response.isAuthenticaded)) {
                            $.when(self.dataService.getCurrentUser("")).done(function (responseLogin) {
                                responseLogin.isAuthenticate = "true";
                                responseLogin.shortDateFormat = responseLogin.shortDateFormat;
                                responseLogin.longDateFormat = responseLogin.longDateFormat;
                                responseLogin.timeFormat = responseLogin.timeFormat;
                                self.setBizagiAuthentication(responseLogin);
                            }).fail(function () {
                                self.renderWidget(widget, params, def);
                            });
                        }
                        else {
                            self.renderWidget(widget, params, def);
                        }

                    } else if (loginOption == "saveAccount") {
                        self.session.user = response.userName;
                        self.session.domain = response.domain;
                        self.session.selectedCheck = response.loginOption;
                        self.renderWidget(widget, params, def);

                    } else {
                        self.session.selectedCheck = "rbAskAlways";
                        self.renderWidget(widget, params, def);
                    }

                }).fail(function (error) {
                    //errorBizagi 
                    var errorValue = JSON.parse(error.responseText);
                    console.log(errorValue.message + "\n" + errorValue.innerExceptions);
                });
            }

        }).fail(function (error) {
            //errorBizagi
            if (error.responseText.indexOf('User Not Valid') != -1) {
                window.location.href = "App/Inicio/UserNotValid.aspx";
            }
            else {
                var errorValue = JSON.parse(error.responseText);
                if (errorValue.code == "AUTHENTICATION_ERROR") {
                    window.location.href = "App/Inicio/UserNotValid.aspx";
                }
                else {
                    console.log(errorValue.message + "\n" + errorValue.innerExceptions);
                }
            }

        });
        return def;
    },
    renderWidget: function (widget, params, def) {
        var self = this;
        if (!widget) {
            $.when(self.getDefaultWidget()).done(function (widgetResponse) {
                widget = widgetResponse;
                return self.renderWidgetWait(widget, params, def);
            });
        } else {
            return self.renderWidgetWait(widget, params, def);
        }
        return def.promise();
    },
    renderWidgetWait: function (widget, params, def) {
        var self = this;

        $.when(widget, self.loadTemplates()).done(function (widget) {
            var widgetReference = self.getWidgetObject(widget, self, self.dataService);

            // Extend Params
            params = params || {};
            params = $.extend(params, self.loginConfig);
            params = $.extend(params, self.session);


            // Render content
            $.when(widgetReference.renderContent(params)).done(function () {
                // Call post-render method

                widgetReference.postRender(params);
                // Resolve deferred
                def.resolve(widgetReference.getContent());
            });
        });
        return def.promise();
    },

    getWidgetObject: function (widget, facade, dataService) {
        switch (widget) {
            case "BIZAGI_LOGIN_WIDGET_LOGIN":
                return new bizagi.login.widgets.login(facade, dataService);
                break;
            case "BIZAGI_LOGIN_WIDGET_CHANGEPASSWORD":
                return new bizagi.login.widgets.changepassword(facade, dataService);
                break;
            case "BIZAGI_LOGIN_WIDGET_FORGOTPASSWORD":
                return new bizagi.login.widgets.forgotpassword(facade, dataService);
                break;
            case "BIZAGI_LOGIN_WIDGET_UNLOCKACCOUNT":
                return new bizagi.login.widgets.unlockaccount(facade, dataService);
                break;
            case "BIZAGI_LOGIN_WIDGET_QUICKLOGIN":
                return new bizagi.login.widgets.quicklogin(facade, dataService);
                break;
            case "BIZAGI_LOGIN_WIDGET_ADMINLOGIN":
                return new bizagi.login.widgets.adminlogin(facade, dataService);
                break;
            default:
                console.log("error widget " + widget + " not found");
                break;
        }
    },
    changeWidget: function (widget, params) {
        var self = this;
        $.when(self.render(widget, params)).done(function (content) {
            var body = $("body");
            // Empty all content
            body.empty();

            var canvas = $("<div/>").appendTo(body);
            bizagi.util.replaceSelector($("body"), canvas, content);
        });
    },
    /*
    *   Load all the templates used in the workportal
    */
    loadTemplates: function () {
        var self = this;
        var defer = new $.Deferred();
        $.when(
                self.loadTemplate("login-wrapper", bizagi.getTemplate("bizagi.login.desktop.login") + "#ui-bizagi-login-wrapper"),
                self.loadTemplate("normal-login", bizagi.getTemplate("bizagi.login.desktop.login") + "#ui-bizagi-login-normal-login"),
                self.loadTemplate("admin-login", bizagi.getTemplate("bizagi.login.desktop.login") + "#ui-bizagi-login-admin-login"),
                self.loadTemplate("login-error-message", bizagi.getTemplate("bizagi.login.desktop.login") + "#ui-bizagi-login-error-message"),
                self.loadTemplate("quick-login", bizagi.getTemplate("bizagi.login.desktop.login") + "#ui-bizagi-login-quick-login"),
                self.loadTemplate("change-password", bizagi.getTemplate("bizagi.login.desktop.login") + "#ui-bizagi-login-change-password"),
                self.loadTemplate("forgot-password", bizagi.getTemplate("bizagi.login.desktop.login") + "#ui-bizagi-login-forgot-password"),
                self.loadTemplate("unlock-account", bizagi.getTemplate("bizagi.login.desktop.login") + "#ui-bizagi-login-unlock-account")
                ).done(function () {
                    // Resolve when all templates are loaded
                    defer.resolve();
                });
        return defer.promise();
    },
    /*
    *   Load one template and save it internally
    */
    loadTemplate: function (template, templateDestination) {
        var self = this;
        // Go fetch the template
        return bizagi.templateService.getTemplate(templateDestination)
                .done(function (resolvedTemplate) {
                    self.templates[template] = resolvedTemplate;
                });
    },
    /*
    *   Method to fetch templates from a private dictionary
    */
    getTemplate: function (template) {
        var self = this;
        return self.templates[template];
    },
    /**
     * 
     * @param params
     */
    setBizagiAuthentication: function (params) {
        var self = this;
        params.isProduction = self.session.isProduction;
        var oAuthParameters = self.login.oAuthParameters || {};
        var type = oAuthParameters.type || "";
        if(type && type == 'oauth2AsServer'){
            var code = params.code;
            if(code){
                var callbackUri = params.callbackUri;
                var state = params.state;
                if (params.callbackUriStrategy == 'MobileTitleBarBrowser'){
                    window.location = callbackUri + '?oAuth2InternalState=' + params.internalState;
                }else{
                    window.location = callbackUri + '?code=' + code + '&state=' + state;
                }                
            }else{
                location.reload();
            }
        }else{
            sessionStorage.setItem("bizagiAuthentication", JSON.encode(params));
            // Refresh page in order to load workportal module
            location.reload();    
        }        
    },
    /**
     * 
     * @param params
     */
    setBizagiAuthenticationSaml: function (params) {
        params.isProduction = this.session.isProduction;
        sessionStorage.setItem("bizagiAuthentication", JSON.encode(params));
        // Refresh page in order to load workportal module
        location.reload();
    },
    /**
     * 
     * @param params
     */
    setOAuth2Authentication: function (params) {
        params.isProduction = this.session.isProduction;
        sessionStorage.setItem("bizagiAuthentication", JSON.encode(params));
        // Refresh page in order to load workportal module
        var url = window.location.href;
        var parts = url.split('?');
        window.location.href = parts[0];
    }
});
