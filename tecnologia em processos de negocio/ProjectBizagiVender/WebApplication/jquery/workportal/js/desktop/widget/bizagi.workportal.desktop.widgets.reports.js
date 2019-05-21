/*
*   Name: BizAgi Workportal Desktop Reports Widget Controller
*   Author: Edward Morales
*   Comments:
*   -   This script will provide desktop overrides to implement reports widget
*/

// Auto extend
bizagi.workportal.widgets.reports.extend("bizagi.workportal.widgets.reports", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "reports": bizagi.getTemplate("bizagi.workportal.desktop.widget.reports").concat("#ui-bizagi-workportal-widget-reports"),
            "reports-elements": bizagi.getTemplate("bizagi.workportal.desktop.widget.reports").concat("#ui-bizagi-workportal-widget-reports-elements"),
            "reports-empty-elements": bizagi.getTemplate("bizagi.workportal.desktop.widget.reports").concat("#ui-bizagi-workportal-widget-reports-empty-elements"),
            "reports-query-tree": bizagi.getTemplate("bizagi.workportal.desktop.widget.reports").concat("#ui-bizagi-workportal-widget-reports-query-tree"),
            "reports-query-confirm": bizagi.getTemplate("bizagi.workportal.desktop.widget.reports").concat("#ui-bizagi-workportal-widget-reports-confirm"),
            "reports-query-edit": bizagi.getTemplate("bizagi.workportal.desktop.widget.reports").concat("#ui-bizagi-workportal-widget-reports-edit"),
            useNewEngine: false
        });
    },

    /**
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;

        // Set bind event for last element
        self.configureTreeNavigation();

        // Bind back button
        self.configureBackButton();

        // Render base categories
        self.renderReports();

        // set vertical scroll
        self.scrollVertical({
            "autohide": false
        });

        //self.getSubMenuData(self.jsonSecurityList,"AnalysisReports")
    },

    /**
    * Get all categories of reports
    * @param integer idElement
    * @return
    */
    getReports: function (params) {
        var self = this;
        var def = new $.Deferred();
        var idElement = params.idElement || 0;

        $.when(self.getAnalisysQueries())
		.done(function (data) {
		    var reports = [];
		    var childsBam = [];
		    var childsAnalytics = [];
		    /*
		    *"BAMTask",
		    "AnalyticsProcess",
		    "AnalyticsTask",
		    "AnalyticsSensor",
		    "AnalysisQueries"
		    *
		    **/
		    // Check Menu security

		    if (bizagi.menuSecurity.BAMProcess) {
		        childsBam.push({
		            idElement: 2,
		            displayName: self.resources.getResource('workportal-menu-submenu-BAMProcess'),
		            icon: "BAMProcess",
		            endPoint: "BAMProcess",
		            childs: []
		        });
		    }

		    if (bizagi.menuSecurity.BAMTask) {
		        childsBam.push({
		            idElement: 3,
		            displayName: self.resources.getResource('workportal-menu-submenu-BAMTask'),
		            icon: "BAMTask",
		            endPoint: "BAMTask",
		            childs: []
		        });
		    }

		    if (bizagi.menuSecurity.BAMResourceMonitor) {
		        childsBam.push({
		            idElement: 4,
		            displayName: self.resources.getResource('workportal-menu-submenu-BAMResourceMonitor'),
		            icon: "BAMResourceMonitor",
		            endPoint: "ResourceBAM",
		            childs: []
		        });
		    }


		    if (childsBam.length > 0) {
		        reports.push({
		            idElement: 1,
		            displayName: self.resources.getResource('workportal-menu-submenu-BAMMenu'),
		            icon: "",
		            endPoint: "",
		            childs: childsBam
		        });
		    }


		    if (bizagi.menuSecurity.AnalyticsProcess) {
		        childsAnalytics.push({
		            idElement: 11,
		            displayName: self.resources.getResource('workportal-menu-submenu-AnalyticsProcess'),
		            icon: "AnalyticsProcess",
		            endPoint: "AnalyticsProcess",
		            childs: []
		        });
		    }

		    if (bizagi.menuSecurity.AnalyticsTask) {
		        childsAnalytics.push({
		            idElement: 12,
		            displayName: self.resources.getResource('workportal-menu-submenu-AnalyticsTask'),
		            icon: "AnalyticsTask",
		            endPoint: "AnalyticsTask",
		            childs: []
		        });
		    }

		    if (childsAnalytics.length > 0) {
		        reports.push({
		            idElement: 10,
		            displayName: self.resources.getResource('workportal-menu-submenu-AnalyticsMenu'),
		            icon: "",
		            endPoint: "",
		            childs: childsAnalytics
		        });
		    }

		    if (bizagi.menuSecurity.AnalyticsSensor) {
		        reports.push({
		            idElement: 13,
		            displayName: self.resources.getResource('workportal-menu-submenu-AnalyticsSensor'),
		            icon: "AnalyticsSensor",
		            endPoint: "AnalyticsSensor",
		            childs: []
		        });
		    }

		    if (bizagi.menuSecurity.AnalysisQueries && (data.length > 0)) {
		        reports.push({
		            idElement: 20,
		            displayName: self.resources.getResource('workportal-menu-submenu-AnalysisQueries'),
		            icon: "",
		            endPoint: "",
		            childs: data
		        });
		    }

		    var getReportsById = function (idElement, reports) {
		        var result;
		        if (idElement) {
		            $.each(reports, function (key, value) {
		                if (typeof result == "undefined") {
		                    if (value.idElement == idElement) {
		                        result = value.childs;
		                    } else {
		                        return getReportsById(idElement, value.childs);
		                    }
		                }
		            });
		        } else {
		            result = reports;
		        }
		        return result || {};
		    };
		    def.resolve(getReportsById(idElement, reports));
		});
        return def.promise();

    },



    /**
    * Get getAnalisysQueries service and parse json to
    * create tree categories
    * 
    * @return json
    */
    getAnalisysQueries: function () {
        var self = this;
        var finalJson = [];
        var idElement = 100;
        var def = new $.Deferred();

        $.when(
			self.dataService.getAnalisysQueries()
			).done(function (data) {
			    $.each(data.queries, function (key, value) {
			        finalJson.push({
			            idElement: idElement++,
			            displayName: value.name || "",
			            icon: "",
			            endPoint: value.reportSet,
			            extraArgs: "?idUserQuery=" + value.idQuery,
			            activeEdit: true,
			            description: value.description,
			            idQuery: value.idQuery,
			            childs: []
			        });
			    });
			    def.resolve(finalJson);
			});

        return def.promise();

    },

    /**
    * Render List categories for each idCategory
    */
    renderReports: function (idParentQuery, appendElement) {
        var self = this;
        var content = self.getContent();
        var template = self.getTemplate("reports-elements");
        var emptyTemplate = self.getTemplate("reports-empty-elements");
        var reportsContainer = $("#reports", content);
        var queryContent;
        var mergeData;

        $.when(
			self.getReports({
			    idElement: idParentQuery
			})
			).done(function (data) {

			    reportsContainer.empty();

			    // check if service have nodes
			    data = data || {};
			    if (data.length >= 1) {
			        // Check if have appendElement
			        if (appendElement != undefined) {
			            mergeData = $.merge(appendElement, data);
			        } else {
			            mergeData = data;
			        }

			        queryContent = $.tmpl(template, {
			            nodes: mergeData,
			            idParentQuery: idParentQuery
			        }, {
			            checkChildNode: self.checkChildNode
			        });
			    } else {
			        queryContent = $.tmpl(emptyTemplate, {
			            nodes: mergeData,
			            idParentQuery: idParentQuery
			        });
			    }
			    queryContent.appendTo(reportsContainer);

			    // set actions to rendered html 
			    self.configureNavTree(reportsContainer);
			});
    },

    /*
    *   Get the page hacks in order to work properly in each case
    */
    jsInjection: function (url, title) {
        var self = this;
        var callback;
        var hackParams = {
            title: title
        };

        callback = function (params) {
            // This script will execute inside the iframe context

            this.openModalWindow = function (sUrl, dialogWidth, dialogHeight, buttonArray, resizeable) {

                //Instance dialog
                var doc = this.ownerDocument;
                var callBackOpenCase = function (params) {
                    this.openBACase = function (idCase, sHref) {
                        // close parent window
                        params.bizagi.workportal.desktop.popup.closePopupInstance();
                        params.controller.publish("closeCurrentDialog");

                        var workitem = null;
                        if (sHref.indexOf("idWorkitem=") > -1) {
                            workitem = sHref.substring(sHref.indexOf("idWorkitem=") + 11);
                            workitem = workitem.substring(0, workitem.indexOf("&"));
                        }
                        // Executes the act on
                        params.controller.publish("executeAction", {
                            action: params.routingAction,
                            idCase: idCase,
                            idWorkItem: workitem
                        });

                        // close dialog
                        params.controller.publish("closeCurrentDialog");
                    };
                    this.buttonCancel_onclick = function () {
                        params.controller.publish("closeCurrentDialog");
                    };
                    this.CloseParentDialog = function () {
                        params.controller.publish("closeCurrentDialog");
                    };
                };
                params.controller.publish("showDialogWidget", {
                    widgetName: params.genericIframe,
                    widgetURL: "App/Cockpit/" + sUrl,
                    injectCss: [".ui-bizagi-old-render*", "@font-face"],
                    modalParameters: {
                        title: "Bizagi"
                    },
                    afterLoad: callBackOpenCase,
                    afterLoadParams: {
                        routingAction: params.bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                        genericIframe: params.bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
                        bizagi: params.bizagi,
                        doc: doc
                    }
                });
            };
        };
        // Set hack params
        hackParams = $.extend(hackParams, {
            routingAction: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            genericIframe: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
            bizagi: bizagi
        });


        return {
            callback: callback,
            params: hackParams
        };
    },

    configureNavTree: function (reportsContainer) {
        var self = this;
        var confirm = self.getTemplate("reports-query-confirm");
        var headerTemplate = self.getTemplate("reports-query-tree");

        // Bind for list elements
        $(".reportsListDisplay", reportsContainer).click(function () {
            var endPoint = $(this).data('endpoint');
            var idElement = $(this).data('id-element');
            var displayName = $(this).data('displayname');
            var maximized = $(this).data('maximized') || false;
            var extraArgs = $(this).data('extra-args');
            var categoryTree = $("#categoryTree");
            var finalUrl = self.dataService.serviceLocator.getUrl(endPoint) + extraArgs;

            // check if element has childrens
            if (endPoint == "") {
                // Its category, render their childrens
                // and set the new category whitin tree nav
                self.renderReports(idElement);

                $.tmpl(headerTemplate, {
                    idElement: idElement,
                    queryDisplayName: displayName
                }).appendTo(categoryTree);
                self.configureTreeNavigation();

            } else {
                // If the same popup is opened close it
                if (self.currentPopup == "reports") {
                    bizagi.workportal.desktop.popup.closePopupInstance();
                    return;
                }
                var hack = self.jsInjection(self.dataService.serviceLocator.getUrl(endPoint), displayName);
                // Shows a popup widget
                self.currentPopup = "reports";
                self.publish("showDialogWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
                    widgetURL: finalUrl,
                    maximized: maximized,
                    // injectCss:[".ui-bizagi-old-render*","."+title, "@font-face"],
                    modalParameters: {
                        title: displayName,
                        id: endPoint
                    },
                    afterLoad: hack.callback,
                    afterLoadParams: hack.params
                });
                if (self.params.widgetName == "reports") {
                    bizagi.workportal.desktop.popup.closePopupInstance();
                    return;
                };
            }
        });


        // Bind for action elements (Edit and delete buttons)
        $(".editButton").click(function (e) {
            e.stopPropagation();
            self.editFolder($(this).parents('ul'));
            bizagi.workportal.desktop.popup.closePopupInstance();
        });

        $(".deleteButton").click(function (e) {
            e.stopPropagation();

            var queryId = $(this).parents('ul').data('idquery');
            var content = $.tmpl(confirm);

            // Open dialog with confirm message
            $(content).dialog({
                resizable: true,
                modal: true,
                title: self.getResource("workportal-widget-reports-confirm-title"),
                buttons: [
				{
				    text: self.getResource("workportal-widget-reports-confirm-delete"),
				    click: function () {
				        // Call service
				        self.dataService.deleteQueries(queryId); // Close dialog and menu
				        $(this).dialog("close");
				        bizagi.workportal.desktop.popup.closePopupInstance();
				    }
				},
				{
				    text: self.getResource("workportal-widget-reports-confirm-cancel"),
				    click: function () {
				        $(this).dialog("close");
				    }
				}
				]
            });
        });
    },

    /**
    *   Binds the back buttons so we can navigate back
    */
    configureBackButton: function () {
        var self = this;
        var content = self.getContent();
        var btnBack = $("#bt-back", content);
        var categoryTree = $("#categoryTree", content);

        // Bind click
        btnBack.click(function () {
            if ($("li", categoryTree).length > 1) {
                // Removes last child                    
                $("li:last-child", categoryTree).remove();
                var idParentQuery = $("li:last-child").children("#idParent").val();

                // Render Querie again
                self.renderReports(idParentQuery);
            }
        });
    },

    /**
    * Bind tree navigation
    */
    configureTreeNavigation: function () {
        var self = this;
        var content = self.getContent();
        var categoryTree = $("#categoryTree", content);

        // Bind header events
        $("li:last-child", categoryTree).click(function () {
            // Remove all elements
            $(this).nextAll().remove();
            var idParent = $(this).data("id-element");
            // Render query tree again
            self.renderReports(idParent);
        });
    },

    scrollVertical: function () {
        var self = this;
        var content = self.getContent();

        $("#reports", content).bizagiScrollbar({
            "autohide": false
        });
    },

    /**
    * Edit folder
    */
    editFolder: function (element) {
        var self = this;
        var value = bizagi.util.trim($(element).find("h3").html());
        var description = bizagi.util.trim($(".newCaseDescription", element).html());
        var idQuery = $(element).data("idquery");
        var nodeTemplate = self.getTemplate("reports-query-edit");

        var dialogForm = $.tmpl(nodeTemplate, {
            name: value,
            description: description,
            idQuery: idQuery
        });


        dialogForm.dialog({
            resizable: true,
            modal: true,
            title: self.getResource("workportal-widget-reports-confirm-edit-title"),
            buttons: [
			{
			    text: self.getResource("workportal-widget-reports-confirm-save"),
			    click: function () {
			        var query = $("#namequery", this).val();
			        var description = $("#querydescripcion", this).val();
			        var idQuery = $(this).data("idquery");

			        self.dataService.updateQueries({
			            queryName: query,
			            queryDescription: description,
			            idQuery: idQuery
			        });

			        $(this).dialog("close");
			        bizagi.workportal.desktop.popup.closePopupInstance();
			    }
			},
			{
			    text: self.getResource("workportal-widget-reports-confirm-cancel"),
			    click: function () {
			        $(this).dialog("close");
			    }
			}
			]
        });
    }
});
