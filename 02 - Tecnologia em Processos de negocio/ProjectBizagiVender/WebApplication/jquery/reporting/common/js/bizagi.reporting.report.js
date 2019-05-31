/*
 *   Name: BizAgi Reporting base class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script defines the base class for all reports
 */

bizagi.reporting.observer.extend("bizagi.reporting.report", {}, {
    /* 
     *   Constructor
     */
    init: function (params) {

        // call base
        this._super();

        this.templates = {};
        this.content = "";
        this.jCMP = params.components;
        this.canvas = params.canvas;
        this.info = params.info;
        this.services = params.dataService;
        this.components = new bizagi.reporting.helper.components(this.services);
        this.graphics = new bizagi.reporting.helper.graphics(this);

        // set device
        this.device = bizagi.util.detectDevice();

        // Set filter object
        this.model = (!$.isEmptyObject(params.filters)) ? params.filters : this.getFiltersObject();

        // Set l10n service 
        this.resources = bizagi.localization;
    },

    /*
     *  Get filters object
     */
    getFiltersObject: function () {
        return {};
    },

    /*
     *   Helper to load templates
     */
    loadTemplate: function (name, path) {
        var self = this;
        var defer = new $.Deferred();
        if (self.templates[name]) {
            defer.resolve();
        } else {
            return bizagi.templateService.getTemplate(path)
                .done(function (tmpl) {
                    self.templates[name] = tmpl;
                });
        }
        return defer.promise();
    },

    /*
     *   Load Process Component
     */
    loadProcessesComponent: function () {

        var self = this,
            canvas = self.getTemplateComponent(self.content, "filters-process");

        return $.when(self.services.getProcessList()).pipe(function (params) {

            var processesComponent = self.components.initProcessesComponent(canvas, params, self.model.process);

            //Extend filter model
            $.extend(self.model, processesComponent.process);

            //Reset the process breadcrumb
            self.publish('initProcessBreadcrumb');

            processesComponent.subscribe("initProcessBreadcrumb", function (ev, process) {
                self.publish('initProcessBreadcrumb');
            });

            processesComponent.subscribe("filterbyprocess", function (ev, process) {

                //Extend filter model
                $.extend(self.model, process);

                //refresh dimensions
                self.refreshDimensions(process);

                self.excecuteFilterChange();
            });

            self.subscribe('initProcessBreadcrumb', function () {
                self.model.taskPathArray = [];
            });

            return processesComponent.pstDeferred;
        });
    },

    /*
     * Load Process Component
     */
    loadTimeComponent: function () {

        var self = this,
            canvas = self.getTemplateComponent(self.content, "filters-time"),
            dateFormat = self.getResource("dateFormat");

        var timeComponent = self.components.initTimeComponent(canvas, {
            dateFormat: dateFormat,
            time: self.model.time
        });

        //Extend filter model
        $.extend(self.model, timeComponent.getValue());

        timeComponent.subscribe("filterbytime", function (ev, dateObj) {

            //Extend filter model
            $.extend(self.model, dateObj);

            self.excecuteFilterChange();
        });

        return timeComponent.pstDeferred;
    },

    /*
     * Prepare object and call service for detail list
     */
    callDetailList: function (ui) {

        var self = this,
            json = self.getDetailListObject(ui);

        if (json) {

            var model = self.prepareExcelFilter(),
                filter = "filters=" + JSON.stringify($.extend({}, model, json)),
                process = json.process || model.process;

            self.components.renderDetailList(filter, process.id);
        }
    },

    /*
     * Load Process Version Component
     */
    loadProcessesVersionComponent: function () {

        var self = this,
            canvas = self.getTemplateComponent(self.content, "filters-processversion");

        return $.when(self.services.getProcessVersionList()).pipe(function (params) {

            var processesComponent = self.components.initProcessesVersionComponent(canvas, params, (self.model.process.id ? self.model.process : {}));

            //Extend filters model
            $.extend(self.model, processesComponent.process);

            //Reset the process breadcrumb
            self.publish('initProcessBreadcrumb');

            processesComponent.subscribe("initProcessBreadcrumb", function (ev, process) {
                self.publish('initProcessBreadcrumb');
            });

            processesComponent.subscribe("filterbyprocessversion", function (ev, process) {

                //Extend filter model
                $.extend(self.model, process);

                //refresh dimensions
                self.refreshDimensions(process);

                self.excecuteFilterChange();
            });

            return processesComponent.pstDeferred;
        });
    },

    /*
     * Load Custom Reports Component
     */
    loadCustomReportsComponent: function () {

        var self = this,
            canvas = self.getTemplateComponent(self.content, "customreports");

        //initialize custom reports component
        self.components.initCustomReportsComponent(canvas, self.info, self.model);
    },

    /*
     * Load Detail List Component
     */
    loadDetailListComponent: function () {

        var self = this,
            canvas = self.getTemplateComponent(self.content, "detaillist"),
            detaillist = self.components.initDetailListComponent(canvas);

        detaillist.subscribe("rp-graphicquery", function (event, data) {
            self.publish("graphicquery", data);
        });

        detaillist.subscribe("rp-caseadministration", function (event, data) {
            self.publish("caseadministration", data);
        });

        detaillist.subscribe("rp-opencase", function (event, data) {
            self.publish("opencase", data);
        });
    },

    /*
     * Refresh dimensions
     */
    refreshDimensions: function (process) {

        var self = this;

        if (!$.isEmptyObject(self.components.dimension)) {
            self.model.dimension = [];
            self.components.dimension.refresh(process);
        }
    },

    /*
     *   Load Dimensions Component
     */
    loadDimensionsComponent: function (process, dmsService) {

        var self = this,
            canvas = self.getTemplateComponent(self.content, "filters-dimension");

        dmsService = dmsService || "getDimensionsList";

        var dimensionsComponent = self.components.initDimensionsComponent(canvas, {
            srvActions: {
                dimensionsList: dmsService
            },
            process: process,
            dftDimensions: self.model.dimension
        });

        //Extend filter model
        //$.extend(self.model, dimensionsComponent.process);

        //Reset the process breadcrumb
        self.publish('initProcessBreadcrumb');

        dimensionsComponent.subscribe("initProcessBreadcrumb", function (ev, process) {
            self.publish('initProcessBreadcrumb');
        });

        dimensionsComponent.subscribe("filterbydimension", function (ev, dimensions) {

            //Extend filter model
            $.extend(self.model, process);

            //Extend filter model
            self.model.dimension = dimensions;

            self.excecuteFilterChange();

        });

        self.subscribe('initProcessBreadcrumb', function () {
            self.model.taskPathArray = [];
        });

        return dimensionsComponent.pstDeferred;
    },

    /*
     *   Helper to dinamically load a map of templates
     */
    loadTemplates: function (templateMap) {
        var self = this,
            defer = new $.Deferred(),
            arrPromises = [];

        $.each(templateMap, function (key, template) {
            var promise = self.loadTemplate(key, template);
            arrPromises.push(promise);
        });

        $.when.apply($, arrPromises).done(function () {
            defer.resolve();
        });

        return defer.promise();
    },

    /*
     * Excecute filter change
     */
    excecuteFilterChange: function () {

        var self = this,
            modelFilter = "filters=" + JSON.stringify(self.model);

        self.publish("filterChange", self.model);

        self.drawReport(modelFilter);
    },

    /*
     *   Helper to return a loaded template
     */
    getTemplate: function (name) {
        if (this.templates[name])
            return this.templates[name];
        else
            return null;
    },

    /* 
     *   Returns the mapped resource
     */
    getResource: function (key) {
        return this.resources.getResource(key);
    },

    /*
     *   Get the current rendering element
     */
    getElement: function () {
        return this.element;
    },

    /*
     *   Get the current report content
     */
    getContent: function () {
        return this.content;
    },

    /*
     *   Initialize all base template
     */
    initCommonTemplates: function () {
        return {
            "component": (bizagi.getTemplate("bizagi.reporting.component") + "#bz-rp-component-main"),
            "base-report-frame": (bizagi.getTemplate("bizagi.reporting.report") + "#bz-rp-frame"),
            "report-detaillist": (bizagi.getTemplate("bizagi.reporting.report") + "#bz-rp-detaillist"),
            "processviewer-nodata": (bizagi.getTemplate("bizagi.reporting.component") + "#bz-rp-processviewer-nodata"),
            "process-breadcrumb": (bizagi.getTemplate("bizagi.reporting.report.bamtaskloadanalysis") + "#bz-rp-process-breadcrumb")
        };
    },

    /*
     *   This method renders a report
     */
    render: function () {
        var self = this,
            templatesToInitialize = self.initializeTemplates ? self.initializeTemplates() : {};

        //extend with common templates
        $.extend(templatesToInitialize, self.initCommonTemplates());

        // Initialize all templates and render content
        return self.loadTemplates(templatesToInitialize)
            .pipe(function () {
                return self.internalRender();
            });
    },

    /*
     *   Internal render method, renders the base frame for all reports
     */
    internalRender: function () {
        var self = this,
            baseTemplate = self.getTemplate("base-report-frame"),
            reportFrame = $.tmpl(baseTemplate);

        // Render report
        return $.when(self.renderContent())
            .pipe(function (reportContent) {
                self.content = reportContent;

                // Replace component
                self.getReportContainer(reportFrame).append(reportContent);

                // Assign element property
                self.element = reportFrame;

                return self.element;
            });
    },

    /*
     *   Render content
     */
    renderContent: function () {

        var self = this,
            mainTemplate = self.getTemplate("main");

        // Render main template
        self.content = $.tmpl(mainTemplate);
        self.content.appendTo("#canvas");

        return $.when(self.loadComponents()).pipe(function () {

            var filter = "filters=" + JSON.stringify(self.model);

            //draw report
            self.drawReport(filter);

            return self.content;
        });
    },

    /*
     *  Render components
     */
    loadComponents: function () {

        var self = this,
            componentTmpl = self.getTemplate("component");

        //Render component template
        var componentCnt = $.tmpl(componentTmpl, {
            components: self.jCMP
        });
        self.content.prepend(componentCnt);

        //load custom reports
        self.loadCustomReportsComponent();

        //Listen data list event
        self.loadDetailListComponent();
    },

    /*
     *   After render content apply post render
     */
    postRender: function () {

    },

    /*
     *   Refresh the report, handles a timer to avoid multiple refreshes in a short time span
     */
    refresh: function () {
        var self = this;

        // Cancel timeout if exists
        if (self.refreshTimeout) {
            clearTimeout(self.refreshTimeout);
        }

        // Create a new timeout
        self.refreshTimeout = setTimeout(function () {
            delete self.refreshTimeout;

            $(".bz-rp-chart", self.canvas).each(function () {
                var kendoChart = $(this).data("kendoChart");

                if (kendoChart) {
                    kendoChart.refresh();
                }
            });

        }, 150);
    },

    /*
     *   Helper method to retrieve the internal template component
     */
    getReportContainer: function (element) {
        var self = this;
        if (!self.reportContainer) {
            var foundComponent = self.getTemplateComponent(element, "report");
            if (foundComponent != null && foundComponent.length > 0) {
                self.reportContainer = foundComponent;
            }
        }
        return self.reportContainer;
    },

    /*
     * Gets the component
     */
    getTemplateComponent: function (element, component) {

        if (element.data("bizagi-component") == component) return element;
        var foundComponent = $("[data-bizagi-component=" + component + "]", element);
        return foundComponent;
    },

    /*
     * Render process viewer
     */
    renderProcessViewer: function ($viewerCanvas) {

        var self = this;

        if (self.model.process.hasOwnProperty("id")) {

            var filter = "processId=" + self.model.process.id;

            if (self.viewerPlugin) {
                self.viewerPlugin.processviewer('destroy');
            }

            $.when(self.services.processDefinition(filter), self.services.graphicInfo(filter)).done(function (dfn, info) {

                //Initilize plugin process viewer
                self.viewerPlugin = $viewerCanvas.processviewer({
                    height: 400,
                    width: '100%',
                    jsonBizagi: {
                        processDefinition: dfn[0],
                        processGraphicsInfo: info[0]
                    },
                    zoomRange: 5
                });

            }).fail(function () {

                self.renderPVNoData($viewerCanvas);
            });

        } else {
            self.renderPVNoData($viewerCanvas);
        }

    },

    /*
     * Render no data message when processviewer doesn't load
     */
    renderPVNoData: function ($viewerCanvas) {

        var self = this,
            tmpl = self.getTemplate("processviewer-nodata");

        $viewerCanvas.html($.tmpl(tmpl));
    },

    /*
    * Set filters for custom report component
    */
    setFiltersForCustomRPComp: function () {

        var self = this;
        var customrp = self.components.customrp;

        if (!$.isEmptyObject(customrp)) {
            customrp.setReportsFilters(self.model);
        }
    },

    /*
     * Render tooltip for process viewer
     */
    applyViewerTooltip: function ($viewerCanvas, options) {

        var self = this;

        $viewerCanvas.tooltip({
            items: (typeof (options.items) !== "undefined") ? options.items : ".processviewer-hotspot",
            disabled: (typeof (options.disabled) !== "undefined") ? options.disabled : false,
            content: function () {
                return self.getTooltipContent(this);
            },
            hide: {
                delay: 250,
                duration: 120
            },
            tooltipClass: "biz-rp-tooltip",
            close: function (event, ui) {
                ui.tooltip.hover(
                    function () {
                        $(this).stop(true).fadeTo(120, 1);
                    },
                    function () {
                        $(this).fadeOut(120, function () {
                            $(this).remove();
                        });
                    }
                );
            }
        });
    },

    updateBreadcrumbData: function (processData) {
        var self = this,
            data;

        if (!self.model.taskPathArray)
            self.model.taskPathArray = [];

        data = self.model.taskPathArray.filter(function (obj) {
            return obj.id == processData.id;
        });

        if (!data.length > 0) {
            self.model.taskPathArray.push({
                taskName: processData.name,
                id: processData.id
            });
        }
    },

    /*
     * Bind detail list event
     */
    bindDtlEvent: function () {

        var self = this;

        $(document).off('click.bz-rp-detaillist').on('click.bz-rp-detaillist', '.bz-rp-processviewer-tooltip .bz-rp-icon-detail-list', function (event) {

            var $element = $(this),
                type = $element.parent().data("type"), //Gets the element clicked, and his current associated type (ontime, norisk,overdue)
                guid = $element.closest(".bz-rp-processviewer-tooltip").data("guid");

            //remove tooltip
            $element.closest('.ui-tooltip').remove();

            if (type == "load_subprocess") {

                var subprocessID = $element.parent().data("subprocessid"),
                    subprocessName = $element.parent().find('.bz-rp-processviewer-breadcrump-item').text(),
                    modelFilter;

                //Creates the custom filter
                var resultFilter = {process : {id:subprocessID}};
                
                if(self.model){
                    self.model.dimension ? resultFilter.dimension = [].concat(self.model.dimension) : resultFilter.dimension = [];
                
                    if(self.model.time)
                        resultFilter.time = $.extend({}, self.model.time);
                }

                modelFilter = 'filters=' + JSON.stringify(resultFilter);

                //Get the selected element data
                self.updateBreadcrumbData(self.model.process);

                //updates the current subprocess that is going to be loaded
                self.model.process = {
                    id: subprocessID,
                    name: subprocessName
                };

                //Set the current element
                self.updateBreadcrumbData(self.model.process);

                self.publish("filterChange", self.model);
                self.drawReport(modelFilter);

            } else {
                self.callDetailList({
                    type: type,
                    guid: guid,
                    tooltip: true
                });
            }
        });
    },

    /*
     * Set columns width
     */
    setColumnsWidth: function () {

        var self = this,
            winWidth = $(window).width(),
            columns = $(".columns", self.content).removeClass();

        if (winWidth >= 1024) {
            $(columns[0]).addClass("medium-3 columns");
            $(columns[1]).addClass("medium-9 columns");
        } else {
            $(columns[0]).addClass("medium-4 columns");
            $(columns[1]).addClass("medium-8 columns");
        }
    },

    /*
     * Load new Report
     */
    loadReport: function (report) {

        var self = this,
            reporting = new bizagi.reporting.facade({
                proxyPrefix: (typeof (bizagi.proxyPrefix) !== "undefined") ? bizagi.proxyPrefix : ""
            });

        $(".bz-rp-reports-wrapper", self.canvas).remove();

        $.when(reporting.render({
            canvas: self.canvas,
            report: report,
            info: self.info,
            components: self.jCMP
        })).done(function (report) {
            report.bindWindowResize();
        });

    },

    /*
     * Bind windows resize event
     */
    bindWindowResize: function () {

        var self = this;

        $(window).off('resize.processviewer');

        if (self.device === "tablet" || self.device === "tablet_ios" || self.device === "tablet_android") {
            $(window).off('orientationchange.report').on('orientationchange.report', function (event) {

                event.preventDefault();
                // Append to container
                self.refresh();
            });
        } else if (self.device === "desktop") {
            $(window).off('resize.report').on('resize.report', function (event) {

                event.preventDefault();
                // Append to container
                self.refresh();
            });
        }
    },

    /*
     * Event for exporting to excel
     */
    bindExportToExcel: function (namespace) {

        var self = this;

        $(self.content).on("click", ".bz-rp-export-excel", function (event) {

            event.stopPropagation();

            var filter = "reportName=" + namespace + "&filters=" + JSON.stringify(self.prepareExcelFilter()) + "&user=" + bizagi.currentUser.idUser;

            //call service
            self.services.exportToExcel(filter);

        });

    },

    /*
     * Prepare filters for exporting to excel
     */
    prepareExcelFilter: function () {

        var self = this,
            model = $.extend({}, self.model);

        if (model.dimension) {

            for (var i = 0, leny = model.dimension.length; i < leny; i++) {

                var dimension = model.dimension[i];
                delete dimension.name;

                for (var x = 0, lenx = dimension.values.length; x < lenx; x++) {
                    var value = dimension.values[x];
                }
            }
        }

        return model;
    },

    /*
     * Event for toggle summary table
     */
    bindToggleSummary: function () {

        var self = this;

        $(self.content).on("click", ".bz-rp-toggle-summary", function (event) {

            event.stopPropagation();

            $(this).closest(".bz-rp-summary").find("tbody").toggle();

        });

    },

    /*
     * Calculate graph container height by number of elements
     */
    calculateGraphHeight: function (length) {

        return (length < 3) ? {} : {
            chartArea: {
                height: length * 115
            }
        };
    },

    /*
     * Calculate label steps for charts
     */
    setLabelSteps: function (length) {

        var step = 1;

        if (length > 6 && length < 12) {
            step = 2;
        } else if (length >= 12 && length <= 19) {
            step = 3;
        } else if (length >= 20) {
            step = 5;
        }

        return {
            categoryAxis: {
                labels: {
                    step: step
                }
            }
        };
    }
});