/*
 *   Name: BizAgi Reporting Services
 *   Author: Diego Parra
 *   Comments:
 *   -   This class will provide a facade to access to reporting REST services
 */

$.Class.extend("bizagi.reporting.services.service", {}, {
    /* 
    *   Constructor
    */
    init: function (params) {
        params = params || {};
        params.proxyPrefix = !bizagi.util.isEmpty(params.proxyPrefix) ? params.proxyPrefix : "";
        params.proxyPrefix = this.normalizeUrl(params.proxyPrefix);

        // set device
        this.device = bizagi.util.detectDevice();

        this.serviceLocator = new bizagi.reporting.services.context(params);
    },

    /*
    * This method will return the url defined as endPoint using the parameter "endPoint" name
    */
    getUrl: function (endpoint) {
        var self = this;
        var url = self.serviceLocator.getUrl(endpoint);
        return url;
    },

    /*
    * This method will return the url normalized
    */
    normalizeUrl: function (url) {
        if (url != "") {
            if (url[url.length - 1] != "/") {
                url = url.concat("/");
            }

            if (url.indexOf("http://") == -1 && url.indexOf("https://") == -1) {
                url = "http://" + url;
            }
        }
        return url;
    },

    /*
    *   Gets the data for bam process analysis
    *   Returns a promise of the data being retrieved
    */
    getBAMProcessAnalysisData: function (params) {
        var self = this;

        // Call ajax and returns promise
        return $.read(self.getUrl("bam-process-loadanalysis"));
    },

    /*
    * Get the process list
    */
    getProcessList: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.read({ url: self.getUrl("components-processes") });

    },

    /*
    * Get dimensions list
    */
    getDimensionsList: function (params) {

        var self = this;

        //Call ajax and returns promise
        return $.create(self.getUrl("components-dimensions"), params);
    },

    /*
    * Get the Cases Status Data
    */
    getCaseStatus: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("bam-process-casestatus"), params);

    },

    /*
    * Get the Cases Going Overdue Data
    */
    getCasesGoingOverdue: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("bam-process-casesgoingoverdue"), params);
    },

    /*
    *  Get the Task Status Data
    */
    getTaskStatus: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("bam-task-taskstatus"), params);

    },

    /*
    * Get the Task Going Overdue Data
    */
    getTaskGoingOverdue: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("bam-task-taskgoingoverdue"), params);
    },

    /*
    * Get the Task Going Overdue Data
    */
    getDimensionsItems: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("components-dimensions-items"), params);
    },

    /*
    * Get the Task Load Analysis Data
    */
    getTaskLoadAnalysis: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("bam-task-loadanalysis"), params);
    },

    /*
    * Get the Cycle Time Data
    */
    getCycleTime: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("analytics-process-cycletime"), params);
    },

    /*
    * Get the Process Activity Summary Data
    */
    getProcessActivitySummary: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("analytics-process-activitysummary"), params);
    },

    /*
    * Get the Process Activity Trend Data
    */
    getProcessActivityTrend: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("analytics-process-activitytrend"), params);
    },

    /*
    * Get the process version list
    */
    getProcessVersionList: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.read(self.getUrl("components-processesversion"));
    },

    /*
    * Get duration histogram
    */
    getDurationHistogram: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("analytics-process-durationhistogram"), params);
    },

    /*
    * Get activation ranking 
    */
    getActivationRanking: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("analytics-process-activationranking"), params);
    },

    /*
    * Get Process Definition (for process viewer plugin)
    */
    getProcessDefinition: function (params) {

        var self = this;

        var toSend = "processId=" + params;

        // Call ajax and returns promise
        return $.read(self.getUrl("process-definition"), toSend);
    },

    /*
    * Get Process Graphic Info (for process viewer plugin)
    */
    getProcessGraphicInfo: function (params) {

        var self = this;

        var toSend = "processId=" + params;

        // Call ajax and returns promise
        return $.read(self.getUrl("process-graphicinfo"), toSend);
    },

    /*
    * Get Frecuents Paths
    */
    getFrecuentsPaths: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("analytics-process-frecuentspaths"), params);
    },

    /*
    * Get data for report analytics-task-cycletime
    */
    getTaskCycleTime: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("analytics-task-cycletime"), params);
    },

    /*
    * Get data for report bam-resourcemonitor-workinprogress
    */
    getResourceMonitorWorkInProgress: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("bam-resourcemonitor-workinprogress"), params);
    },

    /*
    * Get data for report bam-resourcemonitor-workinprogressperuser
    */
    getResourceMonitorWorkInProgressPerUser: function (params) {

        var self = this;

        // Call ajax and returns promise
        return $.create(self.getUrl("bam-resourcemonitor-workinprogressuser"), params);
    },

    /*
    * Get sensors list for report sensors
    */
    getSensorsList: function () {

        var self = this;

        // Call ajax and returns promise
        return $.read(self.getUrl("sensors-list"));
    },

    /*
    * Update counter
    */
    updateCounter: function (params) {

        var self = this;
        return $.update(self.getUrl("sensors-updatecounter"), params);
    },

    /*
    * Add counter
    */
    addCounter: function (params) {

        var self = this;
        return $.create(self.getUrl("sensors-addcounter"), params);
    },

    /*
    * Delete counter
    */
    deleteCounter: function (params) {

        var self = this;
        return $.destroy(self.getUrl("sensors-deletecounter") + "?" + params);
    },

    /*
    * Add stopwatch
    */
    addStopwatch: function (params) {

        var self = this;
        return $.create(self.getUrl("sensors-addstopwatch"), params);
    },

    /*
    * Update stopwatch
    */
    updateStopwatch: function (params) {

        var self = this;
        return $.update(self.getUrl("sensors-updatestopwatch"), params);
    },

    /*
    * Delete stopwatch
    */
    deleteStopwatch: function (params) {

        var self = this;
        return $.destroy(self.getUrl("sensors-deletestopwatch") + "?" + params);
    },

    /*
    * Dimensions list for sensors
    */
    getSensorsDimensions: function (params) {

        var self = this;
        return $.create(self.getUrl("sensors-getdimensionslist"), params);

    },

    getCounterSummary: function (params) {

        var self = this;
        return $.create(self.getUrl("sensors-counter-summary"), params);

    },

    getCounterTrend: function (params) {

        var self = this;
        return $.create(self.getUrl("sensors-counterview-acttrend"), params);
    },

    getCycleTimeSummary: function (params) {

        var self = this;
        return $.create(self.getUrl("sensors-stopwatch-cycletimesummary"), params);
    },

    getLvSeviceSummary: function (params) {

        var self = this;
        return $.create(self.getUrl("sensors-stopwatch-lvservicesummary"), params);
    },

    getSwDurationHistogram: function (params) {

        var self = this;
        return $.create(self.getUrl("sensors-stopwatch-durationhistogram"), params);
    },

    getSwDurationTrend: function (params) {

        var self = this;
        return $.create(self.getUrl("sensors-stopwatch-durationtrend"), params);
    },

    getAllPaths: function (params) {

        var self = this;
        return $.get(self.getUrl("sensors-allpaths"), params);
    },

    getDetailList: function (params) {

        var self = this;

        return $.create(self.getUrl("reports-detaillist"), params);
    },

    getSystemDimensions: function () {

        var self = this;
        return $.read(self.getUrl("components-dimensions-system"));
    },

    customReportsLoadUserQuery: function () {

        var self = this;
        return $.create(self.getUrl("customreports-loaduserquery"));
    },

    customReportsSaveQuery: function (params) {

        var self = this;
        return $.create(self.getUrl("customreports-savequery"), params);
    },


    getExportExcelUrl: function(params){
        var self = this;
        var url = encodeURI(self.getUrl("reports-exporttoexcel") + "?" + params);
        return url;
    },
    /*
    * Export to Excel
    */
    exportToExcel: function(params) {
        var self = this;
        var url = encodeURI(self.getUrl("reports-exporttoexcel") + "?" + params);

        if (self.device !== "desktop") {
            window.parent.open(url, "_system", 'location=yes');
        } else {
            window.open(url, "_blank", 'location=yes');
        }
    },

    /*
    * Export to Excel Detail List
    */
    exportDetailList: function(params) {

        var self = this;
        var url = encodeURI(self.getUrl("reports-detaillist-exporttoexcel") + "?" + params);

        if (self.device !== "desktop") {
            window.parent.open(url, "_system", 'location=yes');
        } else {
            window.location.assign(url);
        }
    },

    /*
    * Check case access for user
    */
    checkCaseAccess : function (params){
        
        var self = this;
        return $.read(self.getUrl("reports-detaillist-caseaccess"), params);
    },

    /*
    * Process definition service for process viewer
    */
    processDefinition: function (params) {

        var self = this;
        return $.read(self.getUrl("processviewer-processdefinition"), params);
    },

    /*
    * Graphic info for process viewer
    */
    graphicInfo: function (params) {

        var self = this;

        return $.read(self.getUrl("processviewer-processgraphicinfo"), params);
    }
});
