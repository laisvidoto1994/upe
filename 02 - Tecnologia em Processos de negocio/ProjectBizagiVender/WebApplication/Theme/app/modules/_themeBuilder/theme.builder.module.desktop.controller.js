/**
 * _themeBuilder Controller
 * @author: Ramiro Gómez | ramiro.gomez@bizagi.com
 */

angular
    .module('_themeBuilder')
    .controller('ThemeBuilderDesktop', function($scope,$rootScope,$state,$timeout, themeBuilderServices, APP) {
        console.info('ThemeBuilderController Initialized!');

        $(".colorpicker").remove();
        $rootScope.counter = 0;

        $rootScope.isIframeLoaded = $scope.iframeAlreadyLoaded();

        themeBuilderServices.$loadVariables('desktop').then(function(data){
            $rootScope.$emit('updateSelectors', data);

            themeBuilderServices.$loadRules('desktop').then(function (data) {
                $rootScope.$emit('updateCSSBase', data);
            }, function (errorData) {
                console.error(errorData)
            });

        }, function(errorData){
            console.error(errorData)
        });

    });