/*
 *   Name: BizAgi Workportal Desktop Menu Controller
 *   Author: Diego Parra (based on  Edward Morales version)
 *   Comments:
 *   -   This script will override menu controller class to apply custom stuff just for desktop device
 */


bizagi.workportal.controllers.menu.extend("bizagi.workportal.controllers.menu", {}, {

	/**
	 *
	 * @return {*}
	 */
	postRender: function() {
		var self = this;
		var defer = new $.Deferred();
		var content = self.getContent();
		var searchContent = $("#ui-bizagi-wp-widget-searchContainer", content);
		var iconsTemplate = self.workportalFacade.getTemplate("menu.security");
		var menuContent = $("#main_menu", content);


		/**
		 * Define security fo actual stakeholder
		 * @type {bizagi.workportal.controllers.menu.security}
		 */

		var sec = bizagi.menuSecurity;

			/**
			 * Draw menu with allowed sections
			 */
			$.tmpl(iconsTemplate, sec,{
					reportsSecurity: function() {
						return (sec.AnalysisReports);
					}
				}).appendTo(menuContent);

			/**
			 * Set highlight item menu
			 */
			switch(self.workportalFacade.workportal.getWidgetByDataUser()){
				case bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL:
					$("#menuListHome", menuContent).addClass("activeMenu").siblings().removeClass("activeMenu");
					break;
				case bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID:
				case bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX:
					$('#menuListInbox', menuContent).addClass("activeMenu").siblings().removeClass("activeMenu");
					break;
			}

			// Fix logout button
			if(!sec.LogOut) {
				//Hide it
				$("#logout", content).hide();
			}
			//Prevent event beforeunload to be trigger by clicking the menu
			$("#main_menu a", content).click(function(event) {
				event.preventDefault();
			});

			// Fix search field
			if(!sec.Search) {
				$("#ui-bizagi-wp-widget-searchContainer", content).hide();
			}

			$("#main_menu li", content).on("click", self.setActiveSection);

            $(".js-bz-speed-dial__btn-trigger", content).on("click", $.proxy(self.openAdhocCreateProcess, self));

			if (!sec.Inbox) {
			    $("#menuListInbox", content).hide();
			}

			// Bind Widgets button
			$("#main_menu li#menuListWidget", content).click(function() {
				self.showWidgetsPopup();
			});

			// Bind New Case button
			$("#main_menu li#menuListNew", content).click(function () {
			    bizagi.loader.start("newcase").then(function () {
			        self.showNewCasePopup();
			    });
			});

            // Bind my Search
            if (bizagi.util.parseBoolean(bizagi.override.enableMySearch) &&
				bizagi.currentUser.associatedStakeholders && bizagi.currentUser.associatedStakeholders.length > 0){
                $("#ui-bizagi-wp-widget-searchContainer", content).click(function () {
                    self.showMySearchPopup();
                });
            }

			$("#main_menu li#menuListHome", content).click(function() {
			    var home = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL;
                
				self.publish("changeWidget", {
					widgetName: home
				});
			});

			//  Bind inbox button
			$("#main_menu li#menuListInbox", content).click(function() {
                var inbox = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX;
                var grid = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID;
                var homeportal = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL;
				var actualWidget;
                var storeWidget;
				if($.isFunction(bizagi.cookie) && (bizagi.cookie("bizagiDefaultWidget") !== homeportal)){
					storeWidget = bizagi.cookie("bizagiDefaultWidget");
				}
				else{
					storeWidget = grid;
				}

                bizagi.loader.start("inbox").then(function () {
                    switch (storeWidget) {
                        case inbox:
                            actualWidget = inbox;
                            break;
                        case grid:
                            actualWidget = grid;
						    break;
                        case homeportal:
                            actualWidget = homeportal;
                            break;
					    default:
                            actualWidget = grid;
						    break;
				    }

					/*Coment code by QAF-2108*/
					/* THEMES ANGULAR
                    var templateService = new bizagi.workportal.services.loadtemplates();
                    $.when(templateService.loadTemplates({
                        "homeportal": bizagi.getTemplate("bizagi.workportal.desktop.widget.homeportal").concat("#homeportal-frame"),
                        useNewEngine: true
                    })).done(function () {
                        var template = templateService.getTemplate("homeportal");
                        var content = template.render({});
                        $(content).attr("data-bizagi-component", "workarea")
                        $workarea = $("#ui-bizagi-wp-workarea");
                        $workarea.remove("#ui-bizagi-wp-project-homeportal-main");
                        $workarea.append(content);
                        $workarea.find("#ui-bizagi-wp-project-homeportal-main").show();
                        self.publish("changeWidget", {
                            widgetName: actualWidget
                        });
                    });
                    */
					self.publish("changeWidget", {
						widgetName: actualWidget
					});

                });
				self.resetNavigatorInfo();
			});

			// Bind New Case button
			$("#main_menu li#menuListQueries", content).click(function() {
				self.showQueriesPopup();
			});

			$("#tempEntities", content).click(function() {
				self.publish("showDialogWidget", {
					widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ENTITIES,
					modalParameters: {
						title: self.getResource("workportal-menu-preferences"),
						width: "1020px",
						showCloseButton: false
					}
				});
			});

			// Bind admin menu
			$("#menuListAdmin", content).click(function() {
				self.renderAdminMenu();
			});

			$("#menuListReports", content).click(function() {

				self.renderReportsMenu();
			});

			$("#menuListPreferences", content).click(function() {
				var url = self.dataService.getUrl({
					"endPoint": "ListPreferences"
				});

				var widgetName = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_PREFERENCES;
				bizagi.loader.start("admin").then(function () {
				    self.publish("showDialogWidget", {
					    widgetName: widgetName,
					    widgetURL: url,
					    closeVisible: false,
					    maximize: false,
					    modalParameters: {
						    title: self.getResource("workportal-menu-preferences"),
                            width: 600,
						    height: 680
					    }
				    });
				});
			});
			$("#user", content).click(function() {
				self.showUserProfileMenu();
			});

			defer.resolve(content);


		// Bind Search field
		var inputSearchField = $("#menuQuery", searchContent);

		// Bind Font Size
		$(".ui-bizagi-wp-bt-font", content).click(function() {
			self.renderFontMenu();
		});

        //TODO: Remove this variable, It is used for mocking the service
		window.CURRENT_THEME_REMOVE_IT = "theme1";
		$(".ui-bizagi-wp-bt-classic-theme,.ui-bizagi-wp-bt-modern-theme,.ui-bizagi-wp-bt-booking-theme", content).hide();

		$(".ui-bizagi-wp-bt-classic-theme", content).click(function () {
		    $("body").append("<div id='workportal-theme-layer' ></div>");
		    $("#workportal-theme-layer").addClass("workportal-theme-layer-visible");

		    //change to classic theme
		    window.CURRENT_THEME_REMOVE_IT = "theme1";

		    var home = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL;

		    self.publish("changeWidget", {
		        widgetName: home
		    });

		    $(".ui-bizagi-wp-bt-modern-theme").show();
		    $(".ui-bizagi-wp-bt-booking-theme").show();
		    $(".ui-bizagi-wp-bt-classic-theme").hide();
		    $("#user-profile").hide("fast");
		});

		$(".ui-bizagi-wp-bt-modern-theme", content).click(function () {
		    $("body").append("<div id='workportal-theme-layer' ></div>");
		    $("#workportal-theme-layer").addClass("workportal-theme-layer-visible");

		    //change to modern theme
		    window.CURRENT_THEME_REMOVE_IT = "theme2";

		    var home = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL;

		    self.publish("changeWidget", {
		        widgetName: home
		    });

		    $(".ui-bizagi-wp-bt-modern-theme").hide();
		    $(".ui-bizagi-wp-bt-classic-theme").show();
		    $(".ui-bizagi-wp-bt-booking-theme").show();
		    $("#user-profile").hide("fast");
		});

		$(".ui-bizagi-wp-bt-booking-theme", content).click(function () {
		    $("body").append("<div id='workportal-theme-layer' ></div>");
		    $("#workportal-theme-layer").addClass("workportal-theme-layer-visible");

		    //change to booking theme
		    window.CURRENT_THEME_REMOVE_IT = "theme3";

		    var home = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL;

		    self.publish("changeWidget", {
		        widgetName: home
		    });

		    $(".ui-bizagi-wp-bt-booking-theme").hide();
		    $(".ui-bizagi-wp-bt-classic-theme").show();
		    $(".ui-bizagi-wp-bt-modern-theme").show();
		    $("#user-profile").hide("fast");
		});

		$("#logout", content).click(function() {

			$.when(bizagi.util.autoSave()).done(function() {
				$(document).data('auto-save', '');
				self.dataService.logout();
			});
		});

		$("#about", content).click(function() {
			self.showAboutPopup();
		});

		/**
		 * Binding for search field
		 */
		$(inputSearchField).bind('keypress', function(e) {
			if(e.keyCode == 13) {
				var searchValue = inputSearchField.val();
				if( searchValue != "" && searchValue != self.getResource("workportal-menu-search")) {
					self.publish("executeAction", {
						action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH,
						radNumber: inputSearchField.val(),
						onlyUserWorkItems: false
					});
				}
				self.resetNavigatorInfo();
			}
		});

		$(window).trigger("resize");

		return defer.promise();
	},

	resetNavigatorInfo: function () {
		if (bizagi && bizagi.navigator && bizagi.navigator.info) {
			bizagi.navigator.info = {};
		}
	},

	/**
	 *	Highligth for active menu
	 */
	setActiveSection: function() {
		var self = this;
		$(self).parent().find('li').removeClass('activeMenu');
		$(self).addClass('activeMenu');
	},

    /**
     * Open popup create process
     */
    openAdhocCreateProcess: function() {
        var self = this;

        var widgetParameters = {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADHOC_CREATE_PROCESS,
            closeVisible: false,
            modalParameters: {
                height: 300,
                title: bizagi.localization.getResource("workportal-adhoc-process-create-popup-title"),
                width: 400
            }
        };
        self.publish("showDialogWidget", widgetParameters);
    },

	/**
	 * Show User profile menu
	 */
	showUserProfileMenu: function() {
		var self = this;
		var content = self.getContent();
		var $userProfile = $("div#user-profile", content);

		$userProfile.show("fast", function() {
			$userProfile.click(function(e) {
				e.stopPropagation();
			});

		});

		$(document).on("click", function (e) {

		    if (!$(e.target).is("#user-profile") && $(e.target).closest("#user").length === 0) {
		        $userProfile.hide("fast");
		    }

		    e.stopPropagation();
		});
	},

	/**
	 * Creates a generic menu popup
	 * @param options
	 */
	showMenuPopup: function(options) {
		var self = this;
		var content = self.getContent();
		var popup = new bizagi.workportal.desktop.popup(self.dataService, self.workportalFacade, {
			sourceElement: options.buttonSelector,
			my: options.my || "center top",
			at: options.at || "center bottom",
			offset: options.offset,
			height: options.height,
			width: options.width
		});

		// If the same popup is opened close it
		if(self.currentPopup == options.buttonSelector) {
			bizagi.workportal.desktop.popup.closePopupInstance();
			return;
		}

		// Shows the popup
		self.currentPopup = options.buttonSelector;
		var popupContent = self.workportalFacade.getTemplate(options.template);
		popup.render(popupContent);

		// Adds the active class for buttons
		$(options.buttonSelector, content).addClass("active");

		// Checks for close signal to change the class again
		$.when(popup.closed())
			.done(function() {
				self.currentPopup = null;
				$(options.buttonSelector, content).removeClass("active");
			});
	},

	/**
	 * Shows the user popup to access more options
	 */
	showUserPopup: function() {
		var self = this;
		self.showMenuPopup({
			buttonSelector: "#ui-bizagi-wp-menu-username",
			template: "menu.modal.user",
			offset: "0 0",
			height: 80,
			width: 90
		});
	},

	/**
	 *  Shows the widgets popup to access all dynamic content
	 * @param options
	 */
	showWidgetsPopup: function(options) {
		options = options || {};
		var self = this;
		self.showMenuPopup({
			buttonSelector: options["buttonSelector"] || "#main_menu li#menuListWidget",
			template: options["template"] || "menu.modal.widgets",
			offset: options["offset"] || "18 -34",
			height: options["height"] || 160,
			width: options["width"] || 175
		});
	},

	/**
	 * Show new case popup to create a case
	 */
	showNewCasePopup: function() {
		var self = this;
		var content = self.getContent();

		// Switch buttonstyle
		$("#main_menu li#menuListNew", content).addClass("active");

		// If the same popup is opened close it
		if(self.currentPopup == "newCase") {
			bizagi.workportal.desktop.popup.closePopupInstance();
			return;
		}

		// Shows a popup widget
		self.currentPopup = "newCase";
		self.publish("popupWidget", {
			widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_NEWCASE,
			options: {
				sourceElement: "#main_menu li#menuListNew",
				'max-height': '746',
				height: 'auto',
				width: '339',
				offset: "18 -4", //x y
				activeScroll: false,
				closed: function() {
					self.currentPopup = null;
					$("#main_menu li#menuListNew", content).removeClass("active");
				}
			}
		});
	},

	/**
    *   Show new case popup to create a case
    */
    showMySearchPopup: function () {
        var self = this;
        var content = self.getContent();

        // Switch buttonstyle
        $("#ui-bizagi-wp-widget-searchContainer", content).addClass("active");

        // If the same popup is opened close it
        if (self.currentPopup == "mySearch") {
            bizagi.workportal.desktop.popup.closePopupInstance();
            return;
        }

        // Shows a popup widget
        self.currentPopup = "mySearch";
        self.publish("popupWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_MYSEARCHLIST,
            options: {
                sourceElement: "#ui-bizagi-wp-widget-searchContainer",
                'max-height': '346',
                height: 'auto',
                width: '339',
                top: '52',
                offset: "18 10",
                activeScroll: true,
                closed: function () {
                    self.currentPopup = null;
                    $("#ui-bizagi-wp-widget-searchContainer", content).removeClass("active");
                }
            }
        });
    },

	/**
	 * Show new case popup to create a case
	 */
	showQueriesPopup: function() {
		var self = this;
		var content = self.getContent();

		// Switch buttonstyle
		$("#main_menu li#menuListQueries", content).addClass("active");

		// If the same popup is opened close it
		if(self.currentPopup == "queries") {
			bizagi.workportal.desktop.popup.closePopupInstance();
			return;
		}
		var widgetName = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERIES;
		if(bizagi.util.parseBoolean(bizagi.override.disableFrankensteinQueryForms) == true) {
			widgetName = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERIES_DEFINITION;
		}

		bizagi.loader.start("queries").then(function () {
		    // Shows a popup widget
		    self.currentPopup = "queries";
		    self.publish("popupWidget", {
			    widgetName: widgetName,
			    options: {
				    sourceElement: "#main_menu li#menuListQueries",
				    'max-height': '346',
				    height: 'auto',
				    width: '339',
				    offset: "18 -4",
				    activeScroll: true,
				    closed: function() {
					    self.currentPopup = null;
					    $("#main_menu li#menuListQueries", content).removeClass("active");
				    }
			    }
		    });
		});
	},

	/**
	 * Show popup with information about the product
	 */
	showAboutPopup: function() {
		var self = this;
		var template = self.workportalFacade.getTemplate("menu.modal.about");

		var popupContent = $.tmpl(template, {build: bizagi.loader.productBuildToAbout, currentYear: bizagi.loader.currentYearVersion});
		$(popupContent).dialog({
			width: 430,
			height: 200,
			modal: true,
			title: bizagi.localization.getResource('workportal-menu-about'),
            allowmaximize: false,
			maximized: false,
			resizable: false,
            draggable: false
		});
	},

	/**
	 * Check permisions for category
	 * @param data
	 * @param key
	 * @return {boolean}
	 */
	checkRootCategory: function(data, key) {
		if(data["permissions"] != undefined) {
			for(var i = 0; i < data["permissions"].length; i++) {
				if(data["permissions"][i][key] != undefined) {
					return true;
				}
			}
		}
		return false;
	},

	/**
	 *	Get root category
	 * @param data
	 * @param key
	 * @return {*}
	 */
	getsRootCategory: function(data, key) {
		for(var i = 0; i < data["permissions"].length; i++) {
			if(data["permissions"][i][key] != undefined) {
				return data["permissions"][i][key];
			}
		}
		return {};
	},

	/**
	 * Get data for a category menu
	 * @param data
	 * @param category
	 * @return {Array}
	 */
	getSubMenuData: function(data, category) {
		var self = this;
		var result = [];
		var prefix = "workportal-menu-submenu-";
		data = data || self.security.getRawData() || {};
		if(self.checkRootCategory(data, category)) {
			$.each(self.getsRootCategory(data, category), function(k, v) {
				result.push(
					{
						"categoryKey": v,
						"categoryName": self.getResource(prefix + v),
						"categoryUrl": self.dataService.getUrl({
							"endPoint": v
						})
					});
			});
		}
		return result;
	},

	/**
	 * Render a submenu trough  BIZAGI_WORKPORTAL_WIDGET_SUBMENU
	 */
	renderAdminMenu: function() {
		var self = this;
		var content = self.getContent();
		var menuData = self.getSubMenuData(self.jsonSecurityList, "Admin");

		// Switch buttonstyle
		$("#main_menu li#menuListAdmin", content).addClass("active");
		// If the same popup is opened close it
		if(self.currentPopup == "subMenu") {
		    bizagi.workportal.desktop.popup.closePopupInstance();
		    self.currentPopup = null;
			return;
		}
		// Shows a popup widget
		self.currentPopup = "subMenu";
        self.publish("popupWidget", {
			widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SUBMENU,
			options: {
				sourceElement: "#main_menu li#menuListAdmin",
				'max-height': '346',
				height: 'auto',
				width: '339',
				offset: "18 -4",
				activeScroll: true,
				closed: function() {
					self.currentPopup = null;
					$("#main_menu li#menuListAdmin", content).removeClass("active");
				},
				menuData: menuData
			}
		});
	},

	/**
	 * Render BAM Reports
	 */
	renderReportsMenu: function() {
		var self = this;
		var content = self.getContent();

		bizagi.loader.start("reports").then(function () {
		    var widget = (!bizagi.util.isIE8()) ? bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS_MENU : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS;
		    // Switch buttonstyle
		    $("#main_menu li#menuListReports", content).addClass("active");

		    // If the same popup is opened close it
		    if(self.currentPopup == "subMenu") {
			    bizagi.workportal.desktop.popup.closePopupInstance();
			    return;
		    }

		    // Shows a popup widget
		    self.currentPopup = "subMenu";
		    self.publish("popupWidget", {
			    widgetName: widget,
			    options: {
				    sourceElement: "#main_menu li#menuListReports",
				    'max-height': '346',
				    height: 'auto',
				    width: '339',
				    offset: "18 -4",
				    activeScroll: true,
				    closed: function() {
					    self.currentPopup = null;
					    $("#main_menu li#menuListReports", content).removeClass("active");
				    }
				    ,
				    menuData: self.getSubMenuData(self.jsonSecurityList, "AnalysisReports")
			    }
		    });
		});
	},

	/**
	 * Shows the options for font size
	 */
	renderFontMenu: function() {
		var self = this;
		var content = self.getContent();

		// Switch buttonstyle
		$(".ui-bizagi-wp-bt-font", content).addClass("active");

		// If the same popup is opened close it
		if(self.currentPopup == "fontsize") {
			bizagi.workportal.desktop.popup.closePopupInstance();
			return;
		}

		// Shows a popup widget
		self.currentPopup = "fontsize";
		self.publish("popupWidget", {
			widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_FONTSIZE,
			options: {
				sourceElement: ".ui-bizagi-wp-bt-font",
				offset: "0 16",
				closed: function() {
					self.currentPopup = null;
					$(".ui-bizagi-wp-bt-font", content).removeClass("active");
				}

			}
		});
	},

	/**
	 * Renders a custom sub-menu
	 * @param menuButton
	 * @param submenu
	 * @param callback
	 */
	renderSubMenu: function(menuButton, submenu, callback) {
		var self = this;
		var content = self.getContent();
		var menuData = [];

		// Transform menu data
		for (i in submenu) {
		    if (submenu.hasOwnProperty(i)) {
		        menuData.push({
		            categoryKey: submenu[i].id,
		            categoryName: submenu[i].text,
		            categoryClassName: submenu[i].className
		        });
		    }
		}

		// Switch buttonstyle
		menuButton.addClass("active");

		// If the same popup is opened close it
		if(self.currentPopup == "subMenu") {
			bizagi.workportal.desktop.popup.closePopupInstance();
			return;
		}

		// Shows a popup widget
		self.currentPopup = "subMenu";
		self.publish("popupWidget", {
			widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SUBMENU,
			options: {
				sourceElement: menuButton,
				'max-height': '346',
				height: 'auto',
				width: '339',
				offset: "18 -4",
				activeScroll: true,
				closed: function() {
					self.currentPopup = null;
					menuButton.removeClass("active");
				},
				menuData: menuData,
				customClickHandler: function(id) {
					if(callback)
						callback(self, id);
				}
			}
		});
	},

	/**
	 * Show popup for entities
	 * @param url
	 * @todo Check if this method has any active dependency
	 */
	showEntitiesPopup: function(url) {
		var self = this;
		var content = self.getContent();


		// Switch buttonstyle
		$("#main_menu li#temp", content).addClass("active");

		// If the same popup is opened close it
		if(self.currentPopup == "genericiframe") {
			bizagi.workportal.desktop.popup.closePopupInstance();
			return;
		}

		// Shows a popup widget
		self.currentPopup = "genericiframe";
		self.publish("showDialogWidget", {
			widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME,
			widgetURL: url
		});
	}
});
