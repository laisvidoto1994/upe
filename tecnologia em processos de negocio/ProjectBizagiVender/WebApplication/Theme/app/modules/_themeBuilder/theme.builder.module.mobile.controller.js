/**
 * _themeBuilder Controller
 * @author: Ramiro G�mez | ramiro.gomez@bizagi.com
 */

angular
    .module('_themeBuilder')
    .controller('ThemeBuilderMobile', function ($scope, $rootScope, $state, $timeout, $interval, $window, themeBuilderServices, APP) {
        console.info('ThemeBuilderControllerMobile Initialized!');

        $scope.loginPage = "";
        $(".colorpicker").remove();
        $rootScope.counter = 0;


        $rootScope.isIframeLoaded = $scope.iframeAlreadyLoaded();

        themeBuilderServices.$loadVariables('mobile').then(function(data){
            $rootScope.$emit('updateSelectors', data);

            themeBuilderServices.$loadRules('mobile').then(function (data) {
                $rootScope.$emit('updateCSSBase', data);
            }, function (errorData) {
                console.error(errorData)
            });

        }, function(errorData){
            console.error(errorData)
        });


        themeBuilderServices.$loadRules('mobile.login').then(function (data) {
            $scope.$emit('createLoginCSS', data);
        }, function (errorData) {
            console.error(errorData)
        });

        $scope.changeIframeView = function (iframeToShow, iframeToHide) {

            $(iframeToShow).removeClass("animateHideIframe");
            $(iframeToShow).addClass("animateShowIframe");

            $(iframeToHide).removeClass("animateShowIframe");
            $(iframeToHide).addClass("animateHideIframe");

            $scope.workportalLoaded();
        };


        $scope.splashButtonClicked = function () {
            $(".splash-screen-container").css({ 'z-index': '100', 'display': 'block' });
            $('#overlayArea').fadeIn(300);
            var documentHeight = $(document).height();
            $("#overlayArea").css("height", documentHeight + "px");
        };

        $scope.createLoginCSS = function (event, data) {
            $rootScope.loginCss = data;
        };

        $scope.renderLoginLess = function (e,params) {

            var varLessLogin = params.varLess + $rootScope.loginCss;
            $scope.countDownLoginInterval = null;
            $scope.loginCountDown = 1000;

            less.render(varLessLogin, params.lessOptions)
                .then(
                function (output) {
                    $scope.themeLogin = output.css;
                    $scope.applyChangesOnLoginIframe();
                    $scope.$apply();
                    localStorage.setItem("themeLogin", output.css);
                },
                function (error) {
                    console.log(error);
                });

        };

        $scope.applyChangesOnLoginIframe = function () {
            var $content = $("#mobileLogin").contents();

            if ($content.length && $content.find(".contentForm ").length > 0) {
                if ($content.find("body style").length > 0) {
                    $content.find("body style").remove();
                }

                $content.find("body").append("<style>" + $scope.themeLogin + "</style>");
                $content.find("#bz-form-login-logo").css("background", "transparent");

                if ($scope.imagePath) {
                    $content.find("#bz-form-login-logo").attr("src", $scope.imagePath);
                }


                $interval.cancel($scope.countDownLoginInterval);

            } else if (!$scope.countDownLoginInterval) {
                $scope.startLoginCountdown();
            }

        };

        var checkLoginIframeContent = function () {
            if ($scope.loginCountDown == 0) {
                $interval.cancel($scope.countDownLoginInterval);
            } else {
                $scope.applyChangesOnLoginIframe();
            }
            $scope.loginCountDown -= 1;
        };

        $scope.startLoginCountdown = function () {
            $scope.countDownLoginInterval = $interval(checkLoginIframeContent, 100, $scope.loginCountDown);
        };

        $scope.workportalLoaded = function(){

            var iframeContainerHeight = $($(".iframesContainer")[0]).css("height");
            var scaleFactor = 1;
            iframeContainerHeight = Number(iframeContainerHeight.substring(0,iframeContainerHeight.length-2));

            if(iframeContainerHeight > 850 && iframeContainerHeight <= 1000){
                scaleFactor = 0.9;
            }else if(iframeContainerHeight > 650 && iframeContainerHeight <= 850){
                scaleFactor = 0.8;
            }else if(iframeContainerHeight > 450 && iframeContainerHeight <= 650){
                scaleFactor = 0.7;
            }else if(iframeContainerHeight > 250 && iframeContainerHeight <= 450){
                scaleFactor = 0.6;
            }else if(iframeContainerHeight < 250 ){
                scaleFactor = 0.5;
            }

            $(".iframe-smartphone-container").css("transform","scale("+scaleFactor+")");
            $(".iframe-smartphone-portrait").css("transform","scale("+scaleFactor+")");

            $(".iframe-tablet-container").css("transform","scale("+scaleFactor+")");
            $(".iframe-tablet-portrait").css("transform","scale("+scaleFactor+")");
        };

        $scope.$on('createLoginCSS', $scope.createLoginCSS);
        $scope.$on('renderLoginLess', $scope.renderLoginLess);
    });