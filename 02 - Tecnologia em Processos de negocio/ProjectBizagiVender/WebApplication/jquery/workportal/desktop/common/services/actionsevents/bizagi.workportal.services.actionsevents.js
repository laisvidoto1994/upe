bizagi.workportal.services.actionsevents = (function (dataService, globalHandlersService) {
    var self = this;

    /**
     *
     * @param idCases
     * @returns {*}
     */
    self.render = function (idCases) {
        self.cases = [];
        var promises = $.map(idCases, function (idCase) {
            return dataService.getActionsEvents({ caseId: idCase }).done(function (data) {
                var auxIdCase = idCase;
                if(typeof data !== "undefined" && data.length > 0 && data[0].length > 0){
                    auxIdCase = data[0][0].idCase;
                    data[0].forEach(function(event){
                        event.idCaseEvent = auxIdCase;
                    });
                }

                var caseObj = {
                    'idCase': idCase,
                    'idCaseEvent': auxIdCase,
                    'events': data[0] || []
                };
                self.cases.push(caseObj);
            });
        });

        self.promiseData = $.when.apply($, promises).then(function (data) {
            return self.cases;
        });

        return self.promiseData;
    };

    /**
     * Return the promise when data is resolve
     * @return
     */
    self.dataReady = function () {
        return self.promiseData;
    };

    /**
     * Get events for a case
     * @param {number} idCase
     *
     */
    self.getEvents = function (idCase) {
        var eventsInfo = self.cases.find(function (el) {
            return el.idCase == idCase;
        });

        return (eventsInfo && eventsInfo.events)? eventsInfo.events : [];
    };

    /**
     * Invoque execute action function in the globalhandlers service
     * @param {object} eventParams
     *
     */
    self.processEvent = function (eventParams) {
        globalHandlersService.publish('executeAction', {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: eventParams.idCaseEvent,
            idWorkItem: eventParams.idWorkitem,
            idTask: eventParams.idTask,
            idWorkflow: eventParams.idWorkflow
        });
    };

    return {
        getEvents: self.getEvents,
        dataReady: self.dataReady,
        processEvent: self.processEvent,
        render: self.render
    }
});

bizagi.injector.register('actionsEventsService', ['dataService', 'globalHandlersService', bizagi.workportal.services.actionsevents]);