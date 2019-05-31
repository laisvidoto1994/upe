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

                self.cachedFacade = new bizagi.workportal.desktop.facade(this.workportal, dataService);

                // Chain template loading
                $.when(self.cachedFacade.initAsyncStuff(initializeTemplates))
                    .done(function() {
                        // Resolve operation
                        defer.resolve(self.cachedFacade);
                    });

                return defer.promise();

            } else if (bizagi.util.isTabletDevice()) {

                self.cachedFacade = new bizagi.workportal.tablet.facade(dataService, this.device); //(this.workportal, dataService);

                // Chain template loading
                $.when(self.cachedFacade.initAsyncStuff())//initializeTemplates))
                    .done(function() {
                        // Resolve operation
                        defer.resolve(self.cachedFacade);
                    });

                    return defer.promise();

            } else if (bizagi.util.isSmartphoneDevice()) {
                
                self.cachedFacade = new bizagi.workportal.smartphone.facade(dataService, this.device);

                // Chain template loading
                $.when(self.cachedFacade.initAsyncStuff())
                .done(function () {
                    // Resolve operation
                    defer.resolve(self.cachedFacade);
                });
                
                return defer.promise();
            } else {
                // if no device suuported                
                bizagi.showMessageBox("Not supported device: " + this.device, "Error");
                defer.resolve("");
            }
        }

        return defer.promise();
    },

    /*
    *   Returns the current data service being used
    */
    getDataService: function () {
        return this.dataService;
    }

});
