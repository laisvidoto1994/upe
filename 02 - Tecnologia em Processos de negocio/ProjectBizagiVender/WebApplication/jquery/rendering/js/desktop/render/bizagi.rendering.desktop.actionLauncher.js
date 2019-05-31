/**
 * Desktop definition of Action Launcher
 *
 * @author: Edward Morales
 */

bizagi.rendering.actionLauncher.extend("bizagi.rendering.actionLauncher", {}, {

    /**
     * Render a specific implementation for Desktop device
     */
    postRender: function() {
        var self = this;
        var properties = self.properties;
        var mode = self.getMode();
        var html, template;
        var data = {};
        var def = new $.Deferred();

        if(mode == "design" || !self.properties.surrogatedKey) {
            return "";
        }

        self.configureQueueVisibility();

        function appendContent(template, templateArguments) {
            var control = self.getControl();
            var actionsContainer = $(".bz-action-launcher-actions-container", control);
            html = $.fasttmpl(template, templateArguments);
            actionsContainer.append(html);

            if(templateArguments.template) {
                actionsContainer
                        .find('.actions-container.actions-container-template')
                        .append(templateArguments.template)
            }
            self.configureHandlers();
            def.resolve(actionsContainer);
        }

        /**
         * Define params to get list of actions
         */
        $.when(self.dataService.multiaction().getActions(self.processPropertyValueArgs))
                .pipe(function(actions) {
                    actions = self.getPropertiesActionLaucher(actions);
                    data.actions = actions;

                    return (properties.templatetype != 'none') ? self.dataService.multiaction().getPropertyData(self.processPropertyValueDataTmplArgs) : null;
                })
                .done(function(templateData) {
                    var response = data.actions;
                    self.deferredActions.resolve(response);
                    self.totalActions = bizagi.clone(response);
                    var actions = bizagi.clone(response);
                    var templateArguments = {};

                    var moreActionsManager = self.moreActionsManager(actions);
                    var isMoreActions = moreActionsManager.isMoreActions;
                    actions = moreActionsManager.actions;
                    self.lessActions = bizagi.clone(actions);

                    if(properties.isHorizontal) {
                        if(properties.templatetype != 'none') {
                            $.when(self.engine.render($.extend(templateData, { isDefaultTemplate: properties.templatetype == 'default' }), self.processPropertyValueDataTmplArgs))
                                    .done(function (template) {
                                        templateArguments = {
                                            actions: self.getPropertiesActionLaucher(actions),
                                            template: template,
                                            isMoreActions: isMoreActions,
                                            moreActions: self.moreActions,
                                            allowactions: properties.allowactions
                                        };
                                        template = self.renderFactory.getTemplate("render-actionLauncher-horizontal");
                                        appendContent(template, templateArguments);
                                    });
                        } else {
                            templateArguments = {
                                actions: self.getPropertiesActionLaucher(actions),
                                isMoreActions: isMoreActions,
                                template: false,
                                moreActions: self.moreActions,
                                allowactions: properties.allowactions
                            };
                            template = self.renderFactory.getTemplate("render-actionLauncher-horizontal");
                            appendContent(template, templateArguments);
                        }

                    } else {
                        var actionsVertical = isMoreActions ? self.lessActions : self.totalActions;
                        templateArguments = {
                            actions: self.getPropertiesActionLaucher(actionsVertical),
                            allowSearch: properties.allowSearch,
                            isMoreActions: isMoreActions,
                            isExpanded: false,
                            moreButtonTitle: self.getResource("render-action-launcher-more-actions")
                        };
                        template = self.renderFactory.getTemplate("render-actionLauncher-vertical");
                        appendContent(template, templateArguments);
                    }
                })
                .fail(function(error) {
                    def.fail(error);
                });

        self.engine.subscribe('onLoadDataNavigation', function (ev, params) {
            bizagi.loader.start("entity-engine-view").then(function () {
                $(document).triggerHandler("showDialogWidget", {
                    widgetName: bizagi.workportal.widgets.widget.BIZAGI_WORKPORTAL_WIDGET_DIALOGNAV,
                    data: params,
                    modalParameters: {
                        title: params.data.displayName,
                        refreshInbox: false
                    },
                    maximizeOnly: false
                });
            });
        });

        return def.promise();
    },   

    /**
     * Check maxitems action and create sub list of actions
     * in order to create contextual menu with them
     * @param actions
     * @return {{isMoreActions: boolean, actions: *}}
     */
    moreActionsManager: function(actions) {
        var self = this;
        var properties = self.properties;
        var isMoreActions = (actions.length > properties.maxItems) || false;
        if(isMoreActions) {
            var moreActionsTemp = actions.splice(0, properties.maxItems);
            self.moreActions = bizagi.clone(actions);
            actions = moreActionsTemp;
        }

        return {isMoreActions: isMoreActions, actions: actions};
    },

    /**
     * Add binding to html elements
     */
    configureHandlers: function() {
        var self = this;
        var formContainer = self.getFormContainer();
        if(typeof formContainer.params.printversion === "undefined" || formContainer.params.printversion == false) {
            var control = self.getControl();
            var actionLauncherControls = $(".action-launcher-control", control);
            var moreVerticalButton = $(".action-launcher-more-vertical", control);
            var properties = self.properties;

            self.configureMoreActionsHandler();
            /**
             * Binding for a tooltip when max items is exceeded horizontal
             */
            moreVerticalButton.on("click", function(event) {
                var $button = $(this);
                var isExpanded = false;
                var moreButtonTitle = "";
                var actionsVertical = {};
                if($button.hasClass("expanded")) {
                    isExpanded = false;
                    actionsVertical = self.lessActions;
                    moreButtonTitle = self.getResource("render-action-launcher-more-actions");
                } else {
                    isExpanded = true;
                    actionsVertical = self.totalActions;
                    moreButtonTitle = self.getResource("render-action-launcher-less-actions");
                }

                var templateArguments = {
                    actions: self.getPropertiesActionLaucher(actionsVertical),
                    allowSearch: properties.allowSearch,
                    isMoreActions: true,
                    isExpanded: isExpanded,
                    moreButtonTitle: moreButtonTitle
                };
                var template = self.renderFactory.getTemplate("render-actionLauncher-vertical");
                appendContent(template, templateArguments);

                function appendContent(template, templateArguments) {
                    var control = self.getControl();
                    var actionsContainer = $(".bz-action-launcher-actions-container", control);
                    actionsContainer.empty();
                    var html = $.fasttmpl(template, templateArguments);
                    actionsContainer.append(html);
                    self.configureHandlers();
                }

            });

            /**
             * Binding for click action on buttons
             */
            actionLauncherControls.on("click", function() {
                var action = {
                    guidProcess: $(this).data("guidprocess"),
                    guidAction: $(this).data("guidaction"),
                    displayName: $(this).data("display-name"),
                    actionType: $(this).data("action-type"),
                    xpathContext: $(this).data("xpathcontext"),
                    readOnlyForm: $(this).data("readonlyform") || false,
                    guidEntity: self.properties.guidEntity,
                    xpathActions: self.properties.xpathActions || ""
                };
                self.onActionClicked(action);
            });

            /**
             * Catch the typed text in the search field and filter the action list
             */
            $.expr[":"].FilterAction = function(entity, i, array) {
                var search = array[3];
                if(!search) {
                    return false;
                }
                return new RegExp(search, "i").test($(entity).text());
            };
            $("input#ui-bizagi-render-action-launcher-filter-input", control).keyup(function() {
                var search = $(this).val();
                $(".ui-bizagi-render-actionLauncher-vertical-item", control).show(0);
                if(!moreVerticalButton.hasClass("expanded")) {
                    moreVerticalButton.trigger("click");
                    $("input#ui-bizagi-render-action-launcher-filter-input").val(search);
                    $("input#ui-bizagi-render-action-launcher-filter-input").focus();
                }
                if(search) {
                    $(".ui-bizagi-render-actionLauncher-vertical-item", control).not(":FilterAction(" + search + ")").hide(0);
                }
            });
        }
    },

    configureMoreActionsHandler: function() {
        var self = this,
                control = self.getControl();
        var moreButton = $(".action-launcher-more", control);

        bizagi.loader.startAndThen("kendo").then(function () {
            self.tooltip = moreButton.kendoTooltip({
                autoHide: false,
                content: function (event) {
                    var tmpl = self.renderFactory.getTemplate("render-actionLauncher-horizontal-more");
                    var html = $.fasttmpl(tmpl, { actions: self.getPropertiesActionLaucher(self.moreActions) });
                    return html;
                },
                show: function () {
                    //add custom styles tooltip
                    $("div[role='tooltip']").addClass("bizagi-custom-tooltip-more-actions");
                    $(".action-launcher-control-more").off("click").on("click", function (event) {
                        var action = {
                            guidProcess: $(this).data("guidprocess"),
                            guidAction: $(this).data("guidaction"),
                            displayName: $(this).data("display-name"),
                            actionType: $(this).data("action-type"),
                            xpathContext: $(this).data("xpathcontext"),
                            readOnlyForm: $(this).data("readonlyform") || false,
                            xpathActions: self.properties.xpathActions || ""
                        };
                        self.onActionClicked(action);
                        self.tooltip.hide();
                    });
                },
                width: 185
            }).data("kendoTooltip");
        });
    },

    onActionClicked: function(action) {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var multipleSelection = (typeof properties.multipleSelection == "undefined") ? true : properties.multipleSelection;

        if(multipleSelection) {
            // If this is a form and has been queued, so open it
            if(action.actionType == "Form" && self.countSameActions(action) >= 1 && !action.xpathContext) {
                //Open action
                $(".action-to-execute-control[data-guidaction='" + action.guidAction + "'] label", control).click();
            } else {
                $.when(self.actionManager(action)).done(function(act) {
                    self.executeAction(act);
                });
            }
        }
        else if(self.getValue().length > 0) {
            self.showConfirmationDialog(action);
        }
        else {
            $.when(self.actionManager(action)).done(function(act) {
                self.executeAction(act);
            });
        }
    },

    notifyExecution: function(data, action) {
        var self = this;
        var notifications = new bizagi.INotifications();
        if(data.response == "success") {
            notifications.showSucessMessage(printf(self.getResource("render-action-launcher-success-excecution"), action.displayName), null, {});
        } else {
            notifications.showErrorMessage(printf(self.getResource("render-action-launcher-failed-excecution"), action.displayName), null, {});
        }
    },

    processActionForm: function(action) {
        var self = this;
        var properties = self.properties;
        var form = self.getFormContainer();
        var additionalXpaths = self.properties.additionalXpath.join(",");
        var xpathContext = (action.xpathContext) ? self.properties.xpathActions + "." + action.xpathContext : self.properties.xpathActions;
        var def = new $.Deferred();

        // Show dialog with new form after that
        var dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
            title: properties.detailLabel || bizagi.localization.getResource("render-grid-details-form"),
            showSaveButton: true,
            cancelButtonLabel: bizagi.localization.getResource("render-form-dialog-box-close"),
            onSave: function(data) {
                // Submit the form
                return self.dataService.multiaction().submitData({
                    action: "SAVE",
                    data: data,
                    xpathContext: dialog.form.properties.xpathContext, //self.properties.xpathContext,
                    idPageCache: dialog.form.properties.idPageCache,
                    isOfflineForm: false,
                    isActionStartForm: true
                }).pipe(function(savedData) {
                    if(!action.editMode && self.countSameActions(action) == 0) {
                        action.idStartScope = savedData.IdScope;
                        //self.addActionToQueue(action);
                    }
                    def.resolve(savedData.IdScope);
                });
            },
            onCancel: function(data) {

            }
        });

        var paramsRender = {
            "idForm": action.guidProcess,
            "contextType": "start",
            "idCase": self.properties.caseId,
            "idWorkitem": form.properties.typeForm != "SummaryForm" ? bizagi.context.idWorkitem : undefined,
            "additionalXpaths": additionalXpaths,
            "xpathContext": xpathContext,
            "idStartScope": action.idStartScope,
            "surrogateKey": self.properties.surrogatedKey,
            "readOnlyForm": action.readOnlyForm,
            "recordXpath": action.recordXpath
        };
        if (action.actionType === "Form") {
            paramsRender.contextType = "entitytemplate";
            paramsRender.xpathContext = undefined;
            paramsRender.guidEntity = action.guidEntity;
            paramsRender.rewriteContextType = true;
        } 

        dialog.render(paramsRender);

        return def.promise();
    },

    processActionFormCollection: function(action) {
        var self = this;
        var properties = self.properties;
        var form = self.getFormContainer();
        var additionalXpaths = self.properties.additionalXpath.join(",");
        var def = new $.Deferred();
        var xpathContext = (action.xpathContext) ? self.properties.xpathActions + "." + action.xpathContext : self.properties.xpathActions;
        var xpathPattern = "%s[id=%s]";
        var xpathPatternWithoutkey = "%s[]";
        var xpathContextWithKey = (xpathContext != "") ? printf(xpathPattern, xpathContext, action.idEntity) : xpathContext;
        var xpathContextWithoutKey = (xpathContext != "") ? printf(xpathPatternWithoutkey, xpathContext) : xpathContext;

        var dialog = new bizagi.rendering.dialog.form(self.dataService, self.renderFactory, {
            title: properties.detailLabel || bizagi.localization.getResource("render-grid-details-form"),
            showSaveButton: true,
            cancelButtonLabel: bizagi.localization.getResource("render-form-dialog-box-close"),
            onSave: function(data) {
                if(action.editMode) {
                    return self.dataService.multiaction().submitData({
                        action: "SAVE",
                        data: data,
                        xpathContext: xpathContextWithKey,
                        idPageCache: data.idPageCache,
                        isOfflineForm: false,
                        isActionStartForm: true
                    }).pipe(function(savedData) {
                        def.resolve(savedData.IdScope);
                    });
                } else {
                    return self.dataService.addGridRecordData({
                        idRender: properties.id,
                        //xpath: properties.xpath,
                        xpathContext: xpathContext,
                        contexttype: "start",
                        idPageCache: data.idPageCache,
                        submitData: data
                    }).pipe(function(savedData) {
                        action.idStartScope = savedData.IdScope;
                        action.idEntity = savedData.IdEntity;
                        self.addActionToQueue(action);
                        def.resolve(savedData.IdScope);
                    });
                }
            },
            onCancel: function(data) {

            }
        });

        dialog.render({
            "idForm": action.guidProcess,
            "contextType": "start",
            "idCase": bizagi.context.idCase,
            "additionalXpaths": additionalXpaths,
            "xpathContext": (action.editMode) ? xpathContextWithKey : xpathContextWithoutKey,
            "idStartScope": action.idStartScope,
            "surrogateKey": self.properties.surrogatedKey,
            "readOnlyForm": action.readOnlyForm,
            "recordXpath": action.recordXpath
        });

        return def.promise();
    },

    /**
     * Process a start form
     * @param args
     * @return {*}
     */
    processStartForm: function(args) {
        var self = this;
        var properties = self.properties;
        var form = self.getFormContainer();
        var def = new $.Deferred();
        args = args || {};


        var dialog = new bizagi.rendering.dialog.startForm(self.dataService, self.renderFactory, {
            //showSaveButton: properties.editable,
            maximized: properties.maximized,
            title: args.title || "",
            saveButtonLabel: (self.typeForm == "GlobalForm" || this.typeForm == "SummaryForm") ? bizagi.localization.getResource("render-form-button-create") : bizagi.localization.getResource("render-form-dialog-box-save"),
            onSave: function(data) {
                form.startLoading();

                // Submit the form
                return self.dataService.multiaction().submitData({
                    action: "SAVE",
                    data: data,
                    xpathContext: self.properties.xpathContext,
                    idPageCache: data.idPageCache,
                    isOfflineForm: false,
                    isActionStartForm: true
                }).pipe(function(savedData) {
                    form.endLoading();
                    def.resolve(savedData.IdScope);
                });
            }
        });

        dialog.render({
            guidprocess: args.guidprocess,
            idStartScope: args.idStartScope,
            idCase: self.properties.caseId,
            idWorkitem: form.properties.typeForm != "SummaryForm" ? bizagi.context.idWorkitem : undefined,
            additionalXpaths: self.properties.additionalXpath.join(","),
            surrogatedKey: self.properties.surrogatedKey,
            recordXpath: args.recordXpath,
            mappingstakeholders: true
        });

        return def.promise();
    },

    executeAction: function(action) {
        var self = this;

        if(self.typeForm == "GlobalForm" || self.typeForm == "SummaryForm") {
            $.when(bizagi.showConfirmationBox(bizagi.localization.getResource("render-action-launcher-immediatly-action-confirmation"), null, false)).done(function(response) {
                self.executeActionImmediately(action);
            });
        }
        else {
            self.addActionToQueue(action);
        }
    },

    /**
     * Show confirmation dialog
     * @param action
     */
    showConfirmationDialog: function(action) {
        var self = this;
        self.confirmTemplate = self.renderFactory.getTemplate("render-actionLauncher-confirm");
        var message = bizagi.localization.getResource("render-action-launcher-single-action-confirmation");
        var confirmContent = $.tmpl(self.confirmTemplate, {confirmationMessage: message});
        var confirmContentParams = {
            resizable: false,
            modal: true,
            title: "Bizagi",
            buttons: []
        };
        confirmContentParams.buttons = [
            {
                text: bizagi.localization.getResource("render-boolean-yes"),
                click: function() {
                    self.setValue([]);
                    $.when(self.actionManager(action)).done(function(act) {
                        self.executeAction(act);
                    });
                    $(this).dialog("close");
                }
            },
            {
                text: bizagi.localization.getResource("render-boolean-no"),
                click: function() {
                    $(this).dialog("close");
                }
            }
        ];
        $(confirmContent).dialog(confirmContentParams);
    },

    /**
     * Render actual value of control and set events
     * @param data
     */
    setDisplayValue: function(data) {
        var self = this;
        var control = self.getControl();
        var actionsToExecuteContainer = $(".bz-action-launcher-actions-to-execute-container", control);
        var template = self.renderFactory.getTemplate("render-actionLauncher-actions-to-execute");

        self.configureQueueVisibility();
        $.when(self.deferredActions).done(function(listOfActions) {
            var getMappingAction = function(guidAction) {
                var mapping = [];
                $.each(listOfActions, function(key, value) {
                    if(value[4] == guidAction) {
                        mapping = value;
                    }
                });
                return mapping;

            };
            $.each(data, function(key, value) {
                var mapping = getMappingAction(value.guidAction);
                data[key].displayName = mapping[1];
                data[key].guidProcess = mapping[0];
                data[key].actionType = mapping[3];
                data[key].xpathContext = mapping[5];
                data[key].readOnlyForm = mapping[6];

                if(data[key].params && data[key].params.idStartScope) {
                    data[key].idStartScope = data[key].params.idStartScope;
                }
                if(data[key].params && data[key].params.idPageCache) {
                    data[key].idPageCache = data[key].params.idPageCache;
                }
                if(data[key].params && data[key].params.idEntity) {
                    data[key].idEntity = data[key].params.idEntity;
                }
            });
            $.when($.fasttmpl(template, {actions: data})).done(function(html) {
                actionsToExecuteContainer.empty();
                actionsToExecuteContainer.append(html);
                var removeActionSelector = $(".action-to-execute-control i", actionsToExecuteContainer);
                var openActionSelector = $(".action-to-execute-control label", actionsToExecuteContainer);
                removeActionSelector.bind("click", function() {
                    var index = $(this).parent().data("index");
                    self.removeActionToQueue(index);
                });
                openActionSelector.bind("click", function() {
                    var target = $(this).parent();
                    var type = target.data("actiontype");
                    var guidprocess = target.data("guidprocess");
                    var idStartScope = target.data("idstartscope");
                    var title = target.data("title");
                    var xpathContext = target.data("xpathcontext");
                    var readOnlyForm = target.data("readonlyform") || false;
                    var idEntity = target.data("identity") || "";
                    var guidAction = target.data("guidaction");
                    var recordXpath = xpathContext || self.properties.xpathContext;
                    switch(type) {
                        case "Process":
                            if(idStartScope) {
                                self.processStartForm({
                                    guidprocess: guidprocess,
                                    idStartScope: idStartScope,
                                    title: title,
                                    xpathContext: xpathContext,
                                    recordXpath: recordXpath
                                });
                            }
                            break;
                        case "Form":

                            var action = {
                                guidProcess: guidprocess,
                                idStartScope: idStartScope,
                                editMode: true,
                                xpathContext: xpathContext,
                                readOnlyForm: readOnlyForm,
                                idEntity: idEntity,
                                recordXpath: recordXpath
                            };

                            if(action.xpathContext) {
                                self.processActionFormCollection(action);
                            } else {
                                //Add parameters if action form
                                var extraParameters = {};
                                var dataAction = self.value.filter(function (item) {
                                    return item.guidAction == guidAction;
                                });
                                if (dataAction.length > 0) {
                                    extraParameters = {
                                        actionType: "Form",
                                        contextType: "entitytemplate",
                                        guidEntity: self.properties.guidEntity || dataAction[0].guidEntity
                                    }
                                }
                                self.processActionForm($.extend(action, extraParameters));
                            }
                            break;
                        case "Rule":
                            // Rules dont have forms or something like that
                            break;
                    }
                });
            });
        });
    },
    /**
     * Show container if it has actions
     */
    configureQueueVisibility: function() {
        var self = this;
        var control = self.getControl();
        var actionsToExecuteContainer = $(".bz-action-launcher-actions-to-execute-container", control);
        var actionsToExecuteTitle = $(".actions-to-execute-title", control);
        if(self.getValue().length > 0) {
            actionsToExecuteContainer.show();
            actionsToExecuteTitle.show();
        } else {
            actionsToExecuteContainer.hide();
            actionsToExecuteTitle.hide();
        }
    }
});