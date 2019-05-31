angular.module('_themeBuilder')
    .config(function ($stateProvider, $urlRouterProvider, APP) {



        $urlRouterProvider.when('','/themeBuilder');
        $urlRouterProvider.when('/','/themeBuilder');

        /**
         * Routing Application
         * StateProvider States
         * FIX[18/062015]: add Resolve in each state to validate taht services.json is loaded
         */
        $stateProvider
            .state('themeBuilder', {
                url: '/themeBuilder',
                templateUrl: APP.TEMPLATES.INIT,
                options:[{expanded:true}]
            }).state('themeBuilder.desktop', {
                url: '/desktop',
                templateUrl: APP.TEMPLATES.DESKTOP,
                controller: 'ThemeBuilderDesktop',
                options: [{ expanded: false, device: 'desktop', showDevice: 'Desktop' }]
            }).state('themeBuilder.smartphone', {
                url: '/smartphone',
                templateUrl: APP.TEMPLATES.MOBILE,
                controller: 'ThemeBuilderMobile',
                options:[{expanded:false,device:'mobile',showDevice:'Smartphone',pathDevice:'./app/modules/jquery/workportalflat/testsuite/smartphone/html/index.html'}]
            }).state('themeBuilder.tablet', {
                url: '/tablet',
                templateUrl: APP.TEMPLATES.MOBILE,
                controller: 'ThemeBuilderMobile',
                options:[{expanded:false,device:'mobile',showDevice:'Tablet',pathDevice:'./app/modules/jquery/workportalflat/testsuite/tablet/html/index.html'}]
            })
            .state('themeBuilder.error', {
                url: '/error',
                templateUrl: APP.TEMPLATES.ERROR,
                options:[{expanded:false}]
            });

        
    }).run(
    function ($rootScope, $state, APP, $timeout) {

        $rootScope.$off = function (name) {
            $rootScope.$$listeners[name] = [];
            return $rootScope;
        };

        $rootScope.$offAll = function () {
            $rootScope.$$listeners = {};
            return $rootScope;
        };

        /*$rootScope.$offAll();*/
        /**
         * Listener for $stateChangeStart
         * @param event
         * @param toState
         * @param toParams
         * @param fromState
         */
        $rootScope.$on('$stateChangeStart', function (event, toState) {

            if(toState && toState.hasOwnProperty('options')){
                $rootScope.$emit('stateOptions', toState.options);
            }
        });

    });



/**
 * Method to validate if services.json is loaded correctly.
 * @param $q
 * @param $rootScope
 * @param $http
 * @param APP
 * @returns {*}
 */
var checkRouting = function ($q, $rootScope, $http, $data, APP) {

    if($data.$login()){
        return false;
    }else{
        //location.href = 'http://www.bizagi.com';
    }


    if (_.keys(APP.APPLICATION_MODULE.API.PATH).length > 1) {
        return true;
    } else {
        var deferred = $q.defer();
        $http.get('services.json')
            .success(function (dataDiscovery) {
                angular.extend(APP.APPLICATION_MODULE.API.PATH, dataDiscovery);
                deferred.resolve(true);
            })
            .error(function () {
                deferred.reject();
            });
        return deferred.promise;
    }
};
