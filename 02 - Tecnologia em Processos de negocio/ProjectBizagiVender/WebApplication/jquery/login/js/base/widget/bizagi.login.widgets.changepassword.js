/**
 * Change password
 * @author Edward J Morales
 */

$.Class.extend("bizagi.login.widgets.changepassword", {}, {
    init: function(loginFacade, dataService) {
        this.loginFacade = loginFacade;
        this.dataService = dataService;
        this.content;
    },
    renderContent: function(params) {
        var self = this;
        var templateWrapper = self.loginFacade.getTemplate("login-wrapper");
        var wrapper = "";
        
        // Set global parameters
        self.params = params || {};
        
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