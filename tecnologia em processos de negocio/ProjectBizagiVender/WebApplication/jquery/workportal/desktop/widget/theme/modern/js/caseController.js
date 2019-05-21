angular.module('homeModule').controller('caseController', ['$scope', 'bizagi.services.case', function ($scope, service) {
    $scope.openedCases = [];
    $scope.closedCases = [];
    $scope.openedCasesState = "";
    $scope.closedCasesState = "";

    $scope.getOpenedCases = function () {
        $scope.openedCasesState = "loading";
        service.getOpenedCases().then($scope.getOpenedCasesSuccess);
    };

    $scope.getOpenedCasesSuccess = function (cases) {
        $scope.openedCasesState = "loaded";
        $scope.openedCases = cases.entities;

        service.getCasesHtml(cases).then(function (elements) {
            $scope.setTemplate($scope.openedCases, elements);
        });
    };

    $scope.getClosedCases = function () {
        $scope.closedCasesState = "loading";
        service.getClosedCases().then($scope.getClosedCasesSuccess);
    };

    $scope.getClosedCasesSuccess = function (cases) {
        $scope.closedCasesState = "loaded";
        $scope.closedCases = cases.entities;

        service.getCasesHtml(cases).then(function (elements) {
            $scope.setTemplate($scope.closedCases, elements);
        });
    };

    $scope.setTemplate = function (cases, elements) {
        for (var i = 0; i < elements.length; i++) {
            cases[i].html = elements[i].html;
        }

        $scope.$apply();
    };

    $scope.gotoCase = function (currentCase) {
        service.gotoCase(currentCase);
    };

    $scope.init = function () {
        $scope.getClosedCases();
        $scope.getOpenedCases();
    };

    $scope.init();
}]);