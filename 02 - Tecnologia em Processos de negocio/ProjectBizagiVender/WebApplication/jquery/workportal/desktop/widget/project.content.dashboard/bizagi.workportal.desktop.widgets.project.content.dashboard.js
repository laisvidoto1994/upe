/*
 *   Name: Bizagi Workportal Project Content Dashboard
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.content.dashboard", {}, {

   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      //Load templates
      self.loadTemplates({
         "project-content-dashboard": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.content.dashboard").concat("#project-plan-content-dashboard")
      });

   },

   /*
    * Renders the template defined in the widget
    */
   renderContent: function () {
      var self = this;

      var template = self.getTemplate("project-content-dashboard");
      self.content = template.render({});

      return self.content;
   },
   postRender: function(){
      var self = this;

      setTimeout(function(){
         $(window).trigger("resize"); //Simulate resize for fix when load first time.
      }, 1000);

   }

});

bizagi.injector.register("bizagi.workportal.widgets.project.content.dashboard", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.content.dashboard], true);