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
        this._super(params);
    },

    /*  Template method to implement in each device to customize each container after processed
    ======================================================*/
    postRenderContainer: function (container) {
        var self = this;
        var properties = self.properties;
        self._super(container);
        var buttons = self.getButtons();
        //Set button length
        var lengthButtons = (buttons) ? buttons.length : 0;

        if (lengthButtons && bizagi.override.enableAutoSave) {

            $(document).data('auto-save', 'auto-save');

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

        //show bizagi events link if apply
        self.bind("ondomincluded", function () {
            $(document).trigger("attachEventElementToForm", self.params.idWorkitem || self.params.originalParams.idWorkitem);
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

    /* TEMPLATE METHOD TO GET THE BUTTONS OBJECTS
    ======================================================*/
    getButtons: function () {
        var self = this;
        var container = self.container;

        if (self.getParams() && (handler = self.getParams().getButtons))
            handler(self);

        // return self.getMenu().getContent().find(".bz-wp-mu-btn-custom :button");
        return $(".ui-bizagi-button-container :button", container);
    },

    processButtons: function () {

        var self = this;
        var container = self.container;
        //si no es con un if es con un publish
        if (self.getParams() && (handler = self.getParams().processButtons))
            handler(self);

        return this._super();
    },


    refreshForm: function(focus) {
        var self = this;
        var properties = self.properties;
        var params = self.getParams();
        var defer = new $.Deferred();
        focus = focus || self.getFocus();
        var options;
        if (typeof(params) !== "undefined" && (params.postRenderEdit || params.processButtons)) {            
            options = {
                focus: focus,
                xpathContext: properties.xpathContext,
                idPageCache: properties.idPageCache,
                isRefresh: true,
                postRenderEdit: params.postRenderEdit,
                processButtons: params.processButtons,
                originalParams: params.originalParams,
                menu: params.menu,
                getButtons: params.getButtons,
                action: self.getEndPointAction()
            };


        } else {
            if (typeof(properties) !== "undefined") {
                options = {
                    focus: focus,
                    xpathContext: properties.xpathContext,
                    idPageCache: properties.idPageCache,
                    isRefresh: true
                };
            } else {
                defer.resolve();
            }
        }

        // Notify the refresh event so the consumer takes the decision about what to do
        self.startLoading();
        $.when(self.triggerHandler("refresh", options))
            .done(function() {
                self.endLoading();
                defer.resolve();
            });

        return defer.promise();
    },

    getMenu: function () {
        var params = this.getFormContainer().getParams();
        return params.menu;
    },

    checkWidgetsData: function (action) {
        var dialogResponse = null;
        if (bizagi.workportal.smartphone.widgets.dialog) {
            if (bizagi.workportal.smartphone.widgets.dialog.instance) {
                if (bizagi.workportal.smartphone.widgets.dialog.instance.getResponseValues) {
                    dialogResponse = bizagi.workportal.smartphone.widgets.dialog.instance.getResponseValues(bizagi.workportal.smartphone.widgets.dialog.instance.getResponseValuesParams);
                    if (dialogResponse === null && action != "save") {                                                
                        bizagi.showMessageBox(bizagi.localization.getResource("workportal-widget-complexgateway-path"), bizagi.localization.getResource("render-widget-complexgateway-error"));
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
                        if (data.workItems.length == 1) {
                            if (data.workItems[0].taskType == "ComplexGateway") {
                                var transitions = data.workItems[0].transitions;
                                self.currentPopup = "complexgateway";
                                $(document).triggerHandler("showDialogWidget", {
                                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_COMPLEXGATEWAY,
                                    data: {
                                        transitions: transitions
                                    },
                                    modalParameters: {
                                        title: "titulo",
                                        width: 200,
                                        height: 200
                                    },
                                    onClose: function () {
                                        //
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
    addValidationMessage: function (validationMessage) {
        var self = this;
        if (typeof (validationMessage) == "string") {
            self.validationController.showValidationMessage(validationMessage);
        } else {
            $.each(validationMessage, function (i, message) {
                self.validationController.showValidationMessage(message);
            });
        }
        self.validationController.expandNotificationBox();
        self.getMenu().undoRemoveLastSuscriber();


    },

    startLoading: function (delay) {
        bizagi.util.smartphone.startLoading();
    },
    endLoading: function () {
        bizagi.util.smartphone.stopLoading();
    }


});