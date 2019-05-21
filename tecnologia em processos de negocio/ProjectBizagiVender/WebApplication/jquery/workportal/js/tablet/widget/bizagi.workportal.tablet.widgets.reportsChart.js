/*
*   Name: BizAgi Workportal Desktop Reports Chart Widget
*   Author: David Romero
*   Comments:
*   -   This script will load the selected report in workarea
*/

// Auto extend
bizagi.workportal.widgets.reportsChart.extend("bizagi.workportal.widgets.reportsChart", {}, {

    /*
    * Initialize report widget
    */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        self._super(workportalFacade, dataService, params);
    },

    /**
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {

        var self = this;

        self.menu.showReportsIcon();

        $.when(self.loadReportingModule()).done(function () {

            //Load the first report
            self.loadReport(self.endPoint.defaultReport, self.endPoint.info);
            self.eventsHandler();
        });
    },

    /*
    * Events Handler
    */
    eventsHandler: function () {

        var self = this;
        var context = self.getContent();

        $("#reports-menu, li", self.content).on("click", function () {

            var element = $(this);
            var report = element.data('report');

            element.siblings().removeClass("ui-bizagi-wp-widget-reports-menu-active");
            element.addClass("ui-bizagi-wp-widget-reports-menu-active");
            self.loadReport(report, self.endPoint.info);
        });

    },

    /*
    * Load Report
    */
    loadReport: function (report, info) {

        var self = this;
        var components = self.endPoint.reports[report].components;

        $("#reports-canvas", self.content).empty();

        $.when(self.reportingModule.render({
            canvas: $("#reports-canvas", self.content),
            report: report,
            info: info,
            components: components,
            filters: self.filters,
            myTeam: self.myTeam
        })).done(function (report) {

            self.attachReportEvents.apply(self, [report]);

        });

    },

    /*
    * Attach events for reports object
    */
    attachReportEvents: function (report) {

        var self = this;

        report.bindWindowResize();

        report.subscribe("filterChange", function (event, filters) {
            self.filters = filters;
        });

        report.subscribe("opencase", function (event, data) {

            self.menu.hideReportsIcon();
            bizagi.workportal.controllers.menu.prototype.showBackButton.call(this);

            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: data.caseData.idCase,
                idWorkItem: data.caseData.idWorkItem,
                idTask: data.caseData.idTask
            });

        });
    }

});
