describe("bizagi.workportal.widgets.templates", function () {
    checkWorkportalDependencies();
    var widget, workportalFacade, dataService, actionService, casetoolbar, usersCasesService, actionsEventsService, accumulatedcontext, processActionService;
    var templateEngineParams = {
        "context": "TEMPLATEENGINE-VIEW",
        "data": {
            "widgets": {
                "templates": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.templates"
                },
                "paginator": {
                    "layout": "templates",
                    "name": "bizagi.workportal.widgets.paginator",
                    "canvas": "paginator"
                },
                "sortbar": {
                    "layout": "templates",
                    "name": "bizagi.workportal.widgets.sortbar",
                    "canvas": "sortbar"
                },
                "mysearchfilter": {
                    "layout": "templates",
                    "name": "bizagi.workportal.widgets.mysearchfilter",
                    "canvas": "mysearchfilter"
                },
                "sidebar": {
                    "layout": "leftsidebar",
                    "name": "bizagi.workportal.widgets.sidebar"
                },
                "stuff": {
                    "layout": "sidebar",
                    "name": "bizagi.workportal.widgets.stuff",
                    "canvas": "content1"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                "empty1": {
                    "layout": "rightSidebar",
                    "name": "bizagi.workportal.widgets.dummy",
                    "canvas": "sidebarcontent1"
                }
            },
            "nav": {
                "level": 1
            },
            "belongs": {
                "toLeftSidebarCD": false,
                "toRightSidebarCD": false,
                "toTaskSidebarCD": false
            },
            "level": 1
        },
        "type": "TEMPLATEENGINE-VIEW",
        "args": {
            "filters": [],
            "fromActionLauncher": false,
            "histName": "My Exams",
            "level": 1,
            "page": 1,
            "reference": "a409fa79-f4bc-4c49-81d7-d156a5f9b418",
            "referenceType": "FACT",
            "surrogateKey": 1,
            "guidEntityCurrent": "f3e28715-384c-4a97-a0ff-fb0eadf17ce3",
            "xpath": "MyExams"
        }
    };
    var collectionEntityData = {
        "cells": [
            {
                "id": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "columns": [
                    "id",
                    "finalEnt",
                    "Patient.associatedUser.userPicture",
                    "MedicalCenter.Name",
                    "Request",
                    "DateTime",
                    "Patient.associatedUser.fullName"
                ],
                "timestamp": 1449173452,
                "displayName": null,
                "fieldValue": null,
                "dataType": 0,
                "attributeType": 0
            },
            {
                "id": "09394349-53cc-44b8-aa10-fcf06c7bc535",
                "columns": [
                    "id",
                    "finalEnt",
                    "Doctor.associatedUser.userPicture",
                    "MedicalCenter.Name",
                    "Request",
                    "DateTime"
                ],
                "timestamp": 1449173452,
                "displayName": null,
                "fieldValue": null,
                "dataType": 0,
                "attributeType": 0
            },
            {
                "id": "6bc78b77-53d2-457b-b3fa-86071050af59",
                "columns": [
                    "id",
                    "finalEnt",
                    "Picture",
                    "DateTime",
                    "MedicalCenter.Name",
                    "Results"
                ],
                "timestamp": 1449173452,
                "displayName": null,
                "fieldValue": null,
                "dataType": 0,
                "attributeType": 0
            }
        ],
        "rows": [
            {
                "id": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "row": [
                    "2902",
                    "10017",
                    "",
                    "Johns Hopkins Hospital",
                    "Blood Pregnancy Test",
                    "7/21/2015 11:30:00 AM",
                    "Melissa Gold"
                ],
                "surrogateKey": 2902,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "id": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "row": [
                    "2903",
                    "10017",
                    "",
                    "Johns Hopkins Hospital",
                    "Blood Pregnancy Test",
                    "7/21/2015 11:30:00 AM",
                    "Melissa Gold"
                ],
                "surrogateKey": 2903,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "id": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "row": [
                    "2905",
                    "10017",
                    "",
                    "Johns Hopkins Hospital",
                    "Blood Pregnancy Test",
                    "7/31/2015 11:30:00 AM",
                    "Melissa Gold"
                ],
                "surrogateKey": 2905,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "id": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "row": [
                    "2951",
                    "10017",
                    "",
                    "Johns Hopkins Hospital",
                    "Blood Pregnancy Test",
                    "7/21/2015 11:30:00 AM",
                    "Melissa Gold"
                ],
                "surrogateKey": 2951,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "id": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "row": [
                    "3001",
                    "10017",
                    "",
                    "Johns Hopkins Hospital",
                    "Blood Pregnancy Test",
                    "7/21/2015 11:30:00 AM",
                    "Melissa Gold"
                ],
                "surrogateKey": 3001,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "id": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "row": [
                    "3051",
                    "10017",
                    "",
                    "Johns Hopkins Hospital",
                    "Blood Pregnancy Test",
                    "7/21/2015 11:30:00 AM",
                    "Melissa Gold"
                ],
                "surrogateKey": 3051,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "id": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "row": [
                    "3101",
                    "10017",
                    "",
                    "Johns Hopkins Hospital",
                    "Blood Pregnancy Test",
                    "7/21/2015 11:30:00 AM",
                    "Melissa Gold"
                ],
                "surrogateKey": 3101,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "id": "09394349-53cc-44b8-aa10-fcf06c7bc535",
                "row": [
                    "3002",
                    "10029",
                    "",
                    "TIRR Memorial Hermann",
                    "",
                    ""
                ],
                "surrogateKey": 3002,
                "guidTemplate": "038e7264-5352-444a-82f3-328a1a2b27ac",
                "guidEntity": "09394349-53cc-44b8-aa10-fcf06c7bc535",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "id": "09394349-53cc-44b8-aa10-fcf06c7bc535",
                "row": [
                    "3102",
                    "10029",
                    "",
                    "Clínica del Country",
                    "",
                    "11/11/2015 12:00:00 AM"
                ],
                "surrogateKey": 3102,
                "guidTemplate": "038e7264-5352-444a-82f3-328a1a2b27ac",
                "guidEntity": "09394349-53cc-44b8-aa10-fcf06c7bc535",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "id": "6bc78b77-53d2-457b-b3fa-86071050af59",
                "row": [
                    "3052",
                    "10023",
                    "",
                    "",
                    "Reagan Medical Center",
                    ""
                ],
                "surrogateKey": 3052,
                "guidTemplate": "498bc036-f9c0-4f3a-96dc-9684848ae580",
                "guidEntity": "6bc78b77-53d2-457b-b3fa-86071050af59",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            }
        ],
        "totalPages": 2,
        "currentPage": 1,
        "totalRecords": 17,
        "maxRecords": 0,
        "filters": null,
        "entities": [
            {
                "data": {
                    "id": "2902",
                    "finalEnt": "10017",
                    "Patient.associatedUser.userPicture": "",
                    "MedicalCenter.Name": "Johns Hopkins Hospital",
                    "Request": "Blood Pregnancy Test",
                    "DateTime": "7/21/2015 11:30:00 AM",
                    "Patient.associatedUser.fullName": "Melissa Gold"
                },
                "guid": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "timestamp": 1449173452,
                "surrogateKey": 2902,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "data": {
                    "id": "2903",
                    "finalEnt": "10017",
                    "Patient.associatedUser.userPicture": "",
                    "MedicalCenter.Name": "Johns Hopkins Hospital",
                    "Request": "Blood Pregnancy Test",
                    "DateTime": "7/21/2015 11:30:00 AM",
                    "Patient.associatedUser.fullName": "Melissa Gold"
                },
                "guid": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "timestamp": 1449173452,
                "surrogateKey": 2903,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "data": {
                    "id": "2905",
                    "finalEnt": "10017",
                    "Patient.associatedUser.userPicture": "",
                    "MedicalCenter.Name": "Johns Hopkins Hospital",
                    "Request": "Blood Pregnancy Test",
                    "DateTime": "7/31/2015 11:30:00 AM",
                    "Patient.associatedUser.fullName": "Melissa Gold"
                },
                "guid": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "timestamp": 1449173452,
                "surrogateKey": 2905,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "data": {
                    "id": "2951",
                    "finalEnt": "10017",
                    "Patient.associatedUser.userPicture": "",
                    "MedicalCenter.Name": "Johns Hopkins Hospital",
                    "Request": "Blood Pregnancy Test",
                    "DateTime": "7/21/2015 11:30:00 AM",
                    "Patient.associatedUser.fullName": "Melissa Gold"
                },
                "guid": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "timestamp": 1449173452,
                "surrogateKey": 2951,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "data": {
                    "id": "3001",
                    "finalEnt": "10017",
                    "Patient.associatedUser.userPicture": "",
                    "MedicalCenter.Name": "Johns Hopkins Hospital",
                    "Request": "Blood Pregnancy Test",
                    "DateTime": "7/21/2015 11:30:00 AM",
                    "Patient.associatedUser.fullName": "Melissa Gold"
                },
                "guid": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "timestamp": 1449173452,
                "surrogateKey": 3001,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "data": {
                    "id": "3051",
                    "finalEnt": "10017",
                    "Patient.associatedUser.userPicture": "",
                    "MedicalCenter.Name": "Johns Hopkins Hospital",
                    "Request": "Blood Pregnancy Test",
                    "DateTime": "7/21/2015 11:30:00 AM",
                    "Patient.associatedUser.fullName": "Melissa Gold"
                },
                "guid": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "timestamp": 1449173452,
                "surrogateKey": 3051,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "data": {
                    "id": "3101",
                    "finalEnt": "10017",
                    "Patient.associatedUser.userPicture": "",
                    "MedicalCenter.Name": "Johns Hopkins Hospital",
                    "Request": "Blood Pregnancy Test",
                    "DateTime": "7/21/2015 11:30:00 AM",
                    "Patient.associatedUser.fullName": "Melissa Gold"
                },
                "guid": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "timestamp": 1449173452,
                "surrogateKey": 3101,
                "guidTemplate": "524e055d-6e51-412b-b70a-d0bd7a099435",
                "guidEntity": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "data": {
                    "id": "3002",
                    "finalEnt": "10029",
                    "Doctor.associatedUser.userPicture": "",
                    "MedicalCenter.Name": "TIRR Memorial Hermann",
                    "Request": "",
                    "DateTime": ""
                },
                "guid": "09394349-53cc-44b8-aa10-fcf06c7bc535",
                "timestamp": 1449173452,
                "surrogateKey": 3002,
                "guidTemplate": "038e7264-5352-444a-82f3-328a1a2b27ac",
                "guidEntity": "09394349-53cc-44b8-aa10-fcf06c7bc535",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "data": {
                    "id": "3102",
                    "finalEnt": "10029",
                    "Doctor.associatedUser.userPicture": "",
                    "MedicalCenter.Name": "Clínica del Country",
                    "Request": "",
                    "DateTime": "11/11/2015 12:00:00 AM"
                },
                "guid": "09394349-53cc-44b8-aa10-fcf06c7bc535",
                "timestamp": 1449173452,
                "surrogateKey": 3102,
                "guidTemplate": "038e7264-5352-444a-82f3-328a1a2b27ac",
                "guidEntity": "09394349-53cc-44b8-aa10-fcf06c7bc535",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            },
            {
                "data": {
                    "id": "3052",
                    "finalEnt": "10023",
                    "Picture": "",
                    "DateTime": "",
                    "MedicalCenter.Name": "Reagan Medical Center",
                    "Results": ""
                },
                "guid": "6bc78b77-53d2-457b-b3fa-86071050af59",
                "timestamp": 1449173452,
                "surrogateKey": 3052,
                "guidTemplate": "498bc036-f9c0-4f3a-96dc-9684848ae580",
                "guidEntity": "6bc78b77-53d2-457b-b3fa-86071050af59",
                "guidFavorite": null,
                "idCase": 0,
                "idWorkflow": 0
            }
        ]
    };
    var idCasesOfProcessEntities = [
        {
            "entityId": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
            "surrogateKey": 2902
        },
        {
            "entityId": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
            "surrogateKey": 2903,
            "caseId": 5904
        },
        {
            "entityId": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
            "surrogateKey": 2905,
            "caseId": 5906
        },
        {
            "entityId": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
            "surrogateKey": 2951,
            "caseId": 5952
        },
        {
            "entityId": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
            "surrogateKey": 3001
        },
        {
            "entityId": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
            "surrogateKey": 3051
        },
        {
            "entityId": "69249aa3-9610-4cef-a0be-b772eefaa0c1",
            "surrogateKey": 3101,
            "caseId": 6203
        },
        {
            "entityId": "09394349-53cc-44b8-aa10-fcf06c7bc535",
            "surrogateKey": 3002
        },
        {
            "entityId": "09394349-53cc-44b8-aa10-fcf06c7bc535",
            "surrogateKey": 3102,
            "caseId": 6202
        },
        {
            "entityId": "6bc78b77-53d2-457b-b3fa-86071050af59",
            "surrogateKey": 3052
        }
    ];

    beforeEach(function () {
        workportalFacade = bizagi.injector.get("workportalFacade");
        dataService = bizagi.injector.get("dataService");
        actionService = bizagi.injector.get("actionService");
        casetoolbar = bizagi.injector.get("casetoolbar");
        usersCasesService = bizagi.injector.get("usersCasesService");
        actionsEventsService = bizagi.injector.get("actionsEventsService");
        accumulatedcontext = bizagi.injector.get("accumulatedcontext");
        processActionService = bizagi.injector.get("processActionService");

        widget = new bizagi.workportal.widgets.templates(
            workportalFacade,
            dataService,
            actionService,
            casetoolbar,
            usersCasesService,
            actionsEventsService,
            accumulatedcontext,
            processActionService,
            {}
        );
    });

    it("Should define the Widget", function(){
        expect(workportalFacade).toBeDefined();
        expect(dataService).toBeDefined();
        expect(actionService).toBeDefined();
        expect(casetoolbar).toBeDefined();
        expect(usersCasesService).toBeDefined();
        expect(actionsEventsService).toBeDefined();
        expect(accumulatedcontext).toBeDefined();
        expect(processActionService).toBeDefined();
        expect(widget).toBeDefined();
    });

    describe("Behavior initializing the widget", function () {
        var promiseRender;

        beforeEach(function () {
            var defer = new $.Deferred();
            promiseRender = defer.promise();

            $.when(widget.areTemplatedLoaded()).then(function(){
                return widget.render();
            }).done(function($content) {
                defer.resolve($content);
            });
        });

        it("Should render the content", function() {
            $.when(promiseRender).done( function ($content) {
                expect($content).not.toBe("");
                expect($content).toBeDefined();
            });
        });

        it("Should define the events", function() {
            $.when(promiseRender).done( function ($content) {
                var events = $._data(widget.observableElement[0], "events");

                expect(events["GET-COMMON-ACTIONS"]).toBeDefined();
                expect(events["TEMPLATEENGINE-VIEW"]).toBeDefined();
                expect(events["SEARCH-ENGINE-VIEW"]).toBeDefined();
                expect(events["UPDATE-DATATEMPLATE-VIEW"]).toBeDefined();
                expect(events["SET-VALUES"]).toBeDefined();
            });
        });

        it("Should detach the events", function() {
            $.when(promiseRender).done( function ($content) {
                widget.clean();
                var events = $._data(widget.observableElement[0], "events");
                expect(events).toBeUndefined();
            });
        });

    });
    describe("Behavior rendering the data", function () {
        var promiseRender;

        beforeEach(function () {
            sinon.stub(dataService, "getCollectionEntityData", function() {
                var defer = new $.Deferred();
                defer.resolve(collectionEntityData);
                return defer.promise();
            });

            sinon.stub(dataService, "getIdCasesOfProcessEntities", function() {
                var defer = new $.Deferred();
                defer.resolve(idCasesOfProcessEntities);
                return defer.promise();
            });

            sinon.stub(bizagi.loader, "start", function() {
                var defer = new $.Deferred();
                defer.resolve();
                return defer.promise();
            });

            var defer = new $.Deferred();
            promiseRender = defer.promise();

            $.when(widget.areTemplatedLoaded()).then( function() {
                return widget.render();
            }).done(function($content) {
                defer.resolve($content);
            });
        });

        afterEach(function () {
            dataService.getCollectionEntityData.restore();
            dataService.getIdCasesOfProcessEntities.restore();
            bizagi.loader.start.restore();
        });

        it("Should render the entities", function() {
            $.when(promiseRender).done( function ($content) {
                widget.pub("TEMPLATEENGINE-VIEW", templateEngineParams);
            });
        });
    });
});
