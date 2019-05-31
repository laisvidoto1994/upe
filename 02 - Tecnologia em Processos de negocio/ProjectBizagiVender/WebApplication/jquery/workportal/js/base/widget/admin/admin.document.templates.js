/**
 * Document templates widget, for uploading and updating created templates via Bizagi Studio
 * 
 * @author David Andrés Niño
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.document.templates", {}, {
    /*
     *   Returns the widget name
     */
    getWidgetName: function() {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_DOCUMENT_TEMPLATES;
    },
    /*
     *   Renders the content for the current controller
     */
    renderContent: function() {
        var self = this;
        var template = self.getTemplate("admin.document.templates");
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