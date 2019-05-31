﻿﻿/**
 * Admin module to manage adhoc user groups
 * @author Jose Aranzazu
 */
bizagi.workportal.widgets.widget.extend("bizagi.workportal.widgets.admin.adhoc.usergroup", {}, {
    /**
     * Init constructor
     * @param workportalFacade The workportalFacade to access to all components
     * @param dataService The dataService for making requests
     * @param params Widget Description
     */
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        self.allowSelection = params.data ? params.data.allowSelection : false;
        self.selectedGroup = params.data ? params.data.selectedItem : null;

        self.dialogBox = {};

        self.userGroups = [];        

        self.userGroupMap = {};
        self.adhocUserGroupMap = {};
        self.bizagiUserGroupMap = {};

        self.userInstancesMap = {};   

        var templateName = "bizagi.workportal.desktop.widgets.admin.adhoc.usergroup";            

        self.notifier = bizagi.injector.get("notifier");

        //Load templates
        self.loadTemplates({
            "admin.adhoc.usergroup.wrapper": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-adhoc-user-group-wrapper"),
            "admin.adhoc.usergroup.panel.wrapper": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-adhoc-user-group-panel-wrapper"),
            "admin.adhoc.usergroup.list": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-adhoc-user-group-list"),
            "admin.adhoc.usergroup.data": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-adhoc-user-group-data"),
            "admin.adhoc.usergroup.error": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-adhoc-user-group-error"),
            "admin.adhoc.usergroup.nodata": bizagi.getTemplate(templateName).concat("#ui-bizagi-workportal-widget-admin-adhoc-user-group-nodata"),
            "admin.adhoc.usergroup.form": bizagi.getTemplate(templateName).concat("#adhoc-user-group-form-popup"),
            "admin.adhoc.usergroup.data.searchform": bizagi.getTemplate(templateName).concat("#adhoc-user-group-data-form-popup"),
            useNewEngine: false
        });
    },

    /*
	 *   Returns the widget name
	 */
    getWidgetName: function () {
        return bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_USER_GROUPS;
    },

    /*
	 *   Renders the content for the current controller
	 */
    renderContent: function () {
        var self = this;
        var tmpl = self.getTemplate("admin.adhoc.usergroup.wrapper");
        var content = self.content = $.tmpl(tmpl);
        return content;
    },

    /**
     * Renders the content for the current widget
     * Get the list of all parametric entities and display them in the Template
     * If there is an error, display a message
     */
    postRender: function () {
        var self = this;        

        self.panelWrapper = $.tmpl(self.getTemplate("admin.adhoc.usergroup.panel.wrapper"));
        self.userGroupList = self.getTemplate("admin.adhoc.usergroup.list");
        self.userGroupData = self.getTemplate("admin.adhoc.usergroup.data");
        self.userGroupError = self.getTemplate("admin.adhoc.usergroup.error");
        self.userGroupNoData = self.getTemplate("admin.adhoc.usergroup.nodata");

        var content = self.getContent();
        content.empty();
        
        $.when(self.dataService.getAdhocUserGroupList())
            .done( function (data) {
                if (data.length > 0) {                    
                    self.createUserGroupMap(data);
                    self.renderUserGroupListPanel();
                }
                else {
                    var notFoundMessage = self.getResource("workportal-general-first-line-no-records-found");                    
                    var noDataTemplate = $.tmpl(self.userGroupNoData, { errorMessage: notFoundMessage });
                    $("#userGroupNoData", noDataTemplate).click(function () {
                        self.showAdhocUserGroupForm();
                    });
                    content.html(noDataTemplate);                    
                }
            })
            .fail( function (error) {
                self.self.userGroupMap = undefined;
                var errorMessage = self.getResource("workportal-widget-admin-user-group-error");
                content.html($.tmpl(self.userGroupError, { errorMessage: errorMessage }));
            });
    },

    renderUserGroupListPanel: function(userGroup){
        var self = this;
        var content = self.getContent();
        var userGroupListWrapper = $("#admin-user-group-list-wrapper", self.panelWrapper);        
        userGroupListWrapper.empty();
        content.html(self.panelWrapper);
        var adhocGroups = $.map(self.adhocUserGroupMap, function (v) { return v; });
        var bizagiGroups = $.map(self.bizagiUserGroupMap, function (v) { return v; });
        $.tmpl(self.userGroupList, { adhocUserGroupList: adhocGroups, bizagiUserGroupList: bizagiGroups, allowSelection: self.allowSelection }).appendTo(userGroupListWrapper);
        if (!userGroup && self.selectedGroup && self.selectedGroup.length > 0) userGroup = self.selectedGroup
        if (userGroup) {
            $("#userGroupList option[value=" + userGroup + "]", userGroupListWrapper).attr('selected', 'selected');
        } else {
            $("#userGroupList option:first", userGroupListWrapper).attr('selected', 'selected');
        }
        self.configureHandlers();
    },

    /**
     * Configure handlers
     */
    configureHandlers: function () {
        var self = this;
        var userGroupListWrapper = $("#admin-user-group-list-wrapper", self.panelWrapper);
        var userInstancesWrapper = $("#admin-user-instances-wrapper", self.panelWrapper);

        //Catch the typed text in the search field and filter the entities list
        $("#searchUserGroup", userGroupListWrapper).keyup(function () {
            var includeOpt = false;
            var matchString = $(this).val().toLowerCase();

            $('#userGroupList option', userGroupListWrapper).remove();
            var groups = $("optgroup");
            $.each(self.userGroupMap, function () {
                if (matchString.length > 1) {
                    if (this.displayName.toLowerCase().indexOf(matchString) != -1) {
                        includeOpt = true;
                    }
                }
                else {
                    includeOpt = true;
                }
                if (includeOpt) {
                    $("<option>", {
                        value: this.id,
                        text: this.displayName
                    }).appendTo(groups[this.isAdhoc ? 1 : 0])
                    includeOpt = false;
                }
            });
        });
        // EntitiesList listener
        $("#userGroupList", userGroupListWrapper).change(function () {
            self.setCurrentUserGroup();
            if (self.currentUserGroup.isAdhoc) {
                $("#adhocUserGroupEdit", userGroupListWrapper).show();
                $("#adhocUserGroupDelete", userGroupListWrapper).show();
            } else {
                $("#adhocUserGroupEdit", userGroupListWrapper).hide();
                $("#adhocUserGroupDelete", userGroupListWrapper).hide();
            }
            self.loadUsers();
        }).trigger("change");

        $("#adhocUserGroupAdd", userGroupListWrapper).click(function () {
            self.showAdhocUserGroupForm(true);
        });

        $("#adhocUserGroupEdit", userGroupListWrapper).click(function () {
            self.showAdhocUserGroupForm();
        });

        $("#adhocUserGroupDelete", userGroupListWrapper).click(function () {
            self.deleteAdhocGroup();
        });              
    },

    loadUsers: function () {
        var self = this;
        $("#admin-user-group-description-wrapper", self.panelWrapper).html(self.currentUserGroup.description);
        var userGroupDataWrapper = $("#admin-user-instances-wrapper", self.panelWrapper);
        $.when(self.dataService.loadUsersByGroup(self.currentUserGroup.id)).done(function (data) {            
            $.tmpl(self.userGroupData, { userList: data, context: self.currentUserGroup.isAdhoc ? "adhoc" : "bizagi" }).appendTo(userGroupDataWrapper);
            $(".item-delete-button", userGroupDataWrapper).click(function () {
                self.removeUserFromGroup($(this).data("id"));
            });
            if (self.currentUserGroup.isAdhoc) { //Adhoc
                $("#addUserButton", userGroupDataWrapper).click(function () {
                    self.showUserSearchForm();
                });
            }
        })
        .fail(function (error) {
            var errorMessage = self.getResource("workportal-widget-admin-user-group-instances-error");
            userGroupDataWrapper.html($.tmpl(self.userGroupError, { errorMessage: errorMessage }));
        });
    },


    saveAdhocUserInstance: function (data, isNew) {
        var self = this;
        var instance = {};
        if (isNew) {
            instance.id = Math.guid();
        } else {
            instance.id = data.id;
            delete data.id;            
        }
        instance.disabled = data.disabled;        
        delete data.disabled;
        instance.data = JSON.stringify(data);
        $.when(self.dataService.addUserToGroup({ entityId: self.currentUserGroup.id, isNew: isNew, instance: instance }))
        .done(function () {
            self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-user-instance-save"), ""));            
        })
        .fail(function (error) {
            var errorMessage = self.getResource("workportal-widget-admin-user-group-instance-add-error");
            $("#admin-entity-instances-wrapper", self.getContent()).html($.tmpl(self.entitiesError, { errorMessage: errorMessage }));
        });        
    },

    deleteAdhocGroup: function () {
        var self = this;
        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-adhoc-user-group-delete-confirmation"), "", "info")).done(function () {
            $.when(self.dataService.deleteAdhocGroup(self.currentUserGroup.id)).done(function () {                
                delete self.adhocUserGroupMap[self.currentUserGroup.id];
                self.currentUserGroup = null;
                self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-user-group-delete"), ""));
                self.renderUserGroupListPanel();
            });
        });
    },

    removeUserFromGroup: function (userId) {
        var self = this;
        $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("workportal-adhoc-user-group-data-remove-confirmation"), "", "info")).done(function () {
            $.when(self.dataService.removeUserFromGroup(self.currentUserGroup.id, userId)).done(function () {                                
                self.loadUsers();
            });
        });
    },

    setCurrentUserGroup: function () {
        var self = this;
        var selectedUserGroup = $('#userGroupList option:selected', self.panelWrapper);
        self.currentUserGroup = self.userGroupMap[selectedUserGroup.val()];
    },     

    showAdhocUserGroupForm: function (isNew) {
        var self = this, template = self.getTemplate("admin.adhoc.usergroup.form");        
        self.dialogBox.formContent = $.tmpl(template);
        self.dialogBox.elements = {            
            inputDisplayName: $("#input-displayname-adhoc-user-group", self.dialogBox.formContent),
            inputDesc: $("#input-desc-adhoc-user-group", self.dialogBox.formContent),
            buttonSave: $("#button-accept-adhoc-user-group-form", self.dialogBox.formContent),
            buttonCancel: $("#button-cancel-adhoc-user-group-form", self.dialogBox.formContent)
        };
        self.dialogBox.elements.buttonSave.on("click", $.proxy(self.onSaveAdhocUserGroup, self));
        self.dialogBox.elements.buttonCancel.on("click", $.proxy(self.closeDialogBox, self));        

        if (!isNew && self.currentUserGroup) {            
            self.dialogBox.adhocGroupGuid = self.currentUserGroup.id;
            self.dialogBox.elements.inputDisplayName.val(self.currentUserGroup.displayName);
            self.dialogBox.elements.inputDesc.val(self.currentUserGroup.description);
            $("option[value=" + self.currentUserGroup.id + "]", self.dialogBox.elements.selectType).attr('selected', 'selected');
        } else {
            self.dialogBox.data = [];
            self.dialogBox.adhocGroupGuid = Math.guid();
            self.dialogBox.isNew = true;            
        }                        

        self.dialogBox.formContent.dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: "700px",
            modal: true,
            title: bizagi.localization.getResource("workportal-adhoc-usergroup-create-popup-title"),            
            maximize: false,
            close: function () {
                self.dialogBox.formContent.dialog("destroy");
                self.dialogBox.formContent.detach();
            }
        });
    },

    showUserSearchForm: function () {
        var self = this, template = self.getTemplate("admin.adhoc.usergroup.data.searchform");
        self.dialogBox.formContent = $.tmpl(template);
        self.dialogBox.elements = {
            inputDisplayName: $("#input-displayname-user", self.dialogBox.formContent),
            buttonSave: $("#button-accept-adhoc-user-group-form", self.dialogBox.formContent),
            buttonCancel: $("#button-cancel-adhoc-user-group-form", self.dialogBox.formContent)
        };
        self.dialogBox.elements.buttonSave.on("click", $.proxy(self.onSaveUserToGroup, self));
        self.dialogBox.elements.buttonCancel.on("click", $.proxy(self.closeDialogBox, self));
        
        self.dialogBox.formContent.dialog({
            resizable: false,
            draggable: false,
            height: "auto",
            width: "400px",
            modal: true,
            title: bizagi.localization.getResource("workportal-adhoc-usergroup-user-search-popup-title"),
            maximize: false,
            close: function () {
                self.dialogBox.formContent.dialog("destroy");
                self.dialogBox.formContent.detach();
            }
        });

        self.initializeUserAutoComplete(self.dialogBox.elements.inputDisplayName);
    },

    closeDialogBox: function () {
        var self = this;        
        self.dialogBox.formContent.dialog("destroy");
        self.dialogBox.formContent.detach();        
    },

    onSaveAdhocUserGroup: function (event) {
        event.preventDefault();
        var self = this;
        if (self.validateParams()) {
            var paramsNewGroup = {
                id: self.dialogBox.adhocGroupGuid,                
                displayName: self.dialogBox.elements.inputDisplayName.val(),
                description: self.dialogBox.elements.inputDesc.val(),
                isAdhoc: true
            };
            $.when(self.dataService.saveAdhocGroup(paramsNewGroup)).done(function () {
                self.currentUserGroup = paramsNewGroup;
                self.userGroupMap[paramsNewGroup.id] = paramsNewGroup;
                if (paramsNewGroup.isAdhoc == 1) // Adhoc
                    self.adhocUserGroupMap[paramsNewGroup.id] = paramsNewGroup;                    
                else // Bizagi
                    self.bizagiUserGroupMap[paramsNewGroup.id] = paramsNewGroup;
                self.closeDialogBox();                
                self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-usergroup-form-save"), ""));
                self.renderUserGroupListPanel(paramsNewGroup.id);                
            }).fail(function (error) {
                bizagi.log(error);
            });
        }
    },

    onSaveUserToGroup: function (event) {
        event.preventDefault();
        var self = this;
        if (self.validateParams()) {
            var paramsNewUser = {
                groupId: self.currentUserGroup.id,
                userId: self.currentAssignee
            };
            $.when(self.dataService.addUserToGroup(paramsNewUser)).done(function () {                
                self.closeDialogBox();
                self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-usergroup-instance-save"), ""));
                self.loadUsers();
            }).fail(function (error) {
                bizagi.log(error);
            });
        }
    },

    createUserGroupMap: function (userGroups) {
        var self = this;       
        $.each(userGroups, function (i, val) {
            self.userGroupMap[val.id] = val;
            if (val.isAdhoc) {
                self.adhocUserGroupMap[val.id] = val;                
            } else {
                self.bizagiUserGroupMap[val.id] = val;
            }
        });        
    },

    validateParams: function () {
        var self = this;
        var name = self.dialogBox.elements.inputDisplayName;
        if (name.val() && name.val() !== "") {
            return true;
        } else {
            var nameValidation = bizagi.localization.getResource("workportal-general-error-field-required");
            nameValidation = nameValidation.replace("{0}", "Name");
            name.next().find("span").html(nameValidation);
            return false;
        }
    },         

    initializeUserAutoComplete: function (element) {
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
                self.currentAssignee = ui.item.value;
                return false;
            },
            focus: function () {
                return false;
            },
            change: function (event, ui) {
                if (ui.item === null) {
                    self.dialogBox.elements.inputUser.val("");
                }
                return false;
            }
        });
    }
});
