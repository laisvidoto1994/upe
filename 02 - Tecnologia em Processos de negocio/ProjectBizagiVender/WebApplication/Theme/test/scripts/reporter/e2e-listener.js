/**
 * Created by RicharU on 23/01/2015.
 */
var util = require('util');
var ejs = require('ejs');
var file = require("fs");


var CURRENT_TYPE = 'workportal'; // default
var CURRENT_DEVICE = 'smartphone'; // default

// Load data
process.argv.forEach(function(val, index, array) {
    if (val.indexOf("environment=") !== -1) {
        CURRENT_TYPE = val.split("=")[1];
    }

    if (val.indexOf("device=") !== -1) {
        CURRENT_DEVICE = val.split("=")[1];
    }
});

var path = './scripts/reporter/e2e.tmpl.ejs',
    str = file.readFileSync(path, 'utf8');

var e2eHtml = '<link href="../../../resources/libs/bootstrap.min.css" rel="stylesheet" type="text/css">';
e2eHtml += '<link href="../../../resources/libs/e2e.report.css" rel="stylesheet" type="text/css">';
e2eHtml += '<link href="../../../resources/libs/ide.css" rel="stylesheet" type="text/css">';
e2eHtml += '<script src="../../../resources/libs/jquery.min.js" type="text/javascript"></script>';
e2eHtml += '<script src="../../../resources/libs/bootstrap.min.js" type="text/javascript"></script>';
e2eHtml += '<script src="../../../resources/libs/jquery.collapsible.min.js" type="text/javascript"></script>';

e2eHtml += '<div class="inner-content"><h1>E2E Test Results Smartphone</h1>';
e2eHtml += '<div class="buttons"><button id="btnCollapse">Collapse all</button><button id="btnExtend">Extend all</button></div>';

var tests = [];

var testHead = '';
var testSteps = '';
var bFlag;

function setHeader(testRun) {
    e2eHtml += '<div class="big-container-' + testRun.browserOptions.browserName + '">';
    e2eHtml += '<table cellspacing="0" cellpadding="0"><tr class="overview"><td colspan="4">Browser: ' + testRun.browserOptions.browserName + '</tr>';
    e2eHtml += '<tr class="overview"><td colspan="4">Timestamp: ' + Date().toString() + '</tr>';
    e2eHtml += '<tr><td colspan="4"></tr></table><div class="panel-group" id="container_' + testRun.browserOptions.browserName + '">';
}

function groupByCategory(data) {
    var groups = {};

    for (var i = 0; i < data.length; i++) {
        var item = data[i];

        if (!groups[item.category]) {
            groups[item.category] = {
                result: [],
                success: true,
                total: 0,
                pass: 0
            };
        }

        groups[item.category].result.push({
            surname: item.name.split('.')[1],
            name: item.name,
            success: item.success,
            time: item.time,
            steps: item.steps
        });

        groups[item.category].total++;
        groups[item.category].pass = groups[item.category].pass + (item.success ? 1 : 0);
        groups[item.category].success = (groups[item.category].success && item.success);
    }

    var result = [];

    for (var x in groups) {
        if (groups.hasOwnProperty(x)) {
            var obj = {};
            obj[x] = groups[x];
            result.push(obj);
        }
    }
    return result;

}

function groupByGroup(data) {

    var groups = {};

    for (var i = 0; i < data.result.length; i++) {
        var item = data.result[i];

        if (!groups[item.surname]) {
            groups[item.surname] = {
                result: [],
                success: true,
                total: 0,
                pass: 0
            };
        }

        groups[item.surname].result.push({
            name: item.name,
            success: item.success,
            time: item.time,
            steps: item.steps
        });

        groups[item.surname].total++;
        groups[item.surname].pass = groups[item.surname].pass + (item.success ? 1 : 0);
        groups[item.surname].success = (groups[item.surname].success && item.success);
    }


    var result = [];

    for (var x in groups) {
        if (groups.hasOwnProperty(x)) {
            var obj = {};
            obj[x] = groups[x];
            result.push(obj);
        }
    }

    data.result = result;

    return data;
}

