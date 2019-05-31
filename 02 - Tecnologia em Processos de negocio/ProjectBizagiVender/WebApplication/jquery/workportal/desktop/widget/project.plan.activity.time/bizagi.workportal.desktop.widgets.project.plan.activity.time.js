/*
 *   Name: Bizagi Workportal Desktop Project Plan Activity Time
 *   Author: Elkin Fernando Siabato Cruz
 */
/***
 * TODO IMPORTANT: This widget is development with TDD, test this file when changes
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.time", {}, {

   /*
    *   Constructor
    *
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      //Constants
      self.EXECUTING_ACTIVITY = "EXECUTING";
      self.FINISHED_ACTIVITY = "FINISHED";

      //Regional
      self.datePickerRegional = bizagi.localization.getResource("datePickerRegional");

      //Load templates
      self.loadTemplates({
         "plan-time-main": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.time").concat("#project-plan-activity-time")
      });
   },

   renderContent: function () {
      var self = this;
      self.content = $("<div></div>");
      return self.content;
   },

   postRender: function () {
      var self = this;
      self.sub("LOAD_INFO_ACTIVITY_SUMMARY", $.proxy(self.onNotifyLoadInfoActivitySummary, self));
   },

   /**
    * Notifies when an event is raised
    */
   onNotifyLoadInfoActivitySummary: function(event, params){
      var self = this;
      self.params = $.extend(self.params, params.args);
      self.getContent().empty();

      var currentActivity = self.params.plan.activities.filter(function (activity) {
         return activity.id === self.params.plan.idActivitySelected;
      })[0];

      if(currentActivity.startDate){
         self.getStateActivity(currentActivity);

         var argsTemplate = {
            time: {
               fromDate: self.getFormattedDate(new Date(self.getFirstDate(currentActivity)))
            }
         };
         var dataProgressWidget = self.getDataByScenarios(currentActivity, true);

         $.when(dataProgressWidget.unitTime).done(function(auxUnitTime){
            dataProgressWidget = $.extend(dataProgressWidget, {
               unitTime: auxUnitTime
            });
            self.updateWidget($.extend(argsTemplate.time, dataProgressWidget));
         });

      }
   },
   updateWidget: function(argsTemplate){
      var self = this;
      var $content = self.getContent().empty();
      var contentTemplate = self.getTemplate("plan-time-main");

      var relativeTime = bizagi.util.dateFormatter.getRelativeTime(new Date(Date.now() - (argsTemplate.unitTime.minutes * 60 * 1000)), null, false);

      var messageDescripionDifference = bizagi.localization.getResource("workportal-project-activity-state-" + argsTemplate.keywordResource);
      argsTemplate.messageTime = messageDescripionDifference.replace("%s", relativeTime);

      contentTemplate
         .render(argsTemplate)
         .appendTo($content);

      //Begin Adjust status bar next to the number days
      var $barRemainingDate = $(".remaining-days .time-remaining", $content);
      var widthNumberDays = $(".remaining-days .days", $content).width();
      $barRemainingDate.css("padding-left", (widthNumberDays + 7).toString() + "px");

      var $barCompletedDate = $(".remaining-days .bar-completed", $content);

      $barCompletedDate.css("width", argsTemplate.percentBar + "%");
      //End Adjust status bar next to the number days

   },
   getStateActivity: function(activity){
      var self = this;
      if(activity.finishDate){
         activity.currentState = self.FINISHED_ACTIVITY;
         return self.FINISHED_ACTIVITY;
      }
      else{
         activity.currentState = self.EXECUTING_ACTIVITY;
         return self.EXECUTING_ACTIVITY;
      }
   },
   getFirstDate: function(activity){
      var self = this;
      if(activity.currentState === self.EXECUTING_ACTIVITY){
         return activity.startDate;
      } else{
         return activity.finishDate;
      }
   },
   getDataByScenarios: function(activity){
      var self = this;
      var response = {
         colorBar: null,
         percentBar: 100,
         keywordResource: null,
         unitTime: null
      };
      var params = {};
      switch(activity.currentState){
         case self.EXECUTING_ACTIVITY:
            response.keywordResource = "opened";
            response.colorBar = self.getColorByCreatedAndEstimatedDate(activity);

            params = {
               idUser: bizagi.currentUser.idUser,
               fromDate: activity.startDate,
               toDate: Date.now()
            };
            response.unitTime = self.callGetEffectiveDuration(params);

            break;
         case self.FINISHED_ACTIVITY:
            response.colorBar = "Gray";
            response.keywordResource = "closed";
            params = {
               idUser: bizagi.currentUser.idUser,
               fromDate: activity.finishDate,
               toDate: Date.now()
            };
            response.unitTime = self.callGetEffectiveDuration(params);
            break;
      }
      return response;
   },

   getColorBar: function(activity){
      var self = this;
      return self.getDataByScenarios(activity).colorBar;
   },
   getPercentBar: function(activity){
      var self = this;
      return self.getDataByScenarios(activity).percentBar;
   },
   getKeywordResourceDescriptionBar: function(activity){
      var self = this;
      return self.getDataByScenarios(activity).keywordResource;
   },
   getUnitTime: function(activity){
      var self = this;
      return self.getDataByScenarios(activity).unitTime;
   },

   getColorByCreatedAndEstimatedDate: function(activity){
      var self = this;
      var response = "Red";
      if(activity.estimatedFinishDate) {
         if (Date.now() < activity.estimatedFinishDate) {
            var theSameDay = (new Date()).getUTCDate() === (new Date(activity.estimatedFinishDate)).getUTCDate();
            if(theSameDay){
               response = "Yellow";
            }
            else{
               response = "Green";
            }
         }
      }
      return response;
   },

   getFormattedDate: function (dateObj) {
      var self = this;
      var monthsNames = self.datePickerRegional.monthNames;
      var shortMonth = dateObj.getMonth();

      return monthsNames[shortMonth] + " " + bizagi.util.dateFormatter.formatDate(dateObj, "dd hh:mm tt", bizagi.localization.getResource("datePickerRegional"));
   },

   /**
    * Call services
    */
   callGetEffectiveDuration: function(params){
      var self = this;
      var d = $.Deferred();
      $.when(
         self.dataService.getEffectiveDuration(params)
      ).done(function (data) {
            d.resolve(data);
         });
      return d.promise();
   }

});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.time", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.plan.activity.time], true);