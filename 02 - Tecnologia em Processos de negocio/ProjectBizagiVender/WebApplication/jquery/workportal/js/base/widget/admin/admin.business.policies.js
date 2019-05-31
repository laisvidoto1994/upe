/**
 * Admin / Business Policies
 * 
 * @author David Andres Niño Villalobos
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.business.policies", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES;
    },
    
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this,
            template = self.getTemplate("admin.business.policies.wrapper"),
            content;

        self.generalContentTmpl = self.getTemplate("admin.business.policies.content");

        content = self.content = $.tmpl(template, {});
        self.loadtemplates();
        return content;
    },
    
    /*
    * this will be implemented on each device
    */
    loadtemplates: function () { }

});