/*
 *   Name:
 *   Author: Diego Parra
 *   Comments:
 *   -   This widget will implement a notifications box for the current page
 *
 *   Markup: <div></div>
 *   Must be appended to body
 *
 *   Styles:
 *       -   ui-bizagi-notifications-container
 *       -   ui-bizagi-notifications-content
 *       -   ui-bizagi-notifications-header
 *       -   ui-bizagi-notifications-item
 */

// TODO: Create templates

(function ($) {
    $.widget("ui.bizagi_notifications", {
        options: {
            containerAdditionalClass: "",
            headerAdditionalClass: "",
            contentAdditionalClass: "",
            itemAdditionalClass: "",
            itemIcon: "ui-icon-alert",
            title: "Notifications",
            minimized: true,
            clearEnabled: true,
            sendEnabled: false,
            location: "bottom",
            device: "desktop"
        },

        /*
        *   Constructor
        */
        _init: function () {
            var self = this,
                options = self.options,
                container = self.element;
            self.counter = 0;

            // Creates container
            container.addClass(options.containerAdditionalClass).addClass("ui-bizagi-notifications-container");

            if (options.orientation == "rtl") {
                container.addClass("ui-bizagi-notification-reverse");
            }

            // Set collapsed  / expanded class
            container.addClass(options.minimized ? "ui-bizagi-state-collapsed" : "ui-bizagi-state-expanded");

            // Creates content div
            var content = $("<div></div>")
                .addClass("ui-bizagi-notifications-content")
                .addClass(options.contentAdditionalClass)
                .addClass("ui-widget-content");

            // Creates header
            var header = $("<div></div>")
                .addClass("ui-bizagi-notifications-header")
                .addClass(options.headerAdditionalClass)
                .addClass("ui-widget-header")
                .addClass("ui-state-active");

            if (options.device !== "desktop") {
                header.data("expanded", !options.minimized).html("<label>" + options.title + "</label>");
            } else {
                header.data("expanded", !options.minimized).text(options.title);
            }

            // Add / Remove hover class
            header.mouseenter(function () { container.addClass("ui-bizagi-state-hover"); });
            header.mouseleave(function () { container.removeClass("ui-bizagi-state-hover"); });

            self.expandedIcon = options.location === "bottom" ? "bz-icon-expanded" : "bz-icon-collapsed";
            self.collapsedIcon = options.location === "bottom" ? "bz-icon-collapsed" : "bz-icon-expanded";

            if (options.device === "desktop") {
                // When desktop use header icon
                self.headerButton = $("<span />")
                    .addClass("ui-bizagi-notifications-box-button")
                    .addClass("ui-icon")
                    .addClass(options.minimized ? self.collapsedIcon : self.expandedIcon)
                    .appendTo(header)
                    .click(function () {
                        self.onHeaderClick();
                    });

            } else {
                header.click(function () {
                    self.onHeaderClick();
                });

                // Add Header button
                self.headerButton = $("<span />")
                    .addClass("ui-bizagi-notifications-box-button")
                    .addClass("ui-icon")
                    .addClass(options.minimized ? self.collapsedIcon : self.expandedIcon)
                    .appendTo(header);
            }

            // Close button
            var closeButton = $("<span />").addClass("ui-bizagi-notifications-close-button").appendTo(header);
            $("<span />").addClass("bz-mo-icon").addClass("bz-cancel").appendTo(closeButton);

            // Clear button
            if (options.clearEnabled) {
                // Add button
                var clearButton = $("<span />").addClass("ui-bizagi-notifications-clear-button")
                    .appendTo(header).click(function () {
                        self.clearAll(false);
                    });

                // Add icon
                $("<span />").addClass("bz-mo-icon").addClass("bz-trash-icon").appendTo(clearButton);
            }

            // Send button
            if (options.sendEnabled) {
                // Add button
                var sendButton = $("<span />").addClass("ui-bizagi-notifications-send-button")
                    .appendTo(header).click(function () {
                        self.sendMail();
                    });

                // Add icon
                $("<span />").addClass("bz-mo-icon").addClass("bz-send").appendTo(sendButton);
            }

            // Arrange elements
            container.append(header)
                .append(content);

            // Set as floating
            if (options.location == "bottom") {
                container.addClass("ui-bizagi-notifications-container-bottom");
            }

            if (options.minimized) {
                content.hide();
            }

            // Keep references
            self.content = content;
            self.header = header;
        },

        /* 
        *   Add a validation message
        */
        addNotification: function (message, data, icon, itemAdditionalClass, clickCallback) {
            if (message) {
                if (message.replace) {
                    var self = this;
                    var options = self.options;
                    var container = self.element;
                    var content = self.batchMode ? self.batchContent : self.content;

                    /*//This code is for lock more than 1 error in the message box
                     var enableNotification = self.content.closest(".ui-bizagi-log-container").length === 0;
                     if (enableNotification && (options.device === "smartphone_ios" || options.device === "smartphone_android") && self.counter >= 1) {
                     return;
                     }*/

                    icon = icon || options.itemIcon;
                    itemAdditionalClass = itemAdditionalClass || options.itemAdditionalClass;
                    if (typeof message != "string") {
                        message = message.toString();
                    }

                    message = bizagi.util.encodeHtml(message.replace(/<(\/?(?:STRONG|FONT))>/gi, "#$1!#"));
                    message = message.replace(/#(\/?(?:STRONG|FONT))!#/gi, "<$1>");
                    message = message.replace(/\n|\r/g, "<br/>");

                    var item = $("<div class='ui-bizagi-notification-item " + itemAdditionalClass + " ui-widget-content'>" +
                        "<span class='bz-mo-icon " + icon + "' />" +
                        "<label>" + message + "</label>" +
                        "</div>").appendTo(content);

                    // Scroll to this control
                    if (!self.batchMode && self._hasScrollBar()) {
                        item[0].scrollIntoView();
                    }

                    // Bind click event
                    item.bind("click", function () {
                        // Trigger event
                        container.triggerHandler("itemClick", {data: data});
                        if (clickCallback) {
                            clickCallback({data: data});
                        }
                    });

                    if (!self.batchMode) {
                        self.show();
                    }

                    self.counter++;
                }
            }
        },

        /*
        *   Clear all messages
        */
        clearAll: function (hide) {
            var self = this,
                content = self.content;

            hide = hide === undefined ? true : hide;

            // Clear all data
            bizagi.util.removeItemLocalStorage("bizagi.mobility.trace");

            content.empty();
            self.counter = 0;

            if (hide) {
                self.hide();
            } else {
                self.show();
            }
        },

        sendMail: function() {
            var strData = bizagi.util.getItemLocalStorage("bizagi.mobility.trace");
            if (!strData) {
                bizagi.showMessageBox(bizagi.localization.getResource("bz-rp-nodata"), "Error");
                return;
            }

            if (!bizagi.util.isCordovaSupported()) {
                return;
            }

            window.plugin.email.isAvailable(function(isAvailable) {
                if (!isAvailable) {
                    bizagi.showMessageBox("The e-mail service is currently not available.", "Error");
                    return;
                }

                var attachmentLog = "base64:bizagi-mobile-log.txt//" + bizagi.util.b64EncodeUnicode(strData);
                var strBody = "<p>A log file has been attached</p><br />" +
                    "<p> Powered by Bizagi Mobile Application</p><br />";

                cordova.plugins.email.open({
                    subject: "Bizagi Mobile - Log Report",
                    body: strBody,
                    isHtml: true,
                    attachments: [attachmentLog]
                });
            });
        },
       
        /*
        *   Show the notifications box
        */
        show: function () {
            var self = this,
                container = self.element;

            // Show container
            if (!self.isContentVisible()) {
                container.fadeIn();
            }
        },

        /*
        *   Hide the notifications box
        */
        hide: function () {
            var self = this,
                container = self.element;

            // Hide container
            if (self.isContentVisible()) {
                container.hide();
            }
        },

        /*
        *   Returns the number of notifications
        */
        count: function () {
            var self = this,
                content = self.content;

            // Hide container
            return content.children().size();
        },

        /*
        *   Check if the content has scroll bars or not
        */
        _hasScrollBar: function () {
            var self = this,
                content = self.content;

            // If container is not visible return false
            if (!self.isContentVisible()){
                return false;
            }

            return bizagi.util.hasScroll(content, "vertical");
        },

        /*
        *   Toogles container view
        */
        onHeaderClick: function () {
            var self = this;

            if (self.isExpanded()) {
                self.collapse();

            } else {
                self.expand();
            }
        },

        /*
        *   Method to check if the container is expanded or not
        */
        isExpanded: function () {
            var self = this,
                header = self.header;

            return (header.data("expanded") === true);
        },

        /*
        *   Collapses the container
        */
        collapse: function () {
            var self = this,
                container = self.element,
                headerButton = self.headerButton,
                header = self.header;

            // Collapse
            headerButton.removeClass(self.expandedIcon);
            headerButton.addClass(self.collapsedIcon);
            header.data("expanded", false);

            container.removeClass("ui-bizagi-state-expanded");
            container.addClass("ui-bizagi-state-collapsed");
            self.content.hide();
        },

        /*
        *   Expand the container
        */
        expand: function () {
            var self = this,
                container = self.element,
                headerButton = self.headerButton,
                header = self.header;

            // Expand
            headerButton.removeClass(self.collapsedIcon);
            headerButton.addClass(self.expandedIcon);
            header.data("expanded", true);

            container.removeClass("ui-bizagi-state-collapsed");
            container.addClass("ui-bizagi-state-expanded");
            self.content.show();
        },

        /*
        * Auto select first error element
        */
        autoFocusFirstError: function () {
            var self = this;
            var container = self.content;
            window.setTimeout(function () {
                $("div:first", container).click();
            }, 9000);

        },

        /*
        * Starts the batch mode
        */
        initBatch: function () {
            var self = this;
            self.batchMode = true;
            self.batchContent = $("<div></div>");
        },

        /*
        * Ends the batch mode
        */
        endBatch: function () {
            var self = this;
            self.batchMode = false;

            // Perform batch
            self.batchContent.children().appendTo(self.content);
            self.batchContent.detach();
            self.batchContent = null;
            if (self.content.children().length > 0) {
                self.show();
            }
        },

        /*
        * Check if content is visible
        */
        isContentVisible: function () {
            var self = this;
            var content = self.content;
            var element = self.element;
            return element.length > 0 && element.css("display") != "none" &&
	    	        content.length > 0 && content.css("display") != "none";
        }
    });
})(jQuery);