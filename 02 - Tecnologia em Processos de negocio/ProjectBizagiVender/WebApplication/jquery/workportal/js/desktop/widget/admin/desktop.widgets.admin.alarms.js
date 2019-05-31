/**
 * Alert module
 *
 * @author David Nino
 */


bizagi.workportal.widgets.admin.alarms.extend("bizagi.workportal.widgets.admin.alarms", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "alarms": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms").concat("#ui-bizagi-workportal-widget-admin-alarms"),
            "alarms.task.list": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms").concat("#ui-bizagi-workportal-widget-admin-alarms-list"),
            "alarms.task.list.item": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms").concat("#ui-bizagi-workportal-widget-admin-alarms-list-item"),
            "alarms.task.detail": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms").concat("#ui-bizagi-workportal-widget-admin-alarms-detail"),
            "alarms.task.detail.alarm.editor": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms").concat("#ui-bizagi-workportal-widget-admin-alarms-alarm-editor"),
            "alarms.task.detail.list.table": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms").concat("#ui-bizagi-workportal-widget-admin-alarms-detail-list-table"),
            "alarms.task.detail.alarm.recipients": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms").concat("#ui-bizagi-workportal-widget-admin-alarms-detail-alarm-recipients"),
            "alarms.task.detail.alarm.recipients.table": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms").concat("#ui-bizagi-workportal-widget-admin-alarms-detail-alarm-recipients-table"),
            useNewEngine: false
        });
    },

    postRender: function () {
        var self = this;

        self.containtersID = {
            GENERAL: "general",
            DETAIL: "detail"
        };

        self.listID = {
            APPLICATION: {
                name: "ListBoxApplication",
                update: "WORKFLOW",
                serviceMethod: "getApplicationCategoriesList"
            },
            WORKFLOW: {
                name: "ListBoxWFClass",
                update: "VERSION",
                serviceMethod: "getApplicationProcesses"
            },
            VERSION: {
                name: "ListBoxWFVersion",
                update: "TASKS",
                serviceMethod: "getProcessVersion"
            },
            TASKS: {
                name: "ListBoxWorkFlow",
                update: "",
                serviceMethod: "getProcessTasks"
            }
        };

        self.widgetMode = {
            VIEW_MODE: "viewMode",
            EDIT_MODE: "editMode"
        };

        self.alertData = {};

        self.taskListTmpl = self.getTemplate("alarms.task.list");
        self.taskListItemTmpl = self.getTemplate("alarms.task.list.item");
        self.taskDetailTmpl = self.getTemplate("alarms.task.detail");
        self.taskDetailAlarmEditor = self.getTemplate("alarms.task.detail.alarm.editor");

        self.taskListTableTmpl = self.getTemplate("alarms.task.detail.list.table");

        self.taskDetailAlarmRecipientsTmpl = self.getTemplate("alarms.task.detail.alarm.recipients");
        self.taskDetailAlarmRecipientsTableTmpl = self.getTemplate("alarms.task.detail.alarm.recipients.table");

        self.initRenderTaskList();
    },

    initRenderTaskList: function () {
        var self = this;

        self.switchContent(self.containtersID.GENERAL);

        var params = {
            action: "Applications"
        };

        $.when(self.dataService.getApplicationCategoriesList(params)).done(function (data) {
            self.renderTaskList(data);
        });
    },

    /*
     *
     */
    renderTaskList: function (data) {
        var self = this,
            content = this.getContent();

        var generalWrapper = $("#form-alarm-task-list", content);

        generalWrapper.empty();

        // Render Form
        $.tmpl(self.taskListTmpl).appendTo(generalWrapper);

        //self.fillTaskListColumnByID( self.listID.APPLICATION, data);
        self.fillTaskListColumnByID("APPLICATION", data);

        $("#btn-alarms", generalWrapper).click(function (e) {

            if (self.alertData) {
                if (self.alertData["idTask"] && self.alertData["idTask"] != "") {

                    $.when(self.dataService.getTaskAlarms({
                            idTask: self.alertData["idTask"]
                        }),
                        self.dataService.getLapseMode(),
                        self.dataService.getRecurrMode(),
                        self.dataService.getScheduleType(),
                        self.dataService.getBossList()

                    ).done(function (taskAlarms, lapseModeList, recurrModeList, scheduleTypeList, bossList, alarmRecipientsList) {

                        self.renderTaskDetail();

                        self.renderTaskListTable(taskAlarms[0]);

                        self.renderAlarmEditor(lapseModeList[0], recurrModeList[0], scheduleTypeList[0]);

                        self.renderAlarmRecipients(bossList[0], true);

                        self.switchContent(self.containtersID.DETAIL);

                        self.switchWidgetMode(self.widgetMode.VIEW_MODE);
                    });
                }
            }
        });
    },

    /*
     *
     */
    renderTaskDetail: function () {
        var self = this,
            content = this.getContent();

        var detailWrapper = $("#form-alarm-task-detail", content);
        detailWrapper.empty();

        var application = self.alertData["idAppText"],
            workflow = self.alertData["idWFClassText"],
            version = self.alertData["versionText"],
            task = self.alertData["idTaskText"],
            // Render Form
            detailTmpl = self.getTemplate("alarms.task.detail");

        var detailcnt = $.tmpl(detailTmpl, {
            application: application,
            workflow: workflow,
            version: version,
            task: task
        });
        detailWrapper.append(detailcnt).show();

        //Add handlers
        $("#btn-alarm-browser", detailWrapper).click(function () {

            //Clear data
            self.alertData = {};

            self.initRenderTaskList();
        });

        $("#btn-disable-alarms", detailWrapper).click(function () {
            self.callEnableDisableAlarmsService();
        });

        $("#btn-enable-alarms", detailWrapper).click(function () {
            self.callEnableDisableAlarmsService();
        });


        $("#btn-save-changes", detailWrapper).click(function () {
            //Validates if there is any error message from the Alarm Editor
            var validateResult = self.validateAlarmEditor();

            if (validateResult == "") {
                self.sendAlarmEditorData(true);
            } else {
                bizagi.showMessageBox(validateResult, "Bizagi", "warning");
            }
        });

        $("#btn-back", detailWrapper).click(function () {
            //switch to edit mode
            self.switchWidgetMode(self.widgetMode.VIEW_MODE);

            //Clear selected elements
            self.clearSelectedAlarm();

            self.resetAlarmEditor();

            self.resetAlarmRecipientsTable();
        });

        $("#btn-add-alarm", detailWrapper).click(function () {

            //Validates if there is any error message from the Alarm Editor
            var validateResult = self.validateAlarmEditor();

            if (validateResult == "") {
                self.sendAlarmEditorData();
            } else {
                bizagi.showMessageBox(validateResult, "Bizagi", "warning");
            }
        });
    },

    /*
     *
     */
    renderAlarmEditor: function (lapseModeList, recurrModeList, scheduleTypeList) {
        var self = this,
            content = this.getContent();

        var detailWrapper = $("#form-alarm-task-detail", content),
            formEditorWrapper = $("#alarm-editor-form-wrapper", detailWrapper);

        formEditorWrapper.empty();

        if (!self.alarmEditorData) {
            self.alarmEditorData = {
                lapseModeList: lapseModeList.lapseMode,
                recurrModeList: recurrModeList.recurrMode,
                scheduleTypeList: scheduleTypeList.scheduleType
            };
        }

        // Render Form
        $.tmpl(self.taskDetailAlarmEditor, {
            lapseModeList: self.alarmEditorData.lapseModeList,
            recurrModeList: self.alarmEditorData.recurrModeList,
            scheduleTypeList: self.alarmEditorData.scheduleTypeList
        }).appendTo(formEditorWrapper);

        //Alarm Editor Handlers
        $('input:radio[name=RadioButtonListLapseMode]', detailWrapper).on("change", function (event) {
            self.handleRadioButtonFields(event.currentTarget);
        });

        $('input:radio[name=RadioButtonListRecurMode]', detailWrapper).on("change", function (event) {
            self.handleRadioButtonFields(event.currentTarget);
        });

        $("#TextBoxAlarmTime", detailWrapper).on("change", function (event) {
            self.validateInputFields(event.currentTarget);
        });

        $("#TextBoxRecurTime", detailWrapper).on("change", function (event) {
            self.validateInputFields(event.currentTarget);
        });
    },

    /*
     *
     */
    sendAlarmEditorData: function (isUpdate) {

        var self = this,
            content = this.getContent();

        var detailWrapper = $("#form-alarm-task-detail", content),
            alarmEditorFormWrapper = $("#alarm-editor-form-wrapper", detailWrapper),
            isCheckBoxOn = $("#CheckBoxToCurrentAssignee", alarmEditorFormWrapper).is(':checked'),
            params = {},
            serviceMethodName;

        params.idTask = self.alertData.idTask;
        params.idRecurrMode = $('input:radio[name=RadioButtonListRecurMode]:checked').val();
        params.idLapseMode = $('input:radio[name=RadioButtonListLapseMode]:checked').val();
        params.scheduleType = $("#DropDownListRecurTime", alarmEditorFormWrapper).val();
        params.alarmTime = $("#TextBoxAlarmTime", alarmEditorFormWrapper).val();
        params.alarmRecurrTime = $("#TextBoxRecurTime", alarmEditorFormWrapper).val();

        if (params.alarmTime == "")
            params.alarmTime = 0;

        if (params.alarmRecurrTime == "")
            params.alarmRecurrTime = 0;

        if (isCheckBoxOn === true) {
            params.sendToCurrentAssignee = 1;
        } else if (isCheckBoxOn === false) {
            params.sendToCurrentAssignee = 0;
        }

        if (isUpdate) {
            params.idAlarm = self.selectedAlarm.idAlarm;
            serviceMethodName = "editAlarm";
        } else
            serviceMethodName = "addAlarm";

        $.when(self.dataService[serviceMethodName](params)).done(function (data) {
            if (data.response)
                self.refreshTaskListTable();
        });
    },

    refreshTaskListTable: function () {
        var self = this;

        self.clearSelectedAlarm();
        self.resetAlarmEditor();
        self.switchWidgetMode(self.widgetMode.VIEW_MODE);

        $.when(self.dataService.getTaskAlarms({
            idTask: self.alertData["idTask"]
        })).done(function (data) {
            self.renderTaskListTable(data);
        });
    },

    /*
     *
     */
    refreshAlarmRecipientsTable: function () {

        var self = this;

        //self.clearSelectedAlarm();
        //self.resetAlarmEditor();

        //self.switchWidgetMode(self.widgetMode.VIEW_MODE);

        var params = {
            idAlarm: self.selectedAlarm.idAlarm
        };
        $.when(self.dataService.getAlarmRecipients(params)).done(function (data) {
            self.renderAlarmRecipientsTable(data);
        });
    },


    /*
     *
     */
    renderTaskListTable: function (data) {
        var self = this;
        var content = this.getContent();

        var detailWrapper = $("#form-alarm-task-detail", content),
            alarmTableListWrapper = $("#alarm-list-table-wrapper", detailWrapper);

        alarmTableListWrapper.empty();

        // Render Form
        $.tmpl(self.taskListTableTmpl, {
            alarmList: data.alarms
        }).appendTo(alarmTableListWrapper);

        //Stores the alarm list obj
        self.alarmsList = [].concat(data.alarms);


        //Detect manually the alarms State : Enable/Disable
        if (self.alarmsList.length > 0) {
            if (self.alarmsList[0].active == "true")
                self.switchEnableAlarms(true);
            else
                self.switchEnableAlarms(false);
        } else
            self.switchEnableAlarms(false);


        //Reset any selected alarm
        self.selectedAlarm = undefined;

        $(".edit", alarmTableListWrapper).click(function (e) {

            //switch to edit mode
            self.switchWidgetMode(self.widgetMode.EDIT_MODE);

            //Clear selected elements
            self.clearSelectedAlarm();

            //Highlight the selected alarm row
            $($(e.currentTarget).closest("tr")[0]).addClass('selected');

            //Fill the detail form using the idalarm as a referente
            self.fillAlarmDetailForm($(e.currentTarget).data("idalarm"));

            // Retreives the Recipients form that Alarm
            var params = {
                idAlarm: $(e.currentTarget).data().idalarm
            };
            $.when(self.dataService.getAlarmRecipients(params)).done(function (data) {
                self.renderAlarmRecipientsTable(data);
            });
        });

        $(".delete", alarmTableListWrapper).click(function (e) {
            //console.log('delete ',$(e.currentTarget).data().idalarm);

            var idAlarm = $(e.currentTarget).data("idalarm");

            $.when(self.dataService.deleteAlarm({
                idAlarm: idAlarm
            })).done(function (data) {
                if (data.response === true) {
                    //switch to view mode
                    self.switchWidgetMode(self.VIEW_MODE);

                    self.refreshTaskListTable();
                }
            });
        });
    },

    /*
     *
     */
    clearSelectedAlarm: function () {

        var self = this,
            content = this.getContent();

        var alarmTableListWrapper = $("#alarm-list-table-wrapper", content);

        $("tr", alarmTableListWrapper).removeClass("selected");

        //Clears the selected element
        self.selectedAlarm = undefined;
    },

    /*
     *
     */
    resetAlarmEditor: function () {
        var self = this,
            content = this.getContent();

        var alarmEditorFormWrapper = $("#alarm-editor-form-wrapper", content),
            fields = $('input[name = RadioButtonListLapseMode]', alarmEditorFormWrapper).length + 1;

        while (fields-- > 1) {
            $('input[name=RadioButtonListLapseMode][value=' + fields + ']', alarmEditorFormWrapper)[0].checked = false;
            $('input[name=RadioButtonListRecurMode][value=' + fields + ']', alarmEditorFormWrapper)[0].checked = false;
        }

        //alarmTime
        $("#TextBoxAlarmTime", alarmEditorFormWrapper).val("");

        //alarmTime
        $("#TextBoxRecurTime", alarmEditorFormWrapper).val("");

        //idScheduleType
        $("#DropDownListRecurTime", alarmEditorFormWrapper).val("1");

        $("#CheckBoxToCurrentAssignee", alarmEditorFormWrapper).attr("checked", false);

        self.resetAlarmRecipientsTable();
    },

    /*
     *
     */
    resetAlarmRecipientsTable: function () {

        var self = this,
            content = this.getContent();

        var alarmRecipientsTableWrapper = $("#alarm-recipients-table-wrapper", content);
        alarmRecipientsTableWrapper.empty();

        //Resets current selection
        $("#DropDownListRecipients", content).val(0);
    },

    /*
     *
     */
    renderAlarmRecipients: function (data, isAlarmSelected) {
        var self = this,
            content = this.getContent();

        var detailWrapper = $("#form-alarm-task-detail", content),
            alarmRecipientsListWrapper = $("#alarm-recipients-form-wrapper", detailWrapper);

        // Render Form
        $.tmpl(self.taskDetailAlarmRecipientsTmpl, {
            bossList: data.bosses
        }).appendTo(alarmRecipientsListWrapper);


        $("#btn-add-recipient", alarmRecipientsListWrapper).click(function () {
            if (self.currentWidgetMode == self.widgetMode.EDIT_MODE) {

                //Gets the selected recipient
                var params = {
                    idRecipient: $("#DropDownListRecipients", alarmRecipientsListWrapper).val(),
                    idAlarm: self.selectedAlarm.idAlarm
                };

                $.when(self.dataService.addRecipientToAlarm(params)).done(function (data) {
                    if (data.response === true) {
                        self.refreshAlarmRecipientsTable();
                    } else {
                        bizagi.showMessageBox("Dato ya ingresado", "Bizagi", "warning");
                    }
                });
            }
        });

        $("#btn-delete-recipient", alarmRecipientsListWrapper).click(function () {
            if (self.currentWidgetMode == self.widgetMode.EDIT_MODE) {

                var alarmRecipientsTableWrapper = $("#alarm-recipients-table-wrapper", detailWrapper),
                    checkedElements = $("input:checked", alarmRecipientsTableWrapper);

                if (checkedElements.length > 0) {

                    var recipientsIDs = [],
                        i = checkedElements.length;

                    while (i-- > 0) {
                        recipientsIDs.push(($(checkedElements[i]).data("idrecipient")));
                    }

                    //Gets the selected recipient
                    var recipientsString = JSON.stringify({
                            "recipients": recipientsIDs
                        }),
                        params = {
                            "idRecipients": recipientsString
                        };

                    $.when(self.dataService.deleteRecipientsFromAlarm(params)).done(function (data) {
                        if (data.deletedRecipients.length > 0) {
                            self.refreshAlarmRecipientsTable();
                        }
                    });
                }
            }
        });
    },

    /*
     *
     */
    renderAlarmRecipientsTable: function (data) {
        var self = this,
            content = this.getContent();

        var detailWrapper = $("#form-alarm-task-detail", content),
            alarmRecipientsTableWrapper = $("#alarm-recipients-table-wrapper", detailWrapper);

        alarmRecipientsTableWrapper.empty();

        // Render Form
        $.tmpl(self.taskDetailAlarmRecipientsTableTmpl, {
            recipientsList: data.recipients
        }).appendTo(alarmRecipientsTableWrapper);
    },

    /*
     *
     */
    fillAlarmDetailForm: function (idAlarm) {

        var self = this,
            content = this.getContent();

        var detailWrapper = $("#form-alarm-task-detail", content),
            alarmEditorFormWrapper = $("#alarm-editor-form-wrapper", detailWrapper),
            i = self.alarmsList.length,
            selectedAlarm;

        //Gets the selected alarm data
        while (i-- > 0) {
            if (self.alarmsList[i].idAlarm == idAlarm) {
                selectedAlarm = self.alarmsList[i];
                break;
            }
        }

        self.selectedAlarm = selectedAlarm;

        //idLapseMode
        $('input[name=RadioButtonListLapseMode][value=' + selectedAlarm.idLapseMode + ']', alarmEditorFormWrapper)[0].checked = true;

        //idRecurrMode
        $('input[name=RadioButtonListRecurMode][value=' + selectedAlarm.idRecurrMode + ']', alarmEditorFormWrapper)[0].checked = true;

        //alarmTime
        $("#TextBoxAlarmTime", alarmEditorFormWrapper).val(selectedAlarm.alarmTime);

        //alarmTime
        $("#TextBoxRecurTime", alarmEditorFormWrapper).val(selectedAlarm.alarmRecurrTime);

        //idScheduleType
        $("#DropDownListRecurTime", alarmEditorFormWrapper).val(selectedAlarm.idScheduleType);

        // QA-873 the 'send to current assignee' element must be updated.
        //Send to Current Assignee
        $("#CheckBoxToCurrentAssignee", alarmEditorFormWrapper).prop("checked", selectedAlarm.sendToCurrAssignee);
    },

    /*
     *
     */
    handleRadioButtonFields: function (field) {

        var self = this,
            content = this.getContent();

        var alarmEditorFormWrapper = $("#alarm-editor-form-wrapper", content),
            fieldValue = field.value;

        if (field.name == "RadioButtonListLapseMode") {
            //Validates if the idLapseMode its diferent to 2(On Expiration), so then, the Alarm Time must be more than 0
            if (fieldValue != 2) {
                $("#TextBoxAlarmTime", alarmEditorFormWrapper).attr('disabled', false);
            } else {
                //Empty the field
                $("#TextBoxAlarmTime", alarmEditorFormWrapper).val("");
                $("#TextBoxAlarmTime", alarmEditorFormWrapper).attr('disabled', true);
            }
        } else
        if (field.name == "RadioButtonListRecurMode") {
            //Validates if the idRecurrMode its equal to 1 (Each recurr time), so then, the Alarm Time must be more than 0
            if (fieldValue != 1) {
                $("#TextBoxRecurTime", alarmEditorFormWrapper).attr('disabled', true);

                //Empty the field
                $("#TextBoxRecurTime", alarmEditorFormWrapper).val("");
            } else
                $("#TextBoxRecurTime", alarmEditorFormWrapper).attr('disabled', false);
        }
    },

    /*
     *
     */
    validateInputFields: function (field) {

        var self = this,
            content = this.getContent();

        var alarmEditorFormWrapper = $("#alarm-editor-form-wrapper", content),
            alertMessage = "",
            fieldValue = parseInt(field.value);

        if (isNaN(fieldValue))
            field.value = '';
        else
        if (fieldValue < 0)
            field.value = fieldValue * -1;
        else {

            if (field.id == "TextBoxAlarmTime") {
                var idLapseMode = $($('input:radio[name=RadioButtonListLapseMode][checked=checked]')[0]).val(),
                    alarmTime = fieldValue;

                if (!(idLapseMode != 2 && alarmTime > 0)) {
                    alertMessage = "Unless the selected lapse mode is On Expiration the alarm time cannot be empty";
                }
            } else
            if (field.id == "TextBoxRecurTime") {

                var idRecurrMode = $($('input:radio[name=RadioButtonListRecurMode][checked=checked]')[0]).val(),
                    alarmRecurrTime = fieldValue;

                if (!(idLapseMode == 1 && alarmTime > 0)) {
                    alertMessage = "Please review the Alarm Editor fields, the folowing are empty or unselected";
                }
            }
        }
    },

    /*
     *
     */
    validateAlarmEditor: function () {
        var self = this,
            content = this.getContent();

        var result = "",
            isValid = false,
            alarmEditorFormWrapper = $("#alarm-editor-form-wrapper", content);

        //1
        var idLapseMode = $('input:radio[name=RadioButtonListLapseMode]:checked').val(),
            alarmTime = $("#TextBoxAlarmTime", alarmEditorFormWrapper).val();

        //2
        var idRecurrMode = $('input:radio[name=RadioButtonListRecurMode]:checked').val(),
            alarmRecurrTime = $("#TextBoxRecurTime", alarmEditorFormWrapper).val();


        if (idLapseMode) {
            if (!((idLapseMode != 2 && alarmTime > 0) || (idLapseMode == 2 && (alarmTime == "" || alarmTime == 0)))) {

                result += "<li>" + bizagi.localization.getResource("workportal-widget-admin-alarms-error-message-on-expiration") + '</li>';
            }
        } else {

            result += "<li>" + bizagi.localization.getResource("workportal-widget-admin-alarms-field-title-lapse") + '</li>';

            if (alarmTime == "")
                result += "<li>" + bizagi.localization.getResource("workportal-widget-admin-alarms-group-title-timing") + " - " + bizagi.localization.getResource("workportal-widget-admin-alarms-field-title-lapse") + '</li>';
        }

        if (idRecurrMode) {
            if (!((idRecurrMode != 1 && (alarmRecurrTime == "" || alarmRecurrTime == 0)) || (idRecurrMode == 1 && alarmRecurrTime > 0))) {

                result += "<li>" + bizagi.localization.getResource("workportal-widget-admin-alarms-error-message-each-recurr") + '</li>';
            }
        } else {
            result += "<li>" + bizagi.localization.getResource("workportal-widget-admin-alarms-group-title-alarm-recur") + '</li>';

            if (alarmRecurrTime == "")
                result += "<li>" + bizagi.localization.getResource("workportal-widget-admin-alarms-group-title-timing") + " - " + bizagi.localization.getResource("workportal-widget-admin-alarms-field-title-alarm-recur-time") + '</li>';
        }

        if (result != "")
            result = bizagi.localization.getResource("workportal-widget-admin-alarms-error-message-review") + '</br></br> <ul>' + result + "</ul>";

        return result;
    },

    /*
     *
     */
    fillTaskListColumnByID: function (listName, data) {

        var self = this,
            content = this.getContent();

        var listObj = self.listID[listName],
            generalWrapper = $("#form-alarm-task-list", content),
            listElement = $("#" + listObj.name, generalWrapper);


        //listElement.empty();

        switch (listName) {
        case "APPLICATION":
            $.tmpl(self.taskListItemTmpl, {
                taskField: listName,
                elementList: data.items
            }).appendTo(listElement);
            break;

        case "WORKFLOW":
            $.tmpl(self.taskListItemTmpl, {
                taskField: listName,
                elementList: data.processes
            }).appendTo(listElement);
            break;

        case "VERSION":
            $.tmpl(self.taskListItemTmpl, {
                taskField: listName,
                elementList: data.versions
            }).appendTo(listElement);
            break;

        case "TASKS":
            $.tmpl(self.taskListItemTmpl, {
                taskField: listName,
                elementList: data.tasks
            }).appendTo(listElement);
            break;
        }

        listElement.unbind("change");

        //Add selects handlers
        listElement.bind("change", function (e) {
            self.updateListsContent(e.currentTarget);
        });
    },

    /*
     *
     */
    updateListsContent: function (currentTarget) {
        var self = this;

        //Captures the data
        var listCategory = self.getListCategoryByID(currentTarget.id)
        self.captureSelectedData(listCategory, currentTarget);

        var elementToUpdate = self.getElementToUpdate(currentTarget.id);

        //checks if there is any list element to update
        if (elementToUpdate != "") {
            var params = {};

            //Clear lists
            self.processLists(currentTarget.id);

            params = self.setupParametersbyListID(elementToUpdate);


            $.when(self.dataService[self.listID[elementToUpdate].serviceMethod](params)).done(function (data) {

                self.fillTaskListColumnByID(elementToUpdate, data);
            });
        }
    },

    /*
     *
     */
    captureSelectedData: function (listCategory, currentTarget) {

        var self = this;

        switch (listCategory) {
        case "APPLICATION":
            self.alertData["idApp"] = $(currentTarget.options[currentTarget.selectedIndex]).val();
            self.alertData["idAppText"] = currentTarget.options[currentTarget.selectedIndex].text;
            break;

        case "WORKFLOW":
            self.alertData["idWFClass"] = $(currentTarget.options[currentTarget.selectedIndex]).val();
            self.alertData["idWFClassText"] = currentTarget.options[currentTarget.selectedIndex].text;
            break;

        case "VERSION":
            self.alertData["version"] = $(currentTarget.options[currentTarget.selectedIndex]).val();
            self.alertData["versionText"] = currentTarget.options[currentTarget.selectedIndex].text;
            break;

        case "TASKS":
            self.alertData["idTask"] = $(currentTarget.options[currentTarget.selectedIndex]).val();
            self.alertData["idTaskText"] = currentTarget.options[currentTarget.selectedIndex].text;
            break;
        }
    },

    /*
     *
     */
    setupParametersbyListID: function (id) {

        var self = this,
            params = {};

        switch (id) {
        case "APPLICATION":
            params = {
                action: "getApplications"
            };
            break;

        case "WORKFLOW":
            params["idApp"] = self.alertData["idApp"];
            break;
        case "VERSION":
            params["idWFClass"] = self.alertData["idWFClass"];
            break;
        case "TASKS":
            params["idWFClass"] = self.alertData["idWFClass"];
            params["version"] = self.alertData["version"];
            break;
        }

        return params;
    },

    /*
     *
     */
    resetParametersbyListID: function (listCategory) {

        var self = this;

        switch (listCategory) {
        case "APPLICATION":
            self.alertData["idApp"] = "";
            break;

        case "WORKFLOW":
            self.alertData["idWFClass"] = "";
            break;

        case "VERSION":
            self.alertData["version"] = "";
            break;

        case "TASKS":
            self.alertData["idTask"] = "";
            break;
        }
    },

    /*
     *
     */
    processLists: function (id) {

        var self = this,
            content = self.getContent();

        var taskListWrapper = $("#form-alarm-task-list", content),
            currentListID = self.getElementToUpdate(id);

        if (currentListID != "") {

            //Empty list content
            $("#" + self.listID[currentListID].name, taskListWrapper).empty();

            //Empty current data
            self.resetParametersbyListID(currentListID);

            while (currentListID != "") {
                currentListID = self.getElementToUpdate(self.listID[currentListID].name);

                if (currentListID != "") {
                    //Clean list
                    $("#" + self.listID[currentListID].name, taskListWrapper).empty();

                    $("#" + self.listID[currentListID].name, taskListWrapper).empty();
                }
            }
        }
    },

    /*
     *
     */
    getElementToUpdate: function (val) {
        var self = this,
            result = self.getListCategoryByID(val);

        return self.listID[result].update;
    },

    /*
     *
     */
    getListCategoryByID: function (id) {
        var self = this;

        for (var x in self.listID) {
            if (id == self.listID[x].name)
                return x;
        }

        return "";
    },

    /*
     *
     */
    callEnableDisableAlarmsService: function () {
        var self = this;

        var params = {
            idTask: self.alertData["idTask"]
        };

        $.when(self.dataService.enableAlarm(params)).done(function (data) {

            if (data.response === true) {
                self.switchEnableAlarms();
                self.refreshTaskListTable();
            }

        });
    },

    /*
     *
     */
    switchEnableAlarms: function (value) {
        var self = this,
            content = self.getContent();

        var detailWrapper = $("#form-alarm-task-detail", content);
        if (value) {
            $("#btn-enable-alarms", detailWrapper).hide();
            $("#btn-disable-alarms", detailWrapper).show();
        } else {
            $("#btn-enable-alarms", detailWrapper).show();
            $("#btn-disable-alarms", detailWrapper).hide();
        }
    },

    /*
     *
     */
    switchContent: function (contentToDisplay) {
        var self = this,
            content = self.getContent();

        var generalWrapper = $("#form-alarm-task-list", content),
            detailWrapper = $("#form-alarm-task-detail", content);


        if (self.containtersID.DETAIL == contentToDisplay) {
            generalWrapper.hide();
            detailWrapper.show();
        } else {
            generalWrapper.show();
            detailWrapper.hide();
        }
    },

    /*
     *
     */
    switchWidgetMode: function (widgetMode) {

        var self = this,
            content = self.getContent();

        var generalWrapper = $("#form-alarm-task-list", content),
            detailWrapper = $("#form-alarm-task-detail", content);

        switch (widgetMode) {
        case self.widgetMode.VIEW_MODE:
            $("#btn-save-changes", detailWrapper).hide();
            $("#btn-back", detailWrapper).hide();
            $("#btn-delete-recipient", detailWrapper).show();
            $("#alarm-recipients-table-content", detailWrapper).show();
            $("#btn-add-recipient", detailWrapper).show();

            $("#btn-add-alarm", detailWrapper).show();

            break;

        case self.widgetMode.EDIT_MODE:
            $("#btn-save-changes", detailWrapper).show();
            $("#btn-back", detailWrapper).show();
            $("#btn-delete-recipient", detailWrapper).show();
            $("#alarm-recipients-table-content", detailWrapper).show();
            $("#btn-add-recipient", detailWrapper).show();


            $("#btn-add-alarm", detailWrapper).hide();

            break;
        }

        self.currentWidgetMode = widgetMode;
    }
});