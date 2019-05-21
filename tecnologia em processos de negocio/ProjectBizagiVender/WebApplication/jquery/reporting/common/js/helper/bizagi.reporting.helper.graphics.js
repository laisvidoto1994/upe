/*
 *   Name: BizAgi Reporting Graphics Helper Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script defines an access to graphic engines for reporting
 */

$.Class.extend("bizagi.reporting.helper.graphics", {}, {

    /*
    * Init object
    */
    init: function (report) {

        this.report = report;
    },

    /*
    * Get DataViz object parameters
    */
    getDataVizObject: function (params) {

        var self = this;

        var setting = {
            theme: "metro",
            title: {
                font: "14px Arial, Helvetica Neue, Helvetica, sans-serif"
            },
            legend: {
                labels: {
                    font: "12px Arial, Helvetica Neue, Helvetica, sans-serif",
                    color: "#444"
                },
                position: "bottom",
                visible: true
            },
            seriesDefaults: {
                labels: {
                    visible: true,
                    background: "none",
                    font: "12px Arial, Helvetica Neue, Helvetica, sans-serif",
                    color: "#444"
                },
                tooltip: {
                    visible: true,
                    font: "12px Arial, Helvetica Neue, Helvetica, sans-serif",
                    color: "#ffffff",
                    template: "#= category #: #= value #"
                },
                stack: false,
                type: "column"
            },
            seriesColor: [
                "blue"
            ],
            seriesClick: function (e) {

                // Cancel timeout if exists
                if (self.refreshTimeout) {
                    clearTimeout(self.refreshTimeout);
                } else {
                    var radio = $("input[type=radio][checked]", self.report.graphics.report.element);
                    if (radio.length) {
                        e.sender.options.detailList.caseBased = (radio.data("timerange") === "crtdate") ? true : false;
                    }

                    self.report.callDetailList($.extend(e, { dtlType: "dataViz" }));
                }

                // Create a new timeout
                self.refreshTimeout = setTimeout(function () {
                    delete self.refreshTimeout;
                }, 300);
            },
            valueAxis: {
                title: {
                    font: "12px Arial, Helvetica Neue, Helvetica, sans-serif",
                    color: "#444",
                    visible: false
                },
                line: {
                    visible: false
                },
                minorGridLines: {
                    visible: false
                }
            },
            axisDefaults: {
                labels: {
                    color: "#444"
                }
            },
            categoryAxis: {
                majorGridLines: {
                    visible: false
                },
                line: {
                    visible: false
                }
            }
        };

        return $.extend(true, {}, setting, params);
    }
});
