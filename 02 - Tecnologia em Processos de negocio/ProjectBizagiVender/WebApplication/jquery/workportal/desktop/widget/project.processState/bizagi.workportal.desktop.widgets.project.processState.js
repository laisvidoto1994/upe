/*
 *   Name: Bizagi Workportal Desktop Project Process State Controller
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.processState", {}, {
      /*
       *   Constructor
       */
      init: function (workportalFacade, dataService, params) {
         var self = this;

         // Call base
         self._super(workportalFacade, dataService, params);

         self.contextsSidebarActivity = params.contextsSidebarActivity;

         //Load templates
         self.loadTemplates({
            "project-process-state": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.processState").concat("#project-process-state")
         });
      },

      /*
       * Renders the template defined in the widget
       */
      renderContent: function () {
         var self = this;
         var template = self.getTemplate("project-process-state");
         self.content = template.render({});
         return self.content;
      },

      /*
       * links events with handlers
       */
      postRender: function () {
         var self = this;

         //Handlers
         self.contextsSidebarActivity.forEach(function(context){
            self.sub(context, $.proxy(self.updateView, self));
         });
      },

      updateView: function (event, params) {
         var self = this,
            args = params.args,
            $content = self.getContent().empty();
         self.params = args;

         var argsTemplate = {};
         argsTemplate["showParentProcess"] = (args["idParentCase"] >= 1) ? true : false;
         argsTemplate["parentProcess"] = {
            "displayName": args["parentDisplayName"],
            "idCase": args["idParentCase"],
            "idWorkItem": args["idWorkItem"],
            "idTask": args["idTask"] == "0" ? "" : args["idTask"],
            "idWorkflow": args["idWorkflowParentCase"]
         };

         //Update widget
         var contentTemplate = self.getTemplate("project-process-state");
         contentTemplate
            .render($.extend(args, argsTemplate))
            .appendTo($content);

         //handle click

         $("#go-to-parent-case", $content).on("click", $.proxy(self.onClickGoToParentCase, self));

      },

      onClickGoToParentCase: function (event) {
         event.preventDefault();
         var self = this;

         self.routingExecute($(event.target).closest("#go-to-parent-case"));
      },

      clean: function () {
         var self = this;
         self.params = {};
         self.contextsSidebarActivity.forEach(function(context){
            self.unsub(context, $.proxy(self.updateView, self));
         });
      }
   }
);

bizagi.injector.register('bizagi.workportal.widgets.project.processState', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.processState]);