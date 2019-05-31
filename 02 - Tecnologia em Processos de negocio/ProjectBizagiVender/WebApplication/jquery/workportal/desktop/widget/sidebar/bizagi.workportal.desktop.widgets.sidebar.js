/**
 *   Name: Bizagi Workportal Desktop Sidebar Controller
 *   Author: Mauricio Sánchez  -  Danny Gonzalez
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.sidebar", {}, {
    /**
     * Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);
        //Load templates
        self.loadTemplates({
            "sidebar": bizagi.getTemplate("bizagi.workportal.desktop.widget.sidebar").concat("#sidebar-wrapper")
        });
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("sidebar");
        self.content = $(template.render({}));

        return self.content;
    },

    /**
     * links events with handlers
     */
    postRender: function () {
    }
});

bizagi.injector.register('bizagi.workportal.widgets.sidebar', ['workportalFacade', 'dataService', bizagi.workportal.widgets.sidebar], true);