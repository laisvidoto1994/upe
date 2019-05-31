/*
*   Name: BizAgi Messaging Feature
*   Author: Diego Parra
*   Comments:
*   -   This script will define global definitions to show standard message boxes
*/

// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};

/*
*   Show confirmation box
*   return a deferred with a promise to be resolved or rejected by the user
*/
bizagi.showConfirmationBox = function(message, title, showIcon, buttons, customOptions) {
    var doc = window.document;
    var defer = new $.Deferred();
    customOptions = customOptions || {};

    // Set default title
    title = title || bizagi.localization.getResource("confirmation-box-title");
    showIcon = bizagi.util.isEmpty(showIcon) != null ? showIcon : true;

    if (bizagi.util.isMobileDevice()) {

        var onConfirm;
        var localButtons = [];
        var localButtonsActions = [];

        if (bizagi.util.isCordovaSupported() && typeof (buttons) !== "undefined") {
            if (buttons.length > 0) {
                for (var i = 0; i < buttons.length; i++) {
                    localButtons[i] = buttons[i].label;
                    localButtonsActions[i] = buttons[i].action;
                }

                onConfirm = function(buttonIndex) {
                    buttonIndex--;
                    if (localButtonsActions[buttonIndex] === "resolve") {
                        defer.resolve();
                    } else if (localButtonsActions[buttonIndex] === "reject") {
                        defer.reject();
                    }
                };
            } else {
                onConfirm = function(buttonIndex) {
                    if (buttonIndex === 1) { //save
                        defer.resolve();
                    } else if (buttonIndex === 2) { //don't save
                        defer.reject();
                    }
                };
                localButtons = [
                    bizagi.localization.getResource('confirmation-savebox-save'),
                    bizagi.localization.getResource('confirmation-savebox-dontsave'),
                    bizagi.localization.getResource('confirmation-savebox-cancel')
                ];
            }

            navigator.notification.confirm(message, onConfirm, title, localButtons);

        } else if (bizagi.util.isCordovaSupported()) {
            onConfirm = function(buttonIndex) {
                if (buttonIndex === 1) { // Ok
                    defer.resolve();
                } else if (buttonIndex === 2) { // cancel
                    defer.reject();
                }
            };

            localButtons = [
                bizagi.localization.getResource("confirmation-box-ok"), bizagi.localization
                .getResource('confirmation-box-cancel')
            ];

            navigator.notification.confirm(message, onConfirm, title, localButtons);
        } else {
            if (window.confirm(message.replace(/(<([^>]+)>)/ig, ""))) {
                defer.resolve();
            } else {
                defer.reject();
            }
        }
    } else {
        var dialogTemplate = bizagi.getTemplate("common.bizagi.desktop.dialog-confirmation");

        // Load template
        $.when(bizagi.templateService.getTemplate(dialogTemplate))
            .then(function(template) {
                var confirmationBox = $.tmpl(template, {
                    message: message,
                    showIcon: showIcon
                }).appendTo("body", doc);

                // Define buttons
                var buttons = {};
                buttons[bizagi.localization.getResource("confirmation-box-ok")] = function() {
                    confirmationBox.dialog('close');
                    defer.resolve();
                };
                buttons[bizagi.localization.getResource("confirmation-box-cancel")] = function() {
                    confirmationBox.dialog('close');
                    defer.reject();
                };

                // Creates a dialog
                confirmationBox.dialog({
                    dialogClass: customOptions.dialogClass || "bz-ui-common-dialog",
                    resizable: false,
                    minHeight: customOptions.minHeight || 140,
                    minWidth: customOptions.minWidth || 300,
                    width: customOptions.width || "auto",
                    modal: true,
                    allowmaximize: false,
                    title: title,
                    buttons: buttons,
                    close: function(ev, ui) {
                        confirmationBox.dialog('destroy');
                        confirmationBox.detach();
                    }
                });
            });
    }

    return defer.promise();
};
/*
* Show Save Box
*
*/
bizagi.showSaveBox = function(message, title, showIcon, orientation) {

    var doc = window.document;
    var defer = new $.Deferred();
    var reverseButtons = orientation === "rtl" ? true : false;

    // Set default title
    title = title || bizagi.localization.getResource("confirmation-box-title");
    showIcon = bizagi.util.isEmpty(showIcon) != null ? showIcon : true;

    if (bizagi.util.isMobileDevice()) {
        if (bizagi.util.isCordovaSupported()) {
            var localButtons = [
                bizagi.localization.getResource('confirmation-savebox-save'),
                bizagi.localization.getResource('confirmation-savebox-dontsave'),
                bizagi.localization.getResource('confirmation-savebox-cancel')
            ];

            navigator.notification.confirm(
                message,
                function(buttonIndex) {
                    if (buttonIndex === 0 || buttonIndex === 1) {
                        defer.resolve();
                    } else if (buttonIndex === 2) {
                        defer.reject();
                    }
                },
                title,
                localButtons
            );
        } else {
            if (window.confirm(message.replace(/(<([^>]+)>)/ig, ""))) {
                defer.resolve();
            } else {
                defer.reject();
            }
        }

    } else {
        var dialogTemplate = bizagi.getTemplate("common.bizagi.desktop.dialog-confirmation");

        // Load template
        $.when(bizagi.templateService.getTemplate(dialogTemplate))
            .then(function(template) {
                var confirmationBox = $.tmpl(template, {
                    message: message,
                    showIcon: showIcon
                }).appendTo("body", doc);

                // Define buttons
                var buttons = [];
                buttons[0] = {
                    text: bizagi.localization.getResource('confirmation-savebox-save'),
                    click: function() {
                        confirmationBox.dialog('close');
                        defer.resolve();
                    }
                }
                buttons[1] = {
                    text: bizagi.localization.getResource('confirmation-savebox-dontsave'),
                    click: function() {
                        confirmationBox.dialog('close');
                        defer.reject();
                    }
                }
                buttons[2] = {
                    text: bizagi.localization.getResource('confirmation-savebox-cancel'),
                    click: function() {
                        confirmationBox.dialog('close');
                        defer.reject("cancel");
                    }
                }

                if (reverseButtons)
                    buttons.reverse();

                // Creates a dialog
                confirmationBox.dialog({
                    resizable: false,
                    minHeight: 140,
                    width: 400,
                    modal: true,
                    allowmaximize: false,
                    title: title,
                    buttons: buttons,
                    close: function(ev, ui) {
                        confirmationBox.dialog('destroy');
                        confirmationBox.detach();
                    }

                });
            });
    }

    return defer.promise();

}

