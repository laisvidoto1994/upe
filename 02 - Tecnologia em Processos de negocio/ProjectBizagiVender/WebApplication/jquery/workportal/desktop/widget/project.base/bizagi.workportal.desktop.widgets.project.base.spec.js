/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.base
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.desktop.widgets.project.base", function () {
   var widget,
      workportalFacade,
      dataService;

   beforeEach(function(){
      bizagi.currentUser = bizagi.currentUser || {};
      bizagi.currentUser.idUser = 1;
   });

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
   });

   it("Render Widget", function (done) {
      var params = {};
      dataService = bizagi.injector.get("dataService");
      widget = new bizagi.workportal.widgets.project.base(workportalFacade, dataService, params);

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });
   });

   describe("Functions", function(){
      it("when call getDateServer should return date", function(){
         var oneDayTimespan = 1449062964093;
         var OldDate = Date;

         spyOn(window, "Date").and.callFake(function() {
            return new OldDate(oneDayTimespan);
         });

         widget.differenceMillisecondsServer = 1000;
         var response = widget.getDateServer();
         expect(response).toBe(widget.differenceMillisecondsServer + oneDayTimespan);

      });

      describe(": mergePropertiesActivitiesWithWorkitems", function(){
         it("Should be merge properties", function(){
            var activities = JSON.parse("[{\"id\":\"757d7005-e696-4a67-bb76-c303ce8a6476\",\"name\":\"Una actividad\",\"description\":null,\"allowEdition\":true,\"idPlan\":\"a29463c5-7e66-45a2-8b01-0b7002478a09\",\"userAssigned\":207,\"duration\":null,\"progress\":0,\"finishDate\":null,\"startDate\":null,\"estimatedFinishDate\":null,\"items\":[]},{\"id\":\"c9edc59f-79b8-4be5-994e-c7328b35281a\",\"name\":\"Actviidad 2\",\"description\":null,\"allowEdition\":true,\"idPlan\":\"a29463c5-7e66-45a2-8b01-0b7002478a09\",\"userAssigned\":207,\"duration\":null,\"progress\":0,\"finishDate\":null,\"startDate\":null,\"estimatedFinishDate\":null,\"items\":[]},{\"id\":\"1b801877-91df-4db8-ab2a-38a4ade3c792\",\"name\":\"Actividad 3\",\"description\":null,\"allowEdition\":true,\"idPlan\":\"a29463c5-7e66-45a2-8b01-0b7002478a09\",\"userAssigned\":207,\"duration\":null,\"progress\":0,\"finishDate\":null,\"startDate\":null,\"estimatedFinishDate\":null,\"items\":[]}]");
            var workitems = JSON.parse("[{\"idWorkItem\":11354,\"idCase\":6452,\"workItemState\":\"Active\",\"wiEntryDate\":1449063607657,\"wiDuration\":0,\"wiEstimatedSolutionDate\":1449063607657,\"wiSolutionDate\":null,\"guidWorkitem\":\"b803ddfd-93de-46b6-9349-d555173b2207\",\"guidActivity\":\"757d7005-e696-4a67-bb76-c303ce8a6476\"}]");
            widget.mergePropertiesActivitiesWithWorkitems(activities, workitems);
            expect(activities[0].idWorkItem).toBeDefined();
            expect(activities[1].idWorkItem).not.toBeDefined();
         });
      });
   });
});
