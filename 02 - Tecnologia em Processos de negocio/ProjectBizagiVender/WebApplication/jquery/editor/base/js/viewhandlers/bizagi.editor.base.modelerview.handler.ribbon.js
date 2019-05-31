/*
*   Name: BizAgi Form Modeler View Ribbon Handlers
*   Author: ALexander Mejia
*   Comments:
*   -   This script will handler modeler view ribbon handlers
*/
bizagi.editor.modelerView.extend("bizagi.editor.modelerView", {}, {

    /*
    *   Draws the layout navigator component in the layout
    */
    drawRibbon: function () {
        var self = this;

        // Define canvas
        var canvas = $("<div />")
            .appendTo(self.mainContainer.find("#ribbon-panel"));

        // Define model
        var model = self.executeCommand({ command: "getRibbonModel", validFormChecked: self.validateForm });
        var presenter = self.ribbon = new bizagi.editor.component.ribbon.presenter({ canvas: canvas, model: model });

        // Define handlers
        presenter.subscribe("onItemClicked", function (e, args) { self.onItemRibbonClick($.extend(args, { guid: presenter.getGuid() })); });

        // Render and return 
        return presenter.render();
    },

    /*
    *   Enabled / disabled options in ribbon when a command is executed or an element is selected
    */
    refreshRibbon: function (guid) {
        var self = this;

        if (self.controller.thereAreMultiselection()) {
            guid = bizagi.editor.utilities.getGuidEmpty();
        }

        guid = guid || self.currentSelectedElement;

        // Fetch the model
        $.when(self.executeCommand({ command: "getConvertToModel", guid: guid })).
            done(function (convertToModel) {
                var ribbonModel = self.executeCommand({ command: "getRibbonModel", guid: guid, convertToModel: convertToModel, validFormChecked: self.validateForm });
                if (self.ribbon) {
                    self.ribbon.render({ model: ribbonModel, guid: guid });
                }
            });
    },

    /*
    *   Process layout double click
    */
    onItemRibbonClick: function (args) {
        var self = this,
            action = args.action;

        // Process automatic property changing
        if (args.property && args.value && !args.action) {
            if (args.value != "expression") {
                // Execute change property
                self.executeCommand({ command: "changeProperty", guid: args.guid, property: args.property, value: args.value });
            } else {
                // Show expression selector
                self.showExpressionSelector(args.property, args.guid);
            }
        }

        // Execute actions
        if (action == "undo") self.performUndo();
        if (action == "redo") self.performRedo();
        if (action == "save") self.performSave();
        if (action == "copy-from") self.performCopyFrom();
        if (action == "switchForm") self.performSwitchForm();
        if (action == "setuseoffline") self.performSetUseOffline();
        if (action == "copy-format") self.performCopyFormat(args);
        if (action == "actionsvalidations") self.performShowActionsValidations();
        if (action == "formproperties") self.performShowFormProperties();
        if (action == "delete") self.performDelete(args.guid);
        if (action == "rename") self.performRename(args.guid);
        if (action == "validate") self.performValidate();
        if (action == "Language") self.performChangeEditorLanguage(args);
        if (action == "useCustomButtons") self.enableOrDisableCustomButtons(args);
        if (action == "checkout") self.performCheckout(args);
        if (action == "useOfflineForm") self.enableOrDisableOfflineFormOption(args);
        if (action == "offlineAsOnline") self.performSetOfflineAsOnline(args);
	if (action == "emailTemplate") self.performEmailTemplate(args);

        // For Convert To
        if (action == "convert") {
            self.performConvertTo(args);
        }
    },

    performConvertTo: function (args) {
        var self = this;
        self.executeCommand({ command: "convertTo", guid: args.guid, convertTo: args.property });
    },

    /*
    *   Execute undo
    */
    performUndo: function () {
        var self = this;
        self.undo();
    },

    /*
    *   Execute redo
    */
    performRedo: function () {
        var self = this;
        self.redo();
    },

    /*
    *   Save the form
    */
    performSave: function (closeForm) {
        var self = this;

        if (self.dialog) { return; }

        $.when(self.processValidations({ canRefresh: true }))
            .done(function (result) {
                if (self.controller.thereAreChangesInForm() || (!self.controller.isReadOnlyForm() && result.showMessage)) {

                    if (result.showMessage || closeForm) {

                        self.dialog = new bizagi.editor.component.dialog.presenter();
                        var model = {
                            name: 'bz-dialog-perfomsave',
                            title: self.controller.isTemplateContext() ? bizagi.localization.getResource("bizagi-editor-template-dialog-save") : bizagi.localization.getResource("bizagi-editor-form-dialog-save"),
                            message: result.showMessage ?
                                self.controller.isTemplateContext() ? bizagi.localization.getResource("bizagi-editor-template-save-warning-message") : bizagi.localization.getResource("bizagi-editor-form-save-warning-message") :
                                self.controller.isTemplateContext() ? bizagi.localization.getResource("bizagi-editor-template-save-message") : bizagi.localization.getResource("bizagi-editor-form-save-message"),
                            buttons: [{
                                text: bizagi.localization.getResource("bizagi-editor-form-dialog-yes"),
                                legend: self.getLegendYesOption({ showMessage: result.showMessage, close: closeForm }),
                                style: "bz-studio bz-yes-no_16x16_standard",
                                click: function () {

                                    $.when(self.saveForm())
                                        .done(function () {
                                            if (closeForm) { self.closeForm(); }
                                        });

                                }
                            }, {
                                text: bizagi.localization.getResource("bizagi-editor-form-dialog-no"),
                                legend: self.getLegendNoOption({ showMessage: result.showMessage, close: closeForm }),
                                style: "bz-studio bz-false_16x16_standard",
                                click: function () {
                                    if (closeForm) { self.closeForm(); }
                                }
                            }]
                        };

                        self.addCancelButton({ showMessage: result.showMessage, close: closeForm, model: model });

                        // Show the editor and update the changes when done
                        $.when(self.dialog.show({ data: model }))
                            .done(function (fn) {
                                setTimeout(function () {
                                    if (typeof fn === "function") { fn.call(self); }
                                    self.dialog = null;
                                }, 0);
                            });
                    }
                    else {
                        self.saveForm();
                    }
                }
                else if (closeForm) {
                    self.closeForm();
                }
            });
    },

    /*
    *   Execute copy from
    */
    performCopyFrom: function () {
        var self = this;

        var copyFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "copyform"
        });

        $.when(copyFormProtocol.processRequest()).done(function (data) {
            if (data) {
                self.executeCommand({
                    command: "insertElements",
                    data: data
                });
            }
        });
    },

    performCopyFormat: function (args) {
        var self = this;
        self.executeCommand({ command: "copyFormat", guid: args.guid });
    },

    /*
    *   Execute switch form
    */
    performSwitchForm: function () {
        var self = this;

        if (self.dialog) { return; }

        $.when(self.processValidations({ canRefresh: true }))
            .done(function (result) {
                if (self.controller.thereAreChangesInForm() || result.showMessage) {

                    if (result.showMessage) {

                        self.dialog = new bizagi.editor.component.dialog.presenter();
                        var model = {
                            name: 'bz-dialog-perfomsave',
                            title: bizagi.localization.getResource("bizagi-editor-form-dialog-save"),
                            message: result.showMessage ? bizagi.localization.getResource("bizagi-editor-form-save-warning-message") : bizagi.localization.getResource("bizagi-editor-form-save-message"),
                            buttons: [{
                                text: bizagi.localization.getResource("bizagi-editor-form-dialog-yes"),
                                legend: self.getLegendYesOption({ showMessage: result.showMessage, close: false }),
                                style: "bz-studio bz-yes-no_16x16_standard",
                                click: function () {

                                    $.when(self.saveForm())
                                        .done(function () {
                                            self.switchForm();
                                        });

                                }
                            }, {
                                text: bizagi.localization.getResource("bizagi-editor-form-dialog-no"),
                                legend: self.getLegendNoOption({ showMessage: result.showMessage, close: false }),
                                style: "bz-studio bz-black bz-false_16x16_black",
                                click: function () {
                                    self.switchForm();
                                }
                            }]
                        };

                        self.addCancelButton({ showMessage: result.showMessage, close: true, model: model });

                        // Show the editor and update the changes when done
                        $.when(self.dialog.show({ data: model }))
                            .done(function (fn) {
                                setTimeout(function () {
                                    if (typeof fn === "function") { fn.call(self); }
                                    self.dialog = null;
                                }, 0);
                            });
                    }
                    else {
                        $.when(self.saveForm())
                            .done(function () {
                                self.switchForm();
                            });
                    }
                }
                else {
                    self.switchForm();
                }
            });
    },

    /*
    *   Execute set use offline as online
    */
    performSetUseOffline: function () {
        var self = this;

        var setUseOfflineProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "setuseoffline"
        });

        $.when(setUseOfflineProtocol.processRequest()).done(function (data) {
        });
    },

    /*



    *   Execute actions and validations
    */
    performShowActionsValidations: function () {
        var self = this;

        self.drawCommandsEditor();

    },

    /*
    *   Show form properties
    */
    performShowFormProperties: function () {
        var self = this;

        // Draw property box
        self.drawPropertyBox({ formProperties: true });
    },

    /*
    *   Delete a selected element
    */
    performDelete: function (guid) {
        var self = this;

        self.hidePropertyBox();
        self.executeCommand({
            command: "removeElementById",
            guid: guid
        });
    },

    /*
    *   Rename a selected element
    */
    performRename: function (guid) {
        var element;

        // TODO: Change this behaviour when performing rendering hacks refactor
        element = $('[guid="' + guid + '"]');
        if (!(element.find(".ui-bizagi-container-input-editable > input.ui-bizagi-input-editable").length > 0)) {
            $('label', element).trigger('dblclick');
        }
    },

    /*
    *   check uncheck validate option
    */
    performValidate: function () {
        var self = this;

        self.validateForm = !self.validateForm;
        if (self.validateForm) {
            self.controller.isTemplateContext() ?
                self.processTemplateValidations({ canRefresh: true }) :
                self.processValidations({ canRefresh: true });
        }
        else {
            self.removeValidations({ canRefresh: true });
        }
    },

    /*
    *   Sets editor language
    */
    performChangeEditorLanguage: function (args) {
        var self = this;

        args.canValidate = true;
        bizagi.editorLanguage = args.value;
        self.refresh(args);
    },

    /*
    *
    */
    performSetOfflineAsOnline: function () {
        var self = this;

        var value = self.controller.isOfflineAsOnline();
        value = !value;

        var loadFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "setuseoffline",
            value: value
        });

        $.when(loadFormProtocol.processRequest()).done(function (result) {
            if (result) {
                self.controller.setOfflineAsOnline(value);
                self.refreshRibbon();
            }
        });
    },

    /*
    * Enables or disables offline form option
    */
    enableOrDisableOfflineFormOption: function () {
        var self = this;
        var guid = self.controller.getContextInfo().guid;
        var value = self.executeCommand({ command: "getElementProperty", guid: guid, property: "useofflineform" });

        value = value || false;

        // Change property
        self.executeCommand({
            command: "changeProperty",
            guid: guid,
            property: "useofflineform",
            value: !value
        });

    },
    
    /*
    * Invoke email integration wizard
    */
    performEmailTemplate: function () {

        var self = this;
        var guid = self.controller.getContextInfo().guid;
        var value = self.executeCommand({ command: "getElementProperty", guid: guid, property: "emailintegration" });

        bizagi.log("VALUE " + value);
        var loadTemplateProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "loadtemplate",
            template: value ? value : { baref: { ref: "template"} }
        });

        $.when(loadTemplateProtocol.processRequest()).done(function (data) {
            if (data && !data.isEmpty) {
                self.executeCommand({
                    command: "changeProperty",
                    guid: guid,
                    property: "emailintegration",
                    value: data
                });
            }
        });
    },

    /*
    *   Enables or disables custom button bar
    */
    enableOrDisableCustomButtons: function () {
        var self = this;
        var guid = self.controller.getContextInfo().guid;
        var value = self.executeCommand({ command: "getElementProperty", guid: guid, property: "usecustombuttons" });
        var ribbonModel = self.controller.getRibbonModel();

        // If value is true and setting false, show a warning first
        if (value == true) {
            var message = bizagi.localization.getResource("formmodeler-component-ribbon-useCustomButtons-validation");
            $.when(bizagi.showConfirmationBox(message, "Bizagi", "warning"))
            .done(function () {
                value = value || false;

                // hide email options of Ribbon
                ribbonModel.hideGroup("email");
                // Change property
                self.executeCommand({
                    command: "changeProperty",
                    guid: guid,
                    property: "usecustombuttons",
                    value: !value
                });
               // Change property button Set Template
               self.executeCommand({
                   command: "changeProperty",
                   guid: guid,
                   property: "useemailoption",
                   value: !value
               });
            });
        } else {
            value = value || false;

            // show email option of ribbon
            ribbonModel.showGroup("email");
            // Change property
            self.executeCommand({
                command: "changeProperty",
                guid: guid,
                property: "usecustombuttons",
                value: !value
            });
            // Change property button Set Template
            self.executeCommand({
                command: "changeProperty",
                guid: guid,
                property: "useemailoption",
                value: !value
            });
        }
    },

    /*
    * This method performs checkout process
    */
    performCheckout: function (args) {
        var self = this;

        $.when(self.checkStatusForm())
            .done(function (data) {
                if (data.isInCheckout) {
                    self.showUserInformation();
                } else {
                    self.checkoutForm();
                }
            });
    },

    // **********************************************HELPER FUNCTIONS***********************************************
    //**************************************************************************************************************

    /*
    *   Gets MDBAS and call c# service
    */
    saveForm: function () {
        var self = this;
        var defer = $.Deferred();

        var renderArea = $("#container-layout");
        $.when(self.executeCommand({ command: "saveModel" }))
            .done(function (jsonForm) {

                var model = { message: bizagi.localization.getResource("formmodeler-component-wait-message-save") };
                var presenter = new bizagi.editor.component.wait.presenter({ model: model, renderArea: renderArea });

                $.when(presenter.render())
                    .done(function () {
                        var saveFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({ protocol: "saveform", jsonForm: jsonForm });

                        setTimeout(function () {
                            $.when(saveFormProtocol.processRequest())
                                .done(function () {
                                    self.controller.setNewForm(false);
                                    self.refreshRibbon();
                                    self.refreshPropertyBox();
                                    presenter.destroy();
                                    defer.resolve();
                                });
                        }, 200);

                    });


            });

        return defer.promise();
    },

    /*
    *   Closes the current form
    */
    closeForm: function () {

        var closeFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "closeform"
        });

        $.when(closeFormProtocol.processRequest())
            .done(function () {

            });
    },

    switchForm: function () {
        var switchFormProtocol = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "switchform"
        });

        $.when(switchFormProtocol.processRequest()).done(function (data) {
        });
    },

    /*
    *   Adds cancel button
    */
    addCancelButton: function (data) {
        var self = this;

        if (data.close) {
            data.model.buttons.push(
                {
                    text: bizagi.localization.getResource("bizagi-editor-form-dialog-cancel"),
                    style: "bz-studio bz-error_16x16_standard",
                    legend: self.getLegendCancelOption(data)
                });
        }
    },

    /*
    * Gets legend for YES option
    */
    getLegendYesOption: function (data) {
        var self = this;
        		
        if (data.showMessage && data.close) {
            return self.controller.isTemplateContext() ? bizagi.localization.getResource("bizagi-editor-template-dialog-yes-errors-close-legend") : bizagi.localization.getResource("bizagi-editor-form-dialog-yes-errors-close-legend");
        }
        else if (data.showMessage) {
            return self.controller.isTemplateContext() ? bizagi.localization.getResource("bizagi-editor-template-dialog-yes-errors-legend"): bizagi.localization.getResource("bizagi-editor-form-dialog-yes-errors-legend");
        }
        else {
            return bizagi.localization.getResource("bizagi-editor-form-dialog-yes-legend");
        }
    },

    /*
    * Gets legend for YES option
    */
    getLegendNoOption: function (data) {
        var self = this;

        if (data.showMessage && data.close) {
            return self.controller.isTemplateContext() ? bizagi.localization.getResource("bizagi-editor-template-dialog-no-errors-close-legend") : bizagi.localization.getResource("bizagi-editor-form-dialog-no-errors-close-legend");
        }
        else if (data.showMessage) {
            return bizagi.localization.getResource("bizagi-editor-form-dialog-no-errors-legend");
        }
        else {
            return bizagi.localization.getResource("bizagi-editor-form-dialog-no-legend");
        }
    },

    /*
    * Gets legend for CANCEL option
    */
    getLegendCancelOption: function (data) {

        if (data.showMessage && data.close) {
            return bizagi.localization.getResource("bizagi-editor-form-dialog-cancel-errors-legend");
        }
        else if (data.close) {
            return bizagi.localization.getResource("bizagi-editor-form-dialog-cancel-legend");
        }
        else { return ""; }
    },

    /*
    * This method gets the status of current form
    * ex. if the form is enabled to edit
    */
    checkStatusForm: function () {
        var defer = new $.Deferred();

        var statusForm = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "getstatusform"
        });

        $.when(statusForm.processRequest()).done(function (data) {
            data = data || {};
            defer.resolve(data);
        });

        return defer.promise();
    },

    /*
    * This method shows a popup with the information of user that has the form
    */
    showUserInformation: function () {
        var self = this;

        var userInfoDialog = new bizagi.editor.component.dialog.presenter();
        var model = {
            name: 'bz-dialog-perfomsave',
            title: bizagi.localization.getResource("bizagi-editor-form-dialog-userinfo"),
            message: self.getUserInfo(),
            date: self.getDateInfo()
        };

        // Show the editor
        userInfoDialog.show({ data: model });

    },

    /*
    * This method builds a message with the information of user
    */
    getUserInfo: function () {
        var self = this;

        var userInfo = self.controller.getUserInfo();
        var info = bizagi.localization.getResource("bizagi-editor-form-dialog-userinfo-message");
        info = info.replace("{0}", userInfo.userName);

        return info;
    },

    /*
    * This method parser the date in format time ago
    */
    getDateInfo: function () {
        var self = this;

        var userInfo = self.controller.getUserInfo();
        var checkoutDate = $.timeago(userInfo.CheckOutDate);

        return checkoutDate;
    },

    /*
    * This method checked out the current form
    */
    checkoutForm: function () {
        var self = this;

        var checkoutForm = bizagi.editor.communicationprotocol.factory.createProtocol({
            protocol: "checkoutform",
            loadForm: true
        });

        $.when(checkoutForm.processRequest()).done(function (data) {
            data = data || {};
            if (data.userInfo) {
                self.controller.setReadOnlyFlag(data.isInCheckout);
                self.controller.setUserInfo(data.userInfo);
            }
            if (data.form) {
                self.attachHandlersComponents();
                self.load(data.form);
                self.controller.setOriginalModel();
                // Refresh view
                self.refresh();
            }
        });
    },

    /*
    * This method enabled handlers in componentes
    * ex. xpathNavigator
    */
    attachHandlersComponents: function () {
        var self = this;

        if (self.controller.isActivityForm()) {
            self.attachHandlersButtonEditor();
            self.refreshButtonEditor();
        }

        self.attachHandlersControlsNavigator();
        self.refreshControlsNavigator();

        self.attachHandlersLayoutNavigator();
        self.refreshLayoutNavigator();

        self.attachHandlersXpathNavigator();
        self.refreshXpathNavigator();
    }
});