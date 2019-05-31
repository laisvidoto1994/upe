/*
 *   Name: BizAgi Workportal Desktop New Case Widget Controller
 *   Author: Edward Morales
 *   Comments:
 *   -   This script will provide sub menu widget
 */

// Auto extend
bizagi.workportal.widgets.subMenu.extend("bizagi.workportal.widgets.subMenu", {}, {
	/**
	 *   To be overriden in each device to apply layouts
	 */
	postRender: function() {
		var self = this;
		// render sub menu content
		self.renderSubMenuContent();

		self.scrollVertical({
			"autohide": false
		});
	},
	scrollVertical: function() {
		var self = this;
		var content = self.getContent();

		$("#categories", content).bizagiScrollbar({
			"autohide": false
		});
	},
	/*
	 *   Show content for sub menu item
	 */

	renderSubMenuContent: function() {
		var self = this;
		var content = self.getContent();
		var listTemplate = self.workportalFacade.getTemplate("menu.submenu.list");
		var listContainer = $("#categories", content);
		var data = {};

		var callBack = {
			"ThemeBuilder": function(args) {
				args = args || {};
				if(args.url) {
					args.windowOpenBlank.location; //Prevent security message browsers open popups. Reason: window.open after callbacks.
				}
			},
			"asyncECMUpload": function(args) {
				args = args || {};
				self.showWidgetPopup(args.url, args.title, args.id);
			}
		};

		// TODO: SNAKE-1296 remove these lines
		try {
			if(bizagi.override.enableMultipleCasesReassigment) {
				self.params.options.menuData.push({
					categoryKey: "CaseAdmin",
					categoryName: self.getResource("workportal-menu-submenu-adminReassignCases"),
					categoryUrl: "adminReassignCases"
				});

				callBack.CaseAdmin = function(args) {
					args = args || {};
					self.showWidgetPopup(args.url, args.title, args.id);
				};
			}
		} catch(e) {
			// Nothing todo, just skip this option in menu
		}

		//DRAGON-152 Adidas - Async ECM
		try {
			if(bizagi.override.enableAsyncECMUploadJobs) {
				self.params.options.menuData.push({
					categoryKey: "asyncECMUpload",
					categoryName: self.getResource("workportal-menu-submenu-asyncECMUpload"),
					categoryUrl: "asyncECMUpload"
				});
			}
		} catch(e) {
			// Nothing todo, just skip this option in menu
		}


		try {

			//delete frankenstein implementations
			// revisar el contenido de self.params.options.menuData para tener en cuenta los sub menus   autorizados
			var authorized = self.getSubItemsAuthorized();

			self.deleteMenuOption("UserAdmin");
			self.deleteMenuOption("Stakeholder");
			self.deleteMenuOption("AuthenticationLogQuery");
			self.deleteMenuOption("EncryptionAdmin");
			self.deleteMenuOption("UserPendingRequests");
			self.deleteMenuOption("CaseAdmin");
			self.deleteMenuOption("AsynchronousWorkitemRetries");
			self.deleteMenuOption("UserDefaultAssignation");
			self.deleteMenuOption("Profiles");
			self.deleteMenuOption("AlarmAdmin");
			self.deleteMenuOption("Licenses");
			self.deleteMenuOption("UnlockFormsAdmin");
			self.deleteMenuOption("GRDimensionAdmin");
			self.deleteMenuOption("DocumentTemplates");
			self.deleteMenuOption("ProcessAdmin");
			self.deleteMenuOption("Multilanguage");
			self.deleteMenuOption("EntityAdmin");
			self.deleteMenuOption("Holidays");
			self.deleteMenuOption("ProjectName");
			self.deleteMenuOption("OAuthApplications");
			self.deleteMenuOption("AdhocProcessAdmin");
			self.deleteMenuOption("AdhocEntityAdmin");
			self.deleteMenuOption("AdhocUserGroupAdmin");

			//Falta implementacion de Business Policies
			// self.deleteMenuOption("BusinessPolicies");

			$.each(self.params.options.menuData, function(key, value) {
				if(value.categoryKey == "BusinessPolicies") {
					self.params.options.menuData[key].categoryClassName = "bz-icon-policy-outline";
				}
				if(value.categoryKey == "ThemeBuilder") {
					self.params.options.menuData[key].categoryClassName = "bz-icon-paint-outline";
				}
			});

			if($.inArray("UserAdmin", authorized) !== -1) {
				self.params.options.menuData.unshift({
					categoryKey: "UserAdmin",
					categoryClassName: "bz-icon-users-outline",
					categoryName: self.getResource("workportal-menu-submenu-UserAdmin"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USERS_ADMINISTRATION
				});
			}

			if($.inArray("Stakeholder", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "StakeholderAdmin",
					categoryClassName: "bz-icon-stakeholders-outline",
					categoryName: self.getResource("workportal-menu-submenu-StakeholderAdmin"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_STAKEHOLDERS
				});
			}

			if($.inArray("EntityAdmin", authorized) != -1) {
				self.params.options.menuData.unshift({
					categoryKey: "EntityAdmin",
					categoryClassName: "bz-icon-database-outline",
					categoryName: self.getResource("workportal-menu-submenu-EntityAdmin"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ENTITIES
				});
			}

			//create the new menu option using the old categoryKey
			if($.inArray("AuthenticationLogQuery", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "AuthenticationLogQuery",
					categoryClassName: "bz-icon-authentication-outline",
					categoryName: self.getResource("workportal-menu-submenu-AuthenticationLogQuery"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_AUTHENTICATION_LOG
				});
			}

			if($.inArray("EncryptionAdmin", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "EncryptionAdmin",
					categoryClassName: "bz-icon-lock-outline",
					categoryName: self.getResource("workportal-menu-submenu-EncryptionAdmin"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ENCRYPT_PASSWORDS
				});
			}

			if($.inArray("UserPendingRequests", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "UserPendingRequests",
					categoryClassName: "bz-icon-unlock-outline",
					categoryName: self.getResource("workportal-menu-submenu-UserPendingRequests"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USERS_REQUESTS
				});
			}

			if($.inArray("CaseAdmin", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "CaseAdmin",
					categoryClassName: "bz-icon-case-outline",
					categoryName: self.getResource("workportal-menu-submenu-CaseAdmin"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_CASE_SEARCH
				});
			}

			if($.inArray("UnlockFormsAdmin", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "UnlockFormsAdmin",
					categoryName: self.getResource("workportal-menu-submenu-UnlockFormsAdmin"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_UNLOCK_FORMS
				});
			}

			if($.inArray("AsynchronousWorkitemRetries", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "AsynchronousWorkitemRetries",
					categoryClassName: "bz-icon-asynchronous-outline",
					categoryName: self.getResource("workportal-menu-submenu-AsynchronousWorkitemRetries"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ASYNC_ACTIVITIES
				});
			}

			if($.inArray("UserDefaultAssignation", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "UserDefaultAssignation",
					categoryClassName: "bz-icon-user-manage-outline",
					categoryName: self.getResource("workportal-menu-submenu-UserDefaultAssignation"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_DEFAULTS_ASSIGNATION_USER

				});
			}

			if($.inArray("Profiles", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "Profiles",
					categoryClassName: "bz-icon-user-outline",
					categoryName: self.getResource("workportal-menu-submenu-Profiles"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USER_PROFILES

				});
			}

			if($.inArray("AlarmAdmin", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "AlarmAdmin",
					categoryClassName: "bz-icon-alarm-outline",
					categoryName: self.getResource("workportal-menu-submenu-AlarmAdmin"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ALARMS
				});
			}

			if($.inArray("Licenses", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "Licenses",
					categoryClassName: "bz-icon-license-outline",
					categoryName: self.getResource("workportal-menu-submenu-Licenses"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USER_LICENSES
				});
			}

			if($.inArray("GRDimensionAdmin", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "GRDimensionAdmin",
					categoryClassName: "bz-icon-dimension-outline",
					categoryName: self.getResource("workportal-menu-submenu-GRDimensionAdmin"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_DIMENSIONS
				});
			}

			if($.inArray("DocumentTemplates", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "DocumentTemplates",
					categoryClassName: "bz-icon-admin-template-outline",
					categoryName: self.getResource("workportal-menu-submenu-DocumentTemplates"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_DOCUMENT_TEMPLATES
				});
			}

			if($.inArray("ProcessAdmin", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "ProcessAdmin",
					categoryClassName: "bz-icon-case-time-outline",
					categoryName: self.getResource("workportal-menu-submenu-ProcessAdmin"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_PROCESSES
				});
			}

			//Falta implementacion de Business Policies
			/*if ($.inArray("BusinessPolicies", authorized) != -1) {
			 self.params.options.menuData.push({
			 categoryKey: "BusinessPolicies",
			 categoryName: self.getResource("workportal-menu-submenu-BusinessPolicies"),
			 categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES
			 });
			 }*/

			if($.inArray("Holidays", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "Holidays",
					categoryName: self.getResource("workportal-menu-submenu-holidays"),//"Holidays Calendar",
					categoryClassName: "bz-icon-holidays-outline",
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_HOLIDAYS
				});
			}

			if($.inArray("ProjectName", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "ProjectName",
					categoryName: self.getResource("workportal-menu-submenu-ProjectName"),
					categoryClassName: "bz-icon-project-name-outline",
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_PROJECTNAME
				});
			}

			if($.inArray("OAuthApplications", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "OAuthApplications",
					categoryName: self.getResource("workportal-menu-submenu-OAuth2Applications"),
					categoryClassName: "bz-icon-admin-template-outline",
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_OAUTH2APPLICATIONS
				});
			}

			if($.inArray("Multilanguage", authorized) != -1) {
				self.params.options.menuData.push({
					categoryKey: "LanguageAdmin",
					categoryClassName: "bz-icon-world-outline",
					categoryName: self.getResource("workportal-menu-submenu-LanguageAdmin"),
					categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_LANGUAGE
				});
			}

			if ($.inArray("AdhocProcessAdmin", authorized) != -1) {
			    self.params.options.menuData.push({
			        categoryKey: "AdhocProcessAdmin",
			        categoryClassName: "bz-icon-diagram-outline",
			        categoryName: self.getResource("workportal-menu-submenu-AdhocProcessAdmin"),
			        categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_PROCESSES
			    });
			}

			if ($.inArray("AdhocEntityAdmin", authorized) != -1) {
			    self.params.options.menuData.push({
			        categoryKey: "AdhocEntityAdmin",
			        categoryClassName: "bz-icon-bz-edit-entity",
			        categoryName: self.getResource("workportal-menu-submenu-AdhocEntityAdmin"),			        
			        categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_ENTITIES
			    });
			}

			if ($.inArray("AdhocUserGroupAdmin", authorized) != -1) {
			    self.params.options.menuData.push({
			        categoryKey: "AdhocUserGroupAdmin",
			        categoryClassName: "bz-icon-stakeholders",
			        categoryName: self.getResource("workportal-menu-submenu-AdhocUserGroupAdmin"),
			        categoryUrl: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_USER_GROUPS
			    });
			}

			//add the callback for each new widget
			callBack.UserAdmin =
			callBack.StakeholderAdmin =
			callBack.AuthenticationLogQuery =
			callBack.EncryptionAdmin =
			callBack.UserPendingRequests =
			callBack.CaseAdmin =
			callBack.UnlockFormsAdmin =
			callBack.AsynchronousWorkitemRetries =
			callBack.UserDefaultAssignation =
			callBack.Profiles =
			callBack.AlarmAdmin =
			callBack.Licenses =
			callBack.GRDimensionAdmin =
			callBack.DocumentTemplates =
			callBack.ProcessAdmin =
			callBack.LanguageAdmin =
			callBack.EntityAdmin =
            callBack.AdhocProcessAdmin =
	        callBack.AdhocEntityAdmin =
            callBack.AdhocUserGroupAdmin =
			//callBack.BusinessPolicies =
			function(args) {
				args = args || {};

				$.extend(args, {
					showCloseButton: false
				});

				if (args.id === "Licenses" || args.id === "AlarmAdmin" || args.id === "AdhocProcessAdmin") {
                    $.extend(args, {
                        maximize: false
                    });
                }

				self.showCustomWidgetPopup(args);
			};

			callBack.Holidays = function(args){
				args = args || {};
				args = $.extend(true,args, {
						showCloseButton: false,
						title: self.getResource("workportal-menu-submenu-holidays"),
						width: "1080px",
						height: 910,
						showCloseButton: false,
						id: "Holidays"
				});

				self.showCustomWidgetPopup(args);
			};

			callBack.OAuthApplications = function (args) {
			    args = args || {};
			    args = $.extend(true, args, {
			        showCloseButton: false,
			        title: self.getResource("workportal-menu-submenu-OAuth2Applications"),
			        width: "980px",
			        height: 700,
			        showCloseButton: false,
			        id: "OAuthApplications"
			    });

			    self.showCustomWidgetPopup(args);
			};

			callBack.ProjectName = function(args){
				args = args || {};
				args = $.extend(true,args, {
						showCloseButton: false,
						title: self.getResource("workportal-menu-submenu-ProjectName"),
						width: "600px",
						height: 400,
						showCloseButton: false,
						id: "ProjectName"
				});

				self.showCustomWidgetPopup(args);
			};

		} catch(e) {
			// Nothing todo, just skip this option in menu
		}


		data["listmenu"] = self.params.options.menuData;
		var render = $.tmpl(listTemplate, data);

		listContainer.append(render);

		// Bind sub menu
		if(!self.params.options.customClickHandler) {
			$("li", listContainer).click(function() {
				var url = $(this).find("#categoryUrl").val();
				var title = $(this).find(".title").text();
				var id = $(this).data('id') || '';

				if(bizagi.util.isIE11() || bizagi.util.isEdge()){
					localStorage.setItem('auxBizagiAuthentication', window.sessionStorage.bizagiAuthentication);
				}
				//prevent message open popup on browser
				var windowOpenBlank;
				if(url.indexOf('ThemeBuilder') !== -1){
					windowOpenBlank = window.open(url, '_blank');
				}

				bizagi.loader.start("admin").then(function() {

					// Find call back
					if(callBack[id]) {
						callBack[id]({
							windowOpenBlank: windowOpenBlank,
							url: url,
							title: title,
							id: id
						});
					} else {
						self.showContentPopup(url, title, id);
					}
					bizagi.workportal.desktop.popup.closePopupInstance();
				});
			});

		} else {
			$("li", listContainer).click(function() {
				var id = $(this).data("id");
				bizagi.loader.start("admin").then(function() {
					bizagi.workportal.desktop.popup.closePopupInstance();
					self.params.options.customClickHandler(id);
				});
			});
		}

	},
	/*
	 *   Determines if a window must be show always in quirks mode for IE
	 */
	needsQuicksMode: function(url) {

		// If an old url is not working ok, put the url in the following filters
		if(url.toLowerCase().indexOf("businesspoliciesselector.aspx") >= 0)
			return true;
		if(url.toLowerCase().indexOf("bamprocess.aspx") >= 0)
			return true;
		if(url.toLowerCase().indexOf("bamtask.aspx") >= 0)
			return true;
		if(url.toLowerCase().indexOf("analyticsprocess.aspx") >= 0)
			return true;
		if(url.toLowerCase().indexOf("analyticssensor.aspx") >= 0)
			return true;

		return false;
	},
	/*
	 *   Get the page hacks in order to work properly in each case
	 */
	getPageHacks: function(url, title) {
		var self = this;
		var callback;
		var hackParams = {
			title: title
		};

		//if (url.toLowerCase().indexOf("casesearch.aspx") > 0 || url.toLowerCase().indexOf("AsynchDisabledWorkitems.aspx") > 0) {
		// Hack for  Admin / Processes
		callback = function(params) {
			// This script will execute inside the iframe context
			this.openBACase = function(idCase, sHref) {
				var workitem = null;
				if(sHref.indexOf("idWorkitem=") > -1) {
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

			this.changeToWidget = function(widget) {
				params.controller.publish("changeWidget", {
					widgetName: widget || params.bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID
				});

				// close dialog
				params.controller.publish("closeCurrentDialog");
			};
		};

		// Set hack params
		hackParams = $.extend(hackParams, {
			routingAction: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
			bizagi: bizagi
		});
		// }

		return {
			callback: callback,
			params: hackParams
		};
	},
	/*
	 *  Show modal window with static url
	 **/
	showContentPopup: function(url, title, id) {
		var self = this;
		id = id || "";

		// Define hacks for each page
		var hack = self.getPageHacks(url, title);

		if(bizagi.util.isIE() && bizagi.util.getInternetExplorerVersion() < 10 && self.needsQuicksMode(url)) {
			// Shows a popup window
			self.publish("showOldWindow", {
				url: url,
				windowParameters: $.extend(hack.params, {
					controller: self,
					afterLoad: hack.callback
				})
			});

		} else {
			// Show a normal popup

			// If the same popup is opened close it
			if(self.currentPopup == "genericiframe") {
				bizagi.workportal.desktop.popup.closePopupInstance();
				return;
			}

			// Shows a popup widget
			self.currentPopup = "genericiframe";
			self.publish("showDialogWidget", {
				widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
				widgetURL: url,
				injectCss: [".ui-bizagi-old-render*", "." + title, "@font-face"],
				modalParameters: {
					refreshInbox: false,
					id: id,
					title: title
				},
				afterLoad: hack.callback,
				afterLoadParams: hack.params
			});
		}
	},
	showWidgetPopup: function(widget, title, id) {
		var self = this;

		self.publish("showDialogWidget", {
			widgetName: widget,
			modalParameters: {
				title: title,
				width: "1080px",
				showCloseButton: false
			}
		});
	},
	showCustomWidgetPopup: function(params) {
		var self = this;
        var defaultWidth = ($(window).width() - (($(window).width() * 15)/100)) + "px";
		var widgetParameters = {
			widgetName: params.url,
			data: {"idCase": params.id},
			closeVisible: params.showCloseButton,
			maximize: (typeof params.maximize !== "undefined") ? params.maximize : true,
			modalParameters: {
				title: params.title,
				width: params.width || defaultWidth,
				height: params.height,
				id: params.id
			}
		};

		if(params.buttons) {
			widgetParameters.buttons = params.buttons;
		}

		self.publish("showDialogWidget", widgetParameters);
	},
	deleteMenuOption: function(categoryKey) {
		var self = this;
		var menuData = self.params.options.menuData;

		for(var i = 0; i < menuData.length; i++) {
			if(menuData[i].categoryKey == categoryKey) {
				self.params.options.menuData.splice(i, 1);
			}
		}
	},

	/*
	 * Regresa un arreglo con los submenu autorizados
	 */
	getSubItemsAuthorized: function() {
		var self = this;
		var result = [];
		$.each(self.params.options.menuData, function(k, v) {
			result.push(v.categoryKey);
		});
		return result;
	}

});
