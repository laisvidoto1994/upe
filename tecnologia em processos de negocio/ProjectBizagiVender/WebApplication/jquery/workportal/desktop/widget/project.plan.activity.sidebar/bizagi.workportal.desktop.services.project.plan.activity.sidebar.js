/*
 *   Name: Bizagi Workportal Desktop Plan Activity Sidebar Services
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {

   /*PLAN*/
   getActivity: function (params) {
      var self = this;
      var url = self.serviceLocator.getUrl("project-plan-activity-get");

      return $.read({
         url: url,
         data: params,
         dataType: "json",
         contentType: "application/json"
      });
   }

});