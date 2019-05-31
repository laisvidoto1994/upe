/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.content.dashboard
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.desktop.widgets.project.content.dashboard", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });
   it("Render Widget", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.project.content.dashboard(workportalFacade, dataService, params);

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            jasmine.clock().install();

            widget.postRender();
            jasmine.clock().tick(1001);

            jasmine.clock().uninstall();
            done();
         });
      });
   });


});
