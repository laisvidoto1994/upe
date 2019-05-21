/*
 *   Name: Bizagi Workportal Desktop Project Dashboard Services
 *   Author: Elkin Fernando Siabato Cruz
 */

/*
 *
 */
bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {
    getDateServer: function () {
        var self = this;

        var urlRestService = self.serviceLocator.getUrl("project-util-current-time");

        return $.read({
            url: urlRestService,
            dataType: "json",
            contentType: "application/json"
        });
    },

    getUsersData: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-users-get");
        return $.read({
            url: url,
            data: data,
            dataType: "json"
        });
    },


    editActivityPlan: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-activity-edit").replace("{idPlan}", params.idPlan).replace("{id}", params.id);
        return $.update({
            url: url,
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
        });
    },

    getPlanByParent: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-get-by-parent");
        var def = $.Deferred();
        $.when($.read({
            url: url,
            data: data,
            dataType: "json",
            contentType: "application/json"
        })).done(function (response) {
            def.resolve(response);
        });


        return def.promise();

    },

    getEffectiveDuration: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("time-schemas-effectiveduration");

        return $.read({
            url: url,
            data: data,
            dataType: "json",
            contentType: "application/json"
        });
    },

    getEndHourWorkingByDate: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("time-schemas-end-hour-working-by-date");

        return $.read({
            url: url,
            data: data,
            dataType: "json",
            contentType: "application/json"
        });
    },

    getItemsByActivity: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-activity-tasks-get");
        return $.read({
            url: url,
            data: params,
            dataType: "json",
            contentType: "application/json"
        });
    }

});