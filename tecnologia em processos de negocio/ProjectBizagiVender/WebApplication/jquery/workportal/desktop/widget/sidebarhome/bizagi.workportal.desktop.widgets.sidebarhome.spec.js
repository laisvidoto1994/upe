﻿﻿describe("Widget desktop.widgets.sidebarhome", function () {
    checkWorkportalDependencies();
    var widget, workportalFacade, dataService;

    beforeEach(function () {
        dataService = bizagi.injector.get("dataService");
        workportalFacade = bizagi.injector.get("workportalFacade");
        widget = new bizagi.workportal.widgets.sidebarhome(workportalFacade, dataService, {});
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
    });
});

