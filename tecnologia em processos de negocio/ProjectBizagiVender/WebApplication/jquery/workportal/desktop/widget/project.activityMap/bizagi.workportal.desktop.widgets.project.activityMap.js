/*
 *   Name: Bizagi Workportal Desktop Project Activity Map Controller
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.activityMap", {}, {
   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;

      // Set radNumber
      self.radNumber = params.radNumber;

      // Call base
      self._super(workportalFacade, dataService, params);

      //Load templates
      self.loadTemplates({
         "project-activityMap": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.activityMap").concat("#project-activityMap-wrapper")
      });
   },

   /*
    * Renders the template defined in the widget
    */
   renderContent: function () {
      var self = this;
      var template = self.getTemplate("project-activityMap");

      self.content = template.render({});
      return self.content;
   },

   /*
    * links events with handlers
    */
   postRender: function () {
      var self = this;

      //Handlers
      self.sub("HOME", $.proxy(self.updateView, self));
      self.sub("OVERVIEW", $.proxy(self.updateView, self));
      self.sub("COMMENTS", $.proxy(self.updateView, self));
      self.sub("PROCESSMAP", $.proxy(self.updateView, self));
      self.sub("LOG", $.proxy(self.updateView, self));
      self.sub("PLANCREATE", $.proxy(self.updateView, self));
      self.sub("PLANCOMMENTS", $.proxy(self.updateView, self));
   },

   updateView: function (event, params) {
      var self = this,
         args = params.args,
         $content = self.getContent().empty();

      var argsTemplate = {};
      argsTemplate["actualState"] = "";
      if(args.currentState[0]){
         argsTemplate["actualState"] = args.currentState[0].state;
      }

      //Update widget
      var contentTemplate = self.getTemplate("project-activityMap");
      contentTemplate
         .render($.extend(args, argsTemplate))
         .appendTo($content);

      self.params = args;
   }
});

bizagi.injector.register('bizagi.workportal.widgets.project.activityMap', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.activityMap], true);

