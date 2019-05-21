/*
*   Name: BizAgi Workportal Desktop Inbox Widget Controller
*   Author: Diego Parra (based on  Edward Morales version)
*   Comments:
*   -   This script will provide desktop overrides to implement the inbox widget
*/

// Extends itself
bizagi.workportal.widgets.inbox.extend("bizagi.workportal.widgets.inbox", {}, {
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

        //Load templates
        self.loadTemplates({
            "inbox": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox").concat("#ui-bizagi-workportal-widget-inbox"),
            "inbox-cases": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox").concat("#ui-bizagi-workportal-widget-inbox-cases"),
            "inbox-cases-list": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox").concat("#ui-bizagi-workportal-widget-inbox-cases-list"),
            "inbox-cases-personalized-list": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox").concat("#ui-bizagi-workportal-widget-inbox-cases-personalized-list"),
            "inbox-common-processes": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-processes"),
            "inbox-common-noresults": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-noresults"),
            "inbox-common-header-view": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-header-view"),
            "inbox-common-case-summary": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description"),
            "inbox-common-case-summary-form": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description-form"),
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
        self.casesTemplate = self.getTemplate("inbox-cases");
        //self.casesTemplateList = self.getTemplate("inbox-cases-list");   // original template
        self.casesTemplateList = self.getTemplate("inbox-cases-personalized-list");    // personalized columns
        self.caseSummaryTemplate = self.getTemplate("inbox-common-case-summary");
        self.caseSummaryTemplateForm = self.getTemplate("inbox-common-case-summary-form");
        self.caseSummaryTemplateSubprocess = self.getTemplate("inbox-common-case-summary-subprocess");
        self.caseSummaryTemplateAssigness = self.getTemplate("inbox-common-case-summary-assignees");
        self.caseSummaryTemplateEvents = self.getTemplate("inbox-common-case-summary-events");

        self.noResults = self.getTemplate("inbox-common-noresults");
        self.paginationTemplate = self.workportalFacade.getTemplate("inbox-common-pagination-inbox");


        // Loads inbox summary
        $.when(self.dataService.getInboxSummary())
                .done(function (summary) {
                    self.updateSummary(summary);

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
                    foldersView: 'inboxdetails',
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
        var self = this;
        var content = self.getContent();
        var eyeIcon = $("#ui-bizagi-wp-app-inbox-bt-eye", content);
        var eyeIconParent = $("#ui-bizagi-wp-app-inbox-bt-eye", content).parent();

        // Bind view handler
        eyeIcon.click(function () {
            // If the popup is opened close it
            /* if (self.popupOpened){
            bizagi.workportal.desktop.popup.closePopupInstance();
            return;
            }*/

            bizagi.workportal.desktop.popup.closePopupInstance();
            // Creates popup
            self.popupOpened = false;
            eyeIconParent.addClass("active");
            self.currentPopup = "eyeDetails";
            var offset = "0 0";
            var at = "left bottom";
            var height = 60;
            var width = 129;
            var arrowPosition = {
                left: "64%"
            };

            var popup = new bizagi.workportal.desktop.popup(self.dataService, self.workportalFacade, {
                sourceElement: "#ui-bizagi-wp-app-inbox-bt-eye",
                offset: offset,
                at: at,
                height: height,
                width: width,
                arrowPosition: arrowPosition
            });

            // Render popup
            var template = self.getTemplate("inbox-common-header-view");
            popup.render($.tmpl(template));

            // Checks for close signal to change the class again
            $.when(popup.closed())
                    .done(function () {
                        self.popupOpened = false;
                        eyeIconParent.removeClass("active");
                    });

            // Details view
            var popupContent = popup.getContent();
            $("#viewDetailsEvent", popupContent).click(function () {
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX
                });
                popup.close();
            });

            // Grid view
            $("#viewGridEvent", popupContent).click(function () {
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID
                });
                popup.close();
            });
        });
    },
    /*
    *   Updates inbox summary
    */
    updateSummary: function (summary) {
        var self = this;
        var content = self.getContent();

        // Update values
        $(".ui-bizagi-wp-app-inbox-tab#red", content).data("taskState", "Red");
        $(".ui-bizagi-wp-app-inbox-tab#green", content).data("taskState", "Green");
        $(".ui-bizagi-wp-app-inbox-tab#yellow", content).data("taskState", "Yellow");
        $(".ui-bizagi-wp-app-inbox-tab#favourites", content).data("taskState", "Favorites");

        // set number of cases for each category
        //{"inboxSummary":{"All":1151,"Green":85,"Red":1055,"Black":0,"Yellow":11}}
        if (self.params.taskState != "all") {
            $(".ui-bizagi-wp-app-inbox-tab", content).each(function (k, e) {
                if ($(e).data("taskState") == self.params.taskState) {
                    $(e).addClass("active");
                } else {
                    $(e).removeClass("active");
                }
            });
        }

        $(".ui-bizagi-wp-app-inbox-tab#all", content).find(".toolTip").html(summary.All);
        $(".ui-bizagi-wp-app-inbox-tab#red", content).find(".toolTip").html(summary.Red);
        $(".ui-bizagi-wp-app-inbox-tab#green", content).find(".toolTip").html(summary.Green);
        $(".ui-bizagi-wp-app-inbox-tab#yellow", content).find(".toolTip").html(summary.Yellow);

        $(".ui-bizagi-wp-app-inbox-tab", content).click(function () {
            //remove selected style
            $(".ui-bizagi-wp-app-inbox-tab", content).removeClass("active");
            //set selected style
            $(this).addClass("active");

            // get content
            /* self.publish("changeWidget", {
            widgetName : self.params.widgetName,
            taskState : $(this).data("taskState")
            });*/
            self.changeTaskState($(this).data("taskState"));
        });
    },
    /*
    *   Changes the task state and updates the content
    */
    changeTaskState: function (taskState) {
        var self = this;
        var content = self.getContent();
        var processesContainer = $("#contentProc", content);
        var smartfoldersParameters = "";

        if (self.params.smartfoldersParameters && self.params.smartfoldersParameters.urlParameters) {
            smartfoldersParameters = self.params.smartfoldersParameters.urlParameters;
        }

        var previewTaskState = self.params.taskState;
        self.params.taskState = taskState;

        // Update internal variable
        if (taskState == "Favorites") {
            self.taskState = "all";
            self.onlyFavorites = "true";
            if(previewTaskState !== taskState){
                bizagi.referrerParams.page = "1";
            }
        } else {
            self.taskState = taskState;
            self.onlyFavorites = "";
        }

        $("#ui-bizagi-wp-app-inbox-tap-selector", content).removeClass().addClass(taskState);

        // Clear content
        processesContainer.empty();

        // Loads processes by task state
        $.when(self.dataService.getAllProcesses({
            taskState: self.taskState || "all",
            onlyFavorites: self.onlyFavorites,
            smartfoldersParameters: smartfoldersParameters
        }))
                .done(function (data) {
                    //Remove title All processes on inbox
                    if(data.categories.length > 0){
                        data.categories[0].name = "";
                    }
                    // Get template
                    $.tmpl(self.processesTemplate, data).appendTo(processesContainer);

                    //update 11/11/2014
                    //if (bizagi.util.parseBoolean(bizagi.override.disableFrankensteinQueryForms) == true) {

                        $.when(self.dataService.getStoredQueryFormList()).done(function (storedQueryForm) {
                            if (storedQueryForm.storedQueryForms.length > 0) {
                                $.when(
                                    self.workportalFacade.getWidget("queriesShortcut", {})
                                ).pipe(function (result) {
                                    widget = result;
                                    return widget.render();
                                }).done(function () {
                                    var content = widget.getContent();
                                    $("#queryFormShortcut").html(content);
                                });
                            }
                        });

                    //}

                    // Binds click handler for processes
                    $("li", processesContainer).click(function (event) {
                        var process = $(this);

                        // Remove all selected elements
                        $(".selected", processesContainer).removeClass("selected");

                        // Add selected class
                        process.addClass("selected");

                        //if click for human, restore page to 1
                        if(event.currentTarget && event.currentTarget.tagName){
                            bizagi.referrerParams.page = "1";
                        }

                        // Change the current process
                        var idWorkflow = $("#idWorkflow", process).val();
                        var workflowName = $(".ui-bizagi-wp-app-inbox-processes-name", process).text();
                        self.changeProcess({
                            idWorkflow: idWorkflow,
                            workflowName: workflowName,
                            smartfoldersParameters: smartfoldersParameters,
                            page: bizagi.referrerParams ? bizagi.referrerParams.page : undefined
                        });
                    });

                    // Bind favorites start
                    $(".ui-bizagi-wp-app-inbox-processes-start", processesContainer).click(function (e) {
                        e.stopPropagation();
                        var options;
                        var elmnt = this;
                        var idWorkflow = $("#idWorkflow", $(elmnt).parent()).val();

                        $(elmnt).removeClass("ui-bizagi-wp-app-inbox-processes-start").addClass("ui-bizagi-wp-app-inbox-processes-start-wait");

                        // check if its favorite
                        if ($(elmnt).parent().find("#isFavorite").val() == "false") {
                            options = {
                                idObject: $(elmnt).parent().find("#guidWFClass").val(),
                                favoriteType: "WFCLASS"
                            };
                            $.when(
                            self.dataService.addFavorite(options)
                            ).done(function (favoritesData) {
                                $(elmnt).parent().find("#guidFavorite").val(favoritesData["idFavorites"]);
                                $(elmnt).removeClass("bz-icon-star-outline").addClass("bz-icon-star");
                                $(elmnt).parent().find("#isFavorite").val("true");
                                $(elmnt).removeClass("ui-bizagi-wp-app-inbox-processes-start-wait").addClass("ui-bizagi-wp-app-inbox-processes-start");
                                self.updateCountProcess(idWorkflow, true);
                            });
                        } else {
                            options = {
                                idObject: $(elmnt).parent().find("#guidFavorite").val(),
                                favoriteType: "WFCLASS"
                            };
                            $.when(
                            self.dataService.delFavorite(options)
                            ).done(function (favoritesData) {
                                if (favoritesData["deleted"] == "true" || favoritesData["deleted"] == true) {
                                    $(elmnt).parent().find("#guidFavorite").val("");
                                    $(elmnt).removeClass("bz-icon-star").addClass("bz-icon-star-outline");
                                    $(elmnt).parent().find("#isFavorite").val("false");
                                    $(elmnt).removeClass("ui-bizagi-wp-app-inbox-processes-start-wait").addClass("ui-bizagi-wp-app-inbox-processes-start");
                                    self.updateCountProcess(idWorkflow, false);
                                }
                            });
                        }

                        // Update case list
                        if (self.params.taskState == "Favorites" && $(elmnt).parent().hasClass("selected")) {
                            $(elmnt).parent().trigger("click");
                        }
                    });



                    $(".ui-bizagi-wp-app-inbox-processes-title", processesContainer).click(function () {
                        var process = $(this).next("ul");
                        var arrow = $(this).find("span");
                        var isHidden = (process.is(":hidden")) ? true : false;
                        // Check if element has been hidden
                        if (isHidden) {
                            process.show();
                            arrow.removeClass("Right");
                            arrow.addClass("Down");
                        } else {
                            process.hide();
                            arrow.removeClass("Down");
                            arrow.addClass("Right");
                        }
                    });

                    var lastProcess = true;

                    // Open first category
                    if (self.params.restoreStatus) {
                        $.each($(".ui-bizagi-wp-app-inbox-processes-title", processesContainer), function (key, value) {
                            $.each($("li", $(value, processesContainer).next()), function (key2, value2) {
                                if ($(value2).find("#idWorkflow").val() == bizagi.referrerParams.idWorkflow) {
                                    $.when($(value, processesContainer).trigger("click")).done(function () {
                                        $(value2, processesContainer).addClass("selected");
                                        self.changeProcess({
                                            page: bizagi.referrerParams.page,
                                            idWorkflow: bizagi.referrerParams.idWorkflow,
                                            workflowName: $(".ui-bizagi-wp-app-inbox-processes-name", $(value2, processesContainer)).text()
                                        });
                                        lastProcess = false;
                                    })
                                }
                            });
                        });
                        self.params.restoreStatus = false;
                    } else {
                        $(".ui-bizagi-wp-app-inbox-processes-title:first", processesContainer).trigger("click");
                        $("li:first", processesContainer).addClass("selected").trigger("click");
                        lastProcess = false;
                    }


                    // Next lines applied to last submitted process in a group of processes, It must go to Inbox instead of a non-existing group of processes
                    if (lastProcess) {
                        $(".ui-bizagi-wp-app-inbox-processes-title:first", processesContainer).trigger("click");
                        $("li:first", processesContainer).addClass("selected").trigger("click");
                    }

                    $(processesContainer).bizagiScrollbar();

                    if (data.categories.length == 0) {
                        self.changeProcess();
                    }
                });
    },
    /*
    *   Changes selected process and updates the content
    */
    changeProcess: function (options) {
        var self = this;
        var content = self.getContent();
        var casesContainer = $("#contentCases", content);
        var pageSelector = $("#footer #casesPagination");
        var descContainer = $("#contentDesc", content);
        var nElemToShow = 14;
        var smartfoldersParameters = "";

        if (self.params.smartfoldersParameters && self.params.smartfoldersParameters.urlParameters) {
            smartfoldersParameters = self.params.smartfoldersParameters.urlParameters;
        }

        options = options || {};
        var page = options["page"] || 1;
        bizagi.referrerParams.page = page;

        // Update internal variable
        var idWorkflow = options.idWorkflow;
        self.idWorkflow = idWorkflow;

        // Clear content
        casesContainer.empty();
        //casesContainer.empty();
        descContainer.empty();
        pageSelector.empty();

        bizagi.showErrorAlertDialog = false;
        // Load cases by process and task state
        $.when(
                self.dataService.getCasesByWorkflow({
                    idWorkflow: self.idWorkflow,
                    taskState: self.taskState,
                    // Filter by favorites  only when we are searching all processes and favorites
                    onlyFavorites: eval(self.onlyFavorites),
                    page: page,
                    smartfoldersParameters: smartfoldersParameters

                }))
                .done(function (data) {
                    bizagi.showErrorAlertDialog = true;

                    // Set list of cases for global purpose
                    bizagi.lstIdCases = data.lstIdCases;

                    // add idWorkFlow
                    data.idWorkflow = idWorkflow;

                    // If cases container has no elements append something to hide spinner
                    if (!data.rows.length) {
                        casesContainer.append("&nbsp;");
                        descContainer.append("&nbsp;");
                        return;
                    }

                    // Extend data
                    data.processName = options.workflowName || "";

                    // show or hide "load more" button
                    data.pagination = (data["totalPages"] > 1) ? true : false;

                    // set total pages
                    data.pages = {};
                    var totPages = data["totalPages"];
                    var pageToshow = (nElemToShow > data["totalPages"]) ? data["totalPages"] : nElemToShow;
                    // Next couple Lines to ensure enough space in the pager area
                    if (totPages > 9) pageToshow--;
                    if (totPages > 99) pageToshow--;
                    for (var i = 1; i <= pageToshow; i++) {
                        data["pages"][i] = {
                            "pageNumber": i
                        };
                    }

                    // Get security
                    var security = new bizagi.workportal.command.security(self.dataService);
                    data.graphicQuery = security.checkSecurityPerm("GraphicQuery");

                    data.enableFolders = bizagi.override.enableFolder || false;
                    var paginationHtml = $.tmpl(self.paginationTemplate, data).html();

                    // Get template
                    $(pageSelector).append(paginationHtml);

                    // Render template
                    $.tmpl(self.casesTemplate, data, {
                        replaceLineBreak: function (string) {
                            return typeof string === "string" ? (string.search(/\n/) !== -1 ? string.replaceAll("\n", "<br/>") : string) : string;
                        },
                        formatMonetaryCell: function (value) {
                            return bizagi.util.formatMoney(value, BIZAGI_DEFAULT_CURRENCY_INFO);
                        },
                        formatDecimalCell: function (value) {
                            var decimalFormat;
                            var externalDecimalFormat = {
                                decimalSymbol: BIZAGI_DEFAULT_CURRENCY_INFO.decimalSeparator,
                                digitGroupSymbol: BIZAGI_DEFAULT_CURRENCY_INFO.groupSeparator,
                                roundToDecimalPlace: BIZAGI_DEFAULT_CURRENCY_INFO.decimalDigits
                            };
                            var defaultDecimalFormat = {
                                colorize: false,
                                decimalSymbol: ".",
                                digitGroupSymbol: ",",
                                groupDigits: true,
                                negativeFormat: "(%s%n)",
                                positiveFormat: "%s%n",
                                roundToDecimalPlace: "2",
                                symbol: ""
                            };
                            decimalFormat = $.extend(defaultDecimalFormat, externalDecimalFormat);
                            return bizagi.util.formatDecimal(value, decimalFormat);
                        },
                        formatBoolean: function (value) {
                            if (bizagi.util.parseBoolean(value) == true) {
                                return self.getResource("render-boolean-yes");
                            } else if (bizagi.util.parseBoolean(value) == false) {
                                return self.getResource("render-boolean-no");
                            } else {
                                return "";
                            }
                        }
                    }).appendTo(casesContainer);

                    // Format invariant dates
                    bizagi.util.formatInvariantDate(content, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));

                    // set total number pages
                    $(".scrollCases").data("totalPage", data["totalPages"]);
                    $(".scrollCases").data("page", 1);

                    // Crate pagination control
                    $("ul").bizagiPagination({
                        totalPages: data.totalPages,
                        actualPage: data.page,
                        listElement: $("ul", pageSelector),
                        clickCallBack: function (options) {
                            self.changeProcess({
                                idWorkflow: idWorkflow,
                                page: options.page
                            });
                        }
                    });


                    // Binds click handler for cases
                    $("li", casesContainer).click(function () {
                        var cAse = $(this);

                        // set real taskState
                        self.icoTaskState = $(this).children("#caseName").children("#taskState").val();

                        // Remove all selected elements
                        $(".selected", casesContainer).removeClass("selected");

                        // Add selected class
                        cAse.addClass("selected");

                        // Change the current process
                        var idCase = $("#idCase", cAse).val();
                        var idWorkflow = $("#idWorkflowGQ", cAse).val();

                        self.changeCase(idCase, idWorkflow);
                    });

                    // Bind Folders
                    $(".ui-bizagi-inbox-folder", casesContainer).click(function (e) {
                        e.stopPropagation();
                        var idCase = $(this).data("idcase");

                        // If the same popup is opened close it
                        if (self.currentPopup == "folders") {
                            bizagi.workportal.desktop.popup.closePopupInstance();
                            return;
                        }

                        bizagi.workportal.desktop.popup.closePopupInstance();
                        // Creates popup
                        self.popupOpened = false;
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

                    // Bind favorites start
                    $(".ui-bizagi-wp-app-inbox-cases-start", casesContainer).click(function (e) {
                        e.stopPropagation();
                        var favoriteOptions;
                        var elmnt = this;

                        $(elmnt).removeClass("ui-bizagi-wp-app-inbox-cases-start").addClass("ui-bizagi-wp-app-inbox-cases-start-wait");

                        // check if its favorite
                        if ($(elmnt).parent().find("#isFavorite").val() == "false") {
                            favoriteOptions = {
                                idObject: $(elmnt).parent().parent().find("#idCase").val(),
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

                    if (data.rows.length > 0) {
                        // Make first item selected
                        self.icoTaskState = $("li:first", casesContainer).children("#taskState").val();
                        $("li:first", casesContainer).addClass("selected").trigger("click");

                    } else {
                        self.changeCase(0);
                    }

                    $(casesContainer).bizagiScrollbar();
                }).fail(function (error) {
                    error = JSON.parse(error.responseText) || {};
                    var caseSummaryContainer = $("#contentDesc", content);
                    var errorTemplate = self.workportalFacade.getTemplate("info-message");
                    var message = error.message || error;
                    var errorHtml = $.tmpl(errorTemplate, {
                        message: message,
                        css: 'ui-bizagi-info-inbox-detail'
                    });
                    // Remove loading icon from summary container
                    caseSummaryContainer.append('&nbsp;');

                    errorHtml.appendTo(casesContainer);
                });
    },
    /*
    *   Changes the selected case and updates the content
    */
    changeCase: function (idCase, idWorkflow) {
        var self = this;
        var content = self.getContent();
        var caseSummaryContainer = $("#contentDesc", content);
        var cache = {};
        var htmlContent = "";
        // Clear content
        caseSummaryContainer.empty();

        // Update internal variable
        self.idCase = idCase;

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

                    if(typeof data.contextualized === "undefined"){
                        data.contextualized = true;
                    }

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

                    var summary = $.tmpl(self.caseSummaryTemplate, $.extend(data, {security: bizagi.menuSecurity})).appendTo(caseSummaryContainer);

                    // Format invariant dates
                    bizagi.util.formatInvariantDate(content, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));

                    // Delegate events for parent process
                    $("#details", summary).delegate(".summaryLink", "click", function () {
                        self.routingExecute($(this));
                    });

                    // jQuery-ui
                    $("#ui-bizagi-details-tabs", content).tabs({
                        active: -1,
                        create: function (event, ui) {
                            $(this).tabs("option", "active", 0);
                        },
                        activate: function (event, ui) {
                            var panel = (ui == undefined) ? "formSummary" : ui.newPanel.attr('id');
                            switch (panel) {

                                case "comments":
                                    if (cache["comments"] == undefined) {
                                        // Extend render with comments
                                        $.extend(self, {}, bizagi.workportal.comments);

                                        // Define canvas
                                        data.canvas = $("#comments", caseSummaryContainer);
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
                                                onlyUserWorkItems: true
                                            })).done(function (getWorkitems) {
                                                // verify workitem, in some cases these variables are not available
                                                if (typeof getWorkitems.workItems == "object" && getWorkitems.workItems.length >= 1) {
                                                    // Case Open
                                                    var idWorkitem = getWorkitems.workItems[0]['idWorkItem'];
                                                    var idTask = getWorkitems.workItems[0]['idTask'];
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
                                                // Recalculate size panel
                                                self.performResizeLayout();
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
                                            $.when(self.renderSummaryForm(canvas))
                                            .done(function () {
                                                htmlContent = $("#formSummary", caseSummaryContainer).html();
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
                                    }))
                                    .done(function (subprocess) {
                                        htmlContent = $.tmpl(self.caseSummaryTemplateSubprocess, subprocess);
                                        htmlContent.appendTo($("#subprocess", caseSummaryContainer));
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
                                        idCase: self.idCase
                                    }))
                                    .done(function (assignees) {
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
                                        htmlContent.appendTo($("#assignees", caseSummaryContainer));
                                        cache["assignees"] = htmlContent;
                                    });
                                    }
                                    break;
                                case "events":
                                    if (cache["events"] == undefined) {
                                        $.when(
                                    self.dataService.summaryCaseEvents({
                                        idCase: self.idCase
                                    }))
                                    .done(function (events) {
                                        htmlContent = $.tmpl(self.caseSummaryTemplateEvents, events);
                                        htmlContent.appendTo($("#events", caseSummaryContainer));
                                        cache["events"] = htmlContent;

                                        htmlContent.delegate(".summaryLink", "click", function () {
                                            self.routingExecute($(this));
                                        });
                                    });
                                    }
                                    break;
                            }
                        }
                    });

                    // set even style for process and cases
                    $.each($("#ui-bizagi-wp-app-inbox-processes-container li:even, #ui-bizagi-wp-app-inbox-cases-container li:even"), function () {
                        $(this).addClass("ui-bizagi-wp-app-inbox-evenColor");
                    });

                    // Add click to view workflow
                    $(".ui-bizagi-wp-app-inbox-cases-ico-view", content).click(function () {

                        self.showGraphicQuery({ idCase: idCase, idWorkflow: idWorkflow });
                    });


                    //Work on it button
                    $(".workonitRow", content).button();

                    // Bind work on it button
                    $(".workonitRow", content).click(function () {
                        // Executes routing action
                        var idWorkItem = $(this).parent().find("#idWorkItem").val();
                        var referrerParams = {
                            taskState: self.params.taskState,
                            idWorkItem: idWorkItem,
                            idCase: self.idCase,
                            idTask: $(this).parent().find("#idTask").val(),
                            onlyFavorites: self.onlyFavorites,
                            idWorkflow: self.idWorkflow,
                            referrer: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX
                        }

                        $.extend(bizagi.referrerParams, bizagi.referrerParams, referrerParams);
                        self.publish("executeAction", {
                            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                            idCase: self.idCase,
                            idTask: $(this).parent().find("#idTask").val(),
                            idWorkItem: idWorkItem,
                            idWorkflow: idWorkflow //idWorkflow for graphic query bucause self.idworkflow is a wfClass
                        });
                    });

                    self.resizeLayout();
                    $(".scrollProcess").bizagiScrollbar();
                    $(".scrollSummary").bizagiScrollbar({
                        autohide: false
                    });
                });
    },
    /**
    * Load more cases when scroll controler reach button position
    */
    casesPagination: function (options) {
        var self = this;
        var content = self.getContent();
        var casesContainer = $("#contentCases", content);
        var listContainer = $("#contentCases .scrollCases ul", content);
        var def = new $.Deferred();

        // Update internal variable
        self.idWorkflow = options['idWorkflow'];
        self.page = options['page'] || 2;

        bizagi.showErrorAlertDialog = false;
        // Load cases by process and task state
        $.when(self.dataService.getCasesByWorkflow({
            idWorkflow: self.idWorkflow,
            taskState: self.taskState,
            page: self.page
        }))
                .done(function (data) {
                bizagi.showErrorAlertDialog = true;
                    data.processName = "";
                    // Get template
                    $.tmpl(self.casesTemplateList, data).appendTo(listContainer);

                    // Binds click handler for cases
                    $("li", casesContainer).click(function () {
                        var cAse = $(this);

                        // Remove all selected elements
                        $(".selected", casesContainer).removeClass("selected");

                        // Add selected class
                        cAse.addClass("selected");

                        // Change the current process
                        var idCase = $("#idCase", cAse).val();
                        var idWorkflow = $("#idWorkflowGQ", cAse).val();

                        self.changeCase(idCase, idWorkflow);
                    });

                    // Resolve deferred
                    def.resolve();
                }).fail(function (error) {
                    error = JSON.parse(error.responseText) || {};
                    var errorTemplate = self.workportalFacade.getTemplate("info-message");
                    var message = error.message || error;
                    var errorHtml = $.tmpl(errorTemplate, {
                        message: message
                    });

                    $('.ui-bizagi-error', errorHtml).width("50%");

                    errorHtml.appendTo(casesContainer);
                    def.resolve();
                });

        return def.promise();

    },
    /*
    *   When the window resizes, runs this method to adjust stuff in each controller or widget
    *   Override when needed
    */
    performResizeLayout: function () {
        var self = this;

        // Call base
        this._super();

        // Trigger render resize
        if (self.renderingFacade) {
            self.renderingFacade.resize({
                forceResize: true
            });
        }
    },
    /**
    *  Change total processes indicator, when start favorites view and user select or deselect
    *  favorite cases.
    *
    *  @param increment  {true || false }, true= increment +1 , false = decrement -1, default true.
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

                    //Remove title All processes on inbox
                    data.categories[bizagi.localization.getResource('workportal-widget-inbox-all-processes')].key = "";

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

            // Append javascript
            $('head', content).append("<script type='text/javascript' src='../../js/renderintegration.js'></script>");

            // Define theme
            cssLocation = cssLocation.replace("%theme%", (queryString["theme"] || theme));

            // Append css
            $('body', content).append("<link type='text/css' rel='stylesheet' href='" + cssLocation + "'>");
        });
    }
});
