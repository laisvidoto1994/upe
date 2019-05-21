/**
* Name: BizAgi Desktop Widget Administration Policies - Tabs 
* 
* @author Christian Collazos
*/


bizagi.workportal.widgets.admin.business.policies.tabs.extend("bizagi.workportal.widgets.admin.business.policies.tabs", {}, {
    
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "admin.business.policies.tabs.wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies").concat("#ui-bizagi-workportal-widget-admin-business-policies-tabs-wrapper"),
            "admin.business.policies.tabs.content": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies").concat("#ui-bizagi-workportal-widget-admin-business-policies-tabs-content"),
            useNewEngine: false
        });
    },

    renderContent: function () {
        var self = this;
        var template = self.getTemplate("admin.business.policies.tabs.wrapper");
        var content;

        self.decisionTableContent = self.getTemplate("admin.business.policies.tabs.content");
        content = self.content = $.tmpl(template, {});

        // Override canvas if it has been defined
        if (self.params.canvas) {
            content = $(self.params.canvas).append(content);
        }

        return content;
    },

    postRender: function () {
        var self = this;
    }
});