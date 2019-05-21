/*
 *   Name: BizAgi Rendering
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will process a single report and renders it to a given canvas, regardless the device or the report
 */

// Define BizAgi Reporting namespace
bizagi.reporting = bizagi.reporting || {};


$.Class.extend("bizagi.reporting.facade", {}, {
    /*
    *   Constructor
    */
    init: function (params) {
        params = params || {};

        // Creates a data service instance
        this.dataService = new bizagi.reporting.services.service(params);

        // Retreives the report factory
        this.reportFactory = new bizagi.reporting.factory(this.dataService);
    },

    /*
    *   This method draws any given report into a canvas (if not defined will draw on BODY)
    */
    render: function (params) {
        var self = this;
        var doc = this.ownerDocument;
        var reportInstance;

        // Check parameters
        params = params || {};
        if (!params.canvas) params.canvas = $("body", doc);
        if (!params.report) throw 'No report name was given';

        // Create report instance
        return $.when(self.reportFactory.create(params))
                .pipe(function (report) {
                    reportInstance = report;
                    // With the report instance draw the html
                    return report.render();
                })
                .pipe(function ($html) {

                    // Append to canvas
                    params.canvas.append($html);

                    // Execute post render
                    reportInstance.postRender();
                    
                    return reportInstance;
                });
    }
});
