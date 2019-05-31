/*
 *   Name: Bizagi Workportal Project File Sidebar
 *   Author: David Romero Estrada
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activities.sidebar", {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        params = params || {};

        //Load templates
        self.loadTemplates({
            "project-plan-activities-sidebar": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activities.sidebar").concat("#project-plan-activities-sidebar")
        });

    },

    /*
    * Renders the template defined in the widget
    */
    renderContent: function () {
        var self = this;

        var template = self.getTemplate("project-plan-activities-sidebar");
        self.content = template.render({});

        return self.content;
    }
});

bizagi.injector.register('bizagi.workportal.widgets.project.plan.activities.sidebar', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.plan.activities.sidebar], true);