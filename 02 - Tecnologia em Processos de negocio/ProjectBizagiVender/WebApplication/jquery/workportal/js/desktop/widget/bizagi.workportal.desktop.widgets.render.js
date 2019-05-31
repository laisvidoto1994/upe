/*
 *   Name: BizAgi Workportal Desktop Routing Widget Controller
 *   Author: Diego Parra (based on Edward Morales version)
 *   Comments:
 *   -   This script will provide desktop overrides to implement the routing widget
 */

// Auto extend
bizagi.workportal.widgets.render.extend("bizagi.workportal.widgets.render", {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "release": bizagi.getTemplate("bizagi.workportal.desktop.widget.render").concat("#bz-wp-widget-release"),
            "inbox-common-case-summary-subprocess": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description-subprocess"),
            "inbox-common-case-summary-assignees": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description-assignees"),
            "inbox-common-case-summary-events": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description-events"),
            "inbox-common-case-summary-activities": bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common").concat("#ui-bizagi-workportal-widget-inbox-common-case-description-activities"),
            "render-case-summary": bizagi.getTemplate("bizagi.workportal.desktop.widget.render").concat("#ui-bizagi-workportal-widget-render-case-description"),
            useNewEngine: false
        });
    },

    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function() {
        var self = this;

        // Set sub-templates		
        self.caseSummaryTemplate = self.getTemplate("render-case-summary");
        self.caseSummaryTemplateSubprocess = self.getTemplate("inbox-common-case-summary-subprocess");
        self.caseSummaryTemplateAssigness = self.getTemplate("inbox-common-case-summary-assignees");
        self.caseSummaryTemplateActivities = self.getTemplate("inbox-common-case-summary-activities");
        self.caseSummaryTemplateEvents = self.getTemplate("inbox-common-case-summary-events");
        self.paginationTemplate = self.workportalFacade.getTemplate("inbox-common-pagination-inbox");

        var result = self._super();
        return result;
    },

    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;
        var content = self.getContent();

        self.params.referrerParams = self.params.referrerParams || {};

        // Set instance variables
        self.summaryDisplayed = true;

        // Set scrollbars
        $("#ui-bizagi-wp-app-render-desc-panel", content).bizagiScrollbar();
        $(".scrollRender", content).bizagiScrollbar({
            autohide: false
        });

        // Attach panel slide event
        self.configureSlider();

        // Configure header buttons
        self.configureHeader();

        // Resize layout
        self.resizeLayout();


        //self.renderSummaryTab.scrollabletab();
        // jQuery-ui tabs
        window.setTimeout(function() {
            if (!bizagi.util.identicalObjects($("#ui-bizagi-details-tabs", content).find('.ui-tabs-nav').offset(), { top: 0, left: 0 })) {
                $("#ui-bizagi-details-tabs", content).tabs().scrollabletab({
                    tooltipNext: self.getResource("workportal-scrollabletab-nex"),
                    tooltipPrevious: self.getResource("workportal-scrollabletab-prev")
                });
            }

        }, 500);

        // Add click to view workflow
        $(".ui-bizagi-wp-app-inbox-cases-ico-view", content).click(function () {
            self.showGraphicQuery({ idCase: self.params.idCase, idWorkflow: self.params.idWorkflow })
        });

        // Bind navigation bar
        // Set idcase data
        $(".back", content).data("idCase", self.getBackCase());
        $(".next", content).data("idCase", self.getNextCase());

        // Bind for click event on back and next botton
        $(".back, .next", content).click(function () {
            var idCase = $(this).data("idCase");
            if (idCase > 0) {
                self.publish("executeAction", {
                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                    idCase: idCase
                });
            }
        });

        // Bind for click event on refresh botton
        $(".refresh", content).click(function () {
            var options = {
                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                idCase: self.params.idCase,
                idTask: self.params.idTask,
                idWorkflow: self.params.idWorkflow,
                idWorkItem: self.params.idWorkitem,
                referrer: self.params.referrer || "inboxGrid"
            };

            self.publish("executeAction", options);
        });

        // Bind for click event on return botton
        $(".ui-bizagi-wp-app-inbox-bt-back, #innerContentInbox h2", content).click(function () {
            if (bizagi)
                if (bizagi.referrerParams)
                    var widget = bizagi.referrerParams.referrer || bizagi.cookie('bizagiDefaultWidget');
            if (widget == "queryform") widget = bizagi.workportal.currentInboxView || "inboxGrid";
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
                            data.urlParameters = bizagi.referrerParams.urlParameters;

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
                default:
                    self.publish("changeWidget", {
                        widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID,
                        restoreStatus: true
                    });
                    break;
            }
        });

        // Bind for hover event on refresh and return botton
        $(".refresh,.return", content).hover(function () {
            $(this).addClass("active");
        }, function () {
            $(this).removeClass("active");
        });

        // Bind for hover event on next and back botton
        $(".next,.back", content).hover(
            function () {
                if ($(this).data("idCase") > 0) {
                    $(this).addClass("active");
                }
            },
            function () {
                $(this).removeClass("active");
            });

        if (self.dataService.lastQueryFullKey != null) {
            $("#bt-case-action-showquery", content).click(function () {
                self.publish("showDialogWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERYFORM,
                    queryFormAction: "loadPrevious"
                });

            });
        }

        // Bind botton summary actions
        $("#bt-case-action-log", content).click(function () {

            self.publish("showDialogWidget", {
                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ACTIVITY_LOG,
                data: { "idCase": self.params.idCase, "idWorkflow": self.params.idWorkflow },
                modalParameters: {
                    title: bizagi.localization.getResource("render-actions-log")
                }
            });

        });

        $("#bt-case-action-reassing", content).click(function () {
            var idCase = self.params.idCase;
            var idWorkItem = self.params.idWorkitem;
            var idtask = self.params.idtask;
           $.when(self.publish("showDialogWidget", {
                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REASSIGN_CASE,
                data: { "idCase": idCase,
                    "idWorkItem": idWorkItem
                },
                closeVisible: false,
                maximize: true,
                modalParameters: {
                    title: bizagi.localization.getResource("render-actions-reassign"),
                    width: "910px",
                    id: "CaseAdmin"
                }
            }));



        });

        $("#bt-case-action-release", content).click(function (e) {
            e.stopPropagation();
            var releaseConfirmTemplate = self.getTemplate("release");
            var confirmContent = $.tmpl(releaseConfirmTemplate);

            // Open dialog with confirm message
            $(confirmContent).dialog({
                resizable: false,
                modal: true,
                title: self.getResource("render-actions-release"),
                buttons: [
                    {
                        text: self.getResource("workportal-widget-dialog-box-release-ok"),
                        click: function () {
                            var params = {
                                idCase: self.params.idCase,
                                idWorkItem: self.params.idWorkitem
                            };
                            $.when(self.dataService.releaseActivity(params)).done(function (data) {
                                var status = data.status ? data.status : '';
                                switch (status) {
                                    case "Success":
                                        //go to inbox
                                        self.publish("changeWidget", {
                                            widgetName: bizagi.workportal.currentInboxView
                                        });
                                        break;

                                    case "ConfigurationError":
                                        var message = self.getResource("workportal-widget-dialog-box-release-configuration-error-message").replace("{0}", params.idWorkItem);
                                        bizagi.showMessageBox(message, self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                                        break;

                                    default:
                                        var message = self.getResource("workportal-widget-dialog-box-release-error-message").replace("{0}", params.idWorkItem);
                                        bizagi.showMessageBox(message, self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                                        break;
                                }
                            }).fail(function () {
                                var message = self.getResource("workportal-widget-dialog-box-release-error-message").replace("{0}", params.idWorkItem);
                                bizagi.showMessageBox(message, self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                            }
                            );
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: self.getResource("workportal-widget-dialog-box-release-cancel"),
                        click: function () {
                            $(this).dialog("close");
                        }
                    }
                ]
            });
        });



        self.printFormCommand = new bizagi.workportal.command.printform(self.workportalFacade);

        $("#bt-case-action-print", content).click(function () {

            var printParams = { idCase: self.params.idCase,
                idWorkitem: self.params.idWorkitem,
                idTask: self.params.idTask
            };

            self.printFormCommand.print(printParams);

        });

        $("#bt-case-action-help", content).click(function () {
            var url = $(this).find("#helpUrl").val();

            self.publish("showDialogWidget", {
                widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
                widgetURL: url,
                modalParameters: {
                    title: bizagi.localization.getResource("render-actions-help")
                }
            });
        });
    },
    /*
    *   configures the slide event
    */
    configureSlider: function () {
        var self = this;
        var content = self.getContent();
        if (!content) {
            return;
        }

        var summaryContainer = self.getComponentContainer("summary");
        var sliderPanel = $("#panelArrowContainer", content);

        sliderPanel.click(function () {
            if (summaryContainer.is(":visible")) {
                // Hide left panel
                self.hideSummary();

            } else {
                // Show left panel
                self.showSummary();
            }
        });
    },
    /*
    *   Hides the summary component
    */
    hideSummary: function (animate) {
        var self = this;
        var content = self.getContent();
        if (!content) {
            return;
        }

        var summaryContainer = self.getComponentContainer("summary");
        var renderPanel = $("#ui-bizagi-wp-app-render-form", content);
        var sliderPanel = $("#panelArrowContainer", content);
        var panelArrow = $("#panelArrow", content);
        animate = typeof (animate) !== "undefined" ? animate : false;

        if (!self.summaryDisplayed) {
            return;
        }

        if (animate) {
            // Hide description panel
            summaryContainer.parent().hide('drop', {}, 300);

            // Run animation
            $.when(sliderPanel.animate({
                left: "0px"
            }, 300))
                .done(function () {
                    renderPanel.addClass("ui-bizagi-state-extended");
                    $("#ui-bizagi-wp-app-render-form-content", content).css("padding-left", "0px");
                });

        } else {
            // Hide description panel
            summaryContainer.parent().hide();
            sliderPanel.css("left", "0px");
            renderPanel.addClass("ui-bizagi-state-extended");
            $("#ui-bizagi-wp-app-render-form-content", content).css("padding-left", "0px");
        }

        // Change arrows
        panelArrow.removeClass("panelArrowLeft");
        panelArrow.addClass("panelArrowRight");

        // Turn off flag
        self.summaryDisplayed = false;

        // Trigger render resize
        if (self.renderingFacade) {
            self.renderingFacade.resize({
                forceResize: true
            });
        }
    },
    /*
    *   Show the summary component
    */
    showSummary: function (animate) {
        var self = this;
        var content = self.getContent();
        if (!content) {
            return;
        }

        var summaryContainer = self.getComponentContainer("summary");
        var renderPanel = $("#ui-bizagi-wp-app-render-form", content);
        var sliderPanel = $("#panelArrowContainer", content);
        var panelArrow = $("#panelArrow", content);
        animate = typeof (animate) !== "undefined" ? animate : false;

        if (self.summaryDisplayed) {
            return;
        }

        // Show description panel
        summaryContainer.parent().show();
        $("#ui-bizagi-wp-app-render-form-content", content).css("padding-left", "380px");
        sliderPanel.css("left", "380px");
        renderPanel.removeClass("ui-bizagi-state-extended");

        // Change arrows
        panelArrow.removeClass("panelArrowRight");
        panelArrow.addClass("panelArrowLeft");

        // Turn on flag
        self.summaryDisplayed = true;


        // jQuery-ui tabs scrollable
        if (!($("#ui-bizagi-details-tabs", content).closest("#stTabswrapper").length > 0)) {
            $("#ui-bizagi-details-tabs", content).tabs().scrollabletab({
                tooltipNext: self.getResource("workportal-scrollabletab-nex"),
                tooltipPrevious: self.getResource("workportal-scrollabletab-prev")
            });
        }

        // Trigger render resize
        if (self.renderingFacade) {
            self.renderingFacade.resize({
                forceResize: true
            });
        }

    },
    /*
    *   Configure header for the widget
    */
    configureHeader: function () {
        var self = this;
        var content = self.getContent();

        // Configure back button
        //        $("#ui-bizagi-wp-app-inbox-bt-back", content).click(function() {
        //            self.publish("changeWidget", {
        //                widgetName: bizagi.workportal.currentInboxView
        //            });
        //        });
    },
    /*
    *   When the window resizes, runs this method to adjust stuff in each controller or widget
    *   Override when needed
    */
    performResizeLayout: function () {
        var self = this;
        var windowWidth = $(window).width();

        // Call base
        this._super();

        // If window width is less or equals 1366 hide the summary
        if (windowWidth <= 1366) {
            if (self.summaryDisplayed) {
                self.hideSummary(false);
            } else {
                // Trigger render resize
                if (self.renderingFacade) {
                    self.renderingFacade.resize({
                        forceResize: true
                    });
                }
            }

        } else {
            if (!self.summaryDisplayed) {
                self.showSummary(false);
            }
            else {
                // Trigger render resize
                if (self.renderingFacade) {
                    self.renderingFacade.resize({
                        forceResize: true
                    });
                }
            }
        }
    },
    /*
    *   Opens the workportal old form in a window
    */
    openOldWorkportalForm: function () {
        var self = this;
        //var url = BIZAGI_PATH_TO_BASE + "defaulthtml.aspx?FrameURL=App/ListaDetalle/Detalle.aspx?idCase=" + self.params.idCase;
        var url = BIZAGI_PATH_TO_BASE + "App/ListaDetalle/Detalle.aspx?PostBack=1&idCase=" + self.params.idCase;
        if (typeof (self.params.idWorkitem) != 'undefined') {
            url = url + "&idWorkitem=" + self.params.idWorkitem;
        }
        if (typeof (self.params.idTask) != 'undefined') {
            url = url + "&idTask=" + self.params.idTask;
        }
        if (false) {
            url = url + "&isSummary=1";

        }

        alert(url);
        window.open(url, "oldStyleBizAgi", "width=1024,height=768, Menubar=NO, Location=NO, Status=NO");
    },
    /*
    *  Navigation options
    */
    getListKey: function () {
        var self = this;
        bizagi.lstIdCases = bizagi.lstIdCases || {};
        if (bizagi.lstIdCases.length > 1) {
            for (var i = 0; i < bizagi.lstIdCases.length; i++) {
                if (self.params.idCase == bizagi.lstIdCases[i]) {
                    return i;
                }
            }
        }
        return -1;
    },
    getNextCase: function () {
        var self = this;
        var nextIdCase = 0;
        var key = self.getListKey();

        // Check if last element
        if (bizagi.lstIdCases.length == (key + 1) || bizagi.lstIdCases.length == 1) {
            nextIdCase = -1;
        } else {
            nextIdCase = bizagi.lstIdCases[key + 1];
        }

        return nextIdCase;
    },
    getBackCase: function () {
        var self = this;
        var prevIdCase = 0;
        var key = self.getListKey();

        // Check if first element
        if (key == 0) {
            prevIdCase = -1;
        } else {
            prevIdCase = bizagi.lstIdCases[key - 1] || -1;
        }

        return prevIdCase;
    }
});

