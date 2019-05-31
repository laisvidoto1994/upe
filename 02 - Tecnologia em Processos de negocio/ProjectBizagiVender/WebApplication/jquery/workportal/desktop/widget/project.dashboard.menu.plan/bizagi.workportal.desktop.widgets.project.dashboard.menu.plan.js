/*
 *   Name: Bizagi Workportal project Dashboard Menu Plan
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.dashboard.menu.plan", {}, {

   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, projectDashboard, params) {
      var self = this;
      self.params = params || {};
      self.projectDashboard = projectDashboard;

      // Call base
      self._super(workportalFacade, dataService, params);

      //Load templates
      self.loadTemplates({
         "project-dashboard-menu": bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.dashboard.menu.plan").concat("#project-dashboard-menu")
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
      if(self.params && self.params.contextsLeftSidebarCaseDashboard){
         self.params.contextsLeftSidebarCaseDashboard.forEach(function(context){
            self.sub(context, $.proxy(self.updateView, self));
         });
      }

   },


   updateView: function (event, params) {
      var self = this;
      self.params = $.extend(self.params, params.args);
      self.clean();
      var $content = self.getContent().empty();

      var template = self.getTemplate("project-dashboard-menu");
      self.params.menuPlanDashboard = self.params.menuPlanDashboard || {};
      $.extend(self.params.menuPlanDashboard, self.params.menuDashboard);

      self.planState = self.getPlanState(self.params.plan, self.params.planChild);
      var argsTemplate = {
         planState: self.planState,
         showCommentsOptionMenu: self.params.menuPlanDashboard.showCommentsOptionMenu,
         showFilesOptionMenu: self.params.menuPlanDashboard.showFilesOptionMenu,
         showTimeLineOptionMenu: self.params.menuPlanDashboard.showTimeLineOptionMenu && self.isVisibleShowTimeLine(self.planState)
      };
      template.render(argsTemplate).appendTo($content);
       
      $("li[data-context='" + self.params.showContextByMenuDashboard.toUpperCase() + "']", self.content).addClass("active").siblings().removeClass("active");

      self.handlerEvents();
   },

    /**
     * Return planState by plan or planChild
     * @param plan
     * @param planChild
     * @returns {*}
     */
    getPlanState: function(plan, planChild){
        var currentState;
        if(planChild && planChild.currentState){
            currentState = planChild.currentState;
        }
        else if(plan && plan.currentState){
            currentState = plan.currentState;
        }
        return currentState;
    },

    /**
     * Behavior visible timeline option
     */
    isVisibleShowTimeLine: function(planState){
        var self = this;
        var extraValidationShowTimeLine = true;
        if(planState === "PENDING"){
            extraValidationShowTimeLine = false;
        }
        return extraValidationShowTimeLine;
    },

   /*
    *   Load Content By Id
    */
   loadContentById: function (event) {
      var self = this;
      event.preventDefault();
      var $item = $(event.target).closest("li");

      if ($item.data("context") === "PLANBACK") {
         self.backParentPlan();
      }
      else{
         if (!$item.hasClass("active")) {
            var showContextByMenuDashboard = $item.data("context");
            if (showContextByMenuDashboard) {

               self.pub("notify", {
                  type: showContextByMenuDashboard.toUpperCase(),
                  args: $.extend(self.params,{showContextByMenuDashboard: showContextByMenuDashboard})
               });
               $("li[data-context='" + self.params.showContextByMenuDashboard.toUpperCase() + "']", self.content).addClass("active").siblings().removeClass("active");
            }
         }
      }
   },

   subMenuHandler: function () {
      var self = this;
      var content = self.getContent();
      var $comments = $("[data-context='PLANCOMMENTS']", content);
      var $files = $("[data-context='PLANFILES']", content);
      var $timeline = $("[data-context='PLANTIMELINE']", content);

      $(".ui-bizagi-wp-project-tab-submenu a", content).on("click", function () {
         $comments.toggle();
         $files.toggle();
         if(self.isVisibleShowTimeLine(self.planState)){
            $timeline.toggle();
         }
      });
   },

   backParentPlan: function(){
      var self = this;
      //when a plan created from an activity is deleted, not created from a case
      var getLevelNavigator = self.pub("notify", { type: "NAVIGATOR_GETLEVEL"});
      var currentLevelNavigator = parseInt(getLevelNavigator[0]);
      var params = self.projectDashboard.getParamsByBackFromPlan(self.params, currentLevelNavigator);

      self.pub("notify", {
         type: params.typeContext,
         args: $.extend(self.params, params.paramsNotify)
      });

   },

   handlerEvents: function(){
      var self = this;
      var content = self.getContent();

      self.subMenuHandler();

      $(".ui-bizagi-wp-project-tab-links a", content).on("click",  $.proxy(self.loadContentById, self));
   },

   clean: function(){
      var self = this;
      var content = self.getContent();

      $(".ui-bizagi-wp-project-tab-links a", content).off();

      if(self.params && self.params.contextsLeftSidebarCaseDashboard){
         self.params.contextsLeftSidebarCaseDashboard.forEach(function(context){
            self.unsub(context, $.proxy(self.updateView, self));
         });
      }
   }
});

bizagi.injector.register("bizagi.workportal.widgets.project.dashboard.menu.plan", ["workportalFacade", "dataService", "bizagi.workportal.services.behaviors.projectDashboard", bizagi.workportal.widgets.project.dashboard.menu.plan], true);