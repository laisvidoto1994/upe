/**
 * Unit Testing bizagi.workportal.widgets.plans.manager
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.plans.manager", function () {
    var widget,
        workportalFacade,
        dataService;

    it("Environment has been defined", function () {
        workportalFacade = bizagi.injector.get("workportalFacade");
        dataService = bizagi.injector.get("dataService");
        actionService = bizagi.injector.get("actionService");
        notifier = bizagi.injector.get("notifier");
        planTemplateCreate = bizagi.injector.get("bizagi.workportal.widgets.project.plan.template.create");
        planPopupEdit = bizagi.injector.get("bizagi.workportal.widgets.project.plan.edit");
        serviceOrderByTransition = bizagi.injector.get("bizagi.workportal.services.behaviors.orderActivitiesByTransitions");
    });

    it("Render Widget", function (done) {
        var params = {};
        widget = new bizagi.workportal.widgets.plans.manager(workportalFacade, dataService, actionService,
            notifier, planTemplateCreate, planPopupEdit, serviceOrderByTransition, params);

        spyOn(widget.dataService, "getCurrentTimeDateServer").and.callFake(function () {
            var defer = $.Deferred();
            defer.resolve(Date.now());
            return defer.promise();
        });

        $.when(widget.areTemplatedLoaded()).done(function () {
            $.when(widget.renderContent()).done(function () {
                widget.postRender();
                done();
            });
        });
    });

    describe("Functions:", function () {
        describe("updateView", function () {
            beforeEach(function () {
                spyOn(widget.dataService, "getUserPlans").and.callFake(function () {
                    var defer = $.Deferred();
                    dataResolve = [{
                        "id": "fd65cba4-bad6-4fce-ba9d-3605bbb2b81d",
                        "name": "crear plan",
                        "description": null,
                        "currentState": "PENDING",
                        "parentWorkItem": "bbbcd032-34e2-46f8-ba96-15bc0f80e7cb",
                        "creationDate": 1447080123550,
                        "startDate": 1447080133347,
                        "dueDate": 1447088133347,
                        "idUserCreator": 3,
                        "waitForCompletion": true,
                        "activities": null,
                        "contextualized": true
                    }, {
                        "id": "5ad8bf48-3499-4ced-8f5d-0ceea6458475",
                        "name": "Nuevo plan",
                        "description": null,
                        "currentState": "EXECUTING",
                        "parentWorkItem": "07cdddce-1982-44f1-b500-20d0ffaf600f",
                        "creationDate": 1448397440120,
                        "startDate": 1448397450580,
                        "dueDate": null,
                        "idUserCreator": 3,
                        "waitForCompletion": true,
                        "activities": null,
                        "contextualized": true
                    }, {
                        "id": "3251ff62-8f8a-4c3c-a2ee-0b2b1d8c814d",
                        "name": "plan ejemplo",
                        "description": null,
                        "currentState": "EXECUTING",
                        "parentWorkItem": null,
                        "creationDate": 1449516304773,
                        "startDate": 1449516316080,
                        "dueDate": null,
                        "idUserCreator": 3,
                        "waitForCompletion": true,
                        "activities": null,
                        "contextualized": false
                    }, {
                        "id": "a5508e97-3028-4dce-afe4-8c133ccd3680",
                        "name": "plan con actividades",
                        "description": null,
                        "currentState": "EXECUTING",
                        "parentWorkItem": null,
                        "creationDate": 1449679840147,
                        "startDate": 1449679853357,
                        "dueDate": null,
                        "idUserCreator": 3,
                        "waitForCompletion": true,
                        "activities": null,
                        "contextualized": false
                    }, {
                        "id": "5e9de41d-ee30-4e34-a21d-b953328d457b",
                        "name": "plan nivel 2",
                        "description": null,
                        "currentState": "EXECUTING",
                        "parentWorkItem": "661bc335-2568-4cf8-b0c0-6a4e4ff0ff2b",
                        "creationDate": 1449686725797,
                        "startDate": 1449686747047,
                        "dueDate": null,
                        "idUserCreator": 3,
                        "waitForCompletion": true,
                        "activities": null,
                        "contextualized": true
                    }, {
                        "id": "889c8e5d-f191-4c99-bc7d-d4f2e63050a4",
                        "name": "plan prueba 01",
                        "description": null,
                        "currentState": "EXECUTING",
                        "parentWorkItem": null,
                        "creationDate": 1449754429847,
                        "startDate": 1449754461373,
                        "dueDate": null,
                        "idUserCreator": 3,
                        "waitForCompletion": true,
                        "activities": null,
                        "contextualized": false
                    }, {
                        "id": "781b62aa-d797-4141-92c9-f7c81e38b7fd",
                        "name": "Plan nivel 2 Fianl",
                        "description": null,
                        "currentState": "EXECUTING",
                        "parentWorkItem": "f12f8d31-4295-4159-b516-d6ad2fe4eb4c",
                        "creationDate": 1449754485150,
                        "startDate": 1449754523350,
                        "dueDate": null,
                        "idUserCreator": 3,
                        "waitForCompletion": true,
                        "activities": null,
                        "contextualized": true
                    }, {
                        "id": "02b0d23a-ea84-451d-819f-35171701b9fe",
                        "name": "plan nivel 1",
                        "description": null,
                        "currentState": "EXECUTING",
                        "parentWorkItem": "dbc1abd6-89fd-4f65-81e8-0b0570b9cded",
                        "creationDate": 1449863234057,
                        "startDate": 1449863252177,
                        "dueDate": null,
                        "idUserCreator": 3,
                        "waitForCompletion": true,
                        "activities": null,
                        "contextualized": true
                    }];
                    defer.resolve(dataResolve);
                    return defer.promise();
                });

                spyOn(widget.dataService, "getUsersData").and.callFake(function () {
                    var defer = $.Deferred();
                    defer.resolve([{"picture": "iVBORw0KGgoAAAANSUhEUg5CYII=", "id": 3, "name": "AManda Client"}]);
                    return defer.promise();
                });

                var numberCallsGetActivities = 0;
                spyOn(widget.dataService, "getActivities").and.callFake(function () {
                    var defer = $.Deferred();
                    if (numberCallsGetActivities === 0) {
                        defer.resolve([{
                            "id": "b07ba331-c646-4b56-84a5-0a9af2ad5b62",
                            "name": "actividad 1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "fd65cba4-bad6-4fce-ba9d-3605bbb2b81d",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "7c79cfc8-6642-4212-b753-2db1d72fbc37",
                            "name": "act 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "fd65cba4-bad6-4fce-ba9d-3605bbb2b81d",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "3ca032d5-f204-45de-914b-8272410f0415",
                            "name": "act 3",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "fd65cba4-bad6-4fce-ba9d-3605bbb2b81d",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }]);
                    }
                    else if (numberCallsGetActivities === 1) {
                        defer.resolve([{
                            "id": "4c69a9ae-b001-4c56-88d6-b5aec8fea007",
                            "name": "actividad 1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "5ad8bf48-3499-4ced-8f5d-0ceea6458475",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "a49a570b-4038-4770-8796-c0616457d7f9",
                            "name": "actividad 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "5ad8bf48-3499-4ced-8f5d-0ceea6458475",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }]);
                    }
                    else if (numberCallsGetActivities === 2) {
                        defer.resolve([{
                            "id": "4fada119-09a8-4578-bd14-da32b0f3ef7e",
                            "name": "Acti 1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "a5508e97-3028-4dce-afe4-8c133ccd3680",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "5f062f82-c485-4b43-b94d-788c8916fdf2",
                            "name": "Acti 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "a5508e97-3028-4dce-afe4-8c133ccd3680",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "23f4e5ce-b992-432b-b789-98d2d97169a8",
                            "name": "Act 3",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "a5508e97-3028-4dce-afe4-8c133ccd3680",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "842c2453-f301-4fc9-9b82-143b917555de",
                            "name": "Act 4",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "a5508e97-3028-4dce-afe4-8c133ccd3680",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }]);
                    }
                    else if (numberCallsGetActivities === 3) {
                        defer.resolve([{
                            "id": "3b0f4217-e544-43f0-bf4f-fb93597d6de3",
                            "name": "act 1 nivel 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "5e9de41d-ee30-4e34-a21d-b953328d457b",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "c1a8eda8-5d17-4c71-96eb-e8de9964e9e8",
                            "name": "act 2 nivel 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "5e9de41d-ee30-4e34-a21d-b953328d457b",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "fb5642bb-a43a-4eb6-b051-d5ce8e1b43e6",
                            "name": "act 3 nivel 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "5e9de41d-ee30-4e34-a21d-b953328d457b",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "2ad076dd-0e1c-4241-a54b-aaab2df14ca1",
                            "name": "act 4 nivel 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "5e9de41d-ee30-4e34-a21d-b953328d457b",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }]);
                    }
                    else if (numberCallsGetActivities === 4) {
                        defer.resolve([{
                            "id": "bd6acfe6-e05c-4c49-aabf-9e5cc519e5b9",
                            "name": "PA01 Nivel 1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "889c8e5d-f191-4c99-bc7d-d4f2e63050a4",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "5d51595c-fb11-4242-b44c-dd2192b695e4",
                            "name": "PA02 Nivel 1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "889c8e5d-f191-4c99-bc7d-d4f2e63050a4",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "f72b31b1-668c-48d9-8d46-a25d25a1aa5a",
                            "name": "PA03 Nivel 1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "889c8e5d-f191-4c99-bc7d-d4f2e63050a4",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "f14cea5b-ac41-489c-abec-ef8fee27dab0",
                            "name": "PA04 Nivel 1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "889c8e5d-f191-4c99-bc7d-d4f2e63050a4",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "3f1f6970-804b-4ef3-a615-1ba7a32faf9a",
                            "name": "PA05 Nivel 1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "889c8e5d-f191-4c99-bc7d-d4f2e63050a4",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }]);
                    }
                    else if (numberCallsGetActivities === 5) {
                        defer.resolve([{
                            "id": "017433c8-b783-4a7e-850f-9a0815a76177",
                            "name": "PA01 Nivel 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "781b62aa-d797-4141-92c9-f7c81e38b7fd",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "c46df20f-082a-4c93-95f2-79dc2999f239",
                            "name": "PA02 Nivel 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "781b62aa-d797-4141-92c9-f7c81e38b7fd",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "f24859e0-2d05-4f6e-8b00-c45861a80e41",
                            "name": "PA03 Nivel 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "781b62aa-d797-4141-92c9-f7c81e38b7fd",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "e5e2dbc6-2472-45b3-a4a7-d6d63aa30845",
                            "name": "PA04 Nivel 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "781b62aa-d797-4141-92c9-f7c81e38b7fd",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "1eddaa12-48ff-42be-8cb3-f61ac61990ec",
                            "name": "PA05 Nivel 2",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "781b62aa-d797-4141-92c9-f7c81e38b7fd",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }]);
                    }
                    else if (numberCallsGetActivities === 6) {
                        defer.resolve([{
                            "id": "f29bd9b5-5a90-413c-9d4f-a1fe498575c3",
                            "name": "actividad 1 n1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "02b0d23a-ea84-451d-819f-35171701b9fe",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": 1449863252093,
                            "estimatedFinishDate": 1449810000000,
                            "items": []
                        }, {
                            "id": "9a8b18e4-dd07-4281-9589-b5aa2ddaeec2",
                            "name": "actividad 2 n1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "02b0d23a-ea84-451d-819f-35171701b9fe",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "95cb0ed3-7423-4831-a7e7-16d33eb9bb27",
                            "name": "actividad 3 n1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "02b0d23a-ea84-451d-819f-35171701b9fe",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }]);
                    }
                    else {
                        defer.resolve([{
                            "id": "f29bd9b5-5a90-413c-9d4f-a1fe498575c3",
                            "name": "actividad 1 n1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "02b0d23a-ea84-451d-819f-35171701b9fe",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": 1449863252093,
                            "estimatedFinishDate": 1449810000000,
                            "items": []
                        }, {
                            "id": "9a8b18e4-dd07-4281-9589-b5aa2ddaeec2",
                            "name": "actividad 2 n1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "02b0d23a-ea84-451d-819f-35171701b9fe",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }, {
                            "id": "95cb0ed3-7423-4831-a7e7-16d33eb9bb27",
                            "name": "actividad 3 n1",
                            "description": null,
                            "allowEdition": true,
                            "idPlan": "02b0d23a-ea84-451d-819f-35171701b9fe",
                            "userAssigned": 3,
                            "duration": null,
                            "progress": 0,
                            "finishDate": null,
                            "startDate": null,
                            "estimatedFinishDate": null,
                            "items": []
                        }]);
                    }

                    numberCallsGetActivities += 1;
                    return defer.promise();
                });

                var numberCallsGetWorkitemsPlan = 0;
                spyOn(widget.dataService, "getWorkitemsPlan").and.callFake(function () {
                    var defer = $.Deferred();
                    if (numberCallsGetWorkitemsPlan === 0) {
                        defer.resolve([{
                            "idWorkItem": 6301,
                            "idCase": 2301,
                            "workItemState": "Active",
                            "wiEntryDate": 1447080133147,
                            "wiDuration": 0,
                            "wiEstimatedSolutionDate": 1447080133147,
                            "wiSolutionDate": null,
                            "guidWorkitem": "dcd6f160-e42b-4160-8559-7b40264b95b5",
                            "guidActivity": "b07ba331-c646-4b56-84a5-0a9af2ad5b62"
                        }]);
                    }
                    else if (numberCallsGetWorkitemsPlan === 1) {
                        defer.resolve([{
                            "idWorkItem": 9581,
                            "idCase": 5015,
                            "workItemState": "Active",
                            "wiEntryDate": 1448397450583,
                            "wiDuration": 0,
                            "wiEstimatedSolutionDate": 1448397450583,
                            "wiSolutionDate": null,
                            "guidWorkitem": "4db8ced1-54a1-4728-aaf8-40205ebec764",
                            "guidActivity": "4c69a9ae-b001-4c56-88d6-b5aec8fea007"
                        }]);
                    }
                    else if (numberCallsGetWorkitemsPlan === 2) {
                        defer.resolve([{
                            "idWorkItem": 11601,
                            "idCase": 6601,
                            "workItemState": "Completed",
                            "wiEntryDate": 1449679853023,
                            "wiDuration": 1,
                            "wiEstimatedSolutionDate": 1449679853023,
                            "wiSolutionDate": 1449679882257,
                            "guidWorkitem": "e28317df-95d5-4573-8127-6a9f32526576",
                            "guidActivity": "4fada119-09a8-4578-bd14-da32b0f3ef7e"
                        }, {
                            "idWorkItem": 11602,
                            "idCase": 6601,
                            "workItemState": "Completed",
                            "wiEntryDate": 1449679882280,
                            "wiDuration": 0,
                            "wiEstimatedSolutionDate": 1449679882283,
                            "wiSolutionDate": 1449679885660,
                            "guidWorkitem": "765b7ec8-dcc0-46e8-805e-8d9af97e3c07",
                            "guidActivity": "5f062f82-c485-4b43-b94d-788c8916fdf2"
                        }, {
                            "idWorkItem": 11603,
                            "idCase": 6601,
                            "workItemState": "Active",
                            "wiEntryDate": 1449679885687,
                            "wiDuration": 0,
                            "wiEstimatedSolutionDate": 1449679885687,
                            "wiSolutionDate": null,
                            "guidWorkitem": "661bc335-2568-4cf8-b0c0-6a4e4ff0ff2b",
                            "guidActivity": "23f4e5ce-b992-432b-b789-98d2d97169a8"
                        }]);
                    }
                    else if (numberCallsGetWorkitemsPlan === 3) {
                        defer.resolve([{
                            "idWorkItem": 11701,
                            "idCase": 6701,
                            "workItemState": "Inactive",
                            "wiEntryDate": 1449686746853,
                            "wiDuration": 0,
                            "wiEstimatedSolutionDate": 1449686746853,
                            "wiSolutionDate": null,
                            "guidWorkitem": "44e1e79e-0a41-4046-964c-ffb1012aff00",
                            "guidActivity": "3b0f4217-e544-43f0-bf4f-fb93597d6de3"
                        }]);
                    }
                    else if (numberCallsGetWorkitemsPlan === 4) {
                        defer.resolve([{
                            "idWorkItem": 11751,
                            "idCase": 6751,
                            "workItemState": "Active",
                            "wiEntryDate": 1449754461113,
                            "wiDuration": 0,
                            "wiEstimatedSolutionDate": 1449754461113,
                            "wiSolutionDate": null,
                            "guidWorkitem": "f12f8d31-4295-4159-b516-d6ad2fe4eb4c",
                            "guidActivity": "bd6acfe6-e05c-4c49-aabf-9e5cc519e5b9"
                        }]);
                    }
                    else if (numberCallsGetWorkitemsPlan === 5) {
                        defer.resolve([{
                            "idWorkItem": 11752,
                            "idCase": 6752,
                            "workItemState": "Inactive",
                            "wiEntryDate": 1449754523363,
                            "wiDuration": 0,
                            "wiEstimatedSolutionDate": 1449754523363,
                            "wiSolutionDate": null,
                            "guidWorkitem": "faab3d78-7a3a-4d1f-81c4-d3c9fddfe7d3",
                            "guidActivity": "017433c8-b783-4a7e-850f-9a0815a76177"
                        }]);
                    }
                    else if (numberCallsGetWorkitemsPlan === 6) {
                        defer.resolve([{
                            "idWorkItem": 11854,
                            "idCase": 6852,
                            "workItemState": "Active",
                            "wiEntryDate": 1449863252093,
                            "wiDuration": 0,
                            "wiEstimatedSolutionDate": 1449810000000,
                            "wiSolutionDate": null,
                            "guidWorkitem": "a2ea2af6-9b68-445e-9b54-28f484c5fc3d",
                            "guidActivity": "f29bd9b5-5a90-413c-9d4f-a1fe498575c3"
                        }]);
                    }
                    else {
                        defer.resolve([{
                            "idWorkItem": 11854,
                            "idCase": 6852,
                            "workItemState": "Active",
                            "wiEntryDate": 1449863252093,
                            "wiDuration": 0,
                            "wiEstimatedSolutionDate": 1449810000000,
                            "wiSolutionDate": null,
                            "guidWorkitem": "a2ea2af6-9b68-445e-9b54-28f484c5fc3d",
                            "guidActivity": "f29bd9b5-5a90-413c-9d4f-a1fe498575c3"
                        }]);
                    }
                    numberCallsGetWorkitemsPlan += 1;
                    return defer.promise();
                });

                spyOn(widget.dataService, "getTransitionsByPlan").and.callFake(function () {
                    var defer = $.Deferred();
                    defer.resolve([{"id":"bb432830-09db-4565-b8d7-4984bfa86876","idPlan":"da0ee733-54fd-4f37-a829-d760e95f7cec","idActivityFrom":"f43d157a-83d9-460f-a620-685ecbcec251","idActivityTo":"5d6f8ad9-2f83-474f-b76f-dee849ea87d6"},{"id":"2a5ab25e-adc4-48e0-aa89-4120c6602e13","idPlan":"da0ee733-54fd-4f37-a829-d760e95f7cec","idActivityFrom":"5d6f8ad9-2f83-474f-b76f-dee849ea87d6","idActivityTo":"481039cf-86b0-44c2-b633-b87b48ed39ad"},{"id":"8de1972a-6acd-4233-832a-8ca55f851baf","idPlan":"da0ee733-54fd-4f37-a829-d760e95f7cec","idActivityFrom":"481039cf-86b0-44c2-b633-b87b48ed39ad","idActivityTo":"8893116c-799b-44c1-af5e-139f6ff598d1"}]);
                    return defer.promise();
                });

                params = {
                    args: {
                        planState: "EXECUTING"
                    }
                }
            });
            it("Should call services", function () {
                spyOn(serviceOrderByTransition, "getActivitiesByTransitions").and.callThrough();

                widget.updateView({}, params);
                expect(widget.dataService.getActivities.calls.count()).toBe(8);
                expect(widget.dataService.getWorkitemsPlan.calls.count()).toBe(8);
                expect(widget.dataService.getTransitionsByPlan.calls.count()).toBe(8);
                expect(serviceOrderByTransition.getActivitiesByTransitions.calls.count()).toBe(8);
            });
        });
        describe("when tooltip activities", function () {
            beforeEach(function () {
                spyOn($.fn.push, "apply");
            });
            it("Should dont have error", function () {
                $(".wdg-plans-activities-row", widget.getContent()).mouseover();
            });
        });

        describe("when tooltip user", function () {
            it("Should dont have error", function () {
                widget.usersMap = {"3": {"name": "name user 1"}};
                $(".wdg-plans-users li:eq(0)", widget.getContent()).mouseover();
            });
        });

        describe("When click on plan", function () {
            beforeEach(function () {
                spyOn(widget, "showPlanDashBoard").and.callThrough();
            });
            it("Should show plan dashboard", function () {
                $(".wdg-plans-manager-card:first-child", widget.getContent()).click();
                expect(widget.showPlanDashBoard).toHaveBeenCalled();
            });
        });

        describe("When click button open menu by plan", function () {
            beforeEach(function () {
                spyOn(widget, "configureMenuHandlers").and.callThrough();
                $(".wdg-plans-leftmenu:eq(0)", widget.getContent()).click();
            });
            it("Should configure Handlers buttons menu", function () {
                expect(widget.configureMenuHandlers).toHaveBeenCalled();
            });

            describe("Events menu by plan", function () {
                describe("when click on document", function () {
                    beforeEach(function () {
                        spyOn($.fn, "remove").and.callThrough();
                    });
                    it("Should close menu", function () {
                        $(document).click();
                        expect($.fn.remove).toHaveBeenCalled();
                    });
                });
                describe("when click on edit plan", function () {
                    beforeEach(function () {
                        spyOn(widget.planPopupEdit, "showPopup").and.callThrough();
                    });
                    it("Should close menu", function () {
                        $("#edit:eq(0)", widget.getContent()).click();
                        expect(widget.planPopupEdit.showPopup).toHaveBeenCalled();
                    });
                });

                describe("when click on save as template", function () {
                    beforeEach(function () {
                        spyOn(widget.planTemplateCreate, "showPopupAddTemplatePlan").and.callThrough();
                    });
                    it("Should close menu", function () {
                        $("#save:eq(0)", widget.getContent()).click();
                        expect(widget.planTemplateCreate.showPopupAddTemplatePlan).toHaveBeenCalled();
                    });
                });

                describe("when click on enabled", function () {
                    beforeEach(function () {
                        spyOn(widget.dataService, "putExecutePlan");
                        spyOn(widget.dataService, "updatePlan");
                        spyOn(widget, "getDateServer");
                    });
                    it("Should updated plan", function () {
                        widget.selectedPlan.activitiesLength = 1;
                        $("#enable:eq(0)", widget.getContent()).click();
                        expect(widget.dataService.putExecutePlan).toHaveBeenCalled();
                        expect(widget.dataService.updatePlan).toHaveBeenCalled();
                        expect(widget.getDateServer).toHaveBeenCalled();
                    });
                });

                describe("when click on delete", function () {
                    beforeEach(function () {
                        spyOn(bizagi, "showConfirmationBox").and.callFake(function () {
                            var defer = $.Deferred();
                            defer.resolve();
                            return defer.promise();
                        });

                        spyOn(widget.notifier, "showSucessMessage");
                        spyOn(widget.notifier, "showErrorMessage");
                    });
                    it("Should delete plan", function () {
                        spyOn(widget.dataService, "deletePlan").and.callFake(function () {
                            var defer = $.Deferred();
                            defer.resolve({status: 200});
                            return defer.promise();
                        });
                        $("#delete:eq(0)", widget.getContent()).click();
                        expect(widget.dataService.deletePlan).toHaveBeenCalled();
                        expect(widget.notifier.showSucessMessage).toHaveBeenCalled();
                    });
                    it("Should message error, when status = 500", function () {
                        spyOn(widget.dataService, "deletePlan").and.callFake(function () {
                            var defer = $.Deferred();
                            defer.resolve({status: 500});
                            return defer.promise();
                        });
                        $("#delete:eq(0)", widget.getContent()).click();
                        expect(widget.dataService.deletePlan).toHaveBeenCalled();
                        expect(widget.notifier.showErrorMessage).toHaveBeenCalled();
                    });
                });

                describe("when click on execute", function () {
                    beforeEach(function () {
                        spyOn(bizagi, "showConfirmationBox").and.callFake(function () {
                            var defer = $.Deferred();
                            defer.resolve();
                            return defer.promise();
                        });

                        spyOn(widget.notifier, "showSucessMessage");
                        spyOn(widget.notifier, "showErrorMessage");
                    });
                    it("Should execute plan and updated it", function () {
                        spyOn(widget.dataService, "putExecutePlan").and.callFake(function () {
                            var defer = $.Deferred();
                            defer.resolve("");
                            return defer.promise();
                        });
                        spyOn(widget.dataService, "updatePlan").and.callFake(function () {
                            var defer = $.Deferred();
                            defer.resolve("");
                            return defer.promise();
                        });

                        widget.selectedPlan.activitiesLength = 1;
                        $("#enable:eq(0)", widget.getContent()).click();
                        expect(widget.dataService.putExecutePlan).toHaveBeenCalled();
                        expect(widget.dataService.updatePlan).toHaveBeenCalled();
                        expect(widget.notifier.showSucessMessage).toHaveBeenCalled();
                    });


                });


            });
        });

        describe("runningActivity", function () {
            it("Should true only activity is actived or inactived", function () {
                var activity = {workItemState: "Active"};
                expect(widget.runningActivity(activity)).toBe(true);

                activity = {workItemState: "Inactive"};
                expect(widget.runningActivity(activity)).toBe(true);

                activity = {workItemState: "Other"};
                expect(widget.runningActivity(activity)).toBe(false);
            });
        });

        describe("getCalculatedDateServer", function () {
            it("Should call service", function () {
                widget.serviceLocator = {
                    getUrl: function(){
                        return "key-word";
                    }
                };

                spyOn(widget.dataService, "getCurrentTimeDateServer").and.callFake(function(){
                    var defer = $.Deferred();
                    defer.resolve({date: Date.now()});
                    return defer.promise();
                });
                widget.getCalculatedDateServer();
                expect(widget.dataService.getCurrentTimeDateServer).toHaveBeenCalled();
            });
        });

        describe("getMetaData", function () {
            it("Should call orderActivitiesByTransitions method when there are activities", function () {

                widget.getMetaData("idPlan");

            });
        });

        describe("clean", function () {
            beforeEach(function () {
                spyOn(widget, "unsub");
            });
            it("Should call resetWidget", function () {
                widget.clean();
                expect(widget.unsub).toHaveBeenCalled();
            });
        });
    });

    describe("Feature: Go workitem from plan. ", function () {
        describe("The visibility button,", function () {
            describe("when plan is executing and has not finished and currentActiveActivities > 0", function () {
                var plan, progressPlan, currentActiveActivities;
                it("Should are true", function () {
                    currentActiveActivities = [{name: "test"}];
                    plan = {currentState: "EXECUTING"};
                    progressPlan = 60;//percent
                    expect(widget.getVisibleButtonWorkonit(plan, progressPlan, currentActiveActivities)).toBe(true);

                    progressPlan = 70;//percent
                    expect(widget.getVisibleButtonWorkonit(plan, progressPlan, currentActiveActivities)).toBe(true);

                    progressPlan = 95;//percent
                    expect(widget.getVisibleButtonWorkonit(plan, progressPlan, currentActiveActivities)).toBe(true);

                    progressPlan = 0;//percent
                    expect(widget.getVisibleButtonWorkonit(plan, progressPlan, currentActiveActivities)).toBe(true);
                });
            });
            describe("when plan not is executing and has not finished", function () {
                it("Should are false", function () {
                    plan = {currentState: "CLOSED"};
                    progressPlan = 100;//percent
                    expect(widget.getVisibleButtonWorkonit(plan, progressPlan)).toBe(false);

                    plan = {currentState: "EXECUTING"};
                    progressPlan = 100;//percent
                    expect(widget.getVisibleButtonWorkonit(plan, progressPlan)).toBe(false);
                });
            });
        });

        describe("Go to workitem", function () {
            it("Should execute action route, if resolve service get id case", function () {
                spyOn(widget, "publish");
                widget.goToWorkOnIt(4038, 1234);
                expect(widget.publish).toHaveBeenCalled();
            });
        });
    });
});
