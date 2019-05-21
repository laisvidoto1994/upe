/*
*   Name: BizAgi Workportal my search search lists Widget Controller
*   Author: Andrés Fernando Muñoz
*   Comments:
*   -   This script will define a base class to to define the "my search search lists" widget
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.mySearchList", {}, {
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_MYSEARCHLIST;
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("mySearchListWrapper");
        var content = self.content = $.tmpl(template);

        return content;
    }
});