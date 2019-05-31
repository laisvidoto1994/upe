/*
*   Name: BizAgi Rendering Service Context Factory
*   Author: Diego Parra
*   Comments:
*   -   This script will define the endpoints to be used based on the given context
*/

$.Class.extend("bizagi.render.services.context", {}, {
    /* 
    *   Constructor
    */
    init: function (params) {
        this.context = params.context;
        this.endPoints = bizagi.render.services.getEndPoints(params);
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
    },

    setProxyPrefix: function(params){
        this.proxyPrefix = !bizagi.util.isEmpty(params.proxyPrefix) ? params.proxyPrefix : "";
        this.endPoints = bizagi.render.services.getEndPoints(params);
    }
});