describe("Widget desktop.widgets.updateform", function () {
    checkWorkportalDependencies();
    var widget, dataService, workportalFacade;
    var params = {
        "closeVisible": false,
        "modalParameters": {
            "title": "Comments Test Actions"
        },
        "guidForm": "2fc892ac-7322-4fc0-88af-2554f682bef5",
        "entityGuid": "1f13e0e2-1ce2-4585-acb2-be914e77a95a",
        "surrogateKey": 1,
        "readonlyform": true
    };
    var form = {
        "form": {
            "properties": {
                "id": "2fc892ac-7322-4fc0-88af-2554f682bef5",
                "orientation": "ltr",
                "xpathContext": ""
            },
            "elements": [
                {
                    "container": {
                        "properties": {
                            "id": "064efd73-ae93-425a-a3da-5639be9a0e15",
                            "type": "tab",
                            "displayName": "Tab"
                        },
                        "elements": [
                            {
                                "container": {
                                    "properties": {
                                        "id": "39ed9309-386e-4b20-80df-5909a10c3458",
                                        "type": "tabItem",
                                        "displayName": "New comment"
                                    },
                                    "elements": [
                                        {
                                            "render": {
                                                "properties": {
                                                    "id": "a2660ecc-58f4-4606-943d-5baa99725065",
                                                    "xpath": "@KeyValue.Action_a2660ecc-58f4-4606-943d-5baa99725065",
                                                    "xpathActions": "Client",
                                                    "type": "entityTemplate",
                                                    "guidRelatedEntity": "d2c3bfa7-026c-487f-8d66-e44c4fefd917",
                                                    "idRelatedEntity": "10002",
                                                    "guidEntity": "d2c3bfa7-026c-487f-8d66-e44c4fefd917",
                                                    "additionalXpath": [],
                                                    "surrogatedKey": 1,
                                                    "selecttemplate": "e5fd7a3e-d4a5-464a-9b86-568427a86bfd",
                                                    "templatetype": "template"
                                                }
                                            }
                                        },
                                        {
                                            "render": {
                                                "properties": {
                                                    "id": "cad947f2-5c5e-4be4-8664-3acfee55a46f",
                                                    "type": "text",
                                                    "xpath": "Feedback",
                                                    "displayName": "New workout comment",
                                                    "maxLength": 500,
                                                    "dataType": 15,
                                                    "textFormat": {},
                                                    "helpText": "",
                                                    "value": "It was a good training today. Keep it up!",
                                                    "autoExtend": false
                                                }
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                "container": {
                                    "properties": {
                                        "id": "452d167b-9f0d-4911-898f-d8a393ee359d",
                                        "type": "tabItem",
                                        "displayName": "Comments"
                                    },
                                    "elements": [
                                        {
                                            "render": {
                                                "properties": {
                                                    "id": "1dbb6518-0d75-42c5-bc60-b6cbdf14c9ea",
                                                    "type": "grid",
                                                    "xpath": "Client.Comments",
                                                    "editable": false,
                                                    "displayName": "Comments",
                                                    "helpText": "",
                                                    "submitOnChange": true,
                                                    "simplexpath": "Client.Comments",
                                                    "data": {
                                                        "records": 4,
                                                        "total": 1,
                                                        "rows": [
                                                            [
                                                                1,
                                                                [
                                                                    [
                                                                        1,
                                                                        "Personal"
                                                                    ]
                                                                ],
                                                                "It was a good training today. Keep it up!"
                                                            ],
                                                            [
                                                                51,
                                                                [
                                                                    [
                                                                        1,
                                                                        "Personal"
                                                                    ]
                                                                ],
                                                                "Better keep an eye on those abs"
                                                            ],
                                                            [
                                                                52,
                                                                [
                                                                    [
                                                                        1,
                                                                        "Personal"
                                                                    ]
                                                                ],
                                                                "Remember to eat healthy this weekend!!"
                                                            ],
                                                            [
                                                                101,
                                                                [
                                                                    [
                                                                        1,
                                                                        "Personal"
                                                                    ]
                                                                ],
                                                                "I recommend scheduling a followup with the nutricionist"
                                                            ]
                                                        ],
                                                        "editable": [
                                                            [
                                                                1,
                                                                true,
                                                                true
                                                            ],
                                                            [
                                                                51,
                                                                true,
                                                                true
                                                            ],
                                                            [
                                                                52,
                                                                true,
                                                                true
                                                            ],
                                                            [
                                                                101,
                                                                true,
                                                                true
                                                            ]
                                                        ],
                                                        "visible": [
                                                            [
                                                                1,
                                                                true,
                                                                true
                                                            ],
                                                            [
                                                                51,
                                                                true,
                                                                true
                                                            ],
                                                            [
                                                                52,
                                                                true,
                                                                true
                                                            ],
                                                            [
                                                                101,
                                                                true,
                                                                true
                                                            ]
                                                        ],
                                                        "page": 1
                                                    }
                                                },
                                                "elements": [
                                                    {
                                                        "render": {
                                                            "properties": {
                                                                "id": "6b2e5602-4a78-41a6-906d-080ce416811c",
                                                                "type": "columnCombo",
                                                                "xpath": "Trainer",
                                                                "xpath-column": "columns(localize(Trainer), 'Id', 'Name')",
                                                                "displayName": "Trainer",
                                                                "dataType": 2,
                                                                "textFormat": {},
                                                                "totalize": {
                                                                    "format": {}
                                                                },
                                                                "hasTotalizer": true
                                                            }
                                                        }
                                                    },
                                                    {
                                                        "render": {
                                                            "properties": {
                                                                "id": "9610c514-77f6-43f4-bfa3-17de7562514b",
                                                                "type": "columnText",
                                                                "xpath": "Feedback",
                                                                "xpath-column": "Feedback",
                                                                "displayName": "Feedback",
                                                                "textFormat": {},
                                                                "maxLength": 500,
                                                                "dataType": 15,
                                                                "totalize": {
                                                                    "format": {}
                                                                },
                                                                "hasTotalizer": true,
                                                                "autoExtend": false
                                                            }
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ],
            "buttons": [
                {
                    "button": {
                        "properties": {
                            "id": "ec0a5a02-0f81-44a7-8d64-ac090a01d61b",
                            "caption": "render-form-button-save",
                            "actions": [
                                "submitData",
                                "refresh"
                            ]
                        }
                    }
                },
                {
                    "button": {
                        "properties": {
                            "id": "746f222d-1f14-49d6-817f-939d038133de",
                            "caption": "render-form-button-cancel",
                            "actions": [
                                "cancel"
                            ]
                        }
                    }
                }
            ],
            "sessionId": "pffudkk2jitvzngp5ljdrt1n",
            "pageCacheId": "131453202"
        },
        "type": "form"
    };

    beforeEach(function(){
        dataService = bizagi.injector.get("dataService");
        workportalFacade = bizagi.injector.get("workportalFacade");
        widget = new bizagi.workportal.widgets.updateform(workportalFacade, dataService, params);
    });

    it("Should define the Widget", function(){
        expect(dataService).toBeDefined();
        expect(workportalFacade).toBeDefined();
        expect(widget).toBeDefined();
    });

    describe("Behavior when getting the form", function() {
        var promiseRender;
        beforeEach(function(){
            sinon.stub(dataService, "getEntityForm", function(){
                var defer = new $.Deferred();
                defer.resolve(form);
                return defer.promise();
            });

            var defer = new $.Deferred();
            promiseRender = defer.promise();

            sinon.spy(widget, '_getServiceParams');

            $.when(widget.areTemplatedLoaded()).then(function(){
                return widget.render();
            }).done(function($content) {
                defer.resolve($content);
            });
        });

        afterEach(function(){
            dataService.getEntityForm.restore();
        });

        it("Should display the form", function() {
            $.when(promiseRender).done( function ($content) {
                expect($content).not.toBe("");
                expect($content).toBeDefined();
                expect(widget._getServiceParams.called).toBe(true);
            });
        });

        it("Should get the canvas used renderize the start form", function() {
            $.when(promiseRender).done( function ($content) {
                var $canvas = widget._getCanvasForm();
                expect($canvas).not.toBe("");
                expect($canvas).toBeDefined();
            });
        });

        it("Should define all the service params", function() {
            $.when(promiseRender).done( function ($content) {
                var serviceParams = widget._getServiceParams();

                expect(serviceParams.h_action).toBeDefined();
                expect(serviceParams.h_action).toBe("LOADENTITYFORM");

                expect(serviceParams.h_contexttype).toBeDefined();
                expect(serviceParams.h_contexttype).toBe("entity");

                expect(serviceParams.h_guidForm).toBeDefined();
                expect(serviceParams.h_guidForm).toBe("2fc892ac-7322-4fc0-88af-2554f682bef5");

                expect(serviceParams.h_showDisabled).toBeDefined();
                expect(serviceParams.h_showDisabled).toBe(false);

                expect(serviceParams.h_guidEntity).toBeDefined();
                expect(serviceParams.h_guidEntity).toBe("1f13e0e2-1ce2-4585-acb2-be914e77a95a");

                expect(serviceParams.h_surrogateKey).toBeDefined();
                expect(serviceParams.h_surrogateKey).toBe(1);

                expect(serviceParams.h_readonlyform).toBeDefined();
                expect(serviceParams.h_readonlyform).toBe(true);
            });
        });
    });
});
