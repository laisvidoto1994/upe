/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.file.sidebar
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.desktop.widgets.project.file.sidebar", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });
   it("Render Widget", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.project.file.sidebar(workportalFacade, dataService, params);
      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });
   });

   it("Should return name widget", function(){
      expect(widget.getWidgetName()).toBe(bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_PROJECT_FILE_SIDEBAR);
   });


});
