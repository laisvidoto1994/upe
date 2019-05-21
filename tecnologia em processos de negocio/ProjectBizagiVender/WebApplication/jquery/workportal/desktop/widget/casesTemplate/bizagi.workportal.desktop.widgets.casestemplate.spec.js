﻿﻿describe("Widget desktop.widgets.casestemplate", function () {
    checkWorkportalDependencies();
    var widget, workportalFacade, dataService, actionService, casetoolbar, usersCasesService, actionsEventsService, accumulatedcontext;

    beforeEach(function () {
        workportalFacade = bizagi.injector.get("workportalFacade");
        dataService = bizagi.injector.get("dataService");
        actionService = bizagi.injector.get("actionService");
        casetoolbar = bizagi.injector.get("casetoolbar");
        usersCasesService = bizagi.injector.get("usersCasesService");
        actionsEventsService = bizagi.injector.get("actionsEventsService");
        accumulatedcontext = bizagi.injector.get("accumulatedcontext");
        widget = new bizagi.workportal.widgets.casestemplate(workportalFacade, dataService, actionService, casetoolbar, usersCasesService, actionsEventsService, accumulatedcontext, {});
    });

    it("Should define the Widget", function(){
        expect(workportalFacade).toBeDefined();
        expect(dataService).toBeDefined();
        expect(actionService).toBeDefined();
        expect(casetoolbar).toBeDefined();
        expect(usersCasesService).toBeDefined();
        expect(actionsEventsService).toBeDefined();
        expect(accumulatedcontext).toBeDefined();
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

        it("Should configure the handlers", function(){
            $.when(promiseRender).done( function ($content) {
                var widgetEvents = $._data(widget.observableElement[0], "events");

                expect(widgetEvents["CASES-TEMPLATE-VIEW"]).toBeDefined();
                expect(widgetEvents["UPDATE-DATATEMPLATE-VIEW"]).toBeDefined();
                expect(widgetEvents["GET-COMMON-ACTIONS"]).toBeDefined();
                expect(widgetEvents["SET-VALUES"]).toBeDefined();
            });
        });

        it("Should clean the handlers", function(){
            $.when(promiseRender).done( function ($content) {
                widget.clean();
                var widgetEvents = $._data(widget.observableElement[0], "events");

                expect(widgetEvents).toBeUndefined();
            });
        });
    });
});

