/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.activity.sidebar
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.desktop.widgets.project.activity.sidebar", function () {
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
      widget = new bizagi.workportal.widgets.project.activity.sidebar(workportalFacade, dataService, params);
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

});
