/*
*   Name: BizAgi Report for BAM - Process - Work in Progress
*   Author: David Romero
*   Comments:
*   -   This script draws a specific report for BAM - Resource Monitor - Work in Progress
*/

bizagi.reporting.report.extend("bizagi.reporting.report.bamresourcemonitorworkinprogress", {}, {

    /*
    * Initialize report
    */
    init: function (params) {

        this._super(params);

        this.taskGuid = {};
        this.cacheProcess = -1;
        this.users = [];
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
            "main": (bizagi.getTemplate("bizagi.reporting.report.bamresourcemonitorworkinprogress") + "#bz-rp-bam-resourcemonitor-workinprogress-main"),
            "chart": (bizagi.getTemplate("bizagi.reporting.report.bamresourcemonitorworkinprogress") + "#bz-rp-bam-resourcemonitor-workinprogress-chart"),
            "exportexcel": (bizagi.getTemplate("bizagi.reporting.report") + "#bz-rp-exportexcel")
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
    * Post Render
    */
    postRender: function () {

        var self = this;

        //Add event handlers
        self.eventHandlers();
    },

    /*
    * Get JSON for detail list
    */
    getDetailListObject: function (ui) {

        var self = this;

        var reportName = ui.sender.options.chartName,
            columnName = ui.series.field.toLowerCase(),
            task = ui.dataItem.guidTask,
            user = ui.dataItem.id;

        //return JSON
        return { detailList: { reportName: reportName, columnName: columnName, task: task, user: user} };
    },

    /*
    * Redraw Graphics
    */
    drawReport: function () {

        var self = this;
        var model = {}, filter = "filters=";

        self.setFiltersForCustomRPComp();

        if (self.cacheProcess === self.model.process.id && self.taskGuid.task) {
            model = $.extend({}, self.model, self.taskGuid);
        } else {
            model = self.model;
            self.taskGuid = {};

            //draw process viewer
            self.drawProcessModel();
        }

        //save cache process
        self.cacheProcess = self.model.process.id;

        //set filter
        filter += JSON.stringify(model);

        self.callService(filter);

    },

    /*
    * Call service a draw charts
    */
    callService: function (filter) {

        var self = this;

        $.when(self.services.getResourceMonitorWorkInProgress(filter)).done(function (result) {

            var iconTmpl = self.getTemplate("exportexcel");
            var dataChart = self.groupDataChart(result.users);
            var $chartsContainer = $(".bz-rp-bam-resourcemonitor-workinprogress-charts", self.content).empty();

            //append export to excel icon

            if (!$.isEmptyObject(dataChart)) {
                
                $chartsContainer.append($.tmpl(iconTmpl,{},{
                    getReportExcelUrl: self.getReportExcelUrl("bam.resources.task")
                }));

                $.each(dataChart, function (i, value) {
                    self.drawCharts(value, $chartsContainer);
                });
            }
        });

    },

    /*
    * Implement the plugin process viewer
    */
    drawProcessModel: function () {

        var self = this;
        var $viewerCanvas = $(".bz-rp-processviewer-canvas", self.content);

        self.renderProcessViewer($viewerCanvas);
    },

    /*
    * Draw charts 
    */
    drawCharts: function (data, chartsContainer) {

        var self = this;
        var tmpl = self.getTemplate("chart");

        //Add to container
        chartsContainer.append($.tmpl(tmpl, data[0]));

        var settings = {
            dataSource: {
                data: data
            },
            legend: {
                position: "top"
            },
            chartName: "BAM.Resource.Task",
            seriesDefaults: {
                tooltip: {
                    visible: false
                },
                type: "bar"
            },
            series:
                [{
                    field: "onTime",
                    name: self.getResource("reports-general-ontime-label"),
                    color: "#8bbc21"
                }, {
                    field: "onRisk",
                    name: self.getResource("reports-general-onrisk-label"),
                    color: "#FFCF40"
                }, {
                    field: "overdue",
                    name: self.getResource("reports-general-overdue-label"),
                    color: "#FF4040"
                }],
            categoryAxis: {
                field: "fullName",
                reverse: true
            }
        };

        //extend graph height
        $.extend(settings, self.calculateGraphHeight(data.length));

        var dataViz = self.graphics.getDataVizObject(settings);

        //Print Charts
        $(".bz-rp-chart", chartsContainer).last().kendoChart(dataViz);

    },

    /*
    * Group data for chart
    */
    groupDataChart: function (users) {

        var tasks = {};
        var value, len = users.length;

        for (var i = len; --i >= 0; ) {

            value = "-" + users[i].idTask + "-";

            if (typeof (tasks[value]) == "object") {
                tasks[value].push(users[i]);
            } else {
                tasks[value] = new Array(users[i]);
            }
        }

        return tasks;
    },

    /*
    * Events Handlers
    */
    eventHandlers: function () {

        var self = this;
        var $viewerCanvas = $(".bz-rp-processviewer-canvas", self.content);

        //Process viewer events
        $viewerCanvas.on('click', '.usertask, .abstracttask, .manualtask, .nonetask, svg', function (event) {

            var filter = "filters=", model = {};

            if (!$(this).is('svg')) {

                //Add guid to the task
                self.taskGuid = { task: { guid: this.id} };
                model = $.extend({}, self.model, self.taskGuid);

                $viewerCanvas.processviewer('unSelectAllShapes').processviewer('selectShape', this.id);

            } else {

                $viewerCanvas.processviewer('unSelectAllShapes');
                model = self.model;
                self.taskGuid = {};
            }

            //create filter
            filter += JSON.stringify(model);

            self.callService(filter);
        });

    },

    getReportExcelUrl: function(namespace) {
        var self = this;
        var model = $.extend({}, self.taskGuid, self.model);
        var filter = "reportName=" + namespace + "&filters=" + JSON.stringify(model) + "&user=" + bizagi.currentUser.idUser;

        return self.services.getExportExcelUrl(filter);
    }
});
