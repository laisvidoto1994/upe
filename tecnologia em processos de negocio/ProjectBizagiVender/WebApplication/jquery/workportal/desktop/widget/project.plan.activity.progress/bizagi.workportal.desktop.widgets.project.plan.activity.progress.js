/*
 *   Name: Bizagi Workportal Desktop Project Plan Activity Progress
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.activity.progress", {}, {

   /*
    *   Constructor
    */
   init: function (workportalFacade, dataService, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      self.plugins = {};
      self.dialogBox = {};

      //Load templates
      self.loadTemplates({
         "plan-progress-main": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.progress").concat("#project-plan-activity-progress"),
         "plan-progress-popup-edit": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.progress").concat("#project-plan-activity-edit-progress")
      });
   },

   renderContent: function () {
      var self = this;
      self.content = $("<div></div>");
      return self.content;
   },

   postRender: function () {
      var self = this;
      self.sub("LOAD_INFO_ACTIVITY_SUMMARY", $.proxy(self.onNotifyLoadInfoActivityExecution, self));
      self.sub("UPDATE_ITEMS_FROM_FORMRENDER", $.proxy(self.onNotifyUpdateItemFromRender, self));
   },

   /**
    * Notifies when an event is raised
    */
   onNotifyLoadInfoActivityExecution: function (event, params) {
      var self = this;
      self.params = $.extend(self.params, params.args);
      var $content = self.getContent().empty();

      var activityToShow = self.params.plan.activities.filter(function(activity){
         return activity.id.toUpperCase() == self.params.plan.idActivitySelected.toUpperCase();
      })[0];

      var argsTemplate = {};
      argsTemplate.valuePercentBarComplete = 0;
      argsTemplate.progress = {
         progress: activityToShow.progress,
         canEdit: (activityToShow.items.length === 0)
      };

      if(argsTemplate.progress.progress){
         argsTemplate.valuePercentBarComplete = argsTemplate.progress.progress;
      }

      //Update widget
      var templateMain = self.getTemplate("plan-progress-main");
      templateMain.render(argsTemplate).appendTo($content);

      self.plugins.popupEditProgress = self.initPluginPopupEditProgress();

      var popupEditProgress = self.plugins.popupEditProgress;

      self.formEditProgress = {
         sliderProgress: $("#sliderProgress", popupEditProgress).slider({
            orientation: "horizontal",
            range: "min",
            max: 100,
            width: 100,
            from: 5,
            to: 50,
            step: 1,
            value: argsTemplate.valuePercentBarComplete,
            slide: $.proxy(self.onChangesliderProgress, self),
            change: $.proxy(self.onChangesliderProgress, self)
         }).each(function () {
            var vals = $(this).slider("option", "max") - $(this).slider("option", "min");
            for (var i = 0; i <= vals; i += 10) {
               var el = $("<label class='step'>" + (i) + "</label>").css("left", (i / vals * 100) + "%");
               $(this).append(el);
            }
         }),
         numericTextBoxPlugin: $("#inputProgressNumericTextBox", popupEditProgress).spinner({
            format: "n0",
            min: 0,
            max: 100,
            spin: $.proxy(self.onChangeNumericTextBoxProgress, self),
            change: $.proxy(self.onChangeNumericTextBoxProgress, self),
            value: argsTemplate.valuePercentBarComplete,
            decimals: 0
         }),
         buttonChangeProgress: $("#button-accept-change-progress", popupEditProgress),
         buttonCancel: $("#button-cancel-change-progress", popupEditProgress)
      };

      //Handlers
      $(".action-open-popup-edit-progress", $content).on("click", $.proxy(self.onShowPopupEditProgress, self));

      self.formEditProgress.buttonCancel.on("click", $.proxy(self.onClickCancel, self));
      self.formEditProgress.buttonChangeProgress.on("click", $.proxy(self.onSubmitFormChangeProgress, self));

      self.updateProgressUI(argsTemplate.valuePercentBarComplete);
      self.formEditProgress.numericTextBoxPlugin.spinner("value", argsTemplate.valuePercentBarComplete);

   },

   onNotifyUpdateItemFromRender: function(event, params){
      var self = this;
      var listItems = params.args.items;
      var activityWork = params.args.activityWork;

      var progress;
      if(listItems.length > 0){
         //Hide edit progress
         $(".action-open-popup-edit-progress", self.content).hide();
      }
      //set new progress
      $(".bz-wp-timestamp span", self.content).text(activityWork);
      $(".bz-wp-progress-bar", self.content).css("width", activityWork + "%");

   },

   updateProgressUI: function(newPercentProgress){
      var self = this,
         $content = self.getContent();

      $(".bz-wp-timestamp span", $content).text(newPercentProgress);

      //Begin Adjust status bar next to the number days
      var $barRemainingDate = $(".remaining-days .time-remaining", $content);
      var widthNumberDays = $(".remaining-days .days", $content).width();
      $barRemainingDate.css("padding-left", (widthNumberDays + 7).toString() + "px");

      var $barCompletedDate = $(".remaining-days .bar-completed", $content);

      $barCompletedDate.css("width", newPercentProgress.toString() + "%");
      //End Adjust status bar next to the number days
   },

   initPluginPopupEditProgress: function () {
      var self = this;
      var templatePopupEditProgress = self.getTemplate("plan-progress-popup-edit");
      self.dialogBox.formContent = templatePopupEditProgress.render();
      return self.dialogBox.formContent;

   },
   /*
    * UI
    */

   onShowPopupEditProgress: function(){
      var self = this;

      self.dialogBox.formContent.dialog({
         resizable: false,
         draggable: false,
         height: "auto",
         width: "600px",
         modal: true,
         title: bizagi.localization.getResource("workportal-project-plan-progress-title"),
         maximize: true,
         open:  $.proxy(self.onOpenPopupPlan, self),
         close: function () {
            self.dialogBox.formContent.dialog("destroy");
            self.dialogBox.formContent.detach();
         }
      });

      self.previusValueProgress = self.formEditProgress.sliderProgress.slider("value");

   },

   onChangeNumericTextBoxProgress: function (event) {
      var self = this;
      var newValue = self.formEditProgress.numericTextBoxPlugin.spinner("value");
      self.formEditProgress.sliderProgress.slider("value", newValue);
   },

   onChangesliderProgress: function (event) {
      var self = this;
      var newValue = self.formEditProgress.sliderProgress.slider("value");
      self.formEditProgress.numericTextBoxPlugin.spinner("value", newValue);
   },

   onClickCancel: function (event) {
      event.preventDefault();
      var self = this;

      self.dialogBox.formContent.dialog("destroy");
      self.dialogBox.formContent.detach();
      //return before value progress
      self.formEditProgress.sliderProgress.slider("value", self.previusValueProgress);
      self.formEditProgress.numericTextBoxPlugin.spinner("value", self.previusValueProgress);
   },

   onSubmitFormChangeProgress: function (event) {
      event.preventDefault();
      var self = this;

      self.formEditProgress.buttonChangeProgress.prop("disabled", true);

      var activityToShow = self.params.plan.activities.filter(function(activity){
         return activity.id == self.params.plan.idActivitySelected;
      })[0];
       var params = $.extend(activityToShow, {
           progress:  self.formEditProgress.numericTextBoxPlugin.spinner("value"),
           idPlan: self.params.plan.id
       });
      $.when(self.dataService.editActivityPlan(params)).done(function () {
         self.formEditProgress.buttonChangeProgress.prop("disabled", false);
         activityToShow.progress = self.formEditProgress.numericTextBoxPlugin.spinner("value");
         self.updateProgressUI(activityToShow.progress);
          self.dialogBox.formContent.dialog("destroy");
          self.dialogBox.formContent.detach();
      });
   }

});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.progress", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.plan.activity.progress], true);