function renderHtml(browser) {

    if (tests.length > 0) {
        tests = groupByCategory(tests);

        for (var i = 0, len = tests.length; i < len; i++) {
            var test = tests[i];
            for (var x in test) {
                if (test.hasOwnProperty(x)) {
                    test[x] = groupByGroup(test[x]);
                }
            }

        }

        e2eHtml += ejs.render(str, {
            "browser": browser,
            "tests": tests
        });
    }
}

/** An example interpreter listener factory with all listener functions implemented. */
exports.getInterpreterListener = function(testRun) {
    var browser = "";
    var category = "";
    var steps = [];

    var timeTest;
    var timeStep;

    return {
        'startTests': function() {
            console.log('Listener: test run starting!');
            bFlag = testRun.browserOptions.browserName;
            setHeader(testRun);
        },

        'startTestRun': function(testRun, info) {
            console.log("Listener: test run starting!");
            timeTest = (new Date()).getTime();
            testHead = '';
            testSteps = '';
            /*  console.log("Listener: success: " + info.success);
             console.log("Listener: error: " + util.inspect(info.error));*/
        },

        'endTestRun': function(testRun, info) {
            browser = testRun.browserOptions.browserName;
            category = testRun.name.split('.')[0];

            console.log("Listener: test run ending!");
            if (bFlag !== browser) {
                renderHtml(bFlag);

                e2eHtml += '</div></div>';

                setHeader(testRun);

                bFlag = browser;
                tests = [];
            }

            var data = {
                category: category,
                name: testRun.name,
                success: info.success,
                time: ((new Date()).getTime() - timeTest),
                steps: steps
            };
            tests.push(data);
            steps = [];
        },

        'startStep': function(testRun, step) {
            console.log("Listener: step starting!");
            timeStep = (new Date()).getTime();

        },

        'endStep': function(testRun, step, info) {
            steps.push({
                jsonStep: JSON.stringify(step),
                success: info.success,
                time: ((new Date()).getTime() - timeStep)
            });
            info.error ? console.log(info.error) : "";
        },

        'endTests': function(result) {

            console.log("End E2E Test- " + CURRENT_TYPE);
            renderHtml(bFlag);

            e2eHtml += '</div></div>';

            var BASE_PATH = mobilityHelper.getCurrentDirectory('');

            var date = new Date((new Date()).setHours(0, 0, 0, 0));
            var formatFolder = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
            var resultFormatFolder = formatFolder.replace(new RegExp('-', 'g'), '');

            var BASE_DIRECTORY = mobilityHelper.validateDirectory(BASE_PATH + 'logs/mobility-report/jsonresult') + '/';
            var REPORTER_DIRECTORY = mobilityHelper.validateDirectory(BASE_DIRECTORY + CURRENT_DEVICE) + '/' + formatFolder + "/";

            var PATH_GENERAL_JSON_DEFINITION = mobilityHelper.validateDirectory(BASE_DIRECTORY) + 'historicaldef.json';
            PATH_GENERAL_JSON_DEFINITION = mobilityHelper._assignWritablePermissions(PATH_GENERAL_JSON_DEFINITION);

            var STATIC_CODE_DIRECTORY_E2E = mobilityHelper.validateDirectory(BASE_PATH + "logs/e2e/" + CURRENT_DEVICE) + '/';


            console.log("\n--------------------------------------------------------------------------------");
            console.log("					      MOBILITY REPORTER BY E2E TEST");
            console.log("--------------------------------------------------------------------------------");
            console.log(REPORTER_DIRECTORY);
            console.log("--------------------------------------------------------------------------------");

            /**
             *  Crear o actualizar el archivo de definición para la prueba y fecha específica,
             *  e2e (workportal|rendering)
             */
            file.mkdir(REPORTER_DIRECTORY, 0777, function(err) {

                if (err) {
                    if (err.code == 'EEXIST') {
                        // Ignore the error if the folder already exists
                        console.log("\nThe folder already exists: " + REPORTER_DIRECTORY + "\n");
                        file.writeFileSync(REPORTER_DIRECTORY + "e2e-" + CURRENT_TYPE + ".js", "var mobilityE2E_" + resultFormatFolder + " = " + JSON.stringify(result) + ";");
                    } else {
                        // Something else went wrong
                        console.log('\n>> ' + err);
                    }
                } else {
                    // Successfully created folder
                    console.log("\nSuccessfully created folder: " + REPORTER_DIRECTORY + "\n");
                    file.writeFileSync(REPORTER_DIRECTORY + "e2e-" + CURRENT_TYPE + ".js", "var mobilityE2E_" + resultFormatFolder + " = " + JSON.stringify(result) + ";");
                }
            });

            /**
             * Crear o actualizar archivo JSON Historial
             */
            file.readFile(PATH_GENERAL_JSON_DEFINITION, 'utf8', function(err, data) {
                // New File and data
                if (err) {

                    console.log('An empty file is created: >> ' + err);

                    var json = {};
                    var device = {};

                    device[CURRENT_DEVICE] = [];
                    device[CURRENT_DEVICE].push(formatFolder);

                    json["historic"] = device;

                    console.log(JSON.stringify(json));
                    file.writeFileSync(PATH_GENERAL_JSON_DEFINITION, JSON.stringify(json));

                } else {

                    // Init data
                    var historial = JSON.parse(data);

                    // Exist History
                    if (typeof(historial.historic) !== 'undefined') {

                        var deviceHistorial = historial.historic[CURRENT_DEVICE];

                        // Exist Device
                        if (typeof(deviceHistorial) !== 'undefined') {
                            if (deviceHistorial.indexOf(formatFolder) == -1) {
                                deviceHistorial.push(formatFolder);

                                historial.historic[CURRENT_DEVICE] = deviceHistorial;
                            }
                        } else {
                            // New device
                            historial.historic[CURRENT_DEVICE] = [];
                            historial.historic[CURRENT_DEVICE].push(formatFolder);
                        }

                    } else {

                        var device = {};
                        historial = historial || {};


                        device[CURRENT_DEVICE] = [];
                        device[CURRENT_DEVICE].push(formatFolder);

                        historial["historic"] = device;
                    }

                    // Update History
                    file.writeFileSync(PATH_GENERAL_JSON_DEFINITION, JSON.stringify(historial));

                    console.log("Historic file was updated from E2E Test.\n");
                }
            });

            file.writeFileSync(STATIC_CODE_DIRECTORY_E2E + "e2e-" + CURRENT_DEVICE + "-" + CURRENT_TYPE + ".html", e2eHtml);
        }
    };
};



