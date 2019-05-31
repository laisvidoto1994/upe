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
    init: function(workportalFacade, dataService, params) {
        var self = this;

        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "reportsChart": bizagi.getTemplate("bizagi.workportal.desktop.widget.reportsChart").concat("#ui-bizagi-workportal-widget-reports-chart"),
            "admin.case.search.quicksearch": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch").concat("#ui-bizagi-workportal-widget-admin-case-search-quicksearch"),
            useNewEngine: false
        });
    },

    /**
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {

        var self = this;

        //case search widget object
        self.caseSearch = {};

        $.when(self.loadReportingModule()).done(function () {

            //Load the first report
            self.loadReport(self.endPoint.defaultReport, self.endPoint.info);
            self.eventsHandler();

        });
    },

    /**
    * Events Handler
    */
    eventsHandler: function () {

        var self = this;

        $("#reports-menu, li", self.content).on("click", function () {

            var element = $(this);
            var report = element.data('report');

            element.siblings().removeClass("ui-bizagi-wp-widget-reports-menu-active");
            element.addClass("ui-bizagi-wp-widget-reports-menu-active");
            self.loadReport(report, self.endPoint.info);
        });

    },

    /**
    * Load Report
    */
    loadReport: function (report, info) {

        var self = this;
        var components = self.endPoint.reports[report].components;

        $("#reports-canvas", self.content).empty();

        $.when(self.reportingModule.render({
            canvas: $("#reports-canvas", self.content),
            report: report,
            components: components,
            info: info,
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

        //resize event
        report.bindWindowResize();

        //change filter evnet
        report.subscribe("filterChange", function (event, filters) {
            self.filters = filters;
        });

        //graphic query event
        report.subscribe("graphicquery", function (event, data) {
            self.showGraphicQuery(data);
        });

        //open case administration
        report.subscribe("caseadministration", function (event, data) {

            if ($.isEmptyObject(self.caseSearch)) {
                self.initCaseAdministration(data);
            }

            self.showCaseAdministration(data);

        });

        //open case event
        report.subscribe("opencase", function (event, data) {
            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: data.caseData.idCase,
                idWorkItem: data.caseData.idWorkItem,
                idTask: data.caseData.idTask
            });
        });

    },

    /*
    * Initialize Case Administration
    */
    initCaseAdministration: function (data) {

        var self = this;
        var content = self.getCaseSearchContent();

        self.caseSearch = new bizagi.workportal.widgets.admin.caseSearch(self.workportalFacade, self.dataService, $.extend(self.params, {
            container: data.canvas
        }));

        self.caseSearch.loadtemplates();
        self.caseSearch.setupActivitiesLink = function () { };
    },

    /*
    * Show Case Administration
    */
    showCaseAdministration: function (data) {

        var self = this;
        var content = self.getCaseSearchContent();

        self.caseSearch.content = content;
        data.canvas.html(content);

        self.caseSearch.findResults(
            data.canvas,
            { "I_radNumber": data.radNumber }
        );
    },

    /*
    * Get Case Search Content
    */
    getCaseSearchContent: function () {

        var self = this;
        var tmpl = self.getTemplate("admin.case.search.quicksearch");

        return $.tmpl(tmpl);
    }

});
