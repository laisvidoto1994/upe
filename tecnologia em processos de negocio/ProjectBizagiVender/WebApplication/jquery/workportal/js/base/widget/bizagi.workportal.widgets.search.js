/*
 *   Name: BizAgi Workportal Search Controller
 *   Author: Edward Morales
 *   Comments:
 *   -   Base library for search cases
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.search", {}, {
    /*
     *   Returns the widget name
     */
    getWidgetName: function() {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH;
    },
    /*
     *   Renders the content for the current controller
     *   Returns a deferred because it has to load the current user
     */
    renderContent: function() {
        var self = this;
        var template = self.workportalFacade.getTemplate("search");

        var content = self.content = $.tmpl(template);

        return content;
    },
    routingExecute: function(element) {
        // Executes routing action
        if (element == undefined) {
            return false;
        }

        var self = this;

        var idCase = element.find("#idCase").val();
        var idWorkItem = element.find("#idWorkItem").val();
        var idTask = element.find("#idTask").val();
        var eventAsTasks = element.find("#eventAsTasks").val() || false;

        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: idCase,
            idWorkItem: idWorkItem,
            idTask: idTask,
            eventAsTasks: eventAsTasks
        });
    }
});
