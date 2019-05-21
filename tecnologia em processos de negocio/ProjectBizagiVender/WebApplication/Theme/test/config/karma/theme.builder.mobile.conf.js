/**
 * Created by ChristianC on 22/10/2015.
 */
// Karma configuration

var day = new Date();
var today = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();
var folder = Number(new Date());
//subdir: folder.toString(),

var modules = require("../globalConfig");

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: "../../../",

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage', 'html'        
        reporters: ["progress", "junit", "coverage", "html"],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG        
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 180000,

        browserNoActivityTimeout: 180000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        urlRoot: "/",

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ["jasmine"],

        // list of files / patterns to load in the browser
        files: (function() {
            var themeCommonFiles = [];

            themeCommonFiles.push({
                pattern: "app/libs/jquery/*.js",
                included: true,
                served: true
            });

            themeCommonFiles.push({
                pattern: "app/libs/colorthief/color-thief.js",included: true,served: true
            });

            themeCommonFiles.push({
                pattern: "app/libs/angular/angular.js",
                included: true,
                served: true
            });

            themeCommonFiles.push({
                pattern: "app/libs/angular/*.js",
                included: true,
                served: true
            });

            themeCommonFiles.push({
                pattern: "app/libs/colorpicker/*.js",
                included: true,
                served: true
            });

            themeCommonFiles.push({
                pattern: "app/libs/angular/colorPicker/angular.colorpicker.js",
                included: true,
                served: true
            });

            themeCommonFiles.push({
                pattern: "app/libs/angular/**/*.js",
                included: true,
                served: true
            });


            themeCommonFiles.push({
                pattern: "app/libs/angular/angular-mocks.js",
                included: true,
                served: true
            });

            themeCommonFiles.push({
                pattern: "app/libs/app.config.js",
                included: true,
                served: true
            });

            themeCommonFiles.push({
                pattern: "app/modules/selector/*module.js",
                included: true,
                served: true
            });

            themeCommonFiles.push({
                pattern: "app/modules/selector/*.js",
                included: true,
                served: true
            });


            themeCommonFiles.push({
                pattern: "app/modules/_themeBuilder/*module.js",
                included: true,
                served: true
            });

            themeCommonFiles.push({
                pattern: "app/modules/_themeBuilder/*.js",
                included: true,
                served: true
            });

            themeCommonFiles.push({
                pattern: "app/libs/angular/splashScreens/*js",
                included: true,
                served: true
            });

            themeCommonFiles.push({
                pattern: "test/unit/unit.theme.mobile.js",
                included: true,
                served: true
            });


            // Add test files
            //themeCommonFiles.push({ pattern: "common/base/js/dev/jquery.mockjax.js", included: true, served: true });


            return themeCommonFiles;
        })(),

        // list of files to exclude
        exclude: [

        ],

        //preprocessors: {
        //    './workportalflat/**/bizagi.*.js': ["coverage"]
        //},

        //coverageReporter: {
        //    reporters: [
        //        {
        //            type: "html",
        //            dir: "./testmobility/logs/coverage/",
        //            subdir: "/smartphone/" + today + "/workportal/",
        //            file: "workportal.html"
        //        },
        //        {
        //            type: "cobertura",
        //            dir: "./testmobility/logs/coverage/",
        //            subdir: "/smartphone/" + today + "/workportal/",
        //            file: "coverage-smartphone-workportal.xml"
        //        }
        //    ]
        //},

        //htmlReporter: {
        //    outputFile: "./testmobility/logs/unit/" + today + "/smartphone/unittest-smartphone-workportal.html",
        //    title: "Unit Test Report For Workportal"
        //},

        //junitReporter: {
        //    outputDir: "./testmobility/logs/unit/" + today + "/smartphone/",
        //    outputFile: "unittest-smartphone-workportal.xml",
        //    suite: "junit",
        //    useBrowserName: false
        //},

        //customLaunchers: {},

        browsers: [
            //'Firefox'
            //"Chrome"
            "PhantomJS"
        ],

        plugins: [
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-phantomjs-launcher",
            "karma-requirejs",
            "karma-jasmine",
            "karma-coverage",
            "karma-junit-reporter",
            "karma-htmlfile-reporter"
        ],

        proxies: {
            "/jquery/": "http://localhost:8001/Theme/"
        }
    });
};
