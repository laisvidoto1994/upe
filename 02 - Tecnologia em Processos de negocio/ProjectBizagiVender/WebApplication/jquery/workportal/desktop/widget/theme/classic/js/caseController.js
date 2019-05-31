angular.module('homeModule').controller('caseController', ['$scope', 'bizagi.services.case', function ($scope, service) {
    $scope.gotoPendingCases = function () {
        service.gotoPendingCases();
    };

    $scope.gotoFollowingCases = function () {
        service.gotoFollowingCases();
    };
}]);