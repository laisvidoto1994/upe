/*
*   Name: BizAgi Workportal CaseSummary Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*/

bizagi.workportal.webparts.webpart.extend("bizagi.workportal.webparts.caseSummary", {}, {
    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, initialParams) {
        var self = this;

        // Call base
        this._super(workportalFacade, dataService, initialParams);

        // Set listeners       
        this.subscribe("ui-bizagi-show-summary-first", function (e, params) { self.loadFirstCase(params); });

        this.subscribe("ui-bizagi-show-summary", function (e, params) { self.showSummary(params); });

        this.subscribe("ui-bizagi-show-render", function (e, params) {
            self.showSummary(params);
        });

        // Set listeners
        this.subscribe("ui-bizagi-reload-cases", function (e, params) { 
            self.showSummary(params);
        });

        //waitContainer
        this.waitContainer = initialParams.waitContainer;

        //renderBehavior
        this.renderBehavior = initialParams.renderBehavior;
        //renderPageUrl
        this.renderPageUrl = initialParams.renderPageUrl;
        this.adjustButtonsToContent = initialParams.adjustButtonsToContent;
		this.graphicQueryBehavior = initialParams.graphicQueryBehavior;


        var device = bizagi.detectRealDevice();
        this.responsiveView = (device.indexOf("tablet") >= 0 || device.indexOf("smartphone") >= 0 )? true : false;
    },
    /*
    *   Renders the content for the current controller
    */
    renderContent: function (params) {
        var self = this;

        var defer = new $.Deferred();
        if (params.idCase) {
            $.when(self.dataService.summaryCaseDetails({
                idCase: params.idCase
            }))
            .done(function (data) {
                params.data = data;
                params.data.hasGlobalFormFlag = (params.data.hasGlobalForm === "true");
                var template = self.getTemplate("caseSummary");
                data.responsiveView = self.responsiveView;
                data.idWorkflow = data.idWorkFlow;
                var content = self.content = $.tmpl(template, data);
                defer.resolve(content);

            }).fail(function (msg) {
                self.manageError(msg, defer);
            });
        }
        else {
            //Load first case for first load, deferred is necesary to webparts.webpart base function
            return self.loadFirstCaseWithDeferred(params);
        }
        return defer.promise();
    },
    /*
    *   Customize the web part in each device
    */
    postRender: function (params) {
        var self = this;
        var content = self.getContent();

        var subprocessCanvas = $("#subprocess", content);
        var assigneesCanvas = $("#assignees", content);
        var eventsCanvas = $("#events", content);
        var formCanvas = $("#form", content);

        if (params.data) {
            if (params.data.hasGlobalForm === "true") { self.postRenderForm($.extend(params, { canvas: formCanvas })) };
            if (params.data.showSubProcess) { self.postRenderSubprocess($.extend(params, { canvas: subprocessCanvas })); }
            if (params.data.showAssignees) { self.postRenderAssignees($.extend(params, { canvas: assigneesCanvas })); }
            if (params.data.showEvents) { self.postRenderEvents($.extend(params, { canvas: eventsCanvas })); }
        }

        $(".workonitRow", content).click(function (e) {
            e.stopPropagation();
            var buttom = $(this);
            params.title = $("h2", $(this).parent()).text();
            var idWorkItem = buttom.data("idworkitem");
            var idcase = buttom.parent().parent().parent().data("idcase");
            params.idWorkitem = idWorkItem;
            params.idCase = idcase;
            if (self.renderBehavior == "OtherPage") {
                window.open(self.renderPageUrl + "?type=activityForm&idWorkitem=" + params.idWorkitem + "&idCase=" + params.idCase);
            } else {
                self.publish("ui-bizagi-case-summary-workonit", params);
                self.displayRender(params);
            }
        });

        $(".parentProcessSummaryLink", content).click(function () {

            var parentProcesesData = $(this);
            params.idCase = parentProcesesData.data("idcase");
            params.idWorkitem = null;
            self.publish("ui-bizagi-case-summary-workonit", params);
            self.displayRender(params);
        });

        if(!self.responsiveView){
            $(".ui-bizagi-webpart-case-summary-details-tabs", content).tabs();
        }

        // In case popUp 
        if (self.adjustButtonsToContent) {
            self.resizeInPopUp();

            $(window).resize(function () {
                self.resizeInPopUp();
            });
        }


        // Add click to view workflow
        $(".ui-bizagi-wp-app-inbox-cases-graphical-view", content).click(function () {
            var idCase = $(this).data("idcase");
            var caseNumber = $(this).data("casenumber");
            var idWorkflow = $(this).data("workflowId");
			switch(self.graphicQueryBehavior) {
				case "PopUp":
					var webpartParams = $.extend({}, {
						idCase: idCase,
						caseNumber: caseNumber,
						fullScreen: true,
                        idWorkflow: idWorkflow
					}, {workportal: self.workportalFacade.workportal, isWebpartInIFrame: false});
					self.helper.displayWebPartPopUp("graphicquery", webpartParams);
					break;
				case"OtherPage":
					var baseUrl = "webpart.htm?type=graphicquery";
            var url = baseUrl + "&idCase=" + idCase + "&caseNumber=" + caseNumber;
            window.open(url);
					break;
			}
            return false;
        });


        self.endWaiting();
    },
    /*
    postrender Form
    */
    postRenderForm: function (params) {
        var self = this;
        params.context = "sharepoint";
        params.sharepointProxyPrefix = self.sharepointProxyPrefix || "";
        var rendering = new bizagi.rendering.facade(params);
        // Executes rendering into render container
        rendering.execute({
            canvas: params.canvas,
            summaryForm: true,
            idCase: params.idCase
        }).done(function (result) {
            self.sendDimensionsiFrame();
        });
    },
    /**
    *   postRender Subprocess
    */
    postRenderSubprocess: function (params) {
        var self = this;
        var content = self.getContent();
        var htmlContent = "";
        var localCanvas = params.canvas;

        $.when(self.dataService.summarySubProcess({
            idCase: params.idCase
        }))
        .done(function (data) {
            var template = self.getTemplate("subprocess");
            htmlContent = $.tmpl(template, data);
            $(".subProcessSummaryLink", htmlContent).click(function () {
                var subProcesesData = $(this);
                params.idCase = subProcesesData.data("idcase");
                params.idWorkitem = null;
                self.publish("ui-bizagi-case-summary-workonit", params);
                self.displayRender(params);
            });

            htmlContent.appendTo(localCanvas, content);
        });
    },
    /**
    *   postRender Assignees
    */
    postRenderAssignees: function (params) {
        var self = this;
        var content = self.getContent();
        var htmlContent = "";
        var localCanvas = params.canvas;

        $.when(self.dataService.summaryAssigness({
            idCase: params.idCase
        }))
        .done(function (data) {
            var template = self.getTemplate("assignees");
            htmlContent = $.tmpl(template, data);
            htmlContent.appendTo(localCanvas, content);
        });
    },
    /**
    *   postRender Events
    */
    postRenderEvents: function (params) {
        var self = this;
        var content = self.getContent();
        var htmlContent = "";
        var localCanvas = params.canvas;

        $.when(self.dataService.summaryCaseEvents({
            idCase: params.idCase
        }))
        .done(function (data) {
            var template = self.getTemplate("events");
            htmlContent = $.tmpl(template, data);
            htmlContent.appendTo(localCanvas, content);

            $(".eventSummaryLink", htmlContent).click(function () {
                var eventData = $(this);
                params.idCase = eventData.data("idcase");
                params.idWorkitem = eventData.data("idworkitem");
                params.idTask = eventData.data("idtask");
                params.eventAsTasks = eventData.data("eventastasks");
                self.publish("ui-bizagi-case-summary-workonit", params);
                self.displayRender(params);
            });

        });
    },

    displayRender: function (params) {
        //Define Render Behavior
        var self = this;
        var title = params.title || "";
        switch (self.renderBehavior) {
            case "OtherWebPartThisPage":
                // Publish the event so any other webpart could react to that
                self.helper.publishShowRenderEvent("ui-bizagi-show-render", self, { idWorkitem: params.idWorkitem, idCase: params.idCase });
                break;
            case "OtherPage":
                if (self.isWebpartInIFrame) {
                    window.parent.location.href = self.renderPageUrl + "?idWorkitem=" + params.idWorkitem + "&idCase=" + params.idCase;
                }
                else {
                    window.location.href = self.renderPageUrl + "?idWorkitem=" + params.idWorkitem + "&idCase=" + params.idCase;
                }
                break;
            case "PopUp":

                var webpartParams = $.extend({}, params, {
                    idWorkitem: params.idWorkitem,
                    idCase: params.idCase,
                    workportal: self.workportalFacade.workportal
                });
                if (bizagi.sharepointContext) {
                    //params.sharepointProxyPrefix solo es valido en el contexto de SharePoint
                    var pathiFrame = params.sharepointProxyPrefix.substring(params.sharepointProxyPrefix.indexOf("http"), params.sharepointProxyPrefix.length);
                    webpartParams.pathiFrame = pathiFrame;
                    //webpartParams.remoteServer = remoteServer;
                    self.helper.displayWebPartPopUpinIFrame("renderComplete", webpartParams, function (e, params) { self.showCases(self.params); });
                }
                else {
                    if (typeof (self.postmessageSocket) == "undefined") {
                        var page = self.renderPageUrl + "?type=render&idCase=" + params.idCase + "&idWorkitem=" + params.idWorkitem;
                        var $dialog = $('<div></div>')
                                       .html('<iframe style="border: 0px; " src="' + page + '" width="100%" height="100%"></iframe>')
                                       .dialog({
                                           autoOpen: false,
                                           modal: true,
                                           height: 625,
                                           width: '100%',
                                           title: title
                                       });
                        $dialog.dialog('open');
                    }
                    else if (self.isWebpartInIFrame) {
                        webpartParams.pathiFrame = window.location.href.substring(0, window.location.href.indexOf("jquery"));
                        self.helper.displayWebPartPopUpExternalIframe("renderComplete", webpartParams, function (e, params) { self.showCases(self.params); }, self.postmessageSocket);
                    } else {
                        self.helper.displayWebPartPopUp("renderComplete", webpartParams, function (e, params) { self.closePopUp(self.params); });
                    }
                }
                break;
        }
    },
    showCases: function (params) {
        var self = this;
        self.publish("ui-bizagi-show-cases", params);
        self.publish("ui-bizagi-show-processes", params);
    },
    /*
    *   View Case Summary
    */
    showSummary: function (params) {
        var self = this;
        self.helper.addWaitContainer(self.waitContainer);
        self.refresh(params);
    },
    /*
    *   View first case in load Page
    */
    loadFirstCaseWithDeferred: function (params) {
        var self = this;
        var defer = new $.Deferred();
        $.when(self.dataService.getCustomizedColumnsData({
            idWorkflow: params.idWorkflow
        })).done(function (data) {
            if (data.cases.rows.length > 0) {
                var caseNumber = data.cases.rows[0].id;
                params.idCase = caseNumber;
                $.when(self.renderContent(params)).done(function () {
                    var a = self.getContent();
                    defer.resolve(a);
                });
            }
            else {
                defer.resolve("<div class='wp-empty-data'>No cases</div>");
            }
        }).fail(function (msg) {
            self.manageError(msg, defer);
        });
        return defer.promise();
    },
    loadFirstCase: function (params) {
        var self = this;
        $.when(self.dataService.getCustomizedColumnsData({
            idWorkflow: params.idWorkflow
        })).done(function (data) {
            if (data.cases.rows.length > 0) {
                var caseNumber = data.cases.rows[0].id;
                params.idCase = caseNumber;
                self.refresh(params);
            }
        }).fail(function (msg) {
            self.manageError(msg, null);
        });
    },
    emptyCaseSummaryForm: function (params) {
        // Clear content
        this.content.empty();
    },
    resizeInPopUp: function () {
        var self = this;
        var content = self.getContent();
        var heightActivitiFormContainer = $(".activitiFormContainer").height() || 0;
        var renderForm = $(".ui-bizagi-webpart-case-summary-workitems", content);
        renderForm.css('overflow-y', 'auto');
        renderForm.height(heightActivitiFormContainer - 48);
    },
    destroy: function () {
        var self = this;

        self.unsubscribe("ui-bizagi-show-summary-first");
        self.unsubscribe("ui-bizagi-show-summary");
    }
});

