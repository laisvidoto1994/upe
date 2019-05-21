/**
 * Unit Testing bizagi.workportal.widgets.project.plan.parent
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.project.plan.parent", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });

   it("Render Widget", function (done) {
      var params = {};
      widget = bizagi.injector.get("bizagi.workportal.widgets.project.plan.parent");
      widget.init(dependencies.workportalFacade, dependencies.dataService, params);

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });
   });

   describe("Functions:", function () {
      describe("onNotifyLoadInfoSummaryPlan", function () {
         beforeEach(function () {
            spyOn(widget, "getTemplate").and.callThrough();
            spyOn(widget.dataService, "getPlanParent").and.callFake(function(){
               return {"idCase":6601,"idWorkflow":null,"idWorkitem":11603,"idTask":null,"radNumber":"6601","displayName":"Act 3","isWorkitemClosed":false};
            });

            params = {};
            params.plan = JSON.parse('{"id":"5e9de41d-ee30-4e34-a21d-b953328d457b","name":"plan nivel 2","description":null,"currentState":"EXECUTING","parentWorkItem":"661bc335-2568-4cf8-b0c0-6a4e4ff0ff2b","creationDate":1449686725797,"startDate":1449686747046,"dueDate":null,"idUserCreator":3,"waitForCompletion":true,"activities":[],"contextualized":true,"fromDate":"hace 1 minuto","value":0,"completedActivities":0,"activitiesLength":0,"users":[],"firstParent":null}');
            widget.params = params;
         });
         it("Should call getTemplate", function () {
            widget.onNotifyLoadInfoSummaryPlan({}, params);
            expect(widget.getTemplate).toHaveBeenCalled();
         });
      });

      describe("onClickGoToParentCase", function () {
         beforeEach(function () {
            spyOn(widget, "routingExecute");
            event = {
               preventDefault: function(){}
            }
         });
         it("Should call routingExecute", function () {
            widget.onClickGoToParentCase(event);
            expect(widget.routingExecute).toHaveBeenCalled();
         });
      });
   });
});
