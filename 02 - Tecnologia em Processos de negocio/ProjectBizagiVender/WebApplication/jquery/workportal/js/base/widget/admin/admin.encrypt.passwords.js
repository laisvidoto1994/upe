/**
* Activiy log for  activities, entities, and users
* 
* @author Liliana Fernandez Murcia
*/


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.encrypt.passwords", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ENCRYPT_PASSWORDS;
    },
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("encrypt.passwords");

        var content = self.content = $.tmpl(template, {});

        return content;
    }
});