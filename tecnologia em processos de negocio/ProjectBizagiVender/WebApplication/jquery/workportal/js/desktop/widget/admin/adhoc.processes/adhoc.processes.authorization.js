bizagi.workportal.widgets.widget.extend("adhoc.processes.admin.authorization", {}, {

    init: function (workportalFacade, dataService, params) {

        var self = this;

        self.notifier = bizagi.injector.get("notifier");

        // Call base
        self._super(workportalFacade, dataService, params);

        // Load Templates
        self.loadTemplates({
            "adhoc.processes.authorization.editor.popup": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#adhoc-process-authorization-popup-template"),
            "adhoc.processes.authorization.editor.popup.items": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#adhoc-process-authorization-popup-items-template"),
            "adhoc.processes.authorization.editor.usergroup.popup": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.adhoc.processes").concat("#adhoc-process-authorization-item-popup-template"),
            useNewEngine: false
        });
    },    

    renderAuthorizationItems: function (container, processId, auth, isAdhocTask) {
        var self = this;
        self.currentProcessId = processId;
        var itemsTemplate = self.getTemplate("adhoc.processes.authorization.editor.popup.items");

        $.when(self.dataService.loadAuthItemInfoByInstance(auth)).done(function (response) {
            var authItemsContent = $.tmpl(itemsTemplate, { authItemList: response });
            container.append(authItemsContent);

            var buttonAdd = $("#addUserButton", authItemsContent);
            var buttonRemove = $(".item-delete-button", authItemsContent);

            buttonAdd.on("click", $.proxy(self.onAddAuthorizationItem, self, auth, isAdhocTask));
            buttonRemove.on("click", $.proxy(self.onRemoveAuthorizationItem, self, auth, isAdhocTask));
        })
        .fail(function (error) {
            bizagi.log(error);
        });
    },

    showUserGroupEditorPopup: function (dialogBox, auth) {
        var self = this;
        var defaultWidth = ($(window).width() - (($(window).width() * 15) / 100)) + "px";
        var addedItems = [];
        if (auth != null && auth.allowTo.count() > 0) {
            addedItems = auth.allowTo;
        }
        var widgetParameters = {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_ADMIN_ADHOC_USER_GROUPS,
            data: { "allowSelection": true, "selectedItem": dialogBox.inputUserName.val().length > 0 ? "" : dialogBox.authItemId.val() },
            closeVisible: false,
            modalParameters: {
                title: self.getResource("workportal-menu-submenu-AdhocUserGroupAdmin"),
                id: "AdhocUserGroupAdmin"
            },
            buttons: [
                {
                    text: self.getResource("workportal-adhoc-process-auth-search-form-group-link"),
                    click: function () {
                        var that = this;
                        var widget = $(this).dialog("option", "widget");
                        var userGroup = widget.currentUserGroup || {};

                        var found = addedItems.some(function (item) {
                            return item.instance === userGroup.id;
                        });
                        if (found) {
                            bizagi.showMessageBox(self.getResource("workportal-adhoc-process-auth-select-group-validation"), "Bizagi", "warning");
                        } else {
                            if (Object.keys(userGroup).length !== 0) {
                                dialogBox.authItemId.val(userGroup.id);
                                dialogBox.authItemId.data("itemtype", "group");
                                dialogBox.userGroupName.text(userGroup.displayName);
                                dialogBox.userGroupLink.text("Change Group");
                                dialogBox.userGroupName.show();
                                dialogBox.inputUserName.val("");
                            }
                            $(that).dialog('close');
                        }
                    }
                }
            ]
        };
        self.publish("showDialogWidget", widgetParameters);
    },

    onAddAuthorizationItem: function (auth, isAdhocTask, event) {
        event.preventDefault();
        var self = this, template = self.getTemplate("adhoc.processes.authorization.editor.usergroup.popup");
        var authItem = {};
        authItem.isAdhocTask = isAdhocTask;
        authItem.formContent = $.tmpl(template);

        authItem.inputUserName = $("#input-displayname-user", authItem.formContent);
        authItem.userGroupName = $("#userGroupName", authItem.formContent);
        authItem.userGroupLink = $("#groupEditorLink", authItem.formContent);
        authItem.authItemId = $("#authItemId", authItem.formContent);
        authItem.buttonSave = $("#button-accept-adhoc-user-group-form", authItem.formContent);
        authItem.buttonCancel = $("#button-cancel-adhoc-user-group-form", authItem.formContent);

        authItem.buttonSave.on("click", $.proxy(self.onSaveAuthorizationItem, self, authItem, auth));
        authItem.buttonCancel.on("click", $.proxy(self.closeDialogBox, self, authItem.formContent));
        authItem.userGroupLink.on("click", $.proxy(self.showUserGroupEditorPopup, self, authItem, auth));

        authItem.authItemId.val("");

        // Subscribe to dialog widget event
        this.subscribe("setSelectedAuthItem", function (e, params) {
            authItem.authItemId.val(params.itemId);
            authItem.authItemId.data("itemtype", params.type);
            if (params.type === "group") {
                authItem.userGroupName.text(params.itemName);
                authItem.userGroupLink.text("Change Group");
                authItem.userGroupName.show();
                authItem.inputUserName.val("");
                self.publish("closeCurrentDialog");
            } else {
                authItem.userGroupName.text("");
                authItem.userGroupLink.text("Select Group");
                authItem.userGroupName.hide();
            }
        });

        authItem.formContent.dialog({
            resizable: false,
            draggable: false,
            width: "400px",
            modal: true,
            title: bizagi.localization.getResource("workportal-adhoc-auth-search-popup-title"),
            maximize: false,
            close: $.proxy(self.closeDialogBox, self, authItem.formContent)
        });

        self.initializeUserAutoComplete(authItem.inputUserName);
    },

    onSaveAuthorizationItem: function (dialogBox, auth, event) {
        event.preventDefault();
        var self = this;
        var authItem = {
            level: dialogBox.authItemId.data("itemtype"),
            instance: dialogBox.authItemId.val()
        };

        auth.allowTo.push(authItem);

        $.when(self.dataService.saveAdhocAuthorizationInfo({ processId: self.currentProcessId, auth: auth, isAdhocTask: dialogBox.isAdhocTask })).done(function () {
            self.closeDialogBox(dialogBox.formContent);
            self.publish("refreshAuthItems", { auth: auth });
            self.notifier.showSucessMessage(printf(bizagi.localization.getResource("workportal-adhoc-process-assignment-form-save"), ""));
        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    onRemoveAuthorizationItem: function (auth, isAdhocTask, event) {
        event.preventDefault();
        var self = this;

        var selectedItem = $(event.currentTarget).data("id")

        var authItems = auth.allowTo;

        var newAuthItems = authItems.filter(function (item) {
            return item.instance !== selectedItem.toString();
        });

        auth.allowTo = newAuthItems;

        $.when(self.dataService.saveAdhocAuthorizationInfo({ processId: self.currentProcessId, auth: auth, isAdhocTask: isAdhocTask })).done(function () {
            self.publish("refreshAuthItems", { auth: auth });
        }).fail(function (error) {
            bizagi.log(error);
        });
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
                $(element).data("userid", ui.item.value);
                self.publish("setSelectedAuthItem", { type: "user", itemId: ui.item.value });
                return false;
            },
            focus: function () {
                return false;
            },
            change: function (event, ui) {
                if (ui.item === null) {
                    element.val("");
                    self.publish("setSelectedAuthItem", { type: "user", itemId: "" });
                }
                return false;
            }
        });
    },

    closeDialogBox: function (template) {
        var self = this;
        var dialogBox = template;
        dialogBox.dialog("destroy");
        dialogBox.detach();
    }
});