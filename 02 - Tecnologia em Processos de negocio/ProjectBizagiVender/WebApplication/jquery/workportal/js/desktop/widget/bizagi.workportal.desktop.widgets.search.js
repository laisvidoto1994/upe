/*
*   Name: BizAgi Workportal Search Controller
*   Author: Diego Parra (based on Edward Morales version)
*   Comments:
*   -	This script will provide base library for search cases
*/

// Auto extend
bizagi.workportal.widgets.search.extend("bizagi.workportal.widgets.search", {}, {
    /*
    *	 Constructor
    */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        // Define variables
        self.radNumber = params.referrerParams.radNumber || params.radNumber || "";

        //Load templates
        self.loadTemplates({
            "inbox-grid-cases": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.grid").concat("#ui-bizagi-workportal-widget-inbox-grid-cases"),
            "inbox-common-case-summary": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description"),
            "inbox-common-case-summary-subprocess": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description-subprocess"),
            "inbox-common-case-summary-assignees": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description-assignees"),
            "inbox-common-case-summary-events": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description-events"),
            "inbox-common-case-summary-oldrender": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-oldrender"),
            "search-details": bizagi.getTemplate("bizagi.workportal.desktop.widget.search").concat("#ui-bizagi-workportal-widget-search-details"),
            useNewEngine: false
        });

    },
    /*
    *	 To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;
        var content = self.getContent();
        var contentDetails = $("#searchDetails", content);
        var pdata = {};
        var pageSelector = $("#casesPagination", content);
        var nElemToShow = 14;
        var totalPages = self.params.data.cases.totalPages;
        var actualPage = self.params.data.cases.page;


        // Set templates
        self.searchTemplate = self.workportalFacade.getTemplate("search");
        //self.searchTemplate = self.getTemplate("inbox-grid-cases");
        self.searchDetailsTemplate = self.getTemplate("search-details");
        self.searchPagination = self.workportalFacade.getTemplate("inbox-common-pagination-grid");
        self.caseSummaryTemplate = self.getTemplate("inbox-common-case-summary");
        self.caseSummaryTemplateSubprocess = self.getTemplate("inbox-common-case-summary-subprocess");
        self.caseSummaryTemplateAssigness = self.getTemplate("inbox-common-case-summary-assignees");
        self.caseSummaryTemplateEvents = self.getTemplate("inbox-common-case-summary-events");
        self.paginationTemplate = self.workportalFacade.getTemplate("inbox-common-pagination-inbox");

        contentDetails.empty();

        // Define title of module
        self.params.data.title = self.params.data.title || bizagi.localization.getResource("workportal-widget-search");

        // Set title
        $(".title", content).html(self.params.data.title);

        /* // Previous Version
        $.when(
        $.tmpl(self.searchDetailsTemplate,self.params.data).appendTo(contentDetails)
        ).done(function(){
        */

        // Convert null to empty "" fields
        for (i = 0; i < self.params.data.cases.rows.length; i++) {
            for (j = 0; j < self.params.data.cases.rows[i].fields.length; j++) {
                self.params.data.cases.rows[i].fields[j] = (self.params.data.cases.rows[i].fields[j] == null) ? "" : self.params.data.cases.rows[i].fields[j];
            }
            self.params.data.cases.rows[i].graphicQuery = bizagi.menuSecurity.GraphicQuery;
        }

        // Format monetary cells, params (data,money format)
        self.params.data.cases = bizagi.util.formatMonetaryCells(self.params.data.cases, BIZAGI_DEFAULT_CURRENCY_INFO);
        self.params.data.cases.groupByCaseNumber = bizagiConfig.groupByCaseNumber;

        $.when(
                $.tmpl(self.searchDetailsTemplate, self.params.data.cases, {
                    setFormat: self.formatValue,
                    isArray: self.isArray,
                    formatCategories: self.formatCategories,
                    isDate: bizagi.util.isDate,
                    getRadNumberColumnIndex: function() {
                        var data = this.data;
                        var index = -1;
                        for(var i = 0, l = data.columnTitle.length; i < l; i++) {
                            if(data.columnTitle[i].fieldName == "I_RadNumber") {
                                index = i;
                            }
                        }
                        return index;
                    },
                    showColumn: function(columnIndex) {
                        var index = this.getRadNumberColumnIndex();
                        return (this.data.groupByCaseNumber && index == columnIndex) ? " style=display:none; " : "";
                    },
                    createGroupedHeader: function(rowIndex) {
                        var data = this.data;
                        var result = false;
                        var radNumber = this.getRadNumber(data.rows[rowIndex]);
                        if(data.groupByCaseNumber) {
                            if(rowIndex == 0) {
                                result = true;
                            } else {
                                var previousRadNumber = this.getRadNumber(data.rows[rowIndex - 1]);
                                if(radNumber != previousRadNumber) {
                                    result = true;
                                }
                            }
                        }
                        return result;
                    },
                    getRadNumber: function(row) {
                        var index = this.getRadNumberColumnIndex();
                        return (index >= 0) ? row.fields[index] : "";
                    }
                }).appendTo(contentDetails)).done(function () {

                    // Format invariant dates
                    bizagi.util.formatInvariantDate(content, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));

                    // bind activities and process
                    $(".ui-bizagi-wp-app-inbox-activity-name", contentDetails).click(function () {
                        var idCase = $(this).find("#idCase").val() || "";
                        var idWorkItem = $(this).find("#idWorkItem").val() || "";
                        var idTask = $(this).find("#idTask").val() || "";
                        var idWorkflow = $(this).closest('tr').data("idworkflow");

                        if (idWorkItem === "0" || idTask === "0") {
                            return;
                        }

                        // fix for SUITE-8792
                        if (idWorkItem != "" && idTask != "") {
                            if (bizagi.cache === undefined) {
                                bizagi.cache = {};
                            } else {
                                if (bizagi.cache[idCase] !== undefined) {
                                    if (bizagi.cache[idCase].idWorkitem == parseInt(idWorkItem) && bizagi.cache[idCase].idTask == parseInt(idTask) && bizagi.cache[idCase].isComplex !== undefined) {
                                        idWorkItem = "";
                                    }
                                }
                            }
                        }

                        // Executes routing action
                        self.publish("executeAction", {
                            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                            idCase: idCase,
                            idWorkItem: idWorkItem,
                            idTask: idTask,
                            idWorkflow: idWorkflow,
                            eventAsTasks: true,
                            onlyUserWorkItems: "true"
                        });
                    });


                    $(".ui-bizagi-wp-app-inbox-grouped", contentDetails).bind("click", function () {
                        var radNumber = $(this).data("radnumber");
                        var referrerParams = {
                            taskState: self.params.taskState,
                            idWorkItem: $(this).find("#idWorkItem").val(),
                            idCase: $(this).find("#idCase").val(),
                            idTask: $(this).find("#idTask").val(),
                            onlyFavorites: self.onlyFavorites,
                            idWorkflow: self.idWorkflow,
                            referrer: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID
                        };

                        $.extend(bizagi.referrerParams, bizagi.referrerParams, referrerParams);

                        var idCase = $(this).find("#idCase").val();

                        self.publish("executeAction", {
                            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                            idCase: idCase
                        });
                    });


                    // Add click to view workflow
                    $(".ui-bizagi-wp-app-inbox-cases-ico-view", contentDetails).click(function () {
                        var idCase = $(this).parent().find("#idCase").val();
                        var idWorkflow = $(this).closest("tr").data("idworkflow");
                        self.showGraphicQuery({ idCase: idCase, idWorkflow: idWorkflow });
                        return false;
                    });
                    $(".workonitRow", content).button();
                    $(".inbox-grid-tooltip-button", content).tooltip();
                    // show case summary
                    $(".workonitRow", content).click(function () {
                        // Call routing action
                        var idCase = $(this).parents("td").first().find("#idCase").val();
                        var idWorkflow = $(this).closest("tr").data("idworkflow");
                        $(".inbox-grid-tooltip-button", content).tooltip("close");
                        self.showCase(idCase, idWorkflow);
                    });
                    /* End lines by CAAA */

                    // Bind favorites start
                    $(contentDetails).delegate(".ui-bizagi-wp-app-inbox-cases-start", "click", function (e) {
                        e.stopPropagation();
                        var options = {};
                        var elmnt = this;
                        $(elmnt).removeClass("ui-bizagi-wp-app-inbox-cases-start").addClass("ui-bizagi-wp-app-inbox-cases-start-wait");

                        // check if its favorite
                        if ($(elmnt).parent().find("#isFavorite").val() == "false") {
                            options = {
                                idObject: $(elmnt).parent().find("#idCase").val(),
                                favoriteType: "CASES"
                            };
                            $.when(
                            self.dataService.addFavorite(options)
                            ).done(function (data) {
                                $(elmnt).parent().find("#guidFavorite").val(data["idFavorites"]);
                                $(elmnt).removeClass("bz-icon-star-outline").addClass("bz-icon-star");
                                $(elmnt).parent().find("#isFavorite").val("true");
                                $(elmnt).removeClass("ui-bizagi-wp-app-inbox-cases-start-wait").addClass("ui-bizagi-wp-app-inbox-cases-start");
                            })
                        } else {
                            options = {
                                idObject: $(elmnt).parent().find("#guidFavorite").val(),
                                favoriteType: "CASES"
                            };
                            $.when(
                            self.dataService.delFavorite(options)
                            ).done(function (data) {
                                if (data["deleted"] == "true" || data["deleted"] == true) {
                                    $(elmnt).parent().find("#guidFavorite").val("");
                                    $(elmnt).removeClass("bz-icon-star").addClass("bz-icon-star-outline");
                                    $(elmnt).parent().find("#isFavorite").val("false");
                                    $(elmnt).removeClass("ui-bizagi-wp-app-inbox-cases-start-wait").addClass("ui-bizagi-wp-app-inbox-cases-start");
                                }
                            })
                        }
                    });

                    // Bind action to ungroup cases from folders
                    $('.folders-case-ungroup', contentDetails).click(function () {

                        // Used to remove the row later on
                        var itemSelector = this;

                        var options = {
                            idFolder: $(this).data('folder-id'),
                            idCase: $(this).data('case-id')
                        }

                        var confirmationMsg = bizagi.localization.getResource('workportal-search-desasociate-case');

                        $.when(bizagi.showConfirmationBox(confirmationMsg, null, false))
                        .done(function () {
                            // This is supposed to be the "trutsy" part of the confirmation however the concept is
                            // not properly used, anyways is done like this because Diego likes deferreds
                            // for a lot of things - Andres Valencia

                            // Call service to ungroup case from folders
                            $.when(
                            self.dataService.dissasociateCaseFromFolder(options)
                            ).done(function (data) {

                                // Whilst this is not the most elegant solution to remove the desasociated case from the current folder
                                // it can act as a temporary "hack" to avoid the search widget to refresh and lose context as it is happening so far

                                $(itemSelector).closest('tr').remove();

                                // Confirm that case has been removed from folder
                            });
                        })
                        .fail(function () {
                            // And this is supposed to be the "falsy" part of the confirmation dialog
                            // also a misused true/false concept - Andres Valencia
                        });
                    });

                    $(".ui-bizagi-wp-app-inbox-bt-back", content).click(function () {
                        var widget = bizagi.referrerParams.referrerBackButton || bizagi.cookie('bizagiDefaultWidget');
                        // switch referer widget 
                        switch (widget) {
                            case "inbox":
                                self.publish("changeWidget", {
                                    widgetName: widget,
                                    restoreStatus: true
                                });
                                break;
                            case "inboxGrid":

                                self.publish("changeWidget", {
                                    widgetName: widget,
                                    restoreStatus: true
                                });
                                break;
                            case "search":
                                self.publish("executeAction", {
                                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH,
                                    radNumber: bizagi.referrerParams.radNumber || "",
                                    page: bizagi.referrerParams.page || 1,
                                    onlyUserWorkItems: false
                                });
                                break;
                            case "queryform":
                                self.publish("showDialogWidget", {
                                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERYFORM,
                                    queryFormAction: "loadPrevious"
                                });
                                break;
                            case "folders":
                                var url = bizagi.referrerParams.urlParameters + "&page=" + bizagi.referrerParams.page;
                                $.when(self.dataService.getCasesByFolder(url))
                                .done(function (data) {
                                    data.customized = true;
                                    data.urlParameters = bizagi.referrerParams.urlParameters

                                    // Define title of widget
                                    data.title = bizagi.referrerParams.name;

                                    // Set a flag here to tell the search widget that must show the ungroup case from folder (icon).
                                    data.casesGroupedByFolder = true;
                                    data.idFolder = bizagi.referrerParams.id;

                                    self.publish("changeWidget", {
                                        widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH,
                                        data: data,
                                        referrerParams: {}
                                    });
                                });
                                break;
                            case "activityform":
                                self.publish("executeAction", {
                                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                                    idCase: bizagi.referrerParams.idCase || undefined,
                                    idWorkItem: bizagi.referrerParams.idWorkItem || undefined,
                                    idTask: bizagi.referrerParams.idTask || undefined,
                                    eventAsTasks: true,
                                    onlyUserWorkItems: "true"
                                });
                                break;
                            default:
                                self.publish("changeWidget", {
                                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX,
                                    restoreStatus: true
                                });
                                break;
                        }
                    });

                    // Define Pagination


                    // Show/hide pagination
                    pdata.pagination = (totalPages > 1) ? true : false;
                    pdata.page = self.params.referrerParams.page || actualPage;

                    // set total pages
                    pdata.pages = {};
                    var pageToshow = (nElemToShow > totalPages) ? totalPages : nElemToShow;
                    for (var i = 1; i <= pageToshow; i++) {
                        pdata.pages[i] = {
                            "pageNumber": i
                        };
                    }

                    // Set style pagination
                    pdata["gridPagination"] = "gridCasePagination";
                    pdata.previousPage = (actualPage > 1) ? actualPage - 1 : 1;
                    pdata.nextPage = (actualPage < totalPages) ? actualPage + 1 : totalPages;
                    pdata.totalPages = totalPages;

                    var paginationHtml = $.tmpl(self.searchPagination, pdata).html();

                    // Get template
                    $(pageSelector).append(paginationHtml);

                    // Crate pagination control
                    $("ul").bizagiPagination({
                        maxElemShow: 50,
                        totalPages: pdata.totalPages,
                        actualPage: pdata.page,
                        listElement: $("ul", pageSelector),
                        clickCallBack: function (options) {
                            // Check if action from search or folders
                            if (self.params.data.customized != undefined && self.params.data.customized) {
                                var url = self.params.data.urlParameters + "&page=" + options.page;
                                $.when(self.dataService.getCustomizedColumnsData({
                                    smartfoldersParameters: url
                                }))
                                .done(function (data) {
                                    // Define widget customized for pagination purposes
                                    data.customized = true;
                                    data.urlParameters = self.params.data.urlParameters;

                                    // Define title of widget
                                    data.title = self.params.data.title;

                                    bizagi.referrerParams.page = options.page;

                                    // Set a flag here to tell the search widget that must show the ungroup case from folder (icon).
                                    data.casesGroupedByFolder = true;
                                    data.idFolder = self.params.data.id;
                                    self.publish("changeWidget", {
                                        widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH,
                                        data: data,
                                        referrerParams: {}
                                    });
                                });
                            } else {
                                self.publish("executeAction", {
                                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH,
                                    radNumber: self.params.referrerParams.radNumber,
                                    page: options.page,
                                    onlyUserWorkItems: false
                                });
                            }
                        }
                    });

                    contentDetails.bizagiScrollbar({
                        autohide: false
                    });
                });
    },
    /*
    *   Shows a popup with the case information
    */
    showCase: function (idCase, idWorkflow) {
        var self = this;
        var content = self.getContent();
        var caseSummaryContainer = $("#contentDesc", content);
        var cache = {};
        var htmlContent = "";
        // Update internal variable
        self.idCase = idCase;
        caseSummaryContainer.empty();
        // Don't search data when there is no case
        if (self.idCase == 0) {
            return;
        }
        // Render Form Tab
        $.when(
                self.dataService.summaryCaseDetails({
                    idCase: self.idCase
                })
                ).done(function (data) {
                    data.hasComments = (data.hasComments == 'true') ? true : false;

                    // Get security
                    var security = new bizagi.workportal.command.security(self.dataService);
                    data.graphicQuery = security.checkSecurityPerm("GraphicQuery");

                    if(data.currentState && data.currentState.length > 0){
                        data.currentState.forEach(function(currentState){
                            if(!currentState.idTask){
                                currentState.idTask = 0;
                            }
                            if(!currentState.state){
                                currentState.state = currentState.displayName || " ";
                            }
                        });
                    }

                    if(data.process === "undefined" || data.process === "" || typeof data.process === "undefined"){
                        data.process = false;
                    }

                    if(data.processPath === "undefined" || data.processPath === "" || typeof data.processPath === "undefined"){
                        data.processPath = false;
                    }

                    var renderedTemplate = $.tmpl(self.caseSummaryTemplate, $.extend(data, {security: bizagi.menuSecurity})).appendTo(caseSummaryContainer);
                    // Format invariant dates
                    bizagi.util.formatInvariantDate(content, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));

                    // Delegate events for parent process
                    $("#details", renderedTemplate).delegate(".summaryLink", "click", function () {
                        self.routingExecute($(this));
                        caseSummaryDialog.dialog('close');
                    });
                    var caseSummaryDialog = renderedTemplate;
                    // Fix for tab height
                    $('.scrollSummary', caseSummaryDialog).css({ 'height': '', 'overflow-y': 'visible' });

                    // jQuery-ui tabs
                    $("#ui-bizagi-details-tabs", content).tabs({
                        active: -1,
                        create: function (event, ui) {
                            $(this).tabs("option", "active", 0);
                        },
                        "activate": function (event, ui) {

                            var panel = (ui == undefined) ? "formSummary" : ui.newPanel.attr('id');
                            switch (panel) {
                                /* 0 = details
                                * 1 = formSummary
                                * 2 = subprocess
                                * 3 = assigness
                                * 4 = events
                                * 5 = activities
                                **/ 
                                case "comments":
                                    if (cache["comments"] == undefined) {
                                        // Extend render with comments
                                        $.extend(self, {}, bizagi.workportal.comments);

                                        // Define canvas
                                        data.canvas = $("#comments");
                                        data.readOnly = true;

                                        $.when(self.renderComments(data))
                                    .done(function (htmlContent) {
                                        cache["comments"] = htmlContent;
                                    });
                                    }
                                    bizagi.util.setContext({
                                        commentsFocus: true
                                    });
                                    break;
                                case "formSummary":
                                    if (cache["formSummary"] == undefined) {
                                        var canvas = $("#formSummary", caseSummaryContainer);

                                        // Define action when render form has not been migrated
                                        canvas.bind("oldrenderintegration", function (e) {
                                            if (e.isPropagationStopped()) {
                                                return;
                                            }
                                            e.stopPropagation();

                                            var template = self.getTemplate("inbox-common-case-summary-oldrender");
                                            var data = {};

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

                                            // Define workitem and idtask
                                            $.when(self.dataService.getWorkitems({
                                                idCase: self.idCase,
                                                onlyUserWorkItems: true,
                                                eventAsTasks: true
                                            })).done(function (getWorkitems) {
                                                // verify workitem, in some cases these variables are not available
                                                if (typeof getWorkitems.workItems == "object" && getWorkitems.workItems.length >= 1) {
                                                    // Case Open
                                                    var idWorkitem = getWorkitems.workItems[0]['idWorkItem'];
                                                    var idTask = getWorkitems.workItems[0]['idTask'];
                                                    var idCase = getWorkitems.workItems[0]['idCase'];
                                                    data.url = self.dataService.serviceLocator.getUrl("old-render") + "?PostBack=1&idCase=" + idCase + "&idWorkitem=" + idWorkitem + "&idTask=" + idTask + "&isSummary=1";
                                                } else {
                                                    // Case closed
                                                    data.url = self.dataService.serviceLocator.getUrl("old-render") + "?PostBack=1&idCase=" + self.idCase + "&isSummary=1";
                                                }

                                                // Render content
                                                canvas.empty();
                                                $.tmpl(template, data).appendTo(canvas);
                                                //Set styles
                                                self.iframeOldRender($("iframe", canvas));
                                            });
                                        });

                                        var params = {
                                            idCase: self.idCase
                                        };

                                        $.when(self.dataService.getCaseFormsRenderVersion(params))
                                    .done(function (formsVersion) {
                                        if (formsVersion.formsRenderVersion == 1) {
                                            canvas.trigger("oldrenderintegration");
                                        } else {
                                            $.when(
                                            self.renderSummaryForm($("#formSummary", renderedTemplate))
                                            ).done(function () {
                                                htmlContent = $("#formSummary", renderedTemplate).html();
                                                cache["formSummary"] = htmlContent;
                                            });
                                        }
                                    });
                                    }
                                    break;
                                case "subprocess":
                                    if (cache["subprocess"] == undefined) {
                                        $.when(
                                    self.dataService.summarySubProcess({
                                        idCase: self.idCase
                                    })
                                    ).done(function (subprocess) {
                                        htmlContent = $.tmpl(self.caseSummaryTemplateSubprocess, subprocess);
                                        htmlContent.appendTo($("#subprocess", renderedTemplate));
                                        cache["subprocess"] = htmlContent;
                                        // Define Events for subprocess tab
                                        htmlContent.delegate(".summaryLink", "click", function () {
                                            self.routingExecute($(this));
                                            caseSummaryDialog.dialog('close');
                                        });
                                    });
                                    }
                                    break;
                                case "assignees":

                                    if (cache["assignees"] == undefined) {
                                        $.when(
                                    self.dataService.summaryAssigness({
                                        idCase: self.idCase
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
                                        htmlContent.appendTo($("#assignees", renderedTemplate));
                                        cache["assignees"] = htmlContent;
                                    });
                                    }
                                    break;
                                case "events":
                                    if (cache["events"] == undefined) {
                                        $.when(
                                    self.dataService.summaryCaseEvents({
                                        idCase: self.idCase
                                    })
                                    ).done(function (events) {
                                        htmlContent = $.tmpl(self.caseSummaryTemplateEvents, events);
                                        htmlContent.appendTo($("#events", renderedTemplate));
                                        cache["events"] = htmlContent;
                                        htmlContent.delegate(".summaryLink", "click", function () {
                                            self.routingExecute($(this));
                                            caseSummaryDialog.dialog('close');
                                        });
                                    });
                                    }
                                    break;
                            }
                        }
                    });

                    // jquery UI Button work on it button
                    $(".workonitRow", content).button();
                    $(".inbox-grid-tooltip-button", content).tooltip();
                    // Add click to view workflow
                    $("#ui-bizagi-wp-app-inbox-description-container .ui-bizagi-wp-app-inbox-cases-ico-view", content).click(function () {
                        self.showGraphicQuery({ idCase: idCase, idWorkflow: idWorkflow });
                    });
                    // Bind events for events and process on summary case
                    $(".workonitRow", renderedTemplate).click(function () {
                        var referrerParams = {
                            taskState: self.params.taskState,
                            idWorkItem: $(this).parent().find("#idWorkItem").val(),
                            idCase: data.idCase,
                            onlyFavorites: self.onlyFavorites,
                            idWorkflow: self.idWorkflow,
                            referrer: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID
                        }
                        $.extend(bizagi.referrerParams, bizagi.referrerParams, referrerParams);
                        // Executes routing action
                        caseSummaryDialog.dialog('close');
                        self.publish("executeAction", {
                            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                            idCase: data.idCase,
                            idWorkflow: idWorkflow,
                            idWorkItem: $(this).parent().find("#idWorkItem").val()
                        });
                    });
                    // Set buttons
                    var buttons = {};
                    buttons[bizagi.localization.getResource("workportal-case-dialog-box-close")] = function () {
                        caseSummaryContainer.empty();
                        renderedTemplate.remove();
                        $("#ui-bizagi-wp-app-inbox-description-container").remove();
                    };
                    // Show dialog
                    caseSummaryDialog.dialog({
                        modal: true,
                        title: data.process,
                        width: 1000,
                        height: 600,
                        draggable: true,
                        resizable: true,
                        buttons: buttons,
                        close: function () {
                            caseSummaryContainer.empty();
                            renderedTemplate.remove();
                            $("#ui-bizagi-wp-app-inbox-description-container").remove();
                        }
                    });
                    //$("").add("workonitRow")
                });
    },
    /*
    *   Misc method to format cell values
    */
    formatRequest: function (value) {
        return value;
    },
    /**
    * Misc method to render categories
    */
    formatCategories: function (value) {
        return value;
    },
    isArray: function (value) {
        if (typeof (value) == 'object') {
            return true;
        } else {
            return false;
        }
    },
    /*
    *   Renders the summary form inside a given container
    */
    renderSummaryForm: function (container) {
        var self = this;

        var proxyPrefix = (typeof (self.dataService.serviceLocator.proxyPrefix) != undefined) ? self.dataService.serviceLocator.proxyPrefix : "";

        bizagi.loader.start("rendering").then(function () {
            // Load render page
            var rendering = new bizagi.rendering.facade({ "proxyPrefix": proxyPrefix });

            // Executes rendering into render container
            rendering.execute({
                canvas: container,
                summaryForm: true,
                idCase: self.idCase
            });

            // Keep reference to rendering facade
            self.renderingFacade = rendering;

            // Resize layout
            setTimeout(function () {
                self.resizeLayout();
            }, 1000);
        });
    },
    /**
    * Inject styles and js into the iframe
    */
    iframeOldRender: function (canvas) {
        var self = this;
        var iframe;
        var content = self.getContent();
        var theme = "bizagiDefault";
        var queryString = bizagi.readQueryString();

        $.each(canvas, function () {
            if ($(this).is("iframe")) {
                iframe = $(this);
            }
        });

        iframe.load(function () {
            // inject css
            var content = $(this).contents();

            // Fixed problem with relative path across the different browsers
            var cssLocation = ($.browser.mozilla || $.browser.webkit) ? "../../css/render_%theme%.css" : "css/render_%theme%.css";

            // Define theme
            cssLocation = cssLocation.replace("%theme%", (queryString["theme"] || theme));

            // Append css
            $('body', content).append("<link type='text/css' rel='stylesheet' href='" + cssLocation + "'>");

            // Append javascript
            //	$('head',content).append("<script type='text/javascript' src='../../js/renderintegration.js'></script>");	
        });
    }
});
