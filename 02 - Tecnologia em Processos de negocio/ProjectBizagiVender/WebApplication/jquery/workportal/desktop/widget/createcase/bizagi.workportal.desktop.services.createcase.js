/**
 *   Name: Bizagi Workportal Desktop create process Services
 *   Author: Alexander Mejia
 *   Autoextend the facade of services to provide the services used in create process widget
 */
bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {

    /**
     * returns a promise with the data of a start form
     */
    getStartForm : function(data){
        var self = this;

        return $.create({
            url : self.serviceLocator.getUrl("actions-handler-getDataForm"),
            data : data
        });
    }
});