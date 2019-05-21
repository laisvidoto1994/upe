/*
 *   Name: Bizagi Workportal project Discussion Sidebar
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.discussion.sidebar", {}, {

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
         "project-discussion-sidebar": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.discussion.sidebar").concat("#project-discussion-sidebar")
      });
   },

   /**
    * Renders the template defined in the widget
    */
   renderContent: function () {
      var self = this;

      var template = self.getTemplate("project-discussion-sidebar");
      self.content = template.render({ isOpen: !bizagi.util.parseBoolean(self.params.isClosedForAllUsers)});

      return self.content;
   },

   /**
    * links events with handlers
    */
   postRender: function () {
      var self = this;
      var $contentWidget = self.getContent();
      $(".ui-bizagi-wp-project-discussions-sidebar-action-add > a", $contentWidget).on("click"
         ,$.proxy(self.onShowPopupDiscussion, self));
   },

   /**
    * Events elements
    */
   onShowPopupDiscussion: function () {
      var self = this;
      self.pub("notify", {
         type: "OPEN_POPUP_DISCUSSION",
         args: {}
      });
   }
});

bizagi.injector.register('bizagi.workportal.widgets.project.discussion.sidebar', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.discussion.sidebar], true);