/*
*   Name: BizAgi Device Render Factory
*   Author: Diego Parra
*   Comments:
*   -   This script will detect the current device and then will load the appropiate factory on demand
*/

$.Class.extend("bizagi.workportal.device.factory", {}, {

    /* 
    *   Constructor, detects the device
    */
    init: function (workportal) {
        this.device = bizagi.util.detectDevice();
        this.workportal = workportal;
        this.cachedFacade = null;
    },

    /*
    *   Returns the appropiate workportal facade based on the device detection
    *   Because it loads the scripts on demand it must return a promise
    */
    getWorkportalFacade: function (dataService, initializeTemplates) {
        var self = this;
        var defer = new $.Deferred();
        initializeTemplates = typeof(initializeTemplates) !== "undefined" ? initializeTemplates : true;

        if (self.cachedFacade != null) {
            // Resolve with cached factory                
            defer.resolve(self.cachedFacade);

        } else {

            // If factory is not cached then build it
            if (this.device == "desktop") {
                $.when(self.getDesktopWorkportalFacade(dataService, initializeTemplates)).done(function (facade) {
                    self.cachedFacade = facade;
                    defer.resolve(facade);
                });

            } else if (this.device == "tablet" || this.device == "tablet_ios" || this.device == "tablet_android") {
                $.when(self.getTabletWorkportalFacade(dataService, initializeTemplates)).done(function (facade) {
                    self.cachedFacade = facade;
                    defer.resolve(facade);
                });

            } else if (this.device == "smartphone_ios" || this.device == "smartphone_android") {
                $.when(self.getSmartphoneWorkportalFacade(dataService, initializeTemplates)).done(function (facade) {
                    self.cachedFacade = facade;
                    defer.resolve(facade);
                });
            } else {
                // if no device suuported
                alert("Not supported device: " + this.device);
                defer.resolve("");
            }
        }

        return defer.promise();
    },


    getDesktopWorkportalFacade: function (dataService, initializeTemplates) {
        var def = $.Deferred();

        var facade = new bizagi.workportal.desktop.facade(this.workportal, dataService);

        // Chain template loading
        $.when(facade.initAsyncStuff(initializeTemplates))
            .done(function() {
                // Resolve operation
                def.resolve(facade);
            });

        return def.promise();
    },

    getTabletWorkportalFacade: function (dataService) {
        var def = new $.Deferred();

        // Load tablet references
        var facade = new bizagi.workportal.tablet.facade(this.workportal, dataService);

        // Wait for async loading
        facade.initAsyncStuff()
            .done(function () {
                // Resolve operation
                def.resolve(facade);
            });

        return def.promise();
    },

    getSmartphoneWorkportalFacade: function (dataService) {
        var def = new $.Deferred();

        // Load tablet references
        var facade = new bizagi.workportal.smartphone.facade(dataService);

        // Wait for async loading
        facade.initAsyncStuff()
            .done(function () {
                // Resolve operation
                def.resolve(facade);
            });
        return def.promise();
    },

    /*
    *   Returns the current data service being used
    */
    getDataService: function () {
        return this.dataService;
    }

});
