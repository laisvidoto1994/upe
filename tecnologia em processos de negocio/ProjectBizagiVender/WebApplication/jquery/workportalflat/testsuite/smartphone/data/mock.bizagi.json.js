var BIZAGI_RESPONSE_TIME = 0;
//var BIZAGI_MOCKS_PATH = "jquery/workportalflat/testsuite/tablet/data/";
//var BIZAGI_MOCKS_PATH = "jquery/workportalflat/webparts/common/";

bizagi.loader.loadFile(
    { "src": bizagi.getJavaScript("common.base.dev.jquery.mockjax"), "coverage": false },
    { "src": bizagi.getJavaScript("common.base.dev.jquery.mockjson"), "coverage": false })
    .then(function () {

        var fullDate = new Date();
        var tmpDay = fullDate.getDate();
        var tmpMonth = fullDate.getMonth() + 1;
        var tmpYear = fullDate.getFullYear();
        $.mockJSON.data.CURRENT_DATE = [
            tmpMonth + '/' + tmpDay + '/' + tmpYear
        ];

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        $.mockJSON.data.TOMORROW_DATE = [
            (tomorrow.getMonth() + 1) + '/' + tomorrow.getDate() + '/' + tomorrow.getFullYear()
        ];

        var nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        $.mockJSON.data.NEXT_MONTH_DATE = [
            (nextMonth.getMonth() + 1) + '/' + nextMonth.getDate() + '/' + nextMonth.getFullYear()
        ];

        //$.mockjaxSettings.responseTime = 5000; //4000; //10; //2000;
        // DUMMIES
        $.mockjax(function (settings) {
            if (settings.dataType == "text") {
                if (!BIZAGI_ENABLE_MOCKS) return;
                if (settings.url.indexOf("Rest/Handlers/Render") > -1) {
                    return "false";
                }
            }

            if (settings.dataType == "json") {

                if (!BIZAGI_ENABLE_MOCKS) return;

                if (settings.url.indexOf("Rest/Multilanguage/Client") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/testsuite/smartphone/data/dummy.multilenguaje.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Entities/Mapping") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/renderTemplates/test/data/dummy.mappin.process.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Handlers/MultiAction") > -1 && settings.data.h_actions.indexOf("LOADTEMPLATE") > -1) {
                    var actions = JSON.parse(settings.data.h_actions);
                    $.mockJSON.data.TAG = [actions[0].h_tag];
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/renderTemplates/test/data/dummy.multiaction.loadtemplate.txt"
                    }
                }

                if (settings.url.indexOf("Rest/Stakeholder/CollectionData") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/renderTemplates/test/data/dummy.collectionData.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Stakeholder/Collections") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/stuff/test/data/dummy.collections.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Processes/SearchCases") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/taskFeed/test/data/dummy.txt",
                        transform: function (response, originalSettings) {
                            var elements = response.elements.sort(function (a, b) {
                                var dateA = new Date(a[3]), dateB = new Date(b[3]);
                                if (dateA < dateB) // Sort string ascending
                                    return -1;
                                if (dateA > dateB)
                                    return 1;
                                return 0; // Default return value (no sorting)
                            });

                            var iStart = (originalSettings.data.page * originalSettings.data.pageSize) - originalSettings.data.pageSize;
                            var iEnd = (originalSettings.data.page * originalSettings.data.pageSize);

                            response.page = originalSettings.data.page;

                            response.totalPages = Math.ceil(response.elements.length / originalSettings.data.pageSize);

                            var dateMock = new Date(2014, 04, 22, 0, 0, 0, 0);
                            var tmpDate = new Date();
                            var today = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), tmpDate.getDate(), 0, 0, 0, 0);

                            var datediff = (today.getTime() - dateMock.getTime());

                            elements = elements.slice(iStart, iEnd);

                            for (var i = 0, len = elements.length; i < len; i++) {
                                var cdMilliseconds = new Date(elements[i][3]).getTime();
                                elements[i][3] = new Date((cdMilliseconds + datediff));
                            }
                            response.elements = elements;
                            return response;
                        }
                    };
                }

                if (settings.url.indexOf("Rest/Processes/CustomizedColumnsData") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/smartphone/menu/test/data/dummy2.txt"
                    };
                }
                // New Case Webpart
                if (settings.url.indexOf("Rest/Processes/Categories") > -1) {
                    if (settings.data.idCategory) {
                        if (settings.data.idCategory === "1000") {
                            return {
                                mockjson: "jquery/workportalflat/webparts/common/newCase/test/data/dummy.categories.allprocess.txt"
                            };
                        }
                        return {
                            mockjson: "jquery/workportalflat/webparts/common/newCase/test/data/dummy.categories.txt"
                        };
                    } else if (settings.data.idApp) {
                        if (settings.data.idApp === 1000) {
                            return {
                                mockjson: "jquery/workportalflat/webparts/common/newCase/test/data/dummy.categories.app.allprocess.txt"
                            };
                        }
                        return {
                            mockjson: "jquery/workportalflat/webparts/common/newCase/test/data/dummy.categories.app.txt"
                        };
                    } else {
                        return {
                            mockjson: "jquery/workportalflat/webparts/common/newCase/test/data/dummy.categories.group.txt"
                        };
                    }
                }

                // Summary Case - Details (Rest/Cases/{idCase}/Summary)
                if ((/Rest\/Cases\/\d+\/Summary/).test(settings.url)) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/summaryCase/test/data/dummy.summarycase.txt",
                    };
                }

                // Summary Case - Assignees (Rest/Cases/{idCase}/Assignees)
                if ((/Rest\/Cases\/\d+\/Assignees/).test(settings.url)) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/summaryCase/test/data/dummy.summarycase.assignees.txt",
                    };
                }

                // Summary Case - Comments (Rest/Cases/{idCase}/Comments)
                if ((/Rest\/Cases\/\d+\/Comments/).test(settings.url)) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/summaryCase/test/data/dummy.summarycase.comments.txt",
                    };
                }
                // Summary Case - Events (Rest/Cases/{idCase}/Events)
                if ((/Rest\/Cases\/\d+\/Comments/).test(settings.url)) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/summaryCase/test/data/dummy.summarycase.events.txt",
                    };
                }

                if (settings.url.indexOf("Rest/Cases") > -1 && settings.url.indexOf("WorkItems") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/newCase/test/data/dummy.workitems.txt"
                    };
                }

                if (/Rest\/Processes\/StartProcess\/\d+/.test(settings.url)) {
                    if (/Rest\/Processes\/StartProcess\/1/.test(settings.url)) {
                        return {
                            mockjson: "jquery/workportalflat/webparts/common/newCase/test/data/dummy.createcase.startform.txt"
                        };
                    } else {
                        return {
                            mockjson: "jquery/workportalflat/webparts/common/newCase/test/data/dummy.createcase.txt"
                        };
                    }
                }

                if (settings.url.indexOf("Rest/Case") > -1) {
                    self.idWfClass = null;
                    if (settings.data.idWfClass === "1000") {
                        self.idWfClass = 1000;
                    }
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/newCase/test/data/dummy.createcase.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Processes/RecentProcesses") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/newCase/test/data/dummy.categories.allprocess.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Handlers/Render") > -1) {
                    if (settings.data.h_action === "LOADSTARTFORM") {
                        return {
                            mockjson: "jquery/workportalflat/webparts/common/render/test/data/dummy.rendering.startForm.txt"
                        };
                    }
                    if (self.idWfClass === 1000 || settings.data.h_idCase === 1000) {
                        return {
                            mockjson: "jquery/workportalflat/webparts/common/render/test/data/dummy.rendering.all.txt"
                        };
                    }

                    if (settings.data.h_idCase === 3951) {
                        return {
                            responseText: {
                                "form": {
                                    "properties": { "id": "c53cad45-7039-4e6b-8730-33c79cb42a9c", "displayName": "FrmSearchPatient", "typeForm": "searchesFormList", "formType": "searchesFormList", "xpathContext": "" },
                                    "elements": [
                                        { "render": { "properties": { "id": "ff8498d3-3823-4da7-9384-ff7e91b9305f", "type": "rangeDate", "xpath": "rangeDate", "displayName": "rangeDate displayName" } } },
                                        { "render": { "properties": { "id": "ff8498d3-3823-4da7-9384-ff7e91b9305g", "type": "rangeMoney", "xpath": "rangeMoney", "displayName": "rangeMoney displayName" } } },
                                        { "render": { "properties": { "id": "ff8498d3-3823-4da7-9384-ff7e91b9305h", "type": "rangeNumber", "xpath": "rangeNumber", "displayName": "rangeNumber displayName" } } },
                                        {
                                            "render": {
                                                "properties": {
                                                    "id": "21dc91d3-d3ed-4100-9c9c-4857e8f07c9e",
                                                    "type": "combo",
                                                    "xpath": "OfficeSupplyRequest.Employee",
                                                    "value": [
                                                        { "id": 1, "value": "admon" }
                                                    ],
                                                    "displayName": "Employee",
                                                    "required": true,
                                                    "dataType": 2,
                                                    "data": [
                                                        { "id": 3, "value": "Employee" },
                                                        { "id": 5, "value": "Purchase" },
                                                        { "id": 2, "value": "Supervisor" },
                                                        { "id": 1, "value": "admon" },
                                                        { "id": 4, "value": "Assistant" },
                                                        { "id": 6, "value": "Ivan Ricardo" }
                                                    ],
                                                    "labelWidth": 20,
                                                    "valueWidth": 80,
                                                    "helpText": ""
                                                }
                                            }
                                        },
                                        { "render": { "properties": { "id": "8a12060e-db55-4966-b081-88ae14b2c511", "type": "text", "xpath": "text.xpath", "displayName": "text value", "maxLength": 50, "dataType": 15, "helpText": "", "autoExtend": false, "value": "text control" } } }
                                    ],
                                    "buttons": [],
                                    "sessionId": "xqs51j05zqnhxk02zl3zhi3f",
                                    "pageCacheId": 432388350
                                },
                                "type": "form"
                            }
                        }
                    };

                    if (typeof settings.data.h_idCase === "string") {
                        return {
                            mockjson: "jquery/workportalflat/webparts/common/render/test/data/renders/dummy.rendering." + settings.data.h_idCase + ".txt"
                        };
                    }
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/render/test/data/dummy.rendering.all.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Handlers/MultiAction") > -1) {
                    if (settings.data.h_action === "multiaction") {
                        var data = JSON.parse(settings.data.h_actions);
                        if (data[0].h_action == "PROCESSPROPERTYVALUE") {
                            if (data[0].h_idRender == "Departments" || data[0].h_idRender == "Jobs") {
                                return {
                                    mockjson: "jquery/workportalflat/webparts/common/render/test/data/renders/dummy.data.departments.txt",
                                    transform: function (response, originalSettings) {
                                        if (data[0].h_idRender == "Jobs") {
                                            var newResponse = [{}];
                                            newResponse[0].tag = data[0].h_tag;
                                            response[0].result.forEach(function (item, i) {
                                                if (item.id == data[0].p_parent) {
                                                    newResponse[0].result = item.jobs;
                                                }
                                            }
                                            );
                                            return newResponse;
                                        } else {
                                            response[0].tag = data[0].h_tag;
                                            return response;
                                        }
                                    }
                                };
                            }
                        }
                    }
                }

                if (settings.url.indexOf("Rest/Users/CurrentUser") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/smartphone/menu/test/data/dummy.currentUser.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Authorization/MenuAuthorization") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/smartphone/menu/test/data/dummy.menuAuthorization.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Authentication/logout") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/smartphone/menu/test/data/dummy.logout.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Home/MyFavorites") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/smartphone/homePortal/test/data/dummy.myFavorites.txt"
                    };
                }
                if (settings.url.indexOf("Rest/Home") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/smartphone/homePortal/test/data/dummy.txt"
                    };
                }
                if ((/Rest\/CaseResource\/\d+\/Discussion/).test(settings.url)) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/discussionCase/test/data/discussionCase.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Users/UserPictures") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/discussionCase/test/data/discussionUsers.txt"
                    };
                }

                if ((/Rest\/CaseResource\/\d+\/Comment/).test(settings.url)) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/discussionCase/test/data/listCommentCase.txt"
                    };
                }

                if (settings.url.indexOf("Rest/Users/Searches") > -1) {
                    return {
                        responseText: [{ "guidForm": "6260bffd-6968-490c-85d5-d751d0fe6269", "displayName": "Cars", "idFact": 1002 }, { "guidForm": "e7acc80d-0471-4f4d-8682-8140f2119b87", "displayName": "Booking", "idFact": 1003 }]
                    };
                }

                if (settings.url.indexOf("Api/WorkingTimeSchema/EffectiveDuration") > -1) {
                    return {
                        responseText: { "minutes": "10926" }
                    };
                }
            }
        });
    });