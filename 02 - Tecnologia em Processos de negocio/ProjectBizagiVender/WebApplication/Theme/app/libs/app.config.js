/******************************************************************
 *   appConfig
 *   @version:  1.0
 *   @author:   Ramiro Gómez
 *   JS Libraries Dependencies: Angular
 ******************************************************************/
var _appConfig;

/** Initilizer **/
(function () {
    _appConfig = {
        root: '',
        version: '1.0',
        debug: {
            web: true
        },
        modules: {
            angular: [
                'ui.router',
                'ui.bootstrap',
                'ngAnimate',
                'ui.colorpicker',
                'ui.splashScreens'
            ],
            themeBuilder: [
                'selectorModule'
            ]
        }
    };
})();


less = {
    env: "development",
    logLevel:3,
    async: false,
    fileAsync: false,
    poll: 1000,
    functions: {},
    dumpLineNumbers: "comments",
    relativeUrls: false,
    rootpath: ":/a.com/",
    sourceMap: false
};