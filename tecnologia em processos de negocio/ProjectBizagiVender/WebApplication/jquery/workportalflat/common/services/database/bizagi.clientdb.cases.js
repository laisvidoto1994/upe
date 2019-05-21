/*
*   Name: Bizagi Database Plugin
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script creates a plugin to handler all db functionalities
*   -   Pre-requisite pouchDB
*/


bizagi.workportal.services.db.extend("bizagi.workportal.services.db", {}, {

    /**
     * This method create a new case in the db to offline status
     * @param {} params 
     * @returns {} promise
     */
    createNewCase: function(params) {
        var self = this;
        var idWfClass = params.idWfClass,
            id = new Date().toISOString(),
            def = new $.Deferred();

        var offlineCase = {
            _id: id,
            idWfClass: idWfClass.toString(),
            idWorkFlow: idWfClass.toString(),
            idCase: id,
            isFavorite: false,
            globalId: self.globalId,
            createdBy: {
                Name: typeof (BIZAGI_USER) !== "undefined" ? BIZAGI_USER : "admon",
                userName: typeof (BIZAGI_USER) !== "undefined" ? BIZAGI_USER : "admon"
            },
            creationDate: new Date(),
            process: params.process || "Offline",
            categoryName: params.process || params.categoryName || "Offline",
            displayName: params.displayName || "Offline",
            radNumber: id,
            // closed: false,
            isOfflineForm: true,
            formsRenderVersion: 2,
            syncronized: false,
            isOpen: true,
            workItems: [
                {
                    idWorkItem: PouchDB.uuids(),
                    idTask: PouchDB.uuids(),
                    idCase: id,
                    colorState: "Green",
                    State: "Green",
                    TaskName: params.process || "Offline"
                }
            ]
        };

        self.dbCases.put(offlineCase, function callback(err, result) {
            if (!err) {
                def.resolve(offlineCase);
            } else {
                def.reject(err);
            }
        });

        return def.promise();
    },

    /**
     * Delete case
     * @param {} params 
     * @returns {} promise 
     */
    deleteCase: function(params) {
        var self = this;
        var def = new $.Deferred();

        self.dbCases.get(params.idCase, function(err, doc) {
            if (!err) {
                self.dbCases.remove(doc, function(error, response) {
                    if (!error) {
                        def.resolve(response);
                    } else {
                        bizagi.log("Error erasing case");
                        def.reject(err);
                    }
                });

            } else {
                bizagi.log("Error, the case do not exist");
                def.reject(err);
            }
        });
        return def.promise();
    },

    getWorkitems: function(params) {
        var self = this,
            def = new $.Deferred();

        self.dbCases.get(params.idCase, function(err, doc) {
            if (!err) {
                def.resolve(doc);
            } else {

                def.reject(err);
            }
        });

        return def.promise();
    },

    /**
     * This method return the categories as the services if exists in the database
     * @param {} data 
     * @returns {} promise
     */
    getCategories: function(data) {
        var self = this;
        var def = new $.Deferred();

        if (!data.enableOfflineForm) {
            def.resolve({});
        }

        if (!self.categories) {
            self.dbProcessHierarchy.get(self.globalId, function(err, doc) {
                if (!err) {
                    self.categories = doc.doc;

                    if (data.idApp || data.idCategory) {
                        var groupCategory = getGroup(self.categories, data);
                        def.resolve({
                            category: groupCategory,
                            totalApps: (data.idApp ? groupCategory.length : 0)
                        });
                    } else {
                        var tempCategories = self.categories;
                        while (tempCategories.length == 1
                            && (tempCategories[0].categories || tempCategories[0].subCategories)) {
                            tempCategories = getGroup(
                                tempCategories,
                                tempCategories[0].appId ? { idApp: tempCategories[0].appId }
                                : { idCategory: tempCategories[0].idCategory }
                            );
                        }

                        def.resolve({
                            category: tempCategories,
                            totalApps: (tempCategories[0] && tempCategories[0].appId ? tempCategories.length : 0)
                        });
                    }
                } else {
                    def.reject("could not extract this document");
                }
            });
        } else {
            if (data.idApp || data.idCategory) {
                var groupCategory = getGroup(self.categories, data);
                def.resolve({
                    category: groupCategory,
                    totalApps: (data.idApp ? groupCategory.length : 0)
                });
            } else {
                var tempCategories = self.categories;
                while (tempCategories.length == 1
                    && (tempCategories[0].categories || tempCategories[0].subCategories)) {
                    tempCategories = getGroup(
                        tempCategories,
                        tempCategories[0].appId ? {
                            idApp: tempCategories[0].appId
                        } : {
                            idCategory: tempCategories[0].idCategory
                        });
                }
                def.resolve({
                    category: tempCategories,
                    totalApps: (tempCategories[0] && tempCategories[0].appId ? tempCategories.length : 0)
                });
            }
        }

        return def.promise();

        /**
         * Get the group for new cases similar to service 
         * @param {} categories 
         * @param {} data 
         * @returns {} 
         */
        function getGroup(categories, data) {
            for (var i = 0, len = categories.length; i < len; i++) {
                if (categories[i].appId && categories[i].appId == data.idApp) {
                    return categories[i].categories;
                }
                if (categories[i].idCategory && categories[i].idCategory == data.idCategory) {
                    return categories[i].subCategories;
                } else {
                    if (categories[i].categories) {
                        var cat = getGroup(categories[i].categories, data);
                        if (cat) {
                            return cat;
                        }
                    }

                    if (categories[i].subCategories) {
                        var cat = getGroup(categories[i].subCategories, data);
                        if (cat) {
                            return cat;
                        }
                    }
                }
            }
        }
    },

    /**
     * This method return all the open cases for the user authenticated from de DB
     * @returns {} promise
     */
    getAllOpenCases: function() {
        var self = this;
        var def = new $.Deferred();

        function map(doc) {
            if (doc.closed === false && doc.createdBy.userName === "admon") {
                emit(doc, null);
            }
        }

        self.dbCases.query({
            map: map
        }, {
            reduce: false
        }, function(err, response) {
            if (!err) {
                def.resolve(response);
            }
        });

        return def.promise();
    },

    /**
     * Get case by id
     * @param {} idCase 
     * @returns {} 
     */
    getCase: function(idCase) {
        var self = this;
        var def = new $.Deferred();

        self.dbCases.get(idCase, function(err, doc) {
            if (!err) {
                def.resolve(doc);
            } else {
                def.reject(err);
            }
        });
        return def.promise();
    },

    /**
     * This method return the cases created offline by idWorkflow
     * @param {} params 
     * @returns {} promise
     */
    getCustomizedColumnsData: function(params) {
        var self = this;
        var def = new $.Deferred();

        var cases = {
            "cases": {
                "rows": [],
                "totalPages": 1,
                "page": 1,
                "lstIdCases": []
            }
        };

        var isOpen = params.inputtray === "true";

        if (params.radnumber || params.radNumber) {
            params["radNumber"] = params.radnumber ? params.radnumber : params.radNumber;
        }

        if (params.idcase || params.idCase) {
            params["radNumber"] = params.idcase ? params.idcase : params.idCase;
        }

        var queryFun = {
            map: function(doc) {
                emit(doc.globalId, doc);
            }
        };

        self.dbCases.query(queryFun, {
            reduce: false,
            key: self.globalId
        }, function(error, resp) {
            if (!error) {
                for (var i = 0, len = resp.total_rows; i < len; i++) {
                    if (isOpen === resp.rows[i].value.isOpen &&
                    (typeof (params.radNumber) === "undefined" || params.radNumber.toString() === ""
                        || params.radNumber.toString() === resp.rows[i].value.radNumber)) {
                        var localCase = {
                            id: resp.rows[i].id,
                            idWFClass: resp.rows[i].idWFClass,
                            idWorkFlow: resp.rows[i].id,
                            taskState: "",
                            isFavorite: resp.rows[i].value.isFavorite,
                            guidFavorite: "",
                            isOpen: resp.rows[i].value.isOpen,
                            isOfflineForm: true,
                            fields: [
                                {
                                    Value: resp.rows[i].value.process,
                                    DisplayName: resp.rows[i].value.process,
                                    DataType: "VarChar",
                                    isRadNumber: false
                                }, {
                                    Value: resp.rows[i].value.creationDate,
                                    DisplayName: "Process creation date",
                                    DataType: "DateTime",
                                    isRadNumber: false
                                }
                            ]
                        };
                        cases.cases.rows.push(localCase);
                        cases.cases.lstIdCases.push(resp.rows[i].id);
                    }
                }

                // Update counter
                cases.cases.totalPages = cases.cases.page = cases.cases.rows.length > 0 ? 1 : 0;

                def.resolve(JSON.stringify(cases));
            } else {
                bizagi.log("Error loading cases from local data base");
                def.reject("Error loading cases from local database");
            }
        });
        return def.promise();
    },

    getAllProcesses: function(params) {
        var self = this;
        var def = new $.Deferred();

        if (typeof (params.inputtray) === "undefined") {
            params.inputtray = true;
        }

        // params.inputtry: draft | outbox | inbox disable
        var response = {
            "workflows": {
                "taskstate": "",
                "workflow": []
            }
        };

        //Reduce and rereduce functions search in http://docs.couchdb.org/en/latest/ddocs.html#view-functions
        var queryFun = {
            map: function(doc) {
                //Trae los documentos del usuario segun el filtro de all, o si estan en favorites etc
                if (doc.idWfClass && doc.globalId) {
                    emit({
                        idWf: doc.idWfClass,
                        gId: doc.globalId,
                        isOpen: doc.isOpen.toString()
                    }, 1);
                }
            },
            reduce: "_count"
        };

        self.dbProcessHierarchy.get(self.globalId, function(err, doc) {
            if (!err) {

                self.dbCases.query(queryFun, {
                    reduce: true
                }, function(error, resp) {
                    if (!error) {
                        for (var i = 0, len = resp.total_rows; i < len; i++) {
                            if (resp.rows[i].key.gId == self.globalId 
			    	&& resp.rows[i].key.isOpen == params.inputtray.toString()) {
                                // Revisar si es necesario agregar aqui el parametro
                                var cat = self.getHierarchyObjects(doc, "idCategory", resp.rows[i].key.idWf);
                                response.isOpen = params.inputtray;
                                response.workflows.workflow.push({
                                    category: "Offline Procesess",
                                    name: cat[0] ? cat[0].categoryName : "",
                                    idworkflow: resp.rows[i].key.idWf,
                                    count: resp.rows[i].value,
                                    isFavorite: false
                                });
                            }
                        };
                        def.resolve(JSON.stringify(response));
                    } else {
                        def.reject("error");
                    }
                });
            } else {
                def.reject("error");
            }
        });
        return def.promise();
    },

    getOutboxCases: function() {
        // body
        var self = this;
        var def = new $.Deferred();

        var queryFun = {
            map: function(doc) {
                // Get the user documents according to filter all, or if its are in favorites etc.
                if (!doc.isOpen) {
                    //  emit({ idWfClass: doc.idWfClass, isOpen: doc.isOpen.toString() }, doc);
                    emit(doc.globalId, doc);
                }
            }
        };

        self.dbCases.query(queryFun, {
                reduce: false,
                key: self.globalId
            },
            function(err, doc) {
                if (!err) {
                    def.resolve(doc);
                } else {
                    bizagi.log("Error loading data before syncronization");
                    def.reject(err);
                }
            });
        return def.promise();
    },

    /**
     * This method return the cases created offline by idWorkflow
     * @param {} params 
     * @returns {}  Returns a promise
     *  Struct: [
     *   idCase, idWorkItem, idTask,
     *   dueDate, processName, activityName,
     *   customzedColumns: [key, value],
     *   isOfflineForm, isOpen
     * ]
     */
    getCasesList: function(params) {
        var self = this;
        var def = new $.Deferred();
        var cases = {
            "page": 1,
            "totalPages": 1,
            "elements": []
        };

        var isOpen = params.inputtray === "true";

        var queryFun = {
            map: function(doc) {
                emit(doc.globalId, doc);
            }
        };

        self.dbCases.query(queryFun, {
            reduce: false,
            key: self.globalId
        }, function(error, resp) {
            if (!error) {
                for (var i = 0, len = resp.total_rows; i < len; i++) {
                    if (isOpen === resp.rows[i].value.isOpen &&
                    (typeof params.radNumber === "undefined" || params.radNumber.toString() === ""
                        || resp.rows[i].value.radNumber.toString().indexOf(params.radNumber.toString()) != -1)) {

                        var localCase = [
                            resp.rows[i].value.idCase,
                            resp.rows[i].value.workItems[0]["idWorkItem"][0] || "",
                            resp.rows[i].value.workItems[0]["idTask"][0] || "",
                            resp.rows[i].value.creationDate,
                            resp.rows[i].value.categoryName,
                            resp.rows[i].value.displayName,
                            [
                                ["Case No", resp.rows[i].value.idCase],
                                ["Process", resp.rows[i].value.process],
                                ["Process creation date", bizagi.util.formatDateTime(resp.rows[i].value.creationDate)]
                            ],
                            resp.rows[i].value.isOfflineForm,
                            resp.rows[i].value.isOpen
                        ];

                        cases.elements.push(localCase);
                    }
                }
                def.resolve(JSON.stringify(cases));
            } else {
                bizagi.log("Error loading cases from local database");
                def.reject("Error loading cases from local database");
            }
        });
        return def.promise();
    },

    /*
    *   This method return the cases created offline by idWorkflow
    *   Returns a promise
    */
    getCustomizedColumnsNewData: function(params) {
        var self = this;
        var def = new $.Deferred();
        var cases = {
            "cases": {
                "rows": [],
                "totalPages": 1,
                "page": 1,
                "lstIdCases": []
            }
        };

        var isOpen = params.inputtray === "true";

        var queryFun = {
            map: function(doc) {
                emit(doc.globalId, doc);
            }
        };

        self.dbCases.query(queryFun, {
            reduce: false,
            key: self.globalId
        }, function(error, resp) {
            if (!error) {
                for (var i = 0, len = resp.total_rows; i < len; i++) {
                    if (isOpen === resp.rows[i].value.isOpen &&
                    (typeof (params.radNumber) === "undefined" || params.radNumber.toString() === ""
                        || params.radNumber.toString() === resp.rows[i].value.radNumber)) {
                        var localCase = {
                            id: resp.rows[i].value.idCase,
                            idWFClass: resp.rows[i].value.idWfClass,
                            idWorkFlow: resp.rows[i].value.idWorkFlow,
                            taskState: "",
                            isFavorite: resp.rows[i].value.isFavorite,
                            guidFavorite: "",
                            isOpen: resp.rows[i].value.isOpen,
                            isAborted: false,
                            isOfflineForm: true,
                            fields: [
                                resp.rows[i].value.idCase,
                                resp.rows[i].value.process,
                                {
                                    "workitems": resp.rows[i].value.workItems
                                },
                                bizagi.util.formatDateTime(resp.rows[i].value.creationDate),
                                "",
                                bizagi.util.formatDateTime(resp.rows[i].value.creationDate)
                            ]
                        };
                        cases.cases.rows.push(localCase);
                        cases.cases.lstIdCases.push(resp.rows[i].id);
                    }
                }

                // Update counter
                cases.cases.totalPages = cases.cases.page = cases.cases.rows.length > 0 ? 1 : 0;

                def.resolve(JSON.stringify(cases));
            } else {
                bizagi.log("Error loading cases from local database");
                def.reject("Error loading cases from local database");
            }
        });

        return def.promise();
    },

    /**
     * Get recent processes
     * @param {} params 
     * @returns {} promise
     */
    getRecentProcesses: function(params) {
        var self = this;
        var deferred = new $.Deferred();
        var recent = { "processes": [] };

        if (!self.recentProcesses) {
            self.dbProcessRecent.get(self.globalId, function(error, doc) {
                if (!error) {
                    self.recentProcesses = doc.doc;
                    deferred.resolve(self.recentProcesses);
                } else {
                    bizagi.log("Could not extract this document");
                    deferred.reject(error);
                }
            });
        } else {
            deferred.resolve(self.recentProcesses);
        }

        return deferred.promise();
    }
});