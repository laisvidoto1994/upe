/*
*   Name: BizAgi Smartphone Workportal Facade Native
*   Author: luisce - christianc
*   Comments:
*   -   This script will override facade methods w
*/
bizagi.workportal.smartphone.facade.extend("bizagi.workportal.smartphone.facade", {}, {
    executeWebparts: function() {
        var self = this;
        return self._super.apply(this, arguments).then(function() {
            if (bizagi.util.isNativePluginSupported()) {
                if (bizagi.workportal.webparts.homePortal !== undefined) {
                    bizagiapp.homePortalReady();
                } else {
                    bizagiapp.workPortalReady();

                }
            }
        });
    },

    sortMenuItemsByStartPage: function(startpage, currentUser) {
        var self = this;

        if (typeof currentUser.associatedStakeholders !== "undefined" &&
            currentUser.associatedStakeholders.length > 0) {
            // Merge layouts - Load dashboard
            self.homePortalFramework.homePortalLayout = $.extend(self.homePortalFramework.homePortalLayoutDashboard,
                self.homePortalFramework.homePortalLayoutTaskFeed, self.homePortalFramework.homePortalLayoutComplement);
        } else {
            // Merge layouts - Load task feed
            self.homePortalFramework.homePortalLayout = $.extend(self.homePortalFramework.homePortalLayoutTaskFeed, self
                .homePortalFramework.homePortalLayoutDashboard, self.homePortalFramework.homePortalLayoutComplement);
        }
    },

    loadModule: function(bizagiModule) {
        var self = this;
        if (typeof bizagiModule !== "string") {
            return;
        }

        self.modules[bizagiModule] = new $.Deferred();

        bizagi.loader.start(bizagiModule, "smartphone_ios").then(function() {
            self.modules[bizagiModule].resolve();
        });

        return self.modules[bizagiModule].promise();
    }
});