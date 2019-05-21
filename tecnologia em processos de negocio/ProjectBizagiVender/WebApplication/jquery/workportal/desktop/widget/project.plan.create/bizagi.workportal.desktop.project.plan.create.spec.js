/**
 * Unit Testing bizagi.workportal.widgets.project.plan.create
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.project.plan.create", function () {
   var widget,
      workportalFacade,
      dataService,
      notifier;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
      notifier = bizagi.injector.get("notifier");
   });

   it("Render Widget", function (done) {
      var params = {};
      widget = bizagi.injector.get("bizagi.workportal.widgets.project.plan.create");
      widget.init(dependencies.workportalFacade, dependencies.dataService, notifier, params);

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });
   });

   describe("Functions:", function () {
      describe("showPopupAddPlan", function () {
         beforeEach(function () {
            spyOn(widget.dataService, "getTemplatesByParentWorkItem").and.callFake(function(){
                var defer = $.Deferred();
                defer.resolve();
                return defer.promise();
            });
         });
         it("Should call getTemplatesByParentWorkItem", function () {
            widget.showPopupAddPlan({guidWorkItem: "GUIDWORKITEM"}, dataService, true);
            expect(widget.dataService.getTemplatesByParentWorkItem).toHaveBeenCalled();
         });
      });

      describe("onClickSavePlan", function () {
         beforeEach(function () {
            spyOn(widget, "sendDataInsertPlan").and.callFake(function(){
               return {"id":"5bb1f0e6-da85-4fdc-b75c-4f5e752b4ff1"};
            });
            event = {
               preventDefault: function(){}
            };
            params = {
               plan: JSON.parse('{"id":"a29463c5-7e66-45a2-8b01-0b7002478a09","name":"Nuevo plan","description":null,"currentState":"EXECUTING","parentWorkItem":"7236b8af-98ec-4d06-a5bd-b22950a904ba","creationDate":1449063509570,"startDate":1449063607707,"dueDate":null,"idUserCreator":207,"waitForCompletion":true,"activities":[{"id":"757d7005-e696-4a67-bb76-c303ce8a6476","name":"Una actividad","description":null,"allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":null,"progress":0,"finishDate":null,"startDate":1449063607657,"estimatedFinishDate":1449063607657,"items":[],"idWorkItem":11354,"workItemState":"Active","idCase":6452,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"currentState":"EXECUTING"},{"id":"c9edc59f-79b8-4be5-994e-c7328b35281a","name":"Actviidad 2","description":null,"allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0},{"id":"1b801877-91df-4db8-ab2a-38a4ade3c792","name":"Actividad 3","description":null,"allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0}],"contextualized":true,"idActivitySelected":"757d7005-e696-4a67-bb76-c303ce8a6476","users":[],"firstParent":{"idCase":6451,"idWorkflow":3,"idWorkitem":11352,"idTask":5,"radNumber":"6451","displayName":"Activity_1","isWorkitemClosed":false}}')
            };
            widget.dialogBox.elements.inputName.val("Name Mock");
            bizagi.currentUser = bizagi.currentUser || {};
            bizagi.currentUser.idUser = bizagi.currentUser.idUser || 123;

         });
         it("Should call sendDataInsertPlan", function () {
            widget.params = params;
            widget.onClickSavePlan(event);
            expect(widget.sendDataInsertPlan).toHaveBeenCalled();
         });
      });
      describe("sendDataInsertPlan", function () {
         beforeEach(function () {
            spyOn(widget.dataService, "postPlan").and.callThrough();
            params = JSON.parse('{"idUserCreator":1,"startDate":null,"creationDate":null,"parentWorkItem":null,"description":null,"currentState":"PENDING","name":"asfa","waitForCompletion":true,"dueDate":null,"contextualized":false}');
         });
         it("Should call postPlan", function () {
            widget.sendDataInsertPlan(params);
            expect(widget.dataService.postPlan).toHaveBeenCalled();
         });
      });
      describe("validateParams", function () {
         beforeEach(function () {
            widget.dialogBox.elements.inputName.val('');
         });
         it("Should return false", function () {
            expect(widget.validateParams()).toBe(false);
         });
      });
   });
});
