/**
 * Initialize desktop.widgets.project.plan.progress widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.plan.progress", function () {
   checkWorkportalDependencies();
   var widget;

   it("Environment has been defined", function (done) {
      bizagi.currentUser = {};
      bizagi.currentUser["uploadMaxFileSize"] = 123;

      var params = {};
      widget = new bizagi.workportal.widgets.project.plan.progress(dependencies.workportalFacade, dependencies.dataService, params);
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

   describe("The behavior UI", function(){
      it("Should the width bar completed change by progress", function () {
         widget.params.plan = JSON.parse('{"id":"5e9de41d-ee30-4e34-a21d-b953328d457b","name":"plan nivel 2","description":null,"currentState":"EXECUTING","parentWorkItem":"661bc335-2568-4cf8-b0c0-6a4e4ff0ff2b","creationDate":1449686725797,"startDate":1449686747046,"dueDate":null,"idUserCreator":3,"waitForCompletion":true,"activities":[{"finishDate": "1427681470000"}],"contextualized":true,"fromDate":"hace 1 minuto","value":0,"completedActivities":0,"activitiesLength":0,"users":[],"firstParent":null}');
         var params = {args:{summaryPlan:{"state":"pending","progress":90,"initialDate":1427681470000,"dueDate":1438273470000,"typeParent":"case","idParent":12,"nameParent":"Nombre WorkItem 1","users":[{"idUser":"1","typeUser":"owner"},{"idUser":"1","typeUser":"Assigned"}]}}};
         widget.onNotifyLoadInfoSummaryPlan({}, params);
         params = {args:{summaryPlan:{"state":"pending","progress":50,"initialDate":1427681470000,"dueDate":1438273470000,"typeParent":"case","idParent":12,"nameParent":"Nombre WorkItem 1","users":[{"idUser":"1","typeUser":"owner"},{"idUser":"1","typeUser":"Assigned"}]}}};
         params.args.plan = JSON.parse('{"id":"5e9de41d-ee30-4e34-a21d-b953328d457b","name":"plan nivel 2","description":null,"currentState":"EXECUTING","parentWorkItem":"661bc335-2568-4cf8-b0c0-6a4e4ff0ff2b","creationDate":1449686725797,"startDate":1449686747046,"dueDate":null,"idUserCreator":3,"waitForCompletion":true,"activities":[{"finishDate": "1427681470000"}],"contextualized":true,"fromDate":"hace 1 minuto","value":0,"completedActivities":0,"activitiesLength":0,"users":[],"firstParent":null}');
         widget.onNotifyLoadInfoSummaryPlan({}, params);

      });
   });
});
