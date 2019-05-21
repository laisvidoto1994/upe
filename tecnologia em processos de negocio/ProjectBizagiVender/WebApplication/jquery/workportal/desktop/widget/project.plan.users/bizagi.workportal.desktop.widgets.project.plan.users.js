/*
 *   Name: Bizagi Workportal Desktop Project Plan Users
 *   Author: Elkin Fernando Siabato Cruz
 */

bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.project.plan.users", {}, {

    /*
     *   Constructor
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;
        self.usersMap = {};
        self.plugins = {};

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "plan-users-main": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.users").concat("#project-plan-users"),
            "plan-users-tooltip": bizagi.getTemplate("bizagi.workportal.desktop.project.plan.users").concat("#project-plan-users-tooltip")
        });
    },

    renderContent: function () {

        var self = this;
        var tmpl = self.getTemplate("plan-users-main");

        self.content = tmpl.render({});

        return self.content;
    },

    postRender: function () {
        var self = this;
        self.sub("LOAD_INFO_ACTIVITIES_PLAN", $.proxy(self.onNotifyLoadInfoSummaryPlan, self));
    },

    /**
     * Notifies when an event is raised
     */
    onNotifyLoadInfoSummaryPlan: function (event, params) {
        var self = this,
            args = params.args,
            cvsIdUsers = [],
            activitiesUsers = [],
            $content = self.getContent().empty();
        var ownerUserId = bizagi.currentUser.idUser;
        self.params = $.extend(self.params, params.args);

        activitiesUsers.push({"idUser": ownerUserId, "userType": ["owner"]});
        self.usersMap["-" + ownerUserId + "-"] = {
            picture: "",
            id: ownerUserId,
            name: "",
            userType: ["owner"]
        };
        cvsIdUsers.push(ownerUserId);
        $.each(self.params.plan.activities, function (index, activity) {
            var userId = parseInt(activity.userAssigned, 0);
            if (userId === ownerUserId) {
                if($.inArray("Assigned", activitiesUsers[0].userType) === -1){
                    activitiesUsers[0].userType.push("Assigned");
                    self.usersMap["-" + ownerUserId + "-"].userType.push("Assigned");
                }
            }
            else {
                self.usersMap["-" + userId + "-"] = {
                    picture: "",
                    id: userId,
                    name: "",
                    userType: ["Assigned"]
                };
                if (activitiesUsers.filter(function(user) { return user.idUser == userId; }).length === 0) {
                    activitiesUsers.push({"idUser": userId, "userType": ["Assigned"]});
                    cvsIdUsers.push(userId);
                }
            }
        });

        self.params = args;
        //Update widget
        var contentTemplate = self.getTemplate("plan-users-main");
        contentTemplate
            .render({
                owner: activitiesUsers[0],
                assignee: activitiesUsers.slice(1),
                label: bizagi.localization.getResource("workportal-project-plan-assignee")
            })
            .appendTo($content);
        self.plugins.tooltip = self.initilizeTooltip();
        $.when(self.callGetDataUsers(cvsIdUsers)).then(function () {
            self.renderUserProfilesAndImages();
        });
    },


    /**
     * UI
     */
    renderUserProfilesAndImages: function () {
        var self = this;
        $.each(self.usersMap, function (i, obj) {
            var $li = $(".ui-bizagi-wp-userlist li[data-iduser=" + obj.id + "]", self.content);

            if (obj.picture !== "") {
                $li.find("img").prop("src", obj.picture);
                $(".bz-wp-avatar-label", $li).hide();
            }
            else {
                if(obj.name){
                    $(".bz-wp-avatar-img", $li).hide();
                    $(".bz-wp-avatar-label", $li).html(obj.name.getInitials());
                }
                else{
                    console.log("obj.name is undefined");
                }

            }
        });
    },

    /*
     *  Get data for users
     */
    callGetDataUsers: function (cvsIdUsers) {
        var self = this,
            params = {},
            defer = $.Deferred();
        params = {
            userIds: cvsIdUsers.join(),
            width: 50,
            height: 50
        };
        $.when(self.dataService.getUsersData(params)).always(function (response) {
            for (var i = 0, length = response.length; i < length; i += 1) {
                if (typeof (response[i].name) === "undefined") {
                    bizagi.log(response[i] + " Id Not Found", response, "error");
                } else {
                    if(self.usersMap["-" + response[i].id + "-"]){
                        self.usersMap["-" + response[i].id + "-"].picture += (response[i].picture) ? "data:image/png;base64," + response[i].picture : "";
                        self.usersMap["-" + response[i].id + "-"].name = response[i].name || "";
                    }
                    else{
                        console.log("self.usersMap['-' + response[i].id + '-'] is undefined")
                    }

                }
            }
            defer.resolve();
        });
        return defer.promise();
    },

    /*
     *  Tooltips
     */
    initilizeTooltip: function () {
        var self = this;

        return $(".ui-bizagi-wp-userlist", self.content).kendoTooltip({
            filter: "li[data-iduser]",
            content: $.proxy(self.renderUserTooltip, self),
            showOn: "mouseenter"
        }).data("kendoTooltip");
    },

    renderUserTooltip: function (event) {

        var self = this;
        var tmpl = self.getTemplate("plan-users-tooltip");
        var idUser = event.target.data("iduser");
        var users = [];

        if (idUser !== 0) {
            users = [self.usersMap["-" + idUser + "-"]];
        } else {
            users = $.map(self.usersMap, function (a, b) {
                if (a.userType.join().indexOf("owner") === -1) {
                    return a;
                }
            });
        }

        return tmpl.render({
            users: users
        });
    }


});

bizagi.injector.register("bizagi.workportal.widgets.project.plan.users", ["workportalFacade", "dataService", bizagi.workportal.widgets.project.plan.users], true);