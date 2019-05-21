/**
 * Admin module to Asynchronous ECM Upload Jobs
 * 
 * @author David Andrés Niño
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.asyncecm.upload", {}, {
    /*
     *   Returns the widget name
     */
    getWidgetName: function() {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ASYNCECM_UPLOAD;
    },
    /*
     *   Renders the content for the current controller
     */
    renderContent: function() {
        var self = this;
        var template = self.getTemplate("async.ecm.upload");
        var content = self.content = $.tmpl(template);

        return content;
    }
});