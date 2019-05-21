/**
 *
 * Created by RicardoPD on 2/1/2017.
 */

bizagi.login.factory.extend("bizagi.login.factory", {}, {
    /*
     *   Load all the templates used in the workportal
     */
    loadTemplates: function () {
        var self = this;
        var defer = new $.Deferred();
        $.when(
            self.loadTemplate("login-wrapper", bizagi.getTemplate("bizagi.loginexternal.smartphone.login") + "#ui-bizagi-login-wrapper"),
            self.loadTemplate("normal-login", bizagi.getTemplate("bizagi.loginexternal.smartphone.login") + "#ui-bizagi-login-normal-login"),
            self.loadTemplate("admin-login", bizagi.getTemplate("bizagi.loginexternal.smartphone.login") + "#ui-bizagi-login-admin-login"),
            self.loadTemplate("login-error-message", bizagi.getTemplate("bizagi.loginexternal.smartphone.login") + "#ui-bizagi-login-error-message"),
            self.loadTemplate("quick-login", bizagi.getTemplate("bizagi.loginexternal.smartphone.login") + "#ui-bizagi-login-quick-login")
        ).done(function () {
            // Resolve when all templates are loaded
            defer.resolve();
        });
        return defer.promise();
    }
});
