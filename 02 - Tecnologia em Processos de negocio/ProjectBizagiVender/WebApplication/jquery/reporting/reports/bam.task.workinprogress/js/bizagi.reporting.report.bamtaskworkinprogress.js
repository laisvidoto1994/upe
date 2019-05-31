/*
*   Name: BizAgi Report for BAM - Task - Work in Progress
*   Author: David Romero
*   Comments:
*   -   This script draws a specific report for BAM - Task - Work in Progress
*/

bizagi.reporting.report.extend("bizagi.reporting.report.bamtasksworkinprogress", {}, {

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
            "main": (bizagi.getTemplate("bizagi.reporting.report.bamtaskworkinprogress") + "#bz-rp-bam-task-workinprogress-main"),
            "taskstatus": (bizagi.getTemplate("bizagi.reporting.report.bamtaskworkinprogress") + "#bz-rp-bam-task-worinprogress-taskstatus"),
            "taskgoingoverdue": (bizagi.getTemplate("bizagi.reporting.report.bamtaskworkinprogress") + "#bz-rp-bam-task-worinprogress-taskgoingoverdue")
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
        var reportName = ui.sender.options.chartName,
            object = {};

        if (reportName === "BAM.Task.GoingOverdue") {
            var columnIndex = $.inArray(ui.category, ui.sender.options.categoryAxis.categories);
            object = { detailList: { reportName: reportName, columnIndex: columnIndex} };
        } else if (reportName === "BAM.Task.TaskStatus") {
            object = { detailList: { reportName: reportName, columnName: ui.dataItem.name} };
        }

        //return JSON
        return object;

    },

    /*
    *   Draw Graphics
    */
    drawReport: function (filter) {

        var self = this;

        self.setFiltersForCustomRPComp();
        self.drawTaskStatus(filter);
        self.drawTaskGoingOverdue(filter);

    },

    /*
    *   This methods queries the server for the data, and repaint the cases going overdue chart
    */
    drawTaskGoingOverdue: function (filter) {

        var self = this;

        //Render template
        var taskGoingOverdueTemplate = self.getTemplate("taskgoingoverdue");
        var taskstatusContainer = $.tmpl(taskGoingOverdueTemplate);

        //Render graph content
        var mainContainer = self.getTemplateComponent(self.content, "bam-task-workinprogress-taskgoingoverdue");
        mainContainer.empty().append(taskstatusContainer);

        $.when(self.services.getTaskGoingOverdue(filter)).done(function (result) {

            if (result.rows.length) {

                var data = self.getGraphData(result.rows);

                var settings = {
                    chartName: "BAM.Task.GoingOverdue",
                    series: [{
                        color: "#FF4040",
                        data: data.series
                    }],
                    categoryAxis: {
                        categories: data.categories
                    }
                };

                var dataVizObject = self.graphics.getDataVizObject(settings);
                mainContainer.find(".bz-rp-chart").empty().kendoChart(dataVizObject);
            }
        });

    },

    /*
    *   This methods queries the server for data, and repaint the content
    */
    drawTaskStatus: function (filter) {

        var self = this;

        //Render template
        var taskStatusTemplate = self.getTemplate("taskstatus");
        var taskStatusContainer = $.tmpl(taskStatusTemplate);

        //Render graph data
        var mainContainer = self.getTemplateComponent(self.content, "bam-task-workinprogress-taskstatus");
        mainContainer.empty().append(taskStatusContainer);
        
        $.when(self.services.getTaskStatus(filter)).done(function (result) {

            if (result.ontime > 0 || result.onrisk > 0 || result.overdue > 0) {

                var object = [{ category: self.getResource("reports-general-ontime-label"), value: result.ontime, color: "#8bbc21", name: "ontime" },
                    { category: self.getResource("reports-general-onrisk-label"), value: result.onrisk, color: "#FFCF40", name: "onrisk" },
                    { category: self.getResource("reports-general-overdue-label"), value: result.overdue, color: "#FF4040", name: "overdue"}];

                var settings = {
                    dataSource: {
                        data: object
                    },
                    chartName: "BAM.Task.TaskStatus",
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
                mainContainer.find(".bz-rp-chart").empty().kendoChart(dataVizObject);
            }
        });
    },

    /*
    * This method retorn the object to draw the graph Cases Going Overdue
    */
    getGraphData: function (rows) {

        var self = this;

        var months = self.getResource("datePickerRegional").monthNamesShort;
        var series = new Array(10);
        var categories = new Array(10);
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth();
        var monthName = "";
        var moreThan10 = 0;

        for (var i = 0; i < 10; i++) {

            if (typeof (rows[i]) != "undefined") {
                if (rows[i].daysLeft < 10) {

                    series[rows[i].daysLeft] = rows[i].tasks;
                } else {

                    moreThan10 += rows[i].tasks;
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
