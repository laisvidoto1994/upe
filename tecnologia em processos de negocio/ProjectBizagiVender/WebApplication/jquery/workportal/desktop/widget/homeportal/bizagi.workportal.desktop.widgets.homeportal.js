/**
 *   Name: Bizagi Workportal Desktop HomePortal Controller
 *   Author: Manuel Mejia
 */

/**
 *  CD: Case Dashboard, example: toLeftSidebarCD: To left sidebar Case dashboard
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.homeportal", {
    contexts: {
        "HOME": {
            widgets: {
                "dashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.dashboard"
                },
                "stuff": {
                    "layout": "dashboard",
                    "name": "bizagi.workportal.widgets.stuff",
                    "canvas": "stuff"
                },
                "plans": {
                    "layout": "dashboard",
                    "name": "bizagi.workportal.widgets.decontextualized.plans",
                    "canvas": "plans"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "sidebar": {
                    "layout": "leftsidebar",
                    "name": "bizagi.workportal.widgets.sidebarhome"
                },
                "usersummary": {
                    "layout": "sidebar",
                    "name": "bizagi.workportal.widgets.usersummary",
                    "canvas": "content1"
                },
                "myshortcuts": {
                    "layout": "sidebar",
                    "name": "bizagi.workportal.widgets.shortcuts",
                    "canvas": "content2"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                "empty1": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent1" },
                "empty2": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }

            },
            nav: { level: 0 },
            belongs: { "toLeftSidebarCD": false, "toRightSidebarCD": false, "toTaskSidebarCD": false }
        },

        "TEMPLATEENGINE-VIEW": {
            widgets: {
                "templates": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.templates"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "paginator": {
                    "layout": "templates",
                    "name": "bizagi.workportal.widgets.paginator",
                    "canvas": "paginator"
                },
                "sortbar": {
                    "layout": "templates",
                    "name": "bizagi.workportal.widgets.sortbar",
                    "canvas": "sortbar"
                },
                "mysearchfilter": {
                    "layout": "templates",
                    "name": "bizagi.workportal.widgets.mysearchfilter",
                    "canvas": "mysearchfilter"
                },
                "sidebar": {
                    "layout": "leftsidebar",
                    "name": "bizagi.workportal.widgets.sidebar"
                },
                "stuff": {
                    "layout": "sidebar",
                    "name": "bizagi.workportal.widgets.stuff",
                    "canvas": "content1"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                "empty1": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent1" },
                "empty2": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 1 },
            belongs: { "toLeftSidebarCD": false, "toRightSidebarCD": false, "toTaskSidebarCD": false }
        },

        "ENTITY-ENGINE-VIEW": {
            widgets: {
                "templates": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.templates"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "sidebar": {
                    "layout": "leftsidebar",
                    "name": "bizagi.workportal.widgets.sidebar"
                },
                "stuff": {
                    "layout": "sidebar",
                    "name": "bizagi.workportal.widgets.stuff",
                    "canvas": "content1"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                "empty1": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent1" },
                "empty2": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 1 },
            belongs: { "toLeftSidebarCD": false, "toRightSidebarCD": false, "toTaskSidebarCD": false }
        },

        "SEARCH-ENGINE-VIEW": {
            widgets: {
                "templates": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.templates"
                },
                "paginator": {
                    "layout": "templates",
                    "name": "bizagi.workportal.widgets.paginator",
                    "canvas": "paginator"
                },
                "sortbar": {
                    "layout": "templates",
                    "name": "bizagi.workportal.widgets.sortbar",
                    "canvas": "sortbar"
                },
                "mysearchfilter": {
                    "layout": "templates",
                    "name": "bizagi.workportal.widgets.mysearchfilter",
                    "canvas": "mysearchfilter"
                },
                "sidebar": {
                    "layout": "leftsidebar",
                    "name": "bizagi.workportal.widgets.sidebar"
                },
                "mysearchcriteria": {
                    "layout": "sidebar",
                    "name": "bizagi.workportal.widgets.mysearchcriteria",
                    "canvas": "content1"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                "empty1": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent1" },
                "empty2": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 1 },
            belongs: { "toLeftSidebarCD": false, "toRightSidebarCD": false, "toTaskSidebarCD": false }
        },

        "CASES-TEMPLATE-VIEW": {
            widgets: {
                "templates": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.casestemplate"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "paginator": {
                    "layout": "templates",
                    "name": "bizagi.workportal.widgets.paginator",
                    "canvas": "paginator"
                },
                "sortbar": {
                    "layout": "templates",
                    "name": "bizagi.workportal.widgets.sortbar",
                    "canvas": "sortbar"
                },
                "sidebar": {
                    "layout": "leftsidebar",
                    "name": "bizagi.workportal.widgets.sidebar"
                },
                "proccesseslist": {
                    "layout": "sidebar",
                    "name": "bizagi.workportal.widgets.processeslist",
                    "canvas": "content1"
                },
                "filtercases": {
                    "layout": "sidebar",
                    "name": "bizagi.workportal.widgets.filtercases",
                    "canvas": "sidebarfooter"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                "empty1": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent1" },
                "empty2": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 1 },
            belongs: { "toLeftSidebarCD": false, "toRightSidebarCD": false, "toTaskSidebarCD": false }
        },
        "PLANS-VIEW": {
            widgets: {
                "topmenu": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.plans.topmenu"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "manager": {
                    "layout": "topmenu",
                    "name": "bizagi.workportal.widgets.plans.manager",
                    "canvas": "plansList"
                },
                "sidebar": {
                    "layout": "leftsidebar",
                    "name": "bizagi.workportal.widgets.sidebar"
                },
                "filters": {
                    "layout": "sidebar",
                    "name": "bizagi.workportal.widgets.plans.filters",
                    "canvas": "content1"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                "empty1": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent1" },
                "empty2": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 1 },
            belongs: { "toLeftSidebarCD": false, "toRightSidebarCD": false, "toTaskSidebarCD": false }
        },
        //CONTEXTS CASE DASHBOARD
        "ACTIVITY": {
            widgets: {
                activity: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.activity",
                    canvas: "contentprincipal"
                },
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity",
                    canvas: "contentsidebar"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                caseState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.caseState",
                    canvas: "sidebarcontent1"
                },
                activityState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.activityState",
                    canvas: "sidebarcontent2"
                },
                processState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.processState",
                    canvas: "sidebarcontent3"
                },
                users: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.users",
                    canvas: "sidebarcontent4"
                },
                events: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.events",
                    canvas: "sidebarcontent5"
                },
                subprocesses: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.subprocesses",
                    canvas: "sidebarcontent6"
                },
                relatedPlan: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.activity.plan.sidebar",
                    canvas: "sidebarcontentextra"
                }
            },
            nav: { level: 0 },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": true }
        },
        "OVERVIEW": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity",
                    canvas: "contentsidebar"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                overview: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.overview",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                caseState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.caseState",
                    canvas: "sidebarcontent1"
                },
                activityState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.activityState",
                    canvas: "sidebarcontent2"
                },
                processState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.processState",
                    canvas: "sidebarcontent3"
                },
                users: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.users",
                    canvas: "sidebarcontent4"
                },
                events: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.events",
                    canvas: "sidebarcontent5"
                },
                subprocesses: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.subprocesses",
                    canvas: "sidebarcontent6"
                },
                "empty1": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": true }
        },
        "COMMENTS": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                discussions: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.discussions",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                discussionSidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.discussion.sidebar",
                    canvas: "sidebarcontent1"
                },
                caseState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.caseState",
                    canvas: "sidebarcontent2"
                },
                activityState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.activityState",
                    canvas: "sidebarcontent3"
                },
                processState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.processState",
                    canvas: "sidebarcontent4"
                },
                users: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.users",
                    canvas: "sidebarcontent5"
                },
                events: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.events",
                    canvas: "sidebarcontent6"
                },
                "empty1": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": true }
        },
        "FILES": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                files: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.files",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                filesPreview: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.filesPreview",
                    canvas: "sidebarcontent1"
                },
                caseState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.caseState",
                    canvas: "sidebarcontent2"
                },
                activityState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.activityState",
                    canvas: "sidebarcontent3"
                },
                processState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.processState",
                    canvas: "sidebarcontent4"
                },
                users: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.users",
                    canvas: "sidebarcontent5"
                },
                events: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.events",
                    canvas: "sidebarcontent6"
                },
                empty7: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": true }
        },
        "PROCESSMAP": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                processMap: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.processMap",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                caseState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.caseState",
                    canvas: "sidebarcontent1"
                },
                activityState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.activityState",
                    canvas: "sidebarcontent2"
                },
                processState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.processState",
                    canvas: "sidebarcontent3"
                },
                users: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.users",
                    canvas: "sidebarcontent4"
                },
                events: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.events",
                    canvas: "sidebarcontent5"
                },
                subprocesses: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.subprocesses",
                    canvas: "sidebarcontent6"
                },
                "empty1": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": true }
        },
        "LOG": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                log: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.activity.log",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                "empty1": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": true }
        },
        "TIMELINE": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                "timeline": {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.timeline",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                "timelineSidebar": {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.timeline.sidebar",
                    canvas: "sidebarcontent1"
                },
                caseState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.caseState",
                    canvas: "sidebarcontent2"
                },
                activityState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.activityState",
                    canvas: "sidebarcontent3"
                },
                processState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.processState",
                    canvas: "sidebarcontent4"
                },
                users: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.users",
                    canvas: "sidebarcontent5"
                },
                events: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.events",
                    canvas: "sidebarcontent6"
                },
                empty7: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": true }
        },
        //CONTEXTS FOR PLAN
        "PLANCREATE": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                plan: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.plan",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                caseState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.caseState",
                    canvas: "sidebarcontent1"
                },
                activityState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.activityState",
                    canvas: "sidebarcontent2"
                },
                processState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.processState",
                    canvas: "sidebarcontent3"
                },
                users: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.users",
                    canvas: "sidebarcontent4"
                },
                events: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.events",
                    canvas: "sidebarcontent5"
                },
                subprocesses: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.subprocesses",
                    canvas: "sidebarcontent6"
                },
                "empty1": { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": true }
        },
        "PLANOVERVIEW": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.plan",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                planActivities: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.plan.activities",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                planSidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.sidebar",
                    canvas: "sidebarcontentextra"
                },
                planAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.action",
                    canvas: "sidebarcontent1"
                },
                planState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.state",
                    canvas: "sidebarcontent2"
                },
                planProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.progress",
                    canvas: "sidebarcontent3"
                },
                planTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.time",
                    canvas: "sidebarcontent4"
                },
                planParent: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.parent",
                    canvas: "sidebarcontent5"
                },
                planUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.users",
                    canvas: "sidebarcontent6"
                }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "PLANACTIVITIES": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.plan",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                planActivities: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.plan.activities",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                planSidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.sidebar",
                    canvas: "sidebarcontentextra"
                },
                planAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.action",
                    canvas: "sidebarcontent1"
                },
                planState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.state",
                    canvas: "sidebarcontent2"
                },
                planProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.progress",
                    canvas: "sidebarcontent3"
                },
                planTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.time",
                    canvas: "sidebarcontent4"
                },
                planParent: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.parent",
                    canvas: "sidebarcontent5"
                },
                planUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.users",
                    canvas: "sidebarcontent6"
                }
            },
            nav: { level: 1 },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "PLANFILES": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.plan",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                files: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.files",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                filesPreview: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.filesPreview",
                    canvas: "sidebarcontent1"
                },
                empty2: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent2" },
                empty3: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent3" },
                empty4: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent4" },
                empty5: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent5" },
                empty6: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent6" },
                empty7: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "PLANCOMMENTS": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.plan",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                discussions: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.discussions",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                planSidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.sidebar",
                    canvas: "sidebarcontentextra"
                },
                discussionSidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.discussion.sidebar",
                    canvas: "sidebarcontent1"
                },
                planAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.action",
                    canvas: "sidebarcontent2"
                },
                planState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.state",
                    canvas: "sidebarcontent3"
                },
                planProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.progress",
                    canvas: "sidebarcontent4"
                },
                planTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.time",
                    canvas: "sidebarcontent5"
                },
                planUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.users",
                    canvas: "sidebarcontent6"
                }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "PLANTIMELINE": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.plan",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                "timeline": {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.timeline",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                "timelineSidebar": {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.timeline.sidebar",
                    canvas: "sidebarcontent1"
                },
                empty2: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent2" },
                empty3: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent3" },
                empty4: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent4" },
                empty5: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent5" },
                empty6: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent6" },
                empty7: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" }
            },
            nav: { level: 1 },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "PLANSIDEBAR": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.plan",
                    canvas: "contentsidebar"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                planSidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.sidebar",
                    canvas: "sidebarcontentextra"
                },
                planAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.action",
                    canvas: "sidebarcontent1"
                },
                planState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.state",
                    canvas: "sidebarcontent2"
                },
                planProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.progress",
                    canvas: "sidebarcontent3"
                },
                planTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.time",
                    canvas: "sidebarcontent4"
                },
                planParent: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.parent",
                    canvas: "sidebarcontent5"
                },
                planUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.users",
                    canvas: "sidebarcontent6"
                }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "EDITACTIVITY": {
            widgets: {
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                activitiesForm: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.desktop.widgets.project.plan.activities.form",
                    canvas: "sidebarcontent1"
                },
                empty1: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontentextra" },
                empty2: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent2" },
                empty3: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent3" },
                empty4: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent4" },
                empty5: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent5" },
                empty6: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent6" }
            },
            nav: { level: 0, refreshLastItemBreadcrumb: false },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        //CONTEXTS FOR ACTIVITY PLAN
        "ACTIVITYPLAN": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity.plan",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                activity: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.activity",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                activitySidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.sidebar",
                    canvas: "sidebarcontentextra"
                },
                activityAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.action",
                    canvas: "sidebarcontent1"
                },
                activityTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.time",
                    canvas: "sidebarcontent2"
                },
                activityProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.progress",
                    canvas: "sidebarcontent3"
                },
                activityParent: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.parent",
                    canvas: "sidebarcontent4"
                },
                activityUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.users",
                    canvas: "sidebarcontent5"
                },
                relatedPlan: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.activity.plan.sidebar",
                    canvas: "sidebarcontent6"
                }
            },
            nav: { level: 0 },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "ACTIVITYPLANCREATE": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity.plan",
                    canvas: "contentsidebar"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                plan: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.plan",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                activitySidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.sidebar",
                    canvas: "sidebarcontentextra"
                },
                activityAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.action",
                    canvas: "sidebarcontent1"
                },
                activityTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.time",
                    canvas: "sidebarcontent2"
                },
                activityProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.progress",
                    canvas: "sidebarcontent3"
                },
                activityParent: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.parent",
                    canvas: "sidebarcontent4"
                },
                activityUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.users",
                    canvas: "sidebarcontent5"
                },
                empty6: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent6" }
            },
            nav: { level: 0 },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "ACTIVITYPLANOVERVIEW": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity.plan",
                    canvas: "contentsidebar"
                },
                "navigator": {
                    "layout": "navigator",
                    "name": "bizagi.workportal.widgets.navigator",
                    "refresh": false
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                overview: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.plan.activities",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                planSidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.sidebar",
                    canvas: "sidebarcontentextra"
                },
                planAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.action",
                    canvas: "sidebarcontent1"
                },
                planState: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.state",
                    canvas: "sidebarcontent2"
                },
                planProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.progress",
                    canvas: "sidebarcontent3"
                },
                planTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.time",
                    canvas: "sidebarcontent4"
                },
                planParent: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.parent",
                    canvas: "sidebarcontent5"
                },
                planUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.users",
                    canvas: "sidebarcontent6"
                }
            },
            nav: { level: 0 },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "ACTIVITYPLANCOMMENTS": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity.plan",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                discussions: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.discussions",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                discussionSidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.discussion.sidebar",
                    canvas: "sidebarcontent1"
                },
                activitySidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.sidebar",
                    canvas: "sidebarcontentextra"
                },
                activityAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.action",
                    canvas: "sidebarcontent2"
                },
                activityTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.time",
                    canvas: "sidebarcontent3"
                },
                activityProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.progress",
                    canvas: "sidebarcontent4"
                },
                activityParent: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.parent",
                    canvas: "sidebarcontent5"
                },
                activityUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.users",
                    canvas: "sidebarcontent6"
                }
            },
            nav: { level: 0 },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "ACTIVITYPLANFILES": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity.plan",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                files: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.files",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                filesPreview: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.filesPreview",
                    canvas: "sidebarcontent1"
                },
                activitySidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.sidebar",
                    canvas: "sidebarcontentextra"
                },
                activityAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.action",
                    canvas: "sidebarcontent2"
                },
                activityTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.time",
                    canvas: "sidebarcontent3"
                },
                activityProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.progress",
                    canvas: "sidebarcontent4"
                },
                activityParent: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.parent",
                    canvas: "sidebarcontent5"
                },
                activityUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.users",
                    canvas: "sidebarcontent6"
                }
            },
            nav: { level: 0 },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "ACTIVITYPLANPROCESSMAP": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity.plan",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                processMap: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.processMap",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                activitySidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.sidebar",
                    canvas: "sidebarcontentextra"
                },
                activityAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.action",
                    canvas: "sidebarcontent1"
                },
                activityTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.time",
                    canvas: "sidebarcontent2"
                },
                activityProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.progress",
                    canvas: "sidebarcontent3"
                },
                activityParent: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.parent",
                    canvas: "sidebarcontent4"
                },
                activityUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.users",
                    canvas: "sidebarcontent5"
                },
                empty6: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent6" }
            },
            nav: { level: 0 },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "ACTIVITYPLANLOG": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity.plan",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                log: {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.activity.log",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                activitySidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.sidebar",
                    canvas: "sidebarcontentextra"
                },
                activityAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.action",
                    canvas: "sidebarcontent1"
                },
                activityTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.time",
                    canvas: "sidebarcontent2"
                },
                activityProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.progress",
                    canvas: "sidebarcontent3"
                },
                activityParent: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.parent",
                    canvas: "sidebarcontent4"
                },
                activityUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.users",
                    canvas: "sidebarcontent5"
                },
                empty6: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent6" }
            },
            nav: { level: 0 },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "ACTIVITYPLANTIMELINE": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.left.sidebar"
                },
                "menu": {
                    layout: "leftSidebar",
                    name: "bizagi.workportal.widgets.project.dashboard.menu.activity.plan",
                    canvas: "contentsidebar"
                },
                "contentDashboard": {
                    "layout": "content",
                    "name": "bizagi.workportal.widgets.project.content.dashboard"
                },
                "timeline": {
                    layout: "contentDashboard",
                    name: "bizagi.workportal.widgets.project.timeline",
                    canvas: "contentprincipal"
                },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.right.sidebar"
                },
                activitySidebar: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.sidebar",
                    canvas: "sidebarcontentextra"
                },
                activityAction: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.action",
                    canvas: "sidebarcontent1"
                },
                activityTime: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.time",
                    canvas: "sidebarcontent2"
                },
                activityProgress: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.progress",
                    canvas: "sidebarcontent3"
                },
                activityParent: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.parent",
                    canvas: "sidebarcontent4"
                },
                activityUsers: {
                    layout: "rightSidebar",
                    name: "bizagi.workportal.widgets.project.plan.activity.users",
                    canvas: "sidebarcontent5"
                },
                empty6: { layout: "rightSidebar", name: "bizagi.workportal.widgets.dummy", canvas: "sidebarcontent6" }
            },
            nav: { level: 0 },
            belongs: { "toLeftSidebarCD": true, "toRightSidebarCD": true, "toTaskSidebarCD": false }
        },
        "REFRESHALL": {
            widgets: {
                "leftSidebar": {
                    layout: "leftsidebar",
                    name: "bizagi.workportal.widgets.dummy"
                },
                "contentDashboard": { layout: "content", name: "bizagi.workportal.widgets.dummy" },
                "rightSidebar": {
                    "layout": "contentrightsidebar",
                    "name": "bizagi.workportal.widgets.dummy"
                }
            },
            nav: { level: 0 }
        }
    }
}, {

    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        self.CONTEXT_HOME = "HOME";

        params = params || {};
        params.supportNav = true;

        self.setContextsByNotifyEvents();
        //Load templates
        self.loadTemplates({
            "homeportal": bizagi.getTemplate("bizagi.workportal.desktop.widget.homeportal").concat("#homeportal-frame")
        });

        if (params.widgetName == "homeportal") {
            if (!bizagi.referrerParams)
                bizagi.referrerParams = {};

            bizagi.referrerParams.referrer = self.getWidgetName();
        }

        self.manager = bizagi.injector.get("widgetManager", params);
        self.manager.sub("notifyChange", $.proxy(self.onNotifyChange, self));
        self.sub("notify", $.proxy(self.onNotifyChange, self));

        bizagi.injector.registerInstance("homeportal", self);
    },
    /**
     * Set context by behaviors sidebars
     */
    setContextsByNotifyEvents: function () {
        var self = this;
        self.params = self.params || {};
        self.params.contextsSidebarActivity = [];
        self.params.contextsWithoutLeftSidebarCaseDashboard = [];
        self.params.contextsLeftSidebarCaseDashboard = [];
        self.params.contextsWithoutRightSidebarCaseDashboard = [];
        self.params.contextsRightSidebarCaseDashboard = [];


        for (var context in this.Class.contexts) {
            if (this.Class.contexts.hasOwnProperty(context)) {
                if (this.Class.contexts[context].belongs && this.Class.contexts[context].belongs.toTaskSidebarCD) {
                    self.params.contextsSidebarActivity.push(context);
                }

                if (this.Class.contexts[context].belongs && this.Class.contexts[context].belongs.toLeftSidebarCD) {
                    self.params.contextsLeftSidebarCaseDashboard.push(context);
                }
                else {
                    self.params.contextsWithoutLeftSidebarCaseDashboard.push(context);
                }

                if (this.Class.contexts[context].belongs && this.Class.contexts[context].belongs.toRightSidebarCD) {
                    self.params.contextsRightSidebarCaseDashboard.push(context);
                }
                else {
                    self.params.contextsWithoutRightSidebarCaseDashboard.push(context);
                }
            }
        }
    },

    /*
     *   Returns the widget name
     */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL;
    },

    /*
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        var d = $.Deferred();

        var template = self.getTemplate("homeportal");
        self.content = template.render({});

        d.resolve(self.content);

        return d.promise();
    },

    /*
     * links events with handlers
     */
    postRender: function () {
        var self = this;
        self.manager.setLayout(self.getContent());
        var servicesPD = new bizagi.workportal.services.behaviors.projectDashboard(self.dataService);
        $.when(servicesPD.getContextToShow(self.params)).done(function (dataPD) {
            var currentContext = dataPD.contextToShow.toLowerCase();

            if (currentContext === "home") {
                if (!bizagiConfig.themesEnabled) {
                    self.loadContext(currentContext, self, dataPD);
                }
                else{
                    servicesPD.getCurrentTheme().done(function (theme) {
                        if (theme.name == "classic") {
                            self.loadContext(currentContext, self, dataPD);
                        }
                        else {
                            servicesPD.setCurrentTheme(theme);
                            self.setWidgetReady();
                        }
                    });
                }
            }
            else {
                self.loadContext(currentContext, self, dataPD);
            }

            
        });
    },

    loadContext: function (currentContext, self, dataPD) {
        var contexts = self.Class.contexts;
        var histName;
        var level;
        bizagi.loader.startAndThen(currentContext).then( function () {
            if (dataPD.contextToShow !== self.CONTEXT_HOME) {
                //Summary case return differnet result to get workitems.
                dataPD.responseGetCaseSummaryDetails.hasGlobalForm = undefined;
                $.extend(self.params, dataPD.responseGetCaseSummaryDetails, dataPD.params);
                //histName = dataPD.nameWorkItem;
            }
            else {
                level=0;
                histName = bizagi.localization.getResource("workportal-widget-home-title");
            }

            $("#ui-bizagi-wp-project-homeportal-main").show();

            $.when(self.manager.updateView({
                context: dataPD.contextToShow,
                data: contexts[dataPD.contextToShow],
                args: $.extend(self.params, {
                    histName: histName,
                    level: level,
                    showContextByMenuDashboard: dataPD.contextToShow
                })
            })).done(function () {
                self.publish("showMainMenu");
                self.setWidgetReady();
                self.manager.pub("homeportalReady");
            });
        });
    },

    /**
     * Notifies when an event is raised
     */
    onNotifyChange: function (ev, params) {
        var self = this,
           context = params.type;

        if (self.isValidContext(context)) {
            //load the module
            return bizagi.loader.startAndThen(context.toLowerCase()).then(function () {
                var servicesPD = new bizagi.workportal.services.behaviors.projectDashboard(self.dataService);
                servicesPD.removeCurrentTheme();

                $.when(self.manager.updateView($.extend({
                        context: context,
                        data: self.Class.contexts[context]
                }, params))).done(function () {
                    $("#ui-bizagi-wp-project-homeportal-main").show();
                    self.publish("showMainMenu");
                });
            });
        }

        return self.manager.emit($.extend(params, { context: context }));
    },

    /**
     * Returns true if the context is valid
     */
    isValidContext: function (context) {
        return (this.Class.contexts[context] !== null &&
        typeof this.Class.contexts[context] == "object");
    },

    /**
     * Override base dispose method
     */
    dispose: function () {
        var self = this;

        self.manager.dispose();
        self._super();
    }
});