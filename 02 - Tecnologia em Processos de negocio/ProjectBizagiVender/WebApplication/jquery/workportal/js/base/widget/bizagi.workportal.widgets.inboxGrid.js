
/*
*   Name: BizAgi Workportal Inbox Grid Widget Controller
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to to define the inbox grid widget
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.inboxGrid", {}, {
   
    /*
    *   Returns the widget name
    */
    getWidgetName: function(){  
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID;
    },
    
    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("inbox-grid");
        
        var data={};
        
        // Enable or disable functionality
        data.enableFolders = (bizagi.override != undefined && bizagi.override.enableFolder) ? true : false;
        data.enableSmartFolders = (bizagi.override != undefined && bizagi.override.enableSmartFolders) ? true : false;
        
        // Render content
        var content = self.content = $.tmpl(template,$.extend(data, {security: bizagi.menuSecurity}));
        
        // Set inbox view variable
        bizagi.workportal.currentInboxView = self.getWidgetName();
        
        return content;
    },
    
    
    /*
    *   Renders the summary form inside a given container
    */
    renderSummaryForm: function (container) {
        var self = this;

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
        });
    },
    
    routingExecute : function(obj){        
        // Executes routing action
        var self = this;
        if(obj == undefined){
            return false;
        }
        
        var idCase = obj.find("#idCase").val();
        var idWorkItem = obj.find("#idWorkItem").val();
        var idTask = obj.find("#idTask").val();
        var eventAsTasks = obj.find("#eventAsTasks").val() || false;
        
        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: idCase,
            idWorkItem: idWorkItem,
            idTask: idTask,
            eventAsTasks: eventAsTasks
        });
    }     
});
