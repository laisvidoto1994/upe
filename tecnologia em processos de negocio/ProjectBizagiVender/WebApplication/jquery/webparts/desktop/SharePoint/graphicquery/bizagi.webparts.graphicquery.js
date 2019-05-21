
/*
*   Name: BizAgi Workportal CaseSummary Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.graphicquery", {}, {
    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        this.subprocesses = [];
        this.currentTasks = [];
        this.path = [];
        this.callStack = [];
        this.currentWorkflow = {
            idCase: initialParams.idCase,
            idWorkflow: initialParams.idWorkflow
        };
        
        // Call base
        this._super(workportalFacade, dataService, initialParams);
    },
    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;
        
        var template = self.getTemplate("graphicquery");
        var content = self.content = $.tmpl(template);
        return content;
    },
    /*
    *   Customize the web part in each device
    */
    postRender: function(params) {

        var self = this;
        //get Containers

        if (!!!parseInt(params.idWorkflow)) {
            $.when(self.dataService.getCustomizedColumnsData({
                radNumber: params.caseNumber || params.idCase
            })).done(function (data) {
                if (typeof (data.cases.rows[0]) == "undefined") {
                    alert("Invalid idWorkflow");
                } else {
                    params.idWorkflow = data.cases.rows[0].idWorkFlow;
                    self.loadGraphicComponents(params);
                }
            });
        } else {
            self.loadGraphicComponents(params);
        } 
    },
    loadGraphicComponents: function (params) {
        var self = this;
        self.headerContainer = $(".bz-gq-header", self.content);
        self.actionBarContainer = $("#bz-gq-actionbar-container", self.headerContainer);
        self.pvCanvasContainer = $("#bz-gq-processviewer-canvas", self.content);
        self.summaryContainer = $("#bz-gq-summary-container", self.headerContainer);

        //render process viewer
        self.renderProcessViewer(params);

        self.eventsHandler();

        self.endWaiting();
    },

    renderProcessViewer: function (params) {
        var self = this;
        //solo se tiene el caseId
        var processFilter = "processId=" + params.idWorkflow;
        var queryFilter = "idCase=" + params.idCase + "&idWorkflow=" + params.idWorkflow;
        
        $.when(self.dataService.processDefinition(processFilter),
            self.dataService.graphicInfo(processFilter),
            self.dataService.getGraphicQueryInfo(queryFilter)).done(function(dfn, info, gq) {
                //extend current workflow params
                $.extend(self.currentWorkflow, {
                    idProcess: gq[0].idProcess,
                    nameProcess: gq[0].nameProcess,
                    radicationNumber: gq[0].currentCase.radicationNumber
                });

                //Render Headers
                self.renderHeader(gq[0]);

                self.pathWorkItems = gq[0].pathWorkItems;

                //Initilize plugin process viewer
                self.pvCanvasContainer.processviewer({
                    height: self.getPVHeight(),
                    overflow:"scroll",
                    jsonBizagi: {
                        processDefinition: dfn[0],
                        processGraphicsInfo: info[0]
                    },
                    zoomRange: 5
                });
                
               
                
            });
    },
    
        /*
    *   Render case info and controls
    */
    renderHeader: function (summaryData) {

        var self = this;
        var csLen = self.callStack.length;

        if (csLen) {
            summaryData.parentCase = summaryData.parentCase || {};
            $.extend(summaryData.parentCase, self.callStack[csLen - 1]);
        }

        self.renderActionBar(summaryData.parentCase);
        self.renderSummary(summaryData);
    },

    /*
    * Render action bar
    */
    renderActionBar: function (parentCase) {

        var self = this;
        var tmpl = self.getTemplate("graphicquery-actionbar");
        self.actionBarContainer.html($.tmpl(tmpl, { parentCase: parentCase }));
    },

    /*
    * Render summary
    */
    renderSummary: function (summaryData) {
        var self = this;
        var summary = self.getTemplate("graphicquery-summary");

        // Render case summary
        var content = $.tmpl(summary, summaryData);
        bizagi.util.formatInvariantDate(content, self.dateFormat);
        self.summaryContainer.html(content);

        // Render parent process summary
        if (summaryData.parentCase) {
            var psummary = self.getTemplate("graphicquery-parentsummary");
            self.summaryContainer.append($.tmpl(psummary, summaryData.parentCase));
        }
    },

    /*
    * Highlight task
    */
    toggleHighlight: function () {

        var self = this;
        var guids = [];

        for (var i = 0, length = self.currentTasks.length; i < length; i++) {
            guids.push(self.currentTasks[i].guidTask);
        }

        if (!self.highlighted) {
            self.highlighted = true;
            self.pvCanvasContainer.processviewer('selectShape', guids, self.currentTasks);
        } else {
            self.highlighted = false;
            self.pvCanvasContainer.processviewer('unSelectShape', guids, self.currentTasks);
        }

    },

    /*
    * Events Handler
    */
    eventsHandler: function () {

        var self = this;

        //bind tooltip event for process viewer
        self.applyViewerTooltip();

        self.actionBarContainer.on("click", "#bz-gq-button-parent, #bz-gq-button-path, #bz-gq-button-status", function (event) {

            if (this.id === "bz-gq-button-status") {
                self.toggleHighlight();
            } else if (this.id === "bz-gq-button-parent") {

                var idCase, idWorkitem;

                if (self.callStack.length) {

                    var data = self.callStack.pop();
                    var idWorkflow = data.idWorkflow;
                    var idCase = data.idCase;

                } else {
                    idCase = $(this).data('idcase');
                    idWorkflow = $(this).data('idworkflow');
                }

                self.refreshContent({ idWorkflow: idWorkflow, idCase: idCase });

            } else if (this.id === "bz-gq-button-path") {
                $("i", this).toggleClass("bz-gq-icon-path-stop");
                self.drawCasePath();
            }

        });

        self.pvCanvasContainer.on("animationComplete", function (event) {
            $("#bz-gq-button-path i", self.actionBarContainer).removeClass("bz-gq-icon-path-stop");
        });

        self.pvCanvasContainer.on('pvComplete', function (event) {

            self.highlighted = false;

            //set in var by reference the importan data like current task and subprocess
            self.getRelevantData();

            self.toggleHighlight();
            self.showSubCases();

            event.stopPropagation();
        });

    },

    /*
    * Render tooltip for process viewer
    */
    applyViewerTooltip: function (options) {

        var self = this;

        self.pvCanvasContainer.tooltip({
            items: "div.processviewer-shape-selected, div.has-subprocess, div.processviewer-highlighted",
            content: function (ui, event) {
                return self.getTooltipContent($(this));
            },
            show: { duration: 120, effect: 'none' },
            tooltipClass: "biz-rp-tooltip",
            hide: { delay: 250, duration: 120 },
            close: function (event, ui) {

                ui.tooltip.hover(
                    function () {
                        $(this).stop(true).fadeTo(120, 1);
                    },
                    function () {
                        $(this).fadeOut(120, function () { $(this).remove(); });
                    }
                );
            }
        });
    },

    /*
    * Get tooltip content
    */
    getTooltipContent: function ($ui) {

        var self = this;
        var content = "";
        var taskName = $ui.find(".processviewer-hotspot-label").text();
        var guid = $ui.prop("id");

        if ($ui.hasClass("has-subprocess")) {
            content = self.getSubCasesContent(taskName, guid);
            self.bindTooltipEvent(content);
        } else if ($ui.hasClass("processviewer-shape-selected")) {
            content = self.getCurrentTaskContent(taskName, guid);
        } else if ($ui.hasClass("processviewer-highlighted") && $ui.hasClass("manualtask")) {
            content = self.getUsersData(taskName, guid);
        }

        bizagi.util.formatInvariantDate(content, self.dateFormat);

        return content;
    },

    /*
    * Get subcases info for tooltip and attach event for tooltip
    */
    getSubCasesContent: function (taskName, guid) {

        var self = this;
        var tmpl = self.getTemplate("graphicquery-tooltip-subcases");
        var subprocess = "";
        var cases = [];

        for (var i = 0, length = self.subprocesses.length; i < length; i++) {

            var arr = self.subprocesses[i];

            if (arr.guidTask === guid) {
                taskType = arr.subProcess.taskType;
                subprocess = arr.subProcess.taskName;
                cases = arr.subProcess.items;
                i = length;
            }
        }

        return $.tmpl(tmpl, { taskName: taskName, taskType: taskType, subprocess: subprocess, cases: cases });
    },

    /*
    * Get current task info
    */
    getCurrentTaskContent: function (taskName, guid) {

        var self = this;
        var tmpl = self.getTemplate("graphicquery-tooltip-currenttask");
        var data = {};

        for (var i = 0, length = self.currentTasks.length; i < length; i++) {
            if (guid === self.currentTasks[i].guidTask) {
                data = {
                    taskName: taskName,
                    entryDate: self.currentTasks[i].wiEntryDate,
                    expireDate: self.currentTasks[i].wiEstimatedSolutionDate,
                    users: self.currentTasks[i].usersAssignees
                };
            }
        }

        return $.tmpl(tmpl, data);
    },

    /*
    * Show subcases
    */
    showSubCases: function () {

        var self = this;
        var tmpl = self.getTemplate("graphicquery-subcases");

        for (var i = 0, length = self.subprocesses.length; i < length; i++) {

            var guid = self.subprocesses[i].guidTask;
            var subprocessHotspot = self.pvCanvasContainer.find("#" + guid);
            var subprocessLength = self.subprocesses[i].subProcess.items.length;

            subprocessHotspot.addClass("has-subprocess");
            subprocessHotspot.prepend($.tmpl(tmpl, { ncases: subprocessLength }));
        }

    },

    /*
    * Get user data for previous tasks
    */
    getUsersData: function (taskName, guid) {

        var self = this;
        var content = "";

        for (var i = 0, length = self.pathWorkItems.length; i < length; i++) {
            if (guid === self.pathWorkItems[i].guidTask) {
                var tmpl = self.getTemplate("graphicquery-tooltip-users");
                content = $.tmpl(tmpl, $.extend(self.pathWorkItems[i], { taskName: taskName }));

                //end the loop
                i = length;
            }
        }

        return content;
    },

    /*
    * Set Height for process viewer
    */
    getPVHeight: function () {

        var self = this;
        var canvasPst = self.headerContainer.height() + 35;
        var cntHeight = self.content.parent().height();
        var height = cntHeight - canvasPst;

        return (height <= 0)?"auto": height;
    },

    /*
    * Set call stack
    */
    setCallStack: function () {

        var self = this;

        self.callStack.push(self.currentWorkflow);
    },
    /*
    * Render graphic query
    */
    refreshContent: function (data) {

        var self = this;

        //reset global data
        self.path = [];
        self.subprocesses = [];
        self.currentTasks = [];
        self.currentWorkflow = {
            idCase: data.idCase,
            idWorkflow: data.idWorkflow,
            idParentWorkItem: data.idParentWorkItem
        };

        var params = {};
        params.idWorkflow = data.idWorkflow;
        params.idCase = data.idCase;

        //render process viewer
        self.renderProcessViewer(params);

        //destroy process viewer to refresh
        self.pvCanvasContainer.processviewer('destroy');

        //empty container
        self.actionBarContainer.empty();
        self.summaryContainer.empty();

    },

    /**
    * Bind tooltip event for subprocess
    */
    bindTooltipEvent: function ($content) {

        var self = this;

        //attach event
        $(".bz-gq-tooltip-list li", $content).on("click", function () {

            //remove tooltip
            $(this).closest(".ui-tooltip").remove();

            var data = {
                idWorkflow: $(this).data('idworkflow'),
                idCase: $(this).data("idcase"),
                idParentWorkItem: $(this).data("idparentworkitem")
            };

            //set task and parentWorkItem for currentWorkflow
            self.currentWorkflow.task = $(this).parent().data("parenttaskname");
            self.currentWorkflow.idParentWorkItem = data.idParentWorkItem;

            //set call stack
            self.setCallStack();

            self.refreshContent(data);
        });
    },

    /*
    * Get relevant data to save its reference
    */
    getRelevantData: function () {

        var self = this;

        for (var i = self.pathWorkItems.length - 1; i >= 0; i--) {

            if (self.pathWorkItems[i].subProcess) {
                // save reference
                self.subprocesses.push(self.pathWorkItems[i]);
            }

            if (!self.pathWorkItems[i].wiClosed) {
                // save reference
                self.currentTasks.push(self.pathWorkItems[i]);
            }
        }

    },

    /*
    * Draw case path
    */
    drawCasePath: function () {

        var self = this;

        if (self.path.length) {

            self.pvCanvasContainer.processviewer("animateRoute");
        } else {

            var filter = "idCase=" + self.currentWorkflow.idCase + "&idWorkFlow=" + self.currentWorkflow.idWorkflow;

            $.when(self.dataService.getCasePath(filter)).done(function (response) {

                for (var i = 0, length = response.length; i < length; i++) {
                    self.path.push(response[i].guidTaskFrom);
                    self.path.push(response[i].guidTransition);
                    self.path.push(response[i].guidTaskTo);
                }

                self.pvCanvasContainer.processviewer("animateRoute", self.path);
            });
        }
    },

    /*
    * Clear case path
    */
    clearCasePath: function () {

        var self = this;

        self.pvCanvasContainer.processviewer("stopRouteAnimation");
    }
  
 
});

