/*
 *   Name: Bizagi Workportal Desktop Project Plan Activity Parent
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.parent", {}, {

   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      //Load templates
      self.loadTemplates({
         "plan-parent-main": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.parent").concat("#project-plan-activity-parent")
      });
   },

   renderContent: function () {
      var self = this;
      self.content = $("<div></div>");
      return self.content;
   },

   postRender: function () {
      var self = this;
      self.sub("LOAD_INFO_ACTIVITY_SUMMARY", $.proxy(self.onNotifyLoadInfoActivityExecution, self));
   },

   /**
    * Notifies when an event is raised
    */

   onNotifyLoadInfoActivityExecution: function (event, params) {
      var self = this;
      self.params = $.extend(self.params, params.args);
      var $content = self.getContent().empty();

         $.when(self.dataService.getPlanParent({idPlan: self.params.plan.id})).done(function (planParent) {
            self.params.plan.parent = planParent;
            if(self.params.plan.parent){
               var argsTemplate = {};
               argsTemplate.parent = {
                  idParent: self.params.plan.parent.radNumber,
                  nameParent: self.params.plan.parent.displayName,
                  idCase: self.params.plan.parent.idCase,
                  idWorkflow: self.params.plan.parent.idWorkflow,
                  idWorkItem: self.params.plan.parent.idWorkItem,
                  idTask: self.params.plan.parent.idTask
               };

               //Update widget
               var contentTemplate = self.getTemplate("plan-parent-main");
               contentTemplate
                  .render(argsTemplate)
                  .appendTo($content);

               $("#go-to-parent-case", $content).on("click", $.proxy(self.onClickGoToParentCase, self));
            }
         });


   },

   onClickGoToParentCase: function (event) {
      event.preventDefault();
      var self = this;
      self.routingExecute($(event.target).closest("#go-to-parent-case"));
   }
});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.parent", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.plan.activity.parent], true);