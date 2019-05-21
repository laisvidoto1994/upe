/*
 *   Name:
 *   Author: Luis Cabarique - LuisCE
 *   Comments:
 *   -   This script will define homePortal Framework
 */
bizagi = (typeof(bizagi) !== "undefined") ? bizagi : {};
bizagi.webparts = (typeof(bizagi.webparts) !== "undefined") ? bizagi.webparts : {};


bizagi.workportal.homeportalFramework.extend("bizagi.workportal.homeportalFramework", {}, {
    /**
     *   Constructor
     */
    init: function(workportalFacade) {
        var self = this;
        self._super(workportalFacade);
        self.deviceType = "smartphone";

        self.homePortalLayoutDashboard = {
            "menuHome": {
                "position": "homePortal",
                "direction": "left",
                "type": "view",
                "canvas": "menuHome",
                "title": "",
                "elastic": "false",
                "layout": "main-default"
            }
        };

        self.homePortalLayoutTaskFeed = {
            "taskFeed": {
                "position": "homePortal",
                "direction": "left",
                "canvas": "taskFeed",
                "type": "view",
                "title": "",
                "layout": "activity-feed"
            }
        };

        self.homePortalLayoutComplement = {
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
                "title": "Entities",
                "layout": "main-double-header"
            },
            "caseTemplates": {
                "position": "homePortal",
                "direction": "right",
                "type": "view",
                "canvas": "caseTemplates",
                "title": "Cases",
                "layout": "main-double-header-cases"
            },
            "caseTemplatesOptions": {
                "position": "homePortal",
                "direction": "right",
                "type": "drawer",
                "canvas": "caseTemplatesOptions",
                "title": ""
            },
            "stakeHolder": {
                "position": "homePortal",
                "canvas": "menuHome"
            },
            "stuff": {
                "position": "menuHome",
                "canvas": "stuff"
            },
            "shortCut": {
                "position": "menuHome",
                "canvas": "shortCut"
            },
            "dashBoard": {
                "position": "menuHome",
                "canvas": "dashBoard"
            },
            "searchesList": {
                "position": "shortCut",
                "canvas": "searchesList"
            },

            "startForm": {
                "position": "homePortal",
                "elastic": "false",
                "nativeScrolling": "true",
                "direction": "right",
                "type": "view",
                "canvas": "startForm",
                "title": "Form",
                "layout": "main-default-close"
            }
        };
    },


    _back: function(transition){
        var self = this;
        self.container.data('kendoMobilePane').navigate('#:back', transition || "");
        //$("#homeportal-pane").data("kendoMobilePane").navigate('#:back', transition || "");
    },

    _backRenderTemplates: function (transition) {
        var self = this;

        if (self.accumulatedContext.length > 1) {
            var context = self.accumulatedContext[self.accumulatedContext.length-1];
            var accumulatedContext = self.popContext().context;
            if (context.navigateFromRender){
                bizagi.kendoMobileApplication.navigate("renderSplitView");
                self.navigateFromRender = false;
            }else{
                var data = accumulatedContext[accumulatedContext.length-1];
                var args = {
                    data: data,
                    calculateFilters: data.calculateFilters || false,
                    filters: [],
                    eventType: "DATA-NAVIGATION"
                };

                bizagi.webpart.publish("homeportalShow", { "what": "stuffTemplates", "title": args.data.displayName, "params": args, "preventNavigate": true });
            }
        } else {
            if (self.navigateFromRender) {
                bizagi.kendoMobileApplication.navigate("renderSplitView");
                self.navigateFromRender = false;
            }
        }

        self._back(transition);
    },

    configureHandler: function(){
        var self = this;
        self._super();
    },

    navigateToRenderTemplates: function(pane){
        $("#homeportal-pane").data("kendoMobilePane").navigate("renderTemplates");
        bizagi.kendoMobileApplication.navigate("homePortal");
    },

    /**
     * navigation control
     * @param navParams
     */
    homePortalNavigate: function(navParams){
        var destination = navParams.url;
        var canvas = navParams.sender.element;
    },

    /**
     * when view is shown
     * @param navParams
     */
    homePortalViewShown: function(navParams) {
        var self = this;
        self.destination = navParams.view.id.replace(/#/i, "");
        self.content = navParams.view.element;
        self.container = navParams.view.container;

        switch (self.destination) {
        case "dashBoard":
            $(".km-view-title", self.content).children().text("Stuff");
            $(".btn-back", self.content).unbind("click").bind("click", function() {
                self._back("fade");
            });
                $("#bz-workarea-newcase", self.content).unbind("click").bind("click", function() {
                    self.showDrawer("newCase");
            });
            break;
        case "taskFeed":
                $(".bz-login-user", self.content).unbind("click").bind("click", function() {
                    self.showDrawer("menu");
                });
                $("#bz-workarea-newcase", self.content).unbind("click").bind("click", function() {
                    self.showDrawer("newCase");
                });
            break;
        case "renderTemplates":
            $(".btn-back", self.content).unbind("click").bind("click", function() {
                self._backRenderTemplates();
            });
            $("#bz-workarea-newdata", self.content).unbind("click").bind("click", function() {
                bizagi.webpart.publish("newData");
            });
            break;
        case "startForm":
            $(".btn-close", self.content).unbind("click").bind("click", function() {
                self._back();
            });
            $("#bz-workarea-newcase", self.content).unbind("click").bind("click", function() {
                self.showDrawer("newCase");
            });
            break;
        case "discussionCase":
            $(".btn-back", self.content).unbind("click").bind("click", function() {
                self._back();
            });
            $("#bz-workarea-newcase", self.content).unbind("click").bind("click", function() {
                self.showDrawer("newCase");
            });
            break;
        case "caseTemplates":
            $(".btn-back", self.content).unbind("click").bind("click", function() {
                self._back();
            });
            $("#bz-workarea-caseTemplatesOptions", self.content).unbind("click").bind("click", function() {
                self.showDrawer("caseTemplatesOptions");
            });
            break;
        }
    },

    drawerBeforeShow: function(context){
        var self = this;
        var drawer = context.view.element.attr("id");
        if(drawer === "newCase-drawer"){
            if(self.destination === "caseTemplates" || self.destination === "renderTemplates" ){
                context.preventDefault();
            }
        }
        if(drawer === "caseTemplatesOptions"){
            if(self.destination === "renderTemplates" ){
                context.preventDefault();
            }
        }
    },

    displayNotification: function(params){
        var self = this;
        var currentPane = self.container.data('kendoMobilePane');
        if(typeof(bizagi.templates.services.service.cachedTemplates["wp-notification"]) === 'undefined'){
            $.when(self.workportalFacade.loadTemplate("wp-notification", bizagi.getTemplate("base.workportal.smartphone.notification"))).done(function(){
                bizagi.util.mobility.showNotification(params, currentPane.view().element);
            });
        }else{
            bizagi.util.mobility.showNotification(params, currentPane.view().element);
        }
    },

    closeDrawers: function(){
        $("#menu-drawer").data("kendoMobileDrawer").hide();
        $("#newCase-drawer").data("kendoMobileDrawer").hide();
        $("#caseTemplatesOptions").data("kendoMobileDrawer").hide();
    }

});