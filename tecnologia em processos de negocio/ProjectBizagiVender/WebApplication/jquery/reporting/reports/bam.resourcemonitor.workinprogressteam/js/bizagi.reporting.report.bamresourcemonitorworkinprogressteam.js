/*
*   Name: BizAgi Report for BAM - Process - Work in Progress
*   Author: David Romero
*   Comments:
*   -   This script draws a specific report for BAM - Resource Monitor - User
*/

bizagi.reporting.report.bamresourcemonitorworkinprogressuser.extend("bizagi.reporting.report.bamresourcemonitorworkinprogressteam", {}, {

    /*
    * Initialize report
    */
    init: function (params) {

        this._super(params);

        var id = params.myTeam.id,
            guid = params.myTeam.guid,
            values = params.myTeam.items;

        this.model = { "dimension": [{ id: id, guid: guid, values: values, includeEmptyValues: false, type: "system"}] };
    },

    /*
    *   Templated render component
    */
    renderContent: function () {

        var self = this;
        var main = self.getTemplate("main");

        // Render main template
        self.content = $.tmpl(main);

        return $.when(self.loadComponents()).pipe(function () {

            var filter = "filters=" + JSON.stringify(self.model);

            //draw report
            self.drawReport(filter);

            return self.content;
        });

    },

    /*
     * Redraw Graphics
     */
    drawReport: function (filter) {

        var self = this;

        self.setFiltersForCustomRPComp();

        $.when(self.services.getResourceMonitorWorkInProgressPerUser(filter)).done(function (result) {

            //if there is an empty result render message otherwise render charts
            if (result.users.length) {

                var iconTmpl = self.getTemplate("exportexcel");
                var dataChart = self.groupDataChart(result.users);
                var $chartsContainer = $(".bz-rp-bam-resourcemonitor-workinprogressuser-charts", self.content).empty();

                if (!$.isEmptyObject(dataChart)) {

                    $chartsContainer.append($.tmpl(iconTmpl,{},{
                        getReportExcelUrl: self.getReportExcelUrl("bam.resources.myteam")
                    }));

                    $.each(dataChart, function (i, value) {
                        self.drawCharts(value, $chartsContainer);
                    });
                }
            } else {
                var msg = (self.components.dimension.dimensions.length) ? 2 : 1;
                self.renderMessage(msg);
            }

        });

    },

    /*
    * Post Render
    */
    postRender: function () {
        var self = this;
    },

    getReportExcelUrl: function(namespace){
        var self = this;
        var model = $.extend({}, self.taskGuid, self.model);
        var filter = "reportName=" + namespace + "&filters=" + JSON.stringify(model) + "&user=" + bizagi.currentUser.idUser;

        return self.services.getExportExcelUrl(filter);
    }


});
