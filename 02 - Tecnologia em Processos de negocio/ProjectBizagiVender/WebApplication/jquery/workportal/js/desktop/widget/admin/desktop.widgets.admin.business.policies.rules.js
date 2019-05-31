/**
* Name: BizAgi Desktop Widget Administration Policies - Rules
* 
* @author Christian Collazos
*/


bizagi.workportal.widgets.admin.business.policies.rules.extend("bizagi.workportal.widgets.admin.business.policies.rules", {}, {
    
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "admin.business.policies.rules.wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies").concat("#ui-bizagi-workportal-widget-admin-business-policies-rules-wrapper"),
            "admin.business.policies.rules.content": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies").concat("#ui-bizagi-workportal-widget-admin-business-policies-rules-content"),
            useNewEngine: false
        });
    },

    renderContent: function () {
        var self = this;
        var template = self.getTemplate("admin.business.policies.rules.wrapper");
        var content;

        self.decisionTableContent = self.getTemplate("admin.business.policies.rules.content");
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