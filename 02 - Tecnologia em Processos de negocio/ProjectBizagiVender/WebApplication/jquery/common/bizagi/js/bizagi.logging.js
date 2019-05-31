/*
*   Name: BizAgi Logging Feature
*   Author: Diego Parra
*   Comments:
*   -   This script will create global definitions to allow easy logging
*/

// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.chrono = (typeof (bizagi.chrono) !== "undefined") ? bizagi.chrono : {};


// Default logging variables
bizagi.enableTrace = false;
bizagi.enableDebug = false;
bizagi.enableChrono = false;

bizagi.log = function (message, data, icon) {
    var doc = window.document;

    // Check if trace is enabled
    if (!bizagi.enableTrace) return;

    if (bizagi.logContainer === undefined) {
        bizagi.logContainer = $(".ui-bizagi-log-container", doc);

        if (bizagi.logContainer.length == 0) {
            bizagi.logContainer = createNotificationsBox();
        }
    }
	// Clone data if present
    if (data) { try { data = JSON.parse(JSON.encode(data)); } catch (e) { data = {}; }} 

    bizagi.logContainer.bizagi_notifications("addNotification", message, data, getIcon(icon));
	
    // Helper method
    function createNotificationsBox() {
        var logContainer = $('<div />').appendTo($("body", doc));
    	var device = typeof bizagi.detectDevice !== "undefined" ? bizagi.detectDevice() : bizagi.util.detectDevice();

        // Apply plugin
        logContainer.bizagi_notifications({
            headerAdditionalClass: "ui-bizagi-log-container-header",
            containerAdditionalClass: "ui-bizagi-notifications-container ui-bizagi-log-container",
            itemIcon: "ui-icon-info",
            title: "Debugging Log",
        	location: "top",
        	device: device
        });

        // Advanced log view
        logContainer.bind("itemClick", function (e, ui) {
            var popup = $("<div />").appendTo($("body"), doc);
        	var contentViewer = device == "desktop"  ? $("<textarea />"): $("<textarea readonly=true />");
            if (typeof(ui.data) == "string"){
                // Create text area
            	contentViewer.height("90%");
            	contentViewer.width("100%");
                contentViewer.text(ui.data);
                popup.append(contentViewer);
                
            } else{
                // Create text area
                contentViewer.height("90%");
            	contentViewer.width("100%");
                contentViewer.text(JSON.encode(ui.data));
                popup.append(contentViewer);
            }                
            
            // Shows dialog
            popup.dialog({
                width: 640,
                height: 480,
                modal: true,
                title: "Object Hierarchy",
                close: function () {
                    popup.dialog("destroy");
                    popup.detach();
                }
            });
            
        });

        return logContainer;
    }

    // Returns the icon associated to the messageType
    function getIcon(_icon) {
        _icon = _icon || "ui-icon-bullet";

        if (_icon == "info") {
            return "ui-icon-info";
        }

        if (_icon == "warning") {
            return "ui-icon-alert";
        }

        if (_icon == "error") {
            return "ui-icon-circle-close";
        }
    	
    	if (_icon == "timer") {
            return "ui-icon-clock";
        }

        if (_icon == "success") {
            return "ui-icon-check";
        }

        return _icon;
    }
};

/*
*   Creates a log message when the condition is false  
*/
bizagi.assert = function (condition, message, data) {
    if (!condition) {
        bizagi.log(message, data, "error");
    }
};

/*
*   Creates an error message
*/
bizagi.logError = function (message, data) {
    bizagi.log(message, data, "error");
};

/*
*   Creates a log message only when debug option is true
*/
bizagi.debug = function (message, data) {
    if (bizagi.enableDebug) {
    	bizagi.log(message, data, "info");
    }
};

/*
*   Returns the log container instance
*/
bizagi.getLogInstance = function () {
    // Return log object
    return bizagi.logContainer;
};

/*
*   Reset all the timers
*/
bizagi.chrono.init = function(timer) {
	if (!timer) bizagi.chronos = { };
	else bizagi.chronos[timer] = { millis: 0, timestamp: 0};
};

/*
*   Starts a timer to measure performance
*/
bizagi.chrono.start = function (timer, profile) {
    if (!bizagi.enableChrono) return;
    profile = profile !== undefined ? profile : false;
    bizagi.chronos[timer] = bizagi.chronos[timer] || { millis: 0, timestamp: 0 };
    
    // If the timer is already running don't do anything
    if (bizagi.chronos[timer].running) return;

    // Start timers
    bizagi.chronos[timer].timestamp = new Date().getTime();
    bizagi.chronos[timer].profiling = (bizagi.enableProfiler && profile);
    bizagi.chronos[timer].running = true;

    // Use chrome profiling
    if (bizagi.enableProfiler && profile) {
        console.time(timer);
        console.timeStamp(timer);
        console.profile(timer);
    }
};

/*
*   Starts an inits a new timer
*/
bizagi.chrono.initAndStart = function (timer) {
    bizagi.chrono.init(timer);
    bizagi.chrono.start(timer);
};

/*
*   Stops a timer to measure performance
*/
bizagi.chrono.stop = function (timer) {
    if (!bizagi.enableChrono) return;
    bizagi.chronos[timer] = bizagi.chronos[timer] || { millis: 0, timestamp: 0 };

    // If the timer is not running don't do anything
    if (!bizagi.chronos[timer].running) return;
    
    // Stop the timer
    var diff = new Date().getTime() - bizagi.chronos[timer].timestamp;
    bizagi.chronos[timer].millis = bizagi.chronos[timer].millis + diff;
    bizagi.chronos[timer].running = false ;
    
    // Use chrome profiling
    if (bizagi.chronos[timer].profiling) {
        console.timeEnd(timer);
        console.timeStamp(timer + "end");
        console.profileEnd(timer);
    }
};

/*
*   Stops a timer, and log it to the debugging log
*/
bizagi.chrono.stopAndLog = function (timer) {
    // If the timer is not running don't do anything
    if (bizagi.chronos[timer] && bizagi.chronos[timer].running) bizagi.chrono.stop(timer);
    bizagi.chrono.log(timer);
};

/*
*   Returns the current value of a timer
*/
bizagi.chrono.log = function (timer) {
    if (!bizagi.chronos[timer]) return;
    bizagi.log("Timer " + timer + ": " + bizagi.chronos[timer].millis + "ms", null, "timer");
};

/*
*   Returns the current value of a timer
*/
bizagi.chrono.logTimers = function() {
	if (!bizagi.enableChrono) return;
	for (key in bizagi.chronos) {
		bizagi.chrono.log(key);
	}
};
bizagi.chrono.init();
