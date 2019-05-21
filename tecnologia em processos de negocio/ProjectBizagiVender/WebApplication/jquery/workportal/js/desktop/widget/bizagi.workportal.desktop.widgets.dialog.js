/**
 *   Name: BizAgi Desktop Widget Dialog Implementation
 *   Author: Diego Parra
 *   Comments:
 *   - This script will shows a widget inside a modal dialog
 *   - Extends itself
 */
$.Class.extend("bizagi.workportal.desktop.widgets.dialog", {
    DIALOG_WIDTH: 1080,
    DIALOG_HEIGHT: 710
}, {

    /**
     *   Constructor
     */
    init: function (dataService, workportalFacade) {
        this.dataService = dataService;
        this.workportalFacade = workportalFacade;
        this.triggerCloseCallback = true;
    },

    /**
     *   Render the Widget
     *   Returns a deferred
     */
    renderWidget: function (params) {
        var self = this;
        var doc = window.document;
        var defer = new $.Deferred();
        var widget;
        params = params || { };

        self.dialogBox = params.dialogBox = $("<div />");

        var widgetInstancePromise = params.widgetInstance ? params.widgetInstance : self.workportalFacade.getWidget(params.widgetName, params);

        // Creates widget
        function loadWidget(){
            $.when(widgetInstancePromise).then(function (result) {
                widget = result;
                return widget.render(params);
            }).done(function () {
                var content = widget.getContent();

                // Append content into a dialog
                self.dialogBox.append(content).appendTo("body", doc);
                params.widget = widget || null;

                // Create dialog box
                self.showDialogBox(self.dialogBox, params).done(function (data) {
                    defer.resolve();
                });
            });
        }

        if (params.guidForm) {//go to load form render
            bizagi.loader.start("rendering").then(function () {
                loadWidget();
            });
        }
        else {
            loadWidget();
        }

        // Return promise
        return defer.promise();
    },

    /**
     * Shows the dialog box in the browser
     * Returns a promise that the dialog will be closed
     */
    showDialogBox: function (dialogBox, params) {
        var self = this;
        var buttons = [];
        var defer = new $.Deferred();
        var dialogParameters = params["modalParameters"] || {};

        // TODO: Customize buttons?
        var closeButtonVisible = params.closeVisible == undefined ? true : params.closeVisible;
        var closeEscape = params.closeOnEscape == undefined ? true : params.closeOnEscape;
        var cssClass = params.dialogClass == undefined ? "" : params.dialogClass;

        if (closeButtonVisible) {
            buttons = [{
                text: bizagi.localization.getResource("workportal-widget-dialog-box-close"),
                click: function () {
                    dialogBox.dialog('close');
                    //By default execute refreshInbox, except that explicit dialogParameters.refreshInbox = false
                    if(!(dialogParameters.refreshInbox === false)){
                        //QA-2201
                        self.refreshInbox();
                    }
                }
            }];
        }
        else {
            buttons = [];
        }

        if (params.buttons) {
            if (params.buttons.length > 0) {
                // its object
                buttons = $.merge(buttons, params.buttons);
            } else {
                //its array
                $.extend(buttons, buttons, params.buttons);
            }
        }

        // Declare global instance
        //bizagi.workportal.desktop.widgets.dialog.instance = this;

        var height = dialogParameters["height"] || (params.modalParameters && self.getDialogSize(params.modalParameters.id).height) || this.Class.DIALOG_HEIGHT;
        height = (height > $(window).height()) ? $(window).height() : height;

        // Creates a dialog
        dialogBox.dialog({
            widget: params.widget,
            show: dialogParameters["show"] || 'fade',
            width: dialogParameters["width"] || (params.modalParameters && self.getDialogSize(params.modalParameters.id).width) || this.Class.DIALOG_WIDTH,
            height: height,
            modal: true,
            dialogClass: cssClass,
            closeOnEscape: closeEscape,
            draggable: false,
            title: dialogParameters["title"] || "",
            maximize: (typeof params.maximize !== "undefined") ? params.maximize : true,
            maximized: (params.maximized !== undefined ? params.maximized : false),
            maximizeOnly: (params.maximizeOnly !== undefined ? params.maximizeOnly : false),
            buttons: buttons,
            resizable: (params.modalParameters && self.getResizableState(params.modalParameters.id)) || false,
            close: function (ev, ui) {
                if (typeof params.widget !== "undefined" && typeof params.widget.dispose !== "undefined") {
                    if (!params.avoidDispose) params.widget.dispose();
                }
                dialogBox.dialog('destroy');
                dialogBox.remove();
                defer.resolve();

                // Execute callback
                if (params.onClose && self.triggerCloseCallback) params.onClose();
            },
            open: function (event, ui) {
                if (params.modalParameters && self.getDialogSize(params.modalParameters.id).maximize) {
                    if (self.getDialogSize(params.modalParameters.id).maximizeOnly) {
                        dialogBox.dialog("option", {
                            'maximizeOnly': true
                        });
                    }
                    dialogBox.dialog('maximize');
                }
                if(dialogParameters["dialogOpened"]){
                    dialogParameters["dialogOpened"].resolve({ widgetReference :  params.widget} );
                }
            }
        });
        // set global dialog object

        // Return promise
        return defer.promise();
    },

    /**
     *
     * @returns {*|jQuery}
     */
    refreshInbox: function () {
        var actualWidget;
        var storeWidget = ($.isFunction(bizagi.cookie)) ? bizagi.cookie("bizagiDefaultWidget") : grid;
        var inbox = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX;
        var homeportal = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_HOMEPORTAL;
        var grid = bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_INBOX_GRID;

        switch (storeWidget) {
            case inbox:
                actualWidget = inbox;
                break;
            case homeportal:
                actualWidget = homeportal;
                break;
            case grid:
                actualWidget = grid;
                break;
            default:
                actualWidget = homeportal;
                break;
        }
        return $(document).triggerHandler("changeWidget", {
            widgetName: actualWidget
        });
    },

    /**
     * Close dialog
     */
    close: function () {
        // If the dialog is closed externally, the callback is not used
        this.triggerCloseCallback = false;
        this.dialogBox.dialog("close");
    },

    /**
     * Get if the window is resizable or not
     */
    getResizableState: function (module) {
        module = module || "";
        var resizable;
        switch (module) {
            case "EntityAdmin":
                resizable = true;
                break;
            default:
                resizable = false;
                break;
        }
        return resizable;
    },

    /**
     * Get the dialog size of the popup window
     */
    getDialogSize: function (module) {
        module = module || "";
        var size = {
            height: this.Class.DIALOG_HEIGHT,
            width: this.Class.DIALOG_WIDTH,
            maximize: false,
            maximizeOnly: false
        };
        switch (module) {
            case "BAMProcess":
            case "BAMTask":
            case "AnalyticsProcess":
            case "AnalyticsTask":
            case "AnalyticsSensor":
            case "GRDimensionAdmin":
                size.maximizeOnly = true;
                size.width = this.Class.DIALOG_WIDTH + 220;
            //case "Queries":
            case "BusinessPolicies":
            case "ResourceBAM":
                size.maximize = true;
                break;
            case "UserAdmin":
                size.height = this.Class.DIALOG_HEIGHT + 100;
                break;
            case "AsynchronousWorkitemRetries":
                size.width = this.Class.DIALOG_WIDTH + 200;
                break;
            case "AdhocProcessAdmin":
                size.maximize = true;
                break;
        }
        return size;
    }
});

bizagi.injector.register('dialogWidgets', ['dataService', 'workportalFacade', bizagi.workportal.desktop.widgets.dialog]);
