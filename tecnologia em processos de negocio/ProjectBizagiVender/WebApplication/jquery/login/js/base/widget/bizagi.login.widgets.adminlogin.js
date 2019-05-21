/**
* Basic login
* @author David Romero Estrada
*/

$.Class.extend("bizagi.login.widgets.adminlogin", {}, {
    init: function (loginFacade, dataService) {
        this.loginFacade = loginFacade;
        this.dataService = dataService;
        this.content;
    },
    renderContent: function () {
        var self = this;
        var templateWrapper = self.loginFacade.getTemplate("login-wrapper");
        var wrapper = "";
        // Render wrapper
        wrapper = $.tmpl(templateWrapper);
//dfdsf
        // Set wrapper content
        this.content = wrapper;

        return wrapper;
    },
    getContent: function () {
        return this.content;
    }
});