/**
 * Unit Testing bizagi.workportal.widgets.project.plan.edit
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.project.plan.edit", function () {
    var widget,
        workportalFacade,
        dataService,
        notifier;



    it("Environment has been defined", function () {
        workportalFacade = bizagi.injector.get("workportalFacade");
        dataService = bizagi.injector.get("dataService");
        notifier = bizagi.injector.get("notifier");
    });

    it("Render Widget", function (done) {
        var params = {};
        widget = bizagi.injector.get("bizagi.workportal.widgets.project.plan.edit");
        widget.init(dependencies.workportalFacade, dependencies.dataService, notifier, params);

        $.when(widget.areTemplatedLoaded()).done(function () {
            $.when(widget.renderContent()).done(function () {
                widget.postRender();
                done();
            });
        });
    });

    describe("Functions:", function () {
        beforeEach(function () {
            bizagi.currentUser = {idUser: "123"};
        });
        describe("showPopup", function () {
            beforeEach(function () {
                planToEdit = JSON.parse('{"id":"a5508e97-3028-4dce-afe4-8c133ccd3680","name":"plan con actividades","description":null,"currentState":"EXECUTING","parentWorkItem":null,"creationDate":1449679840147,"startDate":1449679853357,"dueDate":null,"idUserCreator":3,"waitForCompletion":true,"activities":null,"contextualized":false,"fromDate":"hace 1 minuto","value":0,"completedActivities":0,"activitiesLength":0,"users":{"3":[{"id":"4fada119-09a8-4578-bd14-da32b0f3ef7e","name":"Acti 1","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":100,"finishDate":1449679882257,"startDate":1449679853023,"estimatedFinishDate":1449679853023,"items":[],"idWorkItem":11601,"workItemState":"Completed","idCase":6601},{"id":"5f062f82-c485-4b43-b94d-788c8916fdf2","name":"Acti 2","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":100,"finishDate":1449679885660,"startDate":1449679882280,"estimatedFinishDate":1449679882283,"items":[],"idWorkItem":11602,"workItemState":"Completed","idCase":6601},{"id":"23f4e5ce-b992-432b-b789-98d2d97169a8","name":"Act 3","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":0,"finishDate":null,"startDate":1449679885687,"estimatedFinishDate":1449679885687,"items":[],"idWorkItem":11603,"workItemState":"Active","idCase":6601},{"id":"842c2453-f301-4fc9-9b82-143b917555de","name":"Act 4","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]}]}}');
                planToEdit.dueDate = Date.now();
                spyOn(widget, "initEditDialogBox").and.callThrough();
            });
            it("Should call initEditDialogBox", function () {
                widget.showPopup({}, dataService, planToEdit);
                expect(widget.initEditDialogBox).toHaveBeenCalled();
            });
        });

        describe("saveEditedPlan", function () {
            beforeEach(function () {
                spyOn(widget.dataService, "updatePlan");
                spyOn(widget, "getParamsUpdatePlan").and.callFake(function(){
                    var defer = $.Deferred();
                    defer.resolve({param: "123"});
                    return defer.promise();
                });
                widget.planToEdit = JSON.parse('{"id":"a5508e97-3028-4dce-afe4-8c133ccd3680","name":"plan con actividades","description":null,"currentState":"EXECUTING","parentWorkItem":null,"creationDate":1449679840147,"startDate":1449679853357,"dueDate":null,"idUserCreator":3,"waitForCompletion":true,"activities":null,"contextualized":false,"fromDate":"hace 1 minuto","value":0,"completedActivities":0,"activitiesLength":0,"users":{"3":[{"id":"4fada119-09a8-4578-bd14-da32b0f3ef7e","name":"Acti 1","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":100,"finishDate":1449679882257,"startDate":1449679853023,"estimatedFinishDate":1449679853023,"items":[],"idWorkItem":11601,"workItemState":"Completed","idCase":6601},{"id":"5f062f82-c485-4b43-b94d-788c8916fdf2","name":"Acti 2","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":100,"finishDate":1449679885660,"startDate":1449679882280,"estimatedFinishDate":1449679882283,"items":[],"idWorkItem":11602,"workItemState":"Completed","idCase":6601},{"id":"23f4e5ce-b992-432b-b789-98d2d97169a8","name":"Act 3","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":0,"finishDate":null,"startDate":1449679885687,"estimatedFinishDate":1449679885687,"items":[],"idWorkItem":11603,"workItemState":"Active","idCase":6601},{"id":"842c2453-f301-4fc9-9b82-143b917555de","name":"Act 4","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]}]}}');
                event = {
                    preventDefault: function () {
                    }
                }
            });
            it("Should call updatePlan", function () {
                widget.saveEditedPlan(event);
                expect(widget.dataService.updatePlan).toHaveBeenCalled();
            });
        });

        describe("validateEditDialogBoxParams", function () {
            beforeEach(function () {
                widget.editDialogBox.elements.inputName.val('');
            });
            it("Should return false", function () {
                expect(widget.validateEditDialogBoxParams()).toBe(false);
            });
        });

        describe("getParamsUpdatePlan", function () {
            beforeEach(function () {

                var plan = JSON.parse('{"id":"a5508e97-3028-4dce-afe4-8c133ccd3680","name":"plan con actividades","description":null,"currentState":"EXECUTING","parentWorkItem":null,"creationDate":1449679840147,"startDate":1449679853357,"dueDate":null,"idUserCreator":3,"waitForCompletion":true,"activities":null,"contextualized":false,"fromDate":"hace 1 minuto","value":0,"completedActivities":0,"activitiesLength":0,"users":{"3":[{"id":"4fada119-09a8-4578-bd14-da32b0f3ef7e","name":"Acti 1","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":100,"finishDate":1449679882257,"startDate":1449679853023,"estimatedFinishDate":1449679853023,"items":[],"idWorkItem":11601,"workItemState":"Completed","idCase":6601},{"id":"5f062f82-c485-4b43-b94d-788c8916fdf2","name":"Acti 2","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":100,"finishDate":1449679885660,"startDate":1449679882280,"estimatedFinishDate":1449679882283,"items":[],"idWorkItem":11602,"workItemState":"Completed","idCase":6601},{"id":"23f4e5ce-b992-432b-b789-98d2d97169a8","name":"Act 3","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":0,"finishDate":null,"startDate":1449679885687,"estimatedFinishDate":1449679885687,"items":[],"idWorkItem":11603,"workItemState":"Active","idCase":6601},{"id":"842c2453-f301-4fc9-9b82-143b917555de","name":"Act 4","description":null,"allowEdition":true,"idPlan":"a5508e97-3028-4dce-afe4-8c133ccd3680","userAssigned":3,"duration":null,"progress":0,"finishDate":null,"startDate":null,"estimatedFinishDate":null,"items":[]}]}}');
                widget.initEditDialogBox(plan)

                widget.planToEdit = {"testProperty": 123};
                spyOn(widget.dataService, "getEndHourWorkingByDate").and.callFake(function(){
                    var defer = $.Deferred();
                    defer.resolve(new Date().getTime());
                    return defer.promise();
                });
            });
            it("Should return object", function () {
                expect(widget.getParamsUpdatePlan).toBeDefined();
                $.when(widget.getParamsUpdatePlan()).done(function(response){
                    console.log("response", response);
                    expect(response).toBeDefined();
                });
            });

            it("Should return same properties defined on planEdit", function () {
                $.when(widget.getParamsUpdatePlan()).done(function(response){
                    expect(response.testProperty).toBeDefined();
                });
            });

            it("Should call service when plan have dueDate", function () {
                spyOn(widget.editDialogBox.elements.inputDueDate, "datepicker").and.returnValue(new Date());
                widget.getParamsUpdatePlan();
                expect(widget.dataService.getEndHourWorkingByDate).toHaveBeenCalled();
            });

            it("Should dont call service when plan have dueDate", function () {
                spyOn(widget.editDialogBox.elements.inputDueDate, "datepicker").and.returnValue(undefined);
                widget.getParamsUpdatePlan();
                expect(widget.dataService.getEndHourWorkingByDate).not.toHaveBeenCalled();
            });
        });

    });
});
