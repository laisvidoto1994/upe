/*
*   Name: BizAgi Workportal Reports Widget Controller
*   Author: Edward Morales
*   Comments:
*   -   This script will define a base class to show all reports categories
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.reports", {}, {
    
    /*
    *   Returns the widget name
    */
    getWidgetName: function(){  
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS;
    },
    
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function(){
        var self = this;
        var template = self.getTemplate("reports");
        var content = self.content = $.tmpl(template);
        
        return content;
    }
});
