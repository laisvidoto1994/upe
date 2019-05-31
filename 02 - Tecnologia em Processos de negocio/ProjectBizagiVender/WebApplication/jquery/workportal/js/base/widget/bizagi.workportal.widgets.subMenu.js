/*
*   Name: BizAgi Workportal New Case Widget Controller
*   Author: Edward Morales
*   Comments:
*   -   This script will define a base class to to define the sub menu widget
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.subMenu", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function(){  
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SUBMENU;
    },
    
    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.workportalFacade.getTemplate("menu.submenu");
        var content = self.content = $.tmpl(template);
        
        return content;
    }
});
