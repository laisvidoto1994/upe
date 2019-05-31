/**
 * _themeBuilder Definition
 * @author: Ramiro Gómez | ramiro.gomez@bizagi.com
 */

angular
    .module('_themeBuilder', _appConfig.modules.angular.concat(_appConfig.modules.themeBuilder))
    .run(function (APP) {
        //gettextCatalog.debug = true;

        var self = this;
        self.getConstants = function (mod) {
            var c = {};
            for (var i = 0; i < mod.length; i++) {
                if (mod[i][1] === 'constant') {
                    c.constants = true;
                    c[mod[i][2][0]] = mod[i][2][1];
                }
            }
            return c;
        };
        /**
         * This method add all the constant definition per module to the application wrapper,
         * this with the idea to
         */
        self.addConstantsToConfig = function () {
            for (var prop in APP.MODULES) {
                var actModule = APP.MODULES[prop];
                var constantes = self.getConstants(angular.module(actModule)._invokeQueue);
                if (constantes.hasOwnProperty('constants')) {
                    delete constantes.constants;
                    angular.extend(APP, constantes);
                }
            }
        };

        self.addConstantsToConfig();
    });