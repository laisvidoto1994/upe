/**
 * Unit Testing bizagi.workportal.widgets.decontextualized.plans
 *
 * @author Elkin Fernando Siabato Cruz
 */

describe("Widget bizagi.workportal.widgets.decontextualized.plans", function () {
   var widget,
      workportalFacade,
      dataService;

   it("Environment has been defined", function(){
      workportalFacade = bizagi.injector.get("workportalFacade");
      dataService = bizagi.injector.get("dataService");
   });

   it("Render Widget empty when security is false", function(done){
      var params = {};
      widget = new bizagi.workportal.widgets.decontextualized.plans(workportalFacade, dataService, params);

      spyOn(widget.dataService, "getDateServer").and.callFake(function(){
         var defer = $.Deferred();
         defer.resolve({date: Date.now()});
         return defer.promise();
      });
      spyOn(widget, "getData").and.callThrough();

      bizagi = bizagi || {};
      bizagi.menuSecurity = bizagi.menuSecurity || {};
      bizagi.menuSecurity.Plans = false;

      bizagi.override = bizagi.override || {};
      bizagi.override.enableSecurityCaseDashBoard = true;

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            expect(widget.getContent().html()).toBe("");
            done();
         });
      });
   });

   it("Render Widget", function (done) {
      var params = {};
      widget = new bizagi.workportal.widgets.decontextualized.plans(workportalFacade, dataService, params);

      spyOn(widget.dataService, "getDateServer").and.callFake(function(){
         var defer = $.Deferred();
         defer.resolve({date: Date.now()});
         return defer.promise();
      });
      spyOn(widget, "getData").and.callThrough();

      bizagi.menuSecurity.Plans = true;

      $.when(widget.areTemplatedLoaded()).done(function(){
         $.when(widget.renderContent()).done(function () {
            widget.postRender();
            expect(widget.getData).toHaveBeenCalled();
            done();
         });
      });
   });

   describe("Functions:", function () {
      describe("when click card", function () {
         beforeEach(function () {
            spyOn(widget, "pub");
         });
         it("Should call notify", function () {
            $('.wdg-plans-card', widget.getContent()).click();
            expect(widget.pub).toHaveBeenCalled();
         });
      });

      describe("clean", function(){
         beforeEach(function(){
            spyOn($.fn, "off");
         });
         it("Should remove events", function(){
            widget.clean();
            expect($.fn.off).toHaveBeenCalled();
         });
      });
   });
});
