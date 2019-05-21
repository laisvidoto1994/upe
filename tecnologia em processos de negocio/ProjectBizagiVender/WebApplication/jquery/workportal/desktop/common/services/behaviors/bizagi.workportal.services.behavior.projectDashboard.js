/**
 *   Name: Bizagi Workportal project Dashboard
 *   Author: Elkin Fernando Siabato Cruz
 *
 *   TODO: This widget is development with TDD. Always run test on this file, when modified it
 *
 *   Summary: This widget, get data information to determinate behavior menus dashboard,
 *   and determinate which context will be charged.
 */
bizagi.workportal.services.behaviors = bizagi.workportal.services.behaviors || {};
bizagi.workportal.services.behaviors.projectDashboard = function (dataService) {
    var self = this;
    self.dataService = dataService;
    /**
     * Constants
     */
    self.TYPE_WORKITEM_ACTIVITY = "ACTIVITY";//belong to plan
    self.TYPE_WORKITEM_TASK = "TASK";//belong to case

    self.NOTIFICATION_NAVIGATOR_BACK = "NAVIGATOR_BACK";
    self.CONTEXT_HOME = "HOME";
    self.CONTEXT_ACTIVITY = "ACTIVITY";
    self.CONTEXT_OVERVIEW = "OVERVIEW";
    self.CONTEXT_PLANACTIVITIES = "PLANACTIVITIES";
    self.CONTEXT_PLANCREATE = "PLANCREATE";
    self.CONTEXT_ACTIVITYPLAN = "ACTIVITYPLAN";
    self.CONTEXT_ACTIVITYPLANCREATE = "ACTIVITYPLANCREATE";
    self.CONTEXT_ACTIVITYPLANOVERVIEW = "ACTIVITYPLANOVERVIEW";

    self.dataDashboard = {};//data response
    self.dataDashboard.params = {};
    self.pendingContext = "HOME";

    self.init = function () {

    };

    self.getRadNumber = function (params, responseSummary, isContextualizedPlan) {
        var defer = $.Deferred();
        if (!isContextualizedPlan) {//is decontextualized
            $.when(self.getFirstParentPlan(responseSummary.idPlan)).done(function (responseFirstPlan) {
                if (responseFirstPlan) {
                    defer.resolve(responseFirstPlan.id);
                }
                else {
                    defer.resolve(responseSummary.idPlan);
                }

            });
        }
        else {
            defer.resolve(params.radNumber || params.idCase);
        }
        return defer.promise();
    };

    self.getRadNumberForPlanDashboard = function(idPlan, isContextualizedPlan){
        var self = this;
        var defer = $.Deferred();
        if(isContextualizedPlan){
            $.when(self.getFirstParentCase(idPlan)).done(function (responseFirstCase) {
                if(responseFirstCase === null){
                    $.when(self.getFirstParentPlan(idPlan)).done(function (responseFirstPlan) {
                        defer.resolve(responseFirstPlan.id);
                    });
                }
                else{
                    defer.resolve(responseFirstCase.radNumber);
                }
            });
        }
        else{
            $.when(self.getFirstParentPlan(idPlan)).done(function (responseFirstPlan) {
                defer.resolve(responseFirstPlan.id);
            });
        }
        return defer.promise();
    };

    self.getContextToShow = function (params) {
        var defer = $.Deferred();
        if (params.idCase) {
            $.when(self.callDataServicesForBehaviorDashboard(params)).done(function () {
                self.dataDashboard.params.menuDashboard = self.dataDashboard.menuDashboard;
                defer.resolve(self.dataDashboard);
            });
        }
        else {
            $.when(self.getServerDateDifference()).then(function () {
                var contextToShow = bizagi.services.projectDashboardContext || self.CONTEXT_HOME;
                bizagi.services.projectDashboardContext = "";
                defer.resolve({
                    contextToShow: contextToShow,
                    params: {
                        differenceMillisecondsServer: self.dataDashboard.params.differenceMillisecondsServer
                    }
                });

            })
        }
        return defer.promise();
    };

    self.getTypeWorkItem = function (params) {
        if (params.idPlan) {
            return self.TYPE_WORKITEM_ACTIVITY;
        }
        else {
            return self.TYPE_WORKITEM_TASK;
        }
    };

    self.getIsCurrentUserAssignedToWorkitem = function (currentState, idWorkitem, currentStateResponseSummary) {
        var getItemStateFromArray = [];

        if (currentState.length > 0) {
            getItemStateFromArray = currentState.filter(function (currentState) {
                return currentState.idWorkItem == idWorkitem;
            });

            if (getItemStateFromArray.length > 0) {
                if (currentStateResponseSummary) {
                    return $.extend(getItemStateFromArray[0], currentStateResponseSummary);
                }
                else {
                    return getItemStateFromArray[0];
                }

            }
            else {
                return false;
            }
        }
        else {
            return null;
        }
    };

    self.getContextActionWhenClickButtonPlan = function (typeWorkItem, havePlan) {
        if (typeWorkItem === self.TYPE_WORKITEM_TASK) {
            if (havePlan) {
                return self.CONTEXT_PLANACTIVITIES;
            }
            else {
                return self.CONTEXT_PLANCREATE;
            }
        }
        else if (typeWorkItem === self.TYPE_WORKITEM_ACTIVITY) {
            if (havePlan) {
                return self.CONTEXT_PLANACTIVITIES;
            }
            else {
                return self.CONTEXT_ACTIVITYPLANCREATE;
            }
        }
    };

    self.getIsVisibleButtonOverview = function (typeWorkItem, params) {
        var result = false;
        if (typeWorkItem === self.TYPE_WORKITEM_TASK) {
            result = bizagi.util.parseBoolean(params.showForm);
        }
        else if (typeWorkItem === self.TYPE_WORKITEM_ACTIVITY) {
            result = true;
        }
        return result;
    };

    self.getIsVisibleButtonForm = function (typeWorkItem, belongCurrentUser, openWorkItem) {

        if (typeWorkItem === self.TYPE_WORKITEM_TASK) {
            if (belongCurrentUser) {
                return openWorkItem;
            }
            else {
                return false;
            }
        }
        else if (typeWorkItem === self.TYPE_WORKITEM_ACTIVITY) {
            return belongCurrentUser;
        }
    };

    self.callDataServicesForBehaviorDashboard = function (params) {
        var defer = $.Deferred();
        self.dataDashboard.menuDashboard = {};

        var belongCurrentUser = false;
        var openWorkItem = false;

        var getCaseSummaryDetails = self.getCaseSummaryDetails(params);
        var getServerDateDifference = self.getServerDateDifference();

        $.when(getCaseSummaryDetails, getServerDateDifference).then(function (responseGetCaseSummaryDetails) {
            responseGetCaseSummaryDetails.hasGlobalForm = params.hasGlobalForm; //The value is different en two services, priority to getWorkItems

            var typeWorkItem = self.getTypeWorkItem(responseGetCaseSummaryDetails);
            self.dataDashboard.responseGetCaseSummaryDetails = responseGetCaseSummaryDetails;

            var currentState = self.getIsCurrentUserAssignedToWorkitem(responseGetCaseSummaryDetails.currentState, params.idWorkitem);
            //workitem is running and belong current user
            if (currentState) {
                belongCurrentUser = true;
                openWorkItem = true;
            }
            self.dataDashboard.params.belongCurrentUser = belongCurrentUser;

            self.dataDashboard.menuDashboard.showFormOverview =
                self.getIsVisibleButtonOverview(typeWorkItem, responseGetCaseSummaryDetails);

            self.dataDashboard.menuDashboard.showCommentsOptionMenu =
                self.getPropertiesByDataServices(typeWorkItem, belongCurrentUser, openWorkItem, false, bizagi.menuSecurity).isVisibleButtonComments;
            self.dataDashboard.menuDashboard.showFilesOptionMenu =
                self.getPropertiesByDataServices(typeWorkItem, belongCurrentUser, openWorkItem, false, bizagi.menuSecurity).isVisibleButtonFiles;
            self.dataDashboard.menuDashboard.showTimeLineOptionMenu =
                self.getPropertiesByDataServices(typeWorkItem, belongCurrentUser, openWorkItem, false, bizagi.menuSecurity).isVisibleButtonTimeLine;
            self.dataDashboard.menuDashboard.showPlanOptionMenu =
               self.getPropertiesByDataServices(typeWorkItem, belongCurrentUser, openWorkItem, false, bizagi.menuSecurity).isVisibleButtonPlan;
            self.dataDashboard.menuDashboard.showFormActivity =
               self.getPropertiesByDataServices(typeWorkItem, belongCurrentUser, openWorkItem, false, bizagi.menuSecurity).isVisibleButtonForm;

            //Get data by type workitem
            if (responseGetCaseSummaryDetails.idPlan) {//Workitem is activity
                var getWorkitemsPlan = $.when(self.getWorkitemsPlan(responseGetCaseSummaryDetails.idPlan));
                $.when(getWorkitemsPlan).done(function (responseGetWorkitemsPlan) {
                    var currentWorkitem = self.getIsCurrentUserAssignedToWorkitem(responseGetWorkitemsPlan, params.idWorkitem, currentState);
                    self.dataDashboard.params.guidWorkItem = currentWorkitem.guidWorkitem;

                    var getPlanByParent = $.when(self.getPlanByParent(currentWorkitem.guidWorkitem));

                    $.when(getPlanByParent).then(function (responseGetPlanByParent) {

                        self.dataDashboard.menuDashboard.contextFormActivityOptionMenu =
                           self.getPropertiesByDataServices(typeWorkItem, belongCurrentUser, openWorkItem, currentWorkitem).contextToShow;
                        self.dataDashboard.contextToShow = self.dataDashboard.menuDashboard.contextFormActivityOptionMenu;
                        self.dataDashboard.nameWorkItem =
                           self.getPropertiesByDataServices(typeWorkItem, belongCurrentUser, openWorkItem, currentWorkitem).nameWorkItem;

                        var havePlan = responseGetPlanByParent.length > 0;
                        self.dataDashboard.menuDashboard.contextPlanOptionMenu =
                           self.getContextActionWhenClickButtonPlan(typeWorkItem, havePlan);

                        self.dataDashboard.params.plan = {};
                        $.when(self.getPlan(responseGetCaseSummaryDetails.idPlan)).done(function (responsePlan) {
                            self.dataDashboard.params.plan = responsePlan;//plan belong current activity
                            if (currentWorkitem) {
                                self.dataDashboard.params.plan.idActivitySelected = currentWorkitem.guidActivity;
                            }
                            if (havePlan) {
                                self.dataDashboard.params.planChild = {};
                                self.dataDashboard.params.planChild.id = responseGetPlanByParent[0].id; //plan child of activity
                                self.dataDashboard.params.planChild.currentState = responseGetPlanByParent[0].currentState; //plan current state
                            }

                            var getFirstParentCase = $.when(self.getFirstParentCase(self.dataDashboard.params.plan.id));

                            $.when(self.getRadNumber(params, responseGetCaseSummaryDetails, responsePlan.contextualized), getFirstParentCase).
                                done(function (responseRadNumber, responseGetFirstParentCase) {
                                    self.dataDashboard.params.radNumber = responseRadNumber;

                                    if(responseGetFirstParentCase && responseGetFirstParentCase.idCase){
                                        self.dataDashboard.params.caseIdOfFirstParent =  responseGetFirstParentCase.idCase;
                                        self.dataDashboard.params.workitemIdOfFirstParent = responseGetFirstParentCase.idWorkitem;
                                    }

                                    defer.resolve();
                            });
                        });
                    });
                });
            }
            else {//Workitem is task
                $.when(self.getRadNumber(params, responseGetCaseSummaryDetails, true)).done(function (responseRadNumber) {
                    self.dataDashboard.params.radNumber = responseRadNumber;

                    self.dataDashboard.params.plan = {};
                    if (currentState) {
                        self.dataDashboard.params.guidWorkItem = currentState.guidWorkItem;
                        var getPlanByParent = $.when(self.getPlanByParent(currentState.guidWorkItem));
                        $.when(getPlanByParent).then(function (responseGetPlanByParent) {
                            self.dataDashboard.menuDashboard.contextFormActivityOptionMenu =
                               self.getPropertiesByDataServices(typeWorkItem, belongCurrentUser, openWorkItem, currentState).contextToShow;
                            self.dataDashboard.contextToShow = self.dataDashboard.menuDashboard.contextFormActivityOptionMenu;

                            self.dataDashboard.nameWorkItem =
                               self.getPropertiesByDataServices(typeWorkItem, belongCurrentUser, openWorkItem, currentState).nameWorkItem;

                            var havePlan = responseGetPlanByParent.length > 0;
                            self.dataDashboard.menuDashboard.contextPlanOptionMenu =
                               self.getContextActionWhenClickButtonPlan(typeWorkItem, havePlan);

                            if (havePlan) {
                                self.dataDashboard.params.planChild = {};
                                self.dataDashboard.params.planChild.id = responseGetPlanByParent[0].id;
                                self.dataDashboard.params.planChild.currentState = responseGetPlanByParent[0].currentState; //plan current state
                            }
                            defer.resolve();
                        });
                    }
                    else {
                        self.dataDashboard.menuDashboard.contextFormActivityOptionMenu = self.CONTEXT_ACTIVITY;

                        self.dataDashboard.contextToShow = self.dataDashboard.menuDashboard.contextFormActivityOptionMenu;

                        self.dataDashboard.nameWorkItem =
                           self.getPropertiesByDataServices(typeWorkItem, belongCurrentUser, openWorkItem, currentState).nameWorkItem;

                        defer.resolve();
                    }
                });
            }
        });



        return defer.promise();

    };

    self.getPropertiesByDataServices = function (typeWorkItem, belongCurrentUser, openWorkItem, currentStateOrWorkItem, menuSecurity) {
        menuSecurity = menuSecurity || {};
        var response = {
            isVisibleButtonForm: null,
            isVisibleButtonComments: null,
            isVisibleButtonFiles: null,
            isVisibleButtonTimeLine: null,
            isVisibleButtonPlan: null,
            contextToShow: null,
            nameWorkItem: null
        };

        $.extend(response, self.getMenuDashboardSecurity(menuSecurity));

        if (typeWorkItem === self.TYPE_WORKITEM_TASK) {
            response.isVisibleButtonForm = true;
            if (belongCurrentUser) {
                if (openWorkItem) {

                    response.isVisibleButtonPlan = menuSecurity.Plans || false;

                    response.contextToShow = self.CONTEXT_ACTIVITY;
                    if (currentStateOrWorkItem) {
                        response.nameWorkItem = currentStateOrWorkItem.state;
                    }
                }
                else {
                    response.isVisibleButtonPlan = false;
                    if (currentStateOrWorkItem) {
                        response.nameWorkItem = currentStateOrWorkItem.state;
                    }
                }
            }
            else {
                response.isVisibleButtonPlan = false;
                response.contextToShow = self.CONTEXT_OVERVIEW;

                response.nameWorkItem = bizagi.localization.getResource("workportal-project-casedashboard-activity");
            }
        }
        else if (typeWorkItem === self.TYPE_WORKITEM_ACTIVITY) {
            if (belongCurrentUser) {
                if (openWorkItem) {
                    response.contextToShow = self.CONTEXT_ACTIVITYPLAN;
                    if (currentStateOrWorkItem) {
                        response.nameWorkItem = currentStateOrWorkItem.displayName;
                    }
                }
                else {
                    response.contextToShow = self.CONTEXT_OVERVIEW;
                }
                response.isVisibleButtonForm = true;
                response.isVisibleButtonPlan = menuSecurity.Plans || false;
            }
            else {
                response.isVisibleButtonForm = false;
                response.isVisibleButtonPlan = false;
                response.contextToShow = self.CONTEXT_ACTIVITYPLANOVERVIEW;
                response.nameWorkItem = bizagi.localization.getResource("workportal-project-casedashboard-activity");
            }
        }
        return response;
    };

    self.getMenuDashboardSecurity = function(menuSecurity){
        menuSecurity = menuSecurity || {};

        var response = {
            isVisibleButtonComments: null,
            isVisibleButtonFiles: null,
            isVisibleButtonTimeLine: null
        };

        response.isVisibleButtonComments = menuSecurity.Comments || false;
        response.isVisibleButtonFiles = menuSecurity.Files || false;
        response.isVisibleButtonTimeLine = menuSecurity.TimeLine || false;
        return response;
    };

    /**
     * Define methods by back from plan dashboard
     */
    self.getParamsByBackFromPlan = function (params, currentLevelNavigator, deletePlan) {
        var response = {};
        response.paramsNotify = {};
        if (self.planCreatedFromActivity(params)) {
            response.typeContext = self.CONTEXT_ACTIVITYPLAN;
            response.paramsNotify.showContextByMenuDashboard = response.typeContext;
            response.paramsNotify.level = currentLevelNavigator - 1;
            response.paramsNotify.isRefresh = false;
            params.plan.id = params.planParent.id;
            params.plan.idActivitySelected = params.planParent.idActivitySelected;
            params.menuDashboard.contextPlanOptionMenu = self.CONTEXT_PLANACTIVITIES;
        }
        else if (self.planCreatedFromTask(params)) {
            response.typeContext = self.CONTEXT_ACTIVITY;
            response.paramsNotify.showContextByMenuDashboard = response.typeContext;
            response.paramsNotify.level = currentLevelNavigator - 1;
            response.paramsNotify.isRefresh = false;
        }
        else {
            response.typeContext = self.NOTIFICATION_NAVIGATOR_BACK;
        }

        //Rewrite contextPlanOptionMenu because delete plan. Plan belong to task or activity
        if (deletePlan) {
            delete params.planChild;
            params.menuDashboard = params.menuDashboard || {};
            if (params.planParent && params.planParent.id) {
                params.menuDashboard.contextPlanOptionMenu = self.CONTEXT_ACTIVITYPLANCREATE;
            }
            else {
                params.menuDashboard.contextPlanOptionMenu = self.CONTEXT_PLANCREATE;
            }
        }

        return response;
    };

    self.planCreatedFromActivity = function (params) {
        return params.planParent && params.planParent.id;
    };

    self.planCreatedFromTask = function (params) {
        return params.plan.contextualized == true &&
           typeof params.menuDashboard !== "undefined";
    };

    self.planFromActivity = function (params) {
        return params.plan.idActivitySelected ? true : false;
    };
    /**
     * Define call services
     */
    self.getCaseSummaryDetails = function (params) {
        var self = this;
        return self.dataService.summaryCaseDetails({
            idCase: params.idCase || 0,
            eventAsTasks: params.eventAsTasks,
            onlyUserWorkItems: params.onlyUserWorkItems
        });
    };

    self.getWorkitemsPlan = function (idPlan) {
        var self = this;
        return self.dataService.getWorkitemsPlan({
            idPlan: idPlan
        });
    };

    self.getServerDateDifference = function () {
        var self = this;
        return self.dataService.getDateServer().done(function (response) {
            self.dataDashboard.params.differenceMillisecondsServer = bizagi.util.dateFormatter.getDifferenceBetweenDates(new Date(), new Date(response.date), "milliseconds");
        });
    };

    self.getPlanByParent = function (guidWorkItem) {
        var self = this;
        if (guidWorkItem) {
            var params = {
                parentWorkItem: guidWorkItem
            };
            return self.dataService.getPlanByParent(params);
        }
        else {
            return [];
        }
    };

    self.getFirstParentPlan = function (idPlan) {
        var self = this;
        var params = {
            idPlan: idPlan
        };
        return self.dataService.getFirstParentPlan(params);

    };

    self.getFirstParentCase = function (idPlan) {
        var self = this;
        var params = {
            idPlan: idPlan
        };
        return self.dataService.getFirstParent(params);
    };

    self.getPlan = function (idPlan) {
        var self = this;
        return self.dataService.getPlan({ idPlan: idPlan });
    };


    self.getCurrentTheme = function () {
        var self = this;
        var date = new Date();
        var url = "/Api/CurrentUser/GetCurrentTheme?" + date;

        /*Mock: Variable needs for mocking the service*/
        window.CURRENT_THEME_REMOVE_IT = window.CURRENT_THEME_REMOVE_IT || "theme1";

        $.mockjax({
            url: url,
            proxy: 'jquery/workportal/test/data/dummy.' + window.CURRENT_THEME_REMOVE_IT + '.txt'
        });
        /*End Mock*/

        var defer = $.Deferred();
        $.when($.read({
            url: url,
            dataType: "json"
        })).done(function (response) {
            defer.resolve(response);
        }).fail(function () {
            defer.resolve(null);
        });
        return defer.promise();
    };

    self.setContextToShow = function (context) {
        bizagi.services.projectDashboardContext = context;
    };

    self.removeCurrentTheme = function () {
        $("#bizagi-theme-resources,[rel='bizagi-themes-templates']").remove();
    };

    self.setCustomizeTheme = function () {
        var self = this;

        self.getCurrentTheme().done(function (theme) {
            bizagi.loader.startAndThen("theme.base").then(function () {
                self.setCurrentTheme(theme);
            });
        });
    };

    self.setCurrentTheme = function (theme) {
        //append container
        $("#ui-bizagi-wp-application").remove();
        $container = $("<div id='ui-bizagi-wp-application' ng-app='bizagi.services.module' ng-controller='bizagi.services.controller'><div id='ui-bizagi-wp-workarea' style='height: 100%;'></div></div>");
        $("body").append($container);


        $workarea = $("#ui-bizagi-wp-workarea");
        $("#bizagi-theme-resources,[rel='bizagi-themes-templates']").remove();
        $themeResourcesContainer = $("<div id='bizagi-theme-resources'></div>");

        //css
        var resources = "";
        for (var i = 0; i < theme.files.css.length; i++) {
            resources += '<style>' + theme.files.css[i].content + '</style>';
        }

        //js
        for (var i = 0; i < theme.files.js.length; i++) {
            resources += '<script>' + theme.files.js[i].content + '</script>';
        }

        $themeResourcesContainer.append(resources);
        $themeResourcesContainer.appendTo("body");

        //html
        var templates = "";
        for (var i = 0; i < theme.files.html.length; i++) {
            var filename = theme.files.html[i].name.toLowerCase();
            if (filename.indexOf("main.html") >= 0 || filename.indexOf("mainview.html") >= 0) {
                templates += theme.files.html[i].content;
            }
            else {
                templates += '<script rel="bizagi-themes-templates" type="text/ng-template" id="' + theme.files.html[i].name + '">' + theme.files.html[i].content + '</script>';
            }
        }

        $workarea.append(templates);

        setTimeout(function () {
            $("#workportal-theme-layer").removeClass("workportal-theme-layer-visible");
        }, 300);
        setTimeout(function () {
            $("#workportal-theme-layer").remove();
        }, 600);

        var globalHandlersService = bizagi.injector.get('globalHandlersService');
        $("#ui-bizagi-wp-project-homeportal-main,body,html").show();
        globalHandlersService.publish("showMainMenu");

        // start angular app
        var ngController = $("[ng-controller='bizagi.services.controller']");
        ngController.data("$injector", "");
        angular.bootstrap(ngController[0], ['bizagi.services.module']);
    };

    return self;
};

bizagi.injector.register("bizagi.workportal.services.behaviors.projectDashboard", ["dataService", bizagi.workportal.services.behaviors.projectDashboard], true);

