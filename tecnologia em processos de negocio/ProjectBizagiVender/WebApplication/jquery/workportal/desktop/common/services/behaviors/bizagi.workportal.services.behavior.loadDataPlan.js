/**
 *   Name: Bizagi Workportal Behavior Load Data Plan
 *   Author: Elkin Fernando Siabato Cruz
 *
 *   Summary: This widget, get data all plan, and prepare data
 */
bizagi.workportal.services.behaviors = bizagi.workportal.services.behaviors || {};
bizagi.workportal.services.behaviors.loadDataPlan = function(dataService, serviceOrderActivitiesByTransitions){
   var self = this;
   self.observableElement = $({});

   self.dataService = dataService;
   self.serviceOrderActivitiesByTransitions = serviceOrderActivitiesByTransitions;

   self.loadData = function(paramsGetPlan, getDateServer, params){
      self.getDateServer = getDateServer;
      self.params = params;
      
      $.when(self.callGetPlan(paramsGetPlan)).then(function (responsePlan) {
         $.extend(self.params.plan, responsePlan, {activities: [], users: []});
         var paramsFirstParent = {idPlan: self.params.plan.id};
         $.when(self.callGetFirstParent(paramsFirstParent)).then(function (responseFirstParent) {
            self.params.plan.firstParent = responseFirstParent;
            var paramsGetActivities = {idPlan: self.params.plan.id};
            var paramsGetWorkItems = {idPlan: self.params.plan.id};
            var paramsGetTransitions = {idPlan: self.params.plan.id};
            $.when(self.dataService.getActivities(paramsGetActivities),
               self.dataService.getWorkitemsPlan(paramsGetWorkItems),
               self.dataService.getTransitionsByPlan(paramsGetTransitions)).then(
               function (responseActivities, responseWorkitems, responseTransitions) {
                  var activities = responseActivities || [];
                  self.mergePropertiesActivitiesWithWorkitems(activities, responseWorkitems);
                  self.params.plan.activities = self.calculateActivityStatus(activities);

                  activities = self.serviceOrderActivitiesByTransitions.
                      getActivitiesByTransitions(activities, responseTransitions);
                  self.params.plan.activities = activities;

                  self.publish("loadedWithDataActivities");
               });
            self.publish("loadedWithDataFirstParent");

         });//When call first parent
      });//When call get Plan
   };

   self.mergePropertiesActivitiesWithWorkitems = function(activities, workItems){
      activities.forEach(function(activity){
         var workItemFilter = workItems.filter(function(workItem){
            return workItem.guidActivity == activity.id
         });
         if(workItemFilter.length > 0){
            $.extend(activity, {
               startDate: workItemFilter[0].wiEntryDate || null,
               finishDate: workItemFilter[0].wiSolutionDate || null,
               idWorkItem: workItemFilter[0].idWorkItem,
               workItemState: workItemFilter[0].workItemState,
               idCase: workItemFilter[0].idCase,
               estimatedFinishDate: workItemFilter[0].wiEstimatedSolutionDate || activity.estimatedFinishDate
            });
         }
      });
   };

   self.calculateActivityStatus = function (activities) {
      var self = this;
      $.each(activities, function (index, activity) {
         activity.status = "nodisplay";
         if (activity.startDate && activity.estimatedFinishDate) {
            var currentDate = self.getDateServer();
            var workPeriod = activity.estimatedFinishDate - activity.startDate;
            var onTimeLimit = activity.startDate + (0.33 * workPeriod);
            var atRiskLimit = activity.startDate + (0.66 * workPeriod);
            if (currentDate < onTimeLimit) {
               activity.status = "ontime";
            }
            else if (onTimeLimit <= currentDate && currentDate < atRiskLimit) {
               activity.status = "delayed";
            }
            else if (atRiskLimit <= currentDate) {
               activity.status = "atrisk";
            }
         }
         var itemsResolved = activity.items.filter(function (item) {
            return item.resolved === true;
         });
         activity.numResolvedItems = itemsResolved.length;
         activity.numTotalItems = activity.items.length;
         if (activity.numTotalItems > 0) {
            activity.progress = Math.floor((activity.numResolvedItems / activity.numTotalItems) * 100);
         }
      });
      return activities;
   };

   /**
    * Call services
    */

   self.callGetPlan = function(params){
      var self = this;
      var defer = $.Deferred();
      self.dataService.getPlan(params).always(function (response) {
         if (response.status === 200 || response.status === 201 || response.status === undefined) {
            defer.resolve(response);
         }
         else {
            defer.reject();
         }
      });

      return defer.promise();
   };

   self.callGetFirstParent = function(params){
      var self = this;
      var defer = $.Deferred();
      self.dataService.getFirstParent(params).done(function(response){
         defer.resolve(response);
      });
      return defer.promise();
   };

   /**
    * Messaging events
    */
   self.subscribe = function () {
      self.observableElement.on.apply(self.observableElement, arguments);
   };
   self.unsubscribe = function () {
      self.observableElement.off.apply(self.observableElement, arguments);
   };
   self.publish = function () {
      return self.observableElement.triggerHandler.apply(self.observableElement, arguments);
   };

   return self;
};

bizagi.injector.register("bizagi.workportal.services.behaviors.loadDataPlan", ["dataService", "bizagi.workportal.services.behaviors.orderActivitiesByTransitions", bizagi.workportal.services.behaviors.loadDataPlan], true);