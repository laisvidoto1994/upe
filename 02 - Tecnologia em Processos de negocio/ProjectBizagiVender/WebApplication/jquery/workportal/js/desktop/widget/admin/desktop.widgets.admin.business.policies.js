/**
 * Name: BizAgi Desktop Widget Administration Processes (orchestrator)
 * 
 * @author Christian Collazos
 */


bizagi.workportal.widgets.admin.business.policies.extend("bizagi.workportal.widgets.admin.business.policies", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "admin.business.policies.wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies").concat( "#ui-bizagi-workportal-widget-admin-business-policies-wrapper"),
            "admin.business.policies.content": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies").concat("#ui-bizagi-workportal-widget-admin-business-policies-content"),
            useNewEngine: false
        });
    },

    postRender: function () {
        var self = this;
        self.setupData();
    },

    setupData: function () {
        var self = this,
            content = self.getContent(),
            generalContentTmpl = $.tmpl(self.generalContentTmpl, {});
        
        content.append(generalContentTmpl);
    },

    /*
    * initialize the process tree widget
    */
    setupPoliciesTree: function () {
        var self = this;
        var content = self.getContent();

        bizagi.treeRoutSelected = [];
        $("#treeLinksId").remove();

        self.processTree = new bizagi.workportal.widgets.tree(self.workportalFacade, self.dataService, $.extend(self.params, {
            canvas: $("#processTree", content)
        }));

        self.processTree.render();
    }



    /********************* EVENTS ******************/
    
    
});