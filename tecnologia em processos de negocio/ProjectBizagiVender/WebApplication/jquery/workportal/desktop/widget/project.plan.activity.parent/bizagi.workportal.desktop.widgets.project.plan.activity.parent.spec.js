/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.plan.activity.parent
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.desktop.widgets.project.plan.activity.parent", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });

   it("Render Widget", function (done) {
      var params = {};
      widget = bizagi.injector.get("bizagi.workportal.widgets.project.plan.activity.parent");
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
            params = JSON.parse('{"idCase":6551,"idWorkitem":"11551","eventAsTasks":false,"onlyUserWorkItems":"true","formsRenderVersion":2,"referrer":"bizagi.workportal.widgets.project.plan.parent","isComplex":false,"onClose":"","isOfflineForm":false,"hasWorkItems":true,"hasGlobalForm":"false","displayName":"a1","radNumber":"3251ff62-8f8a-4c3c-a2ee-0b2b1d8c814d","widgetName":"projectDashboard","supportNav":true,"contextsSidebarActivity":"(see array with key contextsSidebarActivity)","contextsWithoutLeftSidebarCaseDashboard":"(see array with key contextsWithoutLeftSidebarCaseDashboard)","contextsLeftSidebarCaseDashboard":"(see array with key contextsLeftSidebarCaseDashboard)","contextsWithoutRightSidebarCaseDashboard":"(see array with key contextsWithoutRightSidebarCaseDashboard)","contextsRightSidebarCaseDashboard":"(see array with key contextsRightSidebarCaseDashboard)","caseNumber":"6551","processPath":"undefined","creationDate":"12/07/2015 14:25","estimatedSolutionDate":"12/07/2015 14:25","solutionDate":"12/07/2015 14:25","isOpen":"true","idParentCase":-1,"radNumberParentCase":"","isFavorite":"false","guidFavorite":"","parentDisplayName":"","canAccesToParentProcess":"false","isDelegatedCase":"false","isAborted":"false","hasComments":"false","countEvents":0,"countSubProcesses":0,"countAssigness":1,"currentState":"(see array with key currentState)","caseDescription":"","createdBy":"(see object with key createdBy)","idPlan":"3251ff62-8f8a-4c3c-a2ee-0b2b1d8c814d","contextualized":false,"createdByName":"AManda Client","createdByUserName":"Client","showWorkOnIt":true,"showEvents":false,"showParentProcess":false,"parentProcess":"(see object with key parentProcess)","isClosed":false,"showAssignees":true,"showSubProcess":false,"showForm":false,"allowsReassign":"false","currentStateTypes":"(see array with key currentStateTypes)","showActivities":true,"differenceMillisecondsServer":-28,"guidWorkItem":"334adf0f-8af8-48cc-b749-d9d0d149091b","plan":"(see object with key plan)","planChild":"(see object with key planChild)","menuDashboard":"(see object with key menuDashboard)","histName":"a1","level":0,"showContextByMenuDashboard":"ACTIVITYPLAN","refreshLastItemBreadcrumb":true}');
            params.plan = JSON.parse('{"id":"3251ff62-8f8a-4c3c-a2ee-0b2b1d8c814d","name":"plan ejemplo","description":null,"currentState":"EXECUTING","parentWorkItem":"(see object with key description)","creationDate":1449516304772,"startDate":1449516316080,"dueDate":"(see object with key description)","idUserCreator":3,"waitForCompletion":true,"activities":[{"id":"4cbbb2d8-42f2-405b-9600-5cd952692063","name":"a1","description":"(see object with key description)","allowEdition":true,"idPlan":"3251ff62-8f8a-4c3c-a2ee-0b2b1d8c814d","userAssigned":3,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":1449516315567,"estimatedFinishDate":1449516315570,"items":[],"idWorkItem":11551,"workItemState":"Active","idCase":6551,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"currentState":"EXECUTING"},{"id":"4f5fad64-eab3-4810-9d4b-ed3a822be9c4","name":"a","description":"(see object with key description)","allowEdition":true,"idPlan":"3251ff62-8f8a-4c3c-a2ee-0b2b1d8c814d","userAssigned":3,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":"(see object with key description)","estimatedFinishDate":"(see object with key description)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0},{"id":"cbaf3122-4f61-49d4-8d40-025b853ff807","name":"2","description":"(see object with key description)","allowEdition":true,"idPlan":"3251ff62-8f8a-4c3c-a2ee-0b2b1d8c814d","userAssigned":3,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":"(see object with key description)","estimatedFinishDate":"(see object with key description)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0},{"id":"a210da62-6b8c-48b9-90dc-8663bcbd12f5","name":"a3","description":"(see object with key description)","allowEdition":true,"idPlan":"3251ff62-8f8a-4c3c-a2ee-0b2b1d8c814d","userAssigned":3,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":"(see object with key description)","estimatedFinishDate":"(see object with key description)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0}],"contextualized":false,"idActivitySelected":"4cbbb2d8-42f2-405b-9600-5cd952692063","users":[],"firstParent":"(see object with key description)"}');
            params.args = params;
            spyOn(widget, "getTemplate").and.callFake(function(){
               return {
                  render: function(){
                     return {
                        appendTo: function(){}
                     }
                  }
               }
            });
            spyOn(widget.dataService, "getPlanParent").and.callFake(function(){
               var defer = $.Deferred();
               defer.resolve(params.plan);
               return defer.promise();
            });
         });
         it("Should call getTemplate", function () {
            widget.onNotifyLoadInfoActivityExecution({}, params);
            expect(widget.getTemplate).toHaveBeenCalled();
         });
      });

      describe("onClickGoToParentCase", function () {
         beforeEach(function () {
            event = {
               preventDefault: function(){},
               target: $("<div></div>")
            }
            spyOn(widget, "routingExecute");
         });

         it("Should call routingExecute", function () {
            widget.onClickGoToParentCase(event);
            expect(widget.routingExecute).toHaveBeenCalled();
         });
      });
   });
});
