/*
*   Name: BizAgi Workportal Graphic Query Widget
*   Author: David Romero
*   Comments:
*   -   This script renders the case workflow
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.graphicquery", {}, {


    init: function (workportalFacade, dataService, params) {
        var self = this;

        self.subprocesses = [];
        self.currentTasks = [];
        self.path = [];
        self.callStack = [];
        self.currentWorkflow = {
            idCase: params.data.idCase,
            idWorkflow: params.data.idWorkflow
        };

        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "graphicquery-wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery").concat("#ui-bizagi-workportal-widget-graphicquery-wrapper"),
            "graphicquery-tooltip-currenttask": bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery").concat("#ui-bizagi-workportal-widget-graphicquery-tooltip-currenttask"),
            "graphicquery-tooltip-subcases": bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery").concat("#ui-bizagi-workportal-widget-graphicquery-tooltip-subcases"),
            "graphicquery-subcases": bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery").concat("#ui-bizagi-workportal-widget-graphicquery-subcases"),
            "graphicquery-parentsummary": bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery").concat("#ui-bizagi-workportal-widget-graphicquery-parentsummary"),
            "graphicquery-summary": bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery").concat("#ui-bizagi-workportal-widget-graphicquery-summary"),
            "graphicquery-tooltip-users": bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery").concat("#ui-bizagi-workportal-widget-graphicquery-tooltip-users"),
            "graphicquery-actionbar": bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery").concat("#ui-bizagi-workportal-widget-graphicquery-actionbar"),
            useNewEngine: false
        });
    },

    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GRAPHIC_QUERY;
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {

        var self = this;
        var tmpl = self.getTemplate("graphicquery-wrapper");
        var content = self.content = $.tmpl(tmpl);

        return content;
    }
});