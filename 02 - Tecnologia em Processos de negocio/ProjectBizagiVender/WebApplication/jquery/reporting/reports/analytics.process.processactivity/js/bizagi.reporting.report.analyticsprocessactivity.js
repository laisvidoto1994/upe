/*
*   Name: BizAgi Report for Analytics - Process - Cycle Time
*   Author: David Romero
*   Comments:
*   -   This script draws a specific report for Analytics - Process - Process Activity
*/

bizagi.reporting.report.extend("bizagi.reporting.report.analyticsprocessactivity", {}, {

    /*
    * Initialize report
    */
    init: function (params) {

        this._super(params);
    },

    /*
    *   Initialize all needed templates
    */
    initializeTemplates: function () {

        return {
            "main": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocessactivity") + "#bz-rp-analytics-process-processactivity-main"),
            "activitysummary": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocessactivity") + "#bz-rp-analytics-process-processactivity-activitysummary"),
            "processactivity": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocessactivity") + "#bz-rp-analytics-process-processactivity-processactivity"),
            "activitytrend": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocessactivity") + "#bz-rp-analytics-process-processactivity-trend")
        };
    },

    /*
    * Get filters object
    */
    getFiltersObject: function () {
        return { process: {}, dimension: [], time: {} };
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
        if (reportName === "Analytics.Process.ActivitySummary") {

            //return JSON
            return { detailList: { reportName: reportName, columnName: columnName, embedded:embedded} };
        } else {

            return false;
        }

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
    * Redraw Graphics
    */
    drawReport: function (filter) {

        var self = this;

        self.setFiltersForCustomRPComp();

        self.drawActivityTrend(filter);

        $.when(self.services.getProcessActivitySummary(filter)).done(function (result) {

            self.drawActivitySummary(result);
            self.drawProcessActivity({ newCases: result.newCases, closedCases: result.closedCases, abortedCases: result.abortedCases, embedded: result.embedded });
        });
    },

    /*
    *   This method queries the server for the data, and repaint the  summary table
    */
    drawActivitySummary: function (data) {

        var self = this;
        var summaryTemplate = self.getTemplate("activitysummary");

        var summaryContainer = $.tmpl(summaryTemplate, data,{
            getReportExcelUrl: self.getReportExcelUrl("analytics.process.activity")
        });
        var summaryComponent = self.getTemplateComponent(self.content, "analytics-process-processactivity-activitysummary");
        summaryComponent.empty().append(summaryContainer);

    },

    /*
    *   This method queries the server for the data to render the process activity graph
    */
    drawProcessActivity: function (data) {

        var self = this;

        //Render template
        var processActivityTemplate = self.getTemplate("processactivity");
        var processActivityContainer = $.tmpl(processActivityTemplate);

        //Render content
        var mainContainer = self.getTemplateComponent(self.content, "analytics-process-processactivity-processactivity");
        mainContainer.empty().append(processActivityContainer);

        if (data.newCases > 0 || data.closedCases > 0 || data.abortedCases > 0) {
            var embedded = data.embedded ? data.embedded : {};
            var object = [
                { category: self.getResource("analytics-process-processactivity-newcases"), value: data.newCases, name: "open", embedded:embedded },
                { category: self.getResource("analytics-process-processactivity-closedcases"), value: data.closedCases, name: "closed", embedded: embedded },
                { category: self.getResource("analytics-process-processactivity-abortedcases"), value: data.abortedCases, name: "aborted", embedded: embedded }
            ];

            var settings = {
                dataSource: {
                    data: object
                },
                chartName: "Analytics.Process.ActivitySummary",
                series: [{
                    color: "#B8c7E8",
                    field: "value",
                    name: self.getResource("analytics-process-processactivity-title")
                }],
                categoryAxis: {
                    field: "category"
                }
            };

            var dataVizObtect = self.graphics.getDataVizObject(settings);

            //Print CaseStatus Chart
            mainContainer.find(".bz-rp-chart").empty().kendoChart(dataVizObtect);
        }
    },

    drawActivityTrend: function (filter) {

        var self = this;
        var dateTo = self.model.time.dateTo;
        var dateFrom = self.model.time.dateFrom;

        //Render Template
        var activityTrendTemplate = self.getTemplate("activitytrend");
        var activityTrendContainer = $.tmpl(activityTrendTemplate);

        //Render Content
        var trendContainer = self.getTemplateComponent(self.content, "analytics-process-processactivity-trend");
        trendContainer.empty().append(activityTrendContainer);

        $.when(self.services.getProcessActivityTrend(filter)).pipe(function (result) {

            var startDate = new Date(dateFrom);
            var endDate = new Date(dateTo);
            var dateFormat = "";
            var stats = [];

            switch (result.scale) {
                case "DAY":

                    dateFormat = "MM/dd";
                    for (; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
                        stats.push(self.getDateRange(result.rows, startDate));
                    }
                    ; break;
                case "MONTH":

                    dateFormat = "MM/yy";
                    for (; startDate <= endDate; startDate.setMonth(startDate.getMonth() + 1)) {
                        stats.push(self.getDateRange(result.rows, startDate));
                    }
                    ; break;
                case "YEAR":

                    dateFormat = "yyyy";
                    for (; startDate <= endDate; startDate.setFullYear(startDate.getFullYear() + 1)) {
                        stats.push(self.getDateRange(result.rows, startDate));
                    }
                    ; break;
            }

            var settings = {
                dataSource: {
                    data: stats
                },
                seriesDefaults: {
                    tooltip: {
                        visible: true,
                        template: "#= kendo.format('{0:" + dateFormat + "}', category) #, #=value#"
                    }
                },
                series: [{
                    type: "line",
                    field: "value",
                    categoryField: "date",
                    name: self.getResource("analytics-process-processactivity-trend-title")
                }],
                categoryAxis: {
                    baseUnit: result.scale.toLowerCase() + "s",
                    field: "date",
                    labels: {
                        format: dateFormat,
                        padding: {
                            left: -10
                        }
                    }
                }
            };

            //set label steps
            $.extend(true, settings, self.setLabelSteps(stats.length));

            return self.graphics.getDataVizObject(settings);
        }).done(function (data) {

            //Print Chart
            trendContainer.find(".bz-rp-chart").kendoChart(data);

        });
    },

    /*
    * Get Date Range to paint the trend graph
    */
    getDateRange: function (rows, date) {

        var resultDate;
        var stats = { value: 0, date: new Date(date) };

        for (var i = 0, len = rows.length; i < len; i++) {

            resultDate = new Date(rows[i].date.month + "/" + rows[i].date.day + "/" + rows[i].date.year);

            if ((date.getTime() === resultDate.getTime())) {

                stats.value = rows[i].activations;
            }

        }

        return stats;
    }

});
