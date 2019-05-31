/**
 * Name: Bizagi Workportal Desktop Sidebar Controller
 * Author: Mauricio Sánchez  -  Danny Gonzalez
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.sidebarhome", {}, {
    /**
     * Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);
        //Load templates
        self.loadTemplates({
            "sidebarhome": bizagi.getTemplate("bizagi.workportal.desktop.widget.sidebarhome").concat("#sidebarhome-wrapper")
        });
    },

    /**
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("sidebarhome");
        self.content = $(template.render({}));

        return self.content;
    },

    /**
     * links events with handlers
     */
    postRender: function () {
    }
});

bizagi.injector.register('bizagi.workportal.widgets.sidebarhome', ['workportalFacade', 'dataService', bizagi.workportal.widgets.sidebarhome], true);