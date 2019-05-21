/*
*   Name: BizAgi Report for Analytics - Process - Cycle Time
*   Author: David Romero
*   Comments:
*   -   This script draws a specific report for Analytics - Process - Cycle Time
*/

bizagi.reporting.report.extend("bizagi.reporting.report.analyticsprocesscycletime", {}, {

    /*
    * Initialize report
    */
    init: function (params) {

        this._super(params);
    },

    /*
    * Get filters object
    */
    getFiltersObject: function () {
        return { process: {}, dimension: [], time: {} };
    },

    /*
    *   Initialize all needed templates
    */
    initializeTemplates: function () {
        return {
            "main": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocesscycletime") + "#bz-rp-analytics-process-cycletime-main"),
            "cycletimesummary": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocesscycletime") + "#bz-rp-analytics-process-cycletime-summary"),
            "caseduration": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocesscycletime") + "#bz-rp-analytics-process-cycletime-caseduration"),
            "casestatus": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocesscycletime") + "#bz-rp-analytics-process-cycletime-casestatus")
        };
    },

    /*
    * Load Components
    */
    loadComponents: function () {

        var self = this;

        self._super();

        return $.when(self.loadProcessesVersionComponent()).pipe(function () {
            return self.loadDimensionsComponent({ process: self.model.process });
        }).pipe(function () {
            return self.loadTimeComponent();
        });
    },

    /*
    * Post Render
    */
    postRender: function () {
        var self = this;

        //Events handlers
        self.bindToggleSummary();
    },

    getReportExcelUrl: function(namespace) {
        var self = this;
        var model = $.extend({}, self.taskGuid, self.model);
        var filter = "reportName=" + namespace + "&filters=" + JSON.stringify(model) + "&user=" + bizagi.currentUser.idUser;

        return self.services.getExportExcelUrl(filter);
    },


    /*
    * Get JSON for detail list
    */
    getDetailListObject: function (ui) {

        var self = this;
        var reportName = ui.sender.options.chartName, columnName = ui.dataItem.name;
        var embedded = {};
        if (ui.dataItem.embedded) {
            embedded = {
                task: {
                    id: ui.dataItem.embedded.taskId,
                    guid: ui.dataItem.embedded.taskGuid
                },
                parentProcess: {
                    id: ui.dataItem.embedded.parentProcessId
                }
            };
        }
        if (reportName === "Analytics.Process.CycleTimeSummary") {

            //return JSON
            return { detailList: { reportName: reportName, columnName: columnName, embedded: embedded} };
        } else {

            return false;
        }

    },

    /*
    * Redraw Graphics
    */
    drawReport: function (filter) {

        var self = this;

        self.setFiltersForCustomRPComp();

        $.when(self.services.getCycleTime(filter)).done(function (result) {

            self.drawCaseDuration([{ averageDuration: result.summaryTable.averageDuration, expectedDuration: result.summaryTable.expectedDuration, embedded: result.embedded}]);
            self.drawCaseStatus(result.caseState, result.embedded);
            self.drawCycleTimeSummary(result.summaryTable, result.embedded);

        });
    },

    /*
    *   This method queries the server for the data, and repaint the cycle time summary table
    */
    drawCycleTimeSummary: function (data, embedded) {

        var self = this;
        var manualTasksTemplate = self.getTemplate("cycletimesummary");
        data.embedded = embedded ? embedded : {};
        var manualTask = $.tmpl(manualTasksTemplate, data, {
            getReportExcelUrl: self.getReportExcelUrl("analytics.process.cycletime")
        });
        var manualTaskComponent = self.getTemplateComponent(self.content, "analytics-process-cycletime-summary");
        manualTaskComponent.empty().append(manualTask);
    },

    /*
    *   This method queries the server for the data to render the case duration graph
    */
    drawCaseDuration: function (data, embedded) {

        var self = this;

        //Render template
        var caseDurationTemplate = self.getTemplate("caseduration");
        var casesDurationContainer = $.tmpl(caseDurationTemplate);

        //Render graph
        var mainContainer = self.getTemplateComponent(self.content, "analytics-process-cycletime-caseduration");
        mainContainer.empty().append(casesDurationContainer);
        data.embedded = embedded ? embedded : {};

        if (data[0].averageDuration > 0 || data[0].expectedDuration > 0) {

            var settings = {
                dataSource: {
                    data: data
                },
                seriesDefaults: {
                    tooltip: {
                        template: "#= series.name #: #= value #"
                    },
                    type: "column",
                    spacing: 0.3
                },
                series: [{
                    field: "averageDuration",
                    name: self.getResource("analytics-process-cycletime-avgduration"),
                    color: "#FF4040"
                }, {
                    field: "expectedDuration",
                    name: self.getResource("analytics-process-cycletime-expduration"),
                    color: "#b8c7e8"
                }]
            };

            var dataVizObject = self.graphics.getDataVizObject(settings);

            //Print CaseStatus Chart
            mainContainer.find(".bz-rp-chart").empty().kendoChart(dataVizObject);
        }

    },

    drawCaseStatus: function (data, embedded) {

        var self = this;

        //Render template
        var casestatusTemplate = self.getTemplate("casestatus");
        var casestatusContainer = $.tmpl(casestatusTemplate);

        //Render graph
        var mainContainer = self.getTemplateComponent(self.content, "analytics-process-cycletime-casestatus");
        mainContainer.empty().append(casestatusContainer);

        if (data.onTime > 0 || data.overdue > 0) {

            var object = [{ "category": self.getResource("reports-general-ontime-label"), "value": data.onTime, "color": "#8bbc21", "name": "ontime", embedded: embedded },
            { "category": self.getResource("reports-general-overdue-label"), "value": data.overdue, "color": "#FF4040", "name": "overdue", embedded: embedded}];

            var settings = {
                dataSource: {
                    data: object
                },
                chartName: "Analytics.Process.CycleTimeSummary",
                seriesDefaults: {
                    labels: {
                        template: "#= value# - #= kendo.format('{0:P}', percentage)#"
                    },
                    tooltip: {
                        template: "#= category# - #= value#"
                    },
                    type: "pie"
                },
                series: [{
                    field: "value",
                    colorField: "color",
                    categoryField: "category"
                }]
            };

            var dataVizObject = self.graphics.getDataVizObject(settings);

            //Print CaseStatus Chart
            mainContainer.find(".bz-rp-chart").kendoChart(dataVizObject);
        }
    }
});
