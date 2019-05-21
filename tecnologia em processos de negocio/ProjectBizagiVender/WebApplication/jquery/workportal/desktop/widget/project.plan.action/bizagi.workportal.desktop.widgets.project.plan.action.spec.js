/**
 * Initialize desktop.widgets.project.plan.action widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.plan.action", function () {
    checkWorkportalDependencies();
    var widget,
        projectDashboard,
        notifier,
        planTemplateCreate,
        planEdit;

    function setEnviroment(){
        bizagi.currentUser = {};
        bizagi.currentUser["uploadMaxFileSize"] = 123;

        projectDashboard = bizagi.injector.get("bizagi.workportal.services.behaviors.projectDashboard");
        notifier = bizagi.injector.get("notifier");
        planTemplateCreate = bizagi.injector.get("bizagi.workportal.widgets.project.plan.template.create");
        planEdit = bizagi.injector.get("bizagi.workportal.widgets.project.plan.edit");

        var params = {};
        params["differenceMillisecondsServer"] = 300;
        widget = new bizagi.workportal.widgets.project.plan.action(dependencies.workportalFacade,
            dependencies.dataService,
            projectDashboard,
            notifier,
            planTemplateCreate,
            planEdit,
            params);
    }

    it("Environment has been defined", function (done) {

        setEnviroment();

        $.when(widget.areTemplatedLoaded())
            .done(function () {
                widget.params.plan = {
                    currentState: "PENDING"
                };
                $.when(widget.renderContent()).done(function (html) {
                    dependencies.canvas.empty();
                    dependencies.canvas.append(html);
                    expect($("li.ui-menu-item[data-item='delete']", html).length).toBe(1);
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

    describe("When lauch events of planTemplateCreate", function () {
        beforeEach(function () {
            spyOn(widget.notifier, "showSucessMessage");
            spyOn(widget.notifier, "showErrorMessage");
        });

        it("Should show messages", function () {
            widget.planTemplateCreate.pub("planTemplateCreatedSuccess");
            expect(widget.notifier.showSucessMessage).toHaveBeenCalled();

            widget.planTemplateCreate.pub("planTemplateCreatedFailed");
            expect(widget.notifier.showErrorMessage).toHaveBeenCalled();

            var params = JSON.parse('{"paramsEditPlan":{"contextualized":true,"id":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","name":"asdf","description":"asdfa","currentState":"PENDING","parentWorkItem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a","creationDate":1449236567540,"startDate":null,"idUserCreator":207,"waitForCompletion":true,"activities":[{"progress":0,"id":"ba50a8e2-f3a4-477e-af1f-342b8a91ea22","startDate":null,"duration":null,"userAssigned":207,"allowEdition":true,"description":null,"name":"asdf","idPlan":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","estimatedFinishDate":null,"finishDate":null,"items":[],"numTotalItems":0,"numResolvedItems":0}],"users":[],"firstParent":{"idCase":6421,"idWorkflow":3,"idWorkitem":11458,"idTask":5,"radNumber":"6421","displayName":"Activity_1","isWorkitemClosed":false},"parent":{"idCase":6421,"idWorkflow":3,"idWorkitem":11458,"idTask":5,"radNumber":"6421","displayName":"Activity_1","isWorkitemClosed":false}}}');
            widget.planPopupEdit.pub("planEditedSuccess", params);
            expect(widget.notifier.showSucessMessage).toHaveBeenCalled();

            widget.planPopupEdit.pub("planEditedFailed", {});
            expect(widget.notifier.showErrorMessage).toHaveBeenCalled();

        });
    });

    describe("function onNotifyExpandedRightSidebar", function () {
        beforeEach(function () {
            spyOn(widget, "initilizeActionMenu");
        });
        it("Should call initilizeActionMenu", function () {
            widget.params.showActionsPlan = true;
            widget.onNotifyExpandedRightSidebar();
            expect(widget.initilizeActionMenu).toHaveBeenCalled();
        });
    });

    describe("function onSelectMenu", function () {
        beforeEach(function () {
            spyOn(widget.planPopupEdit, "showPopup");
            spyOn(bizagi, "showConfirmationBox").and.callFake(function () {
                var defer = $.Deferred();
                defer.resolve();
                return defer.promise();
            });
            spyOn(widget.dataService, "deletePlan").and.callFake(function () {
                var defer = $.Deferred();
                defer.resolve({status: 200});
                return defer.promise();
            });
            spyOn(widget.planTemplateCreate, "showPopupAddTemplatePlan");

            spyOn(widget, "pub").and.callFake(function () {
                return 2;
            });

            event = {
                currentTarget: '<div></div>'
            };

            ui = {
                item: $('<li class="ui-menu-item" role="presentation"> <a href="javascript:void(0);" aria-haspopup="true" id="ui-id-2" class="ui-corner-all ui-state-focus" tabindex="-1" role="menuitem"><span class="ui-menu-icon ui-icon ui-icon-carat-1-e"></span><i class="bz-icon bz-icon-16 bz-icon-cog-outline"></i></a> <ul class="ui-menu ui-widget ui-widget-content ui-corner-all" role="menu" aria-hidden="true" aria-expanded="false" style="display: none;"> <li class="ui-menu-item" data-item="edit"><a href="javascript:void(0);">Editar</a></li><li class="ui-menu-item" data-item="delete"><a href="javascript:void(0);">Eliminar</a></li><li class="ui-menu-item" data-item="saveastmpl"><a href="javascript:void(0);">Crear Plantilla</a></li></ul> </li>')
            }

        });
        it("Should be edit", function () {
            $(ui.item).data("item", "edit");
            widget.onSelectMenu(event, ui);
            expect(widget.planPopupEdit.showPopup).toHaveBeenCalled();


            $(ui.item).data("item", "delete");
            widget.onSelectMenu(event, ui);
            expect(widget.dataService.deletePlan).toHaveBeenCalled();

            $(ui.item).data("item", "saveastmpl");
            widget.onSelectMenu(event, ui);
            expect(widget.planTemplateCreate.showPopupAddTemplatePlan).toHaveBeenCalled();
        });
    });

    describe("function onExecutePlan", function () {
        beforeEach(function () {
            widget.params = widget.params || {};
            widget.params.plan = JSON.parse('[{"progress":0,"id":"93947728-bde5-4096-aeb3-3dc15bd87185","startDate":null,"duration":null,"userAssigned":207,"allowEdition":true,"description":null,"name":"acriviad 1","idPlan":"751a96ed-8cf9-485e-9efe-2993ee78a538","estimatedFinishDate":null,"finishDate":null,"items":[],"numTotalItems":0,"numResolvedItems":0},{"progress":0,"id":"0e2fdef4-a8d2-41b3-8130-fc69090607d7","startDate":null,"duration":null,"userAssigned":207,"allowEdition":true,"description":null,"name":"actividad 2","idPlan":"751a96ed-8cf9-485e-9efe-2993ee78a538","estimatedFinishDate":null,"finishDate":null,"items":[],"numTotalItems":0,"numResolvedItems":0},{"progress":0,"id":"42620c3f-b426-4f28-9890-47ca36c217b8","startDate":null,"duration":null,"userAssigned":207,"allowEdition":true,"description":null,"name":"actividad 3","idPlan":"751a96ed-8cf9-485e-9efe-2993ee78a538","estimatedFinishDate":null,"finishDate":null,"items":[],"numTotalItems":0,"numResolvedItems":0}]');
            widget.params.plan.activities = JSON.parse('[{"progress":0,"id":"93947728-bde5-4096-aeb3-3dc15bd87185","startDate":null,"duration":null,"userAssigned":207,"allowEdition":true,"description":null,"name":"acriviad 1","idPlan":"751a96ed-8cf9-485e-9efe-2993ee78a538","estimatedFinishDate":null,"finishDate":null,"items":[],"numTotalItems":0,"numResolvedItems":0},{"progress":0,"id":"0e2fdef4-a8d2-41b3-8130-fc69090607d7","startDate":null,"duration":null,"userAssigned":207,"allowEdition":true,"description":null,"name":"actividad 2","idPlan":"751a96ed-8cf9-485e-9efe-2993ee78a538","estimatedFinishDate":null,"finishDate":null,"items":[],"numTotalItems":0,"numResolvedItems":0},{"progress":0,"id":"42620c3f-b426-4f28-9890-47ca36c217b8","startDate":null,"duration":null,"userAssigned":207,"allowEdition":true,"description":null,"name":"actividad 3","idPlan":"751a96ed-8cf9-485e-9efe-2993ee78a538","estimatedFinishDate":null,"finishDate":null,"items":[],"numTotalItems":0,"numResolvedItems":0}]');

            spyOn(widget.dataService, "putExecutePlan");
            spyOn(widget, "pub");
            event = {
                target: $('<div class="plan-action-button state-pending-plan" style="display: block;"> <a href="#" id="to-execute-plan" class="bz-wp-cd-option bz-wp-cd-option-link"> <i class="bz-icon bz-icon-plan-enable bz-icon-24"></i> <span class="description">Habilitar</span> </a> </div><div class="plan-action-button state-executing-plan" style="display: none;"> <a href="#" id="to-close-plan" class="bz-wp-cd-option"> <i class="bz-icon bz-icon-plan-progress bz-icon-24"></i> <span class="description">Cerrar plan</span> </a> </div><div class="plan-action-button state-closed-plan" style="display: none;"> <div class="bz-wp-cd-option"> <i class="bz-icon bz-icon-plan-closed bz-icon-24"></i> <span class="description">plan cerrado</span> </div></div>'),
                preventDefault: function () {
                }
            }
        });
    });
});
