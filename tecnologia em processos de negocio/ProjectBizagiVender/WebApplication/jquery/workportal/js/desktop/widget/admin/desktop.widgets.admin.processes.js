/**
 * Name: BizAgi Desktop Widget Administration Processes
 * 
 * @author Christian Collazos *
 */


bizagi.workportal.widgets.admin.processes.extend("bizagi.workportal.widgets.admin.processes", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "admin.processes.wrapper": bizagi.getTemplate('bizagi.workportal.desktop.widgets.admin.processes').concat('#ui-bizagi-workportal-widget-admin-processes-wrapper'),
            "admin.processes.combo.process": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.processes").concat("#ui-bizagi-workportal-widget-admin-processes-combo-process"),
            "admin.processes.proc.edit": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.processes").concat( "#ui-bizagi-workportal-widget-admin-processes-process-edit"),
            "admin.processes.task.edit": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.processes").concat( "#ui-bizagi-workportal-widget-admin-processes-task-edit"),
            useNewEngine:false
        });
    },

    /*
     * Post Render
     */
    postRender: function () {
        var self = this;
        self.formType = {
            TASK_FORM: "task",
            PROCESS_FORM: "process"
        };
        self.containersMode = {
            VIEW_MODE: "viewMode",
            EDIT_MODE: "editMode"
        };
        //Events handlers
        $.when(self.dataService.getWorkFlowClasses()).done(function (result) {
            self.processesData=result;
            self.renderSections();
        });

    },

    renderSections: function () {
        var self = this;
        var content = self.getContent();
        var processHeaderWrapper = $("#processes-header-wrapper", self.content);
        $.tmpl(self.comboProcess).appendTo(processHeaderWrapper);
        var processesMapWrapper = $("#admin-processes-map-wrapper", self.content);
        var processesComboWrapper = $("#ui-process-name",self.content);
        self.renderProcessesCombo(processesComboWrapper);
        self.renderProcessesEditWrapper();
        self.loadProcessData("1");
        self.renderTaskEditWrapper();
        self.displayTaskEdit(false);
        self.renderProcessViewer(processesMapWrapper);
    },

    /*
     *
     */
    loadProcessData: function (processID) {
        var self = this;
        var length = self.processesData.processes.length;
        self.currentSelectedProcessData = {};
        //Gets the selected process data
        while (length-- > 0) {
            if (processID == self.processesData.processes[length].id) {
                self.currentSelectedProcessData = self.processesData.processes[length];
                break;
            }
        }
       // self.bindProcessHeader();
        self.bindProcessDetail();
      var params = { "idWorkflow": processID };
        $.when(self.dataService.getTaskByWorkFlow(params)).done(function (result) {
            self.processTaskData = result;
        });
    },

    /*
     * Render process viewer
     */
    renderProcessViewer: function (processesMapWrapper) {
        var self = this;
        var filter = "processId=" +  self.currentSelectedProcessData.id;
        if (self.viewerPlugin) {
            self.viewerPlugin.processviewer('destroy');
        }
        var a= self.dataService;
        $.when(self.dataService.processDefinition(filter), self.dataService.graphicInfo(filter)).done(function (dfn, info) {
            self.processTaskDefinition=dfn[0].flowElements;
            //Initilize plugin process viewer
            self.viewerPlugin = processesMapWrapper.processviewer({
                height: 400,
                width: '100%',
                jsonBizagi: {
                    processDefinition: dfn[0],
                    processGraphicsInfo: info[0]
                },
                zoomRange: 5
            });
            setTimeout(function () {
                $(".processviewer-hotspot").click(function (e) {
                    e.preventDefault();
                    self.preprocessBindTaskDetail(this.id);
                });
            }, 150);
        });
    },

    /*
     * Render combo
     */
    renderProcessesCombo: function (processesComboWrapper) {
        var self = this;
        var content = self.getContent();
        var deferred = $.Deferred();
        var comboDataSource ={combo:[], id: "processName"};
        $.each(self.processesData.processes, function( index, value ) {
            comboDataSource.combo.push({ id: value.id, name: value.name});
        });
        processesComboWrapper.empty();
        processesComboWrapper.uicombo({
            isEditable: false,
            data: comboDataSource,
            itemValue: function (obj) {
                return obj.id;
            },
            itemText: function (obj) {
                return obj.name;
            },
            onComplete: function () {
                deferred.resolve();
            },
            onChange: function (obj) {
                self.loadProcessData(obj.ui.data('value'));
                self.loadSelectedTask(obj.ui.data('value'), -1);
            },
            initValue: comboDataSource.combo[0]
        });
        return deferred;
    },

    /*
     *
     */
    renderProcessesEditWrapper: function () {
        var self = this;
        var content = self.getContent();
        var processEditWrapper = $("#process-edit-wrapper", content);
        $.tmpl(self.processEditTmpl).appendTo(processEditWrapper);
        self.switchFormState(self.formType.PROCESS_FORM, self.containersMode.VIEW_MODE);

        //Events
        $("#btn-process-edit", processEditWrapper).click(function () {
            self.switchFormState(self.formType.PROCESS_FORM, self.containersMode.EDIT_MODE);
        });
        $("#btn-process-apply", processEditWrapper).click(function () {
            self.saveProcess();
            self.switchFormState(self.formType.PROCESS_FORM, self.containersMode.VIEW_MODE);
        });
        $("#btn-process-cancel", processEditWrapper).click(function () {
            self.switchFormState(self.formType.PROCESS_FORM, self.containersMode.VIEW_MODE);
        });
        $("#txt-process-duration-edit-days", processEditWrapper).on("change", function (event) {
            $(this).val(self.correctIntegerInInput($(this).val(), 0, 1000, 0));
        });
        $("#txt-process-duration-edit-hours", processEditWrapper).on("change", function (event) {
            $(this).val(self.correctIntegerInInput($(this).val(), 0, 23, 0));
        });
        $("#txt-process-duration-edit-minutes", processEditWrapper).on("change", function (event) {
            $(this).val(self.correctIntegerInInput($(this).val(), 0, 59, 0));
        });
    },

    /*
     *
     */
    renderTaskEditWrapper: function () {
        var self = this;
        var content = self.getContent();
        var taskEditWrapper = $("#task-edit-wrapper", content);
        $.tmpl(self.taskEditTmpl).appendTo(taskEditWrapper);
        self.switchFormState(self.formType.TASK_FORM, self.containersMode.VIEW_MODE);
        $("#btn-task-edit", taskEditWrapper).click(function () {
            self.switchFormState(self.formType.TASK_FORM, self.containersMode.EDIT_MODE);
        });
        $("#btn-task-apply", taskEditWrapper).click(function () {
            self.saveTask();
            self.switchFormState(self.formType.TASK_FORM, self.containersMode.VIEW_MODE);
        });
        $("#btn-task-cancel", taskEditWrapper).click(function () {
            self.switchFormState(self.formType.TASK_FORM, self.containersMode.VIEW_MODE);
        });
        $("#txt-task-duration-edit-days", taskEditWrapper).on("change", function (event) {
            $(this).val(self.correctIntegerInInput($(this).val(), 0, 1000, 0));
        });
        $("#txt-task-duration-edit-hours", taskEditWrapper).on("change", function (event) {
            $(this).val(self.correctIntegerInInput($(this).val(), 0, 23, 0));
        });
        $("#txt-task-duration-edit-minutes", taskEditWrapper).on("change", function (event) {
            $(this).val(self.correctIntegerInInput($(this).val(), 0, 59, 0));
        });
    },

    /*
     *
     */
    bindProcessDetail: function () {
        var self = this;
        var content = self.getContent();
        var processEditWrapper = $("#process-edit-wrapper", content);
        self.switchFormState(self.formType.PROCESS_FORM, self.containersMode.VIEW_MODE);
        //Parse the time
        self.parseObjectTime(self.currentSelectedProcessData);
        //Bind data
        $("#process-name", processEditWrapper).text(self.currentSelectedProcessData.name);
        $("#process-description", processEditWrapper).text(self.currentSelectedProcessData.description);
        $("#process-duration", processEditWrapper).text(self.currentSelectedProcessData.durationText);

        $("#txt-process-duration-edit-days", processEditWrapper).val(self.currentSelectedProcessData.durationDays);
        $("#txt-process-duration-edit-hours", processEditWrapper).val(self.currentSelectedProcessData.durationHours);
        $("#txt-process-duration-edit-minutes", processEditWrapper).val(self.currentSelectedProcessData.durationMinutes);

        //Reset the selected task
        self.currentSelectedTaskData = undefined;
        self.displayTaskEdit(false);
    },

    /*
     *
     */
    preprocessBindTaskDetail: function (taskId) {
        var self = this;
        var taskData = self.getTaskByID(taskId);
        if (taskData) {
            self.bindTaskDetail(taskData);
        }
        else
            self.displayTaskEdit(false);
    },

    /*
     *
     */
    bindTaskDetail: function (param) {
        var self = this;
        var content = self.getContent();
        var taskEditWrapper = $("#task-edit-wrapper", content);
        var taskData =param;
        if (self.shouldShowTaskProperties(taskData)) {
            self.displayTaskEdit(true);
            self.switchFormState(self.formType.PROCESS_FORM, self.containersMode.VIEW_MODE);
            self.switchFormState(self.formType.TASK_FORM, self.containersMode.VIEW_MODE);
            self.parseObjectTime(taskData);
            //Keeps the selected task
            self.currentSelectedTaskData = taskData;
            //Bind data
            $("#task-name", taskEditWrapper).text(self.currentSelectedTaskData.name);
            $("#task-description", taskEditWrapper).text(self.currentSelectedTaskData.description);
            $("#task-duration", taskEditWrapper).text(self.currentSelectedTaskData.durationText);

            $("#txt-task-duration-edit-days", taskEditWrapper).val(self.currentSelectedTaskData.durationDays);
            $("#txt-task-duration-edit-hours", taskEditWrapper).val(self.currentSelectedTaskData.durationHours);
            $("#txt-task-duration-edit-minutes", taskEditWrapper).val(self.currentSelectedTaskData.durationMinutes);
        }
        else {
            self.currentSelectedTaskData = undefined;
            self.displayTaskEdit(false);
        }
    },

    getTaskByID: function (taskID) {
        var self = this;
        var i = self.processTaskData.Tasks.length;
        while (i-- > 0) {
            if (taskID == self.processTaskData.Tasks[i].guid) {
                return self.processTaskData.Tasks[i];
            }
        }
    },

    shouldShowTaskProperties: function (oTask) {
        return oTask.idTaskType && (
            oTask.idTaskType == 2 //ManualState
                || oTask.idTaskType == 7 //SubProcess
                || oTask.idTaskType == 14 //SubProcessMultiInstance
                || oTask.idTaskType == 21 //Singleton
                || oTask.idTaskType == 38 //ReceiveTask
                || oTask.idTaskType == 39 //ManualTask
                || oTask.idTaskType == 41 //DataObject
            );
    },

    /*
     *
     */
    displayTaskEdit: function (value) {
        var self = this;
        var content = self.getContent();
        var taskEditWrapper = $("#task-edit-wrapper", content);
        if (value)
            taskEditWrapper.show();
        else
            taskEditWrapper.hide();
    },
    /*
     *
     */
    switchFormState: function (formType, widgetMode) {
        var self = this;
        var content = self.getContent();
        switch (widgetMode) {
            case self.containersMode.VIEW_MODE:
                if (formType == self.formType.PROCESS_FORM) {
                    $("#process-view-fields-wrapper", content).show();
                    $("#process-edit-fields-wrapper", content).hide();
                }
                else
                if (formType == self.formType.TASK_FORM) {
                    $("#task-view-fields-wrapper", content).show();
                    $("#task-edit-fields-wrapper", content).hide();
                }
                break;

            case self.containersMode.EDIT_MODE:

                if (formType == "process") {
                    $("#process-view-fields-wrapper", content).hide();
                    $("#process-edit-fields-wrapper", content).show();
                }
                else
                if (formType == self.formType.TASK_FORM) {
                    $("#task-view-fields-wrapper", content).hide();
                    $("#task-edit-fields-wrapper", content).show();
                }
                break;
        }
    },

    /*
     *
     */
    loadSelectedTask: function (idWorkflow, idTask) {
        var self = this;
        var content = self.getContent();
        var processesMapWrapper = $("#admin-processes-map-wrapper", self.content);
        self.renderProcessViewer(processesMapWrapper);
    },

    /*
     * Fix input value if outside the specified range
     */
    correctIntegerInInput: function (value, minValue, maxValue, defaultValue) {
        var self = this;
        var iNewValue = self.tryParseInt(value, defaultValue);
        if (iNewValue < minValue)
            return (minValue);
        else if (iNewValue > maxValue)
            return (maxValue);
        else
            return (iNewValue);
    },

    /*
     * TryParseInt javascript version
     */
    tryParseInt: function (str, defaultValue) {
        var retValue = defaultValue;
        if (str != null) {
            if (jQuery.trim(new String(str)).length > 0) {
                if (!isNaN(str)) {
                    retValue = parseInt(str);
                }
            }
        }
        return retValue;
    },
    /*
     *
     */
    saveProcess: function () {

        var self = this;
        var content = self.getContent();
        var processEditWrapper = $("#process-edit-wrapper", content);
        var iNewDuration = self.getMinutesFromTimeUnits(
            $("#txt-process-duration-edit-days", processEditWrapper).val(),
            $("#txt-process-duration-edit-hours", processEditWrapper).val(),
            $("#txt-process-duration-edit-minutes", processEditWrapper).val()
        );

        var params = {};
        params["idWorkflow"] = self.currentSelectedProcessData.id;
        params["duration"] = iNewDuration;
        if (iNewDuration != NaN) {
            $.when(self.dataService.modifyProcessDuration(params)).done(function (result) {
                if (result.workflow) {
                    self.currentSelectedProcessData.duration = result.workflow.duration;
                    self.bindProcessDetail();
                }
            });
        }
    },

    /*
     *
     */
    saveTask: function () {

        var self = this;
        var content = self.getContent();
        var taskEditWrapper = $("#task-edit-wrapper", content);
        var iNewDuration = self.getMinutesFromTimeUnits(
            $("#txt-task-duration-edit-days", taskEditWrapper).val(),
            $("#txt-task-duration-edit-hours", taskEditWrapper).val(),
            $("#txt-task-duration-edit-minutes", taskEditWrapper).val()
        );

        var params = {};

        params["idTask"] = self.currentSelectedTaskData.id;
        params["duration"] = iNewDuration;
        if (iNewDuration != NaN) {
            $.when(self.dataService.modifyTaskDuration(params)).done(function (result) {
                if (result.task) {
                    self.currentSelectedTaskData.duration = result.task.duration;
                    self.bindTaskDetail(self.currentSelectedTaskData);
                }
            });
        }
    },
    /*
     * Calculate number of minutes based on an array containing days, hous and minutes
     */
    getMinutesFromTimeUnits: function (days, hours, minutes) {
        var hoursDay = 8;
        var minutesDay = hoursDay * 60;
        var rMinutes = parseInt(days) * minutesDay
            + parseInt(hours) * 60
            + parseInt(minutes);
        return rMinutes;
    },
    /*
     *
     */
    parseObjectTime: function (objectReference) {
        var self = this;
        var arrDuration = self.getTimeArrayFromMinutes(objectReference.duration);
        objectReference.durationText = self.getDurationStringFromMinutes(objectReference.duration);
        objectReference.durationDays = arrDuration[0];
        objectReference.durationHours = arrDuration[1];
        objectReference.durationMinutes = arrDuration[2];
    },
    /*
     *   Divide a given number of minutes in three values: days, hours and minutes
     */
    getTimeArrayFromMinutes: function (minutes) {
        var self = this;
        minutes = self.tryParseInt(minutes, 0);
        var hoursDay = 8;
        var minutesDay = hoursDay * 60;
        var rDays = (minutes / minutesDay) | 0;
        var rHours = ((minutes % minutesDay) / 60) | 0;
        var rMins = (minutes % 60);
        var arr = [rDays, rHours, rMins];
        return arr;
    },
    /*
     * Gets a duration string (h/m/s) from a given number of minutes
     */
    getDurationStringFromMinutes: function (minutes) {
        var self = this;
        var arrDuration = self.getTimeArrayFromMinutes(minutes);
        var sDuration = arrDuration[0] + bizagi.localization.getResource("workportal-widget-processes-field-abreviation-day") + " ";
        sDuration += arrDuration[1] + bizagi.localization.getResource("workportal-widget-processes-field-abreviation-hour") + ":";
        sDuration += arrDuration[2] + bizagi.localization.getResource("workportal-widget-processes-field-abreviation-minute");
        return sDuration;
    },
    /*
     *
     */
    displayTaskEdit: function (value) {
        var self = this;
        var content = self.getContent();
        var taskEditWrapper = $("#task-edit-wrapper", content);
        if (value)
            taskEditWrapper.show();
        else
            taskEditWrapper.hide();
    }


});