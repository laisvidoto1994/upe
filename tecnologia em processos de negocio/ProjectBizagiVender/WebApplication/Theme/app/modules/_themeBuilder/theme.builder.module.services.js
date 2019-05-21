/**
 * _themeBuilder Services Definition
 * @author: Ramiro Gómez | ramiro.gomez@bizagi.com
 */

angular
    .module('_themeBuilder')
    .service('themeBuilderServices', function($q, $http){
        var self = this;

        self.$loadVariables = function(device){
            var deferred = $q.defer();
            var promise = deferred.promise;
            var deviceJson = (device)?'variables.'+device : 'variables';
            var urlJson = 'app/theme/json/'+deviceJson+'.json';

            $http.get(urlJson).
                then(function(response) {
                    deferred.resolve(response.data);
                }, function(response) {
                    deferred.reject(response);
                });

            return promise;
        };

        self.$loadRules = function(device){
            var deferred = $q.defer();
            var promise = deferred.promise;

            var deviceJson = (device)? device+'.rules' : 'all.rules';
            var urlLess = 'app/theme/less/'+deviceJson+'.less';

            $http.get(urlLess).
                then(function(response) {
                    deferred.resolve(response.data);
                }, function(response) {
                    deferred.reject(response);
                });

            return promise;
        };

        self.$loadMixins = function (device) {
            var deferred = $q.defer();
            var promise = deferred.promise;
                        
            var urlLess = 'app/theme/less/one.color.mixins.less';

            $http.get(urlLess).
                then(function (response) {
                    deferred.resolve(response.data);
                }, function (response) {
                    deferred.reject(response);
                });

            return promise;
        };
    });