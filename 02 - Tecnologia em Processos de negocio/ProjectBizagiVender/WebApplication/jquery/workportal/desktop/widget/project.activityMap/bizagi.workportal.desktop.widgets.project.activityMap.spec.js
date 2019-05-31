/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.activityMap
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.desktop.widgets.project.activityMap", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });
   it("Environment has been defined", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.project.activityMap(workportalFacade, dataService, params);
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

   describe("Functions", function(){
      it("updateView", function(){
         var params = {
            args: {currentState: [{}]}
         }
         spyOn(widget, "getTemplate").and.callFake(function(){
            return $("<div></div>");
         });
         widget.updateView({}, params);
         expect(widget.getTemplate).toHaveBeenCalledWith("project-activityMap")
      });
   });
});
