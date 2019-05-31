/*
*   Name: BizAgi Database Plugin
*   Author:oscaro
*   Comments:
*   -   This script creates a plugin to handler oll db functionalities
*   -   Pre-requisite pouchDB
*/
/// <reference path="../../../../common/bizagi/js/bizagi.util.js" />


$.Class.extend("bizagi.workportal.services.fetchWorker", {}, {
    init: function (params) {
        var self = this;
        self.services = params;

        var queryString = bizagi.readQueryString();
        querydisable = (queryString && queryString["disabledb"]) ? eval(queryString["disabledb"]) : false;
        self.disabledb = querydisable;

        if (!self.disabledb) {
            self.dbForms = new PouchDB('DataRenderForms'),
            self.dbCases = new PouchDB("DataRenderCases"),
            self.dbProcessHierarchy = new PouchDB("DataProcessesHierarchy");
        }

        self.globalId = (typeof BIZAGI_USER != "undefined") ? BIZAGI_USER.toLowerCase() + "-" + BIZAGI_PROXY_PREFIX.toLowerCase() + "-" + BIZAGI_DOMAIN.toLowerCase() : "admon" + "-" + "http://localhost/bizagiR100x" + "-" + "domain";
    },

    fetch: function (argument) {
        var self = this;
        var def = new $.Deferred();

        if (self.disabledb) {
            def.reject("Disable Sync");
            return def.promise();
        }

        $.when(self.services.processesHierarchy()).done(function (data) {

            $.when(
                self.saveProcessesHierarchy(data),
                self.processesHierarchyTofetchForms()
            ).done(function (data1, data2) {
                def.resolve("All data fecth");
            }).fail(function (data1, data2) {
                if (data1 === "nothing")
                    def.reject(0);
                else
                    def.reject("error fectching data");
            });

        });
        return def.promise();
    },

    //Save in the db the user permitions to create cases
    processesHierarchyTofetchForms: function () {
        var self = this;
        var def = new $.Deferred();

        var changeset = bizagi.util.getItemLocalStorage(("formChangeset" + self.globalId));
        if (changeset === null || typeof changeset === "undefined")
            changeset = 0;

        self.callSyncForms({
            changeSet: changeset
        }).done(function (data) {
            console.log(data, "sync forms");
            def.resolve(data);
        }).fail(function (error) {
            if (error === "nothing") {
                console.log("nothing to sync");
            } else {
                console.log(error, "error sync forms");
            }
            def.reject(error);
        });

        return def.promise();
    },

    callSyncForms: function (params) {
        var self = this;
        var def = new $.Deferred();
        var changeSet = params.changeSet;

        self.services.processesHierarchyTofetchForms(params).done(function (data) {
            if (data.changeSet > changeSet) {
                //agregar codigo para validar si es form y guardarlo

                var prom = null;
                if (data.changeSetType === 1) //Form 
                    prom = self.saveProcessesHierarchyTofetchForms(data.result);
                if (data.changeSetType === 4) { //Grant acess
                    prom = self.saveProcessInHierarchy(data.result);
                }
                $.when(prom).done(function () {
                    self.callSyncForms({
                        changeSet: data.changeSet
                    }).done(function (resp) {
                        def.resolve(resp);
                    }).fail(function (error) {
                        def.reject(error);
                    });
                }).fail(function (err) {
                    def.reject(err);
                });
            } else {
                //setear la variable del changeset en localStorage
                bizagi.util.setItemLocalStorage(("formChangeset" + self.globalId), data.changeSet);
                changeSet = parseInt(changeSet);
                if (data.changeSet === 0 && changeSet === 0) { //nothing to sync                    
                    def.reject("nothing");
                } else {
                    def.resolve("succesfully");
                }
            }
        }).fail(function (error) {
            def.reject(error);
        });

        return def.promise();
    },

    saveProcessInHierarchy: function (data) {
        var self = this;
        var def = new $.Deferred();
        def.resolve("");
        return def.promise();
    },

    getHierarchyObjects: function (obj, key, val) {
        var self = this;
        var objects = [];
        for (var i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] == 'object') {
                objects = objects.concat(self.getHierarchyObjects(obj[i], key, val));
            } else if (i == key && obj[i] == val || i == key && val == '') {

                objects.push(obj);
            } else if (obj[i] == val && key == '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) == -1) {
                    objects.push(obj);
                }
            }
        }
        return objects;
    },

    //Save in the db the user Forms
    saveProcessesHierarchyTofetchForms: function (result) {
        var self = this;
        var def = new $.Deferred();

        var docHierarchy = {
            _id: result.wfClass.toString() + "-" + result.wfClass.toString() + "-" + self.globalId,
            globalid: self.globalId,
            idWfClass: result.wfClass,
            idWorkFlow: result.workFlow,
            form: result.data.form
        };

        self.dbForms.get(docHierarchy._id, function (err, doc) {
            //if error, then the doc doesn't exists and it's agregated
            if (err) {
                //if doesn't existe then add
                self.dbForms.put(docHierarchy, function callback(err, result) {
                    if (!err) {

                        def.resolve(result);
                    } else {

                        def.reject("Could'not agregate the document");
                    }
                });
            }
            //if no error, then the doc exists and must be replaced if is outdated
            else {
                self.dbForms.put({
                    _rev: doc._rev,
                    _id: doc._id,
                    form: docHierarchy.form
                }, function callback(err, result) {
                    if (!err) {

                        def.resolve(result);
                    } else {
                        def.reject("Could'not updated the document");
                    }
                });
            }
        });

        return def.promise();

    },

    //Save in the db the user permitions to create cases
    saveProcessesHierarchy: function (hierarchy) {
        var self = this;

        var def = new $.Deferred();

        var docHierarchy = {
            _id: self.globalId,
            doc: hierarchy
        };

        //try to search de doc
        self.dbProcessHierarchy.get(docHierarchy._id, function (err, doc) {
            //if error, then the doc doesn't exists and it's agregated
            if (err) {
                //if doesn't existe then add
                self.dbProcessHierarchy.put(docHierarchy, function callback(err, result) {
                    if (!err) {

                        def.resolve(result);
                    } else {

                        def.reject("Could'not agregate the document");
                    }
                });
            }
            //if no error, then the doc exists and must be replaced if is outdated
            else {

                self.dbProcessHierarchy.put({
                    _id: doc._id,
                    _rev: doc._rev,
                    doc: hierarchy
                }, function callback(err, result) {

                    if (!err) {

                        def.resolve(result);
                    } else {

                        def.reject("Could'not updated the document");
                    }
                });
            }
        });

        return def.promise();
    }
});