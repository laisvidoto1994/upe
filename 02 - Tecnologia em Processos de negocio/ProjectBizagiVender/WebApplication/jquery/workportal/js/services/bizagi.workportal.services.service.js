/*
 *   Name: BizAgi Rendering Services
 *   Author: Diego Parra (based on Edward Morales version)
 *   Comments:
 *   -   This class will provide a facade to access to workportal REST services
 */

$.Class.extend("bizagi.workportal.services.service", {
    // Statics
    BA_CONTEXT_PARAMETER_PREFIX: "h_",
    ENTITIES_QUERY_PAGE_SIZE: 10
}, {
    /* 
     *   Constructor
     */
	init: function(params) {
        params = typeof (params) == "object" ? params : {};
        params.context = !bizagi.util.isEmpty(params.context) ? params.context : "workportal";

        params.proxyPrefix = !bizagi.util.isEmpty(params.proxyPrefix) ? params.proxyPrefix : "";
        params.proxyPrefix = this.normalizeUrl(params.proxyPrefix);
        bizagi.RPproxyPrefix = params.proxyPrefix;


        params.sharepointProxyPrefix = !bizagi.util.isEmpty(params.sharepointProxyPrefix) ? params.sharepointProxyPrefix : "";
        params.sharepointProxyPrefix = this.normalizeUrl(params.sharepointProxyPrefix);

        this.serviceLocator = new bizagi.workportal.services.context(params);

        // Define default value of number of records to show
        this.pageSize = 10;

        // Get override for pageSize, use BIZAGI_INBOX_ROWS_PER_PAGE constant within config file
		if(typeof BIZAGI_INBOX_ROWS_PER_PAGE != "undefined") {
            this.pageSize = ($.isNumeric(BIZAGI_INBOX_ROWS_PER_PAGE)) ? BIZAGI_INBOX_ROWS_PER_PAGE : this.pageSize;
        }

        bizagi.injector.registerInstance('dataService', this);
	},

    /**
     * This method will return the url defined as endPoint using the parameter "endPoint" name
     */
	getUrl: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl(params.endPoint);
        return url;
    },
    /**
     * This method will return the url normalized
     */
	normalizeUrl: function(url) {
		if(url != "") {
			if(url[url.length - 1] != "/") {
                url = url.concat("/");
            }

			if(url.indexOf("http://") == -1 && url.indexOf("https://") == -1) {
                url = "http://" + url;
            }
        }
        return url;
    },
    /**
     * This service get json of theme definition
     *@return {json} theme definition
     */
	getCurrentTheme: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("getCurrentTheme");

        return $.read(url);
    },

    /**
     * This service get all overrides keys within configuration project
     *
     * @return {json}
     */
	getOverrides: function() {
        var self = this;
        return $.ajax({
            url: self.serviceLocator.getUrl("overrides")
		}).pipe(function(overrides) {
            overrides = overrides || {};

			$.each(overrides, function(key, value) {
                var valueUppercase = value.toUpperCase();
				if(valueUppercase == "TRUE" || valueUppercase == "FALSE") {
                    overrides[key] = bizagi.util.parseBoolean(value);
                }
            });

            return overrides;
        });
    },

    /**
     * This method will return the response of the user information login is correct
     * this method is use for native smartphone
     **/
	authenticatedUser: function(params) {


        var self = this;

        var urlSend = self.serviceLocator.getUrl("login-handler");

        return $.read({
            url: urlSend,
            data: {
                "userName": BIZAGI_USER,
                "password": BIZAGI_PASSWORD,
                "domain": BIZAGI_DOMAIN
            }
        }).pipe(
			function(response) {
                return response;
            },
			function(data) {
                urlSend = self.serviceLocator.getUrl("login-handlerv10");
                urlSend = urlSend.replace("{0}", BIZAGI_USER || "");
                urlSend = urlSend.replace("{1}", BIZAGI_PASSWORD || "");
                urlSend = urlSend.replace("{2}", BIZAGI_DOMAIN || "");
                return $.ajax({
                    url: urlSend,
                    type: "GET",
                    dataType: "json"
                });
            }
        );
    },

    /**
     *
     * this method is use for native smartphone
     **/
	logoutUser: function(params) {
        var self = this;
        var urlSend = self.serviceLocator.getUrl("logoff-handlerv1");
        return $.read({
            url: urlSend
        });
    },
    /*
     *   Logoff the current user
     */
	logOffUser: function(params) {
        var self = this;
        var urlSend = self.serviceLocator.getUrl("logoff-handler");
        return $.read({
            url: urlSend
        });
    },
    /*
     *   Gets the current working user
     */
	getCurrentUser: function(params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("user-handler-getCurrentUser"));
    },
    /*
     *   Gets the inbox summary for the current logged user
     *   Returns a promise of the data being retrieved
     */
	getInboxSummary: function(params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("inbox-handler-getInboxSummary"))
			.pipe(function(response) {
                // Extract inboxSummary property
                return response["inboxSummary"];
            });
    },
    /*
     *   Return all the available processes in bizagi
     */
	getAllProcesses: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        var url = self.serviceLocator.getUrl("process-handler-getAllProcesses");

		if(params.taskState != undefined) {
            data["taskState"] = params.taskState;
        }

		if(params.onlyFavorites != undefined && params.onlyFavorites != "") {
            data["onlyFavorites"] = params.onlyFavorites;
        }

		if(params.myActivities != undefined && params.myActivities != "") {
            data["myActivities"] = params.myActivities;
        }

		if(params.myPendings != undefined && params.myPendings != "") {
            data["myPendings"] = params.myPendings;
        }

		if(params.smartfoldersParameters) {
            url = url + "?" + params.smartfoldersParameters;
        }

		if(bizagi.isMobile()) {
            data["mobileDevice"] = true;
        }

        // Call ajax and returns promise
        return $.read(url, data)
			.pipe(function(response) {
                // !! (double Not) (bang bang) <-- For Boolean Type Casting http://jibbering.com/faq/notes/type-conversion/#tcBool
				if(!!params.skipAggrupate)
                    return response;
                // Aggrupate workflows by categories
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
				if(response.workflows) {
					$.each(response.workflows.workflow, function(i, workflow) {
                        // Creates the category if it doesn't exist
						if(!categories[workflow.category]) {
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
				for(key in categories) {
                    responseData.categories.push({
                        name: key,
                        workflows: categories[key].workflows
                    });
                }

                return responseData;
            });
    },
    /**
     * Get the icon of a given process
     * @param params
     */
	getProcessIcon: function(params) {
        var self = this;
        var data = {
            processId: params.processId
        }

        // Call ajax and returns promise
		return $.read({url: self.serviceLocator.getUrl("process-getIcon"), data: data, batchRequest: true});
    },
    /**
     * Get the icon of a given collection
     * @param params
     */
	getCollectionIcon: function(params) {
        var self = this;
        var data = {
            collectionId: params.collectionId
        }

        // Call ajax and returns promise
		return $.read({url: self.serviceLocator.getUrl("collections-getIcon"), data: data, batchRequest: true});
    },
    /*
     *   Return my favourites count
     */
	getFavourites: function() {
        var self = this;
        var data = {};
        var url = self.serviceLocator.getUrl("process-handler-getFavourites");

        // Call ajax and returns promise
        return $.read(url, data)
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Return my favourites count
     */
	getMyStuff: function() {
        var self = this;
        var data = {};
        var url = self.serviceLocator.getUrl("process-handler-getMyStuff");

        // Call ajax and returns promise
        return $.read(url, data)
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Return my favourites cases
     */
	getFavouriteCases: function(params) {
        var self = this;
        var data = {};
        var url = self.serviceLocator.getUrl("process-handler-getFavouriteCases");
        params = params || {};

        data["pageSize"] = params.pageSize || self.pageSize;
        data["page"] = params.page || 1;

		if(bizagi.isMobile()) {
            data["mobileDevice"] = true;
        }

        // Call ajax and returns promise
        return $.read(url, data)
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Return all streakholder actions
     */
	getActions: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        var url = self.serviceLocator.getUrl("process-handler-getActions");

		if(bizagi.isMobile()) {
            data["mobileDevice"] = true;
        }

        // Call ajax and returns promise
        return $.read(url, data)
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Return all the available cases in bizagi and thinking for mobile response
     */
	getCasesList: function(params) {
        var self = this;
        params = params || {};
        var data = {};
        var url = self.serviceLocator.getUrl("case-handler-getCasesList");

        data["pageSize"] = params.pageSize || 10;
        data["page"] = params.page || 1;
        data["numberOfFields"] = params.numberOfFields || "-1"; //1;
        data["idWfClass"] = params.idWfClass || "-1";

        return $.read(url, data)
			.pipe(function(response) {
                var elementToHtml = {
                    overdue: [],
                    today: [],
                    tomorrow: [],
                    upcoming: [],
                    page: response.page,
                    totalPages: response.totalPages
                };
                var actualDate = new Date();
                var actualMonth = actualDate.getMonth();
                var actualDay = actualDate.getDate();
                var actualYear = actualDate.getYear();

				for(var counter = 0; response.elements.length > counter; counter++) {

                    var tmpElement = response.elements[counter];
                    var tmpdate = new Date(tmpElement[3]);
                    var tmpDay = tmpdate.getDate();
                    var tmpMonth = tmpdate.getMonth();
                    var tmpYear = tmpdate.getYear();

					if(actualDay > tmpDay || (actualMonth > tmpMonth && actualYear >= tmpYear)) {
                        tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "dd MMM"); // "dd MMM hh:mm"
                        elementToHtml.overdue.push(tmpElement);
					} else if(actualDay == tmpDay) {
                        tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "hh:mm");
                        elementToHtml.today.push(tmpElement);

					} else if((actualDay + 1) == tmpDay) {
                        tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "hh:mm");
                        elementToHtml.tomorrow.push(tmpElement);

                    } else {
                        tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "dd MMM");
                        elementToHtml.upcoming.push(tmpElement);
                    }
                }
                //console.info(elementToHtml);
                return elementToHtml;
            });

    },
    /*
     *   Return all the available processes in bizagi
     */
	getAllAdministrableEntities: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data["action"] = "entitiesList";
        data["kind"] = "administrable";

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("entities-administration"),
            data: data,
            type: "POST",
            dataType: "json"
		}).pipe(function(data) {
            var result = {
                entities: []
            };
			$.each(data, function(i, item) {
                result.entities.push(item);
            });
            return result;
        });
    },
    /*
     *   Return all the available processes in bizagi
     */
	getEntitiesList: function(params) {
        var self = this;

        // Define data
        params = params || {};
        params["action"] = "entitiesList";
        params["kind"] = "entitiesData";

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("entities-administration"),
            data: params,
            type: "POST",
            dataType: "json"
        });
    },
    /*
     *   Returns all the cases for the current user filtered by a workflow
     */
	getCasesByWorkflow: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        var url = self.serviceLocator.getUrl("process-handler-getCustomizedColumnsDataInfo");


        // Required params
		if(!bizagi.util.isEmpty(params.taskState))
            data["taskState"] = params.taskState;
		if(!bizagi.util.isEmpty(params.idWorkflow))
            data["idWorkflow"] = params.idWorkflow;

        // Special case to search all favorite cases for all processes
		if(params.onlyFavorites == true) {
            data["onlyFavorites"] = true;
            data["taskState"] = "all";
        }

        // Optional params
        data["pageSize"] = params.pageSize || self.pageSize;
        data["page"] = params.page || 1;

		if(bizagi.isMobile()) {
            data["mobileDevice"] = true;
        }


		if(params.smartfoldersParameters) {
            var param = params.smartfoldersParameters.split('&');
			$.each(param, function(k, v) {
                var keyvalue = v.split('=');
                data[keyvalue[0]] = keyvalue[1];
            });
        }


        // Call ajax and returns promise
        return $.read(url, data)
			.pipe(function(response) {
				$.each(response.cases.rows, function(key, value) {
                    var newFieldsValue = [];

                    //  Set id of case to radnumber
                    response.cases.rows[key]["radnumber"] = value.id;
					$.each(value.fields, function(fieldsKey, fieldsValue) {
                        // when delete element from fields array, each function lose key value
						if(fieldsValue != undefined) {
                            // Radnumber
                            try {
								if(fieldsValue.isRadNumber != undefined && fieldsValue.isRadNumber == "true") {
                                    response.cases.rows[key]["radnumber"] = fieldsValue.Value;
								} else if(fieldsValue.workitems != undefined) {
                                    response.cases.rows[key]["workitems"] = fieldsValue.workitems;
                                } else {
                                    newFieldsValue.push(fieldsValue);
                                }
							} catch(e) {
                            }
                        }
                    });

                    // Update Fields 
                    response.cases.rows[key]['fields'] = newFieldsValue;
                });
                return response.cases;
            });
    },
    /*
     *   Returns the Organization List
     */
	getOrganizationsList: function() {
        var self = this;

        var url = self.serviceLocator.getUrl("process-handler-getOrganizations");
        var data = {};
        data["type"] = 12;
        data["name"] = "";

        return $.read(url, data);
    },
    /*
     *   Returns the data for the inbox grid view
     */
	 	getCustomizedColumnsData: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        var url = self.serviceLocator.getUrl("process-handler-getCustomizedColumnsData");
	        data.pageSize = params.pageSize || self.pageSize;
	        data.page = params.page || 1;

        // data for sort columns
	        data.orderFieldName = params.orderFieldName || "";
	        data.orderType = params.orderType || "0";
	        data.order = params.order || "";

		if(bizagi.isMobile()) {
	            data.mobileDevice = true;
        }

        // Fixes stuff
        // TODO: this must be fixed in the server
        params.taskState = params.taskState || "all";
		if(params.taskState.toString().toLowerCase() === "")
            params.taskState = "all";
		if(params.taskState.toString().toLowerCase() === "red")
            params.taskState = "Red";
		if(params.taskState.toString().toLowerCase() === "yellow")
            params.taskState = "Yellow";
		if(params.taskState.toString().toLowerCase() === "green")
            params.taskState = "Green";

        data.taskState = params.taskState;
        // Required params
		if(!bizagi.util.isEmpty(params.idWorkflow)) {
	            data.idWorkflow = params.idWorkflow;
        }
		if(!bizagi.util.isEmpty(params.idTask)) {
        	    data.idTask = params.idTask;
        }

		if(!bizagi.util.isEmpty(params.radNumber)) {
	            data.radNumber = params.radNumber;
        }

        // Special case to search all favorite cases for all processes
		if(params.onlyFavorites == true) {
	            data.onlyFavorites = true;
	            data.taskState = "all";
        }

		if(params.smartfoldersParameters) {
            var param = params.smartfoldersParameters.split('&');
			$.each(param, function(k, v) {
                var keyvalue = v.split('=');
                data[keyvalue[0]] = keyvalue[1];
            });
        }
        	if(params.group){
            		data.group = params.group;
		}

        // Call ajax and returns promise
        return $.read(url, data);
    },
    /*
     *   Returns the available categories filtered by a parent category
     *   If not parent category is sent, it will return the base categories
     */
	getCategories: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};

        // Required params
		if(params.idCategory)
            data["idCategory"] = params.idCategory;
		if(params.idApp)
            data["idApp"] = params.idApp;

		if(bizagi.isMobile()) {
            data["mobileDevice"] = true;
        }


        data["groupByApp"] = params.groupByApp || false;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("process-handler-getCategory"), data);
    },
    /*
     *   Returns the recent process
     */
	getRecentProcesses: function(params) {
        var self = this;
        params = params || {};

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("process-handler-getRecentProcesses"), params);
    },
    /*
     *   Returns the summary for a case
     */
	getCaseSummary: function(params) {
        var self = this;

        params = params || {};
        if (typeof (params.idCase) != "undefined") {
            // Required params: idCase
            return $.read({
                url: self.serviceLocator.getUrl("case-handler-getCaseSummary"),
                data: {
                    idCase: params.idCase,
                    eventAsTasks: params.eventAsTasks || "false",
                    onlyUserWorkItems: params.onlyUserWorkItems || "true",
                    mobileDevice: bizagi.isMobile() || "false"
                },
                serviceType: "GETSUMMARY"
            })
                .pipe(function (response) {
                    return response;
                });
        } else if (typeof (params.guid) != "undefined")
            return $.read({
                url: self.serviceLocator.getUrl("case-handler-getCaseSummaryByGuid"),
                data: {
                    guid: params.guid,
                    eventAsTasks: params.eventAsTasks || "false",
                    onlyUserWorkItems: params.onlyUserWorkItems || "true",
                    mobileDevice: bizagi.isMobile() || "false"
                },
                serviceType: "GETSUMMARY"
            })
                .pipe(function (response) {
                    return response;
                });
    },
    /*
     *   Returns the assigness for a case (all users assigned to any task of this case)
     */
	getCaseAssignees: function(params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl("case-handler-getCaseAssignees"), {
                idCase: params.idCase
            }
        )
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Returns all the tasks belonging to a process, aditionally return if it has an active workitem or not
     */
	getCaseTasks: function(params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl("case-handler-getCaseTasks"), {
                idCase: params.idCase
            }
        );
    },
    /*
     *   Returns all the events available for a case
     */
	getCaseEvents: function(params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read({
            url: self.serviceLocator.getUrl("case-handler-getCaseEvents"),
            data: {
                idCase: params.idCase
            },
            serviceType: "GETEVENTS"
        })
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Returns all the available subprocesses for a case
     */
	getCaseSubprocesses: function(params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read({
            url: self.serviceLocator.getUrl("case-handler-getCaseSubprocesses"),
            data: {
                idCase: params.idCase
            },
            serviceType: "GETSUBPROCESSES"
        })
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Returns forms render version for a case
     */
	getCaseFormsRenderVersion: function(params) {
        var self = this;

        params = params || {};
	    // Required params: idCase || guid
        if (typeof (params.guid) != "undefined")
        return $.read(
            self.serviceLocator.getUrl("case-handler-getCaseFormsRenderVersionByGuid"), {
                guid: params.guid
            }
        );
        else
            // Required params: guid
            return $.read(
                self.serviceLocator.getUrl("case-handler-getCaseFormsRenderVersion"), {
                    idCase: params.idCase
                }
            );
    },
    /**
     *  Get json from forms render version service
     */
	getCaseFormsRenderVersionDataContent: function(options) {
        var self = this;
        var defer = new $.Deferred();

        $.when(self.getCaseFormsRenderVersion(options))
			.done(function(data) {
                // return json content                    
                defer.resolve(data);
            });
        return defer.promise();
    },
    /*
     *   Returns all the assignees belonging to a workitem (case - task combination)
     */
	getTaskAssignees: function(params) {
        var self = this;

        params = params || {};

        // Required params: idCase, idTask
        return $.read(
            self.serviceLocator.getUrl("case-handler-getTaskAssignees"), {
                idCase: params.idCase,
                idTask: params.idTask
            }
        );
    },
    /*
     *   Returns the available workitems for a case (Routing service)
     */
	getWorkitems: function(params) {
        var self = this;

        params = params || {};
        var data = {};
        if (typeof (params.guid) != "undefined") data.guid = params.guid;
        data.idCase = params.idCase;
        if(params.fromTask != "0"){ data.fromTask = params.fromTask };
        if(params.fromWorkItemId != ""){ data.fromWorkItemId = params.fromWorkItemId; }
        data.mobileDevice = bizagi.isMobile();

        params.eventAsTasks ? (data.eventAsTasks = params.eventAsTasks) : "";

		if(typeof params.onlyUserWorkItems !== "undefined") {
            data.onlyUserWorkItems = params.onlyUserWorkItems;
        }
		var localUrl = self.serviceLocator.getUrl("case-handler-getWorkItems");
		if (typeof (params.guid) != "undefined" && typeof (params.idCase) == "undefined") localUrl = self.serviceLocator.getUrl("case-handler-getWorkItemsByGuid").replace("{guid}", params.guid);

        // Required params: idCase
        return $.read({
            url: localUrl,
            data: data,
            serviceType: "GETWORKITEMS"
        });
    },
    /*
     *   Returns the available workitems for a case (Routing service)
     */
	getQueriesDefinitions: function(params) {
        var self = this;
		if(self.hashQueriesDef && params.idNode) {
            if(!bizagi.override.enableQueriesClassicMenu){
                if(params.idNode != -1 && self.hashQueriesDef[params.idNode].length == 1 && self.hashQueriesDef[params.idNode][0].guidForm == "00000000-0000-0000-0000-000000000000" && !self.hashQueriesDef[params.idNode][0].notMigratedUrl){
                    return self.getQueriesDefinitions({
                        idNode: self.hashQueriesDef[params.idNode][0].idNode
                    });
                }else if(params.idNode != -1 && self.hashQueriesDef[params.idNode].length > 1){
                    var result = [];
                    $.each(self.hashQueriesDef[params.idNode], function(key,value){
                        if(value.nodes.length > 0){
                            var node = self.getQueriesDefinitions({
                                idNode: value.idNode
                            });
                            $.merge(result,node);
                        }else{
                            result.push(value);
                        }
                    });
                    return result;
                }else {
                    return self.hashQueriesDef[params.idNode];
                }
            }else{
                return self.hashQueriesDef[params.idNode];
            }
        } else {
            var defer = new $.Deferred();
            // Call ajax and returns promise
            $.read(self.serviceLocator.getUrl("query-handler-getqueries-definitions"))
				.done(function(response) {
                    self.hashQueriesDef = {};
                    self.hashQueriesDef[0] = {};
                    self.processQueriesDefinitions("-1", response.query);
                    defer.resolve(self.hashQueriesDef["-1"]);
                });
            return defer.promise();
        }
    },
    /*
     *   Creates a hash of queries to simulate each category request
     */
	processQueriesDefinitions: function(parent, queries) {
        var self = this;
		$.each(queries, function(i, query) {
			if(!self.hashQueriesDef[parent]) {
                self.hashQueriesDef[parent] = [];
            }
            self.hashQueriesDef[parent].push(query);
			if(query.nodes) {
                self.processQueriesDefinitions(query.idNode, query.nodes);
            } else {
                query.nodes = {};
            }
        });
    },
    /*
     *   Returns the available workitems for a case (Routing service)
     */
	getQueries: function(params) {
        var self = this;

		if(self.hashQueries && params.idElement) {
            return self.hashQueries[params.idElement];
        } else {
            var defer = new $.Deferred();

            // Call ajax and returns promise
            $.read(self.serviceLocator.getUrl("query-handler-getqueries"))
				.done(function(response) {
                    self.hashQueries = {};
                    self.hashQueries[0] = {};

                    // Process the full response converting it into small entries inside a hashtable
                    self.processQueries(response.query);
                    defer.resolve(self.hashQueries["-1"]);
                });
            return defer.promise();
        }
    },
    /*
     *   Creates a hash of queries to simulate each category request
     */
	processQueries: function(queries) {
        var self = this;
		$.each(queries, function(i, query) {
			if(!self.hashQueries[query.idParent]) {
                self.hashQueries[query.idParent] = [];
            }
            self.hashQueries[query.idParent].push(query);
			if(query.nodes) {
                self.processQueries(query.nodes);
            } else {
                query.nodes = {};
            }
        });
    },
    /*
     *   Creates a new case in BizAgi
     */
	createNewCase: function(params) {
        var self = this;
        var data = {};
        params = params || {};

        if(params.caseData){
            params.caseData = JSON.stringify(params.caseData);
        }
        if(params.idWfClass){
            data.idWfClass = params.idWfClass;
        }
        if(params.idOrganization){
            data.idOrganization = params.idOrganization;
        }


        // Required params: idCase
        return $.create({
            url: self.serviceLocator.getUrl("case-handler-addNewCase"),
            data: data,
            serviceType: "NEWCASE"
        });
    },
    /*
     *   Start process in BizAgi
     */
	startProcess: function(params) {
        var self = this;
        var url;
        params = params || {};

        if (params.isAdhocProcess === "true") {
            url = self.serviceLocator.getUrl("adhoc-process-start");
            return $.create({
                url: url.replace("{processId}", params.idProcess),
                serviceType: "STARTPROCESS"
            });
        }
        else {
            url = self.serviceLocator.getUrl("case-handler-startProcess");
        // Required params: idProcess
        return $.create({
                url: url,
            data: {
                idProcess: params.idProcess
            },
            serviceType: "STARTPROCESS"
        });
        }
    },
    /*
     *   Search cases with radNumber
     */
	searchCases: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};

        data["h_action"] = "SEARCHCASES";
        data["onlyUserCases"] = false;
        data["active"] = false;
        data["page"] = params.page || 1;
		if(params.radNumber)
            data["radNumber"] = $.trim(params.radNumber);
        data["pageSize"] = params.pageSize || self.pageSize;

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("query-handler"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },
    /*
     *   Search cases with radNumber
     */
	queryCases: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};

        data.h_action = "QUERYCASES";
        data.onlyUserCases = params.onlyUserCases || false;
        data.active = params.active && true;
        data.page = params.page || 1;
		if(params.radNumber)
            data.radNumber = $.trim(params.radNumber);
        data.pageSize = params.pageSize || self.pageSize;

        data.filter = params.filter;
        data.outputxpath = params.outputxpath;

        // data for sort columns
        data.orderFieldName = params.orderFieldName || "";
        data.orderType = (params.orderType == 'asc' || params.orderType == 1) ? 1 : 0;
        data.order = params.order || "";

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("query-handler"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },
    /*
     *   Search entities service
     */
	queryEntities: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};

        data.h_action = "QUERYENTITIES";
        data.page = params.page || 1;
        data.pageSize = self.Class.ENTITIES_QUERY_PAGE_SIZE;

        // Query parameters
        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + "idEnt"] = params.idEntity;
        data.filter = params.filter;
        data.outputxpath = params.outputxpath;

        // Data to sort columns
        data.orderFieldName = params.orderFieldName || "";
        data.orderType = params.orderType || "";
        data.order = params.order || "";

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("query-handler"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },
    /*
     *  Get Menu Authorization
     */
	getMenuAuthorization: function() {
        var self = this;

        return $.read(
            self.serviceLocator.getUrl("authorization-handler-getMenuAuthorization")
        );
    },
    /*
     *  The user have permissions to excecute this Case
     */
	isCaseCreationAuthorized: function(params) {
        var self = this;
        var urlSend = self.serviceLocator.getUrl("authorization-handler-isCaseCreationAuthorized");
        urlSend = urlSend.replace("{0}", params.idWfClass || "");

        return $.read({
            url: urlSend //,
            //data: { "idWfClass": params.idWfClass }
            //data: { "userName": BIZAGI_USER, "password": BIZAGI_PASSWORD, "domain": BIZAGI_DOMAIN }
        });
    },
    /*
     *   Returns the execution state of an async workitem
     */
	getAsynchExecutionState: function(params) {
        var self = this;
        var idAsynchWorkitem;
        params = params || {};

		if(params.idCase != -1) {
            return $.read({
                url: self.serviceLocator.getUrl("case-handler-getAsynchExecutionState"),
                data: {
                    idCase: params.idCase,
                    idAsynchWorkitem: params.idAsynchWorkitem
                },
                serviceType: "ASYNCHEXECUTION"
            });
        } else {
            return $.read({
                url: self.serviceLocator.getUrl("case-handler-getAsynchExecutionState"),
                data: {
                    idCase: params.idCase,
                    idAsynchWorkitem: params.idAsynchWorkitem
                },
                serviceType: "ASYNCHEXECUTION"
            });
        }

        // Required params: idCase idAsynchWorkitem

    },

    /*
     *  Returns the supported log types
     */
	supportedLogTypes: function() {
        var self = this;

        return $.read(self.serviceLocator.getUrl("case-handler-supportedLogTypes"));
    },
    /*
     *   Returns the Activity Log for a case
     */
	getActivityLog: function(params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl("case-handler-getActivityLog"), {
                idCase: params.idCase,
                orden: params.sort || 0,
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
			.pipe(function(response) {
               var rowsLength = 0;
				if(response.rows && response.rows.length) {
                   rowsLength = response.rows.length;
               }

                var i = 0;
                var value;
                var DATE_COLUMN_NUMBER = 4;
				for(i; i < rowsLength; i++) {
                    value = new Date(response.rows[i][DATE_COLUMN_NUMBER]);
                    response.rows[i][DATE_COLUMN_NUMBER] = (value == 'Invalid Date') ? response.rows[i][DATE_COLUMN_NUMBER] : bizagi.util.dateFormatter.formatDate(value, bizagi.localization.getResource("dateFormat") + " " + bizagi.localization.getResource("timeFormat"));
                }
                return response;
            });
    },
    /*
     *   Returns the Activity Detail Log for a case
     */
	getActivityDetailLog: function(params) {
        var self = this;

        params = params || {};

        // Required params: idWorkItemFrom
        return $.read(
            self.serviceLocator.getUrl("case-handler-getActivityDetailLog"), {
                idCase: params.idCase,
                idWorkItemFrom: params.idWorkItemFrom,
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Returns the Entity Log for a case
     */
	getEntityLog: function(params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl("case-handler-getEntityLog"), {
                idCase: params.idCase,
                orden: params.sort || 0,
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Returns the Entity Detail Log for a case
     */
	getEntityDetailLog: function(params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl("case-handler-getEntityDetailLog"), {
                idCase: params.idCase,
                idEntity: params.idEntity || -1,
                userFullName: params.userFullName || "",
                attribDisplayName: params.attribDisplayName || "",
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Returns the User Log for a case
     */
	getUserLog: function(params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl("case-handler-getUserLog"), {
                idCase: params.idCase,
                orden: params.sort || 0,
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Returns the User Detail Log for a case
     */
	getUserDetailLog: function(params) {
        var self = this;

        params = params || {};

        // Required params: idCase , idUser
        return $.read(
            self.serviceLocator.getUrl("case-handler-getUserDetailLog"), {
                idCase: params.idCase,
                idUser: params.idUser,
                entDisplayName: params.entDisplayName || "",
                attribDisplayName: params.attribDisplayName || "",
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Returns the Admin Log for a case
     */
	getAdminLog: function(params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl("case-handler-getAdminLog"), {
                idCase: params.idCase,
                orden: params.sort || 0,
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Adds a New Favorite
     */
	addFavorite: function(params) {
        var self = this;

        // Define data
        params = params || {};

        return $.create(
            self.serviceLocator.getUrl("favorites-handler-saveFavorite"), {
                idObject: params.idObject,
                favoriteType: params.favoriteType
            }
        )
			.pipe(function(response) {
                return response;
            });
    },
    /*
     *   Favorites service
     */
	delFavorite: function(params) {
        var self = this;

        // Define data
        params = params || {};

        // Required params: guidFavorite
        return $.destroy(
            self.serviceLocator.getUrl("favorites-handler-deleteFavorite"), {
                guidFavorite: params.idObject
            }
        )
			.pipe(function(response) {
                return response;
            });
    },
    // Data Transformations for Summary Widget
    /*
     * Render Assigness
     */
	summaryAssigness: function(options) {
        var self = this;
        var def = new $.Deferred();
        var idCase = options.idCase || "";

        $.when(
            self.getCaseAssignees({
                idCase: idCase
            })
		).done(function(baseAssignees) {

            var assignees = baseAssignees.assignees || [];
            var assigneesLength = assignees.length;
            var assigneesFix = {
                showAssignees: (bizagi.override.showAssignees && assignees.length > 0) ? true : false,
                assignees: {},
                events: "",
                activities: ""
            };
                var assigneesEvents = "";
                var assigneesActivities = "";
                var assigneesEventsList = [];
                var assigneesActivitiesList = [];

			for(var i = 0; i < assigneesLength; i++) {
				if(bizagi.util.parseBoolean(assignees[i].isEvent)) {
				        if (assigneesEventsList.indexOf(assignees[i].idUser) == -1) {
				            assigneesEventsList.push(assignees[i].idUser);
				            assigneesEvents += assignees[i].Name + ", ";
				        }
                    } else {
				        if (assigneesActivitiesList.indexOf(assignees[i].idUser) == -1) {
				            assigneesActivitiesList.push(assignees[i].idUser);
				            assigneesActivities += assignees[i].Name + ", ";
				        }
                    }
                }
                //join assignees to event and activities
            assigneesFix.events = assigneesEvents.substring(0, assigneesEvents.length - 2);
            assigneesFix.activities = assigneesActivities.substring(0, assigneesActivities.length - 2);


                def.resolve(assigneesFix);
            });

        return def.promise();
    },
    /*
     * Render Assigness
     */
	summarySubProcess: function(options) {
        var self = this;
        var def = $.Deferred();
        var idCase = options.idCase || "";

        $.when(
            self.getCaseSubprocesses({
                idCase: idCase
            })
		).done(function(subprocess) {
                subprocess["showSubProcess"] = (subprocess["subProcesses"].length >= 1) ? true : false;
                subprocess["showSubProcesColumns"] = (subprocess["CustFields"][0] !== undefined && subprocess["CustFields"][0][0].length >= 1) ? true : false;

                // Prepare json for subprocess
			if(subprocess["showSubProcesColumns"]) {
                    subprocess["subProcPersonalized"] = {};
                    var len;

				for(var n = 0; n < subprocess["CustFields"].length; n++) {
                        len = 0;
					for(var i = 0; i < subprocess["subProcesses"].length; i++) {
						if(subprocess["subProcesses"][i]["idCustData"] == n) {
                                subprocess["subProcPersonalized"][n] = subprocess["subProcPersonalized"][n] || {};
                                subprocess["subProcPersonalized"][n]["subProcesses"] = subprocess["subProcPersonalized"][n]["subProcesses"] || {};
                                subprocess["subProcPersonalized"][n]["subProcesses"][len++] = subprocess["subProcesses"][i];
                            }
                        }
					if(subprocess["subProcesses"][n]["idCustData"] != -1 && subprocess["subProcPersonalized"][n] != undefined) {
                            subprocess["subProcPersonalized"][n]["CustFields"] = subprocess["CustFields"][n];
                            subprocess["subProcPersonalized"][n]["idCase"] = subprocess["idCase"];
                        }
                    }
                }

                def.resolve(subprocess);
            });

        return def.promise();
    },
    /*
     * Render Case Events
     */
	summaryCaseEvents: function(options) {
        var self = this;
        var def = $.Deferred();
        var idCase = options.idCase || "";

        $.when(
            self.getCaseEvents({
                idCase: idCase
            })
		).done(function(events) {
                events["showEvents"] = (events["events"].length >= 1) ? true : false;
                def.resolve(events);
            });
        return def.promise();
    },
    /*
     * Render Details
     * @param idWorkitem
     */
	summaryCaseDetails: function(options) {
        var self = this;
        var def = new $.Deferred();
        var idWorkitem = options.idWorkitem || 0;

        $.when(
            self.getCaseSummaryDataContent(options)
		).done(function(data) {
            data.currentState = data.currentState || [];
            var dataCurrentStateLength = data.currentState.length;
                // Show or hide tabs
            data.showEvents = (data.countEvents >= 1) ? true : false;
            data.showParentProcess = (data.idParentCase >= 1) ? true : false;
            data.parentProcess = {
                "displayName": data.parentDisplayName,
                "idCase": data.idParentCase
                };

            //data.isOpen: if request have onlyUserWorkItems = true, so verify workitems of current user
            //data.isClosed: if request have onlyUserWorkItems = false, not verify workitems of current user
            data.isClosedForAllUsers = bizagi.util.parseBoolean(data.isClosed);
            data.isClosed = (bizagi.util.parseBoolean(data.isOpen)) ? false : true;
            data.showAssignees = (bizagi.override.showAssignees && data.countAssigness > 0) ? true : false;
            data.showSubProcess = (data.countSubProcesses > 0) ? true : false;
            data.showForm = (bizagi.util.parseBoolean(data.hasGlobalForm)) ? true : false;
            data.allowsReassign = "false";


			for(i = 0; i < dataCurrentStateLength; i++) {
				if(data.currentState[i].idWorkItem == idWorkitem) {
                    data.allowsReassign = data.currentState[i].allowsReassign;
                    }
                }

                // edit original data, no show events in activities tab
                var currentStateTypes = [];
                var m = 0; // counter for new activities array
			for(i = 0; i < dataCurrentStateLength; i++) {
				if(!bizagi.util.parseBoolean(data.currentState[i].isEvent) && bizagi.util.parseBoolean(data.currentState[i].assignToCurrentUser) && data.currentState[i].idWorkItem != idWorkitem) {
                    currentStateTypes[m++] = data.currentState[i];
                    }
                }

            data.currentStateTypes = currentStateTypes;
            data.showActivities = (currentStateTypes.length > 0) ? true : false;

                def.resolve(data);
		}).fail(function(error) {
                def.reject(error);
            });

        return def.promise();
    },
	releaseActivity: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("case-handler-releaseActivity");
        url = url.replace("{idCase}", params.idCase);
        var data = {};
        // Define data
		if(params) {
            data["idCase"] = params.idCase;
            data["idWorkItem"] = params.idWorkItem;
        }
        // Call ajax and returns promise
        return $.ajax({
            url: url,
            data: data,
            type: "POST",
            dataType: "json"
        });

    },
    /**
     *
     * Segment Activities for summary in render module
     * @param options {data,idWorkItem}
     */
	summaryActivities: function(options) {
        var activities = {};
        var data = options["data"] || {};
        var idWorkItem = idWorkItem || options["idWorkitem"] || 0;

        try {
            activities["showActivities"] = (data["currentStateTypes"].length >= 1) ? true : false;
            activities["currentState"] = data["currentStateTypes"];
            activities["globalIdWorkitem"] = idWorkItem;
            activities["creationDate"] = data["creationDate"];
            //    activities["idWorkItem"]=data["creationDate"];
		} catch(e) {
        }

        return activities;
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
               if(data.createdBy) {
                   data.createdByName = data.createdBy.Name;
                   data.createdByUserName = data.createdBy.userName;
                   data.caseDescription = (data.caseDescription == "" ? "" : data.caseDescription);
                   data.processPath = data.processPath.replace(/\//g, " > ") + data.process;
                   data.showWorkOnIt = true;
               }
                // return json content                    
                promise.resolve(data);
			}).fail(function(error) {
                promise.reject(error);
            });
        return promise.promise();
    },
    /**
     * Definition service for bizagi smart folders
     *
     * @param id optional with filter purpose
     */
	getSmartFolders: function(id) {
        var self = this;
        var data = {};

        data.idFolder = id || "";
        // Call read and returns promise
		return $.read(self.serviceLocator.getUrl("folders-handler-getUserQueries"), data).pipe(function(response) {
			if(id == -1 || id == "") {
                return response;
            } else {
                return self.searchFolders(id, response) || [];
            }
        });
    },
    /**
     * Delete smart folder
     * @param options {idSmartFolder,idUser}
     */
	deleteSmartFolder: function(options) {
        var self = this;
        var data = {};

        data.action = "6";
        options = options || {};

        data.idSmartFolder = options.idSmartFolder || "";
        data.idUser = options.idUser || "";

        return $.destroy(self.serviceLocator.getUrl("folders-associate-deleteSmartFolder"), data);
    },
    /**
     * Definition service for bizagi folders
     *
     * @param id optional with filter purpose
     */
	getFolders: function(id) {
        var self = this;
        var data = {};

        data.action = "getUserFolder";
        data.idFolder = id || "";
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("folders-handler"),
            type: "POST",
            data: data,
            dataType: "json"
		}).pipe(function(response) {
			if(id == "") {
                var folders = {
                    folders: [
                        {
                            name: bizagi.localization.getResource("workportal-widget-folders"),
                            id: "-1",
                            idParent: 0,
                            childs: response
                        }
                    ]
                };
                return folders;
			} else if(id == -1) {
                return response;
            } else {
                return self.searchFolders(id, response) || [];
            }
        });
    },
	searchFolders: function(idFolder, data) {
		for(var i = 0; i < data.folders.length; i++) {
            var value = data.folders[i];
			if(value.id == idFolder) {
                return data.folders[i]['childs'];
                break;
            }
        }
        return undefined;
    },
	getCasesByFolder: function(query) {
        query = query || "";

        return $.ajax({
            cache: true,
            url: "RestServices/" + query,
            type: "GET",
            dataType: "json"
        });
    },
	makeFolder: function(options) {
        var self = this;
        var data = {};

        data.action = "CreateUpdateFolder";
        data.folderName = options.folderName || "No Name";

        // Make folder under subcategory        
		if(options.idParentFolder != undefined && options.idParentFolder > 1) {
            data.idParentFolder = options.idParentFolder;
        }

        return $.ajax({
            url: self.serviceLocator.getUrl("folders-handler"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },
	updateFolder: function(options) {
        var self = this;
        var data = {};
        options = options || {};

        data.action = "CreateUpdateFolder";
        // Define idFolder
        data.idFolder = options.idFolder || "";

        // Update name
		if(options.folderName) {
            data.folderName = options.folderName;
        }

        // Update path
		if(options.idParentFolder) {
            data.idParentFolder = options.idParentFolder;
        }

        return $.ajax({
            url: self.serviceLocator.getUrl("folders-handler"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },
    /**
     * Associate cases to folders
     *
     * @param options {idcase,idCustomFolder}
     */
	associateCaseToFolder: function(options) {
        var self = this;
        var data = {};

        data.action = "4";
        options = options || {};

        data.idCase = options.idCase || "";
        data.idCustomFolder = options.idCustomFolder;

        return $.ajax({
            url: self.serviceLocator.getUrl("folders-associate"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },
    /*
     * Dissasociate cases to folder
     *
     * @param options {idFolder, idCase}
     */
	dissasociateCaseFromFolder: function(options) {
        var self = this;
        var data = {};

        data.action = "DeleteCaseFromFolder";
        options = options || {};

        data.idFolder = options.idFolder;
        data.idCase = options.idCase;

        return $.ajax({
            url: self.serviceLocator.getUrl("folders-handler"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },
    /**
     * Delete folder
     * @param options {idCustomFolder}
     */
	deleteFolder: function(options) {
        var self = this;
        var data = {};

        data.action = "5";
        options = options || {};

        data.idCustomFolder = options.idCustomFolder || "";

        return $.ajax({
            url: self.serviceLocator.getUrl("folders-associate"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },
    /**
     * Gets a file binary from the server
     * @param options {fileId}
     */
	getFile: function(options) {
        var self = this;
        var data = {};
        var url = this.serviceLocator.getUrl("file-handler");
        options = options || {};

        data.action = "getFileContent";
        data.uploadId = options.uploadId || "";
        data.entityId = options.entityId || "";
        data.entityKey = options.entityKey || "";

        return bizagi.services.ajax.pathToBase + url + "?" + jQuery.param(data);
    },
    /**
     * Get Comments per case
     * @param params {idCase=int&idColorCategory=int&pag=int&pagSize=int}
     * @return json
     */
	getComments: function(params) {
        //params.idCase = params.idCase || 0;
        var self = this;

        params = params || {};

        return $.read(encodeURI(self.serviceLocator.getUrl("MessageHandler-GetComments")), {
            idCase: params.idCase || "",
            idColorCategory: (typeof params.idColorCategory == 'number') ? params.idColorCategory : "",
            pag: params.pag || 1,
            pagSize: params.pagSize || 10
        })
			.pipe(function(result) {
                var def = new $.Deferred();
                var picture = "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";
				if(!result.comments) {
                    result.comments = [];
                } else {
                    // Add CategoryColor for each comment
					$.each(result.comments, function(key, value) {
						if(!result.comments[key].hasOwnProperty('CategoryColor')) {
                            result.comments[key]['CategoryColor'] = '';
                        }
                    });
                }
				if(!result.users) {
                    $.when(self.getCurrentUser())
						.done(function(user) {
                            result.users = [];
                            result.users.push({
                                Id: user.idUser,
                                Name: user.user,
                                DisplayName: user.userName,
                                Picture: picture
                            });
                        });
                } else {
					$.each(result.users, function(key, value) {
                        // Add picture to all users
                        result.users[key]['Picture'] = (result.users[key]['Picture'] === "") ? picture : result.users[key]['Picture'];
                    });
                }
                def.resolve(result);
                return def.promise();
            });
    },
    /**
     * This function allow create new comment into the activity
     *
     * @param options {idCase,comment}
     * @return json
     */
	makeNewComment: function(options) {
        var self = this;
        var picture = "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABJwSURBVHhe7Vt5UJPnuj+ddvSqdcpotQougCyGRfY9QCQQwhKIrAqurUtbbbVV1KO2UrXH46lL1aOOdWvrcl3QuosIBUSGongA5bLXqLjCVbarrX/97vO8SSAieLRVJ86czPwmX0L8vve3PM/7vp/JX/7yn8d/FHhVCkykC+144403NL16vQ1TU1MtBpqiR48eoL8VE9YQnF/VgF7VdVLffPPNRkdHJ0SER0CpDIdCEYqQkBAtgvlZgdDQUHh5ecHMzIzFyCbIXtUAX9Z12MliN1c3JCcnIzkpGWp1jCBrSD6YBAgODoZczpALBMmCYGFhwULsIJi8rAG+zPM6s+vseGLiaMTFxSM2JlaQl8lkAoGBgQgMCERAQAD8/f0hlfrDz88Pfr5+8PX1FXByctKXxmslgiAfEqxAdFQ0VKooqCJVwnVvb1+Ct4i6l6cXPDw8CR5wd3OHm5sbXF1d4ezMcIYTlQwLYGNjoxfhZRr2ws7NTmm8vLwRSnWuIMelflK46kkRISbl6OAIB4K9vT3s7ewhkdgRJLC1sRWEra2tYWVlhWHDhonnPn36sAjcII3+kWplZQ0Pd08RYXt7Bx0pW0FKT8xqmBUsLYfB0sISFkMtMHToUAwZPASDBw8WTdDU1AwDBw4UGDBggAClikUwN2YFTLp37y5izvFlId7t+y4G9B8gSGmJaae9gQO0xPr3649+/fqJz/UlsNN9TPrAxMRE4J133hGf43RwEnRN0Wg1mMVR5q5vQc72pLl99sfj0b3bW3j77beJYF8t+vRtI9qjR0+80/sdIqoly8e9e/d+DJaWlrC1tRXlwn8z5lmh2MvTm2rYFt26dcOSeTNQnn8U2Ue2w8pyCHp076EjTwIIl/vgrbfeYkKCGAvQ+ykCcAq4VOjzE40xAiYm5CIvdvpRrHv26I6a8+nQXMxAbdFpFGcfxJTx8YIsk9fHnB3n9xicho7uc3K4D3ACGNxDjLUZyrh+hwwZSvXcD3J/T1wrPYNrJRkC10uzUPFLOnZvWQ13Zwf06tVL29yoPzBJqZc7fD2cRaN7913qG/Q3fuY+wKLwbMACGKwSjS4EsoHU3MzMBoOTwLVfV5pJOCNw41I2bpadxbVLubiUn46VyxZhYP9+QghujBx/pVyKr+d/goH9+gpRWAR2n4Xg1wwWmfcSRsee65IF4O7OdTxn+gTcvJyFm5cyBW6V5eB2xTncrvoFd2qKoLmcj5L8DHy37hsE+HmR828xMVgOMcWejcsw98MkSN3tRY/gBOgF4EToSsbo+oBMTG0UaRZg/fL5uFOWTcgSuFuRi7uV+aivKUTDlYtouFqKe9fLUVddgrLCLGQc/hGLPp+GQF83mPZ/F9tXzkPegfU4vHkJUmeOx9houSCuE4B3jWpjS4GMu3p/FuDtXqgsOIr6ihzUl2cLNFSeRUN1Ae7VXsD9qyVovH4JTTcq0XyrBo115bhbfQG1FzJQmrUfpWd24VbREdwpOoTrBftQkfk9StO3GApglCtCE65nruUFMz8gwrm4V0WozCHkorEmH02a82i5XoLWG5fx8E4VHt6txcP6q3hwuwotdaVovHIe96vO4l7ZGTSUHkd98WHUXzxEOIj6ojT4eziAF1rkfKqxuS/G06vHfzXy9HZo+2oikovmmjy01BKunEPr1UI8uF6EhzdK8dvtcvx2txq/37uKR/ev47f6WvHew7pitF4pQFNlFu5dOoF7JUcIh3Gv+BDukQiBXo7o2bMnkiOkvEU2rsepTYsmTklQigXQ0R/XoonIN1ZRCVzOQF3RUdy4eAI3S07jFs0It2hGaL5eSgJo8KhRJ8CtMjRQn7hRdBx1hRT9/L24lrcL1wm3C/eRAGmQ+7qKafIfcyfjxIZFxtUDTmxamHpwy3JRp0d/WIP6skxcPX8ENXn7tTiXhqqzB1CZewDl2VTXOQdwX1NCCbhGCagRopRn7iLsRGXWTlRR3ddkfY/abC2uZG+Hr6stYkOlyNi9Fic3LphlVBFgRzL3rINc6o7D36+ixpeJO5cycLs0nVxnZBDJLJoOc2k9kIfawpO4XpzZJoCm8DiuFaWjrphw4QjqqPnV5e/GDcJNwp3CvVi9YDLy9qxC5u7VOLVpocyoBDi1abH52X1ryZ3VKCMn66mRNVVlaxtaWQYayrNoVshFfRVNhdWFtCYowNWiDDy6RwmgfnC7/BzulucK0e4UH8edC2m4c36fQP2FfWgsPoCajC24eHQT8ug6P61ZbGJUAvBgzmxdqrlB7p3bv0643lKdQ6B6r8pCU3Uu9QWaCa4UounqRTReLUZFbppohCwAv3e/Oh/3K7Jx/3K6aH73i9MEGhkXqXRObsSVvL04tflLXgcY34PLoOjwP5Gz8x+4UXyCunkmWog8o5Vmg1bNLzQTXMRvNBM0XrlgIECVeO/htfNorTmLlvIMNJUeQWPJwTbyjRf345e934DPb3QN0NAKHtzhdXM1tef2o+HyaTSTCM1VmYJYq6YAD64VCbL1tCoUCWjQUAJ0AtBU2UpJaSk/TQIcfox8w/k9OLFxocaoyeuFOLouRV14aANulxwnAc4IEVprcmmOzycBLtB8X4o62iZX5OgEuFOpTYCGBchBc5lOAIo9O8+ozviOGt8io1v/d1mHxzYs1Fw7fwjNFRlCBCbWWnsOD66eJwFKUJ13SEyFIgFCgBI8oBJpocbZXJaOppJDbeRZgPzdf2/8aYcRNr6uFDi4NiW1NH0bLWlPCBFaqRlqBShEMy159WuB3xuuCAFYlAdUIkKAyydJAKp/nfvXcraT+18a5fq/ywTwNJW+dUljXeFBNFNTa9U1wgcU84fXi2lKzKOF0SFKAAlwu0IrAC2DW2gZ3HyZGqiBAOQ+Tu1Ybm58bf/fjIhTUHhwPRrJ0RbRB86KmD/kmeDmJXK+Cr/XswC0DyBRHlCP6CgAu396y1fGufl5FkfSVqdoNDR3t3AfoEbILrcLUEkC6DZCJEpHAbjzZ21bguzXqfY7inJk/bzU01uXUC84KRohk3yomwq59oUAtBFiUToKUHKI1vybv+D9xev7OLBqdmpe2gZcOLIJTRVZbQJot8UsQE2nAlRnbEPe7hU4s33p6y3AwbVzf6osPIHMXatQcnIbWmib/OAqrQWEABWdClCbsxOZ25eh/DSt/SkFp79b7PzaRuDExkXZdbQLrCg4JkS4cGwrmmupD9BiqDMBanL3kOvLaNOzgTZB+3Hp2Aac2rLYuHZ+z+PGqiUp2Q/qLtJuLwdVdJ/wwvFtyPh+BYpP78QN+r8C3gXepnsB1WfTkLNrJU5Sv/jl0HrcKNgjFkNHvluKxTMnvz4rQBYnOjraPDIycs1IpVrj6S9HQcY+tNISuJlmgJt0X6A0ay/O7F2Hw0Ru/7qF+OGbFPy4ai69XoJ8mjYr6WYI3wW6SSKMT1TDL3oilFHxGpVKlcrnfh4DXulnaYATw1SjsmWxk+GS/CXsx6+Ac9znUCpCsHPzSnFfkPcDfHOk/Ox+nDv8HY5uX4E9//wSaXT7+wwl4PyRjUIAvgs8LoHIK+NgN26FOBefk8/N1+BrvVJyXV2MHWFnFOrRjd6jZ8Nx3NdisIbwSPgMsuBQxKhV2LlpBUqz9wsBCqgfnPxxVZsAx7b9DdtWzkfK9IniuwU+ihjYJS974nx8Db5WaFR8oy4VJq9cDF3Md4SMGgv3pAVPDLKjCE5jl0AaMxUjQ1Xi+0BMcNzoWIyJi0K8OgKhIXLx/SD+3pBvRBJcEufDTgj5d9iPM8Ryek0Yuxx2BLfR8xE8KhlUcjteSXnQRUxY9Wcl3lEIJuSS9AU8ElPgE/shvEZNE3CLm0mk5wlSdmP/pkUy42sDLINdkh5L6ZgwZikkBNeEFMjVSS83EeHh4c4RqlGaJx0nh/6NU12SaiPExLSE9KQkY5YQOcJoxlftSEyFpA2LIUnQYjjBPXYm94hiHusLLQs+oUKd2OiYTAPUxe+FkUokck8hNTzhSwyPZ3zxOOIWYXgbFmJ4rBZ2sfMQokpofGEicOzDyXmHMam6CHblkoFTTyVFZDojFUcEuyBlG7sAAjGMvz6OUfNhKzBPC/U8SNRzKAnqF3PzlOd01/g5HVziGLZHTxB6UaRGEcFOSDExG/VcLaIZKe2IouOoOTrMpufZcFVNo+8oqv7cVppjFKQeB4lBBG05ap04xe936VQbocedsnkqKT0hfiZSqnZYqz6HdaQen9GxFlbhn8I6YlYbRqpG40/NDqRgtnM8RSquPX7Dwj/RRvAFkrImcl2RMiRkHTET1uHtYMJWYYxPBCxDpmFY6HRYKWfAOmwGHCI+FlPkH2qIERERsqBRE+AQvwCSmPlt8bMImdohfp07JQh15lTEZ1i3Ox38SJ6/ntzqQKgDKUFOyZhhACLJRHUYFvoxhik+hqV8MsxHTqLjj2BN7w0PnwGZaswfSwG5/5M71b5j7HxqKlRjOpcGS8c8GT+D2GkdezqpdbtOagWYu7ZTUoKQjhSTaUMIHYd82I5gcrwNU2FB5If4jSEhpsCa0jBc+RGcwqc9fwq4buRU+y7x8+EYkwJJ1OewIWIWwVMwyDtO1FrH+GmdMnSJjzu4pCO1dudxIUDSnNXwSpiDUdO/hrN6lpaYASnL4KkQkDOmtCOIjoMm6/ABLEdqMVSaDDP3aDp+H9aUBoliGhzCPoI8MuH5UsCd3yd2BlxiU+Co/hwSFblKNTVEmgQzrxhRaxy/rp0ycKkTUmt/OCoE+HHPfvz888/49ddf8ejRI6Sl58M5imo5qJ0UE7MgQhYyPSbRsQ6BE2HRhgkY4pOIAU6hsAycAOugSZCETIaDciq8wyfwjDDrmXtBuCpW4xGfApcY2uBEzYIk4hNRU4O8YmHmqYYFDdAweu0uGTj1mEvsVjupb78/IgRYunIjZi5eg282/zf+936TeC8j71+PkbIImAA9zAPGw9xfj3F0rIN0LMwJg73i8J6DHOa+o2EtmwCJfBIcFZPhpJwCZYT62b5ep5/6PGJnw4Vi6Rj5CSRhH8Oa4jTQOUxEjFXXRtDQKXKoM6cec4kdm4Bvd/wkyI7+dDn0pEaEfYjm1gfifWn8Z4JQO5Jh7qdHEob6EXwZY9rhMwaDPWLwnn0QhnrGwDpgLCQjJ8AxZBJclJMRGJaAZ1od8uJBGvMhPGJmwSXqUzjSVCIJnQZrqn8+uambSijfHj0iZeCSBbvUmVMGhNZsOyiITv3rah0xLamCf5WL9xOnL9ESI1JDfUa3wzsRQ9uQgCFeesTTcTwGuUXjPYkMg8goG/8xkMjGwlE+AS6KSfBUJD9TGXQjlU66Rc2Ah/pTuKimw5GcsVNQVw16H/1s/WDqEikGK+L3mEvkWJtL7JbepY5OjcZX3/4giBZc/J82QmHj5rYlwFc9XRAS8NQjjo518IjFkDbEYLC7FoNcVHhveCAGjQiBjV8iJAFJGBE0Fi4hE+AUNI6325upDwwjvNlVP3DkD/lEvg/P6OlwjfgII6iJ2AW/Dyv/JPRnAUhd4cpj8TNwif9m4NJQ7yedciBX6m7VCxH4mYVobvk/8XrrnmNErp3UYPdRRI7gxlAbIBqDXQ0RBTOncAwY7o+BBBvfOEj8EzFCRvcX5OMgVSbS75KkK4m4G0HSlQBu9J1+mUKhyB6pSoZb+GSMUHwAuyCqee8Y9LfxhamTUufO4/HTOmXgEh8buNSRlI9qKgqKLgvS/GABtu4++gSpQS5R5CxDpYUzI7IdThEYpIOZoxIDbKUYaOMDGxqvnV88nAMTEUi31pgTc9MJwCJ0+uiv/wD9tmeqUqnMDoqIp/qhxY831Red2NRRIZoNE3p+p6KIoJ6QISkDQkzOgNQgcpVhNoJBTZjhqIeSjnVwCIWZfQgG2PhhkK0PPGVqyJVq+p2iMpu5GBBn8n2fNiX21tUJf1AkwsfHJ5V+23csSBF5y1sWCSf/aEh89PH7g6QEoY6kDAgxMSbVBgURVMBUIKQddiGwdQuFs68SvrJwjJSH3eKx8pg7OM58zAndnnU9wI2CleJ/5KhXkE/KinKv4AvJFcoiaVDErYDgSHgERMKdYO8dgeGe4QJWbkRS79JzkDK1C4aVi0KQs3VTwM4jFO7SMAH/oHBIRypvyYNDi+iHlnt4LDymTgjzuHn8zKPLxvesgrByJgRTXUJsOsRKpIUHwmAHeGCG4DqkSBY9DSxqx39Hvy2crT9vJyRFUgk8Hu7wPD4e5zM7/awCdPU5VpbLhsE9hAdgKBIPTA/njqJ18Zo/Z/jvDMnxufk6+mv+qfH/Pz9r9qvYcZe2AAAAAElFTkSuQmCC";
        return $.create(self.serviceLocator.getUrl("MessageHandler-NewComment"), {
            idCase: options.idCase || '',
            comment: options.comment.replace(/\n/g, "<br>") || ''
        })
			.pipe(function(result) {
				if(result.comments) {
                    var comments = [result.comments];
					$.each(comments, function(key, value) {
                        // Add CategoryColor for each comment
                        comments[key]['CategoryColor'] = '';
                    });
                    result.comments = comments;
                }

				if(result.users) {
                    var users = [result.users];
					$.each(users, function(key, value) {
                        // Add picture to all users
                        users[key]['Picture'] = (users[key]['Picture'] == "") ? picture : users[key]['Picture'];
                    });
                    result.users = users;
                }

                return result;
            });
    },
    /**
     * This function allow create new replies into the comment
     *
     * @param options {idCase=int&idComment=int&comment=string}
     * @return json
     */
	makeNewReply: function(options) {
        var self = this;
        var picture = "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";

        options = options || {};

        return $.create(self.serviceLocator.getUrl("MessageHandler-ReplyComment"), {
            idCase: options.idCase || '',
            idComment: options.idComment || '',
            comment: options.comment.replace(/\n/g, "<br>") || ''
        })
			.pipe(function(result) {
				if(result.comments) {
                    result.Replies = [result.comments];
                }

				if(result.users) {
                    var users = [result.users];
					$.each(users, function(key, value) {
                        // Add picture to all users
                        users[key]['Picture'] = (users[key]['Picture'] == "") ? picture : users[key]['Picture'];
                    });
                    result.users = users;
                }

                return result;
            });
    },
    /**
     * Remove one comment from the list
     *
     * @param options {idCase=int&idComment=int}
     * @return json {action:true|false, message:'if error, explain why'}
     */
	removeComment: function(options) {
        var self = this;

        options = options || {};

        return $.destroy(self.serviceLocator.getUrl("MessageHandler-RemoveComment"), {
            idCase: options.idCase || '',
            idComment: options.idComment || ''
        });
    },
    /**
     * Remove one replies from the list
     *
     * @param options {idCase=int&idComment=int&idReply=int}
     * @return json {action:true|false, message:'if error, explain why'}
     */
	removeReply: function(options) {
        var self = this;

        options = options || {};

        return $.destroy(self.serviceLocator.getUrl("MessageHandler-RemoveReply"), {
            idCase: options.idCase || '',
            idComment: options.idComment || '',
            idReply: options.idReply || ''
        });

    },
    /**
     * Rename category
     *
     * @param options {idColorCategory=int&colorName=string}
     * @return json
     */
	renameCommentCategory: function(options) {
        var self = this;

        options = options || {};

        return $.update(self.serviceLocator.getUrl("MessageHandler-RenameCategoryColor"), {
            idColorCategory: (options.idColorCategory >= 0) ? options.idColorCategory : '',
            colorName: options.colorName || ''
        });
    },
    /**
     * @param options {idCase=int&idComment=int&idColorCategory={0-5}}
     * return json
     */
	setCommentCategory: function(options) {
        var self = this;

        options = options || {};

        return $.update(self.serviceLocator.getUrl("MessageHandler-SetCategoryToComment"), {
            idCase: options.idCase || '',
            idComment: options.idComment || '',
            idColorCategory: (typeof options.idColorCategory == 'number') ? options.idColorCategory : ""
        });
    },
    /**
     * @return json Definition of all categories of message
     */
	getCommentsCategories: function() {
        var self = this;

        return $.read(self.serviceLocator.getUrl("MessageHandler-GetCategoryColors"))
			.pipe(function(result) {
				if(result.length > 1 && result[0]['categories']) {
                    return result[0];
                } else {
                    return result;
                }
            });
    },
    /**
     * This service can be define number of new comments based on idComment
     * @param json  options {idCase=int, idLastComment=int}
     * @return int
     */
	getNewComments: function(options) {
        var self = this;
        options = options || {};
        var data = {
            idCase: options.idCase || 0,
			idComment: options.idComment || 0
        }

        return $.read(self.serviceLocator.getUrl("MessageHandler-CountNewComments"), data);
    },
    /**
     * Get all analisys queries
     * @return json
     */
	getAnalisysQueries: function() {
        var self = this;

        return $.read(self.serviceLocator.getUrl("bamAnalytics-handler-getAnalisysQueries"));
    },
    /**
     * Update name and comment
     *
     * @param options json {queryName,queryDescription,idQuery }
     * @return json  {response:true}
     */
	updateQueries: function(options) {
        var self = this;

        return $.update(self.serviceLocator.getUrl("bamAnalytics-handler-updateQuery"), {
            idQuery: (options.idQuery >= 0) ? options.idQuery : "",
            queryName: options.queryName || "",
            queryDescription: options.queryDescription || ""
        });
    },
    /**
     * Delete query
     *
     * @param queryId integer
     * @return json  {response:true}
     */
	deleteQueries: function(queryId) {
        var self = this;
        var data = {};

        data.action = "1612";
        data.QueryId = queryId || '';

        return $.destroy(self.serviceLocator.getUrl("reports-handler-deleteQueries"), data);
    },
    /**
     * Get bizagi configuration
     * @param {Function}   type    callback function when the file load is succed
     * @return {deferred} ajax object with JSON content
     */
	getConfiguration: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("authenticationConfig");

        return $.read(url);
    },
    /**
     * Logout Service
     */
	logout: function(overridelogoutUrl) {
	    var self = this;
	    //debugger;
		var logoutData = {sourceLogout: "user"};
        // Remove session storage of authentication data
        sessionStorage.removeItem("bizagiAuthentication");
        //debugger;
        //Call to the restfull service for domain list
        try {

			$.when(self.getConfiguration()).done(function(data) {
                var authenticationType = data.authenticationType;
				switch(authenticationType) {
                    case 'Federate':
                        $.when($.create(self.serviceLocator.getUrl("logout"), logoutData)).done(function () {
                            var logOffURL = data.logOffURL;

                            if (overridelogoutUrl && overridelogoutUrl != "") {
                                logOffURL = logOffURL.replace(/wreply=[^&]*/, "wreply=" + overridelogoutUrl);
                            }
                            
                            location.href = logOffURL;
						}).fail(function() {
						    bizagi.log("Error logging out");
						}).always(function() {
                            location.href = data.logOffURL;
                        });
                        break;
				    case 'SAML':
				        loader.nativeAjax(loader.getPathUrl(self.serviceLocator.getUrl("logout"), logoutData), function (response) {
				            var jsonResponse = JSON.parse(response.responseText);

				            if (jsonResponse.logout === true) {
				                if (typeof jsonResponse.samlUrlRedirect != 'undefined') {
				                    var url = decodeURI(jsonResponse.samlUrlRedirect);
				                    var iframe = document.createElement("iframe");

				                    document.getElementsByTagName("body")[0].appendChild(iframe);

				                    $(iframe).on("load", function () {
				                        var iframeContent = bizagi.util.isIE8() ? $(this.contentWindow.document.body) : $(this.contentWindow.eval("document.body"));
				                        var rawResponse = iframeContent.text();

				                        location.reload();
				                    });

				                    iframe.src = url;

				                } else {
				                    location.reload();
				                }
				            }
				            else {
				                bizagi.log("Error logging out");
				            }
				        });
						break;
				    case 'OAuth2':
				        $.when($.create(self.serviceLocator.getUrl("logout"), logoutData)).done(function () {
				            $.when($.read(self.serviceLocator.getUrl("oauth2AuthenticationConfig"))).done(function (response) {
				                if (response.logoutUrl && response.logoutUrl != "") {
				                    var logoutUrl = response.logoutUrl;				                    
				                    var callbackUrl = overridelogoutUrl || response.homeUrl;
				                    logoutUrl = logoutUrl.replace(/post_logout_redirect_uri=[^&]*/, "post_logout_redirect_uri=" + callbackUrl);
				                    location.href = logoutUrl;
				                }
				                else {
				                    location.reload();
				                }
				            }).fail(function () {
				                bizagi.log("Error logging out");
				            });
				        }).fail(function () {
				            bizagi.log("Error logging out");
				        });
				        break;
                    default:
                        //Normal
                        $.when($.create(self.serviceLocator.getUrl("logout"), logoutData)).done(function () {
                            if (overridelogoutUrl) {
                                location.href = overridelogoutUrl;
                            }
                            else {
                                window.location = bizagi.services.ajax.loginPage;
                            }						    
						}).fail(function() {
						    bizagi.log("Error logging out");
                        });
                        break;
                }
			}).fail(function(message) {
			    console.log(message);
            });
		} catch(e) {
		    console.log(e);
		}
    },

    /**
     * Logout Mobile Service
     */
	logoutMobile: function() {
        var self = this;

        // Remove session storage of authentication data
        sessionStorage.removeItem("bizagiAuthentication");

        var url = self.serviceLocator.getUrl("logout");

        return $.read(url);
    },

    /**
     * Logout  beforeunload Service
     */
	logoutBeforeUnload: function() {
        var self = this;
        // Remove session storage of authentication data
        sessionStorage.removeItem("bizagiAuthentication");

        //Call to the restfull service for domain list
        $.ajax({
            type: 'POST',
            async: false,
			data: {sourceLogout: "browser"},
            url: self.serviceLocator.getUrl("logout")
        });
    },
    /**
     * Services for Massive Activity Assignment
     */

    /*
     *   Obtain the organization info, such as roles, skills or locations. One of this options must be specified as a parameter
     * @param object  {objectType=Roles|Skills|Locations}
     * @return json
     */
	getOrganizationInfo: function(params) {
        var self = this;

        // Define data
        var data = {};

        data["objectType"] = params;

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("massive-activity-assignments-getOrganizationInfo"),
            data: data,
            type: "GET",
            dataType: "json"
        });
    },
    /*
     *   Get Cases By Organization, using parameters suchs as roles, skills and locations
     * @param object  {roles=(string),roles=(skills), locations=(string)}
     * @return json
     */
	getCasesByOrganization: function(params) {
        var self = this;

        // Define data
        var data = {};


        data["roles"] = (params.roles) ? '[' + params.roles.toString() + ']' : '[]';

        data["skills"] = (params.skills) ? '[' + params.skills.toString() + ']' : '[]';

        data["locations"] = (params.locations) ? '[' + params.locations.toString() + ']' : '[]';

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("massive-activity-assignments-getCasesByOrganization"),
            data: data,
            type: "GET",
            dataType: "json"
        });
    },
    /*
     *   Get Cases By Organization, using parameters suchs as roles, skills and locations
     * @param object  {user=[array], roles=(string),roles=(skills), locations=(string)}
     */
	reassignCases: function(params) {
        var self = this;

        // Define data
        var data = {};

        data["users"] = (params.user) ? '[' + params.user.toString() + ']' : '[]';
        data["roles"] = (params.roles) ? '[' + params.roles.toString() + ']' : '[]';
        data["skills"] = (params.skills) ? '[' + params.skills.toString() + ']' : '[]';
        data["locations"] = (params.locations) ? '[' + params.locations.toString() + ']' : '[]';

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("massive-activity-assignments-reassignCases"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },
    /*
     * Search the users inside the Organization, using parameters suchs as userName, full name, domain, roles, skills and locations
     * All parameters are optional
     * @param object  {userName=(string), fullName=(string), domain=(string), roles=(string),roles=(skills), locations=(string)}
     * @return json
     */
	searchUsers: function(params) {
        var self = this;

        // Define data
        var data = {};

        data["userName"] = params.userName || "";

        data["fullName"] = params.fullName || "";

        data["domain"] = params.domain || "";

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("massive-activity-assignments-searchUsers"),
            data: data,
            type: "GET",
            dataType: "json"
        });
    },

    /*
     * Search the users inside the Organization, using an id's array
     * @return json
     */
	searchUsersByID: function(ids) {
        var self = this;

        // Define data
        var data = {
            ids: "[" + ids.toString() + "]"
        };

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("massive-activity-assignments-searchUsersById"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },

    /*
     * Search users usign parameters suchs as userName, fullName, domain and organization
     * @params { domain: (string), userName: (string), fullName: (string), organization: (string), page: (int), pageSize: (int) }
     * @return {deferred} ajax object with JSON content
     */
	getUsersList: function(params) {
        var self = this;

        return $.read(self.serviceLocator.getUrl("admin-getUsersList"), params);
    },

    /*
     * Search users usign parameters suchs as userName, fullName, domain and organization
     * @params { domain: (string), userName: (string), fullName: (string), organization: (string), page: (int), pageSize: (int) }
     * @return {deferred} ajax object with JSON content
     */
    getUsersForAssignation: function(params) {
        var self = this;

        return $.read(self.serviceLocator.getUrl("admin-getUsersForAssignation"), params);
    },

    /*
     * Search users usign parameters suchs as userName, fullName, domain and organization
     * @params { domain: (string), userName: (string), fullName: (string), organization: (string), page: (int), pageSize: (int) }
     * @return {deferred} ajax object with JSON content
     */
    getOAuth2Applications: function(params) {
        var self = this;

        return $.read(self.serviceLocator.getUrl("admin-getUsersForAssignation"), params);
    },

    /*
     * Search adhoc processes usign parameters suchs as name, state and category
     * @params { name: (string), state: (string), category: (string), page: (int), pageSize: (int) }
     * @return {deferred} ajax object with JSON content
     */
	getAdhocProcessesList: function (params) {
	    var self = this;

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-getAdhocProcessesList"),
	        data: params,
	        type: "POST",
	        dataType: "json"
	    });	    
	},

	createAdhocProcess: function (params) {
	    var self = this;

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-createAdhocProcess"),
	        data: params,
	        type: "POST",
	        dataType: "json"
	    });
	},

    createNewAdhocProcess: function (params) {
        var self = this;
        return $.create({
            url: self.serviceLocator.getUrl("admin-createNewAdhocProcess"),
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
        });
    },

	updateAdhocProcess: function (params) {
	    var self = this;

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-updateAdhocProcess"),
	        data: params,
	        type: "POST",
	        dataType: "json"
	    });
	},

	publishAdhocProcess: function (params) {
	    var self = this;

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-publishAdhocProcess"),
	        data: params,
	        type: "POST",
	        dataType: "json"
	    });
	},

	deleteAdhocProcess: function (idProcess) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-deleteAdhocProcess");

	    return $.ajax({
	        url: url.replace("{processId}", idProcess),	        
	        type: "DELETE",
	        dataType: "json"
	    });
	},

	cloneAdhocProcess: function (process) {
	    var self = this;	    

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-cloneAdhocProcess"),
	        data: process,
	        type: "POST",
	        dataType: "json"
	    });
	},

	deleteAdhocTask: function (params) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-deleteAdhocTask");

	    return $.ajax({
	        url: url.replace("{processId}", params.idProcess).replace("{taskId}", params.idTask),	        
	        type: "DELETE",
	        dataType: "json"
	    });
	},

	updateAdhocTask: function (params) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-updateAdhocTask");

	    return $.ajax({
	        url: url.replace("{processId}", params.idProcess),
	        data: params.task,
	        type: "POST",
	        dataType: "json"
	    });
	},

	getAdhocDataSchema: function (processId) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-getAdhocDataSchema");

	    return $.ajax({
	        url: url.replace("{processId}", processId),
	        type: "GET",
	        dataType: "json"
	    });
	},

	getAdhocProcessDiagram: function (processId, diagramId) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-getAdhocProcessDiagram");

	    return $.ajax({
	        url: url.replace("{processId}", processId).replace("{diagramId}", diagramId),
	        type: "GET",
	        dataType: "json"
	    });
	},

	getAdhocTask: function (processId, taskId) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-getAdhocTask");

	    return $.ajax({
	        url: url.replace("{processId}", processId).replace("{taskId}", taskId),
	        type: "GET",
	        dataType: "json"
	    });
	},

	saveAdhocProcessDiagram: function (processId, diagram) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-saveAdhocProcessDiagram");

	    return $.ajax({
	        url: url.replace("{processId}", processId),
	        data: diagram,
	        type: "POST",
	        dataType: "json"
	    });
	},

	getAdhocEntitiesList: function () {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-adhoc-entities-list");
	    var data = {};
	    return $.read(url, data);
	},

	getAdhocUserGroupList: function () {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-adhoc-user-group-list");
	    var data = {};
	    return $.read(url, data);	    
	    /*return  [
            { id: "0A1C66DB-3A7A-43D4-B1FD-99EA604C82CA", displayName: "My Group", groupType: 2, description: "Adhoc Group for testing..." },
	        { id: "0A1C66DB-3A7A-43D4-B1FD-99EA604C82CB", displayName: "Test Group", groupType: 1, description: "Bizagi Group for testing..." },
            { id: "0A1C66DB-3A7A-43D4-B1FD-99EA604C82CC", displayName: "Analysts", groupType: 1, description: "Bizagi Group for testing..." },
            { id: "0A1C66DB-3A7A-43D4-B1FD-99EA604C82CD", displayName: "Executives", groupType: 2, description: "Adhoc Group for testing..." },
            { id: "0A1C66DB-3A7A-43D4-B1FD-99EA604C82CE", displayName: "Administrators", groupType: 1, description: "Bizagi Group for testing..." }
	    ]*/
	},

	loadUsersByGroup: function (groupId) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-adhoc-user-group-data-get");
	    
	    return $.ajax({
	        url: url.replace("{groupId}", groupId),
	        type: "GET",
	        dataType: "json"
	    });
	    //return [{ id: "0A1C66DB-3A7A-43D4-B1FD-99EA604C82CC", displayName: "Jose Aranzazu", photo: "My description." }]
	    /*return  [
            { id: "0A1C66DB-3A7A-43D4-B1FD-99EA604C82CA", displayName: "Juliana Reyes", photo: "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" },
	        { id: "0A1C66DB-3A7A-43D4-B1FD-99EA604C82CB", displayName: "Diana Reina", photo: "iVBORw0KGgoAAAANSUhEUgAAAPoAAAD6CAIAAAAHjs1qAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNGNkVDRTEwQ0NFNjExRTQ4REY2OTg3RTg2NTdGMzJGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNGNkVDRTExQ0NFNjExRTQ4REY2OTg3RTg2NTdGMzJGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0Y2RUNFMEVDQ0U2MTFFNDhERjY5ODdFODY1N0YzMkYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0Y2RUNFMEZDQ0U2MTFFNDhERjY5ODdFODY1N0YzMkYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6IWVyxAAFTF0lEQVR42uS9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" },
            { id: "0A1C66DB-3A7A-43D4-B1FD-99EA604C82CC", displayName: "Jose David Lopera"}
	    ]*/
	},

	loadAuthItemInfoByInstance: function (instances) {
	    var self = this;	    

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-adhoc-authorization-data-get"),
	        data: instances,
	        type: "POST",
	        dataType: "json"
	    });
	},

	saveAdhocAuthorizationInfo: function (params) {
	    var self = this;

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-adhoc-authorization-data-save").replace("{processId}", params.processId).replace("{isAdhocTask}", params.isAdhocTask),
	        data: params.auth,
	        type: "POST",
	        dataType: "json"
	    });
	},

	deleteAdhocGroup: function (groupId) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-adhoc-user-group-delete");

	    return $.ajax({
	        url: url.replace("{groupId}", groupId),
	        type: "DELETE",
	        dataType: "json"
	    });
	},

	saveAdhocGroup: function (params) {
	    var self = this;

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-adhoc-user-group-save"),
	        data: params,
	        type: "POST",
	        dataType: "json"
	    });
	},

	addUserToGroup: function (params) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-adhoc-user-group-data-add");

	    return $.ajax({
	        url: url.replace("{groupId}", params.groupId).replace("{userId}", params.userId),
	        type: "GET",
	        dataType: "json"
	    });
	},

	removeUserFromGroup: function (groupId, userId) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-adhoc-user-group-data-remove");

	    return $.ajax({
	        url: url.replace("{groupId}", groupId).replace("{userId}", userId),
	        type: "DELETE",
	        dataType: "json"
	    });
	},

	getAdhocEntityInstances: function (entityId) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-adhoc-entity-instances");

	    return $.ajax({
	        url: url.replace("{entityId}", entityId),
	        type: "GET",
	        dataType: "json"
	    });
	},

	getEntityValues: function (context, entityId) {
	    var self = this;
	    var url = self.serviceLocator.getUrl("admin-entity-values");

	    return $.ajax({
	        url: url.replace("{context}", context).replace("{entityId}", entityId),
	        type: "GET",
	        dataType: "json"
	    });	    
	},

	saveAdhocEntity: function (params) {
	    var self = this;

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-saveAdhocEntity"),
	        data: params,
	        type: "POST",
	        dataType: "json"
	    });
	},

	saveAdhocEntityInstance: function (params) {
	    var self = this;

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-saveAdhocEntityInstance").replace("{entityId}", params.entityId).replace("{isNew}", params.isNew),
	        data: params.instance,
	        type: "POST",
	        dataType: "json"
	    });
	},

	getAllEntities: function () {
	    var self = this;

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-getAllEntities"),
	        type: "GET",
	        dataType: "json"
	    });
	},

	getAllCategories: function () {
	    var self = this;    

	    return $.ajax({
	        url: self.serviceLocator.getUrl("admin-getAllCategories"),
	        type: "GET",
	        dataType: "json"
	    });
	},

    /**
     * Get json with bizagi domains list
     * @return {deferred} ajax object with JSON content
     */
	getDomainList: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("domains");

        return $.read(url);
    },
    /**
     * Services for Asynchronous ECM Upload
     */

    /* Get the ECM Pending Scheduled Jobs
     * @return {deferred} ajax object with JSON content
     */
	getEcmAllScheduledJobs: function() {
        var self = this;

        // Define data
        var data = {};
        data["action"] = "getEcmAllScheduledJobs";

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("async-ecm-upload-baseService"), data);
    },
    /* Retries an especific ECM Pending Scheduled Job
     * @param object  {jobId=(string)} //The id of the job wich is going to be retried
     * @return {deferred} ajax object with JSON content
     */
	retryECMPendingScheduledJob: function(params) {
        var self = this;

        // Define data
        var data = {};
        data["action"] = "retryECMPendingScheduledJob";
        data["idJob"] = params;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("async-ecm-upload-baseService"), data);
    },
    /*
     *   Returns the current workportal version
     */
	getWorkPortalVersion: function() {
        var self = this;

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("WorkPortalVersion"),
            type: "GET",
            dataType: "json"
		}).always(function(data) {
            // Compatibility with java version
            data = data || {};

			if(data.version == "") {
                // Take the build version
                data.version = bizagi.loader.productBuild || "";
            }
            return data;
        });
    },
    /*
     *   Returns the combo's data to authentication log depending of the params
     */
	getAuthenticationLogData: function(params) {
        var self = this;

        // Define data
        var data = {};
        var url = "";

		if(params["dataType"] == "domains") {
            url = "admin-getAuthenticationDomains";
		} else if(params["dataType"] == "events") {
            url = "admin-getAuthenticationEventsTypes";
        } else {
            url = "admin-getAuthenticationEventSubTypes";
        }

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl(url),
            data: data,
            type: "GET",
            dataType: "json"
        });
    },
    /*
     *   Get the search result of authentication log
     */
	getAuthenticationLogResult: function(params) {
        var self = this;

        // Define data
        var data = {};

        data["action"] = params.action;
        data["domain"] = params.domain;
        data["userName"] = params.userName;
        data["dtFrom"] = params.dtFrom;
        data["dtTo"] = params.dtTo;
        data["eventSubType"] = params.eventSubType;
        data["eventType"] = params.eventType;
        data["pag"] = params.pag;
        data["pagSize"] = params.pagSize;

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("admin-getAuthenticationLog"),
            data: data,
            type: "GET",
            dataType: "json"
		}).pipe(function(result) {
            var resultLength = result.rows.length;
            var i = 0;
            var DATE_COLUMN_NUMBER = 0;
			for(i; i < resultLength; i++) {
                var row = result.rows[i][DATE_COLUMN_NUMBER];
                var value = new Date(row);
                var formattedDate = bizagi.util.dateFormatter.formatDate(value, bizagi.localization.getResource("dateFormat"));
                result.rows[i][DATE_COLUMN_NUMBER] = (value == "Invalid Date") ? row : formattedDate;
            }
            return result;
        });
    },
    /*
     *   Return the password encrypted
     */
	encryptString: function(params) {
        var self = this;

        var data = {};

        // Define data
        params = params || {};

        data.entry = params.entry;

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("admin-EncryptString"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },

    /*
     *   Return the users requests
     */
	userPendingRequests: function(params) {
        var self = this;
        var data = {
            pag: params.pag,
            pagSize: params.pagSize
        }

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("admin-UserPendingRequests"), data);
    },

    /*
     *   Return the User Authentication Info
     */
	userAuthenticationInfo: function(params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("admin-UserAuthenticationInfo"), {
            idUser: params.idUser
        });
    },

    /*
     *   Return Update User Authentication Info
     */
	updateUserAuthenticationInfo: function(params) {
        var self = this;

        // Call ajax and returns promise
        return $.create(self.serviceLocator.getUrl("admin-updateUserAuthenticationInfo"), {
            idUser: params.idUser,
            password: params.password,
			enabled: params.enabled,
            expired: params.expired,
            locked: params.locked
        });
    },

    /*
     *   Return generate Data To Send By Email
     */
	generateRandomPassword: function(params) {
        var self = this;

        // Define data
        params = params || {};
        params["action"] = "generateRandomPassword";
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("admin-generateRandomPassword"),
            data: params,
            type: "POST",
            dataType: "json"
        });
    },

    /*
     *   Return generate Data To Send By Email
     */
	generateDataToSendByEmail: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data["action"] = "GenerateDataToSendByEmail";
        data["idUser"] = params.idUser;
        data["password"] = params.password;
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("admin-GenerateDataToSendByEmail"),
            data: params,
            type: "POST",
            dataType: "json"

        });
    },

    /*
     *   Return generate Send Mail
     */
	sendEmail: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data["action"] = "sendEmail";
        data["emailTo"] = params.emailTo;
        data["subject"] = params.subject;
        data["body"] = params.body;
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("admin-sendEmail"),
            data: params,
            type: "POST",
            dataType: "json"
        });
    },

    /*
     *   Return generate Send user password Mail
     */
	sendUserEmail: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data["action"] = "SendUserEmail";
        data["emailTo"] = params.emailTo;
        data["subject"] = params.subject;
        data["body"] = params.body;
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("admin-sendUserEmail"),
            data: params,
            type: "POST",
            dataType: "json"
        });
    },

    /*
     *   Return Applications, Categories or processes list
     */
	getApplicationCategoriesList: function(params) {
        var self = this;
        var data = {};
        var url = "";

		if(params.action == "Applications") {
            url = "admin-getApplicationList";
            return $.ajax({
                url: self.serviceLocator.getUrl(url),
                type: "GET",
                dataType: "json"
            });
        } else {
            url = "admin-getCategoriesList";
            data.idApp = params.idApp;
            data.idCategory = params.idCategory;
			if(data.idCategory == "") {
                data.idCategory = -1;
            }
			if(typeof ( params.filterStartEvent ) !== 'undefined') {
                data.filterStartEvent = params.filterStartEvent;
            }
            return $.ajax({
                url: self.serviceLocator.getUrl(url),
                data: data,
                type: "GET",
                dataType: "json"
            });
        }

        // Call ajax and returns promise

    },

    /*
     *   Return the list of all cases that matched the filters
     */
	getAdminCasesList: function(params) {
        var self = this;
        var data = params || {};

        // Call ajax and returns promise
        return $.ajax({
            //eliminar esto con el servicio restfull
            cache: true,
            url: self.serviceLocator.getUrl("admin-getCasesList"),
            data: data,
            type: "GET",
            dataType: "json"
        });

    },

    /*
     *   Return the application's processes
     */
	getApplicationProcesses: function(params) {

        var self = this;
        var url = self.serviceLocator.getUrl("admin-getApplicationProcesses");

        var data = {};

        data["idApp"] = params["idApp"] ? params["idApp"] : -1;


        return $.read(url, data);
    },

    /*
     *   Return the application's processes
     */
	getProcessVersion: function(params) {

        var self = this;
        var url = self.serviceLocator.getUrl("admin-getProcessVersion");

        var data = {};

        data["idWfClass"] = params["idWFClass"];

        return $.read(url, data);
    },

    /*
     *   Return the the workflow's versions task
     */
	getProcessTasks: function(params) {

        var self = this;
        var url = self.serviceLocator.getUrl("admin-getProcessTasks");

        var data = {};

        data["idWfClass"] = params["idWFClass"];
        data["version"] = params["version"] ? params["version"] : undefined;

        return $.read(url, data);
    },

    /*
     * Retrieves the alarms from an specific task
     */
	getTaskAlarms: function(params) {

        var self = this;
        var url = self.serviceLocator.getUrl("admin-getTaskAlarms");

        var data = {};

        data["idTask"] = params["idTask"];

        return $.read(url, data);
    },

    /*
     * Retrieves each kind of alarm lapse
     */
	getLapseMode: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-getLapseMode");

        return $.read(url);
    },

    /*
     * Retrieves each kind of alarm recurrence
     */
	getRecurrMode: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-getRecurrMode");

        return $.read(url);
    },


    /*
     * Retrieves each kind of alarm recurrence
     */
	getScheduleType: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-getScheduleType");

        return $.read(url);
    },

    /*
     *   Retrieves the boss list
     */
	getBossList: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-getBossList");

        return $.read(url);
    },

    /*
     *   Add a new alarm
     */
	addAlarm: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-addAlarm");

        var data = {};

        data["idTask"] = params["idTask"];
        data["idRecurrMode"] = params["idRecurrMode"];
        data["idLapseMode"] = params["idLapseMode"];
        data["scheduleType"] = params["scheduleType"];
        data["alarmTime"] = params["alarmTime"];
        data["alarmRecurrTime"] = params["alarmRecurrTime"];
        data["sendToCurrentAssignee"] = params["sendToCurrentAssignee"];

        return $.update(url, data);
        /*
         return $.ajax({
         url: self.serviceLocator.getUrl("admin-addAlarm"),
         data: data,
         type: "PUT",
         dataType: "json"
         });
         */
    },

    /*
     *   Edits an existin alarm
     */
	editAlarm: function(params) {

        var self = this;
        var url = self.serviceLocator.getUrl("admin-editAlarm");

        var data = {};

        data["idTask"] = params["idTask"];
        data["idAlarm"] = params["idAlarm"];
        data["idRecurrMode"] = params["idRecurrMode"];
        data["idLapseMode"] = params["idLapseMode"];
        data["scheduleType"] = params["scheduleType"];
        data["alarmTime"] = params["alarmTime"];
        data["alarmRecurrTime"] = params["alarmRecurrTime"];
        data["sendToCurrentAssignee"] = params["sendToCurrentAssignee"];


        return $.update(url, data);


    },

    /*
     *   Delete an alarm
     */
	deleteAlarm: function(params) {

        var self = this;
        var url = self.serviceLocator.getUrl("admin-deleteAlarm");

        var data = {};

        data["idAlarm"] = params["idAlarm"];

        return $.destroy(url, params);

    },

    /*
     * Returns the Alarm Recipients
     * @param param: idAlarm : the alarm id to get the related recipients
     */
	getAlarmRecipients: function(params) {

        var self = this;
        var url = self.serviceLocator.getUrl("admin-alarmRecipients");

        var data = {};

        data["idAlarm"] = params["idAlarm"];

        return $.read(url, data);
    },

    /*
     * Adds a new Alarm Recipient to the current alam
     * @param param: idAlarm : the alarm id to get the related recipients
     * @param param: idRecipient : the recipient id
     */
	addRecipientToAlarm: function(params) {

        var self = this;
        var url = self.serviceLocator.getUrl("admin-recipientToAlarm");

        var data = {};

        data["idAlarm"] = params["idAlarm"];
        data["idRecipient"] = params["idRecipient"];

        return $.update(url, data);


    },

    /*
     * Delete/s the alarm recipient/s from the current task
     * @param param: idRecipient : the recipient id/s who is going to be deleted
     */
	deleteRecipientsFromAlarm: function(params) {

        var self = this;
        var url = self.serviceLocator.getUrl("admin-deleteAlarmRecipients");

        var data = {};

        data["idRecipients"] = params["idRecipients"];

        return $.destroy(url, data);
    },

    /*
     * Send the action to toggle the alarms state: enable or disable
     * @param param: idTask : the task id who is going to be actvidated/deactivaded his alarms
     */
	enableAlarm: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-enableAlarm");

        var data = {};

        data["idTask"] = params["idTask"];

        return $.create(url, data);
    },

    /*
     * Invalidate or Reassign a set of cases
     */
	abortReassignItems: function(params) {
        var self = this;
        var data = params || {};
        var url = params.action == "abort" ? "admin-abortItems" : "admin-reassignItems";
        // Call ajax and returns promise

        return $.ajax({
            url: self.serviceLocator.getUrl(url),
            data: data,
            type: "POST",
            dataType: "json"
        });
    },
    /*
     * Services for Asynchronous Activities
     */
	asyncActivitiesServices: function(params) {
        var self = this;
        var data = params;
        var url = "";
        var type = "GET";
		if(params.action == "getActivities") {
            url = self.serviceLocator.getUrl("admin-async-activities-get-activities");
		} else if(params.action == "retryNow") {
            type = "POST";
            url = self.serviceLocator.getUrl("admin-async-activities-get-retry-now");
            url = url.replace("{idCase}", params.idCase);
            url = url.replace("{idworkItem}", params.idWorkitem);
			url = url.replace("{idAsynchWorkitem}", params.idAsynchWorkitem);
		} else if(params.action == "getActivitiesByTask") {
            url = self.serviceLocator.getUrl("admin-async-activities-get-activities-by-task");
		} else if(params.action == "enableExecution") {
            type = "POST";
            url = self.serviceLocator.getUrl("admin-async-activities-enable-execution");
		} else if(params.action == "enableMultiple") {
            url = self.serviceLocator.getUrl("admin-async-activities-enable-multiple");
            type = "POST";
		} else if(params.action == "asyncExecution") {
            url = self.serviceLocator.getUrl("admin-async-activities-async-execution");
		} else if(params.action == "asyncExecutionLog") {
            url = self.serviceLocator.getUrl("admin-async-activities-async-execution-log");

            url = url.replace("{idCase}", params.idCase);
            url = url.replace("{idworkItem}", params.idWorkItem);
			if(params.idCase == -1) {
                url = url.replace("{idAsynchWorkitem}", params.idAsynchWorkitem);
            } else {
                url = url.replace("{idAsynchWorkitem}", "-1");
            }
		} else if(params.action == "getAsyncExecution") {
            url = self.serviceLocator.getUrl("admin-async-activities-async-get-current-execution-log");
        }
        // Call ajax and returns promise
        var response = $.ajax({
            url: url,
            data: data,
            type: type,
            dataType: "json"
        });

        return response;
    },

    /*
     *  Return generate Default Assignation To all Process
     */
	getDefaultAssignationUserToAllProcess: function(params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("admin-getDefaultAssignationUserToAllProcess"), {
            serviceAction: "getDefaultAssignationUserToAllProcess"
        });
    },

    /*
     *  Return generate Default Assignation To Process
     */
	getDefaultAssignationUserToProcess: function(params) {
        var self = this;
        var process;
        // Call ajax and returns promise
		if(params.idWFClass == "") {
            process = -1
        } else {
            process = params.idWfClass
        }
        return $.read(self.serviceLocator.getUrl("admin-getDefaultAssignationUserToProcess"), {
            serviceAction: "getDefaultAssignationUserToProcess",
            process: process

        });
    },

    /*
     * Return Assignation Process
     */
	setDefaultAssignationUserToProcess: function(params) {
        var self = this;
		if(params.idWFClass == "") {
            process = -1
        } else {
            process = params.idWfClass
        }

        // Call ajax and returns promise
        return $.create(self.serviceLocator.getUrl("admin-setDefaultAssignationUserToProcess"), {
            serviceAction: "setDefaultAssignationUserToProcess",
            process: process,
            idUser: params.idUser
        });
    },


    /*
     *   Returns the combo's data to Type Profiles depending of the params
     */
	getProfilesTypes: function(params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("admin-getProfilesTypes"));
    },

    /*
     *  Return generate Search Profiles
     */
	searchProfiles: function(params) {
        var self = this;

        var url = self.serviceLocator.getUrl("admin-searchProfiles");
        var data = {};
        data["type"] = params["profileType"];
        data["name"] = params["profileName"];

        data["orgId"] = params["orgId"] ? params["orgId"] : null;

        return $.read(url, data);
    },

    /*
     *  Return Users By Profiles
     */
	getUsersByProfile: function(params) {
        var self = this;

        var url = self.serviceLocator.getUrl("admin-getUsersByProfile");
        var data = {};
        data["type"] = params["profileType"];
        data["id"] = params["idProfile"];

        return $.read(url, data);
    },

    /*
     *  Remove User Profiles
     */
	removeUserFromProfile: function(params) {
        var self = this;

        var url = self.serviceLocator.getUrl("admin-removeUserFromProfile");
        var data = {};
        data["type"] = params["profileType"];
        data["id"] = params["idProfile"];
        data["idUser"] = params["idUser"];

        return $.destroy(url, data);
    },

    /*
     *  Add Users Profiles
     */
	addUserToProfile: function(params) {
        var self = this;

        var url = self.serviceLocator.getUrl("admin-addUserToProfile");
        var data = {};
        data["type"] = params["profileType"];
        data["id"] = params["idProfile"];
        data["idUser"] = params["idUser"];

        return $.update(url, data);
    },
    /*
     *  Display Licenses
     */
	licenses: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-Licenses");
        return $.read(url);
    },

    /*
     *   Return Dimensions List
     */
	getDimensions: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-GetDimensions");
        return $.read(url);
    },

    /*
     *   Edit Dimensions
     */
	editDimension: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data["id"] = params.id;
        data["displayName"] = params.displayName;
        data["name"] = params.name;
        data["idWfClass"] = params.idWfClass;
        data["entityPath"] = params.entityPath;
        data["description"] = params.description;
        var url = self.serviceLocator.getUrl("admin-EditDimension");
        // Call ajax and returns promise
        return $.create(url, data);
        /*return $.ajax({
         url: self.serviceLocator.getUrl("admin-EditDimension"),
         data: params,
         type: "POST",
         dataType: "json"
         });*/
    },

    /*
     *   Create Dimensions
     */
	createAdministrableDimension: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data["displayName"] = params.displayName;
        data["name"] = params.name;
        data["idWfClass"] = params.idWfClass;
        data["entityPath"] = params.entityPath;
        data["Description"] = params.description;
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("admin-CreateAdministrableDimension"),
            data: params,
            type: "PUT",
            dataType: "json"
        });
    },

    /*
     * Delete manageable dimensions
     */
	deleteDimension: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-DeleteDimension");
        // Define data
        params = params || {};
        var data = {};
        data["id"] = params.id;
        data["idDimension"] = params.id;
        data["administrable"] = params.administrable;
        // Call ajax and returns promise
        return $.destroy(url, data);
    },

    /*
     *   Dimensions Process Tree
     */
	entityPathChildNodesAction: function(params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data["pathNodeType"] = params.nodeType;
        data["idNode"] = params.idNode;
        data["nodeDisplayPath"] = params.nodeDisplayPath;
        data["nodePath"] = params.nodePath;
        data["idWfClass"] = params.idWfClass;
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("admin-EntityPathChildNodesAction"),
            data: params,
            type: "GET",
            dataType: "json"
        });
    },

    /*
     *   Return list of available processes
     */
	getActiveWFClasses: function(params) {
        var self = this;
        var data = params || {};

        // Call ajax and returns promise

        return $.ajax({
            //eliminar esto con el servicio restfull
            cache: true,
            url: self.serviceLocator.getUrl("admin-GetActiveWFClasses"),
            data: data,
            type: "GET",
            dataType: "json"
        });
    },

    /*
     *   Resturn the list of Stored Document Templates
     */
	storeDocumentTemplates: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-document-templates-storeDocumentTemplates");
        return $.read(url);
    },

    /*
     * Restore an selected document template using his Guid as parameter
     * @param params {Object} Guid: the associated Guid from the desired document template
     */
	restoreDocumentTemplates: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-document-templates-restoreDocumentTemplates");

        url += "?Guid=" + params.Guid;

        return $.read(url);
    },

    /*
     * Retreieves the workflow from the actual processes
     */
	getWorkFlowClasses: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-processes-workflowClasses");
        return $.read(url);
    },


    /*
     * Retreives the task from a desired workflow
     * @param params {Object} idWorkFlow: the desired workflow id
     */
	getTaskByWorkFlow: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-processes-tasksByWorkflow");

        var data = {};
        data["idWorkflow"] = params.idWorkflow;


        return $.read(url, data);
    },

    /*
     * Modifies the process durationworkflow
     * @param params {Object} idWorkflow: the desired process id to modify
     * @param params {Object} duration: the duracion, converted in minutes
     */
	modifyProcessDuration: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-processes-modifyProcessDuration");

        var data = {};
        data["idWorkflow"] = params.idWorkflow;
        data["duration"] = params.duration;

        return $.create(url, data);
    },

    /*
     * Modifies the task duration form a desired workflow
     * @param params {Object} idTask: the desired task id to modifie
     * @param params {Object} duration: the duracion, converted in minutes
     */
	modifyTaskDuration: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-processes-modifyTaskDuration");

        var data = {};
        data["idTask"] = params.idTask;
        data["duration"] = params.duration;

        return $.create(url, data);
    },

    /*
     * Retreives the process  from Hierarchy
     *
     */
	processesHierarchy: function() {
        var self = this;
        var data = {};
        data["removeOnlineItems"] = "true";
        return $.ajax({
            url: self.serviceLocator.getUrl("offline-getProcessTree"),
            data: data,
            dataType: "json",
            type: "GET"
        });


    },
    /*
     * this function send to the server the offline cases created
     */

	syncOfflineCases: function(params) {
        var self = this;

        return $.ajax({
            url: self.serviceLocator.getUrl("offline-sendForm"),
            data: {
                idCase: params.idCase,
                idWFClass: params.idWfClass,
                awCaseCreationContext: JSON.stringify(params.objToSend),
                idWorkflow: params.idWfClass
            },
            type: "POST",
            dataType: "json",
            serviceType: "LOAD"
        });
        /*.done(function (rta) {
         console.info(rta);
         var formData = decodeURIComponent(this.data).split('&');
         for (var i = formData.length - 1; i >= 0; i--) {
         var pivot = formData[i].split("=");
         if (pivot[0] == "idCase") {
         self.database.deleteCase({ idCase: pivot[1] });
         }
         };
         //cuando retorne que yes elimina el caso de la base de datos

         }).fail(function (fail) {
         console.info(fail);

         })*/
    },
    /*
     * Retreives Form structure + Form data
     *
     */
	processesHierarchyTofetchForms: function(params) {
        var self = this;
        var data = {};
        data["idChangeSet"] = params.changeSet;
        //        data["h_contexttype"] = "metadata";
        //        data["h_idprocess"] = idCat;

        //        return $.ajax({
        //            url: self.serviceLocator.getUrl("offline-getForms"),
        //            data: data,
        //            idprocess: idCat,
        //            type: "POST",
        //            dataType: "json",
        //            serviceType: "LOAD"
        //        });

        return $.ajax({
            url: self.serviceLocator.getUrl("offline-getForms"),
            data: data,
            dataType: "json"
        });

    },

    /*
     * this retrive data for the report my team
     */
	getDataForMyTeam: function() {

        var self = this;

        return $.ajax({
            url: self.serviceLocator.getUrl("bam-resourcemonitor-myteam"),
            type: "GET",
            dataType: "json"
        });
    },

    /*
     * Retrive data for reports
     */
	getReporstAnalysisQuery: function() {

        var self = this;

        return $.read(self.serviceLocator.getUrl("reports-analysisquery"));
    },

    /*
     * Update report data
     */
	updateReportData: function(params) {

        var self = this;

        return $.update(self.serviceLocator.getUrl("reports-analysisquery-update"), params);
    },

    /*
     * Delete report data
     */
	deleteReportData: function(params) {

        var self = this;

        return $.destroy(self.serviceLocator.getUrl("reports-analysisquery-delete") + "?" + params);
    },

    /*
     *Entrega la lista de entidades administrables
     */
	getAdminEntitiesList: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-entities-list");
        var data = {};
        return $.read(url, data);
    },

    /**
     * Entrega la lista de entidades administrables
     */
	getAdminStakeholdersList: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-stakeholders-list");
        var data = {};

        return $.read(url, data);
    },

    /*
     *Entrega los registros de una entidad
     */
	getAdminEntitiesRowData: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-entities-row-data");
        var data = {
            guidEntity: params.guidEntity,
            pag: params.pag || 1,
            pagSize: params.pagSize || 10
        };

		if(typeof params.orderField !== "undefined") {
            data["orderField"] = params.orderField;
        }
		if(typeof params.orderType !== "undefined") {
            data["orderType"] = params.orderType;
        }
		if(typeof params.filters !== "undefined" && $.isArray(params.filters) && params.filters.length > 0) {
            data["filters"] = JSON.stringify(params.filters);
        }

        return $.read(url, data);
    },

    /**
     *
     * @param params
     * @returns {{isAssociated: boolean}}
     */
	getUserStakeholders: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-user-stakeholders");
        var data = {
            idUser: params.idUser
        };

        return $.read(url, data);
    },

    /**
     * Returns data of an entity
     */
	getAdminEntityData: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-entity-simpleData");
        var data = {};

        data["idEntity"] = params.idEntity;

        return $.read(url, data);
    },

    /**
     * verify if entity was migrated return boolean value
     */
	getAdminEntityMigrated: function(guidEntity) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-entities-migrated-entity");
        var data = {};
        data["guidEntity"] = guidEntity;
        return $.read(url, data);
    },

	getAdminEntitiesForm: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-entities-get-form");
        var data = {
            h_action: "LOADENTITYFORM",
            h_contexttype: "entity"
        };

		if(typeof params.guid !== "undefined") {
            data.h_guidEntity = params.guid;
        }
		if(typeof params.guidForm !== "undefined") {
            data.h_guidForm = params.guidForm;
        }
		if(typeof params.idRow !== "undefined") {
            data.h_surrogateKey = params.idRow;
        }
		if(typeof params.idPageCache !== "undefined") {
            data.h_pageCacheId = params.idPageCache;
            data.h_isRefresh = true;
        }
		if(typeof params.isStakeholder !== "undefined" && params.isStakeholder) {
			data.h_showDisabled = false;
			data.h_showAssociateUser = true;
        }

        return $.ajax({
            url: url,
            data: data,
            type: "POST",
            dataType: "json"
        });
    },

    /*
     *Entrega la lista de idiomas soportados
     */
	getBizagiObjects: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-language-bizagi-objects");
        var data = {};
        return $.read(url, data);
    },

    /*
     *Entrega la lista de entidades
     */
	getEntitiesList: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-language-entities");
        var data = {};
        return $.read(url, data);
    },


    /*
     *Entrega la lista de idiomas soportados
     */
	getStoreLanguageTemplates: function() {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-language-languages");
        var data = {};
        return $.read(url, data);
    },

    /*
     *Enable or disable languages
     */
	setLanguages: function(dataArray) {
        var self = this;
        var url = self.serviceLocator.getUrl("admin-language-languages");
        var data = dataArray;
        return $.ajax({
            url: url,
            data: {
                languages: data
            },
            type: "POST",
            dataType: "json"
        });
    },

    /*
     *Reset language personalization
     */

    resetPersonalization: function() {
        var self = this;

        return $.ajax({
            url: self.serviceLocator.getUrl("admin-language-reset"),
            data: {},
            type: "DELETE",
            dataType: "json"
        });
    },

    /*
     *Download template language list
     */
	getLanguageTemplate: function(params) {
        var self = this,
            urlEndPoint,
            formExcel;
        var parameter = "";
        //create temporal form
		if(params.elements) {
            urlEndPoint = "admin-language-resource-download";
            parameter = "&elements=" + params.elements;
		} else if(params.entities) {
            urlEndPoint = "admin-language-entities-download";
            parameter = "&entities=" + params.entities;
        } else {
            urlEndPoint = "admin-language-resource-download";
        }

        var winview = (self.device === "tablet_android") ? "_system" : "_self";
        var url = encodeURI(self.serviceLocator.getUrl(urlEndPoint) + "?cultureName=" + params.cultureName + parameter);

        window.open(url, winview, 'location=yes');
    },


	getHolidaysSchemas: function(params) {
      var self = this;
		return $.read(self.serviceLocator.getUrl("admin-holidays-schemas"), params);
    },

	getHolidaysBySchema: function(params) {
        var self = this;
		return $.read(self.serviceLocator.getUrl("admin-holidays-schema"), params).pipe(function(data) {
			data = data || {};
			var _dateSerializer = function(dateStr) {
				dateStr = dateStr || "";
				var arrdate = dateStr.split("T");
				var newDate = arrdate[0] + "T00:00:00";

				return newDate;
			};


			$.each(data, function(key, value) {
				data[key].date = _dateSerializer(value.date);
			});

			return data;

		});
    },

	saveHolidaysBySchema: function(params) {
        var self = this;
       // var data = JSON.encode(params.data);
        var url = self.serviceLocator.getUrl("admin-holidays-schema").replace("{schema}", params.schema);

        $.ajax({
			method: "POST",
            url: url,
            data: params.data,
			contentType: "application/json"
        });
    },

	getProjectName: function() {
		var self = this;
		var url = self.serviceLocator.getUrl("admin-projectname");
		return $.read(url);
	},

	setProjectName: function(projectName) {
		var self = this;
		var url = self.serviceLocator.getUrl("admin-projectname");
		var data = {projectName: projectName};

		return $.create(url, data);
	},


	getAuditLicense: function(params) {
        var self = this;
        var defer = $.Deferred();
        var url = self.serviceLocator.getUrl("admin-audit-license");
        defer.resolve("OK");
        document.location = url;

        return defer.promise();
    },
    /*
     * Process definition service for process viewer
     */
	processDefinition: function(params) {
        var self = this;
        return $.read(self.serviceLocator.getUrl("processviewer-processdefinition"), params);
    },

    /*
     * Graphic info for process viewer
     */
	graphicInfo: function(params) {
        var self = this;
        return $.read(self.serviceLocator.getUrl("processviewer-processgraphicinfo"), params);
    },

	getQueryFormResponse: function(params) {
        var self = this;

        return $.create(self.serviceLocator.getUrl("query-handler-getQueryFormResponse"), params);
    },

	getQueryFormExportExcel: function(params) {
        var self = this;
        var defer = $.Deferred();
        var paramsSend = "";
		var target = "_self";
		if(bizagi.util.isIE()) {
			target = "iframeExcel";
        }
        //create temporal form
        var formExcel = $("<form>", {
            "action": self.serviceLocator.getUrl("query-handler-getQueryFormExportExcel"),
            "target": target,
            "id": "formExportExcel",
            "method": "POST",
            "style": "display:none"
        });
        $(formExcel).attr("enctype", "application/x-www-form-urlencoded");
        $(formExcel).attr("accept-charset", "UTF-8");

        var iframeExcel = $("<iframe>", {
			"name": "iframeExcel",
            "id": "iframeExcel",
			"style": "display:none"
        });
        //add parameters
		$.each(params, function(k, v) {
			paramsSend = $("<input>", {"name": k, "value": v, "type": "hidden"});
            $(formExcel).append(paramsSend);
        });
        $("body").append(formExcel);
        $("body").append(iframeExcel);
        //submit and remove form
        formExcel.submit().remove();
        iframeExcel.submit().remove();
        defer.resolve("OK");
        return defer.promise();
    },

	getQueryForm: function(params) {
        var self = this;
        params = params || {};
        return $.ajax({
            url: self.serviceLocator.getUrl("query-handler-getQueryForm"),
            data: params,
            type: "POST",
            dataType: params.dataType || "json"
        });
    },

	getPreferencesForm: function(params) {
        var self = this;
        return $.ajax({
            url: self.serviceLocator.getUrl("preferences-handler-getPreferencesForm"),
            data: params,
            type: "POST",
            dataType: "json"
        });
    },

	saveStoredQueryForm: function(params) {
        var self = this;
        return $.ajax({
            url: self.serviceLocator.getUrl("query-handler-storedQueryForm"),
            data: params,
            type: "POST",
            dataType: "json"
        });
    },
	updateStoredQueryForm: function(params) {
        var self = this;
        return $.ajax({
            url: self.serviceLocator.getUrl("query-handler-storedQueryForm"),
            data: params,
            type: "PUT",
            dataType: "json"
        });
    },

	deleteStoredQueryForm: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("query-handler-storedQueryForm-id");
        return $.destroy(url, params);
    },

	getStoredQueryFormList: function(params) {
        var self = this;
        return $.ajax({
            url: self.serviceLocator.getUrl("query-handler-storedQueryForm"),
            data: params,
            type: "GET",
            dataType: "json"
        });
    },

	getStoredQueryFormResponse: function(params) {
        var self = this;
        var url = self.serviceLocator.getUrl("query-handler-storedQueryForm-id");
        var data = {};
        data["idStoredQueryForm"] = params;
        return $.read(url, data);
    },
    /*
     * Graphic Query Info
     */
	getGraphicQueryInfo: function(params) {
        var self = this;
        return $.read("Rest/Cases/Workitems", params);
    },

    /*
     * Get case path
     */
	getCasePath: function(params) {
        var self = this;
        return $.read("Rest/Cases/TransitionLog", params);
    },

    /*
     * Get Users Creation/Edition Form
     */
	getUsersForm: function(params) {

        var self = this;

        return $.create(self.serviceLocator.getUrl("admin-usersform"), params);
    },

    /**
     * This service get the last version of BizagiBPM
     *
     * @return {json}
     */
	getLastUpdateByMobile: function() {
        var self = this;
        return $.read({
            url: self.serviceLocator.getUrl("mobile-getLastUpdate")
        });
    },

    /*
     * Users Administration Log
     */
	getUsersAdministrationLog: function(params) {
        var self = this;
        return $.read({
            url: self.serviceLocator.getUrl("admin-userslog"),
            data: params
        });
    },

    /*
     * Query Users Licenses
     */
	queryUsersLicenses: function() {
        var self = this;
        return $.read({
            url: self.serviceLocator.getUrl("admin-userslicenses")
        });
    },

    /*
     * Create User Form
     */
	createUserAdministrationForm: function() {
        var self = this;

        return $.get(self.serviceLocator.getUrl("admin-createuserform"));
    },

    /*
     * Get User Preference Form Params
     */
	getPreferenceFormParams: function() {

        var self = this;

        return $.read(self.serviceLocator.getUrl("admin-userpreferenceform-isnew"));
    },

    /*
     * Get User Positions
     */
	getUserPositions: function() {

        var self = this;

        return $.read(self.serviceLocator.getUrl("admin-userGetPositions"));
    },

	/**
     * Get List of assignation queues
     */
	getAssignationQueues: function() {
      var self = this;
        return $.read(self.serviceLocator.getUrl("admin-assignation-queues"));
    },

    /**
     * Get list of segmentations
     */
	getSegmentationQueues: function() {
      var self = this;

        return $.read(self.serviceLocator.getUrl("admin-assignation-queues-segmentation"));
    },

	getQueueSuscribers: function(queue) {
        var self = this;

        return $.read(self.serviceLocator.getUrl("admin-assignation-queues-suscribers"));
    },

	unsuscribeQueueUser: function(userId) {
        var self = this;
		return $.destroy(self.serviceLocator.getUrl("admin-assignation-queues-unsuscribe"), {
            userId: userId,
            segmentation: "x"
        });
    },

    /*
     * Get user info by task
     */
    getUserInfoByTask: function(idCase, guid) {

        var self = this;
        var params = {
            idCase: idCase,
            guidTask: guid
        };

        return $.read(self.serviceLocator.getUrl("graphicquery-trailusers"), params);
    },

    /*
     *   Returns the available list of searches
     */
	getSearchLists: function() {
        var self = this;
        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("my-search-getSearchLists"), {});
	},


    /**
     *
     * @param params
     * @param filterObject
     * @param callback is called when a filter is added to the array
     */
	defineFilterObject: function(params, filterObject, callback) {
        var properties = params.properties;
        var xpath = properties.xpath.split('@')[0];

		var filter = filterObject.find(function(el) {
            return el.xpath == xpath;
        });

        //if the control exists is because it is a range
		if(filter) {
			if(properties.rangeQuery == "from") {
                filter.value = filter.value || {};
                filter.searchType = 'range';
                filter.value.min = params.value;
            }
			else if(properties.rangeQuery == "to") {
                filter.value = filter.value || {};
                filter.searchType = 'range';
                filter.value.max = params.value;
            }
			else {
                params.properties.typeSearch = filter.searchType;
                var values = setValues(params);
                $.extend(filter, values);
            }

			if(properties.orderType) {
                filter.orderType = properties.orderType;
            }
			if(callback) {
                callback(bizagi.clone(filter));
            }
        }
		else {
            var isDefaultFilter = properties.defaultFilter || false;
            filter = setValues(params);

			if(properties.orderType) {
                filter.orderType = properties.orderType;
            }

			if(typeof filter.value != 'undefined' || filter.orderType || isDefaultFilter) {
                filterObject.push(filter);
				if(callback) {
                    callback(bizagi.clone(filter));
                }
            }
        }


		function setValues(params) {
            var properties = params.properties;
            var searchType = properties.typeSearch;
            var value = params.value;

            // Identifing the type control in order to define search type
			if(properties.type == "boolean") {
				if(value.toLowerCase() === "null") {
                    value = null;
                    searchType = "Nullable"
                }
                else {
                    value = bizagi.util.parseBoolean(value);
                    searchType = "exact"
                }
            }

			if(properties.type == "number" || properties.type == "money" || properties.type == "date") {
                searchType = "exact"
            }

			if(typeof params.value == 'object') {
                value = [];
				if(Array.isArray(params.value)) {
					for(var i = 0, len = params.value.length; i < len; i++) {
                        var val = parseInt(params.value[i].id);
						if(!isNaN(val)) {
                            value.push(val);
                        }
                    }
                }
				else {
                    var val = parseInt(params.value.id);
					if(!isNaN(val)) {
                        value.push(val);
                    }
                }
                searchType = "exact";
                value = value.length > 0 ? value : undefined;
            }

			if(properties.rangeQuery && properties.rangeQuery !== "none") {
                value = {
					min: params.value,
					max: params.value
                };
                searchType = "range";
            }

			searchType = searchType || "approx";

            var filter = {
				xpath: xpath,
                searchType: searchType
            };

            if (properties.type === "hidden") {
                filter.isHidden = true;
            }

			if(typeof value !== 'undefined') {
                filter.value = value;
            }

            return filter;
        }
    },

    /**
     * Serializador de servicio de entitiData
     * @param data
     * @returns {*}
     */
	serializeEntityData: function(data) {
        var serializedData = data;
        serializedData.entities = [];

        /**
         * build the return object.
         * @param header
         * @param row
         * @returns {{data: {}, guid: *, surrogateKey: *, timestamp: *}}
         * @private
         */
        function _buildNewObject(header, row) {
            var newObject = {
                    data: {},
                    guid: row.guidEntity,
                    timestamp: header.timestamp
                },
                columns = header.columns,
                rowData = row.row;

			for(name in row) {
				if(row.hasOwnProperty(name) && name.toString() !== "row" && name.toString() !== "id") {
                    newObject[name] = row[name];
                }
            }

			for(var i = 0, len = columns.length; i < len; i += 1) {
                newObject.data[columns[i]] = rowData[i];
            }

            return newObject;
        };

        var k = -1, kRow;
		while(kRow = data.rows[++k]) {
            var i = -1, iCell;
			while(iCell = data.cells[++i]) {
				if(iCell.id === kRow.id) {
                    var kReturnObject = _buildNewObject(iCell, kRow);
                    serializedData.entities.push(kReturnObject);
                    break;
                }
            }
        }

        return serializedData;
	},

    
    //OAuth2 Applications
    getOAuth2Applications: function(){
        var self = this;
        return $.ajax({
            url: self.serviceLocator.getUrl("oauth2-getApplications"),
            type: "GET",
            dataType: "json"
        });
    },

    getOAuth2Application: function(applicationId){
        var self = this;
        var url = self.serviceLocator.getUrl("oauth2-getApplication");
        return $.ajax({
            url: url.replace("{applicationId}", applicationId),
            type: "GET",
            dataType: "json"
        });
    },

    createOAuth2Application: function(data){
        var self = this;
        return $.ajax({
            url: self.serviceLocator.getUrl("oauth2-createApplication"),
            type: "POST",
            dataType: "json",
            data: data
        });
    },

    deleteOAuth2Application: function(applicationId){

        var self = this;
        var url = self.serviceLocator.getUrl("oauth2-deleteApplication");

        return $.ajax({
            url: url.replace("{applicationId}", applicationId),
            type: "DELETE",
            dataType: "json"
        });
    },

    updateOAuth2Application: function(params, applicationId) {
        var self = this;
        var url = self.serviceLocator.getUrl("oauth2-updateApplication");

        return $.ajax({
            url: url.replace("{applicationId}", applicationId),
            data: params,
            type: "PUT",
            dataType: "json"
        });
    },

    updateClientSecretKeysOAuth2Application:  function(params, applicationId) {
        var self = this;
        var url = self.serviceLocator.getUrl("oauth2-updateClientSecretKeysApplication");

        return $.ajax({
            url: url.replace("{applicationId}", applicationId),
            data: params,
            type: "PUT",
            dataType: "json"
        });
    },

});
