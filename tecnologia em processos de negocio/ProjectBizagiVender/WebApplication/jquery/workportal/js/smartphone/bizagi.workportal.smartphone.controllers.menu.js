/*
*   Name: BizAgi Workportal Iphone Menu Controller
*   Author: Oscar Osorio 
*   Comments: Overrides menu controller class to apply custom stuff just for Iphone device
*/

// Auto extend
bizagi.workportal.controllers.menu.extend("bizagi.workportal.controllers.menu", {}, {
    init: function(workportalFacade, dataService) {
        this._super(workportalFacade, dataService);
        this.observerList = [];
        this.notifyObserverAll = false;
    },

    postRender: function() {
        var self = this;
        var content = self.getContent();
        self.initMenu();

        $.when(self.initContextualButtons()).done(function() {
            self.renderMenuItems();
            self.activeNavigation();
        });
    },
    /*
    *show and hide the panel for the menu options
    */
    toogleMenu: function(status) {
        var self = this;
        var content = self.getContent();
        $(".bz-wp-components-container:visible", content).hide();

        if ($(".bz-wp-mu-btn", content).hasClass("show") || (status && status == "hide")) {
            $(".bz-wp-menu-background", content).hide();
            $(".bz-wp-menu-expand", content).hide();
            $(".bz-menu-visible-bar", content).removeClass("bz-menu-active");
            $(".bz-wp-mu-btn", content).removeClass("show");
            $(".ui-bizagi-workportal-workarea").removeClass("bz-wp-wa-hiddenWorkportal");
            $(".bz-wp-menu-expand", content).hide();
            return;
        }
        
        $(".bz-wp-menu-background", content).show();
        $(".bz-wp-menu-expand", content).show();
        $(".bz-menu-visible-bar", content).addClass("bz-menu-active");
        $(".bz-wp-mu-btn", content).addClass("show");
        $(".bz-wp-menu-expand", content).show();

        //get the context oscaro
        $(".bz-wp-menu-background").unbind("click.menu").one("click.menu", function() {
            self.toogleMenu();
        });
    },

    toogleContainerButtons: function(status) {
        var self = this;
        var content = self.getContent();
        $(".bz-wp-menu-background", content).toggle();
        $(".bz-wp-components-container", content).toggle();
        $(".bz-wp-menu-background").unbind("click.menubtns").one("click.menubtns", function() {
            $(".bz-wp-menu-background", content).hide();
            $(".bz-wp-components-container", content).hide();
        });
    },
    /*
    *preconditions for start menu and asign events at the btn
    */
    initMenu: function() {
        var self = this;
        var content = self.getContent();
        $(".bz-wp-mu-btn", content).bind("click", function() {
            self.toogleMenu();
        });
    },

    /*
    *Enable or disable elments include in the menu 
    * and the application is hibryd it hides the log-out btn
    */
    renderMenuItems: function() {
        var self = this;
        var content = self.getContent();
        var menuItemsTmpl = self.workportalFacade.getTemplate("menu.items");
        $.when(self.getSecurityMenu()).done(function(menuItems) {
            //copy from the menu table the menuItems booleans
            menuItems.authCurrentUserAdministration = false;
            menuItems.authAnalysisReports = false;
            menuItems.authAdmin = false;
            menuItems.enableLogOut = true;

            $.tmpl(menuItemsTmpl, menuItems).appendTo("div.menu-items", content);

            $(content).delegate(".bz-wp-mu-back-container", "click", function(e) {
                e.preventDefault();
                self.notifyObservers("back");
                self.toogleMenu("hide");

            });

            $(content).delegate(".bz-wp-mu-search-conatiner", "click", function(e) {
                e.preventDefault();
                self.componentsMenuF.searchComponent.show();
                self.componentsMenuF.dynamiComponent.hide();
                self.toogleContainerButtons();
                self.notifyObservers("search");
                //self.toogleMenu("hide");
            });

            $(content).delegate(".bz-wp-mu-btn-custom", "click", function(e) {
                e.preventDefault();
                self.notifyObservers("buttom");
            });

            $(content).delegate(".bz-wp-mu-btn-dynamic", "click", function(e) {
                e.preventDefault();
                self.componentsMenuF.searchComponent.hide();
                self.componentsMenuF.dynamiComponent.show();
                self.toogleContainerButtons();
                // self.notifyObservers("dynamic");
                //self.toogleMenu("hide");
            });

            $(content).delegate(".new-case", "click", function(e) {
                e.stopPropagation();
                self.emptySuscribers();
                //TODO: MEJORAR IMPLEMENTACION
                $.event.special.inview.stopObserverandDestroy();
                self.changeContextualButtons("search");
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_NEWCASE
                });
            });

            $(content).delegate(".inbox-shortcut", "click", function(e) {
                e.stopPropagation();
                self.emptySuscribers();
                self.changeContextualButtons("search");
                //TODO: MEJORAR IMPLEMENTACION
                $.event.special.inview.stopObserverandDestroy();
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX
                });
            });


            $(content).delegate("#preferences", "click", function(e) {
                e.preventDefault();
                self.emptySuscribers();
            });

            $(content).delegate(".bz-wp-mu-nc-conatiner", "click", function(e) {
                e.preventDefault();
                self.emptySuscribers();
                self.publish("changeWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_NEWCASE
                });
            });

            $(content).delegate(".bz-wp-mu-input-search-menu", "keypress", function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                    self.emptySuscribers();
                    $.when(
                        self.publish("executeAction", {
                            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH,
                            radNumber: $(".bz-wp-component-search >.bz-wp-mu-input-search-menu", content).val(),
                            onlyUserWorkItems: false
                        })
                    ).done(function() {
                        $(".bz-wp-component-search >.bz-wp-mu-input-search-menu", content).val("");
                        $(".bz-wp-mu-search-conatiner").click();
                    });
                }
            });
        });


        $(content).delegate(".bz-wp-component-dynamic-btn > .bz-wp-mu-buttons", "click", function(e) {
            self.toogleContainerButtons();
            self.notifyObservers("dynamic", { ordinal: $(this).data("bz-ordinal") });
        });

        $(content).delegate('.logout', 'click', function () {
            $.when(self.dataService.logoutUser()).always(function (response) { self.defaultLogout(); });
        });

        $(content).delegate('.settings-shortcut', 'click', function (e) {
            e.stopPropagation();
            if (bizagi.detectDevice() == "smartphone_android" && bizagi.util.isCordovaSupported()) {
                console.log("Show Android preferences");
                window.Bizagi.showSettingsActivity();                
            }            
        });
    },

    defaultLogout: function() {
        var self = this;
        if (bizagi.util.isCordovaSupported()) {
            window.location = bizagi.services.ajax.logoutPage;
        } else {
            window.location.replace('');
        }
        localStorage.removeItem("inbox");
    },

    dynamicButtons: function(dbuttons) {
        var self = this;
        var content = self.getContent();
        var menuDButtonsTmpl = self.workportalFacade.getTemplate("menu.dynamic");
        $("div.bz-wp-component-dynamic-btn", content).empty();
        return $.tmpl(menuDButtonsTmpl, { buttons: dbuttons }).appendTo("div.bz-wp-component-dynamic-btn");
    },

    getSecurityMenu: function() {
        var self = this;
        var authMenu = {};
        var df = new $.Deferred();
        self.security = {};
        self.jsonSecurityList = {};

        // Enable native preferences for smartphone Android
        var enableSettings = bizagi.detectDevice() === "smartphone_android" && bizagi.util.isCordovaSupported();
        
        $.when(self.dataService.getMenuAuthorization()).done(function(data) {
            self.convertSecurityData(data);
            self.jsonSecurityList = data;
            authMenu.authNewCase = self.security.NewCase || false;
            authMenu.enableSettings = enableSettings || false;
            authMenu.authAnalysisReports = self.checkRootCategory(data, "AnalysisReports");
            authMenu.authAdmin = self.checkRootCategory(data, "Admin");
            authMenu.authCurrentUserAdministration = self.security.CurrentUser;
            $.each(self.security, function(key, value) {
                authMenu[key] = value;
            });
            df.resolve(authMenu);
        });
        return df.promise();
    },

    convertSecurityData: function(data) {
        var self = this;
        data = data || {};
        for (var i in data) {
            if (!data.hasOwnProperty(i)) continue;
            if (typeof data[i] == 'object') {
                self.convertSecurityData(data[i]);
            } else if (data[i] != undefined) {
                self.security[data[i]] = true;
            }
        }
    },

    checkRootCategory: function(data, key) {
        if (data.permissions != undefined) {
            for (var i = 0; i < data.permissions.length; i++) {
                if (data.permissions[i][key] != undefined) {
                    return true;
                }
            }
        }
        return false;
    },

    activeNavigation: function() {
        var self = this;
        var content = self.getContent();
        self.navigateElement = content.find(".bz-wp-header-title >span:first-child");
        self.subscribe("notifiesNavigation", function(e, params) {
            self.notifyNavigation(e, params);
        });
    },

    initContextualButtons: function() {
        var self = this;
        var content = self.getContent();

        //define components menu foother
        self.componentsMenuF =
        {
            searchComponent: $(".bz-wp-component-search", content),
            dynamiComponent: $(".bz-wp-component-dynamic-btn", content)
        };

        self.buttonsContextual = {};
        self.buttonsContextual.search = $(".bz-wp-mu-search-conatiner", content);
        self.buttonsContextual.button = $(".bz-wp-mu-btn-custom", content);
        self.buttonsContextual.back = $(".bz-wp-mu-back-container", content);
        self.buttonsContextual.dynamic = $(".bz-wp-mu-btn-dynamic", content);

        //disable for init
        // self.buttonsContextual.back.hide();
        self.buttonsContextual.back.css("visibility", "hidden");
    },

    changeContextualButtons: function(active, args) {
        var self = this;
        if (self.buttonsContextual === undefined)
            return;

        switch (active) {
        case "search":
            self.buttonsContextual.search.show();
            self.buttonsContextual.button.hide();
            self.buttonsContextual.dynamic.hide();
            break;
        case "button":
            self.buttonsContextual.search.hide();
            self.buttonsContextual.button.show();
            self.buttonsContextual.dynamic.hide();
            //if (args && args.value)
            // self.buttonsContextual.button.find("button").html(args.value);
            if (args && args.visible == false) {
                self.buttonsContextual.button.hide();
            }
            break;
        case "dynamic":
            self.buttonsContextual.search.hide();
            self.buttonsContextual.button.hide();
            self.buttonsContextual.dynamic.show();
            //TODO:create dynamics
            break;
        case "back":
            if (args && args.visible == true) {
                if (self.buttonsContextual.back.css("visibility") == "visible") { //.is(':visible')) {
                    return;
                }
                self.buttonsContextual.back.css("visibility", "visible"); //.show();
            } else if (args && args.visible == false) {

                self.buttonsContextual.back.css("visibility", "hidden"); //.hide();
            } else {
                self.buttonsContextual.back.css("visibility", "visible"); //.show();
            }
            break;
        case "refresh":
            if (args.search) {
                self.changeContextualButtons("search");
            }
            if (args.button) {
                self.changeContextualButtons("button"); //, { value: args.textButton });
            }
            if (args.back) {
                self.changeContextualButtons("back");
            }
            if (args.dynamic) {
                self.changeContextualButtons("dynamic");
            }
            break;
        case "disable":
            self.buttonsContextual.search.hide();
            self.buttonsContextual.button.hide();
            self.buttonsContextual.dynamic.hide();
            self.buttonsContextual.back.css("visibility", "hidden"); //.hide();
            break;
        }

    },

    getActualStateContextualButtons: function() {
        var self = this;
        if (self.buttonsContextual === undefined)
            return false;

        return {
            search: self.buttonsContextual.search.is(':visible'),
            button: self.buttonsContextual.button.is(':visible'),
            //textButton: self.buttonsContextual.button.find("button").html(),
            back: (self.buttonsContextual.back.css("visibility") == "visible"),
            dynamic: self.buttonsContextual.dynamic.is(':visible')
        };
    },

    notifyNavigation: function(e, params) {
        var self = this;
        //var continer = self.getContainer();
        var content = self.getContent();
        if (params === undefined)
            return;
        self.navigateElement.html(params.message);
        if (bizagi.detectDevice() == "smartphone_android") {
            //visual effect in android for menu (arrow bottom rigth)
            $(".bz-cm-icon.bz-wp-header-arrow", content).css("left", $(".bz-wp-titleCase", content).width() + "px");
        }
    },

    setTypeObserver: function(notifyAll) {
        this.notifyObserverAll = notifyAll;
    },
    nextSuscribe: function(key, callback) {
        var self = this;
        self.changeContextualButtons("back", { visible: true });
        return self.observerList.push({ "key": key, "callback": callback, "beforeButtons": self.getActualStateContextualButtons() });
    },
    emptySuscribers: function() {
        this.observerList = [];
        this.changeContextualButtons("back", { visible: false });

    },
    undoRemoveLastSuscriber: function() {
        var self = this;
        if (self.lastElementRemoveHistory == null)
            return;
        self.changeContextualButtons("back", { visible: true });
        self.observerList.push(self.lastElementRemoveHistory);
        self.lastElementRemoveHistory = null;
    },
    removeSuscriber: function(key, activeBeforeButtons) {
        var self = this;
        var tmpbefore;

        if (key === undefined) {
            return;
        }

        this.observerList = jQuery.grep(self.observerList, function(value) {
            if (value.key == key) {
                tmpbefore = value.beforeButtons;
                self.lastElementRemoveHistory = value;
            }
            return value.key != key;
        });
        var acbuttons = (activeBeforeButtons !== undefined) ? activeBeforeButtons : true;
        if (acbuttons) {
            self.changeContextualButtons("refresh", tmpbefore);
        }
    },

    removeLastSuscriber: function(activeBeforeButtons) {
        var self = this;
        if (typeof(self.observerList[self.observerList.length - 1]) != "object") {
            return;
        }
        var observer = self.observerList[self.observerList.length - 1];
        var key = observer.key;
        self.removeSuscriber(key, activeBeforeButtons);

    },

    getLastSuscriber: function() {

        var self = this;
        if (typeof(self.observerList[self.observerList.length - 1]) != "object") {
            return null;
        }
        return self.observerList[self.observerList.length - 1];
    },

    notifyObservers: function(action, argsExtend) {
        if (!this.notifyObserverAll) {
            this.notifyLastObserver(action, argsExtend);
            return;
        }
        for (var itobserver in this.observerList) {
            var oblist = this.observerList;
            var observer = oblist[itobserver];
            var args = {
                "index": itobserver,
                "action": action,
                "key": observer.key,
                "lastKey": oblist[oblist.length - 1].key
            };
            if (argsExtend) {
                args = jQuery.extend(args, argsExtend);
            }

            self.notifiy(observer.callback, args);
        }
    },

    notifyLastObserver: function(action, argsExtend) {
        var self = this;
        if (typeof(this.observerList[this.observerList.length - 1]) != "object") {
            return;
        }
        var observer = this.observerList[this.observerList.length - 1];
        var index = this.observerList.length - 1;
        var args = {
            "index": index,
            "action": action,
            "key": observer.key,
            beforeButtons: observer.beforeButtons
        };

        if (argsExtend) {
            args = jQuery.extend(args, argsExtend);
        }


        self.notifiy(observer.callback, args);
    },

    notifiy: function(callbacks, args) {
        if (jQuery.isArray(callbacks)) {
            for (var identifier in callbacks)
                callbacks[identifier](args);
            return;
        }
        callbacks(args);
    }
});