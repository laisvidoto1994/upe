/**
* Activiy User Profiles
* 
* @author Liliana Fernandez Murcia
*/


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.user.profiles", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USER_PROFILES;
    },
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("user.profiles");
        var content = self.content = $.tmpl(template, {});
        self.loadtemplates();
        return content;
    },

    /*
    *Instances will implement this method
    */
    loadtemplates: function () { }
});