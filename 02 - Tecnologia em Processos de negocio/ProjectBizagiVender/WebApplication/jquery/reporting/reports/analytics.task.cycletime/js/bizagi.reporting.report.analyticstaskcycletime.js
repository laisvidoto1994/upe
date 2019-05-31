/*
 * @title : BizAgi Report for Analytics - Process - Frequents Paths Report
 * @author : David Romero
 * @date   : 18/11/2013
 * Comments:
 *     This script draws a specific report for Analytics - Process - Frequents Paths
 *
 */

bizagi.reporting.report.analyticsprocessfrequentspaths.extend("bizagi.reporting.report.analyticstaskcycletime", {}, {

    /*
     *   Constructor
     */
    init: function (params) {
        this._super(params);
        this.tasks = [];
    },

    /*
     *   Load all needed templates
     */
    initializeTemplates: function () {

        // Define mapping
        return {
            "main": (bizagi.getTemplate("bizagi.reporting.report.analyticstaskcycletime") + "#bz-rp-analytics-task-cycletime-main"),
            "header": (bizagi.getTemplate("bizagi.reporting.report.analyticstaskcycletime") + "#bz-rp-analytics-task-cycletime-cases"),
            "tooltip": (bizagi.getTemplate("bizagi.reporting.report.analyticstaskcycletime") + "#bz-rp-analytics-task-cycletime-tooltip")
        };
    },

    /*
     * Get JSON for detail list
     */
    getDetailListObject: function (ui) {

        var self = this,
            reportName, columnIndex,
            object = {};

        if (ui.tooltip) {
            reportName = "Analytics.Task.Tasks";
            object = {
                detailList: {
                    reportName: reportName,
                    task: ui.guid,
                    columnName: ui.type
                }
            };
        } else {
            reportName = "Analytics.Process.FrequentPaths";
            columnIndex = self.frequentsPaths[self.path].pathIndex;
            object = {
                detailList: {
                    reportName: reportName,
                    columnIndex: columnIndex
                }
            };
        }

        //return JSON
        return object;
    },

    /*
     * Draw report
     */
    drawReport: function (filter) {

        var self = this;

        self.setFiltersForCustomRPComp();

        $.when(self.services.getTaskCycleTime(filter), self.services.getFrecuentsPaths(filter)).done(function (tasks, frequentsPaths) {

            self.frequentsPaths = frequentsPaths[0].paths;
            self.tasks = tasks[0].tasks;

            self.renderHeader();
            self.drawProcessModel();

            self.drawProcessBreadcrumb();
        });
    },

    /*
     *
     */
    drawProcessBreadcrumb: function () {
        var self = this,
            $breadcrubmpContainer = $(".bz-rp-processbreadcrumb-container", self.content);

        //Empty breadcrumb containEr
        $breadcrubmpContainer.empty();

        if (self.model.taskPathArray && self.model.taskPathArray.length > 1) {
            var breadcrumbTmpl = self.getTemplate("process-breadcrumb"),
                breadcrumbContent;

            // Render Form
            $.tmpl(breadcrumbTmpl, {
                taskData: self.model.taskPathArray
            }).appendTo($breadcrubmpContainer);

            self.addBreadCrumbHandlers();
        }
    },

    /*
     * Get the tooltip data by guid id
     */
    getTooltipContent: function (hotspot) {

        var self = this,
            guid = hotspot.id,
            tooltipTmpl = self.getTemplate("tooltip");

        //Get the task data filtering  the result array by guid
        var dta = self.tasks.filter(function (obj) {
            return obj.guid == guid;
        });

        //Get hotspot class
        if ($(hotspot).hasClass('usertask') ||
            $(hotspot).hasClass('abstracttask') ||
            $(hotspot).hasClass('manualtask') ||
            $(hotspot).hasClass('nonetask') ||
            $(hotspot).hasClass('subprocess')) {

            dta[0].showAll = true;
        }

        //return rendered tmpl
        return $.tmpl(tooltipTmpl, dta[0]);
    },

    /*
     * Events Handlers
     */
    eventsHandlers: function () {

        var self = this,
            $viewerCanvas = $(".bz-rp-processviewer-canvas", self.content);

        self.applyViewerTooltip($viewerCanvas, {});

        // bind event for detail list
        self.bindDtlEvent();

        $(".bz-rp-processviewer", self.content).on("click", ".bz-rp-analytics-task-cycletime-frequentspaths-showcontrol", function (event) {

            var $frequentsPaths = $(this).siblings(".bz-rp-analytics-task-cycletime-frecuentspaths-cases");
            var $checkbox = $(this).find("input[type=checkbox]");

            if (!$(event.target).is('input[type=checkbox]')) {
                ($checkbox.prop('checked')) ? $checkbox.prop('checked', false): $checkbox.prop('checked', true);
            }

            $frequentsPaths.slideToggle('fast', function () {
                //enable or disable frequents paths
                ($(this).css('display') == 'none') ? $viewerCanvas.processviewer('clearRoute'): self.drawFrequentsPaths();
            });

        });

        $(".bz-rp-processviewer", self.content).on('click', '.bz-rp-taskcycletime-detaillist', function (event) {

            self.callDetailList({});
        });

        $(".bz-rp-processviewer", self.content).on('pvComplete', function (obj) {

            $(".abstracttask, .usertask, .nonetask, .manualtask, .subprocess, .scripttask").addClass("bz-rp-process-viewer-activate");

        });
    },

    /*
     *
     */
    addBreadCrumbHandlers: function () {
        var self = this,
            $breadcrubmpContainer = $(".bz-rp-processbreadcrumb-container", self.content);

        $('a', $breadcrubmpContainer).click(function (event) {
            event.preventDefault();

            var taskid = $(event.currentTarget).data('taskid'),
                taskName = event.currentTarget.text;

            //Checks if there is any '>' in the text
            if (taskName.indexOf(' > ') == 0)
                taskName = taskName.substring(3, taskName.length);

            //Refresh the info about the current selected element
            self.model.process = {
                id: taskid,
                name: taskName
            };

            self.refreshBreadCrumb();

            self.components.processversion.publish("filterbyprocessversion", {
                process: self.model.process
            });
        });
    },

    /*
     *
     */
    refreshBreadCrumb: function () {
        var self = this,
            i,
            index;

        if (self.model.taskPathArray) {
            i = self.model.taskPathArray.length;

            while (i-- > 0) {
                if (parseInt(self.model.process.id) == parseInt(self.model.taskPathArray[i].id))
                    index = i;
            }

            if (index == 0)
                self.model.taskPathArray = [].concat(self.model.taskPathArray[0]);
            else
                self.model.taskPathArray.splice(index + 1, self.model.taskPathArray.length);
        }
    }
});