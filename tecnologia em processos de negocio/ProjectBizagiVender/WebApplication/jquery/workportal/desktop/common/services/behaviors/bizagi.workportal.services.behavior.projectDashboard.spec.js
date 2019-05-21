/**
 * Service Development with TDD
 * Please, before change Service, run test
 *
 * INFORMATION:
 * - A instance plan is a register on table wfcase
 * - A instance case is a register on table wfcase
 * - A task is a workitem of case
 * - A activity is a workitem of plan
 */

describe("bizagi.workportal.services.behavior.project.dashboard", function () {
   checkWorkportalDependencies();
   var dataService;
   var params;
   var servicesPD;
   var currentState;
   
   beforeEach(function(){
      dataService = bizagi.injector.get("dataService");
      servicesPD = new bizagi.workportal.services.behaviors.projectDashboard(dataService, params);
   });


   it("dependencies should defined", function(){
      expect(dataService).toBeDefined();
      expect(servicesPD).toBeDefined();
   });


   describe("The context will be show", function(){
      //scenario 1
      describe("when idCase have value on params", function(){
         beforeEach(function(){
            params = {idCase: 123};
            spyOn(servicesPD, "callDataServicesForBehaviorDashboard");
         });
         it("should be calculated", function(){
            servicesPD.getContextToShow(params);
            expect(servicesPD.callDataServicesForBehaviorDashboard).toHaveBeenCalledWith(params);
         });
      });
      //scenario 2
      describe("when idCase NOT have value or undefined or null", function(){
         var resultDeferred;
         beforeEach(function(done){
            params = {};
            $.when(servicesPD.getContextToShow(params)).done(function(result){
               resultDeferred = result;
               done();
            });
         });
         it("should be HOME", function(){
            expect(resultDeferred.contextToShow).toBe(servicesPD.CONTEXT_HOME);
         });
      });
   });

   describe("The RADNUMBER", function(){

      describe("when the typeworkitem is activity of plan decontextualized", function(){
         var responseRadNumber;
         var params = {idCase: 123};
         var responseSummary = {idPlan: "GUIDPLAN"};
         var idPlanFirstPlanResolved = "firstPlan-e2b6-4e99-b452-bf10ecfb9379";
         beforeEach(function(done){
            spyOn(servicesPD, "getFirstParentPlan").and.callFake(function(){
               return {
                  id: idPlanFirstPlanResolved
               };
            });
            $.when(servicesPD.getRadNumber(params, responseSummary, false)).done(function(result){
               responseRadNumber = result;
               done();
            });
         });
         it("Should be idPlanFirstPlanResolved", function(){
            expect(responseRadNumber).toBe(idPlanFirstPlanResolved);
         });
      });
      describe("when the typeworkitem NOT is activity of plan decontextualized", function(){
         describe("when property radNumber belong to params", function(){
            var responseRadNumber;
            var params = {idCase: 123, radNumber: "rad567"};
            beforeEach(function(done){
               $.when(servicesPD.getRadNumber(params, null, true)).done(function(result){
                  responseRadNumber = result;
                  done();
               });
            });
            it("Should be radNumber", function(){
               expect(responseRadNumber).toBe(params.radNumber);
            });
         });
         describe("when property radNumber NOT belong to params", function(){
            var responseRadNumber;
            var params = {idCase: 123};
            beforeEach(function(done){
               $.when(servicesPD.getRadNumber(params, null, true)).done(function(result){
                  responseRadNumber = result;
                  done();
               });
            });
            it("Should be idCase", function(){
               expect(responseRadNumber).toBe(params.idCase);
            });
         });
      });

      describe("When access from plan dashboard", function () {
         describe("when plan is contextualized", function () {
            beforeEach(function (done) {
               spyOn(servicesPD, "getFirstParentCase").and.callFake(function(){
                  return {
                     idCase: "345"
                  };
               });
               $.when(servicesPD.getRadNumberForPlanDashboard("idplan", true)).done(function(){
                  done();
               });
            });
            it("Should call firstParentCase and return idCase", function () {
               expect(servicesPD.getFirstParentCase).toHaveBeenCalled();
            });
         });
         describe("when plan is not contextualized", function () {
            beforeEach(function (done) {
               spyOn(servicesPD, "getFirstParentPlan").and.callFake(function(){
                  return {
                     idCase: "345"
                  };
               });
               $.when(servicesPD.getRadNumberForPlanDashboard("idplan", false)).done(function(){
                  done();
               });
            });
            it("Should call firstParentPlan", function () {
               expect(servicesPD.getFirstParentPlan).toHaveBeenCalled();
            });
         });
      });
   });

   describe("The workitem", function(){
      describe("The Type", function(){
         describe("when responseGetSummary have property idPlan", function(){
            it("should be activity", function(){
               expect(servicesPD.getTypeWorkItem({idPlan: "GUIDVALUE"})).toBe(servicesPD.TYPE_WORKITEM_ACTIVITY);
            });
         });

         describe("when responseGetSummary not have property idPlan", function(){
            it("should be task", function(){
               expect(servicesPD.getTypeWorkItem({})).toBe(servicesPD.TYPE_WORKITEM_TASK);
            });
         });
      });
      describe("belong current user or get currentState", function(){
         describe("when currentState have values", function(){
            beforeEach(function(){
               currentState = [{idWorkItem:"Guid1"}];
               responseSummaryCase = {currentState: [{idActivity: "Guid1", displayName: "Name activity"}]}
            });
            describe("When the property idWorkitem from self.params exist on array currentState", function(){
               it("Should return object", function(){
                  params = {idWorkitem: "Guid1"};
                  expect(servicesPD.getIsCurrentUserAssignedToWorkitem(currentState, params.idWorkitem)).toEqual(jasmine.any(Object));

                  expect(servicesPD.getIsCurrentUserAssignedToWorkitem(currentState, params.idWorkitem, responseSummaryCase.currentState[0]).displayName).
                     toBe(responseSummaryCase.currentState[0].displayName);
               });
            });
            describe("When the property idWorkitem from self.params NOT exist on array currentState", function(){
               it("Should be false", function(){
                  params = {};
                  expect(servicesPD.getIsCurrentUserAssignedToWorkitem(currentState, params.idWorkitem, responseSummaryCase)).toBe(false);
               });
            });
         });
         describe("when currentState dont have value", function(){
            beforeEach(function(){
               currentState = [];
            });
            it("Should be null", function(){
               expect(servicesPD.getIsCurrentUserAssignedToWorkitem(currentState, "anyValue")).toBe(null);
            });
         });

      });

      describe("The name", function(){
         describe("when type workitem is task", function(){
            describe("when belong current user", function(){
               describe("When is opened", function(){
                  it("Should be name of currentWorkItem, specifically, its property state", function(){
                     currentState = {state: "Name task"};
                     expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, true, currentState).
                        nameWorkItem).toBe(currentState.state);
                  });
               });
               describe("When is closed", function(){
                  it("Should be name of currentWorkItem, specifically, its property state", function(){
                     currentState = {state: "Name task"};
                     expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, false, currentState).
                        nameWorkItem).toBe(currentState.state);
                  });
               });
            });
            describe("when NOT belong current user", function(){
               beforeEach(function(){
                  spyOn(bizagi.localization, "getResource");
               });

               it("Should be 'Activity'", function(){
                  currentState = {state: "Name task"};
                  servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, false, true, currentState);
                  expect(bizagi.localization.getResource).toHaveBeenCalledWith("workportal-project-casedashboard-activity");
               });
            });
         });
         describe("when type workitem is activity", function(){
            describe("when belong current user", function(){
               it("Should be name of currentWorkItem, specifically, its property display", function(){
                  currentWorkItem = {displayName: "Name activity"};
                  expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_ACTIVITY, true, true, currentWorkItem).
                     nameWorkItem).toBe(currentWorkItem.displayName);
               });
            });
            describe("when NOT belong current user", function(){
               beforeEach(function(){
                  spyOn(bizagi.localization, "getResource");
               });
               it("Should be 'Activity'", function(){
                  currentWorkItem = {displayName: "Name activity"};
                  servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_ACTIVITY, false, false, currentWorkItem);
                  expect(bizagi.localization.getResource).toHaveBeenCalledWith("workportal-project-casedashboard-activity");
               });
            });
         });
      });
   });

   describe("The context load when click button menu plan", function(){
      describe("When workitem is type task and have plan", function(){
         it("Should be PLANACTIVITIES", function(){
            expect(servicesPD.getContextActionWhenClickButtonPlan(servicesPD.TYPE_WORKITEM_TASK, true)).toBe(servicesPD.CONTEXT_PLANACTIVITIES);
         });
      });
      describe("When workitem is type task and NOT have plan", function(){
         it("Should be PLANCREATE", function(){
            expect(servicesPD.getContextActionWhenClickButtonPlan(servicesPD.TYPE_WORKITEM_TASK, false)).toBe(servicesPD.CONTEXT_PLANCREATE);
         });
      });
      describe("When workitem is type activity and have plan", function(){
         it("Should be PLANACTIVITIES", function(){
            expect(servicesPD.getContextActionWhenClickButtonPlan(servicesPD.TYPE_WORKITEM_ACTIVITY, true)).toBe(servicesPD.CONTEXT_PLANACTIVITIES);
         });
      });
      describe("When workitem is type activity and NOT have plan", function(){
         it("Should be ACTIVITYPLANCREATE", function(){
            expect(servicesPD.getContextActionWhenClickButtonPlan(servicesPD.TYPE_WORKITEM_ACTIVITY, false)).toBe(servicesPD.CONTEXT_ACTIVITYPLANCREATE);
         });
      });
   });

   describe("Visible buttons menu dashboard", function(){
      describe("Button overview", function(){
         describe("When workitem is task", function(){
            it("Should be return true only if the task belong to user and have showForm", function(){
                params = {showForm: true, hasGlobalForm: false};
                expect(servicesPD.getIsVisibleButtonOverview(servicesPD.TYPE_WORKITEM_TASK, params)).toBe(true);
                params = {showForm: false, hasGlobalForm: true};
                expect(servicesPD.getIsVisibleButtonOverview(servicesPD.TYPE_WORKITEM_TASK, params)).toBe(false);
                params = {showForm: false, hasGlobalForm: false};
                expect(servicesPD.getIsVisibleButtonOverview(servicesPD.TYPE_WORKITEM_TASK, params)).toBe(false);
                params = {showForm: true, hasGlobalForm: true};
                expect(servicesPD.getIsVisibleButtonOverview(servicesPD.TYPE_WORKITEM_TASK, params)).toBe(true);
            });
         });
         describe("When workitem is activity", function(){
            it("Should be true", function(){
               expect(servicesPD.getIsVisibleButtonOverview(servicesPD.TYPE_WORKITEM_ACTIVITY)).toBe(true);
            });
         });
      });
      describe("Button activity or task", function(){
         describe("when type workitem is task", function(){
            describe("when belong current user", function(){
               describe("When is opened", function(){
                  it("Should be true", function(){
                     expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, true).isVisibleButtonForm).toBe(true);
                  });
               });
               describe("When is closed", function(){
                  it("Should be true", function(){
                     expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, false).isVisibleButtonForm).toBe(true);
                  });
               });
            });
            describe("when NOT belong current user", function(){
               it("Should be true", function(){
                  expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, false).isVisibleButtonForm).toBe(true);
               });
            });
         });
         describe("when type workitem is activity", function(){
            describe("when belong current user", function(){
               it("Should be true", function(){
                  expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_ACTIVITY, true).isVisibleButtonForm).toBe(true);
               });
            });
            describe("when NOT belong current user", function(){
               it("Should be false", function(){
                  expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_ACTIVITY, false).isVisibleButtonForm).toBe(false);
               });
            });
         });
      });
      describe("Button visibility comments", function () {
         describe("when summary return Comments true", function () {
            it("Should be true", function(){
               menuSecurity = {Comments: true};
               expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, true, {}, menuSecurity).isVisibleButtonComments).toBe(true);
            });
         });
         describe("when summary return Comments false", function () {
            it("Should be false", function(){
               menuSecurity = {Comments: false};
               expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, true, {}, menuSecurity).isVisibleButtonComments).toBe(false);
            });
         });
      });
      describe("Button visibility files", function () {
         describe("when summary return Files true", function () {
            it("Should be true", function(){
               menuSecurity = {Files: true};
               expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, true, {}, menuSecurity).isVisibleButtonFiles).toBe(true);
            });
         });
         describe("when summary return Files false", function () {
            it("Should be false", function(){
               menuSecurity = {Files: false};
               expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, true, {}, menuSecurity).isVisibleButtonFiles).toBe(false);
            });
         });
      });
      describe("Button visibility plan", function(){
         var menuSecurity;
         describe("when summary return Plans true", function () {
            beforeEach(function () {
               menuSecurity = {Plans: true};
            });
            describe("when type workitem is task", function(){
               describe("when belong current user", function(){
                  describe("When is opened", function(){
                     it("Should be true", function(){
                        expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, true, {}, menuSecurity).isVisibleButtonPlan).toBe(true);
                     });
                  });
                  describe("When is closed", function(){
                     it("Should be false", function(){
                        expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, false, {}, menuSecurity).isVisibleButtonPlan).toBe(false);
                     });
                  });
               });
               describe("when NOT belong current user", function(){
                  it("Should be false", function(){
                     expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, false, false, {}, menuSecurity).isVisibleButtonPlan).toBe(false);
                  });
               });
            });
            describe("when type workitem is activity", function(){
               describe("when belong current user", function(){
                  it("Should be true", function(){
                     expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_ACTIVITY, true, false, {}, menuSecurity).isVisibleButtonPlan).toBe(true);
                  });
               });
               describe("when NOT belong current user", function(){
                  it("Should be false", function(){
                     expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_ACTIVITY, false, false, {}, menuSecurity).isVisibleButtonPlan).toBe(false);
                  });
               });
            });
         });

         describe("when summary return Plans false", function () {
            beforeEach(function () {
               menuSecurity = {Plans: false};
            });
            describe("when type workitem is task", function(){
               describe("when belong current user", function(){
                  describe("When is opened", function(){
                     it("Should be false", function(){
                        expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, true, {}, menuSecurity).isVisibleButtonPlan).toBe(false);
                     });
                  });
               });
            });
            describe("when type workitem is activity", function(){
               describe("when belong current user", function(){
                  it("Should be false", function(){
                     expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_ACTIVITY, true, false, {}, menuSecurity).isVisibleButtonPlan).toBe(false);
                  });
               });
            });
         });
      });
   });


   //How calculated context
   describe("The function calculed the context to show, if idCase belong to self.params", function(){
      describe("If type workItem is task and belong to currentUser( and opened)", function(){
         it("should be ACTIVITY", function(){
            expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, true, true).
               contextToShow).toBe(servicesPD.CONTEXT_ACTIVITY);
         });
      });
      describe("If type workItem is task and NOT belong to currentUser (or opened)", function(){
         it("should be OVERVIEW", function(){
            expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, false, false).
               contextToShow).toBe(servicesPD.CONTEXT_OVERVIEW);
            expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_TASK, false, true).
               contextToShow).toBe(servicesPD.CONTEXT_OVERVIEW);
         });
      });
      describe("If type workItem is activity and belong to currentUser(and opened)", function(){
         it("should be ACTIVITYPLAN", function(){
            expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_ACTIVITY, true, true).
               contextToShow).toBe(servicesPD.CONTEXT_ACTIVITYPLAN);
         });
      });
      describe("If type workItem is activity and belong to currentUser(and not opened)", function(){
         it("should be OVERVIEW", function(){
            expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_ACTIVITY, true, false).
               contextToShow).toBe(servicesPD.CONTEXT_OVERVIEW);
         });
      });
      describe("If type workItem is activity and NOT belong to currentUser(and opened or not opened)", function(){
         it("should be ACTIVITYPLANOVERVIEW", function(){
            expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_ACTIVITY, false, true).
               contextToShow).toBe(servicesPD.CONTEXT_ACTIVITYPLANOVERVIEW);
            expect(servicesPD.getPropertiesByDataServices(servicesPD.TYPE_WORKITEM_ACTIVITY, false, false).
               contextToShow).toBe(servicesPD.CONTEXT_ACTIVITYPLANOVERVIEW);
         });
      });
   });

   //How function logic callGetDataServices
   describe("Function callDataServicesForBehaviorDashboard", function(){

      describe("When idCase belong to params", function(){
         beforeEach(function(){
            spyOn(servicesPD, "getCaseSummaryDetails").and.callFake(function(){
               return {test: 1, currentState: [{guidWorkItem: "GUIDWORKITEM1"}], idPlan: "GUIDPLAN", idWorkitem: "GUIDWORKITEM1"};
            });
            spyOn(servicesPD, "getServerDateDifference").and.callFake(function(){
               return 100; //millisenconds
            });

            spyOn(servicesPD, "getWorkitemsPlan").and.callFake(function(){
               return [
                  {
                     guidActivity: "GUIDACTIVITY1",
                     guidWorkitem: "GUIDWORKITEM1"
                  }
               ];
            });
            spyOn(servicesPD, "getPlanByParent").and.callFake(function(){
               return [
                  {
                     id: "fabe1319-e2b6-4e99-b452-bf10ecfb9379"
                  }
               ];
            });
         });
         it("Should be call getCaseSummaryDetails and getServerDateDifference", function(){
            servicesPD.callDataServicesForBehaviorDashboard({idCase: 123});
            expect(servicesPD.getCaseSummaryDetails).toHaveBeenCalled();
            expect(servicesPD.getServerDateDifference).toHaveBeenCalled();
         });

         describe("When idPlan belong to params (the type workItem is Activity)", function(){

            it("Call getWorkitemsPlan, because I need GUID current activity", function(){
               servicesPD.callDataServicesForBehaviorDashboard({idCase: 123});
               expect(servicesPD.getWorkitemsPlan).toHaveBeenCalled();
            });

            describe("When I have GUID Workitem (type activity)", function(){
               it("Should be call getPlanByParent, because I need know if workItem have create plan", function(){
                  servicesPD.callDataServicesForBehaviorDashboard({idCase: 123});
                  expect(servicesPD.getPlanByParent).toHaveBeenCalled();
               });

               describe("When plan is contextualized", function(){
                  beforeEach(function(){
                     spyOn(servicesPD, "getPlan").and.callFake(function(){
                        return {
                           id: "fabe1319-e2b6-4e99-b452-bf10ecfb9379",
                           contextualized: true
                        };
                     });
                  });

                  it("Should be call getPlan, because i need know if plan is contextualized or not", function(){
                     servicesPD.callDataServicesForBehaviorDashboard({idCase: 123});
                     expect(servicesPD.getPlan).toHaveBeenCalled();
                  });
               });
               describe("When plan is NOT contextualized", function(){
                  beforeEach(function(){
                     spyOn(servicesPD, "getPlan").and.callFake(function(){
                        return {
                           id: "fabe1319-e2b6-4e99-b452-bf10ecfb9379",
                           contextualized: false
                        };
                     });

                     spyOn(servicesPD, "getFirstParentPlan").and.callFake(function(){
                        return {
                           id: "first319-e2b6-4e99-b452-bf10ecfb9379"
                        };
                     });

                  });
                  it("Should be call getPlan, because i need know if plan is contextualized or not", function(){
                     servicesPD.callDataServicesForBehaviorDashboard({idCase: 123});
                     expect(servicesPD.getPlan).toHaveBeenCalled();
                  });
                  it("Should be call getFirstParentPlan, because i need know idPlan by set radNumber" +
                     "and share comments and files on decontextualized", function(){
                     servicesPD.callDataServicesForBehaviorDashboard({idCase: 123});
                     expect(servicesPD.getFirstParentPlan).toHaveBeenCalled();
                  });
               });

            });
         });
         describe("When idPlan NOT belong to params (the type workItem is Task), I have GUID WorkItem (type task)", function(){
            it("Should be call getPlanByParent, because I need know if workItem have create plan", function(){
               servicesPD.callDataServicesForBehaviorDashboard({idCase: 123});
               expect(servicesPD.getPlanByParent).toHaveBeenCalled();
            });
         });
      });
   });

   describe("The params for backButton from plan Dashboard", function(){
      describe("When call function getParamsByBackFromPlan", function(){
         beforeEach(function(){
            params = {plan: {id: "guidplan", idActivitySelected: "idActivity"}, planParent: {id: "guidparent"}, menuDashboard: {}};
         });
         it("Should be return always object", function(){
            var paramsResponse = servicesPD.getParamsByBackFromPlan(params, 1);
            expect(paramsResponse).toBeDefined();
         });
         describe("The parameters", function(){
            describe("When is created plan from activity", function(){
               beforeEach(function(){
                  params = {plan: {id: "guidplan", idActivitySelected: "idActivity"}, planParent: {id: "guidparent"}, menuDashboard: {}};
               });
               it("The param: menuDashboard.contextPlanOptionMenu should be PLANACTIVITIES", function(){
                  servicesPD.getParamsByBackFromPlan(params, 1);
                  expect(params.menuDashboard.contextPlanOptionMenu).toBe(servicesPD.CONTEXT_PLANACTIVITIES);
               });
            });
            describe("When the plan created from task and contextualized", function(){
               beforeEach(function(){
                  params = {plan: {id: "guidplan", contextualized: true}, menuDashboard: {}};
               });
               it("The type context parameter Should be ACTIVITY", function(){
                  expect(servicesPD.getParamsByBackFromPlan(params, 1).typeContext).toBe(servicesPD.CONTEXT_ACTIVITY);
               });
            });
            describe("When the other flow", function(){
               beforeEach(function(){
                  params = {plan: {id: "guidplan", contextualized: false, idActivitySelected: "idActivity"}, menuDashboard: {}};
               });
               it("The type context parameter Should be NAVIGATOR_BACK", function(){
                  expect(servicesPD.getParamsByBackFromPlan(params, 1).typeContext).toBe(servicesPD.NOTIFICATION_NAVIGATOR_BACK);
               })
            });
            describe("When delete a plan", function(){
               describe("plan from a task", function(){
                  beforeEach(function(){
                     params = {plan: {id: "guidplan", contextualized: true}, menuDashboard: {}};
                  });
                  it("Should be set menuDashboard.contextPlanOptionMenu with CREATEPLAN when is task", function(){
                     servicesPD.getParamsByBackFromPlan(params, 1, true);
                     expect(params.menuDashboard.contextPlanOptionMenu).toBe(servicesPD.CONTEXT_PLANCREATE);
                  });
                  it("Should be set isRefresh on paramsNotify", function(){
                     var response = servicesPD.getParamsByBackFromPlan(params, 1, true);
                     expect(response.paramsNotify.isRefresh).toBeDefined();
                  });
               });
               describe("plan from a activity", function(){
                  beforeEach(function(){
                     params = {plan: {id: "guidplan", idActivitySelected: "idActivity"}, planParent: {id: "guidparent"}, menuDashboard: {}};
                  });
                  it("Should be set menuDashboard.contextPlanOptionMenu with ACTIVITYPLANCREATE when is activity", function(){
                     servicesPD.getParamsByBackFromPlan(params, 1, true);
                     expect(params.menuDashboard.contextPlanOptionMenu).toBe(servicesPD.CONTEXT_ACTIVITYPLANCREATE);
                  });
                  it("Should be set isRefresh on paramsNotify", function(){
                     var response = servicesPD.getParamsByBackFromPlan(params, 1, true);
                     expect(response.paramsNotify.isRefresh).toBeDefined();
                  });
               });
            });
         });
      });
   });
});
