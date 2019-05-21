/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/

 * Version: 0.11.0 - 2014-05-01
 * License: MIT
 */
angular.module("ui.colorpicker", [])
    .directive("colorPicker", function($rootScope){
        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                ngModel: '='
            },
            template:'<div ng-model="ngModel" picker class="form-control" style="background-color:{{ngModel}};">',

            link: function (scope, element) {
                var picker = $(element).find('div[picker]');
                
                if ($rootScope.counter != undefined) {
                    $rootScope.counter += 1;
                } else {
                    $rootScope.counter = 0;
                }                

                picker.ColorPicker({
                    onSubmit: function(hsb, hex, rgb, el) {
                        scope.ngModel = '#'+hex;
                        $(el).css("background","#"+hex);
                        scope.$apply();
                        $rootScope.$emit('colorpicker.change', {el:el,hsb:hsb,hex:hex,rgb:rgb});
                        $(el).ColorPickerHide();

                        $(".resulting-palette-copy").hide();
                        $(".resulting-palette").removeClass("movePalette");
                        $(".resulting-palette").css("left", "inherit");
                        $(".resulting-palette").css("top", "inherit");
                    },
                    onBeforeShow: function () {
                        var parentElement = $(this).parent().attr("data-key");
                        var colorPickerInstances = $(".colorpicker");

                        $rootScope.$emit('colorpicker.selected', parentElement);

                        setTimeout(function () {
                            for (var i = 0 ; i < colorPickerInstances.length; i++) {
                                if ($(colorPickerInstances[i]).css("display") == "block") {
                                    var pickerLeft = $(colorPickerInstances[i]).css("left");
                                    var pickerTop = $(colorPickerInstances[i]).css("top");
                                    pickerLeft = Number(pickerLeft.slice(0, pickerLeft.length - 2));
                                    pickerTop = Number(pickerTop.slice(0, pickerTop.length - 2));
                                                           
                                    $(".resulting-palette-copy").show();
                                    $(".resulting-palette").addClass("movePalette");
                                    $(".resulting-palette").css({                                       
                                        'left': pickerLeft +353,
                                        'top': pickerTop + 2                                       
                                    });
                                    break;
                                }
                            }
                            
                        }, 100);
                        
                    },
                    onHide: function () {
                        $(".resulting-palette-copy").hide();
                        $(".resulting-palette").removeClass("movePalette");
                        $(".resulting-palette").css("left", "inherit");
                        $(".resulting-palette").css("top", "inherit");
                    },
                    counter: $rootScope.counter 
                })
                .bind('keyup', function(){
                    $(this).ColorPickerSetColor(this.value);
                });
            }
        };
    });
