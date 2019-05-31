/*
 *   Name: Bizagi Workportal Desktop Project Timeline Controller
 *   Author: Diego Parra
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.timeline.sidebar", {}, {
    /*
     *   Constructor
     */
    init: function(workportalFacade, dataService, notifier, params) {

        var self = this;

        //Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "project-timeline-sidebar": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.timeline.sidebar").concat("#project-timeline-sidebar")
        });

    },

    /*
     * Renders the template defined in the widget
     */
    renderContent: function() {
        var self = this;
        var template = self.getTemplate("project-timeline-sidebar");

        var content = self.content = template.render({});

        // Add handlers
        $(".bz-timeline-show-process-map", content).on("click", function() {
            self.showProcessMap();
        });
        $(".bz-timeline-show-activity-map", content).on("click", function () {
            self.showActivityMap();
        });

        return self.content;
    },

    showProcessMap: function() {
        var self = this;
        var dialog = bizagi.injector.get("dialogWidgets");
        var data = {
            closeVisible: true,
            modalParameters: {
                title: bizagi.localization.getResource("workportal-project-casedashboard-timeline-diagram-popup-title"),
                refreshInbox: false
            },
            idWorkflow: self.params.idWorkflow,
            idCase: self.params.idCase,
            plan: self.params.plan,
            showProcessDiagram: false,
            showActivityMap: false,
            showProcessMap: true
        };
        data.widgetInstance = bizagi.injector.getNewInstance("bizagi.workportal.widgets.project.processMap", data);
        data.widgetInstance.sub("closeDialog", function (ev, params) {
            dialog.close();
            defer.resolve(params);
        });

        dialog.renderWidget(data);

        self.publish("addDialogToDialogStack", dialog);
    },

    showActivityMap: function () {
        var self = this;
        var dialog = bizagi.injector.get("dialogWidgets");
        var data = {
            closeVisible: true,
            modalParameters: {
                title: bizagi.localization.getResource("workportal-project-casedashboard-timeline-diagram-popup-title"),
                refreshInbox: false
            },
            idWorkflow: self.params.idWorkflow,
            idCase: self.params.idCase,
            plan: self.params.plan,
            showProcessDiagram: false,
            showActivityMap: true,
            showProcessMap: false
        };
        data.widgetInstance = bizagi.injector.getNewInstance("bizagi.workportal.widgets.project.processMap", data);
        data.widgetInstance.sub("closeDialog", function (ev, params) {
            dialog.close();
            defer.resolve(params);
        });

        dialog.renderWidget(data);

        self.publish("addDialogToDialogStack", dialog);
    }
});

bizagi.injector.register("bizagi.workportal.widgets.project.timeline.sidebar", ["workportalFacade", "dataService", "notifier", bizagi.workportal.widgets.project.timeline.sidebar], true);
