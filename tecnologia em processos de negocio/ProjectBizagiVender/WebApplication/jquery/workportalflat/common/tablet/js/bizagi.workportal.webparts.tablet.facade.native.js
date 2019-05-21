/*
 *   Name: BizAgi Smartphone Workportal Facade
 *   Author: luisce
 *   Comments:
 *   -   This script will define a workportal facade to access to all components
 */

bizagi.workportal.tablet.facade.extend("bizagi.workportal.tablet.facade", {},
    {

        executeWebparts: function () {
            var self = this;
            return self._super.apply(this, arguments).then(function () {
                //bizagiapp.workPortalReady();
            });
        },

        loadModule: function (bizagiModule) {
            var self = this;
            if (typeof bizagiModule !== "string") {
                return;
            }

            if (typeof self.modules[bizagiModule] !== 'undefined') {
                return self.modules[bizagiModule];
            }

            self.modules[bizagiModule] = new $.Deferred();

            bizagi.loader.start(bizagiModule, "tablet_ios").then(function () {
                self.modules[bizagiModule].resolve();
            });

            return self.modules[bizagiModule].promise();
        }
    });