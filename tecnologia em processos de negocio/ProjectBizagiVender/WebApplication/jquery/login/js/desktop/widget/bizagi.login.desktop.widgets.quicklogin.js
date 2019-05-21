bizagi.login.widgets.quicklogin.extend("bizagi.login.widgets.quicklogin", {}, {
    init: function(loginFacade, dataService) {
        this._super(loginFacade, dataService);
    },
    postRender: function() {
        var self = this;
        var template = self.loginFacade.getTemplate("quick-login");
        var form = "";
        var content = self.getContent();
      

        $.when(self.dataService.getQuickLoginUserList()).done(function(users) {

            
            var item ={ item:users.users.length};
          
            // Render Form
            form = $.tmpl(template, users,item );

            $("#form-content", self.content).append(form);

            // Create object of message controller
            self.messageController = new bizagi.login.message(self.loginFacade, $("#login-message-wrapper", content));

            // Set events
            self.eventHandler();
        });
    },
    eventHandler: function() {
        var self = this;
        var content = self.getContent();
        var userInput = $("#username", content);
        var loginOption = "alwaysAsk";
        var oAuthParams = self.loginFacade.login.oAuthParameters || {};

        $("#btn-login", content).bind("click", function (event) {
            event.preventDefault();
            self.quickLogin({
                domain: userInput.val().split("\\")[0],
                user: userInput.val().split("\\")[1],
                password:"",
                loginOption: loginOption,
                type:  oAuthParams.type || "",
                oAuth2InternalState: oAuthParams.oAuth2InternalState || ""
            });
        });

    },
    quickLogin: function(params) {
        var self = this;

        if (params.user == "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-user-name-empty"));
        }

        if (!self.messageController.hasErrors()) {

            $.when(self.dataService.userLogin(params)).done(function(response) {

                if (bizagi.util.parseBoolean(response.isAuthenticate)) {
                    self.loginFacade.setBizagiAuthentication(response);
                } else {
                    self.messageController.showWidgetCustomMessage(response.status, "error");
                }

            }).fail(function(message) {

                self.messageController.showWidgetCustomMessage("generic", "error");

            });

        } else {
            self.messageController.showErrors();
        }
    }
});