
describe("bizagi.workportal.services.behavior.loadDataPlan", function () {
   checkWorkportalDependencies();
   var dataService;
   var orderActivitiesByTransitions;
   var params;

   beforeEach(function(){
      dataService = bizagi.injector.get("dataService");
      orderActivitiesByTransitions = bizagi.injector.get("bizagi.workportal.services.behaviors.orderActivitiesByTransitions");
      serviceLoadDataPlan = new bizagi.workportal.services.behaviors.loadDataPlan(dataService, orderActivitiesByTransitions);
   });

   it("dependencies should defined", function(){
      expect(dataService).toBeDefined();
      expect(serviceLoadDataPlan).toBeDefined();
   });

   describe("The functions", function(){
      describe("loadData", function(){
         beforeEach(function(){
            spyOn(serviceLoadDataPlan, "callGetPlan").and.callFake(function(){
               return JSON.parse('{"id":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","name":"plan prueba","description":null,"currentState":"EXECUTING","parentWorkItem":null,"creationDate":1441380617390,"startDate":1441400644233,"dueDate":null,"idUserCreator":1,"waitForCompletion":true,"activities":null,"contextualized":false}');
            });
            spyOn(serviceLoadDataPlan, "callGetFirstParent").and.callFake(function(){
               return null;
            });
            spyOn(serviceLoadDataPlan.dataService, "getActivities").and.callFake(function(){
               return JSON.parse('[{"id":"afe93f79-e421-4cc7-b6c3-decd02132fb8","name":"actividad 1","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]},{"id":"765297c5-2c21-4291-a1f2-49325f093fd5","name":"actividad 3","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]},{"id":"c1647653-11ae-453f-a4ef-b29a443257ae","name":"actividad 4","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]},{"id":"a7dacdfb-0656-41e9-8a3e-2c9522164032","name":"actividad 5","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]},{"id":"8b929a0b-4b5f-49ae-b753-1f426227c6b1","name":"10","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]},{"id":"05c3ef12-203f-444f-a7bc-f80d71af7dea","name":"11","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]},{"id":"591c3059-4af0-4b7d-b0fd-36cd72354db0","name":"12","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]},{"id":"0e4ea9ce-28fe-4b7e-9115-0ca40457320b","name":"6","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]},{"id":"fac28210-78b9-40a9-881b-e607d4158ccb","name":"7","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]},{"id":"43cec25b-13b9-4556-8b91-1e857d909ff2","name":"8","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]},{"id":"e5bb5d00-0ea8-44fe-83e0-4b231af7bccb","name":"9","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]}]');
            });
            spyOn(serviceLoadDataPlan.dataService, "getWorkitemsPlan").and.callFake(function(){
               return JSON.parse('[{"idWorkItem":9051,"idCase":8451,"workItemState":"Completed","wiEntryDate":1441400643970,"wiDuration":3,"wiEstimatedSolutionDate":1441400643973,"wiSolutionDate":1441400833370,"guidWorkitem":"7282faba-254e-49c8-b2af-92313a551cee","guidActivity":"9d7b8498-7882-4a00-b8d2-d8a2d24cd14c"},{"idWorkItem":9052,"idCase":8451,"workItemState":"Completed","wiEntryDate":1441400833383,"wiDuration":0,"wiEstimatedSolutionDate":1441400833383,"wiSolutionDate":1441400836280,"guidWorkitem":"3a7b8109-76f4-4ce6-83f8-8dc77883f227","guidActivity":"a7dacdfb-0656-41e9-8a3e-2c9522164032"},{"idWorkItem":9053,"idCase":8451,"workItemState":"Completed","wiEntryDate":1441400836283,"wiDuration":0,"wiEstimatedSolutionDate":1441400836283,"wiSolutionDate":1441400837797,"guidWorkitem":"c9465d87-8a3e-400b-8e40-c547b254066a","guidActivity":"0e4ea9ce-28fe-4b7e-9115-0ca40457320b"},{"idWorkItem":9054,"idCase":8451,"workItemState":"Active","wiEntryDate":1441400837800,"wiDuration":0,"wiEstimatedSolutionDate":1441400837803,"wiSolutionDate":null,"guidWorkitem":"eeb8bb2b-3710-4c7d-a465-ffacc9ff8013","guidActivity":"765297c5-2c21-4291-a1f2-49325f093fd5"}]');
            });
            spyOn(serviceLoadDataPlan.dataService, "getTransitionsByPlan").and.callFake(function(){
               return JSON.parse('[{"id":"4a5123f7-0500-4a12-a101-9545e0f21ed3","idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","idActivityFrom":"9d7b8498-7882-4a00-b8d2-d8a2d24cd14c","idActivityTo":"a7dacdfb-0656-41e9-8a3e-2c9522164032"},{"id":"14d50efa-6f27-4d4b-9682-51bca45c4e38","idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","idActivityFrom":"a7dacdfb-0656-41e9-8a3e-2c9522164032","idActivityTo":"0e4ea9ce-28fe-4b7e-9115-0ca40457320b"},{"id":"74aec704-b0fc-4f7a-9c7e-7fa1ec8a9fc2","idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","idActivityFrom":"0e4ea9ce-28fe-4b7e-9115-0ca40457320b","idActivityTo":"765297c5-2c21-4291-a1f2-49325f093fd5"},{"id":"0cac5682-d78e-4bc5-87f5-ff317f05fcfe","idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","idActivityFrom":"765297c5-2c21-4291-a1f2-49325f093fd5","idActivityTo":"c1647653-11ae-453f-a4ef-b29a443257ae"},{"id":"54c399a9-4c67-4612-942f-175f7a3137f5","idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","idActivityFrom":"c1647653-11ae-453f-a4ef-b29a443257ae","idActivityTo":"afe93f79-e421-4cc7-b6c3-decd02132fb8"},{"id":"308aade3-4655-4a8d-ac49-da50a7e7ef8b","idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","idActivityFrom":"afe93f79-e421-4cc7-b6c3-decd02132fb8","idActivityTo":"fac28210-78b9-40a9-881b-e607d4158ccb"},{"id":"edcb0612-0686-42f1-9531-692e9faec788","idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","idActivityFrom":"fac28210-78b9-40a9-881b-e607d4158ccb","idActivityTo":"43cec25b-13b9-4556-8b91-1e857d909ff2"},{"id":"3f5d52a6-42f0-4fe6-858b-be23fc17edd1","idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","idActivityFrom":"43cec25b-13b9-4556-8b91-1e857d909ff2","idActivityTo":"e5bb5d00-0ea8-44fe-83e0-4b231af7bccb"},{"id":"2923e7ec-6757-46a5-a5b2-0bd928489038","idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","idActivityFrom":"e5bb5d00-0ea8-44fe-83e0-4b231af7bccb","idActivityTo":"8b929a0b-4b5f-49ae-b753-1f426227c6b1"},{"id":"8a04899a-dac0-43d7-b70d-fe47e81f2101","idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","idActivityFrom":"8b929a0b-4b5f-49ae-b753-1f426227c6b1","idActivityTo":"05c3ef12-203f-444f-a7bc-f80d71af7dea"},{"id":"bd12d10f-d150-46f0-b1b7-152700440234","idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","idActivityFrom":"05c3ef12-203f-444f-a7bc-f80d71af7dea","idActivityTo":"591c3059-4af0-4b7d-b0fd-36cd72354db0"}]');
            });
            spyOn(serviceLoadDataPlan, "publish").and.callFake(function(){
               return "";
            });
         });
         it("Should called publish twice", function(){
            serviceLoadDataPlan.loadData("guidplan", function(){return 123456}, {plan: {id: "idplan"}});
            expect(serviceLoadDataPlan.publish).toHaveBeenCalled();
         });
      });

      describe("mergePropertiesActivitiesWithWorkitems", function(){
         var parameters = {
            activities: [],
            workItems: []
         };
         describe("Should merge activities and workitems", function(){
            describe("Scenario 1: There are not Activities and workitems", function(){
               beforeEach(function(){
                  parameters.activities = [];
                  parameters.workItems = [];
               });
               it("Should be return []", function(){
                  serviceLoadDataPlan.mergePropertiesActivitiesWithWorkitems(parameters.activities, parameters.workItems)
                  expect(parameters.activities.length).toBe(0);
               });
            });
         })
      });
      describe("calculateActivityStatus", function(){
         var parameters = {
            activities: [],
            workItems: []
         };
         describe("Should calculated Activity Status", function(){
            describe("Scenario 1: 1 Activity, 0 workitems", function(){
               beforeEach(function(){
                  parameters.activities = JSON.parse('[{"id":"afe93f79-e421-4cc7-b6c3-decd02132fb8","name":"actividad 1","description":null,"allowEdition":true,"idPlan":"11dfd1f9-ba02-45f9-8351-fd7b4192e233","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]}]'),
                  parameters.workItems = [];
               });
               it("Should set properties status, numResolvedItems, numTotalItems", function(){
                  var resultActivities = serviceLoadDataPlan.calculateActivityStatus(parameters.activities, parameters.workItems);
                  expect(resultActivities[0].status).toBeDefined();
                  expect(resultActivities[0].numResolvedItems).toBeDefined();
                  expect(resultActivities[0].numTotalItems).toBeDefined();
               });
               it("Should the property status are nodisplay", function(){
                  var resultActivities = serviceLoadDataPlan.calculateActivityStatus(parameters.activities, parameters.workItems);
                  expect(resultActivities[0].status).toBe("nodisplay");
               });
            });
            describe("Scenario 1: 1 Activity, 1 workitems", function(){
               beforeEach(function(){
                  parameters.activities = JSON.parse('[{"id":"2dd3906a-a69f-4cb9-85ba-84c485330b11","name":"actividad 1 con workitem","description":null,"allowEdition":true,"idPlan":"6469c346-9a8b-4834-ac0a-62a22baaac79","userAssigned":1,"duration":null,"progress":0,"finishDate":null,"startDate":1441383207310,"estimatedFinishDate":1441383207313,"items":[],"idWorkItem":9003,"workItemState":"Inactive","idCase":8402}]'),
                  parameters.workItems = JSON.parse('[{"idWorkItem":9003,"idCase":8402,"workItemState":"Inactive","wiEntryDate":1441383207310,"wiDuration":0,"wiEstimatedSolutionDate":1441383207313,"wiSolutionDate":null,"guidWorkitem":"2178db23-70af-4f04-8937-7c086a04d125","guidActivity":"2dd3906a-a69f-4cb9-85ba-84c485330b11"}]');
                  serviceLoadDataPlan.getDateServer = function(){};
                  spyOn(serviceLoadDataPlan, "getDateServer").and.callFake(function(){
                     return 1441383658045;
                  });
               });
               it("Should set properties status, numResolvedItems, numTotalItems", function(){
                  var resultActivities = serviceLoadDataPlan.calculateActivityStatus(parameters.activities, parameters.workItems);
                  expect(resultActivities[0].status).toBeDefined();
                  expect(resultActivities[0].numResolvedItems).toBeDefined();
                  expect(resultActivities[0].numTotalItems).toBeDefined();
               });
               it("Should the property status are atrisk", function(){
                  var resultActivities = serviceLoadDataPlan.calculateActivityStatus(parameters.activities, parameters.workItems);
                  expect(resultActivities[0].status).toBe("atrisk");
               });
            });
         });
      });
   });

});