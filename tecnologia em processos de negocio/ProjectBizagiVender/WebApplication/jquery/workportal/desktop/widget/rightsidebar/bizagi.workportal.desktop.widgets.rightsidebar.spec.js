﻿describe("Widget desktop.widgets.right.sidebar", function () {
    checkWorkportalDependencies();
    var widget, dataService, workportalFacade, behaviorCollapsiblePanels;
    var params = {
        "idCase": 9702,
        "idWorkflow": 7,
        "idWorkitem": "10254",
        "idTask": 20,
        "contextsRightSidebarCaseDashboard": [
            "ACTIVITY",
            "OVERVIEW",
            "COMMENTS",
            "FILES",
            "PROCESSMAP",
            "LOG",
            "PLANCREATE",
            "PLANOVERVIEW",
            "PLANACTIVITIES",
            "PLANFILES",
            "PLANCOMMENTS",
            "PLANSIDEBAR",
            "EDITACTIVITY",
            "ACTIVITYPLAN",
            "ACTIVITYPLANCREATE",
            "ACTIVITYPLANOVERVIEW",
            "ACTIVITYPLANCOMMENTS",
            "ACTIVITYPLANFILES",
            "ACTIVITYPLANPROCESSMAP",
            "ACTIVITYPLANLOG"
        ],
        "contextsWithoutRightSidebarCaseDashboard": [
            "HOME",
            "TEMPLATEENGINE-VIEW",
            "ENTITY-ENGINE-VIEW",
            "SEARCH-ENGINE-VIEW",
            "CASES-TEMPLATE-VIEW",
            "PLANS-VIEW",
            "REFRESHALL"
        ]
    };

    beforeEach(function () {
        dataService = bizagi.injector.get("dataService");
        workportalFacade = bizagi.injector.get("workportalFacade");
        behaviorCollapsiblePanels = bizagi.injector.get("behaviorCollapsiblePanels");
        widget = new bizagi.workportal.widgets.right.sidebar(workportalFacade, dataService, behaviorCollapsiblePanels, params);
    });

    it("Should define the Widget", function(){
        expect(dataService).toBeDefined();
        expect(workportalFacade).toBeDefined();
        expect(behaviorCollapsiblePanels).toBeDefined();
        expect(widget).toBeDefined();
    });

    describe("Behavior initializing the widget", function () {
        var promiseRender;

        beforeEach(function () {
            var defer = new $.Deferred();
            promiseRender = defer.promise();

            $.when(widget.areTemplatedLoaded()).then(function(){
                return widget.render();
            }).done(function($content) {
                defer.resolve($content);
            });
        });

        it("Should render the content", function() {
            $.when(promiseRender).done( function ($content) {
                expect($content).not.toBe("");
                expect($content).toBeDefined();
            });
        });

        it("Should define the events", function() {
            $.when(promiseRender).done( function ($content) {
                widget.updateView(null, {context: "ACTIVITY"});

                var events = $._data(widget.observableElement[0], "events");
                expect(events["OPEN_RIGHT_SIDEBAR"]).toBeDefined();
                expect(events["DISABLED_RIGHT_SIDEBAR"]).toBeDefined();
                expect(events["ENABLED_RIGHT_SIDEBAR"]).toBeDefined();
            });
        });

        it("Should enable the rigth side bar", function() {
            $.when(promiseRender).done( function ($content) {
                widget.updateView(null, {context: "ACTIVITY"});

                widget.pub("ENABLED_RIGHT_SIDEBAR", {});
            });
        });

        it("Should disable the rigth side bar", function() {
            $.when(promiseRender).done( function ($content) {
                widget.updateView(null, {context: "ACTIVITY"});

                widget.pub("DISABLED_RIGHT_SIDEBAR", {});
            });
        });

        it("Should open the rigth side bar", function() {
            $.when(promiseRender).done( function ($content) {
                widget.updateView(null, {context: "ACTIVITY"});
                widget.pub("OPEN_RIGHT_SIDEBAR", {});
                expect(widget.behaviorCollapsiblePanels.addClassesCollapseSideBar.called).toBe(true);
            });
        });

        it("Should collapse the rigth panel", function() {
            $.when(promiseRender).done( function ($content) {
                widget.updateView(null, {context: "ACTIVITY"});
                widget.onCollapsePanel(null);
                expect(widget.behaviorCollapsiblePanels.addClassesCollapseSideBar.called).toBe(true);
            });
        });

        it("Should detach the events", function() {
            $.when(promiseRender).done( function ($content) {
                widget.updateView(null, {context: "ACTIVITY"});
                widget.clean();
                var events = $._data(widget.observableElement[0], "events");
                expect(events).toBeUndefined();
            });
        });
    });
});

