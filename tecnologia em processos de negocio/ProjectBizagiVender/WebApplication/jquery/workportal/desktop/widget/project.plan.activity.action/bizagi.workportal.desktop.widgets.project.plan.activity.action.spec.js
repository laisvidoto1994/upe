/**
 * Initialize desktop.widgets.project.plan.activity.action widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.plan.activity.action", function () {
   checkWorkportalDependencies();
   var widget,
      notifier;

   it("Environment has been defined", function (done) {
      bizagi.currentUser = {};
      bizagi.currentUser["uploadMaxFileSize"] = 123;
      bizagi.currentUser.idUser = 3;

      notifier = bizagi.injector.get("notifier");

      var params = {};
      params["differenceMillisecondsServer"] = 300;
      widget = new bizagi.workportal.widgets.project.plan.activity.action(dependencies.workportalFacade,
         dependencies.dataService,
         notifier,
         params);

      widget.params.plan = {
         currentState: "PENDING"
      };

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

   describe("functions", function () {
      describe("onNotifyLoadInfoActivityExecution", function () {
         beforeEach(function () {
            spyOn(widget, "initPluginPopupEdition").and.callThrough();
            params = {
               args: {"idCase":6852,"idWorkflow":0,"idWorkitem":11854,"idTask":9999999,"eventAsTasks":false,"onlyUserWorkItems":"true","formsRenderVersion":2,"referrer":"inboxGrid","isComplex":false,"onClose":"","isOfflineForm":false,"hasWorkItems":true,"hasGlobalForm":"false","widgetName":"projectDashboard","radNumber":"6851","supportNav":true,"contextsSidebarActivity":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE"],"contextsWithoutLeftSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsLeftSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"contextsWithoutRightSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsRightSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"caseNumber":"6851","processPath":"undefined","creationDate":"12/11/2015 14:47","estimatedSolutionDate":"12/11/2015 14:47","solutionDate":"12/11/2015 14:47","isOpen":"true","idParentCase":-1,"radNumberParentCase":"","isFavorite":"false","guidFavorite":"","parentDisplayName":"","canAccesToParentProcess":"false","isDelegatedCase":"false","isAborted":"false","hasComments":"false","countEvents":0,"countSubProcesses":0,"countAssigness":1,"currentState":[{"assignToCurrentUser":"true","estimatedSolutionDate":"12/11/2015 14:47","isEvent":"false","allowReleaseActivity":false,"idActivity":"f29bd9b5-5a90-413c-9d4f-a1fe498575c3","displayName":"actividad 1 n1","idWorkItem":"11854","allowsReassign":"true","entryDateWorkItem":"12/11/2015 14:47","guidWorkItem":"a2ea2af6-9b68-445e-9b54-28f484c5fc3d"}],"caseDescription":"","createdBy":{"userName":"Client","Name":"AManda Client","userId":3},"idPlan":"02b0d23a-ea84-451d-819f-35171701b9fe","contextualized":true,"createdByName":"AManda Client","createdByUserName":"Client","showWorkOnIt":true,"showEvents":false,"showParentProcess":false,"parentProcess":{"displayName":"","idCase":-1},"isClosed":false,"showAssignees":true,"showSubProcess":false,"showForm":false,"allowsReassign":"false","currentStateTypes":["(see object with key 0)"],"showActivities":true,"differenceMillisecondsServer":-28,"guidWorkItem":"a2ea2af6-9b68-445e-9b54-28f484c5fc3d","plan":{"id":"02b0d23a-ea84-451d-819f-35171701b9fe","name":"plan nivel 1","description":"(see object with key templatesDeferred)","currentState":"EXECUTING","parentWorkItem":"dbc1abd6-89fd-4f65-81e8-0b0570b9cded","creationDate":1449863234057,"startDate":1449863252176,"dueDate":"(see object with key templatesDeferred)","idUserCreator":3,"waitForCompletion":true,"activities":[{"id":"f29bd9b5-5a90-413c-9d4f-a1fe498575c3","name":"actividad 1 n1","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"02b0d23a-ea84-451d-819f-35171701b9fe","userAssigned":3,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":1449863252093,"estimatedFinishDate":1449863252097,"items":[],"idWorkItem":11854,"workItemState":"Active","idCase":6852,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0},{"id":"9a8b18e4-dd07-4281-9589-b5aa2ddaeec2","name":"actividad 2 n1","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"02b0d23a-ea84-451d-819f-35171701b9fe","userAssigned":3,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":"(see object with key templatesDeferred)","estimatedFinishDate":"(see object with key templatesDeferred)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0},{"id":"95cb0ed3-7423-4831-a7e7-16d33eb9bb27","name":"actividad 3 n1","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"02b0d23a-ea84-451d-819f-35171701b9fe","userAssigned":3,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":"(see object with key templatesDeferred)","estimatedFinishDate":"(see object with key templatesDeferred)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0}],"contextualized":true,"idActivitySelected":"f29bd9b5-5a90-413c-9d4f-a1fe498575c3","users":[],"firstParent":{"idCase":6851,"idWorkflow":6,"idWorkitem":11853,"idTask":19,"radNumber":"6851","displayName":"Activity_1","isWorkitemClosed":false}},"menuDashboard":{"showFormOverview":true,"showPlanOptionMenu":true,"showFormActivity":true,"contextFormActivityOptionMenu":"ACTIVITYPLAN","contextPlanOptionMenu":"ACTIVITYPLANCREATE"},"histName":"actividad 1 n1","level":0,"showContextByMenuDashboard":"ACTIVITYPLAN","refreshLastItemBreadcrumb":true}
            };
         });
         it("Should init popup edition", function () {
            widget.onNotifyLoadInfoActivityExecution({}, params);
            expect(widget.initPluginPopupEdition).toHaveBeenCalled();
         });
      });

      describe("onNotifyExpandedRightSidebar", function () {
         beforeEach(function () {
            spyOn(widget, "initilizeActionMenu").and.callThrough();
         });
         it("Should call initilizeActionMenu", function () {
            widget.onNotifyExpandedRightSidebar();
            expect(widget.initilizeActionMenu).toHaveBeenCalled();
         });
      });


      describe("Events", function () {
         describe("onDeleteDate", function () {
            beforeEach(function () {
               widget.onClickOpenPopupEdition();
               event = {
                  keyCode: 8,
                  target: $("<input value='OtherValue' />")
               };
            });
            it("Should call fieldDurationActive", function () {
               widget.onDeleteDate(event);
               expect(event.target.val()).toBe("");
            });
            describe("when click cancel popup", function () {
               beforeEach(function () {
                  spyOn(widget, "removePopupWidgets").and.callThrough();
               });
               it("Should remove popup widgets", function () {
                  widget.formEditActivity.buttonCancel.click();
                  expect(widget.removePopupWidgets).toHaveBeenCalled();
               });
            });

            describe("when click update popup", function () {
               describe("When pamareters aren't good", function () {
                  beforeEach(function () {
                     spyOn(widget.dataService, 'editActivityPlan');
                  });
                  it("Shouldn't call editActivityPlan", function () {
                     widget.formEditActivity.buttonUpdate.click();
                     expect(widget.dataService.editActivityPlan).not.toHaveBeenCalled();
                  });
               });
               describe("When pamareters are good", function () {
                  beforeEach(function () {
                     spyOn(widget.dataService, 'editActivityPlan');
                     spyOn(widget, "validateParamsOfFormEditActivity").and.callFake(function(){
                        return true;
                     });
                  });
                  it("Should call editActivityPlan", function () {
                     widget.formEditActivity.buttonUpdate.click();
                     expect(widget.dataService.editActivityPlan).toHaveBeenCalled();
                  });
               });
            });
            describe("datePicker", function () {
               describe("selecte date plugin", function () {
                  beforeEach(function () {
                     spyOn(widget, "fieldDurationActive");
                  });
                  it("Should activate duration", function () {
                     widget.formEditActivity.date.datepicker("setDate", new Date(2013,9,22) );
                     $('.ui-datepicker-current-day').click(); // rapresent the current
                     expect(widget.fieldDurationActive).toHaveBeenCalledWith(false);
                  });
               });
            });
         });

         describe("onTypeDuration", function () {
            describe("when value is different to empty", function () {
               beforeEach(function () {
                  spyOn(widget, "deactivateElement").and.callThrough();
                  event = {
                     target: $("<input value='OtherValue' />")
                  }
               });
               it("Should deactived", function () {
                  widget.onTypeDuration(event);
                  expect(widget.deactivateElement).toHaveBeenCalled();
               });
            });
            describe("when value is empty", function () {
               beforeEach(function () {
                  spyOn(widget, "activateElement").and.callThrough();
                  event = {
                     target: $("<input value='' />")
                  }
               });
               it("Should deactived", function () {
                  widget.onTypeDuration(event);
                  expect(widget.activateElement).toHaveBeenCalled();
               });
            });
         });
         describe("onSelectMenu", function () {
            beforeEach(function () {
               spyOn(widget, "onClickOpenPopupEdition");
               event = {
                  currentTarget: $('<li></li>')
               };
               ui = {
                  item: $('<div></div>')
               };
               ui.item.data('item', 'edit');
            });
            it("Should call onClickOpenPopupEdition", function () {
               widget.onSelectMenu(event, ui);
               expect(widget.onClickOpenPopupEdition).toHaveBeenCalled();
            });
         });
         describe("favorite", function () {
            beforeEach(function () {
               spyOn(widget.dataService, "addFavorite").and.callFake(function(){
                  return {idFavorites: "GUIDFAVORITE"};
               });
               spyOn(widget.dataService, "delFavorite");
            });
            it("Should services", function () {
               $(".case-summary-favorite", widget.getContent()).click();
               expect(widget.dataService.addFavorite).toHaveBeenCalled();
               $(".case-summary-favorite", widget.getContent()).removeClass("bz-icon-star-outline");
               $(".case-summary-favorite", widget.getContent()).click();
               expect(widget.dataService.delFavorite).toHaveBeenCalled();
            });
         });
      });

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
