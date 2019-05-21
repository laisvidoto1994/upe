/*
*   Name: BizAgi Smartphone Form Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to smaprtphone devices
*/

// Auto extend
bizagi.rendering.form.extend("bizagi.rendering.form", {

    /* CONSTRUCTOR
    ======================================================*/
    init: function (params) {
        var self = this;

        // Call base
        self._super(params);
    },

    /*  Template method to implement in each device to customize each container after processed
    ======================================================*/
    postRenderContainer: function (container) {
        var self = this;

        self._super(container);

        //Set button length
        var buttons = self.getButtons();
        var lengthButtons = (buttons) ? buttons.length : 0;

        if (lengthButtons) {

            $(document).data("auto-save", "auto-save");

            //bind event auto-save
            $(document).unbind("save-form").bind("save-form", function (e, deferredSave) {
                self.autoSaveEvents(deferredSave);
            });

            //bind event beforeunload
            $(window).unbind("beforeunload").bind("beforeunload", function (e) {

                var newData = {};
                self.collectRenderValues(newData);

                //if there are changes in the form show a message
                if (!$.isEmptyObject(newData) && $(document).data("auto-save")) {

                    return bizagi.localization.getResource("confirmation-savebox-message2");
                }

                return;

            });
        }
    },
    /*
     *   Template method to implement in each device to customize the container's behaviour to add handlers
     */
    configureHandlers: function () {
        var self = this;
        var complexGatewayContainer;
        var form = self.container;

        $(form.children()).each(function () {
            if ($(this).hasClass('ui-bizagi-container-complexgateway')) {
                complexGatewayContainer = this;
            }
        });

        // activeTransitions is used to store ids of activities in Complex Gateway
        self.activeTransitions = {};

        // Process buttons
        self.processButtons(form);
        // Check for dom included event
        self.bind("ondomincluded", function () {
            // Creates validation controller after the form is ready
            self.validationController = new bizagi.command.controllers.validation(self, self.validations);
            // Creates action controller after the form is ready
            self.actionController = new bizagi.command.controllers.action(self, self.actions);

            // Resolve this deferred to start executing DOM dependant plugins
            self.readyDeferred.resolve();
        });

        // Set events for complex gateway interface
        $(".bz-rn-cg-checkbox", complexGatewayContainer).bind("click", function () {
            var selectedElement = $(this).find("label");
            var transitionId = selectedElement.data("value") || "";

            if (typeof self.activeTransitions[transitionId] == "undefined") {
                self.activeTransitions[transitionId] = false;
            }

            if (bizagi.util.parseBoolean(selectedElement.data("checked"))) {
                // Uncheck element
                selectedElement.removeClass("ui-checkbox-state-checked");
                selectedElement.removeClass("bz-check").addClass("bz-full-ball");
                selectedElement.data("checked", false);
                self.activeTransitions[transitionId] = false;
            } else {
                // Check element
                selectedElement.addClass("ui-checkbox-state-checked");
                selectedElement.addClass("bz-mo-icon").addClass("bz-check").removeClass("bz-full-ball");
                selectedElement.data("checked", true);
                self.activeTransitions[transitionId] = true;
            }
        });
    },

    /*
    * Auto Save Events
    */
    autoSaveEvents: function (deferredSave, saveBox) {

        var self = this;
        var data = {};
        self.collectRenderValues(data);

        if (!$.isEmptyObject(data)) {
            if (self.properties.formtype === "startform") {
                $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("confirmation-savebox-message4"), "Bizagi", "warning")).done(function () {
                    deferredSave.resolve();
                }).fail(function () {
                    deferredSave.reject();
                });
            } else {
                $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("confirmation-savebox-message1"), "Bizagi", "warning")).done(function () {
                    self.saveForm();
                    deferredSave.resolve();
                }).fail(function () {
                    deferredSave.resolve();
                });
            }
        } else {
            deferredSave.resolve();
        }
    },

    /* TEMPLATE METHOD TO GET THE BUTTONS OBJECTS
    ======================================================*/
    getButtons: function () {
        var self = this;
        var container = self.container;

        if (self.getParams() && (handler = self.getParams().getButtons))
            handler(self);

        return $(".ui-bizagi-button-container .action-button", container);
    },

    processButtons: function () {
        var self = this;

        // Si no es con un if es con un publish
        if (self.getParams() && self.getParams().processButtons) {
            var handler = self.getParams().processButtons;
            handler(self);
        }

        var properties = self.properties;
        var buttons = self.getButtons();

        properties.buttons = self.buttons;

        var i;
        var length = properties.buttons.length;

        // To cache a submit Data Buttom if exist
        self.saveButton = null;
        self.nextButton = null;

        // Set saveButton and nextButton if exist
        for (i = 0, length; i < length; i++) {
            if (properties.buttons[i].action === "save") {
                self.saveButton = properties.buttons[i];
            } else if (properties.buttons[i].action === "next") {
                self.nextButton = properties.buttons[i];
            }
        }

        var navigation = self.getNavigation();

        if (typeof (navigation) !== "undefined") {
            navigation.setNavigationButtons(self);
        }

        // bind de touch events
        var touchMoveStart = 0;

        // Don't process buttons if they are undefined in the template
        if (!buttons || buttons.length === 0) {
            return;
        }

        buttons.bind("touchstart", function (event) {
            event.preventDefault();

            var pointer = event.originalEvent.targetTouches ? event.originalEvent.targetTouches[0] : event;
            var currY = pointer.pageY;

            touchMoveStart = currY;
        });

        buttons.bind("touchend , click", function (event) {
            event.preventDefault();
	    //trigger the blur of the focused element in order to catch the render Change in the last changed control
            $(":focus", self.container).blur();
            var pointer = event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0] : event;
            var currY = pointer.pageY;

            self.startLoading();

            // If the finger is too far from the button when you stop touching the screen, then do nothing
            if (event.type !== "click" && currY > touchMoveStart + 40 || currY < touchMoveStart - 40) {
                self.endLoading();
            } else {
                var button = $(this);
                var ordinal = button.attr("ordinal");
                var buttonProperties = self.buttons[ordinal];

                // Execute button
                $.when(self.processButton(buttonProperties))
                    .always(function () {
                        self.endLoading();
                    });
            }
        });

        return;
    },

    refreshForm: function (focus) {
        var self = this;
        var properties = self.properties;
        var params = self.getParams();
        var defer = new $.Deferred();
        var options;

        focus = focus || self.getFocus();

        options = {
            idCase: self.params.idCase || "",
            idWorkitem: self.params.idWorkitem || "",
            idTask: self.params.idTask || "",
            focus: focus,
            selectedTabs: self.getSelectedTabs(),
            xpathContext: properties.xpathContext,
            idPageCache: properties.idPageCache,
            isRefresh: true,
            action: self.getEndPointAction(),
            idStartScope: self.properties.idStartScope || "",
            navigation: params.navigation
        };

        if (params.postRenderEdit || params.processButtons) {
            options.postRenderEdit = params.postRenderEdit;
            options.processButtons = params.processButtons;
            options.originalParams = params.originalParams || {};
            options.getButtons = params.getButtons;
        }

        $(".km-native-scroller").css("-webkit-overflow-scrolling", "inherit");

        // Notify the refresh event so the consumer takes the decision about what to do
        self.startLoading();
        $.when(self.triggerHandler("refresh", options))
            .done(function () {
                self.endLoading();
                defer.resolve();
                setTimeout(function () {
                    $(".km-native-scroller").css("-webkit-overflow-scrolling", "touch");
                }, 1000);
            });

        return defer.promise();
    },

    getSelectedTabs: function () {
        var self = this,
            tabContainers = self.getElementsByType("tab");

        var tabs = $.map(tabContainers, function (tabContainer) {
            return { tab: tabContainer.properties.id, selected: tabContainer.activeTab };
        });

        var selectedTabs = {},
            i = tabs.length;

        while (i-- > 0) {
            selectedTabs[tabs[i].tab] = tabs[i].selected;
        }
        return selectedTabs;
    },


    getNavigation: function () {
        var params = this.getFormContainer().getParams();
        return params.navigation;
    },

    checkWidgetsData: function (action) {
        var dialogResponse = null;
        if (bizagi.workportal.smartphone.widgets.dialog) {
            if (bizagi.workportal.smartphone.widgets.dialog.instance) {
                if (bizagi.workportal.smartphone.widgets.dialog.instance.getResponseValues) {
                    dialogResponse = bizagi.workportal.smartphone.widgets.dialog.instance.getResponseValues(bizagi.workportal.smartphone.widgets.dialog.instance.getResponseValuesParams);
                    if (dialogResponse === null && action !== "save") {
                        bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-complexgateway-path"),
                            bizagi.localization.getResource("workportal-widget-complexgateway-error"));
                        return -1;
                    } else {
                        bizagi.workportal.smartphone.widgets.dialog.instance.dontClose = false;
                        bizagi.workportal.smartphone.widgets.dialog.instance.close();
                    }
                }
            }
        }

        return dialogResponse;
    },

    repaintComplexGateway: function () {
        var self = this;

        if (self.focus !== undefined) {
            if (self.focus.idCaseObject !== undefined) {
                if (self.focus.idCaseObject.isComplex !== undefined) {
                    self.dataService.getWorkitems({
                        idCase: self.focus.idCaseObject.idCase
                    }).done(function (data) {

                        if (data.workItems.length === 1) {
                            if (data.workItems[0].taskType === "ComplexGateway") {
                                var transitions = data.workItems[0].transitions;
                                self.currentPopup = "complexgateway";
                                $(document).triggerHandler("showDialogWidget", {
                                    widgetName: bizagi.workportal.widgets.widget
                                        .BIZAGI_WORKPORTAL_WIDGET_COMPLEXGATEWAY,
                                    data: {
                                        transitions: transitions
                                    },
                                    modalParameters: {
                                        title: "titulo",
                                        width: 200,
                                        height: 200
                                    },
                                    onClose: function () {
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    },

    /*
    *   Add a validation message to the form
    */
    addValidationMessage: function(validationMessage) {
        var self = this;
        if (typeof (validationMessage) == "string") {
            self.validationController.showValidationMessage(validationMessage);
        } else {
            $.each(validationMessage, function(i, message) {
                self.validationController.showValidationMessage(message);
            });
        }

        self.validationController.expandNotificationBox();

        // TODO: Review function
        var navigation = self.getNavigation();
        if (navigation && navigation.hasOwnProperty("undoRemoveLastSuscriber")) {
            self.getNavigation().undoRemoveLastSuscriber();
        }
    },

    startLoading: function (delay) {
        bizagi.util.smartphone.startLoading();
    },

    endLoading: function () {
        bizagi.util.smartphone.stopLoading();
    },

    dispose: function (params) {
        var self = this;

        // Active refresh on smartphone
        if (typeof (params) === "undefined" || (typeof (params.isRefresh) === "undefined" || params.isRefresh == false)) {
            self._super();
        }
    }
});
