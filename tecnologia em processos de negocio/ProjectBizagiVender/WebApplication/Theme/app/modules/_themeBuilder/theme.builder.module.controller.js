/**
 * _themeBuilder Controller
 * @author: Ramiro G�mez | ramiro.gomez@bizagi.com
 */

angular
    .module('_themeBuilder')
    .controller('ThemeBuilderController', function ($scope, $rootScope, $state, $timeout, $interval, $window, themeBuilderServices, themeBuilderImageColorService, APP) {
        console.info('ThemeBuilderController Initialized!');

        $scope.init = function(){

            $scope.theme = '';
            $scope.themeLogin = '';
            $scope.expanded = true;
            $scope.selectors = [];
            $scope.deviceSelectors = { MobileBase:"", Mobile: "", DesktopBase:"",Desktop: ""};
            $scope.firstLoad = true;
            $scope.elementClicked = "";            
            $scope.mixins = "";
            $scope.oneColorPalette = "";
            $scope.calculatedColors = {};            
            $scope.clientImage = "";            
            $scope.selectedCopyColor = "";
            $scope.disableCopyFunction = false;
            $scope.defaultSelectorsLess = "";

            $scope.template = {
                bothSides:APP.TEMPLATES.SIDES.BOTH,
                mobileSide:APP.TEMPLATES.SIDES.MOBILE,
                desktopSide:APP.TEMPLATES.SIDES.DESKTOP
            };


            $scope.useTemplate = $scope.template.bothSides;

            
            themeBuilderServices.$loadVariables().then(function(data){
                $scope.createSelectors(data);
            }, function(errorData){
                console.error(errorData)
            });

            themeBuilderServices.$loadRules().then(function(data){
                $scope.createCSSBase(data);
            }, function(errorData){
                console.error(errorData)
            });

            themeBuilderServices.$loadMixins().then(function (data) {
                $scope.mixins =data;
            }, function (errorData) {
                console.error(errorData)
            });

            

           // $window.sessionStorage.removeItem("splashPath");
        };


        $scope.createCSSBase =function(data){
            $scope.defaultCssBase = data;
        };

        
        $scope.updateCSSBase = function (event, data) {

            if ($scope.deviceSelectors["MobileBase"] != "" && ($scope.showDevice == "Smartphone" || $scope.showDevice == "Tablet")) {
                $scope.cssBase = $scope.deviceSelectors["MobileBase"];
            } else if ($scope.deviceSelectors["DesktopBase"] != "" && $scope.showDevice == "Desktop") {
                $scope.cssBase = $scope.deviceSelectors["DesktopBase"];
            } else {
                if ($scope.defaultCssBase) {
                    $scope.cssBase = $scope.defaultCssBase + data;
                } else {
                    $scope.cssBase = data;
                }
            }

            if (!$scope.firstLoad) {


                if ($scope.deviceSelectors["Mobile"] != "" && ($scope.showDevice == "Smartphone" || $scope.showDevice == "Tablet")) {
                    $scope.selectors.less = $.merge($scope.defaultSelectorsLess, ($scope.deviceSelectors["Mobile"]));
                } else if ($scope.deviceSelectors["Desktop"] != "" && $scope.showDevice == "Desktop") {
                    $scope.selectors.less = $.merge($scope.defaultSelectorsLess, ($scope.deviceSelectors["Desktop"]));
                } else {
                    $scope.deviceChanged = true;
                }

                $scope.createLess();


                if ($scope.imagePath) {
                    $scope.loadLogoImage();
                }

                $scope.deviceChanged = false;
            }

        };

        $scope.createSelectors = function(data, add){            

            if (!add) {
                $scope.defaultSelectors = angular.copy(data);
                $scope.selectors = data;
            }

            if ($scope.defaultSelectorsLess != "") {
                $scope.selectors.less = $scope.defaultSelectorsLess.concat(data.less);
            }
            else if ($scope.selectors && add) {
                if(data.hasOwnProperty('less')) {
                    $scope.selectors.less = [];
                    $scope.selectors.less = $scope.defaultSelectors.less.concat(data.less);
                }
            }else {
                $scope.selectors.less = $scope.defaultSelectors.less;
            }            
            
        };

        $scope.addSelectors = function(event, data){
            $scope.createSelectors(data, true);
        };


        $scope.createLess = function(event, data){
            var elementClicked = data && data.el ? data.el : "";
            $scope.elementClickedKey = elementClicked != "" ? elementClicked.parentElement.getAttribute("data-key") : "";
                       
            if ($scope.elementClickedKey == "@one-color-palette") {
                $scope.oneColorPalette = data.rgb;              
            }

            $scope.createFinalLess();
        };

        $scope.createFinalLess = function (param) {
            var varLess = $scope.extractVariables();           
            var varLessWorkportal = varLess + $scope.cssBase;
        

            //keep safe the current color configuration when user changes between devices
            if($scope.showDevice == "Smartphone" || $scope.showDevice=="Tablet"){
                $scope.deviceSelectors["Mobile"] = jQuery.extend(true, [], $scope.selectors.less.slice(3,$scope.selectors.less.length));
                $scope.deviceSelectors["MobileBase"] = $scope.cssBase;
            } else {
                $scope.deviceSelectors["Desktop"] = jQuery.extend(true, [], $scope.selectors.less.slice(3, $scope.selectors.less.length));
                $scope.deviceSelectors["DesktopBase"] = $scope.cssBase;
            }

            $scope.defaultSelectorsLess = $scope.selectors.less.slice(0, 3);

            $scope.firstLoad = false;
            $scope.countDownInterval = null;            
            $scope.countDown = 10;            

            var lessOptions = {
                compress: false   // Minify CSS output
            };

            less.render(varLessWorkportal, lessOptions)                
                .then(
                function (output) {
                    $scope.theme = output.css;
                    $scope.applyChangesOnIframe();
                    $scope.applyColorsOnPalette();
                    $scope.$apply();
                },
                function (error) {
                    console.log(error);
                });

            $scope.$broadcast('renderLoginLess', { varLess: varLess, lessOptions: lessOptions });

        };
          
        $scope.extractVariables = function(){
            var lessVars = "";          

            for( var i= 0 ,l=$scope.selectors.less.length;i<l;i++){
                lessVars += $scope.extractItems($scope.selectors.less[i]);
            }
            
            return lessVars;
        };

        $scope.extractItems = function (selector) {
            var itemVar = '';
            if (selector.items) {
                for (var i = 0, l = selector.items.length; i < l; i++) {
                    if (selector.items[i].hasOwnProperty('items')) {
                        itemVar += $scope.extractItems(selector.items[i]);
                    } else {

                        if ($scope.defaultSelectorsLess != "" && selector.id == "commonElements" && $scope.elementClickedKey != "@one-color-palette") {
                            selector.items[i].value = $scope.defaultSelectorsLess[2].items[i].value;
                        }
                        else if (selector.items[i].lessFunction && selector.items[i].lessFunctionParam && ($scope.elementClickedKey == "@one-color-palette" || $scope.deviceChanged)) {
                            var newColor = $scope.getCalculatedLessStyle(selector.items[i].key, selector.items[i].lessFunction, selector.items[i].lessFunctionParam);
                            selector.items[i].value = newColor;
                            $("div[data-key='"+selector.items[i].key+"']").find("div").css("background",newColor);
                        }

                        itemVar += selector.items[i].key + ':' + selector.items[i].value + ';';
                    }
                }

            }

            return itemVar;
        };

        $scope.getCalculatedLessStyle = function (itemKey, lessFunction, lessFunctionParam) {

            var oneColor = less.functions.functionRegistry._data.rgba($scope.oneColorPalette.r, $scope.oneColorPalette.g, $scope.oneColorPalette.b, 1);
            var result = "";

            if (lessFunctionParam.type == "equals") {
                var result = oneColor;
            }
            else if (lessFunctionParam.type == "contrast") {
                var colorToApplyContrast = $scope.calculatedColors[lessFunctionParam.element];
                var luminance = less.functions.functionRegistry._data.luminance(colorToApplyContrast);

                if (luminance.value >= 60) {
                    result = less.functions.functionRegistry._data[lessFunctionParam.param1.lessFunc](colorToApplyContrast, lessFunctionParam.param1);
                } else {
                    result = less.functions.functionRegistry._data[lessFunctionParam.param2.lessFunc](colorToApplyContrast, lessFunctionParam.param2);
                }
                
            }
            else if (lessFunctionParam.type == "mix") {
                lessFunctionParam = less.functions.functionRegistry._data.rgba(lessFunctionParam.value.r, lessFunctionParam.value.g, lessFunctionParam.value.b, 1);
                result = less.functions.functionRegistry._data[lessFunction](oneColor, lessFunctionParam);
            }
            else if (lessFunctionParam.type == "int") {                
                result = less.functions.functionRegistry._data[lessFunction](oneColor, lessFunctionParam);
            }

            $scope.calculatedColors[itemKey] = result;
            return result.toRGB();
        };

        

        $scope.update = function(event, data){
            $scope.theme = '';
            for(var i= 0, l=data.length; i<l; i++) {
                angular.extend($scope, data[i]);
            }
        };


        $scope.$watch('theme', function(newValue, lastValue, scope){
            if(newValue !== lastValue){
                angular.element('#theme').append(newValue);
            }
        });


        $scope.applyChangesOnIframe = function () { 
            var $content = $(".themeIframe").contents();

            if ($content.length && $content.find("#homePortal").length > 0 || $content.find("#ui-bizagi-wp-application").length > 0) {
                            
                if ($content.find("body style").length > 0) {
                    $content.find("body style").remove();
                }

                $content.find("body").append("<style>" + $scope.theme + "</style>");

                var iframeTmp = $(".themeIframe").clone();

                if ($scope.showDevice == "Smartphone" && $(".smartphoneTmp").length == 0) {
                    $scope.appendIframeCopy(iframeTmp,"smartphoneTmp");
                } else if ($scope.showDevice == "Tablet" && $(".tabletTmp").length == 0) {                    
                    $scope.appendIframeCopy(iframeTmp,"tabletTmp");
                } else if ($scope.showDevice == "Desktop" &&  $(".desktopTmp").length == 0){                    
                    $scope.appendIframeCopy(iframeTmp,"desktopTmp");
                }                
                

                $interval.cancel($scope.countDownInterval);                  
                

            } else if (!$scope.countDownInterval ) {
                   $scope.startCountdown();                
            }                   
            
        };       


        /* 
           Interval to set the theme on iframes when it is loaded
        */
        var checkIframeContent = function () {            
            if ($scope.countDown == 0) {
                $interval.cancel($scope.countDownInterval);
            } else {
                $scope.applyChangesOnIframe();
            }
            $scope.countDown -= 1;
        };       
        

        $scope.startCountdown = function () {
            $scope.countDownInterval = $interval(checkIframeContent, 1000, $scope.countDown);
        };

        $scope.appendIframeCopy = function (iframeTmp,device) {
            iframeTmp.addClass(device);
            iframeTmp.removeClass("themeIframe");
            iframeTmp.css("display", "none");
            iframeTmp.appendTo("body");
        };

        $scope.restoreIframeCopy = function ( device) {
            var iframeTmp = $("." + device).clone();
            iframeTmp.removeClass(device);
            iframeTmp.addClass("themeIframe");
            iframeTmp.css("display", "block");
            setTimeout(function () {
                iframeTmp.appendTo(".sectionContainer section");
            }, 1000);
            
        };

        $scope.iframeAlreadyLoaded = function () {
            if ($scope.showDevice == "Smartphone" && $(".smartphoneTmp").length > 0) {
                $scope.restoreIframeCopy("smartphoneTmp");
                return true;
            } else if ($scope.showDevice == "Tablet" && $(".tabletTmp").length > 0) {
                $scope.restoreIframeCopy("tabletTmp");
                return true;
            } else if ($scope.showDevice == "Desktop" &&  $(".desktopTmp").length > 0) {
                $scope.restoreIframeCopy("desktopTmp");
                return true;
            }
            return false;
        };

        $scope.resetTheme = function () {
            var $content = $("iframe").contents();
            $content.find("body style").remove();
            $scope.firstLoad = true;
            $scope.theme = '';
            $scope.themeLogin = '';
            $("#accordion .panel-heading[href='#collapse1']").removeClass("collapsed");
        };

        
        $scope.uploadImage = function (input) {

            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {

                    $scope.imagePath = e.target.result;
                    $scope.loadLogoImage();                      

                    var $imageSection = $('.image-section');
                    var $colorThiefOutput = $imageSection.find('.color-thief-output');
                    var $targetimage = $imageSection.find('.target-image');                    

                    setTimeout(function () {
                        themeBuilderImageColorService.$getImageColors($targetimage, $imageSection, $scope.selectors.less).then(function (data) {                       
                            $scope.clientImage = data.clientImage;
                            $scope.elementClickedKey = "@one-color-palette";
                            $scope.oneColorPalette = data.defaultColor;
                            $scope.createFinalLess();                       
                        
                        }, function (errorData) {
                            console.error(errorData)
                        });
                    }, 100);
                };

                reader.readAsDataURL(input.files[0]);
            }
        };
                

        $scope.loadLogoImage = function () {
            $(".paletteContainer").show();
            $(".pickColorIcon").show();
            $('#clientIconImg')
                .attr('src', $scope.imagePath)
                .width('auto')
                .height('auto')
                .css({ "maxWidth": 150, "maxHeight": 115 });

            setTimeout(function () {
                var resultingPaleteHeight = $(".resulting-palette").css("height");
                resultingPaleteHeight = Number(resultingPaleteHeight.slice(0, resultingPaleteHeight.length - 2));
                $(".resulting-palette-container").height(resultingPaleteHeight + 20);
            }, 500);
            
        };

        
        /*
            Buttons actions
        */
        $scope.selectColorFromPalette = function (param) {

            $scope.selectedCopyColor = $scope.selectedCopyColor ? $scope.selectedCopyColor : "@one-color-palette";

            themeBuilderImageColorService.$selectColorFromPalette(param, $scope.disableCopyFunction, $scope.selectedCopyColor, $scope.selectors.less).then(function (data) {
                $scope.selectors.less = data.selectors;
                $scope.elementClickedKey = data.elementClickedKey;
                $scope.oneColorPalette = data.oneColorPalette ? data.oneColorPalette : $scope.oneColorPalette;
                $scope.$disableCopyFunction = data.disableCopyFunction ? data.disableCopyFunction : $scope.$disableCopyFunction;

                $scope.createFinalLess();

                $(".swatch").css("cursor", "pointer");
                //$scope.overlayclicked();

            }, function (errorData) {
                console.error(errorData)
            });

            $scope.selectedCopyColor = null;
            
        };


        $scope.colorItemSelected = function (e,param) {            
            $scope.selectedCopyColor = param;
        };

        $scope.selectCopyColor = function (param) {
            $scope.selectedCopyColor = param;

            if ($scope.disableCopyFunction) {
                $scope.disableCopyFunction = false;
                $(".swatch").css("cursor", "pointer");
            } else {
                $scope.disableCopyFunction = true;
                $(".swatch").css("cursor", "help");

                $(".function-output").css({ 'z-index': '99999', 'background': 'white' });
                $('#overlayArea').fadeIn(300);
                var documentHeight = $(document).height();
                $("#overlayArea").css("height", documentHeight + "px");
            }
            
        };

        $scope.applyColorsOnPalette = function(){
            $scope.clientImage
            for(var i =0;i< $(".swatch").length / 2 ;i++){
                var paletteElement = $(".swatch")[i];
                var colorElement = $scope.clientImage.palette[i];
                $(paletteElement).css("background","rgb("+colorElement[0]+","+colorElement[1]+","+colorElement[2]+")");
            }
            for(var i = 0, j=$(".swatch").length/2;j< $(".swatch").length ;i++,j++){
                var paletteElement = $(".swatch")[j];
                var colorElement = $scope.clientImage.palette[i];
                $(paletteElement).css("background","rgb("+colorElement[0]+","+colorElement[1]+","+colorElement[2]+")");
            }
        };
        


        $scope.logoButtonClicked = function () {
            $("input[name='clientIcon']").trigger('click');
        };


        $scope.downloadStyles = function () {

            var zip = new JSZip();
            zip.file("workportal.css", $scope.theme);
            zip.file("login.css", localStorage.getItem("themeLogin"));

            var imgFolder = zip.folder("images");
            imgFolder.file("logo.png", $('#clientIconImg').attr("src").split(",")[1], { base64: true });
            

            var imgFolderAndroid = imgFolder.folder("Splash Android");
            var imgFolderIos = imgFolder.folder("Splash Ios");

            for (var i = 0; i < $scope.splashImages.length ; i++) {
                if ($scope.splashImages[i].device == "android") {
                    imgFolderAndroid.file($scope.splashImages[i].name, $scope.splashImages[i].file.split(",")[1], { base64: true });
                } else {
                    imgFolderIos.file($scope.splashImages[i].name, $scope.splashImages[i].file.split(",")[1], { base64: true });
                }
                
            }

            var content = zip.generate({ type: "blob" });

            // see FileSaver.js
            saveAs(content, "themeBuilder.zip");
        };


        $scope.selectDevice = function (item) {
            $("header .nav-tabs li a").removeClass("device-selected");
            $($("header .nav-tabs li a")[item]).addClass("device-selected");
        };



        $rootScope.$on('colorpicker.change', $scope.createLess);
        $rootScope.$on('stateOptions', $scope.update);
        $rootScope.$on('updateSelectors', $scope.addSelectors);
        $rootScope.$on('updateCSSBase', $scope.updateCSSBase);
        $rootScope.$on('colorpicker.selected', $scope.colorItemSelected);
        

        $scope.init();
    });