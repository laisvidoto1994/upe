/*
 *   Name: Bizagi Workportal Desktop Project Plan Parent
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.parent", {}, {

    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "plan-parent-main": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.parent").concat("#project-plan-parent")
        });
    },

    renderContent: function () {

        var self = this;
        var tmpl = self.getTemplate("plan-parent-main");

        self.content = tmpl.render({});

        return self.content;
    },

    postRender: function () {
        var self = this;
        self.sub("LOAD_INFO_SUMMARY_PLAN", $.proxy(self.onNotifyLoadInfoSummaryPlan, self));
    },

    /**
     * Notifies when an event is raised
     */
    onNotifyLoadInfoSummaryPlan: function (event, params) {
        var self = this,
        $content = self.getContent().empty();
        self.params = $.extend(self.params, params.args);
        if (self.params.plan.parentWorkItem) {
            $.when(self.dataService.getPlanParent({ idPlan: self.params.plan.id })).done(function(planParent) {
                self.params.plan.parent = planParent;
                if (self.params.plan.parent) {
                    var argsTemplate = {
                        idParent: self.params.plan.parent.radNumber,
                        nameParent: self.params.plan.parent.displayName,
                        idCase: self.params.plan.parent.idCase,
                        idWorkflow: self.params.plan.parent.idWorkflow,
                        idWorkItem: self.params.plan.parent.idWorkItem,
                        idTask: self.params.plan.parent.idTask,
                        processName: self.params.process ? self.params.process : self.params.plan.parent.planName
                    };

                    //TODO: double call because routing dont release memory and widgets
                    //Test with a breakpoint
                    $content.empty();

                    //Update widget
                    var contentTemplate = self.getTemplate("plan-parent-main");
                    contentTemplate
                        .render(argsTemplate)
                        .appendTo($content);
                    $("#go-to-parent-case", $content).on("click", $.proxy(self.onClickGoToParentCase, self));
                }
            }).fail(function(msg) {

            });
        }
    },

    onClickGoToParentCase: function (event) {
        event.preventDefault();
        var self = this;
        self.routingExecute($(event.target).closest("#go-to-parent-case"));
    }
});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.parent", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.plan.parent], true);