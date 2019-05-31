bizagi = (typeof (bizagi) !== 'undefined') ? bizagi : {};
bizagi.util = (typeof (bizagi.util) !== 'undefined') ? bizagi.util : {};
bizagi.util.tablet = (typeof (bizagi.util.tablet) !== "undefined") ? bizagi.util.tablet : {};
bizagi.util.mobility = (typeof (bizagi.util.mobility) !== "undefined") ? bizagi.util.mobility : {};
bizagi.environment = typeof (BIZAGI_ENVIRONMENT) !== "undefined" ? BIZAGI_ENVIRONMENT : (queryString["environment"] || "debug");

bizagi.util.tablet.startLoading = function () {
    bizagiLoader().start();
};

bizagi.util.tablet.stopLoading = function () {
    bizagiLoader().stop();
};

bizagi.util.tablet.startkendo = function () {
    if (typeof (bizagi.kendoMobileApplication) === "undefined") {
        bizagi.kendoMobileApplication = new kendo.mobile.Application($("body"), {
            transition: "slide",
            skin: "flat",
            initial: "initKendo",
            init: function (e) {
                kendo.ui.progress($(".km-flat"), true);
            }
        });

        bizagi.kendoMobileApplication.bizagiNavigate = function (e, t) {
            this.navigate(e, t);
        };
    }
};
