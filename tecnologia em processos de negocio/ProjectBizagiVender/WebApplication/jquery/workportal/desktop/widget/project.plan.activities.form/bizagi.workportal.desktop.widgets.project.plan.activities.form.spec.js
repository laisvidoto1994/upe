/**
 * Initialize desktop.widgets.project.plan.activities.form widget and test it
 *
 * @author David Romero Estrada
 */


describe("Widget desktop.widgets.project.plan.activities.form", function () {
   checkWorkportalDependencies();
   var widget, notifier;

   bizagi.currentUser = {
      "idUser": 1,
      "user": "domain\admon",
      "userName": "admon",
      "uploadMaxFileSize": 1048576
   };

   it("Environment has been defined", function (done) {
      var params = {
         "activityParams": {
            "idUserCreator": 1,
            "name": "david",
            "idParent": 2002,
            "differenceMillisecondsServer": -28,
            "guidPlan": "7270dc7e-0abd-4501-8f5c-1aeecade04ef",
            "supportNav": false
         },
         "differenceMillisecondsServer": -28,
         "activityName": "actividad",
         "planUserCreator": 1,
         "guidActivity": "0744fae1-f6ba-4aea-8d8b-aaf2b6196d32",
         "guidPlan": "7270dc7e-0abd-4501-8f5c-1aeecade04ef",
         plan: {}
      };
      notifier = bizagi.injector.get("notifier");

      widget = new bizagi.workportal.desktop.widgets.project.plan.activities.form(dependencies.workportalFacade, dependencies.dataService, notifier, params);

      $.when(widget.areTemplatedLoaded()).done(function () {
         $.when(widget.renderContent()).done(function (html) {
            dependencies.canvas.empty();
            dependencies.canvas.append(html);
            done();
         });
      });
   });

   describe("events and render", function () {
      beforeEach(function () {
         spyOn(widget, "deactivateElement");
         spyOn(widget, "activateElement");
      });
      it("should set events handler", function () {
         spyOn(widget, "eventsHandler").and.callThrough();
         widget.postRender();

         expect(widget.eventsHandler).toHaveBeenCalled();
         expect($.isEmptyObject(widget.form)).toBe(false);
         expect($.isEmptyObject(widget.form)).toBe(false);

      });

      it("Should be activateElement when value is number", function () {
         widget.form.duration.spinner( "value", 500 );
         expect(widget.deactivateElement).toHaveBeenCalled();
      });

      it("should deactivate datePicker", function() {
         var event = {
            sender: {
               _value: "123"
            },
            target: $('<input value="2015/02/03" />')
         };
         widget.onTypeDuration(event);
         expect(widget.deactivateElement).toHaveBeenCalled();
      });

      it("should activate datePicker", function() {
         var event = {
            sender: {
               _value: "123"
            },
            target: $('<input value="" />')
         };

         widget.onTypeDuration(event);
         expect(widget.activateElement).toHaveBeenCalled();
      });

      describe("function onChangeForm", function () {
         describe("When normal activity", function () {
            beforeEach(function () {
               params = {
                  args: {
                     idActivityShow: "04987b17-1a6e-4e8d-92a4-2f7d0a3c45be",
                     isEditableFormActivity: true
                  }
               };
               widget.params = JSON.parse('{"idCase":5705,"idWorkflow":16,"idWorkitem":10466,"idTask":75,"eventAsTasks":false,"onlyUserWorkItems":"true","formsRenderVersion":2,"referrer":"inboxGrid","isComplex":false,"onClose":"","isOfflineForm":false,"hasWorkItems":true,"hasGlobalForm":"false","widgetName":"projectDashboard","radNumber":"5703","supportNav":false,"contextsSidebarActivity":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE"],"contextsWithoutLeftSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsLeftSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"contextsWithoutRightSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsRightSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"caseNumber":"5703","process":"process without begin form myself","processPath":"App > Processes > process without begin form myself","creationDate":"11/26/2015 09:08","estimatedSolutionDate":"11/26/2015 09:08","solutionDate":"11/26/2015 09:08","isOpen":true,"idParentCase":5703,"radNumberParentCase":"5703","isFavorite":"false","guidFavorite":"","parentDisplayName":"Proceso Padre","canAccesToParentProcess":"true","isDelegatedCase":"false","isAborted":"false","hasComments":"false","countEvents":0,"countSubProcesses":0,"countAssigness":1,"helpUrl":"","currentState":[{"assignToCurrentUser":"true","estimatedSolutionDate":"11/26/2015 09:08","isEvent":"false","allowReleaseActivity":false,"idTask":75,"state":"activitprocess without begin form myself","colorState":"Red","helpUrl":"","tskDescription":"","idWorkItem":"10466","allowsReassign":"false","entryDateWorkItem":"11/26/2015 09:08","guidWorkItem":"268c4d7d-4fbe-4e4b-abeb-8778a47acc15"}],"caseDescription":"","createdBy":{"userName":"Client","Name":"AManda Client","userId":3},"contextualized":true,"createdByName":"AManda Client","createdByUserName":"Client","showWorkOnIt":true,"showEvents":false,"showParentProcess":true,"parentProcess":{"displayName":"Proceso Padre","idCase":5703,"idTask":75},"isClosed":false,"showAssignees":true,"showSubProcess":false,"showForm":false,"allowsReassign":"false","currentStateTypes":["(see object with key 0)"],"showActivities":true,"differenceMillisecondsServer":-31,"plan":{"idActivitySelected":"04987b17-1a6e-4e8d-92a4-2f7d0a3c45be","contextualized":true,"id":"1e218687-95ef-46fc-8be7-89640497b21b","name":"tdrfghbj","description":"(see object with key templatesDeferred)","currentState":"PENDING","parentWorkItem":"268c4d7d-4fbe-4e4b-abeb-8778a47acc15","creationDate":1449006992550,"startDate":"(see object with key templatesDeferred)","dueDate":"(see object with key templatesDeferred)","idUserCreator":3,"waitForCompletion":true,"activities":[{"id":"e93050c2-0f57-4f5c-85a7-6c66dbc8df8b","name":"ghjghjghj","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"1e218687-95ef-46fc-8be7-89640497b21b","userAssigned":3,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":"(see object with key templatesDeferred)","estimatedFinishDate":"(see object with key templatesDeferred)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0},{"id":"04987b17-1a6e-4e8d-92a4-2f7d0a3c45be","name":"ghjghj","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"1e218687-95ef-46fc-8be7-89640497b21b","userAssigned":3,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":"(see object with key templatesDeferred)","estimatedFinishDate":"(see object with key templatesDeferred)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0}],"users":[],"firstParent":{"idCase":5705,"idWorkflow":16,"idWorkitem":10466,"idTask":75,"radNumber":"5703","displayName":"Activity_1","isWorkitemClosed":false},"parent":{"idCase":5705,"idWorkflow":16,"idWorkitem":10466,"idTask":75,"radNumber":"5703","displayName":"Activity_1","isWorkitemClosed":false}},"guidWorkItem":"268c4d7d-4fbe-4e4b-abeb-8778a47acc15","planChild":{"id":"1e218687-95ef-46fc-8be7-89640497b21b"},"menuDashboard":{"showFormOverview":false,"showPlanOptionMenu":true,"showFormActivity":true,"contextFormActivityOptionMenu":"ACTIVITY","contextPlanOptionMenu":"PLANACTIVITIES"},"histName":"Plan","level":1,"showContextByMenuDashboard":"PLANACTIVITIES","isFavoriteCase":"bz-icon-star-outline","refreshLastItemBreadcrumb":false,"creationDateFormat":"Noviembre 26","solutionDateFormat":"Noviembre 26","relativeTimeState":"hace 2 días abierto","colorStateCase":"Opened","percentCompleteBar":100,"statePlan":"PENDING_PLAN","statePendingPlan":"PENDING_PLAN","stateExecutingPlan":"EXECUTING_PLAN","contextPlanActivities":"PLANACTIVITIES","showFormAddActivityByNotFinishedAllActivities":true,"isEditableFormActivity":true,"idActivityToShow":"04987b17-1a6e-4e8d-92a4-2f7d0a3c45be"}');
            });
            it("Should dont show errors", function () {
               widget.onChangeForm({}, params);
            });
         });

         describe("When activity have items and form not editable", function () {
            beforeEach(function () {
               params = JSON.parse('{"context":"EDITACTIVITY","data":{"widgets":{"rightSidebar":{"layout":"contentrightsidebar","name":"bizagi.workportal.widgets.right.sidebar"},"activitiesForm":{"layout":"rightSidebar","name":"bizagi.workportal.desktop.widgets.project.plan.activities.form","canvas":"sidebarcontent1"},"empty1":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontentextra"},"empty2":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontent2"},"empty3":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontent3"},"empty4":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontent4"},"empty5":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontent5"},"empty6":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontent6"}},"nav":{"level":0,"refreshLastItemBreadcrumb":false},"belongs":{"toLeftSidebarCD":true,"toRightSidebarCD":true,"toTaskSidebarCD":false},"level":1},"type":"EDITACTIVITY","args":{"idCase":6421,"idWorkflow":3,"idWorkitem":11458,"idTask":5,"eventAsTasks":false,"onlyUserWorkItems":"true","formsRenderVersion":2,"referrer":"inboxGrid","isComplex":false,"onClose":"","isOfflineForm":false,"hasWorkItems":true,"hasGlobalForm":"false","widgetName":"projectDashboard","radNumber":"6421","supportNav":false,"contextsSidebarActivity":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE"],"contextsWithoutLeftSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsLeftSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"contextsWithoutRightSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsRightSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"caseNumber":"6421","process":"Schedule personal trainer","processPath":"App > Processes > Schedule personal trainer","creationDate":"12/02/2015 09:44","estimatedSolutionDate":"05/31/2027 19:00","solutionDate":"12/02/2015 09:44","isOpen":true,"idParentCase":-1,"radNumberParentCase":"","isFavorite":"true","guidFavorite":"c77dfbe7-f1a0-4698-8067-10c8f1f8c2db","parentDisplayName":"","canAccesToParentProcess":"false","isDelegatedCase":"false","isAborted":"false","hasComments":"false","countEvents":1,"countSubProcesses":0,"countAssigness":2,"helpUrl":"","currentState":[{"assignToCurrentUser":"true","estimatedSolutionDate":"05/31/2027 19:00","isEvent":"true","allowReleaseActivity":false,"idTask":77,"state":"Cancel","colorState":"Green","helpUrl":"","tskDescription":"","idWorkItem":"11459","allowsReassign":"false","entryDateWorkItem":"12/02/2015 14:44","guidWorkItem":"fc3c8a23-5972-48c6-8758-57740a2036b4"},{"assignToCurrentUser":"true","estimatedSolutionDate":"12/02/2015 09:44","isEvent":"false","allowReleaseActivity":false,"idTask":5,"state":"Schedule personal session","colorState":"Red","helpUrl":"","tskDescription":"","idWorkItem":"11458","allowsReassign":"false","entryDateWorkItem":"12/02/2015 14:44","guidWorkItem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a"}],"caseDescription":"","createdBy":{"userName":"AJones","Name":"Addison Jones","userId":207},"contextualized":true,"createdByName":"Addison Jones","createdByUserName":"AJones","showWorkOnIt":true,"showEvents":true,"showParentProcess":false,"parentProcess":{"displayName":"","idCase":-1,"idTask":5},"isClosed":false,"showAssignees":true,"showSubProcess":false,"showForm":false,"allowsReassign":"false","currentStateTypes":["(see object with key 1)"],"showActivities":true,"differenceMillisecondsServer":-31,"plan":{"idActivitySelected":"0c2b3b0c-b2d6-4892-8931-c75f0cdf8075","contextualized":true,"id":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","name":"asdf","description":"asdfa","currentState":"EXECUTING","parentWorkItem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a","creationDate":1449236567540,"startDate":1449263184210,"dueDate":"(see object with key templatesDeferred)","idUserCreator":207,"waitForCompletion":true,"activities":[{"id":"ba50a8e2-f3a4-477e-af1f-342b8a91ea22","name":"asdf","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","userAssigned":207,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":1449263184023,"estimatedFinishDate":1449263184027,"items":[],"idWorkItem":11501,"workItemState":"Inactive","idCase":6501,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"classEnabledActionActivities":"disabled"},{"id":"4577d14a-953d-4e66-835e-4b22c1b0bfa9","name":"asdf","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","userAssigned":207,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":"(see object with key templatesDeferred)","estimatedFinishDate":"(see object with key templatesDeferred)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"classEnabledActionActivities":"enabled"},{"id":"0c2b3b0c-b2d6-4892-8931-c75f0cdf8075","name":"ACTIVIDAD CON ITEMS","description":"descripcion","allowEdition":true,"idPlan":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","userAssigned":207,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":"(see object with key templatesDeferred)","estimatedFinishDate":1449723600000,"items":[{"name":"Item 1","resolved":false},{"name":"Item 2","resolved":false},{"name":"Item 3","resolved":false},{"name":"Item 4","resolved":false}],"status":"nodisplay","numResolvedItems":0,"numTotalItems":4,"classEnabledActionActivities":"enabled"}],"users":[],"firstParent":{"idCase":6421,"idWorkflow":3,"idWorkitem":11458,"idTask":5,"radNumber":"6421","displayName":"Activity_1","isWorkitemClosed":false},"parent":{"idCase":6421,"idWorkflow":3,"idWorkitem":11458,"idTask":5,"radNumber":"6421","displayName":"Activity_1","isWorkitemClosed":false}},"guidWorkItem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a","planChild":{"id":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d"},"menuDashboard":{"showFormOverview":false,"showPlanOptionMenu":true,"showFormActivity":true,"contextFormActivityOptionMenu":"ACTIVITY","contextPlanOptionMenu":"PLANACTIVITIES"},"histName":"Plan","level":1,"showContextByMenuDashboard":"PLANACTIVITIES","isFavoriteCase":"bz-icon-star","refreshLastItemBreadcrumb":false,"creationDateFormat":"Diciembre 02","solutionDateFormat":"Diciembre 02","relativeTimeState":"hace 1 día abierto","colorStateCase":"Opened","percentCompleteBar":100,"events":[{"idTask":77,"idWorkitem":"11459","displayName":"Cancel","idCase":6421,"idWorkFlow":3}],"statePlan":"EXECUTING_PLAN","statePendingPlan":"PENDING_PLAN","stateExecutingPlan":"EXECUTING_PLAN","contextPlanActivities":"PLANACTIVITIES","showFormAddActivityByNotFinishedAllActivities":true,"isEditableFormActivity":true,"idActivityToShow":"0c2b3b0c-b2d6-4892-8931-c75f0cdf8075"}}');
               params.args.isEditableFormActivity = false;
               widget.params = params.args;
            });
            it("Should be dont errors", function () {
               widget.onChangeForm({}, params);
            });
         });
      });
   });

   describe("function onSelectMenu", function () {
      beforeEach(function () {
         spyOn(widget, "onClickMenuDeleteActivity");
         event = {
            currentTarget: $('<li class="ui-menu-item" data-item="delete"><a href="javascript:void(0);" class="ui-state-focus">Eliminar</a></li>')
         };
         ui = {
            item: $('<li class="ui-menu-item" data-item="delete"><a href="javascript:void(0);" class="ui-state-focus">Eliminar</a></li>')
         }
      });
      it("Should call onClickMenuDeleteActivity", function () {
         widget.onSelectMenu(event, ui);
         expect(widget.onClickMenuDeleteActivity).toHaveBeenCalled();
      });
   });

   describe("function onClickMenuDeleteActivity", function () {
      beforeEach(function () {
         spyOn(widget, "pub");
         spyOn(bizagi, "showConfirmationBox").and.callFake(function(){
            var defer = $.Deferred();
            defer.resolve();
            return defer.promise();
         });
         spyOn(widget.dataService, "deleteActivityPlan").and.callFake(function(){
            var defer = $.Deferred();
            defer.resolve();
            return defer.promise();
         })
      });
      it("Should be call widget.pub twice", function () {
         widget.onClickMenuDeleteActivity();
         expect(widget.pub.calls.count()).toBe(2);
      });
   });

   describe("function onKeyPressInputItem", function () {
      describe("When press ENTER", function () {
         beforeEach(function () {
            spyOn(widget, "addNewItem");
            event = {
               keyCode: "13",
               target: $('<input class="inputtext" type="text" value="Item 4" title="Item 4" placeholder="Enter name item">')
            }
         });
         it("Should addNewItem", function () {
            widget.onKeyPressInputItem(event);
            expect(widget.addNewItem).toHaveBeenCalled();
         });
      });

      describe("When press SCAPE and NOT last position item", function () {
         beforeEach(function () {
            html = $('<div class="list-items"><div class="item"> <div class="check"> <input type="checkbox" disabled="" readonly=""> </div><input class="inputtext" type="text" value="Item 1" title="Item 1" placeholder="Enter name item"> <div class="showtext">Item 1</div><div class="item-button delete"> <i class="bz-icon bz-icon-16 bz-icon-trash"></i> </div></div><div class="item"> <div class="check"> <input type="checkbox" disabled="" readonly=""> </div><input class="inputtext" type="text" value="Item 2" title="Item 2" placeholder="Enter name item"> <div class="showtext">Item 2</div><div class="item-button delete"> <i class="bz-icon bz-icon-16 bz-icon-trash"></i> </div></div><div class="item"> <div class="check"> <input type="checkbox" disabled="" readonly=""> </div><input class="inputtext" type="text" value="Item 3" title="Item 3" placeholder="Enter name item"> <div class="showtext">Item 3</div><div class="item-button delete"> <i class="bz-icon bz-icon-16 bz-icon-trash"></i> </div></div><div class="item edit"> <div class="check"> <input type="checkbox" disabled="" readonly=""> </div><input class="inputtext" type="text" value="Item 4" title="Item 4" placeholder="Enter name item"> <div class="showtext">Item 4</div><div class="item-button delete"> <i class="bz-icon bz-icon-16 bz-icon-trash"></i> </div></div></div>');
            event = {
               keyCode: "27",
               target: $('input:eq(2)', html)
            }
         });
         it("Should set focus", function () {
            widget.onKeyPressInputItem(event);
         });
      });

      describe("function getDataActivityForm", function () {
         beforeEach(function () {
            params = JSON.parse('{"context":"EDITACTIVITY","data":{"widgets":{"rightSidebar":{"layout":"contentrightsidebar","name":"bizagi.workportal.widgets.right.sidebar"},"activitiesForm":{"layout":"rightSidebar","name":"bizagi.workportal.desktop.widgets.project.plan.activities.form","canvas":"sidebarcontent1"},"empty1":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontentextra"},"empty2":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontent2"},"empty3":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontent3"},"empty4":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontent4"},"empty5":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontent5"},"empty6":{"layout":"rightSidebar","name":"bizagi.workportal.widgets.dummy","canvas":"sidebarcontent6"}},"nav":{"level":0,"refreshLastItemBreadcrumb":false},"belongs":{"toLeftSidebarCD":true,"toRightSidebarCD":true,"toTaskSidebarCD":false},"level":1},"type":"EDITACTIVITY","args":{"idCase":6421,"idWorkflow":3,"idWorkitem":11458,"idTask":5,"eventAsTasks":false,"onlyUserWorkItems":"true","formsRenderVersion":2,"referrer":"inboxGrid","isComplex":false,"onClose":"","isOfflineForm":false,"hasWorkItems":true,"hasGlobalForm":"false","widgetName":"projectDashboard","radNumber":"6421","supportNav":false,"contextsSidebarActivity":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE"],"contextsWithoutLeftSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsLeftSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"contextsWithoutRightSidebarCaseDashboard":["HOME","TEMPLATEENGINE-VIEW","ENTITY-ENGINE-VIEW","SEARCH-ENGINE-VIEW","CASES-TEMPLATE-VIEW","PLANS-VIEW","REFRESHALL"],"contextsRightSidebarCaseDashboard":["ACTIVITY","OVERVIEW","COMMENTS","FILES","PROCESSMAP","LOG","PLANCREATE","PLANOVERVIEW","PLANACTIVITIES","PLANFILES","PLANCOMMENTS","PLANSIDEBAR","EDITACTIVITY","ACTIVITYPLAN","ACTIVITYPLANCREATE","ACTIVITYPLANOVERVIEW","ACTIVITYPLANCOMMENTS","ACTIVITYPLANFILES","ACTIVITYPLANPROCESSMAP","ACTIVITYPLANLOG"],"caseNumber":"6421","process":"Schedule personal trainer","processPath":"App > Processes > Schedule personal trainer","creationDate":"12/02/2015 09:44","estimatedSolutionDate":"05/31/2027 19:00","solutionDate":"12/02/2015 09:44","isOpen":true,"idParentCase":-1,"radNumberParentCase":"","isFavorite":"true","guidFavorite":"c77dfbe7-f1a0-4698-8067-10c8f1f8c2db","parentDisplayName":"","canAccesToParentProcess":"false","isDelegatedCase":"false","isAborted":"false","hasComments":"false","countEvents":1,"countSubProcesses":0,"countAssigness":2,"helpUrl":"","currentState":[{"assignToCurrentUser":"true","estimatedSolutionDate":"05/31/2027 19:00","isEvent":"true","allowReleaseActivity":false,"idTask":77,"state":"Cancel","colorState":"Green","helpUrl":"","tskDescription":"","idWorkItem":"11459","allowsReassign":"false","entryDateWorkItem":"12/02/2015 14:44","guidWorkItem":"fc3c8a23-5972-48c6-8758-57740a2036b4"},{"assignToCurrentUser":"true","estimatedSolutionDate":"12/02/2015 09:44","isEvent":"false","allowReleaseActivity":false,"idTask":5,"state":"Schedule personal session","colorState":"Red","helpUrl":"","tskDescription":"","idWorkItem":"11458","allowsReassign":"false","entryDateWorkItem":"12/02/2015 14:44","guidWorkItem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a"}],"caseDescription":"","createdBy":{"userName":"AJones","Name":"Addison Jones","userId":207},"contextualized":true,"createdByName":"Addison Jones","createdByUserName":"AJones","showWorkOnIt":true,"showEvents":true,"showParentProcess":false,"parentProcess":{"displayName":"","idCase":-1,"idTask":5},"isClosed":false,"showAssignees":true,"showSubProcess":false,"showForm":false,"allowsReassign":"false","currentStateTypes":["(see object with key 1)"],"showActivities":true,"differenceMillisecondsServer":-31,"plan":{"idActivitySelected":"0c2b3b0c-b2d6-4892-8931-c75f0cdf8075","contextualized":true,"id":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","name":"asdf","description":"asdfa","currentState":"EXECUTING","parentWorkItem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a","creationDate":1449236567540,"startDate":1449263184210,"dueDate":"(see object with key templatesDeferred)","idUserCreator":207,"waitForCompletion":true,"activities":[{"id":"ba50a8e2-f3a4-477e-af1f-342b8a91ea22","name":"asdf","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","userAssigned":207,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":1449263184023,"estimatedFinishDate":1449263184027,"items":[],"idWorkItem":11501,"workItemState":"Inactive","idCase":6501,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"classEnabledActionActivities":"disabled"},{"id":"4577d14a-953d-4e66-835e-4b22c1b0bfa9","name":"asdf","description":"(see object with key templatesDeferred)","allowEdition":true,"idPlan":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","userAssigned":207,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":"(see object with key templatesDeferred)","estimatedFinishDate":"(see object with key templatesDeferred)","items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"classEnabledActionActivities":"enabled"},{"id":"0c2b3b0c-b2d6-4892-8931-c75f0cdf8075","name":"ACTIVIDAD CON ITEMS","description":"descripcion","allowEdition":true,"idPlan":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","userAssigned":207,"duration":"(see object with key templatesDeferred)","progress":0,"finishDate":"(see object with key templatesDeferred)","startDate":"(see object with key templatesDeferred)","estimatedFinishDate":1449723600000,"items":[{"name":"Item 1","resolved":false},{"name":"Item 2","resolved":false},{"name":"Item 3","resolved":false},{"name":"Item 4","resolved":false}],"status":"nodisplay","numResolvedItems":0,"numTotalItems":4,"classEnabledActionActivities":"enabled"}],"users":[],"firstParent":{"idCase":6421,"idWorkflow":3,"idWorkitem":11458,"idTask":5,"radNumber":"6421","displayName":"Activity_1","isWorkitemClosed":false},"parent":{"idCase":6421,"idWorkflow":3,"idWorkitem":11458,"idTask":5,"radNumber":"6421","displayName":"Activity_1","isWorkitemClosed":false}},"guidWorkItem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a","planChild":{"id":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d"},"menuDashboard":{"showFormOverview":false,"showPlanOptionMenu":true,"showFormActivity":true,"contextFormActivityOptionMenu":"ACTIVITY","contextPlanOptionMenu":"PLANACTIVITIES"},"histName":"Plan","level":1,"showContextByMenuDashboard":"PLANACTIVITIES","isFavoriteCase":"bz-icon-star","refreshLastItemBreadcrumb":false,"creationDateFormat":"Diciembre 02","solutionDateFormat":"Diciembre 02","relativeTimeState":"hace 1 día abierto","colorStateCase":"Opened","percentCompleteBar":100,"events":[{"idTask":77,"idWorkitem":"11459","displayName":"Cancel","idCase":6421,"idWorkFlow":3}],"statePlan":"EXECUTING_PLAN","statePendingPlan":"PENDING_PLAN","stateExecutingPlan":"EXECUTING_PLAN","contextPlanActivities":"PLANACTIVITIES","showFormAddActivityByNotFinishedAllActivities":true,"isEditableFormActivity":true,"idActivityToShow":"0c2b3b0c-b2d6-4892-8931-c75f0cdf8075"}}');
            params.args.isEditableFormActivity = false;
            widget.params = params.args;
         });
         it("Should dont generate errors", function () {
            widget.getDataActivityForm();
         });
      });
      describe("function validateParams", function(){
         beforeEach(function () {
            spyOn($.fn, "html").and.callThrough();
            spyOn($.fn, "empty").and.callThrough();
         });
         it("When name is empty return false and show message", function () {
            expect(widget.validateParams("")).toBe(false);
            expect($.fn.html).toHaveBeenCalled();
         });
         it("When name is not empty return true and always delete messages error", function(){
            expect(widget.validateParams("Name fake")).toBe(true);
            expect($.fn.empty).toHaveBeenCalled();
         });
      });
   });
});
