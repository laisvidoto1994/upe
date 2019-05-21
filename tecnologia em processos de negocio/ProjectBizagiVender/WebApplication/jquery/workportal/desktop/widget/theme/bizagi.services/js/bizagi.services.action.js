angular.module('bizagi.services.module').factory('bizagi.services.action', function ($q) {
    var service = new bizagi.workportal.services.service();
    var notifier = bizagi.injector.get('notifier');
    var processAction = bizagi.injector.get('processActionService');
    var actionService = bizagi.injector.get('actionService');
    var globalHandlersService = bizagi.injector.get('globalHandlersService');
    var widgetManager = bizagi.injector.get('widgetManager');

    var _executeAction = function (hotel) {
        var action = {
            "id": "10a461cf-5570-4ce2-b815-14395e642b69",
            "displayName": "Book",
            "type": "Process",
            "reference": "d66647f0-e409-40fe-bef6-3a9f160f2633",
            "multiplicity": 1,
            "description": "Book",
            "hasStartForm": true,
            "entityId": "b8340aaf-7168-489f-bc1e-591f8f9f6c84",
            "entityName": "Booking",
            "isCase": false,
            "surrogateKey": hotel.surrogateKey,
            "guidEntity": hotel.guid,
            "idCase": 105
        };

        bizagi.injector.get('accumulatedcontext').clean();
        bizagi.injector.get('accumulatedcontext').addContext({ "entityGuid": hotel.guid, "surrogateKey": [hotel.surrogateKey] });
        actionService.executeAction({ target: '' }, action);
    };

    var _getEntityActions = function (entity) {
        var defer = new $.Deferred();

        $.when(actionService.getActionsData({
            guidEntity: entity.id,
            surrogateKey: entity.surrogateKey
        })).done(function (actions) {
		    defer.resolve({ actions: actions, entity: entity });
		});

        return defer.promise();
    };

    return {
        getEntityActions: _getEntityActions,
        executeAction: _executeAction
    };
});