/**
 * Helper Functions for JSHINT report.
 *
 * @autor RicharU <Richar.Urbano@Bizagi.com>
 *
 */

var mobilityHelper = {

    _fs: require('fs'),

    /* Get current path by global variable */
    getCurrentDirectory: function(path) {

        var currentDirectory = process.cwd();
        //var saveFile = currentDirectory + '/scripts/reporter/e2e-directory.js';

        // Get current directory
        if (typeof(path) !== 'undefined' && path != '' && path != null) {
            currentDirectory = path.replace('?', ':');
        }

        if (currentDirectory[currentDirectory.length - 1] != '/') {
            currentDirectory = currentDirectory.concat('/');
        }

        // Save reports directory
        //mobilityHelper.saveContent(saveFile, ("var jshint_directory = '" + currentDirectory + "';"));

        return currentDirectory;
    },

    /* Create root directory */
    validateDirectory: function(directory) {
        var fs = mobilityHelper._fs || require('fs');

        var listDirectories = directory.replace(/\/$/, '').split('/');

        for (var i = 1, directoryNumber = listDirectories.length; i <= directoryNumber; i++) {
            var segment = listDirectories.slice(0, i).join('/');
            !fs.existsSync(segment) ? fs.mkdirSync(segment) : null;
        }

        return directory;
    },

    /* Save data to file */
    saveContent: function(path, content) {

        var fs = mobilityHelper._fs || require('fs');

        fs.writeFileSync(mobilityHelper._assignWritablePermissions(path), content);
    },

    /* Assign writable permissions (0777)*/
    _assignWritablePermissions: function(file) {

        var fs = mobilityHelper._fs || require('fs');

        if (fs.existsSync(file)) {
            fs.chmod(file, 511);
        }

        return file;
    }
};