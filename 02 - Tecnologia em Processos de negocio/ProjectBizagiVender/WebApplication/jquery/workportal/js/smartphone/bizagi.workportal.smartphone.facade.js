/*
*   Name: BizAgi Smartphone Workportal Facade
*   Author: Diego Parra
*   Comments:
*   -   This script will define a workportal facade to access to all components
*/


$.Class.extend("bizagi.workportal.smartphone.facade", {

    /*
    *   Returns the implementation class by widget
    */
    getWidgetImplementation: function (widget) {

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX) {
            return "bizagi.workportal.widgets.inbox";
        }

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_RENDER) {
            return "bizagi.workportal.widgets.render";
        }

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_NEWCASE) {
            return "bizagi.workportal.widgets.newCase";
        }
        //pendiente routing
        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_SEARCH) {
            return "bizagi.workportal.widgets.search";
        }

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ROUTING) {
            return "bizagi.workportal.widgets.routing";
        }

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_BIZAGI_EVENTS) {
            return "bizagi.workportal.widgets.events";
        }

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_BIZAGI_RELEASE) {
            return "bizagi.workportal.widgets.release";
        }
        
        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_COMPLEXGATEWAY) {
            return "bizagi.workportal.widgets.complexgateway";
        }

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_OLDRENDERINTEGRATION) {
            return "bizagi.workportal.widgets.oldrenderintegration";
        }

        if (widget == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ASYNC) {
            return "bizagi.workportal.widgets.async";
        }

        return null;
    }

}, {

    /* 
    *   Constructor
    */
    init: function (dataService) {
        this.templates = {};
        this.dataService = dataService;

        // Add meta to head in order to disable zoom
        this.setIPhoneMetaTags();

        ///Check this flags later an remove if the functionality is release
        //Autosave functionality
        bizagi.override.enableAutoSave = true;
        // Get the workportal's version
        this.getWorkPortalVersion();
    },

    /* SETS iPhone META TAGS
    =====================================================*/
    setIPhoneMetaTags: function () {
        //TODO:get the verison of webkit
        //var regexp = /AppleWebKit\/([\d.]+)/;
        //var result = regexp.exec(navigator.userAgent);
        //parseFloat(result[1]);
        //determine if remove the tag for fixed position 

        // Removes smartphone address bar when launched from home screen
        $('<meta>', {
            name: "apple-mobile-web-app-capable",
            content: "yes"
        }).appendTo('head');

        // Disables safari zooming on iPad when running as web app
        $('<meta>', {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0, minimum-scale=1, maximum-scale=1, user-scalable=no"
        }).appendTo('head');


        $('<link>', {
            rel: 'apple-touch-icon-precomposed',
            href: 'jquery/common/base/css/smartphone/images/BizAgi_logo.png'
        }).appendTo('head');


        $('<link>', {
            rel: 'apple-touch-startup-image',
            href: 'jquery/common/base/css/smartphone/images/splash.png'
        }).appendTo('head');

    },

    /*
    *   This function will load asynchronous stuff needed in the module
    */
    initAsyncStuff: function () {
        var self = this;
        //TODO BUg IN ANDROID;
        bizagi.enableCustomizations = false;

        if (bizagi.enableCustomizations) {
            return $.when(
            // Load custom templates
				bizagi.templateService.loadCustomTemplates()
					.pipe(function () {
					    // Load default templates	
					    return self.loadTemplates();
					})

                    ,
            //todo:remove for android 

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

        var tmplMenu = (bizagi.detectDevice() == "smartphone_android") ? "bizagi.workportal.smartphone.android.menu" : "bizagi.workportal.smartphone.menu";
        $.when(
            self.loadTemplate("workportal", bizagi.getTemplate("bizagi.workportal.smartphone")),
            self.loadTemplate("menu", bizagi.getTemplate(tmplMenu) + "#ui-bizagi-workportal-menu-content"),
            self.loadTemplate("menu.items", bizagi.getTemplate(tmplMenu) + "#ui-bizagi-workportal-widget-menu-items2"),
            self.loadTemplate("menu.dynamic", bizagi.getTemplate(tmplMenu) + "#ui-bizagi-workportal-widget-menu-custom-buttons"),

        // Widgets 
            self.loadTemplate("inbox", bizagi.getTemplate("bizagi.workportal.smartphone.widget.inbox")),
            self.loadTemplate("inbox.container.category.elements", bizagi.getTemplate("bizagi.workportal.smartphone.widget.inbox.elements") + "#bz-wp-widget-inbox-categories-process"),
            self.loadTemplate("inbox.container.category.cases-list", bizagi.getTemplate("bizagi.workportal.smartphone.widget.inbox.elements") + "#ui-bz-wp-widget-inbox-process-cases-list"),
            self.loadTemplate("inbox.container.category.cases-summary", bizagi.getTemplate("bizagi.workportal.smartphone.widget.inbox.elements") + "#ui-bz-wp-widget-inbox-process-case-summary"),
            self.loadTemplate("inbox.container.category.filters", bizagi.getTemplate("bizagi.workportal.smartphone.widget.inbox.elements") + "#ui-bizagi-workportal-widget-inbox-common-header"),

        //
            self.loadTemplate("render", bizagi.getTemplate("bizagi.workportal.smartphone.widget.render") + "#bz-wp-widget-render"),
        //self.loadTemplate("inbox-common-case-summary",             bizagi.getTemplate("bizagi.workportal.smartphone.widget.render") + "#bz-wp-widget-sumary"),

            self.loadTemplate("search", bizagi.getTemplate("bizagi.workportal.smartphone.widget.search") + "#ui-bizagi-workportal-widget-search"),
            self.loadTemplate("search-details", bizagi.getTemplate("bizagi.workportal.smartphone.widget.search") + "#ui-bizagi-workportal-widget-search-details"),
        //NEW CASE
            self.loadTemplate("newCase", bizagi.getTemplate("bizagi.workportal.smartphone.widget.newCase") + "#ui-bizagi-workportal-widget-newcase"),
            self.loadTemplate("newCase-categories", bizagi.getTemplate("bizagi.workportal.smartphone.widget.newCase") + "#ui-bizagi-workportal-widget-newcase-categories"),
            self.loadTemplate("newCase-categories-tree", bizagi.getTemplate("bizagi.workportal.smartphone.widget.newCase") + "#ui-bizagi-workportal-widget-newcase-categories-tree"),
        //ROUTING
            self.loadTemplate("routing", bizagi.getTemplate("bizagi.workportal.smartphone.widget.routing")),
        //DIALOG
            self.loadTemplate("dialog", bizagi.getTemplate("bizagi.workportal.smartphone.widget.dialog")),
        //EVENTS
            self.loadTemplate("case-summary-events-area", bizagi.getTemplate("bizagi.workportal.smartphone.widget.events") + "#ui-bizagi-workportal-widget-case-events-container"),
            self.loadTemplate("case-summary-events", bizagi.getTemplate("bizagi.workportal.smartphone.widget.events") + "#ui-bizagi-workportal-widget-case-events"),
        //RELEASE
            self.loadTemplate("case-summary-release-area", bizagi.getTemplate("bizagi.workportal.smartphone.widget.release") + "#ui-bizagi-workportal-widget-release-container"),
        // complexgateway
            self.loadTemplate("complex-gateway-frame", bizagi.getTemplate("bizagi.workportal.smartphone.widget.complexgateway") + "#ui-bizagi-wp-app-complexgateway-frame"),
            self.loadTemplate("complex-gateway-header", bizagi.getTemplate("bizagi.workportal.smartphone.widget.complexgateway") + "#ui-bizagi-wp-app-complexgateway-header"),
            self.loadTemplate("complex-gateway-row", bizagi.getTemplate("bizagi.workportal.smartphone.widget.complexgateway") + "#ui-bizagi-wp-app-complexgateway-row"),

        //common info message
            self.loadTemplate("info-message", bizagi.getTemplate("common.bizagi.smartphone.info-message")),

            self.loadTemplate("integration-old-render", bizagi.getTemplate("bizagi.workportal.smartphone.widget.oldrenderintegration") + "#ui-bizagi-workportal-widget-oldrender"),
        //async
            self.loadTemplate("async", bizagi.getTemplate("bizagi.workportal.smartphone.widget.async"))

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
    getMainController: function () {
        return new bizagi.workportal.controllers.main(this, this.dataService);
    },

    /*
    *   Returns the menu controller to be used
    */
    getMenuController: function () {
        return new bizagi.workportal.controllers.menu(this, this.dataService);
    },

    /*getNavigationController: function () {
    return new bizagi.workportal.controllers.navigation(this, this.dataService);
    },*/

    /*
    *   Returns the workarea controller to be used
    */
    getWorkareaController: function () {
        return new bizagi.workportal.controllers.workarea(this, this.dataService);
    },

    /*
    *   Returns the desired widget
    */
    getWidget: function (widget, params) {
        var widgetImplementation = this.Class.getWidgetImplementation(widget);
        if (widgetImplementation) {
            try {
                // Create a dynamic function to avoid problem with eval calls when minifying the code
                var dynamicFunction = "var baDynamicFn = function(facade, dataService, params){ \r\n";
                dynamicFunction += "return new " + widgetImplementation + "(facade, dataService, params);\r\n";
                dynamicFunction += "}\r\n";
                dynamicFunction += "baDynamicFn";
                dynamicFunction = eval(dynamicFunction);

                // Call the dynamic function
                return dynamicFunction(this, this.dataService, params);
            } catch (e) { }
        }

        // No type supported
        bizagi.log(widget + " widget not supported", params, "error");
        return null;
    },

    /*
    *   Returns the desired action
    */
    getAction: function (action, params) {
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