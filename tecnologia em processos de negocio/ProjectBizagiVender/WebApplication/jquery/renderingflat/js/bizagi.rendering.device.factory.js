/*
*   Name: BizAgi Device Render Factory
*   Author: Diego Parra
*   Comments:
*   -   This script will detect the current device and then will load the appropiate factory on demand
*/


$.Class.extend("bizagi.rendering.device.factory", {}, {

    /* 
    *   Constructor, detects the device
    */
    init: function(params) {
        this.device = bizagi.util.detectDevice();
        this.cachedFactory = null;
    },

    /*
    *   Returns the appropiate render factory based on the device detection
    *   Because it loads the scripts on demand it must return a promise
    */
    getRenderFactory: function (dataService,device) {
        var self = this;
        var defer = new $.Deferred();

        if (self.cachedFactory != null && device == "") {
            // Reset print version value
            self.cachedFactory.printVersion = false;
            // Resolve with cached factory                
            defer.resolve(self.cachedFactory);

        } else {

            // If factory is not cached then build it
            if (device == "print") {
                // Load print version references
                self.cachedFactory = new bizagi.rendering.print.factory(dataService);

                // Wait for async loading
                self.cachedFactory.initAsyncStuff()
                    .done(function() {
                        // Resolve operation
                        defer.resolve(self.cachedFactory);
                    });

                return defer.promise();

            } else if (this.device === "desktop") {

                // Load desktop references
                self.cachedFactory = new bizagi.rendering.desktop.factory(dataService);

                // Wait for async loading
                self.cachedFactory.initAsyncStuff()
                    .done(function() {
                        // Resolve operation
                        defer.resolve(self.cachedFactory);
                    });

                return defer.promise();

            } else if (bizagi.util.isTabletDevice()) {

                // Load tablet references
                self.cachedFactory = new bizagi.rendering.tablet.factory(dataService);

                // Wait for async loading
                self.cachedFactory.initAsyncStuff()
                    .done(function() {
                        // Resolve operation
                        defer.resolve(self.cachedFactory);
                    });
            } else if (bizagi.util.isSmartphoneDevice()) {

                // Load tablet references
                self.cachedFactory = new bizagi.rendering.smartphone.factory(dataService);

                // Wait for async loading
                self.cachedFactory.initAsyncStuff()
                    .done(function() {
                        // Resolve operation
                        defer.resolve(self.cachedFactory);
                    });
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
