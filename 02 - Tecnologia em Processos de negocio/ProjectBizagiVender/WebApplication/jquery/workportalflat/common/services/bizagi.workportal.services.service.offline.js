/*
*   Name: BizAgi Rendering Services
*   Author: Diego Parra (based on Edward Morales version)
*   Comments:
*   -   This class will provide a facade to access to workportal REST services
*/

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {
    /* 
    *   Constructor
    */
    init: function(params) {
        // Call base
        var self = this;

        self._super(params);

        // Create instance of database services
        self.database = typeof (bizagi.workportal.services.db) !== "undefined"
            ? new bizagi.workportal.services.db() : null;
        self.enableOfflineEvents();
    },

    enableOfflineEvents: function() {
        var self = this;

        if (bizagi.util.isTabletDevice()) {
            if (typeof navigator.connection != "undefined") {
                if (typeof (Connection) !== "undefined"
                    && (navigator.connection.type == Connection.NONE || navigator.connection.type == "unknown")) {
                    self.online = false;
                } else {
                    self.online = true;
                }
            } else {
                var queryString = bizagi.readQueryString();
                var queryoffline = (queryString && queryString["online"]) ? eval(queryString["online"]) : true;
                self.online = queryoffline;
            }

            $(document).off("online.services");
            $(document).on("online.services", function() {
                self.online = true;
                bizagi.log("online.services");
                self.returnOnlineStatus();
            });

            $(document).off("offline.services");
            $(document).on("offline.services", function() {
                bizagi.log("offline.services");
                self.online = false;
            });

        } else {
            //  desktop | windwos8            
            if (typeof Windows != "undefined") {
                self.online = winBizagi.network.isOnline();
                document.addEventListener("networkStatusChange", function(e) {
                    self.online = e.detail.onLine;
                    if (self.online) {
                        self.returnOnlineStatus();
                    }
                });
            }
        }

        // Execute this trigger in render on next event        
        $(document).off("tryPushData.offline");
        $(document).on("tryPushData.offline", function(e) {
            if (self.online) {
                self.pushOfflineData();
            }
        });

    },

    returnOnlineStatus: function() {
        var self = this;
        $.when(self.logoutUser()).always(function() {
            $.when(self.authenticatedUser()).always(function() {
                $.when(self.pushOfflineData()).always(function() {
                    self.fetchOfflineData();
                });
            });
        });
    },

    /*
    * Get all data from server : new case structure, forms data
    */
    fetchOfflineData: function() {
        var synObject = new bizagi.workportal.services.fetchWorker(this);
        var message = "";

        $.when(synObject.fetch()).done(function(data) {
            bizagi.log("Sync Completed");
            if (bizagi.util.isTabletDevice() || typeof (Windows) !== "undefined") {
                message = bizagi.util.isValidResource("workportal-mobile-offline-sync-successful")
                    ? bizagi.localization.getResource("workportal-mobile-offline-sync-successful")
                    : "Successful Synchronization";

                bizagi.util.showNotification({ text: message, type: "success" }); // Localizar texto
            }
        }).fail(function(data) {
            bizagi.log("Sync Failed");

            if (bizagi.util.isTabletDevice() || typeof Windows != "undefined") {
                if (data !== 0) {
                    message = bizagi.util.isValidResource("workportal-mobile-offline-sync-fail")
                        ? bizagi.localization.getResource("workportal-mobile-offline-sync-fail")
                        : "Failed Synchronization";
                    bizagi.util.showNotification({ text: message, type: "error" });
                }
            }
        });
    },

    /*
    * put all data to server : new case structure, forms data
    */
    pushOfflineData: function() {
        var self = this;
        var pullObject = new bizagi.workportal.services.pullWorker(this);

        bizagi.log("pushOfflineData");

        return $.when(pullObject.pull()).then(function(data) {
            bizagi.log("Offline cases syncronized, all data sended");
        }, function(cause) {
            bizagi.log("Error syncronizing cases");
        });
    },
    /*
    *   Gets the current working user
    */
    getCurrentUser: function(params) {
        var self = this;

        if (self.online) {
            return self._super(params);
        } else {
            var defer = new $.Deferred();

            // Call ajax and returns promise
            // save this response in the local storage and get when offline
            var data = {
                idUser: 1,
                user: typeof (BIZAGI_USER) !== "undefined" ? BIZAGI_USER : "admon",
                userName: typeof (BIZAGI_USER) !== "undefined" ? BIZAGI_USER : "admon",
                domain: typeof (BIZAGI_DOMAIN) !== "undefined" ? BIZAGI_DOMAIN : "domain",
                delegateUserName: "",
                idDelegateUser: -1,
                groupSeparator: ",",
                language: "en-US",
                decimalSeparator: ".",
                decimalDigits: "2",
                symbol: "$",
                ShortDateFormat: "M/d/yyyy",
                TimeFormat: "h:mm tt",
                LongDateFormat: "dddd, MMMM d, yyyy",
                twoDigitYearMax: 2029,
                twoDigitYearMaxDelta: 13,
                uploadMaxFileSize: "1048576",
                isMultiOrganization: "false",
                associatedStakeholders: []
            };

            defer.resolve(data);

            return defer.promise();
        }
    },
    /*
    *   Return all the available processes in bizagi
    */
    getAllProcesses: function(params) {
        var self = this;
        params.inputtray = params.inputtray || "inbox";
        if (params.inputtray == "inbox") {
            return self._super(params);
        } else {
            return $.when(self.database.getAllProcesses(params)).pipe(function(response) {
                response = JSON.parse(response);
                // Aggrupate workflows by categories
                if (!!params.skipAggrupate)
                    return response;
                var responseData = {};
                var categories = {};
                var allProcesses = bizagi.localization.getResource("workportal-widget-inbox-all-processes");
                var allCases = {
                    name: bizagi.localization.getResource("workportal-widget-inbox-all-cases"),
                    path: "",
                    category: allProcesses,
                    isFavorite: (params.onlyFavorites || false),
                    guidFavorite: "",
                    idworkflow: "",
                    guidWFClass: "",
                    count: 0
                };

                // Create a default category
                categories[allProcesses] = [];
                categories[allProcesses].workflows = [];
                categories[allProcesses].workflows.push(allCases);
                if (response.workflows) {
                    $.each(response.workflows.workflow, function(i, workflow) {
                        // Creates the category if it doesn't exist
                        if (!categories[workflow.category]) {
                            categories[workflow.category] = [];
                            categories[workflow.category].workflows = [];
                        }

                        // Push the workflow
                        categories[workflow.category].workflows.push(workflow);

                        // Sum the cases count                        
                        allCases.count += Number(workflow.count);
                    });
                }

                // Build result array once grouped
                responseData.categories = [];
                for (key in categories) {
                    responseData.categories.push({
                        name: key,
                        workflows: categories[key].workflows
                    });
                }
                return responseData;
            });

        }
    },
    /*
    *   Returns all the cases for the current user filtered by a workflow
    */
    getCasesByWorkflow: function(params) {
        var self = this;
        params.inputtray = params.inputtray || "inbox";

        if (params.inputtray === "inbox") {
            if (self.online) {
                return self._super(params);
            } else {
                var deferred = new $.Deferred();

                var cases = {
                    "rows": [],
                    "totalPages": 0,
                    "page": 1,
                    "lstIdCases": []
                };

                deferred.resolve(cases);

                return deferred.promise();
            }
        } else {
            var defer = new $.Deferred();
            $.when(self.database.getCustomizedColumnsData(params)).pipe(function(response) {
                response = JSON.parse(response);
                $.each(response.cases.rows, function(key, value) {
                    var newFieldsValue = [];

                    //  Set id of case to radnumber
                    response.cases.rows[key]["radnumber"] = value.id;
                    $.each(value.fields, function(fieldsKey, fieldsValue) {
                        // when delete element from fields array, each function lose key value
                        if (fieldsValue != undefined) {
                            // Radnumber
                            try {
                                if (fieldsValue.isRadNumber != undefined && fieldsValue.isRadNumber == "true") {
                                    response.cases.rows[key]["radnumber"] = fieldsValue.Value;
                                } else if (fieldsValue.workitems != undefined) {
                                    response.cases.rows[key]["workitems"] = fieldsValue.workitems;
                                } else {
                                    newFieldsValue.push(fieldsValue);
                                }
                            } catch (e) {
                            }
                        }
                    });

                    // Update Fields 
                    response.cases.rows[key]['fields'] = newFieldsValue;
                });
                defer.resolve(response.cases);
            });
            return defer.promise();
        }
    },
    /*
    *  Get Menu Authorization
    */
    getMenuAuthorization: function() {
        var self = this;

        if (self.online) {
            return self._super();
        } else {
            // Call ajax and returns promise
            var defer = new $.Deferred();
            var data = {
                "permissions": [
                    { "Cases": ["NewCase", "Pending", "Closed", "Search"] },
                    {
                        "AnalysisReports": [
                            "BAMProcess", "BAMTask", "AnalyticsProcess", "AnalyticsTask", "AnalyticsSensor",
                            "AnalysisQueries", "BAMResourceMonitor"
                        ]
                    }, {
                        "Admin": [
                            "UserAdmin", "Licenses", "EntityAdmin", "CaseAdmin", "AlarmAdmin", "EncryptionAdmin",
                            "MobileUpdatesAdmin", "AsynchronousWorkitemRetries", "UserPendingRequests",
                            "AuthenticationLogQuery", "BusinessPolicies", "Profiles", "UserDefaultAssignation",
                            "GRDimensionAdmin", "ThemeBuilder"
                        ]
                    }, { "CurrentUserAdministration": ["CurrentUser"] }, { "LogOut": [] }, { "Search": [] },
                    { "SmartFolders": [] }, { "CustomFolders": [] }, { "BizagiQueries": [] }, { "AnalysisQueries": [] },
                    { "StateLog": [] }, { "PrintableVersion": [] }
                ]
            };

            defer.resolve(data);

            return defer.promise();
        }
    },
    /*
    *   Gets the inbox summary for the current logged user
    *   Returns a promise of the data being retrieved
    */
    getInboxSummary: function(params) {
        var self = this;
        var enableDefaultMethod = self.online;
        if (params && (params.inputtray == "false" || params.inputtray == "true")) {
            enableDefaultMethod = false;
        }
        if (enableDefaultMethod) {
            return self._super(params);
        } else {
            // Call ajax and returns promise
            var defer = new $.Deferred();
            $.when('{"inboxSummary":{"Red":7,"Yellow":0,"Green":0,"Black":0,"All":7}}').pipe(function(response) {
                var data = JSON.parse(response);
                defer.resolve(data["inboxSummary"]);
            });
            return defer.promise();
        }
    },
    /*
    *   Returns the available categories filtered by a parent category
    *   If not parent category is sent, it will return the base categories
    */
    getCategories: function(params) {
        var self = this;

        if (self.online) {
            return self._super(params);
        } else {
            // Define data
            params = params || {};
            var data = {};

            // Required params
            if (params.idCategory)
                data["idCategory"] = params.idCategory;
            if (params.idApp)
                data["idApp"] = params.idApp;

            data["enableOfflineForm"] = params.enableOfflineForm || false;


            data["groupByApp"] = params.groupByApp || false;

            // Call ajax and returns promise
            return self.database.getCategories(data);
        }
    },

    /* 
    * CREATE NEW CASES
    */
    createNewCase: function(params) {
        var self = this;

        params = params || {};

        if (!params.isOfflineForm) {
            return self._super(params);
        } else {
            return self.database.createNewCase(params);
        }
    },

    getWorkitems: function(params) {
        var self = this;

        params = params || {};

        if (!params.isOfflineForm) {
            return self._super(params);
        } else {
            return self.database.getWorkitems(params);
        }
    },

    getCaseSummary: function(params) {
        var self = this;
        params = params || {};

        if (!params.isOfflineForm) {
            return self._super(params);
        } else {

            return self.database.getSummary(params);
        }
    },

    /*
    *   Delete offline cases created localy
    *   return a promise
    */
    deleteCase: function(params) {
        var self = this;
        params = params || {};

        return self.database.deleteCase(params);
    },

    /*
    *   Get subprocesses
    *   return a promise
    */
    getCaseSubprocesses: function(params) {
        var self = this;
        params = params || {};

        if (!params.isOfflineForm) {
            return self._super(params);
        } else {
            var defer = new $.Deferred();
            defer.resolve({ subProcesses: [] });
            return defer.promise();
        }
    },

    /**
    * This service get all overrides keys within configuration project
    *
    * @return {json}
    */
    getOverrides: function() {
        return {};
    },

    /**
     * Return all the available cases in bizagi and thinking for mobile response
     * @param {} params: inputtray:  inbox | outbox (false) | drafts (true)
     * @returns {} 
     */
    getCasesListBeta: function(params) {
        var self = this;
        params = params || {};

        params.inputtray = params.inputtray || "inbox";

        if (params.inputtray === "inbox") {
            if (self.online) {
                return self._super(params);
            } else {
                var deferred = new $.Deferred();

                var response = { "page": 1, "totalPages": 1, "elements": [] };
                deferred.resolve(response);

                return deferred.promise();
            }
        } else {
            var defer = new $.Deferred();
            $.when(self.database.getCasesList(params))
                .pipe(function(response) {
                    response = JSON.parse(response);

                    var taskFeedData = self.getTaskFeedData(response);

                    defer.resolve(taskFeedData);
                });

            return defer.promise();
        }
    },

    getMobileCasesList: function(params) {
        var self = this;

        if (params.inputtray === "inbox") {
            return self._super(params);
        } else {
            return getCasesListBeta(params);
        }
    },

    /*
    * Customize Columns
    */
    getTaskFeedData: function(response) {
        var overdue = bizagi.localization.getResource("workportal-taskfeed-overdue");
        var today = bizagi.localization.getResource("workportal-taskfeed-today");
        var tomorrow = bizagi.localization.getResource("workportal-taskfeed-tomorrow");
        var upcoming = bizagi.localization.getResource("workportal-taskfeed-upcomming");

        var groupedData = {
            elements: [],
            page: response.page,
            totalPages: response.totalPages,
            advanceSearch: false
        };

        var actualDate = new Date();
        var actualMonth = actualDate.getMonth();
        var actualDay = actualDate.getDate();
        var actualYear = actualDate.getFullYear();

        for (var counter = 0; response.elements.length > counter; counter++) {
            var tmpElement = response.elements[counter];
            var status = {};

            var originalEndDate = tmpElement[3];

            if (tmpElement[3] !== "") {
                var tmpdate = new Date(tmpElement[3]);
                var tmpDay = tmpdate.getDate();
                var tmpMonth = tmpdate.getMonth();
                var tmpYear = tmpdate.getFullYear();
                var dateDiff = ((new Date(tmpYear, tmpMonth, tmpDay, 0, 0, 0)
                    - new Date(actualYear, actualMonth, actualDay, 0, 0, 0)));

                if (dateDiff < 0) {
                    tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]),
                        "MMMM dd | hh:mm tt");
                    status = { group: "1|" + overdue, state: "red", type: "overdue", icon: "overdue" };
                } else {
                    if (actualMonth === tmpMonth && actualDay === tmpDay) {
                        tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "hh:mm tt");

                        // Define if the case is overdue
                        if (tmpdate.getTime() < actualDate.getTime()) {
                            status = {
                                group: "2|" + today + ", "
                                    + bizagi.util.dateFormatter.formatDate(actualDate, "MMMM dd"),
                                state: "red",
                                type: "today",
                                icon: "overdue"
                            };
                        } else {
                            status = {
                                group: "2|" + today + ", "
                                    + bizagi.util.dateFormatter.formatDate(actualDate, "MMMM dd"),
                                state: "yellow",
                                type: "today",
                                icon: "ontime"
                            };
                        }
                    } else if (actualMonth === tmpMonth && (actualDay + 1) === tmpDay) {
                        tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "hh:mm tt");
                        status = {
                            group: "3|" + tomorrow + ", "
                                + bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "MMMM dd"),
                            state: "yellow",
                            type: "tomorrow",
                            icon: "ontime"
                        };
                    } else {
                        tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "MMMM dd | hh:mm tt");
                        status = { group: "4|" + upcoming, state: "green", type: "upcoming", icon: "upcoming" };
                    }
                }
            } else {
                tmpElement[3] = "--";
                status = { group: "1|" + overdue, state: "red", type: "overdue", icon: "overdue" }
            }

            groupedData.elements.push($.extend({}, tmpElement, status,
            { "endDate": originalEndDate, "idworkitem": tmpElement[1] }));
        }

        return groupedData;
    },

    /*
    * Render Details
    * @param idWorkitem
    */
    summaryCaseDetails: function(options) {
        var self = this;
        var params = options || {};

        params.inputtray = params.inputtray || "inbox";

        if (!params.isOfflineForm) {
            return self._super(params);
        } else {
            var def = $.Deferred();
            var idWorkitem = options["idWorkitem"] || 0;

            $.when(self.getCaseSummaryDataContent(options))
                .done(function(data) {

                    data.currentState = data.currentState || [];
                    var dataCurrentStateLength = data.currentState.length;

                    // Show or hide tabs
                    data["showEvents"] = (data["countEvents"] >= 1) ? true : false;
                    data["showParentProcess"] = (data["idParentCase"] >= 1) ? true : false;
                    data["parentProcess"] = {
                        'displayName': data["parentDisplayName"],
                        'idCase': data["idParentCase"]
                    };

                    data["isClosed"] = (data["isOpen"] == "true") ? false : true;
                    data["showAssignees"] = (data["countAssigness"] >= 1) ? true : false;
                    data["showSubProcess"] = (data["countSubProcesses"] >= 1) ? true : false;
                    data["showForm"] = (data["hasGlobalForm"] == "true") ? true : false;
                    data["allowsReassign"] = "false";

                    for (var i = 0; i < dataCurrentStateLength; i++) {
                        if (data["currentState"][i]["idWorkItem"] == idWorkitem) {
                            data["allowsReassign"] = data["currentState"][i]["allowsReassign"];
                        }
                    }

                    // edit original data, no show events in activities tab
                    var currentStateTypes = [];
                    var m = 0; // counter for new activities array
                    for (var j = 0; j < data["currentState"].length; j++) {
                        if (data["currentState"][j]["isEvent"] == "false" &&
                            data["currentState"][j]["assignToCurrentUser"] == "true" &&
                            data["currentState"][j]["idWorkItem"] != idWorkitem) {
                            currentStateTypes[m++] = data["currentState"][j];
                        }
                    }

                    data["currentStateTypes"] = currentStateTypes;
                    data["showActivities"] = (currentStateTypes.length >= 1) ? true : false;

                    def.resolve(data);
                });

            return def.promise();
        }
    },

    /**
    *  Get json from cases service
    */
    getCaseSummaryDataContent: function(options) {
        var self = this;
        var promise = new $.Deferred();

        $.when(self.getCaseSummary(options))
            .done(function(data) {
                // Completes data
                data.taskState = self.icoTaskState;
                data.process = data.process ? data.process : "";

                if (data.createdBy) {
                    data.createdByName = data.createdBy.Name;
                    data.createdByUserName = data.createdBy.userName;
                    data.caseDescription = (data.caseDescription == '' ? '' : data.caseDescription);
                    data.processPath = data.processPath.replace(/\//g, ' > ') + data.process;
                    data.showWorkOnIt = true;
                }

                promise.resolve(data);
            });
        return promise.promise();
    },

    /*
    *   Returns the data for the inbox grid view
    */
    getCustomizedColumnsData: function(params) {
        var self = this;

        params.inputtray = params.inputtray || "inbox";

        if (params.inputtray === "inbox") {
            return self._super(params);
        } else {
            var defer = new $.Deferred();

            $.when(self.database.getCustomizedColumnsNewData(params))
                .pipe(function(response) {
                    defer.resolve(JSON.parse(response));
                });

            return defer.promise();
        }
    },
    /*
    *   Returns the recent process
    */
    getRecentProcesses: function(params) {
        var self = this;
        params = params || {};

        if (self.online) {
            return self._super(params);
        } else {
            return self.database.getRecentProcesses(params);
        }
    },

    /*
    *   Start process in BizAgi
    */
    startProcess: function(params) {
        var self = this;
        params = params || {};

        if (self.online) {
            return self._super(params);
        } else {
            var defer = new $.Deferred();

            var data = {
                hasStartForm: false,
                idProcess: params.idProcess,
                displayName: params.displayName,
                caseInfo: {}
            }
            defer.resolve(data);

            return defer.promise();
        }
    },

    /**
     * Get stakeholder shortCurts
     * @param {} params 
     * @returns {} 
     */
    getShortCuts: function(params) {
        var self = this;
        params = params || {};

        if (self.online) {
            return self._super(params);
        } else {
            var defer = new $.Deferred();
            var data = [];
            defer.resolve(data);

            return defer.promise();
        }
    },

    /**
     * Returns the available list of searches
     * @returns {} 
     */
    getSearchLists: function() {
        var self = this;

        if (self.online) {
            return self._super();
        } else {
            var defer = new $.Deferred();
            var data = [];
            defer.resolve(data);

            return defer.promise();
        }
    },

    /**
     * Get the icon of a given collection
     * @param params
     */
    getCollectionIcon: function(params) {
        var self = this;
        params = params || {};

        if (self.online) {
            return self._super(params);
        } else {
            var defer = new $.Deferred();
            var data = [];
            defer.resolve(data);

            return defer.promise();
        }
    }
});