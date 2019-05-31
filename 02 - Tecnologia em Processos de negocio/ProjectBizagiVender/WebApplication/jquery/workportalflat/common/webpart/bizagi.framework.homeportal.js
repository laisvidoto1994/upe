/*
 *   Name:
 *   Author: Luis Cabarique - LuisCE
 *   Comments:
 *   -   This script will define homePortal Framework
 */
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.webparts = (typeof (bizagi.webparts) !== "undefined") ? bizagi.webparts : {};

$.Class.extend("bizagi.workportal.homeportalFramework", {}, {
    /**
     *   Constructor
     */
    init: function (workportalFacade) {
        var self = this;

        // Set workportal facade
        self.workportalFacade = workportalFacade;
        self.device = bizagi.detectDevice();

        self.accumulatedContext = [];
        self.navigateFromRender = false;

        self._homeportalShow();
        self.configureHandler();

        bizagi.util.mobility.homePortalNavigate = $.proxy(self.homePortalNavigate, self);
        bizagi.util.mobility.homePortalViewShown = $.proxy(self.homePortalViewShown, self);
        bizagi.util.mobility.homePortalViewInit = $.proxy(self.homePortalViewInit, self);
        bizagi.util.mobility.homePortalViewHide = $.proxy(self.homePortalViewHide, self);
        bizagi.util.mobility.drawerBeforeShow = $.proxy(self.drawerBeforeShow, self);
    },
    /**
     * finds and executes child components based on the given layout
     * @param component name of the component
     * @param content jquery content container
     * @returns {Array} promise of executing child components
     */
    loadComponents: function (component, content) {
        var self = this;
        var components = [];

        $.each(self.homePortalLayout, function (wp, v) {
            if (Array.isArray(v.position)) {
                $.each(v.position, function (index, value) {
                    if (value === component) {
                        var $canvas = $(('#' + v.canvas[index]), content);
                        var func = self.workportalFacade.executeWebpart({
                            webpart: wp,
                            canvas: $canvas,
                            pane: $canvas.parent('div[data-role="pane"]')
                        });
                        components.push(func);
                    }
                });
            } else if (v.type !== "drawer" && v.position === component) {
                var $canvas = $(('#' + v.canvas), content);
                var func = self.workportalFacade.executeWebpart({
                    webpart: wp,
                    canvas: $canvas,
                    pane: $canvas.parent('div[data-role="pane"]')
                });
                components.push(func);
            } else if (v.type === "drawer" && v.position === component) {
                var $canvas = $(("#" + v.canvas), "body");
                var func = self.workportalFacade.executeWebpart({
                    webpart: wp,
                    canvas: $canvas
                });
                components.push(func);
            }
        });

        return $.when(components);
    },
    /**
     * load requested template and fix the layout
     * @param templateName name of the template
     * @param component name of the component
     * @param params aditional paramethers
     * @returns {jquery} template object
     */
    loadComponentTemplate: function (templateName, component, params) {
        var self = this;
        var template = kendo.template(self.workportalFacade.getTemplate(templateName), {
            useWithBlock: false
        });
        var components = [];
        for (var wp in self.homePortalLayout) {
            var wpLayout = self.homePortalLayout[wp];
            if (Array.isArray(wpLayout.position)) {
                $.each(wpLayout.position, function (index, value) {
                    if (value === component) {
                        components.push({
                            canvas: self.homePortalLayout[wp].canvas[index]
                        });
                    }
                });
            } else if (wpLayout.type !== "drawer" && wpLayout.position === component) {
                components.push(wpLayout);
            }

            if (wpLayout.type === "drawer" && wp === component) {
                $.extend(params, {
                    "canvas": wpLayout.canvas,
                    "direction": wpLayout.direction
                });
            }
        }

        return template($.extend(params, {
            "homePortalLayoutPositions": components
        }));
    },
    /**
     * Show the component
     * @private
     */
    _homeportalShow: function () {
        var self = this;

        bizagi.webpart.subscribe("homeportalShow", function (e, params) {
            params.params = params.params || {};
            var where = "";
            var openDrawer = false;
            var navigateFromRender = false;

            var transition = "";
            switch (params.what) {
                case "reportsChart":
                    where = "reportsChart";
                    openDrawer = false;
                    break;
                case "stuffTemplates":
                    where = "renderTemplates";
                    if (params.params.data && params.params.data.navigateFromRender) {
                        self.setContextFromRender(params);
                        self.navigateFromRender = navigateFromRender = params.params.data.navigateFromRender;
                    }
                    break;
                case "favorites":
                case "pendings":
                case "ontime":
                case "overdue":
                case "risk":
                    where = "caseTemplates";
                    break;
                case "startForm":
                    params.transition = "overlay:up";
                    where = params.what;
                    break;
                case "newCase":
                case "menu":
                case "render":
                    openDrawer = true;
                    break;
                case "activitiesOptions":
                    params.what = "caseTemplatesOptions";
                    openDrawer = true;
                    break;
                default:
                    where = params.what;
                    break;
            }

            if (!openDrawer) {
                self.closeDrawers();
                var canvas = self.homePortalLayout[where].canvas;
                var element = $('#' + canvas);
                if (element.css('display') === 'none' || element.selector === '#renderTemplates') {
                    var parent = element.parent();
                    var pane = parent.data('kendoMobilePane');
                    if (!params.preventNavigate) {
                        if (navigateFromRender) {
                            self.navigateToRenderTemplates();
                        } else {
                            pane.navigate(canvas, params.transition || "");
                        }
                    }
                    if (params.title) {
                        $.each(pane.view().header, function (index, element) {
                            var navbar = $(".km-navbar", element).data("kendoMobileNavBar");
                            navbar.title(params.title);
                        });
                    }
                }
            } else {
                self.showDrawer(params.what);
            }

            bizagi.webpart.publish('homeportalShow-' + params.what, params.params);
        });
    },
    /**
     *
     */
    configureHandler: function () {
        var self = this;

        bizagi.webpart.subscribe("homeportalBack", function (e, params) {
            self._back();
        });

        bizagi.webpart.subscribe("homeportalShowNotification", function (e, params) {
            $.notifier.add({ text: params.message });
        });
    },
    /**
     *
     * @param drawer
     */
    showDrawer: function (drawer) {
        if (drawer === "newCase") {
            $("#newCase-drawer").data("kendoMobileDrawer").show();
        } else if (drawer === "menu") {
            $("#menu-drawer").data("kendoMobileDrawer").show();
        } else if (drawer === "caseTemplatesOptions") {
            $("#caseTemplatesOptions").data("kendoMobileDrawer").show();
        } else {
            if ($("#bz-render-drawer").length > 0) {
                $("#bz-render-drawer").data("kendoMobileDrawer").show();
            }
        }
    },
    /**
     *
     * @private
     */
    _cleanContext: function () {
        var self = this;

        if (typeof (self.accumulatedContext) !== 'undefined') {
            self.accumulatedContext = [];
        }
        self.navigateFromRender = false;
    },
    /**
     * Get accumulated context for actions
     * @returns {{}} Accumulates context for actions
     */
    getActionsContext: function () {
        var self = this;
        var actionsContext = {};
        var accumulatedContext = self.accumulatedContext;

        if (accumulatedContext.length > 0) {
            actionsContext.context = $.map(accumulatedContext, function (el) {
                var entityGuid = el.entityGuid ? el.entityGuid : el.guidEntityCurrent;
                var resp = { entityGuid: entityGuid };

                if (el.surrogateKeyToMapping !== null) {
                    resp.surrogateKey = (typeof el.surrogateKeyToMapping === "object") ? el.surrogateKeyToMapping : [el.surrogateKeyToMapping];
                } else {
                    resp.surrogateKey = "";
                }

                return resp;
            }).filter(function(el){
                return el.surrogateKey !== "";
            });

        }
        else {
            actionsContext.context = [];
        }

        return actionsContext;
    },
    /**
     * add context to accumulated context
     * @param JSON context
     * @returns {Array}
     */
    addContext: function (context) {
        var self = this;

        self.accumulatedContext.push(context);
        return { "context": self.accumulatedContext };
    },
    /**
     * Extends the properties of the last context
     * @param params
     */
    extendCurrentContext: function (params) {
        var self = this;
        $.extend(self.accumulatedContext[self.accumulatedContext.length - 1], params);
    },
    /**
     * Pops the last object in the context
     * @param JSON context
     * @returns {Array}
     */
    popContext: function () {
        var self = this;

        self.accumulatedContext.pop();
        return { "context": self.accumulatedContext };
    },
    /**
     *
     * @param params
     */
    setContextFromRender: function (params) {
        var self = this;

        params = params.params || {};
        //self._cleanContext();
        self.addContext($.extend(params.data, { entityType: "actionLauncher" }));
    },
    /**
     *
     * @param context
     */
    homePortalViewInit: function (context) {
        context.view.element.trigger("view-initialized", context.view);
    },
    /**
     *
     * @param context
     */
    homePortalViewHide: function (context) {
        context.view.element.trigger("view-hidden", context.view);
    },

    /**
     *
     * @param context
     */
    homePortalViewShown: function (context) {
        context.view.element.trigger("view-showed", context.view);
    }

});