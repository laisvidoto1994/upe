/**
 * Admin / Asynchronous Activities Console
 * 
 * @author Christian Collazos
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.async.activities", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ASYNC_ACTIVITIES;
    },
    
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("admin.async.activities");
        var content;

        content = self.content = $.tmpl(template, {});
        self.loadtemplates();
        return content;
    },
    
    /*
    * this will be implemented on each device
    */
    loadtemplates: function () { }


});