angular.module('homeModule').controller('collectionController', ['$scope', 'bizagi.services.collection', function ($scope, service) {
    $scope.collections = [];

    $scope.getCollections = function () {
        service.getCollections().then($scope.getCollectionsSuccess);
    };

    $scope.getCollectionsSuccess = function (collections) {
        $scope.collections = collections;
    };

    $scope.gotoCollection = function (collection) {
        service.gotoCollection(collection);
    };

    $scope.init = function () {    
        $scope.getCollections();
    };

    $scope.init();
}]);