﻿/**
 * Name: Bizagi Workportal Desktop sort bar Services
 * Author: Andrés Fernando Muñoz
 * Autoextend the facade of services to provide the services used in template widget
 */
bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {
    /**
     * Get multiple instance actions
     */
    getMultipleInstancesActions: function (params) {
        var self = this;
        // Define data
        var data = {
            guidEntity: params.guidEntity
        };

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("sort-bar-getMultipleInstancesActions"),
            data: data,
            type: "GET",
            dataType: "json"
        });
    },

    /**
     * Get getProcessAddButton Action
     */
    getProcessAddAction: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("action-handler-getProcessAddAction");
        var data = {
            reference: params.args.reference,
            surrogateKey: params.args.surrogateKey
        };

        return (function(reference){
            return $.read(url, data).then(function (response) {
                return $.extend(response, {referenceEntity: reference});
            });
        })(params.args.reference);
    },

    /**
     * Executes the action
     */
    executeAction: function (params) {
        var self = this;
        var data = {
            actionGuid: params.actionGuid,
            guidEntity: params.guidEntity,
            mapping: JSON.stringify(params.mapping)
        };

        // Call ajax and returns promise
        return $.ajax({
            url: self.serviceLocator.getUrl("sort-bar-execute"),
            data: data,
            type: "POST",
            dataType: "json"
        });
    }
});