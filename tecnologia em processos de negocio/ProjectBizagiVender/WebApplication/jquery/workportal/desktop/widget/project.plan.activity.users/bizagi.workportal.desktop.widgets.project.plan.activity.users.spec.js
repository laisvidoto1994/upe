/**
 * Unit Testing bizagi.workportal.widgets.project.plan.activity.users
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.project.plan.activity.users", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });

   it("Render Widget", function (done) {
      var params = {};
      widget = bizagi.injector.get("bizagi.workportal.widgets.project.plan.activity.users");
      widget.init(dependencies.workportalFacade, dependencies.dataService, params);

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });
   });

   describe("Functions:", function () {
      describe("onNotifyLoadInfoActivityExecution", function () {
         beforeEach(function () {
            spyOn(widget.dataService, "getUsersData").and.callFake(function(){
               return JSON.parse('[{"id":207,"name":"Addison Jones"}]');
            });
            params = {
               plan: JSON.parse('{"id":"a29463c5-7e66-45a2-8b01-0b7002478a09","name":"Nuevo plan","description":null,"currentState":"EXECUTING","parentWorkItem":"7236b8af-98ec-4d06-a5bd-b22950a904ba","creationDate":1449063509570,"startDate":1449063607707,"dueDate":null,"idUserCreator":207,"waitForCompletion":true,"activities":[{"id":"757d7005-e696-4a67-bb76-c303ce8a6476","name":"Una actividad","description":null,"allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":null,"progress":0,"finishDate":null,"startDate":1449063607657,"estimatedFinishDate":1449063607657,"items":[],"idWorkItem":11354,"workItemState":"Active","idCase":6452,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"currentState":"EXECUTING"},{"id":"c9edc59f-79b8-4be5-994e-c7328b35281a","name":"Actviidad 2","description":null,"allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0},{"id":"1b801877-91df-4db8-ab2a-38a4ade3c792","name":"Actividad 3","description":null,"allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0}],"contextualized":true,"idActivitySelected":"757d7005-e696-4a67-bb76-c303ce8a6476","users":[],"firstParent":{"idCase":6451,"idWorkflow":3,"idWorkitem":11352,"idTask":5,"radNumber":"6451","displayName":"Activity_1","isWorkitemClosed":false}}')
            };
         });
         it("Should call dataService getUsersData", function () {
            widget.params = params;
            widget.onNotifyLoadInfoActivityExecution({}, params);
            expect(widget.dataService.getUsersData).toHaveBeenCalled();
         });
      });
      describe("renderUserTooltip", function () {
         beforeEach(function () {
            event = {
               target: $('<li data-iduser="207" class="bz-wp-avatar bz-wp-avatar-48 k-state-border-down"> <img class="bz-wp-avatar-img" src="" style="display: none;"> <span class="bz-wp-avatar-label">AJ</span> </li>')
            };
         });
         it("Should content name", function () {
            var response = widget.renderUserTooltip(event);
            expect(response.text().indexOf('Addison Jones')).not.toBe(-1);
         });
      });
   });
});
