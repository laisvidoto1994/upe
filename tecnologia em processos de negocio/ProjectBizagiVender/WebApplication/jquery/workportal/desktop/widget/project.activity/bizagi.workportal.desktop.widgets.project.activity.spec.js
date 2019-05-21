/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.activity
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.desktop.widgets.project.activity", function () {
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
      widget = new bizagi.workportal.widgets.project.activity(workportalFacade, dataService, params);
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
      it("renderForm", function(){
         spyOn(workportalFacade, "getTemplate").and.callFake(function(){
            return $("<div></div>");
         });

         widget.params = {withOutGlobalForm: true, isOfflineForm: true, messageForm: "message"};
         widget.renderForm({withOutGlobalForm: true, isOfflineForm: true, messageForm: "message"});
         expect(workportalFacade.getTemplate).toHaveBeenCalledWith("info-message")
      });

      it("clean", function(){
         spyOn(widget, "pub");
         widget.clean();
         expect(widget.pub).toHaveBeenCalled();
      });

   });

});
