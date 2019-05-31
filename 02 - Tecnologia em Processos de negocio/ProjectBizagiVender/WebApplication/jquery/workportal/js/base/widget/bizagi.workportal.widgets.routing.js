/*
*   Name: BizAgi Workportal Routing Widget Controller
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to to define the routing widget
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.routing", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);
    },
    /*
    *   Returns the widget name
    */
    getWidgetName: function(){  
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ROUTING;
    },
    
    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("routing");
        var def = new $.Deferred();
        //check subprocess
        if(self.params.data.checkProcess || self.params.data.checkWorkItems){
            $.when(
                self.dataService.getCaseSubprocesses({
                    idCase: self.params.data.idCase
                })            
            ).done(function(process){
                self.params.data.subProcessPersonalized = process["subProcesses"];                        

                //Validate in workitems have property idtask. Scenario when workitem is activity from plan
                self.params.data.workItems.forEach(function(workitem){
                    if(!workitem.idTask){
                        workitem.idTask = "";
                    }
                });

                // Loads case workitems
                // Solve QA-2197
                var content = self.content = $.tmpl(
                        template,
                        self.params.data,
                        {
                            formatDate: self.formatDate
                        }
                );
                def.resolve(content);
                
            });
        }
        return def.promise();
    },

    formatDate: function(item){
        return bizagi.util.formatDateFromInvariantStringDate(item.estimatedSolutionDate);
    }
});
