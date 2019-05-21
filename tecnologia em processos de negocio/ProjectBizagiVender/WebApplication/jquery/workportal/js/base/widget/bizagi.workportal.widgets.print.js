/*
 *   Name: BizAgi Workportal Print Version Widget Controller
 *   Author: Edward Morales
 *   Comments:
 *   -   This script will define a base class to to define the print version widget
 *       the rendering module is loaded here
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.print", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function(){  
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PRINT;
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("print");

        var content = self.content = $.tmpl(template);

        return content;
    }   
});
