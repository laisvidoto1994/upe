/*
*   Name: BizAgi Workportal Render Widget Controller
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to to define the render widget
*       the rendering module is loaded here
*/

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.render", {}, {

    /*
    *   Returns the widget name
    */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_RENDER;
    },

    /*
    *   Constructor
    */
    init: function(workportalFacade, dataService, params) {
        var self = this;

        // Check if the required params are filled
        if (bizagi.util.isEmpty(params.idCase)) {

            if (!bizagi.util.isEmpty(window.location.hash)) {
                // Check in the hash
                var hashParams = bizagi.util.getHashParams();

                // Set the first hash param as the idCase
                if (hashParams.length > 1) {
                    params.idCase = hashParams[1];
                    self.isConfiguredFromHash = true;
                }

                // Set the second hash param as the idWorkitem
                if (hashParams.length > 2) {
                    params.idWorkitem = hashParams[2];
                }
            } else if (!bizagi.util.isEmpty(window.location.search)) {
                var queryString = bizagi.util.getQueryString();

                // Set idCase param from query string
                if (queryString["idCase"]) {
                    params.idCase = queryString["idCase"];
                    self.isConfiguredFromHash = true;
                }
                else
                    // Set guid param from query string
                    if (queryString["guid"]) {
                        params.guid = queryString["guid"];
                        self.isConfiguredFromHash = true;
                    }
                // Set idWorkitem param from query string
                if (queryString["idWorkitem"]) {
                    params.idWorkitem = queryString["idWorkitem"];
                }
            }
        }

        // Call base
        self._super(workportalFacade, dataService, params);                
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("render");
        var summaryDeferred = new $.Deferred();
        var details = {};
        // Check if the required params are filled
        if (bizagi.util.isEmpty(self.params.idCase) && bizagi.util.isEmpty(self.params.guid)) {
            self.changeWidget(bizagi.workportal.currentInboxView);
            return null;
        }
        details = (self.params.idCase) ?
        {
            idCase: self.params.idCase,
            eventAsTasks: self.params.eventAsTasks,
            onlyUserWorkItems: self.params.onlyUserWorkItems,
            idWorkitem: self.params.idWorkitem,
            isOfflineForm: self.params.isOfflineForm || false
        } :
        {
            guid: self.params.guid,
            eventAsTasks: self.params.eventAsTasks,
            onlyUserWorkItems: self.params.onlyUserWorkItems,
            idWorkitem: self.params.idWorkitem,
            isOfflineForm: self.params.isOfflineForm || false
        }
        // Check if the required params are filled
        if (bizagi.util.isEmpty(self.params.idWorkitem) && self.isConfiguredFromHash) {
            if (!bizagi.util.isEmpty(self.params.idCase)) self.executeAction(bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING, { idCase: self.params.idCase });
            else if (!bizagi.util.isEmpty(self.params.guid)) self.executeAction(bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING, { guid: self.params.guid });
            return null;
        }

        // Render base template
        self.content = $.tmpl(template);

        // Render Form Tab
        $.when(
                self.dataService.summaryCaseDetails(details)).done(function (data) {

                    // Define global context into the comments section
                    // they need know global context to eval if stop interval
                    // or keep running, bizagi.util.setInterval
                    bizagi.util.setContext({
                        idCase: data.idCase || null,
                        caseNumber: data.caseNumber || null,
                        widget: self.getWidgetName(),
                        idWorkitem: self.params.idWorkitem || null,
                        idTask: self.params.idTask || null,
                        isOfflineForm: self.params.isOfflineForm || false
                    });
                    data["params"] = self.params;
                    //check if show event tab or not
                    if (data["countEvents"] >= 1) {
                        for (var i = 0; i < data["currentState"].length; i++) {
                            if (data["currentState"][i]["isEvent"] == "true" && data["currentState"][i]["idWorkItem"] == data.params.idWorkitem) {
                                data["countEvents"] = data["countEvents"] - 1;
                            }
                        }
                    }
                    data["showEvents"] = (data["countEvents"] >= 1) ? true : false;

                    //check if the activity can be released
                    var releaseCurrentActivity = $.grep(data.currentState, function (activity) {
                        return (activity.idWorkItem === data.params.idWorkitem) && (activity.allowReleaseActivity);
                    });
                    data["allowReleaseActivity"] = releaseCurrentActivity.length === 1 ? releaseCurrentActivity[0].allowReleaseActivity : false;

                    summaryDeferred.resolve(self.renderSummary(data));
                });


        // Check if the content is already in dom
        var includedInDom = self.content.parents("body").length > 0;
        if (includedInDom) {
            self.renderForm();
        } else {
            // Wait until the dom is ready to execute the rendering, because some controls need references to full DOM
            // (grids and uploads)
            self.subscribeOneTime("onWidgetIncludedInDOM", function () {

                // Load render page
                self.renderForm({
                    idCase: self.params.idCase,
                    idWorkitem: self.params.idWorkitem,
                    idTask: self.params.idTask,
                    radNumber: self.params.radNumber,
                    withOutGlobalForm: self.params.withOutGlobalForm || false,
                    isOfflineForm: self.params.isOfflineForm || false,
                    messageForm: self.params.messageForm || ""
                });
            });
        }

        // Synchronize deferreds to resolve method
        return summaryDeferred.promise();
    },

    /*
    *   Renders the summary component of the widget
    */
    renderSummary: function (data) {
        var self = this;
        var content = self.getContent();
        var cache = {};
        var htmlContent = "";
        var security = new bizagi.workportal.command.security(self.dataService);

        data.showComments = true;
        
        $.when(security.checkSecurityPerm("PrintableVersion"), security.checkSecurityPerm("StateLog"), security.checkSecurityPerm("GraphicQuery")).done(function (PrintableVersion, StateLog, GraphicQuery) {
            data.printableVersion = PrintableVersion;
            data.stateLog = StateLog;
            data.graphicQuery = GraphicQuery;

            //Hide summary case tabs when idCase = 0
            if (data.idCase == 0) {
                setTimeout(function () {
                    $("div.ui-bizagi-wp-app-inbox-description-container \
                    div.ui-bizagi-loading-message \
                    div.ui-bizagi-loading-message-center \
                    div.ui-bizagi-loading-icon").hide();
                }, 1000);

                return;
            }

            var summary = $.tmpl(self.caseSummaryTemplate, $.extend(data, {security: bizagi.menuSecurity})).appendTo(self.getComponentContainer("summary"));

            // Format invariant dates
            bizagi.util.formatInvariantDate(content, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));


            // Delegate events for parent process
            $("#details", summary).delegate(".summaryLink", "click", function () {
                self.routingExecute($(this));
            });

            // jQuery-ui tabs
            $("#ui-bizagi-details-tabs", content).tabs({
                active: -1,
                create: function (event, ui) {
                    $(this).tabs("option", "active", 0);
                },
                activate: function (event, ui) {
                    bizagi.util.setContext({
                        commentsFocus: false
                    });
                    switch (ui.newPanel.prop('id')) {
                        case "comments":
                            if (cache["comments"] == undefined) {
                                // Extend render with comments
                                $.extend(self, {}, bizagi.workportal.comments);

                                // Define canvas
                                data.canvas = $("#comments", self.getComponentContainer("summary"));
                                data.readOnly = ($(ui.tab).data('isclosed')) ? true : false;

                                $.when(self.renderComments(data))
                                    .done(function (htmlContent) {
                                        cache["comments"] = htmlContent;
                                    });
                            }
                            bizagi.util.setContext({
                                commentsFocus: true
                            });
                            break;
                        case "subprocess":
                            if (cache["subprocess"] == undefined) {
                                $.when(
                                        self.dataService.summarySubProcess({
                                            idCase: self.params.idCase
                                        })
                                    ).done(function (subprocess) {

                                        $.each(subprocess.subProcesses, function (key, value) {
                                            var custData = subprocess.subProcesses[key].custData;
                                            for (var i = 0; i < custData.length; i++) {
                                                if (custData[i] == null) {
                                                    custData[i] = "";
                                                }
                                            }
                                        });

                                        htmlContent = $.tmpl(self.caseSummaryTemplateSubprocess, subprocess);
                                        htmlContent.appendTo($("#subprocess", self.getComponentContainer("summary")));
                                        cache["subprocess"] = htmlContent;

                                        // Define Events for subprocess tab
                                        htmlContent.delegate(".summaryLink", "click", function () {
                                            self.routingExecute($(this));
                                        });
                                    });
                            }
                            break;

                        case "assignees":
                            if (cache["assignees"] == undefined) {
                                $.when(
                                        self.dataService.summaryAssigness({
                                            idCase: self.params.idCase
                                        })
                                    ).done(function (assignees) {
                                        // Generates  lists of unique assignees for Events
                                        var eventsUniqueList = [];
                                        $.each(assignees.events.split(", "), function (i, el) {
                                            if ($.inArray(el, eventsUniqueList) === -1) eventsUniqueList.push(el);
                                        });
                                        assignees.events = eventsUniqueList.join(", ");

                                        // Generates  lists of unique assignees for activities
                                        var activitiesUniqueList = [];
                                        $.each(assignees.activities.split(", "), function (i, el) {
                                            if ($.inArray(el, activitiesUniqueList) === -1) activitiesUniqueList.push(el);
                                        });
                                        assignees.activities = activitiesUniqueList.join(", ");

                                        htmlContent = $.tmpl(self.caseSummaryTemplateAssigness, assignees);
                                        htmlContent.appendTo($("#assignees", self.getComponentContainer("summary")));
                                        cache["assignees"] = htmlContent;
                                    });
                            }
                            break;

                        case "events":
                            if (cache["events"] == undefined) {
                                $.when(
                                        self.dataService.summaryCaseEvents({
                                            idCase: self.params.idCase
                                        })
                                    ).done(function (events) {
                                        htmlContent = $.tmpl(self.caseSummaryTemplateEvents, events);
                                        htmlContent.appendTo($("#events", self.getComponentContainer("summary")));
                                        cache["events"] = htmlContent;

                                        htmlContent.delegate(".summaryLink", "click", function () {
                                            self.routingExecute($(this));
                                        });
                                    });
                            }
                            break;

                        case "activities":
                            if (cache["activities"] == undefined) {
                                $.when(
                                        self.dataService.summaryActivities({
                                            data: data,
                                            idWorkitem: self.params.idWorkitem
                                        })
                                    ).done(function (activities) {
                                        activities["idCase"] = self.params.idCase;
                                        activities["idWorkflow"] = self.params.idWorkflow;

                                        //To solve QA-2124
                                        var defaultDateFormat = bizagi.localization.getResource("dateFormat");
                                        var defaultTimeFormat = bizagi.localization.getResource("timeFormat");
                                        var fullFormat = defaultDateFormat + ' ' + defaultTimeFormat;

                                        htmlContent = $.tmpl(self.caseSummaryTemplateActivities, activities);
                                        bizagi.util.formatInvariantDate(htmlContent, fullFormat);
                                        htmlContent.appendTo($("#activities", self.getComponentContainer("summary")));
                                        cache["activities"] = htmlContent;

                                        htmlContent.delegate(".summaryLink", "click", function () {
                                            self.routingExecute($(this));
                                        });
                                    });
                            }
                            break;
                    }
                }
            });
        });
    },


    /*
    *   Renders the form component of the widget
    */
    renderForm: function (params) {
        var self = this, resultRender;

        var renderContainer = self.getComponentContainer("render");
        if (!params.withOutGlobalForm) {
            // it has't activities and global form
            var proxyPrefix = (typeof (self.dataService.serviceLocator.proxyPrefix) != undefined) ? self.dataService.serviceLocator.proxyPrefix : "";
            var database = (typeof (self.dataService.database) != undefined) ? self.dataService.database : "";


            // Load render page
            var rendering = self.rendering = new bizagi.rendering.facade({ "proxyPrefix": proxyPrefix, "database": database });
            // Executes rendering into render container
            resultRender = rendering.execute($.extend(params, {
                canvas: renderContainer,
                menu: self.menu
            }));

            // Attach handler to render container to subscribe for routing events
            renderContainer.bind("routing", function (context, triggerparams) {
                // Executes routing action

                var params = {
                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                    idCase: self.params.idCase,
                    fromTask: self.params.fromTask || self.params.idTask,
                    fromWorkItemId: self.params.fromWorkItemId || self.params.idWorkitem,
                    isOfflineForm: self.params.isOfflineForm,
                    formsRenderVersion: self.params.formsRenderVersion,
                    onClose: function () {
                        // If the user closes the dialog we need to redirect to inbox widget
                        self.publish("changeWidget", {
                            widgetName: bizagi.workportal.currentInboxView
                        });
                    }
                };
                params = $.extend(params, triggerparams);
                self.publish("executeAction", params);
            });

            //
            renderContainer.bind("oldrenderintegration", function () {
                if (bizagi.oldrenderevent == undefined) {
                    bizagi.oldrenderevent = true; // has been loaded
                    var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
                    var eventer = window[eventMethod];
                    var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

                    // Listen to message from child window
                    eventer(messageEvent, function (e) {
                        e.stopPropagation();
                        self.publish("executeAction", {
                            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                            idCase: e.data
                        });
                    }, false);
                }

                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_OLDRENDERINTEGRATION,
                    idCase: self.params.idCase,
                    idWorkitem: self.params.idWorkitem,
                    idTask: self.params.idTask,
                    onlyUserWorkItems: self.params.onlyUserWorkItems,
                    referrer: self.params.referrer,
                    eventAsTasks: self.params.eventAsTasks
                });

            });
        } else {
            var errorTemplate = self.workportalFacade.getTemplate("info-message");
            var message = (params.messageForm !== "") ? params.messageForm : self.resources.getResource("render-without-globalform");

            if (typeof self.params != "undefined" && typeof self.params.isOfflineForm !== "undefined" && self.params.isOfflineForm == true) {
                message = self.resources.getResource("render-without-globalform-offline");
            }

            var errorHtml = $.tmpl(errorTemplate, {
                message: message
            });
            // Remove loading icon from summary container
            errorHtml.appendTo(renderContainer);

            resultRender = $.Deferred();
            resultRender.fail();
        }

        // Keep reference to rendering facade
        self.renderingFacade = rendering;

        // Resize layout
        self.resizeLayout();

        return resultRender;
    },


    routingExecute: function (element) {
        // Executes routing action
        if (element == undefined) {
            return false;
        }

        var self = this;

        var idCase = element.find("#idCase").val() || self.params.idCase;
        var idWorkflow = element.find("#idWorkflow").val() || self.params.idWorkflow;
        var idWorkItem = element.find("#idWorkItem").val() || element.parent().find("#idWorkItem").val();
        var idTask = element.find("#idTask").val();
        var eventAsTasks = element.find("#eventAsTasks").val() || false;

        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: idCase,
            idWorkflow: idWorkflow,
            idWorkItem: idWorkItem,
            idTask: idTask,
            eventAsTasks: eventAsTasks
        });

        return true;
    },

    dispose: function () {
        var self = this;

        // Dispose the rendering binds
        setTimeout(function () {
            if (self.rendering) {
                var renderContainer = self.rendering.canvas;
                renderContainer.off();
                self.rendering.dispose();
            }
        }, bizagi.override.disposeTime || 50);

        // Call base
        self._super();
    }
});
