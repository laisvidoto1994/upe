﻿/*
 *   Name: Bizagi Workportal Desktop PLans Services
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {

    /**
     * Get current time server
     * @returns {*}
     */
    getCurrentTimeDateServer: function () {
        var self = this;
        var urlRestService = self.serviceLocator.getUrl("project-util-current-time");
        return $.read({
            url: urlRestService,
            dataType: "json",
            contentType: "application/json"
        });
    },

    /*DISCUSSION*/
    getUserPlans: function (data) {
        var self = this,
            url = self.serviceLocator.getUrl("plans");
        return $.read({
            url: url + "?" + jQuery.param(data),
            dataType: "json"
        });
    },

    getPlanParent: function (data) {
        var self = this,
            url = self.serviceLocator.getUrl("project-plan-parent");
        return $.read({
            url: url,
            data: data,
            dataType: "json"
        });
    },

    getFirstParent: function (data) {
        var self = this,
           url = self.serviceLocator.getUrl("project-plan-first-parent");
        var defer = $.Deferred();
        $.when($.read({
            url: url,
            data: data,
            dataType: "json"
        })).done(function(response){
            defer.resolve(response);
        }).fail(function(){
            defer.resolve(null);
        });
        return defer.promise();
    },

    getCaseByPlan: function (data) {
        var self = this,
            url = self.serviceLocator.getUrl("project-plan-get-case");
        return $.read({
            url: url,
            data: data,
            dataType: "json"
        });
    },


    getFirstParentPlan: function (data) {
        var self = this,
           url = self.serviceLocator.getUrl("project-plan-first-parent-plan");
        var defer = $.Deferred();
        $.when($.read({
            url: url,
            data: data,
            dataType: "json"
        })).done(function(response){
            defer.resolve(response);
        }).fail(function(){
            defer.resolve(null);
        });
        return defer.promise();
    }
});