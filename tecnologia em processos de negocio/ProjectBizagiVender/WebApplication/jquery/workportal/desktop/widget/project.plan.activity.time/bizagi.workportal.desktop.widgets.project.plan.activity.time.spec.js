/**
 * Initialize desktop.widgets.project.plan.activity.time widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.plan.activity.time", function () {
   checkWorkportalDependencies();
   var widget, activity;
   var dates = {
      january: 1421298000000,
      february: 1422939600000,
      march: 1425618000000,
      april: 1428555600000,
      may: 1431406800000,
      june: 1434344400000, //Mon Jun 15 2015 00:00:00 GMT-0500
      july: 1437195600000,
      august: 1440133200000,
      september: 1442984400000,
      octubre: 1445749200000,
      november: 1448600400000,
      december: 1451365200000,
      estimatedFinishDateFourHoursLess: 1434330000000, //Sun Jun 14 2015 20:00:00 GMT-0500
      estimatedFinishDateMoreThatTwentyFourHoursLess: 1434256000000 //Sat Jun 13 2015 23:26:40 GMT-0500
   };
   beforeEach(function(){
      bizagi.currentUser = {
         idUser: 2
      };
      spyOn(Date, "now").and.returnValue(dates.june);
   });
   it("Environment has been defined", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.project.plan.activity.time(dependencies.workportalFacade, dependencies.dataService, params);

      $.when(widget.areTemplatedLoaded())
         .done(function () {
            $.when(widget.renderContent()).done(function (html) {
               dependencies.canvas.empty();
               dependencies.canvas.append(html);

               widget.postRender();
               done();
            });
         });
   });

   it("Environment has been defined with content", function (done) {
      var contentWidget = widget.getContent();
      expect(contentWidget).not.toBe("");
      done();
   });
   describe("Functions", function () {
      describe("getPercentWithThreeDatesInOrder", function () {
         beforeEach(function () {
            spyOn(widget.dataService, "getEffectiveDuration").and.callFake(function(){
               return { minutes: 10 };
            });
         });
         it("Should call getEffectiveDuration twice", function () {
            widget.getPercentWithThreeDatesInOrder(Date.now(), Date.now(), Date.now(), 1);
            expect(widget.dataService.getEffectiveDuration.calls.count()).toBe(2);
         });
      });
   });
   describe("when initialized", function(){
      beforeEach(function(){
         bizagi.currentUser = {
            idUser: 2
         };

         spyOn(widget, "callGetEffectiveDuration");
      });
      describe("Values Calculated", function(){
         describe("State activity", function(){
            it("If finishDate is null or undefined" +
            "should be EXECUTING", function(){
               var activity ={
                  finishDate: null
               };
               var state = widget.getStateActivity(activity);
               expect(state).toBe(widget.EXECUTING_ACTIVITY);
               expect(activity.currentState).toBe(widget.EXECUTING_ACTIVITY);
            });
            it("If finishDate have value" +
            "should be FINISHED", function(){
               var activity ={
                  finishDate: dates.december
               };
               var state = widget.getStateActivity(activity);
               expect(state).toBe(widget.FINISHED_ACTIVITY);
               expect(activity.currentState).toBe(widget.FINISHED_ACTIVITY);
            });

         });

         describe("The color by percent", function(){
            it("Should be red when percent is less than 33", function(){
               expect(widget.getColorByPercent(0)).toBe("Red");
               expect(widget.getColorByPercent(33)).toBe("Red");
            });
            it("Should be yellow when percent is between 34 and 66", function(){
               expect(widget.getColorByPercent(34)).toBe("Yellow");
               expect(widget.getColorByPercent(66)).toBe("Yellow");
            });
            it("Should be green when percent is between 67 and 100", function(){
               expect(widget.getColorByPercent(67)).toBe("Green");
               expect(widget.getColorByPercent(100)).toBe("Green");
            });
         });

         describe("The color by difference between currentDate to estimatedFinishDate", function(){
            it("Should be Red when difference between dates are mayor than one day", function(){
               expect(widget.getColorByDifferenceBetweenCurrentToEstimatedFinishDate(dates.june,dates.estimatedFinishDateMoreThatTwentyFourHoursLess))
                  .toBe("Red");
            });
            it("Should be Yellow when difference between dates are minor than one day", function(){
               expect(widget.getColorByDifferenceBetweenCurrentToEstimatedFinishDate(dates.june,dates.estimatedFinishDateFourHoursLess))
                  .toBe("Yellow");
            });
         });

      });
      describe("UI", function(){
         beforeEach(function(){
            widget.params = {
               plan: {
                  activities: [
                     {
                        id: 1,
                        startDate: undefined
                     },
                     {id: 2}
                  ],
                  idActivitySelected: 1
               }
            };
         });
         describe("The general content", function() {
            describe("if activity dont have startDate", function(){
               beforeEach(function(){
                  spyOn(widget, "getDataByScenarios").and.callFake(function(){
                     return {
                        getPercentCalculatedWithServices: true,
                        unitTime: $.Deferred(function(objDef){
                           objDef.resolve();
                        }),
                        percentBar: $.Deferred(function(objDef){
                           objDef.resolve();
                        })
                     };
                  });
               });
               it("Dont show widget", function(){
                  widget.onNotifyLoadInfoActivitySummary(null, {args: {"whateverproperty": null}});
                  expect($("div", widget.getContent()).length).toBe(0);
               });

            });

            describe("the progress is calculated with services", function(){
               beforeEach(function(){
                  spyOn(widget, "getDataByScenarios").and.callFake(function(){
                     return {
                        getPercentCalculatedWithServices: true,
                        unitTime: $.Deferred(function(objDef){
                           objDef.resolve();
                        }),
                        percentBar: $.Deferred(function(objDef){
                           objDef.resolve();
                        })
                     };
                  });
                  spyOn(bizagi.util.dateFormatter, "getRelativeTime").and.callFake(function(){
                     return "This is the relative time 5";
                  });
               });
               it("When is notify so, If activity is EXECUTING or FINISHED always should show widget", function(){
                  widget.params.plan.activities[0].startDate = dates.march;
                  widget.onNotifyLoadInfoActivitySummary(null, {args: {"whateverproperty": null}});
                  expect($("div", widget.getContent()).length).toBeGreaterThan(6);
               });
            });

            describe("the progress NOT is calculated with services", function(){
               beforeEach(function(){
                  spyOn(widget, "getDataByScenarios").and.callFake(function(){
                     return {
                        getPercentCalculatedWithServices: false,
                        unitTime: $.Deferred(function(objDef){
                           objDef.resolve();
                        })
                     };
                  });
                  spyOn(bizagi.util.dateFormatter, "getRelativeTime").and.callFake(function(){
                     return "This is the relative time 5";
                  });
               });
               it("When is notify so, If activity is EXECUTING or FINISHED always should show widget", function(){
                  widget.params.plan.activities[0].startDate = dates.march;
                  widget.onNotifyLoadInfoActivitySummary(null, {args: {"whateverproperty": null}});
                  expect($("div", widget.getContent()).length).toBeGreaterThan(6);
               });
            });


         });

         describe("The first date range", function(){
            it("If activity is EXECUTING or FINISHED should be startDate", function(){
               var activity = {
                  finishDate: null,
                  currentState: widget.EXECUTING_ACTIVITY,
                  startDate: dates.february
               };
               var firstDate = widget.getFirstDate(activity);
               expect(firstDate).toBe(dates.february);
               activity = {
                  finishDate: null,
                  currentState: widget.FINISHED_ACTIVITY,
                  startDate: dates.february
               };
               firstDate = widget.getFirstDate(activity);
               expect(firstDate).toBe(dates.february);
            });
         });

         describe("The second date range", function(){
            describe("If activity is EXECUTING and not have estimatedFinishDate ", function(){
               beforeEach(function(){
                  activity = {
                     estimatedFinishDate: undefined,
                     currentState: widget.EXECUTING_ACTIVITY
                  };
               });
               it("should be currentDate", function(){
                  var secondDate = widget.getSecondDate(activity);
                  expect(secondDate).toBe(Date.now());
               });
               describe("The color bar", function(){
                  it("Should be green", function(){
                     var color = widget.getColorBar(activity);
                     expect(color).toBe("Green");
                  });
                  describe("The percent bar", function(){
                     it("Should be 100", function(){
                        var percent = widget.getPercentBar(activity);
                        expect(percent).toBe(100);
                     });
                     describe("The keyword resource state description bar", function(){
                        it("Should be opened", function(){
                           var keyword = widget.getKeywordResourceDescriptionBar(activity);
                           expect(keyword).toBe("opened");
                        });
                        describe("The unitTime is calculated with", function(){
                           it("between startDate to currentDate", function(){
                              widget.getUnitTime(activity);
                              var params = {
                                 idUser: bizagi.currentUser.idUser,
                                 fromDate: activity.startDate,
                                 toDate: Date.now()
                              };
                              expect(widget.callGetEffectiveDuration).toHaveBeenCalledWith(params);
                           });
                        });
                     });
                  });
               });
            });
            describe("If activity is EXECUTING and have estimatedFinishDate", function(){
               beforeEach(function(){
                  activity = {
                     estimatedFinishDate: dates.august,
                     currentState: widget.EXECUTING_ACTIVITY,
                     startDate: dates.may,
                     percentBar: 20
                  };
               });
               it("should be estimatedFinishDate", function(){
                  var secondDate = widget.getSecondDate(activity);
                  expect(secondDate).toBe(activity.estimatedFinishDate);
               });
               describe("The color bar", function(){
                  describe("If the estimatedFinishDate is greater than the currentDate", function(){
                     beforeEach(function(){
                        spyOn(widget, "getColorByPercent");
                        spyOn(widget, "getPercentWithThreeDatesInOrder");
                     });

                     describe("If the estimatedFinishDate and currentDate are different", function(){
                        it("should be calculated", function(){
                           widget.getColorBar(activity);
                           expect(widget.getColorByPercent).toHaveBeenCalledWith(activity.percentBar);
                        });
                     });

                     describe("The percent bar", function(){
                        it("Should be calculated with the elapsed time from startDate until currentDate VS" +
                        "currentDate until estimatedFinishDate", function(){
                           widget.getPercentBar(activity);
                           expect(widget.getPercentWithThreeDatesInOrder).toHaveBeenCalledWith(
                              activity.startDate,
                              Date.now(),
                              activity.estimatedFinishDate,
                              2
                           );
                        });

                        describe("The keyword resource state description bar", function(){
                           it("Should be left", function(){
                              var keyword = widget.getKeywordResourceDescriptionBar(activity);
                              expect(keyword).toBe("left");
                           });
                           describe("The unitTime is calculated with", function(){
                              it("between currentDate to estimatedFinishDate", function(){
                                 widget.getUnitTime(activity);
                                 var params = {
                                    idUser: bizagi.currentUser.idUser,
                                    fromDate: Date.now(),
                                    toDate: activity.estimatedFinishDate
                                 };
                                 expect(widget.callGetEffectiveDuration).toHaveBeenCalledWith(params);
                              });
                           });
                        });
                     });
                  });

                  describe("If the estimatedFinishDate is less than the currentDate", function(){
                     beforeEach(function(){
                        activity.estimatedFinishDate = dates.may;
                     });
                     describe("If the estimatedFinishDate and startDate are same", function(){
                        beforeEach(function(){
                           activity.estimatedFinishDate = dates.may;
                           activity.startDate = dates.may;
                           spyOn(widget, "getColorByDifferenceBetweenCurrentToEstimatedFinishDate");
                        });
                        it("the color bar should be calculated by difference between currentDate and estimatedFinishDate", function(){
                           widget.getColorBar(activity);
                           expect(widget.getColorByDifferenceBetweenCurrentToEstimatedFinishDate).toHaveBeenCalledWith(
                              Date.now(),
                              activity.estimatedFinishDate
                           );
                        });
                     });
                     describe("If the estimatedFinishDate and currentDate are different", function(){
                        beforeEach(function(){
                           activity.estimatedFinishDate = dates.may;
                           activity.startDate = dates.april;
                        });
                        it("should be red", function(){
                           var color = widget.getColorBar(activity);
                           expect(color).toBe("Red");
                        });
                     });

                     describe("The percent bar", function(){
                        it("Should be 100", function(){
                           var percent = widget.getPercentBar(activity);
                           expect(percent).toBe(100);
                        });
                        describe("The keyword resource state description bar", function(){
                           it("Should be delay", function(){
                              var keyword = widget.getKeywordResourceDescriptionBar(activity);
                              expect(keyword).toBe("delay");
                           });
                           describe("The unitTime is calculated with", function(){
                              it("between estimatedFinishDate to currentDate", function(){
                                 widget.getUnitTime(activity);
                                 var params = {
                                    idUser: bizagi.currentUser.idUser,
                                    fromDate: activity.estimatedFinishDate,
                                    toDate: Date.now()
                                 };
                                 expect(widget.callGetEffectiveDuration).toHaveBeenCalledWith(params);
                              });
                           });
                        });
                     });
                  });

               });
            });
            describe("If activity is FINISHED", function(){
               beforeEach(function(){
                  activity.currentState = widget.FINISHED_ACTIVITY;
                  activity.finishDate = dates.november;
               });
               it("should be finishDate", function(){
                  var secondDate = widget.getSecondDate(activity);
                  expect(secondDate).toBe(activity.finishDate);
               });
               describe("The color bar", function(){
                  it("Should be gray", function(){
                     var color = widget.getColorBar(activity);
                     expect(color).toBe("Gray");
                  });
                  describe("The percent bar", function(){
                     it("Should be 100", function(){
                        var percent = widget.getPercentBar(activity);
                        expect(percent).toBe(100);
                     });
                     describe("The keyword resource state description bar", function(){
                        it("Should be executed", function(){
                           var keyword = widget.getKeywordResourceDescriptionBar(activity);
                           expect(keyword).toBe("executed");
                        });
                        describe("The unitTime is calculated with", function(){
                           it("between startDate to finishDate", function(){
                              widget.getUnitTime(activity);
                              var params = {
                                 idUser: bizagi.currentUser.idUser,
                                 fromDate: activity.startDate,
                                 toDate: activity.finishDate
                              };
                              expect(widget.callGetEffectiveDuration).toHaveBeenCalledWith(params);
                           });
                        });
                     });
                  });
               });
            });
         });
      });
   });
});
