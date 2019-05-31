/*
 *   Name: Bizagi Workportal Desktop Plan Sidebar Services
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {

   /*PLAN*/
   getPlan: function (params) {

      var self = this;
      var url = self.serviceLocator.getUrl("project-plan-get");

      return $.read({
         url: url,
         data: params,
         dataType: "json",
         contentType: "application/json"
      });
   },

   getActivities: function (params) {
      var self = this;
      var url = self.serviceLocator.getUrl("project-plan-activities");

      return $.read({
         batchRequest : true,
         url: url,
         data: params,
         dataType: "json"
         //contentType: "application/json"
      }).pipe(function(response){
         return response;
      });
   },

   getWorkitemsPlan: function (params) {
      var self = this;
      var url = self.serviceLocator.getUrl("project-plan-workitems");

      return $.read({
         batchRequest : true,
         url: url,
         data: params,
         dataType: "json"
         //contentType: "application/json"
      }).pipe(function(response){
         return response;
      });
   },

   getTransitionsByPlan: function(params){
      var self = this;
      var url = self.serviceLocator.getUrl("project-plan-transitions-get");

      return $.read({
         batchRequest : true,
         url: url,
         data: params,
         dataType: "json",
         contentType: "application/json"
      }).pipe(function(response){
         return response;
      });
   }

});