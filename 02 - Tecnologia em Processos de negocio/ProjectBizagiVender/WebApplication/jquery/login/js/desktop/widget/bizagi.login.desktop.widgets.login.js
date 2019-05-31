/**
* Default login widget for desktop
* @author Edward J Morales
*/

bizagi.login.widgets.login.extend("bizagi.login.widgets.login", {}, {
    init: function (loginFacade, dataService) {
        this._super(loginFacade, dataService);
    },
    postRender: function (params) {
        var self = this;
        var template = self.loginFacade.getTemplate("normal-login");
        var form = "";
        var content = self.getContent();
        self.params = params || {};

        if (params.authenticationType == "BizAgi" || params.authenticationType == "Bizagi" || params.authenticationType == "Mixed") {
            var enableOptions = "true";
        }

        $.when(self.dataService.getDomainList()).done(function (domains) {

            // Render Form
            form = $.tmpl(template, {
                domains: domains.domains,
                isBizagiAuthentication: enableOptions,
                isAdminLoginRequired: bizagi.util.parseBoolean(self.params.isAdminLoginRequired)
            });

            $("#form-content", content).append(form);

            if (params.user) {
                $("#user", ".login-data").val(params.user);
            }
            if (params.domain) {
                $("#domain").val(params.domain);
            }
            if (params.selectedCheck) {
                var loginOption = "";

                if (params.selectedCheck == "saveAccountPassword") {
                    loginOption = "rbSaveAccountPassword";
                } else if (params.selectedCheck == "saveAccount") {
                    loginOption = "rbSaveAccount";
                } else {
                    loginOption = "rbAskAlways";
                }
                $("#" + loginOption, ".login-data").attr("checked", "checked");
            }


            // Create object of message controller
            self.messageController = new bizagi.login.message(self.loginFacade, $("#login-message-wrapper", content));

            // Set events
            self.eventHandler();

        });
    },
    eventHandler: function () {
        var self = this;
        var content = self.getContent();
        var userInput = $("#user", content);
        var passwordInput = $("#password", content);
        var domainInput = $("#domain", content);
        var oAuthParams = self.loginFacade.login.oAuthParameters || {};

        $("#user,#password", content).keypress(function(e){
            if(e.which == 13) {
               $("#btn-login", content).click();
           }
        });

        $("#btn-login", content).bind("click", function () {
            var loginOption = $("input:checked").attr("id");

            if (loginOption == "rbSaveAccountPassword") {
                loginOption = "saveAccountPassword";
            } else if (loginOption == "rbSaveAccount") {
                loginOption = "saveAccount";
            } else {
                loginOption = "alwaysAsk";
            }

            self.generalAuthentication({
                user: userInput.val(),
                password: passwordInput.val(),
                domain: domainInput.val(),
                loginOption: loginOption,
                type:  oAuthParams.type || "",
                oAuth2InternalState: oAuthParams.oAuth2InternalState || ""
            });
        });

        $("#changePassword", content).bind("click", function () {
            self.loginFacade.changeWidget("BIZAGI_LOGIN_WIDGET_CHANGEPASSWORD");
        });
        $("#forgotPassword", content).bind("click", function () {
            self.loginFacade.changeWidget("BIZAGI_LOGIN_WIDGET_FORGOTPASSWORD");
        });
        $("#unlockPassword", content).bind("click", function () {
            self.loginFacade.changeWidget("BIZAGI_LOGIN_WIDGET_UNLOCKACCOUNT");
        });
        $('#btn-adminLogin', content).bind("click", function (event) {
            event.preventDefault();
            self.loginFacade.changeWidget("BIZAGI_LOGIN_WIDGET_ADMINLOGIN");
        });
    },
    generalAuthentication: function (params) {
        var self = this;

        if (params.user === "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-user-name-empty"));
        }
        if (params.password === "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-user-password-empty"));
        }

        if (!self.messageController.hasErrors()) {
            $.when(self.dataService.userLogin(params)).done(function (response) {
                if (bizagi.util.parseBoolean(response.isAuthenticate)) {
                    self.loginFacade.setBizagiAuthentication(response);
                } else {
                    if (response.status === "451"){
                        self.loginFacade.changeWidget("BIZAGI_LOGIN_WIDGET_CHANGEPASSWORD", {legend: bizagi.localization.getResource("workportal-general-error-" + response.status).replace("{0}", params.user)});
                    }
                    else {
                        var param = "";
                        if (response.paramError) {
                            param = response.paramError;
                        }
                        else if (params.user) {
                            param = params.user;
                        }

                        self.messageController.showWidgetCustomMessage(response.status, "error", [param]);
                    }
                }
            }).fail(function () {
                self.messageController.showWidgetCustomMessage("generic", "error");
            });

        } else {
            self.messageController.showErrors();
        }

    }
});
