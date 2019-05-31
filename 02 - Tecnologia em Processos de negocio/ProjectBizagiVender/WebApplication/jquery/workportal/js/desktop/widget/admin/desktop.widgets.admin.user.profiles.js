﻿
/**
* Name: BizAgi Desktop Widget User Profiles
* 
* @author Liliana Fernandez.
*/

bizagi.workportal.widgets.admin.user.profiles.extend("bizagi.workportal.widgets.admin.user.profiles", {}, {

    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "user.profiles": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.user.profiles").concat("#ui-bizagi-workportal-widget-admin-user-profiles"),
            "user.profiles.fields": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.user.profiles").concat("#ui-bizagi-workportal-widget-admin-user-profiles-fields"),
            "user.profiles.table": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.user.profiles").concat("#ui-bizagi-workportal-widget-admin-user-profiles-table"),
            "user.profiles.table.administrator": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.user.profiles").concat("#ui-bizagi-workportal-widget-admin-user-profiles-table-administrator"),
            useNewEngine: false
        });
    },

    loadtemplates: function () {
        var self = this;
        //Template vars 
        self.userProfilesFields = self.getTemplate("user.profiles.fields");
        self.userProfilesTable = self.getTemplate("user.profiles.table");
        self.userProfilesTableAdministrator = self.getTemplate("user.profiles.table.administrator");
        //        self.userProfilesPagination = self.workportalFacade.getTemplate("user.profiles.pagination");
    },

    postRender: function () {
        var self = this;
        self.maxElemShow = 10;
        self.maxPageToShow = 5;

        //load form data
        self.setupData();
    },

    /*
    * Setup form data
    */
    setupData: function () {
        var self = this;

        self.setupInitialData();
    },

    /*
    * Load form fields and combo's data
    */
    setupInitialData: function () {
        var self = this,
            content = self.getContent(),
            params = { dataType: "profiles" };

        $.when(self.dataService.getProfilesTypes(params),
               self.dataService.getOrganizationsList()
        ).done(function (profileTypes, orgList) {

            var fields = $.tmpl(self.userProfilesFields, { profileList: profileTypes[0].response, orgList: orgList[0].response });
            self.comboDefaultValue = profileTypes[0].response[0].id;

            //append fields to wrapper
            $("#general-content", content).html("");
            $("#general-content", content).append(fields);
            self.setupMainButtons();
            self.setupProfileComboEvent();
            $("#dinamicContent", content).html("");
            $("#dinamicContent2", content).html("");
            $("#general-content", content).show();

        }).fail(function (error) {
            bizagi.log(error);
        });
    },
    /*
    * initialize the users search form widget
    */
    searchProfiles: function () {
        var self = this,
        content = self.getContent(),
        profileName = $("#txtTextnameProfile", content).val();
        self.profileTypeId = $("#profileTypeList").val();
        self.profileTypeName = $("#profileTypeList option:selected").text();

        if (self.profileTypeId == "8") {
            self.organizationId = $("#organizationList", content).val();
        } else {
            self.organizationId = "";
        }

        var params = { action: "searchProfiles",
            profileName: profileName,
            profileType: self.profileTypeId,
            orgId: self.organizationId
        };


        $.when(self.dataService.searchProfiles(params)
        ).done(function (profileList) {
            var fields = $.tmpl(self.userProfilesTable, { profileList: profileList.response });
            $("#profilesTableId").remove();
            $("#general-content", content).append(fields);
            self.setupManageLink();
        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    /*
    * Load Table user Profile Administrator
    */
    getUserByProfileId: function (profileId) {
        var self = this,
        content = self.getContent();
        params = { action: "getUsersByProfile", idProfile: profileId, profileType: self.profileTypeId };
        self.profileId = profileId;
        $("#general-content").hide();


        $.when(self.dataService.getUsersByProfile(params)
        ).done(function (userList) {
            var fields = $.tmpl(self.userProfilesTableAdministrator, { userList: userList.users });
            $("#dinamicContent", content).hide();
            $("#dinamicContent2", content).html("");
            $("#dinamicContent2", content).append(fields);
            self.setupManageButtons();
        }).fail(function (error) {
            bizagi.log(error);
        });

    },

    /*
    * Delete User Profile
    */
    removeUserFromProfile: function (idUser) {
        var self = this,
            content = self.getContent();
        params = { action: "removeUserFromProfile", idProfile: self.profileId, profileType: self.profileTypeId, idUser: idUser };

        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-widget-admin-user-profiles-invalidate-confirm-msg"), "Bizagi", "warning"))
        .done(function () {
            $.when(self.dataService.removeUserFromProfile(params)
            ).done(function (result) {
                self.getUserByProfileId(self.profileId);
            }).fail(function (error) {
                bizagi.log(error);
            });
        });

    },

    /*
    * initialize the users search form widget
    */
    setupUsersSearchForm: function () {
        var self = this;
        var content = self.getContent();
        var def = $.Deferred();
        $("#dinamicContent2").html("");


        self.usersTable = new bizagi.workportal.widgets.userstable(self.workportalFacade, self.dataService, $.extend(self.params, {
            canvas: $("#dinamicContent2", content),
            userLinkLabel: [bizagi.localization.getResource("workportal-general-select")],
            parentDef: def
        }));

        self.usersTable.render();

        $.when(def).done(function (userId, userName) {
            self.addUserToProfile(userId);
        });
    },

    addUserToProfile: function (userId) {
        var self = this,
        content = self.getContent(),
        params = { idProfile: self.profileId, profileType: self.profileTypeId, idUser: userId };

        $.when(self.dataService.addUserToProfile(params)
        ).done(function (result) {
            self.getUserByProfileId(self.profileId);
        }).fail(function (error) {
            bizagi.log(error);
        });

    },

    /***********EVENTS ***********************************/

    setupMainButtons: function () {
        var self = this,
            content = self.getContent();

        $("#btn-searchUserProfiles", content).click(function () {
            self.searchProfiles();
        });

        $("#btn-clearUserProfiles", content).click(function () {
            $("#txtTextnameProfile", content).val("");
            $("#profileTypeList").val(self.comboDefaultValue);
            $("#profilesTableId", content).remove();
            self.setupProfileComboEvent();
        });
    },

    setupManageLink: function () {
        var self = this,
        content = self.getContent();

        $(".manageLink", content).click(function () {
            var profileId = this.getAttribute("id");
            self.profileId = profileId;
            self.getUserByProfileId(self.profileId);
        });
    },

    setupManageButtons: function () {
        var self = this,
        content = self.getContent();

        $("#btn-returnUserProfiles", content).click(function () {
            self.setupData();
        });

        $("#btn-newUserProfiles", content).click(function () {
            self.setupUsersSearchForm();
        });

        $(".deleteLink", content).click(function () {
            self.removeUserFromProfile($(this)[0].getAttribute("id"));
        });
    },

    setupProfileComboEvent: function () {
        var self = this,
            content = self.getContent();

        var optionSelected = $("#profileTypeList", content).find('option:selected').val();
        if (optionSelected == "8") {
            $("#organizationListDiv").show();
        }

        $("#profileTypeList", content).change(function () {
            optionSelected = $(this).find('option:selected').val();

            if (optionSelected == "8") {
                $("#organizationListDiv").show();
            } else {
                $("#organizationListDiv").hide();
            }
        });

    }
});