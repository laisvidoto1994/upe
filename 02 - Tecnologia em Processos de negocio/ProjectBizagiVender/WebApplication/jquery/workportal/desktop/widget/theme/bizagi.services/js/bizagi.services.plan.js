angular.module('bizagi.services.module').factory('bizagi.services.plan', function ($q) {
    var service = new bizagi.workportal.services.service();
    var notifier = bizagi.injector.get('notifier');
    var processAction = bizagi.injector.get('processActionService');
    var actionService = bizagi.injector.get('actionService');
    var globalHandlersService = bizagi.injector.get('globalHandlersService');
    var widgetManager = bizagi.injector.get('widgetManager');

    var _gotoPlanList = function (planParameters) {
        var homeportal = bizagi.injector.get('homeportal');
        var params = homeportal.params;
        widgetManager._context = "home";

        var servicesPD = new bizagi.workportal.services.behaviors.projectDashboard(homeportal.dataService);
        $.when(servicesPD.getContextToShow(homeportal.params)).done(function (dataPD) {
            $.extend(params, dataPD.responseGetCaseSummaryDetails, dataPD.params);

            params.showContextByMenuDashboard = dataPD.contextToShow;

            bizagi.injector.get('homeportal').onNotifyChange({}, {
                type: "PLANS-VIEW",
                args: $.extend(planParameters, params)
            });
        });
    };

    var _gotoAllPlans = function () {
        _gotoPlanList({
            histName: "All",
            planState: "all",
            flowContext: 'FLOW-DECONTEXTUALIZED-PLANS',
            isOpen: true,
            level: 1
        });

        //var homeportal = bizagi.injector.get('homeportal');
        //var params = homeportal.params;
        //widgetManager._context = "home";

        //var servicesPD = new bizagi.workportal.services.behaviors.projectDashboard(homeportal.dataService);
        //$.when(servicesPD.getContextToShow(homeportal.params)).done(function (dataPD) {
        //    $.extend(params, dataPD.responseGetCaseSummaryDetails, dataPD.params);

        //    params.showContextByMenuDashboard = dataPD.contextToShow;

        //    bizagi.injector.get('homeportal').onNotifyChange({}, {
        //        type: "PLANS-VIEW",
        //        args: $.extend({
        //            histName: "All",
        //            planState: "all",
        //            flowContext: 'FLOW-DECONTEXTUALIZED-PLANS',
        //            isOpen: true,
        //            level: 1
        //        }, params)
        //    });
        //});
    };

    var _gotoPendingPlans = function () {
        _gotoPlanList({
            histName: "Pendings",
            planState: "PENDING",
            flowContext: 'FLOW-DECONTEXTUALIZED-PLANS',
            isOpen: true,//TODO  fix state for decontextualized plans,
            level: 1
        });

        //var homeportal = bizagi.injector.get('homeportal');
        //var params = homeportal.params;
        //widgetManager._context = "home";

        //var servicesPD = new bizagi.workportal.services.behaviors.projectDashboard(homeportal.dataService);
        //$.when(servicesPD.getContextToShow(homeportal.params)).done(function (dataPD) {
        //    $.extend(params, dataPD.responseGetCaseSummaryDetails, dataPD.params);

        //    params.showContextByMenuDashboard = dataPD.contextToShow;

        //    bizagi.injector.get('homeportal').onNotifyChange({}, {
        //        type: "PLANS-VIEW",
        //        args: {
        //            histName: "Pendings",
        //            planState: "PENDING",
        //            flowContext: 'FLOW-DECONTEXTUALIZED-PLANS',
        //            isOpen: true,//TODO  fix state for decontextualized plans,
        //            level: 1
        //        }
        //    });
        //});
    };

    var _gotoRunningPlans = function () {
        _gotoPlanList({
            histName: "Running",
            planState: "EXECUTING",
            flowContext: 'FLOW-DECONTEXTUALIZED-PLANS',
            isOpen: true,//TODO  fix state for decontextualized plans,
            level: 1
        });

        //var homeportal = bizagi.injector.get('homeportal');
        //var params = homeportal.params;
        //widgetManager._context = "home";

        //var servicesPD = new bizagi.workportal.services.behaviors.projectDashboard(homeportal.dataService);
        //$.when(servicesPD.getContextToShow(homeportal.params)).done(function (dataPD) {
        //    $.extend(params, dataPD.responseGetCaseSummaryDetails, dataPD.params);

        //    params.showContextByMenuDashboard = dataPD.contextToShow;

        //    bizagi.injector.get('homeportal').onNotifyChange({}, {
        //        type: "PLANS-VIEW",
        //        args: {
        //            histName: "Running",
        //            planState: "EXECUTING",
        //            flowContext: 'FLOW-DECONTEXTUALIZED-PLANS',
        //            isOpen: true,//TODO  fix state for decontextualized plans,
        //            level: 1
        //        }
        //    });
        //});
    };

    var _gotoClosedPlans = function () {
        _gotoPlanList({
            histName: "Closed",
            planState: "CLOSED",
            flowContext: 'FLOW-DECONTEXTUALIZED-PLANS',
            isOpen: true,//TODO  fix state for decontextualized plans,
            level: 1
        });


        //var homeportal = bizagi.injector.get('homeportal');
        //var params = homeportal.params;
        //widgetManager._context = "home";

        //var servicesPD = new bizagi.workportal.services.behaviors.projectDashboard(homeportal.dataService);
        //$.when(servicesPD.getContextToShow(homeportal.params)).done(function (dataPD) {
        //    $.extend(params, dataPD.responseGetCaseSummaryDetails, dataPD.params);

        //    params.showContextByMenuDashboard = dataPD.contextToShow;

        //    bizagi.injector.get('homeportal').onNotifyChange({}, {
        //        type: "PLANS-VIEW",
        //        args: {
        //            histName: "Closed",
        //            planState: "CLOSED",
        //            flowContext: 'FLOW-DECONTEXTUALIZED-PLANS',
        //            isOpen: true,//TODO  fix state for decontextualized plans,
        //            level: 1
        //        }
        //    });
        //});
    };

    return {       
        gotoAllPlans: _gotoAllPlans,
        gotoPendingPlans: _gotoPendingPlans,
        gotoRunningPlans: _gotoRunningPlans,
        gotoClosedPlans: _gotoClosedPlans
    };
});