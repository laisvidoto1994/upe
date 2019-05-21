/*
*   Name: BizAgi Workportal Tablet Main Controller
*   Author: Diego Parra 
*   Comments:
*   -   This script will override main controller class to apply custom stuff just for tablet device
*/

// Auto extend
bizagi.workportal.controllers.main.extend("bizagi.workportal.controllers.main", {}, {

    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function() {
        var self = this;
        var content = self.getContent();

        // If we are checking the view in the pc don't adjust width, just apply resize method
        if ($(window).width() > 1024) {
            self.doResize();
            return;
        }

        // Adjust application width and height
        if (content.width() == 0) content.width($(window).width());
        if (content.height() == 0) content.height($(window).height());
        self.doResize();

        // Check orientation change
        window.onorientationchange = function() {

            content.width($(window).width());
            content.height($(window).height());
            self.doResize();
            //remove all modal elements
            $(".modal").remove();
        };

    },


    doResize: function() {
        var self = this;
        var content = self.getContent();

        var height = content.height();
        if (height == 0) return;

        // Resize content
        self.resizeContainer(content, height);

        // Call menu, and workarea resize layout
        if (self.menu) self.menu.performResizeLayout();
        if (self.workarea) self.workarea.performResizeLayout();
    },

    /*
    *   Perform the resize with the application height
    */
    performResizeLayout: function() {
        // Do nothing
        this.doResize();
    },

    /*
    *   Renders the content for the current controller
    *
    */
    renderContent: function() {
        var self = this;

        return self._super();
    },

    /*
    *   Shows a widget inside a modal dialog
    *   Implement on each device
    */
    showDialogWidget: function(data) {
        var self = this;
        var dialog = new bizagi.workportal.tablet.widgets.dialog(self.dataService, self.workportalFacade);
        dialog.renderWidget(data);

        // Add to stack
        bizagi.workportal.tablet.dialogStack = bizagi.workportal.tablet.dialogStack || [];
        bizagi.workportal.tablet.dialogStack.push(dialog);

        return dialog;
    },

    /*
    *   Close the current modal dialog
    *   Implement on each device
    */
    closeCurrentDialog: function(params) {
        // Remove from
        bizagi.workportal.tablet.dialogStack = bizagi.workportal.tablet.dialogStack || [];
        if (bizagi.workportal.tablet.dialogStack.length > 0) {
            var dialog = bizagi.workportal.tablet.dialogStack.pop();
            dialog.close();
        }
    },

    /*
    *   Popup a widget
    *   Implement on each device
    */
    popupWidget: function(params) {
        var self = this;
        var popup = new bizagi.workportal.tablet.widgets.popup(self.dataService, self.workportalFacade, params.options);
        popup.renderWidget(params);

        // Attach closed handler if present
        if (params.options && params.options.closed) {
            $.when(popup.closed())
                .done(function() {
                    // Executes callback
                    params.options.closed();
                });
        }
    },

    appendWidgetTo: function(params) {
        var self = this;
        var widget;

        $.when(
            self.workportalFacade.getWidget(params.widgetName, params)
        ).pipe(function(result) {
            widget = result;
            return widget.render(params);
        }).done(function() {
            var content = widget.getContent();

            // Append content into a dialog
            $(params.options.appendToElement).append(content);
        });

    },
    /* DISPLAY "ADD TO HOMESCREEN MESSAGE"
    =====================================================*/
    showAddToHomeScreenMsg: function() {
        var self = this;

        var msg = self.getResource('workportal-add-to-homescreen');

        // Create msg container
        $('<div>')
            .addClass('add-to-homescreen')
            .html(msg)
            .appendTo('body');

        $('<span>')
            .addClass('close-btn')
            .appendTo('.add-to-homescreen');

        $('.add-to-homescreen', 'body').click(function() {
            $(this).fadeOut();
        });
    },

    cleanWidgets: function() {
        if (bizagi.workportal.tablet.popup) {
            if (bizagi.workportal.tablet.popup.instance) {
                if (bizagi.workportal.tablet.popup.instance.dontClose !== undefined) {
                    bizagi.workportal.tablet.popup.instance.dontClose = false;
                    bizagi.workportal.tablet.popup.instance.close();
                }
            } else {
                var innerDialog = $(".modal .complex-frame");
                if (innerDialog.length > 0) {
                    innerDialog.closest(".modal").remove();
                }
            }
        }
    },

    /*
    *   Executes the desired action
    */
    executeAction: function(params) {
        var self = this;
        var actionController = self.workportalFacade.getAction(params.action);

        // Executes the action
        actionController.execute(params);
    },

    /**
     * Renders the workarea based on the current widget
     * @returns {} 
     */
    renderWorkarea: function() {
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
                self.loadWidgetFromFacade(workarea, workareaContainer);
            }
        }
    }
});
