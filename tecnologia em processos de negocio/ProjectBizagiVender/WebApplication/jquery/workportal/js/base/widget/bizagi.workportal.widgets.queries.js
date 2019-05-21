/*
*   Name: BizAgi Workportal New Case Widget Controller
*   Author: Edward Morales
*   Comments:
*   -   This script will define a base class to to define the new case widget
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.queries", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function(){  
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERIES;
    },
    
    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("queries");
        var content = self.content = $.tmpl(template);
        self.loadtemplates();
        return content;
    },
    /*
     * this will be implemented on each device
     */
    loadtemplates: function () { }
});
