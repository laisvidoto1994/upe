
/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.dashboard.menu.plan
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.desktop.widgets.project.dashboard.menu.plan", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });
   it("Render Widget", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.project.dashboard.menu.plan(workportalFacade, dataService, params);
      widget.params = {};
      widget.params.contextsLeftSidebarCaseDashboard = ["ACTIVITY", "OVERVIEW", "COMMENTS", "FILES", "PROCESSMAP", "LOG", "PLANCREATE"];

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            spyOn(widget, "sub");
            widget.postRender();

            expect(widget.sub).toHaveBeenCalled();

            done();
         });
      });
   });

   describe("functions", function(){
      describe("updateView", function(){
         beforeEach(function(){
            params = JSON.parse('{"idCase":6452,"idWorkflow":0,"idWorkitem":11354,"idTask":9999999,"eventAsTasks":false,"onlyUserWorkItems":"true","formsRenderVersion":2,"referrer":"inboxGrid","isComplex":false,"onClose":"","isOfflineForm":false,"hasWorkItems":true,"hasGlobalForm":"false","widgetName":"projectDashboard","radNumber":"6451","menu":{"workportalFacade":{"templates":{"menu.modal.widgets":"[Unknown]","menu.modal.user":"[Unknown]","menu.modal.about":"[Unknown]","info-message":"[Unknown]","bizagi.workportal.desktop.upload.dialog":"[Unknown]","bizagi.workportal.desktop.fileupload.form":"[Unknown]","inbox-common-pagination-grid":"[Unknown]","inbox-common-pagination-inbox":"[Unknown]","inbox-common-header":"[Unknown]","inbox-common-header-folders":"[Unknown]","inbox-common-case-summary-oldrender":"[Unknown]","loadForm":"[Unknown]","print-frame":"[Unknown]","print-frame-header":"[Unknown]","render":"[Unknown]","search":"[Unknown]"},"workportal":"[Unknown]","dataService":"[Unknown]"},"dataService":"[Unknown]","resources":"[Unknown]","componentContainers":"[Unknown]","subscribers":"[Unknown]","disposed":"[Unknown]","tmpl":"[Unknown]","templatesDeferred":"[Unknown]","renderingDeferred":"[Unknown]","content":"[Unknown]","security":"[Unknown]"},"supportNav":"[Unknown]","contextsSidebarActivity":"[Unknown]","contextsWithoutLeftSidebarCaseDashboard":"[Unknown]","contextsLeftSidebarCaseDashboard":"[Unknown]","contextsWithoutRightSidebarCaseDashboard":"[Unknown]","contextsRightSidebarCaseDashboard":"[Unknown]","caseNumber":"[Unknown]","processPath":"[Unknown]","creationDate":"[Unknown]","estimatedSolutionDate":"[Unknown]","solutionDate":"[Unknown]","isOpen":"[Unknown]","idParentCase":"[Unknown]","radNumberParentCase":"[Unknown]","isFavorite":"[Unknown]","guidFavorite":"[Unknown]","parentDisplayName":"[Unknown]","canAccesToParentProcess":"[Unknown]","isDelegatedCase":"[Unknown]","isAborted":"[Unknown]","hasComments":"[Unknown]","countEvents":"[Unknown]","countSubProcesses":"[Unknown]","countAssigness":"[Unknown]","currentState":"[Unknown]","caseDescription":"[Unknown]","createdBy":"[Unknown]","idPlan":"[Unknown]","contextualized":"[Unknown]","createdByName":"[Unknown]","createdByUserName":"[Unknown]","showWorkOnIt":"[Unknown]","showEvents":"[Unknown]","showParentProcess":"[Unknown]","parentProcess":"[Unknown]","isClosed":"[Unknown]","showAssignees":"[Unknown]","showSubProcess":"[Unknown]","showForm":"[Unknown]","allowsReassign":"[Unknown]","currentStateTypes":"[Unknown]","showActivities":"[Unknown]","differenceMillisecondsServer":"[Unknown]","guidWorkItem":"[Unknown]","plan":"[Unknown]","menuDashboard":"[Unknown]","histName":"[Unknown]","level":"[Unknown]","showContextByMenuDashboard":"[Unknown]","refreshLastItemBreadcrumb":"[Unknown]","statePlan":"[Unknown]","statePendingPlan":"[Unknown]","stateExecutingPlan":"[Unknown]","contextPlanActivities":"[Unknown]","showFormAddActivityByNotFinishedAllActivities":"[Unknown]"}');
            widget.params = params;
            spyOn(widget, "clean");
         });

         it("Should be any html on widget", function(){
            widget.updateView(event, params);
            expect(widget.clean).toHaveBeenCalled();
         });
      });

      describe("loadContentById", function(){
         beforeEach(function(){
            spyOn(widget, "pub").and.callFake(function(params){
               return 1;
            });
         });
         it("Should be pub notify change context", function(){
            widget.params.plan = {};
            widget.params.plan.id = "ABC-2345";
            $(".ui-bizagi-wp-project-tab-links a:eq(3)", widget.getContent()).closest("li").data("context", "PLANACTIVITIES");
            $(".ui-bizagi-wp-project-tab-links a:eq(3)", widget.getContent()).click();
            expect(widget.pub).toHaveBeenCalled();
         });
      });

      describe("backParentPlan", function(){
         beforeEach(function(){
            spyOn(widget, "pub").and.callFake(function(params){
               return 1;
            });
         });
         it("Should be notify event", function(){
            widget.projectDashboard = {};
            widget.params = {};
            widget.projectDashboard.getParamsByBackFromPlan = function(){return {typeContext: "MOCKCONTEXT"}};
            widget.backParentPlan();
            expect(widget.pub).toHaveBeenCalled();
         });
      });

       describe("isVisibleShowTimeLine", function () {
           describe("When plan is Pending", function () {
               it("Should return always false", function () {
                   expect(widget.isVisibleShowTimeLine("PENDING")).toBe(false);
               });
           });
       });

       describe("getPlanState", function () {
           it("Should get default by default the state plan, otherwise, the child plan", function () {
               var plan = {currentState: undefined};
               var planChild = {currentState: "PENDING"};
               expect(widget.getPlanState(plan, planChild)).toBe("PENDING");

               var plan = {currentState: "EXECUTING"};
               var planChild = {currentState: "PENDING"};
               expect(widget.getPlanState(plan, planChild)).toBe("EXECUTING");
           });
       });

      describe("clean", function(){
         beforeEach(function(){
            spyOn(widget, "unsub");
         });
         it("Should be unsub events", function(){
            widget.params.contextsLeftSidebarCaseDashboard = ["ACTIVITY", "OVERVIEW", "COMMENTS", "FILES", "PROCESSMAP", "LOG", "PLANCREATE"];
            widget.clean();
            expect(widget.unsub.calls.count()).toBe(7);
         });
      });
   });
});
