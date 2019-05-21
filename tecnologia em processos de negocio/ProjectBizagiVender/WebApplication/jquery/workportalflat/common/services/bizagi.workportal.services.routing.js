
/**
* Routing service
*
* @author Edward J Morales
* @description This class has been created based on jira story DRAGON-4943
*/

$.Class.extend("bizagi.workportal.services.routing",
{
    BIZAGI_WORKPORTAL_WIDGET_START_FORM: "startForm"
},
{
    /**
    * Main method
    *
    * @param params <object> json with parameters to route
    * @return object deferred
    */
    init: function (args) {
        var self = this;
        args = args || {};
        self.params = args.params || {};
        self.dataService = args.dataService || {};
        self.modules = {
            render: "activityform",
            oldRender: "oldrenderintegration",
            async: "async",
            activitySelector: "routing"
        };

        // By default render version is Bizagi GO
        self.renderVersion = 2;

        self.resetRouteInformation();
    },

    resetRouteInformation: function () {
        var self = this;
        self.route = {
            module: "", // Name of module to route
            moduleParams: {} // parameters of module
        };
    },

    setRenderParams: function (params) {
        var self = this;
        self.params = self.getRenderParams(params);
    },

    /**
    * Parse a format incoming parameters
    * @param params object
    * @return object json with render parameters
    */
    getRenderParams: function (params) {
        var self = this;

        var renderParams = {
            idCase: parseInt(params.idCase || 0),
            idWorkflow: parseInt(params.idWorkflow || 0),
            idWorkitem: (params.isOfflineForm === true) ? 0 : params.idWorkitem || params.idWorkItem || 0,
            idTask: parseInt(params.idTask || 0),
            eventAsTasks: params.eventAsTasks || false,
            onlyUserWorkItems: params.onlyUserWorkItems || "true",
            formsRenderVersion: params.formsRenderVersion || 0,
            referrer: params.referrer || "",
            isComplex: (params.isComplex !== undefined) ? true : false,
            formsRenderVersion: 2,
            onClose: params.onClose || "",
            isOfflineForm: params.isOfflineForm || false,
            radNumber: params.radNumber || null
        };

        var skipSubprocessGlobalForm = true;
        try {
            skipSubprocessGlobalForm = BIZAGI_SETTINGS["skipSubprocessGlobalForm"] || true;
        } catch (e) {
        }

        self.skipSubprocessGlobalForm = (skipSubprocessGlobalForm == "true");

        return renderParams;
    },
    /**
    * Define the next route to take
    * @param params object
    * @return deferred with specific path
    */
    getRoute: function (params) {
        var self = this;
        var def = new $.Deferred();

        // Params Override
        self.params = (params) ? params : self.params;

        var fromTask = params.fromTask || params.idTask || "";
        var fromWorkItemId = params.fromWorkItemId || params.idWorkitem || params.idWorkItem || "";

        /**
        * Get form version
        */
        $.when(self.getRenderVersion(self.params))
            .done(function (renderVersion) {
                self.renderVersion = renderVersion;
                self.route.moduleParams = self.getRenderParams(self.params);

                // Looking for workitems
                $.when(self.dataService.getWorkitems({
                    idCase: self.params.idCase,
                    onlyUserWorkItems: self.params.onlyUserWorkItems,
                    isOfflineForm: self.params.isOfflineForm,
                    fromTask: fromTask,
                    fromWorkItemId: fromWorkItemId
                })).done(function (getWorkItems) {
                    var workItems = getWorkItems.workItems.length;

                    /**
                    * If routing has been called with idCase and idWorkitem
                    * then go to the render
                    */
                    self.route.moduleParams.hasWorkItems = workItems ? true : false;
                    self.route.moduleParams.hasGlobalForm = bizagi.util.parseBoolean(getWorkItems.hasGlobalForm);

                    if (self.route.moduleParams.idWorkitem > 0) {
                        self.setRenderModuleName(self.getRenderModuleName(renderVersion));

                        if (self.route.moduleParams.idTask === 0) {
                            // Try to found idTask
                            self.route.moduleParams.idTask = self.searchIdTask(self.route.moduleParams.idWorkitem);
                        }

                        // We have enough information to instance the render
                        self.route.moduleParams.radNumber = getWorkItems.radNumber || "";

                        if (!self.route.moduleParams.displayName && !self.params.displayName) {
                            var item = getWorkItems.workItems.find(function (el) {
                                return Number(el.idWorkItem) === Number(self.route.moduleParams.idWorkitem);
                            })

                            if (typeof item !== "undefined" && item.displayName) {
                                self.route.moduleParams.displayName = item.displayName;
                            }
                        }

                        // Resolve the promise
                        def.resolve(self.route);
                        self.resetRouteInformation();
                    } else {

                        var listAsyncWorkItems = self.checkAsyncWorkItems(getWorkItems);

                        // Check if case has workItems
                        if (workItems === 0) {

                            self.route.moduleParams.idWorkflow = getWorkItems.idWorkFlow || "";
                            self.route.moduleParams.radNumber = getWorkItems.radNumber || "";

                            if ($.trim(getWorkItems.msgTask) !== "") {
                                def.resolve(self.routeToMessageForm(getWorkItems.msgTask));
                            } else if (bizagi.util.parseBoolean(getWorkItems.hasGlobalForm)) {
                                // has't work items, show global form
                                // Resolve route -> Global Form
                                self.route.moduleParams.displayName = null;
                                def.resolve(self.routeToGlobalForm(getWorkItems));
                            } else {
                                // Resolve route -> Global form without data
                                def.resolve(self.routeToGlobalFormWithoutData());
                            }
                        } else if (workItems === 1 || listAsyncWorkItems.length > 0) {
                            // it has one workItem
                            // Check if it is asyncronous activity
                            var workItemIndex = 0;
                            if (listAsyncWorkItems.length > 0) {
                                for (var workitemCounter = 0; workitemCounter < workItems; workitemCounter++) {

                                    if (getWorkItems.workItems[workitemCounter].isAsynch == "true") {
                                        workItemIndex = workitemCounter;
                                        break;
                                    }
                                }
                            }

                            // Change idCase
                            self.route.moduleParams.idCase = getWorkItems.workItems[workItemIndex].idCase;
                            self.route.moduleParams.idTask = getWorkItems.workItems[workItemIndex].idTask;
                            self.route.moduleParams.fromTask = getWorkItems.workItems[workItemIndex].idTask;
                            self.route.moduleParams.idWorkitem = getWorkItems.workItems[workItemIndex].idWorkItem;
                            self.route.moduleParams.idWorkflow = getWorkItems.workItems[workItemIndex].idWorkFlow;
                            self.route.moduleParams.displayName = getWorkItems.workItems[workItemIndex].displayName
                                ? getWorkItems.workItems[workItemIndex].displayName : "";
                            self.route.moduleParams.radNumber = getWorkItems.radNumber || "";

                            if (listAsyncWorkItems.length > 0) {
                                // Resolve asynchronous activity
                                self.setRenderModuleName(self.modules.async);
                            } else {
                                // Resolve render
                                self.setRenderModuleName(self.getRenderModuleName(renderVersion));
                            }

                            def.resolve(self.route);
                            self.resetRouteInformation();
                        } else {

                            // it has many workItems or subprocess
                            // show routing window
                            getWorkItems.checkProcess = getWorkItems.subProcesses.length > 0
                                && self.skipSubprocessGlobalForm ? true : false;
                            getWorkItems.checkWorkItems = workItems > 1 ? true : false;

                            getWorkItems["fromSearchWidget"] = self.params.referrer == "search" ? true : false;
                            self.setRenderModuleName(self.modules.activitySelector);
                            self.route.moduleParams.data = getWorkItems;

                            def.resolve(self.route);
                            self.resetRouteInformation();
                        }
                    }
                }).fail(function (error) {
                    var msgTask = bizagi.localization.getResource("workportal-menu-search-found-no-cases");
                    def.resolve(self.routeToMessageForm(msgTask));
                });
            });

        return def.promise();
    },

    /**
    * Set name of module to instance
    * @param renderName
    */
    setRenderModuleName: function (renderName) {
        var self = this;

        self.route.module = renderName;
        self.route.moduleParams.widgetName = renderName;
    },
    /**
    * Get render module
    * @param renderVersion integer 1 || 2
    * @returns boolean
    */
    getRenderModuleName: function (renderVersion) {
        var self = this;
        return (renderVersion == 1) ? self.modules.oldRender : self.modules.render;
    },
    /**
    * Search idTask from workItems object
    * @return {number} idTask
    * @param workItemsList
    * @param workItemToSearch
    */
    searchIdTask: function (workItemsList, workItemToSearch) {
        var idTask = 0;
        workItemsList = workItemsList || [];

        for (var i = 0, length = workItemsList.length; i < length; i++) {
            //search idTask
            if (parseInt(workItemsList[i]["idWorkItem"]) == parseInt(workItemToSearch)) {
                idTask = parseInt(workItemsList[i]["idTask"]);
                break;
            }
        }
        return idTask;
    },

    /**
    * Check if workitems has asynchronous activities
    * @param data
    * @returns {Array}
    */
    checkAsyncWorkItems: function (data) {
        var result = [];

        $.each(data["workItems"], function (key) {
            if (data["workItems"][key]["isAsynch"] == "true") {
                result.push({
                    idCase: data["idCase"],
                    idWorkitem: data.workItems[key].idWorkItem,
                    idTask: data.workItems[key].idTask
                });
            }
        });
        return result;
    },


    /**
    * Resolve global form route
    * @param getWorkitems
    * @returns {{module: string, moduleParams: {}}|*}
    */
    routeToGlobalForm: function (getWorkitems) {
        var self = this;

        // Override idCase and idWorkflow
        self.route.moduleParams.idCase = ($.isNumeric(getWorkitems.idCaseForGlobalForm) && getWorkitems
                .idCaseForGlobalForm > 0)
            ? getWorkitems.idCaseForGlobalForm : self.route.moduleParams.idCase;

        self.route.moduleParams.idWorkflow = parseInt(getWorkitems.idWorkFlow || 0);

        if (self.renderVersion == 1) {
            // Old render
            var urlTemplate = self.dataService.serviceLocator.getUrl("old-render") +
                "?PostBack=1&idCase=%s&idWorkitem=%s&idTask=%s";
            var idCase = self.route.moduleParams.idCase || "";
            var idWorkitem = self.route.moduleParams.idWorkitem || "";
            var idTask = self.route.moduleParams.idTask || "";
            var url = printf(urlTemplate, idCase, idWorkitem, idTask);

            self.route.moduleParams.onlyUserWorkItems = self.route.moduleParams.idCase || "";

            self.setRenderModuleName(self.modules.oldRender);
            self.route.moduleParams.url = url;
        } else {
            // Bizagi
            self.setRenderModuleName(self.modules.render);
        }

        return self.route;
    },
    /**
    * Resolve global form
    * @returns {{module: string, moduleParams: {}}|*}
    */
    routeToGlobalFormWithoutData: function () {
        var self = this;

        self.setRenderModuleName(self.modules.render);
        self.route.moduleParams.withOutGlobalForm = true;

        return self.route;
    },

    /**
    * Resolve Render with personalized message
    * @param message
    * @returns {{module: string, moduleParams: {}}|*|bizagi.workportal.services.routing.route}
    */
    routeToMessageForm: function (message) {
        var self = this;
        message = message || "";

        self.setRenderModuleName(self.modules.render);
        self.route.moduleParams.withOutGlobalForm = true;
        self.route.moduleParams.messageForm = message;

        return self.route;
    },

    /**
    * Return the forms render version from parameters or service
    * @param params object
    * @returns {integer}
    */
    getRenderVersion: function (params) {
        var self = this, defer = new $.Deferred();

        // Try get from parameters
        var formsVersion = params.formsRenderVersion || 0;
        if (formsVersion != 0) {
            // Response from parameters
            defer.resolve(formsVersion);
        } else {

            // Get from service
            $.when(self.dataService.getCaseFormsRenderVersion({
                idCase: params.idCase
            })).done(function (data) {
                formsVersion = parseInt(data.formsRenderVersion);
                defer.resolve(formsVersion);
            });
        }

        return defer.promise();
    }
});
