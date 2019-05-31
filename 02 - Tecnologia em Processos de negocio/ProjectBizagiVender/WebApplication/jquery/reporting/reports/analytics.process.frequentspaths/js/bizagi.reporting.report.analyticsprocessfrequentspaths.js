/*
* @title : BizAgi Report for Analytics - Process - Frequents Paths Report
* @author : David Romero
* @date   : 18/11/2013
* Comments:
*     This script draws a specific report for Analytics - Process - Frequents Paths
*
*/

bizagi.reporting.report.extend("bizagi.reporting.report.analyticsprocessfrequentspaths", {}, {
    /*
    *   Constructor
    */
    init: function (params) {
        
	this._super(params);
	
        this.frequentsPaths = [];
        this.path = 0;
        this.total = 0;
    },

    /*
    * Get filters object
    */
    getFiltersObject: function () {
        return { process: {}, dimension: [], time: {} };
    },

    /*
    *   Load all needed templates
    */
    initializeTemplates: function () {

        // Define mapping
        return {
            "main": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocessfrequentspaths") + "#bz-rp-analytics-process-frequentspaths-main"),
            "header": (bizagi.getTemplate("bizagi.reporting.report.analyticsprocessfrequentspaths") + "#bz-rp-analytics-process-frequentspaths-cases"),
        };
    },

    /*
    * Load Components
    */
    loadComponents: function () {

        var self = this;

        self._super();

        return $.when(self.loadProcessesVersionComponent()).pipe(function () {
            return self.loadDimensionsComponent({ process: self.model.process });
        }).pipe(function () {
            return self.loadTimeComponent();
        });
    },

    /*
    * Post Render
    */
    postRender: function () {

        var self = this;

        //Events handlers
        self.eventsHandlers();
    },

    /*
    * Get JSON for detail list
    */
    getDetailListObject: function () {

        var self = this;
        var reportName = "Analytics.Process.FrequentPaths",
        columnIndex = self.frequentsPaths[self.path].pathIndex;

        return { detailList: { reportName: reportName, columnIndex: columnIndex} };
    },

    /*
    * Draw report
    */
    drawReport: function (filter) {

        var self = this;
        self.setFiltersForCustomRPComp();
        
        $.when(self.services.getFrecuentsPaths(filter)).done(function (params) {

            self.frequentsPaths = params.paths;

            self.drawProcessModel();
            self.renderHeader();

        });

    },

    /*
    * Draw process model
    */
    drawProcessModel: function () {

        var self = this;
        
        self.$processViewer = $(".bz-rp-processviewer-canvas", self.content);
        self.renderProcessViewer(self.$processViewer);
    },

    /*
    * Draw frequents paths
    */
    drawFrequentsPaths: function () {

        var self = this;
        var path = self.frequentsPaths[self.path].path;

        //Apply frequents paths
        self.$processViewer.processviewer('clearRoute');
        self.$processViewer.processviewer('drawRoute', path);

    },

    /*
    * Draw combo for display the frequents paths
    */
    renderHeader: function () {

        var self = this;

        //remove previous frequent paths container
        $(".bz-rp-processviewer .bz-rp-frequentspaths-header", self.content).remove();

        if (self.frequentsPaths.length) {

            var pathsTmpl = self.getTemplate("header");

            //render template and append to the header
            $(".bz-rp-processviewer", self.content).prepend($.tmpl(pathsTmpl));

            self.path = 0;
            self.total = self.getTotalCases();
            self.renderPathsControl();
            self.renderCasesData();
        }
    },

    /*
    * Get the sum of all cases
    */
    getTotalCases: function () {

        var self = this;
        var total = 0;
        var paths = [].concat(self.frequentsPaths);

        for (var i = 0, length = paths.length; i < length; i++) { total += paths[i].cases; };

        return total;
    },

    /*
    * Draw paths control
    */
    renderPathsControl: function () {

        var self = this;
        var pathsN = self.frequentsPaths.length;

        $spinner = $(".bz-rp-frecuentspaths-control", self.content);

        var spinner = $spinner.spinner({
            min: 1,
            max: pathsN,
            spin: function (event, ui) {

                var value = parseInt(ui.value);

                self.path = value - 1;
                self.drawFrequentsPaths();
                self.renderCasesData();
            }
        }).data("ui-spinner");

        spinner._parse = function (value) {
            if (typeof value === "string") {
                return parseInt(value);
            }
            return value;
        };

        spinner._format = function (value) {
            return value + "/" + pathsN;
        };

        $spinner.spinner("value", 1 + "/" + pathsN);
    },

    /*
    * It gets info about cases and retorn a string
    */
    renderCasesData: function () {

        var self = this;
        var ncases = self.frequentsPaths[self.path].cases;
        var porcentage = (ncases * 100) / self.total;
        var data = ncases + " ( " + porcentage.toFixed(1) + "% )";

        var $casesContainer = $(".bz-rp-frequentspaths-data", self.content);

        $casesContainer.html(data);
    },

    /*
    * Events handlers
    */
    eventsHandlers: function () {

        var self = this;

        $(".bz-rp-processviewer", self.content).on('click', '.bz-rp-frequentspaths-detaillist', function (event) {

            self.callDetailList({ });
        });

        $(".bz-rp-processviewer", self.content).on('pvComplete', function (obj) {

            if (self.frequentsPaths.length) { self.drawFrequentsPaths(); };

        });

    }


});

