/*
 *   Name: Bizagi Workportal Project Activity Sidebar
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.activity.sidebar", {}, {

   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, serviceloadDataPlan, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      self.serviceloadDataPlan = serviceloadDataPlan;

      //Load templates
      self.loadTemplates({
         "project-plan-activity-sidebar": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.sidebar").concat("#project-plan-activity-sidebar")
      });
   },

   /*
    * Renders the template defined in the widget
    */
   renderContent: function () {
      var self = this;

      var template = self.getTemplate("project-plan-activity-sidebar");
      self.content = template.render({});

      return self.content;
   },
   postRender: function(){
      var self = this;
      self.sub("LOAD_INFO_PLAN", $.proxy(self.onNotifyLoadInfoPlan, self));
   },

    onNotifyLoadInfoPlan: function (event, parans) {
        var self = this;
        if (self.params.plan.idActivitySelected) {

            var params = {idPlan: self.params.plan.id};
            self.serviceloadDataPlan.loadData(params, self.getDateServer, self.params);
            self.serviceloadDataPlan.subscribe("loadedWithDataActivities", $.proxy(self.loadedWithDataActivities, self));
            self.serviceloadDataPlan.subscribe("loadedWithDataFirstParent", $.proxy(self.loadedWithDataFirstParent, self));
        }
        else {
            if (self.params.showContextByMenuDashboard === "ACTIVITYPLANPROCESSMAP" ||
                    self.params.showContextByMenuDashboard === "ACTIVITYPLANLOG") {
                self.pub("notify", {
                    type: "DISABLED_RIGHT_SIDEBAR"
                });
            }
        }
    },

    loadedWithDataActivities: function(){
        var self = this;
        self.pub("notify", {
            type: "LOADED_ACTIVITIES_PLAN",
            args: self.params
        });
        self.pub("notify", {
            type: "LOAD_INFO_SUMMARY_PROGRESS_PLAN",
            args: self.params
        });
        self.pub("notify", {
            type: "LOAD_INFO_ACTIVITY_SUMMARY",
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

bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.sidebar", ["workportalFacade", "dataService", "bizagi.workportal.services.behaviors.loadDataPlan", bizagi.workportal.widgets.project.plan.activity.sidebar], true);