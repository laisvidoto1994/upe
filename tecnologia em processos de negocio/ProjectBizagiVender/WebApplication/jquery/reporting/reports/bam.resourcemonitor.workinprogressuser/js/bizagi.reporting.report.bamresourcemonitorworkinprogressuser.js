/*
*   Name: BizAgi Report for BAM - Process - Work in Progress
*   Author: David Romero
*   Comments:
*   -   This script draws a specific report for BAM - Resource Monitor - User
*/

bizagi.reporting.report.extend("bizagi.reporting.report.bamresourcemonitorworkinprogressuser", {}, {

    /*
    * Initialize report
    */
    init: function (params) {

        this._super(params);

        this.process = { process: { id: 0} };
        this.reportName = "BAM.Resource.User";
    },

    /*
    *   Initialize all needed templates
    */
    initializeTemplates: function () {
        return {
            "main": (bizagi.getTemplate("bizagi.reporting.report.bamresourcemonitorworkinprogressuser") + "#bz-rp-bam-resourcemonitor-workinprogressuser-main"),
            "chart": (bizagi.getTemplate("bizagi.reporting.report.bamresourcemonitorworkinprogressuser") + "#bz-rp-bam-resourcemonitor-workinprogressuser-chart"),
            "message": (bizagi.getTemplate("bizagi.reporting.report.bamresourcemonitorworkinprogressuser") + "#bz-rp-bam-resourcemonitor-workinprogressuser-message"),
            "exportexcel": (bizagi.getTemplate("bizagi.reporting.report") + "#bz-rp-exportexcel")
        };
    },

    /*
    *   Templated render component
    */
    renderContent: function () {

        var self = this;
        var main = self.getTemplate("main");

        //render main template
        self.content = $.tmpl(main);

        return $.when(self.loadComponents()).pipe(function () {

            if ($.isEmptyObject(self.model)) {
                self.renderMessage(1);
            } else {
                var filter = "filters=" + JSON.stringify(self.model);
                //draw report
                self.drawReport(filter);
            }

            return self.content;
        });

    },

    /*
    * Load Components
    */
    loadComponents: function () {

        var self = this;

        //call parent
        self._super();

        return $.when(self.loadDimensionsComponent(this.process, "getSystemDimensions"));
    },

    /*
    * Post Render
    */
    postRender: function () {

        var self = this;

    },


    /*
    * Get JSON for detail list
    */
    getDetailListObject: function (ui) {

        var self = this;

        var columnName = ui.series.field.toLowerCase(),
            task = ui.dataItem.guidTask,
            user = ui.dataItem.id;

        var object = { detailList: { reportName: self.reportName, columnName: columnName, task: task, user: user} };

        //update process id
        self.process.process.id = ui.dataItem.processId;

        //return JSON
        return $.extend({}, self.process, object);
    },

    /*
    * Redraw Graphics
    */
    drawReport: function (filter) {

        var self = this;

        self.setFiltersForCustomRPComp();
        
        $.when(self.services.getResourceMonitorWorkInProgressPerUser(filter)).done(function (result) {

            //if there is an empty result render message otherwise render charts
            if (result.users.length) {

                var iconTmpl = self.getTemplate("exportexcel");
                var dataChart = self.groupDataChart(result.users);
                var $chartsContainer = $(".bz-rp-bam-resourcemonitor-workinprogressuser-charts", self.content).empty();

                if (!$.isEmptyObject(dataChart)) {

                    $chartsContainer.append($.tmpl(iconTmpl,{},{
                        getReportExcelUrl: self.getReportExcelUrl("bam.resources.user")
                    }));

                    $.each(dataChart, function (i, value) {
                        self.drawCharts(value, $chartsContainer);
                    });
                }
            } else {
                var msg = (self.components.dimension.dimensions.length) ? 2 : 1;
                self.renderMessage(msg);
            }

        });

    },

    /*
    * override to not publish the filterChange event
    */
    excecuteFilterChange: function () {

        var self = this;
        var modelFilter = "filters=" + JSON.stringify(self.model);

        self.drawReport(modelFilter);
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
                field: "fieldName",
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

            value = "-" + users[i].id + "-";

            users[i].fieldName = users[i].processName + " - " + users[i].taskName;

            if (typeof (tasks[value]) == "object") {
                tasks[value].push(users[i]);
            } else {
                tasks[value] = new Array(users[i]);
            }
        }

        return tasks;
    },

    /*
    * Render message for no data
    */
    renderMessage: function (msg) {

        var self = this;
        var tmpl = self.getTemplate("message");
        var chartsContainer = $(".bz-rp-bam-resourcemonitor-workinprogressuser-charts", self.content);

        chartsContainer.html($.tmpl(tmpl, { msg: msg }));

    },

    getReportExcelUrl: function(namespace){
        var self = this;
        var model = $.extend({}, self.taskGuid, self.model);
        var filter = "reportName=" + namespace + "&filters=" + JSON.stringify(model) + "&user=" + bizagi.currentUser.idUser;

        return self.services.getExportExcelUrl(filter);
    }

});
