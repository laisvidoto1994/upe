/*
*   Name: Bizagi Database Plugin
*   Author:Bizagi Mobile Team
*   Comments:
*   -   This script creates a plugin to handler all db functionalities
*   -   Pre-requisite pouchDB
*/

$.Class.extend("bizagi.workportal.services.fetchWorker", {}, {
    init: function(params) {
        var self = this;
        self.services = params;

        var queryString = bizagi.readQueryString();
        self.disabledb = (queryString && queryString["disabledb"]) ? eval(queryString["disabledb"]) : false;

        if (!self.disabledb) {
            self.dbForms = new PouchDB("DataRenderForms");
            self.dbCases = new PouchDB("DataRenderCases");
            self.dbProcessHierarchy = new PouchDB("DataProcessesHierarchy");
            self.dbProcessRecent = new PouchDB("DataProcessesRecent");
        }

        self.globalId = typeof (BIZAGI_USER) != "undefined"
            ? BIZAGI_USER.toLowerCase() + "-" + BIZAGI_PROXY_PREFIX.toLowerCase() + "-" + BIZAGI_DOMAIN.toLowerCase()
            : "admon" + "-" + "http://localhost/bizagiR100x" + "-" + "domain";
    },

    fetch: function(argument) {
        var self = this;
        var def = new $.Deferred();

        if (self.disabledb) {
            def.reject("Disable Sync");
            return def.promise();
        }

        $.when(self.services.processesHierarchy())
            .done(function(dataCategory, dataRecents) {
                $.when(self.saveProcessesHierarchy(dataCategory),
                        self.processesHierarchyTofetchForms(),
                        self.services.getRecentOfflineProcesses())
                    .done(function(data1, data2, dataRecents) {
                        self.saveRecentProcesses(dataRecents);
                        def.resolve("All data fetched");
                    }).fail(function(data1, data2, data3) {
                        if (data1 === "nothing") {
                            def.reject(0);
                        } else {
                            def.reject("Error fetching data");
                        }
                    });
            });

        return def.promise();
    },

    /**
     * Save in the db the user permitions to create cases
     * @returns {} 
     */
    processesHierarchyTofetchForms: function() {
        var self = this;
        var def = new $.Deferred();

        var changeset = bizagi.util.getItemLocalStorage(("formChangeset" + self.globalId));
        if (changeset === null || typeof changeset === "undefined") {
            changeset = 0;
        }

        self.callSyncForms({
            changeSet: changeset
        }).done(function(data) {
            console.log(data, "Sync forms");
            def.resolve(data);
        }).fail(function(error) {
            if (error === "nothing") {
                console.log("Nothing to sync");
            } else {
                console.log(error, "Error sync forms");
            }
            def.reject(error);
        });

        return def.promise();
    },

    callSyncForms: function(params) {
        var self = this;
        var def = new $.Deferred();
        var changeSet = params.changeSet;

        self.services.processesHierarchyTofetchForms(params)
            .done(function(data) {
                if (data.changeSet > changeSet) {
                    // Add code to validate if form and save
                    var prom = null;
                    if (data.changeSetType === 1) // Form 
                        prom = self.saveProcessesHierarchyTofetchForms(data.result);
                    if (data.changeSetType === 4) { // Grant acess
                        prom = self.saveProcessInHierarchy(data.result);
                    }

                    $.when(prom).done(function() {
                        self.callSyncForms({
                            changeSet: data.changeSet
                        }).done(function(resp) {
                            def.resolve(resp);
                        }).fail(function(error) {
                            def.reject(error);
                        });
                    }).fail(function(err) {
                        def.reject(err);
                    });
                } else {
                    // Set the variable changeset in localStorage
                    bizagi.util.setItemLocalStorage(("formChangeset" + self.globalId), data.changeSet);
                    changeSet = parseInt(changeSet);
                    if (data.changeSet === 0 && changeSet === 0) {
                        // Nothing to sync                    
                        def.reject("nothing");
                    } else {
                        def.resolve("succesfully");
                    }
                }
            }).fail(function(error) {
                def.reject(error);
            });

        return def.promise();
    },

    saveProcessInHierarchy: function(data) {
        var self = this;
        var def = new $.Deferred();

        def.resolve("");

        return def.promise();
    },

    getHierarchyObjects: function(obj, key, val) {
        var self = this;
        var objects = [];

        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == "object") {
                objects = objects.concat(self.getHierarchyObjects(obj[i], key, val));
            } else if (i == key && obj[i] == val || i == key && val == '') {
                objects.push(obj);
            } else if (obj[i] == val && key == '') {
                // Only add if the object is not already in the array
                if (objects.lastIndexOf(obj) == -1) {
                    objects.push(obj);
                }
            }
        }

        return objects;
    },

    /**
     * Save in the db the user Forms
     * @param {} result 
     * @returns {} 
     */
    saveProcessesHierarchyTofetchForms: function(result) {
        var self = this;
        var def = new $.Deferred();

        var docHierarchy = {
            _id: result.wfClass.toString() + "-" + result.wfClass.toString() + "-" + self.globalId,
            globalid: self.globalId,
            idWfClass: result.wfClass,
            idWorkFlow: result.workFlow,
            form: result.data.form
        };

        self.dbForms.get(docHierarchy._id, function(err, doc) {
            // If error, then the doc doesn't exists and it's added
            if (err) {
                // If it does not exist then add
                self.dbForms.put(docHierarchy, function callback(err, result) {
                    if (!err) {
                        def.resolve(result);
                    } else {
                        def.reject("Could not add the document");
                    }
                });
            } else {
                // If no error, then the doc exists and must be replaced if is outdated
                self.dbForms.put({
                    _rev: doc._rev,
                    _id: doc._id,
                    form: docHierarchy.form
                }, function callback(err, result) {
                    if (!err) {
                        def.resolve(result);
                    } else {
                        def.reject("Could not update the document");
                    }
                });
            }
        });

        return def.promise();
    },

    /**
     * Save in the db the user permitions to create cases
     * @param {} hierarchy 
     * @returns {} 
     */
    saveProcessesHierarchy: function(hierarchy) {
        var self = this;
        var def = new $.Deferred();

        var docHierarchy = {
            _id: self.globalId,
            doc: hierarchy
        };

        // Try to search de doc
        self.dbProcessHierarchy.get(docHierarchy._id, function(err, doc) {
            // If error, then the doc doesn't exists and it's add
            if (err) {
                // If it does not exist then add
                self.dbProcessHierarchy.put(docHierarchy, function callback(err, result) {
                    if (!err) {

                        def.resolve(result);
                    } else {

                        def.reject("Could not add the document");
                    }
                });
            } else {
                // If not error, then the doc exists and must be replaced if is outdated
                self.dbProcessHierarchy.put({
                    _id: doc._id,
                    _rev: doc._rev,
                    doc: hierarchy
                }, function callback(err, result) {

                    if (!err) {

                        def.resolve(result);
                    } else {

                        def.reject("Could not update the document");
                    }
                });
            }
        });

        return def.promise();
    },

    /**
     * Save in the db the user recent processes to create cases
     * @param {} processes 
     * @returns {} 
     */
    saveRecentProcesses: function(processes) {
        var self = this;
        var def = new $.Deferred();

        var docRecent = {
            _id: self.globalId,
            doc: processes
        };

        self.dbProcessRecent.get(docRecent._id, function(err, doc) {
            // If error, then the doc does not exists and it's added
            if (err) {
                // If it does not exist then add
                self.dbProcessRecent.put(docRecent, function callback(err, result) {
                    if (!err) {
                        def.resolve(result);
                    } else {
                        def.reject("Could not add the document");
                    }
                });
            } else {
                // If no error, then the doc exists and must be replaced if is outdated
                self.dbProcessRecent.put({
                    _rev: doc._rev,
                    _id: doc._id,
                    doc: processes
                }, function callback(err, result) {
                    if (!err) {
                        def.resolve(result);
                    } else {
                        def.reject("Could not update the document");
                    }
                });
            }
        });

        return def.promise();
    }
});