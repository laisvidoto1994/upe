/*
 *   Name: Bizagi Workportal project Activity Sidebar
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.activity.sidebar", {}, {

   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      params = params || {};
      params.supportNav = false;

      //Load templates
      self.loadTemplates({
         "project-activity-sidebar": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.activity.sidebar").concat("#project-activity-sidebar")
      });

   },

   /*
    * Renders the template defined in the widget
    */
   renderContent: function () {
      var self = this;

      var template = self.getTemplate("project-activity-sidebar");
      self.content = template.render({});

      return self.content;
   }

});

bizagi.injector.register('bizagi.workportal.widgets.project.activity.sidebar', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.activity.sidebar]);