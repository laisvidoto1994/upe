/*
 *   Name: Bizagi Workportal project Plan Sidebar
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.sidebar", {}, {

   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, serviceloadDataPlan, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      self.serviceloadDataPlan = serviceloadDataPlan;
      self.params = params || {};
      params.supportNav = false;

      //Load templates
      self.loadTemplates({
         "project-plan-sidebar": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.plan.sidebar").concat("#project-plan-sidebar")
      });

   },

    /*
     * Renders the template defined in the widget
     */
    renderContent: function () {
        var self = this;
        var template = self.getTemplate("project-plan-sidebar");
        self.content = template.render({});
        $.when(self.areTemplatedLoaded())
                .done(function () {
                    var params = {idPlan: self.params.plan.id};
                    if (self.params.planChild && self.params.planChild.id) {
                        params.idPlan = self.params.planChild.id;
                    }
                    self.serviceloadDataPlan.loadData(params, self.getDateServer, self.params);
                    self.serviceloadDataPlan.subscribe("loadedWithDataActivities", $.proxy(self.loadedWithDataActivities, self));
                    self.serviceloadDataPlan.subscribe("loadedWithDataFirstParent", $.proxy(self.loadedWithDataFirstParent, self));
                });
        return self.content;
    },

    loadedWithDataActivities: function(){
        var self = this;
        self.pub("notify", {
            type: "LOADED_ACTIVITIES_PLAN",
            args: self.params
        });
        self.pub("notify", {
            type: "UPDATE_INFO_PLAN",
            args: self.params
        });
        self.pub("notify", {
            type: "LOAD_INFO_SUMMARY_PROGRESS_PLAN",
            args: self.params
        });
        self.pub("notify", {
            type: "LOAD_INFO_ACTIVITIES_PLAN",
            args: self.params
        });
    },

    loadedWithDataFirstParent: function(){
        var self = this;
        self.pub("notify", {
            type: "LOAD_INFO_SUMMARY_PLAN",
            args: self.params
        });
    },

    clean: function(){
        var self = this;
        if(self.serviceloadDataPlan){
            self.serviceloadDataPlan.unsubscribe("loadedWithDataActivities", $.proxy(self.loadedWithDataActivities, self));
            self.serviceloadDataPlan.unsubscribe("loadedWithDataFirstParent", $.proxy(self.loadedWithDataFirstParent, self));
        }
    }

});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.sidebar", ["workportalFacade", "dataService", "bizagi.workportal.services.behaviors.loadDataPlan", bizagi.workportal.widgets.project.plan.sidebar], true);