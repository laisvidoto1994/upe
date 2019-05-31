angular.module('homeModule').controller('userController', ['$scope', 'bizagi.services.user', function ($scope, service) {
    $scope.user = {};

    $scope.getUser = function () {
        service.getUser().then($scope.getUserSuccess);
    };

    $scope.getUserSuccess = function (user) {
        $scope.user = user;
    };

    $scope.init = function () {
        $scope.getUser();
    };

    $scope.init();
}]);