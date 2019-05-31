/*
 *   Name: Bizagi Workportal Desktop Discussions Services
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {

    createPlanActivity: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("project-plan-createactivity").replace("{idPlan}", params.idPlan);

        return $.create({
            url: url,
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
        });
    },

   changeTransitions: function (params) {
      var self = this;
      var url = self.serviceLocator.getUrl("project-plan-transitions-put");

      return $.update({
         url: url.replace("{idPlan}", params.idPlan),
         data: JSON.stringify(params.transitions),
         dataType: "json",
         contentType: "application/json"
      });
   },

   putExecutePlan: function (params) {

       var self = this;
       var url = self.serviceLocator.getUrl("project-plan-execute");

       return $.create({
           url: url,
           data: params,
           contentType: "application/x-www-form-urlencoded"
       });
   },
    
   updatePlan: function (params) {
       var self = this;
       var url = self.serviceLocator.getUrl("project-plan-update");
       return $.update({
           url: url.replace("{idPlan}", params.id),
           data: JSON.stringify(params),
           dataType: "json",
           contentType: "application/json"
       });
   },

   deleteActivityPlan: function (params) {
       var self = this;
       var url = self.serviceLocator.getUrl("project-plan-activity-delete");

       return $.destroy({
           url: url,
           data: params,
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
   }

});