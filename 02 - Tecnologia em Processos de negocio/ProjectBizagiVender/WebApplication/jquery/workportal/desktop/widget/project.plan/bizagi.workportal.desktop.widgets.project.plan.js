/*
 *   Name: Bizagi Workportal Desktop Project Plan
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan", {}, {
   /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, planCreate, params) {

      var self = this;

      //Call base
      self._super(workportalFacade, dataService, params);
      self.params = $.extend(self.params, params);
      self.planCreate = planCreate;

      //Load templates
      self.loadTemplates({
         "project-plan": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.plan").concat("#project-plan-wrapper"),
         "project-plan-popup": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.plan").concat("#project-plan-popup-template")
      });
   },

   /*
    * Renders the template defined in the widget
    */
   renderContent: function () {
      var self = this;
      var templateHomePlan = self.getTemplate("project-plan");
      self.content = templateHomePlan.render({});
      return self.content;
   },

   /*
    * Post render and links events with handlers
    */
   postRender: function () {
      var self = this;
      var $contentWidget = self.getContent();
      //reference for html elements
      self.form = {
         buttonShowPopupPlanToAdd: $("#buttonShowPopupCreatePlan", $contentWidget)
      };
      self.form.buttonShowPopupPlanToAdd.on("click", $.proxy(self.onShowPopupPlan, self));
   },

   onShowPopupPlan: function(){
      var self = this;
      var contextualized = typeof self.params.plan.contextualized === "undefined" ? true : self.params.plan.contextualized;
      self.planCreate.showPopupAddPlan(self.params, self.dataService, contextualized);
      self.planCreate.unsub('planCreated');
      self.planCreate.sub('planCreated', function (ev, params) {
         var paramsNewPlan = params.paramsNewPlan;
         self.params.planChild = {};

         //Set planparent if we are on activity plan
         if(self.params.showContextByMenuDashboard.indexOf("ACTIVITYPLAN") != -1){
            self.params.planParent = {};
            self.params.planParent.id = bizagi.clone(self.params.plan.id);
            self.params.planParent.idActivitySelected = self.params.plan.idActivitySelected;
         }
         self.params.planChild = bizagi.clone(paramsNewPlan);

         self.pub("notify", {
              type: "UPDATE_LASTCRUMBPARAMS_INFO",
              args: {
                  planChild: self.params.planChild
              }
         });

         self.params.menuDashboard.contextPlanOptionMenu = "PLANACTIVITIES";

         var getLevelNavigator = self.pub("notify", { type: "NAVIGATOR_GETLEVEL"});
         var currentLevelNavigator = parseInt(getLevelNavigator[0], 10);
         var newLevelNavigator = currentLevelNavigator + 1;
         var nameItemNavigator = bizagi.localization.getResource("workportal-project-casedashboard-plan");

         self.pub("notify", {
            type: "PLANACTIVITIES",
            args: $.extend(self.params, {showContextByMenuDashboard: "PLANACTIVITIES",
               histName: nameItemNavigator,
               level: newLevelNavigator})
         });
      });
   }
});

bizagi.injector.register("bizagi.workportal.widgets.project.plan", ["workportalFacade", "dataService", "bizagi.workportal.widgets.project.plan.create", bizagi.workportal.widgets.project.plan], true);