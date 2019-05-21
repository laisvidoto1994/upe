angular.module('bizagi.services.module').factory('bizagi.services.suggestion', function ($q) {
    var service = new bizagi.workportal.services.service();
    var notifier = bizagi.injector.get('notifier');
    var processAction = bizagi.injector.get('processActionService');
    var actionService = bizagi.injector.get('actionService');
    var globalHandlersService = bizagi.injector.get('globalHandlersService');
    var widgetManager = bizagi.injector.get('widgetManager');

    var _getSuggestions = function () {
        var deferred = $q.defer();
        service.getMyShortcutsByCategory({ icon: true }).done(function (suggestions) {
            deferred.resolve(suggestions);
        });
        return deferred.promise;
    };


    var _gotoSuggestion = function (suggestion) {
        var shortcut = suggestion;

        if (shortcut) {

            $.when(service.actionsHasStartForm({ processId: shortcut.idProcess })).done(function (data) {
                if (!data.startForm) {
                    var message = bizagi.localization.getResource('workportal-widget-templateengine-action-process-confirmation');
                    $.when(bizagi.showConfirmationBox(message, shortcut.displayName, null, false))
                    .pipe(function () {
                        return service.actionCreateCase(shortcut);
                    })
                    .done(function (data) {
                        processAction.sendNotification({ caseInfo: { idCase: data.caseId, caseNumber: data.caseNumber } });
                    });
                } else {
                    var action = {
                        displayName: shortcut.displayName,
                        hasStartForm: data.startForm
                    };
                    $.when(processAction.executeProcessAction({
                        action: action,
                        mappingstakeholders: true,
                        guidprocess: shortcut.idProcess
                    }));
                }
            })
            .fail(function () {
                notifier.showErrorMessage(
                        printf(bizagi.localization.getResource('workportal-widget-sortbar-execute-error-message'), shortcut.displayName));
            });
        }
    };

    return {
        getSuggestions: _getSuggestions,
        gotoSuggestion: _gotoSuggestion
    };
});