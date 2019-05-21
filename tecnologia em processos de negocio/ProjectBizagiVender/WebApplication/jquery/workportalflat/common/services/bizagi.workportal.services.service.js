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
    init: function (params) {
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
        if (typeof BIZAGI_INBOX_ROWS_PER_PAGE !== "undefined") {
            this.pageSize = ($.isNumeric(BIZAGI_INBOX_ROWS_PER_PAGE)) ? BIZAGI_INBOX_ROWS_PER_PAGE : this.pageSize;
        }
    },
    /**
     * This method will return the url defined as endPoint using the parameter 'endPoint' name
     */
    getUrl: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl(params.endPoint);
        return url;
    },
    /**
     * This method will return the url normalized
     */
    normalizeUrl: function (url) {
        if (url !== "") {
            if (url[url.length - 1] != "/") {
                url = url.concat("/");
            }

            if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) {
                url = "http://" + url;
            }
        }
        return url;
    },

    /**
     * This service get all overrides keys within configuration project
     *
     * @return {json}
     */
    getOverrides: function () {
        var self = this;
        return $.ajax({
            url: self.serviceLocator.getUrl("overrides")
        }).pipe(function (overrides) {
            overrides = overrides || {};

            $.each(overrides, function (key, value) {
                var valueUppercase = value.toUpperCase();
                if (valueUppercase == "TRUE" || valueUppercase == "FALSE") {
                    overrides[key] = bizagi.util.parseBoolean(value);
                }
            });

            return overrides;
        });
    },

    /**
     * This service get json of theme definition
     *@return {json} theme definition
     */
    getCurrentTheme: function () {
        var self = this;
        var url = self.serviceLocator.getUrl('getCurrentTheme');

        return $.read(url);
    },

    /**
     * This method will return the response of the user information login is correct
     * this method is use for native smartphone
     **/
    authenticatedUser: function (params) {
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
            function (response) {
                return response;
            },
            function (data) {
                urlSend = self.serviceLocator.getUrl('login-handlerv10');
                urlSend = urlSend.replace('{0}', BIZAGI_USER || '');
                urlSend = urlSend.replace('{1}', BIZAGI_PASSWORD || '');
                urlSend = urlSend.replace('{2}', BIZAGI_DOMAIN || '');
                return $.ajax({
                    url: urlSend,
                    type: 'GET',
                    dataType: 'json'
                });
            }
        );
    },

    /**
     *
     * this method is use for native smartphone
     **/
    logoutUser: function (params) {
        var self = this;
        var urlSend = self.serviceLocator.getUrl('logoff-handlerv1');
        return $.read({
            url: urlSend
        });
    },
    /*
     *   Logoff the current user
     */
    logOffUser: function (params) {
        var self = this;
        var urlSend = self.serviceLocator.getUrl("logoff-handler");
        return $.read({
            url: urlSend
        });
    },
    /*
     *   Gets the current working user
     */
    getCurrentUser: function (params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("user-handler-getCurrentUser"));
    },
    /*
     *   Gets the inbox summary for the current logged user
     *   Returns a promise of the data being retrieved
     */
    getInboxSummary: function (params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl("inbox-handler-getInboxSummary"))
            .pipe(function (response) {
                // Extract inboxSummary property
                return response["inboxSummary"];
            });
    },
    /*
     *   Return all the available processes in bizagi
     */
    getAllProcesses: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        var url = self.serviceLocator.getUrl('process-handler-getAllProcesses');

        if (params.taskState != undefined) {
            data['taskState'] = params.taskState;
        }

        if (params.onlyFavorites != undefined && params.onlyFavorites != '') {
            data['onlyFavorites'] = params.onlyFavorites;
        }

        if (params.myActivities != undefined && params.myActivities != "") {
            data["myActivities"] = params.myActivities;
        }

        if (params.myPendings != undefined && params.myPendings != "") {
            data["myPendings"] = params.myPendings;
        }

        if (params.smartfoldersParameters) {
            url = url + '?' + params.smartfoldersParameters;
        }

        if (bizagi.isMobile()) {
            data['mobileDevice'] = true;
        }

        // Call ajax and returns promise
        return $.read(url, data)
            .pipe(function (response) {
                // !! (double Not) (bang bang) <-- For Boolean Type Casting http://jibbering.com/faq/notes/type-conversion/#tcBool
                if (!!params.skipAggrupate)
                    return response;
                // Aggrupate workflows by categories
                var responseData = {};
                var categories = {};
                var allProcesses = bizagi.localization.getResource('workportal-widget-inbox-all-processes');
                var allCases = {
                    name: bizagi.localization.getResource('workportal-widget-inbox-all-cases'),
                    path: '',
                    category: allProcesses,
                    isFavorite: (params.onlyFavorites || false),
                    guidFavorite: '',
                    idworkflow: '',
                    guidWFClass: '',
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
    },
    /*
     *   Return my favourites count
     */
    getFavourites: function () {
        var self = this;
        var data = {};
        var url = self.serviceLocator.getUrl("process-handler-getFavourites");

        // Call ajax and returns promise
        return $.read(url, data)
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Return my favourites count
     */
    getMyStuff: function (params) {
        var self = this;
        var data = {};
        var url = self.serviceLocator.getUrl("process-handler-getMyStuff");

        if (typeof params.icon !== "undefined" && params.icon) {
            data.icon = true;
        }

        // Call ajax and returns promise
        return $.read(url, data);
    },
    /*
     *   Return my favourites cases
     */
    getFavouriteCases: function (params) {
        var self = this;
        var data = {};
        var url = self.serviceLocator.getUrl("process-handler-getFavouriteCases");

        data["pageSize"] = params.pageSize || self.pageSize;
        data["page"] = params.page || 1;

        if (bizagi.isMobile()) {
            data["mobileDevice"] = true;
        }

        // Call ajax and returns promise
        return $.read(url, data)
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Return all the available cases in bizagi and thinking for mobile response
     */
    getCasesList: function (params) {
        var self = this;
        var data = {};
        var url = self.serviceLocator.getUrl("case-handler-getCasesList");

        params = params || {};

        data["pageSize"] = params.pageSize || 10;
        data["page"] = params.page || 1;
        data["numberOfFields"] = params.numberOfFields || "-1"; //1;
        data["idWfClass"] = params.idWfClass || "-1";

        return $.read(url, data)
            .pipe(function (response) {
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
                var lengthData = typeof response.elements !== "undefined" ? response.elements.length : 0;

                for (var counter = 0; lengthData > counter; counter++) {
                    var tmpElement = response.elements[counter];
                    var tmpdate = new Date(tmpElement[3]);
                    var tmpDay = tmpdate.getDate();
                    var tmpMonth = tmpdate.getMonth();
                    var tmpYear = tmpdate.getYear();

                    if (actualDay > tmpDay || (actualMonth > tmpMonth || actualYear > tmpYear)) {
                        tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "dd MMM yyyy");
                        elementToHtml.overdue.push(tmpElement);
                    } else {
                        if (actualDay == tmpDay) {
                            tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "hh:mm");
                            elementToHtml.today.push(tmpElement);

                        } else if ((actualDay + 1) == tmpDay) {
                            tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "hh:mm");
                            elementToHtml.tomorrow.push(tmpElement);

                        } else {
                            tmpElement[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement[3]), "dd MMM yyyy");
                            elementToHtml.upcoming.push(tmpElement);
                        }
                    }
                }
                return elementToHtml;
            });

    },

    /*
     *   Return all the available cases in bizagi and thinking for mobile response
     */
    getCasesListBeta: function (params) {
        var self = this;

        return self.getMobileCasesList(params)
            .then(function (response) {

                var groupedData = {
                    elements: [],
                    page: response.page,
                    totalPages: response.totalPages,
                    advanceSearch: response.advanceSearch || false
                };

                var actualDate = new Date();
                var statusFunction = response.advanceSearch ? self.defineActivityStateByTaskState :self.defineActivityStateByDate;

                for (var counter = 0; response.elements.length > counter; counter++) {
                    var tmpElement = response.elements[counter];
                    var status = {};

                    status = statusFunction(tmpElement[3], tmpElement.taskstate);

                    // Time to atRiskTimeDelta
                    if (tmpElement.length >= 10 && parseInt(tmpElement[11], 10) > 0) {
                        var tmpEndDate = new Date(tmpElement[3]);

                        if (actualDate.getTime() > tmpEndDate.getTime()) {
                            status.state = "red";
                        } else {
                            if (actualDate.getTime() > (tmpEndDate.getTime() - (parseInt(tmpElement[11], 10) * 60000))) {
                                status.state = "yellow";
                            } else {
                                status.state = "green";
                            }
                        }
                    }

                    groupedData.elements.push($.extend({}, tmpElement, status, {
                        "endDate": tmpElement[3],
                        "idworkitem": tmpElement[1],
                        "idwfclass" : bizagi.version.server.lessThan("11") ? tmpElement[7]: tmpElement[10]
                    }));
                }

                return groupedData;
            });
    },

    getMobileCasesList: function (params) {
        var self = this;
        var data = {};

        params = params || {};

        if (typeof params.radNumber !== "undefined") {
            data["radNumber"] = params.radNumber;
        }

        data["pageSize"] = params.pageSize || 10;
        data["page"] = params.page || 1;

        var urlMobile = self.serviceLocator.getUrl("case-handler-getActivityList");

        //if server version is less than server version where the new service was implemented, then call last version of service
        if (bizagi.version.server.lessThan("11.0.0.2550")) {
            urlMobile = self.serviceLocator.getUrl("case-handler-getCasesList");
            data["numberOfFields"] = params.numberOfFields || "-1"; //1;
            data["idWfClass"] = params.idWfClass || "-1";
            return $.read(urlMobile, data);
        }

        return $.read(urlMobile, data).then(function (resp) {
            var response = {elements: [], rows: []};
            var row, i = -1;
            while ((row = resp.rows[++i])) {
                var tempElement = {}, el = ["", "", "", "", "", "", [], "", "", "", ""];
                var field, j = -1;
                while ((field = resp.headers[++j])) {
                    tempElement[field.fieldName.toLowerCase()] = {
                        "displayName": field.displayName,
                        "value": row[j]
                    };
                    self.serializeActivity(el, field.fieldName.toLowerCase(), tempElement[field.fieldName.toLowerCase()]);
                }

                response.elements.push(el);
                response.rows.push(tempElement);
            }
            return {
                "page": resp.page || resp.currentPage,
                "totalPages": resp.totalPages,
                "elements": response.elements,
                "rows": response.rows,
                "advanceSearch": true
            };
        });
    },

    /**
     * Returns the activity status based on the end date and the risk
     * @param {String} endDate ISO representation of a date
     * @returns {{}}
     */
    defineActivityStateByDate: function (endDate) {
        var status = {};

        if ( endDate ) {
            var activityDate = new Date( endDate );
            var now = new Date();
            var today = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
            var second = 1000;
            var minute = 60 * second;
            var day = 24 * 60 * minute;

            // Before today
            if( activityDate.getTime( ) < today.getTime( ) - second ) {
                status = { group: "1|" + bizagi.localization.getResource("workportal-taskfeed-overdue"), state: "red",  type: "overdue", icon: "overdue", shortEndDate: bizagi.util.dateFormatter.formatDate(new Date(endDate), "MMMM dd yyyy | hh:mm tt")};
            }
            // Today but before now
            else if( activityDate.getTime( ) < now.getTime( ) + minute - second ) {
                status = { group: "2|" + bizagi.localization.getResource("workportal-taskfeed-today"), state: "red", type: "today", icon: "overdue", shortEndDate: bizagi.util.dateFormatter.formatDate(new Date(endDate), "MMMM dd yyyy | hh:mm tt")};
            }
            // Today but after now
            else if( activityDate.getTime( ) < today.getTime( ) + day - second ) {
                status = { group: "2|" + bizagi.localization.getResource("workportal-taskfeed-today"), state: "yellow", type: "today", icon: "ontime", shortEndDate: bizagi.util.dateFormatter.formatDate(new Date(endDate), "MMMM dd yyyy | hh:mm tt") };
            }
            // Tomorrow
            else if( activityDate.getTime( ) < today.getTime( ) + 2 * day - second ) {
                status = { group: "3|" + bizagi.localization.getResource("workportal-taskfeed-tomorrow"), state: "green", type: "tomorrow" , icon: "upcoming", shortEndDate:  bizagi.util.dateFormatter.formatDate(new Date(endDate), "MMMM dd yyyy | hh:mm tt")};
            }
            // After tomorrow
            else {
                status = { group: "4|" + bizagi.localization.getResource("workportal-taskfeed-upcomming"), state: "green", type: "upcoming" , icon: "upcoming", shortEndDate:  bizagi.util.dateFormatter.formatDate(new Date(endDate), "MMMM dd yyyy | hh:mm tt")};
            }
        } else {
            status = { group: "1|" + bizagi.localization.getResource("workportal-taskfeed-overdue"), state: "red", type: "overdue", shortEndDate : "--" ,  icon: "overdue"};
        }

        return status;
    },

    /**
     * Returns the activity status based on the taskstate property
     * @param {String} endDate ISO representation of a date
     * @param {String} taskstate Color name
     * @returns {{}}
     */
    defineActivityStateByTaskState: function(endDate, taskstate) {
        var status = {
            group: "1|" + bizagi.localization.getResource("workportal-taskfeed-overdue"),
            state: taskstate,
            type: "overdue",
            shortEndDate : "--",
            icon: "overdue"
        };

        if ( endDate && taskstate ) {
            var activityDate = new Date( endDate );
            var now = new Date();
            var today = new Date( now.getFullYear(), now.getMonth(), now.getDate() );
            var second = 1000;
            var minute = 60 * second;
            var day = 24 * 60 * minute;

            status = {
                group: "",
                state: taskstate,
                type: "",
                icon: "",
                shortEndDate: bizagi.util.dateFormatter.formatDate(new Date(endDate), "MMMM dd yyyy | hh:mm tt")
            };
            // Before today
            if( activityDate.getTime( ) < today.getTime( ) - second ) {
                status.group = "1|" + bizagi.localization.getResource("workportal-taskfeed-overdue");
                status.type = "overdue";
            }
            // Today
            else if( activityDate.getTime( ) < today.getTime( ) + day - second ) {
                status.group = "2|" + bizagi.localization.getResource("workportal-taskfeed-today");
                status.type = "today";
            }
            // Tomorrow
            else if( activityDate.getTime( ) < today.getTime( ) + 2 * day - second ) {
                status.group = "3|" + bizagi.localization.getResource("workportal-taskfeed-tomorrow");
                status.type = "tomorrow";
            }
            // After tomorrow
            else {
                status.group = "4|" + bizagi.localization.getResource("workportal-taskfeed-upcomming");
                status.type = "upcoming";
            }

            switch( taskstate ) {
                case "green":
                    status.icon = "upcoming";
                    break;
                case "yellow":
                    status.icon = "ontime";
                    break;
                case "red":
                default:
                    status.icon = "overdue";
                    break;
            }
        }
        return status;
    },

    serializeActivity: function (el, fieldName, element) {
        switch (fieldName) {
            case "radnumber":
                el[6].push([element.displayName, element.value]);
                break;
            //Proceso
            case "wfclsdisplayname":
                el[4] = element.value !== null ? element.value.toString() : bizagi.localization.getResource("workportal-project-activity-plan");
                break;
            //Actividad
            case "currenttask":
                el[5] = element.value !== null ? element.value.toString() : bizagi.localization.getResource("workportal-project-casedashboard-activity");
                break;
            //Fecha creación caso
            case "cascreationdate":
                //el[6] = [""];
                break;
            // Actividad vence en
            case "wiestimatedsolutiondate":
                el[3] = element.value;
                break;
            //Fecha Solución caso
            case "cassolutiondate":
                //el[6] = [""];
                break;
            // Id de caso
            case "idcase":
                el[0] = element.value;
                break;
            // idWorkItem
            case "idworkitem":
                el[1] = element.value.toString();
                break;
            //Fecha de entrada al estado
            case "wientrydate":
                //el[6] = [""];
                break;
            case "taskid":
                el[2] = element.value;
                break;
            case "taskstate":
                el.taskstate = ( element.value ? ( "" + element.value ).toLowerCase() : "" );
                break;
            //idWorkflow"
            case "idwfclass":
                el[10] = el.idwfclass = element.value;
                break;
            //Is Favorite
            case "isfavorite":
                el[9] = element.value;
                break;
            case "atrisktime":
                el[11] = element.value;
                break;
            case "guidfavorite":
                el[8] = element.value;
                break;
        }
    },

    /**
     * Obtiene la lista de actividades para el usuario actual con filtros
     * Version: 2, Llamado al servicio con todas las prestaciones de filtrado
     */
    getCurrentActivities: function (params) {
        var self = this;
        var data = {};
        params = params || {};

        data["page"] = params.page || 1;
        data["pageSize"] = params.pageSize || 10;

        if (typeof params.radNumber !== "undefined") {
            data["radNumber"] = params.radNumber;
        }

        var url = self.serviceLocator.getUrl('case-handler-getActivityList');
        return $.read(url, data).then(function (resp) {
            return self.processActivitiesResponse(resp);
        });
    },

    processActivitiesResponse: function (resp, highlight, process_filter) {
        var self = this;
        var row;
        var i = -1;

        resp.elements = [];
        resp.processes = [];

        while ((row = resp.rows[++i])) {
            var tempElement = {};
            var field, j = -1;
            while ((field = resp.headers[++j])) {
                tempElement["o_" + field.fieldName.toLowerCase()] = {"displayName": field.displayName, "value": row[j]};
                tempElement[field.fieldName.toLowerCase()] = row[j];
            }
            $.extend(tempElement, self.defineActivityStateByDate(tempElement["wiestimatedsolutiondate"]), {highlightedNumber: self.highlightsString(tempElement["radnumber"], highlight)});
            resp.elements.push(tempElement);

            var process = resp.processes.find(function (el) {
                return el.processname == tempElement["wfclsdisplayname"];
            });

            if (typeof process === "undefined") {
                resp.processes.push({
                    processname: tempElement["wfclsdisplayname"],
                    idwfclass: tempElement["idwfclass"],
                    active: (process_filter || false) ? "active" : ""
                });
            }
        }
        return resp;
    },

    highlightsString: function (string, highlight) {
        if (typeof string !== "string" || typeof highlight !== "string") {
            return string;
        }

        var expresion = new RegExp(highlight, "gi");
        return string.replace(expresion, function (match, offset) {
            return "<strong>" + match + "</strong>";
        });
    },

    getDiscussionCase: function (params) {
        var self = this;
        var data = data || {};
        data['globalParent'] = params.globalParent;
        var url = bizagi.version.server.lessThanOrEqualsTo("11.0.0.2620") ? self.serviceLocator.getUrl('discussion-case-v2') : self.serviceLocator.getUrl('discussion-case');

        return $.read({
            url: url,
            data: data,
            contentType: "application/json"
        }).pipe(function (response) {
            return response;
        });
    },

    editDiscussion: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("new-discussion");
        return $.update({
            url: url,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });
    },

    getUsersDiscussion: function (params) {
        var self = this;
        var data = data || {};
        data["userIds"] = params;
        data["width"] = 50;
        data["height"] = 50;

        var url = self.serviceLocator.getUrl("get-users");

        return $.read(url, data)
            .pipe(function (response) {
                return response;
            });
    },

    getEffectiveDuration: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("time-schemas-effectiveduration");

        return $.read({
            url: url,
            data: data,
            dataType: "json",
            contentType: "application/json"
        });
    },

    getUsersData: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-users-get");
        return $.read({
            url: url,
            data: data,
            dataType: "json"
        });
    },

    createNewDiscussion: function (params) {
        var self = this;

        params = params || {};
        var url = self.serviceLocator.getUrl("new-discussion");
        var data = {
            content: {
                tags: params.tags,
                guid: params.guid,
                description: params.description,
                name: params.name,
                date: params.date,
                attachments: [],
                user: params.user,
                general: false,
                globalParent: params.globalParent
            },
            attachmentsToCreate: [],
            attachmentsToDelete: []

        };
        return $.create({
            url: url,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });
    },

    createNewComment: function (params) {
        var self = this;
        params = params || {};
        var data = params.data || {};
        var url = self.serviceLocator.getUrl("new-comment");

        return $.create({
            url: url.replace("{typeResource}", "Comment"),
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });
    },

    /**
     * Update Project File
     */
    updateProjectFile: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-files-upload");

        return $.update({
            url: url,
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
        });
    },

    /**
     * Update Project File
     */
    createProjectFile: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-files-upload");

        return $.create({
            url: url,
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
        });
    },

    /**
     * Count the files number
     * @param params
     * @returns {*}
     */
    getFilesCount: function (params) {
        var self = this;
        params = params || {};
        var url = bizagi.version.server.lessThanOrEqualsTo("11.0.0.2620") ? self.serviceLocator.getUrl("count-files-v2") : self.serviceLocator.getUrl("count-files");

        return $.read({
            url: url,
            data: params,
            contentType: "application/json"
        }).pipe(function (response) {
            return response;
        });
    },

    getCommentCase: function (data) {
        var self = this;
        data = data || {};

        var url = self.serviceLocator.getUrl("comment-case");

        return $.read({
            url: url,
            data: data,
            contentType: "application/json"
        }).pipe(function (response) {
            return response;
        });
    },

    getCommentsByParent: function (params) {
        var self = this;
        params = params || {};
        var url = self.serviceLocator.getUrl("count-comments");

        return $.read({
            url: url,
            data: params,
            contentType: "application/json"
        }).pipe(function (response) {
            return response;
        });
    },

    getFilesList: function (params) {
        var self = this;
        var url = bizagi.version.server.lessThanOrEqualsTo("11.0.0.2620") ? self.serviceLocator.getUrl("get-list-files-v2") : self.serviceLocator.getUrl("get-list-files");

        return $.read({
            url: url,
            data: params,
            dataType: "json",
            contentType: "application/json"
        }).pipe(function (response) {
            return response;
        });
    },

    deleteFile: function(data){
        var self = this;
        var url = self.serviceLocator.getUrl("project-resource-action");
        return $.destroy({
            url: url.replace("{typeResource}", "Attachment"),
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });
    },

    getFilesThumbnail: function (data) {
        var self = this;
        data = data || {};
        var url = self.serviceLocator.getUrl("thumbnail-file");

        return $.read({
            url: url,
            data: data,
            dataType: "json",
            contentType: "application/json"
        }).pipe(function (response) {
            return response;
        });
    },

    getAttachment: function (guidAttachment) {
        var self = this;

        var url = self.serviceLocator.getUrl("get-attachment");
        url = url.replace("{idAttachment}", guidAttachment.idAttachment);
        return url;
    },

    getMobileAttachment: function (guidAttachment) {
        var self = this;

        var url = self.serviceLocator.getUrl("get-mobile-attachment");
        url = url.replace("{idAttachment}", guidAttachment.idAttachment);
        return url + "?sessionId=";
    },

    /*
     *   Return all the available processes in bizagi
     */
    getAllAdministrableEntities: function (params) {
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
        }).pipe(function (data) {
            var result = {
                entities: []
            };
            $.each(data, function (i, item) {
                result.entities.push(item);
            });
            return result;
        });
    },
    /*
     *   Return all the available processes in bizagi
     */
    getEntitiesList: function (params) {
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
    getCasesByWorkflow: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        var url = self.serviceLocator.getUrl('process-handler-getCustomizedColumnsDataInfo');


        // Required params
        if (!bizagi.util.isEmpty(params.taskState))
            data['taskState'] = params.taskState;
        if (!bizagi.util.isEmpty(params.idWorkflow))
            data['idWorkflow'] = params.idWorkflow;

        // Special case to search all favorite cases for all processes
        if (params.onlyFavorites == true) {
            data['onlyFavorites'] = true;
            data['taskState'] = 'all';
        }

        // Optional params
        data['pageSize'] = params.pageSize || self.pageSize;
        data['page'] = params.page || 1;

        if (bizagi.isMobile()) {
            data['mobileDevice'] = true;
        }

        if (params.smartfoldersParameters) {
            var param = params.smartfoldersParameters.split('&');
            $.each(param, function (k, v) {
                var keyvalue = v.split('=');
                data[keyvalue[0]] = keyvalue[1];
            });
        }

        if (params.radnumber || params.radNumber) {
            data['radNumber'] = params.radNumber ? params.radNumber : params.radnumber;
        }

        if ((params.idcase || params.idCase) && bizagi.util.isNumeric(params.idcase || params.idCase)) {
            data['idCase'] = params.idCase ? params.idCase : params.idcase;
        }

        // Call ajax and returns promise
        return $.read(url, data)
            .pipe(function (response) {
                $.each(response.cases.rows, function (key, value) {
                    var newFieldsValue = [];

                    //  Set id of case to radnumber
                    response.cases.rows[key]['radnumber'] = value.id;
                    $.each(value.fields, function (fieldsKey, fieldsValue) {
                        // when delete element from fields array, each function lose key value
                        if (fieldsValue != undefined) {
                            // Radnumber
                            try {
                                if (fieldsValue.isRadNumber != undefined && fieldsValue.isRadNumber == 'true') {
                                    response.cases.rows[key]['radnumber'] = fieldsValue.Value;
                                    response.cases.rows[key]['casenumberdisplayname'] = fieldsValue.DisplayName;
                                } else if (fieldsValue.workitems != undefined) {
                                    response.cases.rows[key]['workitems'] = fieldsValue.workitems;
                                } else {
                                    newFieldsValue.push(fieldsValue);
                                }
                            } catch (e) { }
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
    getOrganizationsList: function () {
        var self = this;

        var url = self.serviceLocator.getUrl('process-handler-getOrganizations');
        var data = {};
        data['type'] = 12;
        data['name'] = '';

        return $.read(url, data);
    },
    /*
     *   Returns the data for the inbox grid view
     */
    getCustomizedColumnsData: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        var url = self.serviceLocator.getUrl("process-handler-getCustomizedColumnsData");
        data["pageSize"] = params.pageSize || self.pageSize;
        data["page"] = params.page || 1;

        // data for sort columns
        data["orderFieldName"] = params.orderFieldName || "";
        data["orderType"] = params.orderType || "0";
        data["order"] = params.order || "";

        if (bizagi.isMobile()) {
            data["mobileDevice"] = true;
        }

        // Fixes stuff
        // TODO: this must be fixed in the server
        params.taskState = params.taskState || 'all';
        if (params.taskState.toString().toLowerCase() === '')
            params.taskState = 'all';
        if (params.taskState.toString().toLowerCase() === 'red')
            params.taskState = 'Red';
        if (params.taskState.toString().toLowerCase() === 'yellow')
            params.taskState = 'Yellow';
        if (params.taskState.toString().toLowerCase() === 'green')
            params.taskState = 'Green';

        data.taskState = params.taskState;
        // Required params
        if (!bizagi.util.isEmpty(params.idWorkflow)) {
            data['idWorkflow'] = params.idWorkflow;
        }
        if (!bizagi.util.isEmpty(params.idTask)) {
            data['idTask'] = params.idTask;
        }

        if (!bizagi.util.isEmpty(params.radNumber)) {
            data['radNumber'] = params.radNumber;
        }

        // Special case to search all favorite cases for all processes
        if (params.onlyFavorites == true) {
            data['onlyFavorites'] = true;
            data['taskState'] = 'all';
        }

        if (params.smartfoldersParameters) {
            var param = params.smartfoldersParameters.split('&');
            $.each(param, function (k, v) {
                var keyvalue = v.split('=');
                data[keyvalue[0]] = keyvalue[1];
            });
        }

        // Call ajax and returns promise
        return $.read(url, data);
    },

    /*
     *   Returns the data for the inbox grid view
     */
    getCustomizedColumnsDataBeta: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        var url = self.serviceLocator.getUrl('process-handler-getCustomizedColumnsData');

        data['pageSize'] = params.pageSize || self.pageSize;
        data['page'] = params.page || 1;

        // data for sort columns
        data['orderFieldName'] = params.orderFieldName || '';
        data['orderType'] = params.orderType || '0';
        data['order'] = params.order || '';
        data['mobileDevice'] = bizagi.isMobile() ? true : false;

        // Fixes stuff
        // TODO: this must be fixed in the server
        params.taskState = params.taskState || 'all';
        if (params.taskState.toString().toLowerCase() === '')
            params.taskState = 'all';
        if (params.taskState.toString().toLowerCase() === 'red')
            params.taskState = 'Red';
        if (params.taskState.toString().toLowerCase() === 'yellow')
            params.taskState = 'Yellow';
        if (params.taskState.toString().toLowerCase() === 'green')
            params.taskState = 'Green';

        data.taskState = params.taskState;
        // Required params
        if (!bizagi.util.isEmpty(params.idWorkflow)) {
            data['idWorkflow'] = params.idWorkflow;
        }
        if (!bizagi.util.isEmpty(params.idTask)) {
            data['idTask'] = params.idTask;
        }

        if (!bizagi.util.isEmpty(params.radNumber)) {
            data['radNumber'] = params.radNumber;
        }

        // Special case to search all favorite cases for all processes
        if (params.onlyFavorites == true) {
            data['onlyFavorites'] = true;
            data['taskState'] = 'all';
        }

        if (params.smartfoldersParameters) {
            var param = params.smartfoldersParameters.split('&');
            $.each(param, function (k, v) {
                var keyvalue = v.split('=');
                data[keyvalue[0]] = keyvalue[1];
            });
        }

        // Call ajax and returns promise
        //return $.read(url, data);
        return $.read(url, data)
            .pipe(function (response) {

                var groupedData = {
                    columnTitle: [],
                    lstIdCases: [],
                    elements: [],
                    page: response.page,
                    totalPages: response.totalPages
                };

                var actualDate = new Date();
                var actualMonth = actualDate.getMonth();
                var actualDay = actualDate.getDate();
                var actualYear = actualDate.getYear();

                groupedData.columnTitle = response.cases.columnTitle;
                groupedData.lstIdCases = response.cases.lstIdCases;
                groupedData.page = response.cases.page;
                groupedData.totalPages = response.cases.totalPages;

                for (var counter = 0, length = response.cases.rows.length; counter < length; counter++) {
                    var tmpElement = response.cases.rows[counter];

                    var tmpdate = new Date(tmpElement.fields[3]);
                    var tmpDay = tmpdate.getDate();
                    var tmpMonth = tmpdate.getMonth();
                    var tmpYear = tmpdate.getYear();

                    if (actualDay > tmpDay || (actualMonth > tmpMonth || actualYear > tmpYear)) {
                        tmpElement.fields[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement.fields[3]), 'dd MMM'); // 'dd MMM hh:mm'
                        groupedData.elements.push($.extend({}, tmpElement, {'group': 'overdue'}));

                    } else {
                        if (actualDay == tmpDay) {
                            tmpElement.fields[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement.fields[3]), 'hh:mm');
                            groupedData.elements.push($.extend({}, tmpElement, {'group': 'today'}));

                        } else if ((actualDay + 1) == tmpDay) {
                            tmpElement.fields[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement.fields[3]), 'hh:mm');
                            groupedData.elements.push($.extend({}, tmpElement, {'group': 'tomorrow'}));

                        } else {
                            tmpElement.fields[3] = bizagi.util.dateFormatter.formatDate(new Date(tmpElement.fields[3]), 'dd MMM');
                            groupedData.elements.push($.extend({}, tmpElement, {'group': 'upcoming'}));
                        }
                    }
                }

                // No data items
                if (typeof (groupedData.elements) === 'undefined' || (typeof (groupedData.elements) !== 'undefined' && groupedData.elements.length === 0)) {
                    groupedData.elements.push({ noResults: true, message: bizagi.localization.getResource('workportal-menu-search-found-no-cases') });
                }

                return groupedData;
            });
    },
    /*
     *   Returns the available categories filtered by a parent category
     *   If not parent category is sent, it will return the base categories
     */
    getCategories: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};

        // Required params
        if (params.idCategory)
            data['idCategory'] = params.idCategory;
        if (params.idApp)
            data['idApp'] = params.idApp;

        if (bizagi.isMobile()) {
            data['mobileDevice'] = true;
        }


        data['groupByApp'] = params.groupByApp || false;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl('process-handler-getCategory'), data);
    },
    /*
     *   Returns the recent process
     */
    getRecentProcesses: function (params) {
        var self = this;
        params = params || {};

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl('process-handler-getRecentProcesses'), params);
    },

    /*
     *   Returns the summary for a case
     */
    getCaseSummary: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read({
            url: self.serviceLocator.getUrl('case-handler-getCaseSummary'),
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
    },

    /*
     *   Returns the assigness for a case (all users assigned to any task of this case)
     */
    getCaseAssignees: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl('case-handler-getCaseAssignees'), {
                idCase: params.idCase
            }
        )
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Returns all the tasks belonging to a process, aditionally return if it has an active workitem or not
     */
    getCaseTasks: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl('case-handler-getCaseTasks'), {
                idCase: params.idCase
            }
        );
    },
    /*
     *   Returns all the events available for a case
     */
    getCaseEvents: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read({
            url: self.serviceLocator.getUrl('case-handler-getCaseEvents'),
            data: {
                idCase: params.idCase
            },
            serviceType: 'GETEVENTS'
        })
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Returns all the available subprocesses for a case
     */
    getCaseSubprocesses: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read({
            url: self.serviceLocator.getUrl('case-handler-getCaseSubprocesses'),
            data: {
                idCase: params.idCase
            },
            serviceType: 'GETSUBPROCESSES'
        })
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Returns forms render version for a case
     */
    getCaseFormsRenderVersion: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl('case-handler-getCaseFormsRenderVersion'), {
                idCase: params.idCase
            }
        );
    },
    /**
     *  Get json from forms render version service
     */
    getCaseFormsRenderVersionDataContent: function (options) {
        var self = this;
        var defer = new $.Deferred();

        $.when(self.getCaseFormsRenderVersion(options))
            .done(function (data) {
                // return json content
                defer.resolve(data);
            });
        return defer.promise();
    },
    /*
     *   Returns all the assignees belonging to a workitem (case - task combination)
     */
    getTaskAssignees: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase, idTask
        return $.read(
            self.serviceLocator.getUrl('case-handler-getTaskAssignees'), {
                idCase: params.idCase,
                idTask: params.idTask
            }
        );
    },
    /*
     *   Returns the available workitems for a case (Routing service)
     */
    getWorkitems: function (params) {
        var self = this;
        var data = {};

        params = params || {};

        data.idCase = params.idCase;
        data.fromTask = params.fromTask;
        data.fromWorkItemId = params.fromWorkItemId;
        data.mobileDevice = bizagi.isMobile();

        params.eventAsTasks ? (data.eventAsTasks = params.eventAsTasks) : "";

        if (typeof params.onlyUserWorkItems !== "undefined") {
            data.onlyUserWorkItems = params.onlyUserWorkItems;
        }

        // Required params: idCase
        return $.read({
            url: self.serviceLocator.getUrl('case-handler-getWorkItems'),
            data: data,
            serviceType: 'GETWORKITEMS'
        });
    },
    /*
     *   Returns the available workitems for a case (Routing service)
     */
    getQueries: function (params) {
        var self = this;

        if (self.hashQueries && params.idElement) {
            return self.hashQueries[params.idElement];
        } else {
            var defer = new $.Deferred();

            // Call ajax and returns promise
            $.read(self.serviceLocator.getUrl('query-handler-getqueries'))
                .done(function (response) {
                    self.hashQueries = {};
                    self.hashQueries[0] = {};

                    // Process the full response converting it into small entries inside a hashtable
                    self.processQueries(response.query);
                    defer.resolve(self.hashQueries['-1']);
                });
            return defer.promise();
        }
    },
    /*
     *   Creates a hash of queries to simulate each category request
     */
    processQueries: function (queries) {
        var self = this;
        $.each(queries, function (i, query) {
            if (!self.hashQueries[query.idParent]) {
                self.hashQueries[query.idParent] = [];
            }
            self.hashQueries[query.idParent].push(query);
            if (query.nodes) {
                self.processQueries(query.nodes);
            } else {
                query.nodes = {};
            }
        });
    },
    /*
     *   Creates a new case in BizAgi
     */
    createNewCase: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.create({
            url: self.serviceLocator.getUrl('case-handler-addNewCase'),
            data: {
                idWfClass: params.idWfClass,
                caseData: params.caseData ? JSON.stringify(params.caseData) : null,
                idOrganization: params.idOrganization ? params.idOrganization : null
            },
            serviceType: 'NEWCASE'
        });
    },

    /*
     * La idea con este servicio es por ahora quitar el hatStartForm del servicio de Shortcuts y de acciones
     * retorna si tiene forma de inicio y el guid de la entidad de proceso
     */
    validateHasStartForm: function (params) {
        var self = this;
        var data = {
            processId: params.processId
        };

        // Call ajax and returns promise
        return $.read({
            url: self.serviceLocator.getUrl("case-handler-validateHasStartForm"),
            data: data,
            batchRequest: true
        });
    },


    /*
     *   Start process in Bizagi
     */
    startProcess: function (params) {
        var self = this;
        params = params || {};

        var data = {
            idProcess: params.idProcess,
            entityMapping: params.mapping ? JSON.stringify(params.mapping) : {}
        };

        if (typeof params.idParentCase !== "undefined") {
            data.idParentCase = params.idParentCase;
        }

        var defer = $.Deferred();

        $.create({
            url: self.serviceLocator.getUrl("case-handler-startProcess"),
            data: data,
            serviceType: "STARTPROCESS"
        }).fail(function (error) {
            var response = $.parseJSON(error.responseText);
            if (response.status === "error" && !bizagi.util.isVersionSupported()) {
                var oldParams = {
                    idWfClass: params.idProcess || params.idWfClass,
                    idOrganization: params.idOrganization || null
                };

                self.createNewCase(oldParams)
                    .then(function (result) {
                        result.oldVersion = true;

                        defer.resolve(result);
                    }).fail(function (error) {
                    defer.reject(error);
                });
            } else {
                defer.reject(error);
            }
        }).done(function (data) {
            defer.resolve(data);
        });

        return defer.promise();
    },

    /*
     *   Start process in BizAgi
     */
    actionCreateCase: function (params) {
        var self = this;
        var data = {
            processId: (typeof params.idProcess !== "undefined") ? params.idProcess : params.guidProcess
        }
        // When the proccess is a shortcut it does not have mapping and parentCaseId,
        // but when the process is not a shortcut, it has a context, so it comes with mapping and parentCaseId
        if (typeof params.parentCaseId !== "undefined") {
            data.parentCaseId = params.parentCaseId;
        }
        if (typeof params.mapping !== "undefined") {
            data.entityMapping = params.mapping ? JSON.stringify(params.mapping) : {};
        }

        return $.create({
            url: self.serviceLocator.getUrl("handler-execute-action-start"),
            data: data,
            serviceType: "STARTPROCESS"
        });
    },

    /**
     * Get the first parent plan on not contextualizeds plans
     * */
    getFirstParentPlan: function (data) {
        var self = this,
            url = self.serviceLocator.getUrl("project-plan-first-parent-plan");
        var defer = $.Deferred();
        $.when($.read({
            url: url,
            data: data,
            dataType: "json"
        })).done(function (response) {
            defer.resolve(response);
        }).fail(function () {
            defer.resolve(null);
        });
        return defer.promise();
    },
    /*
     *   Search cases with radNumber
     */
    searchCases: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};

        data['h_action'] = 'SEARCHCASES';
        data['onlyUserCases'] = false;
        data['active'] = false;
        data['page'] = params.page || 1;
        if (params.radNumber)
            data['radNumber'] = $.trim(params.radNumber);
        data['pageSize'] = params.pageSize || self.pageSize;

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('query-handler'),
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    },
    /*
     *   Search cases with radNumber
     */
    queryCases: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};

        data.h_action = 'QUERYCASES';
        data.onlyUserCases = params.onlyUserCases || false;
        data.active = params.active && true;
        data.page = params.page || 1;
        if (params.radNumber)
            data.radNumber = $.trim(params.radNumber);
        data.pageSize = params.pageSize || self.pageSize;

        data.filter = params.filter;
        data.outputxpath = params.outputxpath;

        // data for sort columns
        data.orderFieldName = params.orderFieldName || '';
        data.orderType = (params.orderType == 'asc' || params.orderType == 1) ? 1 : 0;
        data.order = params.order || '';

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('query-handler'),
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    },
    /*
     *   Search entities service
     */
    queryEntities: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};

        data.h_action = 'QUERYENTITIES';
        data.page = params.page || 1;
        data.pageSize = self.Class.ENTITIES_QUERY_PAGE_SIZE;

        // Query parameters
        data[self.Class.BA_CONTEXT_PARAMETER_PREFIX + 'idEnt'] = params.idEntity;
        data.filter = params.filter;
        data.outputxpath = params.outputxpath;

        // Data to sort columns
        data.orderFieldName = params.orderFieldName || '';
        data.orderType = params.orderType || '';
        data.order = params.order || '';

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('query-handler'),
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    },
    /*
     *  Get Menu Authorization
     */
    getMenuAuthorization: function () {
        var self = this;

        return $.read(
            self.serviceLocator.getUrl('authorization-handler-getMenuAuthorization')
        );
    },
    /*
     *  The user have permissions to excecute this Case
     */
    isCaseCreationAuthorized: function (params) {
        var self = this;
        var urlSend = self.serviceLocator.getUrl('authorization-handler-isCaseCreationAuthorized');
        urlSend = urlSend.replace('{0}', params.idWfClass || '');

        return $.read({
            url: urlSend //,
            //data: { 'idWfClass': params.idWfClass }
            //data: { 'userName': BIZAGI_USER, 'password': BIZAGI_PASSWORD, 'domain': BIZAGI_DOMAIN }
        });
    },
    /*
     *   Returns the execution state of an async workitem
     */
    getAsynchExecutionState: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read({
            url: self.serviceLocator.getUrl('case-handler-getAsynchExecutionState'),
            data: {
                idCase: params.idCase
            },
            serviceType: 'ASYNCHEXECUTION'
        });
    },

    /*
     *  Returns the supported log types
     */
    supportedLogTypes: function () {
        var self = this;

        return $.read(self.serviceLocator.getUrl('case-handler-supportedLogTypes'));
    },
    /*
     *   Returns the Activity Log for a case
     */
    getActivityLog: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl('case-handler-getActivityLog'), {
                idCase: params.idCase,
                orden: params.sort || 0,
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Returns the Activity Detail Log for a case
     */
    getActivityDetailLog: function (params) {
        var self = this;

        params = params || {};

        // Required params: idWorkItemFrom
        return $.read(
            self.serviceLocator.getUrl('case-handler-getActivityDetailLog'), {
                idCase: params.idCase,
                idWorkItemFrom: params.idWorkItemFrom,
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Returns the Entity Log for a case
     */
    getEntityLog: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl('case-handler-getEntityLog'), {
                idCase: params.idCase,
                orden: params.sort || 0,
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Returns the Entity Detail Log for a case
     */
    getEntityDetailLog: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl('case-handler-getEntityDetailLog'), {
                idCase: params.idCase,
                idEntity: params.idEntity || -1,
                userFullName: params.userFullName || '',
                attribDisplayName: params.attribDisplayName || '',
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Returns the User Log for a case
     */
    getUserLog: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl('case-handler-getUserLog'), {
                idCase: params.idCase,
                orden: params.sort || 0,
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Returns the User Detail Log for a case
     */
    getUserDetailLog: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase , idUser
        return $.read(
            self.serviceLocator.getUrl('case-handler-getUserDetailLog'), {
                idCase: params.idCase,
                idUser: params.idUser,
                entDisplayName: params.entDisplayName || '',
                attribDisplayName: params.attribDisplayName || '',
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Returns the Admin Log for a case
     */
    getAdminLog: function (params) {
        var self = this;

        params = params || {};

        // Required params: idCase
        return $.read(
            self.serviceLocator.getUrl('case-handler-getAdminLog'), {
                idCase: params.idCase,
                orden: params.sort || 0,
                idActualPage: params.idActualPage || 1,
                pageSize: params.pageSize || 10
            }
        )
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Adds a New Favorite
     */
    addFavorite: function (params) {
        var self = this;

        // Define data
        params = params || {};

        return $.create(
            self.serviceLocator.getUrl('favorites-handler-saveFavorite'), {
                idObject: params.idObject,
                favoriteType: params.favoriteType
            }
        )
            .pipe(function (response) {
                return response;
            });
    },
    /*
     *   Favorites service
     */
    delFavorite: function (params) {
        var self = this;

        // Define data
        params = params || {};

        // Required params: guidFavorite
        return $.destroy(
            self.serviceLocator.getUrl('favorites-handler-deleteFavorite'), {
                guidFavorite: params.idObject
            }
        )
            .pipe(function (response) {
                return response;
            });
    },
    // Data Transformations for Summary Widget
    /*
     * Render Assigness
     */
    summaryAssigness: function (options) {
        var self = this;
        var def = new $.Deferred();
        var idCase = options.idCase || "";

        $.when(
            self.getCaseAssignees({
                idCase: idCase
            })
        ).done(function (baseAssignees) {

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

            for (var i = 0; i < assigneesLength; i++) {
                if (bizagi.util.parseBoolean(assignees[i].isEvent)) {
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
    summarySubProcess: function (options) {
        var self = this;
        var def = $.Deferred();
        var idCase = options.idCase || '';

        $.when(
            self.getCaseSubprocesses({
                idCase: idCase
            })
        ).done(function (subprocess) {
            subprocess['showSubProcess'] = (subprocess['subProcesses'].length >= 1) ? true : false;
            subprocess['showSubProcesColumns'] = (subprocess['CustFields'][0] !== undefined && subprocess['CustFields'][0][0].length >= 1) ? true : false;

            // Prepare json for subprocess
            if (subprocess['showSubProcesColumns']) {
                subprocess['subProcPersonalized'] = {};
                var len;
                for (var n = 0; n < subprocess['CustFields'].length; n++) {
                    len = 0;
                    for (var i = 0; i < subprocess['subProcesses'].length; i++) {
                        if (subprocess['subProcesses'][i]['idCustData'] == n) {
                            subprocess['subProcPersonalized'][n] = subprocess['subProcPersonalized'][n] || {};
                            subprocess['subProcPersonalized'][n]['subProcesses'] = subprocess['subProcPersonalized'][n]['subProcesses'] || {};
                            subprocess['subProcPersonalized'][n]['subProcesses'][len++] = subprocess['subProcesses'][i];
                        }
                    }

                    if (subprocess["subProcesses"][n]["idCustData"] != -1 && subprocess["subProcPersonalized"][n] != undefined) {
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
    summaryCaseEvents: function (options) {
        var self = this;
        var def = $.Deferred();
        var idCase = options.idCase || '';

        $.when(
            self.getCaseEvents({
                idCase: idCase
            })
        ).done(function (events) {
            events['showEvents'] = (events['events'].length >= 1) ? true : false;
            def.resolve(events);
        });
        return def.promise();
    },
    /*
     * Render Details
     * @param idWorkitem
     */
    summaryCaseDetails: function (options) {
        var self = this;
        var def = new $.Deferred();
        var idWorkitem = options.idWorkitem || 0;

        $.when(
            self.getCaseSummaryDataContent(options)
        ).done(function (data) {
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

            for (i = 0; i < dataCurrentStateLength; i++) {
                if (data.currentState[i].idWorkItem == idWorkitem) {
                    data.allowsReassign = data.currentState[i].allowsReassign;
                }
            }

            // edit original data, no show events in activities tab
            var currentStateTypes = [];
            var m = 0; // counter for new activities array
            for (i = 0; i < dataCurrentStateLength; i++) {
                if (!bizagi.util.parseBoolean(data.currentState[i].isEvent) && bizagi.util.parseBoolean(data
                        .currentState[i].assignToCurrentUser) && data.currentState[i].idWorkItem != idWorkitem) {
                    currentStateTypes[m++] = data.currentState[i];
                }
            }

            data.currentStateTypes = currentStateTypes;
            data.showActivities = (currentStateTypes.length > 0) ? true : false;

            def.resolve(data);
        });

        return def.promise();
    },

    releaseActivity: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("case-handler-releaseActivity");
        url = url.replace("{idCase}", params.idCase);
        var data = {};
        // Define data
        if (params) {
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
    summaryActivities: function (options) {
        var activities = {};
        var data = options['data'] || {};
        var idWorkItem = idWorkItem || options['idWorkitem'] || 0;

        try {
            activities['showActivities'] = (data['currentStateTypes'].length >= 1) ? true : false;
            activities['currentState'] = data['currentStateTypes'];
            activities['globalIdWorkitem'] = idWorkItem;
            activities['creationDate'] = data['creationDate'];
        } catch (e) { }

        return activities;
    },
    /**
     *  Get json from cases service
     */
    getCaseSummaryDataContent: function (options) {
        var self = this;
        var promise = new $.Deferred();

        $.when(self.getCaseSummary(options))
            .done(function (data) {
                // Completes data
                data.taskState = self.icoTaskState;
                data.process = data.process ? data.process : "";

                if (data.createdBy) {
                    data.createdByName = data.createdBy.Name;
                    data.createdByUserName = data.createdBy.userName;
                    data.caseDescription = (data.caseDescription == "" ? "" : data.caseDescription);
                    data.processPath = data.processPath.replace(/\//g, " > ") + data.process;
                    data.showWorkOnIt = true;
                }

                // return json content
                promise.resolve(data);
            });

        return promise.promise();
    },
    /**
     * Definition service for bizagi smart folders
     *
     * @param id optional with filter purpose
     */
    getSmartFolders: function (id) {
        var self = this;
        var data = {};

        data.idFolder = id || '';
        // Call read and returns promise
        return $.read(self.serviceLocator.getUrl('folders-handler-getUserQueries'), data).pipe(function (response) {
            if (id == -1 || id == '') {
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
    deleteSmartFolder: function (options) {
        var self = this;
        var data = {};

        data.action = '6';
        options = options || {};

        data.idSmartFolder = options.idSmartFolder || '';
        data.idUser = options.idUser || '';

        return $.destroy(self.serviceLocator.getUrl('folders-associate-deleteSmartFolder'), data);
    },
    /**
     * Definition service for bizagi folders
     *
     * @param id optional with filter purpose
     */
    getFolders: function (id) {
        var self = this;
        var data = {};

        data.action = 'getUserFolder';
        data.idFolder = id || '';
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('folders-handler'),
            type: 'POST',
            data: data,
            dataType: 'json'
        }).pipe(function (response) {
            if (id == '') {
                var folders = {
                    folders: [{
                        name: bizagi.localization.getResource('workportal-widget-folders'),
                        id: '-1',
                        idParent: 0,
                        childs: response
                    }]
                };
                return folders;
            } else if (id == -1) {
                return response;
            } else {
                return self.searchFolders(id, response) || [];
            }
        });
    },
    searchFolders: function (idFolder, data) {
        for (var i = 0; i < data.folders.length; i++) {
            var value = data.folders[i];
            if (value.id == idFolder) {
                return data.folders[i]['childs'];
                break;
            }
        }
        return undefined;
    },
    getCasesByFolder: function (query) {
        query = query || '';

        return $.ajax({
            cache: true,
            url: 'RestServices/' + query,
            type: 'GET',
            dataType: 'json'
        });
    },
    makeFolder: function (options) {
        var self = this;
        var data = {};

        data.action = 'CreateUpdateFolder';
        data.folderName = options.folderName || 'No Name';

        // Make folder under subcategory
        if (options.idParentFolder != undefined && options.idParentFolder > 1) {
            data.idParentFolder = options.idParentFolder;
        }

        return $.ajax({
            url: self.serviceLocator.getUrl('folders-handler'),
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    },
    updateFolder: function (options) {
        var self = this;
        var data = {};
        options = options || {};

        data.action = 'CreateUpdateFolder';
        // Define idFolder
        data.idFolder = options.idFolder || '';

        // Update name
        if (options.folderName) {
            data.folderName = options.folderName;
        }

        // Update path
        if (options.idParentFolder) {
            data.idParentFolder = options.idParentFolder;
        }

        return $.ajax({
            url: self.serviceLocator.getUrl('folders-handler'),
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    },
    /**
     * Associate cases to folders
     *
     * @param options {idcase,idCustomFolder}
     */
    associateCaseToFolder: function (options) {
        var self = this;
        var data = {};

        data.action = '4';
        options = options || {};

        data.idCase = options.idCase || '';
        data.idCustomFolder = options.idCustomFolder;

        return $.ajax({
            url: self.serviceLocator.getUrl('folders-associate'),
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    },
    /*
     * Dissasociate cases to folder
     *
     * @param options {idFolder, idCase}
     */
    dissasociateCaseFromFolder: function (options) {
        var self = this;
        var data = {};

        data.action = 'DeleteCaseFromFolder';
        options = options || {};

        data.idFolder = options.idFolder;
        data.idCase = options.idCase;

        return $.ajax({
            url: self.serviceLocator.getUrl('folders-handler'),
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    },
    /**
     * Delete folder
     * @param options {idCustomFolder}
     */
    deleteFolder: function (options) {
        var self = this;
        var data = {};

        data.action = '5';
        options = options || {};

        data.idCustomFolder = options.idCustomFolder || '';

        return $.ajax({
            url: self.serviceLocator.getUrl('folders-associate'),
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    },
    /**
     * Gets a file binary from the server
     * @param options {fileId}
     */
    getFile: function (options) {
        var self = this;
        var data = {};
        var url = this.serviceLocator.getUrl('file-handler');
        options = options || {};

        data.action = 'getFileContent';
        data.uploadId = options.uploadId || '';
        data.entityId = options.entityId || '';
        data.entityKey = options.entityKey || '';

        return bizagi.services.ajax.pathToBase + url + '?' + jQuery.param(data);
    },
    /**
     * Get Comments per case
     * @param params {idCase=int&idColorCategory=int&pag=int&pagSize=int}
     * @return json
     */
    getComments: function (params) {
        //params.idCase = params.idCase || 0;
        var self = this;

        params = params || {};

        return $.read(encodeURI(self.serviceLocator.getUrl('MessageHandler-GetComments')), {
            idCase: params.idCase || '',
            idColorCategory: (typeof params.idColorCategory == 'number') ? params.idColorCategory : '',
            pag: params.pag || 1,
            pagSize: params.pagSize || 10
        })
            .pipe(function (result) {
                var def = new $.Deferred();
                var picture = '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';
                if (!result.comments) {
                    result.comments = [];
                } else {
                    // Add CategoryColor for each comment
                    $.each(result.comments, function (key, value) {
                        if (!result.comments[key].hasOwnProperty('CategoryColor')) {
                            result.comments[key]['CategoryColor'] = '';
                        }
                    });
                }
                if (!result.users) {
                    $.when(self.getCurrentUser())
                        .done(function (user) {
                            result.users = [];
                            result.users.push({
                                Id: user.idUser,
                                Name: user.user,
                                DisplayName: user.userName,
                                Picture: picture
                            });
                        });
                } else {
                    $.each(result.users, function (key, value) {
                        // Add picture to all users
                        result.users[key]['Picture'] = (result.users[key]['Picture'] === '') ? picture : result.users[key]['Picture'];
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
    makeNewComment: function (options) {
        var self = this;
        var picture = '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';
        return $.create(self.serviceLocator.getUrl('MessageHandler-NewComment'), {
            idCase: options.idCase || '',
            comment: options.comment.replace(/\n/g, '<br>') || ''
        })
            .pipe(function (result) {
                if (result.comments) {
                    var comments = [result.comments];
                    $.each(comments, function (key, value) {
                        // Add CategoryColor for each comment
                        comments[key]['CategoryColor'] = '';
                    });
                    result.comments = comments;
                }

                if (result.users) {
                    var users = [result.users];
                    $.each(users, function (key, value) {
                        // Add picture to all users
                        users[key]['Picture'] = (users[key]['Picture'] == '') ? picture : users[key]['Picture'];
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
    makeNewReply: function (options) {
        var self = this;
        var picture = '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';

        options = options || {};

        return $.create(self.serviceLocator.getUrl('MessageHandler-ReplyComment'), {
            idCase: options.idCase || '',
            idComment: options.idComment || '',
            comment: options.comment.replace(/\n/g, '<br>') || ''
        })
            .pipe(function (result) {
                if (result.comments) {
                    result.Replies = [result.comments];
                }

                if (result.users) {
                    var users = [result.users];
                    $.each(users, function (key, value) {
                        // Add picture to all users
                        users[key]['Picture'] = (users[key]['Picture'] == '') ? picture : users[key]['Picture'];
                    });
                    result.users = users;
                }

                return result;
            });
    },
    /**
     * Remove one comment from the list in mobiles
     *
     * @param options {content:{guid:"..."},attachmentsToDelete:["...", "...", ...]};
     * @return json {action:true|false, message:'if error, explain why'}
     */
    removeMobileComment: function (options) {
        var self = this;
        var url = self.serviceLocator.getUrl('remove-comment');

        options = options || {};

        return $.destroy({
            url: url,
            data: JSON.stringify(options),
            dataType: "json",
            contentType: "application/json"
        }).pipe(function (response) {
            return response;
        });
    },

    /**
     * Remove one comment from the list
     *
     * @param options {idCase=int&idComment=int}
     * @return json {action:true|false, message:'if error, explain why'}
     */
    removeComment: function (options) {
        var self = this;

        options = options || {};

        return $.destroy(self.serviceLocator.getUrl('MessageHandler-RemoveComment'), {
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
    removeReply: function (options) {
        var self = this;

        options = options || {};

        return $.destroy(self.serviceLocator.getUrl('MessageHandler-RemoveReply'), {
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
    renameCommentCategory: function (options) {
        var self = this;

        options = options || {};

        return $.update(self.serviceLocator.getUrl('MessageHandler-RenameCategoryColor'), {
            idColorCategory: (options.idColorCategory >= 0) ? options.idColorCategory : '',
            colorName: options.colorName || ''
        });
    },
    /**
     * @param options {idCase=int&idComment=int&idColorCategory={0-5}}
     * return json
     */
    setCommentCategory: function (options) {
        var self = this;

        options = options || {};

        return $.update(self.serviceLocator.getUrl('MessageHandler-SetCategoryToComment'), {
            idCase: options.idCase || '',
            idComment: options.idComment || '',
            idColorCategory: (typeof options.idColorCategory == 'number') ? options.idColorCategory : ''
        });
    },
    /**
     * @return json Definition of all categories of message
     */
    getCommentsCategories: function () {
        var self = this;

        return $.read(self.serviceLocator.getUrl('MessageHandler-GetCategoryColors'))
            .pipe(function (result) {
                if (result.length > 1 && result[0]['categories']) {
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
    getNewComments: function (options) {
        var self = this;

        options = options || {};

        return $.read(encodeURI(self.serviceLocator.getUrl('MessageHandler-CountNewComments')), {
            idCase: options.idCase || 0,
            idComment: options.idComment || 0
        });
    },
    /**
     * Get all analisys queries
     * @return json
     */
    getAnalisysQueries: function () {
        var self = this;

        return $.read(self.serviceLocator.getUrl('bamAnalytics-handler-getAnalisysQueries'));
    },
    /**
     * Update name and comment
     *
     * @param options json {queryName,queryDescription,idQuery }
     * @return json  {response:true}
     */
    updateQueries: function (options) {
        var self = this;

        return $.update(self.serviceLocator.getUrl('bamAnalytics-handler-updateQuery'), {
            idQuery: (options.idQuery >= 0) ? options.idQuery : '',
            queryName: options.queryName || '',
            queryDescription: options.queryDescription || ''
        });
    },
    /**
     * Delete query
     *
     * @param queryId integer
     * @return json  {response:true}
     */
    deleteQueries: function (queryId) {
        var self = this;
        var data = {};

        data.action = '1612';
        data.QueryId = queryId || '';

        return $.destroy(self.serviceLocator.getUrl('reports-handler-deleteQueries'), data);
    },
    /**
     * Get bizagi configuration
     * @param {Function}   type    callback function when the file load is succed
     * @return {deferred} ajax object with JSON content
     */
    getConfiguration: function () {
        var self = this;
        var url = self.serviceLocator.getUrl("authenticationConfig");

        return $.read(url);
    },
    /**
     * Logout Service
     */
    logout: function () {
        var self = this;
        // Remove session storage of authentication data
        sessionStorage.removeItem('bizagiAuthentication');

        //Call to the restfull service for domain list
        try {
            var javaLogout = $.create(self.serviceLocator.getUrl('logout'));

            $.when(javaLogout).done(function () {
                location.reload();
            }).fail(function () {
                bizagi.log('Error logging out');
            });
        } catch (e) { }
    },

    /**
     * Logout from different types of services
     * This method can reload the page after calling the logout service required
     */
    logoutMobile: function () {
        var self = this;
        var logoutData = {sourceLogout: "user"};

        // Remove session storage of authentication data
        sessionStorage.removeItem("bizagiAuthentication");

        // Hybrid will use normal system
        if (bizagi.util.isCordovaSupported()) {
            var url = self.serviceLocator.getUrl("logout");
            return $.create(url);
        } else {
            // Call to the restfull service for domain list
            try {

                $.when(self.getConfiguration()).done(function (data) {
                    var authenticationType = data.authenticationType;
                    switch (authenticationType) {
                        case "Federate":
                            $.when($.create(self.serviceLocator.getUrl("logout"), logoutData))
                                .fail(function () {
                                    bizagi.log("Error logging out");
                                }).always(function () {
                                location.href = data.logOffURL;
                            });
                            break;
                        case "SAML":
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
                        case "OAuth2":
                            $.when($.create(self.serviceLocator.getUrl("logout"), logoutData)).done(function () {
                                $.when($.read(self.serviceLocator.getUrl("oauth2AuthenticationConfig")))
                                    .done(function (response) {
                                        var idPLogoutUrl = response.logoutUrl;
                                        var singleSignOnCookieEnabled = response.singleSignOnCookieEnabled;
                                        if (idPLogoutUrl && singleSignOnCookieEnabled) {
                                            location.href = idPLogoutUrl + "?callback=" + response.homeUrl;
                                        } else {
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
                                window.location = bizagi.services.ajax.loginPage;
                            }).fail(function () {
                                bizagi.log("Error logging out");
                            });
                            break;
                    }
                }).fail(function (message) {
                    bizagi.log(message);
                });
            } catch (e) {
                bizagi.log(e);
            }
        }
    },

    /**
     * Services for Massive Activity Assignment
     */

    /*
     * Obtain the organization info, such as roles, skills or locations. One of this options
     * must be specified as a parameter
     * @param object  {objectType=Roles|Skills|Locations}
     * @return json
     */
    getOrganizationInfo: function (params) {
        var self = this;

        // Define data
        var data = {};

        data['objectType'] = params;

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('massive-activity-assignments-getOrganizationInfo'),
            data: data,
            type: 'GET',
            dataType: 'json'
        });
    },
    /*
     *   Get Cases By Organization, using parameters suchs as roles, skills and locations
     * @param object  {roles=(string),roles=(skills), locations=(string)}
     * @return json
     */
    getCasesByOrganization: function (params) {
        var self = this;

        // Define data
        var data = {};


        data['roles'] = (params.roles) ? '[' + params.roles.toString() + ']' : '[]';

        data['skills'] = (params.skills) ? '[' + params.skills.toString() + ']' : '[]';

        data['locations'] = (params.locations) ? '[' + params.locations.toString() + ']' : '[]';

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('massive-activity-assignments-getCasesByOrganization'),
            data: data,
            type: 'GET',
            dataType: 'json'
        });
    },
    /*
     *   Get Cases By Organization, using parameters suchs as roles, skills and locations
     * @param object  {user=[array], roles=(string),roles=(skills), locations=(string)}
     */
    reassignCases: function (params) {
        var self = this;

        // Define data
        var data = {};

        data['users'] = (params.user) ? '[' + params.user.toString() + ']' : '[]';
        data['roles'] = (params.roles) ? '[' + params.roles.toString() + ']' : '[]';
        data['skills'] = (params.skills) ? '[' + params.skills.toString() + ']' : '[]';
        data['locations'] = (params.locations) ? '[' + params.locations.toString() + ']' : '[]';

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('massive-activity-assignments-reassignCases'),
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    },
    /*
     * Search the users inside the Organization, using parameters suchs as userName, full name, domain, roles, skills and locations
     * All parameters are optional
     * @param object  {userName=(string), fullName=(string), domain=(string), roles=(string),roles=(skills), locations=(string)}
     * @return json
     */
    searchUsers: function (params) {
        var self = this;

        // Define data
        var data = {};

        data['userName'] = params.userName || '';

        data['fullName'] = params.fullName || '';

        data['domain'] = params.domain || '';

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('massive-activity-assignments-searchUsers'),
            data: data,
            type: 'GET',
            dataType: 'json'
        });
    },
    /**
     * Get json with bizagi domains list
     * @return {deferred} ajax object with JSON content
     */
    getDomainList: function () {
        var self = this;
        var url = self.serviceLocator.getUrl('domains');

        return $.read(url);
    },
    /**
     * Services for Asynchronous ECM Upload
     */

    /* Get the ECM Pending Scheduled Jobs
     * @return {deferred} ajax object with JSON content
     */
    getEcmAllScheduledJobs: function () {
        var self = this;

        // Define data
        var data = {};
        data['action'] = 'getEcmAllScheduledJobs';

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl('async-ecm-upload-baseService'), data);
    },
    /* Retries an especific ECM Pending Scheduled Job
     * @param object  {jobId=(string)} //The id of the job wich is going to be retried
     * @return {deferred} ajax object with JSON content
     */
    retryECMPendingScheduledJob: function (params) {
        var self = this;

        // Define data
        var data = {};
        data['action'] = 'retryECMPendingScheduledJob';
        data['idJob'] = params;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl('async-ecm-upload-baseService'), data);
    },
    /*
     *   Returns the current workportal version
     */
    getWorkPortalVersion: function () {
        var self = this;

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('WorkPortalVersion'),
            type: 'GET',
            dataType: 'json'
        }).always(function (data) {
            // Compatibility with java version
            data = data || {};

            if (data.version == '') {
                // Take the build version
                data.version = bizagi.loader.productBuild || '';
            }
            return data;
        });
    },
    /*
     *   Returns the combo's data to authentication log depending of the params
     */
    getAuthenticationLogData: function (params) {
        var self = this;

        // Define data
        var data = {};
        var url = '';

        if (params['dataType'] == 'domains') {
            url = 'admin-getAuthenticationDomains';
        } else if (params['dataType'] == 'events') {
            url = 'admin-getAuthenticationEventsTypes';
        } else {
            url = 'admin-getAuthenticationEventSubTypes';
        }

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl(url),
            data: data,
            type: 'GET',
            dataType: 'json'
        });
    },
    /*
     *   Get the search result of authentication log
     */
    getAuthenticationLogResult: function (params) {
        var self = this;

        // Define data
        var data = {};

        data['action'] = params.action;
        data['domain'] = params.domain;
        data['userName'] = params.userName;
        data['dtFrom'] = params.dtFrom;
        data['dtTo'] = params.dtTo;
        data['eventSubType'] = params.eventSubType;
        data['eventType'] = params.eventType;
        data['pag'] = params.pag;
        data['pagSize'] = params.pagSize;

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('admin-getAuthenticationLog'),
            data: data,
            type: 'GET',
            dataType: 'json'
        });
    },
    /*
     *   Return the password encrypted
     */
    encryptString: function (params) {
        var self = this;

        var data = {};

        // Define data
        params = params || {};

        data.entry = params.entry;

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('admin-EncryptString'),
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    },

    /*
     *   Return the users requests
     */
    userPendingRequests: function (params) {
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
    userAuthenticationInfo: function (params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl('admin-UserAuthenticationInfo'), {
            idUser: params.idUser
        });
    },

    /*
     *   Return Update User Authentication Info
     */
    updateUserAuthenticationInfo: function (params) {
        var self = this;

        // Call ajax and returns promise
        return $.create(self.serviceLocator.getUrl('admin-updateUserAuthenticationInfo'), {
            idUser: params.idUser,
            password: params.password,
            enable: params.enable,
            expired: params.expired,
            locked: params.locked
        });
    },

    /*
     *   Return generate Data To Send By Email
     */
    generateRandomPassword: function (params) {
        var self = this;

        // Define data
        params = params || {};
        params['action'] = 'generateRandomPassword';
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('admin-generateRandomPassword'),
            data: params,
            type: 'POST',
            dataType: 'json'
        });
    },

    /*
     *   Return generate Data To Send By Email
     */
    generateDataToSendByEmail: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data['action'] = 'GenerateDataToSendByEmail';
        data['idUser'] = params.idUser;
        data['password'] = params.password;
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('admin-GenerateDataToSendByEmail'),
            data: params,
            type: 'POST',
            dataType: 'json'

        });
    },

    /*
     *   Return generate Send Mail
     */
    sendEmail: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data['action'] = 'sendEmail';
        data['emailTo'] = params.emailTo;
        data['subject'] = params.subject;
        data['body'] = params.body;
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('admin-sendEmail'),
            data: params,
            type: 'POST',
            dataType: 'json'
        });
    },

    /*
     *   Return Applications, Categories or processes list
     */
    getApplicationCategoriesList: function (params) {
        var self = this;
        var data = {};
        var url = '';

        if (params.action == 'Applications') {
            url = 'admin-getApplicationList';

            // Call ajax and returns promise
            return $.ajax({
                url: self.serviceLocator.getUrl(url),
                type: 'GET',
                dataType: 'json'
            });
        } else {
            url = 'admin-getCategoriesList';
            data.idApp = params.idApp;
            data.idCategory = params.idCategory;
            if (data.idCategory == '') {
                data.idCategory = -1;
            }

            if (typeof (params.filterStartEvent) !== 'undefined') {
                data.filterStartEvent = params.filterStartEvent;
            }

            // Call ajax and returns promise
            return $.ajax({
                url: self.serviceLocator.getUrl(url),
                data: data,
                type: 'GET',
                dataType: 'json'
            });
        }
    },

    /*
     *   Return the list of all cases that matched the filters
     */
    getAdminCasesList: function (params) {
        var self = this;
        var data = params || {};

        // Call ajax and returns promise
        return $.ajax({
            //eliminar esto con el servicio restfull
            cache: true,
            url: self.serviceLocator.getUrl('admin-getCasesList'),
            data: data,
            type: 'GET',
            dataType: 'json'
        });

    },

    /*
     *   Return the application's processes
     */
    getApplicationProcesses: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl('admin-getApplicationProcesses');

        var data = {};

        data['idApp'] = params['idApp'] ? params['idApp'] : -1;


        return $.read(url, data);
    },

    /*
     *   Return the application's processes
     */
    getProcessVersion: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl('admin-getProcessVersion');

        var data = {};

        data['idWfClass'] = params['idWFClass'];

        return $.read(url, data);
    },

    /*
     *   Return the the workflow's versions task
     */
    getProcessTasks: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl('admin-getProcessTasks');

        var data = {};

        data['idWfClass'] = params['idWFClass'];
        data['version'] = params['version'] ? params['version'] : undefined;

        return $.read(url, data);
    },

    /*
     * Retrieves the alarms from an specific task
     */
    getTaskAlarms: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl('admin-getTaskAlarms');

        var data = {};

        data['idTask'] = params['idTask'];

        return $.read(url, data);
    },

    /*
     * Retrieves each kind of alarm lapse
     */
    getLapseMode: function () {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-getLapseMode');

        return $.read(url);
    },

    /*
     * Retrieves each kind of alarm recurrence
     */
    getRecurrMode: function () {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-getRecurrMode');

        return $.read(url);
    },


    /*
     * Retrieves each kind of alarm recurrence
     */
    getScheduleType: function () {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-getScheduleType');

        return $.read(url);
    },

    /*
     *   Retrieves the boss list
     */
    getBossList: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-getBossList');
        return $.read(url);
    },

    /**
     *   Add a new alarm
     */
    addAlarm: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-addAlarm');

        var data = {};

        data['idTask'] = params['idTask'];
        data['idRecurrMode'] = params['idRecurrMode'];
        data['idLapseMode'] = params['idLapseMode'];
        data['scheduleType'] = params['scheduleType'];
        data['alarmTime'] = params['alarmTime'];
        data['alarmRecurrTime'] = params['alarmRecurrTime'];
        data['sendToCurrentAssignee'] = params['sendToCurrentAssignee'];

        return $.update(url, data);
        /*
         return $.ajax({
         url: self.serviceLocator.getUrl('admin-addAlarm'),
         data: data,
         type: 'PUT',
         dataType: 'json'
         });
         */
    },

    /*
     *   Edits an existin alarm
     */
    editAlarm: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl('admin-editAlarm');

        var data = {};

        data['idTask'] = params['idTask'];
        data['idAlarm'] = params['idAlarm'];
        data['idRecurrMode'] = params['idRecurrMode'];
        data['idLapseMode'] = params['idLapseMode'];
        data['scheduleType'] = params['scheduleType'];
        data['alarmTime'] = params['alarmTime'];
        data['alarmRecurrTime'] = params['alarmRecurrTime'];
        data['sendToCurrentAssignee'] = params['sendToCurrentAssignee'];


        return $.update(url, data);


    },

    /*
     *   Delete an alarm
     */
    deleteAlarm: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl('admin-deleteAlarm');

        var data = {};

        data['idAlarm'] = params['idAlarm'];

        return $.destroy(url, params);

    },

    /*
     * Returns the Alarm Recipients
     * @param param: idAlarm : the alarm id to get the related recipients
     */
    getAlarmRecipients: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl('admin-alarmRecipients');

        var data = {};

        data['idAlarm'] = params['idAlarm'];

        return $.read(url, data);
    },

    /*
     * Adds a new Alarm Recipient to the current alam
     * @param param: idAlarm : the alarm id to get the related recipients
     * @param param: idRecipient : the recipient id
     */
    addRecipientToAlarm: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl('admin-recipientToAlarm');

        var data = {};

        data['idAlarm'] = params['idAlarm'];
        data['idRecipient'] = params['idRecipient'];

        return $.update(url, data);


    },

    /*
     * Delete/s the alarm recipient/s from the current task
     * @param param: idRecipient : the recipient id/s who is going to be deleted
     */
    deleteRecipientsFromAlarm: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl('admin-deleteAlarmRecipients');

        var data = {};

        data['idRecipients'] = params['idRecipients'];

        return $.destroy(url, data);
    },

    /*
     * Send the action to toggle the alarms state: enable or disable
     * @param param: idTask : the task id who is going to be actvidated/deactivaded his alarms
     */
    enableAlarm: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-enableAlarm');

        var data = {};

        data['idTask'] = params['idTask'];

        return $.create(url, data);
    },

    /*
     * Invalidate or Reassign a set of cases
     */
    abortReassignItems: function (params) {
        var self = this;
        var data = params || {};
        var url = params.action == 'abort' ? 'admin-abortItems' : 'admin-reassignItems';
        // Call ajax and returns promise

        return $.ajax({
            url: self.serviceLocator.getUrl(url),
            data: data,
            type: 'POST',
            dataType: 'json'
        });
    },
    /*
     * Services for Asynchronous Activities
     */
    asyncActivitiesServices: function (params) {
        var self = this;
        var data = params;
        var url = '';
        var type = 'GET';
        if (params.action == 'getActivities') {
            url = self.serviceLocator.getUrl('admin-async-activities-get-activities');
        } else if (params.action == 'retryNow') {
            type = 'POST';
            url = self.serviceLocator.getUrl('admin-async-activities-get-retry-now');
            url = url.replace('{idCase}', params.idCase);
            url = url.replace('{idworkItem}', params.idWorkitem);
            if (params.idCase == -1) {
                url = url.replace("{idAsynchWorkitem}", params.idAsynchWorkitem);
            } else {
                url = url.replace("{idAsynchWorkitem}", "-1");
            }
        } else if (params.action == 'getActivitiesByTask') {
            url = self.serviceLocator.getUrl('admin-async-activities-get-activities-by-task');
        } else if (params.action == 'enableExecution') {
            type = 'POST';
            url = self.serviceLocator.getUrl('admin-async-activities-enable-execution');
        } else if (params.action == 'enableMultiple') {
            url = self.serviceLocator.getUrl('admin-async-activities-enable-multiple');
            type = 'POST';
        } else if (params.action == 'asyncExecution') {
            url = self.serviceLocator.getUrl('admin-async-activities-async-execution');
        } else if (params.action == 'asyncExecutionLog') {
            url = self.serviceLocator.getUrl('admin-async-activities-async-execution-log');
            url = url.replace('{idCase}', params.idCase);
            url = url.replace('{idworkItem}', params.idWorkItem);
            if (params.idCase == -1) {
                url = url.replace("{idAsynchWorkitem}", params.idAsynchWorkitem);
            } else {
                url = url.replace("{idAsynchWorkitem}", "-1");
            }
        } else if (params.action == 'getAsyncExecution') {
            url = self.serviceLocator.getUrl('admin-async-activities-async-get-current-execution-log');
        }
        // Call ajax and returns promise
        var response = $.ajax({
            url: url,
            data: data,
            type: type,
            dataType: 'json'
        });

        return response;
    },

    /*
     *  Return generate Default Assignation To all Process
     */
    getDefaultAssignationUserToAllProcess: function (params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl('admin-getDefaultAssignationUserToAllProcess'), {
            serviceAction: 'getDefaultAssignationUserToAllProcess'
        });
    },

    /*
     *  Return generate Default Assignation To Process
     */
    getDefaultAssignationUserToProcess: function (params) {
        var self = this;
        var process;
        // Call ajax and returns promise
        if (params.idWFClass == '') {
            process = -1
        } else {
            process = params.idWfClass
        }
        return $.read(self.serviceLocator.getUrl('admin-getDefaultAssignationUserToProcess'), {
            serviceAction: 'getDefaultAssignationUserToProcess',
            process: process

        });
    },

    /*
     * Return Assignation Process
     */
    setDefaultAssignationUserToProcess: function (params) {
        var self = this;
        if (params.idWFClass == '') {
            process = -1
        } else {
            process = params.idWfClass
        }

        // Call ajax and returns promise
        return $.create(self.serviceLocator.getUrl('admin-setDefaultAssignationUserToProcess'), {
            serviceAction: 'setDefaultAssignationUserToProcess',
            process: process,
            idUser: params.idUser
        });
    },

    /**
     * Get the icon of a given process
     * @param params
     */
    getProcessIcon: function (params) {
        var self = this;
        var data = {
            processId: params.processId
        }

        // Call ajax and returns promise
        return $.read({
            url: self.serviceLocator.getUrl("process-getIcon"),
            data: data,
            batchRequest: true
        });
    },
    /**
     * Get the icon of a given collection
     * @param params
     */
    getCollectionIcon: function (params) {
        var self = this;
        var data = {
            collectionId: params.collectionId
        }

        // Call ajax and returns promise
        return $.read({
            url: self.serviceLocator.getUrl("collections-getIcon"),
            data: data,
            batchRequest: true
        });
    },

    /*
     *   Returns the combo's data to Type Profiles depending of the params
     */
    getProfilesTypes: function (params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl('admin-getProfilesTypes'));
    },

    /*
     *  Return generate Search Profiles
     */
    searchProfiles: function (params) {
        var self = this;

        var url = self.serviceLocator.getUrl('admin-searchProfiles');
        var data = {};
        data['type'] = params['profileType'];
        data['name'] = params['profileName'];

        data["orgId"] = params["orgId"] ? params["orgId"] : null;

        return $.read(url, data);
    },

    /*
     *  Return Users By Profiles
     */
    getUsersByProfile: function (params) {
        var self = this;

        var url = self.serviceLocator.getUrl('admin-getUsersByProfile');
        var data = {};
        data['type'] = params['profileType'];
        data['id'] = params['idProfile'];

        return $.read(url, data);
    },

    /*
     *  Remove User Profiles
     */
    removeUserFromProfile: function (params) {
        var self = this;

        var url = self.serviceLocator.getUrl('admin-removeUserFromProfile');
        var data = {};
        data['type'] = params['profileType'];
        data['id'] = params['idProfile'];
        data['idUser'] = params['idUser'];

        return $.destroy(url, data);
    },

    /*
     *  Add Users Profiles
     */
    addUserToProfile: function (params) {
        var self = this;

        var url = self.serviceLocator.getUrl('admin-addUserToProfile');
        var data = {};
        data['type'] = params['profileType'];
        data['id'] = params['idProfile'];
        data['idUser'] = params['idUser'];

        return $.update(url, data);
    },
    /*
     *  Display Licenses
     */
    licenses: function () {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-Licenses');
        return $.read(url);
    },

    /*
     *   Return Dimensions List
     */
    getDimensions: function () {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-GetDimensions');
        return $.read(url);
    },

    /*
     *   Edit Dimensions
     */
    editDimension: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data['id'] = params.id;
        data['displayName'] = params.displayName;
        data['name'] = params.name;
        data['idWfClass'] = params.idWfClass;
        data['entityPath'] = params.entityPath;
        data['description'] = params.description;
        var url = self.serviceLocator.getUrl('admin-EditDimension');
        // Call ajax and returns promise
        return $.create(url, data);
        /*return $.ajax({
         url: self.serviceLocator.getUrl('admin-EditDimension'),
         data: params,
         type: 'POST',
         dataType: 'json'
         });*/
    },

    /*
     *   Create Dimensions
     */
    createAdministrableDimension: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data['displayName'] = params.displayName;
        data['name'] = params.name;
        data['idWfClass'] = params.idWfClass;
        data['entityPath'] = params.entityPath;
        data['Description'] = params.description;
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('admin-CreateAdministrableDimension'),
            data: params,
            type: 'PUT',
            dataType: 'json'
        });
    },

    /*
     * Delete manageable dimensions
     */
    deleteDimension: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-DeleteDimension');
        // Define data
        params = params || {};
        var data = {};
        data['id'] = params.id;
        data['idDimension'] = params.id;
        data['administrable'] = params.administrable;
        // Call ajax and returns promise
        return $.destroy(url, data);
    },

    /*
     *   Dimensions Process Tree
     */
    entityPathChildNodesAction: function (params) {
        var self = this;

        // Define data
        params = params || {};
        var data = {};
        data['pathNodeType'] = params.nodeType;
        data['idNode'] = params.idNode;
        data['nodeDisplayPath'] = params.nodeDisplayPath;
        data['nodePath'] = params.nodePath;
        data['idWfClass'] = params.idWfClass;
        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl('admin-EntityPathChildNodesAction'),
            data: params,
            type: 'GET',
            dataType: 'json'
        });
    },

    /*
     *   Return list of available processes
     */
    getActiveWFClasses: function (params) {
        var self = this;
        var data = params || {};

        // Call ajax and returns promise

        return $.ajax({
            //eliminar esto con el servicio restfull
            cache: true,
            url: self.serviceLocator.getUrl('admin-GetActiveWFClasses'),
            data: data,
            type: 'GET',
            dataType: 'json'
        });
    },

    /*
     *   Resturn the list of Stored Document Templates
     */
    storeDocumentTemplates: function () {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-document-templates-storeDocumentTemplates');
        return $.read(url);
    },

    /*
     * Restore an selected document template using his Guid as parameter
     * @param params {Object} Guid: the associated Guid from the desired document template
     */
    restoreDocumentTemplates: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-document-templates-restoreDocumentTemplates');

        url += '?Guid=' + params.Guid;

        return $.read(url);
    },

    /*
     * Retreieves the workflow from the actual processes
     */
    getWorkFlowClasses: function () {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-processes-workflowClasses');
        return $.read(url);
    },


    /*
     * Retreives the task from a desired workflow
     * @param params {Object} idWorkFlow: the desired workflow id
     */
    getTaskByWorkFlow: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-processes-tasksByWorkflow');

        var data = {};
        data['idWorkflow'] = params.idWorkflow;


        return $.read(url, data);
    },

    /*
     * Modifies the process durationworkflow
     * @param params {Object} idWorkflow: the desired process id to modify
     * @param params {Object} duration: the duracion, converted in minutes
     */
    modifyProcessDuration: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-processes-modifyProcessDuration');

        var data = {};
        data['idWorkflow'] = params.idWorkflow;
        data['duration'] = params.duration;

        return $.create(url, data);
    },

    /*
     * Modifies the task duration form a desired workflow
     * @param params {Object} idTask: the desired task id to modifie
     * @param params {Object} duration: the duracion, converted in minutes
     */
    modifyTaskDuration: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-processes-modifyTaskDuration');

        var data = {};
        data['idTask'] = params.idTask;
        data['duration'] = params.duration;

        return $.create(url, data);
    },

    /*
     * Retreives the process  from Hierarchy
     *
     */
    processesHierarchy: function () {
        var self = this;
        var data = {};
        data['removeOnlineItems'] = 'true';
        return $.ajax({
            url: self.serviceLocator.getUrl('offline-getProcessTree'),
            data: data,
            dataType: 'json',
            type: 'GET'
        });


    },
    /*
     * this function send to the server the offline cases created
     */

    syncOfflineCases: function (params) {
        var self = this;

        return $.ajax({
            url: self.serviceLocator.getUrl('offline-sendForm'),
            data: {
                idCase: params.idCase,
                idWFClass: params.idWfClass,
                awCaseCreationContext: JSON.stringify(params.objToSend),
                idWorkflow: params.idWfClass
            },
            type: 'POST',
            dataType: 'json',
            serviceType: 'LOAD'
        });
    },
    /*
     * Retreives Form structure + Form data
     *
     */
    processesHierarchyTofetchForms: function (params) {
        var self = this;
        var data = {};

        data['idChangeSet'] = params.changeSet;

        return $.ajax({
            url: self.serviceLocator.getUrl('offline-getForms'),
            data: data,
            dataType: 'json'
        });

    },

    /*
     * this retrive data for the report my team
     */
    getDataForMyTeam: function () {

        var self = this;

        return $.ajax({
            url: self.serviceLocator.getUrl('bam-resourcemonitor-myteam'),
            type: 'GET',
            dataType: 'json'
        });
    },

    /*
     * Retrive data for reports
     */
    getReporstAnalysisQuery: function () {

        var self = this;

        return $.read(self.serviceLocator.getUrl('reports-analysisquery'));
    },

    /*
     * Update report data
     */
    updateReportData: function (params) {

        var self = this;

        return $.update(self.serviceLocator.getUrl('reports-analysisquery-update'), params);
    },

    /*
     * Delete report data
     */
    deleteReportData: function (params) {

        var self = this;

        return $.destroy(self.serviceLocator.getUrl('reports-analysisquery-delete') + '?' + params);
    },
    /*
     *Entrega la lista de idiomas soportados
     */
    getStoreLanguageTemplates: function () {
        var self = this;
        var url = self.serviceLocator.getUrl('admin-language-languages');
        var data = {justActives: false};
        return $.read(url, data);
    },

    /*
     *Download template language list
     */
    getLanguageTemplate: function (params) {
        var self = this;
        var defer = $.Deferred();
        var url = self.serviceLocator.getUrl('admin-language-resource') + '?cultureName=' + params.cultureName;
        defer.resolve('OK');
        window.location.href = url;
        /*
         var response=  $.ajax({
         type: 'GET',
         url: url
         });
         response.always(function(response, status, xhr) {
         if(response.responseText.indexOf('error') >= 0){
         defer.reject('Download error');
         }else{
         defer.resolve('OK');
         window.location.href=url;
         }
         });*/
        return defer.promise();
    },
    /*
     * Process definition service for process viewer
     */
    processDefinition: function (params) {
        var self = this;
        return $.read(self.serviceLocator.getUrl('processviewer-processdefinition'), params);
    },

    /*
     * Graphic info for process viewer
     */
    graphicInfo: function (params) {
        var self = this;
        return $.read(self.serviceLocator.getUrl('processviewer-processgraphicinfo'), params);
    },

    /**
     * This service get the last version of BizagiBPM
     *
     * @return {json}
     */
    getLastUpdateByMobile: function () {
        var self = this;
        return $.read({
            url: self.serviceLocator.getUrl("mobile-getLastUpdate")
        });
    },

    /**
     *
     * @param params
     * @returns {*}
     */
    getCollectionData: function (params) {
        var self = this,
            data = {},
            url = self.serviceLocator.getUrl('templates-handler-getCollectionData');

        data.idFact = params.idFact;
        data.pag = params.page || 1;
        data.pagSize = params.pageSize || 10;
        data.filters = params.filters ? ((!Array.isArray(params.filters)) ? JSON.stringify(params.filters) : undefined) : undefined;

        // Call ajax and returns promise
        return $.read(url, data)
            .pipe(function (response) {
                return response;
            });
    },

    /**
     *
     * @param params
     * @returns {*}
     */
    getVirtualCollectionData: function (params) {
        var self = this,
            data = {},
            url = self.serviceLocator.getUrl('templates-handler-getVirtualCollectionData');

        data.guidVirtualCollection = params.guidVirtualCollection;
        data.pag = params.page || 1;
        data.pagSize = params.pageSize || 10;
        data.filters = params.filters ? ((!Array.isArray(params.filters)) ? JSON.stringify(params.filters) : undefined) : undefined;

        // Call ajax and returns promise
        return $.read(url, data)
            .pipe(function (response) {
                return response;
            });
    },

    /**
     *
     * @param params
     * @returns {*}
     */
    getSearchData: function (params) {
        var self = this;
        // Call ajax and returns promise
        var urlSend = self.serviceLocator.getUrl("my-search-getData");
        urlSend = urlSend.replace("{guidSearch}", params.guidSearch);
        var filters = params.filters || [];

        var data = {
            filters: JSON.stringify(filters),
            pag: params.page || 1,
            calculateFilters: params.calculateFilters || false,
            pagSize: params.pageSize || 10
        };
        return $.read(urlSend, data).then(function (data) {
            return self.serializeEntityData(data);
        });
    },

    /**
     * Return an array with the collections or entity related to stakeholder entities
     * @param params
     */
    getCollectionEntityData: function (params) {
        var self = this, url;
        params = params || {};
        var data = {
            templateType: (params.referenceType === "VIRTUAL" || params.referenceType === "FACT") ? "List" : "Content",
            surrogateKey: params.surrogateKey,
            pag: params.page || 1,
            pagSize: params.pageSize || 10,
            defaultFilterApplied: params.defaultFilterApplied,
            filters: JSON.stringify(params.filters)
        };

        // VIRTUAL
        if (params.referenceType === "VIRTUAL") {
            url = self.serviceLocator.getUrl('data-navigation-handler-collection');
            data.reference = params.reference;
        }
        // ENTITY AND FACTS
        else {
            url = self.serviceLocator.getUrl('data-navigation-handler-entity');
            data.reference = params.guidEntityCurrent;
            data.xpath = params.xpath;
            data.collectionId = params.reference;
        }

        // Call ajax and returns promise
        return $.read(url, data).then(function (response) {
            return self.serializeEntityData(response);
        });
    },

    /**
     *
     * @param params
     */
    getFiltersEntityData: function (params) {
        var self = this;
        params = params || {};
        var data = {
            reference: params.guidEntityCurrent,
            collectionId: params.reference,
            surrogateKey: params.surrogateKey,
            xpath: params.xpath,
            templateType: "List",
            defaultFilterApplied: params.defaultFilterApplied,
            filters: JSON.stringify(params.filters)
        };

        // Call ajax and returns promise
        return $.read({
            url: self.serviceLocator.getUrl("data-navigation-handler-entity-filters"),
            data: data
        });
    },

    /**
     *
     * @param params
     * @returns {*}
     */
    getProcessAddAction: function (params) {
        var self = this,
            url = self.serviceLocator.getUrl("action-handler-getProcessAddAction");

        // Call ajax and returns promise
        return $.read(url, params)
            .pipe(function (response) {
                return response;
            });
    },

    /**
     *
     * @param params
     * @returns {*}
     */
    getMultipleActions: function (params) {
        var self = this,
            url = self.serviceLocator.getUrl("templates-handler-getMultipleActions");

        // Call ajax and returns promise
        return $.read(url, params)
            .pipe(function (response) {
                return response;
            });
    },

    /**
     *
     * @param params
     * @returns {*}
     */
    getMapping: function (params) {
        var self = this;
        return $.ajax({
            url: self.serviceLocator.getUrl("process-handler-getMapping"),
            data: params,
            type: 'POST',
            dataType: 'json'
        });
    },

    /**
     *
     * @param params
     * @returns {*}
     */
    getForm: function (params) {
        var self = this;
        return $.ajax({
            url: self.serviceLocator.getUrl("process-handler-getForm"),
            data: params,
            type: 'POST',
            dataType: 'json'
        });
    },

    /**
     * Chek if an entity has startform
     * @param params
     * @return {*}
     */
    hasStartForm: function (params) {
        var self = this;
        var data = {};

        if (params.guid) {
            data.guidWFClass = params.guid;
        }

        return $.read(self.serviceLocator.getUrl("process-handler-startform"), data);
    },

    /**
     * Executes the action
     * @param params
     * @returns {*}
     */
    executeAction: function (params) {
        var self = this;
        var data = {
            surrogateKey: JSON.stringify(params.surrogatedKey),
            entityId: params.entityId,
            ruleId: params.processId
        };

        // Call ajax and returns promise
        return $.create({
            url: self.serviceLocator.getUrl("process-action-execute"),
            data: data
        });
    },

    /**
     * executes a rule
     * @param params
     * @returns {*}
     */
    actionRule: function (params) {
        var self = this;
        var data = {
            surrogateKey: params.surrogateKey,
            entityId: params.entityId,
            ruleId: params.processId
        }

        return $.create({
            url: self.serviceLocator.getUrl("process-handler-rule"),
            data: data,
            batchRequest: false
        });
    },

    /**
     * Get following cases
     * @param params
     * @returns {*}
     */
    getActivitiesData: function (params) {
        var self = this,
            url = self.serviceLocator.getUrl("process-handler-getActivitiesData");
        params = params || {};
        var data = {
            page: params.page || 1,
            pagsize: params.pageSize || 10
        };

        if (typeof (params.idworkflow) !== "undefined" && params.idworkflow ||
            typeof (params.idWorkflow) !== "undefined" && params.idWorkflow) {
            data.idWorkflow = params.idworkflow || params.idWorkflow;
        }
        if (typeof params.idCase !== "undefined" && params.idCase) {
            data.idCase = params.idCase;
        }

        // Call ajax and returns promise
        return $.read(url, data).then(function (response) {
            return self.serializeEntityData(response);
        });
    },

    /**
     * Return an array with the collections related to stakeholder entities
     */
    getPendingsData: function (params) {
        var self = this,
            url = self.serviceLocator.getUrl("process-handler-getPendingsData");
        params = params || {};
        var data = {
            page: params.page || 1,
            pagsize: params.pageSize || 10
        };

        if (typeof (params.idworkflow) !== "undefined" && params.idworkflow ||
            typeof (params.idWorkflow) !== "undefined" && params.idWorkflow) {
            data.idWorkflow = params.idworkflow || params.idWorkflow;
        }
        if (typeof params.idCase !== "undefined" && params.idCase) {
            data.idCase = params.idCase;
        }
        if (typeof params.taskState !== "undefined" && params.taskState) {
            data.taskState = params.taskState;
        }

        // Call ajax and returns promise
        return $.read(url, data).then(function (response) {
            return self.serializeEntityData(response);
        });
    },

    /**
     * Get actions
     * @param params
     * @returns {*}
     */
    getActionsData: function (params) {
        var self = this;
        params = params || {};

        // Call ajax and returns promise
        return $.read({
            url: self.serviceLocator.getUrl('entities-handler-getActions'),
            data: params,
            batchRequest: true
        }).pipe(function (response) {
            return response;
        });
    },

    /**
     * Get Users, assignees and events from cases
     * @param params
     * @return {*}
     */
    getUsersAndEvents: function (params) {
        var self = this;
        var data = {};

        if (params.idCases && params.idCases.length > 0) {
            data.idCases = params.idCases.toString();
        }

        return $.read(self.serviceLocator.getUrl("entities-handler-getUsersAndEvents"), data);
    },

    /**
     * Get Users, assignees and events from cases
     * @param params
     * @return {*}
     */
    getUsers: function (params) {
        var self = this;
        var data = {
            caseId: params.caseId
        };

        // Call ajax and returns promise
        return $.read({
            url: self.serviceLocator.getUrl("entities-handler-getUsers"),
            data: params,
            batchRequest: true
        });
    },

    /**
     * Get Users, assignees and events from cases
     * @param params
     * @return {*}
     */
    getEvents: function (params) {
        var self = this;
        var data = {
            caseId: params.caseId
        };

        // Call ajax and returns promise
        return $.read({
            url: self.serviceLocator.getUrl("entities-handler-getEvents"),
            data: params,
            batchRequest: true
        });
    },

    /**
     * Get Users images
     * @param params
     * @return {*}
     */
    getUsersImages: function (params, userIds) {
        var self = this;
        var data = {};

        if (userIds && userIds.length > 0) {
            data.userIds = userIds.toString();
        }

        data.width = params.width;
        data.height = params.height;
        data.square = params.square;

        return $.read(self.serviceLocator.getUrl("entities-handler-getUsersImages"), data);
    },

    /**
     * Get stakeholder shortCurts
     * @param params
     * @return {*}
     */
    getShortCuts: function (params) {
        var self = this,
            data = {},
            url = self.serviceLocator.getUrl("entities-handler-getShotCuts");

        if (typeof params.icon !== "undefined" && params.icon) {
            data.icon = true;
        }

        // Call ajax and returns promise
        return $.read(url, data);
    },

    /**
     *   Returns the available list of searches
     */
    getSearchLists: function () {
        var self = this;
        return $.read(self.serviceLocator.getUrl("my-search-getSearchLists"), {});
    },

    /**
     *
     * @param params
     */
    getIdCasesOfProcessEntities: function (params) {
        params = params || {};
        var self = this;
        var ids = {
            ids: JSON.stringify(params)
        };

        if (bizagi.version.server.lessThanOrEqualsTo("11.0.0.2608")) {
            // Call ajax and returns promise
            return $.read({
                url: self.serviceLocator.getUrl("process-handler-getIdCasesOfProcessEntities"),
                data: ids
            });

        }else{
            return $.ajax({
                url: self.serviceLocator.getUrl("process-handler-getIdCasesOfProcessEntities"),
                data: ids,
                type: "POST"
            });
        }
    },

    /**
     * Retuns query form to searches
     * @param params
     * @returns {*}
     */
    getQueryForm: function (params) {
        var self = this;
        params = params || {};
        return $.ajax({
            url: self.serviceLocator.getUrl("query-handler-getQueryForm"),
            data: params,
            type: "POST",
            dataType: params.dataType || "json"
        });
    },

    /**
     * Returns an object with the filter to send to the server
     * @param params
     * @param filterObject
     * @param callback is called when a filter is added to the array
     */
    defineFilterObject: function (params, filterObject, callback) {
        var properties = params.properties;
        var xpath = properties.xpath.split('@')[0];

        var filter = filterObject.find(function (el) {
            return el.xpath == xpath;
        });

        //if the control exists is because it is a range
        if (filter) {
            if (properties.rangeQuery == "from") {
                filter.value = filter.value || {};
                filter.searchType = 'range';
                filter.value.min = params.value;
            }
            else if (properties.rangeQuery == "to") {
                filter.value = filter.value || {};
                filter.searchType = 'range';
                filter.value.max = params.value;
            }
            else {
                params.properties.typeSearch = filter.searchType;
                var values = setValues(params);
                $.extend(filter, values);
            }

            if (properties.orderType) {
                filter.orderType = properties.orderType;
            }
            if (callback) {
                callback(bizagi.clone(filter));
            }
        }
        else {
            var isDefaultFilter = properties.defaultFilter || false;
            filter = setValues(params);

            if (properties.orderType) {
                filter.orderType = properties.orderType;
            }

            if (typeof filter.value != 'undefined' || filter.orderType || isDefaultFilter) {
                filterObject.push(filter);
                if (callback) {
                    callback(bizagi.clone(filter));
                }
            }
        }


        function setValues(params) {
            var properties = params.properties;
            var searchType = properties.typeSearch;
            var value = params.value;

            //Identifing the type control in order to define search type
            if (properties.type == "boolean") {
                if (value.toLowerCase() === "null") {
                    value = null;
                    searchType = "Nullable"
                }
                else {
                    value = bizagi.util.parseBoolean(value);
                    searchType = "exact"
                }
            }

            if (properties.type == "number" || properties.type == "money" || properties.type == "date") {
                searchType = "exact"
            }

            if (typeof params.value == 'object') {
                value = [];
                if (Array.isArray(params.value)) {
                    for (var i = 0, len = params.value.length; i < len; i++) {
                        var val = parseInt(params.value[i].id);
                        if (!isNaN(val)) {
                            value.push(val);
                        }
                    }
                }
                else {
                    var val = parseInt(params.value.id);
                    if (!isNaN(val)) {
                        value.push(val);
                    }
                }
                searchType = "exact";
                value = value.length > 0 ? value : undefined;
            }

            if (properties.rangeQuery && properties.rangeQuery !== "none") {
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

            if (typeof value !== 'undefined') {
                filter.value = value;
            }

            return filter;
        }
    },

    /*PLAN*/
    getPlan: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-get");

        return $.read({
            url: url,
            data: params,
            dataType: "json",
            contentType: "application/json"
        });
    },

    getActivities: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-activities");

        return $.read({
            url: url,
            data: params,
            dataType: "json",
            contentType: "application/json"
        });
    },

    updatePlan: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-update");
        return $.update({
            url: url.replace("{idPlan}", params.id),
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
        });
    },

    putExecutePlan: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-execute");

        return $.create({
            url: url,
            data: params,
            contentType: "application/x-www-form-urlencoded"
        });
    },

    deletePlan: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-delete");

        return $.destroy({
            url: url.replace("{idPlan}", params.id),
            data: params,
            contentType: "application/x-www-form-urlencoded"
        });
    },

    closePlan: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-close");

        return $.create({
            url: url,
            data: params,
            contentType: "application/x-www-form-urlencoded"
        });
    },

    getWorkitemsPlan: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-workitems");

        return $.read({
            url: url,
            data: params,
            dataType: "json",
            contentType: "application/json"
        });
    },

    getTransitionsByPlan: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-transitions-get");

        return $.read({
            url: url,
            data: params,
            dataType: "json",
            contentType: "application/json"
        });
    },

    editActivityPlan: function (params) {
        var self = this;
        var data = {};

        if (params.activity) {
            data = params.activity;
            data.items = params.items;
        } else {
            data = params;
        }

        var url = self.serviceLocator.getUrl("project-plan-activity-edit").replace("{idPlan}", data.idPlan).replace("{id}", data.id);

        return $.update({
            url: url,
            data: JSON.stringify(data),
            dataType: "json",
            contentType: "application/json"
        });
    },

    getPlanByParent: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-get-by-parent");
        var def = $.Deferred();

        $.when($.read({
            url: url,
            data: data,
            dataType: "json",
            contentType: "application/json"
        })).done(function (response) {
            def.resolve(response);
        });

        return def.promise();

    },

    getItemsByActivity: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-activity-tasks-get");
        return $.read({
            url: url,
            data: params,
            dataType: "json",
            contentType: "application/json"
        });
    },

    getPlanParent: function (data) {
        var self = this,
            url = self.serviceLocator.getUrl("project-plan-parent");
        return $.read({
            url: url,
            data: data,
            dataType: "json"
        });
    },
    /**
     * Serializador de servicio de entitiData
     * @param data
     * @returns {*}
     */
    serializeEntityData: function (data) {
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

            for (name in row) {
                if (row.hasOwnProperty(name) && name.toString() !== "row" && name.toString() !== "id") {
                    newObject[name] = row[name];
                }
            }

            for (var i = 0, len = columns.length; i < len; i += 1) {
                newObject.data[columns[i]] = rowData[i];
            }

            return newObject;
        };

        var k = -1, kRow;
        while (kRow = data.rows[++k]) {
            var i = -1, iCell;
            while (iCell = data.cells[++i]) {
                if (iCell.id === kRow.id) {
                    var kReturnObject = _buildNewObject(iCell, kRow);
                    serializedData.entities.push(kReturnObject);
                    break;
                }
            }
        }

        return serializedData;
    },

    /**
     * Returns the recent process
     * @param {} params
     * @returns {}
     */
    getRecentOfflineProcesses: function (params) {
        var self = this;
        params = params || {};

        // Call ajax and returns promise
        return $.read(self.serviceLocator.getUrl('process-handler-getRecentProcesses'), params)
            .then(function (data) {

                var processes = data["processes"] || [];
                var recentProcess = {"processes": []};

                if (!bizagi.util.isObjectEmpty(processes)) {
                    var item;
                    var counter = -1;
                    while ((item = processes[++counter])) {
                        if (item.hasOfflineForm) {
                            recentProcess.processes.push(item);
                        }
                    }
                }

                return recentProcess;
            });
    }
});