/*
*   Name: BizAgi Report for BAM - Process - Work in Progress
*   Author: David Romero
*   Comments:
*   -   This script draws a specific report for BAM - Process - Work in Progress
*/

bizagi.reporting.report.extend("bizagi.reporting.report.bamprocessworkinprogress", {}, {

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
        return { process: {}, dimension: [] };
    },

    /*
    *   Initialize all needed templates
    */
    initializeTemplates: function () {
        return {
            "main": (bizagi.getTemplate("bizagi.reporting.report.bamprocessworkinprogress") + "#bz-rp-bam-process-workinprogress-main"),
            "casestatus": (bizagi.getTemplate("bizagi.reporting.report.bamprocessworkinprogress") + "#bz-rp-bam-process-worinprogress-casestatus"),
            "casesgoingoverdue": (bizagi.getTemplate("bizagi.reporting.report.bamprocessworkinprogress") + "#bz-rp-bam-process-worinprogress-casesgoingoverdue")
        };
    },

    /*
    * Load Components
    */
    loadComponents: function () {

        var self = this;

        //call parent
        self._super();

        return $.when(self.loadProcessesVersionComponent()).pipe(function () {
            return self.loadDimensionsComponent({ process: self.model.process });
        });
    },

    /*
    * Get JSON for detail list
    */
    getDetailListObject: function (ui) {

        var self = this;
        var reportName = ui.sender.options.chartName;
        var object = {};
        var embedded = {};
        if (reportName === "BAM.Process.CasesGoingOverdue") {
            if (ui.series.embedded) {
                embedded = {
                    task: {
                        id: ui.series.embedded.taskId,
                        guid: ui.series.embedded.taskGuid
                    },
                    parentProcess: {
                        id: ui.series.embedded.parentProcessId
                    }
                };
            }
            var columnIndex = $.inArray(ui.category, ui.sender.options.categoryAxis.categories);
            object = { detailList: { reportName: reportName, columnIndex: columnIndex, embedded: embedded} };
        } else if (reportName === "BAM.Process.CaseStatus") {
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
            object = { detailList: { reportName: reportName, columnName: ui.dataItem.name, embedded: embedded} };
        }

        //return JSON
        return object;
    },

    /*
    * Redraw Graphics
    */
    drawReport: function (filter) {

        var self = this;

        self.setFiltersForCustomRPComp();
        self.drawCaseStatus(filter);
        self.drawCasesGoingOverdue(filter);
    },

    /*
    *   This methods queries the server for the data, and repaint the cases going overdue chart
    */
    drawCasesGoingOverdue: function (filter) {

        var self = this;

        //Render template
        var casesGoingOverdueTemplate = self.getTemplate("casesgoingoverdue");
        var mainContainer = self.getTemplateComponent(self.content, "bam-process-workinprogress-casesgoingoverdue");

        //Render graph content
        var casestatusContainer = $.tmpl(casesGoingOverdueTemplate);
        mainContainer.empty().append(casestatusContainer);

        $.when(self.services.getCasesGoingOverdue(filter)).done(function (result) {

            if (result.rows.length) {

                var data = self.getGraphData(result.rows);
                var embedded = result.embedded ? result.embedded : { };
                var settings = {
                    series: [{
                        color: "#FF4040",
                        data: data.series,
                        embedded: embedded
                    }],
                    chartName: "BAM.Process.CasesGoingOverdue",
                    categoryAxis: {
                        categories: data.categories
                    }
                };

                var dataVizObject = self.graphics.getDataVizObject(settings);

                //Print CaseStatus Chart
                mainContainer.find(".bz-rp-chart").kendoChart(dataVizObject);

            }

        });

    },

    /*
    *   This methods queries the server for data, and repaint the content
    */
    drawCaseStatus: function (filter) {

        var self = this;

        //Render template
        var casestatusTemplate = self.getTemplate("casestatus");
        var casestatus = $.tmpl(casestatusTemplate);

        //Render graph content
        var mainContainer = self.getTemplateComponent(self.content, "bam-process-workinprogress-casestatus");
        mainContainer.empty().append(casestatus);

        $.when(self.services.getCaseStatus(filter)).done(function (result) {

            if (result.ontime || result.overdue || result.onrisk) {
                var embedded = result.embedded ? result.embedded : {};
                var object = [
                    { "category": self.getResource("reports-general-ontime-label"), "value": result.ontime, "color": "#8bbc21", "name": "ontime", "embedded": embedded },
                    { "category": self.getResource("reports-general-overdue-label"), "value": result.overdue, "color": "#FF4040", "name": "overdue", "embedded": embedded },
                    { "category": self.getResource("reports-general-onrisk-label"), "value": result.onrisk, "color": "#FFCF40", "name": "onrisk", "embedded": embedded }
                ];

                var settings = {
                    dataSource: {
                        data: object
                    },
                    chartName: "BAM.Process.CaseStatus",
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
        });
    },

    /*
    * This method retorn the object to draw the graph
    */
    getGraphData: function (rows) {

        var self = this;

        var months = self.getResource("datePickerRegional").monthNamesShort;
        var series = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var categories = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth();
        var monthName = "";
        var moreThan10 = 0;

        for (var i = 0; i < 10; i++) {

            if (typeof (rows[i]) != "undefined") {
                if (rows[i].daysLeft < 10) {

                    series[rows[i].daysLeft] = rows[i].cases;
                } else {

                    moreThan10 += rows[i].cases;
                }
            }

            monthName = months[month];
            categories[i] = monthName + "/" + day;

            date.setDate(date.getDate() + 1);
            day = date.getDate();
            month = date.getMonth();
        }

        if (moreThan10 > 0) {

            categories.push(self.getResource("reports-general-moredays-label"));
            series.push(moreThan10);
        }

        return { series: series, categories: categories };
    }
});
