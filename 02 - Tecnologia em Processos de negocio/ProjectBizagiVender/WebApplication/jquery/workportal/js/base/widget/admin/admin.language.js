/**
 * Admin / Language
 * 
 * @author Ivan Taimal Narvaez
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.language", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_LANGUAGE;
    },
    
    /*
    *   Renders the content for the current controller
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("admin.language.wrapper");
        var content;

        self.panelWrapper = $.tmpl(self.getTemplate("admin.language.panel.wrapper"));
        self.generalTemplateListTmpl = self.getTemplate("admin.language.template.list");
        self.fileCultureName = self.getTemplate("admin.language.upload.file.culturename");
        self.bizagiObjectsList = self.getTemplate("admin.language.bizagi.objects.list");
        self.entitiesListTmpl = self.getTemplate("admin.language.entities.list");

        content = self.content = $.tmpl(template, {});
        self.loadtemplates();
        return content;
    },
    
    /*
    * this will be implemented on each device
    */
    loadtemplates: function () { }


});