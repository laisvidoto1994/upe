/**
 * Tablet definition of Action Launcher
 *
 * @author: Ricardo Pérez
 */

bizagi.rendering.actionLauncher.extend("bizagi.rendering.actionLauncher", {}, {
    /**
     * Render a specific implementation for Desktop device
     */
    postRender: function() {
        var self = this;
        var properties = self.properties;
        var template;
        var def = new $.Deferred();
        self.actions = [];

        self.configureQueueVisibility();

        self.startLoading();

        // Define params to get list of actions        
        $.when(self.dataService.multiaction().getActions(self.processPropertyValueArgs))
            .then(function(response) {
                response = self.getPropertiesActionLaucher(response);
                self.actions = response;
                self.deferredActions.resolve(response);

                if (properties.isHorizontal) {
                    if (properties.templatetype !== "none") {
                        return self.dataService.multiaction().getPropertyData(self.processPropertyValueDataTmplArgs)
                            .then(function(templateData) {
                                return self.engine.render($.extend(templateData, {
                                    isDefaultTemplate: properties.templatetype === "default"
                                }), self.processPropertyValueDataTmplArgs);
                            }).then(function(tmpl) {
                                template = self.renderFactory.getTemplate("render-actionLauncher-horizontal");
                                var html = $($.fasttmpl(template, {
                                    actions: self.actions,
                                    template: true
                                }));

                                $(".template-container", html.wrap("<div>").parent()).append(tmpl);
                                return html;
                            });
                    } else {
                        template = self.renderFactory.getTemplate("render-actionLauncher-horizontal");
                        return $.fasttmpl(template, {
                            actions: self.actions,
                            maxItems: properties.maxItems
                        });
                    }
                } else {
                    template = self.renderFactory.getTemplate("render-actionLauncher-vertical");
                    return $.fasttmpl(template, {
                        actions: self.actions,
                        allowSearch: properties.allowSearch,
                        maxItems: properties.maxItems
                    });
                }

            }).done(function(html) {
                var control = self.getControl();
                var actionsContainer = $(".bz-action-launcher-actions-container", control);

                self.endLoading();

                actionsContainer.append(html);
                self.configureHandlers();
                self.configureTemplateHandlers();

                def.resolve(actionsContainer);
            }).fail(function(error) {
                self.endLoading();
                def.fail(error);
            });
        return def.promise();
    },

    /**
     * Add binding to html elements
     */
    configureHandlers: function() {
        var self = this;
        var control = self.getControl();
        var properties = self.properties;
        var multipleSelection = (typeof properties.multipleSelection == "undefined") ? true : properties
            .multipleSelection;
        var actionLauncherControls = $(".action-launcher-control", control);

        //Binding for click action on buttons
        actionLauncherControls.on("click", function() {
            var item = self.actions[parseInt($(this).data("index"))];
            var action = {
                guidProcess: item[0],
                guidAction: item[4],
                displayName: item[1],
                actionType: item[3],
                xpathContext: (typeof item[5] !== "undefined" && item[5] === "true"),
                readOnlyForm: item[6] || false,
                guidEntity: self.properties.guidEntity,
                xpathActions: self.properties.xpathActions || ""
            };

            if (multipleSelection) {
                if (action.actionType == "Form" && self.countSameActions(action) >= 1 && !action.xpathContext) {
                    //Open action
                    $(".action-to-execute-control[data-guidaction='" + action.guidAction + "'] label", control).click();
                } else {
                    $.when(self.actionManager(action)).done(function(act) {
                        self.executeAction(act);
                    });
                }
            } else if (self.getValue().length > 0) {
                self.showConfirmationDialog(action);
            } else {
                $.when(self.actionManager(action)).done(function(act) {
                    self.executeAction(act);
                });
            }
        });

        // Catch the typed text in the search field and filter the action list
        $.expr[":"].FilterAction = function(entity, i, array) {
            var search = array[3];
            if (!search) {
                return false;
            }
            return new RegExp(search, "i").test($(entity).text());
        };

        var plusBtn = $(".action-container .wp-action-more span", control);

        $(".action-container .wp-action-more", control).click(function() {
            if (plusBtn.hasClass("km-minus")) {
                hideActions();
            } else {
                showActions();
            }
        });

        function hideActions() {
            plusBtn.addClass("km-plus").removeClass("km-minus");
            $(".action-container .bz-actions-to-hide", control).addClass('hidden');
        }

        function showActions() {
            plusBtn.addClass("km-minus").removeClass("km-plus");
            $(".action-container .bz-actions-to-hide", control).removeClass('hidden');
        }

        $("input#ui-bizagi-render-action-launcher-filter-input", control).keyup(function() {
            var search = $(this).val();
            $(".ui-bizagi-render-actionLauncher-actions-list .action-launcher-control", control).show();
            if (search) {
                if (plusBtn.hasClass("km-plus")) {
                    showActions();
                }
                $(".ui-bizagi-render-actionLauncher-actions-list .action-launcher-control", control)
                    .not(":FilterAction(" + search + ")").hide();
            }
        });
    },
    /**
     *
     */
    configureTemplateHandlers: function() {
        var self = this;

        //Catch the event from the layout link
        self.engine.subscribe("onLoadDataNavigation", function(ev, params) {
            params.filters = [];
            params.calculateFilters = params.calculateFilters || true;
            bizagi.webpart.publish("homeportalShow", {
                what: "stuffTemplates",
                title: params.data.displayName,
                params: params
            });
        });
    },
    /**
     *
     * @param data
     * @param action
     */
    notifyExecution: function(data, action) {
        var self = this;

        if (data.response == "success") {
            $.notifier.add({
                class_name: "success",
                title: action.displayName,
                text: self.getResource("render-action-launcher-success-excecution").replace("%s", action.displayName),
                sticky: false
            });
        } else {
            $.notifier.add({
                class_name: "error",
                title: action.displayName,
                text: self.getResource("render-action-launcher-failed-excecution").replace("%s", action.displayName),
                sticky: false
            });
        }
    },
    /**
     *
     * @param action
     * @returns {*}
     */
    processActionForm: function(action) {
        var self = this;
        var properties = self.properties;       
        var formParams = self.getParams();
        var additionalXpaths = self.properties.additionalXpath.join(",");
        var xpathContext = (action.xpathContext) ? self.properties.xpathActions + "." + action.xpathContext : self
            .properties.xpathActions;
        var def = new $.Deferred();

        // Show dialog with new form after that
        var slideForm = new bizagi.rendering.tablet.slide.form(self.dataService, self.renderFactory, {
            title: properties.detailLabel || bizagi.localization.getResource("render-grid-details-form"),
            navigation: formParams.navigation,
            showSaveButton: true,
            cancelButtonLabel: bizagi.localization.getResource("render-form-dialog-box-close"),
            onSave: function(data) {
                // Submit the form
                return self.dataService.multiaction().submitData({
                    action: "SAVE",
                    data: data,
                    xpathContext: slideForm.form.properties.xpathContext, //self.properties.xpathContext,
                    idPageCache: data.idPageCache,
                    isOfflineForm: false,
                    isActionStartForm: true
                }).pipe(function(savedData) {
                    if (!action.editMode && self.countSameActions(action) == 0) {
                        action.idStartScope = savedData.IdScope;
                        //self.addActionToQueue(action);
                    }
                    def.resolve(savedData.IdScope);
                });
            },
            onCancel: function(data) {

            }
        });

        var renderParams = {
            "idForm": action.guidProcess,
            "contextType": "start",
            "idCase": self.properties.caseId,
            "idWorkitem": self.typeForm != "SummaryForm" ? formParams.idWorkitem : undefined,
            "additionalXpaths": additionalXpaths,
            "xpathContext": xpathContext,
            "idStartScope": action.idStartScope,
            "surrogateKey": self.properties.surrogatedKey,
            "readOnlyForm": action.readOnlyForm,
            "recordXpath": action.recordXpath
        }

        if (action.actionType === "Form") {
            renderParams.contextType = "entitytemplate";
            renderParams.xpathContext = undefined;
            renderParams.guidEntity = action.guidEntity;
            renderParams.rewriteContextType = true;
        }

        slideForm.render(renderParams);

        return def.promise();
    },

    /**
     *
     * @param action
     * @returns {*}
     */
    processActionFormCollection: function(action) {
        var self = this;
        var properties = self.properties;
        var form = self.getFormContainer();
        var additionalXpaths = self.properties.additionalXpath.join(",");
        var def = new $.Deferred();
        var xpathContext = (action.xpathContext) ? self.properties.xpathActions + "." + action.xpathContext : self
            .properties.xpathActions;
        var xpathPattern = "%s[id=%s]";
        var xpathPatternWithoutkey = "%s[]";
        var xpathContextWithKey = (xpathContext !== "") ? printf(xpathPattern, xpathContext, action.idEntity)
            : xpathContext;
        var xpathContextWithoutKey = (xpathContext !== "") ? printf(xpathPatternWithoutkey, xpathContext)
            : xpathContext;
        var formParams = form.getParams();

        var slideForm = new bizagi.rendering.tablet.slide.form(self.dataService, self.renderFactory, {
            title: properties.detailLabel || bizagi.localization.getResource("render-grid-details-form"),
            navigation: formParams.navigation,
            showSaveButton: true,
            cancelButtonLabel: bizagi.localization.getResource("render-form-dialog-box-close"),
            onSave: function(data) {
                if (action.editMode) {
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

        slideForm.render({
            "idForm": action.guidProcess,
            "contextType": "start",
            "idCase": formParams.idCase,
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
        var def = new $.Deferred();
        args = args || {};
        var formParams = self.getFormContainer().getParams();

        // Show dialog
        var slideForm = new bizagi.rendering.tablet.startForm(self.dataService, self.renderFactory, {
            title: args.title || "",
            navigation: formParams.navigation,
            saveButtonLabel: (self.typeForm == "GlobalForm" || self.typeForm === "SummaryForm") ? bizagi.localization.getResource("render-form-button-create")
                : bizagi.localization.getResource("render-form-dialog-box-save"),
            onSave: function(data) {
                // Submit the form
                return self.dataService.multiaction().submitData({
                    action: "SAVE",
                    data: data,
                    xpathContext: self.properties.xpathContext,
                    idPageCache: data.idPageCache,
                    isOfflineForm: false,
                    isActionStartForm: true
                }).pipe(function(savedData) {
                    def.resolve(savedData.IdScope);
                });
            }
        });

        // Render the search form
        slideForm.render({
            guidprocess: args.guidprocess,
            idStartScope: args.idStartScope,
            idCase: self.properties.caseId,
            idWorkitem: self.typeForm != "SummaryForm" ? formParams.idWorkitem : undefined,
            additionalXpaths: self.properties.additionalXpath.join(","),
            surrogatedKey: self.properties.surrogatedKey,
            recordXpath: args.recordXpath,
            mappingstakeholders: true
        });

        return def.promise();
    },
    /**
     *
     * @param action
     */
    executeAction: function(action) {
        var self = this;

        if (self.typeForm == "GlobalForm" || self.typeForm == "SummaryForm") {
            if (confirm(bizagi.localization.getResource("render-action-launcher-immediatly-action-confirmation"))) {
                $.when(bizagi.showConfirmationBox(bizagi.localization
                        .getResource("render-action-launcher-immediatly-action-confirmation"), null, false))
                    .done(function(response) {
                        self.executeActionImmediately(action);
                    });
            }
        } else {
            self.addActionToQueue(action);
        }
    },
    /**
     * Show the confirmation dialog
     * bizagi.createOkCancelPopup
     * @param action
     * */
    showConfirmationDialog: function(action) {
        var self = this;

        if (confirm(bizagi.localization.getResource("render-action-launcher-single-action-confirmation"))) {
            self.setValue([]);
            $.when(self.actionManager(action)).done(function(act) {
                self.executeAction(act);
            });
        }
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
                    if (value[4] == guidAction) {
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

                if (data[key].params && data[key].params.idStartScope) {
                    data[key].idStartScope = data[key].params.idStartScope;
                }
                if (data[key].params && data[key].params.idPageCache) {
                    data[key].idPageCache = data[key].params.idPageCache;
                }
                if (data[key].params && data[key].params.idEntity) {
                    data[key].idEntity = data[key].params.idEntity;
                }
            });
            $.when($.fasttmpl(template, { actions: data })).done(function(html) {
                actionsToExecuteContainer.empty();
                actionsToExecuteContainer.append(html);
                var removeActionSelector = $(".action-to-execute-control .delete-action", actionsToExecuteContainer);
                var openActionSelector = $(".action-to-execute-control label", actionsToExecuteContainer);

                removeActionSelector.on("click", function() {
                    var index = $(this).parent().data("index");
                    self.removeActionToQueue(index);
                });

                openActionSelector.on("click", function() {
                    var target = $(this).parent();
                    var type = target.data("actiontype");
                    var guidprocess = target.data("guidprocess");
                    var idStartScope = target.data("idstartscope");
                    var title = target.data("title");
                    // When undefined return string "undefined" instead of type "undefined"
                    var xpathContext = target.data("xpathcontext");
                    var readOnlyForm = target.data("readonlyform") || false;
                    var idEntity = target.data("identity") || "";
                    var guidAction = target.data("guidaction");
                    var recordXpath = xpathContext || self.properties.xpathContext;

                    switch (type) {
                    case "Process":
                        if (idStartScope) {
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

                        if (action.xpathContext) {
                            self.processActionFormCollection(action);

                        } else {
                            // Convert string "undefined" into type "undefined"                                
                            action.xpathContext = undefined;

                            // Add parameters if action form
                            var extraParams = {};
                            var dataAction = self.value.filter(function(item) {
                                return item.guidAction == guidAction;
                            });

                            if (dataAction.length > 0) {
                                extraParams = {
                                    actionType: "Form",
                                    contextType: "entitytemplate",
                                    guidEntity: self.properties.guidEntity || dataAction[0].guidEntity
                                };
                            }

                            self.processActionForm($.extend(action, extraParams));
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
        var actionsToExecuteTitle = $(".action-to-execute-label", control);

        if (self.getValue().length > 0) {
            actionsToExecuteContainer.show();
            actionsToExecuteTitle.show();
        } else {
            actionsToExecuteContainer.hide();
            actionsToExecuteTitle.hide();
        }
    }
});