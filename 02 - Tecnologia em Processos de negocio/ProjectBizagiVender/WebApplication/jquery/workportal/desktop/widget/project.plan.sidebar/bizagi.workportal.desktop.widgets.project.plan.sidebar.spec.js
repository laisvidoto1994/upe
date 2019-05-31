/**
 * Unit Testing bizagi.workportal.widgets.project.plan.sidebar
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.project.plan.sidebar", function () {
   var widget,
      workportalFacade,
      dataService,
      loadDataPlan;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
      loadDataPlan = bizagi.injector.get("bizagi.workportal.services.behaviors.loadDataPlan");
   });

   it("Render Widget", function (done) {
      bizagi.currentUser = bizagi.currentUser || {};
      bizagi.currentUser.uploadMaxFileSize = 1000;
      widget = new bizagi.workportal.widgets.project.plan.sidebar(workportalFacade,
         dataService, loadDataPlan, {differenceMillisecondsServer: 123});

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });

   });

   describe("Functions:", function () {
      describe("loadedWithDataActivities", function () {
         beforeEach(function () {
            spyOn(widget, "pub");
         });
         it("Should call method pub four times", function () {
            widget.loadedWithDataActivities();
            expect(widget.pub).toHaveBeenCalled();
            expect(widget.pub.calls.count()).toBe(4);
         });
      });

      describe("loadedWithDataFirstParent", function () {
         beforeEach(function () {
            spyOn(widget, "pub");
         });
         it("Should call method pub one time", function () {
            widget.loadedWithDataFirstParent();
            expect(widget.pub).toHaveBeenCalled();
            expect(widget.pub.calls.count()).toBe(1);
         });
      });

      describe("renderContent", function () {
         beforeEach(function () {
            spyOn(widget, "areTemplatedLoaded").and.callFake(function(){
               var defer = $.Deferred(); defer.resolve(); return defer.promise();
            });
         });
         it("Should attach events", function () {
            widget.params.plan = JSON.parse('{"id":"a29463c5-7e66-45a2-8b01-0b7002478a09","name":"Nuevo plan","description":null,"currentState":"EXECUTING","parentWorkItem":"7236b8af-98ec-4d06-a5bd-b22950a904ba","creationDate":1449063509570,"startDate":1449063607707,"dueDate":"(see object with key description)","idUserCreator":207,"waitForCompletion":true,"activities":[{"id":"757d7005-e696-4a67-bb76-c303ce8a6476","name":"Una actividad","description":"(see object with key description)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":1449063607657,"estimatedFinishDate":1449063607657,"items":[],"idWorkItem":11354,"workItemState":"Active","idCase":6452,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"currentState":"EXECUTING"},{"id":"c9edc59f-79b8-4be5-994e-c7328b35281a","name":"Actviidad 2","description":"(see object with key description)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":"(see object with key description)","estimatedFinishDate":"(see object with key description)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0},{"id":"1b801877-91df-4db8-ab2a-38a4ade3c792","name":"Actividad 3","description":"(see object with key description)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":"(see object with key description)","estimatedFinishDate":"(see object with key description)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0}],"contextualized":true,"idActivitySelected":"757d7005-e696-4a67-bb76-c303ce8a6476","users":[],"firstParent":{"idCase":6451,"idWorkflow":3,"idWorkitem":11352,"idTask":5,"radNumber":"6451","displayName":"Activity_1","isWorkitemClosed":false}}');
            widget.renderContent();
         });
      });
      describe("clean", function () {
         beforeEach(function () {
            spyOn(widget.serviceloadDataPlan, "unsubscribe");
         });
         it("Should call unsubscribe", function () {
            widget.clean();
            expect(widget.serviceloadDataPlan.unsubscribe).toHaveBeenCalled();
         });
      });
   });

});
