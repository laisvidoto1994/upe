BIZAGI_LANGUAGE = 'en-US';
BIZAGI_DISABLE_MOCKS = typeof (BIZAGI_DISABLE_MOCKS) !== "undefined" ? BIZAGI_DISABLE_MOCKS : false;

bizagi.loader.loadFile(
    bizagi.getJavaScript("common.base.dev.jquery.mockjax"),
    bizagi.getJavaScript("common.base.dev.jquery.mockjson")
    )
.then(function () {
    var BIZAGI_RESPONSE_TIME = 0;

    function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); };
    function guid() { return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4(); }

    // TEST-DATA 
    $.mockJSON.data.BIZAGI_CATEGORY = ["Loans", "Sales", "Analysis", "Other"];
    $.mockJSON.data.BIZAGI_FOUND_PROCESSES = ["credit", "travel", "complains"];
    $.mockJSON.data.BIZAGI_TASK_STATE = ["Red", "Green", "Yellow"];
    $.mockJSON.data.BIZAGI_BOOLEAN = ["true", "false"];
    $.mockJSON.data.BIZAGI_BOOLEAN_ALMOST_FALSE = ["true", "false", "false", "false", "false"];
    $.mockJSON.data.BIZAGI_GUID = function () {
        return guid;
    };


    // DUMMIES
    $.mockjax(function (settings) {
        if (BIZAGI_DISABLE_MOCKS) return;
        if (settings.dataType == "json") {

            /*
            *   MENU MOCKS
            */
            if (settings.url == 'Rest/Users/CurrentUser') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.currentuser.txt"
                };
            }

            if (settings.url == 'Rest/Theme/LogoImage') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.logo.txt"
                };
            }

            if (settings.url == 'Rest/Authorization/MenuAuthorization') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.authorization.txt"
                };
            }

            if (settings.url == 'Rest/BAMAnalytics/Queries') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.queries.txt"
                };
            }

            if (settings.url == 'Rest/BAMAnalytics/AnalisysQueries') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.analysisqueries.txt"
                };
            }

            /*  
            *   INBOX MOCKS
            */
            if (settings.url == 'Rest/Inbox/Summary') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.summary.txt"
                };
            }

            if (settings.url == 'Rest/Processes/Categories') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.categories.txt"
                };
            }

            if (settings.url == 'Rest/Cases') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.createcase.txt"
                };
            }

            if (settings.url == 'Rest/Processes') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.processes.txt"
                };
            }

            if (settings.url == 'Rest/Processes/RecentProcesses') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.recentprocesses.txt"
                };
            }


            if (settings.url == 'Rest/Processes/CustomizedColumnsDataInfo') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.cases.txt"
                };
            }

            if (/Rest\/Cases\/\d+\/Summary/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.casesummary.txt"
                };
            }

    
            if (/Rest\/Processes\/GetCases/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.inbox.mobile.txt"
                };
            }

            /*
            *   FORM MOCK
            */
            if (/Rest\/Cases\/\d+\/FormsRenderVersion/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.formsrenderversion.txt"
                };
            }

            if (settings.url == 'Rest/Handlers/Render') {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.form.txt"
                };
            }

            /*
            *   CASE MOCKS
            */
            if (/Rest\/Cases\/\d+\/Comments/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.comments.txt"
                };
            }

            if (/Rest\/Cases\/\d+\/Assignees/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.comments.txt"
                };
            }

            if (/Rest\/Cases\/\d+\/Events/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.events.txt"
                };
            }

            if (/Rest\/Cases\/\d+\/WorkItems/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.workitems.txt"
                };
            }

            if (/Rest\/Cases\/\d+\/Subprocesses/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.subprocesses.txt"
                };
            }

            /*
            *   SEARCH MOCKS
            */
            if (/Rest\/MyNewQuery\/Cases/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.searchcases.txt",
                    transform: function (response, originalSettings) {
                        var criteria = /Rest\/MyNewQuery\/Cases\/(.*)/.exec(originalSettings.url)[1];

                        // Alter mock data
                        $.each(response.processes, function (i, process) {
                            $.each(process.cases, function (j, _case) {
                                // Mock summary with criteria
                                var words = _case.summary.split(" ");
                                var location = bizagi.util.randomNumber(0, words.length);
                                words.splice(location, 0, criteria);
                                _case.summary += words.join(" ");

                                // Mock values
                                _case.values[$.mockJSON.data.LOREM()] = criteria;
                            });
                        });

                        var qsFilter = bizagi.readQueryString(originalSettings.url).filter;
                        var decodedFilter = decodeURIComponent(bizagi.readQueryString(originalSettings.url).filter);
                        if (qsFilter && !bizagi.util.isEmpty(decodedFilter) && decodedFilter != "{}") {
                            var filter = JSON.parse(decodedFilter);
                            if (filter) {
                                // Just left one process
                                var firstProcess = response.processes[0];
                                response.processes = [];
                                response.processes.push(firstProcess);

                                // Clear other filter
                                if (filter.process) delete response.filter.processes;
                                //if (filter.values) delete response.filter.values;
                                if (!filter.process && !filter.values) delete response.filter;
                            }

                        } else {
                            delete response.filter.values;
                        }


                        return response;
                    }
                };
            }


            if (/Rest\/MyNewQuery\/Entities/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.searchentities.txt",
                    transform: function (response, originalSettings) {
                        var criteria = /Rest\/MyNewQuery\/Entities\/(.*)/.exec(originalSettings.url)[1];

                        // Alter mock data
                        $.each(response.entities, function (i, entity) {
                            $.each(entity.instances, function (j, instance) {
                                // Mock summary with criteria
                                var words = instance.summary.split(" ");
                                var location = bizagi.util.randomNumber(0, words.length);
                                words.splice(location, 0, criteria);
                                instance.summary += words.join(" ");

                                // Mock values
                                instance.values[$.mockJSON.data.LOREM()] = criteria;
                            });
                        });

                        var qsFilter = bizagi.readQueryString(originalSettings.url).filter;
                        var decodedFilter = decodeURIComponent(bizagi.readQueryString(originalSettings.url).filter);
                        if (qsFilter && !bizagi.util.isEmpty(decodedFilter) && decodedFilter != "{}") {
                            var filter = JSON.parse(decodedFilter);
                            if (filter) {
                                // Just left one entity
                                var firstEntity = response.entities[0];
                                response.entities = [];
                                response.entities.push(firstEntity);

                                // Clear entity filter
                                if (filter.entity) delete response.filter.entities;
                                if (filter.values) delete response.filter;
                            }

                        } else {
                            delete response.filter.values;
                        }

                        return response;
                    }
                };
            }

            if (/Rest\/MyNewQuery\/Entity\/\d+\/\d+\/Actions/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.entityactions.txt"
                };
            }

            if (/Rest\/MyNewQuery\/ProccessDefinition/.test(settings.url)) {
                return {
                    responseTime: BIZAGI_RESPONSE_TIME,
                    mockjson: "jquery/workportal/test/data/dummy.searchProcesses.txt"
                };
            }

            if (settings.dataType == "json") {
                if (/Rest\/MyNewQuery\/Entity\/\d+\/\d+\/Form/.test(settings.url)) {
                    return {
                        responseTime: BIZAGI_RESPONSE_TIME,
                        mockjson: "jquery/workportal/test/data/dummy.entityform.txt"
                    };
                }
            }
        }

        return null;
    });

    // BEGIN SCRIPT
    BIZAGI_SHOW_AS = (typeof (BIZAGI_SHOW_AS) !== "undefined") ? (BIZAGI_SHOW_AS != "" ? BIZAGI_SHOW_AS : "") : "";
    BIZAGI_PROXY_PREFIX = (typeof (BIZAGI_PROXY_PREFIX) !== "undefined") ? BIZAGI_PROXY_PREFIX : "";
    var widgetName = BIZAGI_DEFAULT_WIDGET;
    if (!bizagi.util.isEmpty(BIZAGI_SHOW_AS)) {
        widgetName = "none";
    }

    var workportal = new bizagi.workportal.facade({
        idCase: 9999,
        idWorkitem: 9999,
        proxyPrefix: BIZAGI_PROXY_PREFIX
    });
    workportal.execute();

    // Execute popup
    if (BIZAGI_SHOW_AS == "popup") {
        $.when(workportal.ready())
    .done(function () {
        setTimeout(function () {
            workportal.getMainController().popupWidget({
                widgetName: BIZAGI_DEFAULT_WIDGET,
                options: {
                    'max-height': '346',
                    height: 'auto',
                    width: '339',
                    activeScroll: true,
                    dontClose: true
                }
            });
        }, 500);
    });
    }

    // Execute dialog
    if (BIZAGI_SHOW_AS == "dialog") {
        $.when(workportal.ready())
    .done(function () {
        setTimeout(function () {
            workportal.getMainController().showDialogWidget({
                widgetName: BIZAGI_DEFAULT_WIDGET,
                closeVisible: false,
                closeOnEscape : false,
                modalParameters: {
                                    width: "200",
                                    height: "500"
                                }
            });
        }, 500);
    });
    }

    // Execute custom script
    if (BIZAGI_SHOW_AS == "custom") {
        if (BIZAGI_DEFAULT_WIDGET == "routing") {

            $.when(workportal.ready())
        .done(function () {
            setTimeout(function () {
                workportal.getMainController().executeAction({
                    action: "routing"
                });
            }, 500);
        });
        }
    }

    // END OF SCRIPT
});

