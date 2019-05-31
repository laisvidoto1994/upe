/*
*   Name: BizAgi Report for Sensors
*   Author: David Romero
*   Comments:
*   -   This script draws a specific report for Sensors
*/

bizagi.reporting.report.extend("bizagi.reporting.report.sensors", {}, {
    /*
    * Initialize report
    */
    init: function (params) {

        this._super(params);

        this.view = "process.stopwatch";
        this.total = 0;
        this.acttab = "stopwatch";
        this.counter = { sensor: { type: "counter", caseBased: true} };
        this.stopwatch = -1;
        this.allSensors = [];
        this.dspSensors = [];
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
            "main": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-main"),
            "list": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-list"),
            "summaryAct": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-counters-actdate"),
            "summaryCrt": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-counters-crtdate"),
            "countdiagram": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-counters-countsgraph"),
            "acttrend": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-counters-acttrend"),
            "processview": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-processview"),
            "stopwatches": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-stopwatches"),
            "counters": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-counters"),
            "countersdata": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-counters-data"),
            "summaryCycleTime": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-stopwatches-cycletimesummary"),
            "summayLvService": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-stopwatches-lvservicesummary"),
            "durationHistogram": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-stopwatches-durationhistogram"),
            "durationTrend": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-stopwatches-durationtrend"),
            "actVsClose": (bizagi.getTemplate("bizagi.reporting.report.sensors") + "#bz-rp-sensors-stopwatches-actvsclose")
        };
    },

    /*
    *   Templated render component
    */
    renderContent: function () {
        var self = this;
        var main = self.getTemplate("main");

        // Render main template
        self.content = $.tmpl(main);

        return $.when(self.loadComponents()).pipe(function () {


            if (self.total) {

                //render process list
                self.renderProcessList();

                //render view to show sensors data
                self.renderProcessView();

                //render data
                self.drawReport();
            }

            return self.content;
        });

    },

    /*
    * Post Render
    */
    postRender: function () {

        var self = this;

        self.eventsHandlers();
        self.appendTooltip();

        //set columns size
        self.setColumnsSize();
    },

    /*
    * Get JSON for detail list
    */
    getDetailListObject: function (ui) {

        var self = this;
        var object = (ui.dtlType === "dataViz") ? self.getGraphDtlObject(ui) : self.getSensorDtlObject(ui);

        //return JSON
        return (object) ? object : false;
    },

    /*
    * Get graph detail list object
    */
    getGraphDtlObject: function (ui) {

        var self = this;
        var reportName = ui.sender.options.chartName;

        if (reportName === "Sensors.Process.CounterSummary") {

            var id = ui.dataItem.id,
                type = ui.sender.options.detailList.type,
                caseBased = ui.sender.options.detailList.caseBased;

            return { sensor: { id: id, type: type, caseBased: caseBased }, detailList: { reportName: reportName} };
        }

        return false;
    },

    /*
    * Get sensors detail
    */
    getSensorDtlObject: function (ui) {

        var self = this;

        return { sensor: ui.sensor, detailList: ui.detailList };
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
    * Draw Report
    */
    drawReport: function () {

        var self = this;

        self.setFiltersForCustomRPComp();

        if (self.view === "counter" || self.view === "process.counter") {
            self.renderCounters();
        } else if (self.view === "stopwatch" || self.view === "process.stopwatch") {
            self.renderStopwatchData();
        }

    },

    /*
    * Load components
    */
    loadComponents: function () {

        var self = this;
        var tmpl = self.getTemplate("component");

        //Render component template
        var componentCnt = $.tmpl(tmpl, { components: self.jCMP });
        self.content.prepend(componentCnt);

        //Listen data list event
        self.loadDetailListComponent();

        return $.when(self.services.getSensorsList()).pipe(function (response) {

            var id = 0;
            self.allSensors = response;
            self.total = self.allSensors.processes.length;

            if (self.total) {
                self.loadCustomReportsComponent();

                if (!self.model.process.id) {
                    self.updateModel(response.processes[0].id);
                }
            }

            return self.loadDimensionsComponent(self.getProcessObject(), "getSensorsDimensions");

        }).pipe(function () {

            return self.loadTimeComponent();
        });
    },

    /*
    * Render tabs view
    */
    renderProcessView: function () {

        var self = this;
        var tmpl = self.getTemplate("processview");
        var component = self.getTemplateComponent(self.content, "sensors-processview");
        var content = $.tmpl(tmpl);

        //render content
        component.html(content);
    },

    /*
    * Render process list with
    */
    renderProcessList: function () {

        var self = this;
        var tmpl = self.getTemplate('list');

        $("#bz-rp-reports-sensors-list", self.content).html($.tmpl(tmpl, self.allSensors, self.model.process));
    },

    /*
    * Function to render the conters data container
    */
    renderCounters: function () {

        var self = this;
        var tmpl = self.getTemplate("counters");
        var $cntContainer = self.getTemplateComponent(self.content, "sensors-content");

        //append container of data
        $cntContainer.html($.tmpl(tmpl, { "caseBased": self.counter.sensor.caseBased }));

        //call counters data to render summaries and graphs
        self.renderCountersData();

    },

    /*
    * Render counters data
    */
    renderCountersData: function () {

        var self = this;
        var filter = self.getCounterFilter();

        //render summary
        $.when(self.services.getCounterSummary(filter)).done(function (response) {
            var tmpl = self.getTemplate("countersdata");
            var container = self.getTemplateComponent(self.content, "sensors-counter-data");

            //render containers
            container.html($.tmpl(tmpl));

            self.renderCounterSummary(filter, response);

            // Responsive tables
            self.updateTables();

            if (self.view === "process.counter") {
                self.paintCountDiagram(response);
            } else if (self.view === "counter") {
                self.paintActivationTrend(filter);
            }
        });
    },

    /*
    * Render stopwatch data
    */
    renderStopwatchData: function () {

        var self = this;

        //render stopwatch tmpl
        var tmpl = self.getTemplate("stopwatches");
        var $swContainer = self.getTemplateComponent(self.content, "sensors-content").empty();

        //render tables
        $.when(self.renderStopwatchTables()).done(function () {

            $swContainer.html($.tmpl(tmpl));

            //render graphs
            self.renderStopwatchGraphs();

        });
    },

    /*
    * Makes the tables responsive
    */
    updateTables: function () {
        var self = this,
            switched = $(".table-wrapper", self.content).length;

        if (!switched && ($(window).width() < 1067)) {
            $("table.responsive", self.content).each(function (i, element) {
                self.splitTable($(element));
            });
        }
        else if (switched && ($(window).width() > 1067)) {
            $("table.responsive", self.content).each(function (i, element) {
                self.unsplitTable($(element));
            });
        }
    },

    splitTable: function (original) {
        original.wrap("<div class='table-wrapper' />");

        var copy = original.clone();
        copy.find("td:not(:first-child), th:not(:first-child)").css("display", "none");
        copy.removeClass("responsive");

        original.closest(".table-wrapper").append(copy);
        copy.wrap("<div class='pinned' />");
        original.wrap("<div class='scrollable' />");
    },

    unsplitTable: function (original) {
        original.closest(".table-wrapper").find(".pinned").remove();
        original.unwrap();
        original.unwrap();
    },

    /*
    * Render stopwatch graphs
    */
    renderStopwatchGraphs: function () {

        var self = this;

        if (self.view === "stopwatch") {
            var filter = "filters=" + JSON.stringify($.extend({}, self.model, { sensor: { id: self.stopwatch, type: "stopwatch"} }));

            $.when(self.services.getSwDurationHistogram(filter), self.services.getSwDurationTrend(filter)).done(function (resultdh, resultdt) {

                self.paintDurationHistogram(resultdh[0]);
                self.paintDurationTrend(resultdt[0]);
                self.paintActivationVsClosing(resultdt[0]);
            });
        }
    },

    /*
    * Render stopwatch summaries
    */
    renderStopwatchTables: function () {

        var self = this;
        var deferred = $.Deferred();
        var objCt = {}, objLs = {};

        //object to filter cycletime summary
        if (self.view === "process.stopwatch") {
            objLs = objCt = $.extend({}, self.model, { sensor: {} });
        } else {
            objCt = $.extend({}, self.model, { sensor: { id: self.stopwatch, type: "stopwatch", caseBased: true} });
            objLs = $.extend({}, self.model, { sensor: { id: self.stopwatch, type: "stopwatch"} });
        }

        //filter cycletime
        var filterCt = "filters=" + JSON.stringify(objCt), filterLs = "filters=" + JSON.stringify(objLs);

        $.when(self.services.getCycleTimeSummary(filterCt), self.services.getLvSeviceSummary(filterLs)).done(function (result1, result2) {

            deferred.resolve();

            //render level of service table
            self.renderLvServiceSummary(result2[0]);
            //render cycle time table
            self.renderCycleTimeSummary(result1[0]);

            // Responsive tables
            self.updateTables();

        });

        return deferred;
    },

    /*
    * Render CycleTime summary
    */
    renderCycleTimeSummary: function (response) {

        var self = this;
        var tmpl = self.getTemplate("summaryCycleTime");
        var swContainer = self.getTemplateComponent(self.content, "sensors-stopwatch-cycletimesummary");

        var tmplFunctions = {
            day: self.getResource("reports-general-day").toUpperCase().slice(0, 1),
            hour: self.getResource("reports-general-hour").toUpperCase().slice(0, 1),
            minute: self.getResource("reports-general-minute").toUpperCase().slice(0, 1),
            getReportExcelUrl: self.getReportExcelUrl("sensor.stopwatch.summary")
        };

        //render cycle time summary
        swContainer.append($.tmpl(tmpl, response, tmplFunctions));
    },

    /*
    * Render level of service summary
    */
    renderLvServiceSummary: function (response) {

        var self = this;
        var tmpl = self.getTemplate("summayLvService");
        var swContainer = self.getTemplateComponent(self.content, "sensors-stopwatch-lvservicesummary");

        var tmplFunctions = {
            getReportExcelUrl: self.getReportExcelUrl("sensor.stopwatch.levelofservice")
        };

        //render level services summary
        swContainer.html($.tmpl(tmpl, response,tmplFunctions));
    },

    /*
    * Render counter summary
    */
    renderCounterSummary: function (filter, response) {

        var self = this;
        var $container = self.getTemplateComponent(self.content, "sensors-counters-summary");
        var tmpl = (!self.counter.sensor.caseBased) ? self.getTemplate("summaryAct") : self.getTemplate("summaryCrt");

        var tmplFunctions = {
            getReportExcelUrl: self.getReportExcelUrl("sensor.counters.summary")
        };
        $container.html($.tmpl(tmpl, response, tmplFunctions));
    },

    /*
    * Duration trend for stopwatches
    */
    paintDurationTrend: function (result) {

        var self = this;
        var tmpl = self.getTemplate("durationTrend");
        var startDate = new Date(self.model.time.dateFrom);
        var endDate = new Date(self.model.time.dateTo);
        var dateFormat = "";
        var stats = [];

        //append graph container
        var graphContainer = self.getTemplateComponent(self.content, "sensors-stopwatch-durationtrend");
        graphContainer.html($.tmpl(tmpl));

        switch (result.range) {
            case "Days":
                dateFormat = "MM/dd";
                for (; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
                    stats.push(self.getDateRange(result.durationTrend, startDate, 'durationDays'));
                }
                break;
            case "Months":
                dateFormat = "MM/yy";
                for (; startDate <= endDate; startDate.setMonth(startDate.getMonth() + 1)) {
                    stats.push(self.getDateRange(result.durationTrend, startDate, 'durationDays'));
                }
                break;
            case "Years":
                dateFormat = "yyyy";
                for (; startDate <= endDate; startDate.setFullYear(startDate.getFullYear() + 1)) {
                    stats.push(self.getDateRange(result.durationTrend, startDate, 'durationDays'));
                }
                break;
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
                name: self.getResource("bz-rp-sensors-stopwatches-drttrend-name")
            }],
            categoryAxis: {
                baseUnit: result.range.toLowerCase() + "s",
                field: "date",
                labels: {
                    format: dateFormat,
                    padding: {
                        left: -10
                    }
                }
            }
        };

        //set labels steps
        $.extend(true, settings, self.setLabelSteps(stats.length));

        var data = self.graphics.getDataVizObject(settings);

        //Print Chart
        graphContainer.find(".bz-rp-chart").kendoChart(data);
    },

    /*
    * Activation vs closing trend
    */
    paintActivationVsClosing: function (result) {

        var self = this;
        var tmpl = self.getTemplate("actVsClose");
        var startDate = new Date(self.model.time.dateFrom);
        var endDate = new Date(self.model.time.dateTo);
        var dateFormat = "";
        var stats = [];

        //append graph container
        var graphContainer = self.getTemplateComponent(self.content, "sensors-stopwatch-actvscls");
        graphContainer.html($.tmpl(tmpl));

        switch (result.range) {
            case "Days":
                dateFormat = "MM/dd";
                for (; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
                    stats.push(self.getActivationVsClosingData(result.activationClosingTrend, startDate));
                }
                break;
            case "Months":
                dateFormat = "MM/yy";
                for (; startDate <= endDate; startDate.setMonth(startDate.getMonth() + 1)) {
                    stats.push(self.getActivationVsClosingData(result.activationClosingTrend, startDate));
                }
                break;
            case "Years":
                dateFormat = "yyyy";
                for (; startDate <= endDate; startDate.setFullYear(startDate.getFullYear() + 1)) {
                    stats.push(self.getActivationVsClosingData(result.activationClosingTrend, startDate));
                }
                break;
        }

        var settings = {
            dataSource: {
                data: stats
            },
            seriesDefaults: {
                tooltip: {
                    visible: true,
                    template: "#= kendo.format('{0:" + dateFormat + "}', category) #, #=value#"
                },
                labels: {
                    visible: false,
                    background: "none"
                }
            },
            series: [{
                type: "line",
                field: "activations",
                categoryField: "date",
                name: self.getResource("bz-rp-sensors-stopwatches-actvsclose-name1")
            }, {
                type: "line",
                field: "closings",
                categoryField: "date",
                name: self.getResource("bz-rp-sensors-stopwatches-actvsclose-name2")
            }],
            categoryAxis: {
                baseUnit: result.range.toLowerCase() + "s",
                field: "date",
                labels: {
                    format: dateFormat,
                    padding: {
                        left: -10
                    }
                }
            }
        };

        //set labels steps
        $.extend(true, settings, self.setLabelSteps(stats.length));

        var data = self.graphics.getDataVizObject(settings);

        //Print Chart
        graphContainer.find(".bz-rp-chart").kendoChart(data);
    },

    /*
    * Get data for activation vs closings graph
    */
    getActivationVsClosingData: function (rows, date) {

        var resultDate;
        var stats = { activations: 0, closings: 0, date: new Date(date) };

        for (var i = 0, len = rows.length; i < len; i++) {

            resultDate = new Date(rows[i].date.month + "/" + rows[i].date.day + "/" + rows[i].date.year);

            if ((date.getTime() === resultDate.getTime())) {
                stats.activations = rows[i].activations;
                stats.closings = rows[i].closings;
            }
        }

        return stats;
    },

    /*
    * Render activation trend graph
    */
    paintActivationTrend: function (filter) {

        var self = this;
        var trendContainer = self.getTemplateComponent(self.content, "sensors-countersgraph");
        var dateTo = self.model.time.dateTo;
        var dateFrom = self.model.time.dateFrom;
        var tmpl = self.getTemplate("acttrend");

        //Render Template
        var graphTmpl = $.tmpl(tmpl);

        //Add graph
        trendContainer.empty().append(graphTmpl);

        $.when(self.services.getCounterTrend(filter)).pipe(function (response) {

            var startDate = new Date(dateFrom);
            var endDate = new Date(dateTo);
            var dateFormat = "";
            var stats = [];

            switch (response.scale) {
                case "DAY":
                    dateFormat = "MM/dd";
                    for (; startDate <= endDate; startDate.setDate(startDate.getDate() + 1)) {
                        stats.push(self.getDateRange(response.rows, startDate, 'activations'));
                    }
                    break;
                case "MONTH":
                    dateFormat = "MM/yy";
                    for (; startDate <= endDate; startDate.setMonth(startDate.getMonth() + 1)) {
                        stats.push(self.getDateRange(response.rows, startDate, 'activations'));
                    }
                    break;
                case "YEAR":
                    dateFormat = "yyyy";
                    for (; startDate <= endDate; startDate.setFullYear(startDate.getFullYear() + 1)) {
                        stats.push(self.getDateRange(response.rows, startDate, 'activations'));
                    }
                    break;
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
                    name: self.getResource("bz-rp-sensors-counters-countertrend-name")
                }],
                categoryAxis: {
                    baseUnit: response.scale.toLowerCase() + "s",
                    field: "date",
                    labels: {
                        format: dateFormat,
                        padding: {
                            left: -10
                        }
                    }
                }
            };

            //set labels steps
            $.extend(true, settings, self.setLabelSteps(stats.length));

            return self.graphics.getDataVizObject(settings);

        }).done(function (data) {

            //Print Chart
            trendContainer.find(".bz-rp-chart").kendoChart(data);
        });
    },

    /*
    * Paint Duration Histogram
    */
    paintDurationHistogram: function (response) {

        var self = this;
        var tmpl = self.getTemplate("durationHistogram");

        //Append template
        var graphContainer = self.getTemplateComponent(self.content, "sensors-stopwatch-durationhistogram");
        graphContainer.html($.tmpl(tmpl));

        if (response.items.length) {

            var data = self.getDurationtHistogramData(response);

            var settings = {
                dataSource: {
                    data: data.items,
                    sort: {
                        field: "days",
                        dir: "asc"
                    }
                },
                seriesDefaults: {
                    type: "area"
                },
                series: [{
                    field: "stopwatches",
                    name: self.getResource("bz-rp-sensors-stopwatches-drthistogram-name")
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

            var graphData = self.graphics.getDataVizObject(settings);

            //Print CaseStatus Chart
            graphContainer.find(".bz-rp-chart").kendoChart(graphData);
        }
    },

    /*
    * Get Duration Histogram Data
    */
    getDurationtHistogramData: function (result) {

        var expectedDuration = result.expectedDuration;
        var items = result.items;
        var length = items.length;
        var after15 = items.splice(15, length - 15);
        var linePosition = 0;

        for (var i = 0, len = after15.length; i < len; i++) {
            items[14].cases += after15[i].stopwatches;
        }

        for (var i = 0, len = items.length; i < len; i++) {

            if (items[i].days === expectedDuration) {

                linePosition = i;
                break;

            } else if (items[i].days > expectedDuration) {

                linePosition = i;
                var lineValue = (items[linePosition - 1].stopwatches + items[linePosition].stopwatches) / 2;

                items.splice(i, 0, { "stopwatches": lineValue, "days": expectedDuration });
                break;
            }
        }

        if (length >= 15) {
            items[14].days = "Next Days";
        }
        return { linePosition: linePosition, items: items };
    },

    /*
    * Get Counter filter
    */
    getCounterFilter: function () {

        var self = this;

        var filter = $.extend({}, self.counter, self.model);

        return "filters=" + JSON.stringify(filter);
    },

    /*
    * Get process object for dimensions component
    */
    getProcessObject: function () {

        var self = this;

        return { process: self.model.process };
    },

    /*
    * load dimensions for sensors
    */
    loadSensorsDimensions: function (filter) {

        var self = this;
        var canvas = self.getTemplateComponent(self.content, "filters-dimension");

        return $.when(self.services.getSensorsDimensions(filter)).pipe(function (params) {

            var dimensionsComponent = self.components.initDimensionsComponent(canvas, params, self.getProcessObject(), self.model.dimension);

            dimensionsComponent.subscribe("filterbydimension", function (ev, dimensions) {

                //Extend filter model
                self.model.dimension = dimensions;
                var modelFilter = "filters=" + JSON.stringify(self.model);

                self.drawReport(modelFilter);
            });
        });
    },

    /*
    * Render sensors by selected process
    */
    refreshProcessView: function () {

        var self = this;
        var $tabs = $("ul.ui-bizagi-wp-widget-reports-menu", self.content);

        //change view by active tab
        self.view = "process." + self.acttab;

        //remove id by overriding counter object because "delete operation" has cross-browser issues 
        self.counter.sensor = { type: self.counter.sensor.type, caseBased: self.counter.sensor.caseBased };

        //reset stopwatch
        self.stopwatch = -1;

        //show tabs
        $tabs.removeClass("bz-rp-disabled");

        //draw report
        self.drawReport();

    },

    /*
    * Render sensors by selected sensor
    */
    refreshSensorsView: function (id, type) {
        var self = this;
        var $tabs = $("ul.ui-bizagi-wp-widget-reports-menu", self.content);

        //hide tabs
        $tabs.addClass("bz-rp-disabled");

        if (type === "counter") {
            self.counter.sensor.id = id;
            //change view
            self.view = "counter";
        } else if (type === "stopwatch") {
            self.stopwatch = id;
            //change view
            self.view = "stopwatch";
        }

        //draw report
        self.drawReport();
    },

    /*
    * Get Date Range to paint the trend graphs
    */
    getDateRange: function (rows, date, field) {

        var resultDate;
        var stats = { value: 0, date: new Date(date) };

        for (var i = 0, len = rows.length; i < len; i++) {

            resultDate = new Date(rows[i].date.month + "/" + rows[i].date.day + "/" + rows[i].date.year);

            if ((date.getTime() === resultDate.getTime())) {

                stats.value = rows[i][field];
            }
        }

        return stats;
    },

    /*
    * Render Count Diagram
    */
    paintCountDiagram: function (response) {

        var self = this;
        var length = response.counters.length;
        var $component = self.getTemplateComponent(self.content, "sensors-countersgraph");
        var tmpl = self.getTemplate("countdiagram");

        //render graph canvas
        $component.html($.tmpl(tmpl));

        if (length) {

            var object = []; ;

            for (var x = 0; x < length; x = x + 1) {

                object.push({ serie: "", categoryAxis: "", id: "" });

                if (typeof (response.counters[x].percentage) !== "undefined") {
                    object[x].categoryAxis = response.counters[x].name + " (" + response.counters[x].percentage + ")";
                } else {
                    object[x].categoryAxis = response.counters[x].name;
                }
                object[x].serie = response.counters[x].instances;
                object[x].id = response.counters[x].id;
            }

            var settings = {
                dataSource: {
                    data: object
                },
                seriesDefaults: {
                    type: "column"
                },
                chartName: "Sensors.Process.CounterSummary",
                detailList: {
                    type: "counter",
                    caseBased: true
                },
                series: [{
                    field: "serie",
                    name: self.getResource("bz-rp-sensors-counters-countsdiagram-name"),
                    color: "#8bbc21"
                }],
                categoryAxis: {
                    field: "categoryAxis"
                }
            };

            var data = self.graphics.getDataVizObject(settings);

            //paint data
            $component.find(".bz-rp-chart").kendoChart(data);
        }
    },

    /*
    * Highlight selected item from process list
    */
    highlightItem: function ($element) {

        var self = this;
        $("#bz-rp-sensors-processlist .bz-rp-sensors-sltitem", self.content).removeClass('bz-rp-sensors-sltitem');
        $element.addClass("bz-rp-sensors-sltitem");
    },

    /*
    * Update model after select a process
    */
    updateModel: function (id) {

        var self = this;

        self.model.dimension = [];
        self.model.process.id = id;
    },

    /*
    * Events Handlers
    */
    eventsHandlers: function () {

        var self = this;
        var $cacheItem = $("#bz-rp-sensors-processlist div.bz-rp-sensors-sltitem", self.content).parent();

        //events for the process list
        $("#bz-rp-sensors-processlist", self.content).on('click', ".bz-rp-sensors-processlist-row", function (event) {

            var $li = $(this).parent();
            var id = $li.data('id');

            $li.find('ul').slideToggle('fast', function () {
                if ($(this).css('display') === "none") {
                    $li.find('i').removeClass('bz-rp-sensors-open');
                } else {
                    $li.find('i').addClass('bz-rp-sensors-open');
                }
            });

            self.highlightItem($(this)); //highlight item

            if ($cacheItem.data('id') !== id) {
                $cacheItem.find('ul').slideUp('fast');
                $cacheItem.find('i').removeClass('bz-rp-sensors-open');

                self.updateModel(id);
                self.refreshProcessView(); //refresh process view
                self.refreshDimensions(self.getProcessObject()); //refresh dimensions component   
                $cacheItem = $li; //save $li in cache
            } else {
                self.refreshProcessView(); //refresh process view
            }
        });

        // events to edit sensors
        $(".bz-rp-reports-sensors-header button.bz-rp-sensors-button-edit", self.content).on('click', function (event) {

            self.loadReport("sensorsedt");

        });

        //events to filter by sensor
        $("#bz-rp-sensors-processlist ul", self.content).on('click', 'li', function (event) {
            event.stopPropagation();

            var $element = $(this);

            //add class to highlight selection and remove selection for others
            self.highlightItem($element);

            self.refreshSensorsView($element.data('id'), $element.data('type'));
        });

        //events for tabs
        $("#bz-rp-sensors-processview li", self.content).on('click', function (event) {

            var $element = $(this);

            if (!$element.hasClass('active')) {

                //set sensors view and active tab
                self.acttab = $element.data('sensor');
                self.view = "process." + self.acttab;

                //render report
                self.drawReport();

                //remove all active classes and add to this li 
                $element.siblings("li").removeClass("ui-bizagi-wp-widget-reports-menu-active").end().addClass('ui-bizagi-wp-widget-reports-menu-active');

            }

        });

        $("#bz-rp-sensors-content", self.content).on('click', "#bz-rp-sensors-counters-cbcontainer li", function (event) {

            event.stopPropagation();

            var $element = $(this);
            var $target = $(event.target);
            var $radiobutton = $element.find("input[type=radio]");

            var ul = $element.closest("ul");
            ul.find("li input[type=radio]").attr("checked", false);

            $radiobutton.prop("checked", true);
            $radiobutton.attr("checked", true);

            self.counter.sensor.caseBased = ($radiobutton.data("timerange") === "crtdate") ? true : false;
            self.renderCountersData();
        });


        //event for detail list in tables
        self.bindDtlSummaryEvents();

        //event to filter for single sensor by clicking a table
        $("#bz-rp-sensors-content", self.content).on('click', '.bz-rp-sensors-summary tr > td', function (event) {

            event.stopPropagation();

            if (self.view === "process.stopwatch" || self.view === "process.counter") {
                var $li = $(this).parent();
                var id = $li.data('id');
                var type = $li.closest('table').data('type');

                self.refreshSensorsView(id, type);

                //hightlight counter
                var $sensorLi = $cacheItem.find('li[data-type=' + type + '][data-id=' + id + ']');

                //open slide
                $cacheItem.find('ul').slideDown();

                self.highlightItem($sensorLi);
            }

        });

    },

    getReportExcelUrl: function(reportName){
        var self = this;
        reportName = reportName || "";
        var params = "reportName=" + reportName + "&filters=";
        var filter = $.extend({}, self.model, { sensor: {} });

        if (self.view.indexOf("counter") !== -1) {
            var caseBased = self.counter.sensor.caseBased;
            filter.sensor = { type: "counter", caseBased: caseBased };
        }

        params += JSON.stringify(filter) + "&user=" + bizagi.currentUser.idUser;
        return self.services.getExportExcelUrl(params);
    },

    /*
    * Bind events for detail list in tables
    */
    bindDtlSummaryEvents: function () {

        var self = this;

        //Events for cycle time summary
        $("#bz-rp-sensors-content", self.content).on('click', '#bz-rp-sensors-stopwatches-cycletimesummary .bz-rp-sensors-detaillist', function (event) {

            event.stopPropagation();

            var $element = $(this),
                data = { detailList: {}, sensor: {} },
                id = $element.closest('tr').data('id'),
                type = $element.closest('table').data('type'),
                reportName = "Sensors.Stopwatch.CycleTimeSummary",
                columnName = $element.parent().data('column');

            data.detailList = (columnName) ? { columnName: columnName, reportName: reportName} : { reportName: reportName };
            data.sensor = { id: id, type: type };
            data.dtlType = "sensors";

            self.callDetailList(data);
        });

        //Events for counter summary
        $("#bz-rp-sensors-content", self.content).on('click', '#bz-rp-sensors-counters-summary .bz-rp-sensors-detaillist', function (event) {

            event.stopPropagation();

            var $element = $(this),
                id = $element.closest('tr').data('id'),
                type = $element.closest('table').data('type'),
                reportName = "Sensors.Process.CounterSummary";

            self.callDetailList({
                dtlType: "sensors",
                sensor: {
                    id: id,
                    type: "counter",
                    caseBased: true
                },
                detailList: {
                    reportName: reportName
                }
            });

        });

        //Events for level of service summary
        $("#bz-rp-sensors-content", self.content).on('click', '#bz-rp-sensors-stopwatches-levelofservice .bz-rp-sensors-detaillist', function (event) {

            event.stopPropagation();

            var $element = $(this),
                id = $element.closest('tr').data('id'),
                type = $element.closest('table').data('type'),
                reportName = "Sensors.Stopwatch.CycleTimeSummary",
                dayCount = $element.parent().data('daycount');

            self.callDetailList({
                dtlType: "sensors",
                sensor: {
                    id: id,
                    type: type
                },
                detailList: {
                    reportName: reportName,
                    dayCount: dayCount
                }
            });

        });

    },

    /*
    * Set columns size
    */
    setColumnsSize: function () {

        var self = this;

        self.setColumnsWidth();
    },

    /*
    *   This method overrides the refresh from the base
    */
    refresh: function () {
        var self = this;

        // Cancel timeout if exists
        if (self.refreshTimeout) clearTimeout(self.refreshTimeout);

        // Create a new timeout
        self.refreshTimeout = setTimeout(function () {
            delete self.refreshTimeout;

            self.setColumnsSize();
            self.updateTables();

            $(".bz-rp-chart").each(function () {
                var $chart = $(this).data("kendoChart");

                if ($chart) {
                    $chart.redraw();
                }
            });

        }, 150);
    },

    /*
    * append tooltip
    */
    appendTooltip: function () {

        var self = this;

        $("#bz-rp-sensors-processview", self.content).tooltip({
            items: ".bz-rp-summary-title-icon",
            tooltipClass: "biz-rp-tooltip"
        });
    }
});