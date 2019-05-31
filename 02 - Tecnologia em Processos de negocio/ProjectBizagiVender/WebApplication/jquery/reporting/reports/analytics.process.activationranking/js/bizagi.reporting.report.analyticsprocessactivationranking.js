/*
*   Name: BizAgi Report for Analytics - Process - Activation Ranking
*   Author: David Romero
*   Comments:
*   -   This script draws a specific report for Analytics - Process - Activation Ranking
*/

bizagi.reporting.report.extend("bizagi.reporting.report.analyticsprocessactivationranking", {}, {

    /*
    * Initialize report
    */
    init: function (params) {

        this._super(params);
        this.process = { process: { id: 0} };
    },

    /*
    * Get filters object
    */
    getFiltersObject: function () {
        return { dimension: [], time: {} };
    },

    /*
    *   Initialize all needed templates
    */
    initializeTemplates: function () {

        return {
            "main": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocessactivationranking") + "#bz-rp-analytics-process-activationranking-main"),
            "activationranking": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocessactivationranking") + "#bz-rp-analytics-process-activationranking-graph")
        };
    },

    /*
    * Load Components
    */
    loadComponents: function () {

        var self = this;

        self._super();

        return $.when(self.loadDimensionsComponent(self.process)).pipe(function () {
            return self.loadTimeComponent();
        });
    },

    /*
    * Get JSON for detail list
    */
    getDetailListObject: function (ui) {

        var self = this,
        reportName = ui.sender.options.chartName,
        id = ui.dataItem.id,
        guid = ui.dataItem.guid;
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
        return { process: { id: id, guid: guid }, detailList: { reportName: reportName, embedded: embedded} };
    },

    /*
    * Redraw Graphics
    */
    drawReport: function (filter) {

        var self = this;

        self.setFiltersForCustomRPComp();
        self.drawActivationRanking(filter);
    },

    /*
    *   This method queries the server for the data, and repaint the activation ranking graph
    */
    drawActivationRanking: function (filter) {

        var self = this;

        //Render template
        var activationRankingTemplate = self.getTemplate("activationranking");
        var activationRankingContainer = $.tmpl(activationRankingTemplate);

        //Render graph
        var mainContainer = self.getTemplateComponent(self.content, "analytics-process-activationranking");
        mainContainer.empty().append(activationRankingContainer);

        $.when(self.services.getActivationRanking(filter)).done(function (result) {

            if (result.processes.length) {

                var settings = {
                    dataSource: {
                        data: result.processes
                    },
                    seriesDefaults: {
                        type: "bar",
                        tooltip: {
                            visible: false
                        }
                    },
                    chartName: "Analytics.Process.ActivationRanking",
                    series: [{
                        field: "cases",
                        name: self.getResource("analytics-process-activationranking-foot-report-xaxis")
                    }],
                    categoryAxis: {
                        field: "name"
                    }
                };

                $.extend(settings, self.calculateGraphHeight(result.processes.length));

                var data = self.graphics.getDataVizObject(settings);

                //Print CaseStatus Chart
                mainContainer.find(".bz-rp-chart").kendoChart(data);
            }
        });
    }
});