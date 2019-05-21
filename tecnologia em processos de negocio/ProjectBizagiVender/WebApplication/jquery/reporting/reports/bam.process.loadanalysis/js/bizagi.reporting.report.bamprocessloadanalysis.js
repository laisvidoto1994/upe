/*
 *   Name: BizAgi Report for BAM - Process - Analysis
 *   Author: Diego Parra
 *   Comments:
 *   -   This script draws a specific report for BAM - Process - Analysis
 */

bizagi.reporting.report.extend("bizagi.reporting.report.bamprocessloadanalysis", {}, {

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
            "main": (bizagi.getTemplate("bizagi.reporting.report.bamprocessloadanalysis") + "#bz-rp-bam-process-loadanalysis-main"),
            "loadanalysis": (bizagi.getTemplate("bizagi.reporting.report.bamprocessloadanalysis") + "#bz-rp-bam-process-loadanalysis")
        };
    },

    /*
    * Draw Report
    */
    drawReport: function () {

        var self = this;

        self.setFiltersForCustomRPComp();
        self.drawProcessAnalysis();
    },

    /*
    * Get JSON for detail list
    */
    getDetailListObject: function (ui) {

        var self = this;
        var embedded = { };
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
        var processId = ui.dataItem.processId, reportName = ui.sender.options.chartName, columnName = ui.series.field;

        //return JSON
        return { process: { id: processId }, detailList: { reportName: reportName, columnName: columnName, embedded: embedded} };

    },

    /*
    *   This methods queries the server for data, and repaint the content
    */
    drawProcessAnalysis: function () {

        var self = this;
        var processAnalysisTemplate = self.getTemplate("loadanalysis");
        var processAnalysis = $.tmpl(processAnalysisTemplate);
        var mainContainer = self.getTemplateComponent(self.content, "bam-process-loadanalysis");

        //render component
        mainContainer.empty().append(processAnalysis);

        $.when(self.services.getBAMProcessAnalysisData()).done(function (result) {

            if (result.rows.length) {

                var data = {};

                var settings = {
                    seriesDefaults: {
                        type: "bar",
                        tooltip: {
                            visible: false
                        }
                    },
                    chartName: "BAM.Process.LoadAnalysis",
                    dataSource: {
                        data: result.rows,
                        sort: [
                        {
                            field: "overdue",
                            dir: "asc"
                        },
                        {
                            field: "onrisk",
                            dir: "asc"
                        },
                        {
                            field: "ontime",
                            dir: "asc"
                        }
                    ]
                    },
                    legend: {
                        position: "top"
                    },
                    series: [{
                        field: "ontime",
                        name: self.getResource("reports-general-ontime-label"),
                        color: "#8bbc21"
                    }, {
                        field: "onrisk",
                        name: self.getResource("reports-general-onrisk-label"),
                        color: "#FFCF40"
                    }, {
                        field: "overdue",
                        name: self.getResource("reports-general-overdue-label"),
                        color: "#FF4040"
                    }],
                    categoryAxis: {
                        field: "processName",
                        reverse: true
                    }

                };

                //extend graph height
                $.extend(settings, self.calculateGraphHeight(result.rows.length));

                data = self.graphics.getDataVizObject(settings);

                //Print CaseStatus Chart
                mainContainer.find(".bz-rp-chart").kendoChart(data);
            }

        });
    }
});
