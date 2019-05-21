/*
*   Name: BizAgi Reporting Service Context Factory
*   Author: Diego Parra
*   Comments:
*   -   This script will define the endpoints to be used based on the given context
*/

$.Class.extend("bizagi.reporting.services.context", {}, {
    /* 
    *   Constructor
    */
    init: function (params) {
        this.endPoints = bizagi.reporting.services.getEndPoints(params);
        this.proxyPrefix = !bizagi.util.isEmpty(params.proxyPrefix) ? params.proxyPrefix : "";
    },

    /*
    *   Returns the given url for a specified service
    */
    getUrl: function (service) {
        if (this.endPoints[service] == null) {
            alert("No endpoint defined for: " + service);
        }
        return this.endPoints[service];
    }
});