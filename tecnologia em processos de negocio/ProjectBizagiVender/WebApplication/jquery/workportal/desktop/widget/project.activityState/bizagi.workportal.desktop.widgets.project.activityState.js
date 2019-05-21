/*
 *   Name: Bizagi Workportal Desktop Project Activity State Controller
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.activityState", {}, {
   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      self.contextsSidebarActivity = params.contextsSidebarActivity;

      //Regional
      self.datePickerRegional = bizagi.localization.getResource("datePickerRegional");

      //Load templates
      self.loadTemplates({
         "project-activityState-wrapper": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.activityState").concat("#project-activityState-wrapper")
      });
   },

   /*
    * Renders the template defined in the widget
    */
   renderContent: function () {
      var self = this;
      self.content = $("<div></div>");
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
         args = params.args;
      self.params = args;
      self.getContent();

      var argsTemplate = {};
       var currentState = args.currentState || [];

      var currentWorkitem = currentState.filter(function(objectWorkItem){return objectWorkItem.idWorkItem === args.idWorkitem;})[0];

      if(currentWorkitem){
         argsTemplate.activityName = currentWorkitem.state;
         argsTemplate.activityIsEvent = bizagi.util.parseBoolean(currentWorkitem.isEvent);


         var INVARIANT_FORMAT = "MM/dd/yyyy H:mm";
         var initDateObject = bizagi.util.dateFormatter.getDateFromFormat(currentWorkitem.entryDateWorkItem, INVARIANT_FORMAT);
         if(initDateObject.getTime){
            argsTemplate.initDateFormat = self.getFormattedDate(initDateObject);
         }

         var currentDate = new Date();
         var estimatedSolutionDateObject = bizagi.util.dateFormatter.getDateFromFormat(currentWorkitem.estimatedSolutionDate, INVARIANT_FORMAT);
         argsTemplate.estimatedSolutionDateFormat = "";

         if (initDateObject.getTime && estimatedSolutionDateObject.getTime && currentWorkitem) {
            self.calculateDataForTemplate(currentWorkitem, argsTemplate, initDateObject, currentDate, estimatedSolutionDateObject);
         }
         else{
            //Update widget
            self.updateTemplateWidget(argsTemplate);
         }
      }
   },

   calculateDataForTemplate: function(currentWorkitem, argsTemplate, creationDateObject, currentDate, estimatedSolutionDateObject){
      var self = this;

      var diffMillisecondsOpened = new Date(Date.now() - creationDateObject.getTime());
      var diffMillisecondsCurrentToEstimated = (currentDate.getTime() - estimatedSolutionDateObject.getTime());
      var diffMillisecondsCreationToSolution = (creationDateObject.getTime() - estimatedSolutionDateObject.getTime());

      var paramsEffectiveDurationOpened = {
         idUser: bizagi.currentUser.idUser,
         fromDate: creationDateObject.getTime(),
         toDate: Date.now()
      };

      var currentDateExceededEstimatedDate = false;
      var paramsEffectiveDuration = {
         idUser: bizagi.currentUser.idUser,
         fromDate: currentDate.getTime(),
         toDate: estimatedSolutionDateObject.getTime()
      };
      var paramsEffectiveDurationInitialToEstimated = {};
      if (diffMillisecondsCurrentToEstimated > 0) {//Exceeded limit estimatedSolution
         paramsEffectiveDuration.fromDate = estimatedSolutionDateObject.getTime();
         paramsEffectiveDuration.toDate = currentDate.getTime();
         currentDateExceededEstimatedDate = true;
      }
      else{
         paramsEffectiveDurationInitialToEstimated.idUser = bizagi.currentUser.idUser;
         paramsEffectiveDurationInitialToEstimated.fromDate = creationDateObject.getTime();
         paramsEffectiveDurationInitialToEstimated.toDate = estimatedSolutionDateObject.getTime();
      }


      $.when(self.callGetEffectiveDuration(paramsEffectiveDurationOpened),
          self.callGetEffectiveDuration(paramsEffectiveDuration),
         self.callGetEffectiveDuration(paramsEffectiveDurationInitialToEstimated)).done(function(differenceCreatedToCurrent,
                                                                                                 differenceCurrentToEstimated,
                                                                                                 differenceInitialToEstimated){

             var relativeTime = bizagi.util.dateFormatter.getRelativeTime(new Date(Date.now() - (differenceCreatedToCurrent.minutes * (1000 * 60)) ), null, false);
            argsTemplate.colorState = currentWorkitem.colorState;
            argsTemplate.relativeTimeState = bizagi.localization.getResource("workportal-project-activity-state-opened").replace("%s", relativeTime);
            argsTemplate.percentCompleteBar = 100;

            if(diffMillisecondsCreationToSolution === 0){
               argsTemplate.showEstimatedSolutionDate = false;
            }
            else{
               argsTemplate.showEstimatedSolutionDate = true;
               if(currentDateExceededEstimatedDate === false){
                  var percentBar = self.getPercentBar(differenceInitialToEstimated.minutes, differenceCurrentToEstimated.minutes);
                  argsTemplate.percentCompleteBar = percentBar.percent;
               }
            }

            if(currentWorkitem){
               argsTemplate.isEvent = bizagi.util.parseBoolean(currentWorkitem.isEvent);
            }

            argsTemplate.estimatedSolutionDateFormat = self.getFormattedDate(estimatedSolutionDateObject);

         //Update widget
         self.updateTemplateWidget(argsTemplate);

      });
   },

   getPercentBar: function(totalMinutes, sectionMinutes){
      var response = {};
      response.percent = Math.round((1 -(sectionMinutes / totalMinutes)) * 100);
      return response;
   },


   updateTemplateWidget: function(argsTemplate){
      var self = this,
         $content = self.getContent().empty();
      //Update widget
      var contentTemplate = self.getTemplate("project-activityState-wrapper");
      contentTemplate
         .render(argsTemplate).appendTo($content);
   },

   getFormattedDate: function (dateObj) {
      var self = this;
      var monthsNames = self.datePickerRegional.monthNames;
      var shortMonth = dateObj.getMonth();
      return monthsNames[shortMonth] + " " + $.datepicker.formatDate("dd", dateObj);
   },

   clean: function () {
      var self = this;
       var cntxtSidebarActivity = self.contextsSidebarActivity || [];
      this.params = {};
       cntxtSidebarActivity.forEach(function(context){
         self.unsub(context, $.proxy(self.updateView, self));
      });
   },

   /**
    * Call services
    */
   callGetEffectiveDuration: function(params){
      var self = this;
      var d = $.Deferred();

      //Fix .NET, multiple call service with same data in a few milliseconds
      setTimeout(function(){
         if(params.fromDate){
            $.when(
               self.dataService.getEffectiveDuration(params)
            ).done(function (data) {
                  d.resolve(data);
               });
         }
         else{
            d.resolve(null);
         }
      }, 200);


      return d.promise();
   }
});

bizagi.injector.register("bizagi.workportal.widgets.project.activityState", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.activityState]);