/*
*   Show message box
*   return a deferred with a promise to be resolved or rejected by the user
*/
bizagi.showMessageBox = function(message, title, icon, maximize) {
    var doc = window.document;
    var defer = new $.Deferred();

    // Set default title
    icon = icon || "info";
    title = title || "Bizagi";

    maximize = (typeof maximize === "boolean") ? maximize : true;

    if (bizagi.util.isMobileDevice()) {
        if (bizagi.util.isCordovaSupported()) {
            navigator.notification.alert(
                message.replace(/(<([^>]+)>)/ig, ""), // message
                function() {}, // callback
                "Bizagi", // title
                "Ok" // buttonName
            );
        } else {
            window.alert(message.replace(/(<([^>]+)>)/ig, ""));
        }
        defer.resolve();
    } else {

        var dialogTemplate = bizagi.getTemplate("common.bizagi.desktop.dialog-message");

        // Load template
        $.when(bizagi.templateService.getTemplate(dialogTemplate))
            .then(function(template) {
                var messageBox = $.tmpl(template, {
                    message: message,
                    icon: bizagi.getIcon(icon)
                }).appendTo("body", doc);

                // Define buttons
                var buttons = {};
                buttons[bizagi.localization.getResource("confirmation-box-ok")] = function() {
                    messageBox.dialog('close');
                    defer.resolve();
                };

                // Creates a dialog
                messageBox.dialog({
                    modal: true,
                    title: title,
                    height: "auto",
                    resizable: false,
                    maximize: false,
                    draggable: false,
                    buttons: buttons,
                    close: function(ev, ui) {
                        messageBox.dialog('destroy');
                        messageBox.detach();
                    }
                });

            });
    }

    return defer.promise();
};

/*
*   Returns an icon based on jquery ui css
*/
bizagi.getIcon = function getIcon(icon) {
    icon = icon || "ui-icon-bullet";

    if (icon === "info") {
        return "ui-icon-info";
    }

    if (icon === "warning") {
        return "ui-icon-alert";
    }

    if (icon === "error") {
        return "ui-icon-circle-close";
    }

    if (icon === "success") {
        return "ui-icon-check";
    }

    return icon;
};
