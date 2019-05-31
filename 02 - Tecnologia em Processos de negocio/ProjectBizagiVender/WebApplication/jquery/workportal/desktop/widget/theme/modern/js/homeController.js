angular.module('homeModule').controller('homeController', ['$scope', function ($scope) {
    $scope.currentMenuItem = 'suggestions';
    
    $scope.setMenu = function (currentMenuItem) {
        $scope.currentMenuItem = currentMenuItem;
    }
}]);