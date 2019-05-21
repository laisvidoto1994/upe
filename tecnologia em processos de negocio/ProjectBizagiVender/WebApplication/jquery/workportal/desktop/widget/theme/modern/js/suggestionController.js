angular.module('homeModule').controller('suggestionController', ['$scope', 'bizagi.services.suggestion', function ($scope, service) {
    $scope.suggestions = [];
   
    $scope.getSuggestions = function () {
        service.getSuggestions().then($scope.getSuggestionsSuccess);
    };

    $scope.getSuggestionsSuccess = function (suggestions) {
        $scope.suggestions = suggestions;
    };

    $scope.gotoSuggestion = function (currentSuggestion) {
        service.gotoSuggestion(currentSuggestion);
    };

    $scope.init = function () {
        $scope.getSuggestions();
    };

    $scope.init();
}]);