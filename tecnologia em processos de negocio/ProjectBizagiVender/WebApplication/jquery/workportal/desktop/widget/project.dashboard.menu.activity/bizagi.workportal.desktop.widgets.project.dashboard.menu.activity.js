/*
 *   Name: Bizagi Workportal project Dashboard Menu Activity
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.dashboard.menu.activity", {}, {

   /**
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;
      self.params = params || {};

      // Call base
      self._super(workportalFacade, dataService, params);

      //Load templates
      self.loadTemplates({
         "project-dashboard-menu": bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.dashboard.menu.activity").concat("#project-dashboard-menu1")
      });
   },

   /**
    * Renders the template defined in the widget
    */
   renderContent: function () {
      var self = this;
      self.content = $("<div></div>");
      return self.content;
   },

   /**
    * links events with handlers
    */
   postRender: function () {
      var self = this;
      //Handlers
      self.params.contextsLeftSidebarCaseDashboard.forEach(function(context){
         self.sub(context, $.proxy(self.updateView, self));
      });
   },

   /**
    * Update view
    * @param event
    * @param params
    */
   updateView: function (event, params) {
      var self = this;
      self.params = $.extend(self.params, params.args);
      self.params.plan.idActivitySelected = undefined;
      self.clean();
      var $content = self.getContent().empty();

      if(typeof event.type !== "undefined"){
         self.params.showContextByMenuDashboard = event.type;
      }

      var argsTemplate = {
         showFormOverview: self.params.menuDashboard.showFormOverview,
         showFormActivity: self.params.menuDashboard.showFormActivity,
         showCommentsOptionMenu: self.params.menuDashboard.showCommentsOptionMenu,
         showFilesOptionMenu: self.params.menuDashboard.showFilesOptionMenu,
         showTimeLineOptionMenu: self.params.menuDashboard.showTimeLineOptionMenu,
         showPlanOptionMenu: self.params.menuDashboard.showPlanOptionMenu,
         contextPlanOptionMenu: self.params.menuDashboard.contextPlanOptionMenu,
         contextFormActivityOptionMenu: self.params.menuDashboard.contextFormActivityOptionMenu
      };

      //Update widget
      var template = self.getTemplate("project-dashboard-menu");
      template.render(argsTemplate).appendTo($content);

      if(self.params.showContextByMenuDashboard){
         $("li[data-context='" + self.params.showContextByMenuDashboard.toUpperCase() + "']", self.content).addClass("active").siblings().removeClass("active");
      }

      self.handlerEvents();
   },

   /**
    *   Load Content By Id
    */
   loadContentById: function (event) {
      var self = this;
      event.preventDefault();
      var $item = $(event.target).closest("li");

      if (!$item.hasClass("active")) {

         var showContextByMenuDashboard = $item.data("context");

         if (showContextByMenuDashboard) {
            $.when(bizagi.util.autoSave()).done(function () {
               $(document).data('auto-save', '');

               var getLevelNavigator = self.pub("notify", { type: "NAVIGATOR_GETLEVEL"});
               var currentLevelNavigator = parseInt(getLevelNavigator[0]);
               var nameItemNavigator = "";
               var newLevelNavigator = currentLevelNavigator;

               if(showContextByMenuDashboard == "PLANACTIVITIES"){
                  newLevelNavigator = currentLevelNavigator + 1;
                  nameItemNavigator = bizagi.localization.getResource("workportal-project-casedashboard-plan");
               }

               self.params.refreshLastItemBreadcrumb = false;
               self.pub("notify", {
                  type: showContextByMenuDashboard.toUpperCase(),
                  args: $.extend(self.params,{showContextByMenuDashboard: showContextByMenuDashboard,
                     histName: nameItemNavigator,
                     level: newLevelNavigator})
               });
               $("li[data-context='" + self.params.showContextByMenuDashboard.toUpperCase() + "']", self.content).addClass("active").siblings().removeClass("active");
            });
         }
      }
   },

   subMenuHandler: function () {
       var self = this;
       var content = self.getContent();
       var $comments = $("[data-context='COMMENTS']", content);
       var $files = $("[data-context='FILES']", content);
       var $timeline = $("[data-context='TIMELINE']", content);

       $(".ui-bizagi-wp-project-tab-submenu a", content).on("click", function () {
           $comments.toggle();
           $files.toggle();
           $timeline.toggle();
       });
   },

   /**
    * Handler events
    */
   handlerEvents: function(){
      var self = this;
      var content = self.getContent();

      self.subMenuHandler();

      $(".ui-bizagi-wp-project-tab-links a", content).on("click",  $.proxy(self.loadContentById, self));

       // Bind for click event on refresh botton
       $(".ui-bizagi-wp-project-tab-links li .ui-bizagi-refresh-form", content).on("click", function () {
           var options = {
               action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
               idCase: self.params.idCase,
               idTask: self.params.idTask,
               idWorkflow: self.params.idWorkflow,
               idWorkItem: self.params.idWorkitem,
               referrer: self.params.referrer || "inboxGrid"
           };
           self.publish("executeAction", options);
       });
   },

   /**
    * Clean widgets and events
    */
   clean: function(){
      var self = this;
      var content = self.getContent();

      if(self.params && self.params.contextsLeftSidebarCaseDashboard){
         self.params.contextsLeftSidebarCaseDashboard.forEach(function(context){
            self.unsub(context, $.proxy(self.updateView, self));
         });
      }

      $(".ui-bizagi-wp-project-tab-links a", content).off();
      $(".ui-bizagi-wp-project-tab-links li .ui-bizagi-refresh-form", content).off();
   }
});

bizagi.injector.register("bizagi.workportal.widgets.project.dashboard.menu.activity", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.dashboard.menu.activity], true);