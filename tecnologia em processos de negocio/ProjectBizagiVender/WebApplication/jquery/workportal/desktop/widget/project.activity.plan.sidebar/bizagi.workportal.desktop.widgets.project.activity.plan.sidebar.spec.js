/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.activity.plan.sidebar
 *
 * @author Bizagi
 */

describe("Widget bizagi.workportal.desktop.widgets.project.activity.plan.sidebar", function () {
    var widget,
        workportalFacade,
        dataService;

    it("Environment has been defined", function(){
        workportalFacade = bizagi.injector.get("workportalFacade");
        dataService = bizagi.injector.get("dataService");
    });

    it("Render Widget with security plans in false", function(done){
        var params = {};
        params = params || {};
        params.menuDashboard = params.menuDashboard = {};
        params.menuDashboard.showPlanOptionMenu = false;
        widget = new bizagi.workportal.widgets.project.activity.plan.sidebar(workportalFacade, dataService, params);
        $.when(widget.areTemplatedLoaded()).done(function(){
            $.when(widget.renderContent()).done(function () {
                widget.postRender();
                expect($("h3", widget.getContent()).length).toBe(0);
                done();
            });
        });
    });

    it("Render Widget", function(done){
        var params = {};
        params = params || {};
        params.menuDashboard = params.menuDashboard = {};
        params.menuDashboard.showPlanOptionMenu = true;
        params.menuDashboard.contextPlanOptionMenu = "PLANOVERVIEW";
        widget = new bizagi.workportal.widgets.project.activity.plan.sidebar(workportalFacade, dataService, params);
        $.when(widget.areTemplatedLoaded()).done(function(){
            $.when(widget.renderContent()).done(function () {
                widget.postRender();
                expect(widget.getContent().html()).not.toBe("");
                expect($("h3", widget.getContent()).length).toBe(1);
                done();
            });
        });
    });

    describe("Functions:", function () {
        describe("loadPlanForm", function () {
            beforeEach(function () {
                spyOn(bizagi.util, "autoSave").and.callFake(function(){
                    var defer = $.Deferred();
                    defer.resolve();
                    return defer.promise();
                });
                spyOn(widget, "pub").and.returnValue(2);
            });
            describe("When there is planChild with currentState", function () {
                it("Should be call context PLANACTIVITIES", function () {
                    widget.params.planChild = {id: "guid", currentState: "PENDING"};
                    widget.loadPlanForm();
                    expect(widget.pub.calls.count()).toEqual(2);
                    expect(widget.pub.calls.mostRecent().args[1].type).toEqual("PLANACTIVITIES");
                });
            });
            describe("When there is not planChild", function () {
                it("Should be call context by value self.params.menuDashboard.contextPlanOptionMenu", function () {
                    widget.params.planChild = {id: "guid"};
                    widget.loadPlanForm();
                    expect(widget.pub.calls.count()).toEqual(2);
                    expect(widget.pub.calls.mostRecent().args[1].type).toEqual("PLANOVERVIEW");
                });
            });
        });
        describe("clean", function(){
            beforeEach(function(){
                spyOn($.fn, "off");
            });
            it("Should remove events", function(){
                widget.clean();
                expect($.fn.off).toHaveBeenCalled();
            });
        });
    });
});
