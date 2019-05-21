/**
 * Initialize desktop.widgets.project.processState widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.processState", function () {
   checkWorkportalDependencies();
   var widget;
   bizagi.currentUser = {
      "idUser": 1,
      "user": "domain\admon",
      "userName": "admon",
      "uploadMaxFileSize": 1048576
   };
   var params = {};
   params["args"] = {"idCase":13405, "showParentProcess": "true", "caseNumber":"13404","process":"Identify the priority to attend the bug","creationDate":"01/21/2015 11:52","estimatedSolutionDate":"01/22/2015 13:53","hasPlanAccess":true,"isSuperUser":false,"workflowPlanId":389,"isWorkflowPlan":false,"solutionDate":"01/21/2015 11:52","isOpen":"true","idParentCase":13404,"radNumberParentCase":"13404","isFavorite":"false","guidFavorite":"","parentDisplayName":"Bug Tracking","canAccesToParentProcess":"true","isDelegatedCase":"false","isAborted":"false","hasComments":"false","countEvents":0,"countSubProcesses":0,"countAssigness":0,"helpUrl":"","hasGlobalForm":"true","currentState":[{"idWorkItem":687152,"idTask":0,"state":"New Task 3","colorState":"Red","tskDescription":"","estimatedSolutionDate":"01/22/2015 13:53","isEvent":"false","helpUrl":"","allowsReassign":"false","assignToCurrentUser":"true","idworkflowplan":0,"closedPlan":false}],"createdBy":{"idUser":123456789,"userName":"admon","Name":"fabian"},"caseDescription":""};

   it("Environment has been defined", function (done) {
      widget = new bizagi.workportal.widgets.project.processState(dependencies.workportalFacade, dependencies.dataService, params);
      widget.contextsSidebarActivity = ["ACTIVITY", "OVERVIEW", "COMMENTS", "FILES", "PROCESSMAP", "LOG", "PLANCREATE"];
      $.when(widget.areTemplatedLoaded())
         .done(function () {
            $.when(widget.renderContent()).done(function (html) {
               dependencies.canvas.empty();
               dependencies.canvas.append(html);
               widget.postRender();
               $.when(widget.updateView({}, params)).done(function () {
                  done();
               });
            });
         });
   });

   it("Environment has content", function (done) {
      var contentWidget = widget.getContent();
      expect(contentWidget).not.toBe("");
      expect($(contentWidget).html().indexOf("ui-bizagi-wp-project-process-state-wrapper")).not.toBe(-1);
      expect($("body").html().indexOf("ui-bizagi-wp-project-process-state-wrapper")).not.toBe(-1);
      done();
   });

   describe("Events", function(){
      it("should call routingExecute when click parent case", function(){
         var contentWidget = widget.getContent();
         spyOn(widget, "routingExecute");

         var event = {};
         event.target = $("#go-to-parent-case", contentWidget);
         event.preventDefault = function(){};
         widget.onClickGoToParentCase(event);

         expect(widget.routingExecute).toHaveBeenCalled();
      });
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
