/*
 *   Name: Bizagi Workportal Desktop descontextualized plans Manager
 *   Author: Iv�n Ricardo Taimal Narv�ez
 */

bizagi.workportal.widgets.widget.extend('bizagi.workportal.widgets.plans.manager', {}, {

    usersMap: {},
    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, actionService, notifier, planTemplateCreate, planPopupEdit, serviceOrderActivitiesByTransitions,params) {
        var self = this;
        // Call base
        self._super(workportalFacade, dataService, params);
        self.serviceOrderActivitiesByTransitions = serviceOrderActivitiesByTransitions;

        self.plans = {};
        self.editDialogBox = {};
        self.allIdUsers = [];
        self.notifier = notifier;
        self.planTemplateCreate = planTemplateCreate;
        self.planPopupEdit = planPopupEdit;

        //Load templates
        self.loadTemplates({
            'plans.manager.wrapper': bizagi.getTemplate('bizagi.workportal.desktop.widget.decontextualized.plans.manager').concat('#plans-manager-wrapper'),
            'plans.manager.empty': bizagi.getTemplate('bizagi.workportal.desktop.widget.decontextualized.plans.manager').concat('#plans-manager-empty-message'),
            'plans.manager.users': bizagi.getTemplate('bizagi.workportal.desktop.widget.decontextualized.plans.manager').concat('#plans-manager-users'),
            'plans.manager.activities.tooltip': bizagi.getTemplate('bizagi.workportal.desktop.widget.decontextualized.plans.manager').concat('#plans-manager-activities-tooltip'),
            'plans.manager.context.menu.content': bizagi.getTemplate('bizagi.workportal.desktop.widget.decontextualized.plans.manager').concat('#plans-manager-context-menu-content'),
            'plans.manager.users.tooltip': bizagi.getTemplate('bizagi.workportal.desktop.widget.decontextualized.plans.manager').concat('#plans-manager-users-tooltip')
        });
    },

    /**
     * Renders the template defined in the widget
     * @return {*|jQuery|HTMLElement}
     */
    renderContent: function () {
        var self = this;

        self.content = $('<div/>'); // self.getEmptyDataMessage().render({});
        return self.content;
    },

    /**
     * links events with handlers
     */
    postRender: function () {
        var self = this;

        self.getCalculatedDateServer();

        self.sub('PLANS-VIEW', $.proxy(self.updateView, self));

        self.planTemplateCreate.sub('planTemplateCreatedSuccess', function () {
            self.notifier.showSucessMessage(
                printf(bizagi.localization.getResource('workportal-project-plan-create-template-success'), ''));
        });
        self.planTemplateCreate.sub('planTemplateCreatedFailed', function () {
            self.notifier.showErrorMessage(
                printf(bizagi.localization.getResource('workportal-project-plan-create-template-fail'), ''));
        });

        self.planPopupEdit.sub('planEditedSuccess', function () {
            var args = {
                histName: self.params.histName,
                planState: self.params.planState,
                level: 1
            };
            self.pub('notify', {
                type: 'PLANS-VIEW',
                args: $.extend(self.params, args)
            });

            self.notifier.showSucessMessage(
                printf(bizagi.localization.getResource('workportal-project-plan-edit-success'), ''));
        });

        self.planPopupEdit.sub('planEditedFailed', function () {
            self.notifier.showErrorMessage(
                printf(bizagi.localization.getResource('workportal-project-plan-edit-fail'), ''));
        });

    },

    /**
     * Binds events to handles
     */
    configureHandlers: function () {
        var self = this,
            $content = self.getContent();
        $('.wdg-plans-manager-card', $content).on('click', $.proxy(self.onClickPlan, self));
        $('.wdg-plans-manager-card .btn-workonit', $content).on('click', function (event) {
            event.stopPropagation();
            var target = $(event.target);
            var planCard = target.closest('.wdg-plans-manager-card');
            var planId = planCard.data('plan-id');
            self.plans[planId].activities.forEach(function(activity) {
                if (self.runningActivity(activity)) {
                    self.goToWorkOnIt(activity.idCase, activity.idWorkItem);
                }
            });
        });
    },

    /**
     *
     * @param ev
     */
    onClickPlan: function (ev) {
        var self = this,
            target = $(ev.target).closest('.wdg-plans-manager-card'),
            idPlan = target.data('plan-id'),
            namePlan = target.data('plan-name');
        var plan = {
            name: namePlan,
            id: idPlan
        };
        self.showPlanDashBoard(plan);
    },

    /**
     * Show plan dashboard
     * @param plan
     */
    showPlanDashBoard: function (plan) {
        var self = this;
        var servicesPD = new bizagi.workportal.services.behaviors.projectDashboard(self.dataService);

        self.params.showContextByMenuDashboard = "PLANACTIVITIES";
        self.params.menuPlanDashboard = {};
        self.params.menuPlanDashboard.showCommentsOptionMenu =
            servicesPD.getMenuDashboardSecurity(bizagi.menuSecurity).isVisibleButtonComments;
        self.params.menuPlanDashboard.showFilesOptionMenu =
            servicesPD.getMenuDashboardSecurity(bizagi.menuSecurity).isVisibleButtonFiles;
        self.params.menuPlanDashboard.showTimeLineOptionMenu =
            servicesPD.getMenuDashboardSecurity(bizagi.menuSecurity).isVisibleButtonTimeLine;

        plan = self.plans[plan.id];
        if (plan.name.length > 28) {
            plan.name = plan.name.substring(0, 29) + "...";
        }

        if(plan.contextualized){
           delete self.params.flowContext;
        }

        $.when(servicesPD.getRadNumberForPlanDashboard(plan.id, plan.contextualized)).done(function (responseRadNumber) {
            self.params.radNumber = responseRadNumber;
            var args = {
                plan: plan,
                level: 2,
                histName: plan.name
            };
            self.pub('notify', {
                type: self.params.showContextByMenuDashboard,
                args: $.extend(self.params, args)
            });
        });
    },

    /**
     * delete plan
     * @param plan
     */
    deletePlan: function (plan) {
        var self = this;
        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource('workportal-project-plan-action-delete-confirmation'), '', 'info')).done(function () {
            var params = {
                id: plan.id
            };
            $.when(self.dataService.deletePlan(params)).always(function (response) {
                if (response.status === 200 || typeof (response.status) === "undefined") {
                    $.extend(self.params.plan, params);
                    var args = {
                        histName: self.params.histName,
                        planState: self.params.planState,
                        level: 1
                    };
                    self.pub('notify', {
                        type: 'PLANS-VIEW',
                        args: $.extend(self.params, args)
                    });
                    self.notifier.showSucessMessage(
                        printf(bizagi.localization.getResource('workportal-project-plan-delete-success'), ''));
                }
                else{
                    self.notifier.showErrorMessage(
                        printf(bizagi.localization.getResource('workportal-project-plan-delete-fail'), ''));
                }
            });
        });
    },

    /**
     * Execute plan
     * @param plan
     */
    executePlan: function (plan) {
        var self = this;
        var numberActivitiesCreated = plan.activitiesLength;
        if (numberActivitiesCreated > 0) {
            var params = {
                idPlan: plan.id
            };
            $.when(self.dataService.putExecutePlan(params)).done(function () {
                var updateParams = self.plans[plan.id];
                if (updateParams) {
                    updateParams.currentState = 'EXECUTING';
                    updateParams = $.extend(updateParams, { startDate: self.getDateServer() });
                    $.when(self.dataService.updatePlan(updateParams)).done(function () {
                        var args = {
                            histName: self.params.histName,
                            planState: self.params.planState,
                            level: 1
                        };
                        self.pub('notify', {
                            type: 'PLANS-VIEW',
                            args: $.extend(self.params, args)
                        });
                        self.notifier.showSucessMessage(
                            printf(bizagi.localization.getResource('workportal-project-plan-state-change-running'), ''));
                    });
                }
            });
        } else {
            self.notifier.showErrorMessage(
                printf(bizagi.localization.getResource('workportal-project-plan-action-execute-message-activities-required'), ''));
        }
    },

    /**
     * Close plan
     * @param plan
     */
    closePlan: function (plan) {
        var self = this;
        var updateParams = self.plans[plan.id];
        if (updateParams) {
            updateParams.currentState = 'CLOSED';
            $.when(self.dataService.closePlan({idPlan: plan.id})).done(function () {
                $.when(self.dataService.updatePlan(updateParams)).done(function () {
                    var args = {
                        histName: self.params.histName,
                        planState: self.params.planState,
                        level: 1
                    };
                    self.pub('notify', {
                        type: 'PLANS-VIEW',
                        args: $.extend(self.params, args)
                    });
                    self.notifier.showSucessMessage(
                        printf(bizagi.localization.getResource('workportal-project-plan-close-success'), ''));
                });
            }).fail(function () {
                self.notifier.showErrorMessage(
                    printf(bizagi.localization.getResource('workportal-project-plan-close-fail'), ''));
            });
        }
    },

    /**
     * Show popup for edit plan
     */
    openPopupEditTemplate: function () {
        var self = this;
        var planSelected = self.plans[self.selectedPlan.id] || {};

        self.planPopupEdit.showPopup(self.params, self.dataService, planSelected);
    },

    /**
     * Show popup for save plan as template
     */
    openPopupSaveTemplate: function () {
        var self = this;
        var planSelected = self.plans[self.selectedPlan.id] || {};

        self.planTemplateCreate.showPopupAddTemplatePlan(self.params,
            self.dataService, planSelected.contextualized, planSelected.id);

    },

    /**
     * Render content widget
     * @param event
     * @param params
     */
    updateView: function (event, params) {
        var self = this;
        self.params = params.args;
        self.getContent().empty();
        var template = self.getTemplate('plans.manager.wrapper');

        $.when(self.getData())
            .done(function (data) {
                if (data.length > 0) {
                    self.content.empty();
                    self.arrayPlans = self.processData(data);
                    self.content.append(template.render({plans: self.arrayPlans}));
                    $('.wdg-plans-row-dial', self.content).knob();
                    self.updatePlanDetails();
                    self.configureHandlers();
                    self.configureContextMenu();
                    $("#ui-bizagi-wp-project-homeportal-main").addClass("disabled-right-sidebar").removeClass("enabled-right-sidebar");
                }
                else {
                    self.content.empty();
                    self.content.append(self.getTemplate('plans.manager.empty').render());
                }
            });
    },

    /**
     *
     * @param activities
     * @param transitions
     */
    orderActivitiesByTransitions: function(activities, transitions){
        var self = this;
        return self.serviceOrderActivitiesByTransitions.
        getActivitiesByTransitions(activities, transitions);
    },

    /**
     * Process data for render widget
     * @param data
     * @returns {*}
     */
    processData: function (data) {
        var self = this;
        var length = data.length;
        for (var i = 0; i < length; i += 1) {
            self.plans[data[i].id] = data[i];
            var fromDate = data[i].startDate || data[i].creationDate;
            var toDate = data[i].dueDate;

            if (fromDate) {
                fromDate = new Date(fromDate);
                data[i].fromDate = bizagi.util.dateFormatter.getRelativeTime(fromDate, null, false);
            }

            if (toDate) {
                toDate = new Date(toDate);
                data[i].toDate = bizagi.util.dateFormatter.getRelativeTime(toDate, null, false);
            }

            data[i].value = 0;
            data[i].completedActivities = 0;
            data[i].activitiesLength = 0;
            if(data[i].dueDate){
                data[i].dueDateFormat = self.getFormattedDate(new Date(data[i].dueDate));
            }

            data[i].locatedState = bizagi.localization.getResource("workportal-project-plan-state-" + data[i].currentState.toLowerCase());
        }

        return data;
    },

    /**
     * Update sections details plans
     */
    updatePlanDetails: function () {
        var self = this,
            idsUsers = [],
            deferreds = [];

        for (var i = 0; i < self.arrayPlans.length; i += 1) {
            idsUsers.push(self.arrayPlans[i].idUserCreator);
            var def = self.getMetaData(self.arrayPlans[i].id);

            $.when(def, self.arrayPlans[i].id)
                .done(function (activities, idCurrentPlan) {
                    self.plans[idCurrentPlan].activities = activities;
                    self.paintPlanDetails(activities, idCurrentPlan);
                    self.configureActivitiesTooltip(activities, idCurrentPlan);
                });
            deferreds.push(def);
        }

        $.when.apply($, deferreds).then(function () {
            $.equalizeHeights(".wdg-plans-manager-card");
            self.getUsers(self.allIdUsers);
        });
    },

    /**
     * Render plan details
     * @param activities
     * @param idCurrentPlan
     */
    paintPlanDetails: function (activities, idCurrentPlan) {
        var self = this;
        var activitiesLength = activities.length,
            completedActivities = 0,
            progressPlan = 0,
            currentActivities = [],
            planUsersId = [],
            planUsers = [],
            template = self.getTemplate('plans.manager.users');
        self.plans[idCurrentPlan].users = {};
        var lastUpdateToCalculatedClosed = self.plans[idCurrentPlan].startDate || self.plans[idCurrentPlan].creationDate;

        var $currentCard = $('[data-plan-id="' + self.plans[idCurrentPlan].id + '"]', self.content);
        if (activitiesLength > 0) {
            for (var i = 0; i < activitiesLength; i += 1) {

                var auxLastDate = (activities[i].finishDate || activities[i].startDate);
                lastUpdateToCalculatedClosed = lastUpdateToCalculatedClosed < auxLastDate ? auxLastDate : lastUpdateToCalculatedClosed;

                if (activities[i].workItemState === 'Completed') {
                    completedActivities += 1;
                    activities[i].progress = 100;
                }
                if (self.runningActivity(activities[i])) {
                    currentActivities.push(activities[i].name);
                    activities[i].progress = 0;
                }
                if (planUsersId.indexOf(activities[i].userAssigned) < 0) {
                    self.plans[idCurrentPlan].users[activities[i].userAssigned] = [activities[i]];
                    planUsersId.push(activities[i].userAssigned);
                }
                else {
                    self.plans[idCurrentPlan].users[activities[i].userAssigned].push(activities[i]);
                }
                if (self.allIdUsers.indexOf(activities[i].userAssigned) < 0) {
                    self.allIdUsers.push(activities[i].userAssigned);
                }
                progressPlan += activities[i].progress;
            }

            for (var j = 0; j < planUsersId.length; j += 1) {
                if (!self.usersMap[planUsersId[j]]) {
                    planUsers.push({
                        userAssigned: planUsersId[j],
                        picture: ''
                    });
                }
                else {
                    planUsers.push(self.usersMap[planUsersId[j]]);
                }
            }

            progressPlan = Math.round(progressPlan / activitiesLength);

            $currentCard.find('.wdg-plans-row-completed').html(completedActivities);
            $currentCard.find('.wdg-plans-row-activities-length').html(activitiesLength);
            $currentCard.find('.wdg-plans-row-dial').val(progressPlan).trigger('change');
            $currentCard.find('.wdg-plans-users').html(template.render({users: planUsers}));

            if(self.getVisibleButtonWorkonit(self.plans[idCurrentPlan], progressPlan, currentActivities)){
                $currentCard.find('.wdg-plans-row-activities').html(currentActivities.join(','));
                $currentCard.find('.wdg-plans-workonit-row').show();
            }
            else{
                $currentCard.find('.wdg-plans-activities-row').hide();
                $currentCard.find('.wdg-plans-workonit-row').hide();
            }
        }

        var nameFirstDate;
        var firstDate;
        if(self.plans[idCurrentPlan].currentState === "PENDING"){
            nameFirstDate = bizagi.localization.getResource("workportal-general-properties-last-update");
            firstDate = self.plans[idCurrentPlan].creationDate;
        }
        else if(self.plans[idCurrentPlan].currentState === "EXECUTING"){
            nameFirstDate = bizagi.localization.getResource("workportal-general-properties-start-date");
            firstDate = self.plans[idCurrentPlan].startDate;
        }
        else if(self.plans[idCurrentPlan].currentState === "CLOSED"){
            nameFirstDate = bizagi.localization.getResource("workportal-general-properties-closed-date");
            firstDate = lastUpdateToCalculatedClosed;
        }

        var formatFirstDate = self.getFormattedDate(new Date(firstDate));
        $currentCard.find('.first-date-plan').html(nameFirstDate + ": " + formatFirstDate);
    },

    getResource: function (key) {
        return bizagi.localization.getResource(key);
    },

    getFormattedDate: function(dateObject){
        var self = this;
        var dateFormat = self.getResource("dateFormat");
        var dateInvariant = bizagi.util.dateFormatter.formatInvariant(dateObject, false);
        var content = $("<span class='formatDate'>" + dateInvariant + "</span>");
        bizagi.util.formatInvariantDate(content, dateFormat);
        return content.text();
    },

    /**
     * Get visible property of the button work on it
     * @param plan
     * @param planProgress
     * @returns {boolean}
     * @param currentActiveActivities
     */
    getVisibleButtonWorkonit: function(plan, planProgress, currentActiveActivities){
        var responseVisibility = false;
        if(plan.currentState === "EXECUTING" && planProgress < 100 && currentActiveActivities.length > 0){
            responseVisibility = true;
        }
        return responseVisibility;
    },

    /**
     * Go to Workitem
     * @param idCase
     * @param idWorkItem
     */
    goToWorkOnIt: function(idCase, idWorkItem){
        var self = this;
        self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: idCase,
            idWorkItem: idWorkItem
        });
    },

    /**
     *
     * @param activities
     * @param idCurrentPlan
     */
    configureActivitiesTooltip: function (activities, idCurrentPlan) {
        var self = this;
        var toolTiptemplate = self.getTemplate('plans.manager.activities.tooltip');
        var currentPlanCard = $('[data-plan-id="' + idCurrentPlan + '"]', self.content);
        currentPlanCard.find('.wdg-plans-activities-row').tooltip({
            content: function () {
                var $elementsTmpl = $();
                activities.forEach(function (activity) {
                    if (self.runningActivity(activity)) {
                        var estimatedFinishDate = (activity.estimatedFinishDate) ? new Date(activity.estimatedFinishDate) : null;
                        if (self.usersMap[activity.userAssigned]) {
                            activity.userName = self.usersMap[activity.userAssigned].name;
                            activity.userPicture = self.usersMap[activity.userAssigned].picture;
                            activity.formatedEstimatedFinishDate = (estimatedFinishDate) ? bizagi.util.dateFormatter.formatDate(estimatedFinishDate, bizagi.localization.getResource("dateFormat")) : null;
                        }
                        var activityItem = toolTiptemplate.render({activity: activity});
                        $elementsTmpl.push.apply($elementsTmpl, activityItem);
                    }
                });
                return $elementsTmpl;
            }
        });
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

    /**
     * User tooltip
     */
    configureUserTooltip: function () {
        var self = this;
        var $content = self.getContent();
        var tooltipTemplate = self.getTemplate('plans.manager.users.tooltip');
        $('.wdg-plans-users li', $content).not('.icon-more').tooltip({
            content: function () {
                var idUser = $(this).data("iduser");
                var idPLan = $(this).closest('.wdg-plans-manager-card').data("plan-id");
                var avatar = $(this).clone(false);
                var activities = self.plans[idPLan].users[idUser];
                var userDetails = {userName: self.usersMap[idUser].name, activities: activities};
                var tooltipContent = tooltipTemplate.render(userDetails);
                $(".wdg-plans-tooltip-user-avatar", tooltipContent).html($("<ul>").append(avatar));
                return tooltipContent;
            }
        });

    },

    /**
     * Get data users
     * @param lstUsers
     */
    getUsers: function (lstUsers) {
        var self = this;
        var lstCurrentUsers = [];
        var length = lstUsers.length;
        for (var i = 0; i < length; i += 1) {
            if (!self.usersMap[lstUsers[i]]) {
                lstCurrentUsers.push(lstUsers[i]);
            }
        }
        if (lstCurrentUsers.length > 0) {
            var params = {
                userIds: lstUsers.join(),
                width: 32,
                height: 32
            };
            $.when(self.dataService.getUsersData(params)).done(function (users) {
                var length = users.length;
                for (var i = 0; i < length; i += 1) {
                    self.usersMap[users[i].id] = {
                        picture: (users[i].picture) ? 'data:image/png;base64,' + users[i].picture : '',
                        name: users[i].name || '',
                        userAssigned: users[i].id
                    };
                    self.configureAvatar(users[i].id);
                }
                self.configureUserTooltip();
            });
        } else {
            for (var k = 0; k < lstUsers.length; k += 1) {
                self.configureAvatar(lstUsers[k]);
            }
            self.configureUserTooltip();
        }
    },

    /**
     *
     * @param idUser
     */
    configureAvatar: function (idUser) {
        var self = this;
        var $avatar = $('[data-iduser="' + idUser + '"]', self.content);
        if (self.usersMap[idUser].picture) {
            $avatar.find('.bz-wp-avatar-img').attr('src', self.usersMap[idUser].picture);
        }
        else {
            $avatar.find('.bz-wp-avatar-img').hide();
            $avatar.find('.wdg-plans-row-user-label').html(self.usersMap[idUser].name.getInitials()).show();
        }
    },

    /**
     * Configure context menu by plan
     */
    configureContextMenu: function () {
        var self = this;
        var $content = self.getContent();
        var menuTemplate = self.getTemplate('plans.manager.context.menu.content');
        $('.wdg-plans-leftmenu', $content).on('click', function (event) {
            event.stopPropagation();
            var target = $(event.target);
            var planCard = target.closest('.wdg-plans-manager-card');
            var planId = planCard.data('plan-id');
            var planName = planCard.data('plan-name');
            var planCurrentState = planCard.data('plan-current-state');
            var planActivitiesLength = parseInt(planCard.find('.wdg-plans-row-activities-length').html(), 0);
            var completedActivities = parseInt(planCard.find('.wdg-plans-row-completed').html(), 0);
            var pendingActivities = (isNaN(planActivitiesLength) || isNaN(completedActivities)) ? 0 : planActivitiesLength - completedActivities;
            self.selectedPlan = {
                id: planId,
                name: planName,
                activitiesLength: isNaN(planActivitiesLength) ? 0 : planActivitiesLength,
                completed: (pendingActivities <= 0)
            };
            var contextMenuContent = menuTemplate.render({
                currentState: planCurrentState,
                completed: self.selectedPlan.completed
            });
            $('.plans-manager-context-menu-wrapper', $content).append(contextMenuContent);
            contextMenuContent.menu();
            self.configureMenuHandlers(contextMenuContent);

            contextMenuContent.position({
                my: 'left top',
                at: 'left bottom',
                of: target,
                collision: 'fit'
            });
            contextMenuContent.show();
            $(document).one('click', function () {
                contextMenuContent.remove();
            });
            $('.wdg-plans-manager-card').one('click', function () {
                contextMenuContent.remove();
            });
            $('.wdg-plans-leftmenu').one('click', function () {
                contextMenuContent.remove();
            });
            // return false;
        });
    },

    /**
     * Events on contextual menu by plan
     * @param contextMenuContent
     */
    configureMenuHandlers: function (contextMenuContent) {
        var self = this;
        $('#edit', contextMenuContent).on('click', function (event) {
            event.stopPropagation();
            self.openPopupEditTemplate(self.selectedPlan);
        });
        $('#save', contextMenuContent).on('click', function (event) {
            event.stopPropagation();
            self.openPopupSaveTemplate(self.selectedPlan);
        });
        $('#enable', contextMenuContent).on('click', function (event) {
            event.stopPropagation();
            self.executePlan(self.selectedPlan);
        });
        $('#delete', contextMenuContent).on('click', function (event) {
            event.stopPropagation();
            self.deletePlan(self.selectedPlan);
        });
        $('#close', contextMenuContent).on('click', function (event) {
            event.stopPropagation();
            self.closePlan(self.selectedPlan);
        });
    },


    /**
     * Get activities and workitems and merge
     * @param idPlan
     * @returns {*}
     */
    getMetaData: function (idPlan) {
        var self = this;
        var defer = $.Deferred();
        var paramsActivities = {idPlan: idPlan};
        var paramsWorkItems = {idPlan: idPlan};
        var paramsTransition = {idPlan: idPlan};
        $.when(self.dataService.getActivities(paramsActivities),
            self.dataService.getWorkitemsPlan(paramsWorkItems),
            self.dataService.getTransitionsByPlan(paramsTransition)).done(
            function (responseActivities, responseWorkitems, responseTransitions) {
                var activities = responseActivities || [];
                activities = self.orderActivitiesByTransitions( responseActivities, responseTransitions );
                self.mergePropertiesActivitiesWithWorkitems(activities, responseWorkitems);
                defer.resolve(activities);
            });
        return defer.promise();

    },
    /**
     * Calculated date server
     * @returns {*}
     */
    getCalculatedDateServer: function(){
        var self = this;
        return $.when(self.dataService.getCurrentTimeDateServer()).done(function (response) {
            self.differenceMillisecondsServer = bizagi.util.dateFormatter.getDifferenceBetweenDates(new Date(), new Date(response.date), "milliseconds");
        });
    },

    /**
     *
     * Return date server
     * @return {*}
     */
    getDateServer: function () {
        var dateLocal = new Date();
        return dateLocal.getTime() + this.differenceMillisecondsServer;
    },


    /**
     * @return {object} data
     */
    getData: function () {
        var self = this;
        var $args = {};
        if (self.params.planState !== 'all') {
            $args.currentState = self.params.planState;
        }
        return self.dataService.getUserPlans($args);
    },

    /**
     * Gets Message when there aren't data
     * @returns {templateEmptyData}
     */
    getEmptyDataMessage: function () {
        var self = this;
        return  self.getTemplate('plans.manager.empty');
    },

    mergePropertiesActivitiesWithWorkitems: function (activities, workItems) {
        activities.forEach(function (activity) {
            var workItemFilter = workItems.filter(function (workItem) {
                return workItem.guidActivity == activity.id;
            });
            if (workItemFilter.length > 0) {
                $.extend(activity, {
                    startDate: workItemFilter[0].wiEntryDate || null,
                    finishDate: workItemFilter[0].wiSolutionDate || null,
                    idWorkItem: workItemFilter[0].idWorkItem,
                    workItemState: workItemFilter[0].workItemState,
                    idCase: workItemFilter[0].idCase,
                    estimatedFinishDate: workItemFilter[0].wiEstimatedSolutionDate || activity.estimatedFinishDate
                });
            }
        });
    },

    /**
     * Detach events
     */
    clean: function () {
        var self = this;
        self.params = {};
        self.unsub('PLANS-VIEW', $.proxy(self.updateView, self));
        self.planTemplateCreate.unsub('planTemplateCreatedSuccess');
        self.planTemplateCreate.unsub('planTemplateCreatedFailed');
        self.planPopupEdit.unsub('planEditedSuccess');
        self.planPopupEdit.unsub('planEditedFailed');
    }
});

bizagi.injector.register('bizagi.workportal.widgets.plans.manager', ['workportalFacade', 'dataService', 'actionService', 'notifier',
    'bizagi.workportal.widgets.project.plan.template.create',
    'bizagi.workportal.widgets.project.plan.edit',
    'bizagi.workportal.services.behaviors.orderActivitiesByTransitions',
    bizagi.workportal.widgets.plans.manager]);