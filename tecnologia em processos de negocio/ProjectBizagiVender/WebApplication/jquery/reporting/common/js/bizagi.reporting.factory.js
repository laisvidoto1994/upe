/*
 *   Name: BizAgi Rendering
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will create the appropiate reporting class to draw a report
 */

$.Class.extend("bizagi.reporting.factory", {}, {
    /* 
    *   Constructor
    */
    init: function (dataService) {
        this.dataService = dataService;

        // Set datepicker i18n
        var datePickerRegional = bizagi.localization.getResource("datePickerRegional");
        $.datepicker.setDefaults(datePickerRegional);
    },
     
    /*
    *   Returns the appropiate report class based on the report name
    */
    create: function (args) {
        if (typeof (args.report) === "undefined")
            throw "The argument must contain a name to create the report";

        try {
            var fn = eval("var bafn = function(args) { " +
                        " return new bizagi.reporting.report." + args.report + "(args);" +
                      "};bafn");

            // Inject data services to report
            args.dataService = this.dataService;
            
            var report = fn(args);
            return report;

        } catch (e) {
            throw "Can't create a report for " + args.report;
        }
    }
});
