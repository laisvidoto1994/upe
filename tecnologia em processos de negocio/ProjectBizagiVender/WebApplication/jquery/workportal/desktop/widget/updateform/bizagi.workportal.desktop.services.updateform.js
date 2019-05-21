/**
 *   Name: Bizagi Workportal Desktop update form Services
 *   Author: Alexander Mejia
 */
bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {
    /**
     * returns a promise with the data of a start form
     */
    getEntityForm : function(data){
        var self = this;
        data = data || {};

        return $.create({
            url : self.serviceLocator.getUrl("actions-handler-getDataForm"),
            data : data
        });
    }
});