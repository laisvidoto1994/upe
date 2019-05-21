/*
    Name   : Bizagi Workportal Project Activity Plan Sidebar
    Created on : Feb 09, 2016
    Author     : Jose Aranzazu
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.activity.plan.sidebar", {}, {

   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      params = params || {};
      params.supportNav = false;

      //Load templates
      self.loadTemplates({
          "project-activity-plan-sidebar": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.activity.plan.sidebar").concat("#project-activity-plan-sidebar")
      });
   },

   /**
    * Renders the template defined in the widget
    */
   renderContent: function () {
      var self = this;

      var template = self.getTemplate("project-activity-plan-sidebar");
      self.content = template.render({ hasRelatedPlan: self.params.planChild, showPlanAction: self.params.menuDashboard.showPlanOptionMenu });

      return self.content;
   },

   /**
    * links events with handlers
    */
   postRender: function () {
      var self = this;
      var $contentWidget = self.getContent();
      $(".ui-bizagi-wp-project-activity-plan-sidebar-action-add > a", $contentWidget).on("click"
         ,$.proxy(self.loadPlanForm, self));
   },

   /**
    * Events elements
    */
   loadPlanForm: function () {
       var self = this;
       $.when(bizagi.util.autoSave()).done(function () {
           $(document).data('auto-save', '');

           var showContextByMenuDashboard = self.params.planChild && (self.params.planChild.currentState === "EXECUTING" ||
               self.params.planChild.currentState === "CLOSED" || self.params.planChild.currentState === "PENDING") ? "PLANACTIVITIES" : self.params.menuDashboard.contextPlanOptionMenu;
           var getLevelNavigator = self.pub("notify", { type: "NAVIGATOR_GETLEVEL" });
           var currentLevelNavigator = parseInt(getLevelNavigator[0]);
           var nameItemNavigator = "";
           var newLevelNavigator = currentLevelNavigator;

           if (showContextByMenuDashboard === "PLANOVERVIEW" || showContextByMenuDashboard === "PLANACTIVITIES") {
               newLevelNavigator = currentLevelNavigator + 1;
               nameItemNavigator = bizagi.localization.getResource("workportal-project-casedashboard-plan");
           }

           self.params.refreshLastItemBreadcrumb = false;
           self.pub("notify", {
               type: showContextByMenuDashboard.toUpperCase(),
               args: $.extend(self.params, {
                   showContextByMenuDashboard: showContextByMenuDashboard,
                   histName: nameItemNavigator,
                   level: newLevelNavigator
               })
           });
       });
   },

    /**
     * Clean widget
     */
    clean: function(){
        var self = this;
        $(".ui-bizagi-wp-project-activity-plan-sidebar-action-add > a", self.getContent()).off("click"
            ,$.proxy(self.loadPlanForm, self));
    }
});

bizagi.injector.register('bizagi.workportal.widgets.project.activity.plan.sidebar', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.activity.plan.sidebar], true);