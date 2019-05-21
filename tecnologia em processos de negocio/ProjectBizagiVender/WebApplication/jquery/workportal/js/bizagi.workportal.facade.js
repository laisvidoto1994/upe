/*
 *   Name: BizAgi Workportal
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will process a workportal page using a device factory to use the adequate rendering
 *       to create the layout
 */

// Define BizAgi Workportal namespace
bizagi.workportal = bizagi.workportal || {};

// Define global variables
if (!bizagi.workportal.currentInboxView)
    bizagi.workportal.currentInboxView = "inbox";

// Define state variables
bizagi.workportal.state = bizagi.workportal.state || {};


/*
 *   Renders the workportal
 */
$.Class.extend("bizagi.workportal.facade", {}, {

    /*
     *   Constructor
     */
    init: function (params) {

        // Defines a device factory for all rendering
        this.deviceFactory = new bizagi.workportal.device.factory(this);

        // Creates a data service instance
        this.dataService = new bizagi.workportal.services.service(params);

        // Create instance of routing service
        this.dataService.routing = new bizagi.workportal.services.routing({dataService: this.dataService});

        // Set default params
        this.defaultParams = params || {};

        // Set default params
        this.timeoutID;

    },

    /*
     *   Loads the default widget when executing the workportal
     */
    loadDefaultWidget: function () {
        if (!this.defaultWidget && !bizagi.util.isEmpty(window.location.hash)) {
            // Check in the hash
            var hashParams = bizagi.util.getHashParams();
            if (hashParams[0] != "/")
                this.defaultWidget = hashParams[0];
        }
        if (!this.defaultWidget && !bizagi.util.isEmpty(window.location.search)) {
            // Check in the query string
            var queryString = bizagi.util.getQueryString();
            if ((queryString["widget"] === "activityform" || this.defaultParams.widget === "activityform")
                && !bizagi.util.isMobileDevice()) {
                this.defaultWidget = "projectDashboard";
                this.defaultParams.caseLink = true;
            } else {
                this.defaultWidget = queryString["widget"];
            }
        }
        if (!this.defaultWidget && !bizagi.util.isEmpty(this.defaultParams.widget)) {
            // Check in the default params
            this.defaultWidget = this.defaultParams.widget;
        }
        if (!this.defaultWidget && typeof (BIZAGI_DEFAULT_WIDGET) != "undefined"
            && !bizagi.util.isEmpty(BIZAGI_DEFAULT_WIDGET)) {
            // Check with overriding variable in html
            this.defaultWidget = BIZAGI_DEFAULT_WIDGET;
        }
        if (!this.defaultWidget && bizagi.cookie("bizagiDefaultWidget")) {
            // Check with cookie
            this.defaultWidget = bizagi.cookie("bizagiDefaultWidget");
        }
        if (!this.defaultWidget) {
            // Set a default widget based on the current device
            this.defaultWidget = (bizagi.util.detectDevice() == "smartphone_ios"
            || bizagi.util.detectDevice() == "smartphone_android")
                ? bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX
                : bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID;
        }

        // Save in cookie for next executions
        if (this.defaultWidget !== "projectDashboard" && this.defaultWidget !== "homeportal") {
            bizagi.cookie("bizagiDefaultWidget", this.defaultWidget, {expires: 30});
        }

        if (this.defaultWidget === "homeportal") {
            bizagi.cookie("bizagiDefaultWidget", bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID,
                {expires: 30});
        }

        if ((this.dataService && !this.dataService.online) && bizagi.util.isTabletDevice()) {
            bizagi.cookie("bizagiDefaultWidget", bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX,
                {expires: 30});
        }
    },

    /*
     *   Start point method to use in the main javascript pages
     *   This method will process everything and attach the html directly to the dom
     */
    execute: function (canvas) {
        var self = this;
        var doc = this.ownerDocument;
        var body = $("body", doc);
        canvas = canvas || $("<div/>").appendTo(body);

        // Loads the default Widget
        self.loadDefaultWidget();

        // Creates ready deferred
        self.executionDeferred = new $.Deferred();
        return self.process().done(function (content) {

            // Replace canvas with content
            bizagi.util.replaceSelector(body, canvas, content);

            self.executionDeferred.resolve();

        });
    },

    /*
     *   Creates a webpart inside a canvas but don't execute it
     */
    createWebpart: function (params) {
        return this.executeWebpart($.extend(params, {
            creating: true
        }));
    },
    /*
     * Verifies that the webpart configuration parameters are ok, before processing the webpart
     */
    testWebpartConfiguration: function (params) {

        var self = this;
        var webpartConfiguration = params.webpartConfiguration;
        var doc = this.ownerDocument;
        var body = $("body", doc);
        var canvas = params.canvas || $("<div/>").appendTo(body);
        if (!webpartConfiguration.url || webpartConfiguration.url == "") {
            bizagi.webparts.addConfigurationMessage(params, "bizagi-sharepoint-configuration-error");
            return false;
        }
        return true;
    },
    /*
     *   Executes a webpart inside a canvas
     */
    executeWebpart: function (params) {
        var self = this;
        var doc = this.ownerDocument;
        var body = $("body", doc);

        // Creates ready deferred
        var canvas = params.canvas || $("<div/>").appendTo(body);
        var processWebpart = true;
        if (params.webpartConfiguration) {
            processWebpart = self.testWebpartConfiguration(params);
        }
        if (processWebpart) {
            // Process the webpart asynchonous
            return self.processWebpart(params).done(function (result) {

                // Append content to canvas
                canvas.append(result.content);
            });
        }
    },


    /*
     *   Returns the execution deferred to determine if the component is ready or not
     */
    ready: function () {

        return this.executionDeferred.promise();
    },

    /*
     *   Loads a workportal facade to delegate rendering based on device detection
     *   Returns a deferred to set callbacks when the process is done
     */
    process: function () {
        var self = this;
        var defer = new $.Deferred();

        // Create a workportal facade
        var facade = this.deviceFactory.getWorkportalFacade(self.dataService);
        //process offline data
        self.processOfflineData();

        // Set callback when requests have been done
        $.when(facade)
            .pipe(function (workportalFacade) {
                // Creates workportal component
                return self.processWorkportal(workportalFacade);

            }).done(function (content) {
            // Resolve deferred
            defer.resolve(content);
        });

        return defer.promise();
    },

    processOfflineData: function () {
        var self = this;

        if (typeof self.dataService.fetchOfflineData != "undefined" && self.dataService.online == true) {
            $.when(self.dataService.pushOfflineData()).always(function () {
                self.dataService.fetchOfflineData();
            });
        }

    },

    /*
     *   Process a webpart
     */
    processWebpart: function (params) {
        var self = this;
        var facade;
        var defer = new $.Deferred();
        var webpartController;
        var realDevice = bizagi.detectRealDevice();

     
            facade = this.deviceFactory.getWorkportalFacade(self.dataService, false);

        // Combine workportal params with call params
        $.extend(params, this.defaultParams);

        // Set callback when requests have been done
        $.when(facade)
            .pipe(function (workportalFacade) {

                var deferTemplates = new $.Deferred();

                // Load webpart templates
                $.when(workportalFacade.loadWebpart(params))
                    .done(function () {
                        deferTemplates.resolve(workportalFacade);
                    });

                return deferTemplates.promise();
            })
            .pipe(function (workportalFacade) {
                webpartController = workportalFacade.getWebpart(params.webpart, params);

                // Render the full content
                return webpartController.render(params);
            }).done(function (content) {


            // Resolve deferred 
            defer.resolve({webpart: webpartController, content: content});
        });
        return defer.promise();
    },

    /**
     * Process the workportal layout
     */
    processWorkportal: function (workportalFacade) {
        var self = this;
        var controller = this.mainController = workportalFacade.getMainController();
        var defer = new $.Deferred();
        // Render the full content
        return controller.render().then(function (result) {
            $.when(controller.menu.isRendered()).then(function () {
                var widgetNameToLoad = self.getWidgetByDataUser(self.defaultParams);
                if (widgetNameToLoad === "projectDashboard" && self.defaultParams.caseLink) {
                    var actionObject = {
                        action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                        idCase: bizagi.util.getQueryString().idCase,
                        guid: bizagi.util.getQueryString().guid,
                        caseLink: true
                    };
                    if (typeof (bizagi.util.getQueryString().idWorkitem) != "undefined") actionObject.idWorkItem = bizagi.util.getQueryString().idWorkitem;
                    controller.publish("executeAction", actionObject);
                }
                else {
                    controller.setWidget($.extend(self.defaultParams, {
                        widgetName: widgetNameToLoad
                    }, bizagi.util.getQueryString()));
                }

                // Perform resize
                if (controller.menu) {
                    controller.menu.performResizeLayout();
                    if (widgetNameToLoad === bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX ||
                        widgetNameToLoad === bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID) {
                        self.mainController.publish("showMainMenu");
                    }
                }
            });
            return result;
        });
    },

    /**
     * Get widget to load
     * @returns {bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID|*}
     */
    getWidgetByDataUser: function () {
        var self = this;
        var widget = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID;
        var bizagiDefaultWidget = self.defaultWidget !== "projectDashboard" ? bizagi.cookie("bizagiDefaultWidget") : "projectDashboard";

        var propertyLandingPage = "";
        if (bizagi.currentUser.sUserProperties) {
            for (var i = 0, j = bizagi.currentUser.sUserProperties.length; i < j; i++) {
                if (bizagi.currentUser.sUserProperties[i].key === "userstartpage") {
                    propertyLandingPage = bizagi.currentUser.sUserProperties[i];
                    break;
                }
            }
        }


        if (bizagiDefaultWidget != bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX && bizagiDefaultWidget != bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID && bizagiDefaultWidget != bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL) {
            widget = bizagiDefaultWidget;
        }
        else {
            /*
             Values userstartpage property
             1. “” -> El usuario no ha configurado esta opción(usuario viejo).
             2. “1” -> Automatic
             3. “2” -> Me
             4. “3” -> Inbox
             */
            if (typeof propertyLandingPage === "undefined" || propertyLandingPage === "" || propertyLandingPage.value === "" || propertyLandingPage.value === "1") {
                widget = self.getWidgetByCookieAndStakeholders();
            }
            else if (propertyLandingPage.value === "2" && self.currentUserHaveStakeholderAssociated()) {
                widget = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL;
            }
            else if (propertyLandingPage.value === "2" && !self.currentUserHaveStakeholderAssociated()) {
                widget = self.getWidgetByCookie(true);
            }
            else if (propertyLandingPage.value === "3") {
                widget = self.getWidgetByCookie(true);
            }
        }
        return widget;
    },

    /**
     * Get widget considering stakeholders
     * @returns {*}
     */
    getWidgetByCookieAndStakeholders: function () {
        var self = this;
        return self.getWidgetByCookie(false);
    },

    /**
     * Validate if current user have stakeholder associated
     * @returns {bizagi.currentUser.associatedStakeholders|*|boolean}
     */
    currentUserHaveStakeholderAssociated: function () {
        return (bizagi.currentUser.associatedStakeholders && bizagi.currentUser.associatedStakeholders.length > 0);
    },

    /**
     * Get widget by cookie
     * @param forceInboxOrGrid
     * @returns {*}
     */
    getWidgetByCookie: function (forceInboxOrGrid) {
        var self = this;
        var bizagiDefaultWidget = bizagi.cookie("bizagiDefaultWidget");
        var response;
        if (forceInboxOrGrid) {
            if (bizagiDefaultWidget === bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX ||
                bizagiDefaultWidget === bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID) {

                response = bizagiDefaultWidget;

            } else {
                response = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID;
            }
        }
        else {
            if (self.currentUserHaveStakeholderAssociated()) {
                response = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL;
            }
            else {
                if (bizagiDefaultWidget &&
                    bizagiDefaultWidget === bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX ||
                    bizagiDefaultWidget === bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID) {
                    response = bizagiDefaultWidget;
                }
                else {
                    response = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID;
                }
            }
        }
        return response;
    },

    /**
     * Returns the main controller
     */
    getMainController: function () {
        return this.mainController;
    }

});
