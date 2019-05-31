/*
 *   Name: Bizagi Workportal Desktop Project Plan Activity Action
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.activity.action", {}, {

   /**
    *   Constructor
    */
   init: function (workportalFacade, dataService, notifier, params) {
      var self = this;

      // Call base
      self._super(workportalFacade, dataService, params);

      self.dateFormat = bizagi.localization.getResource("dateFormat");
      self.timeFormat = bizagi.localization.getResource("timeFormat");
      self.estimatedFinishDateTime; //Save complete date and time, because datepicker dont save time

      self.beforeUserAssignedActivity = "";
       self.notifier = notifier;


      //Load templates
      self.loadTemplates({
         "activity-action-main": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.action").concat("#project-plan-activity-action"),
         "activity-action-editionpopup": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.activity.action").concat("#project-plan-activity-action-editionpopup")
      });

      self.dialogBox = {};
   },

   /**
    *
    * @returns {*|jQuery|HTMLElement}
    */
   renderContent: function () {
      var self = this;
      self.content = $("<div></div>");
      return self.content;
   },

   /**
    *
    */
   postRender: function () {
      var self = this;
      self.sub("LOAD_INFO_ACTIVITY_SUMMARY", $.proxy(self.onNotifyLoadInfoActivityExecution, self));
      self.sub("EXPANDED_RIGHT_SIDEBAR", $.proxy(self.onNotifyExpandedRightSidebar, self));
   },

   /**
    * Notifies when an event is raised
    */
   onNotifyLoadInfoActivityExecution: function (event, params) {
      var self = this;
      self.params = $.extend(self.params, params.args);

      var $content = self.getContent().empty();

      var currentActivity = {};
      if(self.params.plan.idActivitySelected){
         currentActivity = self.params.plan.activities.filter(function(activity){
            return activity.id.toUpperCase() === self.params.plan.idActivitySelected.toUpperCase();
         })[0];
      }

      if(self.params.plan.idUserCreator === bizagi.currentUser.idUser || currentActivity.userAssigned == bizagi.currentUser.idUser){

         var argsTemplate = {};
         argsTemplate.currentActivityName = currentActivity.name;
         argsTemplate.showEditAction = true;
         if(self.params.plan.idUserCreator !== bizagi.currentUser.idUser){
             argsTemplate.showEditAction = false;
         }

         var tmpl = self.getTemplate("activity-action-main");
         $content.append(tmpl.render(argsTemplate));

         if(argsTemplate.showEditAction){
             self.plugins = {};
             self.initilizeActionMenu();
             self.plugins.activityEdition = self.initPluginPopupEdition();

             self.formEditActivity = {
                 assignee: $("#activity-form-assignee", self.plugins.activityEdition),
                 date: $("#activity-form-date", self.plugins.activityEdition),
                 duration:  $("#activity-form-duration",self.plugins.activityEdition),
                 buttonCancel: $("#ui-bizagi-wp-project-popupform-action-cancel", self.plugins.activityEdition),
                 buttonUpdate: $("#ui-bizagi-wp-project-popupform-action-update", self.plugins.activityEdition)
             };
             self.beforeUserAssignedActivity = currentActivity.userAssigned;
             self.content.append($content);

             self.formEditActivity.buttonCancel.on("click", $.proxy(self.onClickPopupButtonCancel, self));
             self.formEditActivity.buttonUpdate.on("click", $.proxy(self.onClickPopupButtonUpdate, self));

             self.formEditActivity.date.on("keydown", $.proxy(self.onDeleteDate, self));
             self.formEditActivity.duration.on("keyup", $.proxy(self.onTypeDuration, self));
         }
      }
   },

   /**
    *
    */
   onNotifyExpandedRightSidebar: function(){
      var self = this;
      self.initilizeActionMenu();
   },

   /**
    *
    */
   initilizeActionMenu: function () {
      var self = this;
      $("#ui-bizagi-wp-project-plan-activity-action .menu", self.content).menu({
         select: $.proxy(self.onSelectMenu, self)
      }).removeClass("ui-widget-content");
   },

   /**
    *
    * @returns dialogBox.formContent
    */
   initPluginPopupEdition: function () {
      var self = this;
      var popupEditActivity = self.getTemplate("activity-action-editionpopup");
      self.dialogBox.formContent = popupEditActivity.render({});
      return self.dialogBox.formContent;

   },

   /**
    *
    * @param element
    */
    initializeAutoComplete: function (element) {
        var self = this;
        var url = self.dataService.serviceLocator.getUrl("admin-getUsersList");

        element.autocomplete({
            minLength: 2,
            source: function (request, response) {
                $.ajax({
                    url: url,
                    data: {
                        domain: "",
                        userName: "",
                        fullName: request.term,
                        organization: "",
                        pag: 1,
                        pagSize: 100,
                        orderField: "fullName"
                    },
                    success: function (data) {
                        response($.map(data.users, function (item) {
                            return {
                                label: item.user,
                                value: item.idUser
                            };
                        }));
                    }
                });
            },
            select: function (event, ui) {
                var name = ui.item.label;
                element.val(name);
                self.formEditActivity.IdAssignee = ui.item.value;
                return false;
            },
            focus: function () {
                return false;
            },
            change: function (event, ui){
                if(ui.item === null){
                    self.formEditActivity.IdAssignee = null;
                    self.formEditActivity.assignee.val("");
                }
                return false;
            }

        });

    },

   /**
    *
    * @param element
    */
    initializeDatePicker: function (element) {
        var self = this;
        element.datepicker({
            onSelect: function () {
                self.formEditActivity.duration.val("");
                self.estimatedFinishDateTime = self.formEditActivity.date.datepicker("getDate") ? self.formEditActivity.date.datepicker("getDate").getTime() : undefined;
            }
        });
        element.datepicker("option", "dateFormat", bizagi.util.dateFormatter.getDateFormatByDatePickerJqueryUI());
    },

   /**
    *
    * @param element
    */
    initializeSpiner: function (element) {
        var self = this;
        function desactivateDateByDuration(event, newValue){
            var value = newValue || $(event.target).val();
            if (bizagi.util.isNumeric(value) && parseInt(value, 10) > 0) {
               self.formEditActivity.date.val("");
               self.estimatedFinishDateTime = undefined;
            } else {
               $(event.target).val("");
            }
        }

        element.spinner({
            min: 1,
            max: 1000,
            placeHolder: bizagi.localization.getResource("workportal-hours"),
            change: function (event) {
                desactivateDateByDuration(event);
            },
            spin: function( event, ui ) {
                desactivateDateByDuration(event, ui.value);
            }
        });
    },

   /***
    * Events
    * @param event
    */

   onDeleteDate: function (event) {
      var self = this;
      if (event.keyCode === 8) {
          $(event.target).val("");
          self.fieldDurationActive(true);
      }
   },

   /**
    *
    * @param event
    */
   onTypeDuration: function (event) {
      var self = this;
      var $target = $(event.target);
      if ($target.val() !== "") {
          self.estimatedFinishDateTime = undefined;
      } else {
          self.activateElement(self.form.date);
      }
   },

    /**
     * When select menu
     * @param event
     * @param ui
     */
   onSelectMenu: function (event, ui) {
      var self = this;
      if($(event.currentTarget).find("i").length === 0){
         var item = $(ui.item).data("item");
         switch (item) {
            case "edit":
               self.onClickOpenPopupEdition();
               break;
         }
      }
   },

   /**
    *
    */
   onClickOpenPopupEdition: function () {
      var self = this;
      self.dialogBox.formContent.dialog({
         resizable: false,
         draggable: false,
         height: "auto",
         width: "600px",
         modal: true,
         title: bizagi.localization.getResource("workportal-project-plan-title-activity-properties"),
         maximize: true,
         open: $.proxy(self.onOpenPopupEdition, self),
         close: $.proxy(self.onClosePopupEdition, self)
      });
   },

    /**
    *
    */
    onOpenPopupEdition: function () {
        var self = this;
        var currentActivity = self.params.plan.activities.filter(function(activity){
            return activity.id.toUpperCase() === self.params.plan.idActivitySelected.toUpperCase();
        })[0];

        self.initializeAutoComplete(self.formEditActivity.assignee);
        self.initializeDatePicker(self.formEditActivity.date);
        self.initializeSpiner(self.formEditActivity.duration);

        if (currentActivity.userAssigned) {
            self.setUserAssignedById(currentActivity.userAssigned);
        }

        self.formEditActivity.date.datepicker("option", "minDate", new Date(self.getDateServer()));
        if (currentActivity.estimatedFinishDate && parseInt(currentActivity.estimatedFinishDate, 10) < self.getDateServer()) {
            self.formEditActivity.date.datepicker("option", "minDate", new Date(parseInt(currentActivity.estimatedFinishDate, 10)));//set minimum because, if date is past
        }
        self.formEditActivity.date.datepicker("setDate", new Date(parseInt(currentActivity.estimatedFinishDate, 10)));
        self.estimatedFinishDateTime = currentActivity.estimatedFinishDate;

        if (currentActivity.duration) {
            self.formEditActivity.duration.val(parseInt(currentActivity.duration, 10));
        }
   },

   /**
    * When close popup edition
    */
   onClosePopupEdition: function(){
      var self = this;
      self.removePopupWidgets();
   },

   /**
    *
    * @param idUser
    */
    setUserAssignedById: function (idUser) {
        var self = this;
        //Show images users
        self.callGetDataUsers(idUser).then(function (responseUsers) {
            self.formEditActivity.assignee.val(responseUsers[0].name);
        });
        self.formEditActivity.IdAssignee = idUser;
    },

   /**
    *
    * @param event
    */
    onClickPopupButtonCancel: function(event){
        var self = this;
        event.preventDefault();
        self.dialogBox.formContent.dialog("close");
    },

    /**
    * Remove popup widgets
    */
    removePopupWidgets: function(){
        var self = this;
        self.formEditActivity.assignee.next().find("span").html("");
    },

   /**
    *  Triggered when click update plan activity
    */
    onClickPopupButtonUpdate: function () {
        var self = this;
        if(self.validateParamsOfFormEditActivity()){
            var currentActivity = self.params.plan.activities.filter(function (activity) {
                return activity.id.toUpperCase() === self.params.plan.idActivitySelected.toUpperCase();
            })[0];
            var idUserAssigned =  self.formEditActivity.IdAssignee || bizagi.currentUser.idUser;
            var updateActivity = {
                progress: currentActivity.progress,
                id: currentActivity.id,
                startDate: currentActivity.startDate,
                duration: self.formEditActivity.duration.val(),
                userAssigned: idUserAssigned,
                allowEdition: currentActivity.allowEdition,
                description: currentActivity.description,
                name: currentActivity.name,
                idPlan: currentActivity.idPlan,
                estimatedFinishDate: self.estimatedFinishDateTime,
                finishDate: currentActivity.finishDate,
                items: currentActivity.items
            };
            $.when(self.dataService.editActivityPlan(updateActivity)).done(function () {
                currentActivity = $.extend(currentActivity, updateActivity);
                self.removePopupWidgets();

                if (self.beforeUserAssignedActivity !== self.formEditActivity.IdAssignee) {
                    self.pub("notify", {
                        type: "ACTIVITYPLANCOMMENTS",
                        args: $.extend(self.params, {refreshAllWidgets: true})
                    });
                }
                else {
                    self.pub("notify", {
                        type: self.params.showContextByMenuDashboard,
                        args: self.params
                    });
                }

                self.dialogBox.formContent.dialog("close");
                self.notifier.showSucessMessage(bizagi.localization.getResource("workportal-project-plan-activity-update-message"));
            });
        }
    },

   /***
    * Events
    */
   onClickFavorite: function (event) {
      event.preventDefault();
      var self = this;
      var favoriteOptions = {};
      if ($(event.target).hasClass("bz-icon-star-outline")) {
         favoriteOptions = {
            idObject: self.params.idCase,
            favoriteType: "CASES"
         };
         $.when(self.dataService.addFavorite(favoriteOptions)).done(function (favoritesData) {
            self.params.guidFavorite = favoritesData.idFavorites;
            $(event.target).removeClass("bz-icon-star-outline");
            $(event.target).addClass("bz-icon-star");
         });
      }
      else {
         favoriteOptions = {
            idObject: self.params.guidFavorite,
            favoriteType: "CASES"
         };
         $.when(self.dataService.delFavorite(favoriteOptions)).done(function () {
            $(event.target).addClass("bz-icon-star-outline");
            $(event.target).removeClass("bz-icon-star");
         });
      }
   },

   /**
    * Clean events and plugins
    */
   clean: function(){
      var self = this;
      self.unsub("LOAD_INFO_ACTIVITY_SUMMARY", $.proxy(self.onNotifyLoadInfoActivityExecution, self));
      self.unsub("EXPANDED_RIGHT_SIDEBAR", $.proxy(self.onNotifyExpandedRightSidebar, self));
   },

   /**
    * Validate form edit plan activity
    * @returns {boolean}
    */
    validateParamsOfFormEditActivity: function(){
        var self = this;
        var userAssigned = self.formEditActivity.assignee;
        if (userAssigned.val() && userAssigned.val() !== "" && self.formEditActivity.IdAssignee) {
            return true;
        } else {
            var messageValidationField = bizagi.localization.getResource("workportal-general-error-field-required");
            messageValidationField = messageValidationField.replace("{0}", bizagi.localization.getResource("workportal-project-plan-assignee").toLowerCase());
            userAssigned.next().find("span").html(messageValidationField);
            return false;
        }
    },

   /**
    * Call services
    */
   callGetDataUsers: function (csvIdUsers) {
      var self = this,
         defer = $.Deferred();
      var params = {
         userIds: csvIdUsers,
         width: 50,
         height: 50
      };

      self.dataService.getUsersData(params).always(function (response) {
         defer.resolve(response);
      });
      return defer.promise();
   }
});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.activity.action", ["workportalFacade", "dataService", "notifier", bizagi.workportal.widgets.project.plan.activity.action]);
