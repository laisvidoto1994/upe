/*
 *   Name: BizAgi Report for BAM - Process - Work in Progress
 *   Author: David Romero
 *   Comments:
 *   -   This script draws a specific report for BAM - Task - Load Analysis
 */

bizagi.reporting.report.extend("bizagi.reporting.report.bamtaskloadanalysis", {}, {

    /*
     * Initialize report
     */
    init: function (params) {

        this._super(params);
        this.manualTasks = [];
    },

    /*
     * Get filters object
     */
    getFiltersObject: function () {
        return {
            process: {},
            dimension: []
        };
    },

    /*
     *   Initialize all needed templates
     */
    initializeTemplates: function () {
        return {
            "main": (bizagi.getTemplate("bizagi.reporting.report.bamtaskloadanalysis") + "#bz-rp-bam-task-loadanalysis-main"),
            "manualtasks": (bizagi.getTemplate("bizagi.reporting.report.bamtaskloadanalysis") + "#bz-rp-bam-task-loadanalysis-manualtasks"),
            "tooltip": (bizagi.getTemplate("bizagi.reporting.report.bamtaskloadanalysis") + "#bz-rp-bam-task-loadanalysis-tooltip"),
            "process-breadcrumb": (bizagi.getTemplate("bizagi.reporting.report.bamtaskloadanalysis") + "#bz-rp-process-breadcrumb")
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
        self.eventHandlers();
    },

    /*
     * Get JSON for detail list
     */
    getDetailListObject: function (ui) {

        var self = this;

        //return JSON
        return {
            detailList: {
                reportName: "BAM.Task.LoadAnalysis",
                columnName: ui.type,
                task: ui.guid
            }
        };
    },

    /*
     * Redraw Graphics
     */
    drawReport: function (filter) {

        var self = this;

        self.setFiltersForCustomRPComp();
        $.when(self.services.getTaskLoadAnalysis(filter)).done(function (result) {
            self.manualTasks = result;
            self.drawProcessModel();
            self.drawProcessBreadcrumb();
        });
    },

    /*
     * Implement the plugin process viewer
     */
    drawProcessModel: function () {

        var self = this,
            $viewerCanvas = $(".bz-rp-processviewer-canvas", self.content);

        self.renderProcessViewer($viewerCanvas);
    },

    /*
     *   This methods queries the server for the data, and repaint the cases going overdue chart
     */
    drawManualTask: function () {

        var self = this,
            $manualTasks = $(".bz-rp-bam-task-loadanalysis-manualtasks", self.content),
            manualTasksTemplate = self.getTemplate("manualtasks"),
            manualTaskContent = $.tmpl(manualTasksTemplate, self.manualTasks);

        $manualTasks.empty().append(manualTaskContent);
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

            if(index == 0)
                self.model.taskPathArray = [].concat(self.model.taskPathArray[0]);
            else
                self.model.taskPathArray.splice(index + 1, self.model.taskPathArray.length);                
        }
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
                taskName = event.currentTarget.text,
                modelFilter = 'filters={"process":{id:' + taskid + '},"dimension":[]}';

            //Checks if there is any '>' in the text
            if (taskName.indexOf(' > ') == 0)
                taskName = taskName.substring(3, taskName.length);

            //Refresh the info about the current selected element
            self.model.process = {
                id: taskid,
                name: taskName
            };

            self.refreshBreadCrumb();

            self.components.dimension.publish("filterbydimension", []);
        });
    },



    /*
     * Get the tooltip data by guid id
     */
    getTooltipContent: function (hotspot) {

        var self = this,
            guid = hotspot.id,
            tooltipTmpl = self.getTemplate("tooltip");

        //Get the task data filtering  the result array by guid
        var dta = self.manualTasks.rows.filter(function (obj) {
            return obj.guid == guid;
        });

        //return rendered tmpl
        return $.tmpl(tooltipTmpl, dta[0]);

    },

    /*
     * Events Handlers
     */
    eventHandlers: function () {

        var self = this,
            $viewerCanvas = $(".bz-rp-processviewer-canvas", self.content),
            $manualTasks = $(".bz-rp-bam-task-loadanalysis-manualtasks", self.content);

        self.applyViewerTooltip($viewerCanvas, {
            items: ".usertask, .abstracttask, .manualtask, .nonetask, .subprocess"
        });

        // bind event for detail list
        self.bindDtlEvent();
        self.bindToggleSummary();

        $manualTasks.on('click', '.bz-rp-bam-task-loadanalysis-manualtasks-rows', function (event) {

            var $element = $(this);
            var guid = $element.data("guid");

            $element.siblings().removeClass(".bz-rp-summary-highlight");
            $element.addClass(".bz-rp-summary-highlight");
            self.viewerPlugin.processviewer('unSelectAllShapes');
            self.viewerPlugin.processviewer('selectShape', guid);

        });

        $viewerCanvas.on('pvComplete', function (obj) {
            self.drawManualTask();

            $(".abstracttask, .usertask, .manualtask, .nonetask, .subprocess").addClass("bz-rp-process-viewer-activate");

        });

    }
});