/*
*   Name: BizAgi Workportal Desktop Inbox grid Widget Controller
*   Author: Diego Parra (based on  Edward Morales version)
*   Comments:
*   -   This script will provide desktop overrides to implement the inbox grid widget
*/

// Extends itself
bizagi.workportal.widgets.inboxGrid.extend("bizagi.workportal.widgets.inboxGrid", {}, {
    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        // Call base
        self._super(workportalFacade, dataService, params);

        // Declare widget variables
        self.taskState = "all"; // general taskState from tabs
        self.icoTaskState = ""; // real staskState from list cases
        self.idWorkflow = 0;
        self.idCase = 0;
        self.page = 0;

        //Load templates
        self.loadTemplates({
            "inbox-grid": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.grid").concat("#ui-bizagi-workportal-widget-inbox-grid"),
            "inbox-grid-rubik": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.grid").concat("#ui-bizagi-workportal-widget-inbox-grid-rubik"),
            "inbox-grid-cases": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.grid").concat("#ui-bizagi-workportal-widget-inbox-grid-cases"),
            "inbox-common-processes": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-processes"),
            "inbox-common-header-view": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-header-view"),
            "inbox-common-case-summary": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description"),
            "inbox-common-case-summary-subprocess": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description-subprocess"),
            "inbox-common-case-summary-assignees": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description-assignees"),
            "inbox-common-case-summary-events": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description-events"),
            "inbox-common-case-summary-oldrender": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-oldrender"),
            useNewEngine: false
        });


    },
    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;

        bizagi.referrerParams = (self.params.restoreStatus) ? bizagi.referrerParams || {} : {};
        self.params.taskState = self.params.taskState || bizagi.referrerParams.taskState || "all";


	        // Set templates
	        self.processesTemplate = self.getTemplate("inbox-common-processes");
	        self.casesTemplate = self.getTemplate("inbox-grid-cases");
	        self.caseSummaryTemplate = self.getTemplate("inbox-common-case-summary");
	        self.caseSummaryTemplateSubprocess = self.getTemplate("inbox-common-case-summary-subprocess");
	        self.caseSummaryTemplateAssigness = self.getTemplate("inbox-common-case-summary-assignees");
	        self.caseSummaryTemplateEvents = self.getTemplate("inbox-common-case-summary-events");
	        self.paginationTemplate = self.workportalFacade.getTemplate("inbox-common-pagination-grid");

	var security = new bizagi.workportal.command.security(self.dataService);
        security.checkSecurityPerm("Inbox").done(function (inbox) {
            
	    if (inbox) {
		        // Loads inbox summary
		            $.when(self.dataService.getInboxSummary())
		                    .done(function (summary) {
		                        self.updateSummary(summary);
		                        self.resizeLayout();
		                        // Init with default task state
		                        self.changeTaskState(self.params.taskState);
		                    });

		            // Configure view control
		            self.configureViewControl();

		            // Configure folders
		            // Check if its avalible
		            if (bizagi.override.enableSmartFolders) {
		                self.configureSmartFolders();
		            }
	    	    } 
    	     else {
                $("#contentInbox").remove();
                $("#contentFramework").remove();
                $("#footer").remove();
                self.content = $("<div class=\"wp-empty\"></div>");
            }
        });
    },
    /**
    * Modal menu with folder actions
    */
    configureSmartFolders: function () {
        var self = this;
        var content = self.getContent();
        var inboxArrow = $("#innerContentInbox>h2, #innerContentInbox .smartfolders", content);

        inboxArrow.click(function () {
            // If the same popup is opened close it
            if (self.currentPopup == "folders") {
                bizagi.workportal.desktop.popup.closePopupInstance();
                return;
            }

            // Creates popup
            self.popupOpened = true;
            self.currentPopup = "folders";
            self.publish("popupWidget", {
                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SMARTFOLDERS,
                options: {
                    sourceElement: "#innerContentInbox>h2",
                    modalClass: "folders",
                    'max-height': '346',
                    height: 'auto',
                    width: '110',
                    offset: "88 0",
                    activeScroll: true,
                    foldersView: 'inboxgrid',
                    closed: function () {
                        self.currentPopup = null;
                    }
                }
            });
        });
    },
    /*
    *   Configures the view control for the widget
    */
    configureViewControl: function () {
        // We can use the same code than the normal version
        // in case we use a different template or something we need to reimplement this
        bizagi.workportal.widgets.inbox.prototype.configureViewControl.apply(this, arguments);
    },
    /*
    *   Updates inbox summary
    */
    updateSummary: function (summary) {
        // We can use the same code than the normal version
        // in case we use a different template or something we need to reimplement this
        bizagi.workportal.widgets.inbox.prototype.updateSummary.apply(this, arguments);
    },
    /*
    *   Changes the task state and updates the content
    */
    changeTaskState: function (taskState) {
        // We can use the same code than the normal version
        // in case we use a different template or something we need to reimplement this
        var self = this;
        var content = self.getContent();
        var procContainer = $("#contentProc", content);
        bizagi.workportal.widgets.inbox.prototype.changeTaskState.apply(this, arguments);
        // Add scroll bars
        $(procContainer).bizagiScrollbar();

    },
    /*
    *   Changes selected process and updates the content
    */
    changeProcess: function (options) {
        var self = this;
        var content = self.getContent();
        var casesContainer = $("#contentCases", content);
        var procContainer = $("#contentProc", content);
        var pageSelector = $("#footer #casesPagination");
        var nElemToShow = 14;
        options = options || {};

        var idWorkflow = options.idWorkflow || "";
        var page = options["page"] || 1;
		var taskState = options.taskState || self.taskState;
        bizagi.referrerParams.page = page;

        var smartfoldersParameters = "";

        if (self.params.smartfoldersParameters && self.params.smartfoldersParameters.urlParameters) {
            smartfoldersParameters = self.params.smartfoldersParameters.urlParameters;
        }


        // Set order vars
        var orderFieldName = options["orderFieldName"] || "";
        var orderType = options["orderType"] || "0";
        var order = options["order"] || "";

        // Update internal variable
        self.idWorkflow = idWorkflow;

        // Clear content
        casesContainer.empty();
        pageSelector.empty();

        // Load cases by process and task state
        bizagi.showErrorAlertDialog = false;
        $.when(self.dataService.getCustomizedColumnsData({
            idWorkflow: idWorkflow,
            taskState: taskState,
            // Filter by favorites  only when we are searching all processes and favorites
            onlyFavorites: eval(self.onlyFavorites),
            // Sort and order parameters
            order: order,
            orderFieldName: orderFieldName,
            orderType: orderType,
            page: page,
            smartfoldersParameters: smartfoldersParameters,
            group: (bizagiConfig.groupByCaseNumber)?"T_RADNUMBER":null
        })).done(function (data) {
            bizagi.showErrorAlertDialog = true;

            // Define list of cases
            bizagi.lstIdCases = data.cases.lstIdCases;

            //  Hack json data :(
            var i = 0;
            $(data.cases.columnTitle).each(function (key, value) {
                if (value.order == "T_idTask") {
                    $(data.cases.rows).each(function (key2, value2) {
                        if (!self.isArray(value2["fields"][i])) {
                            data["cases"]["rows"][key2]["fields"][i] = {
                                "workitems": [{
                                    "TaskName": value2["fields"][i],
                                    "State": data["cases"]["rows"][key2]["taskState"]
                                }]
                            };
                        }
                    });
                }
                i++;
            });

            // Show or hide "load more" button
            var pdata = {};
            pdata.pagination = (data["cases"]["totalPages"] > 1) ? true : false;
            pdata.page = bizagi.referrerParams.page || data["cases"]["page"];

            // set total pages
            pdata.pages = {};
            var pageToshow = (nElemToShow > data["cases"]["totalPages"]) ? data["cases"]["totalPages"] : nElemToShow;
            for (i = 1; i <= pageToshow; i++) {
                pdata.pages[i] = {
                    "pageNumber": i
                };
            }

            // Set style pagination
            pdata["gridPagination"] = "gridCasePagination";
            pdata.previousPage = (data.cases.page > 1) ? data.cases.page - 1 : 1;
            pdata.nextPage = (data.cases.page < data.cases.totalPages) ? data.cases.page + 1 : data.cases.totalPages;
            pdata.totalPages = data.cases.totalPages;

            var paginationHtml = $.tmpl(self.paginationTemplate, pdata).html();

            // Get template
            $(pageSelector).append(paginationHtml);

            data.cases.enableFolders = bizagi.override.enableFolder || false;
            data.cases = bizagi.util.formatDecimalAndMoneyCell(data.cases, BIZAGI_DEFAULT_CURRENCY_INFO);

            // Get security
            var security = new bizagi.workportal.command.security(self.dataService);
            security.checkSecurityPerm("GraphicQuery").done(function (graphicQuery) {
                data.cases.graphicQuery = graphicQuery;
                data.cases.groupByCaseNumber = bizagiConfig.groupByCaseNumber;
                // Get template
                var renderedTemplate = $.tmpl(self.casesTemplate, data.cases, {
                    setFormat: self.formatValue,
                    isArray: self.isArray,
                    formatCategories: self.formatCategories,
                    isDate: bizagi.util.isDate,
                    replaceLineBreak: function (string) {
                        return typeof string === "string" ? (string.search(/\n/) !== -1 ? string.replaceAll("\n", "<br/>") : string) : string;
                    },
                    getRadNumberColumnIndex: function(){
                        var data = this.data;
                        var index = -1;
                        for(var i=0,l=data.columnTitle.length; i<l;i++){
                            if(data.columnTitle[i].fieldName =="I_RadNumber"){
                                index = i;
                            }
                        }
                        return index;
                    },
                    showColumn:function(columnIndex) {
                        var index = this.getRadNumberColumnIndex();
                        return (this.data.groupByCaseNumber && index == columnIndex)? " style=display:none; ": "";
                    },
                    createGroupedHeader:function(rowIndex){
                        var data = this.data;
                        var result = false;
                        var radNumber = this.getRadNumber(data.rows[rowIndex]);
                        if(data.groupByCaseNumber){
                            if(rowIndex == 0){
                                result = true;
                            }else{
                                var previousRadNumber = this.getRadNumber(data.rows[rowIndex-1]);
                                if(radNumber != previousRadNumber){
                                    result = true;
                                }
                            }
                        }
                        return result;
                    },
                    getRadNumber:function(row){
                        var index = this.getRadNumberColumnIndex();
                        return (index >= 0)? row.fields[index] : "";
                    }
                }).appendTo(casesContainer);

                //There is an issue with ie9 and long tables, its removes the space between closed td and next opened td
                if (bizagi.util.isIE9()) {
                    var expr = new RegExp('>[ \t\r\n\v\f]*<', 'g');
                    var tbhtml = $("#ui-bizagi-wp-app-inbox-grid-cases", casesContainer).html();

                    $("#ui-bizagi-wp-app-inbox-grid-cases", casesContainer).html(tbhtml.replace(expr, "><"));
                }

                // Format invariant dates
                if (bizagi.override.ShowTimeInInboxDates == 1 || bizagi.override.ShowTimeInInboxDates == undefined)
                    bizagi.util.formatInvariantDate(content, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));
                else
                    bizagi.util.formatInvariantDate(content, self.getResource("dateFormat"));

                // Set data for pagination
                $("li", pageSelector).parent().data("order", order);
                $("li", pageSelector).parent().data("orderFieldName", orderFieldName);
                $("li", pageSelector).parent().data("orderType", orderType);

                // Crate pagination control
                $("ul").bizagiPagination({
                    maxElemShow: 50,
                    totalPages: pdata.totalPages,
                    actualPage: pdata.page,
                    listElement: $("ul", pageSelector),
                    clickCallBack: function (options) {
                        self.changeProcess({
                            idWorkflow: idWorkflow,
                            page: options.page,
                            order: options.parent.data("order"),
                            orderFieldName: options.parent.data("orderFieldName"),
                            orderType: options.parent.data("orderType")
                        });
                    }
                });


                //Work on it button
                $(".workonitRow", content).button();
                $(".inbox-grid-tooltip-button", content).tooltip();

                // Set even style
                $("#ui-bizagi-wp-app-inbox-grid-cases tr:nth-child(even)", renderedTemplate).addClass("event");

                // Add click event for activities
                $(".ui-bizagi-wp-app-inbox-activity-name", renderedTemplate).click(function () {
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

                    // Call routing action
                    var idCase = $(this).find("#idCase").val();
                    var idTask = $(this).find("#idTask").val();
                    var idWorkItem = $(this).find("#idWorkItem").val();
                    var idWorkflow = $(this).closest('tr').data("idworkflow");

                    self.publish("executeAction", {
                        action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                        idCase: idCase,
                        idWorkItem: idWorkItem,
                        idTask: idTask,
                        idWorkflow: idWorkflow
                    });
                });

                $(".ui-bizagi-wp-app-inbox-grouped",renderedTemplate).bind("click", function(){
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

                // Bind favorites start
                $(renderedTemplate).delegate(".ui-bizagi-wp-app-inbox-cases-start", "click", function (e) {
                    e.stopPropagation();
                    var favoriteOptions;
                    var elmnt = this;
                    $(elmnt).removeClass("ui-bizagi-wp-app-inbox-cases-start").addClass("ui-bizagi-wp-app-inbox-cases-start-wait");

                    // check if its favorite
                    if ($(elmnt).parent().find("#isFavorite").val() == "false") {
                        favoriteOptions = {
                            idObject: $(elmnt).parent().find("#idCase").val(),
                            favoriteType: "CASES"
                        };
                        $.when(
                                self.dataService.addFavorite(favoriteOptions)
                                ).done(function (favoritesData) {
                                    $(elmnt).parent().find("#guidFavorite").val(favoritesData["idFavorites"]);
                                    $(elmnt).removeClass("bz-icon-star-outline").addClass("bz-icon-star");
                                    $(elmnt).parent().find("#isFavorite").val("true");
                                    $(elmnt).removeClass("ui-bizagi-wp-app-inbox-cases-start-wait").addClass("ui-bizagi-wp-app-inbox-cases-start");
                                    self.updateCountProcess(idWorkflow, true);
                                });
                    } else {
                        favoriteOptions = {
                            idObject: $(elmnt).parent().find("#guidFavorite").val(),
                            favoriteType: "CASES"
                        };
                        $.when(
                                self.dataService.delFavorite(favoriteOptions)
                                ).done(function (favoritesData) {
                                    if (favoritesData["deleted"] == "true" || favoritesData["deleted"] == true) {
                                        $(elmnt).parent().find("#guidFavorite").val("");
                                        $(elmnt).removeClass("bz-icon-star").addClass("bz-icon-star-outline");
                                        $(elmnt).parent().find("#isFavorite").val("false");
                                        $(elmnt).removeClass("ui-bizagi-wp-app-inbox-cases-start-wait").addClass("ui-bizagi-wp-app-inbox-cases-start");
                                        self.updateCountProcess(idWorkflow, false);
                                    }
                                });
                    }
                });

                // show case summary
                $(".workonitRow.showDesc", renderedTemplate).click(function () {
                    // Call routing action
                    var idCase = $(this).parents("td").first().find("#idCase").val();
                    var idWorkflow = $(this).closest("tr").data("idworkflow");
                    self.showCase(idCase, idWorkflow);
                });



                // Add click to view workflow
                $(".ui-bizagi-wp-app-inbox-cases-ico-view", renderedTemplate).click(function (event) {

                    var idCase = $(this).parent().children("#idCase").val();
                    var idWorkflow = $(this).closest("tr").data("idworkflow");

                    self.showGraphicQuery({ idCase: idCase, idWorkflow: idWorkflow });
                    event.preventDefault();
                });

                // bind for sort columns
                $(".sortColumnsData", casesContainer).click(function () {
                    self.changeProcess({
                        idWorkflow: idWorkflow,
                        orderFieldName: $(this).find("#orderFieldName").val(),
                        orderType: (($(this).find("#orderType").val() == 0) ? 1 : 0),
                        order: $(this).find("#order").val()
                    });

                });

                // Add scroll bars
                $(casesContainer).bizagiScrollbar({
                    "autohide": false
                });

                // Bind Folders
                $(".ui-bizagi-inbox-folder", renderedTemplate).click(function (e) {
                    e.stopPropagation();
                    var idCase = $(this).data("idcase");

                    // If the same popup is opened close it
                    if (self.currentPopup == "folders") {
                        bizagi.workportal.desktop.popup.closePopupInstance();
                        return;
                    }

                    // Creates popup
                    self.popupOpened = true;
                    self.currentPopup = "folders";
                    self.publish("popupWidget", {
                        widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_FOLDERS,
                        options: {
                            sourceElement: $(this),
                            modalClass: "folders",
                            'max-height': '146',
                            height: 'auto',
                            width: '110',
                            offset: "88 0",
                            activeScroll: true,
                            onlyFolderMode: true,
                            idCase: idCase,
                            closed: function () {
                                self.currentPopup = null;
                            }
                        }
                    });
                });

                $(procContainer).bizagiScrollbar();
            });

        }).fail(function (error) {
            error = JSON.parse(error.responseText) || {};
            var errorTemplate = self.workportalFacade.getTemplate("info-message");
            var message = error.message || error;
            var errorHtml = $.tmpl(errorTemplate, {
                message: message
            });

            errorHtml.appendTo(casesContainer);
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

                    // jQuery-ui tabs
                    $("#ui-bizagi-details-tabs", content).tabs({
                        active: -1,
                        create: function (event, ui) {
                            $(this).tabs("option", "active", 0);
                        },
                        "activate": function (event, ui) {
                            var panel = (ui == undefined) ? "formSummary" : ui.newPanel.attr('id');
                            switch (panel) {
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

                                            // Define wirkitem and idtask
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

                                                    for (i = 0; i < getWorkitems.workItems.length; i++) {
                                                        if (getWorkitems.workItems[i]['idCase'] == self.idCase) {
                                                            idWorkitem = getWorkitems.workItems[i]['idWorkItem'];
                                                            idTask = getWorkitems.workItems[i]['idTask'];
                                                            break;
                                                        }
                                                    }

                                                    data.url = self.dataService.serviceLocator.getUrl("old-render") + "?PostBack=1&idCase=" + self.idCase + "&idWorkitem=" + idWorkitem + "&idTask=" + idTask + "&isSummary=1";
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
                            idTask: $(this).parent().find("#idTask").val(),
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
                            idTask: $(this).parent().find("#idTask").val(),
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

                    var maximized = (bizagi.override.maximizedSummary === true);
                    caseSummaryDialog.dialog({
                        modal: true,
                        title: data.process,
                        width: 1000,
                        height: 600,
                        maximized: maximized,
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
    /**
    *  Change total processes indicator, when start favorites view and user select or deselect
    *  favorite cases.
    *
    *  @augments increment  {true || false }, true= increment +1 , false = decrement -1, default true.
    */
    updateCountProcess: function (idWorkflow, increment) {
        var self = this;
        var content = self.getContent();
        var processesContainer = $("#contentProc", content);
        var assigned = false;

        increment = (increment) ? true : false;

        // Check if task state is diferent to Favorites
        if (self.params.taskState != "Favorites" || idWorkflow == "") {
            return true;
        }


        // Get all process and verify new favorites count
        // Loads processes by task state
        $.when(self.dataService.getAllProcesses({
            taskState: self.taskState,
            onlyFavorites: self.onlyFavorites
        }))
                .done(function (data) {
                    data.categories = data.categories || {};
                    $.each(data.categories, function (key, value) {
                        $.each(value.workflows, function (key2, value2) {
                            if (value2.idworkflow == idWorkflow) {
                                // update value
                                // Find list elements
                                $('li > input[value="' + idWorkflow + '"][id="idWorkflow"]', processesContainer).parent().find(".ui-bizagi-wp-app-inbox-processes-ncase").html(value2.count);
                                assigned = true;
                            }
                        })
                    });

                    // If element reach 0 cases, set 0
                    if (!assigned) {
                        if (increment) {
                            $('li > input[value="' + idWorkflow + '"][id="idWorkflow"]', processesContainer).parent().find(".ui-bizagi-wp-app-inbox-processes-ncase").html(1);
                        } else {
                            $('li > input[value="' + idWorkflow + '"][id="idWorkflow"]', processesContainer).parent().find(".ui-bizagi-wp-app-inbox-processes-ncase").html(0);
                        }
                    }
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
            //  $('head',content).append("<script type='text/javascript' src='../../js/renderintegration.js'></script>");
        });
    },

    /*
    *   Disposes the widget
    */
    dispose: function () {
        var self = this;

        // Call base
        self._super();
    }

});

bizagi.workportal.widgets.inboxGrid.extend("bizagi.workportal.widgets.inboxGridRubik", {}, {
	/**
	 * Overrite of renderContent
	 *
	 * @return {*}
	 */
	renderContent: function () {
		var self = this;
		var template = self.getTemplate("inbox-grid-rubik");

		// Render content
		var content = self.content = $.tmpl(template,{});

		// Set inbox view variable
		bizagi.workportal.currentInboxView = self.getWidgetName();

		return content;
	},

	/**
	 * Override of postRender
	 */
	postRender: function(){
		var self = this;

		bizagi.referrerParams = (self.params.restoreStatus) ? bizagi.referrerParams || {} : {};

		self.changeProcess({idWorkflow: "", workflowName: "All Cases ", smartfoldersParameters: ""});

		/**
		 * Publish event to list cases
		 *
		 * @param {idWorkflow, page, orderFieldName, orderType, order, taskState}
		 */
		self.getEventListener().on("PROCESS-VIEW-UPDATE",function(e,params){
			self.changeProcess(params);
		});
	}
});
