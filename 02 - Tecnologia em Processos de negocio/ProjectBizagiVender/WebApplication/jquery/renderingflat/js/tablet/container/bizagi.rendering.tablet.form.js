/*
*   Name: BizAgi Tablet Form Extension
*   Author: Diego Parra
*   Comments:
*   -   This script will redefine the container class to adjust to tablet devices
*   -   Will apply a desktop form template
*/

// Auto extend
bizagi.rendering.form.extend("bizagi.rendering.form", {

    /**
     * CONSTRUCTOR
     * 
     * @param {} params 
     * @returns {} 
     */
    init: function (params) {
        var self = this;
        params = params || {};
        // Define variables
        self.warnings = {};
        self.errors = {};

        // Call base
        this._super(params);
    },

    /*
    *   Template method to implement in each device to customize the container's behaviour to add handlers
    */
    configureHandlers: function () {
        var self = this;
        var complexGatewayContainer;
        var form = self.container;

        if (form.length > 1) {
            $(form).each(function () {
                if ($(this).hasClass('ui-bizagi-container-complexgateway')) {
                    complexGatewayContainer = this;
                }
            });
        } else {
            complexGatewayContainer = $(".ui-bizagi-container-complexgateway", form);
        }

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
            self.configureMediaQueryHandlers();
            self.readyDeferred.resolve();
        });

        // Set events for complex gateway interface - Tablet flat
        $(".bz-rn-cg-checkbox-control", complexGatewayContainer).bind("click", function () {
            var checkboxLabel = $("label", this);

            var transitionId = checkboxLabel.data("value") || "";
            if (typeof self.activeTransitions[transitionId] == "undefined") {
                self.activeTransitions[transitionId] = false;
            }

            if (bizagi.util.parseBoolean(checkboxLabel.data("checked"))) {
                // Uncheck element
                checkboxLabel.removeClass("ui-checkbox-state-checked");
                checkboxLabel.removeClass("bz-check").addClass("bz-full-ball");
                checkboxLabel.data("checked", false);
                self.activeTransitions[transitionId] = false;
            } else {
                // Check element
                checkboxLabel.addClass("ui-checkbox-state-checked");
                checkboxLabel.addClass("bz-mo-icon").addClass("bz-check").removeClass("bz-full-ball");
                checkboxLabel.data("checked", true);
                self.activeTransitions[transitionId] = true;
            }
        });
    },

    /**
     * Just to tablet devices is called after the form is in the dom
     * in order to define if the form must be showed vertical
     * @param {}
     * @returns {}
     */
    configureMediaQueryHandlers: function(){
        var self = this;
        var mediaquery = window.matchMedia("(max-width: 600px)");
        function handleOrientationChange(mediaquery) {
            if (mediaquery.matches) {
                // mediaquery dentro de 600                
                if (self.container){
                    $(".ui-bizagi-render", self.container).addClass("vertical");
                }
            } else {
                // mediaquery fuera de 600                
                if (self.container) {
                    $(".ui-bizagi-render", self.container).removeClass("vertical");
                }
            }
        }
        mediaquery.addListener(handleOrientationChange);
        handleOrientationChange(mediaquery);
    },

    /**
     * Template method to implement in each device to customize each container after processed
     * 
     * @param {} container 
     * @returns {} 
     */
    postRenderContainer: function (container) {
        var self = this;
        var properties = self.properties;
        self._super(container);
        var buttons = self.getButtons();

        //disable overflow-scrolling touch untill the form is loaded QA-2178
        if (bizagi.util.detectDevice() != "tablet_android") {
            $(".km-native-scroller").css("-webkit-overflow-scrolling", "inherit");
        }

        // Show warnings
        if (!bizagi.util.isObjectEmpty(self.warnings)) {
            var warningContainer = $('<ul class="ui-bizagi-form-warnings"></ul>');
            for (var key in self.warnings) {
                warningContainer.append($('<li>' + key + '</li>'));
            }

            // Add button
            $("<button>" + "X" + "</button>").appendTo(warningContainer);

            // Append to body 
            warningContainer.prependTo(self.container);
            warningContainer.click(function () {
                warningContainer.detach();
            });
        }

        // Show errors
        if (!bizagi.util.isObjectEmpty(self.errors)) {
            var errorContainer = $('<ul class="ui-bizagi-form-errors"></ul>');
            for (var ekey in self.errors) {
                errorContainer.append($('<li>' + ekey + '</li>'));
            }

            // Add button
            $("<button>" + "X" + "</button>").prependTo(errorContainer);

            // Append to body 
            errorContainer.appendTo(self.container);
            errorContainer.click(function () {
                errorContainer.detach();
            });

            // Hide routing buttons when an error was found
            $.each(properties.buttons, function (i, button) {
                if (button.routing) {
                    self.getButtons().eq(i).prop("disabled", true);
                }
            });
        }

        //Set button length
        var lengthButtons = (buttons) ? buttons.length : 0;

        if (lengthButtons) {

            $(document).data("auto-save", "auto-save");

            //bind event auto-save
            $(document).unbind("save-form").bind("save-form", function (e, deferredSave) {
                self.autoSaveEvents(deferredSave);
            });

            //bind event beforeunload
            $(window).unbind('beforeunload').bind('beforeunload', function (e) {

                var newData = {};
                self.collectRenderValues(newData);
                //if there are changes in the form show a message
                if (!$.isEmptyObject(newData) && $(document).data('auto-save')) {

                    return bizagi.localization.getResource("confirmation-savebox-message2");
                }

                return;

            });

        }

        //enable overflow-scrolling touch to avoid black frame over the form QA-2178
        if (bizagi.util.detectDevice() != "tablet_android") {
            setTimeout(function () {
                $(".km-native-scroller").css("-webkit-overflow-scrolling", "touch");
            }, 1000);
        }

    },
    /**
     * Auto Save Events
     * 
     * @param {} deferredSave 
     * @param {} saveBox 
     * @returns {} 
     */
    autoSaveEvents: function (deferredSave, saveBox) {

        var self = this;
        var data = {};
        self.collectRenderValues(data);

        if (!$.isEmptyObject(data)) {

            $.when(bizagi.showSaveBox(bizagi.localization.getResource("confirmation-savebox-message1"), "Bizagi", "warning")).done(function () {
                self.saveForm();
                deferredSave.resolve();
            }).fail(function () {
                deferredSave.resolve();
            });

        } else {
            deferredSave.resolve();
        }

    },

    /**
     * Retorna el pane donde se pintó la forma para facilitar navegacion de kendo
     * @returns {*}
     */
    getPane: function () {
        var self = this;
        return self.pane;
    },

    /* TEMPLATE METHOD TO GET THE BUTTONS OBJECTS
     ======================================================*/
    getButtons: function () {
        var self = this;
        var container = self.container;

        return $(".ui-bizagi-button-container .action-button", container);
    },

    processButtons: function () {
        var self = this;
        var params = self.getParams();

        //si no es con un if es con un publish
        if (params && params.processButtons) {
            var handler = params.processButtons;
            handler(self);
        }

        var properties = self.properties;
        var buttons = self.getButtons();

        properties.buttons = self.buttons || buttons;

        //to cache a submit Data Buttom if exist
        self.saveButton = null;
        self.nextButton = null;

        //Set saveButton and nextButton if exist
        for (var i = 0, length = properties.buttons.length; i < length; i++) {
            if (properties.buttons[i].action == 'save') {
                self.saveButton = properties.buttons[i];
            } else if (properties.buttons[i].action == 'next') {
                self.nextButton = properties.buttons[i];
            }
        }

        var navigation = self.getNavigation();

        if (typeof (navigation) !== "undefined") {
            navigation.setNavigationButtons(self);
        }

        self._super();
    },

    /*
     *   Refresh the current form
     */
    refreshForm: function (focus) {
        var self = this;
        var properties = self.properties;
        var params = self.getParams();
        var deferred = $.Deferred();
        var options;

        focus = focus || self.getFocus();

        // Normalize new focus structure if not present
        if (focus && !focus.id) {
            focus = {
                id: focus
            };
        }

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
            options.isOfflineForm = self.params.isOfflineForm || false;
            options.formsRenderVersion = self.params.formsRenderVersion || 0;
            options.postRenderEdit = params.postRenderEdit;
            options.processButtons = params.processButtons;
            options.originalParams = params.originalParams || {};
            options.getButtons = params.getButtons;
        }

        $(".km-native-scroller").css("-webkit-overflow-scrolling", "inherit");

        // Notify the refresh event so the consumer takes the decision about what to do
        self.startLoading();
        $.when(self.triggerHandler("refresh", options)).done(function () {
            self.endLoading();

            setTimeout(function () {
                $(".km-native-scroller").css("-webkit-overflow-scrolling", "touch");
            }, 1000);

            deferred.resolve();
        }).fail(function () {
            self.endLoading();
            deferred.reject();
        });
        return deferred.promise();
    },

    checkWidgetsData: function () {
        var popupResponse = null;
        if (bizagi.workportal.tablet.popup) {
            if (bizagi.workportal.tablet.popup.instance) {
                if (bizagi.workportal.tablet.popup.instance.getResponseValues) {
                    popupResponse = bizagi.workportal.tablet.popup.instance.getResponseValues(bizagi.workportal.tablet.popup.instance.getResponseValuesParams);
                    if (popupResponse === null) {
                        bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-complexgateway-path"),
                            bizagi.localization.getResource("workportal-widget-complexgateway-error"));
                        return -1;
                    } else {
                        bizagi.workportal.tablet.popup.instance.dontClose = false;
                        bizagi.workportal.tablet.popup.instance.close();
                    }
                }
            }
        }

        return popupResponse;
    },

    repaintComplexGateway: function () {
        var self = this;
        if (self.focus !== undefined) {
            if (self.focus.idCaseObject !== undefined) {
                if (self.focus.idCaseObject.isComplex !== undefined) {
                    self.dataService.getWorkitems({
                        idCase: self.focus.idCaseObject.idCase
                    }).done(function (data) {
                        if (data.workItems.length == 1) {
                            if (data.workItems[0].taskType == "ComplexGateway") {
                                var transitions = data.workItems[0].transitions;

                                self.currentPopup = "complexgateway";
                                $(document).triggerHandler("popupWidget", {
                                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_COMPLEXGATEWAY,
                                    options: {
                                        transitions: transitions,
                                        sourceElement: ".ui-bizagi-form",
                                        insertAfter: ".ui-bizagi-form .ui-bizagi-button-container",
                                        height: 'auto',
                                        offset: "8 0", //x y
                                        activeScroll: false,
                                        dontClose: true,
                                        closed: function () {
                                            self.currentPopup = null;
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    },

    /* METHOD TO ADD WARNINGS TO THE FORM
    ======================================================*/
    addWarning: function (message) {
        var self = this;
        self.warnings[message] = message;
    },

    /* METHOD TO ADD ERRORS TO THE FORM
    ======================================================*/
    addError: function (message) {
        var self = this;
        self.errors[message] = message;
    },

    /*  Executes a single button action
    ======================================================= */
    processButton: function (buttonProperties) {
        var self = this;
        var deferred = $.Deferred();

        // Disable routing button
        if (!bizagi.util.isObjectEmpty(self.errors)) {
            deferred.resolve();
            if (bizagi.util.parseBoolean(buttonProperties.routing))
                return deferred.promise();
        }

        // Call base
        return this._super(buttonProperties);
    },


    getNavigation: function () {
        var params = this.getFormContainer().getParams();
        return params.navigation;
    },


    /**
    *   Adds an overlay to the form, and sets a waiting message
    *
    *   @argument {bool} delay Apply delay
    */
    startLoading: function () {
        bizagiLoader().start();
    },

    /*
    *   Removes the overlay and restores the form edition
    */
    endLoading: function () {
        bizagiLoader().stop();
    },

    dispose: function (params) {
        var self = this;

        // Active refresh on tablet
        if (typeof (params) === "undefined" || (typeof (params.isRefresh) === "undefined" || params.isRefresh == false)) {
            self._super();
        }
    }
});