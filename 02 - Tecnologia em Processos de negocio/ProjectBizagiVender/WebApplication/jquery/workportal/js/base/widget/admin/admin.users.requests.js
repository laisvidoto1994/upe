/**
* Users requests for users
* 
* @author Liliana Fernandez Murcia
*/


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.users.requests", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USERS_REQUESTS;
    },
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("users.requests");
        var content = self.content = $.tmpl(template);

        return content;
    }
});