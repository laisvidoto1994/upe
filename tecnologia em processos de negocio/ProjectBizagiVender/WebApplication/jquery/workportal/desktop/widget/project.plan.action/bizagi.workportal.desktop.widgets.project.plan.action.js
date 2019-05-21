/*
 *   Name: Bizagi Workportal Desktop Project Plan Action
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.action", {}, {

    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, projectDashboard, notifier, planTemplateCreate, planPopupEdit, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        self.PENDING_PLAN = "PENDING";
        self.EXECUTING_PLAN = "EXECUTING";
        self.CLOSED_PLAN = "CLOSED";

        self.CONTEXT_ACTIVITYPLAN = "ACTIVITYPLAN";
        self.CONTEXT_ACTIVITYPLANOVERVIEW = "ACTIVITYPLANOVERVIEW";
        self.CONTEXT_PLANCREATE = "PLANCREATE";
        self.CONTEXT_ACTIVITYPLANCREATE = "ACTIVITYPLANCREATE";

        self.showActionsPlan = false;
        self.projectDashboard = projectDashboard;
        self.notifier = notifier;
        self.planTemplateCreate = planTemplateCreate;
        self.planPopupEdit = planPopupEdit;

        //Load templates
        self.loadTemplates({
            "plan-action-main": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.action").concat("#project-plan-action")
        });
    },

    renderContent: function () {
        var self = this;
        var tmpl = self.getTemplate("plan-action-main");

        self.showActionsPlan =  self.params.showContextByMenuDashboard !== self.CONTEXT_ACTIVITYPLAN &&
            self.params.showContextByMenuDashboard !== self.CONTEXT_ACTIVITYPLANOVERVIEW;

        self.plugins = {};
        self.content = tmpl.render({
            plan: self.params.plan.name,
            stateClosedPlan: self.CLOSED_PLAN,
            currentStatePlan: self.params.plan.currentState,
            showActionsPlan: self.showActionsPlan
        });

        if (self.showActionsPlan) {
            self.params.plan.contextualized = typeof(self.params.plan.contextualized) == "undefined" ? true : self.params.plan.contextualized;
        }

        return self.content;
    },

    postRender: function () {

        var self = this;
        var $contentWidget = self.getContent();

        if(self.showActionsPlan){
            self.initilizeActionMenu();
            $("a#to-close-plan", $contentWidget).on("click", $.proxy(self.onClosePlan, self));
        }

        self.sub("LOAD_INFO_SUMMARY_PLAN", $.proxy(self.onNotifyLoadInfoSummaryPlan, self));
        self.clearAlertsOnFocus();

        self.planTemplateCreate.sub('planTemplateCreatedSuccess', function () {
            self.notifier.showSucessMessage(
                printf(bizagi.localization.getResource('workportal-project-plan-create-template-success'), ''));
        });
        self.planTemplateCreate.sub('planTemplateCreatedFailed', function () {
            self.notifier.showErrorMessage(
                printf(bizagi.localization.getResource('workportal-project-plan-create-template-fail'), ''));
        });

        self.planPopupEdit.sub('planEditedSuccess', function () {
            self.setNamePlan(self.params.plan.name);

            self.pub("notify", {
                type: "UPDATE_INFO_PLAN"
            });

            self.pub("notify", {
                type: "LOAD_INFO_SUMMARY_PLAN",
                args: self.params
            });

            self.notifier.showSucessMessage(
                printf(bizagi.localization.getResource('workportal-project-plan-edit-success'), ''));
        });

        self.planPopupEdit.sub('planEditedFailed', function () {
            self.notifier.showErrorMessage(
                printf(bizagi.localization.getResource('workportal-project-plan-edit-fail'), ''));
        });

        self.sub("EXPANDED_RIGHT_SIDEBAR", $.proxy(self.onNotifyExpandedRightSidebar, self));
    },

    onNotifyExpandedRightSidebar: function(){
        var self = this;
        if(self.showActionsPlan){
            self.initilizeActionMenu();
        }
    },

    /**
     * Notifies when an event is raised
     */

    onNotifyLoadInfoSummaryPlan: function () {
        var self = this;
        self.setStatePlan(self.params.plan.currentState);
        self.setNamePlan(self.params.plan.name);
    },

    /**
     * UI
     */

    setStatePlan: function (statePlan) {
        var self = this;
        if (statePlan) {
            switch (statePlan.toUpperCase()) {
                case "PENDING":
                    $(".state-pending-plan", self.content).show().siblings().hide();
                    break;
                case "EXECUTING":
                    $(".state-executing-plan", self.content).show().siblings().hide();
                    break;
                case "CLOSED":
                    $(".state-closed-plan", self.content).show().siblings().hide();
                    break;
            }
        }
    },

    setNamePlan: function(namePlan){
        var self = this;
        $(".ui-bizagi-wp-project-plan-header .bz-wp-section", self.content).text(namePlan);
    },

    /**
     Events
     */
    onSelectMenu: function (event, ui) {
        var self = this;
        if($(event.currentTarget).find("i").length === 0){
            var item = $(ui.item).data("item");

            switch (item) {
                case "edit":
                    self.onClickMenuOpenEdition();
                    break;
                case "delete":
                    self.onClickMenuDeletePlan();
                    break;
                case "saveastmpl":
                    self.onClickMenuSaveAsTemplate();
                    break;
            }
        }

    },

    onClickMenuOpenEdition: function () {
        var self = this;
        var planSelected = self.params.plan;
        self.planPopupEdit.showPopup(self.params, self.dataService, planSelected);
    },

    onClickMenuSaveAsTemplate: function () {
        var self = this;
        self.planTemplateCreate.showPopupAddTemplatePlan(self.params,
            self.dataService, self.params.plan.contextualized, self.params.plan.id);
    },

    onClickMenuDeletePlan: function(){
        var self = this;

        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-project-plan-action-delete-confirmation"), "", "info")).done(function () {
            var params = { id: self.params.plan.id };

            $.when(self.callDeletePlan(params)).always(function(response){
                if (response.status === 200 || typeof (response.status) === "undefined") {
                    $.extend(self.params.plan, params);
                    self.notifier.showSucessMessage(
                        printf(bizagi.localization.getResource("workportal-project-plan-delete-success"), ""));

                    //when a plan created from an activity is deleted, not created from a case
                    var getLevelNavigator = self.pub("notify", { type: "NAVIGATOR_GETLEVEL"});
                    var currentLevelNavigator = parseInt(getLevelNavigator[0]);
                    var params = self.projectDashboard.getParamsByBackFromPlan(self.params, currentLevelNavigator, true);

                    self.pub("notify", {
                        type: params.typeContext,
                        args: $.extend(self.params, params.paramsNotify)
                    });
                }
                else{
                    self.notifier.showErrorMessage(
                        printf(bizagi.localization.getResource('workportal-project-plan-delete-fail'), ''));
                }
            });
        });
    },

    onSubmitFormPlan: function (event) {
        event.preventDefault();
    },

    initilizeActionMenu: function () {
        var self = this;
        $(".ui-bizagi-wp-project-plan-action-menu", self.content).menu({
            select: $.proxy(self.onSelectMenu, self)
        }).removeClass("ui-widget-content");
    },


    /**
     * Initialize edit plugin
     */

    clearAlertsOnFocus: function () {
        $(".ui-bizagi-wp-project-container-validator-relative input, .ui-bizagi-wp-project-container-validator-relative textarea").focus(function () {
            $(this).parent().find(".k-invalid-msg").hide();
        }).focusout(function () {
            if ($(this).val().length < 1) {
                $(this).parent().find(".k-invalid-msg").show();
            }
        });
    },

    /*activitiesAreCompleted: function(activities){
        var listActivities = activities || [];
        var numActivitiesCompleted =  listActivities.filter(function(activity){
            return activity.finishDate;
        }).length;
        return numActivitiesCompleted == activities.length;
    },*/

    /*getCopyObjectPlan: function(){
        var self = this;
        return {
            id: self.params.plan.id,
            name: self.params.plan.name,
            description: self.params.plan.description,
            dueDate: self.params.plan.dueDate,
            waitForCompletion: self.params.plan.waitForCompletion,
            currentState: self.params.plan.currentState,
            parentWorkItem: self.params.plan.parentWorkItem,
            creationDate: self.params.plan.creationDate,
            startDate: self.params.plan.startDate,
            idUserCreator: self.params.plan.idUserCreator,
            contextualized: self.params.plan.contextualized,
            activities: self.params.plan.activities
        };
    },*/

    /**
     * Call services
     */
    /*callUpdatePlan: function(params){
        var self = this;
        return $.when(self.dataService.updatePlan(params)).done(function () {
            $.extend(self.params.plan, params);

        });
    },

    callClosePlan: function(params){
        var self = this;
        return $.when(self.dataService.closePlan(params)).done(function () {
            $.extend(self.params.plan, params);
            self.notifier.showSucessMessage(
                printf(bizagi.localization.getResource("workportal-project-plan-close-success"), ""));
        });
    },*/

    callDeletePlan: function(params){
        var self = this;
        return $.when(self.dataService.deletePlan(params));
    },

    clean: function(){
        var self = this;
        self.planTemplateCreate.unsub("planTemplateCreatedSuccess");
        self.planTemplateCreate.unsub("planTemplateCreatedFailed");
        self.planPopupEdit.unsub("planEditedSuccess");
        self.planPopupEdit.unsub("planEditedFailed");

        self.unsub("EXPANDED_RIGHT_SIDEBAR", $.proxy(self.onNotifyExpandedRightSidebar, self));
    }
});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.action", ["workportalFacade", "dataService",
    "bizagi.workportal.services.behaviors.projectDashboard", "notifier",
    "bizagi.workportal.widgets.project.plan.template.create",
    "bizagi.workportal.widgets.project.plan.edit",
    bizagi.workportal.widgets.project.plan.action], true);