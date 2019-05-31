﻿describe("Widget desktop.widgets.stuff", function () {
    checkWorkportalDependencies();
    var widget, stuff, dataService, accumulatedcontext;
    var stuff = [
        {
            "reference": "0fbe621f-9f8a-4c50-8363-291ffcd8a5b4",
            "entityId": "d2c3bfa7-026c-487f-8d66-e44c4fefd917",
            "xpath": "Comments",
            "displayName": "Comments",
            "surrogateKey": 1,
            "referenceType": "FACT",
            "icon": "bz-icon bz-icon-comment"
        },
        {
            "reference": "db351ac3-0c4f-4289-ad84-6eeb2d78675a",
            "entityId": "d2c3bfa7-026c-487f-8d66-e44c4fefd917",
            "xpath": "Personalsessions",
            "displayName": "Personal sessions",
            "surrogateKey": 1,
            "referenceType": "FACT",
            "icon": "bz-icon bz-icon-stakeholder"
        },
        {
            "reference": "c1f0b592-07c9-4962-a03c-010d8aef9739",
            "displayName": "Group class",
            "surrogateKey": 1,
            "referenceType": "VIRTUAL"
        },
        {
            "reference": "8c3199df-1d02-4ff9-9066-7ac71b6934bc",
            "displayName": "GroupClients",
            "surrogateKey": 101,
            "referenceType": "VIRTUAL"
        }
    ];
    beforeEach(function () {
        dataService = bizagi.injector.get("dataService");
        workportalFacade = bizagi.injector.get("workportalFacade");
        accumulatedcontext = bizagi.injector.get("accumulatedcontext");
        widget = new bizagi.workportal.widgets.stuff(dependencies.workportalFacade, dependencies.dataService, accumulatedcontext, {});
    });

    it("Should define the Widget", function(){
        expect(dataService).toBeDefined();
        expect(workportalFacade).toBeDefined();
        expect(accumulatedcontext).toBeDefined();
        expect(widget).toBeDefined();
    });

    describe("Display my stuff", function () {
        var promiseRender;

        beforeEach(function () {
            sinon.stub(dataService, "getUserStuff", function(){
                var defer = new $.Deferred();
                defer.resolve(stuff);
                return defer.promise();
            });

            var defer = new $.Deferred();
            promiseRender = defer.promise();

            $.when(widget.areTemplatedLoaded()).then(function(){
                return widget.render();
            }).done(function($content) {
                defer.resolve($content);
            });
        });

        afterEach(function () {
            dataService.getUserStuff.restore();
        });

        it("Should display my stuff", function() {
            $.when(promiseRender).done( function ($content) {
                expect($content).not.toBe("");
                expect($content).toBeDefined();
            });
        });

        it("Should configure handlres", function() {
            $.when(promiseRender).done( function ($content) {
                var events = $._data(widget.observableElement[0], "events");
                expect(events["TEMPLATEENGINE-VIEW"]).toBeDefined();
            });
        });

        it("Should build the collections model base on the data", function() {
            $.when(promiseRender).done( function ($content) {
                var collections = widget.model.collections;
                expect(Object.keys(collections).length).toBe(stuff.length);
            });
        });

        it("Should go to template engine when clicking a collection and clean the accumulatedcontext", function() {
            $.when(promiseRender).done( function ($content) {
                sinon.spy(widget.accumulatedcontext, "clean");
                sinon.spy(widget, "pubDeadLockDetection");

                var $stuff = $(".wdg-stf-card", $content)[0];
                $($stuff).trigger("click");

                expect(widget.accumulatedcontext.clean.called).toBe(true);
                expect(widget.pubDeadLockDetection.called).toBe(true);

                var args = {
                    "type": "TEMPLATEENGINE-VIEW",
                    "args": {
                        "filters": [],
                        "fromActionLauncher": false,
                        "histName": "Comments",
                        "level": 1,
                        "page": 1,
                        "reference": "0fbe621f-9f8a-4c50-8363-291ffcd8a5b4",
                        "referenceType": "FACT",
                        "surrogateKey": 1,
                        "calculateFilters": true,
                        "guidEntityCurrent": "d2c3bfa7-026c-487f-8d66-e44c4fefd917",
                        "xpath": "Comments"
                    }
                };
                expect(widget.pubDeadLockDetection.calledWith("notify", args)).toBe(true);
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

