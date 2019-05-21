/**
 *   Name: Bizagi Workportal Desktop cases template Services
 *   Author: Alexander Mejia
 *   Note: Autoextend the facade of services to provide the services used in template widget
 */
bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {
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

        if (typeof params.idworkflow !== "undefined" && params.idworkflow) {
            data.idWorkflow = params.idworkflow;
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
     * Get pending cases
     * @param params
     * @returns {*}
     */
    getPendingsData: function (params) {
        var self = this,
            url = self.serviceLocator.getUrl("process-handler-getPendingsData");
        params = params || {};
        var data = {
            page: params.page || 1,
            pagsize: params.pageSize || 10
        };

        if (typeof params.idworkflow !== "undefined" && params.idworkflow) {
            data.idWorkflow = params.idworkflow;
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
     * Get the action of an specific case
     * @param params
     * @returns {*}
     */
    getActionsData: function (params) {
        var self = this;
        params = params || {};
        var data = {
            guidEntity: params.guidEntity,
            surrogateKey: params.surrogateKey
        };

        if (typeof params.idCase !== "undefined" && params.idCase) {
            data.caseId = params.idCase;
        }
        if (typeof params.tags !== "undefined" && params.tags) {
            data.tags = params.tags;
        }

        return $.read({
            url: self.serviceLocator.getUrl("entities-handler-getActions"),
            data: data,
            batchRequest: true
        });
    },

    /**
     * Get the events of a specific case
     * @param params
     * @returns {*}
     */
    getActionsEvents: function (params) {
        var self = this;
        params = params || {};
        var data = {
            caseId: params.caseId
        };

        return $.read({
            url: self.serviceLocator.getUrl("process-handler-getActionsEvents"),
            data: data,
            batchRequest: true
        }).then(function (response) {
            var events = [];
            for (var i = 0, l = response.length; i < l; i++) {
                response[i].reference = Math.guid();
                response[i].isEvent = true;
                events.push(response);
            }
            return events;
        });
    },

    /**
     * Get the users of a specific case
     * @param params
     * @returns {*}
     */
    getUsersCases: function (params) {
        var self = this;
        params = params || {};
        var data = {
            caseId: params.caseId
        };

        return $.read({
            url: self.serviceLocator.getUrl("process-handler-getUsersCases"),
            data: data,
            batchRequest: true
        }).pipe(function(response){
            return response;
        });
    },

    /**
     * Get the data of the users involucrated in a specific case
     * @param params
     * @returns {*}
     */
    getUsersData: function (params) {
        var self = this;

        return $.read({
            url: self.serviceLocator.getUrl("project-users-get"),
            data: params || {},
            dataType: "json"
        });
    }
});