/**
 * Unlock Account desktop widget
 * @author Edward J Morales
 */

bizagi.login.widgets.unlockaccount.extend("bizagi.login.widgets.unlockaccount", {}, {
    init: function (loginFacade, dataService) {
        this._super(loginFacade, dataService);
    },
    postRender: function () {
        var self = this;
        var template = self.loginFacade.getTemplate("unlock-account");
        var form = "";
        self.content = self.getContent();
       
       

        $.when(self.dataService.getDomainList()).done(function (domains) {

            // Render Form
            form = $.tmpl(template, domains);

            $("#form-content", self.content).append(form);

            // Create object of message controller
            self.messageController = new bizagi.login.message(self.loginFacade, $("#login-message-wrapper", self.content));

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
        var observationInput = $("#observation", content);
        $(".sendingPassword").hide();
        $("#btn-unlock-account", content).bind("click", function () {
            self.unlockAccount({
                user: userInput.val(),
                password: passwordInput.val(),
                domain: domainInput.val(),
                observation: observationInput.val()
            });
        });

        $("#lnkBackToLogin", content).bind("click", function () {
            self.loginFacade.changeWidget("BIZAGI_LOGIN_WIDGET_LOGIN");
        });
    },
    unlockAccount: function (params) {
        var self = this;
        var params = params;

        if (params.user == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-user-name-empty"));
        }
        if (params.password == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-user-password-empty"));
        }
        if (params.domain == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-domain-empty"));
        }
        if (params.observation == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-observation-empty"));
        }
        if (params.observation.length > 100) {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-observation-max-length"));
        }

        if (!self.messageController.hasErrors()) {
            $(".sendingPassword").show();
            $("#btn-unlock-account").hide();
            $.when(self.dataService.unlockAccount(params)).done(function (response) {

                if (bizagi.util.parseBoolean(response.unlocked)) {
                   
                    if (response.status == "SUCCESS") {
                        self.messageController.showWidgetCustomMessage("workportal-login-unlock-success", "success");
                        // Reset data form
                        $(".sendingPassword").hide();
                        $("#btn-unlock-account").show();
                        $("#loginForm", self.content)[0].reset();
                    }
                    else {
                        if (response.status == "SUCCESSBUTMAILERROR")
                        $(".sendingPassword").hide();
                        $("#btn-unlock-account").show();
                        self.messageController.showWidgetCustomMessage("workportal-login-unlock-successbutmailerror", "success");
                    }
                }
                else {
                    self.messageController.showWidgetCustomMessage(response.status, "error", [params.user]);
                    $(".sendingPassword").hide();
                    $("#btn-unlock-account").show();
                }

            }).fail(function (message) {
                self.messageController.showWidgetCustomMessage("generic", "error");
                $(".sendingPassword", self.content).hide();
                $("#btn-unlock-account", self.content).show();
            });
        } else {
            self.messageController.showErrors();
        }
    }
});