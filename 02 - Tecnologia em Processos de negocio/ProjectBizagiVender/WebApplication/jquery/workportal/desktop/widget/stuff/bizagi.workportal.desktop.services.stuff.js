/**
 * Bizagi Workportal Desktop Dashboard Services
 * @author Mauricio Sánchez - Alexander Mejia
 */
bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {
    /**
     * Return an array with the collections related to stakeholder entities
     * @return {*}
     */
    getUserStuff: function (params) {
        var self = this,
            data = {},
            url = self.serviceLocator.getUrl("stuff-handler-getUserStuff");

        if (params && params.icon && typeof params.icon !== "undefined") {
            data.icon = true;
        }

        // Call ajax and returns promise
        return $.read(url, data);
    }
});