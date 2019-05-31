﻿bizagi.workportal.services.action = (function (dataService, loadTemplatesService, usersCasesService, actionsEventsService, processActionService, accumulatedcontext) {
    var self = this;
    self.observableElement = $({});
    self.requestsInProgressActionGuid = {};

    self.init = function () {
        self.model = {};
    };

    //load Templates
    loadTemplatesService.loadTemplates({
        'actionsTemplate': bizagi.getTemplate('bizagi.workportal.services.actions').concat('#actions-wrapper'),
        'actionsTooltip': bizagi.getTemplate('bizagi.workportal.services.actions').concat('#actions-tooltip')
    });

    self.getActionsData = function (actionData) {
        return dataService.getActionsData(actionData).then( function (actions) {
            var $def = new $.Deferred();
            $.when.apply($, $.map(actions, function (action) {
                if (action.type == "Process") {
                    return dataService.actionsHasStartForm({ processId: action.reference });
                }
                return false;
            })).done( function (data) {
                var elements = $.makeArray(arguments);
                var actionsLen = actions.length;
                if (actionsLen > 1) {
                    for (var i = 0; i < actionsLen; i++) {
                        actions[i].hasStartForm = elements[i] && elements[i][0].startForm;
                        actions[i].entityId = elements[i] ? elements[i][0].entityId : '';
                        actions[i].entityName = elements[i] ? elements[i][0].entityName : '';
                    }
                }
                else if(actionsLen == 1)  {
                    actions[0].hasStartForm = elements[0] && elements[0].startForm;
                    actions[0].entityId = elements[0] ? elements[0].entityId : '';
                    actions[0].entityName = elements[0] ? elements[0].entityName : '';
                }
                $def.resolve(actions);
            });
            return $def.promise();
        });
    };

    /**
     *
     * @param data
     */
    self.processActionsData = function(data){
        var actions = data.actions,
            isRefresh = data.isRefresh,
            isCase = data.isCase,
            isEvent = data.isEvent,
            actionData = data.actionData;

        self.model[actionData.guidEntity] = self.model[actionData.guidEntity] || {};
        self.model[actionData.guidEntity][actionData.surrogateKey] = self.model[actionData.guidEntity][actionData.surrogateKey] || {};

        for (var i = 0, l = actions.length; i < l; i++){
            var action = actions[i];
            action.isCase = isCase;

            //hash identified action: normal action or event
            var hashId = action.id || action.reference;
            self.model[actionData.guidEntity][actionData.surrogateKey][hashId] = $.extend(action, {
                surrogateKey: actionData.surrogateKey,
                guidEntity: actionData.guidEntity,
                idCase: actionData.idCase,
                radNumber: actionData.radNumber,
                guidFact: actionData.guidFact,
                guidLeftEntity: actionData.guidLeftEntity,
                guidRightEntity: actionData.guidRightEntity,
                surrogateKeyLeftEntity: actionData.surrogateKeyLeftEntity,
                xpath: actionData.xpath
            });
        }

        if (isRefresh) {
            delete self.model[actionData.guidEntity][actionData.surrogateKey].actions;
            delete self.model[actionData.guidEntity][actionData.surrogateKey].events;
        }
        if (!isEvent && self.model[actionData.guidEntity][actionData.surrogateKey].actions == undefined) {
            self.model[actionData.guidEntity][actionData.surrogateKey].actions = actions || [];
        }
        if (isEvent && self.model[actionData.guidEntity][actionData.surrogateKey].events == undefined) {
            self.model[actionData.guidEntity][actionData.surrogateKey].events = actions || [];
            if (self.model[actionData.guidEntity][actionData.surrogateKey].actions == undefined) {
                self.model[actionData.guidEntity][actionData.surrogateKey].actions = [];
            }
            // Used for displaying actions and events in the template
            self.model[actionData.guidEntity][actionData.surrogateKey].actions = self.model[actionData.guidEntity][actionData.surrogateKey].actions.concat(actions);
        }

        self.model[actionData.guidEntity][actionData.surrogateKey].entityActions = $.grep(self.model[actionData.guidEntity][actionData.surrogateKey].actions, function (action) {
            return action.multiplicity != 2;
        });

        self.model[actionData.guidEntity][actionData.surrogateKey].batchActions = $.grep(self.model[actionData.guidEntity][actionData.surrogateKey].actions, function (action) {
            return action.multiplicity == 2;
        });
    };

    /**
     *
     * @param params
     * @returns {*}
     */
    self.getAction= function(params){
        var action =  self.model[params.guidEntity] || {};
        action = action[params.surrogateKey] || {};
        return action[params.guidAction];
    };

    /**
     *
     * @param data
     * @returns {{}}
     */
    self.getActions = function (data) {
        var data = data || {},
            setActions = {};

        for (var key in data) {
            var item = data[key];
            var actionsData = self.model[item.guidEntity] || {};
            var surrogateKey = item.surrogateKey || item.idCase;
            actionsData = actionsData[surrogateKey] || {};

            setActions[surrogateKey] = actionsData.actions || [];
        }

        return setActions;
    };

    /**
     *
     * @param params
     * @returns {*}
     */
    self.getActionsView = function (params) {
        var defer = new $.Deferred(),
            actionData = params.actionData,
            isRefresh = params.isRefresh,
            loadEvents = params.loadEvents;
        var eventsPromise = loadEvents ? actionsEventsService.dataReady() : true;
        var actionsPromise = (actionData.surrogateKey >= 0) ? self.getActionsData(actionData)  : [];

        $.when(actionsPromise, eventsPromise)
            .then(function (data) {
                if (data.length > 0) {
                    var isCase = (actionData.idCase !== undefined);                    
                    self.processActionsData({ actions: data, actionData: actionData, isRefresh: isRefresh, isCase: isCase });
                }
                return {
                    actionTemplate: loadTemplatesService.getTemplate('actionsTemplate'),
                    actions: data,
                    idCase: actionData.idCase,
                    actionData: actionData,
                    surrogateKey: actionData.surrogateKey
                }
            })
            .then(function(templateData){
                if (loadEvents) {
                    var events = actionsEventsService.getEvents(templateData.idCase);

                    if (events.length > 0) {
                        self.processActionsData({ actions: events, actionData: templateData.actionData, idCase: templateData.idCase, isCase: false, isEvent:true });

                        templateData.idCaseEvent = events[0].idCaseEvent;
                        templateData.actions = templateData.actions
                            .concat(events);
                    }
                }
                return templateData;
            })
            .done(function (templateData) {
                $actionTemplate = null;

                if (templateData.actions.length > 0) {
                    var actionsModel = self.getActionsModel( actionData.guidEntity,  actionData.idCase, actionData.surrogateKey);
                    actionsModel.idCaseEvent = templateData.idCaseEvent;

                    var $actionTemplate = templateData.actionTemplate.render(actionsModel);

                    $actionTemplate.on('click', '.actions-container li', self.executeAction);
                    $actionTemplate.find(".actions-container li").tooltip();

                    /*if (actionsModel.showMore) {
                        $actionTemplate.on('click', '.bz-actions-showmore', function (ev) {
                            var $target = $(ev.target),
                                tooltip = self.displayTooltipActions(ev);

                            tooltip.position({
                                    my: 'left top',
                                    at: 'left bottom',
                                    of: $target,
                                    collision: 'fit flip'
                                }).find('.actions-hidden-container li').click(function (ev) {
                                    tooltip.remove();
                                    var action = self.getAction({
                                        guidEntity: $(this).closest('.template-box-tooltip').data('entityguid'),
                                        idCase: $(this).closest('.template-box-tooltip').data('idcase'),
                                        guidAction: $(this).data('guid')
                                    });
                                    self.executeAction(ev, action);
                                });
                        });
                    }*/
                }

                defer.resolve({actionsView: $actionTemplate, actionsData: templateData.actions});
            });

        return defer.promise();
    };

    /**
     *
     * @param guidEntity
     * @param idCase
     * @returns {{actions: Array.<T>, idCase: *, guidEntity: *, showMore: boolean}}
     */
    self.getActionsModel = function(guidEntity, idCase, surrogateKey) {
        var actionsModel = self.model[guidEntity][surrogateKey].entityActions || [];

        return {
            actions: actionsModel,
            idCase: idCase,
            guidEntity: guidEntity,
            surrogateKey: surrogateKey
            // showMore: actionsModel.length > 6
        }
    };

    /**
     *
     * @param data
     * @returns {{context: *[]}}
     */
    self.getAccummulativeContext = function (data) {
        return {
            context: [{
                entityGuid: data.guidEntity,
                surrogateKey: [data.surrogateKey]
            }]
        };
    };

    /**
     *
     * @param ev
     * @returns {*}
     */
    self.displayTooltipActions = function (ev) {
        var $target = $(ev.target),
            guidEntity = $target.closest('.template-actions-container').data('entityguid'),
            idCase = $target.closest('.template-actions-container').data('idcase');
        var moreActions = self.model[guidEntity][idCase].entityActions.slice(6);
        var tooltip = loadTemplatesService.getTemplate('actionsTooltip').render({
            actions: moreActions,
            idCase: idCase,
            guidEntity: guidEntity
        });

        tooltip.appendTo($target.parent());

        setTimeout(function () {
            tooltip.click(function (e) {
                e.stopPropagation();
            });
            $(document).one('click', function () {
                tooltip.remove();
            });
        }, 100);

        return tooltip;
    };

    self.executeAction = function (ev, action) {
        var $target = $(ev.target);

        action = action || self.getAction({
            guidEntity: $target.closest('.template-actions-container').data('entityguid'),
            idCase: $target.closest('.template-actions-container').data('idcase'),
            surrogateKey: $target.closest('.template-actions-container').data('surrogatekey'),
            guidAction: $target.closest('li').data('guid')
        });
        action.idCaseEvent = $target.closest('.template-actions-container').data('idcaseevent');

        var hashActionOrEvent = self.getHashForActionOrEvent(action);

        if(self.requestsInProgressActionGuid[hashActionOrEvent])
            return;

        var $button = $target.closest('.wdg-tple-button');
        self.addLoadingButtonAction($button, hashActionOrEvent);

        if (action) {
            if (action.isEvent) {
                actionsEventsService.processEvent(action);
                self.removeLoadingButtonAction($button, hashActionOrEvent)
            }
            else {
                var type = action.type,
                    actionData = action.data;

                if (action.type === "Process") {
                    var totalContext = accumulatedcontext.countContext();
                    if (totalContext > 0) {
                        if (accumulatedcontext.isValidData("entityGuid", $target.closest('.template-actions-container').data('entityguid'))) {
                            //Same level
                            accumulatedcontext.updateLastPosition({
                                key: "surrogateKey",
                                value: [action.surrogateKey]
                            });
                        }
                        else {
                            //Advance
                            accumulatedcontext.addContext({
                                'entityGuid': $target.closest('.template-actions-container').data('entityguid'),
                                'surrogateKey': [action.surrogateKey]
                            });
                        }
                    }
                    else {
                        //new position
                        accumulatedcontext.addContext({
                            'entityGuid': $target.closest('.template-actions-container').data('entityguid'),
                            'surrogateKey': [action.surrogateKey]
                        });
                    }

                    $.when(dataService.getMapping({
                        guidEntity: action.entityId || action.guidEntity,
                        accumulatedContext: accumulatedcontext.getContext({}),
                        xpathContext: action.entityName
                    })).done(function (mappingData) {
                        if (typeof (self['onExecute' + type]) === 'function') {
                            self['onExecute' + type].apply(self, [action, mappingData, $button]);
                        }
                    });
                }
                else {
                    if (typeof (self['onExecute' + type]) === 'function') {
                        self['onExecute' + type].apply(self, [action, undefined, $button]);
                    }
                }

            }}
    };

    /**
     * Get hash for action or event.
     * @param action
     * @returns {action.id|*}
     */
    self.getHashForActionOrEvent = function(action){
        var hashActionOrEvent = action.id;
        if (action.isEvent) {
            hashActionOrEvent = action.idWorkitem;
        }
        return hashActionOrEvent;
    };

    /**
     *
     * @param action
     * @param mappingData
     */
    self.onExecuteProcess = function (action, mappingData, button) {
        if (action.hasStartForm) {
            $.when(processActionService.executeProcessAction({
                action: action,
                mappingData: mappingData
            })).done(function (data) {
                self.removeLoadingButtonAction(button, action.id)
            });
        }
        else {
            $.when(processActionService.executeProcessAction({
                action: action,
                mappingData: mappingData
            })).done(function (data) {
                self.removeLoadingButtonAction(button, action.id)
            });
        }

    };

    /**
     *
     * @param action
     */
    self.onExecuteForm = function (action, mappingData, button) {
        $.when(processActionService.executeFormAction({
            action: action
        })).done(function (data) {
            self.publish('onFormActionExecuted', $.extend(data, action));
        });
        self.removeLoadingButtonAction(button, action.id)
    };

    /**
     *
     * @param action
     */
    self.onExecuteRule = function (action, mappingData, button) {
        $.when(processActionService.executeRuleAction({
            action: action
        })).done(function(){
            self.removeLoadingButtonAction(button, action.id)
        });
    };

    /**
     *
     * @param data
     * @returns {Array}
     */
    self.getCommonActions = function (data) {
        var actionsData = self.getActions(data),
            i = 0,
            firstData = [],
            secondData = [];

        for (var key in actionsData) {
            if (i == 0) { firstData = actionsData[key]; }
            if (i == 1) {
                secondData = actionsData[key];
                firstData = self.actionIntersection(firstData, secondData);
            }
            if (i > 1) {
                firstData = self.actionIntersection(firstData, actionsData[key]);
            }

            i++;
        }

        return firstData;
    };

    /**
     *
     * @param array1
     * @param array2
     * @returns {Array}
     */
    self.actionIntersection = function (array1, array2) {
        var result = [];

        if (array1.length == 0) { return result; }
        if (array2.length == 0) { return result; }

        for (var i = 0, l = array1.length; i < l; i++) {
            var action = array1[i];
            for (var j = 0, k = array2.length; j < k; j++) {
                if (action.id == array2[j].id) {
                    result.push(action);
                }
            }
        }
        return result;
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


    /**
     * Add loading to button
     */
    self.addLoadingButtonAction =  function($button, actionId){
        $button.addClass("state-loading");
        $button.prepend("<div class=\"ui-bizagi-loading-icon ui-bizagi-loading-button\"></div>");
        self.requestsInProgressActionGuid[actionId] = true;
    };

    /**
     * Remove loading from button
     */
    self.removeLoadingButtonAction =  function($button, actionId){
        $button.removeClass("state-loading");
        $button.find(".ui-bizagi-loading-button").remove();
        delete self.requestsInProgressActionGuid[actionId];
    };



    return {
        getActionsView: self.getActionsView,
        getCommonActions: self.getCommonActions,
        getActions: self.getActions,
        getActionsData: self.getActionsData,
        executeAction: self.executeAction,
        subscribe: self.subscribe,
        unsubscribe: self.unsubscribe,
        publish: self.publish,
        init: self.init
    }
});

bizagi.injector.register('actionService', ['dataService', 'loadTemplatesService', 'usersCasesService', 'actionsEventsService', 'processActionService', 'accumulatedcontext', bizagi.workportal.services.action], true);
