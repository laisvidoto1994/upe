angular.module('homeModule').controller('planController', ['$scope', 'bizagi.services.plan', function ($scope, service) {
    $scope.gotoPendingPlans = function () {
        service.gotoPendingPlans();
    }

    $scope.gotoRunningPlans = function () {
        service.gotoRunningPlans();
    }

    $scope.gotoClosedPlans = function () {
        service.gotoClosedPlans();
    }
}]);