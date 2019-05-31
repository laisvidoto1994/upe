describe("Testing Theme Builder", function () {
    //'use strict';

    beforeEach(module('_themeBuilder'));
    var $controller;
    var $scope, $rootScope, controller,$interval,themeBuilderImageColorService;
    var $intervalSpy = jasmine.createSpy('$interval', $interval);
    var scopeSselectorsLess = [
        {
            name : "Variables"
        },
        {
            items: [
                {
                    key: "@mobile-login-background",
                    lessFunction: "@one-color-palette",
                    lessFunctionParam: {
                        type: 'equals'
                    },
                    name: "Background",
                    value: "#dbe8e8"
                }
            ]
        },
        {
            "name": "ADVANCED THEMES",
            "id": "onecolor",
            "items": [
                {
                    "name": "Base Color",
                    "key": "@one-color-palette",
                    "value": "#546A75"
                }
            ]
        }, {
            "name": "COMMON ELEMENTS",
            "id": "commonElements",
            "items": [
                {
                    "name": "Header",
                    "key": "@header",
                    "lessFunction": "@one-color-palette",
                    "lessFunctionParam": {
                        "type": "equals"
                    },
                    "value": "#FFF"
                }
            ]
        }, {
            "name": "Content",
            "items": [
                {
                    "name": "Border",
                    "lessFunction": "mix(@one-color-palette, lighten(@one-color-palette, 100%), 40%)",
                    "key": "@content-border",
                    "value": "#9ec2c1"
                }
            ]
        }
    ];

    beforeEach(inject(function($q,_$controller_, $rootScope, $state, $timeout, $window, themeBuilderServices, _themeBuilderImageColorService_, APP){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $interval = $intervalSpy;
        $scope = $rootScope.$new();
        themeBuilderImageColorService = _themeBuilderImageColorService_;

        //Spy iframeAlreadyLoaded method
        $scope.iframeAlreadyLoaded = jasmine.createSpy("iframeAlreadyLoaded() spy").and.returnValue(true);
        $scope.iframeAlreadyLoaded();

        themeBuilderServices.$loadVariables = jasmine.createSpy(".$loadVariables() spy").and.callFake(function(device) {

            var deferred = $q.defer();
            var promise = deferred.promise;
            var data = {};
            data.less = scopeSselectorsLess;
            deferred.resolve(data);

            return promise;

        });

        themeBuilderServices.$loadVariables();

        controller = $controller('ThemeBuilderMobile', {
            $scope: $scope,
            $rootScope: $rootScope,
            $state:$state,
            $timeout:$timeout,
            $interval:$interval,
            $window:$window,
            themeBuilderServices:themeBuilderServices,
            themeBuilderImageColorService:_themeBuilderImageColorService_,
            APP:APP
        });




    }));

    // changeIframeView

    it('Test changeIframeView', function (done) {
        var elementHasClass = false;

        $("body").append("<div class='iframesContainer'></div>");
        $("body").append("<div id='mobileLogin'></div>");
        $("body").append("<div class='themeIframe'></div>");

        $scope.changeIframeView("#mobileLogin",".themeIframe");

        elementHasClass = $("#mobileLogin").hasClass("animateShowIframe");
        expect(elementHasClass).toEqual(true);

        elementHasClass = $("#mobileLogin").hasClass("animateHideIframe");
        expect(elementHasClass).toEqual(false);

        elementHasClass = $(".themeIframe").hasClass("animateShowIframe");
        expect(elementHasClass).toEqual(false);

        elementHasClass = $(".themeIframe").hasClass("animateHideIframe");
        expect(elementHasClass).toEqual(true);


        done();
    });


    // splashButtonClicked

    it('Test splashButtonClicked ', function (done) {
        var elementClass = false;

        $("body").append("<div class='splash-screen-container' style='display:none; z-index:1;'></div>");
        $("body").append("<div id='overlayArea'></div>");


        $scope.splashButtonClicked ();

        elementClass = $("#overlayArea").css("height");
        expect(elementClass).toMatch(/px/);

        elementClass = $(".splash-screen-container").css("display");
        expect(elementClass).toEqual("block");


        done();
    });


    // splashButtonClicked

    it('Test $selectColorFromPalette ', function (done) {

        debugger
        var param = [255,255,255];
        var disableCopyFunction = false;
        var selectedCopyColor = "@one-color-palette"
        themeBuilderImageColorService.$selectColorFromPalette(param,disableCopyFunction,selectedCopyColor,scopeSselectorsLess);

        done();
    });


   /* beforeEach(module('ui.splashScreens'));
    var $controller;
    var $scope, controller;


    beforeEach(inject(function(_$controller_,$rootScope){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $scope = {};

        controller = $controller('SplashScreensController', {
            $scope: $scope,
            $rootScope: $rootScope
        });
    }));

    it('Test Splash', function (done) {

        $scope.testingFunction(3);
        expect($scope.testResult).toEqual(6);

        done();
    });*/
});