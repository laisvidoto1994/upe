/**
 * Initialize desktop.widgets.project.overview widget and test it
 *
 * @author Elkin Fernando Siabato Cruz
 */


describe("Widget desktop.widgets.project.overview", function () {
   checkWorkportalDependencies();
   var widget;

   it("Environment has been defined", function (done) {

      var params = {};
      widget = new bizagi.workportal.widgets.project.overview(dependencies.workportalFacade, dependencies.dataService, params);
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

   describe("The behavior", function(){


      it("Should old render integration", function () {
         var contentWidget = widget.getContent();
         spyOn(widget.dataService, "getWorkitems").and.callFake(function(){
            var d = $.Deferred();
            d.resolve({
               workItems: [
                  {
                     idWorkItem: 1,
                     idTask: 2
                  }
               ]
            });
            return d.promise();
         });

         $("#ui-bizagi-wp-project-overview-wrapper", contentWidget).trigger("oldrenderintegration");
         expect(widget.dataService.getWorkitems).toHaveBeenCalled();

      });

      it("Should call resizeLayout after 1000 miliseconds", function(){
         var contentWidget = widget.getContent();
         spyOn(widget, "resizeLayout");
         jasmine.clock().install();

         widget.renderSummaryForm(1, $("#ui-bizagi-wp-project-overview-wrapper", contentWidget));

         jasmine.clock().tick(1100);

         expect(widget.resizeLayout).toHaveBeenCalled();

         jasmine.clock().uninstall();
      });

   });

});
