/**
 * Unit Testing bizagi.workportal.desktop.widgets.project.discussion.sidebar
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.desktop.widgets.project.discussion.sidebar", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });
   it("Render Widget", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.project.discussion.sidebar(workportalFacade, dataService, params);

      widget.params.contextsLeftSidebarCaseDashboard = ["ACTIVITY", "OVERVIEW", "COMMENTS", "FILES", "PROCESSMAP", "LOG", "PLANCREATE"];

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });
   });

   describe("functions", function(){
      describe("onShowPopupDiscussion", function(){
         beforeEach(function(){
            spyOn(widget, "pub");
         });
         it("Should be notify OPEN_POPUP_DISCUSSION", function(){
            widget.onShowPopupDiscussion();
            expect(widget.pub).toHaveBeenCalledWith("notify", {
               type: "OPEN_POPUP_DISCUSSION",
               args: {}
            });
         });

      });


   });


});
