/**
 * Name: BizAgi Desktop Widget Asynchronous Activities Console Implementation
 *
 * @author Christian Collazos
 */


bizagi.workportal.widgets.admin.async.activities.extend("bizagi.workportal.widgets.admin.async.activities", {
    ASYNC_CHECK_TIMER: 3000
}, {
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "async": bizagi.getTemplate("bizagi.workportal.desktop.widget.async"),
            "admin.async.activities": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities").concat("#ui-bizagi-workportal-widget-admin-async-activities"),
            "admin.async.activities.tabs": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities").concat("#ui-bizagi-workportal-widget-admin-async-activities-tabs"),
            "admin.async.activities.tab1": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities").concat("#ui-bizagi-workportal-widget-admin-async-activities-tab1"),
            "admin.async.activities.tab2": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities").concat("#ui-bizagi-workportal-widget-admin-async-activities-tab2"),
            "admin.async.activities.log": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities").concat("#ui-bizagi-workportal-widget-admin-async-activities-log"),
            "admin.async.activities.pagination": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities").concat("#ui-bizagi-workportal-widget-admin-async-activities-pagination"),
            "admin.async.activities.error.page": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities").concat("#ui-bizagi-workportal-widget-admin-async-activities-error-page"),
            "admin.async.activities.processing": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities").concat("#ui-bizagi-workportal-widget-admin-async-activities-processing"),
            useNewEngine: false
        });
    },

    loadtemplates: function () {
        var self = this;
        //Template vars 
        self.tabsTmpl = self.getTemplate("admin.async.activities.tabs");
        self.tab1Tmpl = self.getTemplate("admin.async.activities.tab1");
        self.tab2Tmpl = self.getTemplate("admin.async.activities.tab2");
        self.logTmpl = self.getTemplate("admin.async.activities.log");
        self.paginatorTmpl = self.getTemplate("admin.async.activities.pagination");
        self.errorPage = self.getTemplate("admin.async.activities.error.page");
        self.processingPage = self.getTemplate("admin.async.activities.processing");
    },

    postRender: function () {
        var self = this;
        self.maxElemShow = 10;
        self.maxPageToShow = 5;

        //load form data
        self.setupData();
    },

    /*
     * Setup form data
     */
    setupData: function () {
        var self = this;

        self.setupInitialData();
        self.setupTabs();
    },

    /*
     * Load initial data
     */
    setupInitialData: function () {
        var self = this,
            content = self.getContent(),
            mainContent = $(".async-act-main-content", content);

        //set content form to default
        $("#generalTitle", content).html(bizagi.localization.getResource("workportal-widget-admin-asyncactivities-subtitle"));
        mainContent.html("");
        $("#main-screen", content).show();
        $("#dinamic-screen", content).html("");

        //append fields to wrapper
        var fields = $.tmpl(self.tabsTmpl, {});
        mainContent.append(fields);
        self.loadTabsContent();

    },

    /*
     * load tabs
     */
    loadTabsContent: function () {
        var self = this,
            content = self.getContent(),
            paramsTab1 = "",
            paramsTab2 = "";

        paramsTab1 = {
            action: "getActivities",
            page: 1,
            pageSize: self.maxElemShow
        };
        paramsTab2 = {
            action: "getActivitiesByTask",
            page: 1,
            pageSize: self.maxElemShow
        };

        self.renderTab1Table(content, paramsTab1);
        self.renderTab2Table(content, paramsTab2);

    },

    /*
     * Apply tabs plugin
     */
    setupTabs: function () {
        var self = this,
            content = self.getContent();

        $("#async-tabs", content).tabs();
    },

    /*
     * Find async activities
     */
    renderTab1Table: function (content, params, pageToShow) {
        var self = this;
        var tableWrapper = $("#main-screen", content);

        //If there is not a page to Show, begins whith the fist one
        pageToShow ? params.page = pageToShow : params.page = 1;

        $.when(
            self.dataService.asyncActivitiesServices(params)
        ).done(function (resultList) {

            //clean old results
            $("#async-tabs-1").remove();

            //Keep in track the total Records
            self.totalRecords = resultList.records;
            //keep in track the total pages
            self.totalPages = resultList.total;

            if (resultList.rows.length) {

                var tab1Content = $.tmpl(self.tab1Tmpl, {
                    rows: resultList.rows
                });
                // Format invariant dates
                bizagi.util.formatInvariantDate(tab1Content, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));

                $("#async-tabs", content).append(tab1Content);
                self.setupTab1ActivitiesLink();
                self.setupActionsButton();

                var pageToshow = (self.maxPageToShow > self.totalPages) ? self.totalPages : self.maxPageToShow,
                    summaryWrapper = $("#async-table-pager-wrapper"),
                    pagerData = {},
                    paginationHtml;

                // show or hide "load more" button
                pagerData.pagination = (self.totalPages > 1) ? true : false;
                pagerData.page = resultList.page;
                pagerData.pages = {};
                pagerData.additionalparameters = true;
                pagerData.totalPages = self.totalPages;
                pagerData.totalRecords = self.totalRecords;

                for (var i = 1; i <= pageToshow; i++) {
                    pagerData["pages"][i] = {
                        "pageNumber": i
                    };
                }

                //load and append the paginator to the result table
                paginationHtml = $.tmpl(self.paginatorTmpl, pagerData).html();
                summaryWrapper.append(paginationHtml);

                //add data and behaviour to pager
                $("ul").bizagiPagination({
                    maxElemShow: self.maxElemShow,
                    totalPages: self.totalPages,
                    actualPage: resultList.page,
                    listElement: $(".pager-content", tableWrapper),
                    clickCallBack: function (options) {
                        self.renderTab1Table(content, params, options.page);
                    }
                });


            } else {
                $("#async-tabs", content).hide();
                $("#tabs-wrapper", content).append(bizagi.localization.getResource("workportal-general-no-records-found"));
            }



        }).fail(function (error) {
            bizagi.log(error);
        });

    },

    /*
     * Find async grouped activities
     */
    renderTab2Table: function (content, params) {
        var self = this;

        $.when(
            self.dataService.asyncActivitiesServices(params)
        ).done(function (resultList) {

            //clean old results
            $("#async-tabs-2").remove();

            if (resultList.rows.length) {

                var resultArr = [],
                    resultRows = resultList.rows,
                    idInsertedArr = [],
                    arrPossition = 0;

                //Organize data in group structure
                for (var i = 0; i < resultRows.length; i++) {

                    var idWfClass = resultRows[i].idWfClass,
                        total = Number(resultRows[i].count);

                    if (idInsertedArr.indexOf(idWfClass) < 0) {

                        idInsertedArr.push(idWfClass);

                        resultArr[arrPossition] = {
                            wfClsDisplayName: resultRows[i].wfClsDisplayName,
                            idWfClass: resultRows[i].idWfClass,
                            childs: [
                                {
                                    idTask: resultRows[i].idTask,
                                    tskDisplayName: resultRows[i].tskDisplayName,
                                    count: resultRows[i].count
                                    }
                                ]
                        };

                        for (var j = i + 1; j < resultRows.length; j++) {
                            if (idWfClass == resultRows[j].idWfClass) {
                                total += Number(resultRows[j].count);
                                resultArr[arrPossition].childs.push({
                                    idTask: resultRows[j].idTask,
                                    tskDisplayName: resultRows[j].tskDisplayName,
                                    count: resultRows[j].count
                                });
                            }
                        }

                        resultArr[arrPossition].count = total;
                        arrPossition += 1;
                    }

                }

                //insert data into template and append it to the tab
                var tab2Content = $.tmpl(self.tab2Tmpl, {
                    rows: resultArr
                });
                $("#async-tabs", content).append(tab2Content);
                self.setupTab2ActivitiesLink();

            }


        }).fail(function (error) {
            bizagi.log(error);
        });


    },

    /*
     * Execute retry
     */
    executeActivity: function (params) {

        var self = this,
            content = self.getContent(),
            mainScreen = $("#main-screen", content),
            dinamicScreen = $("#dinamic-screen", content),
            errorMessage = "",
            dinamiccontent = "";

        $.when(
            self.dataService.asyncActivitiesServices(params)
        ).done(function (resultList) {


            if (resultList.executed) {
                var def = $.Deferred();

                $.when(self.checkAsycnExecutionState(1, params.idCase, params.idAsynchWorkitem, def)).done(function () {
                    self.goToCase(params.idCase);
                }).fail(function () {
                    errorMessage = bizagi.localization.getResource("workportal-widget-admin-asyncactivities-error-message");
                    dinamiccontent = $.tmpl(self.errorPage, {
                        errorMessage: errorMessage
                    });
                    dinamicScreen.html("");
                    dinamicScreen.append(dinamiccontent);
                    self.setupErrorPageLink("#go-to-pending");

                });

            } else {
                errorMessage = bizagi.localization.getResource("workportal-widget-admin-asyncactivities-error-retry");
                dinamiccontent = $.tmpl(self.errorPage, {
                    errorMessage: errorMessage
                });
            }

        }).fail(function (e) {
            bizagi.log(e);
        });
    },

    /*
     * Call server to know status of the activity (3 retries of 1 second each)
     */
    getRetryStatus: function (counter, idCase, def) {
        var self = this;
        var params = {
            action: "getAsyncExecution",
            idCase: idCase
        };

        setTimeout(function () {

            $.when(
                self.dataService.getAsynchExecutionState({
                    idCase: idCase,
                    idAsynchWorkitem: idAsynchWorkitem
                })
            ).done(function (response) {

                if (response.status != "error") {
                    def.resolve();
                }

            }).fail(function (e) {
                if (counter <= 3) {
                    counter += 1;
                    self.getRetryStatus(counter, idCase, idAsynchWorkitem, def);
                } else {
                    def.reject();
                }
            });

        }, 1000);

        return def.promise();
    },

    /**
     *  Check execution state every time is called
     */
    checkAsycnExecutionState: function (counter, idCase, idAsynchWorkitem, def) {
        var self = this,
            content = self.getContent(),
            mainScreen = $("#main-screen", content),
            dinamicScreen = $("#dinamic-screen", content),
            dinamiccontent = "",
            wrapper = $("#ui-bizagi-wp-async-box", content);

        $.when(self.dataService.getAsynchExecutionState({
            idCase: idCase,
            idAsynchWorkitem: idAsynchWorkitem
        })).done(function (response) {
            var template = self.getTemplate("async");

            // verify errors in response
            if (response.state == "Error" && typeof (response.errorMessage) == "undefined") {
                // Change default error
                response.errorMessage = bizagi.localization.getResource("render-async-error");
            }

            // Render base template
            dinamiccontent = $.tmpl(template, response);
            mainScreen.hide();
            dinamicScreen.html("");
            dinamicScreen.append(dinamiccontent);
            $("#ui-bizagi-wp-async-box", content).css({
                "top": 0,
                "left": 0,
                "margin-top": 0,
                "margin-left": 0,
                "padding-top": 0,
                "margin-right": 0,
                "width": "96%",
                "max-height": "80",
                "height": "80"
            });

            self.setupErrorPageLink($("#link-go-to-inbox").find("a"));
            $("#link-back").css("display", "inline");
            self.setupBackToMainPage();

            // Check for finish signal
            if (response.state == "Processing") {
                // Check for non-error message
                if (response.errorMessage.length == 0) {
                    setTimeout(function () {
                        // Refresh widget after a timer
                        counter += 1;
                        self.checkAsycnExecutionState(counter, idCase, idAsynchWorkitem, def);

                    }, self.Class.ASYNC_CHECK_TIMER);
                }

            } else if (response.state == "Finished") {

                // Resolve main deferred
                def.resolve(self.content);
            }


        });

        return def.promise();
    },

    /*
     * Show log page
     */
    showLog: function (params, data, pageToShow) {
        var self = this,
            content = self.getContent();

        //If there is not a page to Show, begins whith the fist one
        pageToShow ? params.page = pageToShow : params.page = 1;

        $.when(
            self.dataService.asyncActivitiesServices(params)
        ).done(function (resultList) {



            //Keep in track the total Records
            self.totalRecords = resultList.records;
            //keep in track the total pages
            self.totalPages = resultList.total;

            if (resultList.response.length) {

                var logPage = $.tmpl(self.logTmpl, {
                    rows: resultList.response,
                    data: data
                });

                // Format invariant dates
                bizagi.util.formatInvariantDate(logPage, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));

                $("#dinamic-screen", content).html("");
                $("#dinamic-screen", content).append(logPage);
                self.setupLogButtons();

                var pageToshow = (self.maxPageToShow > self.totalPages) ? self.totalPages : self.maxPageToShow,
                    summaryWrapper = $("#log-table-pager-wrapper"),
                    pagerData = {},
                    paginationHtml;

                // show or hide "load more" button
                pagerData.pagination = (self.totalPages > 1) ? true : false;
                pagerData.page = resultList.page;
                pagerData.pages = {};
                pagerData.additionalparameters = true;
                pagerData.totalPages = self.totalPages;
                pagerData.totalRecords = self.totalRecords;

                for (var i = 1; i <= pageToshow; i++) {
                    pagerData["pages"][i] = {
                        "pageNumber": i
                    };
                }

                //load and append the paginator to the result table
                paginationHtml = $.tmpl(self.paginatorTmpl, pagerData).html();
                summaryWrapper.append(paginationHtml);

                //add data and behaviour to pager
                $("ul", summaryWrapper).bizagiPagination({
                    maxElemShow: self.maxElemShow,
                    totalPages: self.totalPages,
                    actualPage: resultList.page,
                    listElement: $(".pager-content", summaryWrapper),
                    clickCallBack: function (options) {
                        self.showLog(params, data, options.page);
                    }
                });
            } else {
                bizagi.showMessageBox(bizagi.localization.getResource("workportal-general-no-records-found"), "Bizagi", "warning");
            }

        }).fail(function (e) {
            bizagi.log(e);
        });


    },

    /*
     * Enable links on grouped tab
     */
    enableActivities: function (processId, taskId) {
        var self = this;
        var params = {
            action: "enableExecution",
            idTask: taskId,
            idWfClass: processId
        };

        $.when(
            self.dataService.asyncActivitiesServices(params)
        ).done(function (resultList) {
            self.setupData();
        }).fail(function (e) {
            bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-asyncactivities-error-enable"), "Bizagi", "warning");
        });
    },

    enableMultipleActivities: function (cases) {
        var self = this;
        var params = {
            action: "enableMultiple",
            cases: JSON.stringify(cases)
        };

        $.when(
            self.dataService.asyncActivitiesServices(params)
        ).done(function (resultList) {
            if (resultList.executed) {
                self.setupData();
            } else {
                bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-asyncactivities-error-enable"), "Bizagi", "warning");
            }
        }).fail(function (e) {
            bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-asyncactivities-error-enable"), "Bizagi", "warning");
        });
    },

    goToCase: function (idCase) {
        var self = this;

        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: idCase,
            idWorkItem: "",
            idTask: ""
        });
        self.publish("closeCurrentDialog");
    },

    //******************************** EVENTS ********************************//

    /*
     * Implement main buttons behaviour
     */
    setupActionsButton: function () {
        var self = this,
            content = self.getContent(),
            buttons = $.tmpl(self.buttonContentTmpl, {});

        content.append(buttons);

        $("#async-act-refresh-link", content).unbind();
        $("#async-act-refresh-link", content).click(function (e) {
            self.setupData();
        });

        $(".async-act-log-link", content).click(function (e) {

            var paramsLog = {
                action: "asyncExecutionLog",
                idCase: this.getAttribute("data-idCase"),
                idWorkItem: this.getAttribute("data-idWorkItem"),
                pageSize: self.maxElemShow,
                idAsynchWorkitem: this.getAttribute("data-idAsynchWorkitem")
            };
            var data = {
                idCase: this.getAttribute("data-idCase"),
                radNumber: this.getAttribute("data-radNumber"),
                taskName: this.getAttribute("data-taskName"),
                processName: this.getAttribute("data-processName")
            };

            $("#generalTitle").html(bizagi.localization.getResource("workportal-widget-admin-asyncactivities-activitieslog"));
            $("#main-screen", content).hide();

            self.showLog(paramsLog, data);

        });

        $(".async-act-retry-link", content).click(function (e) {

            var params = {
                action: "retryNow",
                idCase: this.getAttribute("data-idCase"),
                idWorkitem: this.getAttribute("data-idWorkItem"),
                processName: this.getAttribute("data-processName"),
                idAsynchWorkitem: this.getAttribute("data-idAsynchWorkitem"),
                taskName: this.getAttribute("data-taskName")
            };

            self.executeActivity(params);

        });

        $("#async-act-enable-checks", content).click(function () {
            var checkboxes = document.getElementsByName('enableChecks');
            var vals = {
                cases: []
            };
            for (var i = 0, n = checkboxes.length; i < n; i++) {
                if (checkboxes[i].checked) {
                    var idCase = checkboxes[i].value;
                    var idWorkItem = checkboxes[i].getAttribute("data-idWorkItem");
                    var idAsynchWorkitem = checkboxes[i].getAttribute("data-idAsynchWorkitem");
                    if (idCase != -1) {
                        idAsynchWorkitem = -1;
                    } else {
                        var idAsynchWorkitem = checkboxes[i].getAttribute("data-idAsynchWorkitem");
                    }
                    vals.cases.push({
                        idCase: idCase,
                        idWorkItem: idWorkItem,
                        idAsynchWorkitem: idAsynchWorkitem
                    });
                }
            }
            self.enableMultipleActivities(vals);
        });
    },

    /*
     * back button
     */
    setupLogButtons: function () {
        var self = this,
            content = self.getContent();

        $("#async-act-button-back", content).click(function (e) {
            $("#generalTitle").html(bizagi.localization.getResource("workportal-widget-admin-asyncactivities-subtitle"));
            $("#main-screen", content).show();
            $("#dinamic-screen", content).html("");
        });
    },

    /*
     * Manage cases table links events(cases and activities)
     */
    setupTab1ActivitiesLink: function (content) {
        var self = this;

        // Add click event to task (Activity) link
        $(".async-activity-click", content).click(function () {
            self.goToCase($(this)[0].getAttribute("data-idCase"));
        });

    },

    /*
     * Manage grouped tab events
     */
    setupTab2ActivitiesLink: function (content) {
        var self = this;

        $(".async-act-process-tree-link", content).click(function () {

            if ($("div", this).hasClass("biz-wp-tree-expand-icon")) {
                $("div", this).removeClass("biz-wp-tree-expand-icon");
                $("div", this).addClass("biz-wp-tree-collapse-icon");
                $(this).closest("tr").find(".async-act-childs").css("display", "block");
                $(this).closest("tr").find(".async-act-childs").addClass("clearfix");
            } else {
                $("div", this).removeClass("biz-wp-tree-collapse-icon");
                $("div", this).addClass("biz-wp-tree-expand-icon");
                $(this).closest("tr").find(".async-act-childs").css("display", "none");
                $(this).closest("tr").find(".async-act-childs").removeClass("clearfix");
            }
        });

        $(".async-act-enable-link").click(function () {
            var processId = this.getAttribute("data-idWfClass");
            var taskId = this.getAttribute("data-idTask") ? this.getAttribute("data-idTask") : 0;
            self.enableActivities(processId, taskId);
        });

    },

    /*
     * manage go to pending event
     */
    setupErrorPageLink: function (selector) {
        var self = this;

        $(selector).click(function () {

            var inbox = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX;
            var grid = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID;
            var actualWidget;
            var storeWidget = ($.isFunction(bizagi.cookie)) ? bizagi.cookie("bizagiDefaultWidget") : grid;

            switch (storeWidget) {
            case inbox:
                actualWidget = inbox;
                break;

            case grid:
                actualWidget = grid;
                break;
            default:
                actualWidget = grid;
                break;
            }


            self.publish("changeWidget", {
                widgetName: actualWidget
            });

            self.publish("closeCurrentDialog");

        });
    },

    /*
     * manage back link
     */
    setupBackToMainPage: function () {
        var self = this,
            content = self.getContent(),
            wrapper = $("#ui-bizagi-wp-async-box", content);

        $("#link-back", wrapper).click(function () {
            self.setupData();
        });
    }

});