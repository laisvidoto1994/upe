/*
*   Name: BizAgi Database Plugin
*   Author: Ricardo Perez
*   Comments:
*   -   This script creates a plugin to handler all db functionalities
*   -   Pre-requisite pouchDB
*/

//$.Class.extend
$.Class("bizagi.workportal.services.db", {}, {
    /* 
    *   Constructor
    */
    init: function() {
        var self = this;

        var queryString = bizagi.readQueryString();
        self.disabledb = (queryString && queryString["disabledb"]) ? eval(queryString["disabledb"]) : false;

        if (!self.disabledb) {
            self.dbProcessRecent = new PouchDB("DataProcessesRecent"); // Recent process
            self.dbProcessHierarchy = new PouchDB("DataProcessesHierarchy"); // Process hierarchy to new cases creation
            self.dbForms = new PouchDB("DataRenderForms"); // To save all forms for server
            self.dbCases = new PouchDB("DataRenderCases"); // Save the data from forms            
        }

        self.globalId = (typeof BIZAGI_USER != "undefined")
            ? BIZAGI_USER.toLowerCase() + "-" + BIZAGI_PROXY_PREFIX.toLowerCase() + "-" + BIZAGI_DOMAIN.toLowerCase()
            : "admon" + "-" + "http://localhost/bizagiR100x" + "-" + "domain";
    },

    /*
    * Delete all Documents (databases)
    * Example for callback : function (err, info) { }
    * 
    */
    _destroy: function(callback) {
        var self = this;
        if (typeof callback === "undefined") {
            callback = function(err, info) {
            };
        }

        PouchDB.destroy("DataRenderForms", callback);
        PouchDB.destroy("DataRenderCases", callback);
        PouchDB.destroy("DataProcessesHierarchy", callback);
        PouchDB.destroy("DataProcessesRecent", callback);        
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
                // only add if the object is not already in the array
                if (objects.lastIndexOf(obj) == -1) {
                    objects.push(obj);
                }
            }
        }
        return objects;
    },

    /*
    *   This method return all the open cases for the user authenticated from de DB
    *   Returns a promise
    */
    getAllOpenCases: function() {
        var self = this;
        var def = new $.Deferred();

        function map(doc) {
            if (doc.closed === false && doc.createdBy.userName === "admon") {
                emit(doc, null);
            }
        }

        self.dbCases.query({ map: map }, { reduce: false }, function(err, response) {
            if (!err) {
                def.resolve(response);
            }
        });

        return def.promise();
    }
});
