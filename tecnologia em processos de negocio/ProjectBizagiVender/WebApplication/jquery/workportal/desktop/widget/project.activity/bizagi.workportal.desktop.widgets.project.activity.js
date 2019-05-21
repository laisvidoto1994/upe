/*
 *   Name: Bizagi Workportal Desktop Project Activity Controller
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.activity", {}, {
   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {

      var self = this;

      //Call base
      self._super(workportalFacade, dataService, params);

      //Load templates
      self.loadTemplates({
         "project-activity": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.activity").concat("#project-activity-wrapper")
      });

   },

   /*
    * Renders the template defined in the widget
    */
   renderContent: function () {
      var self = this;
      var templateHomeActivity = self.getTemplate("project-activity");
      self.content = templateHomeActivity.render({});
      return self.content;
   },

   /*
    * Post render and links events with handlers
    */
   postRender: function () {

      var self = this;
      self.renderForm({
         idCase: self.params.idCase,
         idWorkitem: self.params.idWorkitem,
         idTask: self.params.idTask,
         radNumber: self.params.radNumber,
         withOutGlobalForm: self.params.withOutGlobalForm || false,
         isClosed: self.params.isClosed,
         belongCurrentUser: self.params.belongCurrentUser,
         hasGlobalForm: bizagi.util.parseBoolean(self.params.hasGlobalForm),
         showForm: bizagi.util.parseBoolean(self.params.showForm),
         isOfflineForm: self.params.isOfflineForm || false,
         messageForm: self.params.messageForm || ""
      });

   },

   renderForm: function(params){

      var self = this, resultRender;
      var renderContainer = self.getContent();

      var runningAndAssignToOtherUser = (!params.isClosed && !params.belongCurrentUser);
      if(runningAndAssignToOtherUser){
         runningAndAssignToOtherUser = true;
         if(!params.hasGlobalForm){
            params.withOutGlobalForm = true;
         }
         else {
            params.withOutGlobalForm = false;
         }
      }

      if (!params.withOutGlobalForm) {
         // it has't activities and global form
         var proxyPrefix = (typeof (self.dataService.serviceLocator.proxyPrefix) != undefined) ? self.dataService.serviceLocator.proxyPrefix : "";
         var database = (typeof (self.dataService.database) != undefined) ? self.dataService.database : "";


         // Load render page
         var rendering = self.rendering = new bizagi.rendering.facade({ "proxyPrefix": proxyPrefix, "database": database });
         // Executes rendering into render container
         bizagi.util.setContext(params);

         self.rendering.subscribe("onLoadDataItemsFromFormActivityPlan", function (event, params) {
            self.pub("notify", {
               type: "UPDATE_ITEMS_FROM_FORMRENDER",
               args: params
            });
         });


         var resultRender = rendering.execute($.extend(params, {
            canvas: renderContainer,
            menu: self.menu
         }));

         // Attach handler to render container to subscribe for routing events
         renderContainer.bind("routing", function (context, triggerparams) {
            // Executes routing action

            var params = {
               action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
               idCase: self.params.idCase,
               fromTask: self.params.fromTask || self.params.idTask,
               fromWorkItemId: self.params.fromWorkItemId || self.params.idWorkitem,
               isOfflineForm: self.params.isOfflineForm,
               formsRenderVersion: self.params.formsRenderVersion,
               onClose: function () {
                  // If the user closes the dialog we need to redirect to inbox widget
                  self.publish("changeWidget", {
                     widgetName: bizagi.cookie("bizagiDefaultWidget")
                  });
               }
            };
            params = $.extend(params, triggerparams);
            self.publish("executeAction", params);
         });
      }
      else {
         var errorTemplate = self.workportalFacade.getTemplate("info-message");
         var message = (params.messageForm !== "") ? params.messageForm : self.resources.getResource("render-without-globalform");

         if (typeof self.params != "undefined" && typeof self.params.isOfflineForm !== "undefined" && self.params.isOfflineForm == true) {
            message = self.resources.getResource("render-without-globalform-offline");
         }

         var errorHtml = $.tmpl(errorTemplate, {
            message: message
         });
         // Remove loading icon from summary container
         errorHtml.appendTo(renderContainer);

         resultRender = $.Deferred();
         resultRender.fail();

      }
      // Keep reference to rendering facade
      self.renderingFacade = rendering;

      // Resize layout
      self.resizeLayout();
   },

   clean: function(){

   }
});

bizagi.injector.register('bizagi.workportal.widgets.project.activity', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.activity], true);