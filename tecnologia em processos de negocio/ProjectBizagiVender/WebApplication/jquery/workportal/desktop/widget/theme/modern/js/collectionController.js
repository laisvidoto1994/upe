angular.module('homeModule').controller('collectionController', ['$scope', 'bizagi.services.collection', function ($scope, service) {
    $scope.collections = [];
    
    $scope.getCollections = function () {
        service.getCollections().then($scope.getCollectionsSuccess);
    };

    $scope.getCollectionsSuccess = function (collections) {
        $scope.collections = collections;
        $scope.getInstances();
    };

    $scope.getInstances = function () {
        for (var i = 0; i < $scope.collections.length; i++) {
            $scope.collections[i].entities = [];
            $scope.collections[i].state = "loading";
            service.getCollectionInstances($scope.collections[i]).then($scope.getInstancesSuccess).catch($scope.getInstancesError);
        }
    };

    $scope.getInstancesError = function (response) {
        var ref = response.reference;
        ref.state = "loaded";
    };

    $scope.getInstancesSuccess = function (response) {
        var instances = response.instances,
            ref = response.reference;
        ref = angular.extend(ref, instances);
        ref.state = "loaded";

        service.getEntityHtml(ref, "list").then(function (elements) {
            $scope.setTemplate(ref.entities, elements);            
        });
    };

    $scope.setTemplate = function (entities, elements) {
        for (var i = 0; i < elements.length; i++) {
            entities[i].html = elements[i].html;
        }

        $scope.$apply();
    };

    $scope.init = function () {
        $scope.getCollections();
    }

    $scope.init();
}]);