angular.module('homeModule').controller('menuController', ['$scope', 'bizagi.services.user', 'bizagi.services.process', function ($scope, service, processService) {
    $scope.user = {};
    $scope.userProfileEnabled = false;

    $scope.showMenu = function () {
        $scope.userProfileEnabled = !$scope.userProfileEnabled;
    };

    service.getUser().then(function (user) {
        $scope.user = user;
    });

    $scope.gotoModernTheme = function () {
        window.CURRENT_THEME_REMOVE_IT = "theme2";
        $scope.userProfileEnabled = !$scope.userProfileEnabled;

        var projectDashboard = bizagi.injector.get('bizagi.workportal.services.behaviors.projectDashboard');
        projectDashboard.setCustomizeTheme();
    };

    $scope.gotoBookingTheme = function () {
        window.CURRENT_THEME_REMOVE_IT = "theme3";
        $scope.userProfileEnabled = !$scope.userProfileEnabled;

        var projectDashboard = bizagi.injector.get('bizagi.workportal.services.behaviors.projectDashboard');
        projectDashboard.setCustomizeTheme();
    };

    processService.getProcesses();
}]);