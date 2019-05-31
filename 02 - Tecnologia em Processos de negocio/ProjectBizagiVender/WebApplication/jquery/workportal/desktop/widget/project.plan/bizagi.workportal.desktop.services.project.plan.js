/*
 *   Name: Bizagi Workportal Desktop Plan Services
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {

   /*PLAN*/
   postPlan: function (params) {
      var self = this;
      var url;
      if(params.idTemplate && params.idTemplate.length !== 0){
         url = self.serviceLocator.getUrl("project-plan-create-by-template");
         return $.create({
            url: url.replace("{idTemplate}", params.idTemplate),
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
         });
      }
      else{
         url = self.serviceLocator.getUrl("project-plan-create");
         params.idTemplate = undefined;
         return $.create({
            url: url,
            data: JSON.stringify(params),
            dataType: "json",
            contentType: "application/json"
         });
      }

   }

});