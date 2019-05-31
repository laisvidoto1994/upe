/*
 *   Name: BizAgi Workportal Desktop Render Widget Controller
 *   Author: Diego Parra (based on Edward Morales version)
 *   Comments:
 *   -   This script will provide desktop overrides to implement the render widget
 */

// Auto extend
bizagi.workportal.widgets.routing.extend("bizagi.workportal.widgets.routing", {}, {
    init: function(workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "routing": bizagi.getTemplate("bizagi.workportal.desktop.widget.routing"),
            useNewEngine: false
        });
    },

    /*
     *   To be overriden in each device to apply layouts
     */
    postRender: function() {
        var self = this;
        var content = self.getContent();

        var workOnITActivitySelector = $("#ui-bizagi-wp-app-routing-activity-wf tbody tr", content);
        var workOnITProcessSelector = $("#ui-bizagi-wp-app-routing-process-wf tbody tr", content);

        var onlyUserWorkItems = (self.params.data.fromSearchWidget) ? "false" : "true";
        var eventAsTasks = (self.params.data.fromSearchWidget) ? "true" : "false";

        // Assing even style
        $("tr:nth-child(even)", content).addClass("event");

        $(".workonitRow", content).button();

        $(workOnITActivitySelector).click(function() {
            self.showWorkitem({
                idCase: $(this).children(":first").children("#idCase").val(),
                idWorkitem: $(this).children(":first").children("#idWorkItem").val(),
                idTask: $(this).children(":first").children("#idTask").val(),
                idWorkflow: $(this).children(":first").children("#idWorkflow").val(),
                onlyUserWorkItems: onlyUserWorkItems,
                eventAsTasks: eventAsTasks
            });

            // close dialog
            self.publish("closeCurrentDialog");
        });


        $(workOnITProcessSelector).click(function() {
            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: $(this).children(":first").children("#idCase").val(),
                onlyUserWorkItems: onlyUserWorkItems,
                eventAsTasks: eventAsTasks
            });

            // close dialog
            self.publish("closeCurrentDialog");
        });
    },
    /*
     *   Shows the rendering widget
     */
    showWorkitem: function(params) {
        var self = this;
        // Shows render widget
        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: params.idCase,
            idWorkItem: params.idWorkitem,
            idWorkflow: params.idWorkflow,
            idTask: params.idTask,
            referrer: self.params.referrer
        });
        // close dialog
        self.publish("closeCurrentDialog");

    },
    /**
     * Show Async widget
     */
    showAsyncWidget: function(params) {
        var self = this;

        // Shows dialog widget with async template           
        self.publish("showDialogWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ASYNC,
            data: data,
            modalParameters: parameters
        });
    }
});
