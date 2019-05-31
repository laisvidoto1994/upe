/**
* Name: BizAgi Desktop Widget Pending User Request
* 
* @author Liliana Fernandez, David Andrés Niño Villalobos
*/


bizagi.workportal.widgets.admin.users.requests.extend("bizagi.workportal.widgets.admin.users.requests", {}, {
    
    init: function (workportalFacade, dataService, params) {
        var self = this;

        // Call base
        self._super(workportalFacade, dataService, params);

        //Load templates
        self.loadTemplates({
            "users.requests": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.users.requests").concat("#ui-bizagi-workportal-widget-admin-users-requests"),
            "users.requests.list": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.users.requests").concat("#ui-bizagi-workportal-widget-admin-users-requests-list"),
            "users.requests.detail": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.users.requests").concat("#ui-bizagi-workportal-widget-admin-users-requests-detail"),
            "users.requests.pagination": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.users.requests").concat("#ui-bizagi-workportal-widget-admin-users-requests-pagination"),
            "users.requests.email": bizagi.getTemplate("bizagi.workportal.desktop.widgets.admin.users.requests").concat("#ui-bizagi-workportal-widget-admin-users-requests-email"),
            useNewEngine: false
        });
    },

    postRender: function () {
        var self = this,
            content = self.getContent();


        self.maxElemShow = 10; 
        self.maxPageToShow = 5;
        self.currentPage = 1;

        //Template vars
        self.userRequest = self.getTemplate("users.requests");
        self.userRequestList = self.getTemplate("users.requests.list");
        self.userRequestDetail = self.getTemplate("users.requests.detail");
        self.userRequestpaginationTmpl = self.getTemplate("users.requests.pagination");
        self.userRequestemailTmpl = self.getTemplate("users.requests.email");


        //DOM Variables
        self.userRequestListWrapper = $("#users-request-list-wrapper", content);
        self.userRequestDetailWrapper = $("#users-request-detail-wrapper", content);


        self.containtersID = {
            LIST: "list",
            DETAIL: "detail"
        };

        //load form data
        self.setupInitialData();

    },

    /**
    * Load form fields and combo's data
    */
    setupInitialData: function (selectedPage) {
        var self = this;

        //Switch content to detail
        self.switchContent(self.containtersID.LIST);

        if (selectedPage) {
            self.currentPage = selectedPage;
        }

        var params = { pag: self.currentPage, pagSize: self.maxElemShow };

        $.when(self.dataService.userPendingRequests(params)).done(function (result) {
            self.renderUserRequestList(result);
        });
    },

    /**
     * call authentication Info
    */
    authenticationInfo: function (userId) {
        var self = this;
        var params_1 = {
            idUser: userId
        };

        $.when(self.dataService.userAuthenticationInfo(params_1)).done(function (resultAuthentication) {
            self.renderUserRequestDetails(resultAuthentication);
        });
    },

    /**
    * generate Render Users Request
    */
    renderUserRequestList: function (data) {
        var self = this;
        var content = self.getContent();

        self.userRequestListWrapper.empty();

        var requestList = $.tmpl(self.userRequestList, { userData: data.rows });

        // Format invariant dates
        bizagi.util.formatInvariantDate(requestList, self.getResource("dateFormat") + " " + self.getResource("timeFormat"));

        self.userRequestListWrapper.append(requestList);

        var usersRequestsSummaryWrapper = $("#users-requests-pager-wrapper", content);

        //Keep in track the total Records
        self.totalRecords = data.records;

        //keep in track the total pages
        self.totalPages = data.total;

        if (data.rows.length > 0) {

            var pageToshow = (self.maxPageToShow > self.totalPages) ? self.totalPages : self.maxPageToShow;
            //var summaryWrapper = $("#authentication-log-pager-wrapper");
            var paginationHtml;

            var pagerData = {};
            // show or hide "load more" button
            pagerData.pagination = (self.totalPages > 1);
            pagerData.page = data.page;
            pagerData.pages = {};
            $("#biz-wp-userrequest-norequest").css("display","none");
            $("#users-request-list-wrapper .biz-wp-window ").css("display","block");
            $("#users-request-list-wrapper .biz-wp-table ").css("display","table");
        
           
            for (var i = 1; i <= pageToshow; i++) {
                pagerData["pages"][i] = {
                    "pageNumber": i
                };
            }

            //load and append the paginator to the result table
            paginationHtml = $.tmpl(self.userRequestpaginationTmpl, pagerData).html();
            usersRequestsSummaryWrapper.append(paginationHtml);

            //add data and behaviour to pager
            $("ul").bizagiPagination({
                maxElemShow: self.maxElemShow,
                totalPages: self.totalPages,
                actualPage: data.page,
                listElement: $("#users-requests-pager-wrapper"),
                clickCallBack: function (options) {
                    self.setupInitialData(options.page);
                }
            });

        }
        else {
           $("#biz-wp-userrequest-norequest").show("500");
           $("#users-request-list-wrapper .biz-wp-window ").css("display","none");
           $("#users-request-list-wrapper .biz-wp-table ").css("display","none");
        }

        //Add ui events
        $(".selectLink", content).click(function (e) {
            self.authenticationInfo(e.currentTarget.id);
        });
    },

    /*
    * Load Info Users requests detail
    */
    renderUserRequestDetails: function (resultAuthentication) {
        var self = this;
        var noEmptyField;
        var content = self.getContent();
        var requestDetail = $.tmpl(self.userRequestDetail, {resultAuthentication: resultAuthentication});

        //Switch content to detai
        self.switchContent(self.containtersID.DETAIL);

        self.userRequestDetailWrapper.empty();
        self.userRequestDetailWrapper.append(requestDetail);

        self.idUser = resultAuthentication.idUser;
        self.password = resultAuthentication.password;
        self.enabled = resultAuthentication.Enabled;
        self.isExpired = resultAuthentication.expired;
        self.isLocked = resultAuthentication.locked;

        //
        $("#btn-passwordRandom", content).click(function () {
            $.when(self.dataService.generateRandomPassword()).done(function (result) {
                $("#txtPasswordRequest", content).val(result.randomPassword);
            });
        });
        //
        $("#btn-updateRequest", content).click(function () {
            var password = $("#txtPasswordRequest").val();
            noEmptyField = self.validateKey();
            self.password = password;
            
            if (noEmptyField) {
                self.dataService.generateDataToSendByEmail({idUser: self.idUser}).done(function (response) {
                    self.showEmailtPopup(response);
                    self.updateUser();
                });
            }
            else {
                bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-users-request-emptyfields-message"), "Bizagi", "warning");
            }
        });
        //
        $("#btn-cancelRequest", content).click(function () {
            self.setupInitialData();
        });
    },

    /**
    * Switch Templates
    */
    switchContent: function (contentToDisplay) {
        var self = this;

        if (self.containtersID.DETAIL == contentToDisplay) {
            self.userRequestListWrapper.hide();
            self.userRequestDetailWrapper.show();
        }
        else {
            self.userRequestListWrapper.show();
            self.userRequestDetailWrapper.hide();
        }
    },

    /**
    * Update User
    */
    updateUser: function () {
        var self = this;
        var content = self.getContent();
        var expired = ($("#chkExpired", content).length == 1)? $("#chkExpired", content).is(":checked") : $("label[data-expired]",content).data("expired");
        var params = {
            idUser: self.idUser,
            password: self.password,
            enabled:  $("#chkActive").is(":checked"),
            expired: expired,
            locked:  $("#chkBlocked").is(":checked") };

        $.when(self.dataService.updateUserAuthenticationInfo(params)).done(function (result) {
            //    console.log(result);
        }).fail(function (error) {
            bizagi.log(error);
        });
    },

    /**
    * generate Random Password
    */
    setupFooterButtons: function () {
        var self = this;
        var content = self.getContent();
        var widgetButtonSet = $("#users-request-data-buttonset-Password", content);

        $("#btn-passwordRandom", widgetButtonSet).click(function () {
            $.when(self.dataService.generateRandomPassword()).done(function (result) {
                $("#txtPasswordRequest", content).val(result.randomPassword);
            });
        });
    },

    /**
    * generate Windows PopupContent email
    */
    showEmailtPopup: function (messageResponse) {
        var self = this;
        var doc = window.document;

        var template = self.getTemplate("users.requests.email");

        // Opens a dialog in order to upload Email
        var dialogBoxEmail = self.dialogBoxEmail = $("<div class= users-requests-email/>");
        dialogBoxEmail.empty();
        dialogBoxEmail.appendTo("body", doc);

        // Define buttons
        var buttonsEmail = {};

        buttonsEmail[self.getResource("workportal-widget-admin-users-requests-button-label-send")] = function () {
            // Select button Send
            var params = {
                eMailTo: $("#txtTextTo", dialogBoxEmail).val(),
                subject: $("#txtSubject", dialogBoxEmail).val(),
                body: $("#txtBody", dialogBoxEmail).val(),
                userSecret: self.getUserSecret(self.password)
            };

            $.when(self.dataService.sendUserEmail(params)).done(function () {
                self.closeUploadDialogEmail();
            });

            bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-users-request-Send-message"), "Bizagi", "warning");
        };

        // Cancel button Send
        buttonsEmail[self.getResource("workportal-widget-admin-users-requests-button-label-notSend")] = function () {
            self.closeUploadDialogEmail();
        };

        // Render template
        messageResponse.body = messageResponse.body.replace(/\\n/g, "\n").replace(/\\/g, "");
        $.tmpl(template, { messageResponse: messageResponse }).appendTo(dialogBoxEmail);
        $(".ui-bizagi-loading-message").remove();

        //Creates a dialog
        dialogBoxEmail.dialog({
            width: 500,
            title: self.getResource("workportal-widget-admin-users-request-subtitle-email"),
            modal: true,
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
        self.setupInitialData();
    },

    /**
    * Validate required fields
    */
    validateKey: function () {
        var self = this;
        var content = self.getContent();
        var fieldAreEmpty = false;

        if ($("#txtPasswordRequest", content).val() !== "") {
            fieldAreEmpty = true;
        }

        return fieldAreEmpty;
    },

    /**
     *
     * @param inputValue
     * @returns {*}
     */
    getUserSecret: function (inputValue) {
        var C = CryptoJS;
        var userFormsSpanner = C.enc.Utf8.parse("pc30n84e15lvdD68");
        var userFormsCode = CryptoJS.enc.Latin1.parse("1v00628X62bJE2mi");
        var aes = C.algo.AES.createEncryptor(userFormsSpanner, {
            mode: C.mode.CBC,
            padding: C.pad.Pkcs7,
            iv: userFormsCode
        });
        var resultMain = aes.finalize(inputValue);
        return C.enc.Base64.stringify(resultMain);
    }
});