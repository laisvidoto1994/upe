/* 
* send email control for Bizagi rendering
* @author: Manuel Alexander Mejia Garzon
*/

(function ($) {
    $.fn.bizagiSendEmail = function (options) {

        var self = this;

        //Define options
        options = options || {};

        var opt = {
            emailDialog: null,
            buttons: {},
            isClicked: false,
            title: bizagi.localization.getResource("render-dialog-sendemail-title"),
            properties: {}
        };

        // Extend options
        $.extend(opt, opt, options);

        /*
        * Initialize plugin
        */
        function init() {

            configureHandlers();
        }

        /*
        * Adds handler to element
        */
        function configureHandlers() {
            self.click(function () {
                showEmailForm();
            });
        }

        /*
        * Shows the email form with fields (to, subject, message)
        */
        function showEmailForm() {

            var doc = window.document;
            opt.emailDialog = $("<div/>");
            opt.emailDialog.appendTo("body", doc);

            createButtons();
            applyDialog();
            renderSendEmailtemplate();
        }

        /*
        * Assign handler to send and cancel buttons
        */
        function createButtons() {
            if (opt.properties.orientation == "rtl") {
                opt.buttons[bizagi.localization.getResource("text-cancel")] = cancelButtonHandler;
                opt.buttons[bizagi.localization.getResource("render-dialog-sendemail-send")] = sendButtonHandler;
            } else {
                opt.buttons[bizagi.localization.getResource("render-dialog-sendemail-send")] = sendButtonHandler;
                opt.buttons[bizagi.localization.getResource("text-cancel")] = cancelButtonHandler;
            }
        }

        /*
        * Handler to send button
        */
        function sendButtonHandler(e) {
            e.stopPropagation();

            if (validateData() == true) {
                if (!opt.isClicked) {
                    opt.isClicked = true;
                    $.when(callSendEmailService())
                        .done(function (data) {
                            if (data.success) { showSuccessMessage(); }
                            else { showFailMessage(); }
                        })
                        .fail(function () {
                            showFailMessage();
                        })
                        .always(function () {
                            hideEmailContent();
                        });
                    opt.isClicked = false;
                }
            }
            else {
                addValidations();

            }
        }

        /*
        * Handler to cancel button
        */
        function cancelButtonHandler() {

            opt.isClicked = false;
            opt.emailDialog.dialog('destroy');
            opt.emailDialog.detach();
        }

        /*
        * Aplies dialog plugin 
        */
        function applyDialog() {

            opt.emailDialog.dialog({
                dialogClass: "emailDialog",
                width: 500,
                height: 500,
                minHeight: 400,
                minWidth: 500,
                title: opt.title,
                modal: true,
                buttons: opt.buttons,
                close: function () {
                    cancelButtonHandler();
                },
                resizeStop: function (event, ui) {

                },
                maximize: function () {
                    // Next lines if the current document is inside an Iframe.
                    if (window.self !== window.top) {
                        if (typeof (opt.emailDialog.parent()) != "undefined") {
                            var w = window,
                                d = document,
                                e = d.documentElement,
                                g = d.getElementsByTagName('body')[0],
                                y = w.innerHeight || e.clientHeight || g.clientHeight;
                            opt.emailDialog.parent().height(y - 10);
                        }
                    }
                }
            });
        }

        /*
        * render send email template 
        */
        function renderSendEmailtemplate() {

            $.tmpl(opt.tmpl, {
                items: getFilesInfo()
            }).appendTo(opt.emailDialog);

            $("#to", opt.emailDialog).focus();
        }

        /*
        * Get the info of files attached to control
        */
        function getFilesInfo() {
            var values = [];

            for (var i = 0, l = opt.self.value.length; i < l; i++) {
                var item = opt.self.value[i];
                values.push({ id: item[0], name: item[1] });
            }

            return values;
        }

        /*
        * Calls to send email service
        */
        function callSendEmailService() {

            return opt.dataService.sendEmail({
                xpath: opt.xpath,
                xpathContext: opt.xpathContext,
                idPageCache: opt.properties.idPageCache,
                idRender: opt.properties.id,
                to: getEmailAddressParameter(),
                subject: getSubjectParameter(),
                message: getMessageParameter(),
                selected: getItemsSelected()

            });

        }

        /*
        * Returns the email to
        */
        function getEmailAddressParameter() {
            return $("#to", opt.emailDialog).val();
        }

        /*
        * Returns the email subject
        */
        function getSubjectParameter() {
            return $("#subject", opt.emailDialog).val() || "";
        }

        /*
        * Returns the email Message
        */
        function getMessageParameter() {
            return $("#message", opt.emailDialog).val() || "";
        }

        /*
        * Returns the attached files
        */
        function getItemsSelected() {

            var selected = $("input:checked", opt.emailDialog);
            return $.map(selected, function (item, _) {
                return $(item).data("id");
            });

        }

        /*
        * Validate la data before to send the email
        */
        function validateData() {

            clearValidations();

            if (isFieldEmpty(getEmailAddressParameter())) {
                opt.validations.push(bizagi.localization.getResource("render-dialog-sendemail-emptyfield-email"));
            } else {
                var email = $("#to", opt.emailDialog).val();
                if (!(isEmail(email))) {
                    opt.validations.push(bizagi.localization.getResource("render-dialog-sendemail-error-email"));
                }
            }
            if (isFieldEmpty(getSubjectParameter())) {
                opt.validations.push(bizagi.localization.getResource("render-dialog-sendemail-emptyfield-subject"));
            }
            if (getItemsSelected() == 0) {
                opt.validations.push(bizagi.localization.getResource("render-dialog-sendemail-emptyfield-documents"));
            }

            return (opt.validations.length != 0) ? false : true;
        }

        /*
        * Add validations to form
        */
        function addValidations() {

            var messageExceptions = "";
            for (var i = 0, l = opt.validations.length; i < l; i++) {
                messageExceptions += opt.validations[i] + "<br/>";
            }

            var message = $(".biz-dialog-alert-email-message", opt.emailDialog);
            message.html(messageExceptions);

        }

        /*
        * Return true if e-mail data is correct
        */
        function isEmail(email) {
            var emailReg = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

            // check multiple emails
            var emails = [], j = 0, valid = true;
            if (typeof email === "string" && email.length > 0) {
                var i = 0;
                var commaChunks = email.split(",");
                var semicolonChunks = email.split(";");
                if (commaChunks.length !== semicolonChunks.length) {
                    if (commaChunks.length > semicolonChunks.length) {
                        for (; i < commaChunks.length; ) {
                            emails.push(bizagi.util.trim(commaChunks[i++]));
                        }
                    } else {
                        for (; i < semicolonChunks.length; ) {
                            emails.push(bizagi.util.trim(semicolonChunks[i++]));
                        }
                    }
                } else {
                    var spacedChunks = email.split(" ");
                    if (spacedChunks.length > 1) {
                        for (; i < spacedChunks.length; ) {
                            var value = spacedChunks[i++];
                            if (!!value) {
                                emails.push(value);
                            }
                        }
                    }
                }
            }

            if (emails.length > 0) {
                for (; j < emails.length; ) {
                    valid = emailReg.test(emails[j++]);
                    if (!valid) {
                        break;
                    }
                }
                return valid;
            } else {
                return emailReg.test(email);
            }
        }

        /*
        * Return true if data is empty
        */
        function isFieldEmpty(data) {
            return bizagi.util.isEmpty(data);
        }

        /*
        * Clean current validations in the form
        */
        function clearValidations() {
            opt.validations = [];
        }

        /*
        * Hide email setup
        */
        function hideEmailContent() {
            var content = $(".biz-dialog-send-email-content", opt.emailDialog);
            var sendButton = $(".emailDialog .ui-dialog-buttonset > button")[0];
            var cancelButton = $(".emailDialog .ui-dialog-buttonset > button")[1];
            var closeText = bizagi.localization.getResource("render-form-dialog-box-close");
            $(sendButton).hide();
            if ($(cancelButton))
                $(cancelButton).children(0).text(closeText);
            content.hide();
        }

        function showSuccessMessage() {
            var message = $(".biz-dialog-send-email-message", opt.emailDialog);
            message.html(bizagi.localization.getResource("render-dialog-sendemail-sucess"));
        }

        function showFailMessage() {
            var message = $(".biz-dialog-send-email-message", opt.emailDialog);
            message.html(bizagi.localization.getResource("render-dialog-sendemail-fail"));
        }

        // Init plugin
        init();
    };
})(jQuery);