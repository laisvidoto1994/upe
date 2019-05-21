bizagi.workportal.services.processaction = (function (dataService, notifier, globalHandlersService, accumulatedcontext, dialogWidgets, loadTemplatesService) {
    var self = this;
    self.observableElement = $({});
    self.dialogBox = {};

    loadTemplatesService.loadTemplates({
        "popup-notification-template": bizagi.getTemplate("bizagi.workportal.services.processactions").concat("#popup-notification-template"),
        "popup-notification-rules-template": bizagi.getTemplate("bizagi.workportal.services.processactions").concat("#popup-notification-rules-template")
    });

    /**
     *
     * @param params
     * @returns {*}
     */
    self.executeProcessAction = function (params) {
        var action = params.action,
            mappingData = params.mappingData,
            mappingstakeholders = params.mappingstakeholders || "",
            guidprocess = params.guidprocess || action.reference,
            parentId = (action.multiplicity === 1 && params.parentId > 0) ? params.parentId : (action.isCase && action.multiplicity !== 2 ) ? action.idCase : undefined,
            defer = new $.Deferred();
        self.executingBatchActions = params.executingBatchActions;

        if (action.hasStartForm) {
               data = {
                closeVisible: false,
                modalParameters: { title: action.displayName },
                isMultiInstance: (action.multiplicity == 2),
                mapping: mappingData,
                mappingstakeholders: mappingstakeholders,
                guidprocess: guidprocess,
                idParentCase: parentId
            };

            data.widgetInstance = bizagi.injector.get("bizagi.workportal.widgets.createcase", data);
            data.widgetInstance.sub("closeDialog", function (ev, params) {
                $(document).data("auto-save", "");
                dialogWidgets.close();
                self.launchActionsAfterCreateCase($.extend(params, {action: action, showConfirmation: params.showConfirmation}));
                defer.resolve({action: action});
            });
            data.widgetInstance.sub("loadedForm", function (ev, params) {
                defer.resolve();
            });

            dialogWidgets.renderWidget(data);
        }
        else {
            $.when(dataService.actionCreateCase({
                idProcess: action.reference,
                entityMapping: JSON.stringify(mappingData),
                idParentCase: parentId
            }))
            .done($.proxy(function (data) {
                $.when(self.launchActionsAfterCreateCase($.extend({ idCase: data.caseId, caseNumber: data.caseNumber }, {action: this, showConfirmation: params.showConfirmation})))
                .done(function(){
                    defer.resolve({ idCase: data.caseId, caseNumber: data.caseNumber, action: action });
                });
            }, action));
        }

        return defer.promise();
    };

    /**
     *
     * @param params
     */
    self.launchActionsAfterCreateCase = function (params){
        var defer = new $.Deferred();
        $.when(self.currentUserBelongNextActivity(params.idCase)).done(function (currentUserBelong) {
            self.executingBatchActions = self.executingBatchActions || false;
            if(currentUserBelong == true && self.executingBatchActions == false){
                // Executes routing action
                globalHandlersService.publish("executeAction", {
                    action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                    idCase: params.idCase
                });
                defer.resolve();
            }
            else if(self.executingBatchActions == false){
                if(params.action.showConfirmation){
                    $.when(self.sendNotification({
                        caseInfo: { idCase: params.idCase,
                            caseNumber: params.caseNumber,
                            displayName:params.action.displayName,
                            showConfirmation: params.action.showConfirmation }
                    })).done(function(){
                            defer.resolve();
                    });
                }else{
                    defer.resolve();
                }
            }else{
                defer.resolve();
            }
        });
        return defer.promise();
    };

    /**
     *
     * @param idCase
     * @returns {*}
     */
    self.currentUserBelongNextActivity = function (idCase){
        var self = this;
        var defer = $.Deferred();
        $.when(self.getCaseAssignees(idCase)).done(function (response) {
            var usersAssigned = response.assignees;
            var currentUserAssigned = false;
            if (usersAssigned) {
                for (var iAssigned = 0; iAssigned < usersAssigned.length; iAssigned++) {
                    if(usersAssigned[iAssigned].idUser == bizagi.currentUser.idUser){
                        currentUserAssigned = true;
                        break;
                    }
                }
            }
            defer.resolve(currentUserAssigned);
        });
        return defer.promise();
    };

    /**
     *
     * @param idCase
     * @returns {*}
     */
    self.getCaseAssignees = function (idCase) {
        var defer = $.Deferred();
        $.when(
           dataService.getCaseAssignees({
               idCase: idCase
           })).done(function (baseAssignees) {
               defer.resolve(baseAssignees);
           });
        return defer.promise();
    };

    /**
     *
     * @param data
     */
    self.sendNotification = function (data) {
       return self.showDialogNotification([
                {
                    idCase: data.caseInfo.idCase,
                    caseNumber: data.caseInfo.caseNumber
                }
            ],
            data.caseInfo.displayName,
            data.caseInfo.showConfirmation );
    };

    /**
     *
     * @param params
     * @returns {*}
     */
    self.executeFormAction = function (params) {
        var action = params.action;
        var defer = new $.Deferred();
        var mappingData = params.mappingData;
        var readonlyform = params.action.readonlyform || false;

        var data = {
            closeVisible: false,
            modalParameters: {
                title: action.displayName
            },
            guidForm: action.reference
        };

        if (typeof mappingData !== "undefined") {
            $.extend(data, { entityGuid: action.guidEntity, mapping: mappingData });
        } else {
            $.extend(data, { entityGuid: action.guidEntity, surrogateKey: action.surrogateKey });
        }
        $.extend(data, { readonlyform: readonlyform });

        var dialog = bizagi.injector.get("dialogWidgets");
        data.widgetInstance = bizagi.injector.get("bizagi.workportal.widgets.updateform", data);
        data.widgetInstance.sub("closeDialog", function (ev, data) {
            dialog.close();

            // At this point it's not longer necessary to collect all the data
            $.forceCollectData = false;
            defer.resolve(data);
        });

        // As the server does not keep an scope for FormActions, it's necessary to send the information always
        $.forceCollectData = true;

        dialog.renderWidget(data);

        return defer.promise();
    };

    /**
     *
     * @param params
     */
    self.executeRuleAction = function (params) {
        var action = params.action,
            defer = new $.Deferred();
        $.when(dataService.executeRule({
            surrogateKey: action.surrogateKey,
            entityId: action.guidEntity,
            ruleId: action.reference
        })).done(function (data) {
            if (data.result === "success") {
                $.when(self.showDialogNotificationRules([[{id: data.id}, "success"]], params.action.displayName, params.action.showConfirmation))
                .done(function(){
                    defer.resolve(data);
                    params.refresh = true;
                    self.publish("onFormRuleExecuted", $.extend(data, params));
                });
            } else {
                $.when(self.showDialogNotificationRules([[{id: data.id}, "error"]], params.action.displayName, params.action.showConfirmation))
                .done(function(){
                    defer.resolve(data);
                });
            }
        });
        return defer.promise();
    };

    /**
     *
     * @param params
     */
    self.executeBatchAction = function (params) {
        var action = params.action;
        var commonActionsmodel = params.commonActionsmodel;
        var surrogateKeys = commonActionsmodel.surrogateKeys;
        var defer = $.Deferred();
           
        if (action.type === "Process") {

            if (action.multiplicity === 1) {
                var parentsid = ( commonActionsmodel.parentsid ) ? commonActionsmodel.parentsid : [];
                $.when(self.resolveMultiplicityValidate(params, surrogateKeys, parentsid)).always(function(){
                    defer.resolve();
                });
            } else {
                $.when(self.multiplicityValidate(params, [], 0)).always(function(){
                    defer.resolve();
                });
            }

        } else {
            if (action.multiplicity === 1) {
                $.when(self.resolveBatchRules(surrogateKeys, action)).always(function(){
                    defer.resolve();
                });
            } else {
                $.when(dataService.executeRuleMultiple({
                    surrogateKey: commonActionsmodel.surrogateKeys,
                    entityId: action.guidEntity,
                    ruleId: action.reference
                }))
                .done(function (data) {
                    if (data.result === "success") {
                        $.when(self.showDialogNotificationRules([[{id: data.id}, "success"]], action.displayName, action.showConfirmation))
                        .done(function(){
                            self.publish("onFormRuleExecuted", {"refresh": true});
                            defer.resolve();
                        });
                    } else {
                        $.when(self.showDialogNotificationRules([[{id: data.id}, "error"]], action.displayName, action.showConfirmation))
                        .done(function(){
                            defer.resolve();
                        });
                    }
                })
                .fail(function () {
                    $.when(self.showDialogNotificationRules([[{id: data.id}, "error"]], action.displayName, action.showConfirmation))
                    .done(function(){
                        defer.resolve();
                    });
                });
            }
        }
        return defer.promise();
   };

    /**
     *
     * @param params
     * @param surrogateKeys
     * @param parentsid
     */
    self.resolveMultiplicityValidate = function(params, surrogateKeys, parentsid){
        var deferMethod = $.Deferred();
        var arrayCreateCaseDeferreds = [];
        for (var i = 0, l = surrogateKeys.length; i < l; i++) {
            (function(index, length, params, surrogateKeys, parentsid){
                setTimeout(function(){
                    var defer = self.multiplicityValidate(params, [surrogateKeys[index]], parentsid[index]);
                    arrayCreateCaseDeferreds.push(defer);
                    if(index === length - 1){
                        waitFinishAllRequest();
                    }
                }, index * 1000);//QAF-1712: Server response ERROR when service startCase calling multiple times simultaneously:
            })(i, l, params, surrogateKeys, parentsid);
        }

        function waitFinishAllRequest(){
            $.when.apply($, arrayCreateCaseDeferreds).done($.proxy(function(){
                var arrayResponsesDataCasesCreated = arguments;
                if(arrayResponsesDataCasesCreated.length > 1){
                    var showConfirmation = arrayResponsesDataCasesCreated.length > 0 ? arrayResponsesDataCasesCreated[0].action.showConfirmation : false;
                    $.when(self.showDialogNotification(arrayResponsesDataCasesCreated, this.displayName, showConfirmation))
                        .done(function(){
                            deferMethod.resolve();
                        });
                }else{
                deferMethod.resolve();
                }
            }, params.action));
        }
        return deferMethod.promise();
    };

    /**
     *
     * @param params
     * @param mappingData
     * @param parentId
     * @returns {*}
     */
    self.multiplicityValidate = function (params, mappingData, parentId) {
        var defer = $.Deferred();
        var action = params.action;
        var commonActionsmodel = params.commonActionsmodel;

        if (accumulatedcontext.isValidData("entityGuid", commonActionsmodel.guidEntity)) {
            //Same level
            accumulatedcontext.updateLastPosition({
                key: "surrogateKey",
                value: (mappingData.length > 0) ? mappingData : commonActionsmodel.surrogateKeys.map( function (a) {
                    return (typeof a === "string") ? parseInt(a) : a;
                })
            });
        }
        else {
            //Advance
            accumulatedcontext.addContext({
                "entityGuid": commonActionsmodel.guidEntity,
                // QAF-794
                "surrogateKey": (mappingData.length > 0) ? mappingData : commonActionsmodel.surrogateKeys.map( function (a) {
                    return (typeof a === "string") ? parseInt(a) : a;
                })
            });
        }

        $.when(dataService.getMapping({
            guidEntity: action.entityId,
            accumulatedContext: accumulatedcontext.getContext({}),
            xpathContext: action.entityName
        })).done(function (mappingDataRestult) {
            params.mappingData = mappingDataRestult;
            params.parentId = parentId;
            if(params.action.multiplicity == 1 && params.commonActionsmodel.surrogateKeys.length > 1){//only if batch action generate some cases
                params.executingBatchActions = true;
            }
            $.when(self.executeProcessAction(params)).done(function(data){
                defer.resolve(data);
            });
        });

        return defer.promise();
    };

    /**
     *
     * @param surrogateKeys
     * @param action
     */
    self.resolveBatchRules = function (surrogateKeys, action){
        var deferMethod = $.Deferred();
        var arrayCreateRulesDeferreds = [];
        for (var i = 0, l = surrogateKeys.length; i < l; i++) {
            var defer = $.when(dataService.executeRule({
                surrogateKey: surrogateKeys[i],
                entityId: action.guidEntity,
                ruleId: action.reference
            }));
            arrayCreateRulesDeferreds.push(defer);
        }
        $.when.apply($, arrayCreateRulesDeferreds).done($.proxy(function(){
            var arrayResponsesDataRulesCreated = arguments;
            if(arrayResponsesDataRulesCreated[0].id){
                $.when(self.showDialogNotificationRules([arrayResponsesDataRulesCreated], this.displayName, this.showConfirmation))
                .done(function(){
                    self.publish("onFormRuleExecuted", {"refresh": true});
                    deferMethod.resolve();
                });
            }
            else{
                $.when(self.showDialogNotificationRules(arrayResponsesDataRulesCreated, this.displayName, this.showConfirmation))
                .done(function(){
                    self.publish("onFormRuleExecuted", {"refresh": true});
                    deferMethod.resolve();
                });
            }
        },action));

        return deferMethod.promise();
    };

    /**
     *
     * @param arrayCases
     * @param displayNameAction
     * @param showDialogNotification
     */
    self.showDialogNotification = function (arrayCases, displayNameAction, showDialogNotification) {
        var deferMethod = $.Deferred();
        if(showDialogNotification){
            var messageCaseCreated = bizagi.localization.getResource("workportal-widget-templateengine-action-process-notification");
            var messageCreatedCases = $.map(arrayCases, function(response){
                var displayCase = response.caseNumber || response.idCase;
                return {
                    caseCreated: messageCaseCreated.replace("{0}", "<a href='#' data-idcase='" + response.idCase + "'>" + displayCase + "</a>"),
                    icon: "check"
                };
            });

            var template = loadTemplatesService.getTemplate("popup-notification-template");

            var messageSummary;
            if(messageCreatedCases.length > 1){
                messageSummary = bizagi.localization.getResource("workportal-widget-templateengine-message-summary-create-cases-plural");
            }
            else{
                messageSummary = bizagi.localization.getResource("workportal-widget-templateengine-message-summary-create-cases-singular");
            }
            messageSummary = printf(messageSummary, messageCreatedCases.length);

            messageActionGoToCase = bizagi.localization.getResource("workportal-widget-templateengine-message-action-go-to-case");

            self.dialogBox.formContent = template.render({
                messageCreatedCases: messageCreatedCases,
                messageSummary: messageSummary,
                messageActionGoToCase: messageActionGoToCase
            });


            var notification = new NotificationMessage(displayNameAction,{
                body: self.dialogBox.formContent.html(),
                iconType: _NOTIFICATION_ICON_TYPE.CSS
            });

            notification.onShow = function(){
                deferMethod.resolve();
            };


            notification.onClick = function(event){
                event.preventDefault();

                var idCase = $(event.target).data("idcase");
                if(idCase && $(event.target).is("a")){
                    $(event.currentTarget).unbind(event);

                    globalHandlersService.publish("executeAction", {
                        action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
                        idCase: idCase
                    });
                }

                this.close();
                return false;
            };

            globalHandlersService.publish("notification", {notification:notification, type:_NOTIFICATION_TYPE.MODAL});

        }else{
            deferMethod.resolve();
        }
        return deferMethod.promise();
    };

    /**
     *
     * @param arrayRules
     * @param displayNameAction
     * @param showConfirmation
     */
    self.showDialogNotificationRules = function (arrayRules, displayNameAction, showConfirmation) {
        var deferMethod = $.Deferred();
        if(showConfirmation){
            var keyResource = "workportal-widget-templateengine-action-rule-notification-";
            if(arrayRules.length > 1){
                keyResource += "plural";
            }
            else{
                keyResource += "singular";
            }
            var messageSummary = printf(bizagi.localization.getResource(keyResource), displayNameAction, arrayRules.length);
            var messageRuleCreatedSuccess = bizagi.localization.getResource("workportal-widget-templateengine-action-rule-success");
            var messageRuleCreatedError = bizagi.localization.getResource("workportal-widget-templateengine-action-rule-error");

            arrayRules = $.map(arrayRules, function(response){
                return {type: response.length > 1 ? response[1] : "success"};
            });

            var totalSuccess = arrayRules.filter(function(rule){
                return rule.type == "success";
            }).length;
            var totalErrors = arrayRules.length - totalSuccess;
            var resultTotalRules = [];
            resultTotalRules.push({result: printf(messageRuleCreatedSuccess, totalSuccess), type: "success", icon: "check"});
            if(totalErrors > 0){
                resultTotalRules.push({result: printf(messageRuleCreatedError, totalErrors), type: "error", icon: "error"});
            }

            var template = loadTemplatesService.getTemplate("popup-notification-rules-template");
            self.dialogBox.formContent = template.render({
                messageSummary: messageSummary,
                resultTotalRules: resultTotalRules
            });

            var notification = new NotificationMessage(displayNameAction,{
                body: self.dialogBox.formContent.html(),
                iconType: _NOTIFICATION_ICON_TYPE.CSS
            });

            notification.onShow = function(){
                deferMethod.resolve();
            };

            notification.onClick = function(event){
                event.preventDefault();
                this.close();
                return false;
            };

            globalHandlersService.publish("notification", {notification:notification, type:_NOTIFICATION_TYPE.MODAL});
        }else{
            deferMethod.resolve();
        }
        return deferMethod.promise();
    };

    /**
     *
     */
    self.subscribe = function () {
        self.observableElement.on.apply(self.observableElement, arguments);
    };

    /**
     *
     */
    self.unsubscribe = function () {
        self.observableElement.off.apply(self.observableElement, arguments);
    };

    /**
     *
     * @returns {*}
     */
    self.publish = function () {
        return self.observableElement.triggerHandler.apply(self.observableElement, arguments);
    };

    return {
        executeProcessAction: self.executeProcessAction,
        executeFormAction: self.executeFormAction,
        executeRuleAction: self.executeRuleAction,
        executeBatchAction: self.executeBatchAction,
        subscribe: self.subscribe,
        unsubscribe: self.unsubscribe,
        publish: self.publish,
        sendNotification: self.sendNotification,
        currentUserBelongNextActivity: self.currentUserBelongNextActivity,
        launchActionsAfterCreateCase: self.launchActionsAfterCreateCase
    }
});

bizagi.injector.register("processActionService", ["dataService", "notifier", "globalHandlersService", "accumulatedcontext", "dialogWidgets", "loadTemplatesService", bizagi.workportal.services.processaction]);