/*
 *   Name: Bizagi Workportal Desktop Plan State Services
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {

    /*putExecutePlan: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-execute");

        return $.create({
            url: url,
            data: params,
            contentType: "application/x-www-form-urlencoded"
        });
    },*/

    /*updatePlan: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-update");
        return $.update({
            url: url.replace("{idPlan}", params.id),
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
        });
    },

    closePlan: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-close");

        return $.create({
            url: url,
            data: params,
            contentType: "application/x-www-form-urlencoded"
        });
    },*/

    deletePlan: function (params) {

        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-delete");

        return $.destroy({
            url: url.replace("{idPlan}", params.id),
            data: params,
            contentType: "application/x-www-form-urlencoded"
        });
    },


    createTemplateByPlan: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-template-create-by-plan");

        return $.create({
            url: url,
            data: JSON.stringify(params),
            contentType: "application/json"
        });

    },

    getTemplatesByParentWorkItem: function (data) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-template-get");
        return $.read({
            url: url,
            data: data,
            dataType: "json"
        });
    }
});