/*
 *   Name: BizAgi Workportal Smarthpone Render Widget Controller
 *   Author: oscaro 
 *   Comments:
 *   -   This script will provide tablet overrides to implement the render widget
 */

// Auto extend
bizagi.workportal.widgets.routing.extend("bizagi.workportal.widgets.routing", {}, {

    init: function(workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);
    },    

    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;
        var content = self.getContent();

        /*refactor for complex gateway and eliminate this line*/
        $(".ui-bizagi-container-complexgateway:visible").hide();


        var workOnITActivitySelector = $("#ui-bizagi-wp-app-routing-activity-wf tbody tr", content);
        var workOnITProcessSelector = $("#ui-bizagi-wp-app-routing-process-wf tbody tr", content);

        var onlyUserWorkItems = (self.params.data.fromSearchWidget) ? "false" : "true";
        var eventAsTasks = (self.params.data.fromSearchWidget) ? "true" : "false";

        // Assing even style
        $("tr:nth-child(even)", content).addClass("event");

        $(".workonitRow", content).button();

        $(workOnITActivitySelector).click(function () {
            self.showWorkitem({
                idCase: $(this).children(":first").children("#idCase").val(),
                idWorkitem: $(this).children(":first").children("#idWorkItem").val(),
                idTask: $(this).children(":first").children("#idTask").val(),
                onlyUserWorkItems: onlyUserWorkItems,
                eventAsTasks: eventAsTasks,
                taskName: $(this).children(":first").text()
            });

            // Delete activity selector
            $('#ui-bizagi-wp-app-inbox-activities-routing-wrapper').closest('div').remove();

            // close dialog
            self.publish("closeCurrentDialog");
        });


        $(workOnITProcessSelector).click(function () {
            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: $(this).children(":first").children("#idCase").val(),
                onlyUserWorkItems: onlyUserWorkItems,
                eventAsTasks: eventAsTasks
            });

            // Delete activity selector
            $('#ui-bizagi-wp-app-inbox-activities-routing-wrapper').closest('div').remove();

            // close dialog
            self.publish("closeCurrentDialog");
        });

        $(".wp-routing-container-fother button", content).click(function () {
            // Delete activity selector
            $('#ui-bizagi-wp-app-inbox-activities-routing-wrapper').closest('div').remove();
            // close dialog
            self.publish("closeCurrentDialog");

            self.publish("changeWidget", {
                widgetName: bizagi.workportal.currentInboxView
            });

        });


    },

    /*
    *   Shows the rendering widget
    */
    showWorkitem: function (params) {
        var self = this;

        if (params.taskName)
            self.notifiesNavigation(params.taskName);

        // Shows render widget
        self.publish("changeWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_RENDER,
            idCase: params.idCase,
            idWorkitem: params.idWorkitem,
            idTask: params.idTask,
            referrer: self.params.referrer
        });
    },

    /**
    * Show Async widget
    */
    showAsyncWidget: function (params) {
        var self = this;

        // Shows dialog widget with async template           
        self.publish("showDialogWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ASYNC,
            data: data,
            modalParameters: parameters
        });
    },

    /*
    *notify to suscribe the message in the header
    */
    notifiesNavigation: function (message) {
        var self = this;
        self.publish("notifiesNavigation", { message: message });
    }
});
