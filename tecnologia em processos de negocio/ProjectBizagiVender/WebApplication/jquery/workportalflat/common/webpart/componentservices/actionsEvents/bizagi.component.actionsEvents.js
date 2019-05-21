/*
 *   Name: BizAgi Case Actions Events
 *   Author: Andres Arenas V
 *   Comments:
 *   -   
 */
$.Class.extend("bizagi.actionsEvents", {}, {
    /**
     * Init constructor
     * @param dataService The dataService for making request
     * @param parent
     *  - "Entities": When it comes from RenderTemplates
     *  - "Cases": When it comes from CasesTemplates
     * @param params
     *  - "homePortalFramework": Used to handle Data Navigation and AccumulatedContext
     */
    init: function (dataService, parent, params) {
        var self = this;
        self.initialParams = params || {};
        self.parent = parent || "Entities";
        self.dataService = dataService;
    },
    /**
     * Get the events of an specific entity
     * @param entities A list with all the entities
     * @return The promise with the events of the entity
     */
    getEvents: function (entities) {
        var self = this;
        var promises = $.map(entities, function (entity) {
            var idCase = entity.idCase;
            if (typeof idCase !== "undefined" && idCase > 0) {
                return self.dataService.getEvents({caseId: idCase}).then(function (data) {
                    entity.events = data.map(function (el) {
                        el.isEvent = true;
                        return el;
                    });
                });
            }
        });

        return $.when.apply($, promises);
    },
    /**
     * Get all actions of an specific entity.
     * @params entities A list with all the entities.
     * @return The promise with the actions of the entity.
     */
    getActions: function (entities) {
        var self = this;

        var promises = $.map(entities, function (entity) {
            // Se pone esta condicion dado que si viene desde CasesTemplates solo debe sacar las acciones cuyo surrogateKey de la
            // entidad sea mayor o igual a 0.
            if (self.parent === "Entities" || (self.parent === "Cases" && entity.surrogateKey >= 0)) {
                var data = {
                    surrogateKey: entity.surrogateKey,
                    guidEntity: entity.guid
                }
                if (typeof entity.idCase !== "undefined") {
                    data.caseId = entity.idCase;
                }

                //promesa para el llamado de acciones de cada elemento
                return self.dataService.getActionsData(data).then(function (actions) {
                    entity.actions = actions;
                    //promesa encadenada para el llamado de has start form para todas las acciones de tipo proceso
                    return $.when.apply($, $.map(actions, function (action) {
                        if (action.type == "Process") {
                            return self.dataService.validateHasStartForm({processId: action.reference}).then(function (resp) {
                                action.hasStartForm = resp.startForm;
                                action.entityId = resp.entityId;
                                action.entityName = resp.entityName;
                            });
                        }
                    }));
                });
            }
        });

        return $.when.apply($, promises);
    },
    /**
     * Build a list with all the common actions of the selected item. A common action is an action that:
     *  - Is in all selected items.
     *  - Has multiplicity 2.
     *  - Is a process without startform.
     * @param selectedItems The selected items.
     * @return A list with the common actions of the selected items.
     */
    getCommomActions: function (selectedItems) {
        var self = this;
        var items = selectedItems || [];
        var tempActions = [];
        var i = -1, a;

        while (a = items[++i]) {
            tempActions[i] = a.actions || [];
        }

        return tempActions.shift().reduce(function (res, v) {
            var actionExist = tempActions.every(function (a) {
                return typeof a.find(function (el) {
                        return el.id == v.id;
                    }) !== 'undefined';
            });
            if (actionExist && typeof res.find(function (el) {
                    return el.id == v.id;
                }) === 'undefined' && actionAgreesRules(v)) {
                res.push(v);
            }
            return res;
        }, []);

        function actionAgreesRules(action) {
            if (typeof action.mode === "undefined" || action.mode === "Entity") {
                if (action.multiplicity == 2) {
                    return true;
                }
                else if (action.type == "Form") {
                    return false;
                }
                else if (action.type == "Process" && action.hasStartForm) {
                    return false;
                }
                return true;
            }
            return false;
        }
    },
    /**
     * Build the necesary params to process the action based on the action type.
     * @param action The action to execute.
     * @param entity The parent entity.
     */
    executeActionSingleData: function (action, entity) {
        var self = this;

        if (action.type === "WorkOnIt") {
            bizagiLoader().start();

            var idCase = (typeof action.idCase !== "undefined") ? action.idCase : entity.radNumber || entity.idCase;
            self.executeChangeCaseEvent(idCase, action.idTask, action.idWorkitem, entity);
        }
        else if (typeof action.isEvent !== "undefined" && action.isEvent) {
            self.processEvent(action);
        }
        else {
            var actionType = action.type;
            var isMultiInstance = action.multiplicity === 2 ? true : false;

            if (actionType === "Rule") {
                var params = {
                    actionType: actionType,
                    entityId: entity.guid,
                    isMultiInstance: isMultiInstance,
                    processId: action.reference,
                    surrogateKey: entity.surrogateKey,
                    displayName: action.displayName
                };

                self.processAction(params).then(function () {
                    self.refreshTemplate();
                });
            }
            else if (actionType === "Form" || actionType === "Process") {
                var params = {
                    actionType: actionType,
                    displayName: action.displayName,
                    entityGuid: entity.guid,
                    entitySurrogateKey: entity.surrogateKey,
                    id: action.id,
                    isMultiInstance: isMultiInstance,
                    isBatch: action.isBatch || null,
                    reference: action.reference,
                    readonlyform: action.readonlyform,
                    showConfirmation: action.showConfirmation
                };

                if (actionType === "Process") {
                    params.entityId = action.entityId;
                    params.entityName = action.entityName;
                    params.hasStartForm = action.hasStartForm;
                }
                if (typeof entity.idCase !== "undefined") {
                    params.caseId = entity.idCase;
                }
                self.processAction(params);
            }
        }
    },

    executeChangeCaseEvent: function (idCase, idTask, idWorkitem, entity) {
        var self = this;
        $.when(bizagi.webpart.publish("changeCase", {
            idCase: idCase,
            idTask: idTask,
            idWorkitem: idWorkitem
        })).fail(function (error) {
            self.showErrorMessage(entity.idCase, error);
        }).always(function () {
            bizagiLoader().stop();
        });
    },

    /**
     * Build the necesary params to process the action based on the action type and action multiplicity.
     *  - When the multiplicity is 2 it should run one rule that contains all selected items.
     *  - When the multiplicity is 1 it should create one case per selected item.
     * @param action The action to execute.
     * @param entity The parent entity.
     * @param selectedItems The items that the action is going to execute.
     */
    executeActionMultipleData: function (action, entity, selectedItems) {
        var self = this;
        var isMultiInstance = action.multiplicity === 2 ? true : false;
        var surrogatedKeys = selectedItems.map(function (el) {
            return el.surrogateKey;
        });

        switch (action.type) {
            case "Process":
                var params = {
                    actionType: action.type,
                    displayName: action.displayName,
                    entityGuid: entity.guid,
                    entityId: action.entityId,
                    entityName: action.entityName,
                    id: action.id,
                    isMultiInstance: isMultiInstance,
                    reference: action.reference,
                    hasStartForm: action.hasStartForm
                };
                if (self.parent === "Cases") {
                    params.caseId = selectedItems.map(function (el) {
                        return el.idCase;
                    });
                }
                // When the multiplicity is 2 it should create one case that contains all selected items
                if (isMultiInstance) {
                    params.isBatch = false;
                    params.entitySurrogateKey = surrogatedKeys;

                    self.processAction(params);
                }
                // When the multiplicity is 1 it should create one case per selected item
                else {
                    params.isBatch = true;
                    self.processBatchCreationAction(params, selectedItems);
                }
                break;

            case "Rule":
                var params = {
                    actionType: action.type,
                    entityId: entity.guid,
                    isMultiInstance: isMultiInstance,
                    processId: action.reference,
                    displayName: action.displayName
                }

                // When the multiplicity is 2 it should run one rule that contains all selected items
                if (isMultiInstance) {
                    params.surrogatedKey = surrogatedKeys;
                    self.processAction(params).then(function () {
                        self.refreshTemplate();
                    });
                }
                // When the multiplicity is 1 it should run one rule per selected item
                else {
                    params.confirmation = false;

                    var i = -1, a, promises = [];
                    while (a = selectedItems[++i]) {
                        params.surrogatedKey = a.surrogatedKey;
                        promises.push(self.processAction(params));
                    }

                    $.when.apply($, promises).then(function () {
                        self.refreshTemplate();
                    });
                }
                break;

            default:
                break;
        }
    },

    /**
     * Process the action type process in batch
     *  - Process: Build the data and go to processAction.
     *  - Form: Build the data, call the mapping and go to processAction.
     * @param actionParams Contains the necesary data to process the action.
     * @param selectedItems Contains the selected elements.
     */
    processBatchCreationAction: function (actionParams, selectedItems) {
        var self = this;
        var i = -1, a;
        a = selectedItems[++i];

        // This is the way to send requests in series not in parallel
        function process() {
            $.when(self.processAction(actionParams)).always(function () {
                a = selectedItems[++i];
                if (typeof a !== "undefined") {
                    actionParams.itemSelected = a;
                    process(actionParams);
                }
            });
        }

        if (typeof a !== "undefined") {
            actionParams.itemSelected = a;
            process(actionParams);
        }
    },

    /**
     * Process the action base on the type
     *  - Process: Build the data and go to processAction.
     *  - Form: Build the data, call the mapping and go to processAction.
     * @param action Contains the necesary data to process the action.
     */
    processAddAction: function (action) {
        var self = this;
        var params = {
            actionType: action.type,
            addAction: true,
            displayName: action.displayName,
            entityGuid: action.guidEntity,
            entitySurrogateKey: null,
            reference: action.reference
        };

        if (action.type === "Process") {
            params.entityId = action.guidEntity;
            params.entityName = action.xpathContext;
            params.hasStartForm = action.startForm;

            self.processAction(params);
        }
        else if (action.type === "Form") {
            var actionParam = {
                xpathContext: "",
                guidEntity: action.guidEntity,
                accumulatedContext: JSON.stringify(self.initialParams.homePortalFramework.getActionsContext())
            };
            $.when(self.dataService.getMapping(actionParam)).then(function (mapping) {
                params.mapping = mapping;

                self.processAction(params);
            }).fail(function (error) {
                self.showErrorMessage(action.displayName, error);
            });
        }
    },
    /**
     * Process the action based on the Type.
     *  - Process: Call the mapping and create a new case.
     *  - Form: Load the startform based on params.
     *  - Rule: Show confirmation dialog and if user agrees execute rule depending if it is multinstance or not.
     * @param params Contains the necesary data to process the action.
     */
    processAction: function (params) {
        var self = this;
        var origin = (self.parent === "Entities") ? "stuffTemplates" : "caseTemplates";
        params.confirmation = typeof params.confirmation !== "undefined" ? params.confirmation : true;
        var defer = new $.Deferred();

        //bizagiLoader().start(); //poner en un lugar mas visual, podria ser dentro del webpart

        switch (params.actionType) {
            case "Process":
                var actionParams = {xpathContext: params.entityName, guidEntity: params.entityId};

                //Updates the las element in the context
                var entitySurrogateKey = (typeof params.itemSelected !== "undefined") ? params.itemSelected.surrogateKey : params.entitySurrogateKey;
                self.initialParams.homePortalFramework.extendCurrentContext({surrogateKeyToMapping: entitySurrogateKey});
                var accumulatedContext = self.initialParams.homePortalFramework.getActionsContext();

                actionParams.accumulatedContext = JSON.stringify(accumulatedContext);
                $.when(self.dataService.getMapping(actionParams)).done(function (mapping) {
                    var createParams = {
                        guidProcess: params.reference,
                        hasStartForm: params.hasStartForm,
                        isBatch: (typeof params.isBatch !== "undefined") ? params.isBatch : null,
                        isMultiInstance: params.isMultiInstance,
                        mapping: mapping,
                        notification: true,
                        displayName: params.displayName,
                        type: params.actionType,
                        origin: origin
                    };
                    if (typeof params.caseId !== "undefined") {
                        createParams.idParentCase = params.caseId;
                    }
                    $.when(bizagi.webpart.publish("createNewCase", createParams)).then(function () {
                        defer.resolve(createParams);
                    }).fail(function () {
                        defer.reject();
                    });


                }).fail(function (error) {
                    self.showErrorMessage(params.displayName, error);

                    defer.reject();
                }).always(function () {
                    //bizagiLoader().stop();
                });
                break;

            case "Form":
                bizagi.webpart.publish("homeportalShow", {
                 what: "startForm",
                 title: params.displayName,
                 params: {
                 displayName: params.displayName,
                 entityGuid: params.entityGuid,
                 entitySurrogateKey: params.entitySurrogateKey,
                 formGuid: params.reference,
                 mapping: (typeof params.mapping !== "undefined") ? params.mapping : null,
                 type: params.actionType,
                 origin: origin,
                 readonlyform: params.readonlyform,
                 showConfirmation: params.showConfirmation
                 }
                });

                defer.resolve();
                //bizagiLoader().stop();
                break;
            case "Rule":
                if (params.confirmation) {
                    bizagi.showConfirmationBox(
                        bizagi.localization.getResource("workportal-widget-templateengine-action-rule-confirmation"),
                        "Bizagi",
                        true,
                        [{label: "Ok", action: "resolve"}, {label: "Cancel", action: "reject"}])
                        .done(function () {
                            self.executeRuleAction(params).then(function () {
                                defer.resolve();
                            }).fail(function () {
                                defer.reject();
                            });
                        }).always(function () {
                        //bizagiLoader().stop();
                    });
                } else {
                    self.executeRuleAction(params).then(function () {
                        defer.resolve();
                    }).fail(function () {
                        defer.reject();
                    });
                }
                break;

            default:
                //bizagiLoader().stop();
                defer.resolve();
                break;
        }

        return defer.promise();
    },
    /**
     * Show an error message based on the code status response from server.
     * @param title The title of the message to show.
     * @param error The server error response.
     */
    showErrorMessage: function (title, error) {
        //TODO capturar el codigo del error {404, 500, etc} y mandar el mensaje acorde al error
        var message = bizagi.localization.getResource("workportal-widget-sortbar-execute-error-message").replace("%s", title);
        $.notifier.add({
            title: "Error",
            text: message,
            class_name: "error",
            sticky: false
        });
    },

    /**
     * Ejecuta una unica accion de tipo Regla
     * @param params
     * return promise*
     */
    executeRuleAction: function (params) {
        var self = this;
        var promiseData = (params.isMultiInstance) ? self.dataService.executeAction : self.dataService.actionRule;
        return $.when(promiseData.apply(self.dataService, [params])).then(function (data) {
            if (params.confirmation) {
                var keyResource = "workportal-widget-templateengine-action-rule-notification-singular";

                var messageSummary = printf(bizagi.localization.getResource(keyResource), params.displayName, 1);
                var message = "";

                if (data.result === "success") {
                    message = bizagi.localization.getResource("workportal-widget-templateengine-action-rule-success");
                    message = printf(message, 1);
                }
                else {
                    message = bizagi.localization.getResource("workportal-widget-templateengine-action-rule-error");
                }
                $.notifier.add({title: message, text: messageSummary, sticky: true});
            }
        }).fail(function (error) {
            self.showErrorMessage(params.actionType, error);
        });
    },

    /**
     * Reload the template
     */
    refreshTemplate: function () {
        var self = this;
        var context = self.initialParams.homePortalFramework.accumulatedContext;
        var args = {
            calculateFilters: true,
            data: context.length > 0 ? context[context.length - 1] : self.accumulatedContext,
            filters: [],
            eventType: "DATA-NAVIGATION"
        };

        bizagi.webpart.publish("homeportalShow", {
            "what": "stuffTemplates",
            "title": args && args.data ? args.data.displayName : "",
            "params": args,
            "preventNavigate": true
        });
        //TODO dejar unicamente el homeportalShow con el refresh cuando se soporte la actualizaci�n de un solo resgitro
        //self.publish("homeportalShow", {"what": origin, params : {refresh:true, surrogateKey: self._renderParams.h_surrogateKey, idCase: bizagi.context.idCase}});
    },

    processEvent: function (eventParams) {
        bizagi.webpart.publish("executeRoutingAction", {
            idCase: eventParams.idCase,
            idWorkItem: eventParams.idWorkitem,
            idTask: eventParams.idTask,
            idWorkflow: eventParams.idWorkflow
        });
    }
});
