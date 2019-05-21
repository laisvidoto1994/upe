﻿﻿describe("Widget desktop.widgets.left.sidebar", function () {
    checkWorkportalDependencies();
    var widget, workportalFacade, dataService, behaviorCollapsiblePanels;

    beforeEach(function () {
        dataService = bizagi.injector.get("dataService");
        workportalFacade = bizagi.injector.get("workportalFacade");
        behaviorCollapsiblePanels = bizagi.injector.get("behaviorCollapsiblePanels");
        widget = new bizagi.workportal.widgets.left.sidebar(workportalFacade, dataService,behaviorCollapsiblePanels, {});
    });

    it("Should define the Widget", function(){
        expect(dataService).toBeDefined();
        expect(workportalFacade).toBeDefined();
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

        it("Should collapse the left panel", function() {
            $.when(promiseRender).done( function ($content) {
                sinon.spy(widget.behaviorCollapsiblePanels, "addClassesCollapseSideBar");
                widget.onCollapsePanel(null);
                expect(widget.behaviorCollapsiblePanels.addClassesCollapseSideBar.called).toBe(true);
            });
        });

        it("Should detach the events", function() {
            $.when(promiseRender).done( function ($content) {
                widget.clean();
                var events = $._data(widget.observableElement[0], "events");
                expect(events).toBeUndefined();
            });
        });
    });
});

