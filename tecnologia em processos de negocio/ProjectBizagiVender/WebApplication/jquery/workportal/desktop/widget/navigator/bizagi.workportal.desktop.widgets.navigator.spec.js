﻿﻿describe("Widget desktop.widgets.navigator", function () {
    checkWorkportalDependencies();
    var widget, workportalFacade, dataService, accumulatedcontext;
    var promiseRender;
    beforeEach(function () {
        dataService = bizagi.injector.get("dataService");
        workportalFacade = bizagi.injector.get("workportalFacade");
        accumulatedcontext = bizagi.injector.get("accumulatedcontext");
        widget = new bizagi.workportal.widgets.navigator(workportalFacade, dataService, accumulatedcontext, {});
    });

    it("Should define the Widget", function(){
        expect(dataService).toBeDefined();
        expect(workportalFacade).toBeDefined();
        expect(accumulatedcontext).toBeDefined();
        expect(widget).toBeDefined();
    });

    describe("Behavior initializing the widget", function () {


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

        it("Should configure the handlers", function() {
            $.when(promiseRender).done( function ($content) {
                var events = $._data(widget.observableElement[0], "events");
                expect(events["NAVIGATE"]).toBeDefined();
                expect(events["NAVIGATOR_GETLEVEL"]).toBeDefined();
                expect(events["NAVIGATOR_BACK"]).toBeDefined();
            });
        });

        it("Should show the print form and hide diplay the date", function() {
            $.when(promiseRender).done( function ($content) {
                sinon.spy(widget, "showButtonPrintForm");
                sinon.spy(widget, "onDisplayDate");

                widget.setStateBarNavigator("ACTIVITY");

                expect(widget.flagDisplayDate).toBe(false);
                expect($(".navbar-date", $content).css("display")).toBe("none");
                expect(widget.showButtonPrintForm.calledWith(true)).toBe(true);
                expect(widget.onDisplayDate.calledWith(false)).toBe(true);
            });
        });

        it("Should hide the print form and show diplay the date", function() {
            $.when(promiseRender).done( function ($content) {
                sinon.spy(widget, "showButtonPrintForm");
                sinon.spy(widget, "onDisplayDate");

                widget.setStateBarNavigator("CASES-TEMPLATE");

                expect(widget.flagDisplayDate).toBe(true);
                expect($(".navbar-date", $content).css("display")).toBe("block");
                expect(widget.showButtonPrintForm.calledWith(false)).toBe(true);
                expect(widget.onDisplayDate.calledWith(true)).toBe(true);
            });
        });



    });
    describe("Functions", function () {
        describe("setWidthToNavigationPanel", function () {
            it("Should call width function JQuery", function () {
                spyOn($.fn, "width");
                widget.content = $(".child", "<div class='parent'><div class='child'></div></div>");
                widget.setWidthToNavigationPanel();
                expect($.fn.width).toHaveBeenCalled();
            });
        });

        describe("updateLastCrumbParamsInfo", function () {
            it("Should modify params", function () {
                widget.info = widget.info || {"-1": {args: {param: "1"}}};
                widget.updateLastCrumbParamsInfo({}, {args: {newParam: "newValueParam"}});
                expect(widget.info[Object.keys(widget.info).length - 2].args.newParam).toBe("newValueParam");
            });
        });

        describe("setEnabledBackButton", function () {
            describe("When caseLink param is true", function () {
                it("Should hide backbutton", function () {
                    widget.caseLink = true;
                    spyOn($.fn, "hide");
                    widget.setEnabledBackButton();
                    expect($.fn.hide).toHaveBeenCalled();
                });
            });
        });
        it("Should detach all the events", function() {
            $.when(promiseRender).done( function ($content) {
                widget.clean();
                var events = $._data(widget.observableElement[0], "events");
                expect(events).toBeUndefined();
            });
        });

    });
});

