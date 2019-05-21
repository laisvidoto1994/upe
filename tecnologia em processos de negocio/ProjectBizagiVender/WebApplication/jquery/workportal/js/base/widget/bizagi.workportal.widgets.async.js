/**
 *   Name: BizAgi Workportal Async controller
 *   Author: Edward Morales
 *   Comments:
 *   -   This script will define a base class to Async Controller
 */


bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.async", {
    ASYNC_CHECK_TIMER: 3000
}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);
    },

    /*
     *   Returns the widget name
     */
    getWidgetName: function() {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ASYNC;
    },
    /*
     *   Renders the content for the current controller
     *   Returns a deferred because it has to load the current user
     */
    renderContent: function() {
        var self = this;
        var defer = new $.Deferred();

        // Check the status for the async execution
        self.checkAsycnExecutionState(defer);

        return defer.promise();
    },
    /**
     *  Check execution state every time is called
     */
    checkAsycnExecutionState: function(defer) {
        var self = this;

        $.when(self.dataService.getAsynchExecutionState({
            idCase: self.params.idCase
        })).done(function(response) {
            var template = self.getTemplate("async");
            
            // verify errors in response
            if(response.state == "Error" && response.errorMessage != undefined){
                // Change default error
                response.errorMessage = bizagi.localization.getResource("render-async-error");
            }
            
            // Render base template
            self.content = $.tmpl(template, response);

            // Check for finish signal
            if (response.state == "Processing") {
                // Check for non-error message
                if (response.errorMessage.length == 0) {
                    setTimeout(function() {
                        // Refresh widget after a timer
                        self.publish("changeWidget", self.params);

                    }, self.Class.ASYNC_CHECK_TIMER);
                }

            } else if (response.state == "Finished") {

                // Execute routing
                self.publish("executeAction", {
                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                    idCase: self.params.idCase
                });
            }

            // Resolve main deferred
            defer.resolve(self.content);
        });
    }

});

