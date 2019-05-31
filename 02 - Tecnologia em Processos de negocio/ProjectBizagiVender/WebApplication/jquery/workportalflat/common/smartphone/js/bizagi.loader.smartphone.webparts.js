// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};

bizagi.initializingWorkportal = typeof (bizagi.initializingWorkportal) !== "undefined" ? bizagi.initializingWorkportal : false;
bizagi.workportalInstances = {};

var queryString = bizagi.readQueryString();

var BIZAGI_ENABLE_CUSTOMIZATIONS = false;
var BIZAGI_SHAREPOINT_CONTEXT = true;

var BIZAGI_USE_ABSOLUTE_PATH = typeof (BIZAGI_USE_ABSOLUTE_PATH) !== "undefined" ? BIZAGI_USE_ABSOLUTE_PATH : true;
var BIZAGI_ENABLE_LOG = typeof (BIZAGI_ENABLE_LOG) !== "undefined" ? BIZAGI_ENABLE_LOG : false;
var BIZAGI_ENABLE_PROFILER = typeof (BIZAGI_ENABLE_PROFILER) !== "undefined" ? BIZAGI_ENABLE_PROFILER : bizagi.readQueryString()["enableProfiler"] === "true" ? true : false;
var BIZAGI_ENVIRONMENT = typeof (BIZAGI_ENVIRONMENT) !== "undefined" ? BIZAGI_ENVIRONMENT : (queryString["environment"] || "release");


// DYNAMIC LOAD CSS 
// THIS CSS IS NECESARY BEFORE JQUERY BIZAGI ENGINE START 
// Define functions
bizagi.loadWebPartInitStyle = function (params) {

};

bizagi.startWaiting = function (canvas) {
};

bizagi.endWaiting = function (canvas) {
};

//Init to use functions
//document.getElementsByClassName not valid in internet Explorer
if (document.getElementsByClassName) {
    var canvasCollection = document.getElementsByClassName('bz-webpart');
    for (var i = 0; i < canvasCollection.length; i++) {
        bizagi.startWaiting(canvasCollection[i]);
    }
}
else {
    //Internet Expplorer Code
    var i = 0;
    var a = document.getElementsByTagName("div");
    while (element = a[i++]) {
        if (element.className == "bz-webpart") {
            bizagi.startWaiting(element);
        }
    }
}

// Gets the loader instance, and load the module
bizagi.initializeWorkportal = function (params) {
    //Load css file for waiting image

    var hostUrl = window.location.origin;
    bizagi.loadWebPartInitStyle({ serverurl: hostUrl + params.locationPrefix });
    if (bizagi.initializingWorkportal) {
        // Wait until the loader has been initialized and execute callback
        var doMutexLoop = function () {
            if (bizagi.initializingWorkportal) {
                setTimeout(doMutexLoop, 50);
            } else {

                setTimeout(function () {
                    // Callback function
                    if (params.whenInitialized) params.whenInitialized(bizagi.getWorkportalInstance(params));
                }, 300);
            }
        };
        doMutexLoop();
        return;
    }

    bizagi.initializingWorkportal = true;
    var loader = bizagi.loader;
    loader.init({
        url: params.moduleDefinitionFile,
        overrides: params.moduleDefinitionOverrides,
        locationPrefix: params.locationPrefix,
        callback: function () {
            // Load module            
            loader.start("flat");
            // Load extrafiles
            if (params.additionalFiles) loader.loadFile(params.additionalFiles);
            // Load workportal
            loader.then(function () {
                bizagi.initializingWorkportal = false;

                // Get user language
                $.when(bizagi.getUserLanguage(params))
				.pipe(function (language) {
				    bizagi.localization.setLanguage(language);
				    return bizagi.localization.ready();

				}).done(function () {
				    // Callback function
				    if (params.whenInitialized) params.whenInitialized(bizagi.getWorkportalInstance(params));
				});
            });
        }
    });

};

// This method can only be executed after all workportal dependency scripts has been loaded
bizagi.getWorkportalInstance = function (params) {
    var project = params.project || "default";
    if (bizagi.workportalInstances[project]) {
        return bizagi.workportalInstances[project];
    }

    // Else create a new one
    params.context = params.context || "workportal";
    params.sharepointProxyPrefix = params.sharepointProxyPrefix || "";
    params.proxyPrefix = params.proxyPrefix || params.sharepointProxyPrefix;
    // Cache the result and return
    bizagi.workportalInstances[project] = new bizagi.workportal.facade(params);
    return bizagi.workportalInstances[project];
};

// This method can only be executed after all workportal dependency scripts has been loaded
bizagi.getUserLanguage = function (params) {
    //Override the login function, this is only necesary in WorkPortal
    //TODO:centralize version or login page for smartphone
    bizagi.services.ajax.loginPage = function () { };

    var project = params.project || "default";
    var defer = new $.Deferred();
    // Else create a new one
    params.context = params.context || "workportal";
    params.sharepointProxyPrefix = params.sharepointProxyPrefix || "";
    params.proxyPrefix = params.sharepointProxyPrefix || "";
    // Create a new services proxy object 
    var services = new bizagi.workportal.services.service(params);

    $.when(services.getCurrentUser())
			.pipe(function (data) {
			    return defer.resolve(data.language);
			}).fail(function (data) {
			    return defer.resolve("default");
			});

    return defer.promise();
};

bizagi.addLoadHandlers = function (functionByParam) {
    if (window.attachEvent) {
        window.attachEvent('onload', functionByParam);
    } else {
        if (window.onload) {
            var curronload = window.onload;
            var newonload = function () {
                curronload();
                functionByParam();
            };
            window.onload = newonload;
        } else {
            window.onload = functionByParam;
        }
    }
};

// this funtion is necesary because this wait is out of canvas of webpart 
bizagi.loader.hideWait = function (params) {
};
