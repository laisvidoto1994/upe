/**
* Activiy log for  activities, entities, and users
* 
* @author David Andrés Niño
*/


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.alarms", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ALARMS;
    },
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("alarms");

        var content = self.content = $.tmpl(template);

        return content;
    }
});