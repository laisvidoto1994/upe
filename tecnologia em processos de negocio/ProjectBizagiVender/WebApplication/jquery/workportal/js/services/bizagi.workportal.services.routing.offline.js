/**
 * Routing service
 *
 * @author Edward J Morales
 * @description This class has been created based on jira story DRAGON-4943
 */

bizagi.workportal.services.routing.extend("bizagi.workportal.services.routing", {}, {
    /**
    * Main method
    *
    * @param params <object> json with parameters to route
    * @return object deferred
    */
    init: function (args) {
        this._super(args);
    },


    /**
    * Define the next route to take
    * @param params object
    * @return deferred with specific path
    */
    getRoute: function (params) {
        var self = this;
        var def = new $.Deferred();

        // Params Override
        self.params = (params) ? params : self.params;

        if (typeof params.offlineAction != "undefined" && params.offlineAction == "next") {
            var defer = new $.Deferred();
            defer.resolve(self.routeToGlobalFormWithoutData());
           return defer.promise();
        }
        else {
            return self._super(params);
        }


    }
});
