/*
 *   Name: BizAgi Workportal Tablet Render Widget Controller
 *   Author: Andres Valencia 
 *   Comments: Provide tablet overrides to implement the render widget   
 */

// Auto extend
bizagi.workportal.widgets.render.extend('bizagi.workportal.widgets.render', {}, {

    /*
    *   Constructor
    */
    init: function(workportalFacade, dataService, params) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, params);

        // Set sub-templates		
        self.caseSummaryTemplate = self.workportalFacade.getTemplate("render-case-summary");
        self.caseSummaryTemplateSubprocess = self.workportalFacade.getTemplate("inbox-common-case-summary-subprocess");
        self.caseSummaryTemplateAssigness = self.workportalFacade.getTemplate("inbox-common-case-summary-assignees");
        self.caseSummaryTemplateActivities = self.workportalFacade.getTemplate("inbox-common-case-summary-activities");
        self.caseSummaryTemplateEvents = self.workportalFacade.getTemplate("inbox-common-case-summary-events");
        self.paginationTemplate = self.workportalFacade.getTemplate("inbox-common-pagination-inbox");
    },

    /*
    *   Renders the form component of the widget
    */
    renderForm: function (params) {
        var self = this, resultRender;

        if (!params.withOutGlobalForm) {
            return self._super(params);
        } else {
            var errorTemplate = self.workportalFacade.getTemplate("info-message");
            var message = (params.messageForm !== "") ? params.messageForm : self.resources.getResource("render-without-globalform");

            if (typeof self.params != "undefined" && typeof self.params.isOfflineForm !== "undefined" && self.params.isOfflineForm == true) {
                message = self.resources.getResource("render-without-globalform-offline");
            }
            var errorHtml = $.tmpl(errorTemplate, {
                message: message
            });
            errorHtml.appendTo(self.getComponentContainer("render"));
            $(".ui-bizagi-info-message-button", errorHtml).click(function () {
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.currentInboxView,
                    inputtray: bizagi.util.getItemLocalStorage("inputtray")
                });
                self.publish("toggleProcessesColumn", {
                    show: true
                });
            });

            resultRender = $.Deferred();
            resultRender.fail();
        }

        self.resizeLayout();

        return resultRender;
    },

    /*  RENDER CONTENT OVERRIDE
    ==================================================*/
    renderContent: function() {
        var self = this;

        // This is for ABENGOA iPAD
        // Check if this is going to draw the global form, and redirect it to the iPad
        if (!bizagi.util.isEmpty(self.params.idCase) && bizagi.util.isEmpty(self.params.idWorkitem)
            && (typeof(bizagi.referrerParams) !== "undefined" && !bizagi.referrerParams.requestGlobalForm)) {

            // Only apply redirection if the idCase is not found in the querystring, so we can allow global form views from full urls with widget and idCase params (used in ABENGOA userfields)
            if (bizagi.util.getQueryString() == null || bizagi.util.getQueryString().idCase == null
                || bizagi.util.getQueryString().idCase === 0) {
                self.changeWidget(bizagi.workportal.currentInboxView);

                var errorTemplate = self.workportalFacade.getTemplate("info-message");
                var message = self.resources.getResource("render-without-globalform");
                var errorHtml = $.tmpl(errorTemplate, {
                    message: message
                });
                $("#summary-column .scroll-content", self.getComponentSelector("workarea")).append(errorHtml);
                return null;
            }
        }

        var result = self._super();
        return result;
    },

    /* POST RENDER ACTIONS
    =================================================*/
    postRender: function () {

        var self = this;
        var context = self.getContent();

        // Delegate click on render column toggler
        $('.render-form .column-footbar', context).delegate('#render-column-slider', 'click', function (e) {
            e.preventDefault();

            // Toggle class to see form in full screen
            $('#contentFramework').toggleClass('hide-case-summary');
        });

        $("#bt-case-action-release", context).click(function (e) {
            var buttons = [{ 'label': self.getResource("workportal-widget-dialog-box-release-ok"), 'action': 'resolve' }, { 'label': self.getResource("workportal-widget-dialog-box-release-cancel")}];
            $.when(bizagi.showConfirmationBox(self.getResource("workportal-widget-dialog-box-release"), self.getResource("render-actions-release"), '', buttons)).done(function () {
                bizagi.util.smartphone.startLoading();
                $.when(self.dataService.releaseActivity({
                    idCase: self.params.idCase,
                    idWorkItem: self.params.idWorkitem
                })).done(function (data) {
                    var status = (data && data.status) ? data.status : 'Error';
                    switch (status) {
                        case "Success":
                            self.publish("changeWidget", {
                                widgetName: bizagi.workportal.currentInboxView
                            });
                            break;
                        case "ConfigurationError":
                            bizagi.showMessageBox(self.getResource("workportal-widget-dialog-box-release-configuration-error-message").replace("{0}", params.idWorkitem), self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                            break;
                        case "Error":
                        default:
                            bizagi.showMessageBox(self.getResource("workportal-widget-dialog-box-release-error-message").replace("{0}", params.idWorkitem), self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                            break;
                    }
                    bizagi.util.smartphone.stopLoading();
                }).fail(function () {
                    var message = self.getResource("workportal-widget-dialog-box-release-error-message").replace("{0}", params.idWorkitem);
                    bizagi.showMessageBox(message, self.getResource("workportal-widget-dialog-box-release-error"), 'error', false);
                    bizagi.util.smartphone.stopLoading();
                });
            });
        });
    },

    showMenuComplexGateway: function (transitions) {
        var self = this;

        if (bizagi.cache === undefined) {
            bizagi.cache = {};
        }
        bizagi.cache[self.params.idCase] = {
            idTask: self.params.idTask,
            idWorkitem: self.params.idWorkitem,
            isComplex: true
        };
        if (bizagi.cache.idCaseObject === undefined) {
            bizagi.cache.idCaseObject = {};
        }
        bizagi.cache.idCaseObject.idCase = self.params.idCase;
        bizagi.cache.idCaseObject.isComplex = true;

        self.currentPopup = "complexgateway";
        self.publish("popupWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_COMPLEXGATEWAY,
            options: {
                transitions: transitions,
                sourceElement: ".ui-bizagi-form",
                insertAfter: ".ui-bizagi-form .ui-bizagi-button-container",
                height: 'auto',
                offset: "8 0", //x y
                activeScroll: false,
                dontClose: true,
                closed: function () {
                    self.currentPopup = null;
                }
            }
        });
    },

    renderSummary: function (data) {
        var self = this;
        var content = self.getContent();
        var cache = {};
        var htmlContent = "";
        var security = new bizagi.workportal.command.security(self.dataService);

        data.showComments = true;
        data.printableVersion = security.checkSecurityPerm("PrintableVersion");
        data.stateLog = security.checkSecurityPerm("StateLog");

        if (data.isOfflineForm) {
            data.caseNumber = data.caseNumber || data.idCase;
        }

        var summary = $.tmpl(self.caseSummaryTemplate, data).appendTo(self.getComponentContainer("summary"));

        // Format invariant dates
        bizagi.util.formatInvariantDate(content, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));


        // Delegate events for parent process
        $("#details", summary).delegate(".summaryLink", "click", function () {
            self.routingExecute($(this));
        });

        // jQuery-ui tabs
        $("#ui-bizagi-details-tabs", content).tabs({
            activate: function (event, ui) {
                var panel = (ui == undefined) ? 'formSummary' : ui.newPanel.selector.replace("#", "");
                switch (panel) {
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

                            htmlContent = $.tmpl(self.caseSummaryTemplateActivities, activities);
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


    }
});
