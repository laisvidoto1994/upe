describe("Testing Theme Builder", function () {
    //'use strict';

    beforeEach(module('_themeBuilder'));
    var $controller;
    var $scope, $rootScope, controller,$interval;
    var $intervalSpy = jasmine.createSpy('$interval', $interval);

    // PhantomJS doesn't support bind yet


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

    var defaultSelectorsLess = [
        {
            id: "onecolor",
            items: [
                {
                    key: "@one-color-palette",
                    name: "Base Color",
                    value: "#ba1414"
                }
            ],
            name: "ADVANCED THEMES"
        }
    ];

    beforeEach(inject(function(_$controller_, $rootScope, $state, $timeout, $window, themeBuilderServices, themeBuilderImageColorService, APP){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $controller = _$controller_;
        $interval = $intervalSpy;
        $scope = $rootScope.$new();

        controller = $controller('ThemeBuilderController', {
            $scope: $scope,
            $rootScope: $rootScope,
            $state:$state,
            $timeout:$timeout,
            $interval:$interval,
            $window:$window,
            themeBuilderServices:themeBuilderServices,
            themeBuilderImageColorService:themeBuilderImageColorService,
            APP:APP
        });

        /*less = {
            render : function(varLessWorkportal,lessOptions){
                return "hola";
            }
        };

        spyOn(less, 'render');

        less.render("param","param2");*/
    }));

    // createCSSBase

    it('Test createCSSBase', function (done) {

        $scope.createCSSBase(".testClass{color:red;}");
        expect($scope.defaultCssBase).toEqual(".testClass{color:red;}");

        done();
    });


    // updateCSSBase

    it('Test updateCSSBase without existing defaultCssBase', function (done) {


        $scope.updateCSSBase(null,".updateClass{background:black;}");
        expect($scope.cssBase).toEqual(".updateClass{background:black;}");
        expect($scope.deviceChanged).toEqual(undefined);


        done();
    });

    it('Test updateCSSBase with existing defaultCssBase', function (done) {

        $scope.defaultCssBase = ".testClass{color:red;}";
        $scope.updateCSSBase(null,".updateClass{background:black;}");
        expect($scope.cssBase).toEqual(".testClass{color:red;}.updateClass{background:black;}");
        expect($scope.deviceChanged).toEqual(undefined);

        done();
    });

    it('Test updateCSSBase with $scope.deviceSelectors["MobileBase"] and $scope.showDevice = "Smartphone"', function (done) {

        $scope.deviceSelectors["MobileBase"] = ".testClass{color:blue;}";
        $scope.showDevice = "Smartphone";
        $scope.updateCSSBase(null,".updateClass{background:black;}");
        expect($scope.cssBase).toEqual(".testClass{color:blue;}");
        expect($scope.deviceChanged).toEqual(undefined);

        done();
    });

    it('Test updateCSSBase with $scope.deviceSelectors["MobileBase"] and $scope.showDevice = "Tablet"', function (done) {

        $scope.deviceSelectors["MobileBase"] = ".testClass{color:blue;}";
        $scope.showDevice = "Tablet";
        $scope.updateCSSBase(null,".updateClass{background:black;}");
        expect($scope.cssBase).toEqual(".testClass{color:blue;}");
        expect($scope.deviceChanged).toEqual(undefined);

        done();
    });

    it('Test updateCSSBase with $scope.deviceSelectors["DesktopBase"] and $scope.showDevice = "Desktop"', function (done) {

        $scope.deviceSelectors["DesktopBase"] = ".testClass{color:blue;}";
        $scope.showDevice = "Desktop";
        $scope.updateCSSBase(null,".updateClass{background:black;}");
        expect($scope.cssBase).toEqual(".testClass{color:blue;}");
        expect($scope.deviceChanged).toEqual(undefined);

        done();
    });

    it('Test updateCSSBase with $scope.deviceSelectors["DesktopBase"] and $scope.showDevice = "Desktop" and $scope.firstLoad != null', function (done) {

        $scope.deviceSelectors["DesktopBase"] = ".testClass{color:blue;}";
        $scope.showDevice = "Desktop";
        $scope.firstLoad = false;
        var data = {};
        data.less = scopeSselectorsLess;
        var dataCopy = angular.copy(data);
        $scope.oneColorPalette = {};
        $scope.oneColorPalette.r = 255;
        $scope.oneColorPalette.g = 255;
        $scope.oneColorPalette.b = 255;

        $scope.selectors = dataCopy;
        $scope.cssBase =".testClass{color:@mobile-login-background;}";


        $scope.updateCSSBase(null,".updateClass{background:black;}");
        expect($scope.cssBase).toEqual(".testClass{color:blue;}");
        expect($scope.deviceChanged).toEqual(false);

        done();
    });

    it('Test updateCSSBase with $scope.deviceSelectors["MobileBase","Mobile"] and $scope.showDevice = "Smartphone" and $scope.firstLoad != null', function (done) {

        $scope.deviceSelectors["MobileBase"] = ".testClass{color:blue;}";
        $scope.showDevice = "Smartphone";
        $scope.firstLoad = false;
        var data = {};
        data.less = scopeSselectorsLess;
        var dataCopy = angular.copy(data);
        $scope.oneColorPalette = {};
        $scope.oneColorPalette.r = 255;
        $scope.oneColorPalette.g = 255;
        $scope.oneColorPalette.b = 255;

        $scope.selectors = dataCopy;
        $scope.defaultSelectorsLess = angular.copy(defaultSelectorsLess);
        $scope.cssBase =".testClass{color:@mobile-login-background;}";
        var deviceSelectorDesktop = jQuery.extend(true, [], $scope.selectors.less.slice(3,$scope.selectors.less.length));
        $scope.deviceSelectors["Mobile"] = angular.copy(deviceSelectorDesktop);


        $scope.updateCSSBase(null,".updateClass{background:black;}");
        expect($scope.cssBase).toEqual(".testClass{color:blue;}");
        expect($scope.selectors.less).toEqual($scope.defaultSelectorsLess);
        expect($scope.deviceChanged).toEqual(false);


        done();
    });

    it('Test updateCSSBase with $scope.deviceSelectors["DesktopBase"] and $scope.showDevice = "Desktop" and $scope.firstLoad != null', function (done) {

        $scope.deviceSelectors["DesktopBase"] = ".testClass{color:blue;}";
        $scope.showDevice = "Desktop";
        $scope.firstLoad = false;
        var data = {};
        data.less = scopeSselectorsLess;
        var dataCopy = angular.copy(data);
        $scope.oneColorPalette = {};
        $scope.oneColorPalette.r = 255;
        $scope.oneColorPalette.g = 255;
        $scope.oneColorPalette.b = 255;

        $scope.selectors = dataCopy;
        $scope.defaultSelectorsLess = angular.copy(defaultSelectorsLess);
        $scope.cssBase =".testClass{color:@mobile-login-background;}";
        var deviceSelectorDesktop = jQuery.extend(true, [], $scope.selectors.less.slice(3,$scope.selectors.less.length));
        $scope.deviceSelectors["Desktop"] = angular.copy(deviceSelectorDesktop);


        $scope.updateCSSBase(null,".updateClass{background:black;}");
        expect($scope.cssBase).toEqual(".testClass{color:blue;}");
        expect($scope.selectors.less).toEqual($scope.defaultSelectorsLess);
        expect($scope.deviceChanged).toEqual(false);


        done();
    });



    // createSelectors

    it('Test createSelectors with add = false ', function (done) {

        var data = {};
        data.less = scopeSselectorsLess;

        $scope.createSelectors(data,false);

        expect($scope.defaultSelectors).toEqual(data);
        expect($scope.selectors).toEqual(data);

        done();
    });

    it('Test createSelectors with add = false and $scope.defaultSelectorsLess != ""', function (done) {

        var data = {};
        data.less = scopeSselectorsLess;
        var dataCopy = angular.copy(data);

        $scope.defaultSelectorsLess = defaultSelectorsLess;
        $scope.createSelectors(data,false);

        expect($scope.defaultSelectors).toEqual(dataCopy);
        expect($scope.selectors.less).toEqual($scope.defaultSelectorsLess.concat(dataCopy.less));

        done();
    });

    it('Test createSelectors with add = true and $scope.defaultSelectorsLess != ""', function (done) {

        var data = {};
        data.less = scopeSselectorsLess;
        var dataCopy = angular.copy(data);

        $scope.selectors = {};
        $scope.defaultSelectorsLess = defaultSelectorsLess;
        $scope.createSelectors(data,true);

        expect($scope.selectors.less).toEqual($scope.defaultSelectorsLess.concat(dataCopy.less));

        done();
    });

    it('Test createSelectors with add = true and $scope.selectors != ""', function (done) {

        var data = {};
        data.less = scopeSselectorsLess;
        var dataCopy = angular.copy(data);

        $scope.selectors = [];
        $scope.defaultSelectors = dataCopy;

        $scope.createSelectors(data,true);

        expect($scope.selectors.less).toEqual($scope.defaultSelectors.less.concat(data.less));

        done();
    });


    //addSelectors


    it('Test addSelectors with add = true and $scope.defaultSelectorsLess != ""', function (done) {

        var data = {};
        data.less = scopeSselectorsLess;
        var dataCopy = angular.copy(data);

        $scope.selectors = {};
        $scope.defaultSelectorsLess = defaultSelectorsLess;
        $scope.addSelectors(null,data);

        expect($scope.selectors.less).toEqual($scope.defaultSelectorsLess.concat(dataCopy.less));

        done();
    });

    it('Test addSelectors with add = true and $scope.selectors != ""', function (done) {

        var data = {};
        data.less = scopeSselectorsLess;
        var dataCopy = angular.copy(data);

        $scope.selectors = [];
        $scope.defaultSelectors = dataCopy;

        $scope.addSelectors(null,data);

        expect($scope.selectors.less).toEqual($scope.defaultSelectors.less.concat(data.less));

        done();
    });



    // createLess
    it('Test createLess', function (done) {


        var data = {};
        data.less = scopeSselectorsLess;
        var dataCopy = angular.copy(data);

        $scope.selectors = dataCopy;
        $scope.cssBase =".testClass{color:@mobile-login-background;}";

        $.when($scope.createLess(null, data)).done(function () {

            setTimeout(function () {
                expect($scope.theme).toEqual(".testClass {\n  color: #dbe8e8;\n}\n");
                done();
            }, 1000);

        });


    });

   /* it('Test createLess', function (done) {


        var data = {};
        data.less = scopeSselectorsLess;
        var dataCopy = angular.copy(data);

        $scope.selectors = dataCopy;
        $scope.cssBase =".testClass{color:@mobile-login-background;}";

        $.when($scope.createLess(null, data)).done(function () {

            setTimeout(function () {
                expect($scope.theme).toEqual(".testClass {\n  color: #dbe8e8;\n}\n");
                done();
            }, 1000);

        });


    });*/

    // extractVariables
    it('Test extractVariables', function (done) {

        var data = {};
        data.less = scopeSselectorsLess;

        $scope.selectors = data;
        var result = $scope.extractVariables();

        expect(result).toEqual("@mobile-login-background:#dbe8e8;@one-color-palette:#546A75;@header:#FFF;@content-border:#9ec2c1;");
        done();

    });

});