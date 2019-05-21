
describe("bizagi.workportal.services.behaviors.orderActivitiesByTransitions", function () {
    checkWorkportalDependencies();
    var serviceOrder;
    var tools = {
        permuteArray: function(arrayNumbersToPermute){
            var permArr = [],
                usedChars = [];

            function permute(input) {
                var i, ch;
                for (i = 0; i < input.length; i++) {
                    ch = input.splice(i, 1)[0];
                    usedChars.push(ch);
                    if (input.length === 0) {
                        permArr.push(usedChars.slice());
                    }
                    permute(input);
                    input.splice(i, 0, ch);
                    usedChars.pop();
                }
                return permArr;
            }
            return permute(arrayNumbersToPermute).length;
        },

        getNumberTransitionsByGroup: function(numberParallels, haveBeforeSyncActivity, haveAfterSyncActivity){
            var fakeNumbersPermute = [];
            for(var i = 0; i < numberParallels; i+= 1){
                fakeNumbersPermute.push(i);
            }

            if(haveBeforeSyncActivity && haveAfterSyncActivity){
                return numberParallels + numberParallels;
            }
            else if(haveBeforeSyncActivity){
                return numberParallels;
            }
            else if(haveAfterSyncActivity){
                return numberParallels;
            }
            else{
                return 0;
            }

        }
    };
    beforeEach(function(){
        serviceOrder = bizagi.injector.get("bizagi.workportal.services.behaviors.orderActivitiesByTransitions");
    });
    it("dependencies should defined", function(){
        expect(serviceOrder).toBeDefined();
    });

    describe("The functions", function() {
        describe("getActualTransitionsByActivities", function () {
            var originalActivities = [
                {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": false},
                {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": false},
                {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": false},
                {"id": "fc5e0a14-5c48-46fc-a8e9-f23bf0502747","parallel": false},
                {"id": "488b5141-ea23-41a7-93d4-51d515debe1c","parallel": false},
                {"id": "e06b2d6c-58f5-4f51-b6ed-e8f94e86f55f","parallel": false},
                {"id": "f9588611-adb5-410f-8062-1f457cd33d73","parallel": false}
            ];
            it("Should return 6 transitions", function () {
                expect(serviceOrder.getActualTransitionsByActivities(originalActivities).length).toBe(6);
            });

            //+--------+---+---+---+---+---+---+---+
            //|  Act   | A | B | C | D | E | F | G |
            //+--------+---+---+---+---+---+---+---+
            //| ¿Sync? | A | S | S | S | S | S | S |
            //+--------+---+---+---+---+---+---+---+
            it("If there is a activity parallel, return 6", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities[0].parallel = true;
                expect(serviceOrder.getActualTransitionsByActivities(modifiedActivities).length).toBe(6);
            });

            //+--------+---+---+---+---+---+---+---+
            //|  Act   | A | B | C | D | E | F | G |
            //+--------+---+---+---+---+---+---+---+
            //| ¿Sync? | S | A | A | S | S | S | S |
            //+--------+---+---+---+---+---+---+---+
            it("If there are two activities parallel in middle, return 7", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities[1].parallel = true;
                modifiedActivities[2].parallel = true;

                var resultExpect = tools.getNumberTransitionsByGroup(2, true, true);
                resultExpect = resultExpect + 3;
                expect(serviceOrder.getActualTransitionsByActivities(modifiedActivities).length).toBe(resultExpect);
            });

            //+--------+---+---+---+---+---+---+---+
            //|  Act   | A | B | C | D | E | F | G |
            //+--------+---+---+---+---+---+---+---+
            //| ¿Sync? | S | A | A | A | S | S | S |
            //+--------+---+---+---+---+---+---+---+
            it("If there are three activities parallel in middle, return 8", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities[1].parallel = true;
                modifiedActivities[2].parallel = true;
                modifiedActivities[3].parallel = true;

                var resultExpect = tools.getNumberTransitionsByGroup(3, true, true);
                resultExpect = resultExpect + 2;
                expect(serviceOrder.getActualTransitionsByActivities(modifiedActivities).length).toBe(resultExpect);
            });

            //+--------+---+---+---+---+---+---+---+
            //|  Act   | A | B | C | D | E | F | G |
            //+--------+---+---+---+---+---+---+---+
            //| ¿Sync? | A | A | S | S | S | S | S |
            //+--------+---+---+---+---+---+---+---+
            it("If there are two activities parallel in the beginning, return 6", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities[0].parallel = true;
                modifiedActivities[1].parallel = true;

                var resultExpect = tools.getNumberTransitionsByGroup(2, false, true);
                resultExpect = resultExpect + 4;
                expect(serviceOrder.getActualTransitionsByActivities(modifiedActivities).length).toBe(resultExpect);
            });

            //+--------+---+---+---+---+---+---+---+
            //|  Act   | A | B | C | D | E | F | G |
            //+--------+---+---+---+---+---+---+---+
            //| ¿Sync? | A | A | A | A | S | S | S |
            //+--------+---+---+---+---+---+---+---+
            it("If there are two activities parallel in the beginning, return 6", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities[0].parallel = true;
                modifiedActivities[1].parallel = true;
                modifiedActivities[2].parallel = true;
                modifiedActivities[3].parallel = true;

                var resultExpect = tools.getNumberTransitionsByGroup(4, false, true);
                resultExpect = resultExpect + 2;
                expect(serviceOrder.getActualTransitionsByActivities(modifiedActivities).length).toBe(resultExpect);
            });

            //+--------+---+---+---+---+---+---+---+
            //|  Act   | A | B | C | D | E | F | G |
            //+--------+---+---+---+---+---+---+---+
            //| ¿Sync? | S | S | S | S | S | A | A |
            //+--------+---+---+---+---+---+---+---+
            it("If there are two activities parallel in the beginning, return 6", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities[5].parallel = true;
                modifiedActivities[6].parallel = true;

                var resultExpect = tools.getNumberTransitionsByGroup(2, true, false);
                resultExpect = resultExpect + 4;
                expect(serviceOrder.getActualTransitionsByActivities(modifiedActivities).length).toBe(resultExpect);
            });

            //+--------+---+---+---+---+---+---+---+
            //|  Act   | A | B | C | D | E | F | G |
            //+--------+---+---+---+---+---+---+---+
            //| ¿Sync? | S | S | S | S | S | S | A |
            //+--------+---+---+---+---+---+---+---+
            it("If there are two activities parallel in the beginning, return 6", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities[6].parallel = true;

                var resultExpect = tools.getNumberTransitionsByGroup(1, true, false);
                resultExpect = resultExpect + 5;
                expect(serviceOrder.getActualTransitionsByActivities(modifiedActivities).length).toBe(resultExpect);
            });
        });

        describe("getOrderActivitiesByTransitions", function () {
            var originalActivities = [
                {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": undefined},
                {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": undefined},
                {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": undefined},
                {"id": "fc5e0a14-5c48-46fc-a8e9-f23bf0502747","parallel": undefined},
                {"id": "488b5141-ea23-41a7-93d4-51d515debe1c","parallel": undefined},
                {"id": "e06b2d6c-58f5-4f51-b6ed-e8f94e86f55f","parallel": undefined},
                {"id": "f9588611-adb5-410f-8062-1f457cd33d73","parallel": undefined}
            ];

            //+--------+---+
            //|  Act   | A |
            //+--------+---+
            //| ¿Sync? | S |
            //+--------+---+
            it("When 0 transitions, 1 activity, should return one activity", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = modifiedActivities.splice(0,1);
                console.log("array", modifiedActivities);
                expect(JSON.stringify(serviceOrder.getOrderActivitiesByTransitions([], modifiedActivities).activitiesInOrder)).
                    toBe(JSON.stringify([modifiedActivities[0].id]));
            });

            //+--------+---+---+
            //|  Act   | A | B |
            //+--------+---+---+
            //| ¿Sync? | S | S |
            //+--------+---+---+
            it("When 1 transitions, 2 activities, should return two activities", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = modifiedActivities.splice(0,2);
                var transitions = [
                    {"idActivityFrom": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","idActivityTo": "6fe846ee-2473-4838-8e67-3c872d11fced"}
                ];
                expect(JSON.stringify(serviceOrder.getOrderActivitiesByTransitions(transitions, modifiedActivities).activitiesInOrder)).
                    toBe(JSON.stringify([modifiedActivities[0].id, modifiedActivities[1].id]));
            });

            //+--------+---+---+---+
            //|  Act   | A | B | C |
            //+--------+---+---+---+
            //| ¿Sync? | S | S | S |
            //+--------+---+---+---+
            it("When 2 transitions, 3 activities, should return 3 activities", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = modifiedActivities.splice(0,3);
                var transitions = [
                    {"idActivityFrom": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","idActivityTo": "6fe846ee-2473-4838-8e67-3c872d11fced"},
                    {"idActivityFrom": "6fe846ee-2473-4838-8e67-3c872d11fced","idActivityTo": "cae9b531-1c6a-47c1-bcc3-0323de360b67"}
                ];
                expect(JSON.stringify(serviceOrder.getOrderActivitiesByTransitions(transitions, modifiedActivities).activitiesInOrder)).
                    toBe(JSON.stringify([modifiedActivities[0].id, modifiedActivities[1].id, modifiedActivities[2].id]));
            });

            //+--------+---+---+---+---+
            //|  Act   | A | B | C | D |
            //+--------+---+---+---+---+
            //| ¿Sync? | S | S | S | S |
            //+--------+---+---+---+---+
            it("When 3 transitions, 4 activities, should return 4 activities", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = modifiedActivities.splice(0,4);
                var transitions = [
                    {"idActivityFrom": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","idActivityTo": "6fe846ee-2473-4838-8e67-3c872d11fced"},
                    {"idActivityFrom": "6fe846ee-2473-4838-8e67-3c872d11fced","idActivityTo": "cae9b531-1c6a-47c1-bcc3-0323de360b67"},
                    {"idActivityFrom": "cae9b531-1c6a-47c1-bcc3-0323de360b67","idActivityTo": "fc5e0a14-5c48-46fc-a8e9-f23bf0502747"}
                ];
                expect(JSON.stringify(serviceOrder.getOrderActivitiesByTransitions(transitions, modifiedActivities).activitiesInOrder)).
                    toBe(JSON.stringify([modifiedActivities[0].id, modifiedActivities[1].id, modifiedActivities[2].id, modifiedActivities[3].id]));
            });

            //+--------+---+---+---+---+
            //|  Act   | A | B | C | D |
            //+--------+---+---+---+---+
            //| ¿Sync? | S | P | P | S |
            //+--------+---+---+---+---+
            it("When 3 transitions, 4 activities (2 middle parallels), should return 4 activities and 2 parallels", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = modifiedActivities.splice(0,4);
                var transitions = [
                    {"idActivityFrom": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","idActivityTo": "6fe846ee-2473-4838-8e67-3c872d11fced"},
                    {"idActivityFrom": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","idActivityTo": "cae9b531-1c6a-47c1-bcc3-0323de360b67"},
                    {"idActivityFrom": "6fe846ee-2473-4838-8e67-3c872d11fced","idActivityTo": "fc5e0a14-5c48-46fc-a8e9-f23bf0502747"},
                    {"idActivityFrom": "cae9b531-1c6a-47c1-bcc3-0323de360b67","idActivityTo": "fc5e0a14-5c48-46fc-a8e9-f23bf0502747"}
                ];
                var result = serviceOrder.getOrderActivitiesByTransitions(transitions, modifiedActivities);
                expect(JSON.stringify(result.activitiesInOrder)).
                    toBe(JSON.stringify([modifiedActivities[0].id, modifiedActivities[1].id,
                        modifiedActivities[2].id, modifiedActivities[3].id]));
                expect(Object.keys(result.parallelActivitiesHash).length).toBe(2);
                expect(result.parallelActivitiesHash["6fe846ee-2473-4838-8e67-3c872d11fced"]).toBeDefined();
                expect(result.parallelActivitiesHash["cae9b531-1c6a-47c1-bcc3-0323de360b67"]).toBeDefined();
            });

            //+--------+---+---+---+---+
            //|  Act   | A | B | C | D |
            //+--------+---+---+---+---+
            //| ¿Sync? | P | P | S | S |
            //+--------+---+---+---+---+
            it("When 3 transitions, 4 activities (2 first parallels), should return 4 activities and 2 parallels", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = modifiedActivities.splice(0,4);
                var transitions = [
                    {"idActivityFrom": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","idActivityTo": "cae9b531-1c6a-47c1-bcc3-0323de360b67"},
                    {"idActivityFrom": "6fe846ee-2473-4838-8e67-3c872d11fced","idActivityTo": "cae9b531-1c6a-47c1-bcc3-0323de360b67"},
                    {"idActivityFrom": "cae9b531-1c6a-47c1-bcc3-0323de360b67","idActivityTo": "fc5e0a14-5c48-46fc-a8e9-f23bf0502747"}
                ];
                var result = serviceOrder.getOrderActivitiesByTransitions(transitions, modifiedActivities);
                expect(JSON.stringify(result.activitiesInOrder)).
                    toBe(JSON.stringify([modifiedActivities[0].id, modifiedActivities[1].id,
                        modifiedActivities[2].id, modifiedActivities[3].id]));
                expect(Object.keys(result.parallelActivitiesHash).length).toBe(2);
                expect(result.parallelActivitiesHash["b9fee9ed-7d37-4c00-9db7-dcc820002efa"]).toBeDefined();
                expect(result.parallelActivitiesHash["6fe846ee-2473-4838-8e67-3c872d11fced"]).toBeDefined();
            });

            //+--------+---+---+---+---+
            //|  Act   | A | B | C | D |
            //+--------+---+---+---+---+
            //| ¿Sync? | S | S | P | P |
            //+--------+---+---+---+---+
            it("When 3 transitions, 4 activities (2 last parallels), should return 4 activities and 2 parallels", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = modifiedActivities.splice(0,4);
                var transitions = [
                    {"idActivityFrom": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","idActivityTo": "6fe846ee-2473-4838-8e67-3c872d11fced"},
                    {"idActivityFrom": "6fe846ee-2473-4838-8e67-3c872d11fced","idActivityTo": "cae9b531-1c6a-47c1-bcc3-0323de360b67"},
                    {"idActivityFrom": "6fe846ee-2473-4838-8e67-3c872d11fced","idActivityTo": "fc5e0a14-5c48-46fc-a8e9-f23bf0502747"}
                ];
                var result = serviceOrder.getOrderActivitiesByTransitions(transitions, modifiedActivities);
                expect(JSON.stringify(result.activitiesInOrder)).
                    toBe(JSON.stringify([modifiedActivities[0].id, modifiedActivities[1].id,
                        modifiedActivities[2].id, modifiedActivities[3].id]));
                expect(Object.keys(result.parallelActivitiesHash).length).toBe(2);
                expect(result.parallelActivitiesHash["cae9b531-1c6a-47c1-bcc3-0323de360b67"]).toBeDefined();
                expect(result.parallelActivitiesHash["fc5e0a14-5c48-46fc-a8e9-f23bf0502747"]).toBeDefined();
            });
        });

        describe("movePositionActivity", function () {
            var originalActivities = [
                {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": undefined},
                {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": undefined},
                {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": undefined},
                {"id": "fc5e0a14-5c48-46fc-a8e9-f23bf0502747","parallel": undefined}
            ];
            it("Should move activity from 0 to 1 position", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = serviceOrder.movePositionActivity(modifiedActivities, 0, 1);
                expect(modifiedActivities[0].id).toBe(originalActivities[1].id);
                expect(modifiedActivities[1].id).toBe(originalActivities[0].id);
                expect(modifiedActivities[2].id).toBe(originalActivities[2].id);
                expect(modifiedActivities[3].id).toBe(originalActivities[3].id);

            });
            it("Should move activity from 0 to 2 position", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = serviceOrder.movePositionActivity(modifiedActivities, 0, 2);
                expect(modifiedActivities[0].id).toBe(originalActivities[1].id);
                expect(modifiedActivities[1].id).toBe(originalActivities[2].id);
                expect(modifiedActivities[2].id).toBe(originalActivities[0].id);
                expect(modifiedActivities[3].id).toBe(originalActivities[3].id);
            });
            it("Should move activity from 0 to 3 position", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = serviceOrder.movePositionActivity(modifiedActivities, 0, 3);
                expect(modifiedActivities[0].id).toBe(originalActivities[1].id);
                expect(modifiedActivities[1].id).toBe(originalActivities[2].id);
                expect(modifiedActivities[2].id).toBe(originalActivities[3].id);
                expect(modifiedActivities[3].id).toBe(originalActivities[0].id);
            });
            it("Should move activity from 3 to 0 position", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = serviceOrder.movePositionActivity(modifiedActivities, 3, 0);
                expect(modifiedActivities[0].id).toBe(originalActivities[3].id);
                expect(modifiedActivities[1].id).toBe(originalActivities[0].id);
                expect(modifiedActivities[2].id).toBe(originalActivities[1].id);
                expect(modifiedActivities[3].id).toBe(originalActivities[2].id);
            });
            it("Should move activity from 3 to 1 position", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = serviceOrder.movePositionActivity(modifiedActivities, 3, 1);
                expect(modifiedActivities[0].id).toBe(originalActivities[0].id);
                expect(modifiedActivities[1].id).toBe(originalActivities[3].id);
                expect(modifiedActivities[2].id).toBe(originalActivities[1].id);
                expect(modifiedActivities[3].id).toBe(originalActivities[2].id);
            });
            it("Should move activity from 2 to 1 position", function () {
                var modifiedActivities = JSON.parse(JSON.stringify(originalActivities));
                modifiedActivities = serviceOrder.movePositionActivity(modifiedActivities, 2, 1);
                expect(modifiedActivities[0].id).toBe(originalActivities[0].id);
                expect(modifiedActivities[1].id).toBe(originalActivities[2].id);
                expect(modifiedActivities[2].id).toBe(originalActivities[1].id);
                expect(modifiedActivities[3].id).toBe(originalActivities[3].id);
            });
        });
    });
});