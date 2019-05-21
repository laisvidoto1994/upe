/**
 * Default login widget for desktop
 * @author Edward J Morales
 */

bizagi.login.widgets.forgotpassword.extend("bizagi.login.widgets.forgotpassword", {}, {
    init: function (loginFacade, dataService) {
        this._super(loginFacade, dataService);
    },
    postRender: function () {
        var self = this;
        var template = self.loginFacade.getTemplate("forgot-password");
        var form = "";
        self.content = self.getContent();

        $.when(self.dataService.getDomainList()).done(function (domains) {

            // Render Form
            form = $.tmpl(template, domains);

            $("#form-content", self.content).append(form);

            window.forgot = self.content;

            //Checks if the secret question is enabled
            if (self.loginFacade.loginConfig.isSecretQuestionEnabled) {
                self.displaySecretQuestionFields(false);
            } else {
                $("#secret-question", self.content).hide();
                $('label[for="secret-question"]', self.content).hide();

                $("#secret-answer", self.content).hide();
                $('label[for="secret-answer"]', self.content).hide();

                $("#btn-recover-password", self.content).hide();
            }

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
        var domainInput = $("#domain", content);
        var secretAnswer = $("#secret-answer", content);

        $("#btn-search-user", content).bind("click", function () {
            self.userAuthentication({
                user: userInput.val(),
                domain: domainInput.val()
            });
        });

        $("#btn-recover-password", content).bind("click", function (event) {
            var paramSecretAnswer = "";
            if (self.loginFacade.loginConfig.isSecretQuestionEnabled) {
                paramSecretAnswer = secretAnswer.val();
            }

            self.questionAuthentication({
                user: userInput.val(),
                domain: domainInput.val(),
                secretAnswer: paramSecretAnswer
            });
        });

        $("#lnkBackToLogin", content).bind("click", function () {
            self.loginFacade.changeWidget("BIZAGI_LOGIN_WIDGET_LOGIN");
        });
    },

    /*
     *
     */
    userAuthentication: function (params) {
        var self = this;

        if (params.user === "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-user-name-empty"));
        }
        if (params.domain === "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-domain-empty"));
        }


        if (!self.messageController.hasErrors()) {
            $.when(self.dataService.secretQuestion(params)).done(function (response) {
                var content = self.getContent();
                var userInput = $("#user", content);
                var domainInput = $("#domain", content);
                if (response.status == "SUCCESS" || response.status == "NOSECRETQUESTION") {


                    if (!response.enabled) {
                        self.messageController.showWidgetCustomMessage("workportal-login-user-disabled", "success");
                        return;
                    }

                    if (bizagi.util.parseBoolean(response.hasSecretQuestion) && self.loginFacade.loginConfig.isSecretQuestionEnabled) {
                        //Show the required fields
                        self.displaySecretQuestionFields(true);
                        //disable input user and domain select
                        userInput.attr('disabled', true);
                        domainInput.attr('disabled', true);
                        //Set the secret question
                        $("#secret-question", self.content).val(response.secretQuestion);

                        self.messageController.hideErrors();
                    } else {

                        self.displaySecretQuestionFields(false);

                        $("#btn-recover-password", self.content).show();
                        $("#btn-search-user", self.content).hide();

                        //disable input user and domain select
                        userInput.attr('disabled', true);
                        domainInput.attr('disabled', true);
                    }
                } else {
                    if (response.status == "1150") {
                        self.messageController.showWidgetCustomMessage("1150", "error", [userInput.val()] );
                    } else {
                        self.messageController.showWidgetCustomMessage(response.status, "error");
                    }
                }
            }).fail(function () {
                self.messageController.showWidgetCustomMessage("generic", "error");
            });
        }
        else {
            self.messageController.showErrors();
        }
    },

    /*
     *
     */
    questionAuthentication: function (params) {
        var self = this;

        if (params.user === "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-user-name-empty"));
        }
        if (params.domain === "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-domain-empty"));
        }

        if (!self.messageController.hasErrors()) {
            $(".sendingPassword", self.content).show();
            $("#btn-recover-password", self.content).hide();
            $.when(self.dataService.forgotPassword(params)).done(function (response) {
                if (response.status == "SUCCESS" && bizagi.util.parseBoolean(response.passwordRequested)) {
                    self.messageController.showWidgetCustomMessage("workportal-login-password-sent", "success");
                    $(".sendingPassword", self.content).hide();
                    $("#btn-recover-password", self.content).show();
                } else {
                    self.messageController.showWidgetCustomMessage(response.status, "error");
                    $(".sendingPassword", self.content).hide();
                    $("#btn-recover-password", self.content).show();
                }

            }).fail(function () {
                self.messageController.showWidgetCustomMessage("generic", "error");
                $(".sendingPassword", self.content).hide();
                $("#btn-recover-password", self.content).show();
            });


        } else {
            self.messageController.showErrors();
        }
    },

    /*
     *
     */
    displaySecretQuestionFields: function (value) {
        var self = this;

        if (value) {
            $("#secret-question", self.content).show();
            $('label[for="secret-question"]', self.content).show();

            $("#secret-answer", self.content).show();
            $('label[for="secret-answer"]', self.content).show();

            $("#btn-recover-password", self.content).show();

            $("#btn-search-user", self.content).remove();
        }
        else {
            $("#secret-question", self.content).hide();
            $('label[for="secret-question"]', self.content).hide();

            $("#secret-answer", self.content).hide();
            $('label[for="secret-answer"]', self.content).hide();
            $(".sendingPassword", self.content).hide();
            $("#btn-recover-password", self.content).hide();
        }
    }
});
