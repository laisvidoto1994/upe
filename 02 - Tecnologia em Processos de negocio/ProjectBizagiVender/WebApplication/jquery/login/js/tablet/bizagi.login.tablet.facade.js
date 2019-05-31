/**
 * Login facade for desktop
 * 
 * @author Edward J Morales
 */

bizagi.login.desktop.facade.extend("bizagi.login.tablet.facade", {}, {
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


        // Get login configuration
        $.when(self.dataService.getConfiguration()).done(function (response) {
            self.loginConfig = response;

            if (bizagi.util.parseBoolean(response.isQuickLogin)) {
                def.resolve("BIZAGI_LOGIN_WIDGET_QUICKLOGIN");
            } else {
                def.resolve(self.defaultWidget);
            }

        }).fail(function(message){
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

             var isRemoteUser= responseConfig.isRemoteUser;
              if (isRemoteUser==true) {
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
               
              }else{
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

        });
              }


             
        });

        return def;

    },

    renderWidget: function (widget, params, def) {
        var self = this;

        widget = widget || self.getDefaultWidget();

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
                alert("error widget " + widget + " not found");
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
    setBizagiAuthentication: function (params) {
        sessionStorage.setItem("bizagiAuthentication", JSON.encode(params));
        // Refresh page in order to load workportal module
        location.reload();
    }
});
