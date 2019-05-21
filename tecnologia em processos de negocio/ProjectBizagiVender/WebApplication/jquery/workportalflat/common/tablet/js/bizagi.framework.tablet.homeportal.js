/*
 *   Name:
 *   Author: Luis Cabarique - LuisCE
 *   Comments:
 *   -   This script will define homePortal Framework
 */
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.webparts = (typeof (bizagi.webparts) !== "undefined") ? bizagi.webparts : {};


bizagi.workportal.homeportalFramework.extend("bizagi.workportal.homeportalFramework", {}, {
    /**
     *   Constructor
     */
    init: function(workportalFacade) {
        var self = this;
        self._super(workportalFacade);
        self.deviceType = "tablet";        

        self.homePortalLayout = {};

        self.homePortalLayoutDashboard = {
            "menuHome": {
                "position": "homePortal",
                "direction": "left",
                "type": "view",
                "canvas": "menuHome",
                "title": "",
                "layout": "menu-default"
            },
            "dashBoard": {
                "position": "homePortal",
                "direction": "right",
                "type": "view",
                "canvas": "dashBoard",
                "title": "",
                "layout": "main-default"
            }
        };

        self.homePortalLayoutTaskFeed = {
            "taskFeed": {
                "position": "homePortal",
                "direction": "left",
                "type": "view",
                "canvas": "taskFeed",
                "title": "",
                "layout": "side-default"
            },
            "summaryItem": {
                "position": "homePortal",
                "direction": "right",
                "canvas": "summaryItem",
                "type": "view",
                "title": "",
                "layout": "main-default"
            }
        };

        self.homePortalLayoutComplement = {
            "reportsChart": {
                "position": "homePortal",
                "direction": "right",
                "canvas": "reportsChart",
                "title": "Reports",
                "layout": "main-default-close"
            },
            "loadForm": {
                "position": "homePortal",
                "direction": "right",
                "type": "view",
                "canvas": "loadForm",
                "title": "Search Form",
                "layout": "main-default-close-action"
            },
            "renderTemplates": {
                "position": "homePortal",
                "direction": "right",
                "type": "view",
                "canvas": "renderTemplates",
                "title": "Render Template",
                "layout": "main-double-header"
            },
            "caseTemplates": {
                "position": "homePortal",
                "direction": "right",
                "type": "view",
                "canvas": "caseTemplates",
                "title": "",
                "layout": "main-double-header-cases"
            },
            "caseTemplatesOptions": {
                "position": "homePortal",
                "direction": "left",
                "type": "view",
                "canvas": "caseTemplatesOptions",
                "title": "",
                "layout": "side-default-back"
            },
            "stakeHolder": {
                "position": "homePortal",
                "canvas": "menuHome"
            },
            "startForm": {
                "position": "homePortal",
                "direction": "right",
                "canvas": "startForm",
                "title": "Form",
                "layout": "main-default-close"
            },
            "shortCut": {
                "position": "menuHome",
                "canvas": "shortCut"
            },
            "searchesList": {
                "position": "menuHome",
                "canvas": "searchesList"
            },
            "stuff": {
                "position": ["dashBoard"],
                "canvas": ["stuff"]
            }
        };

        bizagi.util.mobility.leftPaneViewShown = $.proxy(self.leftPaneViewShown, self);
    },

    _back: function(direction) {
        var self = this;

        // Add conditions to direction
        if (direction === "left") {
            $("#left-pane").data("kendoMobilePane").navigate("#:back");
        } else {
            $("#right-pane").data("kendoMobilePane").navigate("#:back");
        }
    },

    _backRenderTemplates: function(transition) {
        var self = this;

        if (self.accumulatedContext.length > 1) {
            var accumulatedContext = self.popContext().context;
            var data = accumulatedContext[accumulatedContext.length - 1];
            var args = {
                data: data,
                calculateFilters: data.calculateFilters || false,
                filters: [],
                eventType: "DATA-NAVIGATION"
            };

            bizagi.webpart.publish("homeportalShow", {
                "what": "stuffTemplates",
                "title": args.data.displayName,
                "params": args,
                "preventNavigate": true
            });
        } else {
            if (self.navigateFromRender) {
                bizagi.kendoMobileApplication.navigate("renderSplitView");
                self.navigateFromRender = false;
            }
        }

        self._back(transition);
    },

    _collapseHomePortalPane: function() {
        $("#homePortal").data("kendoMobileSplitView").collapsePanes();
    },

    configureHandler: function() {
        var self = this;
        self._super();
    },

    navigateToRenderTemplates: function(pane) {
        $("#homePortal #right-pane").data("kendoMobilePane").navigate("renderTemplates");
        bizagi.kendoMobileApplication.navigate("homePortal");
    },

    /**
     * navigation control
     * @param navParams
     */
    homePortalNavigate: function(navParams) {
        var destination = navParams.url;
        var canvas = navParams.sender.element;
    },

    /**
     *
     * @param context
     */
    homePortalViewInit: function(context) {
        var self = this;
        self._super(context);
        self.destination = context.view.id.replace(/#/i, "");
        self.content = context.view.element;
        self.container = context.view.container;

        switch (self.destination) {
        case "summaryItem":
            //case "taskFeed":
            $(self.content).on("click", ".bz-header-open-leftPane", function(event) {
                self._openLeftPane();
            });
            $(self.content).on("click", ".btn-back", function(event) {
                self._back();
            });
            $(self.content).on("click", "#bz-workarea-newcase", function(event) {
                self.showDrawer("newCase");
            });
            break;
        case "dashBoard":
            $(".km-view-title", self.content).children().text("DashBoard");
            $(self.content).on("click", ".bz-header-open-leftPane", function(event) {
                self._openLeftPane();
            });
            $(self.content).on("click", ".btn-back", function(event) {
                self._back();
            });
            $(self.content).on("click", "#bz-workarea-newcase", function(event) {
                self.showDrawer("newCase");
            });
            break;
        case "startForm":
            $(self.content).on("click", ".btn-close", function(event) {
                self._back();
            });
            $(self.content).on("click", "#bz-workarea-newcase", function(event) {
                self.showDrawer('newCase');
            });
            break;
        case "discussionCase":
            $(self.content).on("click", ".btn-back", function(event) {
                self._back();
            });
            $(self.content).on("click", "#bz-workarea-newcase", function(event) {
                self.showDrawer("newCase");
            });
            break;
        case "menuHome":
            $(self.content).data("kendoMobileView").header.on("click", ".btn-menu", function(event) {
                self.showDrawer("menu");
            });
            break;
        case "taskFeed":
            $(self.content).on("click", ".bz-header-left-btn.btn-open-drawer", function(event) {
                self.showDrawer("menu");
            });
            break;
        case "caseTemplatesOptions":
            $(self.content).on("click", ".bz-header-left-btn.btn-back", function(event) {
                self._back("right");
                self._back("left");
            });
            break;
        case "caseTemplates":
            $(self.content).on("click", ".bz-header-open-leftPane", function(event) {
                self._openLeftPane();
            });
            $(self.content).on("click", "#bz-workarea-newcase", function(event) {
                self.showDrawer("newCase");
            });
            break;
        case "renderTemplates":
            $(self.content).on("click", ".btn-back", function(event) {
                self._backRenderTemplates();
            });
            $(self.content).on("click", "#bz-workarea-newdata", function(event) {
                bizagi.webpart.publish("newData");
            });
            $(self.content).on("click", ".bz-header-open-leftPane", function(event) {
                self._openLeftPane();
            });
            break;
        case "reportsChart":
            $(self.content).on("click", ".btn-close", function(event) {
                $("iframe", ".bz-wp-reports-chart").remove();
                $(".bz-wp-reports-chart", self.content).empty();

                $("#left-pane", self.conten).toggle();
                $(".km-view-title", self.content).children().text("");
                self._back();
            });
            break;
        }
    },

    /**
     * when view is shown
     * @param navParams
     */
    homePortalViewShown: function(navParams) {
        var self = this;
        var navLength;

        self.destination = navParams.view.id.replace(/#/i, "");
        self.content = navParams.view.element;
        self.container = navParams.view.container;

        if (self.destination === "renderTemplates") {
            $(".km-view-title", self.content).children().text("DashBoard");
        } else {
            if (self.destination === "caseTemplates") {
                //fix navigation bug
                navLength = navParams.sender.history.length;
                if (navParams.sender.history[navLength - 1] === navParams.sender.history[navLength - 3]) {
                    navParams.sender.history.pop();
                    navParams.sender.history.pop();
                }

                $("#left-pane").getKendoMobilePane().navigate("caseTemplatesOptions");
            } else if (self.destination === "reportsChart") {
                navLength = navParams.sender.history.length;
                if (navParams.sender.history[navLength - 1] === navParams.sender.history[navLength - 3]) {
                    navParams.sender.history.pop();
                }

                $(".km-view-title", self.content).children().text("");

                $(".btn-close", self.content).unbind("click").bind("click", function() {
                    $("iframe", ".bz-wp-reports-chart").remove();
                    $(".bz-wp-reports-chart", self.content).empty();

                    $(".km-view-title", self.content).children().text("");
                    self._back();
                });

                // Ocultar pane left
                $("#left-pane", self.conten).toggle();
            }
        }
    },

    leftPaneViewShown: function(navParams) {
        var self = this;

        self.leftDestination = navParams.view.id.replace(/#/i, "");
        self.leftContent = navParams.view.element;
    },

    _openLeftPane: function() {
        var self = this;

        var view = bizagi.kendoMobileApplication.view();
        view.expandPanes();
    },

    homePortalLayoutInit: function(context) {
    },

    closeDrawers: function() {
        $("#menu-drawer").data("kendoMobileDrawer").hide();
        $("#newCase-drawer").data("kendoMobileDrawer").hide();
    }
});
