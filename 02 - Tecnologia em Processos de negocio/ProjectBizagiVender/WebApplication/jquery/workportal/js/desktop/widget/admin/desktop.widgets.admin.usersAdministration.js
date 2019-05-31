/**
 *   Name: BizAgi Workportal Desktop Graphic Query
 *   Author: David Romero
 *   Comments:
 *   -   This script renders the cases workflow
 */
bizagi.workportal.widgets.admin.usersAdministration.extend("bizagi.workportal.widgets.admin.usersAdministration", {}, {

    /**
     * To be overriden in each device to apply layouts
     */
    postRender: function () {
        var self = this;

        self.dateFormat = self.getResource("dateFormat") + " " + self.getResource("timeFormat");
        self.$userTable = $("#bz-wp-widget-adminuser-usertable", self.content);
        self.$renderForm = $("#bz-wp-widget-adminuser-renderform", self.content);
        self.$buttonsContainer = $("#bz-wp-widget-adminuser-buttonset", self.content);
        self.$usersLicenses = $("#bz-wp-widget-adminuser-licenses", self.content);

        //query licenses
        $.when(self.queryUserPermissions()).done(function () {
            //render users table widget
            self.renderUsersTable();
        });

        //add event handlers
        self.addEventsHandler();
    },

    /**
     * Render user table
     */
    renderUsersTable: function () {
        var self = this;
        self.usersTable = new bizagi.workportal.widgets.userstable(self.workportalFacade, self.dataService, $.extend(self.params, {
            canvas: self.$userTable,
            userLinkLabel: self.userLinks
        }));

        self.usersTable.render();
    },

    /**
     * Query users permissions
     */
    queryUserPermissions: function () {

        var self = this;
        var defer = $.Deferred();

        $.when(self.queryLicenses(), self.dataService.createUserAdministrationForm()).done(function (isAllowByLicences, isAllowByReadOnly) {
            self.allowCreation = (!isAllowByLicences || !isAllowByReadOnly[0].createUser) ? false : true;

            defer.resolve();
        });

        return defer.promise();
    },

    /**
     * Query Licenses
     */
    queryLicenses: function () {

        var self = this;
        var defer = $.Deferred();

        $.when(self.dataService.queryUsersLicenses()).done(function (response) {
            self.showLicensesMessage(response);
            defer.resolve(response.canAddNewUser);
        });

        return defer.promise();
    },

    /**
     * show licences
     */
    showLicensesMessage: function (params) {

        var self = this;

        if (!params.canAddNewUser || params.areLicensedUsersLimitNear) {

            var tmpl = self.getTemplate("admin.users.licenses");

            self.$renderForm.height("82%");

            self.$usersLicenses.html($.tmpl(tmpl, { users: params.activeUsers, licenses: params.licensedUsersAccount }));
        }
    },

    /**
     * Events Handlers
     */
    addEventsHandler: function () {
        var self = this;

        self.$userTable.on("clickUserLink", function (event, data) {

            self.userData = data;

            switch (data.type) {
                case "log":
                    self.resetLogValues();
                    self.getUsersLogData();
                    break;
                case "edition": self.renderForm();
                    break;
            }
        });

        self.$userTable.on("completeUserForm", function () {
            self.renderFormButtons("query");
        });

        self.$userTable.on("click", "#bz-wp-widget-adminuser-createbutton-wrapper", function () {
            self.userData = {};
            self.renderForm();
        });

        $("#bz-wp-widget-adminuser-buttonset", self.content).on("click", "button", function () {
            self.returnToUserTable();
        });

        self.$renderForm.on("click", "table .sortColumnsData", function () {
            var orderField = $(this).data("orderfield");
            var orderType = $(this).data("ordertype");

            self.getUsersLogData({ "orderType": orderType, "orderField": orderField });
        });

        self.$usersLicenses.on("click", "button", function (event) {
            var buttonType = $(this).data("type");

            switch (buttonType) {
                case "buy":
                    self.buyLicense();
                    break;
                case "licenses":
                    self.renderLicensesWidgets();
                    break;
            }

            event.stopPropagation();
        });
    },

    /**
     * Reset Log Values
     */
    resetLogValues: function () {
        var self = this;

        self.currentPage = 1;
        self.orderType = "ASC";
        self.orderField = "";
    },

    /**
     * Render licenses
     */
    renderLicensesWidgets: function () {
        var self = this;

        self.publish("showDialogWidget", {
            widgetName: "userlicenses",
            data: { "idCase": "Licenses" },
            modalParameters: {
                title: self.getResource("workportal-menu-submenu-Licenses"),
                width: "907px",
                showCloseButton: true,
                id: "Licenses"
            }
        });
    },

    /**
     * Buy License
     */
    buyLicense: function () {
        window.open("http://www.bizagi.com", "_black");
    },

    /**
     * Retorn to user table to query users
     */
    returnToUserTable: function () {
        var self = this;

        self.toggleForm(true);
        self.removeButtons();
        self.$renderForm.empty();
    },

    /**
     * Render log
     */
    getUsersLogData: function (params) {
        var self = this;
        var params = params || {};
        self.orderType = params.orderType || self.orderType;
        self.orderField = params.orderField || self.orderField;

        $.when(self.dataService.getUsersAdministrationLog({ "idUser": self.userData.id, "Pag": self.currentPage, "pagSize": self.maxRows, "orderField": self.orderField, "orderType": self.orderType })).done(function (response) {
            self.totalPages = response.total;
            self.renderUserLogTable(response);
        });
    },

    /**
     * Remove Buttons
     */
    removeButtons: function () {
        var self = this;
        self.$buttonsContainer.empty();
    },

    /**
     * Render user log table
     */
    renderUserLogTable: function (response) {
        var self = this;
        var tmpl = self.getTemplate("admin.users.log");
        var renderContainer = self.$renderForm;
        var pagination = (self.totalPages > 1);
        var pagesArray = self.getPagesArray();

        self.toggleForm(false);

        //Render log and change date format
        var content = $.tmpl(tmpl, response, { "userName": self.userData.name, "page": self.currentPage, "pagination": pagination, "pagesArray": pagesArray, "orderType": self.orderType, "orderField": self.orderField });
        bizagi.util.formatInvariantDate(content, self.dateFormat);
        self.$renderForm.html(content);

        self.setUpPagination();
        self.renderFormButtons("back");
    },

    /**
     * Set pagination
     */
    setUpPagination: function () {
        var self = this;
        var $pager = $("#biz-wp-usersadministration-pager ul", self.content);

        $pager.bizagiPagination({
            maxElemShow: self.maxRows,
            totalPages: self.totalPages,
            actualPage: self.currentPage,
            listElement: $pager,
            clickCallBack: function (options) {
                self.currentPage = parseInt(options.page);
                self.getUsersLogData();
            }
        });
    },

    /**
     * get array for pages
     */
    getPagesArray: function () {
        var self = this;
        var pagesToShow = (self.maxPages > self.totalPages) ? self.totalPages : self.maxPages;
        var aux = [];

        for (var a = 0; a < pagesToShow; a++) {
            aux.push(a + 1);
        }

        return aux;
    },

    /**
     * Render form button
     */
    renderFormButtons: function (type) {
        var self = this;
        var tmpl = self.getTemplate("admin.users.formbuttons");
        var $button = $.tmpl(tmpl, { type: type, allowCreation: self.allowCreation });

        if (type === "query") {
            $("#bz-wp-widget-adminuser-usertable #users-table-buttonset", self.content).append($button);
        }
        else {
            self.$buttonsContainer.html($button);
        }
    },

    /**
     * Change form display
     */
    toggleForm: function (display) {
        var self = this;

        switch (display) {
            case true:
                self.$userTable.show();
                self.$renderForm.hide();
                break;
            case false:
                self.$userTable.hide();
                self.$renderForm.show();
                break;
        }
    },

    /**
     * Get Pages
     */
    getPages: function () {
        var self = this;
        var pagesToShow = (self.maxPages > self.totalPages) ? self.totalPages : self.maxPages;
        var aux = [];

        for (var a = 0; a < pagesToShow; a++) {
            aux.push(a + 1);
        }

        return aux;
    },

    /**
     * Render form
     */
    renderForm: function () {

        var self = this;

        bizagi.loader.start("rendering").then(function () {
            var renderContainer = self.$renderForm;
            var rendering = new bizagi.rendering.facade();
            var userId = self.userData.id || 0;
            var action = (self.userData.id) ? "edit" : "add";
            var params = self.getLoadFormParams(userId);

            self.toggleForm(false);
            self.removeButtons();

            //request to queryForm definition service
            self.dataService.getUsersForm(params).done(function (data) {
                var renderingParams = { canvas: renderContainer, data: data, type: "usersForm", userId: userId, action: action };

                rendering.execute(renderingParams).done(function () {
                    self.userForm = rendering.form;

                    self.userForm.bind("endUsersForm", function (event, params) {
                        self.performActionsAfterSave(params);
                    });

                });
            });
        });
    },

    /**
     * Get load form params
     */
    getLoadFormParams: function (userId) {
        var params = {
            h_action: "LOADUSERADMINFORM",
            h_contexttype: "entity"
        };

        if (userId) {
            $.extend(params, {
                h_xpathContext: "@Context.Users[id == " + userId + "]",
                h_optionform: "edit"
            });
        }
        else {
            $.extend(params, { h_optionform: "add" });
        }

        return params;
    },

    /**
     * Perform some actions after save
     */
    performActionsAfterSave: function (params) {

        var self = this;
        var userId = params.userId || self.userData.id;

        if (params.sendMail) {
            self.sendMail(userId, params.password);
        }

        if (params.formAction === "save" || params.formAction === "cancel") {

            $.when(self.queryUserPermissions()).done(function () {
                self.usersTable.excecuteQuery();
                if (!self.allowCreation) {
                    //$("#bz-wp-widget-adminuser-buttonset div#bz-wp-widget-adminuser-createbutton-wrapper", self.content).remove();
                    $("#bz-wp-widget-adminuser-createbutton-wrapper", self.content).remove();
                }

                if (!params.error) {
                    self.userForm.endLoading();
                    self.returnToUserTable();
                }

            });
        } else {
            self.returnToUserTable();
        }
    },

    /**
     * Sends the mail with password
     */
    sendMail: function (userId, password) {
        var self = this;

        self.dataService.generateDataToSendByEmail({idUser: userId}).done(function (response) {
            self.showEmailPopup(response, password);
        });
    },

    /**
     * Generate Windows PopupContent email
     */
    showEmailPopup: function (messageResponse, password) {

        var self = this;
        var doc = window.document;

        var template = self.getTemplate("admin.users.email");

        // Opens a dialog in order to upload Email
        var dialogBoxEmail = self.dialogBoxEmail = $("<div class= admin-users-email/>");
        dialogBoxEmail.empty();
        dialogBoxEmail.appendTo("body", doc);

        // Define buttons
        var buttonsEmail = {};

        buttonsEmail[self.getResource("workportal-widget-admin-users-button-label-send")] = function () {

            if ($("#txtTextTo", dialogBoxEmail).val() !== "") {
                // Select button Send
                var params = {
                    eMailTo: $("#txtTextTo", dialogBoxEmail).val(),
                    subject: $("#txtSubject", dialogBoxEmail).val(),
                    body: $("#txtBody", dialogBoxEmail).val(),
                    userSecret: password
                };

                $.when(self.dataService.sendUserEmail(params)).done(function (result) {
                    self.closeUploadDialogEmail();
                    var emailConfirmationMessage = bizagi.localization.getResource("workportal-widget-admin-users-Send-message");

                    if (result.logOff && result.logOff == "false")
                        emailConfirmationMessage = bizagi.localization.getResource("workportal-widget-admin-users-Not-Send-message");

                    bizagi.showMessageBox(emailConfirmationMessage, "Bizagi", "warning");
                });
            } else {
                bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-users-empty-email-to"), "Bizagi", "warning");
            }


        };

        // Cancel button Send
        buttonsEmail[self.getResource("workportal-widget-admin-users-button-label-notSend")] = function () {
            self.closeUploadDialogEmail();
        };

        // Render template
        messageResponse.body = messageResponse.body.replace(/\\n/g, "\n").replace(/\\/g, "");
        $.tmpl(template, { messageResponse: messageResponse }).appendTo(dialogBoxEmail);
        $(".ui-bizagi-loading-message").remove();

        //Creates a dialog
        dialogBoxEmail.dialog({
            width: 500,
            title: self.getResource("workportal-widget-admin-users-subtitle-email"),
            modal: true,
            maximize: false,
            resizable: false,
            draggable: false,
            buttons: buttonsEmail,
            close: function () {
                self.closeUploadDialogEmail();
            },
            resizeStop: function (event, ui) {
                if (self.form) {
                    self.form.resize(ui.size);
                }
            }
        });


    },

    /**
     *
     */
    closeUploadDialogEmail: function () {
        var self = this;
        self.dialogBoxEmail.dialog("destroy");
        self.dialogBoxEmail.remove();
    }
});
