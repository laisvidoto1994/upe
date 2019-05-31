angular.module('bizagi.services.module').factory('bizagi.services.search', function ($q) {
    var service = new bizagi.workportal.services.service();
    var notifier = bizagi.injector.get('notifier');
    var processAction = bizagi.injector.get('processActionService');
    var actionService = bizagi.injector.get('actionService');
    var globalHandlersService = bizagi.injector.get('globalHandlersService');
    var widgetManager = bizagi.injector.get('widgetManager');


    var _gotoSearchResults = function (params) {

        var currentFilters = [];
        var currentMetadataFilters = [];
        for (var i = 0, length = params.filters.length; i < length; i++) {
            if (params.filters[i].value) {
                currentFilters.push(params.filters[i]);

                params.metadataFilters[i].value = params.filters[i].value;
                currentMetadataFilters.push(params.metadataFilters[i]);
            }
        }

        params.filters = currentFilters;
        params.metadataFilters = currentMetadataFilters;

        widgetManager._context = "home";
        bizagi.injector.get('homeportal').onNotifyChange({}, {
            "type": "SEARCH-ENGINE-VIEW",
            "args": params
        });
    };

    var _searchData = function (params) {
        var deferred = $q.defer();

        var currentParams = _formatFilters(angular.copy(params));
        service.getSearchData(currentParams).done(function (data) {
            deferred.resolve(data);
        });

        return deferred.promise;
    };

    var _formatFilters = function (params) {
        var currentFilters = [];
        var currentMetadataFilters = [];
        for (var i = 0, length = params.filters.length; i < length; i++) {
            if (params.filters[i].value) {
                currentFilters.push(params.filters[i]);

                params.metadataFilters[i].value = params.filters[i].value;
                currentMetadataFilters.push(params.metadataFilters[i]);
            }
        }

        params.filters = currentFilters;
        params.metadataFilters = currentMetadataFilters;

        return params;
    };

    var _getSearchForm = function () {

        var form = {
            "guidSearch": "53a5464f-6a68-4783-b7d1-d61f181c92a9",
            "guidForm": "59599c82-0068-4c07-ad9c-fcd35e9c28c6",
            "guidEntity": "576f4205-9290-4546-a05a-45c5b75cf292",
            "displayname": "Find the Best Deals",
            "metadataFilters": [{
                "xpath": "Name",
                "searchType": "approx",
                "value": "",
                "id": "c5562a43-2c01-4a77-bd5c-c1dc714780fd",
                "displayValue": "",
                "displayName": "Hotel Name"
            }, {
                "xpath": "AvailableStartDate",
                "searchType": "exact",
                "value": "",
                "id": "5858e05e-eaec-425e-ae85-0f432826aa9b",
                "rangeQuery": "none",
                "displayValue": "",
                "displayName": "Check-in"
            }, {
                "xpath": "AvailableEndDate",
                "searchType": "exact",
                "value": "",
                "id": "0f46c826-bdbd-4e4f-afa0-75723b64714c",
                "rangeQuery": "none",
                "displayValue": "",
                "displayName": "Check-out"
            }],
            "filters": [{
                "xpath": "Name",
                "searchType": "approx",
                "value": ""
            }, {
                "xpath": "AvailableStartDate",
                "searchType": "exact",
                "value": ""
            }, {
                "xpath": "AvailableEndDate",
                "searchType": "exact",
                "value": ""
            }],
            "page": 1,
            "pageSize": 20,
            "calculateFilters": true,
            "histName": "Find the Best Deals"
        }

        return form;
    };

    return {       
        getSearchForm: _getSearchForm,
        gotoSearchResults: _gotoSearchResults,
        searchData: _searchData
    };
});