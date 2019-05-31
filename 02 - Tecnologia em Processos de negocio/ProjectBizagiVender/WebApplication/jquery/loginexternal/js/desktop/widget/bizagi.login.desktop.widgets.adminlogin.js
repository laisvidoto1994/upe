/**
* Admin login widget for desktop
* @author David Romero
*/

bizagi.login.widgets.login.extend("bizagi.login.widgets.adminlogin", {}, {
    init: function (loginFacade, dataService) {
        this._super(loginFacade, dataService);


    },
    postRender: function (params) {
        var self = this;
        var template = self.loginFacade.getTemplate("admin-login");
        var form = "";
        var content = self.getContent();
        self.params = params || {};

        // Render Form
        form = $.tmpl(template, {
            admin: "domain\\admon",
        });

        $("#form-content", content).append(form);

        // Create object of message controller
        self.messageController = new bizagi.login.message(self.loginFacade, $("#login-message-wrapper", content));

        // Set events
        self.eventHandler();

    },
    eventHandler: function () {
        var self = this;
        var content = self.getContent();
        var userInput = $("#user", content);
        var passwordInput = $("#password", content);
        var loginOption="";
        var oAuthParams = self.loginFacade.oAuthParameters || {};

        loginOption = self.params.selectedCheck ? self.params.selectedCheck : "alwaysAsk";

        $("#user,#password", content).keypress(function(e){
            if(e.which == 13) {
                $("#btn-login", content).click();
            }
        });
   
        $("#btn-login", content).bind("click", function () {
            
            self.generalAuthentication({
                domain: "domain",
                user: "admon",
                password: passwordInput.val(),
                loginOption:loginOption,
                type:  oAuthParams.type || "",
                oAuth2InternalState: oAuthParams.oAuth2InternalState || ""
            });
        });

        $("#lnkBackToLogin", content).bind("click", function () {
            self.loginFacade.changeWidget("BIZAGI_LOGIN_WIDGET_LOGIN");
        });

    },
    generalAuthentication: function (params) {
        var self = this;

        if (params.user === "") {
            self.messageController.addErrorMessage(bizagi.localization.getResource("login-user-name-empty"));
        }
       
        if (!self.messageController.hasErrors()) {
            $.when(self.dataService.userLogin(params)).done(function (response) {
                if (bizagi.util.parseBoolean(response.isAuthenticate)) {
                    self.loginFacade.setBizagiAuthentication(response);
                } else {
                    self.messageController.showWidgetCustomMessage(response.status, "error", [params.user]);
                }
            }).fail(function () {
                self.messageController.showWidgetCustomMessage("generic", "error");
            });

        } else {
            self.messageController.showErrors();
        }

    }
});
