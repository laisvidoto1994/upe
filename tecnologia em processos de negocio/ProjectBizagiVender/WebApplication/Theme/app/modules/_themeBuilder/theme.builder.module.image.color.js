angular
.module('_themeBuilder')
.service('themeBuilderImageColorService', function ($q) {
    var self = this;
    var colorThief = new ColorThief();


    self.$getImageColors = function ($image, $imageSection,$selectorsLess) {

        var deferred = $q.defer();
        var promise = deferred.promise;

        var image = $image[0];
        var start = Date.now();
        var color = colorThief.getColor(image);
        var elapsedTimeForGetColor = Date.now() - start;
        var palette = colorThief.getPalette(image);
        var elapsedTimeForGetPalette = Date.now() - start + elapsedTimeForGetColor;

        var clientImage = {
            color: color,
            palette: palette,
            elapsedTimeForGetColor: elapsedTimeForGetColor,
            elapsedTimeForGetPalette: elapsedTimeForGetPalette
        };

        var defaultColor = {};
        defaultColor.r = clientImage.color[0];
        defaultColor.g = clientImage.color[1];
        defaultColor.b = clientImage.color[2];

        var arr = jQuery.grep($selectorsLess, function (n, i) {
            if (n.id == "onecolor") {
                var newColor = "rgb(" + defaultColor.r + "," + defaultColor.g + "," + defaultColor.b + ")";
                $selectorsLess[i].items[0].value = newColor;
                $("div[data-key='"+$selectorsLess[i].items[0].key+"']").find("input").css("background",newColor);
            }
        });

        deferred.resolve({
            selectors: $selectorsLess,
            defaultColor: defaultColor,
            clientImage: clientImage
        });

        return promise;

    };

    self.$selectColorFromPalette = function ($param,$disableCopyFunction, $selectedCopyColor, $selectorsLess) {

        var deferred = $q.defer();
        var promise = deferred.promise;

        var defaultColor = {};
        var oneColorPalette = null;
        defaultColor.r = $param[0];
        defaultColor.g = $param[1];
        defaultColor.b = $param[2];

        if($(".resulting-palette-copy").css("display") == "inline"){
            $selectedCopyColor = "@one-color-palette";
        }

        var arr = jQuery.grep($selectorsLess, function (n, i) {
            if (n.items) {
                var arr2 = jQuery.grep($selectorsLess[i].items, function (m, j) {
                    if (m.key == $selectedCopyColor) {
                        $selectorsLess[i].items[j].value = "rgb(" + defaultColor.r + "," + defaultColor.g + "," + defaultColor.b + ")";
                    }
                });
            }
        });


        if ($selectedCopyColor == "@one-color-palette") {
            oneColorPalette = defaultColor;
            var newColor = "rgb(" + defaultColor.r + "," + defaultColor.g + "," + defaultColor.b + ")";
            $("div[data-key='@one-color-palette']").find("input").css("background",newColor);
        }

        $disableCopyFunction = false;

        deferred.resolve({
                elementClickedKey:$selectedCopyColor,
                oneColorPalette: oneColorPalette,
                selectors: $selectorsLess,
                disableCopyFunction:false
         });


        return promise;

    };

});