/**
 * Unit Testing bizagi.workportal.widgets.plans.filters
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.plans.filters", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });

   it("Render Widget", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.plans.filters(workportalFacade, dataService, params);

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            done();
         });
      });
   });

   describe("Functions:", function () {
      describe("when click filter", function () {
         beforeEach(function () {
            spyOn(widget, "setSelectedFilter").and.callThrough();
         });
         it("Should call selectedFilter ", function () {
            $('.wdg-plan-filter-card', widget.getContent()).click();
            expect(widget.setSelectedFilter).toHaveBeenCalled();
         });
      });
      describe("onLoadPlansView", function () {
         beforeEach(function () {
            spyOn(widget, "getContent");
            spyOn(widget, "setSelectedFilter").and.callThrough();
            params = {args: {planState: "PENDING"}};
         });
         it("Should call setSelectedFilter", function () {
            widget.onLoadPlansView({}, params);
            expect(widget.setSelectedFilter).toHaveBeenCalled();

         });
      });
      describe("clean", function(){
         beforeEach(function(){
            spyOn(widget, "unsub");
            spyOn(widget, "getContent").and.callFake(function(){
               return $("<div></div>");
            });
         });
         it("Should call resetWidget", function(){
            widget.clean();
            expect(widget.unsub).toHaveBeenCalled();
         });
      });
   });
});
