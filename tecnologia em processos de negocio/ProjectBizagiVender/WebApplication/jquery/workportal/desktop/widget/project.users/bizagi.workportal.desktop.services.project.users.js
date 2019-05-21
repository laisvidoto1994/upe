/*
 *   Name: Bizagi Workportal Desktop Users Services
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.services.service.extend("bizagi.workportal.services.service", {}, {
   getCaseAssignees: function (params) {
      var self = this;

      params = params || {};

      // Required params: idCase
      return $.read(
         self.serviceLocator.getUrl("case-handler-getCaseAssignees"), {
            idCase: params.idCase
         }
      )
         .pipe(function (response) {
            return response;
         });
   }
});