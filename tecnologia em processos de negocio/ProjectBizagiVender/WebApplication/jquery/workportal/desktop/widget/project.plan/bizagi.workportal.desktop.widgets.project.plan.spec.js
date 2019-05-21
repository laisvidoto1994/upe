/**
 * Initialize desktop.widgets.project.plan widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.plan", function () {
   checkWorkportalDependencies();
   var widget;
   var planCreateWidget;

   it("Environment has been defined", function (done) {
      bizagi.currentUser = {};
      bizagi.currentUser["uploadMaxFileSize"] = 123;

      planCreateWidget = bizagi.injector.get("bizagi.workportal.widgets.project.plan.create");

      var params = {};
      params["differenceMillisecondsServer"] = 300;
      widget = new bizagi.workportal.widgets.project.plan(dependencies.workportalFacade, dependencies.dataService, planCreateWidget, params);
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

   it("Environment has been defined with content", function () {
      spyOn(widget, "pub").and.callFake(function(){
         var defer = $.Deferred();
         defer.resolve(2);
         return defer.promise();
      });

      var contentWidget = widget.getContent();
      expect(contentWidget).not.toBe("");

      widget.params.menuDashboard = {
         contextPlanOptionMenu : ""
      };
      widget.params.showContextByMenuDashboard = "CONTEXTMOCK";
      widget.params.plan = {
          contextualized: true
      };
      widget.onShowPopupPlan();

      var responseCreatePlan = JSON.parse('{"paramsNewPlan":{"idUserCreator":207,"id":"5af5efde-9b08-41b4-9fcc-58ffddbaac5d","startDate":null,"creationDate":null,"parentWorkItem":"a55fa3af-769d-4d20-b3cb-1a6d18674e0a","description":null,"currentState":"PENDING","name":"asdf","waitForCompletion":true,"dueDate":null,"contextualized":true,"activities":[],"users":[]}}');
      widget.planCreate.pub('planCreated', responseCreatePlan);

      expect(widget.pub.calls.argsFor(0)[1].type).toEqual("UPDATE_LASTCRUMBPARAMS_INFO");

      expect(widget.pub.calls.count()).toBe(3);
   });


   describe("The services", function(){
      it("Should be call serviceLocator when Post plan", function(){
         spyOn(widget.dataService.serviceLocator, "getUrl").and.callFake(function(){
            return "url-mock";
         });
         var params = {
            idTemplate: 123
         }
         widget.dataService.postPlan(params);
         expect(widget.dataService.serviceLocator.getUrl).toHaveBeenCalledWith("project-plan-create-by-template");

         widget.dataService.postPlan({});
         expect(widget.dataService.serviceLocator.getUrl).toHaveBeenCalledWith("project-plan-create");
      });
   });

   describe("The behavior UI", function(){

      it("Should open popup with click button create plan", function () {
         var contentWidget = widget.getContent();
         widget.form.buttonShowPopupPlanToAdd.click();
         expect($(".ui-dialog.ui-widget").css("display")).toBe("block");
      });

      it("Should notify when plan is Created", function(){

      });

      it("Should close popup when click button cancel when create plan", function(){
         $("#button-cancel-create-plan").click();
         expect($("#ui-dialog.ui-widget").length).toBe(0);
      });

   });


});
