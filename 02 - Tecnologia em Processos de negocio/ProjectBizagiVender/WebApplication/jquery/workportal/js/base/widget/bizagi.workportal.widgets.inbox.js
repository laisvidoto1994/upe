/*
*   Name: BizAgi Workportal Inbox Widget Controller
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to to define the inbox widget
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.inbox", {}, {

    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX;
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("inbox");
        var data = {};

        // Enable or disable functionality
        data.enableFolders = (bizagi.override != undefined && bizagi.override.enableFolder) ? true : false;
        data.enableSmartFolders = (bizagi.override != undefined && bizagi.override.enableSmartFolders) ? true : false;

        // Render content
        var content = self.content = $.tmpl(template, data);

        // Set inbox view variable
        bizagi.workportal.currentInboxView = self.getWidgetName();

        return content;
    },

    /*
    *   Renders the summary form inside a given container
    */
    renderSummaryForm: function (container) {
        var self = this;
        var def = new $.Deferred();

        var proxyPrefix = (typeof (self.dataService.serviceLocator.proxyPrefix) !== "undefined")
            ? self.dataService.serviceLocator.proxyPrefix : "";

        bizagi.loader.start("rendering").then(function () {
            // Load render page
            var rendering = new bizagi.rendering.facade({ "proxyPrefix": proxyPrefix });

            // Executes rendering into render container
            rendering.execute({
                canvas: container,
                summaryForm: true,
                idCase: self.idCase
            });

            // Keep reference to rendering facade
            self.renderingFacade = rendering;

            // Resize layout
            setTimeout(function () {
                self.resizeLayout();
            }, 1000);

            // Resolve main deferred
            $.when(rendering.ready())
            .done(function () {
                def.resolve();
            });
        });

        return def.promise();
    },

    routingExecute: function (element) {
        // Executes routing action
        if (element == undefined) {
            return false;
        }

        var self = this;

        var idCase = element.find("#idCase").val();
        var idWorkflow = element.find("#idWorkflow").val();
        var idWorkItem = element.find("#idWorkItem").val();
        var idTask = element.find("#idTask").val();
        var eventAsTasks = element.find("#eventAsTasks").val() || false;

        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: idCase,
            idWorkflow: idWorkflow,
            idWorkItem: idWorkItem,
            idTask: idTask,
            eventAsTasks: eventAsTasks
        });
    }
});
