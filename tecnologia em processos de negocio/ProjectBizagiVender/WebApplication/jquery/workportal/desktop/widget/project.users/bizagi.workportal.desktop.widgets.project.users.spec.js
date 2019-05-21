/**
 * Initialize desktop.widgets.project.users widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.users", function () {
   checkWorkportalDependencies();
   var widget, relatedUsersService;

   it("Environment has been defined", function (done) {
      bizagi.currentUser = {};
      bizagi.currentUser["uploadMaxFileSize"] = 123;
      relatedUsersService = bizagi.injector.get("relatedusers");

      var params = {};
      params.contextsSidebarActivity = ["ACTIVITY", "OVERVIEW", "COMMENTS", "FILES", "PROCESSMAP", "LOG", "PLANCREATE"];
      widget = new bizagi.workportal.widgets.project.users(dependencies.workportalFacade, dependencies.dataService, relatedUsersService, params);

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
      beforeEach(function(){
         spyOn(widget.dataService, "getUsersData").and.callFake(function(){
            var defer = $.Deferred();
            defer.resolve([{"id":1,"name":"admon"},{"id":2,"name":"user2"},{"id":207,"name":"user 3"},{"id":208,"name":"user 4"}]);
            return defer.promise();
         });

         spyOn(widget.dataService, "getCaseAssignees").and.callFake(function(){
            var defer = $.Deferred();
            defer.resolve({"assignees":[{"Name":"AManda Client","idUser":"3","idWorkItem":"10466","userName":"domain\\Client","taskName":"activitprocess without begin form myself","idTask":75,"isEvent":"false","isDelegator":"false"}]});
            return defer.promise();
         });
      });
      it("Should call service getUsersData when notify widget", function () {
         var contentWidget = widget.getContent();
         var params = {args:{summaryPlan:{"state":"pending","progress":100,"initialDate":1427681470000,"dueDate":1438273470000,"typeParent":"case","idParent":12,"nameParent":"Nombre WorkItem 1","users":[{"idUser":"1","typeUser":"owner"},{"idUser":"1","typeUser":"Assigned"}]}}};
         params.args.plan = JSON.parse('{"id":"a29463c5-7e66-45a2-8b01-0b7002478a09","name":"Nuevo plan","description":null,"currentState":"EXECUTING","parentWorkItem":"7236b8af-98ec-4d06-a5bd-b22950a904ba","creationDate":1449063509570,"startDate":1449063607707,"dueDate":"(see object with key description)","idUserCreator":208,"waitForCompletion":true,"activities":[{"id":"757d7005-e696-4a67-bb76-c303ce8a6476","name":"Una actividad","description":"(see object with key description)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":208,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":1449063607657,"estimatedFinishDate":1449063607657,"items":[],"idWorkItem":11354,"workItemState":"Active","idCase":6452,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"currentState":"EXECUTING"},{"id":"c9edc59f-79b8-4be5-994e-c7328b35281a","name":"Actviidad 2","description":"(see object with key description)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":"(see object with key description)","estimatedFinishDate":"(see object with key description)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0},{"id":"1b801877-91df-4db8-ab2a-38a4ade3c792","name":"Actividad 3","description":"(see object with key description)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":"(see object with key description)","estimatedFinishDate":"(see object with key description)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0}],"contextualized":true,"idActivitySelected":"757d7005-e696-4a67-bb76-c303ce8a6476","users":[],"firstParent":{"idCase":6451,"idWorkflow":3,"idWorkitem":11352,"idTask":5,"radNumber":"6451","displayName":"Activity_1","isWorkitemClosed":false}}');
         params.args.createdBy = {
            userId: 207,
            Name: "User test"
         };
         params.args.countAssigness = 2;
         bizagi.currentUser.idUser = 207;

         widget.updateView({}, params);
         expect($(".remaining-days .bar-completed", contentWidget).width()).toBe($(".remaining-days .bar-completed", contentWidget).parent().width());
         expect(widget.dataService.getUsersData).toHaveBeenCalled();
      });

      describe("Functions", function () {
         describe("clean", function () {
            beforeEach(function () {
               spyOn(widget, "unsub");
            });
            it("Should call unsub", function () {
               widget.clean();
               expect(widget.unsub).toHaveBeenCalled();
            });
         });
      });
   });
});
