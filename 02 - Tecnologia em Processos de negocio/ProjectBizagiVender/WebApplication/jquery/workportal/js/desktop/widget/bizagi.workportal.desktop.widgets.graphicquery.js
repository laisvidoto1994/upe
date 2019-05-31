
/*
*   Name: BizAgi Workportal Desktop Graphic Query
*   Author: David Romero
*   Comments:
*   -   This script renders the case workflow
*/

// Auto extend
bizagi.workportal.widgets.graphicquery.extend("bizagi.workportal.widgets.graphicquery", {}, {

    /**
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {

        var self = this;

        //date format
        self.dateFormat = self.getResource("dateFormat") + " " + self.getResource("timeFormat");

        //get Containers
        self.$header = $(".bz-gq-header", self.content);
        self.$actionBar = $("#bz-gq-actionbar-container", self.$header);
        self.$pvCanvas = $("#bz-gq-processviewer-canvas", self.content);
        self.$summary = $("#bz-gq-summary-container", self.$header);

        //render process viewer
        self.renderProcessViewer();

        self.eventsHandler();
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

        //render process viewer
        self.renderProcessViewer();

        //destroy process viewer to refresh
        self.$pvCanvas.processviewer('destroy');

        //empty container
        self.$actionBar.empty();
        self.$summary.empty();

    },

    /*
    * Set call stack
    */
    setCallStack: function () {

        var self = this;

        self.callStack.push(self.currentWorkflow);
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
        self.$actionBar.html($.tmpl(tmpl, { parentCase: parentCase }));
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
        self.$summary.html(content);

        // Render parent process summary
        if (summaryData.parentCase) {
            var psummary = self.getTemplate("graphicquery-parentsummary");
            self.$summary.append($.tmpl(psummary, summaryData.parentCase));
        }
    },

    /*
    * Render case workflow
    */
    renderProcessViewer: function () {

        var self = this;
        var $content = self.getContent();
        var processFilter = "processId=" + self.currentWorkflow.idWorkflow;
        var queryFilter = "idCase=" + self.currentWorkflow.idCase + "&idWorkFlow=" + self.currentWorkflow.idWorkflow;

        //if there is a parentworkflow, add to filter
        queryFilter += (self.currentWorkflow.idParentWorkItem) ? "&idParentWorkItem=" + self.currentWorkflow.idParentWorkItem : "";

        $.when(self.dataService.processDefinition(processFilter),
                self.dataService.graphicInfo(processFilter),
                    self.dataService.getGraphicQueryInfo(queryFilter)).done(function (dfn, info, gq) {

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
                        self.$pvCanvas.processviewer({
                            height: self.getPVHeight(),
                            jsonBizagi: {
                                processDefinition: dfn[0],
                                processGraphicsInfo: info[0]
                            },
                            zoomRange: 5
                        });

                    }).fail(function (response) {

                        var obj = JSON.parse(response.responseText);

                        self.publish("closeCurrentDialog");
                        bizagi.showMessageBox(obj.message, "Bizagi", "warning");
                    });

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
            self.$pvCanvas.processviewer('selectShape', guids, self.currentTasks);
        } else {
            self.highlighted = false;
            self.$pvCanvas.processviewer('unSelectShape', guids, self.currentTasks);
        }

    },

    /*
    * Events Handler
    */
    eventsHandler: function () {

        var self = this;

        //bind tooltip event for process viewer
        self.applyViewerTooltip();

        self.$actionBar.on("click", "#bz-gq-button-parent, #bz-gq-button-path, #bz-gq-button-status", function (event) {

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

        self.$pvCanvas.on("animationComplete", function (event) {
            $("#bz-gq-button-path i", self.$actionBar).removeClass("bz-gq-icon-path-stop");
        });

        self.$pvCanvas.on('pvComplete', function (event) {

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

        self.$pvCanvas.tooltip({
            items: "div.processviewer-shape-selected, div.has-subprocess, div.processviewer-highlighted",
            content: function (ui, event) {
                return self.getTooltipContent($(this));
            },
            show: { duration: 120, effect: 'none' },
            tooltipClass: "bz-gq-tooltip-wrapper",
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
        var deferred = $.Deferred();

        if ($ui.hasClass("has-subprocess")) {
            content = self.getSubCasesContent(taskName, guid);
            self.bindTooltipEvent(content);
        } else if ($ui.hasClass("processviewer-shape-selected") &&
            !$ui.hasClass("end") && !$ui.hasClass("start") &&
                !$ui.hasClass("scripttask") && !$ui.hasClass("servicetask") &&
                    !$ui.hasClass("sendtask") && !$ui.hasClass("receivetask")) {
            content = self.renderCurrentTaskTooltip(taskName, guid, deferred);
        } else if ($ui.hasClass("processviewer-highlighted") && $ui.hasClass("manualtask")) {
            content = self.renderPreviousTaskTooltip(taskName, guid, deferred);
        }

        deferred.promise().done(function (content) {
            bizagi.util.formatInvariantDate(content, self.dateFormat);
        });

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
                taskType = arr.subProcess.taskType
                subprocess = arr.subProcess.taskName;
                cases = arr.subProcess.items;
                i = length;
            }
        }

        return $.tmpl(tmpl, { taskName: taskName, taskType: taskType, subprocess: subprocess, cases: cases });
    },

    renderCurrentTaskTooltip: function (taskName, guid, deferred) {

        var self = this;
        var content = $("<div></div>");

        $.when(self.getCurrentTaskContent(guid)).done(function (currentTask) {

            var tmpl = self.getTemplate("graphicquery-tooltip-currenttask");

            var data = {
                taskName: taskName,
                entryDate: currentTask.wiEntryDate,
                expireDate: currentTask.wiEstimatedSolutionDate,
                users: (bizagi.override.showAssignees) ? currentTask.usersAssignees : []
            };

            content = $.tmpl(tmpl, data);

            $(".bz-gq-tooltip-wrapper").html(content);
            deferred.resolve(content);
        });

        return content;
    },

    /*
    * Get current task info
    */
    getCurrentTaskContent: function (guid) {

        var self = this;
        var tmpl = self.getTemplate("graphicquery-tooltip-currenttask");
        var defer = $.Deferred();

        for (var i = 0, length = self.currentTasks.length; i < length; i++) {
            if (guid === self.currentTasks[i].guidTask) {

                if (self.currentTasks[i].usersAssignees.length === 0) {

                    self.dataService.getUserInfoByTask(self.currentWorkflow.idCase, guid).done(function (response) {

                        self.currentTasks[i].usersAssignees = response;
                        defer.resolve(self.currentTasks[i]);
                    }).fail(function (response) {

                        defer.reject(self.currentTasks[i]);
                    });

                } else {

                    defer.resolve(self.currentTasks[i]);
                }

                //end the loop
                break;
            }
        }

        return defer.promise();
    },

    /*
    * Show subcases
    */
    showSubCases: function () {

        var self = this;
        var tmpl = self.getTemplate("graphicquery-subcases");

        for (var i = 0, length = self.subprocesses.length; i < length; i++) {

            var guid = self.subprocesses[i].guidTask;
            var subprocessHotspot = self.$pvCanvas.find("#" + guid);
            var subprocessLength = self.subprocesses[i].subProcess.items.length;

            subprocessHotspot.addClass("has-subprocess");
            subprocessHotspot.prepend($.tmpl(tmpl, { ncases: subprocessLength }));
        }

    },

    /*
    * Render Previous Task Tooltip
    */
    renderPreviousTaskTooltip: function (taskName, guid, deferred) {

        var self = this;
        var content = $("<div></div>");

        $.when(self.getUsersDataForPreviousTask(guid)).done(function (task) {

            var tmpl = self.getTemplate("graphicquery-tooltip-users");

            content = $.tmpl(tmpl, $.extend(task, { taskName: taskName }));

            $(".bz-gq-tooltip-wrapper").html(content);
            deferred.resolve(content);
        });

        return content;
    },

    /*
    * Get user data for previous tasks
    */
    getUsersDataForPreviousTask: function (guid) {

        var self = this;
        var defer = $.Deferred();

        for (var i = 0, length = self.pathWorkItems.length; i < length; i++) {
            if (guid === self.pathWorkItems[i].guidTask) {

                if (self.pathWorkItems[i].usersAssignees.length === 0) {

                    self.dataService.getUserInfoByTask(self.currentWorkflow.idCase, guid).done(function (response) {

                        self.pathWorkItems[i].usersAssignees = response;
                        defer.resolve(self.pathWorkItems[i]);
                    }).fail(function (response) {

                        defer.reject(self.pathWorkItems[i]);
                    });

                } else {

                    defer.resolve(self.pathWorkItems[i]);
                }

                //end the loop
                break;
            }
        }

        return defer.promise();
    },

    /*
    * Set Height for process viewer
    */
    getPVHeight: function () {

        var self = this;
        var canvasPst = self.$header.height() + 45;
        var cntHeight = self.content.parent().height();

        return cntHeight - canvasPst;
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

            self.$pvCanvas.processviewer("animateRoute");
        } else {

            var filter = "idCase=" + self.currentWorkflow.idCase + "&idWorkFlow=" + self.currentWorkflow.idWorkflow;

            $.when(self.dataService.getCasePath(filter)).done(function (response) {

                for (var i = 0, length = response.length; i < length; i++) {
                    //there's always at least three transitions on the path but the first is always the first transition,
                    //so the next element gets the start task, which should be first taskFrom from the next transition.
                    if (i === 0 && response[0].guidTaskFrom === "") {
                        self.path.push(response[i + 1]? response[i + 1].guidTaskFrom : "");
                        self.path.push(response[i].guidTransition);
                        self.path.push(response[i].guidTaskTo);
                    }
                    self.path.push(response[i].guidTaskFrom);
                    self.path.push(response[i].guidTransition);
                    self.path.push(response[i].guidTaskTo);
                }

                self.path = self.cleanPathArray(self.path);
                self.path = self.removeRepeatedItemsInPath(self.path);
                self.$pvCanvas.processviewer("animateRoute", self.path);
            });
        }
    },

    /*
    * Clear case path
    */
    clearCasePath: function () {
        var self = this;

        self.$pvCanvas.processviewer("stopRouteAnimation");
    },

    cleanPathArray : function (actual) {
        var newArray = [];
        for (var i = 0, l = actual.length; i < l; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    },

    removeRepeatedItemsInPath : function (actual) {
        var prims = {"boolean":{}, "number":{}, "string":{}}, objs = [];

        return actual.filter(function(item) {
            var type = typeof item;
            if(type in prims)
                return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
            else
                return objs.indexOf(item) >= 0 ? false : objs.push(item);
        });
    }

});
