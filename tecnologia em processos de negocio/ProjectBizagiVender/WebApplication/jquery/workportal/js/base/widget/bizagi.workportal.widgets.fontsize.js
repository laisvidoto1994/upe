
/*
*   Name: BizAgi Workportal Search Controller
*   Author: Jair Cardenas
*   Comments:
*   -   Base library for fontsize 
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.fontsize", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function(){  
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_FONTSIZE;
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("fontsize");

        var content = self.content = $.tmpl(template);

        return content;
    }
});
