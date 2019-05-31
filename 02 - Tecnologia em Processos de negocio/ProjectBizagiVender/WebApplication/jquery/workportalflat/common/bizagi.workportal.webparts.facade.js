/*
 *   Name: BizAgi Workportal
 *   Author: Bizagi Mobile Team
 *   Comments:
 *   -   This script will process a workportal page using a device factory to use the adequate rendering
 *       to create the layout
 */

// Reload without tag
if (location.href.indexOf("#") != -1) {
    document.location = "index.html";
}

// Define BizAgi Workportal namespace
bizagi.workportal = bizagi.workportal || {};

// Define global variables
bizagi.workportal.currentInboxView = "inbox";

// Define state variables
bizagi.workportal.state = bizagi.workportal.state || {};

// Define webparts
bizagi.webparts = bizagi.webparts || {};
bizagi.webparts.instances = bizagi.webparts.instances || [];

//bizagi.workportal.instances = {};

/*
 *   Renders the workportal
 */
$.Class.extend("bizagi.workportal.facade", {}, {
    /* 
    *   Constructor
    */
    init: function(params) {

        // Defines a device factory for all rendering
        this.deviceFactory = new bizagi.workportal.device.factory(this);

        // Creates a data service instance
        this.dataService = new bizagi.workportal.services.service(params);

        // Create instance of routing service
        this.dataService.routing = new bizagi.workportal.services.routing({ dataService: this.dataService });

        // Execute Case link
        if (!bizagi.util.isEmpty(window.location.search)) {
            var queryString = bizagi.util.getQueryString();

            // Set idCase param from query string
            if (queryString["idCase"]) {
                params.idCase = queryString["idCase"];
                this.isConfiguredFromHash = true;
            }

            // Set idWorkitem param from query string
            if (queryString["idWorkitem"]) {
                params.idWorkitem = queryString["idWorkitem"];
            }
        }

        // Set default params
        this.defaultParams = params || {};
    },

    /*
    *   Creates a webpart inside a canvas but don't execute it
    */
    createWebpart: function(params) {
        return this.executeWebpart($.extend(params, {
            creating: true
        }));
    },

    /*
    *   Executes a webpart inside a canvas
    */
    executeWebpart: function(params) {
        var self = this;
        var doc = this.ownerDocument;
        var body = $("body", doc);

        // Creates ready deferred
        var canvas = params.canvas;

        var processWebpart = true;
        if (params.webpartConfiguration) {
            processWebpart = self.testWebpartConfiguration(params);
        }
        if (processWebpart) {
            // Process the webpart asynchonous
            return self.processWebpart(params)
                .then(function(result) {

                    result.name = result.webpart.Class.fullName;
                    bizagi.webparts.instances.push(result);

                    // Append content to canvas
                    canvas.append(result.content);
                    canvas.triggerHandler("ondomincluded");

                    return result;
                });
        }
    },

    /*
    *   Returns the execution deferred to determine if the component is ready or not
    */
    ready: function() {

        return this.executionDeferred.promise();
    },

    /*
    *   Process a webpart
    */
    processWebpart: function(params) {
        var self = this;
        var defer = new $.Deferred();
        var webpartController;

        // Create a workportal facade
        var facade = this.deviceFactory.getWorkportalFacade(self.dataService, false);

        // Combine workportal params with call params
        $.extend(params, this.defaultParams);

        // Set callback when requests have been done
        $.when(facade).then(function(workportalFacade) {

            var deferTemplates = new $.Deferred();

            // Load webpart templates
            $.when(workportalFacade.loadWebpart(params))
                .done(function() {
                    deferTemplates.resolve(workportalFacade);
                });

            return deferTemplates.promise();

        }).then(function(workportalFacade) {
            webpartController = workportalFacade.getWebpart(params.webpart, params);

            // Render the full content
            return webpartController.render(params);

        }).then(function(content) {
            // Resolve deferred
            defer.resolve({ webpart: webpartController, content: content });
        }).fail(function(error) {
            defer.reject(error);
        });

        return defer.promise();
    },

    /*
    *   Returns the main controller
    */
    getMainController: function() {
        return this.mainController;
    },

    execute: function() {
        var self = this;
        var args = arguments;
        var facade = this.deviceFactory.getWorkportalFacade(self.dataService);

        // Process offline data 
        self.processOfflineData();

        return $.when(facade).then(function(deviceFacade) {
            return deviceFacade.executeWebparts(args);
        }).then(function() {

            // Check if the required params are filled
            if (!bizagi.util.isEmpty(self.defaultParams.idCase) && self.isConfiguredFromHash) {
                var params = {
                    action: "routing",
                    idCase: self.defaultParams.idCase
                };

                if (self.defaultParams.idWorkitem) {
                    params.idWorkitem = self.defaultParams.idWorkitem;
                }

                var splitView = $("#homePortal").data("kendoMobileSplitView");
                if (splitView && splitView.element) {
                    splitView.element.hide();
                }

                bizagi.webpart.publish("executeRoutingAction", params);
            } else {
                if (!bizagi.util.isNativePluginSupported() || (bizagi.util.isNativePluginSupported() && bizagi.util.isTabletDevice())) {
                    bizagi.kendoMobileApplication.navigate("#homePortal");
                }
            }
        });
    },

    /*
    *   Process offline data
    */
    processOfflineData: function() {
        var self = this;

        if (typeof self.dataService.fetchOfflineData != "undefined" && self.dataService.online === true) {
            $.when(self.dataService.pushOfflineData()).always(function() {
                self.dataService.fetchOfflineData();
            });
        }
    }
});
