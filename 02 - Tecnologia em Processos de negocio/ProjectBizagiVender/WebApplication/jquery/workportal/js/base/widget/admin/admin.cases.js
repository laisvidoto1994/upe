/**
 * Admin module to case massively reassign
 * 
 * @author Edward J Morales
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.cases", {}, {
    /*
     *   Returns the widget name
     */
    getWidgetName: function() {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ASYNC;
    },
    /*
     *   Renders the content for the current controller
     */
    renderContent: function() {
        var self = this;
        var template = self.getTemplate("admin.cases");
        var content = self.content = $.tmpl(template);

        return content;
    }
});