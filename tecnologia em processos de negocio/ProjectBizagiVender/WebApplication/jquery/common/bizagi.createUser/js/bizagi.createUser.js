/**
 * Control to create users for Bizagi rendering
 * @author: Andr�s Felipe Arenas, Ricardo Alirio Perez
 */
(function ($) {
    $.fn.bizagiCreateUser = function (dataService, renderFactory, options) {
        var self = this;
        options = options || {};
        var canvas = options.canvas;
        onCreate = options.onCreate || function () {};
        onCancel = options.onCancel || function () {};
        displayName = bizagi.localization.getResource("workportal-widget-admin-user-profiles-button-label-newUserProfiles");

        var methods = {
            "init": function() {
                methods.addHandlers();
            },
            "addHandlers":function(){
                self.on("click", function () {
                    methods.newUser();
                });
            },
            "newUser":function(){
                var self = this;
                var params = {"h_action":"LOADUSERADMINFORM","h_contexttype":"entity","h_optionform":"add"};

                canvas.empty();
                $.tmpl("<div {{loading}}></div>").appendTo(canvas);

                dataService.getUsersForm(params).done(function (data) {
                    var rendering = new bizagi.rendering.facade();
                    var renderingParams = { canvas: canvas, data: data, type: "usersForm", userId: 0, action: "add" };

                    canvas.dialog('option', 'title', displayName);
                    rendering.execute(renderingParams).done(function (form) {
                        rendering.form.bind("endUsersForm", function (event, params) {
                            if(typeof params.error === "undefined"){
                                if (params.formAction === "save") {
                                    if (params.sendMail) {
                                        self.sendEmail(params.userId, params.password);
                                    }
                                    options.onCreate.resolve({iduser: params.userId, user: params.fullName});
                                    canvas.remove();
                                }
                                else if (params.formAction === "cancel") {
                                    options.onCancel();
                                }
                                form.endLoading();
                            }
                        });
                    });
                });
            },
            "sendEmail": function (userId, password) {
                var self = this;
                dataService.generateDataToSendByEmail({idUser: userId, password: password}).done(function (response) {
                    self.showEmailPopup(response, password);
                });
            },
            "showEmailPopup": function (messageResponse, password) {
                var self = this;
                var doc = window.document;
                var template = renderFactory.getTemplate("render-user-email");
                var dialogBoxEmail = self.dialogBoxEmail = $("<div class= admin-users-email/>");
                var buttonsEmail = {};

                dialogBoxEmail.empty();
                dialogBoxEmail.appendTo("body", doc);
                // Define buttons
                buttonsEmail[bizagi.localization.getResource("workportal-widget-admin-users-button-label-send")] = function () {
                    if ($("#txtTextTo", dialogBoxEmail).val() != "") {
                        // Select button Send
                        var params = {
                            eMailTo: $("#txtTextTo", dialogBoxEmail).val(),
                            subject: $("#txtSubject", dialogBoxEmail).val(),
                            body: $("#txtBody", dialogBoxEmail).val(),
                            userSecret: password
                        };

                        $.when(dataService.sendUserEmail(params)).done(function (result) {
                            self.closeUploadDialogEmail();
                            bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-users-Send-message"), "Bizagi", "warning");
                        });
                    }
                    else {
                        bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-admin-users-empty-email-to"), "Bizagi", "warning");
                    }
                };
                buttonsEmail[bizagi.localization.getResource("workportal-widget-admin-users-button-label-notSend")] = function () {
                    self.closeUploadDialogEmail();
                };
                //Creates a dialog
                dialogBoxEmail.dialog({
                    width: 500,
                    height: 400,
                    title: bizagi.localization.getResource("workportal-widget-admin-users-subtitle-email"),
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
                // Render template
                messageResponse.body = messageResponse.body.replace(/\\n/g, "\n").replace(/\\/g, "");
                $.tmpl(template, { messageResponse: messageResponse }).appendTo(dialogBoxEmail);
            },
            "closeUploadDialogEmail": function () {
                var self = this;
                self.dialogBoxEmail.dialog('destroy');
                self.dialogBoxEmail.remove();
            }
        };

        methods.init();
        return methods;
    }

})(jQuery);