/**
 * Change password desktop widget
 * @author Edward J Morales
 */

bizagi.login.widgets.changepassword.extend("bizagi.login.widgets.changepassword", {}, {
    init: function (loginFacade, dataService) {
        this._super(loginFacade, dataService);


    },
    postRender: function (params) {
        var self = this;
        var template = self.loginFacade.getTemplate("change-password");
        var form = "";
        var content = self.getContent();
        self.params = params || {};

        $.when(self.dataService.getDomainList()).done(function (domains) {

            // Render Form
            form = $.tmpl(template, {
                domains: domains.domains,
                loginConfig: self.params
            });

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
        var newPasswordInput = $("#new-password", content);
        var passwordConfirmationInput = $("#password-confirmation", content);
        var secretQuestionInput = $("#secret-question", content);
        var secretAnswerInput = $("#secret-answer", content);

        $("#btn-change-password", content).bind("click", function () {
            var params = {
                domain: domainInput.val(),
                user: userInput.val(),
                password: passwordInput.val(),

                newPassword: newPasswordInput.val(),
                passwordConfirmation: passwordConfirmationInput.val(),
                secretQuestion: secretQuestionInput.val(),
                secretAnswer: secretAnswerInput.val()
            }

            self.changePassword(params);
        });

        $("#lnkBackToLogin", content).bind("click", function () {
            self.loginFacade.changeWidget("BIZAGI_LOGIN_WIDGET_LOGIN");
        });
    },

    /*
    *
    */
    changePassword: function (params) {
        var self = this;
        params = params || {};

        if (params.user == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-user-name-empty"));
        }
        if (params.password == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-old-password-empty"));
        }
        if (params.domain == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-domain-empty"));
        }
        if (params.newPassword == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-new-password-empty"));

        } if (params.passwordConfirmation == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-password-confirmation-empty"));
        }
        if (params.secretQuestion == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-secret-question-empty"));
        }

        if (params.secretAnswer == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-secret-answer-empty"));
        }


        if (params.passwordConfirmation != "" && params.newPassword != "" && params.passwordConfirmation != params.newPassword) {

            self.messageController.addErrorMessage(bizagi.localization.getResource("login-new-password-comparison-differences"));
        }


        //If the user doesn't have secret question, it will be sent empty
        if (bizagi.util.parseBoolean(!self.params.isSecretQuestionEnabled)) {
            params.secretQuestion = "";
            params.secretAnswer = "";
        }

        if (!self.messageController.hasErrors()) {
            $.when(self.dataService.changePassword(params)).done(function (response) {

                if (bizagi.util.parseBoolean(response.passwordChanged)) {
                    self.messageController.showWidgetCustomMessage("workportal-login-changepassword-success", "success");
                    // Reset data form
                    $("#change-password", self.content)[0].reset();
                    if(self.params.legend){
                        $("#change-password legend", self.content).hide();
                    }
                } else {
                    var messageParams = [ $("#domain", "#change-password").val() + " / " + $("#user", "#change-password").val(),response.param ];
                    self.messageController.showWidgetCustomMessage(response.status, "error", messageParams, false);
                }
            });

        } else {
            self.messageController.showErrors();
        }

    }
});
