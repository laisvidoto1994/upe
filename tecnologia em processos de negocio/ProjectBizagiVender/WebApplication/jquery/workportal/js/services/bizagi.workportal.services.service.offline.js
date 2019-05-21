/*
*   Name: BizAgi Rendering Services
*   Author: Diego Parra (based on Edward Morales version)
*   Comments:
*   -   This class will provide a facade to access to workportal REST services
*/

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {
    // Statics

}, {
    /* 
    *   Constructor
    */
    init: function (params) {
        // Call base
        var self = this;
        self._super(params);

        // Create instance of database services
        self.database = (typeof bizagi.workportal.services.db != "undefined") ? new bizagi.workportal.services.db() : null;
        self.enableOfflineEvents();
    },

    enableOfflineEvents: function () {
        //beta
        var self = this;
        if (bizagi.util.detectDevice() == "tablet" || bizagi.util.detectDevice() == "tablet_ios" || bizagi.util.detectDevice() == "tablet_android") {
            if (typeof navigator.connection != "undefined") {
                if (typeof (Connection) !== "undefined" && (navigator.connection.type == Connection.NONE || navigator.connection.type == "unknown")) {
                    self.online = false;
                }
                else {
                    self.online = true;
                }
            } else {
                var queryString = bizagi.readQueryString();
                var queryoffline = (queryString && queryString["online"]) ? eval(queryString["online"]) : true;
                self.online = queryoffline;
            }

            $(document).off("online.services");
            $(document).off("offline.services");
            $(document).on("online.services", function () {
                self.online = true;
                bizagi.log("online.services");
                self.returnOnlineStatus();
            });

            $(document).on("offline.services", function () {
                bizagi.log("offline.services");
                self.online = false;
            });

        } else {
            //desktop 
            //windwos8
            if (typeof Windows != "undefined") {
                self.online = winBizagi.network.isOnline();
                document.addEventListener("networkStatusChange", function (e) {
                    self.online = e.detail.onLine;
                    if (self.online) {
                        self.returnOnlineStatus();

                    }
                });
            }
        }


        /*execute this trigger in render on next event
        */
        $(document).off("tryPushData.offline").on("tryPushData.offline", function (e) {
            if (self.online) {
                self.pushOfflineData();
            }
        });

    },


    returnOnlineStatus: function () {
        var self = this;
        $.when(self.logoutUser()).always(function () {
            $.when(self.authenticatedUser()).always(function () {
                $.when(self.pushOfflineData()).always(function () {
                    self.fetchOfflineData();
                });
            });
        });

    },

    /*
    * Get all data from server : new case structure, forms data
    */
    fetchOfflineData: function () {        
        var synObject = new bizagi.workportal.services.fetchWorker(this);        
        var message = "";

        $.when(synObject.fetch()).done(function (data) {
            bizagi.log("Sync Completed");
            var itemLocalStorage = bizagi.util.getItemLocalStorage(("formChangesetadmon-http://localhost/bizagiR100x-domain"));
            if (bizagi.util.detectDevice() == "tablet" || bizagi.util.detectDevice() == "tablet_ios" || bizagi.util.detectDevice() == "tablet_android" || typeof Windows != "undefined") {
                message = bizagi.util.isValidResource("workportal-mobile-offline-sync-successful")
                   ? bizagi.localization.getResource("workportal-mobile-offline-sync-successful")
                   : "Successful Synchronization";

                bizagi.util.showNotification({ text: message });
            }
        }).fail(function (data) {
            bizagi.log("Sync Failed");
            if (bizagi.util.detectDevice() == "tablet" || bizagi.util.detectDevice() == "tablet_ios" || bizagi.util.detectDevice() == "tablet_android" || typeof Windows != "undefined") {
                if (data !== 0) {
                    message = bizagi.util.isValidResource("workportal-mobile-offline-sync-fail")
                       ? bizagi.localization.getResource("workportal-mobile-offline-sync-fail")
                       : "Failed Synchronization";
                    bizagi.util.showNotification({ text: message });
                }
            }
        });
    },
    /*
    * put all data to server : new case structure, forms data
    */
    pushOfflineData: function () {
        var self = this;
        bizagi.log("pushOfflineData");
        var pullObject = new bizagi.workportal.services.pullWorker(this);

        return $.when(pullObject.pull()).then(function (data) {
            bizagi.log("Offline cases syncronized, all data sended");
        }, function (cause) {
            bizagi.log("Error syncronizing cases");
        });
    },
    /*
    *   Gets the current working user
    */
    getCurrentUser: function (params) {
        var self = this;
        if (self.online) {
            return self._super(params);
        } else {
            // Call ajax and returns promise
            //save this response in the local storage and get when offline
            var defer = new $.Deferred();
            var data = { idUser: 1, user: ((typeof BIZAGI_USER != "undefined") ? BIZAGI_USER : "admon"),
                userName: ((typeof BIZAGI_USER != "undefined") ? BIZAGI_USER : "admon"),
                domain: ((typeof BIZAGI_DOMAIN != "undefined") ? BIZAGI_DOMAIN : "domain"),
                delegateUserName: "",
                idDelegateUser: -1,
                groupSeparator: ",",
                language: "en-US",
                decimalSeparator: ".",
                decimalDigits: "2",
                symbol: "$", ShortDateFormat: "M/d/yyyy",
                TimeFormat: "h:mm tt",
                LongDateFormat: "dddd, MMMM d, yyyy",
                twoDigitYearMax: 2029,
                twoDigitYearMaxDelta: 16, isMultiOrganization: "false"
            };
            defer.resolve(data);
        }

        return defer.promise();
    },
    /*
    *   Return all the available processes in bizagi
    */
    getAllProcesses: function (params) {
        var self = this;
        //params.inputtry == "inbox"
        if (params.inputtray == "inbox") //self.online)
            return self._super(params);
        else {
            return $.when(self.database.getAllProcesses(params)).pipe(function (response) {
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
                    $.each(response.workflows.workflow, function (i, workflow) {
                        // Creates the category if it doesn't exist
                        if (!categories[workflow.category]) {
                            categories[workflow.category] = [];
                            categories[workflow.category].workflows = [];
                        }

                        // Push the workflow
                        categories[workflow.category].workflows.push(workflow);

                        // Sum the cases count
                        //  if (bizagi.util.isEmpty(params.onlyFavorites) || params.onlyFavorites == false) {
                        allCases.count += Number(workflow.count);
                        // }
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
    getCasesByWorkflow: function (params) {
        var self = this;

        if (params.inputtray == "inbox")
            return self._super(params);
        else {
            var defer = new $.Deferred();
            $.when(self.database.getCustomizedColumnsData(params)).pipe(function (response) {
                response = JSON.parse(response);
                $.each(response.cases.rows, function (key, value) {
                    var newFieldsValue = [];

                    //  Set id of case to radnumber
                    response.cases.rows[key]["radnumber"] = value.id;
                    $.each(value.fields, function (fieldsKey, fieldsValue) {
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
                            } catch (e) { }
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
    getMenuAuthorization: function () {
        var self = this;
        if (self.online) {
            return self._super();
        } else {
            // Call ajax and returns promise
            var defer = new $.Deferred();
            defer.resolve(JSON.parse('{"permissions":[{"Cases":["NewCase","Pending","Closed","Search"]},{"AnalysisReports":["BAMProcess","BAMTask","AnalyticsProcess","AnalyticsTask","AnalyticsSensor","AnalysisQueries","BAMResourceMonitor"]},{"Admin":["UserAdmin","Licenses","EntityAdmin","CaseAdmin","AlarmAdmin","EncryptionAdmin","MobileUpdatesAdmin","AsynchronousWorkitemRetries","UserPendingRequests","AuthenticationLogQuery","BusinessPolicies","Profiles","UserDefaultAssignation","GRDimensionAdmin","ThemeBuilder"]},{"CurrentUserAdministration":["CurrentUser"]},{"LogOut":[]},{"Search":[]},{"SmartFolders":[]},{"CustomFolders":[]},{"BizagiQueries":[]},{"AnalysisQueries":[]},{"StateLog":[]},{"PrintableVersion":[]}]}'));
            return defer.promise();
        }
    },
    /*
    *   Gets the inbox summary for the current logged user
    *   Returns a promise of the data being retrieved
    */
    getInboxSummary: function (params) {
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
            $.when('{"inboxSummary":{"Red":7,"Yellow":0,"Green":0,"Black":0,"All":7}}').pipe(function (response) {
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
    getCategories: function (params) {
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


            data["groupByApp"] = params.groupByApp || false;
            // Call ajax and returns promise
            return self.database.getCategories(data);
        }

    },

    //CREATE NEW CASES

    createNewCase: function (params) {
        var self = this;

        params = params || {};

        if (!params.isOfflineForm) {
            return self._super(params);
        } else {
            return self.database.createNewCase(params);
        }


    },



    getWorkitems: function (params) {
        var self = this;

        params = params || {};

        if (!params.isOfflineForm) {
            return self._super(params);
        } else {
            return self.database.getWorkitems(params);
        }


    },



    //self.database.getFormData(data);

    getCaseSummary: function (params) {
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
    deleteCase: function (params) {
        var self = this;
        params = params || {};
        return self.database.deleteCase(params);
    },

    /*
    *   Get subprocesses
    *   return a promise
    */
    getCaseSubprocesses: function (params) {
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
    getOverrides: function () {
        return {};
    },
    
    /*
    *   Return my favorites count
    */
    getFavourites: function() {  
        var self = this;
        return self._super();
    },
    /*
     *   Return my favourites cases
     */
    getFavouriteCases: function(params) {
        var self = this;
        return self._super(params);
    },
});