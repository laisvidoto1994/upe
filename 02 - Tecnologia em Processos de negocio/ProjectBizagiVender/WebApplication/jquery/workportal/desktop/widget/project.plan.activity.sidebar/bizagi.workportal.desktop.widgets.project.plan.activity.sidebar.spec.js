/**
 * Unit Testing bizagi.workportal.widgets.project.plan.activity.sidebar
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.project.plan.activity.sidebar", function () {
   var widget,
      workportalFacade,
      dataService,
      serviceloadDataPlan;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
      serviceloadDataPlan = bizagi.injector.get("bizagi.workportal.services.behaviors.loadDataPlan");
   });

   it("Render Widget", function (done) {
      bizagi.currentUser = {
         uploadMaxFileSize: 1000
      };
      var params = {};
      params.differenceMillisecondsServer = 1000;
      widget = new bizagi.workportal.widgets.project.plan.activity.sidebar(workportalFacade, dataService, serviceloadDataPlan, params);

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });
   });

   describe("Functions:", function () {
      beforeEach(function () {
         spyOn(widget, "pub");
      });
      describe("loadedWithDataActivities", function () {
         it("Should call pub four times", function () {
            widget.loadedWithDataActivities();
            expect(widget.pub.calls.count()).toBe(4);
         });
      });
      describe("loadedWithDataFirstParent", function () {
         it("Should call pub four times", function () {
            widget.loadedWithDataFirstParent();
            expect(widget.pub.calls.count()).toBe(1);
         });
      });
      describe("onNotifyLoadInfoPlan", function () {
         beforeEach(function () {
            spyOn(widget.serviceloadDataPlan, "subscribe");
         });
         it("Should subscribe events", function () {
            widget.params = {
               plan: {
                  id: "IDPLAN",
                  idActivitySelected: "IDACTIVITYSELECTED"
               }
            };
            widget.onNotifyLoadInfoPlan({}, {});
            expect(widget.serviceloadDataPlan.subscribe).toHaveBeenCalled();
         });
         it("Should notify disable right sidebar", function () {
            widget.params = {
               plan: {
                  id: "IDPLAN"
               },
               showContextByMenuDashboard: "ACTIVITYPLANPROCESSMAP"
            };
            widget.onNotifyLoadInfoPlan({}, {});
            expect(widget.pub.calls.count()).toBe(1);
         });
      });
      describe("clean", function () {
         beforeEach(function () {
            spyOn(widget.serviceloadDataPlan, "unsubscribe");
         });
         it("Should call unsub", function () {
            widget.clean();
            expect(widget.serviceloadDataPlan.unsubscribe).toHaveBeenCalled();
         });
      });
   });
});
