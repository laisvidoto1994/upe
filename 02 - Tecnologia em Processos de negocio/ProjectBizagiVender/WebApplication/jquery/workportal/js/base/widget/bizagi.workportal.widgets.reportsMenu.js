/*
*   Name: BizAgi Workportal Reports Widget Controller
*   Author: David Romero
*   Comments:
*   -   This script will define a base class to show all reports categories
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.reportsMenu", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        self._super(workportalFacade, dataService, params);

        self.endPoint = [ "Reports", "BAMProcess", "BAMTask", "AnalyticsProcess", "AnalyticsTask", "AnalyticsSensor", "ResourceBAM" ];
        self.reportsMenu = self.getRawReportsJSON();
    },
    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS_MENU;
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("reportsMenu-container");
        var content = self.content = $.tmpl(template);

        return content;
    },

    /*
    * JON for reports menu
    */
    getRawReportsJSON: function () {

        var self = this;

        return {
                "Reports": [
                    {
                        displayName: self.resources.getResource("workportal-menu-submenu-BAMMenu"),
                        icon: "bz-icon-folder-outline",
                        show: function () {
                            return (bizagi.menuSecurity.BAMProcess || bizagi.menuSecurity.BAMTask || bizagi.menuSecurity.BAMResourceMonitor) ? true : false;
                        },
                        endPoint: "",
                        subItems: "BAM"
                    },
                    {
                        displayName: self.resources.getResource("workportal-menu-submenu-AnalyticsMenu"),
                        icon: "bz-icon-folder-outline",
                        show: function () {
                            return (bizagi.menuSecurity.AnalyticsProcess || bizagi.menuSecurity.AnalyticsTask) ? true : false;
                        },
                        endPoint: "",
                        subItems: "Analytics",
                    },
                    {
                        displayName: self.resources.getResource("workportal-menu-submenu-AnalyticsSensor"),
                        show: bizagi.menuSecurity.AnalyticsSensor,
                        icon: "AnalyticsSensor bz-icon-rules",
                        endPoint: "AnalyticsSensor",
                        subItems: []
                    }
                ],
                "BAM": [
                    {
                        displayName: self.resources.getResource("workportal-menu-submenu-AnalyticsProcess"),
                        show: bizagi.menuSecurity.BAMProcess,
                        icon: "BAMProcess bz-icon-cogs",
                        endPoint: "BAMProcess",
                        subItems: []
                    },
                    {
                        displayName: self.resources.getResource("workportal-menu-submenu-AnalyticsTask"),
                        show: bizagi.menuSecurity.BAMTask,
                        icon: "BAMTask bz-icon-sheet-pencil",
                        endPoint: "BAMTask",
                        subItems: []
                    },
                    {
                        displayName: self.resources.getResource("workportal-menu-submenu-BAMResourceMonitor"),
                        show: bizagi.menuSecurity.BAMResourceMonitor,
                        icon: "BAMResourceMonitor bz-icon-user-manage",
                        endPoint: "ResourceBAM",
                        subItems: []
                    }
                ],
                "Analytics": [
                    {
                        displayName: self.resources.getResource("workportal-menu-submenu-AnalyticsProcess"),
                        show: bizagi.menuSecurity.AnalyticsProcess,
                        icon: "AnalyticsProcess bz-icon-cogs",
                        endPoint: "AnalyticsProcess",
                        subItems: []
                    },
                    {
                        displayName: self.resources.getResource("workportal-menu-submenu-AnalyticsTask"),
                        show: bizagi.menuSecurity.AnalyticsTask,
                        icon: "AnalyticsTask bz-icon-sheet-pencil",
                        endPoint: "AnalyticsTask",
                        subItems: []
                    }
                ],
                "AnalysisQuery": [
                ]
            };

    }
});
