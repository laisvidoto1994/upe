
/*
*   Name: BizAgi Workportal Widget Controller
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*/

bizagi.workportal.controllers.controller.extend("bizagi.workportal.widgets.widget", {
    BIZAGI_WORKPORTAL_WIDGET_WEBPART: "webpart",
    BIZAGI_WORKPORTAL_WIDGET_INBOX: "inbox",
    BIZAGI_WORKPORTAL_WIDGET_ADVANCE_SEARCH: "advanceSearch",
    BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL: "homeportal",
    BIZAGI_WORKPORTAL_WIDGET_ACTIVITY: "project.activity",
    BIZAGI_WORKPORTAL_WIDGET_PROJECT_DASHBOARD: "projectDashboard",
    BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID: "inboxGrid",
    BIZAGI_WORKPORTAL_WIDGET_ROUTING: "routing",
    BIZAGI_WORKPORTAL_WIDGET_SEARCH: "search",
    BIZAGI_WORKPORTAL_WIDGET_RENDER: "activityform",
    BIZAGI_WORKPORTAL_WIDGET_START_FORM: "startForm",
    BIZAGI_WORKPORTAL_WIDGET_RENDERFORM: "renderform",
    BIZAGI_WORKPORTAL_WIDGET_NEWCASE: "newCase",
    BIZAGI_WORKPORTAL_WIDGET_QUERIES: "queries",
    BIZAGI_WORKPORTAL_WIDGET_QUERIES_DEFINITION: "queriesDefinition",
    BIZAGI_WORKPORTAL_WIDGET_QUERIES_SHORTCUT: "queriesShortcut",
    BIZAGI_WORKPORTAL_WIDGET_QUERYFORM: "queryform",
    BIZAGI_WORKPORTAL_WIDGET_ASYNC: "async",
    BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME: "genericiframe",
    BIZAGI_WORKPORTAL_WIDGET_SUBMENU: "subMenu",
    BIZAGI_WORKPORTAL_WIDGET_PRINT: "print",
    BIZAGI_WORKPORTAL_WIDGET_FONTSIZE: "fontsize",
    BIZAGI_WORKPORTAL_WIDGET_OLDRENDERINTEGRATION: "oldrenderintegration",
    BIZAGI_WORKPORTAL_WIDGET_PAGE: "page",
    BIZAGI_WORKPORTAL_WIDGET_ENTITIES: "entities",
    BIZAGI_WORKPORTAL_WIDGET_REPORTS: "reports",
    BIZAGI_WORKPORTAL_WIDGET_REPORTS_MENU: "reportsMenu",
    BIZAGI_WORKPORTAL_WIDGET_REPORTS_CHART: "reportsChart",
    BIZAGI_WORKPORTAL_WIDGET_SMARTFOLDERS: "smartfolders",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_CASES: "adminReassignCases",
    BIZAGI_WORKPORTAL_WIDGET_REASSIGN_CASE: "reassignCase",
    BIZAGI_WORKPORTAL_WIDGET_ASYNCECM_UPLOAD: "asyncECMUpload",
    BIZAGI_WORKPORTAL_WIDGET_PROCESS_TREE: "processTree",
    BIZAGI_WORKPORTAL_WIDGET_ENTITIES_TREE: "entitiesTree",
    BIZAGI_WORKPORTAL_WIDGET_USERS_TABLE: "usersTable",
    BIZAGI_WORKPORTAL_WIDGET_ACTIVITY_LOG: "activityLog",
    BIZAGI_WORKPORTAL_WIDGET_AUTHENTICATION_LOG: "authenticationLog",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_ENTITIES: "entityAdmin",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_ENCRYPT_PASSWORDS: "encryptPasswords",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_USERS_REQUESTS: "userPendingRequests",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_CASE_SEARCH: "adminCaseSearch",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_ASYNC_ACTIVITIES: "asyncActivities",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_DEFAULTS_ASSIGNATION_USER: "defaultsAssignUser",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_USER_PROFILES: "userProfiles",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_ALARMS: "adminAlarms",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_USER_LICENSES: "userlicenses",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_DIMENSIONS: "dimensions",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_DOCUMENT_TEMPLATES: "documentTemplates",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_PROCESSES: "processes",
    BIZAGI_WORKPORTAL_WIDGET_START_PROCESS: "startProcess",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES: "businessPolicies",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_LANGUAGE: "languageAdmin",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES_DECISION_TABLE: "businessPoliciesDecisionTable",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES_POLITICS: "businessPoliciesPolitics",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES_RULES: "businessPoliciesRules",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES_TABS: "businessPoliciesTabs",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES_VOCABULARIES: "businessPoliciesVocabularies",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_PREFERENCES: "adminPreferences",
    BIZAGI_WORKPORTAL_WIDGET_TREE: "tree",
    BIZAGI_WORKPORTAL_WIDGET_GRAPHIC_QUERY: "graphicquery",
    BIZAGI_WORKPORTAL_WIDGET_PROCESS_MODELER_VIEW: "processModeler",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_USERS_ADMINISTRATION: "adminUsers",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_STAKEHOLDERS: "adminStakeholders",
    BIZAGI_WORKPORTAL_WIDGET_BIZAGI_EVENTS: "events",
    BIZAGI_WORKPORTAL_WIDGET_BIZAGI_RELEASE: "release",
    BIZAGI_WORKPORTAL_WIDGET_PROJECT_PROCESS_DIAGRAM_HELPER: "processDiagramHelper",
    BIZAGI_WORKPORTAL_WIDGET_PROJECT_ACTIVITY_MAP_TOOLTIP: "activityMapTooltip",
    BIZAGI_WORKPORTAL_WIDGET_PROJECT_USERSUMMARY: "usersummary",
    BIZAGI_WORKPORTAL_WIDGET_MYSEARCHLIST: "mySearchList",
    BIZAGI_WORKPORTAL_WIDGET_LOADFORM: "loadForm",
    BIZAGI_WORKPORTAL_WIDGET_TEMPLATE_ENGINE: "templates",
    BIZAGI_WORKPORTAL_WIDGET_DIALOGNAV: "dialognav",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_HOLIDAYS: "holidays",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_PROJECTNAME: "projectName",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_OAUTH2APPLICATIONS: "oauth2Applications",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_PROCESSES: "adhocProcesses",
    BIZAGI_WORKPORTAL_WIDGET_ADHOC_PROCESS_MODELER: "adhocProcessModeler",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_ENTITIES: "adhocEntities",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_USER_GROUPS: "adhocUserGroups",
    BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_BOOLEAN_EXP: "adhocBooleanExp",
    BIZAGI_WORKPORTAL_WIDGET_ADHOC_CREATE_PROCESS: "adhocCreateProcess"
}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        // Call base
        this._super(workportalFacade, dataService);

        // Set params
        this.params = params;
        if (params && params.menu) {
            this.menu = params.menu;
        }

        this.observableElement = $({});

        this.widgetReadyDeferred = new $.Deferred();

        this.isBlocked = false;
    },

    /*
    *   Publish an event so any controller can subscribe to it
    */
    publish: function (eventName, params) {
        if (this.disposed) return null;
        // Overrides base method to add referrer
        $(document).triggerHandler(eventName, $.extend(params, {
            referrer: this.getWidgetName()
        }));
    },
    

    /*
    *   Change the current widget
    */
    changeWidget: function (widgetName, params) {
        var self = this;
        params = params || {};
        var widgetParams = $.extend(params, {
            widgetName: widgetName
        });
        self.publish("changeWidget", widgetParams);
    },

    /*
    *   Executes a workportal action
    */
    executeAction: function (actionName, params) {
        var self = this;
        params = params || {};
        var actionParams = $.extend(params, {
            action: actionName
        });
        self.publish("executeAction", actionParams);
    },

    /*
    * Show graphic query
    */
    showGraphicQuery: function (data) {

        var self = this;
        /*This method is used for validate if the request is referd to process on the fly */
        var processOnTheFly = self.isProcessOnTheFlyCase();

        if(processOnTheFly === true){
            bizagi.loader.start("processmodelerview").then(function () {
                self.publish("showDialogWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROCESS_MODELER_VIEW,
                    data: {},
                    modalParameters: {
                        title: self.getResource("render-graphic-query"),
                        refreshInbox: false
                    },
                    maximizeOnly: true,
                    onClose: function () {
                        bizagi.workportal.desktop.dialogStack.pop();
                    }
                });

            });
        }
        else{
            bizagi.loader.start("processviewer").then(function () {
                self.publish("showDialogWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GRAPHIC_QUERY,
                    data: data,
                    modalParameters: {
                        title: self.getResource("render-graphic-query"),
                        refreshInbox: false
                    },
                    maximizeOnly: true,
                    onClose: function () {
                        bizagi.workportal.desktop.dialogStack.pop();
                    }
                });
            });
        }
    },

    isProcessOnTheFlyCase: function () {
        return false;
    },

    routingExecute: function (element) {
        // Executes routing action
        if (element == undefined) {
            return false;
        }

        var self = this;

        var idCase = element.find("#idCase").val() || self.params.idCase;
        var idWorkflow = element.find("#idWorkflow").val() || self.params.idWorkflow;
        var idWorkItem = element.find("#idWorkItem").val() || element.parent().find("#idWorkItem").val();
        var idTask = element.find("#idTask").val();
        var eventAsTasks = element.find("#eventAsTasks").val() || false;

        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: idCase,
            idWorkflow: idWorkflow,
            idWorkItem: idWorkItem,
            idTask: idTask,
            eventAsTasks: eventAsTasks
        });

        return true;
    },


    /*
    * Gets the name of widget, Override on implementations
     */
    getWidgetName : function(){
        return this.Class.fullName;
    },


    /*
    *
    */
    sub: function (event) {
        // Gets events registered
        //var events = $._data(this.observableElement[0], "events");
        // If the events exist, ignore it
        //if (!events || !events[event]) {
        this.observableElement.off.apply(this.observableElement, arguments);
        this.observableElement.on.apply(this.observableElement, arguments);
        //}
    },

    /*
    *
    */
    unsub: function () {
        this.observableElement.off.apply(this.observableElement, arguments);
    },

    /*
    *
    */
    pub: function () {
        return this.observableElement.triggerHandler.apply(this.observableElement, arguments);
    },

    /**
     * This method must be used when i need to wait to all observers has been resolved
     */
    pubDeadLockDetection: function () {
        var def = new $.Deferred();
        if (!self.isBlocked) {
            self.isBlocked = true;
            var pubDef = this.pub.apply(this, arguments);
            var queueDef = Array.isArray(pubDef) ? pubDef : [pubDef];
            $.when.apply($, queueDef).done(function (data) {
                self.isBlocked = false;
                def.resolve();
            });
        } else {
            def.reject()
        }
        return def.promise();
    },

    /*
    * Clean the widget, removing events asociated with it.
    */
    clean : function(){
        var self = this;

        //remove events
        var events = $._data( this.observableElement[0], "events" );

        if (events){
            for (var event in events){
                if ( event != "notify" &&
                     event != 'showDialogWidget' &&
                     event != 'showNotification'){
                    self.unsub(event);
                }
            }
        }
    },

    isReady: function(){
        return this.widgetReadyDeferred.promise();
    },

    setWidgetReady:function(){
        this.widgetReadyDeferred.resolve();
    }

});
