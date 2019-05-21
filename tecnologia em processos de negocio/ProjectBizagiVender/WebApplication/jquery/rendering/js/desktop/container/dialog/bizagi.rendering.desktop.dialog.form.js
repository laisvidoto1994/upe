/*
 *   Name: BizAgi Desktop Form Dialog Implementation
 *   Author: Diego Parra
 *   Comments:
 *   -   This script will shows a form inside a popup dialog in order to edit
 */

// Extends itself
$.Class.extend("bizagi.rendering.dialog.form", {
    POPUP_WIDTH: 768,
    POPUP_HEIGHT: 550

}, {
    /* 
    *   Constructor
    */
    init: function (dataService, renderFactory, dialogParams) {
        var self = this;
        var doc = window.document;

        //Attach the desired extra buttons, everyone need to have the localization id, so the label could match
        self.buttons = {};

        for (var item in dialogParams.extraButtons) {
            self.buttons[bizagi.localization.getResource(item)] = dialogParams.extraButtons[item];
        }

        // Define instance variables
        this.dataService = dataService;
        this.renderFactory = renderFactory;
        this.dialogDeferred = new $.Deferred();
        dialogParams = self.dialogParams = dialogParams || {};

        // Draw dialog box
        self.dialogBox = $("<div class='ui-bizagi-component-loading'/>");
        self.dialogBox.empty();
        self.dialogBox.appendTo("body", doc);

        // Create dialog box
        self.showDialogBox(self.dialogBox, dialogParams)
                .done(function (data) {
                    self.dialogDeferred.resolve(data);
                })
                .fail(function () {
                    self.dialogDeferred.reject();
                });
    },
    /*
    *   Render the form
    *   The params are the same that will be send to the ajax service
    *   Returns a deferred
    */
    render: function (params) {
        var self = this;

        // Fill dialog box
        self.renderDialogBox(self.dialogBox, params);

        // Return promise
        return self.dialogDeferred.promise();
    },
    /*
    *   Shows the dialog box in the browser
    *   Returns a promise that the dialog will be closed
    */
    showDialogBox: function (dialogBox, dialogParams, reverseButtons) {
        var self = this;
        var reverseButtons = self.dialogParams.orientation == "rtl" ? true : false;

        // Define buttons
        var buttons = {};
        var defer = new $.Deferred();

        // Define options
        var showSaveButton = bizagi.util.parseBoolean(dialogParams.showSaveButton) !== null ? bizagi.util.parseBoolean(dialogParams.showSaveButton) : true;
        var showCancelButton = bizagi.util.parseBoolean(dialogParams.showCancelButton) !== null ? bizagi.util.parseBoolean(dialogParams.showCancelButton) : true;
        var saveButtonLabel = dialogParams.saveButtonLabel ? dialogParams.saveButtonLabel : bizagi.localization.getResource("render-form-dialog-box-save");
        var cancelButtonLabel = dialogParams.cancelButtonLabel ? dialogParams.cancelButtonLabel : bizagi.localization.getResource("render-form-dialog-box-cancel");
        var maximized = bizagi.util.parseBoolean(dialogParams.maximized) !== null ? bizagi.util.parseBoolean(dialogParams.maximized) : false;

        if (bizagi.util.isIE()) {
            var buttons = [];

            if (showSaveButton) {
                buttons[0] = {
                    text: bizagi.localization.getResource("render-form-dialog-box-save"),
                    click: function (event) {
                        if (self.form) {
                            // load tabs
                            var form = self.form,
                            asyncTabsDef = $.Deferred(),
                            getAllTabs = form.getRenderByType("tabItem"),
                            getAllTabsLength = getAllTabs.length;

                            form.innerTabsLoading = true;

                            // Check
                            for (var i = 0; i < getAllTabsLength; i++) {
                                var render = getAllTabs[i];
                                // Resolve internal deferred
                                if (render.loadingDeferred && render.parent.container) {
                                    render.loadingDeferred.resolve();
                                }
                            }

                            delete form.innerTabsLoading;
                            // Resolve task deferred
                            asyncTabsDef.resolve({event: event});

                            $.when(asyncTabsDef.promise()).done(function (event) {
                                var event = event;
                                // Perform validations
                                if (self.form.validateForm()) {

                                    // Collect data
                                    var data = {};

                                    if (dialogParams.forceCollectData) {
                                        // Turn on flag to force to collect all data on the form
                                        $.forceCollectData = true;
                                        self.form.collectRenderValues(data);
                                        // Turn off flag
                                        $.forceCollectData = false;
                                    } else {
                                        self.form.collectRenderValues(data);
                                    }

                                    if (dialogParams.allowGetOriginalFormValues) {

                                        data.formValues = self.form.children;
                                    }

                                    // Add page cache for this form
                                    data.idPageCache = self.form.getPageCache();

                                    // Call user callback
                                    if (dialogParams.onSave && !$(event.currentTarget).prop("disabled")) {
                                        $(event.currentTarget).prop("disabled", true);
                                        $.when(dialogParams.onSave(data))
                                            .done(function (result) {
                                                $(event.currentTarget).prop("disabled", false);
                                                if (result == null || result == true || result.type == "success") {
                                                    defer.resolve();
                                                    self.closeDialogBox();
                                                } else if (result.type == "validationMessages") {
                                                    // Add validation messages 
                                                    self.form.addValidationMessage(result.messages);
                                                    // Update original value to use as reference to other futures changes in the dialogBox
                                                    $.each(data, function (key, value) {
                                                        var renders = self.form.getRenders(key);
                                                        $.each(renders, function (i, render) {
                                                            render.updateOriginalValue();
                                                        });
                                                    });
                                                } else if (result.type == "error") {
                                                    // Add error messages 
                                                    self.form.addErrorMessage(result.message);
                                                }
                                            }).fail(function(){
                                                $(event.currentTarget).prop("disabled", false);
                                            });

                                    } else {
                                        defer.resolve();
                                        self.closeDialogBox();
                                    }
                                }
                            });
                        }
                    }
                }
            }
            if (showCancelButton) {
                buttons[buttons.length] = {
                    text: bizagi.localization.getResource("render-form-dialog-box-cancel"),
                    click: function () {
                        dialogParams.onCancel && dialogParams.onCancel();
                        defer.reject();
                        self.closeDialogBox();
                    }
                }
            }

            //Attach the desired extra buttons 
            self.buttons = $.extend(buttons, self.buttons);

            if (reverseButtons)
                buttons.reverse();

        } else {

            if (showSaveButton) {
                buttons[saveButtonLabel] = function (event) {
                    if (self.form) {
                        // load tabs
                        var form = self.form,
                        asyncTabsDef = $.Deferred(),
                        getAllTabs = form.getRenderByType("tabItem"),
                        getAllTabsLength = getAllTabs.length;

                        form.innerTabsLoading = true;

                        // Check
                        for (var i = 0; i < getAllTabsLength; i++) {
                            var render = getAllTabs[i];
                            // Resolve internal deferred
                            if (render.loadingDeferred && render.parent.container) {
                                render.loadingDeferred.resolve();
                            }
                        }

                        delete form.innerTabsLoading;
                        // Resolve task deferred
                        asyncTabsDef.resolve({event: event});

                        $.when(asyncTabsDef.promise()).done(function (response) {
                            var event = response.event;
                            // Perform validations
                            if (self.form.validateForm()) {

                                // Collect data
                                var data = {};

                                if (dialogParams.forceCollectData) {
                                    // Turn on flag to force to collect all data on the form
                                    $.forceCollectData = true;
                                    self.form.collectRenderValues(data);
                                    // Turn off flag
                                    $.forceCollectData = false;
                                } else {
                                    self.form.collectRenderValues(data);
                                }

                                if (dialogParams.allowGetOriginalFormValues) {
                                    data.formValues = self.form.children;
                                }

                                // Add page cache for this form
                                data.idPageCache = self.form.getPageCache();

                                // Call user callback
                                if (dialogParams.onSave && !$(event.currentTarget).prop("disabled")) {
                                    $(event.currentTarget).prop("disabled", true);
                                    $.when(dialogParams.onSave(data))
                                        .done(function (result) {
                                            $(event.currentTarget).prop("disabled", false);
                                            if (result == null || result == true || result.type == "success") {
                                                defer.resolve();
                                                self.closeDialogBox();
                                            } else if (result.type == "validationMessages") {
                                                // Add validation messages 
                                                self.form.addValidationMessage(result.messages);
                                                // Update original value to use as reference to other futures changes in the dialogBox
                                                $.each(data, function (key, value) {
                                                    var renders = self.form.getRenders(key);
                                                    $.each(renders, function (i, render) {
                                                        render.updateOriginalValue();
                                                    });
                                                });
                                            } else if (result.type == "error") {
                                                // Add error messages 
                                                self.form.addErrorMessage(result.message);
                                            }
                                        }).fail(function(){
                                            $(event.currentTarget).prop("disabled", false);
                                        });;

                                } else {
                                    defer.resolve();
                                    self.closeDialogBox();
                                }
                            }
                        });
                    }
                };
            }
            if (showCancelButton) {
                buttons[cancelButtonLabel] = function () {
                    dialogParams.onCancel && dialogParams.onCancel();
                    defer.reject();
                    self.closeDialogBox();
                };
            }

            //Attach the desired extra buttons 
            self.buttons = $.extend(buttons, self.buttons);

            //Orientation RTL - OrderBut
            if (self.dialogParams.orientation == "rtl") {
                var objButtons;
                var nameButon;
                for (var prop in buttons) {
                    objButtons = buttons[prop];
                    nameButon = prop;
                    break;
                }

                delete buttons[nameButon];
                buttons[nameButon] = objButtons;

            }

        }

        // Creates a dialog
        dialogBox.dialog({
            width: this.Class.POPUP_WIDTH,
            height: this.Class.POPUP_HEIGHT,
            title: dialogParams.title,
            modal: true,
            buttons: self.buttons,
            resizable: false,  // This one is to avoid a memory leak, DO NOT CHANGE PLEASE
            maximized: maximized,
            open: function (event, ui) {
                // only for windows 8 App
                if (typeof Windows !== "undefined") {
                    $(window).bind("resize.dialog", self._appresize.bind(self));
                    $(self.dialogBox).dialog('widget').show();
                }
                if (maximized) {
                    // remove scroll bar
                    $("body", window.document).css("position", "fixed");
                }
            },
            close: function () {
                if (typeof Windows !== "undefined") {
                    $(window).unbind("resize.dialog");
                }

                // set scroll bar
                $("body", window.document).css("position", "static");

                defer.reject();
                self.closeDialogBox();
            },
            resizeStop: function (event, ui) {
                if (self.form) {
                    self.form.resize(ui.size);
                }
            }
        });

        self.adjustOverlay();

        // Return promise
        return defer.promise();
    },
    _appresize: function (args) {
        var self = this;
        $(self.dialogBox).dialog('widget').css({
            left: ((window.screen.width / 2) - (self.Class.POPUP_WIDTH / 2)) + "px",
            top: ((window.screen.height / 2) - (self.Class.POPUP_HEIGHT / 2)) + "px",
            width: self.Class.POPUP_WIDTH + "px",
            height: self.Class.POPUP_HEIGHT + "px"
        }).show();

    },
    /*
    *   Closes the dialog box
    */
    closeDialogBox: function () {
        var self = this;
        var dialogBox = self.dialogBox;

        // set scroll bar
        $("body", window.document).css("position", "static");

        dialogBox.dialog('destroy');
        dialogBox.remove();
        // Send the form to the hell, please dont remove this line, make a several bugs!!
        self.dispose();
    },
    /**
    * Sets the focus to the first control
    */
    focusFirstControl: function (form, time) {
        // Configures effect
        var effect = function () {
            var defaultControl = $("input:visible, select:visible, option:visible, textarea:visible", form.container).not(".ui-bizagi-render-date,.ui-bizagi-render-search");
            if (defaultControl.length > 0) {
                // fix for retype double
                var controlHtml = $(defaultControl[0]).closest(".ui-bizagi-render");
                var xpath = controlHtml.length > 0 ? controlHtml.data("render-xpath") : "";
                var control = xpath ? form.getRender(xpath) : "";
                if (control) {
                    if (control.properties && control.properties.retype && control.properties.retype === "double") {
                        return;
                    }
                }
                // Focus control
                var innerControl = defaultControl[0];
                try {
                    innerControl.focus();
                } catch (e) {
                };
            }
        };

        // Run effect
        if (time > 0) {
            setTimeout(effect, time);

        } else {
            effect();
        }
    },
    /*
    * Renders the dialog box content
    */
    renderDialogBox: function (dialogBox, params) {
        var self = this;
        var def = new $.Deferred();

        // Clear dialog box
        dialogBox.empty();

        // Check context
        try {
            if (self.form && self.form.params.data.contextType) {
                params.contextType = self.form.params.data.contextType;
            }
        } catch (e) { }
        if (params.rewriteContextType === true) {
            //self.properties.contextType
        }

        // Load template and data
        return $.when(self.dataService.getFormData(params)).pipe(function (data) {

            // Apply recordXpath
            if (params.recordXPath) {
                data.form.properties.recordXpath = params.recordXPath;
            }

            // Apply contextType
            data.form.contextType = params.contextType;
            if (params.rewriteContextType) {
                data.form.contextType = undefined;
            }

            // Apply editable param
            if (params.editable === false) {
                data.form.properties.editable = false;

                // The actions don't apply in dialog form
                self.removeActions(data.form);
            }

            // Apply required param
            if (params.required === false) {
                data.form.properties.required = false;
            }

            // The transitions don't apply in dialog form
            self.removeTransitions(data.form);

            // Render dialog template
            self.form = self.renderFactory.getContainer({
                type: "form",
                data: data.form,
                focus: params.focus || false,
                selectedTabs: params.selectedTabs,
                isRefresh: params.isRefresh || false,
                requestedForm: params.requestedForm
            });

            def.resolve(self.form);

            // Return rendering promise
            return self.form.render();
        }, function (message) {
            /*** FAIL FILTER **/
            var errorTemplate = self.renderFactory.getCommonTemplate("form-error");
            if (typeof message == "object" && message.responseText) {
                var objMessage = JSON.parse(message.responseText);
                message = "Error:" + objMessage.errorType + "<br>" + objMessage.message || " Error in form ";
            }

            // Clear dialog box
            $("*", dialogBox).remove();

            $.tmpl(errorTemplate, {
                message: message
            }).appendTo(dialogBox);
        }).done(function (element) {
            // Remove button container
            $(".ui-bizagi-button-container", element).remove();

            // Append form  in the dialog
            $('.ui-bizagi-loading-message', dialogBox).remove();
            dialogBox.data("loading", false);
            dialogBox.removeClass("ui-bizagi-component-loading");
            dialogBox.html(element);

            // Customize dialog box
            dialogBox = self.customizeDialogBox(dialogBox);

            // Publish an event to check if the form has been set in the DOM
            self.form.triggerHandler("ondomincluded");

            // Scroll to element if has scroll top set
            if (params.scrollTop) {
                // Restore scroll at same position
                self.form.container.parent().scrollTop(params.scrollTop);
            } else {
                // Focus into first control
                self.focusFirstControl(self.form, 150);
            }

            // Attach a refresh handler to recreate all the form
            self.form.bind("refresh", function (_, refreshParams) {
                // Check current scroll in parent
                refreshParams.scrollTop = self.form.container.parent().scrollTop();
                refreshParams = $.extend({
                    focus: focus,
                    selectedTabs: self.form.getSelectedTabs(),
                    isRefresh: true
                }, refreshParams);

                return self.renderDialogBox(dialogBox, refreshParams);
            });
        });

        return def.promise();
    },
    /*
    *   This method can be overriden in order to customize the dialog form rendering
    */
    customizeDialogBox: function (dialogBox) {
        return dialogBox;
    },

    /*
    * This method removes the transitions
    */
    removeTransitions: function (data) {
        data = data || {};

        if (data.transitions) {
            delete data.transitions;
        }
    },

    /*
    * This method removes the actions
    */
    removeActions: function (data) {
        data = data || {};

        if (data.actions) {
            delete data.actions;
        }
    },

    dispose: function () {
        var self = this;
        if (self.form) self.form.dispose();
        bizagi.util.dispose(self.buttons);
        bizagi.util.dispose(self);
    },

    adjustOverlay: function () {
        var overlay = $(".ui-widget-overlay.ui-front");
        var body = $("body");
        var canvas = $("#render-canvas");
        var overlayHeight = parseInt(overlay.height());
        var overlayBody = parseInt(body.height());
        var overlayCanvas = parseInt(canvas.height());

        if (overlayHeight < overlayBody) {
            overlay.height(overlayBody);
            overlayHeight = overlayBody;
        }
        if (overlayHeight < overlayCanvas) {
            overlay.height(overlayCanvas);
        }
    }

});
