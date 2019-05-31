/*
 *   Name: Bizagi Workportal Desktop Project Plan Time
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.time", {}, {

   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      self.PENDING_PLAN = "PENDING";
      self.EXECUTING_PLAN = "EXECUTING";
      self.CLOSED_PLAN = "CLOSED";

      //Regional
      self.datePickerRegional = bizagi.localization.getResource("datePickerRegional");

      //Load templates
      self.loadTemplates({
         "plan-time-main": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.time").concat("#project-plan-time")
      });
   },

   renderContent: function () {
      var self = this;
      var tmpl = self.getTemplate("plan-time-main");
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

      if(self.params.plan){
         if(self.params.plan.dueDate){
            if(self.params.plan.currentState === self.PENDING_PLAN || self.params.plan.currentState === self.EXECUTING_PLAN ){
               self.updateWidget(event, params);
            }
            else{
               self.sub("LOADED_ACTIVITIES_PLAN", $.proxy(self.updateWidget, self));
            }
         }
         else{
            self.getContent().empty();
         }
      }

   },
   updateWidget: function(event, params){
      var self = this;
      self.params = $.extend(self.params, params.args);

      var $content = self.getContent().empty();
      if(self.params.plan.currentState === self.CLOSED_PLAN){
         self.getClosedDatePlan(self.params.plan);
      }
      $.when(self.getIntervalOnMinutes(self.params.plan)).done(function(response){
         var relativeTime =  bizagi.util.dateFormatter.getRelativeTime(new Date(Date.now() - (response.minutesToShowTime * 60 * 1000)), null, true);

         var messageUnitTimeCalculated = relativeTime.replace(/\d/g,"");
         var keywordResourceDescriptionDifference = self.getKeywordDifferenceDates(self.params.plan);
         var messageDescripionDifference = bizagi.localization.getResource("workportal-project-plan-state-" + keywordResourceDescriptionDifference);
         messageDescripionDifference = messageDescripionDifference.replace("%s", messageUnitTimeCalculated);

         var valueOfTimeCalculated = relativeTime.replace(/\D/g,"");

         var auxToDate = self.getSecondDate(self.params.plan);
         var auxPercentBar = self.getWidthBar(self.params.plan, response);
         var auxColorBar = self.getColorBarByPercent(auxPercentBar);
         var argsTemplate = {
            fromDate:  self.getFormattedDate(new Date(self.getFirstDate(self.params.plan))),
            toDate: auxToDate ? self.getFormattedDate(new Date(auxToDate)) : null,
            valueOfTimeCalculated: valueOfTimeCalculated,
            messageDescripionDifference: messageDescripionDifference,
            percentBar: auxPercentBar,
            colorBar: auxColorBar
         };

         var contentTemplate = self.getTemplate("plan-time-main");
         contentTemplate
            .render(argsTemplate)
            .appendTo($content);

      });
   },
   getFirstDate: function(plan){
      var self = this;
      switch(plan.currentState){
         case self.PENDING_PLAN:
            if(plan.dueDate){
               return plan.dueDate;
            }
            else{
               return plan.creationDate;
            }
            break;
         case self.EXECUTING_PLAN:
         case self.CLOSED_PLAN:
            return plan.startDate;
      }
   },
   getSecondDate: function(plan){
      var self = this;
      switch(plan.currentState){
         case self.PENDING_PLAN:
            return null;
         case self.EXECUTING_PLAN:
            return plan.dueDate;
         case self.CLOSED_PLAN:
            return plan.closedDate;
      }
   },
   getLastActivity: function(activities){
      var copyActivities = JSON.parse(JSON.stringify(activities));
      return copyActivities.sort(function(activityA, activityB){
         return (activityA.finishDate < activityB.finishDate) ? 1 : -1;
      })[0];
   },

   getClosedDatePlan: function(plan){
      var self = this;
      plan.closedDate =  self.getLastActivity(plan.activities).finishDate;
      return plan.closedDate;
   },

   getDifferenceBetweenDates: function(firstDate, secondDate){
      var self = this;
      var defer = $.Deferred();
      var params = {
         idUser: bizagi.currentUser.idUser,
         fromDate: firstDate,
         toDate: secondDate

      };
      $.when(self.callGetEffectiveDuration(params)).done(function(difference){
         defer.resolve(difference.minutes);
      });
      return defer.promise();
   },

   getIntervalOnMinutes: function(plan){
      var self = this;
      var defer = $.Deferred();
      switch(plan.currentState){
         case self.PENDING_PLAN:
            if(plan.dueDate > Date.now()){
               $.when(self.getDifferenceBetweenDates(Date.now(), plan.dueDate)).done(function(minutesNowToDueDate){
                   $.when(self.getDifferenceBetweenDates(plan.creationDate, Date.now())).done(function(minutesCreateToNow){
                       defer.resolve({minutesToShowTime: minutesNowToDueDate, minutesCreateToNow: minutesCreateToNow});
                   });
               });
            }
            else if(plan.dueDate < plan.creationDate){
               $.when(self.getDifferenceBetweenDates(plan.dueDate,  plan.creationDate)).done(function(minutesDueDateToCreate){
                   $.when(self.getDifferenceBetweenDates(plan.creationDate, Date.now())).done(function(minutesCreateToNow){
                       defer.resolve({minutesToShowTime: minutesDueDateToCreate + minutesCreateToNow, minutesCreateToNow: minutesCreateToNow});
                   });
               });
            }
            else if(plan.dueDate > plan.creationDate){
                $.when(self.getDifferenceBetweenDates(plan.creationDate, plan.dueDate)).done(function(minutesCreateToDueDate){
                    $.when(self.getDifferenceBetweenDates(plan.dueDate, Date.now())).done(function(minutesCreateToNow){
                        defer.resolve({minutesToShowTime: minutesCreateToDueDate + minutesCreateToNow, minutesCreateToNow: minutesCreateToNow});
                    });
                });
            }
            break;
         case self.EXECUTING_PLAN:
            if(plan.dueDate){
               if(plan.dueDate > Date.now()){
                  $.when(self.getDifferenceBetweenDates(Date.now(), plan.dueDate)).done(function(minutesNowToDueDate){
                      $.when(self.getDifferenceBetweenDates(plan.startDate, Date.now())).done(function(minutesStartToNow){
                          defer.resolve({minutesToShowTime: minutesNowToDueDate, minutesStartToNow: minutesStartToNow});
                      });
                  });
               }
               else{
                  $.when(self.getDifferenceBetweenDates(plan.dueDate, Date.now())).done(function(minutesDueDateToNow){
                      $.when(self.getDifferenceBetweenDates(plan.startDate, plan.dueDate)).done(function(minutesStartToDueDate){
                          defer.resolve({minutesToShowTime: minutesDueDateToNow, minutesStartToDueDate: minutesStartToDueDate});
                      });
                  });
               }

            }
            else{
               $.when(self.getDifferenceBetweenDates(plan.startDate, Date.now())).done(function(minutes){
                  defer.resolve({minutesToShowTime: minutes});
               });
            }
            break;
         case self.CLOSED_PLAN:
            $.when(self.getDifferenceBetweenDates(plan.startDate, plan.closedDate)).done(function(minutes){
               defer.resolve({minutesToShowTime: minutes});
            });

      }
      return defer.promise();
   },

   getKeywordDifferenceDates: function(plan){
      var self = this;
      switch(plan.currentState){
         case self.PENDING_PLAN:
            if(plan.dueDate > Date.now()){
               return "remaining";
            }
            else {
               return "exceeded";
            }
            break;
         case self.EXECUTING_PLAN:
            if(plan.dueDate){
               if(plan.dueDate > Date.now()){
                  return "remaining";
               }
               else{
                  return "exceeded";
               }

            }
            else{
               return "opened";
            }
            break;
         case self.CLOSED_PLAN:
            return "executed";
      }
   },

   getRelativeTime: function(milliseconds){
      return bizagi.util.dateFormatter.getRelativeTime(milliseconds, null, false);
   },

   getWidthBar: function(plan, intervalMinutes){
      var self = this,
         differenceStartDateToCurrentDate = {};
      switch(plan.currentState) {
         case self.PENDING_PLAN:
            if(plan.dueDate){
               if(plan.dueDate < Date.now()){
                  return 0;
               }
               else{
                   var totalInterval = intervalMinutes.minutesCreateToNow + intervalMinutes.minutesToShowTime;
                   valuePercentInterval = intervalMinutes.minutesToShowTime;
                   return Math.ceil(valuePercentInterval * 100 / totalInterval);
               }
            }
            else{
               return 0;
            }
            break;
         case self.EXECUTING_PLAN:
            if(plan.dueDate) {
               if (plan.dueDate > Date.now()) {
                  var totalInterval = intervalMinutes.minutesStartToNow + intervalMinutes.minutesToShowTime;
                  valuePercentInterval = intervalMinutes.minutesToShowTime;
                  return Math.ceil(valuePercentInterval * 100 / totalInterval);
               }
               else{
                  return 0;
               }
            }
            else{
               return 0;
            }
            break;
         case self.CLOSED_PLAN:
            if(plan.closedDate > Date.now()){
               var differenceStartDateToClosedDate = plan.closedDate - plan.startDate;
               differenceStartDateToCurrentDate = Date.now() - plan.startDate;
               return Math.ceil(differenceStartDateToCurrentDate * 100 / differenceStartDateToClosedDate);
            }
            else{
               return 100;
            }
      }


   },

   getColorBarByPercent: function(percent){
      if(percent < 33){
         return "Red";
      }
      else if(percent < 66){
         return "Yellow";
      }
      else {
         return "Green";
      }
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
   },

   getFormattedDate: function (dateObj) {
      var self = this;
      var monthsNames = self.datePickerRegional.monthNames;
      var shortMonth = dateObj.getMonth();
      return monthsNames[shortMonth] + " " + bizagi.util.dateFormatter.formatDate(dateObj, "dd hh:mm tt", bizagi.localization.getResource("datePickerRegional"));
   }
});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.time", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.plan.time], true);