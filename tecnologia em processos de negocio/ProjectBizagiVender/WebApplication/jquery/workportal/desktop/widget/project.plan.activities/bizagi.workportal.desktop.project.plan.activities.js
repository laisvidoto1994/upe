/*
*   Name: Bizagi Workportal Desktop Project Plan Activities
*   Author: David Romero Estrada
*/

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.plan.activities", {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService, notifier, serviceOrderActivitiesByTransitions, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        self.serviceOrderActivitiesByTransitions = serviceOrderActivitiesByTransitions;

        // Modes widget: designed plan or execution plan
        self.PENDING_PLAN = "PENDING_PLAN";
        self.EXECUTING_PLAN = "EXECUTING_PLAN";
        self.CONTEXT_PLANACTIVITIES = "PLANACTIVITIES";
        self.CONTEXT_PLANOVERVIEW = "PLANOVERVIEW";
        self.CONTEXT_PLANCREATE = "PLANCREATE";

        self.plugins = {};
        self.fromIndexEnabledSortingActivities = 0;
        self.idActivityEditing = "";
        self.plugins.notifier = notifier;

        //private fields
        self._statePlan = self.PENDING_PLAN;

        self.userPictures = [];

        // Load templates
        self.loadTemplates({
            "plan-activities-main": bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.plan.activities").concat("#project-plan-activities"),
            "plan-activities-item": bizagi.getTemplate("bizagi.workportal.desktop.widgets.project.plan.activities").concat("#project-plan-activities-item")
        });
    },

    renderContent: function () {
        var self = this;
        self.content = $("<div></div>");
        return self.content;
    },

    postRender: function () {
        var self = this;
        self.sub("LOAD_INFO_SUMMARY_PROGRESS_PLAN", $.proxy(self.onNotifySummaryProgressPlan, self));
        self.sub("UPDATE_INFO_PLAN", $.proxy(self.onNotifyUpdatePlan, self));
        self.sub("UPDATE_LIST_ACTIVITIES", $.proxy(self.renderWidgetByStatePlan, self));
        self.sub("UPDATE_ACTIVITY_INFO", $.proxy(self.refreshActivityRow, self));
    },

    onNotifySummaryProgressPlan: function(event, params) {
        var self = this;
        self.params = $.extend(self.params, params.args);

        var state = self.params.plan.currentState;
        self._statePlan = state + "_PLAN";

        self.renderWidgetByStatePlan(event.type);

    },

    renderWidgetByStatePlan: function(event){
        var self = this;
        self.idActivityEditing = "";
        var $content = self.getContent().empty();

        var isEnableEventsOnActivitiesByCurrentContext = self.enableEventsOnActivitiesByCurrentContext(self.params.showContextByMenuDashboard);

        var auxCountActivitiesFinished = self.params.plan.activities.filter(function(activity){
            return activity.finishDate;
        }).length;

        var argsTemplate = {
            showContextByMenuDashboard: self.params.showContextByMenuDashboard,
            statePlan: self._statePlan,
            statePendingPlan: self.PENDING_PLAN,
            stateExecutingPlan: self.EXECUTING_PLAN,
            contextPlanActivities: self.CONTEXT_PLANACTIVITIES,
            plan: self.params.plan,
            showFormAddActivityByNotFinishedAllActivities: (auxCountActivitiesFinished !== self.params.plan.activities.length)
        };

        var contentTemplate = self.getTemplate("plan-activities-main");
        contentTemplate
           .render($.extend(self.params, argsTemplate))
           .appendTo($content);

        if((self._statePlan === self.PENDING_PLAN || self._statePlan === self.EXECUTING_PLAN) && isEnableEventsOnActivitiesByCurrentContext){
            self.plugins.sortablelist = self.initializeSortableList();
            self.addEventHandlers();
        }

        self.setContentWrapper($content);

        $(".project-plan-activity-list", $content).on("click", "li", $.proxy(self.onClickEditActivity, self));

        $(".project-plan-activity-list", $content).on("click", "li .activity-view", $.proxy(self.onClickEditActivity, self));

        $(".project-plan-activity-list", $content).on("click", "li .bz-icon-trash-outline", $.proxy(self.onClickDeleteActivity, self));

        $(".project-plan-activity-list", $content).on("click", "li .item-workonit-button", $.proxy(self.onClickWorkonItActivity, self));

        if(self.params.showContextByMenuDashboard === self.CONTEXT_PLANACTIVITIES){
            $(".project-plan-activity-list", $content).on("click", "li .ui-bizagi-wrapper-parallel-icon", $.proxy(self.onClickChangeParallel, self));
        }

        if (self._statePlan === self.PENDING_PLAN) {
            $("a#to-execute-plan", $content).on("click", $.proxy(self.onExecutePlan, self));
        } else if (self._statePlan !== "CLOSED_PLAN") {
            $("a#to-close-plan", $content).on("click", $.proxy(self.onClosePlan, self));
        }

        self.renderActivities();
        if(event){
            if(event.type === "UPDATE_LIST_ACTIVITIES"){
                self.updateTransitions();
            }
        }
    },

    getCopyObjectPlan: function () {
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
    },

    enableEventsOnActivitiesByCurrentContext: function(currentContext){
        var self = this;
        return currentContext === self.CONTEXT_PLANACTIVITIES;
    },

    onNotifyUpdatePlan: function(){
        var self = this;
        if(self.params.showContextByMenuDashboard === self.CONTEXT_PLANOVERVIEW){
            $(".ui-bizagi-wp-project-plan-activities-header h3", self.content).text(self.params.plan.name);
            $(".ui-bizagi-wp-project-plan-activities-header p", self.content).text(self.params.plan.description);
        }

    },

    initializeSortableList: function () {
       var self = this;
       return $(".project-plan-activity-list", self.content).kendoSortable({
            hint: function (element) {
                var $clone = element.clone().width(element.width());
                return $("<ol class='project-plan-activity-list ui-bizagi-wp-nolist'></ol>").append($clone);
            },
            change: $.proxy(self.onChangePosition, self),
            disabled: ".disabled",
            end: function(e) {
               if(e.newIndex < self.fromIndexEnabledSortingActivities) {
                   e.preventDefault();
               }
                else{
                    if(e.oldIndex !== e.newIndex){
                        self.serviceOrderActivitiesByTransitions.movePositionActivity(
                            self.params.plan.activities, e.oldIndex, e.newIndex);

                        var $liActivityGoDown = $(".project-plan-activity-list li", self.content).eq(e.newIndex);

                        if(!self.canChangeToParallelActivity(self.params.plan.activities, $liActivityGoDown)){
                            self.params.plan.activities[e.newIndex].parallel = false;

                            function setSerieActivity(newIndex){
                                setTimeout(function(){
                                    //TODO: Update selector when show arrows in all activities
                                    $(".project-plan-activity-list li .wrapper-arrow-css i", self.content).eq(0).
                                        removeClass("bz-icon-arrow-right-outline").addClass("bz-icon-arrow-down-outline");
                                }, 50);
                            }
                            setSerieActivity(e.newIndex);


                        }


                    }
                }
            }
       }).data("kendoSortable");
    },

    /*initializeNotifier: function(){
        var self = this;
        return $("#project-plan-notifier", self.content).kendoNotification().data("kendoNotification");
    },*/

    updateTransitions: function(){
        var self = this;
        var defer = $.Deferred();
        var params = {
            idPlan: self.params.plan.id,
            transitions: self.getActualTransitions()
        };

        $.when(self.dataService.changeTransitions(params)).always(function (response, responseText, xhr) {
            if (xhr.status === 500) {
                self.plugins.notifier.showErrorMessage(bizagi.localization.getResource("workportal-project-plan-activities-sorterror"), "error");
            }
            self.params.plan.activities = self.orderActivitiesByTransitions(self.params.plan.activities, params.transitions);
            defer.resolve();
        });
        return defer.promise();
    },

    orderActivitiesByTransitions: function(activities, transitions){
        var self = this;
        return self.serviceOrderActivitiesByTransitions.
            getActivitiesByTransitions(activities, transitions);
    },

    getActualTransitions: function(){
        var self = this;
        var auxOrderTransitions = self.serviceOrderActivitiesByTransitions.
            getActualTransitionsByActivities(self.params.plan.activities);

        auxOrderTransitions.forEach(function(transition){
            transition.id = undefined;
            transition.idPlan = self.params.plan.id;
        });

        return auxOrderTransitions;
    },

    onChangePosition: function(){
        var self = this;
        self.updateTransitions();
    },

    onCreateActivity: function(event) {
        event.preventDefault();

        var self = this;
        var $input = $("#project-plan-activity-create", $(event.target));
        var name = $input.val();

        var idUserAssigned;
        if(self.params.plan.activities.length > 0){
            idUserAssigned = self.params.plan.activities[self.params.plan.activities.length - 1].userAssigned;
        }
        else{
            idUserAssigned = bizagi.currentUser.idUser;
        }

        if (name.replace(/\s/g, "") !== "") {

            var params = {
                progress: 0,
                id: "",
                startDate: null,
                duration: null,
                userAssigned: idUserAssigned,
                allowEdition: true,
                description: null,
                name: name,
                idPlan: self.params.plan.id,
                estimatedFinishDate: null,
                finishDate: null
            };

            $.when(self.dataService.createPlanActivity(params)).always(function (response, responseText, xhr) {

                if (xhr.status === 201) {

                    var activityNew = $.extend(params, {
                        id: response.id,
                        items: [],
                        numTotalItems: 0,
                        numResolvedItems: 0,
                        parallel: false
                    });

                    self.renderActivities([activityNew]);
                    self.params.plan.activities.push(activityNew);

                    var $activityList = $(".project-plan-activity-list", self.content);
                    $("li:last .bz-icon-pencil-outline", $activityList).trigger("click");

                    self.updateTransitions();

                } else if (response.status === 500) {
                    self.plugins.notifier.showErrorMessage(bizagi.localization.getResource("workportal-project-plan-activities-createarror"), "error");
                }
            });
        }

        event.target.reset();

        event.preventDefault();
    },

    onClickChangeParallel: function(event){
        event.preventDefault();
        var self = this;
        var $wrapperArrow = $(".wrapper-arrow-css", event.currentTarget);

        var $liActivitySelected = $wrapperArrow.closest("li");
        var idActivitySelected = $liActivitySelected.data("id");

        if(self.canChangeToParallelActivity(self.params.plan.activities, $liActivitySelected)){
            /**
             * Changes UI
             * */
            var activityParallel;
            if($("i", $wrapperArrow).hasClass("bz-icon-arrow-down-outline")){
                activityParallel = true;
                $("i", $wrapperArrow).removeClass("bz-icon-arrow-down-outline").addClass("bz-icon-arrow-right-outline").
                    prop("title",  bizagi.localization.getResource("workportal-project-plan-activity-parallel"));
            }
            else{
                activityParallel = false;
                $("i", $wrapperArrow).removeClass("bz-icon-arrow-right-outline").addClass("bz-icon-arrow-down-outline").
                    prop("title",  bizagi.localization.getResource("workportal-project-plan-activity-sequential"));
            }

            /**
             * Change Activity Data
             */
            self.changeActivityProperties(idActivitySelected, {parallel: activityParallel});

            self.updateTransitions();
        }
    },

    canChangeToParallelActivity: function(activities, $liActivitySelected){
        var self = this;
        var result = true;
        var idLastParallelActivity = self.getLastParallelActivityIsRunningOrClose(activities);
        if(idLastParallelActivity){
            var $liPreviusActivity = $liActivitySelected.prev();
            var idPreviusActivity = $liPreviusActivity.data("id");
            if(idLastParallelActivity === idPreviusActivity){
                result = false;
            }
        }
        return result;
    },

    onClickEditActivity: function (event) {
        var self = this;
        var $target = $(event.currentTarget);

        /*if(self._statePlan === self.PENDING_PLAN || (!$target.hasClass("disabled") && self._statePlan === self.EXECUTING_PLAN)){
            isEditableFormActivity = true;
        }*/

        var idActivitySelected = $target.data("id");

        var activityToShow = self.params.plan.activities.filter(function (activity) {
            return activity.id === idActivitySelected;
        })[0];

        var isEditableFormActivity = self._statePlan !== "CLOSED_PLAN" && activityToShow.workItemState !== "Completed";

        if (self.params.showContextByMenuDashboard === self.CONTEXT_PLANACTIVITIES) {
            function showFormToEditActivity(idActivitySelected){
                if(self.idActivityEditing !== idActivitySelected){
                    self.params.plan.idActivitySelected = idActivitySelected;

                    $target.closest("li").addClass("selected").siblings().removeClass("selected");
                    self.idActivityEditing = idActivitySelected;
                    self.pub("notify", {
                        type: "EDITACTIVITY",
                        args: $.extend(self.params, {
                            isEditableFormActivity: isEditableFormActivity,
                            idActivityToShow: idActivitySelected
                        })
                    });
                    self.pub("notify", {
                        type: "OPEN_RIGHT_SIDEBAR"
                    });
                }
            }

            showFormToEditActivity(idActivitySelected);
        }
    },

    changeActivityProperties: function(activityGuid, activityPropertiesToUpdate){
        var self = this;
        for(var iActivity = 0, lengthActivities = self.params.plan.activities.length; iActivity < lengthActivities; iActivity += 1){
            if(self.params.plan.activities[iActivity].id === activityGuid){
                $.extend(self.params.plan.activities[iActivity],  activityPropertiesToUpdate);
                break;
            }
        }
    },

    addEventHandlers: function () {
        var self = this;

        $("#project-plan-activity-createform", self.content).on("submit", $.proxy(self.onCreateActivity, self));
        $("#project-plan-activity-create", self.content).focus();
    },

    /**
     * UI
     */
    renderActivities: function(activities){
        var self = this;
        var $list = $(".project-plan-activity-list", self.content);
        var tmpl = self.getTemplate("plan-activities-item");

        if(self.params.showContextByMenuDashboard === self.CONTEXT_PLANACTIVITIES){
            $list.addClass("enabled-actions");
        }

        var $element = self.params.plan.currentState === "PENDING" ? $("a#to-execute-plan", self.content) : $("a#to-close-plan", self.content);
        if (activities || self.params.plan.activities.length > 0) {
            $element.show();
        } else {
            $element.hide();
        }

        var arrayActivities = activities || self.params.plan.activities;

        var argsTemplate = {
            statePlan: self._statePlan,
            statePendingPlan: self.PENDING_PLAN,
            stateExecutingPlan: self.EXECUTING_PLAN,
            context: self.params.showContextByMenuDashboard,
            activities: activities || self.params.plan.activities,
            currentUserId: bizagi.currentUser.idUser
        };

        if(self._statePlan === self.EXECUTING_PLAN){
            arrayActivities.forEach(function(activity){
                if(activity.startDate){
                    activity.classEnabledActionActivities = "disabled";
                }
                else{
                    activity.classEnabledActionActivities = (self.params.showContextByMenuDashboard === self.CONTEXT_PLANACTIVITIES ? "enabled" : "disabled");
                }

                activity.isRunning = self.runningActivity(activity);

            });
        }

        var $item = tmpl.render(argsTemplate);
        $list.append($item);

        self.fromIndexEnabledSortingActivities = self.params.plan.activities.filter(function(activity){
            return activity.classEnabledActionActivities === "disabled";
        }).length;

        self.loadAndShowImagesUsers(self.params.plan.activities);
    },

    /**
     * Know if the activity is running
     * @param activity
     * @returns {boolean}
     */
    runningActivity: function(activity){
        //Inactive represent created but user dont access yet
        return activity.workItemState === 'Active' || activity.workItemState === 'Inactive';
    },

    loadAndShowImagesUsers: function(listActivities){
        var self = this;

        var arrayIdUsers = $.map(listActivities, function (element) {
            return element.userAssigned;
        });

        function removeDuplicateItemsFromArray(a) {
            var seen = {};
            var out = [];
            var len = a.length;
            var j = 0;
            for (var i = 0; i < len; i += 1) {
                var item = a[i];
                if (seen[item] !== 1) {
                    seen[item] = 1;
                    out[j += 1] = item;
                }
            }
            return out;
        }

        var csvIdUsers = removeDuplicateItemsFromArray(arrayIdUsers.concat(bizagi.currentUser.idUser)).join(",");

        self.getDataUsers(csvIdUsers).then(function () {
            self.renderUserProfilesAndImages();
        });
    },

    renderUserProfilesAndImages: function () {
        var self = this;

        var base64Prefix = "data:image/png;base64,";

        for (var iUser = 0; iUser < self.userPictures.length; iUser += 1) {
            $("div[data-iduser='" + self.userPictures[iUser].id + "']  span.ui-bizagi-user-initials").html(self.userPictures[iUser].name.getInitials());
            if (self.userPictures[iUser].picture) {
                $("div[data-iduser='" + self.userPictures[iUser].id + "']  img").show();
                $("div[data-iduser='" + self.userPictures[iUser].id + "']  span.ui-bizagi-user-initials").hide();
                $("div[data-iduser='" + self.userPictures[iUser].id + "']  img").attr("src", base64Prefix + self.userPictures[iUser].picture);
            }
        }
    },

    /**
     * Call services
     */

    /*
     *  Get data for users
     */
    getDataUsers: function (csvIdUsers) {
        var self = this,
           defer = $.Deferred();

        var params = {
            userIds: csvIdUsers,
            width: 50,
            height: 50
        };

        self.dataService.getUsersData(params).always(function (response) {

            function arrayUnique(array) {
                var a = array.concat();
                for (var i = 0; i < a.length; ++i) {
                    for (var j = i + 1; j < a.length; ++j) {
                        if (a[i] === a[j]){
                            a.splice(j -= 1, 1);
                        }

                    }
                }
                return a;
            }

            self.userPictures = arrayUnique(self.userPictures.concat(response));
            defer.resolve(response);
        });

        return defer.promise();
    },

    /**
     * When cancel form
     */
    onCancelActivityForm: function () {
        var self = this;
        self.pub("notify", {
            type: "PLANSIDEBAR",
            args: self.params
        });
    },

    setContentWrapper: function (content) {
        var self = this;
        var $contentWrapper = $(".project-plan-content-wrapper", content);
        $contentWrapper.on("click", $.proxy(self.onCancelActivityForm, self));
        var activityArea = $("#project-plan-activities-wrapper", content);
        activityArea.on("click", function(e) { e.stopPropagation(); });
        var windowHeight = $(window).height();
        var height = windowHeight - 156;
        $contentWrapper.css("height", height + "px");
    },

    onClickDeleteActivity: function (event) {
        var self = this;
        var idActivitySelected = $(event.currentTarget).data("id");
        var params = {
            idPlan: self.params.plan.id,
            id: idActivitySelected
        };
        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-project-plan-activity-delete-confirmation"), "", "info")).done(function () {
            $.when(self.dataService.deleteActivityPlan(params)).done(function () {

                //The next activity of the deleted, if its parallel, have to set dont parallel
                for(var iActivity = 0, lengthActivities = self.params.plan.activities.length; iActivity < lengthActivities; iActivity += 1){
                    if(self.params.plan.activities[iActivity].id === idActivitySelected){
                        //activity isn't the first or last activity
                        if(lengthActivities > iActivity + 1 && iActivity > 0){
                            if(self.params.plan.activities[iActivity + 1].parallel && self.params.plan.activities[iActivity - 1].parallel){
                                self.params.plan.activities[iActivity + 1].parallel = false;
                                $(".project-plan-activity-list li[data-id='" + self.params.plan.activities[iActivity].id + "']", self.content).
                                    next().find(".wrapper-arrow-css i").removeClass("bz-icon-arrow-right-outline").addClass("bz-icon-arrow-down-outline");
                            }
                        }
                    }
                }

                //Delete activity
                self.params.plan.activities = self.params.plan.activities.filter(function (activity) {
                    return activity.id !== idActivitySelected;
                });

                $.when(self.updateTransitions()).done(function(){
                    self.renderWidgetByStatePlan();

                    self.pub("notify", {
                        type: "PLANSIDEBAR",
                        args: self.params
                    });
                });
            });
        });
    },

    /**
     * Go to activity
     */
    onClickWorkonItActivity: function(event){
        event.preventDefault();
        var self = this;
        var idActivitySelected = $(event.target).closest("li").data("id");
        var activity = self.params.plan.activities.filter(function (activity) {
            return activity.id === idActivitySelected;
        })[0];

        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: activity.idCase,
            idWorkItem: activity.idWorkItem
        });
    },

    onExecutePlan: function (event) {
        event.preventDefault();
        var self = this;

        var numberActivitiesCreated = self.params.plan.activities.length;

        if (numberActivitiesCreated > 0) {
            if (!$(event.target).closest("a").hasClass("disabled")) {
                self.params.plan.currentState = "EXECUTING";
                $(event.target).closest("a").addClass("disabled");
                var params = {
                    idPlan: self.params.plan.id
                };

                $.when(self.dataService.putExecutePlan(params)).done(function () {
                    var params = $.extend(self.getCopyObjectPlan(), { startDate: self.getDateServer() });
                    self.callUpdatePlan(params);

                    $(event.target).closest("a").removeClass("disabled");

                    function sendNotification(params){
                        if(self.params.planChild){
                            self.params.planChild.currentState = self.params.plan.currentState;
                        }

                        self.pub("notify", {
                            type: "PLANACTIVITIES",
                            args: $.extend(params, {refreshAllWidgets: true})
                        });
                    };

                    if(typeof self.radNumber === "undefined"){
                        $.when(self.dataService.getCaseByPlan({idPlan: self.params.plan.id})).done(function(response){
                            self.params.idCase = response.id;
                            sendNotification(self.params);
                        });
                    }
                    else{
                        sendNotification(self.params);
                    }



                });
            }
        }
        else {
            self.plugins.notifier.showErrorMessage(
                    printf(bizagi.localization.getResource("workportal-project-plan-action-execute-message-activities-required"), ""));
        }
    },

    onClosePlan: function (event) {
        var self = this;
        event.preventDefault();
        if (self.activitiesAreCompleted(self.params.plan.activities)) {
            self.closePlan();
        } else {
            $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-project-plan-action-close-message-activities-finished"), "", "info")).done(function () {
                self.closePlan();
            });
        }
    },

    closePlan: function() {
        var self = this;
        var params = $.extend(self.getCopyObjectPlan(), { currentState: "CLOSED" });
        $.when(self.callUpdatePlan(params)).done(function(){
            $.when(self.callClosePlan({idPlan: params.id})).done(function(){
                self.params.plan = params;
                self.pub("notify", {
                    type: "LOAD_INFO_SUMMARY_PLAN",
                    args: self.params
                });

                self.pub("notify", {
                    type: "LOAD_INFO_SUMMARY_PROGRESS_PLAN",
                    args: self.params
                });
            }).fail(function(){
                self.notifier.showErrorMessage(
                    printf(bizagi.localization.getResource('workportal-project-plan-close-fail'), ''));
            });
        }).fail(function(){
            self.notifier.showErrorMessage(
                printf(bizagi.localization.getResource('workportal-project-plan-close-fail'), ''));
        });
    },

    callUpdatePlan: function (params) {
        var self = this;
        return $.when(self.dataService.updatePlan(params)).done(function () {
            $.extend(self.params.plan, params);
        });
    },

    callClosePlan: function (params) {
        var self = this;
        return $.when(self.dataService.closePlan(params)).done(function () {
            $.extend(self.params.plan, params);
            self.plugins.notifier.showSucessMessage(
                printf(bizagi.localization.getResource("workportal-project-plan-close-success"), ""));
        });
    },

    activitiesAreCompleted: function (activities) {
        var listActivities = activities || [];
        var numActivitiesCompleted = listActivities.filter(function (activity) {
            return activity.finishDate;
        }).length;
        return numActivitiesCompleted === activities.length;
    },

    getLastParallelActivityIsRunningOrClose: function(activities){
        var lastIndexParallelInExecution = -1;
        var parallelActivitiesInRunning = activities.filter(function(activity){
            if(activity.startDate !== null && activity.parallel){
                lastIndexParallelInExecution += 1;
                return true;
            }
        });
        if(lastIndexParallelInExecution >= 0 && lastIndexParallelInExecution + 1 !== activities.length){
            return parallelActivitiesInRunning[parallelActivitiesInRunning.length - 1].id;
        }
        else{
            return null;
        }
    },

    refreshActivityRow: function (event, params) {
        var self = this;
        var $selectedActivity = $(".project-plan-activity-list li.selected");
        if (params.args.displayName) $("p>span", $selectedActivity).text(params.args.displayName);
        if (params.args.assignee) {

            var idActivitySelected = $($selectedActivity).data("id");
            var activityEdited = self.params.plan.activities.filter(function (activity) {
                return activity.id === idActivitySelected;
            })[0];

            if(params.args.assignee === bizagi.currentUser.idUser && (activityEdited.workItemState === "Active" || activityEdited.workItemState === "Inactive")){
                $(".item-workonit-button", $selectedActivity).show();
            }
            else{
                $(".item-workonit-button", $selectedActivity).hide();
            }

            self.getDataUsers([params.args.assignee].join()).then(function (response) {
                $(".bz-wp-avatar span.ui-bizagi-user-initials", $selectedActivity).html(response[0].name.getInitials());
                if (response[0].picture) {
                    var base64Prefix = "data:image/png;base64,";
                    $(".bz-wp-avatar img", $selectedActivity).show();
                    $(".bz-wp-avatar  span.ui-bizagi-user-initials", $selectedActivity).hide();
                    $(".bz-wp-avatar img", $selectedActivity).attr("src", base64Prefix + response[0].picture);
                }
            });
        }
    }

});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.activities", ["workportalFacade", "dataService", "notifier", "bizagi.workportal.services.behaviors.orderActivitiesByTransitions", bizagi.workportal.widgets.project.plan.activities], true);
