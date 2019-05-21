/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.plan.template.create
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.project.plan.template.create", function () {
   var widget,
      workportalFacade,
      dataService;

   bizagi.currentUser = bizagi.currentUser || {};
   bizagi.currentUser.uploadMaxFileSize = 1000;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });
   it("Environment has been defined", function (done) {
      var params = {};
      widget = bizagi.injector.get("bizagi.workportal.widgets.project.plan.template.create");
      widget.init(workportalFacade, dataService, params);

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

   describe("functions", function () {
      describe("showPopupAddTemplatePlan", function () {
         beforeEach(function () {
            spyOn(widget, "initPlugins");
            params = {};
            contextualized = true;
            idPlanSelected = "a5508e97-3028-4dce-afe4-8c133ccd3680";
         });
         it("Should init plugins", function () {
            widget.showPopupAddTemplatePlan(params, dataService, contextualized, idPlanSelected);
            expect(widget.initPlugins).toHaveBeenCalled();
         });

         describe("events", function () {
            describe("onClickSaveTemplate when name template is correct", function () {
               beforeEach(function () {
                  spyOn(widget.dataService, "createTemplateByPlan");
               });
               it("Should call createTemplateByPlan", function () {
                  widget.dialogBox.elements.inputName.val('Name template mock');
                  widget.dialogBox.elements.buttonSave.click();
                  expect(widget.dataService.createTemplateByPlan).toHaveBeenCalled();
               });
            });
            describe("onClickSaveTemplate when name template is empty", function () {
               beforeEach(function () {
                  spyOn(widget, "validateSaveDialogBoxParams").and.callThrough();
                  spyOn(widget.dataService, "createTemplateByPlan");
               });
               it("Should NOT call createTemplateByPlan", function () {
                  widget.dialogBox.elements.inputName.val('');
                  widget.dialogBox.elements.buttonSave.click();
                  expect(widget.validateSaveDialogBoxParams).toHaveBeenCalled();
                  expect(widget.dataService.createTemplateByPlan).not.toHaveBeenCalled();
               });
            });
         });
      });
   });
});
