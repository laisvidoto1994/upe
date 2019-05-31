/*
*   Name: Bizagi Database Plugin
*   Author: Bizagi Mobile Team
*   Comments:
*   -   This script creates a plugin to handler all db functionalities
*   -   Pre-requisite pouchDB
*/
$.Class.extend("bizagi.workportal.services.pullWorker", {}, {
    init: function(params) {
        var self = this;
        var queryString = bizagi.readQueryString();

        self.services = params;
        self.database = params.database;

        var querydisable = (queryString && queryString["disabledb"]) ? eval(queryString["disabledb"]) : false;
        self.disabledb = querydisable;

        if (!self.disabledb) {
            self.dbForms = new PouchDB("DataRenderForms");
            self.dbCases = new PouchDB("DataRenderCases");
            self.dbProcessHierarchy = new PouchDB("DataProcessesHierarchy");
            self.dbProcessRecent = new PouchDB("DataProcessesRecent");
        }

        self.globalId = (typeof BIZAGI_USER != "undefined")
            ? BIZAGI_USER.toLowerCase() + "-" + BIZAGI_PROXY_PREFIX
            .toLowerCase() + "-" + BIZAGI_DOMAIN.toLowerCase()
            : "admon" + "-" + "http://localhost/bizagiR100x" + "-" + "domain";
    },

    pull: function() {
        var self = this;

        if (self.disabledb) {
            return false;
        }

        return $.when(self.syncOfflineCases())
            .done(function() {
                return true;
            });
    },
    
    /**
     * This function send to the server the offline cases created
     * @param {} argument 
     * @returns {} 
     */
    syncOfflineCases: function(argument) {
        var self = this;

        if (typeof (self.database) !== "undefined") {
            self.synchronizing = self.synchronizing || false;

            if (!self.synchronizing) {
                self.synchronizing = true;
                return self.database.getOutboxCases().done(function(response) {
                    var array_cases = [];
                    for (var i = 0; i < response.total_rows; i++) {
                        var obj = response.rows[i].value;
                        var objToSend = [];
                        for (var item in obj.data) {
                            if (item != "h_action") {
                                objToSend.push({
                                    "domain": typeof (BIZAGI_DOMAIN) !== "undefined" ? BIZAGI_DOMAIN : "domain",
                                    "user": typeof (BIZAGI_USER) !== "undefined" ? BIZAGI_USER : "admon",
                                    "xpath": item,
                                    "value": self.processDataValues(obj.data[item].value),
                                    "DataType": obj.data[item].DataType,
                                    "type": obj.data[item].type
                                });
                            }
                        }

                        obj = $.extend(obj, { "objToSend": objToSend });

                        // idWfClass
                        array_cases.push(
                            self.services.syncOfflineCases(obj).pipe(
                                function(rta) {
                                    var formData = decodeURIComponent(this.data).split('&');
                                    for (var i = formData.length - 1; i >= 0; i--) {
                                        var pivot = formData[i].split("=");
                                        if (pivot[0] == "idCase") {
                                            return self.database.deleteCase({
                                                idCase: pivot[1]
                                            });
                                        }
                                    }
                                    // When it returns "yes" then remove the case of database
                                }, function(fail) {
                                    bizagi.log(fail);
                                }
                            )
                        );
                    }

                    return $.when.apply($, array_cases).pipe(function() {                        
                        // Show message to successfully synchronization
                        self.synchronizing = false;                        
                        return true;
                    });
                });
            }
        }        
    },

    processDataValues: function(data) {
        if ($.type(data) == "object") {
            // For search
            if (data.hasOwnProperty("id")) {
                data = data.id;
            }
        }

        return data;
    }
});