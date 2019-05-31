﻿﻿describe("Widget desktop.widgets.sortbar", function () {
    checkWorkportalDependencies();
    var widget, workportalFacade, dataService, processActionService, accumulatedcontext;

    beforeEach(function () {
        workportalFacade = bizagi.injector.get("workportalFacade");
        dataService = bizagi.injector.get("dataService");
        processActionService = bizagi.injector.get("processActionService");
        accumulatedcontext = bizagi.injector.get("accumulatedcontext");

        widget = new bizagi.workportal.widgets.sortbar(workportalFacade, dataService, processActionService, accumulatedcontext, {});
    });

    it("Should define the Widget", function(){
        expect(workportalFacade).toBeDefined();
        expect(dataService).toBeDefined();
        expect(processActionService).toBeDefined();
        expect(accumulatedcontext).toBeDefined();
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
                var $menuLeft = $content.find('.sortbar-left');
                var $menuRight = $content.find('.sortbar-right');

                expect($content).not.toBe("");
                expect($content).toBeDefined();

                expect($menuLeft.length).toEqual(1);
                expect($menuRight.length).toEqual(1);
            });
        });

        it("Should configure the handlers", function(){
            $.when(promiseRender).done( function ($content) {
                var widgetEvents = $._data(widget.observableElement[0], "events");
                var leftMenuEvents = $._data( $('.left-menu', $content)[0], "events" );
                var rightMenuEvents = $._data( $('.right-menu', $content)[0], "events" );
                var sortMenuEvents = $._data( $('.sortbar-az', $content)[0], "events" );
                var filterMenuEvents = $._data( $('.filter-icon', $content)[0], "events" );

                expect(widgetEvents["TEMPLATEENGINE-VIEW"]).toBeDefined();
                expect(widgetEvents["SEARCH-ENGINE-VIEW"]).toBeDefined();
                expect(widgetEvents["SET-FILTERS-DATA"]).toBeDefined();
                expect(widgetEvents["ENABLE-BATCHS-ACTIONS"]).toBeDefined();

                expect(leftMenuEvents).toBeDefined();
                expect(rightMenuEvents).toBeDefined();
                expect(sortMenuEvents).toBeDefined();
                expect(filterMenuEvents).toBeDefined();
            });
        });

        it("Should clean the handlers", function(){
            $.when(promiseRender).done( function ($content) {
                widget.clean();
                var widgetEvents = $._data(widget.observableElement[0], "events");
                var leftMenuEvents = $._data( $('.left-menu', $content)[0], "events" );
                var rightMenuEvents = $._data( $('.right-menu', $content)[0], "events" );
                var sortMenuEvents = $._data( $('.sortbar-az', $content)[0], "events" );
                var filterMenuEvents = $._data( $('.filter-icon', $content)[0], "events" );

                expect(widgetEvents).toBeUndefined();
                expect(leftMenuEvents).toBeUndefined();
                expect(rightMenuEvents).toBeUndefined();
                expect(sortMenuEvents).toBeUndefined();
                expect(filterMenuEvents).toBeUndefined();
            });
        });
    });

    describe("Rigth menu behaviour", function() {
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

        it("Should set the filters data and display the filter and sort icons", function() {
            $.when(promiseRender).done( function ($content) {
                var params = {
                    "type": "SET-FILTERS-DATA",
                    "args": {
                        "filters": [
                            {
                                "attribute": "associatedUser.fullName",
                                "display": "32fde23c-7597-4c4c-ac96-4bd2fed9d653:DisplayName",
                                "type": "Text",
                                "data": {}
                            },
                            {
                                "attribute": "Specialty.Name",
                                "display": "Name",
                                "type": "Text",
                                "data": {}
                            },
                            {
                                "attribute": "Specialty",
                                "display": "Specialty",
                                "type": "Entity",
                                "data": {
                                    "defaultValues": [
                                        {
                                            "id": "1",
                                            "displayName": "Gynecologist"
                                        },
                                        {
                                            "id": "2",
                                            "displayName": "General practitioner"
                                        },
                                        {
                                            "id": "3",
                                            "displayName": "Pathologist"
                                        },
                                        {
                                            "id": "51",
                                            "displayName": "Microbiology"
                                        },
                                        {
                                            "id": "",
                                            "displayName": ""
                                        }
                                    ]
                                }
                            },
                            {
                                "attribute": "MedicalSchool",
                                "display": "Medical School",
                                "type": "Text",
                                "data": {}
                            },
                            {
                                "attribute": "PhoneNumber",
                                "display": "Phone Number",
                                "type": "Text",
                                "data": {}
                            },
                            {
                                "attribute": "associatedUser.contactEmail",
                                "display": "f1dfea9e-b5af-4576-b68b-bf042e9b9c19:DisplayName",
                                "type": "Text",
                                "data": {}
                            }
                        ],
                        "filtersApplied": [],
                        "filtersAppliedCounter": 1,
                        "totalRecords": 8,
                        "calculateFilters": true
                    },
                    "context": "SET-FILTERS-DATA"
                };
                widget.pub("SET-FILTERS-DATA", params);

                expect($(".filter-icon", $content).css("display")).toBe("block");
                expect($(".sortbar-text", $content).css("display")).toBe("block");
                expect($(".sortbar-icon", $content).css("display")).toBe("block");
                expect($(".counter-filters-applied", $content).css("display")).toBe("inline");

            });
        });

        it("Should set the filters data without displaying the filter and sort icons", function() {
            $.when(promiseRender).done( function ($content) {
                var params = {
                    "type": "SET-FILTERS-DATA",
                    "args": {
                        "filters": [],
                        "filtersApplied": [],
                        "filtersAppliedCounter": 0,
                        "totalRecords": 1,
                        "calculateFilters": true
                    },
                    "context": "SET-FILTERS-DATA"
                };
                widget.pub("SET-FILTERS-DATA", params);

                expect($(".filter-icon", $content).css("display")).toBe("none");
                expect($(".sortbar-text", $content).css("display")).toBe("none");
                expect($(".sortbar-icon", $content).css("display")).toBe("none");
                expect($(".counter-filters-applied", $content).css("display")).toBe("none");

            });
        });

        it("Should set the filters data without displaying the menu", function() {
            $.when(promiseRender).done( function ($content) {
                var params = {
                    "type": "SET-FILTERS-DATA",
                    "args": {
                        "filters": [],
                        "filtersApplied": [],
                        "filtersAppliedCounter": 0,
                        "totalRecords": 0,
                        "calculateFilters": true
                    },
                    "context": "SET-FILTERS-DATA"
                };
                widget.pub("SET-FILTERS-DATA", params);

                expect($(".sortbar-right", self.content).length).toBe(0);
            });
        });

        it("Should show the sort menu", function() {
            $.when(promiseRender).done( function ($content) {
                expect($(".sortbar-box-menu", $content).css("display")).toBeUndefined();
                $content.find('.right-menu').trigger("click");
                expect($(".sortbar-box-menu", $content)).toBeDefined();
                expect($(".sortbar-box-menu", $content).css("display")).toBe("block");
            });
        });

        it("Should sent the notification to sort the data in desc order", function() {
            $.when(promiseRender).done( function ($content) {
                sinon.spy(widget, "pub");
                widget.sortSelection = {};
                widget.sortSelection.attribute = "Specialty.Name";
                $content.find('.sortbar-az').trigger("click");
                expect(widget.pub.called).toBe(true);
            });
        });

        it("Should show the filterbar", function() {
            $.when(promiseRender).done( function ($content) {
                sinon.spy(widget, "pub");
                $content.find('.filter-icon').trigger("click");
                expect(widget.pub.called).toBe(true);
            });
        });
    });

    describe("Left menu behaviour", function() {
        var promiseRender;
        var args = {
            "type": "TEMPLATEENGINE-VIEW",
            "args": {
                "calculateFilters": true,
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
        var actions = {
            "args": {
                "commonActions": {
                    "actions": [
                        {
                            "id": "5cbef7bd-deaf-4732-9694-4d9c027bcdbf",
                            "displayName": "DoctorAL",
                            "type": "Rule",
                            "reference": "5454c6c0-4a16-4a23-912b-d63d8fec794d",
                            "multiplicity": 1,
                            "description": "AL",
                            "hasStartForm": false,
                            "entityId": "",
                            "entityName": "",
                            "isCase": false,
                            "surrogateKey": 51,
                            "guidEntity": "954a463f-00ed-44d1-87c6-d8862c14115a",
                            "idCase": 51
                        },
                        {
                            "id": "93f908b0-f5cd-4b88-b730-f5fa8507c37a",
                            "displayName": "Request an appointment",
                            "type": "Process",
                            "reference": "1fcdc29c-91b1-48f2-ad44-70c0b3538fa3",
                            "multiplicity": 1,
                            "description": "Request an appointment",
                            "hasStartForm": true,
                            "entityId": "c30bfc32-f191-4e11-8c49-f0ee10f86a40",
                            "entityName": "AppointmentRequest",
                            "isCase": false,
                            "surrogateKey": 51,
                            "guidEntity": "954a463f-00ed-44d1-87c6-d8862c14115a",
                            "idCase": 51
                        },
                        {
                            "id": "af9e2aaa-eeb4-4ac5-b277-8aeff654e89a",
                            "displayName": "Rate doctor's service",
                            "type": "Process",
                            "reference": "2d6ad370-230d-49db-9f11-63f06f42723d",
                            "multiplicity": 1,
                            "description": "Rate doctor's service",
                            "hasStartForm": false,
                            "entityId": "50dee7ea-de28-4ec5-9d38-bf0f6b49610d",
                            "entityName": "RateService",
                            "isCase": false,
                            "surrogateKey": 51,
                            "guidEntity": "954a463f-00ed-44d1-87c6-d8862c14115a",
                            "idCase": 51
                        },
                        {
                            "id": "bc28627f-2e19-491f-a68e-d4e977c09c9f",
                            "displayName": "View",
                            "type": "Form",
                            "reference": "5141b80f-ed2c-4527-86a2-dadefcef9598",
                            "multiplicity": 1,
                            "description": "View",
                            "hasStartForm": false,
                            "entityId": "",
                            "entityName": "",
                            "isCase": false,
                            "surrogateKey": 51,
                            "guidEntity": "954a463f-00ed-44d1-87c6-d8862c14115a",
                            "idCase": 51
                        },
                        {
                            "id": "f5bae237-7d86-475d-b583-67df8201441c",
                            "displayName": "Telephone advice",
                            "type": "Process",
                            "reference": "752c44b2-42fa-495b-aad8-2eb085f143e7",
                            "multiplicity": 2,
                            "description": "Telephone advice",
                            "hasStartForm": false,
                            "entityId": "a0c00d8f-d980-48a5-9c0d-f3f87f7d1320",
                            "entityName": "Telephoneadvice",
                            "isCase": false,
                            "surrogateKey": 51,
                            "guidEntity": "954a463f-00ed-44d1-87c6-d8862c14115a",
                            "idCase": 51
                        }
                    ],
                    "surrogateKeys": [
                        "51",
                        "52"
                    ],
                    "checkAll": true,
                    "guidEntity": "954a463f-00ed-44d1-87c6-d8862c14115a"
                }
            }
        };

        beforeEach(function () {
            sinon.stub(dataService, "getProcessAddAction", function(){
                var defer = new $.Deferred();
                var action = {
                    "id": "ae503e55-807f-443a-92e8-79c927e3d46e",
                    "displayName": "test",
                    "type": "Process",
                    "reference": "2ca8b5a4-f3ec-4bce-bc2b-f15a12744ee3",
                    "description": "test",
                    "guidEntity": "adbe4ce5-3683-4a42-93b2-b8668eb4baf7",
                    "xpathContext": "actionLauncherEntity",
                    "startForm": true
                };
                defer.resolve(action);
                return defer;
            });

            sinon.stub(dataService, "getMapping", function(){
                var defer = new $.Deferred();
                var mapping = [];
                defer.resolve(mapping);
                return defer;
            });

            var defer = new $.Deferred();
            promiseRender = defer.promise();

            $.when(widget.areTemplatedLoaded()).then(function(){
                return widget.render();
            }).done(function($content) {
                defer.resolve($content);
            });
        });

        afterEach(function () {
            dataService.getProcessAddAction.restore();
            dataService.getMapping.restore();
        });

        it("Should render the add button and execute process action", function() {
            $.when(promiseRender).done( function ($content) {
                sinon.spy(widget, "processAddButton");
                sinon.spy(widget, "renderButton");
                sinon.spy(widget, "onExecuteProcess");

                widget.processFilterButton(null, args);
                expect(widget.processAddButton.called).toBe(true);
                expect(widget.renderButton.called).toBe(true);
                expect($(".wgd-sortbar-add-button", $content)).toBeDefined();

                var action = {
                    "id": "ae503e55-807f-443a-92e8-79c927e3d46e",
                    "displayName": "test",
                    "type": "Process",
                    "reference": "2ca8b5a4-f3ec-4bce-bc2b-f15a12744ee3",
                    "description": "test",
                    "guidEntity": "adbe4ce5-3683-4a42-93b2-b8668eb4baf7",
                    "xpathContext": "actionLauncherEntity",
                    "startForm": true
                };
                widget.clickAddButton(action);
                expect(widget.onExecuteProcess.called).toBe(true);
            });
        });

        it("Should render the add button and execute form action", function() {
            $.when(promiseRender).done( function ($content) {
                sinon.spy(widget, "processAddButton");
                sinon.spy(widget, "renderButton");
                sinon.spy(widget, "onExecuteForm");

                widget.processFilterButton(null, args);
                expect(widget.processAddButton.called).toBe(true);
                expect(widget.renderButton.called).toBe(true);
                expect($(".wgd-sortbar-add-button", $content)).toBeDefined();

                var action = {
                    "id": "ae503e55-807f-443a-92e8-79c927e3d46e",
                    "displayName": "test",
                    "type": "Form",
                    "reference": "2ca8b5a4-f3ec-4bce-bc2b-f15a12744ee3",
                    "description": "test",
                    "guidEntity": "adbe4ce5-3683-4a42-93b2-b8668eb4baf7",
                    "xpathContext": "actionLauncherEntity",
                };
                widget.clickAddButton(action);
                expect(widget.onExecuteForm.called).toBe(true);
            });
        });

        it("Should show the common actions menu and execute an action", function() {
            $.when(promiseRender).done( function ($content) {
                sinon.spy(widget, "onShowMenu");
                widget.enableBatchActions(actions);
                $content.find('.left-menu').trigger("click");
                expect(widget.onShowMenu.called).toBe(true);
                expect($(".sortbar-box-tooltip", $content)).toBeDefined();
            });
        });

        it("Should get the correct action", function() {
            $.when(promiseRender).done( function ($content) {
                widget.enableBatchActions(actions);
                var action = widget.getAction("f5bae237-7d86-475d-b583-67df8201441c");
                expect(action).toBeDefined();
                expect(action.displayName).toBe("Telephone advice");
            });
        });
    });
});

