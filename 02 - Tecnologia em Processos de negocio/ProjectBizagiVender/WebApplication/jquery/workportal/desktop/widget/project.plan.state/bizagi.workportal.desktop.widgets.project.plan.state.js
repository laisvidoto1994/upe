/*
 *   Name: Bizagi Workportal Desktop Project Plan State
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.state", {}, {

   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      //Load templates
      self.loadTemplates({
         "plan-state-main": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.state").concat("#project-plan-state")
      });
   },

   renderContent: function () {
      var self = this;
      var tmpl = self.getTemplate("plan-state-main");
      self.content = tmpl.render({});
      return self.content;
   },

   postRender: function () {
      var self = this;
      self.sub("LOAD_INFO_SUMMARY_PLAN", $.proxy(self.onNotifyLoadInfoSummaryPlan, self));
   },

   /**
    * Notifies when an event is raised
    */

   onNotifyLoadInfoSummaryPlan: function (event, params) {
      var self = this;
      self.params = $.extend(self.params, params.args);

       var state = self.params.plan.currentState;

       switch (state.toUpperCase()) {
         case "PENDING":
            $(".state-pending", self.content).show().siblings().hide();
            break;
         case "EXECUTING":
            $(".state-executing", self.content).show().siblings().hide();
            break;
         case "CLOSED":
            $(".state-closed", self.content).show().siblings().hide();
            break;
      }

   }

});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.state", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.plan.state], true);