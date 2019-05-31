/**
 * Activiy log for  activities, entities, and users
 * 
 * @author David Andrés Niño
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.activity.log", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ACTIVITY_LOG;
    },
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("activity.log");

        self.idCase = self.params.idCase;
        self.idWorkflow = self.params.idWorkflow;

        var content = self.content = $.tmpl(template, { idCase: self.idCase });

        return content;
    }
});