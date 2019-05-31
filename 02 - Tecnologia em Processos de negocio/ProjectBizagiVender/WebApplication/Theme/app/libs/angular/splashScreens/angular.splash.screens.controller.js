angular.module("ui.splashScreens",[]).controller('SplashScreensController',['$scope','$rootScope',function($scope,$rootScope){
    

    $scope.iosSplash = [
        {
            size: '320 x 480', name: 'iosx320x480', fileName: 'Default~iphone', status:''
        },
        {
            size: '640 x 960', name: 'iosx640x960', fileName: 'Default@2x~iphone', status:''
        },
        {
            size: '768 x 1024', name: 'iosx768x1024', fileName: 'Default-Portrait~ipad', status:''
        },
        {
            size: '1536 x 2048', name: 'iosx1536x2048', fileName: 'Default-Portrait@2x~ipad', status:''
        },
        {
            size: '1024 x 748', name: 'iosx1024x748', fileName: 'Default-Landscape~ipad', status:''
        },
        {
            size: '2048 x 1536', name: 'iosx2048x1536', fileName: 'Default-Landscape@2x~ipad', status:''
        },
        {
            size: '640 x 1136', name: 'iosx640x1136', fileName: 'Default-568h@2x~iphone', status:''
        }              
        
        
    ];
    $scope.androidSplash = [
        {
            size: '500 x 667', name: 'androidx500x667', fileName: 'splash-port-ldpi', status:''
        },
        {
            size: '667 x 500', name: 'androidx667x500', fileName: 'splash-land-ldpi', status:''
        },
        {
            size: '667 x 1000', name: 'androidx667x1000', fileName: 'splash-port-mdpi', status:''
        },
        {
            size: '1000 x 667', name: 'androidx1000x667', fileName: 'splash-land-mdpi', status:''
        },
        {
            size: '1000 x 1667', name: 'androidx1000x1667', fileName: 'splash-port-hdpi', status:''
        },
        {
            size: '1500 x 2667', name: 'androidx1500x2667', fileName: 'splash-port-xhdpi', status:''
        },
        {
            size: '1667 x 1000', name: 'androidx1667x1000', fileName: 'splash-land-hdpi', status:''
        },
        {
            size: '2667 x 1500', name: 'androidx2667x1500', fileName: 'splash-land-xhdpi', status:''
        }
    ];

    $scope.imageExtensions = ["JPG", "JPEG", "GIF", "PNG", "BMP"];
    $scope.imageExtensionsToShow = "JPG, JPEG, GIF, PNG, BMP";
    $rootScope.splashImages = [];


    $scope.uploadSplashImage = function (inputImage) {
        if (inputImage.files && inputImage.files[0]) {

            var reader = new FileReader();
            var image = new Image();                        
            var inputRow = $(inputImage).closest(".row");
            var inputImageData = inputImage.name.split("x");

            $scope.splashName = inputImage.name;
            $scope.inputDimension = {};
            $scope.inputDimension.device = inputImageData[0];
            $scope.inputDimension.width = Number(inputImageData[1]);
            $scope.inputDimension.height = Number(inputImageData[2]);
            
            $scope.imageData = {};
            $scope.imageData.imageType = inputImage.files[0].type;
            $scope.imageData.imageSize = inputImage.files[0].size;
            $scope.imageData.realImageName = inputImage.files[0].name;
            //$scope.imageData.splashImageName = inputImage.dataset.fileName;
            $scope.imageData.splashImageName = inputImage.attributes["data-file-name"].value;

            var formatSupported = $.grep($scope.imageExtensions, function (n, i) {
                return $scope.imageData.imageType.toUpperCase() == "IMAGE/"+n;
            });

            if (formatSupported.length > 0) {
                reader.onload = function (e) {

                    image.src = e.target.result;
                    image.onload = function () {
                        var w = this.width,
                            h = this.height;
                        

                        if ($scope.inputDimension.width == w && $scope.inputDimension.height == h) {
                            
                            inputRow.find(".imageStatus span").css("display", "inline");
                            inputRow.find(".imageStatus .splash-file-name").html($scope.imageData.realImageName);
                            inputRow.find(".splash-icon").hide();
                            inputRow.find(".splash-check").show();
                            inputRow.find(".splash-preview").show();
                            
                            if ($scope.inputDimension.device == "android") {
                                var splashLoaded = $.grep($scope.androidSplash, function (n, i) {
                                    return n.name == $scope.splashName;
                                });
                                splashLoaded[0].status = "ok";
                            } else {
                                var splashLoaded = $.grep($scope.iosSplash, function (n, i) {
                                    return n.name == $scope.splashName;
                                });
                                splashLoaded[0].status = "ok";
                            }

                            $rootScope.splashImages.push({
                                device: $scope.inputDimension.device,
                                name: $scope.imageData.splashImageName + ".png",
                                splashName:$scope.splashName,
                                file: image.src
                            });

                        } else {
                            var message = "Wrong dimensions, the right dimensions must be : <br/>" + $scope.inputDimension.width +
                                        " x " + $scope.inputDimension.height + ". <br/> The selected file dimensions are: <br/>" + w + " x " + h;
                            var messageHover = "Wrong dimensions, the right dimensions must be : \n" + $scope.inputDimension.width +
                                        " x " + $scope.inputDimension.height + ". \n The selected file dimensions are: \n" + w + " x " + h;

                            inputRow.find(".splash-icon").hide();
                            inputRow.find(".splash-warning").show();
                            inputRow.find(".splash-warning").attr("title", messageHover);
                            inputRow.find(".splash-warning").css("cursor", "pointer");
                            $scope.showAlertMessage(message, false);
                            
                            return;
                        }
                    };                   

                };

                reader.readAsDataURL(inputImage.files[0]);

            } else {
                var message = "Extension not supported, the supported extensios are: <br/>" + $scope.imageExtensionsToShow +
                    " <br/> Your file extension is: <br/>" + $scope.imageData.imageType;
                var messageHover = "Extension not supported, the supported extensios are: \n" + $scope.imageExtensionsToShow +
                    " \n Your file extension is: \n" + $scope.imageData.imageType;

                inputRow.find(".splash-icon").hide();
                inputRow.find(".splash-warning").show();
                inputRow.find(".splash-warning").attr("title", messageHover);
                inputRow.find(".splash-warning").css("cursor", "pointer");
                $scope.showAlertMessage(message, false);
                
                return;
            }

            
        }
    };

    $scope.SplashButtonClicked = function ( param) {
        $("input[name='" + param + "']").trigger('click');
    };

    $scope.closeSplashScreen = function (param) {

        var androidSplashEmpty = $.grep($scope.androidSplash, function (n, i) {
            return n.status == '';
        });
        var iosSplashEmpty = $.grep($scope.iosSplash, function (n, i) {
            return n.status == '';
        });

        if (androidSplashEmpty.length > 0 || iosSplashEmpty.length > 0) {
            var message = "Upload process is not complete yet, there are still missing files. <br/> Do you want to exit this screen anyway? <br/> Uploaded screens will be kept.";
            $scope.showAlertMessage(message, true);
        } else {
            $('#overlayArea').fadeOut(300, function () {
                $('.splash-screen-container').css({ 'z-index': '1', 'display': 'none' });
            });
        }

    };

    $scope.showAlertMessage = function (message,showCancelButton) {
        $(".alert-message").css({ 'display': 'block' });
        $(".alert-message .text-message").html(message);

        if (showCancelButton) {
            $(".alert-message .btn-cancel-message").css("display", "inline-block");
        } else {
            $(".alert-message .btn-cancel-message").css("display", "none");
        }
    };

    $scope.closeAlertMessage = function (param) {
        if (param == "ok" && $(".alert-message .btn-cancel-message").css("display") == "inline-block") {            
            $('#overlayArea').fadeOut(300, function () {
                $('.splash-screen-container').css({ 'z-index': '1', 'display': 'none' });
            });                        
        }

        $(".alert-message").css("display", "none");
        $('.splash-screen-container').css({ 'z-index': '100' });       
        
    };

    $scope.showPreview = function (param, previewIcon) {

        var elementTop = $("button[name='" + previewIcon.item.name + "'").offset().top;
        var elementLeft = $("button[name='" + previewIcon.item.name + "'").offset().left;

        $(".image-preview-container").show();
        
        var imagePreviewItem = $.grep($rootScope.splashImages, function (n, i) {
            return n.splashName == param;
        });

        $(".image-preview").attr("src", imagePreviewItem[0].file);
       // $(".image-preview-container").css({ "top": elementTop  ,"right":"20%"});
        
        console.log(param);
    };

    $scope.hidePreview = function () {
        $(".image-preview-container").hide();
    };

    $scope.testingFunction = function(param){
        $scope.testResult = param * 2;
    };

    console.info('SplashScreensController initialized!');

}]).directive("splashScreens", function ($rootScope) {
  
    return {
        restrict: 'A',
        templateUrl:'app/libs/angular/splashScreens/theme.builder.splash.screens.html'
    }
});