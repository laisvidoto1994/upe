/**
 *   Name: Bizagi Workportal Behavior Order Activities by Transitions
 *   Author: Elkin Fernando Siabato Cruz
 *
 *   Summary: This widget, order by transitions the activities
 */
bizagi.workportal.services.behaviors = bizagi.workportal.services.behaviors || {};
bizagi.workportal.services.behaviors.orderActivitiesByTransitions = function(){
   var self = this;

   self.tools = {
      getObjectTransition: function(activityGuidFrom, activityGuidTo){
         return {idActivityFrom: activityGuidFrom, idActivityTo: activityGuidTo};
      },
      permuteArray: function(arrayValues){
         var that = this;
         var permArr = [];
         var i, j;
         for (i = 0, length = arrayValues.length; i < length; i++) {
            for (j = 0; j < length; j++) {
               if(arrayValues[i] != arrayValues[j]){
                  permArr.push(that.getObjectTransition(arrayValues[i], arrayValues[j]));
               }
            }
         }
         return permArr;
      },
      getTransitionsBeforeGroup: function(valueBefore, arrayValuesParallels){
         var that = this;
         var transitions = [];
         arrayValuesParallels.forEach(function(valueParallel){
            transitions.push(that.getObjectTransition(valueBefore, valueParallel));
         });
         return transitions;
      },
      getTransitionsAfterGroup: function(valueAfter, arrayValuesParallels){
         var that = this;
         var transitions = [];
         arrayValuesParallels.forEach(function(valueParallel){
            transitions.push(that.getObjectTransition(valueParallel, valueAfter));
         });
         return transitions;
      },

      arrayUnique: function (array) {
         var a = array.concat();
         for(var i=0; i<a.length; ++i) {
            for(var j=i+1; j<a.length; ++j) {
               if(a[i] === a[j])
                  a.splice(j--, 1);
            }
         }
         return a;
      }
   };

   self.getTransitionsOnGroup = function(valueBeforeGroup, arrayValuesToPermute, valueAfterGroup){
      var self = this;
      var transitionsGroup = [];

      if(valueBeforeGroup && valueAfterGroup){
         transitionsGroup = transitionsGroup.concat.apply([], [
             transitionsGroup,
             self.tools.getTransitionsBeforeGroup(valueBeforeGroup, arrayValuesToPermute),
             //self.permuteArray(arrayValuesToPermute),
             self.tools.getTransitionsAfterGroup(valueAfterGroup, arrayValuesToPermute)
         ]);
      }
      else if(valueBeforeGroup){
         transitionsGroup = transitionsGroup.concat.apply([], [
            transitionsGroup,
            self.tools.getTransitionsBeforeGroup(valueBeforeGroup, arrayValuesToPermute)
             //self.permuteArray(arrayValuesToPermute)
         ]);
      }
      else if(valueAfterGroup){
         transitionsGroup = transitionsGroup.concat.apply([], [
            transitionsGroup,
             //self.permuteArray(arrayValuesToPermute),
             self.tools.getTransitionsAfterGroup(valueAfterGroup, arrayValuesToPermute)
         ]);
      }
      else{
         //return self.permute(arrayValuesToPermute);
         return [];
      }
      return transitionsGroup;
   };

   self.getActualTransitionsByActivities = function(activities){
      var transitions = [];
      var auxArrayValuesToPermute = [];
      var guidActivityBeforeParallels = null;
      for(var iActivity = 0; iActivity < activities.length; iActivity += 1){
         if(activities[iActivity].parallel){//the activity is parallel
            auxArrayValuesToPermute.push(activities[iActivity].id);
            if(iActivity < activities.length - 1 && !activities[iActivity + 1].parallel){
               if(auxArrayValuesToPermute.length > 1) {
                  if(transitions.length > 0){
                     transitions.splice(-1,1); /*delete last item of array*/
                  }
                  //guidActivityBeforeParallels = guidActivityBeforeParallels || activities[iActivity].id;//no creo

                  transitions = transitions.concat.apply([], [
                      transitions,
                      self.getTransitionsOnGroup(guidActivityBeforeParallels,auxArrayValuesToPermute,activities[iActivity + 1].id)
                   ]);
               }
               else {
                  transitions = transitions.concat.apply([], [
                     transitions,
                     [self.tools.getObjectTransition(activities[iActivity].id, activities[iActivity + 1].id)]
                  ]);
               }
               auxArrayValuesToPermute = [];
            }
            else{
               if(iActivity === activities.length - 1){//the last item
                  if(activities[iActivity].parallel){
                     if(transitions.length > 0){
                        transitions.splice(-1,1); /*delete last item of array*/
                     }
                     transitions.push.apply(transitions,
                         self.getTransitionsOnGroup(guidActivityBeforeParallels,auxArrayValuesToPermute,null)
                     );
                  }
               }
            }
         }
         else{//is activity is sync
            if(typeof activities[iActivity + 1] === "undefined"){
               break;
            }
            if(activities[iActivity + 1].parallel){
               guidActivityBeforeParallels = activities[iActivity].id;
               transitions.push.apply(transitions,
                   [self.tools.getObjectTransition(activities[iActivity].id, activities[iActivity + 1].id)]);
            }
            else if(typeof activities[iActivity + 1] !== "undefined"){
               transitions.push.apply(transitions,
                   [self.tools.getObjectTransition(activities[iActivity].id, activities[iActivity + 1].id)]);
            }
         }

         if(iActivity === activities.length - 2 && !activities[iActivity + 1].parallel){
            break;
         }

      }
      return transitions;
   };

   /**
    * Logic algorithm order
    *
    */
   self.getActivitiesByTransitions = function (activities, transitions) {
      var self = this;
      var resultOrderActivities = [];

      if(transitions.length === 0){
         resultOrderActivities = activities;
         if(activities.length > 1){
            activities.filter(function (activity) {
               activity.parallel = true;
            });
         }
      }
      else{
         var result = self.getOrderActivitiesByTransitions(transitions, activities);
         activityGuidsInOrder = result.activitiesInOrder;
         parallelActivitiesHash = result.parallelActivitiesHash;

         if(activityGuidsInOrder.length === 0){
            return activities;
         }

         for (var iAct = 0, totaliAct = activityGuidsInOrder.length; iAct < totaliAct; iAct += 1) {
            resultOrderActivities = resultOrderActivities.concat(
                activities.filter(function (activity) {
                   if(activity.id == activityGuidsInOrder[iAct]){
                      if(parallelActivitiesHash[activity.id]){
                         activity.parallel = true;
                      }
                   }
                   return activity.id == activityGuidsInOrder[iAct];
                })
            );
         }
      }
      return resultOrderActivities;
   };

   self.getOrderActivitiesByTransitions = function(transitions, activities){
      var self = this;

      var hashGuidsParallelActivities = {};

      var arrayFrom = transitions.map(function(transition){return transition.idActivityFrom;});
      var arrayTo = transitions.map(function(transition){return transition.idActivityTo;});
      var headListLinked = [];
      for (var iActivity = 0; iActivity < arrayFrom.length; iActivity += 1) {
         if (arrayTo.indexOf(arrayFrom[iActivity]) === -1) {
            headListLinked = self.tools.arrayUnique(headListLinked.concat([arrayFrom[iActivity]]));
         }
      }
      if(headListLinked.length === 0 && activities.length === 1){
         return {
            activitiesInOrder: [activities[0].id],
            parallelActivitiesHash: []
         }
      }
      else if(headListLinked.length > 1){
         headListLinked.forEach(function(parallelActivity){
            hashGuidsParallelActivities[parallelActivity] = true;
         });
      }

      var totalActivityInOrder = [];

      orderActivitiesRecursiveBySteps(headListLinked);

      function orderActivitiesRecursiveBySteps(idsFrom){
         var idsFromActivities = [];
         var idsToActivities = [];
         var transitionsFound = false;
         idsFrom.forEach(function(idFrom){
            var auxTransitions = self.getTransitionsByFrom(transitions, idFrom);
            var totalTransitions = auxTransitions.length;
            if(totalTransitions > 0){
               transitionsFound = true;
               auxTransitions.forEach(function(trans){
                  idsFromActivities.push(trans.idActivityFrom);
                  idsToActivities.push(trans.idActivityTo);
               });

               /**
                * Determinate parallels activities
                */
               if(totalTransitions > 1){
                  idsToActivities.forEach(function(parallelActivity){
                     hashGuidsParallelActivities[parallelActivity] = true;
                  });
               }
            }
         });
         if(transitionsFound){
            /**
             * order activities
             * */
            var activitiesInOrderByStep = self.tools.arrayUnique(idsFromActivities.concat(idsToActivities));
            totalActivityInOrder = self.tools.arrayUnique(totalActivityInOrder.concat(activitiesInOrderByStep));
            orderActivitiesRecursiveBySteps(idsToActivities);
         }
         else{
            return;
         }
      }
      return {
         activitiesInOrder: totalActivityInOrder,
         parallelActivitiesHash: hashGuidsParallelActivities
      }

   };

   self.getTransitionsByFrom = function(transitions, fromId){
      return transitions.filter(function(transition){
         return transition.idActivityFrom === fromId;
      });
   };

   self.movePositionActivity = function(activities, oldIndex, newIndex){
      activities.move(oldIndex, newIndex);
      return activities;
   };

   return self;
};

bizagi.injector.register("bizagi.workportal.services.behaviors.orderActivitiesByTransitions", [bizagi.workportal.services.behaviors.orderActivitiesByTransitions], true);
