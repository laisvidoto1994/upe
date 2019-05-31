/*
*   Name: BizAgi Reporting Definition JSON
*   Author: David Romero
*   Comments:
*   -   This script defines global components for reports
*/

if (!bizagi.reporting) {
    bizagi.reporting = { };
}

bizagi.reporting = {
    BAMProcess: {
        defaultReport: "bamprocessloadanalysis",
        info: {
            reportSet: 1
        },
        reports: {
            "bamprocessloadanalysis": {
                components: ["filters-processversion", "filters-dimension"],
                resource: "bz-rp-loadanalysis-tab"
            },
            "bamprocessworkinprogress": {
                components: ["filters-processversion", "filters-dimension"],
                resource: "bz-rp-workinprogress-tab"
            }
        }
    },
    BAMTask: {
        defaultReport: "bamtasksworkinprogress",
        info: {
            reportSet: 2
        },
        reports: {
            "bamtasksworkinprogress": {
                components: ["filters-processversion", "filters-dimension"],
                resource: "bz-rp-workinprogress-tab"
            },
            "bamtaskloadanalysis": {
                components: ["filters-processversion", "filters-dimension"],
                resource: "bz-rp-loadanalysis-tab"
            }
        }
    },
    AnalyticsProcess: {
        defaultReport: "analyticsprocesscycletime",
        info: {
            reportSet: 3
        },
        reports: {
            "analyticsprocesscycletime": {
                components: ["filters-processversion", "filters-dimension", "filters-time"],
                resource: "bz-rp-cycletime-tab"
            },
            "analyticsprocessdurationhistogram": {
                components: ["filters-processversion", "filters-dimension", "filters-time"],
                resource: "bz-rp-durationhistogram-tab"
            },
            "analyticsprocessactivity": {
                components: ["filters-processversion", "filters-dimension", "filters-time"],
                resource: "bz-rp-processactivity-tab"
            },
            "analyticsprocessactivationranking": {
                components: ["filters-dimension", "filters-time"],
                resource: "bz-rp-activationranking-tab"
            },
            "analyticsprocessfrequentspaths": {
                components: ["filters-processversion", "filters-dimension", "filters-time"],
                resource: "bz-rp-frequentspaths-tab"
            }
        }
    },
    AnalyticsTask: {
        defaultReport: "analyticstaskcycletime",
        info: {
            reportSet: 4
        },
        reports: {
            "analyticstaskcycletime": {
                components: ["filters-processversion", "filters-dimension", "filters-time"],
                resource: "bz-rp-cycletime-tab"
            }
        }
    },
    ResourceBAM: {
        callBack: "myTeamCallBack",
        defaultReport: "bamresourcemonitorworkinprogress",
        info: {
            reportSet: 6
        },
        reports: {
            "bamresourcemonitorworkinprogress": {
                components: ["filters-processversion", "filters-dimension", "filters-time"],
                resource: "bz-rp-workinprogress-tab"
            },
            "bamresourcemonitorworkinprogressuser": {
                components: ["filters-processversion", "filters-dimension", "filters-time"],
                resource: "bz-rp-workinprogressuser-tab"
            },
            "bamresourcemonitorworkinprogressteam": {
                components: ["filters-processversion", "filters-dimension", "filters-time"],
                resource: "bz-rp-workinprogressteam-tab"
            }
        }
    },
    AnalyticsSensor: {
        defaultReport: "sensors",
        reports: {
            "sensors": {
                components: ["filters-dimension", "filters-time"]
            }
        },
        info: {
            reportSet: 5
        }
    }
};