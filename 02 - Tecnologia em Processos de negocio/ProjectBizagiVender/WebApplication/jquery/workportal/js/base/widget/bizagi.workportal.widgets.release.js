/*
 *   Name: BizAgi Workportal Release Widget Controller
 *   Author: Luis Cabarique LuisCE
 *   Comments:
 *   -   This script will define a base class to to define the release widget
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.release", {}, {
    /*
     *   Returns the widget name
     */
    getWidgetName: function(){
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_BIZAGI_RELEASE;
    },

    /*
     *   Renders the content for the current controller
     *   Returns a deferred because it has to load the current user
     */
    renderContent: function () {
        var self = this;
        var template = self.workportalFacade.getTemplate("case-summary-release-area");

        var content = self.content = $.tmpl(template, self.params.data);

        return content;
    }
});
