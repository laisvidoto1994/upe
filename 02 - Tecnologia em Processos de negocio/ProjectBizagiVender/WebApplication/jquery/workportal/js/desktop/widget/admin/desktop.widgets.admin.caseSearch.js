/**
 * Name: BizAgi Desktop Widget Administration Cases Implementation
 *
 * @author Christian Collazos
 */


bizagi.workportal.widgets.admin.caseSearch.extend("bizagi.workportal.widgets.admin.caseSearch", {}, {
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        self.selectedCaseAdmin = [];
        self.selectedWorkItemAdmin = [];

        self.columnsID = {
            "caseNumber": "I_radNumber",
            "process": "I_wfClsDisplayName",
            "task": "I_tskDisplayName",
            "processCreationDate": "I_casCreationDate",
            "taskDueDate": "I_wiEstimatedSolutionDate",
            "processDueDate": "I_casSolutionDate",
            "userName": "I_userName",
            "userfullName": "I_fullName",
            "userLocation": "I_locName"
        };

        //Load templates
        self.loadTemplates({
            "admin.case.search": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch").concat("#ui-bizagi-workportal-widget-admin-case-search"),
            "admin.case.search.fields": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch").concat("#ui-bizagi-workportal-widget-admin-case-search-fields"),
            "admin.case.search.button": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch").concat("#ui-bizagi-workportal-widget-admin-case-search-buttons"),
            "admin.case.search.result": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch").concat("#ui-bizagi-workportal-widget-admin-case-search-result"),
            "admin.case.search.pagination": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch").concat("#ui-bizagi-workportal-widget-admin-case-search-pagination"),
            "admin.case.search.invalidate": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch").concat("#ui-bizagi-workportal-widget-admin-case-search-invalidate"),
            "admin.case.search.reassign": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch").concat("#ui-bizagi-workportal-widget-admin-case-search-reassign"),
            "admin.case.search.reassign.form": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch").concat("#ui-bizagi-workportal-widget-admin-case-search-reassign-form"),
            "admin.case.search.action.result": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch").concat("#ui-bizagi-workportal-widget-admin-case-search-action-result"),
            useNewEngine: false
        });
    },

    loadtemplates: function () {
        var self = this;

        //Template vars 
        self.generalContentTmpl = self.getTemplate("admin.case.search");
        self.fieldsContentTmpl = self.getTemplate("admin.case.search.fields");
        self.buttonContentTmpl = self.getTemplate("admin.case.search.button");
        self.resultContentTmpl = self.getTemplate("admin.case.search.result");
        self.paginationTmpl = self.getTemplate("admin.case.search.pagination");
        self.invalidateContentTmpl = self.getTemplate("admin.case.search.invalidate");
        self.reassignContentTmpl = self.getTemplate("admin.case.search.reassign");
        self.reassignFormTmpl = self.getTemplate("admin.case.search.reassign.form");
        self.actionResultContentTmpl = self.getTemplate("admin.case.search.action.result");
    },

    postRender: function () {
        var self = this;

        self.defaultMaxRows = 10;
        self.maxElemShow = self.defaultMaxRows;
        self.maxPageToShow = 5;

        //load form data
        self.processNavigation = [];
        self.setupData();
    },

    /*
     * Init the Current User Position combo box
     */
    initPositionsCombo: function () {
        var self = this;
        $.when(
            self.dataService.getUserPositions()
        ).done(function (resultList) {
            var comboDataSource = {
                combo: [],
                id: "positions"
            };
            comboDataSource.combo.push({
                id: '',
                name: '.........'
            });
            $.each(resultList.positions, function (index, value) {
                comboDataSource.combo.push({
                    id: value.idPosition,
                    name: value.displayName
                });
            });
            self.renderPositionsCombo(comboDataSource);
        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    /*
     * Render the Current User Position combo box
     */
    renderPositionsCombo: function (comboDataSource) {
        var self = this;
        var content = self.getContent();
        var deferred = $.Deferred();
        var comboWrapper = $("#userPositionInput", content);
        comboWrapper.empty();
        //$("#userPositionInput", content).val(comboDataSource.combo[0].id);
        comboWrapper.uicombo({
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
                var value = obj.ui.data('value');
                $("#userPositionInput", content).val(value);
            },
            initValue: comboDataSource.combo[0]
        });
        return deferred;
    },


    /*
     * Setup form data
     */
    setupData: function () {
        var self = this;

        self.setupInitialData();
        self.setupDatePicker();
        self.setupProcessTree();
        self.setupMainButtons();
        self.initPositionsCombo();
    },

    /*
     * Load form data
     */
    setupInitialData: function () {
        var self = this,
            content = self.getContent(),
            fields;

        //set self variables to default
        self.buttonBackAction = "backToMainForm";
        self.selectedUserId = "";
        self.selectedUserName = "";
        self.selectedTasks = "";
        self.selectedTasksToShow = "";
        self.searchParams = "";
        self.processTree = "";

        //set content form to default
        $("#generalTitle").html(bizagi.localization.getResource("workportal-widget-admincasesearch-subtitle"));
        $("#mainForm", content).remove();
        $("#dinamicContent", content).remove();
        $("#case-search-log-data-buttonset", content).remove();

        //append fields to wrapper
        fields = $.tmpl(self.fieldsContentTmpl, {});
        content.append(fields);
    },

    /*
     * Load dateTime plugin and apply to respective fields
     */
    setupDatePicker: function () {
        var self = this;
        var content = self.getContent();
        var formatDate = bizagi.localization.getResource('dateFormat').replaceAll("yyyy", "yy").replaceAll("MM", "mm");

        $(".biz-wp-form-datepicker", content).datepicker({
            controlType: 'select',
            dateFormat: formatDate
        });
    },

    /*
     * initialize the process tree widget
     */
    setupProcessTree: function () {
        var self = this,
            content = self.getContent();

        bizagi.treeRoutSelected = [];
        $("#treeLinksId").remove();

        self.processTree = new bizagi.workportal.widgets.processtree(self.workportalFacade, self.dataService, $.extend(self.params, {
            canvas: $("#processTree", content)
        }));

        self.processTree.render();

    },

    /*
     * initialize the users search form widget
     */
    setupUsersSearchForm: function () {
        var self = this,
            content = self.getContent(),
            def = $.Deferred();

        $("#biz-wp-users-table-form").html("");

        self.usersTable = new bizagi.workportal.widgets.userstable(self.workportalFacade, self.dataService, $.extend(self.params, {
            canvas: $("#biz-wp-users-table-form", content),
            userLinkLabel: [bizagi.localization.getResource("workportal-widget-admincasesearch-reassign")],
            parentDef: def
        }));

        self.usersTable.render();

        $.when(def).done(function (userId, userName) {
            self.assignEventReassignLinks(userId, userName);
        });
    },

    /*
     * Find cases results using the input data
     */
    findResults: function (content, params, pageToShow) {
        var self = this;

        //If there is not a page to Show, begins whith the fist one
        pageToShow ? params.Page = pageToShow : params.Page = 1;

        $.when(
            self.dataService.getAdminCasesList(params)
        ).done(function (resultList) {

            //clean old results
            $("#generalTitle").show();
            $(".biz-wp-table").remove();
            $(".case-search-action-wrapper").remove();
            $("#biz-wp-table-summary-wrapper").remove();

            //Keep in track the total Records
            self.totalRecords = resultList.records;
            //keep in track the total pages
            self.totalPages = resultList.total;

            if (resultList.rows.length > 0) {

                self.showCasesSearchResultFrame(content, resultList);
                self.setupActionsButton(content);

                var pageToshow = (self.maxPageToShow > self.totalPages) ? self.totalPages : self.maxPageToShow;
                var summaryWrapper = $("#biz-wp-table-pager-wrapper"),
                    pagerData = {},
                    paginationHtml;

                // show or hide "load more" button
                pagerData.pagination = (self.totalPages > 1) ? true : false;
                pagerData.page = resultList.page;
                pagerData.pages = {};

                for (var i = 1; i <= pageToshow; i++) {
                    pagerData["pages"][i] = {
                        "pageNumber": i
                    };
                }

                //load and append the paginator to the result table
                paginationHtml = $.tmpl(self.paginationTmpl, pagerData).html();
                summaryWrapper.append(paginationHtml);

                //add data and behaviour to pager
                $("ul").bizagiPagination({
                    maxElemShow: self.maxElemShow,
                    totalPages: self.totalPages,
                    actualPage: resultList.page,
                    listElement: $("#biz-wp-table-pager-wrapper"),
                    clickCallBack: function (options) {
                        self.findResults(content, params, options.page);
                    }
                });
            } else {
                bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-authentication-log-none"), "Bizagi", "warning");
            }


        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    /*
     * Show cases search result frames
     */
    showCasesSearchResultFrame: function (content, resultList) {
        var self = this;

        var disableInvalidate = bizagi.override.disableAbortCases ? true : false;

        var processedItems = self.preprocessResultList(resultList.headers, resultList);
        var resultTemplate = $.tmpl(self.resultContentTmpl, {
                headers: resultList.headers,
                rows: processedItems,
                groupByCaseNumber: bizagiConfig.groupByCaseNumber,
                securityGraphicQuery: bizagi.menuSecurity.GraphicQuery,
                resultList: resultList
            }, {
                getRadNumberColumnIndex: function () {
                    var data = this.data;
                    var index = -1;
                    for (var i = 0, l = data.headers.length; i < l; i++) {
                        if (data.headers[i].fieldName == "I_radNumber") {
                            index = i;
                        }
                    }
                    return index;
                },
                showColumn: function (columnIndex) {
                    var index = this.getRadNumberColumnIndex();
                    return (this.data.groupByCaseNumber && index == columnIndex) ? ' hidden ' : "";
                },
                createGroupedHeader: function (rowIndex) {
                    var data = this.data.resultList;
                    var result = false;
                    var radNumber = this.getRadNumber(data.rows[rowIndex]);
                    if (this.data.groupByCaseNumber) {
                        if (rowIndex == 0) {
                            result = true;
                        } else {
                            var previousRadNumber = this.getRadNumber(data.rows[rowIndex - 1]);
                            if (radNumber != previousRadNumber) {
                                result = true;
                            }
                        }
                    }
                    return result;
                },
                getRadNumber: function (row) {
                    var index = this.getRadNumberColumnIndex();
                    return (index >= 0) ? row.data[index] : "";
                }
            }),
            invalidateForm = $.tmpl(self.invalidateContentTmpl, {}),
            reassignForm = $.tmpl(self.reassignContentTmpl, {});

        $("#mainForm", content).hide();
        $("#dinamicContent", content).html(resultTemplate);

        if (!disableInvalidate) {
            $(".case-search-action-wrapper", content).append(invalidateForm);
        }
        $(".case-search-action-wrapper", content).append(reassignForm);

        $("#generalTitle").html(bizagi.localization.getResource("workportal-widget-admincasesearch-table-title"));
        $("#btn-admin-case-search-clear", content).hide();
        $("#btn-admin-case-search", content).hide();
        $("#btn-admin-case-back", content).css("display", "inline");

        self.setupActivitiesLink(content);
        self.setupGraphicQueryEvent(content);
        self.selectedItemsPersistence(content);
    },

    selectedItemsPersistence: function (content) {
        var self = this;
        var item = "";

        $.each(self.selectedCaseAdmin, function (index, value) {
            item = "input:checkbox[name=CaseAdmin][value=" + value + "]";
            $(item, content).prop("checked", true);
        });

        $.each(self.selectedWorkItemAdmin, function (index, value) {
            item = "input:checkbox[name=workItemAdmin][value='" + value + "']";
            $(item, content).prop("checked", true);
        });

    },

    /*
     *
     */
    preprocessResultList: function (headers, resultList) {
        var self = this;

        var processedItems = [],
            length = resultList.rows.length,
            i = 0;

        for (; i < length; i++) {
            processedItems.push(self.processResultItem(headers, resultList.rows[i]));
        }

        return processedItems;
    },

    /*
     * Process each result item
     */
    processResultItem: function (headers, rowItem) {
        var self = this;

        var rowItemData = rowItem.data,
            idCase = rowItem.idCase,
            idWorkflow = rowItem.idWorkFlow,
            radNumber = rowItem.radNumber,
            idParentCase = rowItem.idParentCase,
            isSubProcess = rowItem.isSubprocess;

        var resultArray = [],
            firstRowItem = [];

        //Handle the task elements
        var taskElements,
            taskElementsLength;

        var currentTaskObj;

        var taskColumnIndex = [],
            taskColumnIndexLength;

        var j = -1,
            columnIndex = 0;

        var resultTaskArray = false;

        firstRowItem.push({
            id: "checkCaseAdmin",
            value: idCase,
            radNumber: radNumber,
            idParentCase: idParentCase,
            isSubProcess: isSubProcess
        });

        while (j++ < headers.length - 1) {

            switch (headers[j].fieldName) {
                case self.columnsID.caseNumber:
                    //Insert case number
                    firstRowItem.push({
                        id: "caseNumber",
                        value: {
                            'idCase': idCase,
                            'caseNumber': rowItemData[columnIndex]
                        }
                    });

                    columnIndex++;
                    break;

                case self.columnsID.process:
                    //Insert process name
                    firstRowItem.push({
                        id: "idWorkItem",
                        value: rowItemData[columnIndex]
                    });

                    columnIndex++;
                    break;

                case self.columnsID.userName:
                case self.columnsID.userfullName:
                case self.columnsID.task:
                case self.columnsID.taskDueDate:

                    //Gets the row elements if is not already assigned to taskElements array
                    if (taskElements === undefined) {
                        var k = rowItemData.length;
                        while (k-- > 0) {
                            if (Array.isArray(rowItemData[k])) {
                                taskElements = rowItemData[k];

                                //Notifies the existence of the array of task elements
                                resultTaskArray = true;
                                break;
                            }
                        }
                        columnIndex++;
                    }

                    //set the current task obj
                    if (resultTaskArray) {

                        currentTaskObj = taskElements[0];

                        if (self.columnsID.userName == headers[j].fieldName) {
                            firstRowItem = firstRowItem.concat(self.processTaskObjectUser(currentTaskObj));

                            if (taskColumnIndex.indexOf(self.columnsID.userName) == -1) {
                                taskColumnIndex.push(self.columnsID.userName);
                                //columnIndex++;
                            }
                        } else if (self.columnsID.userfullName == headers[j].fieldName) {
                            firstRowItem = firstRowItem.concat(self.processTaskObjectUser(currentTaskObj));

                            if (taskColumnIndex.indexOf(self.columnsID.userfullName) == -1) {
                                taskColumnIndex.push(self.columnsID.userfullName);
                                //columnIndex++;
                            }
                        } else if (self.columnsID.task == headers[j].fieldName) {
                            firstRowItem = firstRowItem.concat(self.processTaskObject(currentTaskObj, idCase));

                            if (taskColumnIndex.indexOf(self.columnsID.task) == -1) {
                                taskColumnIndex.push(self.columnsID.task);
                                //columnIndex++;
                            }
                        } else if (self.columnsID.taskDueDate == headers[j].fieldName) {
                            firstRowItem = firstRowItem.concat(self.processTaskObjectDate(currentTaskObj));

                            if (taskColumnIndex.indexOf(self.columnsID.taskDueDate) == -1) {

                                //Removes the unecessary due date
                                if (headers[j].fieldName == self.columnsID.taskDueDate) {
                                    rowItemData.splice(columnIndex, 1);
                                }

                                taskColumnIndex.push(self.columnsID.taskDueDate);
                                //columnIndex++;
                            }
                        }
                        //TODO : userLocation logic in case its come inside the task array
                    } else {
                        if (headers[j].fieldName == self.columnsID.taskDueDate) {
                            //inserts the estimated Solution date in a object
                            firstRowItem = firstRowItem.concat({
                                'estimatedSolutionDate': rowItemData[j]
                            });

                            if (taskColumnIndex.indexOf(self.columnsID.taskDueDate) == -1)
                                taskColumnIndex.push(self.columnsID.taskDueDate);
                        }
                    }

                    break;
                //TODO : create case logic for single element, or create the required logic whe userLocation comes in the task list array            
                /*
                 case self.columnsID.userLocation:
                 break;
                 /**/


                case self.columnsID.processCreationDate:
                    //Creation Date
                    firstRowItem.push({
                        id: "processCreationDate",
                        value: rowItemData[columnIndex]
                    });

                    columnIndex++;
                    break;

                case self.columnsID.processDueDate:
                    //Task Due Date
                    firstRowItem.push({
                        id: "processDueDate",
                        value: rowItemData[columnIndex]
                    });

                    columnIndex++;
                    break;

                default:

                    var resultValue = bizagi.util.formatValueByDataType(rowItemData[columnIndex], headers[j].type);

                    firstRowItem.push({
                        id: "customField",
                        value: resultValue
                    });

                    columnIndex++;
                    break;
            }
        }
        ;

        //Inserts view Process Column
        firstRowItem.push({
            id: "viewProcess",
            value: {
                'idCase': idCase,
                'idworkflow': idWorkflow
            }
        });

        //Insert the first row element
        resultArray.push({
            attr: "first_row",
            data: firstRowItem
        });

        taskElementsLength = taskElements ? taskElements.length : 0;

        //If there is more task, add the remaining rows
        if (taskElementsLength > 1) {
            taskColumnIndexLength = taskColumnIndex.length;
            for (var i = 1; i < taskElementsLength; i++) {

                var taskData = [],
                    k = -1;
                //Adds the elements in the right order as the columns are

                while (k++ < taskColumnIndexLength - 1) {
                    if (taskColumnIndex[k] == self.columnsID.task)
                        taskData.push(self.processTaskObject(taskElements[i], idCase));
                    else if (taskColumnIndex[k] == self.columnsID.taskDueDate)
                        taskData.push(self.processTaskObjectDate(taskElements[i]));
                    else if (taskColumnIndex[k] == self.columnsID.userName)
                        taskData.push(self.processTaskObjectUser(taskElements[i]));
                    else if (taskColumnIndex[k] == self.columnsID.userfullName)
                        taskData.push(self.processTaskObjectUser(taskElements[i]));
                }

                resultArray.push({
                    attr: "next_row",
                    data: taskData
                });
            }
        }

        return {
            data: resultArray,
            totalTask: taskElementsLength
        };
    },

    /*
     *   Process each task object
     */
    processTaskObject: function (taskObject, idCase) {
        var obj = {
            'taskName': taskObject.taskName,
            'colorState': taskObject.colorState,
            'taskType': taskObject.taskType,
            'idCase': idCase,
            'idWorkItem': taskObject.idWorkItem,
            'idTask': taskObject.idTask
        };
        taskObject.taskType === "Wait" ? obj.skip = true : "";
        return obj;
    },

    /*
     * Process task object detecting if is has or not estimated solution date
     */
    processTaskObjectDate: function (taskObject) {
        var obj = {};
        (taskObject.estimatedSolutionDate) ? obj.estimatedSolutionDate = taskObject.estimatedSolutionDate : obj.estimatedSolutionDate = "";
        taskObject.taskType === "Wait" ? obj.skip = true : "";

        return obj;
    },

    /*
     * Process task object detecting if is has or not estimated solution date
     */
    processTaskObjectUser: function (taskObject) {
        var obj = {};
        (taskObject.assignee) ? obj.userName = taskObject.assignee : obj.userName = "";

        return obj;
    },

    /*
     * Invalidate selected cases
     */
    invalidateCases: function (content) {
        var self = this;
        var parentCases = "";
        var messageConfirmation = "";
        var selectedCases = {
            cases: []
        };

        $("input:checkbox[name=CaseAdmin]:checked", content).each(function () {
            var val = $(this).val();

            if ($(this).data("subprocess")) {
                parentCases = parentCases + " " + $(this).data("parentcase") + ",";
            }
            selectedCases.cases.push({
                idCase: val
            });
        });

        if (selectedCases.cases.length == 0) {
            bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admincasesearch-invalidate-empty-msg"), "Bizagi", "warning");
        } else {

            messageConfirmation = (bizagi.util.isEmpty(parentCases)) ? bizagi.localization.getResource("workportal-widget-admincasesearch-invalidate-confirm-msg") : bizagi.localization.getResource("workportal-widget-admincasesearch-invalidate-subprocess-confirm-msg") + parentCases.substring(0, (parentCases.length - 1));
            var customOptions = {
                dialogClass: "widget-admincasesearch-invalidate-cases-confirm",
                width: 400,
                minWidth: 400
            };
            $.when(bizagi.showConfirmationBox(messageConfirmation, "Bizagi", "warning", null, customOptions))
                .done(function () {
                    var reason = $("#txtReason", content).val();
                    var params = {
                        action: "abort",
                        cases: JSON.stringify(selectedCases),
                        reason: reason
                    };

                    $.when(self.dataService.abortReassignItems(params)).done(function (abortResult) {
                        self.showActionResultFrame(content, abortResult.response, "invalidate");
                    }).fail(function (error) {
                        bizagi.log(error);
                    });
                });
        }
    },

    /*
     * Reassign selected tasks
     */
    showReassignTasksFrame: function (content) {
        var self = this;
        var selectedTasks = {
            cases: []
        };
        var selectedTasksToShow = [];

        $("input:checkbox[name=workItemAdmin]:checked", content).each(function () {
            var tasks = $(this).val();
            tasks = tasks.split("|");
            selectedTasks.cases.push({
                idCase: tasks[0],
                idWorkItem: tasks[1]
            });
            selectedTasksToShow.push({
                taskItem: tasks[0] + ": " + tasks[2],
                idWorkItem: tasks[1]
            });
        });

        if (selectedTasksToShow.length == 0) {
            bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admincasesearch-reassign-empty-msg"), "Bizagi", "warning");
        } else {
            self.selectedTasks = selectedTasks;
            self.selectedTasksToShow = selectedTasksToShow;
            self.showReassignForm(content, selectedTasksToShow);
        }
    },

    /*
     * Show Reassign frame
     */
    showReassignForm: function (content, selectedTasksToShow) {
        var self = this;
        self.buttonBackAction = "backToCases";
        var resultTemplate = $.tmpl(self.reassignFormTmpl, {
            tasks: selectedTasksToShow
        });

        $("#dinamicContent", content).hide();
        $("#dinamicContent2", content).html(resultTemplate);
        $("#btn-admin-case-search-clear", content).hide();
        $("#btn-admin-case-search", content).hide();
        $("#generalTitle").html(bizagi.localization.getResource("workportal-widget-admincasesearch-reassign-title"));
        self.setupUsersSearchForm();

    },

    /*
     * Reassign one or more taskt to other user
     */
    reassignTasks: function () {
        var self = this;
        var content = self.getContent();

        var params = {
            action: "reassignItems",
            cases: JSON.stringify(self.selectedTasks),
            idNewUser: self.selectedUserId
        };

        $.when(self.dataService.abortReassignItems(params)).done(function (reassignResult) {
            self.showActionResultFrame(content, reassignResult.response, "reassign");
        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    /*
     * Show Invalidate / Reassign Result frame
     */
    showActionResultFrame: function (content, result, type) {
        var self = this;
        var action = result.length > 1 ? "-several" : "";
        var items = "";
        var itemsFailed = "";
        var resultStatus = [];
        action = type + action;

        if (action == "invalidate") {
            for (var i = 0; i < result.length; i++) {
                if (result[i].deleted == true) {
                    items = result[i].idCase;
                    items += (i + 1) < result.length ? ", " : "";
                    resultStatus[0] = true;
                } else {
                    itemsFailed = result[i].idCase;
                    itemsFailed += (i + 1) < result.length ? ", " : "";
                    resultStatus[1] = false;
                }
            }
        } else if (action == "invalidate-several") {
            for (var i = 0; i < result.length; i++) {
                if (result[i].deleted == true) {
                    items += result[i].idCase;
                    items += (i + 1) < result.length ? ", " : "";
                    resultStatus[0] = true;
                } else {
                    itemsFailed += result[i].idCase;
                    itemsFailed += (i + 1) < result.length ? ", " : "";
                    resultStatus[1] = false;
                }
            }
        } else if (action == "reassign") {
            for (var i = 0; i < result.length; i++) {
                if (result[i].reassigned == true) {
                    items += result[i].idCase;
                    items += (i + 1) < result.length ? ", " : "";
                    resultStatus[0] = true;
                } else {
                    itemsFailed = result[i].idCase;
                    itemsFailed += (i + 1) < result.length ? ", " : "";
                    resultStatus[1] = false;
                }
            }
        } else if (action == "reassign-several") {
            items += "<br/><br/>";
            itemsFailed += "<br/><br/>";
            for (var i = 0; i < result.length; i++) {
                if (result[i].reassigned == true) {
                    items += result[i].idCase + "<br/>";
                    resultStatus[0] = true;
                } else {
                    itemsFailed += result[i].idCase + "<br/>";
                    resultStatus[1] = false;
                }
            }
            items += "<br/>";
            itemsFailed += "<br/>";
        }

        //load result template
        var resultTemplate = $.tmpl(self.actionResultContentTmpl, {
            action: action,
            resultStatus: resultStatus,
            exceptionMessage: itemsFailed.substring(itemsFailed.indexOf('|') + 1)
        });
        resultTemplate = resultTemplate[0].innerHTML.replace("{0}", "<strong>" + items + "</strong>");
        var idCase = itemsFailed.substring(0, itemsFailed.indexOf('|') === -1 ? undefined : itemsFailed.indexOf('|'));
        resultTemplate = resultTemplate.replace("{3}", "<strong>" + idCase + "</strong>");
        resultTemplate = resultTemplate.replace("{1}", self.selectedUserName);
        resultTemplate = resultTemplate.replace("{1}", self.selectedUserName);

        //reset and load respective result data and elements
        if (type == "invalidate") $("#generalTitle").html(bizagi.localization.getResource("workportal-widget-admincasesearch-invalidate-result-title"));
        $("#mainForm", content).html("");
        $("#dinamicContent", content).css("display", "inline");
        $("#dinamicContent", content).html(resultTemplate);
        $("#dinamicContent2", content).remove();
        $("#usersTable", content).remove();
        $("#btn-admin-case-back", content).css("display", "none");
        $("#btn-admin-case-search-clear", content).css("display", "none");
        $("#btn-admin-case-search", content).css("display", "none");
        $("#btn-admin-case-finish", content).css("display", "inline");
    },


    //******************************** EVENTS ********************************//

    /*
     * Implement main buttons behaviour
     */
    setupMainButtons: function () {
        var self = this,
            content = self.getContent(),
            buttons = $.tmpl(self.buttonContentTmpl, {});

        content.append(buttons);

        var widgetButtonSet = $("#case-search-log-data-buttonset", content);

        $("#btn-admin-case-search-clear", widgetButtonSet).click(function (e) {

            //clear all fields
            $(".biz-wp-input-text", content).val("");
            $(".biz-wp-form-datepicker", content).val("");
            self.setupProcessTree();

        });

        $("#btn-admin-case-search", widgetButtonSet).click(function (e) {

            var idAppToSend = "",
                idCategorytoSend = "",
                idProcessToSend = "",
                errorMessage = "",
                errorFieldName = "";

            var selectedProcessRoute = self.processTree.getTreeRouteSelected();

            if (selectedProcessRoute.length > 0) {
                if (selectedProcessRoute.length == 2) {
                    idAppToSend = selectedProcessRoute[1];
                    idProcessToSend = selectedProcessRoute[0];
                    idCategorytoSend = "";
                }
                else {
                    idAppToSend = selectedProcessRoute[selectedProcessRoute.length - 1];
                    //In admin search it isn't necesary add the categoryId param
                    idCategorytoSend = "";
                    idProcessToSend = selectedProcessRoute[0];
                }
            }

            var numberResults = parseInt($("#resultsNumber").val());
            (bizagi.util.isNumeric(numberResults)) ? self.maxElemShow = numberResults : self.maxElemShow = self.defaultMaxRows;

            var dateFrom = $("#sinceDate");
            dateFrom = dateFrom.datepicker("getDate");
            dateFrom = dateFrom ? bizagi.util.dateFormatter.formatInvariant(dateFrom, false) : "";

            var dateTo = $("#toDate");
            dateTo = dateTo.datepicker("getDate");
            dateTo = dateTo ? bizagi.util.dateFormatter.formatInvariant(dateTo, false) : "";

            var params = {
                h_action: "getCases",
                I_ProcessState: "Running",
                h_idApp: "",
                I_Users: "ALL",
                eventAsTask: true,
                orderType: 1,
                order: "",
                orderField: "",
                group: (bizagiConfig.groupByCaseNumber) ? "T_RADNUMBER" : null,
                I_radNumber: $("#caseInput").val(),
                I_idWFClass: idProcessToSend,
                I_USERNAME: $("#userNameInput").val(),
                I_USERFULLNAME: $("#userFullNameInput").val(),
                I_USERPOSITION: $("#userPositionInput").val(),
                I_From__CreationDate: dateFrom ? dateFrom : $("#sinceDate").val(),
                I_To__CreationDate: dateTo ? dateTo : $("#toDate").val(),
                h_idWFClassAuth: "",
                I_idCategory: idCategorytoSend,
                I_idApplication: idAppToSend,
                PageSize: self.maxElemShow
            };

            if (params["I_From__CreationDate"] != "" && !bizagi.util.isDate(params["I_From__CreationDate"])) {
                errorMessage = bizagi.localization.getResource("workportal-general-invalid-date");
                errorFieldName = bizagi.localization.getResource("workportal-widget-admincasesearch-date-since");
                errorMessage = errorMessage.replace("{0}", errorFieldName);
                bizagi.showMessageBox(errorMessage, "Bizagi", "warning");
            } else if (params["I_To__CreationDate"] != "" && !bizagi.util.isDate(params["I_To__CreationDate"])) {
                errorMessage = bizagi.localization.getResource("workportal-general-invalid-date");
                errorFieldName = bizagi.localization.getResource("workportal-widget-admincasesearch-to-date");
                errorMessage = errorMessage.replace("{0}", errorFieldName);
                bizagi.showMessageBox(errorMessage, "Bizagi", "warning");
            } else {
                self.searchParams = params;
                self.selectedCaseAdmin = [];
                self.selectedWorkItemAdmin = [];
                self.findResults(content, params);
            }
        });

        $("#btn-admin-case-back", widgetButtonSet).click(function (e) {
            if (self.buttonBackAction == "backToMainForm") {
                self.backToMainForm();
            } else if (self.buttonBackAction == "backToCases") {
                self.backToCases();
            }
        });

        $("#btn-admin-case-finish", widgetButtonSet).click(function (e) {
            self.setupData();
        });

        //Result per page only number search
        $("#resultsNumber", content).bind("keypress", function (e) {
            var unicode = e.charCode ? e.charCode : e.keyCode
            if (unicode != 8) {
                if (unicode < 48 || unicode > 57)
                    return false
            }
        });
    },

    /**
     * Get date from DatePicker
     * @param controlIDSelector
     * @returns {string}
     */
    getDateInvariantByControlIDSelector: function(controlIDSelector){
        var paramDate = "";
        var valueDatePicker = $(controlIDSelector).datepicker("getDate");

        if(valueDatePicker !== null){
            try{
                paramDate = bizagi.util.dateFormatter.formatInvariant(valueDatePicker, false);
            }
            catch(err){
                paramDate = "";
                $(controlIDSelector).val("");
            }
        }
        return paramDate;
    },

    /*
     * Back to Cases
     */
    backToCases: function () {

        var self = this;
        var content = self.getContent();

        self.buttonBackAction = "backToMainForm";
        $("#dinamicContent", content).show();
        $("#dinamicContent2", content).html("");
        $("#usersTable").remove();
        $("#generalTitle").html(bizagi.localization.getResource("workportal-widget-admincasesearch-table-title"));
        $("#btn-admin-case-search-clear", content).hide();
        $("#btn-admin-case-search", content).hide();
    },

    /*
     * Back to Main Form
     */
    backToMainForm: function () {

        var self = this;
        var content = self.getContent();

        $("#mainForm", content).show();
        $("#dinamicContent", content).html("");
        $("#generalTitle").html(bizagi.localization.getResource("workportal-widget-admincasesearch-subtitle"));
        $("#btn-admin-case-search-clear", content).show();
        $("#btn-admin-case-search", content).show();
        $("#btn-admin-case-back", content).css("display", "none");
    },

    /*
     * Set event to reassign link in users table
     */
    assignEventReassignLinks: function (userId, userName) {
        var self = this;
        self.selectedUserId = userId;
        self.selectedUserName = userName;
        self.reassignTasks();
    },

    /*
     * Implement actions buttons behaviour
     */
    setupActionsButton: function (content) {
        var self = this;

        $("input:checkbox[name=CaseAdmin]", content).click(function (event) {
            valueSelected = $(this).val();
            ($(this).is(":checked")) ? self.selectedCaseAdmin.push(valueSelected) : self.selectedCaseAdmin.splice($.inArray(valueSelected, self.selectedCaseAdmin), 1);
        });

        $("input:checkbox[name=workItemAdmin]", content).click(function (event) {
            valueSelected = $(this).val();
            ($(this).is(":checked")) ? self.selectedWorkItemAdmin.push(valueSelected) : self.selectedWorkItemAdmin.splice($.inArray(valueSelected, self.selectedWorkItemAdmin), 1);
        });

        //boton invalidar
        $("#btn-admin-case-invalidate", content).click(function (e) {
            self.invalidateCases(content);
        });

        //boton reasignar
        $("#btn-admin-case-reassign", content).click(function (e) {
            self.showReassignTasksFrame(content);
        });
    },

    /*
     * Manage cases table links events(cases, activities and view workflow)
     */
    setupActivitiesLink: function (content) {
        var self = this;

        // Add click event to task (Activity) link
        $(".activityClicked", content).click(function () {
            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: $(this)[0].getAttribute("data-idCase"),
                idWorkItem: $(this)[0].getAttribute("data-idworkItem"),
                idTask: $(this)[0].getAttribute("data-idTask")
            });
            self.publish("closeCurrentDialog");

        });

        // Add click event to case link
        $(".caseClicked", content).click(function () {
            self.publish("executeAction", {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: $(this)[0].getAttribute("data-idCase"),
                idWorkItem: "",
                idTask: ""
            });
            self.publish("closeCurrentDialog");
        });

        // Add click event to column header
        $(".cases-column-header", content).click(function () {
            var columnOrderId = $(this)[0].getAttribute("data-columnorder");
            var columnOrderBy = $(this)[0].getAttribute("data-ordertype");
            var columnOrderName = $(this)[0].getAttribute("data-columnOrderName");

            if (columnOrderBy == "1") {
                columnOrderBy = 0;
            } else {
                columnOrderBy = 1;
            }

            self.searchParams.order = columnOrderId;
            self.searchParams.orderType = columnOrderBy;
            self.searchParams.orderField = columnOrderName;
            self.findResults(content, self.searchParams, self.searchParams.Page);

        });
    },

    /*
     * Set up graphic query event
     */
    setupGraphicQueryEvent: function (content) {

        var self = this;

        // Add click event to view workflow
        $(".biz-wp-diagram-view-icon", content).click(function () {
            var idCase = $(this).data("idcase");
            var idWorkflow = $(this).data('idworkflow');
            self.showGraphicQuery({
                idCase: idCase,
                idWorkflow: idWorkflow
            });
        });
    }

});