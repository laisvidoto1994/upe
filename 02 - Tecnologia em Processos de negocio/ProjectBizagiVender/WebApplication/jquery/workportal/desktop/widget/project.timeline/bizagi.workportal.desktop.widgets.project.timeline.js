/*
 *   Name: Bizagi Workportal Desktop Project Timeline Controller
 *   Author: Diego Parra
 */

bizagi.workportal.widgets.project.base.extend("bizagi.workportal.widgets.project.timeline", {}, {
    /*
     *   Constructor
     */
    init: function(workportalFacade, dataService, notifier, params) {

        var self = this;

        //Call base
        self._super(workportalFacade, dataService, params);

        //Create hashtables to hold user names and pictures
        self.usersByName = {};
        self.userPictures = {};

        // Create a slot to hold timeline data and avoid going to server after filtering
        self.timelineData = null;

        self.auxNoRepeatTypesUser = {};
        self.hashTypesUser = {
            "assigned": bizagi.localization.getResource("workportal-project-user-assigned"),
            "owner": bizagi.localization.getResource("workportal-project-user-owner")
        };

        //Load templates
        self.loadTemplates({
            "project-timeline-markup": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.timeline").concat("#project-timeline-markup"),
            "project-timeline-empty-process": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.timeline").concat("#project-timeline-empty-process"),
            "project-timeline-single-process": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.timeline").concat("#project-timeline-single-process"),
            "project-timeline-activity-assignee": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.timeline").concat("#project-timeline-activity-assignee"),
            "project-timeline-activity-assignees-popup": bizagi.getTemplate("bizagi.workportal.desktop.widget.project.timeline").concat("#project-timeline-activity-assignees-popup"),
            "relatedUserTooltip": bizagi.getTemplate("bizagi.workportal.services.relatedusers").concat("#related-user-tooltip")
        });

    },

    /*
     * Renders the template defined in the widget
     */
    renderContent: function() {
        var self = this;
        var template = self.getTemplate("project-timeline-markup");

        // Define initial filters
        self.viewProcesses = false;
        self.viewActivities = true;

        var content = self.content = template.render({ viewProcesses: self.viewProcesses, viewActivities: self.viewActivities});
        var container = $("#bz-project-timeline-activities", self.content);

        // Draw activities
        self.renderActivities(container);

        // Search option handlers
        $(".bz-project-timeline-search .bz-icon-search", content).on("click", function () {
            var textToSearch = $(".bz-project-timeline-search input", content).val();
            self.filterActivities(container, textToSearch);
        });

        $(".bz-project-timeline-search input", content).change(function () {
            var textToSearch = $(".bz-project-timeline-search input", content).val();
            self.filterActivities(container, textToSearch);
        }).keypress(function(e){
            // keypress event ensures enter key to action the below implementation on IE browser.
            if(bizagi.util.isIE() && ((e.keyCode || e.which)  == 13) ){
                var textToSearch = $(".bz-project-timeline-search input", content).val();
                self.filterActivities(container, textToSearch);
            }
        });

        return self.content;
    },

    renderActivities: function (container) {
        var self = this;
        var content = self.getContent();
        container.empty();

        // Define helper functions
        var helper = {
            getFormattedDate: self.getFormattedDate,
            getFormattedTime: self.getFormattedTime,
            getPastEvents: self.getPastEvents,
            getCurrentEvents: self.getCurrentEvents,
            canShowActivity: $.proxy(self, 'canShowActivity'),
            canShowGraphicQuery: $.proxy(self, 'canShowGraphicQuery'),
            canShowStateLog: $.proxy(self, 'canShowStateLog')
        };

        // Draw timeline
        $.when(self.getRadNumber(self.radNumber)).done(function(radNumber){
            $.when(self.getTimelineData(radNumber))
                .done(function (data) {


                    if (data.events.length > 0) {
                        var template = self.getTemplate("project-timeline-single-process");
                        container.append(template.render($.extend(data, {security: bizagi.menuSecurity}), helper));

                        // Add handlers
                        $(".bz-project-timeline-type-activity .bz-project-timeline-content h2, .bz-project-timeline-type-event .bz-project-timeline-content h2", container).on("click", function () {
                            var idCase = $(this).closest(".bz-project-timeline-content").data("case");
                            self.showGlobalForm(idCase);
                        });

                        $(".bz-project-timeline-content .bz-show-diagrams", container).on("click", function () {
                            var idCase = $(this).closest(".bz-project-timeline-content").data("case");
                            var idWorkflow = $(this).closest(".bz-project-timeline-content").data("workflow");
                            self.showDiagrams(idWorkflow, idCase);
                        });

                        $(".bz-project-timeline-content .bz-show-log", container).on("click", function () {
                            var idCase = $(this).closest(".bz-project-timeline-content").data("case");
                            self.showLog(idCase);
                        });

                        // Add animation
                        $("#bz-project-timeline-content", content).addClass("bz-project-timeline-content-bounce");

                        // Render assignees
                        self.renderAssignees(container);

                    } else {
                        var template = self.getTemplate("project-timeline-empty-process");
                        container.append(template.render($.extend(data, {security: bizagi.menuSecurity}), helper));
                        // Show content
                        $(".bz-project-timeline-search", content).css("display", "none");
                        $("#bz-project-timeline-content", content).css("visibility", "visible");

                    }



                });
        });
    },

    /**
     * Get idCase by if case is contextualized or not
     * @param value
     * @returns {*}
     */
    getIdCase: function(value){
        var self = this,
            defer = $.Deferred();
        if(bizagi.util.isGUID(value)){
            $.when(self.dataService.getCaseByPlan({idPlan: value})).done(function(response){
                defer.resolve(response.id);
            });
        }
        else{
            defer.resolve(self.params.idCase);
        }
        return defer.promise();
    },

    /**
     * Get Rad Number. Validate if is contextualized activity
     * @param value
     * @returns {*}
     */
    getRadNumber: function(value){
        var self = this,
            defer = $.Deferred();

        if(typeof value === "undefined"){
            value = self.params.plan.id;
        }

        if(bizagi.util.isGUID(value)){
            value = self.params.plan.id;
            $.when(self.dataService.getCaseByPlan({idPlan: value})).done(function(response){
                defer.resolve("IDCASE_" + response.id);
            });
        }
        else{
            defer.resolve("RADNUMBER_" + value);
        }
        return defer.promise();
    },

    showGlobalForm: function (idCase) {
        var dialog = bizagi.injector.get("dialogWidgets");
        var data = {
            closeVisible: true,
            modalParameters: {
                title: bizagi.localization.getResource("workportal-project-casedashboard-overview"),
                refreshInbox: false
            },
            idCase: idCase
        };
        data.widgetInstance = bizagi.injector.get("bizagi.workportal.widgets.project.overview", data);
        data.widgetInstance.sub("closeDialog", function (ev, data) {
            dialog.close();
            defer.resolve(data);
        });

        dialog.renderWidget(data);
    },

    showDiagrams: function (idWorkflow, idCase) {
        var self = this;
        var dialog = bizagi.injector.get("dialogWidgets");
        var data = {
            closeVisible: true,
            modalParameters: {
                title: bizagi.localization.getResource("workportal-project-casedashboard-timeline-diagram-popup-title"),
                refreshInbox: false
            },
            idWorkflow: idWorkflow,
            idCase: idCase,
            plan: self.params.plan,
            showProcessDiagram: true,
            showActivityMap: false,
            showProcessMap: false
        };
        data.widgetInstance = bizagi.injector.getNewInstance("bizagi.workportal.widgets.project.processMap", data);
        data.widgetInstance.sub("closeDialog", function (ev, params) {
            dialog.close();
            defer.resolve(params);
        });

        dialog.renderWidget(data);
    },

    showLog: function (idCase) {
        var dialog = bizagi.injector.get("dialogWidgets");
        var data = {
            closeVisible: true,
            modalParameters: {
                title: bizagi.localization.getResource("workportal-project-casedashboard-history"),
                refreshInbox: false
            },
            idCase: idCase
        };
        data.widgetInstance = bizagi.injector.get("bizagi.workportal.widgets.activity.log", data);
        data.widgetInstance.sub("closeDialog", function (ev, data) {
            dialog.close();
            defer.resolve(data);
        });

        dialog.renderWidget(data);
    },

    renderAssignees: function (container) {
        var self = this;
        var assignees = {};
        $.each($(".bz-assignee", container), function (i, item) {
            var assignee = $(item).data("assignee");
            assignees[assignee] = assignee;
        });

        // Render assignee pictures
        self.renderAssigneePictures(Object.keys(assignees), container);

        // Add handler for on-demand assignees
        $(".bz-more-assignees", container).on("mouseover", function () {
            self.popupAssignees($(this));
        });
    },

    popupAssignees: function(element) {
        var self = this;
        var popupTemplate = self.getTemplate("project-timeline-activity-assignees-popup");
        var idWorkitem = element.closest(".bz-project-timeline-content").data("workitem");
        if (self.assigneesPopupShown) return;

        $.when(self.dataService.getAssignees(idWorkitem))
        .done(function (userList) {
            // Create popup
            var popup = popupTemplate.render({ assignees: userList });
            popup.appendTo("body");
            popup.position({
                my: "left center",
                at: "right+25 center-12",
                of: element,
                collision: "fit flip"
            });

            // Render assignee pictures
            self.renderAssigneePictures(userList, popup);

            // Define handler to close the item
            self.assigneesPopupShown = true;

            // Capture all click elements inside the popup
            popup.click(function (e) { e.stopPropagation(); });

            $(element).on("mouseout", function () {
                popup.detach();
                self.assigneesPopupShown = false;
            });

        });
    },

    renderAssigneePictures: function (users, container) {
        var self = this;
        var assigneeTemplate = self.getTemplate("project-timeline-activity-assignee");
        var helper = {
            getInitials: function (name) { return name.getInitials(); }
        };

        // Check in hash first
        var allUsersInCache = true;
        var cachedKeys = $.map(self.userPictures, function (user) { return user.id; });
        $.each(users, function (i, user) { if ($.inArray(Number(user), cachedKeys) === -1) allUsersInCache = false; });

        // Go for cache if everything is there
        if (allUsersInCache) {
            $.each(users, function(i, user) {
                $(".bz-assignee[data-assignee=" + user + "]", container).append(assigneeTemplate.render(self.userPictures[user], helper));
            });
            return;
        }

        // Draw assignee pictures
        $.when(self.dataService.getAssigneePicture(users))
        .done(function (data) {
            $.each(data, function (i, item) {
                $(".bz-assignee[data-assignee=" + item.id + "]", container).append(assigneeTemplate.render(item, helper));
                self.usersByName[item.name] = item.id;
                self.userPictures[item.id] = item;
            });
            self.addEventHandlersTooltip(data, container);
        });
    },

    //Add event handler for tooltip
    addEventHandlersTooltip: function(data, container){
        var self = this;
        var typesToAssignUsers = [];

        
        $.when(self.getIdCase(self.radNumber)).done(function (idCase) {
            self.dataService.getCaseSummary({ idCase: idCase }).done(function (summary) {
                typesToAssignUsers = [{
                    id: summary.createdBy.userId,
                    typeName: "owner"
                }];

                self.dataService.getCaseAssignees({ idCase: idCase }).done(function (dataAssignedUser) {
                    var csvUserIds = self.getCSVUserIds(dataAssignedUser.assignees, typesToAssignUsers);
                    $.when(self.getUsersData(csvUserIds)).done(function (rawData) {
                        var preparedData = self.prepareData(rawData, typesToAssignUsers, dataAssignedUser);

                        $(container).tooltip({
                            items: ".bz-assignee",
                            content: function () {
                                var userId = $(this).data("assignee");
                                var userSelected = preparedData.filter(function (user) {
                                    return user.id === userId;
                                })[0];

                                return self.getTemplate("relatedUserTooltip").render(userSelected);
                            }
                        })
                    });
                });
            });            
        });        
    },

    
    /**
     *
     * @param assignees
     * @param typesToAssignUsers
     * @returns {*}
     */
    getCSVUserIds: function(assignees, typesToAssignUsers){
        var arrayIdsUsers = $.map(assignees, function (itemUser) {
            return itemUser.idUser;
        });
        arrayIdsUsers.unshift(typesToAssignUsers[0].id);
        return arrayIdsUsers.join(",");
    },

    /**
    * Get data users with service
    */
    getUsersData: function (csvUserIds) {
        var self = this;
        var defer = $.Deferred();
        var params = {
            userIds: csvUserIds,
            width: 50,
            height: 50
        };

        self.dataService.getUsersData(params).done(function (response) {
            defer.resolve(response);
        }).fail(function(){
            defer.resolve([]);
        });

        return defer.promise();
    },

    /**
    *
    * @param typesToAssignUsers
    * @param dataAssignedUser
    */
    mergeTypesToAssignUsers: function (typesToAssignUsers, dataAssignedUser) {
        var self = this;
        for (var i = 0, totalDataAssigned = dataAssignedUser.assignees.length; i < totalDataAssigned; i++) {
            //Using the hash, validate no repeat elements on typesToAssignUsers
            var temp = self.auxNoRepeatTypesUser[dataAssignedUser.assignees[i].idUser.toString() + "assigned"];
            if (typeof temp === "undefined") {
                self.auxNoRepeatTypesUser[dataAssignedUser.assignees[i].idUser.toString() + "assigned"] = "";
                typesToAssignUsers.push({
                    id: dataAssignedUser.assignees[i].idUser || -1,
                    typeName: "assigned"
                });
            }
        }
    },

    prepareData: function (rawUsersData, typesToAssignUsers, dataAssignedUser) {
        var self = this;
        var dataProcessed = [];
        if (rawUsersData) {
            self.mergeTypesToAssignUsers(typesToAssignUsers, dataAssignedUser);
            for (var i = 0, j = rawUsersData.length; i < j; i++) {
                var user = self.prepareDataUser(rawUsersData[i], typesToAssignUsers, dataAssignedUser);
                dataProcessed.push(user);
            }
        }
        return dataProcessed;
    },

    /**
    * Prepare data by user
    */
    prepareDataUser: function (rawDataUser, typesToAssignUsers, dataAssignedUsers) {
        var self = this;
        var id = rawDataUser.id;
        var user = {
            id: id,
            name: rawDataUser.name,
            initials: rawDataUser.name.getInitials(),
            picture: (rawDataUser.picture) ? "data:image/png;base64," + rawDataUser.picture : undefined,
            types: self.assignUserTypes(id.toString(), typesToAssignUsers),
            tasks: self.getTasksUser(dataAssignedUsers, id.toString())
        };

        user.typesString = $.map(user.types, function(type) {
            return self.hashTypesUser[type];
        }).join(",");

        return user;
    },

    /**
    *
    * @param dataAssignedUsers
    * @param idUser
    * @returns {Array}
    */
    getTasksUser: function(dataAssignedUsers, idUser){
        var tasks = [];
        var dataAssignedUser = dataAssignedUsers.assignees.filter(function(user){
            return user.idUser.toString() === idUser;
        });

        for (var i = 0, total = dataAssignedUser.length; i < total; i += 1) {
            tasks.push({
                taskType: bizagi.util.parseBoolean(dataAssignedUser[i].isEvent) ? bizagi.localization.getResource("workportal-project-user-event"): bizagi.localization.getResource("workportal-project-user-task"),
                taskName: dataAssignedUser[i].taskName
            });
        }
        return tasks;
    },

    /**
     *
     * @param userId
     * @param typesToAssignUsers
     * @returns {Array}
     */
    assignUserTypes: function(userId, typesToAssignUsers){
        var typesUser = [];

        for (var i = 0, totalTypeUser = typesToAssignUsers.length;i < totalTypeUser; i += 1){
            if (userId === typesToAssignUsers[i].id.toString()) {
                typesUser.push(typesToAssignUsers[i].typeName);
            }
        }

        return typesUser;
    },

    filterActivities: function (container, textToSearch) {
        var self = this;
        self.filter = textToSearch.trim().toLowerCase();

        // Draw activities again
        self.renderActivities(container);
    },

    getTimelineData: function(radNumber) {
        var self = this;
        if (self.timelineData) {
            return $.Deferred().resolve(self.timelineData);
        }

        return $.when(self.dataService.getTimeLineActivities(radNumber))
                .done(function(data) {
                    self.timelineData = data;
                });
    },

    /* HELPER FUNCTIONS */
    getFormattedDate: function (timestamp) {
        var dateObj = new Date(timestamp);
        var monthsNames = bizagi.localization.getResource("datePickerRegional").monthNames;
        var shortMonth = dateObj.getMonth();
        return monthsNames[shortMonth] + " " + bizagi.util.dateFormatter.formatDate(dateObj, "d yyyy");
    },
    getFormattedTime: function (timestamp) {
        var date = new Date(timestamp);
        return bizagi.util.dateFormatter.formatDate(date, "HH:mm");
    },

    getPastEvents: function(events) {
        return $.grep(events, function (event) { return event.date != null; });
    },

    getCurrentEvents: function (events) {
        return $.grep(events, function (event) { return event.date == null; });
    },

    canShowActivity: function(activity) {
        var self = this;
        if (!self.filter) return true;
        if (self.filter === "") return true;
        if (activity.displayName.toLowerCase().indexOf(self.filter) > -1) return true;

        // Filter by user name
        var filteredUsers = $.grep(Object.keys(self.usersByName), function (user) { return user.toLowerCase().indexOf(self.filter) > -1; });
        var validValues = $.map(filteredUsers, function (user) { return self.usersByName[user]; });
        if ($.inArray(activity.assignee, validValues) > -1) return true;

        return false;
    },

    canShowGraphicQuery: function() {
        var result = false;
        if(bizagi.menuSecurity.GraphicQuery){
            result = true;
        }
        return result;
    },

    canShowStateLog: function() {
        var result = false;
        if(bizagi.menuSecurity.StateLog){
            result = true;
        }
        return result;
    }
});

bizagi.injector.register("bizagi.workportal.widgets.project.timeline", ["workportalFacade", "dataService", "notifier", bizagi.workportal.widgets.project.timeline], true);
