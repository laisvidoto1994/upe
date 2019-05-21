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
            var workportalFiles = [];
            var parsedDefinition = require("../bizagi.module.definition.js");

            //Adds this item to the beginning of the array
            workportalFiles.push({
                pattern: "workportalflat/testsuite/smartphone/unit/unit.config.js",
                included: true,
                served: true
            });

            // Add bizagi configuration
            workportalFiles.push({
                "pattern": 'common/bizagi/js/services/bizagi.services.batchRequest.js',
                "included": true,
                "served": true
            });

            workportalFiles.push({
                "pattern": 'common/bizagi/js/bizagi.messaging.js',
                "included": true,
                "served": true
            });

            // Merge definition
            for (var i in parsedDefinition) {
                workportalFiles.push(parsedDefinition[i]);
            }

            // Add test files
            workportalFiles.push({ pattern: "common/base/js/dev/jquery.mockjax.js", included: true, served: true });
            workportalFiles.push({ pattern: "common/base/js/dev/jquery.mockjson.js", included: true, served: true });

            workportalFiles.push({ pattern: "bizagi.configuration.js", included: true, served: true },
                {
                    pattern: "workportalflat/testsuite/smartphone/unit/unit.bizagi.workportal.init.js",
                    included: true,
                    served: true
                }
            );

            workportalFiles.push({ pattern: "workportalflat/common/services/test/unit/*", included: true, served: true });
            workportalFiles.push({
                pattern: "workportalflat/webparts/common/**/test/unit/*",
                included: true,
                served: true
            });
            workportalFiles.push({
                pattern: "workportalflat/webparts/smartphone/**/test/unit/*",
                included: true,
                served: true
            });

            //console.info(workportalFiles);

            return workportalFiles;
        })(),

        // list of files to exclude
        exclude: [
            "**/DummyFileForEmptyFolder.ToDelete"
        ],

        preprocessors: {
            './workportalflat/**/bizagi.*.js': ["coverage"]
        },

        coverageReporter: {
            reporters: [
                {
                    type: "html",
                    dir: "./testmobility/logs/coverage/",
                    subdir: "/smartphone/" + today + "/workportal/",
                    file: "workportal.html"
                },
                {
                    type: "cobertura",
                    dir: "./testmobility/logs/coverage/",
                    subdir: "/smartphone/" + today + "/workportal/",
                    file: "coverage-smartphone-workportal.xml"
                }
            ]
        },

        htmlReporter: {
            outputFile: "./testmobility/logs/unit/" + today + "/smartphone/unittest-smartphone-workportal.html",
            title: "Unit Test Report For Workportal"
        },

        junitReporter: {
            outputDir: "./testmobility/logs/unit/" + today + "/smartphone/",
            outputFile: "unittest-smartphone-workportal.xml",
            suite: "junit",
            useBrowserName: false
        },

        customLaunchers: {},

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
            "/jquery/": "http://localhost:8001/jquery/"
        }
    });
};
