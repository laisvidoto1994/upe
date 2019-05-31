/*
*   Name: BizAgi Workportal Smartphone Main Controller
*   Author: Diego Parra 
*   Comments:
*   -   This script will override main controller class to apply custom stuff just for tablet device
*/

// Auto extend
bizagi.workportal.controllers.main.extend("bizagi.workportal.controllers.main", {}, {
    init: function (workportalFacade, dataService) {
        this._super(workportalFacade, dataService);
        this.staker = [];
    },

    /*
    *   To be overriden in each device to apply layouts
    */
    postRender: function () {
        var self = this;
    },

    cleanWidgets: function () {
        if (bizagi.workportal.smartphone.widgets.dialog) {
            if (bizagi.workportal.smartphone.widgets.dialog.instance) {
                bizagi.workportal.smartphone.widgets.dialog.instance.dontClose = false;
                bizagi.workportal.smartphone.widgets.dialog.instance.close();
            }
        }
    },

    setWidget: function (params) {
        var self = this;
        var menu = self.getMenu();
        var workareaContainer = self.getComponentContainer("workarea");

        self.staker = [];

        self.cleanWidgets();
        if (workareaContainer)
            workareaContainer.empty();

        if (menu && menu.emptySuscribers)
            menu.emptySuscribers();

        /* }*/

        self.pushWidget(params);
    },
    /*
    *   push a widget
    *   Implement on each device
    */
    pushWidget: function (params) {
        var self = this;
        self._super(params);
        self.pushWorkArea(params);
    },
    /*
    *   pop a widget
    *   Implement on each device
    */
    popWidget: function (params) {
        var self = this;
        self._super(params);
        self.popWorkarea(params);
    },


    /*
    *   Renders the workarea based on the current widget
    */
    pushWorkArea: function (params) {
        var self = this,
            workarea = self.workarea;

        if (workarea) {

            //WorkareaContainer vars
            var workareaContainer;
            var intervalTime = 500;

            var workAreaInterval = setInterval(function () {
                workareaContainer = self.getComponentContainer("workarea");

                if (workareaContainer) {

                    clearInterval(workAreaInterval);

                    if (!bizagi.util.isEmpty(self.currentWidget) && self.currentWidget != "none") {
                        self.currentWidgetParams = $.extend({}, self.currentWidgetParams, { menu: self.getMenu() });
                        $.when(
                            self.workportalFacade.getWidget(self.currentWidget, self.currentWidgetParams)
                        ).pipe(function (widgetController) {
                            workarea.setWidget(widgetController);
                            return workarea.render();
                        }).done(function () {
                            var renderedContent = workarea.getContent();
                            if (renderedContent) {
                                // append workarea
                                renderedContent.appendTo(workareaContainer);
                                self.pushStaker(renderedContent.data("bizagi-component"), renderedContent);
                                self.publish("onWidgetIncludedInDOM");
                            }
                        });
                    }
                }

            }, intervalTime);
        }
    },

    pushStaker: function (dataElement, renderContent) {
        var self = this;
        var staker = self.staker;
        staker.push({ "dataElement": dataElement, "renderContent": renderContent });
        if (staker.length >= 2) {
            var beforeComponent = staker[staker.length - 2].renderContent;
            beforeComponent.hide();
        }

    },

    popWorkarea: function (params) {
        //remove screen
        var self = this;
        var staker = self.staker;

        if (params.componentPop && params.componentPush) {

            for (index in staker) {

                if (staker[index].dataElement == params.componentPush) {
                    //push
                    $(staker[index].renderContent).triggerHandler("activateWidget");
                    staker[index].renderContent.show();

                }
            }

            self.staker = jQuery.grep(self.staker, function (value) {
                if (value.dataElement == params.componentPop) {
                    value.renderContent.hide();
                    if (value.renderContent[0].parentNode)
                        value.renderContent[0].parentNode.removeChild(value.renderContent[0]);
                }
                return value.dataElement != params.componentPop;
            });
        } else if (params.componentPop) {

            if (staker.length > 1) {
                staker[staker.length - 2].renderContent.show();
                $(staker[staker.length - 2].renderContent).triggerHandler("activateWidget");
            } else {
                return self.popWorkarea(params.componentPop, "workportal");
            }


            self.staker = jQuery.grep(self.staker, function (value) {
                if (value.dataElement == params.componentPop) {
                    value.renderContent.hide();
                    value.renderContent[0].parentNode.removeChild(value.renderContent[0]);
                }
                return value.dataElement != params.componentPop;
            });


        }
    },

    lengthStaker: function () {
        return this.staker.length;

    },

    /*
    *   Shows a widget inside a modal dialog
    *   Implement on each device
    */
    showDialogWidget: function (data) {
        var self = this;
        var dialog = new bizagi.workportal.smartphone.widgets.dialog(self.dataService, self.workportalFacade);
        dialog.renderWidget(data);

        // Add to stack
        bizagi.workportal.smartphone.dialogStack = bizagi.workportal.smartphone.dialogStack || [];
        bizagi.workportal.smartphone.dialogStack.push(dialog);

        return dialog;
    },

    /*
    *   Close the current modal dialog
    *   Implement on each device
    */
    closeCurrentDialog: function (params) {
        // Remove from
        bizagi.workportal.smartphone.dialogStack = bizagi.workportal.smartphone.dialogStack || [];
        if (bizagi.workportal.smartphone.dialogStack.length > 0) {
            var dialog = bizagi.workportal.smartphone.dialogStack.pop();
            dialog.close();
        }
        bizagi.closeQuirksModePopup();
    },

    /*
    * Append a given widget to a given destination element
    */
    appendWidgetTo: function (params) {
        var self = this;
        var widget;

        $.when(
            self.workportalFacade.getWidget(params.widgetName, params)
        ).pipe(function (result) {
            widget = result;
            return widget.render(params);
        }).done(function () {
            var content = widget.getContent();

            // Append content into a dialog
            $(params.options.appendToElement).append(content);
        });

    },

    /**
    * Executes the desired action
    * @param {} params 
    * @returns {} 
    */
    executeAction: function (params) {
        var self = this;
        var actionController = self.workportalFacade.getAction(params.action);

        // Executes the action
        actionController.execute(params);
    },

    /**
     * Renders the workarea based on the current widget
     * @returns {} 
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
            }

            self.loadWidgetFromFacade(workarea, workareaContainer);
        }
    }   
});
