/**
 * Forgot Password
 * @author Edward J Morales
 */

$.Class.extend("bizagi.login.widgets.forgotpassword", {}, {
    init: function(loginFacade, dataService) {
        this.loginFacade = loginFacade;
        this.dataService = dataService;
        this.content;
    },
    renderContent: function() {
        var self = this;
        var templateWrapper = self.loginFacade.getTemplate("login-wrapper");
        var wrapper = "";
        // Render wrapper
        wrapper = $.tmpl(templateWrapper);

        // Set wrapper content
        this.content = wrapper;

        return wrapper;
    },
    getContent: function() {
        return this.content;
    }
});