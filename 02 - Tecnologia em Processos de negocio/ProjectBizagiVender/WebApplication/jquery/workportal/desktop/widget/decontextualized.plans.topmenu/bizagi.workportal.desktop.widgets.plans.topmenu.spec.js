/**
 * Unit Testing bizagi.workportal.widgets.plans.topmenu
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.plans.topmenu", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
      planCreate = bizagi.injector.get("bizagi.workportal.widgets.project.plan.create");
   });

   it("Render Widget", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.plans.topmenu(workportalFacade, dataService, planCreate, params);
      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });
   });

   describe("Functions:", function () {
      describe("When click add plan", function () {
         beforeEach(function () {
            spyOn(widget, "pub");
         });
         it("Should notify when plan created", function () {
            $('.wdg-topmenu-add', widget.getContent()).click();
            var responseCreatePlan = JSON.parse('{"paramsNewPlan":{"idUserCreator":207,"id":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","startDate":null,"creationDate":null,"parentWorkItem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a","description":null,"currentState":"PENDING","name":"Este es el nombre del plan nuevo","waitForCompletion":true,"dueDate":null,"contextualized":true,"activities":[],"users":[]}}');
            widget.planCreate.pub('planCreated', responseCreatePlan);

            expect(widget.pub).toHaveBeenCalled();
         });
      });
   });
});
