/**
 * Initialize project.timeline widget and test it
 *
 */


describe("Widget project.timeline", function () {
    checkWorkportalDependencies();
    var widget, notifier;

    it("Environment has been defined", function (done) {
        notifier = bizagi.injector.get("notifier");

        var backupBizagi = bizagi.clone(bizagi || {});
        bizagi.currentUser = {
            "idUser": 1,
            "user": "domain\admon",
            "userName": "admon",
            "uploadMaxFileSize": 1048576
        };

        var params = {plan : {id: "a54d1f17-2d3e-4b20-9389-869c63653477"}};

        widget = new bizagi.workportal.widgets.project.timeline(dependencies.workportalFacade, dependencies.dataService, notifier, params);

        $.when(widget.areTemplatedLoaded())
            .done(function () {
                $.when(widget.renderContent()).done(function (html) {
                    dependencies.canvas.empty();
                    dependencies.canvas.append(html);
                    widget.postRender();
                    done();
                });
            });

    });

    it("Environment has been defined with content", function (done) {
        var contentWidget = widget.getContent();
        expect(contentWidget).not.toBe("");
        done();
    });

    describe("Functions", function () {
        describe("getRadNumber", function () {
            beforeEach(function () {
                spyOn(widget.dataService, "getCaseByPlan").and.callFake(function(){
                    var defer = $.Deferred();
                    defer.resolve({id: "123"});
                    return defer.promise();
                });
            });
            describe("When param is undefined", function () {
                it("Should be return call getCaseByPlan service", function () {
                    $.when(widget.getRadNumber()).done(function(response) {
                        expect(response).toBe("IDCASE_123");
                        expect(widget.dataService.getCaseByPlan).toHaveBeenCalled();
                    });
                });
            });
            describe("When param is GUID", function () {
                it("Should be return call getCaseByPlan service", function () {
                    var guid = "a54d1f17-2d3e-4b20-9389-869c63653477";
                    $.when(widget.getRadNumber(guid)).done(function(response) {
                        expect(response).toBe("IDCASE_123");
                        expect(widget.dataService.getCaseByPlan).toHaveBeenCalled();
                    });
                });
            });
            describe("When param is not A GUID", function () {
                it("Should be return call getCaseByPlan service", function () {
                    var notAguid = "123456";
                    $.when(widget.getRadNumber(notAguid)).done(function(response) {
                        expect(response).toBe("RADNUMBER_" + notAguid);
                        expect(widget.dataService.getCaseByPlan).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
