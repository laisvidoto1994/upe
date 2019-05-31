/**
 * Initialize desktop.widgets.project.plan.state widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.plan.state", function () {
   checkWorkportalDependencies();
   var widget;

   it("Environment has been defined", function (done) {
      bizagi.currentUser = {};
      bizagi.currentUser["uploadMaxFileSize"] = 123;

      var params = {};
      widget = new bizagi.workportal.widgets.project.plan.state(dependencies.workportalFacade, dependencies.dataService, params);
      widget.params =JSON.parse('{"idCase":6452,"idWorkflow":0,"idWorkitem":11354,"idTask":9999999,"eventAsTasks":false,"onlyUserWorkItems":"true","formsRenderVersion":2,"referrer":"inboxGrid","isComplex":false,"onClose":"","isOfflineForm":false,"hasWorkItems":true,"hasGlobalForm":"false","widgetName":"projectDashboard","radNumber":"6451","supportNav":true,"contextsSidebarActivity":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE"],"contextsWithoutLeftSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsLeftSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"contextsWithoutRightSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsRightSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"caseNumber":"6451","processPath":"undefined","creationDate":"12/02/2015 03:40","estimatedSolutionDate":"12/02/2015 03:40","solutionDate":"12/02/2015 03:40","isOpen":"true","idParentCase":-1,"radNumberParentCase":"","isFavorite":"false","guidFavorite":"","parentDisplayName":"","canAccesToParentProcess":"false","isDelegatedCase":"false","isAborted":"false","hasComments":"false","countEvents":1,"countSubProcesses":0,"countAssigness":1,"currentState":[{"assignToCurrentUser":"true","estimatedSolutionDate":"12/02/2015 03:40","isEvent":"false","allowReleaseActivity":false,"idActivity":"757d7005-e696-4a67-bb76-c303ce8a6476","displayName":"Una actividad","idWorkItem":"11354","allowsReassign":"true","entryDateWorkItem":"12/02/2015 08:40","guidWorkItem":"b803ddfd-93de-46b6-9349-d555173b2207"}],"caseDescription":"","createdBy":{"userName":"AJones","Name":"Addison Jones","userId":207},"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","contextualized":true,"createdByName":"Addison Jones","createdByUserName":"AJones","showWorkOnIt":true,"showEvents":true,"showParentProcess":false,"parentProcess":{"displayName":"","idCase":-1},"isClosed":false,"showAssignees":true,"showSubProcess":false,"showForm":false,"allowsReassign":"false","currentStateTypes":["(see object with key 0)"],"showActivities":true,"differenceMillisecondsServer":-28,"guidWorkItem":"b803ddfd-93de-46b6-9349-d555173b2207","plan":{"id":"a29463c5-7e66-45a2-8b01-0b7002478a09","name":"Nuevo plan","description":"(see object with key templatesDeferred)","currentState":"EXECUTING","parentWorkItem":"7236b8af-98ec-4d06-a5bd-b22950a904ba","creationDate":1449063509570,"startDate":1449063607707,"dueDate":"(see object with key templatesDeferred)","idUserCreator":207,"waitForCompletion":true,"activities":[{"id":"757d7005-e696-4a67-bb76-c303ce8a6476","name":"Una actividad","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":1449063607657,"estimatedFinishDate":1449063607657,"items":[],"idWorkItem":11354,"workItemState":"Active","idCase":6452,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"currentState":"EXECUTING"},{"id":"c9edc59f-79b8-4be5-994e-c7328b35281a","name":"Actviidad 2","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":"(see object with key templatesDeferred)","estimatedFinishDate":"(see object with key templatesDeferred)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0},{"id":"1b801877-91df-4db8-ab2a-38a4ade3c792","name":"Actividad 3","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":"(see object with key templatesDeferred)","estimatedFinishDate":"(see object with key templatesDeferred)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0}],"contextualized":true,"idActivitySelected":"757d7005-e696-4a67-bb76-c303ce8a6476","users":[],"firstParent":{"idCase":6451,"idWorkflow":3,"idWorkitem":11352,"idTask":5,"radNumber":"6451","displayName":"Activity_1","isWorkitemClosed":false}},"menuDashboard":{"showFormOverview":true,"showPlanOptionMenu":true,"showFormActivity":true,"contextFormActivityOptionMenu":"ACTIVITYPLAN","contextPlanOptionMenu":"ACTIVITYPLANCREATE"},"histName":"Una actividad","level":0,"showContextByMenuDashboard":"ACTIVITYPLAN","refreshLastItemBreadcrumb":true}');
      widget.params.plan = JSON.parse('{"id":"a29463c5-7e66-45a2-8b01-0b7002478a09","name":"Nuevo plan","description":null,"currentState":"EXECUTING","parentWorkItem":"7236b8af-98ec-4d06-a5bd-b22950a904ba","creationDate":1449063509570,"startDate":1449063607707,"dueDate":"(see object with key description)","idUserCreator":207,"waitForCompletion":true,"activities":[{"id":"757d7005-e696-4a67-bb76-c303ce8a6476","name":"Una actividad","description":"(see object with key description)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":1449063607657,"estimatedFinishDate":1449063607657,"items":[],"idWorkItem":11354,"workItemState":"Active","idCase":6452,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"currentState":"EXECUTING"},{"id":"c9edc59f-79b8-4be5-994e-c7328b35281a","name":"Actviidad 2","description":"(see object with key description)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":"(see object with key description)","estimatedFinishDate":"(see object with key description)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0},{"id":"1b801877-91df-4db8-ab2a-38a4ade3c792","name":"Actividad 3","description":"(see object with key description)","allowEdition":true,"idPlan":"a29463c5-7e66-45a2-8b01-0b7002478a09","userAssigned":207,"duration":"(see object with key description)","progress":0,"finishDate":"(see object with key description)","startDate":"(see object with key description)","estimatedFinishDate":"(see object with key description)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0}],"contextualized":true,"idActivitySelected":"757d7005-e696-4a67-bb76-c303ce8a6476","users":[],"firstParent":{"idCase":6451,"idWorkflow":3,"idWorkitem":11352,"idTask":5,"radNumber":"6451","displayName":"Activity_1","isWorkitemClosed":false}}');
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
      it("Should show information plan by state", function () {
         var contentWidget = widget.getContent();

         var params = {args: {}};
         params.args.plan = {};
         params.args.plan.currentState = "PENDING";
         widget.onNotifyLoadInfoSummaryPlan({}, params);
         expect($(".state-pending", contentWidget).css("display")).not.toBe("none");

         params.args.plan = {};
         params.args.plan.currentState = "EXECUTING";
         widget.onNotifyLoadInfoSummaryPlan({}, params);
         expect($(".state-progress", contentWidget).css("display")).not.toBe("none");

         params.args.plan = {};
         params.args.plan.currentState = "CLOSED";
         widget.onNotifyLoadInfoSummaryPlan({}, params);
         expect($(".state-closed", contentWidget).css("display")).not.toBe("none");
      });
   });
});
