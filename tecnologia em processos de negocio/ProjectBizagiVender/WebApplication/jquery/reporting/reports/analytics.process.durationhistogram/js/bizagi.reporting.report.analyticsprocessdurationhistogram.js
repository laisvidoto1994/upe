/*
*   Name: BizAgi Report for Analytics - Process - Duration Histogram
*   Author: David Romero
*   Comments:
*   -   This script draws a specific report for Analytics - Process - Duration Histogram
*/

bizagi.reporting.report.extend("bizagi.reporting.report.analyticsprocessdurationhistogram", {}, {

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
            "main": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocessdurationhistogram") + "#bz-rp-analytics-process-durationhistogram-main"),
            "durationhistogram": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocessdurationhistogram") + "#bz-rp-analytics-process-durationhistogram-graph")
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
    * Get JSON for detail list
    */
    getDetailListObject: function () {
       return false;
    },

    /*
    * Redraw Graphics
    */
    drawReport: function (filter) {

        var self = this;

        self.setFiltersForCustomRPComp();
        self.drawDurationHistogram(filter);
    },

    /*
    *   This method queries the server for the data, and repaint the duration histogram graph
    */
    drawDurationHistogram: function (filter) {

        var self = this;

        //Render template
        var durationHistogramTemplate = self.getTemplate("durationhistogram");
        var durationHistogramContainer = $.tmpl(durationHistogramTemplate);

        //Render content
        var mainContainer = self.getTemplateComponent(self.content, "analytics-process-durationhistogram");
        mainContainer.empty().append(durationHistogramContainer);

        $.when(self.services.getDurationHistogram(filter)).done(function (result) {

            if (result.rows.length) {

                var data = self.getGraphData(result);

                var settings = {
                    dataSource: {
                        data: data.rows,
                        sort: {
                            field: "days",
                            dir: "asc"
                        }
                    },
                    seriesDefaults: {
                        type: "area"
                    },
                    series: [{
                        field: "cases",
                        name: self.getResource("analytics-process-durationhistogram-foot-report-xaxis")
                    }],
                    categoryAxis: {
                        notes: {
                            icon: {
                                visible: false
                            },
                            label: {
                                visible: false
                            },
                            line: {
                                dashType: "dashDot",
                                width: 4,
                                color: "red",
                                length: 400
                            },
                            data: [{ value: data.linePosition}]
                        },
                        field: "days"
                    }
                };

                var dataVizObject = self.graphics.getDataVizObject(settings);

                //Print CaseStatus Chart
                mainContainer.find(".bz-rp-chart").kendoChart(dataVizObject);
            }
        });
    },

    /*
    * Get data for painting the histogram
    */
    getGraphData: function (result) {

        var self = this;
        var expectedDuration = result.durationExpected;
        var rows = result.rows;
        var length = rows.length;
        var after15 = rows.splice(15, length - 15);
        var linePosition = 0;

        for (var i = 0, len = after15.length; i < len; i++) {
            rows[14].cases += after15[i].cases;
        }

        for (var i = 0, len = rows.length; i < len; i++) {

            if (rows[i].days == expectedDuration) {

                linePosition = i;
                break;

            } else if (rows[i].days > expectedDuration) {

                linePosition = i;

                var lineValue = (rows[linePosition - 1].cases + rows[linePosition].cases) / 2;
                rows.splice(i, 0, { "cases": lineValue, "days": expectedDuration });
                break;
            }
        }

        if (length >= 15) {
            rows[14].days = self.getResource("reports-general-nextdays");
        }
        return { linePosition: linePosition, rows: rows };
    }
});