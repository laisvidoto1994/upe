/*
 *   Name: BizAgi Reporting Component Helper Class
 *   Author: Diego Parra
 *   Comments:
 *   -   This script defines an access to all reporting components
 */

$.Class.extend("bizagi.reporting.helper.components", {}, {

    init: function (service) {

        this.services = service;
        this.process = new Object();
        this.processversion = new Object();
        this.dimension = new Object();
        this.time = new Object();
        this.customrp = new Object();
    },

    /*
    *  Init Processes Component
    */
    initProcessesComponent: function (canvas, model, process) {

        this.process = new bizagi.reporting.component.processfilter(canvas, {
            model: model,
            process: process
        });

        return this.process;
    },

    /*
    *  Init Dimensions Component
    */
    initDimensionsComponent: function (canvas, params) {

        var self = this;

        self.dimension = new bizagi.reporting.component.dimensionfilter(canvas, this.services, params);

        return self.dimension;
    },

    /*
    *  Init Processes Version Component
    */
    initProcessesVersionComponent: function (canvas, model, process) {

        this.processversion = new bizagi.reporting.component.processversionfilter(canvas, this.services, {
            model: model,
            process: process
        }
        );

        return this.processversion;
    },

    /*
    * Init Time Component
    */
    initTimeComponent: function (canvas, properties) {

        this.time = new bizagi.reporting.component.timefilter(canvas, properties);

        return this.time;
    },

    /*
    * Init Custom Reports Component
    */
    initCustomReportsComponent: function (canvas, info, filters) {

        this.customrp = new bizagi.reporting.component.customreports(canvas, this.services, { info: info, filters: filters });

        return this.customrp;
    },

    /*
    * Init Detail List Component
    */
    initDetailListComponent: function (canvas) {

        this.detailList = new bizagi.reporting.component.detaillist(canvas, this.services);

        return this.detailList;
    },

    /*
    * Render Detail List
    */
    renderDetailList: function (filter, process) {

        this.detailList.renderDetailList(filter, process);
    }
});
