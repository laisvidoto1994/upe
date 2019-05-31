/**
 * Widget Development with TDD
 * Please, before change Service, run test
 *
 */

describe("Widget bizagi.workportal.desktop.widgets.filtercases.js", function () {
   checkWorkportalDependencies();

   var workportalFacade;
   var dataService;
   var params = {};
   var widget;
   var buttonsSemaphoreSelector = "li.ui-bizagi-wp-app-inbox-tab.colortaskfilter";
   var buttonAllSelector = "li.ui-bizagi-wp-app-inbox-tab:not(.colortaskfilter)";

   beforeEach(function(){
      workportalFacade = bizagi.injector.get('workportalFacade');
      dataService = bizagi.injector.get("dataService");
   });

   it("Environment has been defined", function (done) {
      widget = new bizagi.workportal.widgets.filtercases(workportalFacade, dataService, params);
      widget.render().done(function(){
         expect(widget).toBeDefined();
         done();
      });
   });

   describe("Flow behavior", function(){
      describe("When first load", function(){
         describe("The buttons semaphore", function(){
            it("Are dont pressed", function(){
               expect($(buttonsSemaphoreSelector + ".active", widget.getContent()).length).toBe(0);
            });
         });
         describe("The button all", function(){
            it("Are pressed", function(){
               expect($(buttonAllSelector + ".active", widget.getContent()).length).toBe(1);
            });
         });
      });
      describe("When click a button semaphore", function(){
         beforeEach(function(){
            spyOn(widget, "pub").and.callFake(function(){
               return 123456;
            });
            $(buttonsSemaphoreSelector, widget.getContent()).eq(0).click();
         });
         describe("The button pressed", function(){
            it("is pressed", function(){
               expect($(buttonsSemaphoreSelector, widget.getContent()).eq(0).hasClass("active")).toBe(true);
            });
         });
         describe("The other buttons semaphore", function(){
            it("are not pressed", function(){
               expect($(buttonsSemaphoreSelector, widget.getContent()).eq(1).hasClass("active")).toBe(false);
               expect($(buttonsSemaphoreSelector, widget.getContent()).eq(2).hasClass("active")).toBe(false);
            });
         });
         describe("The button all", function(){
            it("are not pressed", function(){
               expect($(buttonAllSelector, widget.getContent()).hasClass("active")).toBe(false);
            });
         });
      });
      describe("When click a button all", function(){
         beforeEach(function(){
            spyOn(widget, "pub").and.callFake(function(){
               return 123456;
            });
            $(buttonAllSelector, widget.getContent()).click();
         });
         describe("The button all", function(){
            it("is pressed", function(){
               expect($(buttonAllSelector, widget.getContent()).hasClass("active")).toBe(true);
            });
         });
         describe("The buttons semaphore", function(){
            it("Are not pressed", function(){
               expect($(buttonsSemaphoreSelector, widget.getContent()).eq(0).hasClass("active")).toBe(false);
               expect($(buttonsSemaphoreSelector, widget.getContent()).eq(1).hasClass("active")).toBe(false);
               expect($(buttonsSemaphoreSelector, widget.getContent()).eq(2).hasClass("active")).toBe(false);
            });
         });
      });
   });



});
