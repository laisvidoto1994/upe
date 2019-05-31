/*
*   Name: BizAgi Tablet Workportal Facade
*   Author: Diego Parra
*   Comments:
*   -   This script will define a workportal facade to access to all components
*/


$.Class.extend("bizagi.workportal.tablet.facade", {
	
	/*
	*   Returns the implementation class by widget
	*/
	getWidgetImplementation: function(widget) {

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX) {
			return "bizagi.workportal.widgets.inbox";
		}

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID) {
			return "bizagi.workportal.widgets.inboxGrid";
		}

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ROUTING) {
			return "bizagi.workportal.widgets.routing";
		}

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_RENDER) {
			return "bizagi.workportal.widgets.render";
        }

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_START_FORM) {
            return "bizagi.workportal.widgets.startForm";
        }

	    if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS_MENU) {
            return "bizagi.workportal.widgets.reportsMenu";
        }

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS_CHART) {
            return "bizagi.workportal.widgets.reportsChart";
        }

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_NEWCASE) {
			return "bizagi.workportal.widgets.newCase";
		}

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ASYNC) {
			return "bizagi.workportal.widgets.async";
		}

		if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH) {
			return "bizagi.workportal.widgets.search";
                }
                
                if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_OLDRENDERINTEGRATION) {
                        return "bizagi.workportal.widgets.oldrenderintegration";
                }
                
                if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_COMPLEXGATEWAY) {
                        return "bizagi.workportal.widgets.complexgateway";
                }
                

		return null;
	}
	
}, {

    /* 
    *   Constructor
    */
    init: function (workportal, dataService) {
        this.templates = {};
        this.workportal = workportal;
        this.dataService = dataService;

        // Add meta to head in order to disable zoom
        this.setIPadMetaTags();
        // Get the workportal's version
        this.getWorkPortalVersion();
    },

    /*
    *   Returns the current workportal
    */
    getWorkportal: function () {
        return this.workportal;
    },
    
    /* SETS iPad META TAGS
    =====================================================*/
    setIPadMetaTags: function () {
                
        // Removes iPad address bar when launched from home screen // temporarily disabled
        /*
        $('<meta>', {
            name : "apple-mobile-web-app-capable",
            content : "yes"
        }).appendTo('head');
        */
        // Disables safari zooming on iPad when running as web app
        $('<meta>', {
            name : "viewport",
            content : "width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        }).appendTo('head');
        
        $('<link>', {
            rel : 'apple-touch-icon-precomposed',
            href : 'jquery/css/bizagi/tablet/images/BizAgi_logo.png'
        }).appendTo('head');
        
        /*$('<link>', {
            rel: 'apple-touch-startup-image',
            href: 'jquery/css/bizagi/tablet/images/splash-screen-landscape.png',
            media: '(orientation:landscape)'
        }).appendTo('head');
        
        $('<link>', {
            rel: 'apple-touch-startup-image',
            href: 'jquery/css/bizagi/tablet/images/splash-screen-portrait.png',
            media: '(orientation:portrait)'
        }).appendTo('head');*/
    },
	
	/*
	*   This function will load asynchronous stuff needed in the module
	*/
	initAsyncStuff: function () {
		var self = this;
		if (bizagi.enableCustomizations) {
			return $.when(
		            // Load custom templates
				bizagi.templateService.loadCustomTemplates()
					.pipe(function() {
						// Load default templates	
						return self.loadTemplates();
					}),
			        // Load Custom styles
				bizagi.util.loadFile({
				    src: bizagi.getStyleSheet("bizagi.overrides." + bizagi.detectDevice() + ".custom.styles"),
						type: "css"
					}),
			        // Load custom javascript overrides
				bizagi.util.loadFile({
				    src: bizagi.getJavaScript("bizagi.workportal." + bizagi.detectDevice() + ".overrides"),
						type: "js"
					})
               );
		} else {
			return $.when(
			        // Load default templates	
                    self.loadTemplates()
               );
		}
	},

    /*
    *   Load all the templates used in the workportal
    */
    loadTemplates: function () {
        var self = this;
        var defer = new $.Deferred();

        var tmplMenu = (bizagi.detectDevice() == "tablet_android") ? "bizagi.workportal.tablet.android.menu" : "bizagi.workportal.tablet.ios.menu";
        
        $.when(
            self.loadTemplate("workportal", bizagi.getTemplate("bizagi.workportal.tablet")),
            self.loadTemplate("menu", bizagi.getTemplate(tmplMenu) + "#ui-bizagi-workportal-menu-content"),
            self.loadTemplate("menu.items", bizagi.getTemplate(tmplMenu) + "#ui-bizagi-workportal-widget-menu-items"),
            self.loadTemplate("menu.modal.items.inbox", bizagi.getTemplate(tmplMenu) + "#ui-bizagi-workportal-widget-menu-items-modal"),   
            self.loadTemplate("menu.modal.input-tray", bizagi.getTemplate(tmplMenu) + "#ui-bizagi-workportal-widget-menu-input-tray-modal"),   
            self.loadTemplate("popup", bizagi.getTemplate("bizagi.workportal.tablet.popup")),
            self.loadTemplate("workportal.notCompatibleIOS", bizagi.getTemplate("bizagi.workportal.tablet.notCompatibleIOS")),
            self.loadTemplate("bizagi.workportal.tablet.unavailable", bizagi.getTemplate("bizagi.workportal.tablet.unavailable")),
            
            // Widgets 
            self.loadTemplate("inbox", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox")),
            self.loadTemplate("inbox.common.processes", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-processes"),
            self.loadTemplate("inbox.common.case-list", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-cases-personalized-list"),
            self.loadTemplate("inbox.common.case-summary", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-summary"),
            
            self.loadTemplate("inbox-common-pagination-grid", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-pagination-grid"),
            self.loadTemplate("inbox-common-pagination-inbox", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-pagination-inbox"),
            self.loadTemplate("inbox-common-noresults", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-noresults"),
            self.loadTemplate("inbox-common-header", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-header"),
            self.loadTemplate("inbox-common-header-view", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-header-view"),                                               
            self.loadTemplate("inbox-common-case-summary-form", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-description-form"),
            self.loadTemplate("inbox-common-case-summary-subprocess", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-description-subprocess"),
            self.loadTemplate("inbox-common-case-summary-assignees", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-description-assignees"),
            self.loadTemplate("inbox-common-case-summary-events", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-description-events"),
            self.loadTemplate("inbox-common-case-summary-activities", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.common") + "#ui-bizagi-workportal-widget-inbox-common-case-description-activities"),
            
            //self.loadTemplate("inbox-grid", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.grid")),
            self.loadTemplate("inbox-grid", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.grid") + "#ui-bizagi-workportal-widget-inbox-grid"),
            self.loadTemplate("inbox-grid-cases", bizagi.getTemplate("bizagi.workportal.tablet.widget.inbox.grid") + "#ui-bizagi-workportal-widget-inbox-grid-cases"),
            
            //reports templates

            self.loadTemplate("reportsChart", bizagi.getTemplate("bizagi.workportal.tablet.widget.reportsChart") + "#ui-bizagi-workportal-widget-reports-chart"),
            self.loadTemplate("reportsMenu-container", bizagi.getTemplate("bizagi.workportal.tablet.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-container"),
            self.loadTemplate("reportsMenu-items", bizagi.getTemplate("bizagi.workportal.tablet.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-items"),
            self.loadTemplate("reportsMenu-itemsdata", bizagi.getTemplate("bizagi.workportal.tablet.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-itemsdata"),
            self.loadTemplate("reportsMenu-tree", bizagi.getTemplate("bizagi.workportal.tablet.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-tree"),
            self.loadTemplate("reportsMenu-noitems", bizagi.getTemplate("bizagi.workportal.tablet.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-noitems"),
            self.loadTemplate("reportsMenu-edition", bizagi.getTemplate("bizagi.workportal.tablet.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-edition"),
            self.loadTemplate("reportsMenu-vldmessage", bizagi.getTemplate("bizagi.workportal.tablet.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-vldnmessage"),
            self.loadTemplate("reportsMenu-delete", bizagi.getTemplate("bizagi.workportal.tablet.widget.reportsMenu") + "#ui-bizagi-workportal-widget-reportsmenu-delete"),

            self.loadTemplate("routing", bizagi.getTemplate("bizagi.workportal.tablet.widget.routing")),
            self.loadTemplate("complex-gateway-frame", bizagi.getTemplate("bizagi.workportal.tablet.widget.complexgateway") + "#ui-bizagi-wp-app-complexgateway-frame"),
            self.loadTemplate("complex-gateway-header", bizagi.getTemplate("bizagi.workportal.tablet.widget.complexgateway") + "#ui-bizagi-wp-app-complexgateway-header"),
            self.loadTemplate("complex-gateway-row", bizagi.getTemplate("bizagi.workportal.tablet.widget.complexgateway") + "#ui-bizagi-wp-app-complexgateway-row"),
            self.loadTemplate("newCase", bizagi.getTemplate("bizagi.workportal.tablet.widget.newCase") + "#ui-bizagi-workportal-widget-newcase"),
            self.loadTemplate("newCase-categories", bizagi.getTemplate("bizagi.workportal.tablet.widget.newCase") + "#ui-bizagi-workportal-widget-newcase-categories"),
            self.loadTemplate("newCase-categories-tree", bizagi.getTemplate("bizagi.workportal.tablet.widget.newCase") + "#ui-bizagi-workportal-widget-newcase-categories-tree"),
            self.loadTemplate("newCase-categories-recent-process", bizagi.getTemplate("bizagi.workportal.tablet.widget.newCase") + "#ui-bizagi-workportal-widget-recent-process"),
            self.loadTemplate("async", bizagi.getTemplate("bizagi.workportal.tablet.widget.async")),
            self.loadTemplate("render", bizagi.getTemplate("bizagi.workportal.tablet.widget.render") + "#ui-bizagi-workportal-widget-render"),
            self.loadTemplate("startForm", bizagi.getTemplate("bizagi.workportal.tablet.widget.startForm") + "#ui-bizagi-workportal-widget-start-form"),
            self.loadTemplate("render-case-summary", bizagi.getTemplate("bizagi.workportal.tablet.widget.render") + "#ui-bizagi-workportal-widget-render-case-description"),
            self.loadTemplate("search", bizagi.getTemplate("bizagi.workportal.tablet.widget.search") + "#ui-bizagi-workportal-widget-search"),
           // self.loadTemplate("search-details", bizagi.getTemplate("bizagi.workportal.tablet.widget.search") + "#ui-bizagi-workportal-widget-search-details"),
            self.loadTemplate("search-field", bizagi.getTemplate("bizagi.workportal.tablet.widget.search") + "#ui-bizagi-workportal-widget-search-inputfield"),
            //common info message
            self.loadTemplate("info-message", bizagi.getTemplate("common.bizagi.tablet.info-message")),
            self.loadTemplate("integration-old-render", bizagi.getTemplate("bizagi.workportal.tablet.widget.oldrenderintegration") + "#ui-bizagi-workportal-widget-oldrender")

            ).done(function () {
            // Resolve when all templates are loaded
            defer.resolve();
            
        });

        return defer.promise();
    },

    /*
    *   Load one template and save it internally
    */
    loadTemplate: function (template, templateDestination) {
        var self = this;

        // Go fetch the template
        return bizagi.templateService.getTemplate(templateDestination)
        .done(function (resolvedRemplate) {
            self.templates[template] = resolvedRemplate;
        });
    },

    /*
    *   Method to fetch templates from a private dictionary
    */
    getTemplate: function (template) {
        var self = this;
        return self.templates[template];
    },
    
    /*
    *   Returns the main controller to be used
    */        
    getMainController: function(){
        return new bizagi.workportal.controllers.main(this, this.dataService);
    },
    
    /*
    *   Returns the menu controller to be used
    */        
    getMenuController: function(){
        return new bizagi.workportal.controllers.menu(this, this.dataService);
    },
    
    /*
    *   Returns the workarea controller to be used
    */        
    getWorkareaController: function(){
        return new bizagi.workportal.controllers.workarea(this, this.dataService);
    },
    
    /*
    *   Returns the desired widget
    */        
    getWidget: function(widget, params){
    	var widgetImplementation = this.Class.getWidgetImplementation(widget);
    	if (widgetImplementation) {
    		try {
            	// Create a dynamic function to avoid problem with eval calls when minifying the code
            	var dynamicFunction = "var baDynamicFn = function(facade, dataService, params){ \r\n";
        	    dynamicFunction +=      "return new " + widgetImplementation + "(facade, dataService, params);\r\n";
        	    dynamicFunction += "}\r\n";
            	dynamicFunction += "baDynamicFn";
            	dynamicFunction = eval(dynamicFunction);
            	
            	// Call the dynamic function
                return  dynamicFunction(this, this.dataService, params);
            } catch (e) { }
    	}
    	
        // No type supported
        bizagi.log(widget + " widget not supported", params, "error");
        return null;
    },
    
    /*
    *   Returns the desired action
    */        
    getAction: function(action, params){
        if (action == bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING) {
            return new bizagi.workportal.actions.routing(this, this.dataService, params);
        } 
        
        if (action == bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH) {
            return new bizagi.workportal.actions.search(this, this.dataService, params);
        } 
        
        // No type supported
        bizagi.log(action + " action not supported", params, "error");
        return null;
    },
    /**
    * Gets the current workportal version
    */
    getWorkPortalVersion: function () {
        var self = this;
        // Calling service
        $.when(self.dataService.getWorkPortalVersion()).done(function (data) {
            bizagi.setWorkPortalVersion(data.version);
        });


    }
});
