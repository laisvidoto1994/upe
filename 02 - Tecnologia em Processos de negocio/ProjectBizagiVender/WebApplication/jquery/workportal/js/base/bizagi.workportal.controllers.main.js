/*
*   Name: BizAgi Workportal Main Controller
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to handle workportal layouts for any device
*   -   This layout must contain a menu and widget container placeholders
*/


// Defines the main controller
bizagi.workportal.controllers.controller.extend("bizagi.workportal.controllers.main", {}, {

    /*
    *   Constructor
    */
    init: function (workportalFacade, dataService) {
        var self = this;

        // Define regex to apply to templates
        self.componentRegex = /{{component (\w+)}}/g;

        // Call base
        this._super(workportalFacade, dataService);

        // Subscribe to change widget event
        this.subscribe("changeWidget", function (e, params) {
            var def = new $.Deferred();

            self.subscribeOneTime("onWidgetIncludedInDOM", function (e, p) {
                def.resolve();
            });

            $.when(bizagi.util.autoSave()).done(function () {

                $(document).data('auto-save', '');

                if (params.widgetName == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID ||
                   params.widgetName == bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX) {
                    bizagi.cookie("bizagiDefaultWidget", params.widgetName, { expires: 30 });
                }

                bizagi.util.setContext({
                    widget: params.widgetName
                });

                self.setWidget(params);

            });
            return def.promise();
        });

        // Subscribe to add dialog to stack dialogs
        this.subscribe("addDialogToDialogStack", function (e, params) {
            // Add dialog to stack
            self.addDialogToDialogStack(params);
        });

        // Subscribe to dialog widget event
        this.subscribe("showDialogWidget", function (e, params) {
            // Shows a dialog a widget                
            self.showDialogWidget(params);
        });

        // Subscribe to clsoe current dialog
        this.subscribe("closeCurrentDialog", function (e, params) {
            // Close the current dialog widget
            return self.closeCurrentDialog(params);
        });

        // Subscribe to close all dialogs
        this.subscribe("closeAllDialogs", function (e, params) {
            // Close all dialogs
            self.closeAllDialogs();
        });

        // Subscribe to popup widget event
        this.subscribe("popupWidget", function (e, params) {
            // Shows a popup a widget
            self.popupWidget(params);
        });

        // Subscribe to pop widget event
        this.subscribe("popWidget", function (e, params) {
            // Shows a pop a widget
            self.popWidget(params);
        });

        // Subscribe to push widget event
        this.subscribe("pushWidget", function (e, params) {
            // Shows a push a widget
            self.pushWidget(params);
        });


        // Subscribe to execute action event
        this.subscribe("executeAction", function (e, params) {
            // Executes the action
            self.executeAction(params);
        });

        // Subscribe to resize layout event
        this.subscribe("resizeLayout", function () {
            // Resize all the layout
            self.performResizeLayout();
        });

        // Subscribe to dispose Widget event
        this.subscribe("disposeWidget", function () {
            // Resize all the layout
            self.disposeWidget();
        });

        // Subscribe to 'append Widget to' event
        this.subscribe("appendWidgetTo", function (e, params) {
            // attach the widget to a given element
            return (self.appendWidgetTo(params));
        });

        // Subscribe to Notifications event
		/**
         * @param params {notification, type}
         */
        this.subscribe("notification", function (e, params) {
            NotificationDispatcher.dispatch(params.notification, params.type);
        });

        // Subscribe to 'refreshQueryFormShortCut' event
        this.subscribe("refreshQueryFormShortCut", function (e, params) {
            // attach the widget to a given element
            return (self.refreshQueryFormShortCut(params));
        });
    },

    /*
    *   Renders the content for the current controller
    *
    */
    renderContent: function () {
        var self = this;
        var template = self.workportalFacade.getTemplate("workportal");

        // Render content
        var content = self.content = $.tmpl(template, {});

        // Add workarea
        self.workarea = self.workportalFacade.getWorkareaController();

        // Add menu
        var menu = self.menu = self.workportalFacade.getMenuController();
        $.when(menu.render())
        .done(function () {
            // Build menu
            menu.getContent().appendTo(self.getComponentContainer("menu"));
        });

        // Set resize layout event
        $(window).resize(function () {
            self.resizeLayout();
        });

        return content;
    },

    /*
    *   Sets the current working widget
    */
    setWidget: function (params) {
        var self = this;
        self.currentWidget = params.widgetName;
        self.currentWidgetParams = $.extend({}, params, { menu: self.getMenu() });

        // Set assertion to avoid calls without widget name
        bizagi.assert(!bizagi.util.isEmpty(params.widgetName), "No widget name defined for changeWidget call");

        // Renders the workarea again
        self.renderWorkarea();
    },

    /*
    *   Executes the desired action
    */
    executeAction: function (params) {
        var self = this;

        if (params.action == bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING) {
            bizagi.loader.start("activity").then(function () {
                var actionController = self.workportalFacade.getAction(params.action);

                // Executes the action
                actionController.execute(params);
            });
        }
        else if (params.action == bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_SEARCH) {
            bizagi.loader.start("inbox").then(function () {
                var actionController = self.workportalFacade.getAction(params.action);

                // Executes the action
                actionController.execute(params);
            });
        }
    },

    /*
    *   Renders the workarea based on the current widget
    */
    renderWorkarea: function () {
        var self = this;

        var workarea = self.workarea;

        if (workarea) {
            var workareaContainer = self.getComponentContainer("workarea");

            // clean widgets
            self.cleanWidgets();

            // Clean workarea
            workareaContainer.empty();

            //Prepare first load. If inboxGrid, first: load module inbox
            if (!bizagi.util.isEmpty(self.currentWidget) && self.currentWidget != "none") {
                self.currentWidgetParams = $.extend({}, self.currentWidgetParams, { menu: self.getMenu() });
                if(self.currentWidget === bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID ||
                   self.currentWidget === bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX){
                    bizagi.loader.start("inbox").then(function () {
                        self.loadWidgetFromFacade(workarea, workareaContainer);
                    });
                }
                else{
                    self.loadWidgetFromFacade(workarea, workareaContainer);
                }
            }
        }
    },

    /*
     *   Load widget from facade
     */
    loadWidgetFromFacade: function (workarea, workareaContainer){
        var self = this;
        // Load widget from facade
        $.when(
           self.workportalFacade.getWidget(self.currentWidget, self.currentWidgetParams)
        ).pipe(function (widgetController) {
               // Set into workarea
               workarea.setWidget(widgetController);
               return workarea.render();

           }).done(function () {

               var renderedContent = workarea.getContent();
               if (renderedContent) {
                   // Replace workarea
                   renderedContent.appendTo(workareaContainer);

                   //Resize layout on workarea
                   self.resizeLayout();

                   // Trigger "widget included in dom" event
                   self.publish("onWidgetIncludedInDOM");
               }
           });
    },

    /*
    *   Shows a widget inside a modal dialog
    *   Implement on each device
    */
    showDialogWidget: function (params) { },

    /*
    *   Close the current modal dialog
    *   Implement on each device
    */
    closeCurrentDialog: function (params) { },

    /*
    *   Popup a widget
    *   Implement on each device
    */
    popupWidget: function (params) { },

    /*
     *   Add dialog to dialogStack
     */
    addDialogToDialogStack: function(dialog) {},

    /**
    *   Close all modal dialogs
    *   Implement on each device
    */
    closeAllDialogs: function() {},

    /*
    *   push a widget
    *   Implement on each device
    */
    pushWidget: function (params) {
        var self = this;
        self.currentWidget = params.widgetName;
        self.currentWidgetParams = $.extend({}, params, { menu: self.getMenu() });
        // Set assertion to avoid calls without widget name
        bizagi.assert(!bizagi.util.isEmpty(params.widgetName), "No widget name defined for pushWidget call");
    },

    /*
    *   pop a widget
    *   Implement on each device
    */
    popWidget: function (params) {
        var self = this;
        self.currentWidget = params.widgetName;
        self.currentWidgetParams = $.extend({}, params, { menu: self.getMenu() });
        // Set assertion to avoid calls without widget name
        bizagi.assert(!bizagi.util.isEmpty(params.widgetName), "No widget name defined for popupWidget call");


    },

    disposeWidget: function (params) {
        var self = this;
        self.currentWidget = params.widgetName;
        self.currentWidgetParams = $.extend({}, params, { menu: self.getMenu() });
        // Set assertion to avoid calls without widget name
        bizagi.assert(!bizagi.util.isEmpty(params.widgetName), "No widget name defined for disposeWidget call");


    },

    /*
    *   Shows a widget inside a given element
    *   paramms: widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_***,
    *            appendToElement: "#elementid" or ".elementClass"
    *   Implement on each device
    */
    appendWidgetTo: function (params) { },

    /*
    *   When the window resizes, runs this method to adjust stuff in each controller or widget
    *   Override when needed  
    */
    performResizeLayout: function () {
        var self = this;
        var content = self.getContent();

        // Resize content
        self.resizeContainer(content, $(window).height());

        // Call menu, and workarea resize layout
        if (self.menu) self.menu.performResizeLayout();
        if (self.workarea) self.workarea.performResizeLayout();
    },

    /*
    *   Resizes a container according its rules
    */
    resizeContainer: function (container, containerHeight) {
        var self = this;

        // Only perform layout resize if the container has adjustable elements
        var adjustableChildren = container.children(".ui-bizagi-component-adjustable");
        var adjustableContainersHeight = containerHeight;
        if (adjustableChildren.length > 0) {
            // Sum fixed content
            var fixedContentHeight = 0;
            $.each(container.children(), function (i, element) {
                if (!$(element).hasClass("ui-bizagi-component-adjustable")) fixedContentHeight += $(element).height();
            });

            // Resize adjustable elements
            adjustableContainersHeight = (containerHeight - (fixedContentHeight));

            var overflowY = "";
            $.each(adjustableChildren, function (i, element) {

                overflowY = ($(element).css("overflow-y") != "") ? $(element).css("overflow-y") : "hidden";
                if (overflowY == "visible") overflowY = "hidden";
                $(element).addClass("ui-bizagi-adjustable");
                var marginTop = ($(element).css("margin-top") === "auto") ? 0 : Number($(element).css("margin-top").replace("px", ""));
                var finalHeight = adjustableContainersHeight - marginTop;
                $(element).css({
                    "height": finalHeight,
                    "overflow-y": overflowY
                });

            });
        }

        // Resize inner containers if it has any adjustable inner containers
        $.each(container.children(), function (i, element) {
            if ($(element).find(".ui-bizagi-component-adjustable").length > 0) {
                $(element).addClass("ui-bizagi-component-adjustable");
                self.resizeContainer($(element), adjustableContainersHeight);
            }
        });
    },

    /*
    *   Return the menu component
    */
    getMenu: function () {
        return this.menu;
    },

    refreshQueryFormShortCut: function (params) { },

});
