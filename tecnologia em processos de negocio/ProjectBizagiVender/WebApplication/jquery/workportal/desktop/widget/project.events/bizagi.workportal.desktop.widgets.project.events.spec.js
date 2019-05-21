/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.events
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.desktop.widgets.project.events", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });
   it("Render Widget", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.project.events(workportalFacade, dataService, params);
      widget.contextsSidebarActivity = ["ACTIVITY", "OVERVIEW", "COMMENTS", "FILES", "PROCESSMAP", "LOG", "PLANCREATE"];
      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });
   });

   describe("functions", function(){
      describe("updateView", function(){
         beforeEach(function(){
            params = JSON.parse('{"idCase":6421,"idWorkflow":3,"idWorkitem":11458,"idTask":5,"eventAsTasks":false,"onlyUserWorkItems":"true","formsRenderVersion":2,"referrer":"inboxGrid","isComplex":false,"onClose":"","isOfflineForm":false,"hasWorkItems":true,"hasGlobalForm":"false","widgetName":"projectDashboard","radNumber":"6421","menu":{"workportalFacade":{"templates":{"menu.modal.widgets":"[Unknown]","menu.modal.user":"[Unknown]","menu.modal.about":"[Unknown]","info-message":"[Unknown]","bizagi.workportal.desktop.upload.dialog":"[Unknown]","bizagi.workportal.desktop.fileupload.form":"[Unknown]","inbox-common-pagination-grid":"[Unknown]","inbox-common-pagination-inbox":"[Unknown]","inbox-common-header":"[Unknown]","inbox-common-header-folders":"[Unknown]","inbox-common-case-summary-oldrender":"[Unknown]","loadForm":"[Unknown]","print-frame":"[Unknown]","print-frame-header":"[Unknown]","render":"[Unknown]","search":"[Unknown]"},"workportal":"[Unknown]","dataService":"[Unknown]"},"dataService":"[Unknown]","resources":"[Unknown]","componentContainers":"[Unknown]","subscribers":"[Unknown]","disposed":"[Unknown]","tmpl":"[Unknown]","templatesDeferred":"[Unknown]","renderingDeferred":"[Unknown]","content":"[Unknown]","security":"[Unknown]"},"supportNav":"[Unknown]","contextsSidebarActivity":"[Unknown]","contextsWithoutLeftSidebarCaseDashboard":"[Unknown]","contextsLeftSidebarCaseDashboard":"[Unknown]","contextsWithoutRightSidebarCaseDashboard":"[Unknown]","contextsRightSidebarCaseDashboard":"[Unknown]","caseNumber":"[Unknown]","process":"[Unknown]","processPath":"[Unknown]","creationDate":"[Unknown]","estimatedSolutionDate":"[Unknown]","solutionDate":"[Unknown]","isOpen":"[Unknown]","idParentCase":"[Unknown]","radNumberParentCase":"[Unknown]","isFavorite":"[Unknown]","guidFavorite":"[Unknown]","parentDisplayName":"[Unknown]","canAccesToParentProcess":"[Unknown]","isDelegatedCase":"[Unknown]","isAborted":"[Unknown]","hasComments":"[Unknown]","countEvents":"[Unknown]","countSubProcesses":"[Unknown]","countAssigness":"[Unknown]","helpUrl":"[Unknown]","currentState":"[Unknown]","caseDescription":"[Unknown]","createdBy":"[Unknown]","contextualized":"[Unknown]","createdByName":"[Unknown]","createdByUserName":"[Unknown]","showWorkOnIt":"[Unknown]","showEvents":"[Unknown]","showParentProcess":"[Unknown]","parentProcess":"[Unknown]","isClosed":"[Unknown]","showAssignees":"[Unknown]","showSubProcess":"[Unknown]","showForm":"[Unknown]","allowsReassign":"[Unknown]","currentStateTypes":"[Unknown]","showActivities":"[Unknown]","differenceMillisecondsServer":"[Unknown]","plan":"[Unknown]","guidWorkItem":"[Unknown]","menuDashboard":"[Unknown]","histName":"[Unknown]","level":"[Unknown]","showContextByMenuDashboard":"[Unknown]","isFavoriteCase":"[Unknown]"}');
            params.args = JSON.parse('{"idCase":6421,"idWorkflow":3,"idWorkitem":11458,"idTask":5,"eventAsTasks":false,"onlyUserWorkItems":"true","formsRenderVersion":2,"referrer":"inboxGrid","isComplex":false,"onClose":"","isOfflineForm":false,"hasWorkItems":true,"hasGlobalForm":"false","widgetName":"projectDashboard","radNumber":"6421","menu":{"workportalFacade":{"templates":{"menu.modal.widgets":"[Unknown]","menu.modal.user":"[Unknown]","menu.modal.about":"[Unknown]","info-message":"[Unknown]","bizagi.workportal.desktop.upload.dialog":"[Unknown]","bizagi.workportal.desktop.fileupload.form":"[Unknown]","inbox-common-pagination-grid":"[Unknown]","inbox-common-pagination-inbox":"[Unknown]","inbox-common-header":"[Unknown]","inbox-common-header-folders":"[Unknown]","inbox-common-case-summary-oldrender":"[Unknown]","loadForm":"[Unknown]","print-frame":"[Unknown]","print-frame-header":"[Unknown]","render":"[Unknown]","search":"[Unknown]"},"workportal":"[Unknown]","dataService":"[Unknown]"},"dataService":"[Unknown]","resources":"[Unknown]","componentContainers":"[Unknown]","subscribers":"[Unknown]","disposed":"[Unknown]","tmpl":"[Unknown]","templatesDeferred":"[Unknown]","renderingDeferred":"[Unknown]","content":"[Unknown]","security":"[Unknown]"},"supportNav":"[Unknown]","contextsSidebarActivity":"[Unknown]","contextsWithoutLeftSidebarCaseDashboard":"[Unknown]","contextsLeftSidebarCaseDashboard":"[Unknown]","contextsWithoutRightSidebarCaseDashboard":"[Unknown]","contextsRightSidebarCaseDashboard":"[Unknown]","caseNumber":"[Unknown]","process":"[Unknown]","processPath":"[Unknown]","creationDate":"[Unknown]","estimatedSolutionDate":"[Unknown]","solutionDate":"[Unknown]","isOpen":"[Unknown]","idParentCase":"[Unknown]","radNumberParentCase":"[Unknown]","isFavorite":"[Unknown]","guidFavorite":"[Unknown]","parentDisplayName":"[Unknown]","canAccesToParentProcess":"[Unknown]","isDelegatedCase":"[Unknown]","isAborted":"[Unknown]","hasComments":"[Unknown]","countEvents":"[Unknown]","countSubProcesses":"[Unknown]","countAssigness":"[Unknown]","helpUrl":"[Unknown]","currentState":"[Unknown]","caseDescription":"[Unknown]","createdBy":"[Unknown]","contextualized":"[Unknown]","createdByName":"[Unknown]","createdByUserName":"[Unknown]","showWorkOnIt":"[Unknown]","showEvents":"[Unknown]","showParentProcess":"[Unknown]","parentProcess":"[Unknown]","isClosed":"[Unknown]","showAssignees":"[Unknown]","showSubProcess":"[Unknown]","showForm":"[Unknown]","allowsReassign":"[Unknown]","currentStateTypes":"[Unknown]","showActivities":"[Unknown]","differenceMillisecondsServer":"[Unknown]","plan":"[Unknown]","guidWorkItem":"[Unknown]","menuDashboard":"[Unknown]","histName":"[Unknown]","level":"[Unknown]","showContextByMenuDashboard":"[Unknown]","isFavoriteCase":"[Unknown]"}');
            params.args.countEvents = 3;
            params.args.idWorkitem = 123;
            params.args.currentState = [{isEvent: "true", idWorkItem: 123}];

            params.args.showEvents = true;

            spyOn(widget.dataService, "summaryCaseEvents").and.callFake(function(){
               var defer = $.Deferred();
               defer.resolve({
                  events: [[{}], [{}]],
                  idWorkFlow: 123
               });
               return defer.promise();
            });
         });
         it("Should be call dataService summaryCaseEvents", function(){
            widget.updateView({}, params);
            expect(widget.dataService.summaryCaseEvents).toHaveBeenCalled();
         });

      });

      describe("onClickGoEvent", function(){
         beforeEach(function(){
            spyOn(widget, "routingExecute");
         });
         it("Should be call routingExecute", function(){
            $(".list-events li.event a:eq(0)", widget.getContent()).click();
            expect(widget.routingExecute).toHaveBeenCalled();
         });
      });
      describe("clean", function(){
         beforeEach(function(){
            spyOn(widget, "unsub");
         });
         it("Should be ", function(){
            widget.params.contextsSidebarActivity = ["ACTIVITY", "OVERVIEW", "COMMENTS", "FILES", "PROCESSMAP", "LOG", "PLANCREATE"];
            widget.clean();
            expect(widget.unsub.calls.count()).toBe(7);
         });
      });
   });
});
