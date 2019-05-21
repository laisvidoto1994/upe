/**
 * Bizagi login module
 * 
 * @author Edward J Morales
 */

/*
 *   Create login facade
 */
$.Class.extend("bizagi.login.facade", {}, {
    /* 
     *   Constructor
     */
    init: function(params) {
        this.oAuthParameters = params.oAuthParameters || {};

        //used to allow the load of specific templates  
        this.loginFactory = new bizagi.login.factory();
        // Creates a data service instance
        this.dataService = new bizagi.login.services.service(params);
        // Set default params
        this.defaultParams = params || {};
        
        this.defaultWidget = "BIZAGI_LOGIN_WIDGET_LOGIN";
    },
    /*
     *   Start point method to use in the main javascript pages
     *   This method will process everything and attach the html directly to the dom
     */
    execute: function(canvas) {
        var self = this;
        var doc = this.ownerDocument;
        var body = $("body", doc);
        canvas = canvas || $("<div/>").appendTo(body);

        // Creates ready deferred
        self.executionDeferred = new $.Deferred();
        $.when(self.render()).done(function(content) {
            // Replace canvas with content
            bizagi.util.replaceSelector(body, canvas, content);
            self.executionDeferred.resolve();
        });
    },
    /*
     *   Returns the execution deferred to determine if the component is ready or not
     */
    ready: function() {
        return this.executionDeferred.promise();
    },

    getDefaultWidget: function () {
        var self = this;
        var def = new $.Deferred();
        var oAuthParameters = self.oAuthParameters || {};
        var type = oAuthParameters.type || "";
        var oAuth2InternalState = oAuthParameters.oAuth2InternalState || "";

        // Get login configuration
        $.when(self.dataService.getConfiguration()).done(function (response) {
            self.loginConfig = response;
            var authenticationType = response.authenticationType;
            var isQuickLogin = bizagi.util.parseBoolean(response.isQuickLogin);

            switch (authenticationType) {
                case 'Federate':
                case 'Windows':
                case 'Custom':
                    def.resolve(self.defaultWidget);
                    break;
                case 'BizAgi':
                case 'Mixed':
                    if (isQuickLogin) {
                        def.resolve("BIZAGI_LOGIN_WIDGET_QUICKLOGIN");
                    } else {
                        def.resolve(self.defaultWidget);
                    }
                    break;
                case 'SAML':

                    $.when(self.dataService.getUserSamlSession("")).done(function (responseSaml) {

                        if (typeof responseSaml.urlRedirect != 'undefined') {
                            window.location.href = responseSaml.urlRedirect;
                        }
                        else {
                            if (responseSaml.isAuthenticate == 'true') {
                                self.setBizagiAuthenticationSaml(responseSaml);
                            }
                            else if (responseSaml.isAuthenticate == 'false') {
                                //Redirection to SAML
                                loader.nativeAjax(loader.getPathUrl("saml2/login"), function (response) {
                                    var jsonRedirect = JSON.parse(response.responseText);
                                    window.location.href = jsonRedirect.urlRedirect;
                                })
                                    .fail(function () {
                                        self.renderWidget(widget, params, def);
                                    });
                            }
                        }
                    });
                    break;
                case 'OAuth2':
                    var oAuthParams = self.oAuthParameters || {};
                    var syncToken = oAuthParams.syncToken;
                    var type = oAuthParams.type;
                    if (type == 'oauth2AsBridge' && syncToken != 'undefined') {
                        $.when(self.dataService.getOAuth2AuthFromSyncToken(syncToken)).done(function (res) {

                            if (res.isAuthenticate == 'true') {
                                var params = {};
                                params.loginOption = "alwaysAsk";
                                params.accessToken = res.accessToken;
                                params.type = type;
                                params.oAuth2InternalState = oAuth2InternalState;
                                if (res.domainAndUsername) {
                                    params.domain = res.domainAndUsername.split("\\")[0];
                                    params.user = res.domainAndUsername.split("\\")[1];
                                }

                                $.when(self.dataService.userLogin(params)).done(function (responseLogin) {
                                    if (responseLogin.isAuthenticate == 'true') {
                                        self.setBizagiAuthentication(responseLogin);
                                    }
                                    else{
                                        var message = bizagi.localization.getMessageFromLocalization(responseLogin.status, "error", ([responseLogin.paramError]));
                                        window.location.href = 'oauth2-error.html?error=' + responseLogin.status + '&error_description=' + message + '&http_status_code=' + responseLogin.httpStatusCode + '&state=';
                                    }
                                }).fail(function (responseError) {
                                    var message = bizagi.localization.getMessageFromLocalization(responseError.status, "error", ([responseError.paramError]));
                                    window.location.href = 'oauth2-error.html?error=' + responseError.status + '&error_description=' + message + '&http_status_code=' + responseError.httpStatusCode + '&state=';
                                });
                            }
                            else if (res.isAuthenticate == 'false') {
                                def.resolve(self.defaultWidget);
                            }
                            else if (res.status != 'SUCCESS') {
                                var message = bizagi.localization.getMessageFromLocalization(res.status, "error", ([res.paramError]));
                                window.location.href = 'oauth2-error.html?error=' + res.status + '&error_description=' + message + '&http_status_code=' + res.httpStatusCode + '&state=';
                            }
                        });
                    }
                    else if (type == 'oauth2AsServer') {
                        var data = {};
                        data["state"] = '__OAuIntSta__' + oAuth2InternalState;
                        $.when(self.dataService.getOAuth2RedirectAuthorizacionDataAsServer(data)).done(function (res) {
                            if (res.status == 'SUCCESS') {
                                //Redirection to OAuth2 Authorization Server
                                var url = res.authorizationUrl + '?response_type=' + res.responseType + '&client_id=' + res.clientId + '&redirect_uri=' + res.redirectUri + '&scope=' + res.scope;
                                if (res.isSingleSignOnCookieEnable) {
                                    url += '&sso=' + res.isSingleSignOnCookieEnable;
                                }
                                if (res.state) {
                                    url += '&state=' + res.state;
                                }
                                if (res.nonce) {
                                    url += '&nonce=' + res.nonce;
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
            self.loginConfig = responseConfig;
            self.session.isProduction = responseConfig.isProduction;

            //Ensures if the Bizagi
            if (self.loginConfig.authenticationType == 'BizAgi')
                self.loginConfig.isBizagiAuthentication = true;

            if (isRemoteUser == true) {
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

        $.when(widget, self.loginFactory.loadTemplates()).done(function (widget) {
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
            case "BIZAGI_LOGIN_WIDGET_QUICKLOGIN":
                return new bizagi.login.widgets.quicklogin(facade, dataService);
                break;
            default:
                return new bizagi.login.widgets.login(facade, dataService);
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
     *   Method to fetch templates from a private dictionary
     */
    getTemplate: function (template) {
        return this.loginFactory.getTemplate(template);
    },
    /**
     *
     * @param params
     */
    setBizagiAuthentication: function (params) {
        var self = this;
        params.isProduction = self.session.isProduction;
        var oAuthParameters = self.oAuthParameters || {};
        var type = oAuthParameters.type || "";
        if(type && (type == 'oauth2AsServer' || type == 'oauth2AsBridge')){
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
