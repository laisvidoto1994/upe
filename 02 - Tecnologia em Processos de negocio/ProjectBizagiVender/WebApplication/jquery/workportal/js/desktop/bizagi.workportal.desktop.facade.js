/*
 *   Name: BizAgi Desktop Workportal Facade
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will define a workportal facade to access to all components
 */

//TODO: Create a base facade
//TODO: Replicate changes to tablet facade

$.Class.extend("bizagi.workportal.desktop.facade", {
	/*
	 *   Returns the implementation class by widget
	 */
	getWidgetImplementation: function(widget) {
		// If no widget implementation has been loaded return empty
		if(typeof (bizagi.workportal.widgets) === "undefined" ||
			typeof (bizagi.workportal.widgets.widget) === "undefined")
			return "";

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX) {
			return "bizagi.workportal.widgets.inbox";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOME) {
			return "bizagi.workportal.widgets.home";
		}

		//Convert to upper case because mobile use homePortal in defaultWidget cookie
		if(widget.toUpperCase() == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL.toUpperCase()) {
			return "bizagi.workportal.widgets.homeportal";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ACTIVITY) {
			return "bizagi.workportal.widgets.project.activity";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROJECT_DASHBOARD) {
			return "bizagi.workportal.widgets.homeportal";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADVANCE_SEARCH) {
			return "bizagi.workportal.widgets.advanceSearch";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID) {
			return "bizagi.workportal.widgets.inboxGrid";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ROUTING) {
			return "bizagi.workportal.widgets.routing";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_RENDER) {
			if(bizagi.override.enableProjectDashboard) {
				return "bizagi.workportal.widgets.project.activity";
			}
			else {
				return "bizagi.workportal.widgets.render";
			}
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_START_FORM) {
			return "bizagi.workportal.widgets.startForm";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_NEWCASE) {
			return "bizagi.workportal.widgets.newCase";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SUBMENU) {
			return "bizagi.workportal.widgets.subMenu";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ASYNC) {
			return "bizagi.workportal.widgets.async";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERIES) {
			return "bizagi.workportal.widgets.queries";
		}
		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERIES_DEFINITION) {
			return "bizagi.workportal.widgets.queries.definition";
		}
		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERIES_SHORTCUT) {
		    return "bizagi.workportal.widgets.queries.shortcut";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_QUERYFORM) {
			return "bizagi.workportal.widgets.queryform";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GENERICIFRAME) {
			return "bizagi.workportal.widgets.genericiframe";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH) {
			return "bizagi.workportal.widgets.search";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_FOLDERS) {
			return "bizagi.workportal.widgets.folders";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PRINT) {
			return "bizagi.workportal.widgets.print";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_FONTSIZE) {
			return "bizagi.workportal.widgets.fontsize";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_OLDRENDERINTEGRATION) {
			return "bizagi.workportal.widgets.oldrenderintegration";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PAGE) {
			return "bizagi.workportal.widgets.page";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ENTITIES) {
			return "bizagi.workportal.widgets.entities";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_RENDERFORM) {
			return "bizagi.workportal.widgets.renderform";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS) {
			return "bizagi.workportal.widgets.reports";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS_MENU) {
			return "bizagi.workportal.widgets.reportsMenu";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS_CHART) {
			return "bizagi.workportal.widgets.reportsChart";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SMARTFOLDERS) {
			return "bizagi.workportal.widgets.smartfolders";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_CASES) {
			return "bizagi.workportal.widgets.admin.cases";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ASYNCECM_UPLOAD) {
			return "bizagi.workportal.widgets.asyncecm.upload";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ACTIVITY_LOG) {
			return "bizagi.workportal.widgets.activity.log";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_AUTHENTICATION_LOG) {
			return "bizagi.workportal.widgets.authentication.log";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ENCRYPT_PASSWORDS) {
			return "bizagi.workportal.widgets.admin.encrypt.passwords";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USERS_REQUESTS) {
			return "bizagi.workportal.widgets.admin.users.requests";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_CASE_SEARCH) {
			return "bizagi.workportal.widgets.admin.caseSearch";
		}

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_HOLIDAYS) {
		    return "bizagi.workportal.widgets.admin.holidays";
		}

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_PROJECTNAME) {
		    return "bizagi.workportal.widgets.admin.projectName";
		}

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_OAUTH2APPLICATIONS) {
		    return "bizagi.workportal.widgets.admin.oauth2Applications";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROCESS_TREE) {
			return "bizagi.workportal.widgets.processtree";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ENTITIES_TREE) {
			return "bizagi.workportal.widgets.entitiestree";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_USERS_TABLE) {
			return "bizagi.workportal.widgets.userstable";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_DEFAULTS_ASSIGNATION_USER) {
			return "bizagi.workportal.widgets.admin.defaults.assignation.user";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USER_PROFILES) {
			return "bizagi.workportal.widgets.admin.user.profiles";
		}
		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ASYNC_ACTIVITIES) {
			return "bizagi.workportal.widgets.admin.async.activities";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ALARMS) {
			return "bizagi.workportal.widgets.admin.alarms";
		}
		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USER_LICENSES) {
			return "bizagi.workportal.widgets.admin.user.licenses";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_DIMENSIONS) {
			return "bizagi.workportal.widgets.admin.dimensions";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_DOCUMENT_TEMPLATES) {
			return "bizagi.workportal.widgets.admin.document.templates";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_PROCESSES) {
			return "bizagi.workportal.widgets.admin.processes";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES) {
			return "bizagi.workportal.widgets.admin.business.policies";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES_DECISION_TABLE) {
			return "bizagi.workportal.widgets.admin.business.policies.decision.table";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES_RULES) {
			return "bizagi.workportal.widgets.admin.business.policies.rules";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES_TABS) {
			return "bizagi.workportal.widgets.admin.business.policies.tabs";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES_POLITICS) {
			return "bizagi.workportal.widgets.admin.business.policies.politics";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_BUSINESS_POLICIES_VOCABULARIES) {
			return "bizagi.workportal.widgets.admin.business.policies.vocabularies";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_TREE) {
			return "bizagi.workportal.widgets.tree";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_LANGUAGE) {
			return "bizagi.workportal.widgets.admin.language";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ENTITIES) {
			return "bizagi.workportal.widgets.admin.entities";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_GRAPHIC_QUERY) {
			return "bizagi.workportal.widgets.graphicquery";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REASSIGN_CASE) {
			return "bizagi.workportal.widgets.reassigncase";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_USERS_ADMINISTRATION) {
			return "bizagi.workportal.widgets.admin.usersAdministration";
		}
        if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_STAKEHOLDERS) {
            return "bizagi.workportal.widgets.admin.stakeholders";
        }
		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_PREFERENCES) {
			return "bizagi.workportal.widgets.admin.preferences";
		}
		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_START_PROCESS) {
			return "bizagi.workportal.widgets.createcase";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROJECT_PROCESS_MAP) {
			return "bizagi.workportal.widgets.project.processMap";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROJECT_PROCESS_DIAGRAM_HELPER) {
			return "bizagi.workportal.widgets.project.processDiagram.helper";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROJECT_ACTIVITY_MAP_TOOLTIP) {
			return "bizagi.workportal.widgets.project.activityMap.tooltip";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROJECT_USERSUMMARY) {
			return "bizagi.workportal.widgets.usersummary";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_MYSEARCHLIST) {
			return "bizagi.workportal.widgets.mySearchList";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_LOADFORM) {
			return "bizagi.workportal.widgets.loadForm";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_TEMPLATE_ENGINE) {
			return "bizagi.workportal.widgets.templates";
		}

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_DIALOGNAV) {
			return "bizagi.workportal.widgets.dialognav";
		}

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROCESS_MODELER_VIEW) {
            return "bizagi.workportal.widgets.processmodeler";
        }

		if(widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_PROCESSES) {
		    return "bizagi.workportal.widgets.admin.adhoc.processes";
		}

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_ENTITIES) {
		    return "bizagi.workportal.widgets.admin.adhoc.entities";
		}

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_USER_GROUPS) {
		    return "bizagi.workportal.widgets.admin.adhoc.usergroup";
		}

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_BOOLEAN_EXP) {
		    return "bizagi.workportal.widgets.admin.adhoc.booleanexp";
		}

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADHOC_CREATE_PROCESS) {
            return "bizagi.workportal.widgets.adhoc.create.process";
        }

		return null;
	}

}, {
	/*
	 *   Constructor
	 */
	init: function(workportal, dataService) {
		this.templates = {};
		this.workportal = workportal;
		this.dataService = dataService;


		// Get the workportal's version
		this.getWorkPortalVersion();

		bizagi.injector.registerInstance('workportalFacade', this);
	},
	/*
	 *   Returns the current workportal
	 */
	getWorkportal: function() {
		return this.workportal;
	},
	/*
	 *   This function will load asynchronous stuff needed in the module
	 */
	initAsyncStuff: function(initializeTemplates) {
		var self = this;

		if(bizagi.enableCustomizations) {
			var loadTemplates = function() {
				// Load custom templates
				return bizagi.templateService.loadCustomTemplates().pipe(function(result) {
					if(initializeTemplates) {
						// Load default templates
						return self.loadTemplates();
					}

					return result;
				});
			};

			var loadJavascript = function() {
				// Load custom javascript overrides
				return bizagi.util.loadFile(
					{
					    src: bizagi.getJavaScript("bizagi.workportal.desktop.overrides"),
						type: "js"
					});
			};

			return $.when(loadTemplates(), this.loadPersonalizedTheme(), loadJavascript()).done(function(templates, themes, js) {
				// Load Custom styles
				bizagi.util.loadFile({
					src: bizagi.getStyleSheet("bizagi.overrides.desktop.custom.styles"),
					type: "css"
				});
			});
		} else {
			if(initializeTemplates) {
				return $.when(
					// Load default templates
					self.loadTemplates()
				);
			}

			// Return null as deferred response
			return null;
		}
	},
	/*
	 *   Load all the templates used in the workportal
	 */
	loadTemplates: function() {
		var self = this;
		var defer = new $.Deferred();

		$.when(
			self.loadTemplate("workportal", bizagi.getTemplate("bizagi.workportal.desktop")),
			self.loadTemplate("workportal.notCompatibleIE", bizagi.getTemplate("bizagi.workportal.desktop.notCompatibleIE")),
			self.loadTemplate("menu", bizagi.getTemplate("bizagi.workportal.desktop.menu") + "#ui-bizagi-workportal-widget-menu"),
			self.loadTemplate("menu.custom-button", bizagi.getTemplate("bizagi.workportal.desktop.menu") + "#ui-bizagi-workportal-widget-menu-custom-button"),
			self.loadTemplate("menu.security", bizagi.getTemplate("bizagi.workportal.desktop.menu") + "#ui-bizagi-workportal-widget-menu-permissions"),
			self.loadTemplate("menu.submenu", bizagi.getTemplate("bizagi.workportal.desktop.menu") + "#ui-bizagi-workportal-widget-menu-submenu"),
			self.loadTemplate("menu.submenu.container", bizagi.getTemplate("bizagi.workportal.desktop.menu") + "#ui-bizagi-workportal-widget-menu-submenu"),
			self.loadTemplate("menu.submenu.list", bizagi.getTemplate("bizagi.workportal.desktop.menu") + "#ui-bizagi-workportal-widget-menu-submenu-list"),
			self.loadTemplate("popup", bizagi.getTemplate("bizagi.workportal.desktop.popup")),
			self.loadTemplate("menu.modal.widgets", bizagi.getTemplate("bizagi.workportal.desktop.menu.modal.widgets")),
			self.loadTemplate("menu.modal.user", bizagi.getTemplate("bizagi.workportal.desktop.menu.modal.user")),
			self.loadTemplate("menu.modal.about", bizagi.getTemplate("bizagi.workportal.desktop.menu.modal.about")),

            //self.loadTemplate("filter-wrapper", bizagi.getTemplate("bizagi.workportal.desktop.filter.widgets") + "#column-filter-wrapper"),
            //self.loadTemplate("filter-string", bizagi.getTemplate("bizagi.workportal.desktop.filter.widgets") + "#column-filter-control-string"),
            //self.loadTemplate("filter-number", bizagi.getTemplate("bizagi.workportal.desktop.filter.widgets") + "#column-filter-control-number"),
            //self.loadTemplate("filter-date", bizagi.getTemplate("bizagi.workportal.desktop.filter.widgets") + "#column-filter-control-date"),
            //self.loadTemplate("filter-boolean", bizagi.getTemplate("bizagi.workportal.desktop.filter.widgets") + "#column-filter-control-boolean"),

			// Widgets
			//self.loadTemplate("inbox", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox") + "#ui-bizagi-workportal-widget-inbox"),
			//self.loadTemplate("inbox-cases", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox") + "#ui-bizagi-workportal-widget-inbox-cases"),
			//self.loadTemplate("inbox-cases-list", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox") + "#ui-bizagi-workportal-widget-inbox-cases-list"),
			//self.loadTemplate("inbox-cases-personalized-list", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox") + "#ui-bizagi-workportal-widget-inbox-cases-personalized-list"),
			//self.loadTemplate("inbox-grid", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.grid") + "#ui-bizagi-workportal-widget-inbox-grid"),
			//self.loadTemplate("inbox-grid-rubik", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.grid") + "#ui-bizagi-workportal-widget-inbox-grid-rubik"),
			//self.loadTemplate("inbox-grid-cases", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.grid") + "#ui-bizagi-workportal-widget-inbox-grid-cases"),
			//self.loadTemplate("inbox-common-processes", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-processes"),
			self.loadTemplate("inbox-common-pagination-grid", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-pagination-grid"),//sharepoint
			self.loadTemplate("inbox-common-pagination-inbox", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-pagination-inbox"),//webpart
			//self.loadTemplate("inbox-common-noresults", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-noresults"),
			self.loadTemplate("inbox-common-header", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-header"),//tablet
			//self.loadTemplate("inbox-common-header-view", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-header-view"),
			self.loadTemplate("inbox-common-header-folders", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-folders"),//no se usa
			//self.loadTemplate("inbox-common-case-summary", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-description"),
			//self.loadTemplate("inbox-common-case-summary-form", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-description-form"),
			//self.loadTemplate("inbox-common-case-summary-subprocess", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-description-subprocess"),
			//self.loadTemplate("inbox-common-case-summary-assignees", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-description-assignees"),
			//self.loadTemplate("inbox-common-case-summary-events", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-description-events"),
			//self.loadTemplate("inbox-common-case-summary-activities", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-description-activities"),
			self.loadTemplate("inbox-common-case-summary-oldrender", bizagi.getTemplate("bizagi.workportal.desktop.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-oldrender"),

			self.loadTemplate("loadForm", bizagi.getTemplate("bizagi.workportal.desktop.widget.loadForm") + "#ui-bizagi-workportal-widget-loadForm"),//webpart


			//self.loadTemplate("pagination", bizagi.getTemplate("bizagi.workportal.desktop.widgets.pagination") + "#ui-bizagi-workportal-widget-pagination"),
			//self.loadTemplate("pagination-list", bizagi.getTemplate("bizagi.workportal.desktop.widgets.pagination") + "#ui-bizagi-workportal-widget-pagination-list"),

			//self.loadTemplate("case-list-loading", bizagi.getTemplate("bizagi.workportal.desktop.widget.caseList") + "#ui-bizagi-workportal-widget-home-case-list-loading"),

			//self.loadTemplate("advance-search", bizagi.getTemplate("bizagi.workportal.desktop.widget.advanceSearch") + "#ui-bizagi-workportal-widget-home-advance-search"),

			//self.loadTemplate("fontsize", bizagi.getTemplate("bizagi.workportal.desktop.widget.fontsize")),
			//self.loadTemplate("print", bizagi.getTemplate("bizagi.workportal.desktop.widget.print") + "#bz-wp-widget-print"),
			//self.loadTemplate("release", bizagi.getTemplate("bizagi.workportal.desktop.widget.render") + "#bz-wp-widget-release"),
			self.loadTemplate("print-frame", bizagi.getTemplate("bizagi.workportal.desktop.widget.print") + "#bz-wp-widget-print-frame"),//rendering
			self.loadTemplate("print-frame-header", bizagi.getTemplate("bizagi.workportal.desktop.widget.print") + "#bz-wp-widget-print-frame-header"),//rendering
			//self.loadTemplate("routing", bizagi.getTemplate("bizagi.workportal.desktop.widget.routing")),
			self.loadTemplate("render", bizagi.getTemplate("bizagi.workportal.desktop.widget.render") + "#ui-bizagi-workportal-widget-render"),//webpart
			//self.loadTemplate("startForm", bizagi.getTemplate("bizagi.workportal.desktop.widget.startForm") + "#ui-bizagi-workportal-widget-start-form"),
			//self.loadTemplate("renderform", bizagi.getTemplate("bizagi.workportal.desktop.widget.renderform") + "#ui-bizagi-workportal-widget-renderform"),
			//self.loadTemplate("render-case-summary", bizagi.getTemplate("bizagi.workportal.desktop.widget.render") + "#ui-bizagi-workportal-widget-render-case-description"),
			//self.loadTemplate("comments", bizagi.getTemplate("bizagi.workportal.desktop.widget.comments") + "#ui-bizagi-workportal-widget-comments"),//no es un widget
			//self.loadTemplate("comments-list", bizagi.getTemplate("bizagi.workportal.desktop.widget.comments") + "#ui-bizagi-workportal-widget-comments-list"),
			//self.loadTemplate("comments-replies", bizagi.getTemplate("bizagi.workportal.desktop.widget.comments") + "#ui-bizagi-workportal-widget-comments-replies"),
			//self.loadTemplate("comments-dropdown", bizagi.getTemplate("bizagi.workportal.desktop.widget.comments") + "#ui-bizagi-workportal-widget-comments-dropdown"),
			//self.loadTemplate("comments-confirm", bizagi.getTemplate("bizagi.workportal.desktop.widget.comments") + "#ui-bizagi-workportal-widget-comments-confirm"),

			//self.loadTemplate("newCase", bizagi.getTemplate("bizagi.workportal.desktop.widget.newCase") + "#ui-bizagi-workportal-widget-newcase"),
			//self.loadTemplate("newCase-categories", bizagi.getTemplate("bizagi.workportal.desktop.widget.newCase") + "#ui-bizagi-workportal-widget-newcase-categories"),
			//self.loadTemplate("newCase-categories-tree", bizagi.getTemplate("bizagi.workportal.desktop.widget.newCase") + "#ui-bizagi-workportal-widget-newcase-categories-tree"),
			//self.loadTemplate("newCase-categories-recent-process", bizagi.getTemplate("bizagi.workportal.desktop.widget.newCase") + "#ui-bizagi-workportal-widget-recent-process"),
			//self.loadTemplate("newCase-categories-organization-list", bizagi.getTemplate("bizagi.workportal.desktop.widget.newCase") + "#ui-bizagi-workportal-widget-newcase-organization-list"),

			//self.loadTemplate("async", bizagi.getTemplate("bizagi.workportal.desktop.widget.async")),
			//self.loadTemplate("queries", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries") + "#ui-bizagi-workportal-widget-queries"),//herencia
			//self.loadTemplate("queries-elements", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries") + "#ui-bizagi-workportal-widget-queries-elements"),
			//self.loadTemplate("queries-definition-elements", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries") + "#ui-bizagi-workportal-widget-queries-definition-elements"),
			//self.loadTemplate("queries-empty-elements", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries") + "#ui-bizagi-workportal-widget-queries-empty-elements"),
			//self.loadTemplate("queries-flat-list", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries") + "#ui-bizagi-workportal-widget-queries-flat-list"),
			//self.loadTemplate("queries-query-tree", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries") + "#ui-bizagi-workportal-widget-queries-query-tree"),
			//self.loadTemplate("queries-query-confirm", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries") + "#ui-bizagi-workportal-widget-queries-confirm"),
			//self.loadTemplate("queries-query-message-error", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries") + "#ui-bizagi-workportal-widget-queries-message-error"),

			//self.loadTemplate("queries-shortcut", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries.shortcut") + "#ui-bizagi-workportal-widget-queries-shortcut"),
			//self.loadTemplate("queries-shortcut-flat-list", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries.shortcut") + "#ui-bizagi-workportal-widget-queries-flat-list-shortcut"),
			//self.loadTemplate("queries-shortcut-query-confirm", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries.shortcut") + "#ui-bizagi-workportal-widget-queries-confirm-shortcut"),
			//self.loadTemplate("queries-shortcut-query-message-error", bizagi.getTemplate("bizagi.workportal.desktop.widget.queries.shortcut") + "#ui-bizagi-workportal-widget-queries-message-error-shortcut"),

			//self.loadTemplate("reports", bizagi.getTemplate("bizagi.workportal.desktop.widget.reports") + "#ui-bizagi-workportal-widget-reports"),

            //self.loadTemplate("graphicquery-wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery") + "#ui-bizagi-workportal-widget-graphicquery-wrapper"),
			//self.loadTemplate("graphicquery-actionbar", bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery") + "#ui-bizagi-workportal-widget-graphicquery-actionbar"),//sharepoint
			//self.loadTemplate("graphicquery-summary", bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery") + "#ui-bizagi-workportal-widget-graphicquery-summary"),//sharepoint
			//self.loadTemplate("graphicquery-tooltip-currenttask", bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery") + "#ui-bizagi-workportal-widget-graphicquery-tooltip-currenttask"),//sharepoint
			//self.loadTemplate("graphicquery-tooltip-subcases", bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery") + "#ui-bizagi-workportal-widget-graphicquery-tooltip-subcases"),//sharepoint
			//self.loadTemplate("graphicquery-subcases", bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery") + "#ui-bizagi-workportal-widget-graphicquery-subcases"),//sharepoint
			//self.loadTemplate("graphicquery-parentsummary", bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery") + "#ui-bizagi-workportal-widget-graphicquery-parentsummary"),//sharepoint
			//self.loadTemplate("graphicquery-tooltip-users", bizagi.getTemplate("bizagi.workportal.desktop.widgets.graphicquery") + "#ui-bizagi-workportal-widget-graphicquery-tooltip-users"),//sharepoint

			//New Reports
			//self.loadTemplate("reportsChart", bizagi.getTemplate("bizagi.workportal.desktop.widget.reportsChart") + "#ui-bizagi-workportal-widget-reports-chart"),
			//self.loadTemplate("reportsMenu-container", bizagi.getTemplate("bizagi.workportal.desktop.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-container"),
			//self.loadTemplate("reportsMenu-items", bizagi.getTemplate("bizagi.workportal.desktop.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-items"),
			//self.loadTemplate("reportsMenu-itemsdata", bizagi.getTemplate("bizagi.workportal.desktop.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-itemsdata"),
			//self.loadTemplate("reportsMenu-tree", bizagi.getTemplate("bizagi.workportal.desktop.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-tree"),
			//self.loadTemplate("reportsMenu-noitems", bizagi.getTemplate("bizagi.workportal.desktop.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-noitems"),
			//self.loadTemplate("reportsMenu-edition", bizagi.getTemplate("bizagi.workportal.desktop.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-edition"),
			//self.loadTemplate("reportsMenu-vldmessage", bizagi.getTemplate("bizagi.workportal.desktop.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-vldnmessage"),
			//self.loadTemplate("reportsMenu-delete", bizagi.getTemplate("bizagi.workportal.desktop.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-delete"),

			//self.loadTemplate("reports-elements", bizagi.getTemplate("bizagi.workportal.desktop.widget.reports") + "#ui-bizagi-workportal-widget-reports-elements"),
			//self.loadTemplate("reports-empty-elements", bizagi.getTemplate("bizagi.workportal.desktop.widget.reports") + "#ui-bizagi-workportal-widget-reports-empty-elements"),
			//self.loadTemplate("reports-query-tree", bizagi.getTemplate("bizagi.workportal.desktop.widget.reports") + "#ui-bizagi-workportal-widget-reports-query-tree"),
			//self.loadTemplate("reports-query-confirm", bizagi.getTemplate("bizagi.workportal.desktop.widget.reports") + "#ui-bizagi-workportal-widget-reports-confirm"),
			//self.loadTemplate("reports-query-edit", bizagi.getTemplate("bizagi.workportal.desktop.widget.reports") + "#ui-bizagi-workportal-widget-reports-edit"),

			//self.loadTemplate("folders", bizagi.getTemplate("bizagi.workportal.desktop.widget.folders") + "#ui-bizagi-workportal-widget-folders"),
			//self.loadTemplate("folders-elements", bizagi.getTemplate("bizagi.workportal.desktop.widget.folders") + "#ui-bizagi-workportal-widget-folders-elements"),
			//self.loadTemplate("folders-elements-node", bizagi.getTemplate("bizagi.workportal.desktop.widget.folders") + "#ui-bizagi-workportal-widget-folders-element-node"),//no se usa
			//self.loadTemplate("folders-empty-elements", bizagi.getTemplate("bizagi.workportal.desktop.widget.folders") + "#ui-bizagi-workportal-widget-folders-empty-elements"),
			//self.loadTemplate("folders-query-tree", bizagi.getTemplate("bizagi.workportal.desktop.widget.folders") + "#ui-bizagi-workportal-widget-folders-query-tree"),
			//self.loadTemplate("folders-query-confirm", bizagi.getTemplate("bizagi.workportal.desktop.widget.folders") + "#ui-bizagi-workportal-widget-folders-confirm"),
			//self.loadTemplate("folders-query-edit", bizagi.getTemplate("bizagi.workportal.desktop.widget.folders") + "#ui-bizagi-workportal-widget-folders-edit"),//no se usa
			//self.loadTemplate("folders-default", bizagi.getTemplate("bizagi.workportal.desktop.widget.folders") + "#ui-bizagi-workportal-widget-folders-default"),
			//self.loadTemplate("folders-input-new", bizagi.getTemplate("bizagi.workportal.desktop.widget.folders") + "#ui-bizagi-workportal-widget-folders-input-new"),
			//self.loadTemplate("folders-add-case", bizagi.getTemplate("bizagi.workportal.desktop.widget.folders") + "#ui-bizagi-workportal-widget-folders-add-case"),

			//self.loadTemplate("smartfolders", bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders") + "#ui-bizagi-workportal-widget-smartfolders"),
			//self.loadTemplate("smartfolders-elements", bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders") + "#ui-bizagi-workportal-widget-smartfolders-elements"),
			//self.loadTemplate("smartfolders-elements-node", bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders") + "#ui-bizagi-workportal-widget-smartfolders-element-node"),//no se usa
			//self.loadTemplate("smartfolders-empty-elements", bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders") + "#ui-bizagi-workportal-widget-smartfolders-empty-elements"),
			//self.loadTemplate("smartfolders-query-tree", bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders") + "#ui-bizagi-workportal-widget-smartfolders-query-tree"),//no se usa
			//self.loadTemplate("smartfolders-query-confirm", bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders") + "#ui-bizagi-workportal-widget-smartfolders-confirm"),
			//self.loadTemplate("smartfolders-query-edit", bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders") + "#ui-bizagi-workportal-widget-smartfolders-edit"),//no se usa
			//self.loadTemplate("smartfolders-default", bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders") + "#ui-bizagi-workportal-widget-smartfolders-default"),
			//self.loadTemplate("smartfolders-input-new", bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders") + "#ui-bizagi-workportal-widget-smartfolders-input-new"),//no se usa
			//self.loadTemplate("smartfolders-add-case", bizagi.getTemplate("bizagi.workportal.desktop.widget.smartfolders") + "#ui-bizagi-workportal-widget-smartfolders-add-case"),

            //self.loadTemplate("queryform", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-frankenstein-queryform-wrapper"),
			//self.loadTemplate("queryform-wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-wrapper"),
			//self.loadTemplate("queryform-container", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-container"),
			//self.loadTemplate("queryform-buttons", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-buttons"),
			//self.loadTemplate("queryform-graphic-analysis", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-graphic-analysis"),
			//self.loadTemplate("queryform-result-set", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-result-set"),
			//self.loadTemplate("queryform-search-result", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-search-result"),
			//self.loadTemplate("queryform-pagination", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-pagination"),
			//self.loadTemplate("queryform-admin-result", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-admin-result"),
			//self.loadTemplate("queryform-share-selection", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-share-selection"),
			//self.loadTemplate("queryform-select-user", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-select-user"),
			//self.loadTemplate("queryform-select-group", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-select-group"),
			//self.loadTemplate("queryform-save-as", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform-save-as"),
			//self.loadTemplate("queryform-message-error", bizagi.getTemplate("bizagi.workportal.desktop.widget.queryform") + "#ui-bizagi-workportal-widget-queryform--message-error"),

            //self.loadTemplate("genericiframe", bizagi.getTemplate("bizagi.workportal.desktop.widget.genericiframe")),
            self.loadTemplate("search", bizagi.getTemplate("bizagi.workportal.desktop.widget.search") + "#ui-bizagi-workportal-widget-search"),//rendering
			//self.loadTemplate("search-details", bizagi.getTemplate("bizagi.workportal.desktop.widget.search") + "#ui-bizagi-workportal-widget-search-details"),
			//self.loadTemplate("integration-old-render", bizagi.getTemplate("bizagi.workportal.desktop.widget.oldrenderintegration") + "#ui-bizagi-workportal-widget-oldrender"),
			//self.loadTemplate("page", bizagi.getTemplate("bizagi.workportal.desktop.widget.page") + "#ui-bizagi-workportal-widget-page"),
			//self.loadTemplate("entities", bizagi.getTemplate("bizagi.workportal.desktop.widget.entities") + "#ui-bizagi-workportal-widget-entities"),
			//self.loadTemplate("error-message", bizagi.getTemplate("common.bizagi.desktop.error-message")),
			self.loadTemplate("info-message", bizagi.getTemplate("common.bizagi.desktop.info-message")),//rendering


			//Widgets - FRANKESNSTEIN

			// Admin widgets
			//self.loadTemplate("admin.cases", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.cases") + "#ui-bizagi-workportal-widget-admin-cases"),
			//self.loadTemplate("admin.users", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.usersAdministration") + "#ui-bizagi-workportal-widget-admin-users"),
			//self.loadTemplate("admin.users.formbuttons", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.usersAdministration") + "#ui-bizagi-workportal-widget-admin-users-formbuttons"),
			//self.loadTemplate("admin.users.log", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.usersAdministration") + "#ui-bizagi-workportal-widget-admin-users-log"),
			//self.loadTemplate("admin.users.licenses", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.usersAdministration") + "#ui-bizagi-workportal-widget-admin-users-licenses"),
			//self.loadTemplate("admin.users.email", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.usersAdministration") + "#ui-bizagi-workportal-widget-admin-users-email"),
			//self.loadTemplate("admin.search.cases", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.cases") + "#ui-bizagi-workportal-widget-admin-search-cases"),
			//self.loadTemplate("admin.search.users", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.cases") + "#ui-bizagi-workportal-widget-admin-search-users"),
			//self.loadTemplate("admin.table.users", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.cases") + "#ui-bizagi-workportal-widget-admin-table-users"),

			// Async ECM Upload widget
			//self.loadTemplate("async.ecm.upload", bizagi.getTemplate("bizagi.workportal.desktop.widgets.asyncecm.upload") + "#ui-bizagi-workportal-widget-async-ecm-upload"),
			//self.loadTemplate("async.ecm.pending.jobs", bizagi.getTemplate("bizagi.workportal.desktop.widgets.asyncecm.upload") + "#ui-bizagi-workportal-widget-async-ecm-upload-table-pending-jobs"),
			// Activity Log
			//self.loadTemplate("activity.log", bizagi.getTemplate("bizagi.workportal.desktop.widgets.activity.log") + "#ui-bizagi-workportal-widget-activity-log"),
			//self.loadTemplate("activity.log.general.content", bizagi.getTemplate("bizagi.workportal.desktop.widgets.activity.log") + "#ui-bizagi-workportal-widget-activity-log-general-content"),
			//self.loadTemplate("activity.log.header", bizagi.getTemplate("bizagi.workportal.desktop.widgets.activity.log") + "#ui-bizagi-workportal-widget-activity-log-header"),
			//self.loadTemplate("activity.log.detail.header", bizagi.getTemplate("bizagi.workportal.desktop.widgets.activity.log") + "#ui-bizagi-workportal-widget-activity-log-detail-header"),
			//self.loadTemplate("activity.log.detail.content", bizagi.getTemplate("bizagi.workportal.desktop.widgets.activity.log") + "#ui-bizagi-workportal-widget-activity-log-detail-content"),
			// Encrypt Passwords
			//self.loadTemplate("encrypt.passwords", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.encrypt.passwords") + "#ui-bizagi-workportal-widget-admin-encrypt-passwords"),
			// Authentication Log
			//self.loadTemplate("authentication.log", bizagi.getTemplate("bizagi.workportal.desktop.widgets.authentication.log") + "#ui-bizagi-workportal-widget-authentication-log"),
			//self.loadTemplate("authentication.log.fields", bizagi.getTemplate("bizagi.workportal.desktop.widgets.authentication.log") + "#ui-bizagi-workportal-widget-authentication-log-fields"),
			//self.loadTemplate("authentication.log.button", bizagi.getTemplate("bizagi.workportal.desktop.widgets.authentication.log") + "#ui-bizagi-workportal-widget-authentication-log-button"),
			//self.loadTemplate("authentication.log.result", bizagi.getTemplate("bizagi.workportal.desktop.widgets.authentication.log") + "#ui-bizagi-workportal-widget-authentication-log-result"),
			//self.loadTemplate("authentication.log.pagination", bizagi.getTemplate("bizagi.workportal.desktop.widgets.authentication.log") + "#ui-bizagi-workportal-widget-authentication-log-pagination"),
			// Administration Cases
			//self.loadTemplate("admin.case.search", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch") + "#ui-bizagi-workportal-widget-admin-case-search"),
			//self.loadTemplate("admin.case.search.fields", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch") + "#ui-bizagi-workportal-widget-admin-case-search-fields"),
			//self.loadTemplate("admin.case.search.button", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch") + "#ui-bizagi-workportal-widget-admin-case-search-buttons"),
			//self.loadTemplate("admin.case.search.result", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch") + "#ui-bizagi-workportal-widget-admin-case-search-result"),
			//self.loadTemplate("admin.case.search.pagination", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch") + "#ui-bizagi-workportal-widget-admin-case-search-pagination"),
			//self.loadTemplate("admin.case.search.invalidate", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch") + "#ui-bizagi-workportal-widget-admin-case-search-invalidate"),
			//self.loadTemplate("admin.case.search.reassign", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch") + "#ui-bizagi-workportal-widget-admin-case-search-reassign"),
			//self.loadTemplate("admin.case.search.reassign.form", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch") + "#ui-bizagi-workportal-widget-admin-case-search-reassign-form"),
			//self.loadTemplate("admin.case.search.action.result", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch") + "#ui-bizagi-workportal-widget-admin-case-search-action-result"),
			//self.loadTemplate("admin.case.search.quicksearch", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.caseSearch") + "#ui-bizagi-workportal-widget-admin-case-search-quicksearch"),

			// Process Tree
			//self.loadTemplate("processTree.links", bizagi.getTemplate("bizagi.workportal.desktop.widgets.processtree") + "#ui-bizagi-workportal-widget-processTree-links"),
			//self.loadTemplate("processTree.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.processtree") + "#ui-bizagi-workportal-widget-processTree-wrapper"),
			//self.loadTemplate("processTree", bizagi.getTemplate("bizagi.workportal.desktop.widgets.processtree") + "#ui-bizagi-workportal-widget-processTree"),
			//self.loadTemplate("processTree.selected", bizagi.getTemplate("bizagi.workportal.desktop.widgets.processtree") + "#ui-bizagi-workportal-widget-processTree-selected"),
			// Entities Tree
			//self.loadTemplate("EntitiesTree.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.entitiestree") + "#ui-bizagi-workportal-widget-entitiestree-wrapper"),
			//self.loadTemplate("EntitiesTree.tree", bizagi.getTemplate("bizagi.workportal.desktop.widgets.entitiestree") + "#ui-bizagi-workportal-widget-entitiestree"),
			// Users Table
			//self.loadTemplate("usersTable.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.userstable") + "#ui-bizagi-workportal-widget-usersTable-wrapper"),
			//self.loadTemplate("usersTable.form", bizagi.getTemplate("bizagi.workportal.desktop.widgets.userstable") + "#ui-bizagi-workportal-widget-usersTable-form"),
			//self.loadTemplate("usersTable.table", bizagi.getTemplate("bizagi.workportal.desktop.widgets.userstable") + "#ui-bizagi-workportal-widget-usersTable-table"),
			//self.loadTemplate("usersTable.message", bizagi.getTemplate("bizagi.workportal.desktop.widgets.userstable") + "#ui-bizagi-workportal-widget-usersTable-message"),
			// Users Request
			//self.loadTemplate("users.requests", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.users.requests") + "#ui-bizagi-workportal-widget-admin-users-requests"),
			//self.loadTemplate("users.requests.list", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.users.requests") + "#ui-bizagi-workportal-widget-admin-users-requests-list"),
			//self.loadTemplate("users.requests.detail", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.users.requests") + "#ui-bizagi-workportal-widget-admin-users-requests-detail"),
			//self.loadTemplate("users.requests.pagination", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.users.requests") + "#ui-bizagi-workportal-widget-admin-users-requests-pagination"),
			//self.loadTemplate("users.requests.email", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.users.requests") + "#ui-bizagi-workportal-widget-admin-users-requests-email"),

			//Alarms
			//self.loadTemplate("alarms", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms") + "#ui-bizagi-workportal-widget-admin-alarms"),
			//self.loadTemplate("alarms.task.list", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms") + "#ui-bizagi-workportal-widget-admin-alarms-list"),
			//self.loadTemplate("alarms.task.list.item", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms") + "#ui-bizagi-workportal-widget-admin-alarms-list-item"),
			//self.loadTemplate("alarms.task.detail", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms") + "#ui-bizagi-workportal-widget-admin-alarms-detail"),
			//self.loadTemplate("alarms.task.detail.alarm.editor", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms") + "#ui-bizagi-workportal-widget-admin-alarms-alarm-editor"),
			//self.loadTemplate("alarms.task.detail.list.table", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms") + "#ui-bizagi-workportal-widget-admin-alarms-detail-list-table"),
			//self.loadTemplate("alarms.task.detail.alarm.recipients", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms") + "#ui-bizagi-workportal-widget-admin-alarms-detail-alarm-recipients"),
			//self.loadTemplate("alarms.task.detail.alarm.recipients.table", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.alarms") + "#ui-bizagi-workportal-widget-admin-alarms-detail-alarm-recipients-table"),

			//Default Assignation User
			//self.loadTemplate("defaults.assignation.user", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.defaults.assignation.user") + "#ui-bizagi-workportal-widget-admin-defaults-assignation-user"),
			//self.loadTemplate("defaults.assignation.user.fields", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.defaults.assignation.user") + "#ui-bizagi-workportal-widget-admin-defaults-assignation-user-fields"),
			//self.loadTemplate("defaults.assignation.user.search", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.defaults.assignation.user") + "#ui-bizagi-workportal-widget-admin-defaults-assignation-user-search"),

			//User Profiles
			//self.loadTemplate("user.profiles", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.user.profiles") + "#ui-bizagi-workportal-widget-admin-user-profiles"),
			//self.loadTemplate("user.profiles.fields", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.user.profiles") + "#ui-bizagi-workportal-widget-admin-user-profiles-fields"),
			//self.loadTemplate("user.profiles.table", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.user.profiles") + "#ui-bizagi-workportal-widget-admin-user-profiles-table"),
			//self.loadTemplate("user.profiles.table.administrator", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.user.profiles") + "#ui-bizagi-workportal-widget-admin-user-profiles-table-administrator"),

            // Asynchronous Activities
			//self.loadTemplate("admin.async.activities", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities") + "#ui-bizagi-workportal-widget-admin-async-activities"),
			//self.loadTemplate("admin.async.activities.tabs", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities") + "#ui-bizagi-workportal-widget-admin-async-activities-tabs"),
			//self.loadTemplate("admin.async.activities.tab1", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities") + "#ui-bizagi-workportal-widget-admin-async-activities-tab1"),
			//self.loadTemplate("admin.async.activities.tab2", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities") + "#ui-bizagi-workportal-widget-admin-async-activities-tab2"),
			//self.loadTemplate("admin.async.activities.log", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities") + "#ui-bizagi-workportal-widget-admin-async-activities-log"),
			//self.loadTemplate("admin.async.activities.pagination", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities") + "#ui-bizagi-workportal-widget-admin-async-activities-pagination"),
			//self.loadTemplate("admin.async.activities.error.page", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities") + "#ui-bizagi-workportal-widget-admin-async-activities-error-page"),
			//self.loadTemplate("admin.async.activities.processing", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.async.activities") + "#ui-bizagi-workportal-widget-admin-async-activities-processing"),

			//Licenses
			//self.loadTemplate("user.licenses", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.user.licenses") + "#ui-bizagi-workportal-widget-admin-user-licenses"),

			//Dimensions
			//self.loadTemplate("dimensions", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.dimensions") + "#ui-bizagi-workportal-widget-admin-dimensions"),
			//self.loadTemplate("dimensions.administrable", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.dimensions") + "#ui-bizagi-workportal-widget-admin-dimensions-administrable"),
			//self.loadTemplate("dimensions.properties", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.dimensions") + "#ui-bizagi-workportal-widget-admin-dimensions-properties"),
			//self.loadTemplate("dimensions.edit.properties", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.dimensions") + "#ui-bizagi-workportal-widget-admin-dimensions-edit-properties"),
			//self.loadTemplate("dimensions.process.tree", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.dimensions") + "#ui-bizagi-workportal-widget-admin-dimensions-process-tree"),

			//Templates
			//self.loadTemplate("admin.document.templates", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.document.templates") + "#ui-bizagi-workportal-widget-admin-document-templates"),
			//self.loadTemplate("admin.document.templates.upload.template", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.document.templates") + "#ui-bizagi-workportal-widget-admin-document-templates-upload-template"),
			//self.loadTemplate("admin.document.templates.uploaded.templates.list", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.document.templates") + "#ui-bizagi-workportal-widget-admin-document-templates-uploaded-template-list"),


			//Processes
			//self.loadTemplate("admin.processes.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.processes") + "#ui-bizagi-workportal-widget-admin-processes-wrapper"),
			//self.loadTemplate("admin.processes.combo.process", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.processes") + "#ui-bizagi-workportal-widget-admin-processes-combo-process"),
			//self.loadTemplate("admin.processes.proc.edit", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.processes") + "#ui-bizagi-workportal-widget-admin-processes-process-edit"),
			//self.loadTemplate("admin.processes.task.edit", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.processes") + "#ui-bizagi-workportal-widget-admin-processes-task-edit"),

			//Business Policies
			//self.loadTemplate("admin.business.policies.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-wrapper"),
			//self.loadTemplate("admin.business.policies.decision.table.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-decision-table-wrapper"),
			//self.loadTemplate("admin.business.policies.rules.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-rules-wrapper"),
			//self.loadTemplate("admin.business.policies.tabs.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-tabs-wrapper"),
			//self.loadTemplate("admin.business.policies.politics.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-politics-wrapper"),
			//self.loadTemplate("admin.business.policies.vocabularies.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-vocabularies-wrapper"),
			//self.loadTemplate("admin.business.policies.content", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-content"),
			//self.loadTemplate("admin.business.policies.decision.table.content", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-decision-table-content"),
			//self.loadTemplate("admin.business.policies.rules.content", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-rules-content"),
			//self.loadTemplate("admin.business.policies.tabs.content", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-tabs-content"),
			//self.loadTemplate("admin.business.policies.politics.content", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-politics-content"),
			//self.loadTemplate("admin.business.policies.vocabularies.content", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.business.policies") + "#ui-bizagi-workportal-widget-admin-business-policies-vocabularies-content"),

			//Language
			//self.loadTemplate("admin.language.panel.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language") + "#ui-bizagi-workportal-widget-admin-language-panel-wrapper"),
			//self.loadTemplate("admin.language.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language") + "#ui-bizagi-workportal-widget-admin-language-wrapper"),
			//self.loadTemplate("admin.language.template.list", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language") + "#ui-bizagi-workportal-widget-admin-language-template-list"),
			//self.loadTemplate("admin.language.upload.file.culturename", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language") + "#ui-bizagi-workportal-widget-admin-language-combo-culturename"),
			//self.loadTemplate("admin.language.bizagi.objects.list", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language") + "#ui-bizagi-workportal-widget-admin-language-bizagi-objects-list"),
			//self.loadTemplate("admin.language.entities.list", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.language") + "#ui-bizagi-workportal-widget-admin-language-entities-list"),

            //Entity
			//self.loadTemplate("admin.entity.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.entities") + "#ui-bizagi-workportal-widget-admin-entity-wrapper"),
			//self.loadTemplate("admin.entity.panel.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.entities") + "#ui-bizagi-workportal-widget-admin-entity-panel-wrapper"),
			//self.loadTemplate("admin.entity.list", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.entities") + "#ui-bizagi-workportal-widget-admin-entity-list"),
			//self.loadTemplate("admin.entity.detail", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.entities") + "#ui-bizagi-workportal-widget-admin-entity-detail"),
			//self.loadTemplate("admin.entity.detail.pagination", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.entities") + "#ui-bizagi-workportal-widget-admin-entity-detail-pagination"),
			//self.loadTemplate("admin.entity.buttons.form", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.entities") + "#ui-bizagi-workportal-widget-admin-entity-buttons-form"),
			//self.loadTemplate("admin.entity.detail.frankenstein", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.entities") + "#ui-bizagi-workportal-widget-admin-entity-frankenstein"),
			//self.loadTemplate("admin.entity.detail.message.error", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.entities") + "#ui-bizagi-workportal-widget-admin-entity-message-error"),
			//Preferences
			//self.loadTemplate("admin.preferences.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.preferences") + "#ui-bizagi-workportal-widget-admin-preferences-wrapper"),
			//self.loadTemplate("admin.preferences.container", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.preferences") + "#ui-bizagi-workportal-widget-preferences-container"),
			//self.loadTemplate("admin.preferences.buttons", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.preferences") + "#ui-bizagi-workportal-widget-preference-buttons"),
			//self.loadTemplate("admin.preferences.iframe", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.preferences") + "#ui-bizagi-workportal-widget-preference-iframe"),
			//self.loadTemplate("admin.preferences.error", bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.preferences") + "#ui-bizagi-workportal-widget-preferences-errormessage"),

			// Tree
			//self.loadTemplate("tree.wrapper", bizagi.getTemplate("bizagi.workportal.desktop.widgets.tree") + "#ui-bizagi-workportal-widget-tree-wrapper"),
			//self.loadTemplate("tree.content", bizagi.getTemplate("bizagi.workportal.desktop.widgets.tree") + "#ui-bizagi-workportal-widget-tree-content"),

			//Upload dialog
			self.loadTemplate("bizagi.workportal.desktop.upload.dialog", bizagi.getTemplate("bizagi.workportal.desktop.upload.dialog")),//no se usa
			self.loadTemplate("bizagi.workportal.desktop.fileupload.form", bizagi.getTemplate("bizagi.workportal.desktop.fileupload.form"))//no se usa

			//My search
			//self.loadTemplate("mySearchListWrapper", bizagi.getTemplate("bizagi.workportal.desktop.widget.mySearchList") + "#ui-bizagi-workportal-widget-mysearchlist-searchlists-wrapper"),
			//self.loadTemplate("mySearchList", bizagi.getTemplate("bizagi.workportal.desktop.widget.mySearchList") + "#ui-bizagi-workportal-widget-mysearchlist-searchlists")

			// End of Widgets - FRANKENSTEIN

		).done(function() {
				// Resolve when all templates are loaded
				defer.resolve();
			});

		return defer.promise();
	},
	/*
	 *   Load one template and save it internally
	 */
	loadTemplate: function(template, templateDestination) {
		var self = this;

		// Go fetch the template
		return bizagi.templateService.getTemplate(templateDestination)
			.done(function(resolvedRemplate) {
				self.templates[template] = resolvedRemplate;
			});
	},
	/*
	 *   Load one template and save it internally
	 */
	loadTemplateWebpart: function(template, templateDestination) {
		var self = this;

		// Go fetch the template
		return bizagi.templateService.getTemplateWebpart(templateDestination)
			.done(function(resolvedRemplate) {
				self.templates[template] = resolvedRemplate;
			});
	},
	/*
	 *   Method to fetch templates from a private dictionary
	 */
	getTemplate: function(template) {
		var self = this;
		return self.templates[template];
	},
	/*
	 *   Returns the main controller to be used
	 */
	getMainController: function() {
		return new bizagi.workportal.controllers.main(this, this.dataService);
	},
	/*
	 *   Returns the menu controller to be used
	 */
	getMenuController: function() {
		return new bizagi.workportal.controllers.menu(this, this.dataService);
	},
	/*
	 *   Returns the workarea controller to be used
	 */
	getWorkareaController: function() {
		return new bizagi.workportal.controllers.workarea(this, this.dataService);
	},
	/*
	 *   Returns the desired widget
	 */
	getWidget: function(widget, params) {
		var self = this;
		var widgetImplementation = this.Class.getWidgetImplementation(widget);
		if(widgetImplementation) {
			try {
				// Create a dynamic function to avoid problem with eval calls when minifying the code
				var dynamicFunction = "var baDynamicFn = function(facade, dataService, params){ \r\n";
				dynamicFunction += "return new " + widgetImplementation + "(facade, dataService, params);\r\n";
				dynamicFunction += "}\r\n";
				dynamicFunction += "baDynamicFn";
				dynamicFunction = eval(dynamicFunction);

				// Call the dynamic function
				return dynamicFunction(this, this.dataService, params);
			} catch(e) {
			}

		} else {
			// Try a webpart plus load it asynchronously
			var defer = new $.Deferred();
			var webpart = bizagi.getWebpart(widget);
			if(webpart) {
				// Ensure the webpart is initialized
				$.when(bizagi.util.initWebpart(webpart))
					.done(function() {
						// Resolve with the current class
						defer.resolve(new bizagi.workportal.widgets.webpart(self, self.dataService, $.extend(params, {
							webpart: widget
						})));
					});
				return defer.promise();
			}
		}

		// No type supported
		bizagi.log(widget + " widget not supported", params, "error");
		return null;
	},
	/*
	 *   Returns the desired action
	 */
	getAction: function(action, params) {
		if(action == bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING) {
			return new bizagi.workportal.actions.routing(this, this.dataService, params);
		}

		if(action == bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH) {
			return new bizagi.workportal.actions.search(this, this.dataService, params);
		}

		// No type supported
		bizagi.log(action + " action not supported", params, "error");
		return null;
	},
	/*
	 *   Initializes a webpart
	 */
	loadWebpart: function(params) {
		var self = this;
		var defer = new $.Deferred();
		var webpartName = params.webpart;
		var webpart = bizagi.getWebpart(webpartName);
		if(!webpart) {
			bizagi.webparts.addConfigurationMessage(params, "bizagi-sharepoint-loading-webpart-error");
		}

		// Ensure the webpart is initialized
		$.when(bizagi.util.initWebpart(webpart))
			.done(function() {

				// Load all templates asyncronously
				$.when.apply(this, $.map(webpart.tmpl, function(tmpl) {
					return self.loadTemplateWebpart(tmpl.originalAlias, bizagi.getTemplate(tmpl.alias, true));
				})).done(function() {
					defer.resolve();
				});

			});

		return defer.promise();
	},
	/*
	 *   Returns a webpart
	 */
	getWebpart: function(webpartName, params) {
		var webpart = bizagi.getWebpart(webpartName);
		var webpartImplementation = webpart["class"];

		if(webpartImplementation) {
			try {
				// Create a dynamic function to avoid problem with eval calls when minifying the code
				var dynamicFunction = "var baDynamicFn = function(facade, dataService, params){ \r\n";
				dynamicFunction += "return new " + webpartImplementation + "(facade, dataService, params);\r\n";
				dynamicFunction += "}\r\n";
				dynamicFunction += "baDynamicFn";
				dynamicFunction = eval(dynamicFunction);

				// Call the dynamic function
				return dynamicFunction(this, this.dataService, params);
			} catch(e) {
				bizagi.log(e);
			}
		}

		// No type supported
		bizagi.log(webpartName + " webpart not supported", params, "error");
		return null;
	},
	/**
	 * Load predefined theme
	 */
	loadPersonalizedTheme: function() {
		var self = this;
		// Calling service
		//Skip the load theme only if is windows 8 App
		if(typeof Windows === "undefined") {
			$.when(self.dataService.getCurrentTheme()).done(function(data) {
				data = data || [];

				//gets the logo from theme data if it's not data it takes it from the path
				bizagi.themeLogo = data.logo || "img/img/barra/logo-bizagi.svg";
				$("#ui-bizagi-wp-app-menu-logo-client img").attr("src", bizagi.themeLogo);

				if(data.css) {
					// Create new css element

					var styles = $('head link [rel="stylesheet"]');
					var customStyles;

					for(var i = 0; i < styles.length; i++) {
						var href = $(styles[i]).attr('href');

						var match = href.indexOf('bizagi.custom.styles.css');

						if(match != -1) {
							customStyles = $(styles[i]);
							break;
						}

                    };

					if(customStyles) {
						$('<style id="bizagi-theme">' + data.css + '</style>').insertBefore(customStyles);
					} else {
						$('head').append('<style id="bizagi-theme">' + data.css + '</style>');
					}
				}
			});
		}
	},
	/**
	 * Gets the current workportal version
	 */
	getWorkPortalVersion: function() {
	    var self = this;
	    bizagi.setWorkPortalVersion(bizagi.loader.version)
		// Calling service
		/*$.when(self.dataService.getWorkPortalVersion()).done(function(data) {
			bizagi.setWorkPortalVersion(data);
		});
        */
	}
});
