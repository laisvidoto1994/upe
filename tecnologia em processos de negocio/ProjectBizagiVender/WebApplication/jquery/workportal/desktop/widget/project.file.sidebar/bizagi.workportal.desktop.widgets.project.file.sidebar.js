/*
 *   Name: Bizagi Workportal project File Sidebar
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.file.sidebar", {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        params = params || {};
        params.supportNav = false;

        //Load templates
        self.loadTemplates({
            "project-file-sidebar": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.file.sidebar").concat("#project-file-sidebar")
        });

    },

    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROJECT_FILE_SIDEBAR;
    },

    /*
    * Renders the template defined in the widget
    */
    renderContent: function () {
        var self = this;

        var template = self.getTemplate("project-file-sidebar");
        self.content = template.render({});

        return self.content;
    }
});

bizagi.injector.register('bizagi.workportal.widgets.project.file.sidebar', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.file.sidebar], true);