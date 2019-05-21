/**
 * Initialize bizagi.workportal.widgets.project.plan.activities widget and test it
 *
 * @author Bizagi
 */


describe("Widget bizagi.workportal.widgets.project.plan.activities", function () {
    checkWorkportalDependencies();
    var widget,
        projectDashboard,
        notifier,
        planTemplateCreate,
        planEdit;

    it("Environment has been defined", function (done) {
        bizagi.currentUser = {};
        bizagi.currentUser["uploadMaxFileSize"] = 123;

        notifier = bizagi.injector.get("notifier");
        serviceOrderActivities = bizagi.injector.get("bizagi.workportal.services.behaviors.orderActivitiesByTransitions");

        var params = {};
        params.plan = {"contextualized":true,"id":"152b34bb-65ce-4516-92f1-cdce7ed0464f","name":"plan test","description":null,"currentState":"EXECUTING","parentWorkItem":"4d8c9a0d-2f16-4bfb-bb21-09bf38f94683","creationDate":1456867714887,"startDate":1456868689857,"dueDate":null,"idUserCreator":3,"waitForCompletion":true,"activities":[{"id":"b0fd9832-90f0-4928-b198-4ff4edae3d34","name":"a4","description":null,"allowEdition":true,"idPlan":"152b34bb-65ce-4516-92f1-cdce7ed0464f","userAssigned":3,"duration":null,"progress":0,"finishDate":1456868709177,"startDate":1456868689853,"estimatedFinishDate":1456868689857,"items":[],"idWorkItem":5903,"workItemState":"Completed","idCase":5952,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"parallel":true},{"id":"b0130479-0660-4f06-a02b-8c49fb170c8c","name":"a5","description":null,"allowEdition":true,"idPlan":"152b34bb-65ce-4516-92f1-cdce7ed0464f","userAssigned":3,"duration":null,"progress":0,"finishDate":1456868706237,"startDate":1456868689870,"estimatedFinishDate":1456868689870,"items":[],"idWorkItem":5904,"workItemState":"Completed","idCase":5952,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"parallel":true},{"id":"04792e6b-709c-458f-9ba0-3eb5841abadf","name":"a1","description":null,"allowEdition":true,"idPlan":"152b34bb-65ce-4516-92f1-cdce7ed0464f","userAssigned":3,"duration":null,"progress":0,"finishDate":1456868712707,"startDate":1456868689877,"estimatedFinishDate":1456868689877,"items":[],"idWorkItem":5905,"workItemState":"Completed","idCase":5952,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"parallel":true},{"id":"8ce5cdef-a94c-4239-8b9d-8f505e66de22","name":"a2","description":null,"allowEdition":true,"idPlan":"152b34bb-65ce-4516-92f1-cdce7ed0464f","userAssigned":3,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[],"status":"nodisplay","numResolvedItems":0,"numTotalItems":0,"parallel":true},{"id":"be910c1c-72a8-4465-aa23-5f944cb55f74","name":"a3","description":null,"allowEdition":true,"idPlan":"152b34bb-65ce-4516-92f1-cdce7ed0464f","userAssigned":3,"duration":null,"progress":0,"finishDate":1456868717030,"startDate":1456868712710,"estimatedFinishDate":1456868712710,"items":[],"idWorkItem":5906,"workItemState":"Completed","idCase":5952,"status":"nodisplay","numResolvedItems":0,"numTotalItems":0}],"users":[],"firstParent":{"idCase":5951,"idWorkflow":18,"idWorkitem":5902,"idTask":11,"radNumber":"5951","displayName":"Take Cytology","isWorkitemClosed":false,"planName":""},"parent":{"idCase":5951,"idWorkflow":18,"idWorkitem":5902,"idTask":11,"radNumber":"5951","displayName":"Take Cytology","isWorkitemClosed":false,"planName":""}};

        params["differenceMillisecondsServer"] = 300;
        widget = new bizagi.workportal.widgets.project.plan.activities(dependencies.workportalFacade,
            dependencies.dataService,
            notifier,
            serviceOrderActivities,
            params);

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

    describe("Functions", function(){
        describe("getLastParallelActivityIsRunningOrClose", function(){
            var originalActivities = [];

            it("if there are a activity in execution and is parallel, Should return a activity", function () {
                originalActivities = [
                    {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": true, "startDate": 1456868712710, "finishDate": 1456868712710},
                    {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": true, "startDate": 1456868712710, "finishDate": null},
                    {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": false, "startDate": null}
                ];
                expect(widget.getLastParallelActivityIsRunningOrClose(originalActivities)).toBe("6fe846ee-2473-4838-8e67-3c872d11fced");
            });

            it("Two parallels in execution without finish, should a activity", function () {
                originalActivities = [
                    {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": true, "startDate": 1456868712710, "finishDate": null},
                    {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": true, "startDate": 1456868712710, "finishDate": null},
                    {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": false, "startDate": null}
                ];
                expect(widget.getLastParallelActivityIsRunningOrClose(originalActivities)).toBe("6fe846ee-2473-4838-8e67-3c872d11fced");
            });

            it("When exexuten parallels, one finished, next activities sync are pending. Should return true", function () {
                originalActivities = [
                    {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": true, "startDate": 1456868712710, "finishDate": 1456868712710},
                    {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": true, "startDate": 1456868712710, "finishDate": null},
                    {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": false, "startDate": null, "finishDate": null},
                    {"id": "dae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": false, "startDate": null, "finishDate": null}
                ];
                expect(widget.getLastParallelActivityIsRunningOrClose(originalActivities)).toBe("6fe846ee-2473-4838-8e67-3c872d11fced");
            });

            it("When execute parallels, one finished the other dont finish, next activities sync are pending. Should return true", function () {
                originalActivities = [
                    {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": true, "startDate": 1456868712710, "finishDate": 1456868712710},
                    {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": true, "startDate": 1456868712710, "finishDate": null},
                    {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": true, "startDate": 1456868712710, "finishDate": 1456868712710},
                    {"id": "dae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": false, "startDate": null, "finishDate": null}
                ];
                expect(widget.getLastParallelActivityIsRunningOrClose(originalActivities)).toBe("cae9b531-1c6a-47c1-bcc3-0323de360b67");
            });

            it("In other case. Case no 5, Should a activity", function () {
                originalActivities = [
                    {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": true, "startDate": 1456868712710, "finishDate": 1456868712710},
                    {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": true, "startDate": 1456868712710, "finishDate": 1456868712710},
                    {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": false, "startDate": 1456868712710, "finishDate": 1456868712710},
                    {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": true, "startDate": 1456868712710, "finishDate": 1456868712710},
                    {"id": "dae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": true, "startDate": 1456868712710, "finishDate": null},
                    {"id": "eae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": false, "startDate": null, "finishDate": null},
                    {"id": "fae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": false, "startDate": null, "finishDate": null}
                ];
                expect(widget.getLastParallelActivityIsRunningOrClose(originalActivities)).toBe("dae9b531-1c6a-47c1-bcc3-0323de360b67");
            });

            it("In other case. Case no 1, Should return second last activity", function () {
                originalActivities = [
                    {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": true, "startDate": 1456868712710, "finishDate": 1456868712710},
                    {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": true, "startDate": 1456868712710, "finishDate": 1456868712710},
                    {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": false, "startDate": 1456868712710}
                ];
                expect(widget.getLastParallelActivityIsRunningOrClose(originalActivities)).toBe("6fe846ee-2473-4838-8e67-3c872d11fced");
            });

            it("In other case. Case no 2, Should return null", function () {
                originalActivities = [
                    {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": true, "startDate": 1456868712710, "finishDate": null},
                    {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": true, "startDate": 1456868712710, "finishDate": null},
                    {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": true, "startDate": 1456868712710, "finishDate": null}
                ];
                expect(widget.getLastParallelActivityIsRunningOrClose(originalActivities)).toBe(null);
            });

            it("In other case. Case no 3, Should return null", function () {
                originalActivities = [
                    {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": false, "startDate": 1456868712710, "finishDate": null},
                    {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": true, "startDate": null, "finishDate": null},
                    {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": true, "startDate": null, "finishDate": null}
                ];
                expect(widget.getLastParallelActivityIsRunningOrClose(originalActivities)).toBe(null);
            });

            it("In other case. Case no 4, Should return null", function () {
                originalActivities = [
                    {"id": "b9fee9ed-7d37-4c00-9db7-dcc820002efa","parallel": false, "startDate": 1456868712710, "finishDate": 1456868712710},
                    {"id": "6fe846ee-2473-4838-8e67-3c872d11fced","parallel": false, "startDate": 1456868712710, "finishDate": null},
                    {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": true, "startDate": null, "finishDate": null},
                    {"id": "cae9b531-1c6a-47c1-bcc3-0323de360b67","parallel": true, "startDate": null, "finishDate": null}
                ];
                expect(widget.getLastParallelActivityIsRunningOrClose(originalActivities)).toBe(null);
            });


        });
    });
});
