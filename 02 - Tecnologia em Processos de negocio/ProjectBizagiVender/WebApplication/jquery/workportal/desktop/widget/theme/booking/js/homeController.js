angular.module('homeModule').controller('homeController', ['$scope', 'bizagi.services', function ($scope, services) {
    $scope.user = {};
    $scope.collections = [];
    $scope.bookings = [];
    $scope.recentSearches = [];
    $scope.reviews = [];
    $scope.searchResults = [];
    $scope.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    $scope.bookingsId = "8fd48a07-e74d-442d-8881-86108ef2d670";
    $scope.recentSearchesId = "af5edca9-11af-4ad2-b5b4-7371c9d53cf8";
    $scope.reviewsId = "aebedeab-1708-4b3e-876f-393e396bb2aa";

    $scope.currentView = "home";
    $scope.currentMenu = "dashboard";
    $scope.searchForm = {};

    $scope.getUser = function () {
        services.user.getUser().then($scope.getUserSuccess);
    };

    $scope.getUserSuccess = function (user) {
        $scope.user = user;
    };

    $scope.getCollections = function () {
        services.collection.getCollections().then($scope.getCollectionsSuccess);
    };

    $scope.getCollectionsSuccess = function (collections) {
        $scope.collections = collections;

        for (var i = 0, length = $scope.collections.length; i < length; i++) {
            if ($scope.collections[i].reference === $scope.bookingsId) {
                $scope.bookings = $scope.collections[i];
            }
            else if ($scope.collections[i].reference === $scope.recentSearchesId) {
                $scope.recentSearches = $scope.collections[i];
            }
            else if ($scope.collections[i].reference === $scope.reviewsId) {
                $scope.reviews = $scope.collections[i];
            }
        }

        $scope.getRecentSearches();
        $scope.getReviews();
    };

    $scope.getSearch = function () {
        $scope.searchForm = services.search.getSearchForm();
    };

    $scope.getBookings = function () {
        $scope.getInstances($scope.bookings, $scope.bookingTransform);
    };

    $scope.getRecentSearches = function () {
        $scope.getInstances($scope.recentSearches, $scope.recentSearchesTransform);
    };

    $scope.getReviews = function () {
        $scope.getInstances($scope.reviews);
    };

    $scope.recentSearchesTransform = function () {
        for (var i = 0, length = $scope.recentSearches.entities.length; i < length; i++) {
            $scope.recentSearches.entities[i].data.CheckinDate = new Date(Date.parse($scope.recentSearches.entities[i].data.Checkin, 'm-d-y g:i a'));
            $scope.recentSearches.entities[i].data.CheckoutDate = new Date(Date.parse($scope.recentSearches.entities[i].data.Checkout, 'm-d-y g:i a'));
        }
    };

    $scope.bookingTransform = function () {
        for (var i = 0, length = $scope.bookings.entities.length; i < length; i++) {
            $scope.bookings.entities[i].data.CheckinDate = new Date(Date.parse($scope.bookings.entities[i].data.Checkin, 'm-d-y g:i a'));
            $scope.bookings.entities[i].data.CheckoutDate = new Date(Date.parse($scope.bookings.entities[i].data.Checkout, 'm-d-y g:i a'));
        }
    };

    $scope.getInstances = function (collection, success) {
        collection.entities = [];
        collection.state = "loading";
        services.collection.getCollectionInstances(collection).then(function (response) {
            $scope.getInstancesSuccess(response);

            if (success) {
                success();
            }
        }).catch($scope.getInstancesError);
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
    };

    $scope.gotoCollection = function (collection) {
        services.collection.gotoCollection(collection);
    };

    $scope.gotoSearchResults = function () {
        $scope.currentView = "search";

        services.search.searchData($scope.searchForm).then($scope.searchDataSuccess);
    };

    $scope.searchDataSuccess = function (data) {
        $scope.searchResults = data;
    };

    $scope.setSearch = function (search) {
        $scope.searchForm.filters[0].value = search.data['City.Name'];
        $scope.gotoSearchResults();
    };

    $scope.getSettings = function () {
        services.user.openPreferences();
    };

    $scope.bookHere = function (hotel) {
        services.action.executeAction(hotel);
    };

    $scope.init = function () {
        $scope.getUser();
        $scope.getCollections();
        $scope.getSearch();
    };

    $scope.init();
}]);