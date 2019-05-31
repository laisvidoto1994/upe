/*
*   Name: BizAgi Workportal Tablet Menu Controller
*   Author: Andres Valencia 
*   Comments: Overrides menu controller class to apply custom stuff just for tablet device
*/

// Auto extend
bizagi.workportal.controllers.menu.extend("bizagi.workportal.controllers.menu", {
    DEVICE_TABLET_IOS: "tablet",
    DEVICE_TABLET_ANDROID: "tablet_android"
}, {
    /*
    *   Renders the content for the current controller
    *   Returns a deferred because it has to load the current user
    */
    renderContent: function () {
        var self = this;
        var template = self.workportalFacade.getTemplate("menu");
        var defer = new $.Deferred();        

        if (bizagi.util.hasOfflineFormsEnabled()) {
            self.hasOfflineForm = true;
        } else {
            BIZAGI_ENABLE_OFFLINE_FORMS = false;
            self.hasOfflineForm = BIZAGI_ENABLE_OFFLINE_FORMS;
        }

        // Status Connection 
        self.modeInbox = self.dataService.online || !self.hasOfflineForm ? "inbox" : "true";

        // Define initial Local Storage
        if (bizagi.util.getItemLocalStorage("inputtray") === null) {
            bizagi.util.setItemLocalStorage("inputtray", self.modeInbox);
        }

        // Get Current User
        $.when(self.dataService.getCurrentUser()).done(function (data) {
            // Define Global information to actual user
            bizagi.currentUser = data;
            // Render content                
            var content = self.content = $.tmpl(template, $.extend(data, {
                environment: bizagi.loader.environment || "",
                build: bizagi.loader.build,
                base64image: "",
                isOnline: self.dataService.online || !self.hasOfflineForm,
                hasOfflineForm: self.hasOfflineForm
            }));

            defer.resolve(content);
        });

        return defer.promise();
    },

    /* POST RENDER ACTIONS
    =================================================*/
    postRender: function () {

        var self = this;
        var content = self.getContent();

        self.toggleMenuVisibility();
        self.renderMenuItems();
        self.toggleInboxViews();

        $(content).delegate('#logout', 'click', function () {
            if (self.dataService.online == false) {
                var resp = window.confirm(self.resources.getResource("confirmation-savebox-message3"));
                if (resp == true) {
                    self.defaultLogout();
                }
            } else {
                $.when(self.dataService.logoutUser())
                    .done(function (response) {
                        self.defaultLogout();
                    })
                    .fail(function (fail) {
                        self.defaultLogout();
                    });
            }
        });
    },

    defaultLogout: function () {
        var self = this;

        if (bizagi.util.isCordovaSupported()) {
            window.location = bizagi.services.ajax.logoutPage;
        } else {
            window.location.replace("");
        }
    },

    toggleMenu: function () {

        var self = this;
        var content = self.getContent();
        $(content).toggleClass('show-menu hide-menu');

        if ($(content).hasClass('show-menu')) {
            //todo: el self.getComponentContainer("workportal") presenta bug pierde memoria referencias
            $(".ui-bizagi-workportal-workarea").bind("click.menu", function () {
                self.toggleMenu();
            });
        } else {
            //hide all open modals elements
            $(".modal").remove();
            $(".ui-bizagi-workportal-workarea").unbind("click.menu");
        }

    },


    /* TOGGLES MENU VISIBILITY 
    =================================================*/
    toggleMenuVisibility: function () {

        var self = this;
        var content = self.getContent();

        $('#menu-visible-bar', content).delegate('#menu-toggler', 'click', function () {
            self.toggleMenu();
        });
    },

    /* RENDER MENU ITEMS
    =================================================*/
    renderMenuItems: function () {
        var self = this;
        var device = bizagi.detectDevice();
        var content = self.getContent();
        var menuItemsTmpl = self.workportalFacade.getTemplate("menu.items");

        self.security = new bizagi.workportal.command.security(self.dataService);

        $.when(self.security.getSecurity()).done(function (menuItems) {

            // Enable native preferences for smartphone Android
            var enableSettings = bizagi.detectDevice() === self.Class.DEVICE_TABLET_ANDROID && bizagi.util.isCordovaSupported();

            // DISABLE ADMINISTRATION MENU ITEMS ON THIS RELEASE
            menuItems.CurrentUserAdministration = false;
            menuItems.Admin = false;
            menuItems.enableSettings = enableSettings || false;
            menuItems.hasOfflineForm = self.hasOfflineForm;

            var html = $.tmpl(menuItemsTmpl, menuItems, {
                reportsSecurity: function () {
                    if (menuItems.AnalysisReports || menuItems.AnalysisQueries) {
                        return true;
                    } else
                        return false;
                }
            });

            $("#menu-items", content).append(html);

            $(content).delegate("#menu-reports", "click", function (e) {
                e.stopPropagation();
                self.renderReportsMenu();
            });

            // Handle new case icon click
            $(content).delegate("#new-case", "click", function (e) {
                e.stopPropagation();
                if (self.dataService.online || self.hasOfflineForm) {
                    self.showNewCasePopup();
                }
            });

            if (self.hasOfflineForm) {
                // Handle inbox icon click
                $(content).delegate("#inbox-shortcut", "click", function (e) {
                    e.stopPropagation();

                    var actualWidget = self.getCurrentWidget();
                    var inputTray = bizagi.util.getItemLocalStorage("inputtray");

                    if (inputTray === "inbox" && !self.dataService.online)
                        inputTray = "true";

                    self.publish("changeWidget", {
                        widgetName: actualWidget,
                        inputtray: inputTray
                    });

                    // Close popups
                    bizagi.workportal.tablet.popup.closePopupInstance();
                    if (device == self.Class.DEVICE_TABLET_ANDROID) {
                        $(".modal").remove();
                    } else {
                        // Automatically hide the menu content after user click
                        self.toggleMenu();
                    }

                    self.hideBackButton();

                    self.hideReportsIcon();
                });
            } else {
                $(content).delegate("#inbox-shortcut", "click", function (e) {
                    e.stopPropagation();

                    var actualWidget = self.getCurrentWidget();

                    self.publish("changeWidget", {
                        widgetName: actualWidget
                    });

                    // Close popups
                    bizagi.workportal.tablet.popup.closePopupInstance();

                    if (device == self.Class.DEVICE_TABLET_ANDROID) {
                        $(".modal").remove();
                    } else {
                        // Automatically hide the menu content after user click
                        self.toggleMenu();
                    }

                    self.hideBackButton();

                    self.hideReportsIcon();
                });
            }

            // Handle search icon click
            $(content).delegate('#settings-shortcut', 'click', function (e) {
                e.stopPropagation();
                if (bizagi.detectDevice() == self.Class.DEVICE_TABLET_ANDROID && bizagi.util.isCordovaSupported()) {
                    window.Bizagi.showSettingsActivity();
                }
            });

            // Handle search icon click
            $(content).delegate("#search", "click", function (e) {
                e.stopPropagation();
                self.showSearchPopup($(this));
            });

            // TODO: Implement preferences
            $(content).delegate("#preferences", "click", function (e) {
                e.preventDefault();
            });

        });
    },

    /* SHOW REPORT MENU
    =================================================*/
    renderReportsMenu: function () {

        var self = this;
        var content = self.getContent();

        // Switch buttonstyle
        $("#menu-items #menuListReports", content).addClass("active");

        // If the same popup is opened close it
        if (self.currentPopup == "subMenu") {
            bizagi.workportal.tablet.popup.closePopupInstance();
            return;
        }

        // Shows a popup widget
        self.currentPopup = "subMenu";
        self.publish("popupWidget", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_REPORTS_MENU,
            options: {
                sourceElement: "#menu-items #menuListReports",
                width: '339',
                height: 'auto',
                offset: "10 25",
                activeScroll: true,
                css_class: 'bz-wp-menu-reports',
                closed: function () {
                    self.currentPopup = null;
                    $("#menu-items #menuListReports", content).removeClass("active");

                },
                menuData: self.getSubMenuData(self.jsonSecurityList, "AnalysisReports")
            }
        });
    },

    /* GET SUBDATA FOR REPORT MENU
    =================================================*/
    getSubMenuData: function (data, category) {
        var self = this;
        var result = [];
        var prefix = "workportal-menu-submenu-";
        data = data || self.security.getRawData() || {};
        if (self.checkRootCategory(data, category)) {
            $.each(self.getsRootCategory(data, category), function (k, v) {
                result.push(
                {
                    "categoryKey": v,
                    "categoryName": self.getResource(prefix + v),
                    "categoryUrl": self.dataService.getUrl({
                        "endPoint": v
                    })
                });
            });
        }
        return result;
    },

    /* CHECKS ROOT CATEGORY
    =======================================*/
    checkRootCategory: function (data, key) {
        if (data.permissions != undefined) {
            for (var i = 0; i < data.permissions.length; i++) {
                if (data.permissions[i][key] != undefined) {
                    return true;
                }
            }
        }
        return false;
    },

    /* GET ROOT CATEGORY
    =======================================*/
    getsRootCategory: function (data, key) {
        for (var i = 0; i < data["permissions"].length; i++) {
            if (data["permissions"][i][key] != undefined) {
                return data["permissions"][i][key];
            }
        }
        return {};
    },

    /* CREATE A GENERIC MENU POPOVER
    =======================================*/
    showMenuPopup: function (options) {
        var self = this;
        var content = self.getContent();

        var popup = new bizagi.workportal.tablet.popup(self.dataService, self.workportalFacade, {
            sourceElement: options.buttonSelector,
            my: options.my || "center top",
            at: options.at || "center bottom",
            offset: options.offset,
            height: options.height,
            width: options.width,
            css_class: 'search-widget'
        });

        // If the same popup is opened close it
        if (self.currentPopup == options.buttonSelector) {
            bizagi.workportal.tablet.popup.closePopupInstance();
            return;
        }

        // Shows the popup
        self.currentPopup = options.buttonSelector;

        var result = popup.render($.tmpl(self.workportalFacade.getTemplate(options.template)), {
            elmToAppend: content
        });

        // Adds the active class for buttons
        $(options.buttonSelector, content).addClass("active");

        // Checks for close signal to change the class again
        $.when(popup.closed())
            .done(function () {
                self.currentPopup = null;
                $(options.buttonSelector, content).removeClass("active");
            });
    },

    /* SEARCH POPOVER
    =======================================*/
    showSearchPopup: function (selector) {
        var self = this;
        var content = this.getContent();
        var device = bizagi.detectDevice();

        //first be sure to remove other opened modals
        $(".modal").remove();

        var closePopUp = function () {
            self.currentPopup = null;
            $("#menu-items #search", content).removeClass("active");
            $("#inputSearchParent").remove();
            $(document).unbind("click");
            $("#menu-items button").unbind("click");
            $("#menu-items #search").unbind("processClicked");
        };

        // If the same popup is opened close it
        if (self.currentPopup == "search") {
            bizagi.log("close popup instance", self.currentPopup);
            closePopUp();
            return;
        }

        self.currentPopup = "search";

        var tmp = $.tmpl(self.workportalFacade.getTemplate("search-field"));

        $("body").append(tmp);

        var inputSearchField = $("#menuQuery");
        inputSearchField.bind("click", function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        if (device != self.Class.DEVICE_TABLET_ANDROID) {
            $("#inputSearchParent").position({
                my: "center top",
                at: "bottom top",
                of: "#search",
                collision: "none",
                delay: 800
            }).offset({ top: 55, left: "55%" });
        } else {
            $("#inputSearchParent").position({
                my: "center top",
                at: "bottom top",
                of: "#search",
                collision: "flipfit",
                delay: 800
            }).offset({ top: 48, left: "55%" });
        }

        $(document).click(function (e) {
            if ($("#inputSearchParent").has(e.srcElement).length == 0) {
                closePopUp();
            }
        });

        $("#menu-items button").click(function () {
            if (this.id != "search") {
                closePopUp();
            }
        });

        $("#menuQuery").bind('keypress', function (e) {
            if (e.keyCode == 13) {
                if (inputSearchField.val() != "" && inputSearchField.val() != self
                    .getResource("workportal-menu-search")) {
                    self.publish("executeAction", {
                        action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH,
                        radNumber: inputSearchField.val(),
                        onlyUserWorkItems: false
                    });
                }
            }
        });

        $("#menu-items #search").bind("closePopUp", function () {
            closePopUp();
        });
    },

    /* SHOW NEW CASE POPOVER
    =======================================*/
    showNewCasePopup: function () {
        var self = this;
        var content = self.getContent();

        //first be sure to remove other opened modals
        $(".modal").remove();

        // Switch buttonstyle
        $("#menu-items #new-case", content).addClass("active");

        var closePopUp = function () {
            self.currentPopup = null;
            $("#menu-items #new-case", content).removeClass("active");
            $("#newCaseParent").remove();
            $(document).unbind("click");
            $("#menu-items button").unbind("click");
            $("#menu-items #new-case").unbind("processClicked");
        };

        // If the same popup is opened close it
        if (self.currentPopup == "newCase") {
            bizagi.log("close popup instance", self.currentPopup);
            closePopUp();
            return;
        }

        // Shows a popup widget
        self.popupOpened = true;
        self.currentPopup = "newCase";
        self.publish("appendWidgetTo", {
            widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_NEWCASE,
            options: {
                sourceElement: "#menu-items #new-case",
                'max-height': '746',
                height: 'auto',
                width: '339',
                offset: "10 25", //x y
                activeScroll: false,
                appendToElement: "body"
            }
        });

        $("#newCaseParent").position({
            my: "center top",
            at: "bottom top",
            of: "#new-case",
            collision: "none",
            delay: 800
        }).offset({ top: 55, left: "55%" });

        $(document).click(function (e) {
            if ($("#newCaseParent").has(e.srcElement).length == 0) {
                closePopUp();
            }
        });

        $("#menu-items button").click(function () {
            if (this.id != "new-case") {
                closePopUp();
            }
        });

        $("#menu-items #new-case").bind("processClicked", function () {
            closePopUp();
        });

        self.hideReportsIcon();
    },

    /* SHOW AND HIDE BACK BUTTON
    =======================================*/
    showBackButton: function () {
        var self = this;

        // Verify if content exist
        var content = self.hasOwnProperty("getContent") ? self.getContent() : $("#menu-visible-bar");

        $("#submenu-button", content).hide();
        $(".back-arrow-container", content).show();
    },

    hideBackButton: function () {
        var self = this;
        var content = self.getContent();

        if (bizagi.detectDevice() != self.Class.DEVICE_TABLET_ANDROID)
            $("#submenu-button", content).show();
        $(".back-arrow-container", content).hide();

    },

    /* SHOW AND HIDE REPORTS LABEL
    =======================================*/
    showReportsIcon: function () {
        var self = this;

        // Verify if content exist
        var content = self.hasOwnProperty("getContent") ? self.getContent() : $("#menu-visible-bar");


        $("#submenu-button", content).hide();
        $(".back-arrow-container", content).hide();
        $(".reports-icon-container", content).show();

        if (bizagi.detectDevice() != self.Class.DEVICE_TABLET_ANDROID) {
            self.toggleMenu();
        }
    },

    hideReportsIcon: function () {
        var self = this;
        var content = self.getContent();

        if (bizagi.detectDevice() != self.Class.DEVICE_TABLET_ANDROID) {
            $("#submenu-button", content).show();
        }

        $(".reports-icon-container", content).hide();
        $(".back-arrow-container", content).hide();
    },

    /* HANDLER FOR INBOX VIEWS TOGGLER
    =====================================================*/
    toggleInboxViews: function() {
        var self = this;
        var content = self.getContent();
        var device = bizagi.detectDevice();

        // Go Back Navegation
        $(content).delegate(".back-arrow-container", "click", function() {
            var actualWidget = self.getCurrentWidget();

            var inputTray = bizagi.util.getItemLocalStorage("inputtray");

            self.publish("changeWidget", {
                widgetName: actualWidget,
                inputtray: inputTray
            });

            if ($(content).hasClass('show-menu')) {
                self.toggleMenu();
            }

            self.hideBackButton();
        });
        //end of Back Button

        if (self.hasOfflineForm) {
            // Handle input try
            $(content).delegate("#submenu-button", "click", function() {

                var elementClick = $(this);

                // First be sure to remove other opened modals
                $(".modal").remove();

                if (elementClick.data("open") == "true") {
                    bizagi.workportal.tablet.popup.closePopupInstance();
                    elementClick.data("open", "false");
                    return;
                }

                $(this).data("open", "true");

                var inputtray = self.workportalFacade.getTemplate('menu.modal.input-tray');

                // Create a popup object            
                var popup = new bizagi.workportal.tablet.popup(self.dataService, self.workportalFacade, {
                    sourceElement: '.page-title',
                    offset: '40 35',
                    css_class: 'input-tray'
                });

                var htmlpopup = $.tmpl(
                    inputtray,
                    { isOnline: self.dataService.online }
                );

                popup.render(htmlpopup);

                var offsetModal = $(".modal").offset();

                if (device !== self.Class.DEVICE_TABLET_ANDROID) {
                    // Position the selection arrow                    
                    $(".modal").offset({ top: (offsetModal.top + 20), left: offsetModal.left });
                    $('.modal .selectarrow').css({ 'left': "28px" });
                } else {
                    $(".modal").offset({ top: (offsetModal.top + 15), left: offsetModal.left - 17 });
                }

                // Submenu options
                $(".ui-bizagi-workportal-menu-input-tray-field", htmlpopup).one("click", function() {

                    var mode = ($(this).data("tray") !== undefined) ? $(this).data("tray")
                        : $(".ui-bizagi-workportal-menu-input-tray-field", $(this)).data("tray");

                    // Verified offline
                    if (!self.dataService.online && mode.trim() === "inbox") return;

                    $(".page-title", elementClick).text($(this).text().trim());
                    $(".bz-cm-icon", elementClick).replaceWith($(".bz-cm-icon", $(this)));

                    bizagi.workportal.tablet.popup.closePopupInstance();
                    elementClick.data("open", "false");

                    var inputTray = self.modeInbox;

                    switch (mode) {
                    case "outbox":
                        inputTray = "false";
                        break;
                    case "drafts":
                        inputTray = "true";
                        break;
                    case "inbox":
                        inputTray = "inbox";
                        break;
                    }

                    bizagi.util.setItemLocalStorage("inputtray", inputTray);

                    self.publish("changeWidget", {
                        widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX,
                        inputtray: inputTray
                    });
                });

            });

        } else {
            $("#submenu-button .arrow-down", content).remove();
            $("#submenu-button .page-title", content).css('left', 40);

            $(content).delegate('#submenu-button', 'click', function(e) {
                e.stopPropagation();

                var actualWidget = self.getCurrentWidget();

                // First be sure to remove other opened modals
                $(".modal").remove();

                self.publish("changeWidget", {
                    widgetName: actualWidget
                });

            });
        }

        $('#inbox-view-toggler', content).click(function() {
            //first be sure to remove other opened modals
            $(".modal").remove();

            // Open popover with view options
            $('#inbox-view-toggler', content).addClass('active');

            // If the same popup is opened close it
            if (self.currentPopup == 'toggleInboxViews') {
                bizagi.workportal.tablet.popup.closePopupInstance();
                return;
            }

            // Create a popup object            
            var popup = new bizagi.workportal.tablet.popup(self.dataService, self.workportalFacade, {
                sourceElement: '#inbox-view-toggler',
                offset: '-38 4',
                css_class: 'eye-popup'
            });

            self.popupOpened = true;

            // Create inner toggler buttons 
            var togglerButtons = self.workportalFacade.getTemplate('menu.modal.items.inbox');

            popup.render($.tmpl(togglerButtons));

            // Change the offset of the modal popup
            var offsetModal = $(".modal").offset();

            if (device !== self.Class.DEVICE_TABLET_ANDROID) {
                $(".modal").offset({ top: offsetModal.top + 10, left: (offsetModal.left - 30) });
            } else {
                $(".modal").offset({ top: offsetModal.top + 5, left: (offsetModal.left - 40) });
            }

            // Position the selection arrow            
            $(".modal .selectarrow").css({ 'left': '85px' });

            // Bind default-view button            
            $(".modal .content").delegate(".change-to-default-view", "click", function () {
                var actualWidget = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX;
                var inputTray = bizagi.util.getItemLocalStorage("inputtray");

                if (inputTray === "inbox" && !self.dataService.online) {
                    inputTray = "true";
                }                    

                self.publish("changeWidget", {
                    widgetName: actualWidget,
                    inputtray: inputTray
                });

                popup.close();

                if ($(content).hasClass("show-menu")) {
                    self.toggleMenu();
                }
            });

            // Bind grid-view button
            $(".modal .content").delegate(".change-to-grid-view", "click", function () {
                var inputTray = bizagi.util.getItemLocalStorage("inputtray");

                // Action not supported
                if (!self.dataService.online || (self.dataService.online && inputTray !== "inbox")) {
                    popup.close();

                    return;
                }

                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID
                });

                popup.close();

                if ($(content).hasClass("show-menu")) {
                    self.toggleMenu();
                }
            });

        });
    },

    /* HELPER GET CURRENT WIDGER
    =====================================================*/
    getCurrentWidget: function () {
        var inbox = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX;
        var grid = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID;
        var actualWidget;

        switch (bizagi.cookie("bizagiDefaultWidget")) {
            case inbox:
                actualWidget = inbox;
                break;
            case grid:
                actualWidget = grid;
                break;
            default:
                actualWidget = grid;
                break;
        }

        return actualWidget;
    }
});
