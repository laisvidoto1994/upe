/*
 *   Name: BizAgi Workportal Reports Chart Widget
 *   Author: David Romero
 *   Comments:
 *   -   This script will load the selected report in workarea
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.reportsChart", { }, {

        /*
        * Initialize report widget
        */
        init: function (workportalFacade, dataService, params) {

            var self = this;

            self._super(workportalFacade, dataService, params);
            self.endPoint = bizagi.reporting[params.endPoint];
            self.endPoint.defaultReport = params.defaultReport || self.endPoint.defaultReport;
            self.filters = params.filters || {};
            self.myTeam = [];

        },

        /*
        *   Returns the widget name
        */
        getWidgetName: function () {
            return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS_CHART;
        },

        /*
        *   Renders the content for the current controller
        *   Returns a deferred because it has to load the current user
        */
        renderContent: function () {

            var self = this;
            var template = self.getTemplate("reportsChart");
            var content = self.content = $.tmpl(template, self.endPoint);

            //Evaluate callbacks
            if (typeof self.endPoint.callBack !== "undefined") {
                self[self.endPoint.callBack]();
            }

            return content;
        },

        /*
        * Load Reporting Module
        */
        loadReportingModule: function () {

            var self = this;
            var loader = bizagi.loader;
            var deferred = new $.Deferred();

            loader.init(function () {
                loader.start("reporting").then(function () {
                    self.reportingModule = new bizagi.reporting.facade({
                        proxyPrefix: (typeof (bizagi.proxyPrefix) !== "undefined") ? bizagi.proxyPrefix : ""
                    });
                    deferred.resolve();
                });
            });

            return deferred;
        },

        /*
        * callBack for report myTeam
        */
        myTeamCallBack: function () {

            var self = this;

            return $.when(self.dataService.getDataForMyTeam()).done(function (result) {

                var $teamTab = $("li[data-report='bamresourcemonitorworkinprogressteam']", self.content);

                if (!result.items.length) {
                    $teamTab.css('display', 'none');
                } else {
                    self.myTeam = result;
                }

            });
        }
});