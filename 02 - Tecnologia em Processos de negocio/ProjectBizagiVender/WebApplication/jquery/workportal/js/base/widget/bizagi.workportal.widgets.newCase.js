/*
*   Name: BizAgi Workportal New Case Widget Controller
*   Author: Edward Morales
*   Comments:
*   -   This script will define a base class to to define the new case widget
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.newCase", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_NEWCASE;
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("newCase");
        var content = self.content = $.tmpl(template);

        return content;
    },

    /*
    *   Creates a new case based on the selected process
    */
    createNewCase: function (idWfClass, isAdhocProcess) {
        var self = this;
        var deferred = new $.Deferred();

        bizagi.loader.start("rendering").then(function () {
            bizagi.loader.start("plans-view").then(function () {
                // Creates a new case
                $.when(self.dataService.startProcess({
                    idProcess: idWfClass,
                    isAdhocProcess: isAdhocProcess
                }))
                .then(function (data) {
                    self.onStartProcessDone(data);
                    deferred.resolve(data);
                })
            });
        });

        return deferred.promise();
    },

    onStartProcessDone: function (data) {
        var self = this;
        // Then we call the routing action
        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: data.caseInfo.idCase,
            radNumber: data.radNumber,
            formsRenderVersion: (typeof data.caseInfo.isOfflineForm != "undefined") ? data.caseInfo.formsRenderVersion : 0,
            isOfflineForm: (typeof data.caseInfo.isOfflineForm != "undefined") ? data.caseInfo.isOfflineForm : false,
            data: data
        });
    }
});