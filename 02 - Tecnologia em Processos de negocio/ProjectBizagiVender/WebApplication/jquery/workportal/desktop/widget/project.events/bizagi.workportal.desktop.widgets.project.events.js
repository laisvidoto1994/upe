/*
 *   Name: Bizagi Workportal Desktop Project Events Controller
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.events", {}, {
      /*
       *   Constructor
       */
      init: function (workportalFacade, dataService, params) {
         var self = this;

         // Call base
         self._super(workportalFacade, dataService, params);

         self.contextsSidebarActivity = params.contextsSidebarActivity;

         //Load templates
         self.loadTemplates({
            "project-events": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.events").concat("#project-events-wrapper")
         });
      },

      /*
       * Renders the template defined in the widget
       */
      renderContent: function () {
         var self = this;
         var template = self.getTemplate("project-events");
         self.content = template.render({});
         return self.content;
      },

      /*
       * links events with handlers
       */
      postRender: function () {
         var self = this;

         //Handlers
         self.contextsSidebarActivity.forEach(function(context){
            self.sub(context, $.proxy(self.updateView, self));
         });
      },

      updateView: function (event, params) {
         var self = this,
            args = params.args,
            $content = self.getContent().empty();
         self.params = args;

         $.when(self.getArgsTemplate(args)).done(function(responseArgsTemplate){
            //Update widget
            var contentTemplate = self.getTemplate("project-events");
            contentTemplate
               .render($.extend(args, responseArgsTemplate))
               .appendTo($content);

            $(".list-events li.event a", $content).on("click", $.proxy(self.onClickGoEvent, self));

         });

      },

      getArgsTemplate: function(args){
         var def = $.Deferred(),
            argsTemplate = {},
            self = this;

         //check if show event tab or not
         if (args["countEvents"] >= 1) {
            for (var i = 0; i < args["currentState"].length; i++) {
               if (args["currentState"][i]["isEvent"] == "true" && args["currentState"][i]["idWorkItem"] == args.idWorkitem) {
                  args["countEvents"] = args["countEvents"] - 1;
               }
            }
         }
         argsTemplate["showEvents"] = (args["countEvents"] >= 1) ? true : false;

         if(argsTemplate["showEvents"]){
            $.when(self.callSummaryCaseEvents(args.idCase)).done(function(responseEvents){
               args["showEvents"] = (responseEvents["events"].length >= 1) ? true : false;

               if(args["showEvents"]){
                  argsTemplate["events"] = [];
                  responseEvents["events"].forEach(function(elementEvent){
                     argsTemplate["events"].push($.extend(elementEvent[Object.keys(elementEvent)[0]],
                                                         { idWorkFlow: responseEvents["idWorkFlow"] }));
                  });
               }
               def.resolve(argsTemplate);
            });
         }
         else{
            def.resolve(argsTemplate);
         }
         return def.promise();
      },

      /**
       * Events UI
       */

      onClickGoEvent: function (event) {
         event.preventDefault();
          var self = this;
          $("[data-bizagi-component='workarea']").empty();
          self.routingExecute($(event.target).closest("li"));
      },

      /**
       * Call services
       */

      /*
       *  Get data for users
       */
      callSummaryCaseEvents: function (idCase) {
         var self = this,
            def = $.Deferred();

         $.when(
            self.dataService.summaryCaseEvents({
               idCase: idCase
            })
         ).done(function (events) {
            def.resolve(events);
         });

         return def.promise();
      },

      clean: function () {
         var self = this;
         this.params = {};
         self.contextsSidebarActivity.forEach(function(context){
            self.unsub(context, $.proxy(self.updateView, self));
         });
      }
   }
);

bizagi.injector.register('bizagi.workportal.widgets.project.events', ['workportalFacade', 'dataService', bizagi.workportal.widgets.project.events], true);