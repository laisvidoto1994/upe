/*
*   Name: BizAgi Services Reporting End Points
*   Author: Diego Parra
*   Comments:
*   -   This script defines all the end-points used to retrieve ajax stuff
*   -   All urls must be relative to the base application
*/

// Create or define namespace
bizagi.reporting = (typeof (bizagi.reporting) !== "undefined") ? bizagi.reporting : {};
bizagi.reporting.services = (typeof (bizagi.reporting.services) !== "undefined") ? bizagi.reporting.services : {};
bizagi.reporting.services.reporting = [];

// Creates a endpoint hash factory to resolve custom requirements
bizagi.reporting.services.getEndPoints = function (params) {

    // Define endpoints
    var endpoints = {
        "bam-process-loadanalysis": params.proxyPrefix + "Rest/Reports/BAM/Process/LoadAnalysis",
        "bam-process-casestatus": params.proxyPrefix + "Rest/Reports/BAM/Process/CaseStatus",
        "bam-process-casesgoingoverdue": params.proxyPrefix + "Rest/Reports/BAM/Process/CasesGoingOverdue",
        "bam-task-taskgoingoverdue": params.proxyPrefix + "Rest/Reports/BAM/Task/TaskGoingOverdue",
        "bam-task-loadanalysis": params.proxyPrefix + "Rest/Reports/BAM/Task/LoadAnalysis",
        "bam-task-taskstatus": params.proxyPrefix + "Rest/Reports/BAM/Task/TaskStatus",
        "bam-resourcemonitor-workinprogress": params.proxyPrefix + "Rest/Reports/BAM/Resources/Task",
        "bam-resourcemonitor-workinprogressuser": params.proxyPrefix + "Rest/Reports/BAM/Resources/User",
        "analytics-process-cycletime": params.proxyPrefix + "Rest/Reports/Analytics/Process/CycleTime",
        "analytics-process-activitysummary": params.proxyPrefix + "Rest/Reports/Analytics/Process/ActivitySummary",
        "analytics-process-activitytrend": params.proxyPrefix + "Rest/Reports/Analytics/Process/ActivityTrend",
        "analytics-process-durationhistogram": params.proxyPrefix + "Rest/Reports/Analytics/Process/DurationHistogram",
        "analytics-process-activationranking": params.proxyPrefix + "Rest/Reports/Analytics/Process/ActivationRanking",
        "analytics-process-frecuentspaths": params.proxyPrefix + "Rest/Reports/Analytics/Process/FrequentPaths",
        "analytics-task-cycletime": params.proxyPrefix + "Rest/Reports/Analytics/Task/CycleTime",
        "sensors-list": params.proxyPrefix + "Rest/Reports/Sensors",
        "sensors-updatecounter": params.proxyPrefix + "Rest/Reports/Sensors/Counter",
        "sensors-addcounter": params.proxyPrefix + "Rest/Reports/Sensors/Counter",
        "sensors-deletecounter": params.proxyPrefix + "Rest/Reports/Sensors/Counter",
        "sensors-addstopwatch": params.proxyPrefix + "Rest/Reports/Sensors/Stopwatch",
        "sensors-updatestopwatch": params.proxyPrefix + "Rest/Reports/Sensors/Stopwatch",
        "sensors-deletestopwatch": params.proxyPrefix + "Rest/Reports/Sensors/Stopwatch",
        "sensors-getdimensionslist": params.proxyPrefix + "Rest/Reports/Components/SensorDimensionsList",
        "sensors-counter-summary": params.proxyPrefix + "Rest/Reports/Sensors/Process/CounterSummary",
        "sensors-counterview-acttrend": params.proxyPrefix + "Rest/Reports/Sensors/CounterTrend",
        "sensors-stopwatch-cycletimesummary": params.proxyPrefix + "Rest/Reports/Sensors/StopwatchSummary",
        "sensors-stopwatch-lvservicesummary": params.proxyPrefix +"Rest/Reports/Sensors/StopwatchLevelOfService",
        "sensors-stopwatch-durationhistogram": params.proxyPrefix + "Rest/Reports/Sensors/StopwatchDurationHistogram",
        "sensors-stopwatch-durationtrend": params.proxyPrefix + "Rest/Reports/Sensors/StopwatchTrend",
        "sensors-allpaths": params.proxyPrefix + "Rest/Reports/Components/AllPathsFromTask",
        "components-processes": params.proxyPrefix + "Rest/Reports/Components/Processes",
        "components-dimensions": params.proxyPrefix + "Rest/Reports/Components/DimensionsList",
        "components-dimensions-system": params.proxyPrefix + "Rest/Reports/Components/SystemDimensionsList",
        "components-dimensions-items": params.proxyPrefix + "Rest/Reports/Components/DimensionItems",
        "components-processesversion": params.proxyPrefix + "Rest/Reports/Components/ProcessesVersion",
        "process-definition": params.proxyPrefix + "Rest/Reports/Components/ProcessDefinition",
        "process-graphicinfo": params.proxyPrefix + "Rest/Reports/Components/ProcessGraphicInfo",
        "customreports-loaduserquery":  params.proxyPrefix + "Rest/Reports/AnalysisQueries/Load",
        "customreports-savequery": params.proxyPrefix + "Rest/Reports/AnalysisQueries",
        "reports-exporttoexcel": params.proxyPrefix + "Rest/Reports/ReportToExcel",
        "reports-detaillist": params.proxyPrefix + "Rest/Reports/caseList",
        "reports-detaillist-exporttoexcel": params.proxyPrefix + "Rest/Reports/caseListToExcel",
        "reports-detaillist-caseaccess": params.proxyPrefix + "Rest/Reports/caseAccess",
        "processviewer-processdefinition": params.proxyPrefix + "Rest/Reports/Components/ProcessDefinition",
        "processviewer-processgraphicinfo": params.proxyPrefix + "Rest/Reports/Components/ProcessGraphicInfo"        
    };

    // Add proxy prefix
    if (params.proxy && params.proxy.length > 0) {
        return $.each(endpoints, function (value, key) {
            endpoints[key] = params.proxy + value;
        });
    }

    return endpoints;
};
