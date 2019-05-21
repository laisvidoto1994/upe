/*
 *   Name: Bizagi Workportal Desktop Project Plan Progress
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.progress", {}, {

   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      //Load templates
      self.loadTemplates({
         "plan-progress-main": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.progress").concat("#project-plan-progress")
      });
   },

   renderContent: function () {
      var self = this;
      self.content = $("<div></div>");
      return self.content;
   },

   postRender: function () {
      var self = this;

      self.sub("LOAD_INFO_SUMMARY_PROGRESS_PLAN", $.proxy(self.onNotifyLoadInfoSummaryPlan, self));
   },

   /**
    * Notifies when an event is raised
    */

   onNotifyLoadInfoSummaryPlan: function (event, params) {
      var self = this;
      self.params = $.extend(self.params, params.args);

      var $content = self.getContent().empty();

      var valuePercentBarComplete = self.calculateProgress();

      var argsTemplate = {};
      argsTemplate.progress = valuePercentBarComplete;

      if(argsTemplate.progress < 33){
         argsTemplate.colorBar = "Red";
      }
      else if(argsTemplate.progress < 66){
         argsTemplate.colorBar = "Yellow";
      }
      else{
         argsTemplate.colorBar = "Green";
      }

      //Update widget
      var contentTemplate = self.getTemplate("plan-progress-main");
      contentTemplate
         .render(argsTemplate)
         .appendTo($content);

      //Begin Adjust status bar next to the number days
      var $barRemainingDate = $(".remaining-days .time-remaining", $content);
      var widthNumberDays = $(".remaining-days .days", $content).width();
      $barRemainingDate.css("padding-left", (widthNumberDays + 7).toString() + "px");
      //End Adjust status bar next to the number days


   },

   calculateProgress: function(){
      var self = this;

      var completedActivities = 0;
      var totalActivities = self.params.plan.activities.length;
      var percentProgress = 0;
      
      if(totalActivities !== 0){
         self.params.plan.activities.forEach(function(activity){
             if (activity.workItemState === "Completed") {
               completedActivities++;
            }
         });
         percentProgress = Math.round((completedActivities / totalActivities) * 100);
      }
      return percentProgress;
   }
});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.progress", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.plan.progress], true);