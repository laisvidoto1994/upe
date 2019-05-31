angular.module('bizagi.services.module').factory('bizagi.services.user', function ($q) {
    var service = new bizagi.workportal.services.service();

    /*var notifier = bizagi.injector.get('notifier');
    var processAction = bizagi.injector.get('processActionService');
    var actionService = bizagi.injector.get('actionService');
    var globalHandlersService = bizagi.injector.get('globalHandlersService');
    var widgetManager = bizagi.injector.get('widgetManager');*/

    var _getUser = function () {
        var deferred = $q.defer();

        service.getCurrentUser().done(function (user) {
            user.initials = user.userFullName.getInitials();
            user.associatedStakeholderNames = user.associatedStakeholders.map(function (elem) {
                return elem.name;
            }).join(',');

            deferred.resolve(user);
        });

        return deferred.promise;
    };

    var _openPreferences = function () {
        $("#menuListPreferences").click();
    };

    return {
        getUser: _getUser,
        openPreferences: _openPreferences
    };
});