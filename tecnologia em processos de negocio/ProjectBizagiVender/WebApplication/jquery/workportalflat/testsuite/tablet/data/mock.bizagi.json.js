var BIZAGI_RESPONSE_TIME = 0;
var BIZAGI_MOCKS_PATH = "jquery/workportalflat/testsuite/tablet/data/";
//var BIZAGI_MOCKS_PATH = "jquery/workportalflat/webparts/common/";

bizagi.loader.loadFile(
    { "src": bizagi.getJavaScript("common.base.dev.jquery.mockjax"), "coverage": false },
    { "src": bizagi.getJavaScript("common.base.dev.jquery.mockjson"), "coverage": false })
    .then(function() {
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
        $.mockjax(function(settings) {
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
                        mockjson: BIZAGI_MOCKS_PATH + "dummy.multilenguaje.txt",
                        responseTime: BIZAGI_RESPONSE_TIME
                    };
                }
                if (settings.url.indexOf("Rest/RenderForm/offlineForms") > -1) {
                    return {
                        mockjson: BIZAGI_MOCKS_PATH+"dummy.offline.txt"
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
                        transform: function(response, originalSettings) {
                            var elements = response.elements.sort(function(a, b) {
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

                if (settings.url.indexOf("Rest/Processes/RecentProcesses") > -1) {
                    return {
                        mockjson: "jquery/workportalflat/webparts/common/newcase/test/data/dummy.recentprocesses.txt"
                    };
                }
            }


            if (settings.url.indexOf("Rest/Users/CurrentUser") > -1) {
                return {
                    mockjson: BIZAGI_MOCKS_PATH + "dummy.currentUser.txt"
                };
            }
            if (settings.url.indexOf("Rest/Authorization/MenuAuthorization") > -1) {
                return {
                    mockjson: BIZAGI_MOCKS_PATH + "dummy.authorization.txt"
                };
            }
            if (settings.url.indexOf("Rest/Inbox/Summary") > -1) {
                return {
                    mockjson: BIZAGI_MOCKS_PATH + "dummy.render.summary.txt"
                };
            }
            if (settings.url.indexOf("Rest/Util/Version") > -1) {
                return {
                    mockjson: BIZAGI_MOCKS_PATH + "dummy.render.version.txt"
                };
            }

            if (settings.url.indexOf("Rest/Processes/CustomizedColumnsData") > -1) {
                return {
                    mockjson: BIZAGI_MOCKS_PATH + "dummy.customizedColumnsData.txt"
                    //mockjson: "jquery/workportalflat/tablet/renderTemplates/test/data/dummy.customizedColumnsData.txt"
                };
            }

            if (settings.url.indexOf("Rest/Processes") > -1) {
                if (settings.url.indexOf("StartProcess") > -1) {
                    return {
                        mockjson: BIZAGI_MOCKS_PATH + "dummy.StartProcess.txt"
                    };
                }
                return {
                    mockjson: BIZAGI_MOCKS_PATH + "dummy.render.processes.txt"
                };
            }

            if (settings.url.indexOf("Rest/Handlers/Render") > -1) {
                return {
                    //                    mockjson: BIZAGI_MOCKS_PATH + "dummy.render.handler.txt"
                    //                    mockjson: BIZAGI_MOCKS_PATH + "dummy.render.text.txt"
                    mockjson: BIZAGI_MOCKS_PATH + "dummy.rendering.basicControls.txt"
                };
            }
            if ((/Rest\/Cases\/\d+\/Summary/).test(settings.url)) {
                return {
                    mockjson: BIZAGI_MOCKS_PATH + "dummy.rendering.caseSummary.txt"
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

            if (settings.url.indexOf("Rest/Users/Searches") > -1) {
                return {
                    responseText: [{ "guidForm": "6260bffd-6968-490c-85d5-d751d0fe6269", "displayName": "Cars", "idFact": 1002 }, { "guidForm": "e7acc80d-0471-4f4d-8682-8140f2119b87", "displayName": "Booking", "idFact": 1003 }]
                };
            }
        });

    });