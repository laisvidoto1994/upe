/**
 *   Name: Bizagi Workportal Desktop Widget Dummy
 *   Author: Elkin Fernando Siabato Cruz
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.dummy", {}, {
   /**
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;
      // Call base
      self._super(workportalFacade, dataService, params);
   },

   /**
    * Renders the template defined in the widget
    */
   renderContent: function () {
      var self = this;
      self.content = $("<div></div>");
      return self.content;
   }
});

bizagi.injector.register("bizagi.workportal.widgets.dummy", ["workportalFacade", "dataService", bizagi.workportal.widgets.dummy]);