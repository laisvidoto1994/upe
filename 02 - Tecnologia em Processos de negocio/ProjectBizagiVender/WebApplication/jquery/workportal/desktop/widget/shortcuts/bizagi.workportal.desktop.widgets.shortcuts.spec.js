describe("Widget desktop.widgets.shorcuts", function () {
    checkWorkportalDependencies();
    var widget, dataService, workportalFacade, processActionService;
    var shortcutsByCategory = [
        {
            "category": "Fitness",
            "items": [
                {
                    "displayName": "Request Fitness Assestment",
                    "idProcess": "19c781fb-1e43-4717-978d-963787e70a4a",
                    "icon": null
                }
            ]
        },
        {
            "category": "Classes",
            "items": [
                {
                    "displayName": "Schedule Personal Trainer",
                    "idProcess": "ef88e796-81cf-4b9d-87d4-3bf958e4c28d",
                    "icon": null
                }
            ]
        }
    ];

    beforeEach(function(){
        dataService = bizagi.injector.get("dataService");
        workportalFacade = bizagi.injector.get("workportalFacade");
        processActionService = bizagi.injector.get("processActionService");
        widget = new bizagi.workportal.widgets.shortcuts(workportalFacade, dataService, processActionService, {});
    });

    it("Should define the Widget", function(){
        expect(dataService).toBeDefined();
        expect(workportalFacade).toBeDefined();
        expect(processActionService).toBeDefined();
        expect(widget).toBeDefined();
    });

    describe("Display shortcuts", function(){
        var promiseRender;

        beforeEach(function(){
            sinon.stub(dataService, "getMyShortcutsByCategory", function(){
                var defer = new $.Deferred();
                defer.resolve(shortcutsByCategory);
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

        afterEach(function(){
            dataService.getMyShortcutsByCategory.restore();
        });

        it("Should display the shortcuts", function() {
            $.when(promiseRender).done( function ($content) {
                expect($content).not.toBe("");
                expect($content).toBeDefined();
            });
        });

        it("Should detach the events", function(){
            $.when(promiseRender).done( function ($content) {
                widget.clean();
            });
        });

        it("Should launchActionsAfterCreateCase when a shortcut is clicked and does have start form", function(){
            $.when(promiseRender).done( function ($content) {
                var hasStartForm = {
                    "startForm":false,
                    "entityId":"d2d5319c-cf5b-45a1-80fa-ee99a078bba9",
                    "entityName":"FitnessAssessment"
                };

                sinon.spy(widget.processActionService, "launchActionsAfterCreateCase");

                sinon.stub(dataService, "actionsHasStartForm", function(){
                    var defer = new $.Deferred();
                    defer.resolve(hasStartForm);
                    return defer.promise();
                });

                sinon.stub(dataService, "actionCreateCase", function(){
                    var defer = new $.Deferred();
                    defer.resolve({"caseId":3151});
                    return defer.promise();
                });

                var $shortcut = $(".wdg-srcts-container", $content)[0];
                $($shortcut).trigger("click");
                expect(widget.processActionService.launchActionsAfterCreateCase.called).toBe(true);

                dataService.actionsHasStartForm.restore();
                dataService.actionCreateCase.restore();
            });
        });

        it("Should executeProcessAction when a shortcut is clicked and does have start form", function(){
            $.when(promiseRender).done( function ($content) {
                var hasStartForm = {
                    "startForm":true,
                    "entityId":"d2d5319c-cf5b-45a1-80fa-ee99a078bba9",
                    "entityName":"FitnessAssessment"
                };

                sinon.spy(widget.processActionService, "executeProcessAction");

                sinon.stub(dataService, "actionsHasStartForm", function(){
                    var defer = new $.Deferred();
                    defer.resolve(hasStartForm);
                    return defer.promise();
                });

                var $shortcut = $(".wdg-srcts-container", $content)[0];
                $($shortcut).trigger("click");
                expect(widget.processActionService.executeProcessAction.called).toBe(true);

                dataService.actionsHasStartForm.restore();
            });
        });
    });
});