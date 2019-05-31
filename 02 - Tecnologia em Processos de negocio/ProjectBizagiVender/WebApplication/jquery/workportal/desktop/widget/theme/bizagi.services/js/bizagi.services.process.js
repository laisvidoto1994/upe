angular.module('bizagi.services.module').factory('bizagi.services.process', function ($q) {
    var service = new bizagi.workportal.services.service();
    var notifier = bizagi.injector.get('notifier');
    var processAction = bizagi.injector.get('processActionService');
    var actionService = bizagi.injector.get('actionService');
    var globalHandlersService = bizagi.injector.get('globalHandlersService');
    var widgetManager = bizagi.injector.get('widgetManager');

    var _getProcesses = function () {
        console.log("get process")
    };

    return {
        getProcesses: _getProcesses
    };
});