/*
 *   Name: BizAgi Database Plugin
 *   Author:oscaro
 *   Comments:
 *   -   This script creates a plugin to handler oll db functionalities
 *   -   Pre-requisite pouchDB
 */
$.Class.extend("bizagi.workportal.services.pullWorker", {}, {
    init: function (params) {
        var self = this;
        self.services = params;
        self.database = params.database;
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

    pull: function () {
        var self = this;
        //  var def = new $.Deferred();

        if (self.disabledb) {
            //   def.reject("Disable Sync");
            //  return def.promise();
            return false;
        }

        return $.when(self.syncOfflineCases()).done(function () {
            //   def.resolve("All data pull data");
            return true;
        });


        //  return def.promise();
    },


    /*
    * this function send to the server the offline cases created
    */

    syncOfflineCases: function (argument) {
        var self = this;
        // var def = new $.Deferred();
        if (typeof self.database != "undefined") {
            self.synchronizing = self.synchronizing || false;

            if (!self.synchronizing) {
                self.synchronizing = true;
                return self.database.getOutboxCases().done(function (response) {
                    var array_cases = [];
                    for (var i = 0; i < response.total_rows; i++) {
                        var obj = response.rows[i].value;
                        var objToSend = [];
                        for (var item in obj.data) {
                            if (item != "h_action") {
                                objToSend.push({
                                    "domain": typeof(BIZAGI_DOMAIN) != "undefined" ? BIZAGI_DOMAIN : "domain",
                                    "user": typeof(BIZAGI_USER) != "undefined" ? BIZAGI_USER : "admon",
                                    "xpath": item,
                                    "value": self.processDataValues(obj.data[item].value),
                                    "DataType": obj.data[item].DataType,
                                    "type": obj.data[item].type
                                });
                            }
                        }

                        obj = $.extend(obj, {
                            "objToSend": objToSend
                        });

                        bizagi.log(obj);

                        //idWfClass
                        array_cases.push(
                            self.services.syncOfflineCases(obj).pipe(
                                function (rta) {
                                    var formData = decodeURIComponent(this.data).split('&');
                                    for (var i = formData.length - 1; i >= 0; i--) {
                                        var pivot = formData[i].split("=");
                                        if (pivot[0] == "idCase") {
                                            return self.database.deleteCase({
                                                idCase: pivot[1]
                                            });
                                        }
                                    }
                                    //cuando retorne que yes elimina el caso de la base de datos

                                }, function (fail) {
                                    bizagi.log(fail);
                                }
                            )
                        );
                    }

                    return $.when.apply($, array_cases).pipe(function () {
                        //cuando retorne mostrar alerta de syncronizacion exitosa
                        self.synchronizing = false;
                        //def.resolver();
                        return true;
                    });

                });
            }
        }
        // return def.promise();
    },

    processDataValues: function(data) {

        if ($.type(data) == "object") {
            // for search
            if (data.hasOwnProperty("id")) {
                data = data.id;
            }
        }

        return data;
    }
});