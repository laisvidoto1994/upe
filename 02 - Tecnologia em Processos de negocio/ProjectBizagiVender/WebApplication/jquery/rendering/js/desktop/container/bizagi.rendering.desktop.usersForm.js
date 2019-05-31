/*
*   Name: Bizagi Rendering Users Form
*   Author: David Romero Estrada
*   Comments:
*   -   This script override rendering.form to create and update users
*/

bizagi.rendering.form.extend("bizagi.rendering.usersForm", {

    init: function (params) {

        var self = this;

        // Set observable element
        this.form = this.getFormContainer();
        this.observableElement = $({});
        this.collectedValues = {};
        self._super(params);
    },

    /*
    * Reimplement loading for users form
    */
    startLoading: function () {
        var self = this;
        var waitingTemplate = self.renderFactory.getTemplate("form-waiting");

        if (self.waitingOverlay && self.waitingMessage)
            return;

        var $canvas = $(self.params.canvas).closest(".ui-dialog");
        var position = $canvas.offset();

        self.waitingOverlay = $('<div class="ui-widget-overlay" />').appendTo($canvas);
        self.waitingMessage = $.tmpl(waitingTemplate).appendTo($('body', $(document)));

        self.waitingMessage.css({
            "top": position.top + (Math.ceil(($canvas.height() - self.waitingMessage.outerHeight()) / 2)) + "px",
            "left": position.left + (Math.ceil(($canvas.width() - self.waitingMessage.outerWidth()) / 2)) + "px"
        });
    },

    /*
    *   Method to process button actions in the form
    */
    processButtons: function () {
        var self = this;
        var buttons = self.getButtons();

        // Don't process buttons if they are undefined in the template
        if (!buttons || buttons.length == 0) {
            return;
        }

        if (self.properties.orientation == "rtl") {
            self.buttons.reverse();
        }

        // Attach a handler for each button
        buttons.click(function () {
            var button = $(this);
            var ordinal = button.attr("ordinal");
            var buttonProperties = self.buttons[ordinal];

            // Execute button
            self.processButton(buttonProperties);
        });
    },

    /*
    * Reimplement process button actions in users forms
    */
    processButton: function (buttonProperties) {
        var self = this;
        var properties = self.properties;

        // First hide and clear validation box
        self.validationController.clearValidationMessages();

        $.when(self.ready()).done(function () {

            var params = {
                formAction: "cancel",
                sendMail: false
            };
            switch (buttonProperties.action) {
                case "save":

                    var sendMailControl = self.form.getRender('sendMail');
                    var passwordControl = self.form.getRender('password');

                    var params = {
                        formAction: "save",
                        sendMail: (sendMailControl && sendMailControl.getValue()) || false,
                        password: passwordControl === null ? "" : passwordControl.getValue()
                    };

                    if (sendMailControl && passwordControl && params.sendMail && params.password === "") {
                        $.when(self.dataService.getConfiguration()).done(function (response) {
                            var minLength = response.passwordMinLength;
                            var maxLength = response.passwordMaxLength;
                            self.generateRandomPassword(passwordControl, minLength, maxLength);
                            params.password = passwordControl.getValue();
                            self.processSave(params);
                        }).fail(function (response) {
                            self.generateRandomPassword(passwordControl, 8, 12);
                            params.password = passwordControl.getValue();
                            self.processSave(params);

                            var obj = JSON.parse(response.responseText)
                            self.validationController.showValidationMessage(obj.message);
                        });
                    } else {
                        self.processSave(params);
                    }
                    break;
                case "cancel":
                    self.triggerHandler("endUsersForm", params);
                    break;
            }

        });
    },

    /*
    * Process save actions
    */
    processSave: function (params) {

        var self = this;

        // validate the form
        var valid = self.validationController.performValidations();

        if (valid) {
            self.startLoading();

            var saveDeferred;
            $.extend(self.collectedValues, self.collectRenderValuesForSubmit());

            var userFormData = {
                action: "SAVEUSER",
                contexttype: "entity",
                data: {},
                idPageCache: self.idPageCache
            };

            delete self.collectedValues.sendMail;
            delete self.collectedValues['@Metadata.Stakeholders'];

            if (self.params.action === "add") {
                saveDeferred = self.createUser(userFormData, params);
            }
            else if (self.params.action === "edit") {
                saveDeferred = self.updateUser(userFormData);
            }

            $.extend(params, userFormData.data);
            $.when(saveDeferred).done(function (response) {
                self.triggerHandler("endUsersForm", params);
            }).fail(function (response) {
                var obj = JSON.parse(response.responseText)

                self.endLoading();
                self.validationController.showValidationMessage(obj.message);
                self.triggerHandler("endUsersForm", $.extend(params, { error: obj }));
            });
        }
        else {
            self.validationController.expandNotificationBox();
        }
    },

    /**
    * Generates a random password between 8 and 12 characters
    * */
    generateRandomPassword: function (passwordControl, minLength, maxLenth) {
        var self = this;
        var length = self.getLengthPassword(minLength, maxLenth);

        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz";
        var randomPassword = '';
        for (var i = 0; i < length; i++) {
            var randomPosition = Math.floor(Math.random() * chars.length);
            randomPassword += chars.substring(randomPosition, randomPosition + 1);
        }
        passwordControl.saveValue(randomPassword);
    },

    /**
    * Generates a random length between minLength and maxLenth if both are defined, or between 8 and 12
    * */
    getLengthPassword: function (minLength, maxLenth) {
        minLength = (minLength && maxLenth) ? minLength : 8;
        maxLenth = (maxLenth && minLength) ? maxLenth : 12;
        return Math.floor(Math.random() * (maxLenth - (minLength - 1))) + minLength;
    },

    /*
    * Create User
    */
    createUser: function (userFormData, params) {

        var self = this;
        var collectedData = self.collectedValues;

        var expiredAccountControl = self.form.getRender('expiredAccount');
        var lockedAccountControl = self.form.getRender('lockedAccount');
        var domain = self.form.getRender('domain');

        //Add these parameters for the collected data
        collectedData.expiredAccount = (expiredAccountControl) ? expiredAccountControl.getValue() : null;
        collectedData.lockedAccount = (lockedAccountControl) ? lockedAccountControl.getValue() : null;
        collectedData.domain = (domain) ? domain.getValue() : "";

        // Data for first calling
        $.extend(userFormData, {
            data: {
                domain: collectedData.domain,
                fullName: collectedData.fullName,
                userName: collectedData.userName
            }
        });

        return $.when(self.dataService.submitData(userFormData)).pipe(function (response) {

            // After save the action change to be edition
            self.params.action = "edit";
            self.params.userId = response.idEntity;

            delete collectedData.userName;
            delete collectedData.domain;

            $.extend(userFormData, {
                data: collectedData,
                surrogatekey: response.idEntity
            });

            $.extend(params, {
                userId: response.idEntity
            });

            return self.dataService.submitData(userFormData);
        });

    },

    /*
    * Update user 
    */
    updateUser: function (userFormData) {
        var self = this;
        var collectedData = self.collectedValues;

        $.extend(userFormData, {
            surrogatekey: self.params.userId,
            data: collectedData
        });

        return self.dataService.submitData(userFormData);

    }

});
