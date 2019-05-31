/*
*   Name: BizAgi Logging Feature
*   Author: Richar Urbano - RicharU (based on Diego Parra)
*   Comments:
*   -   This script will create global definitions to allow easy logging
*/

// Create or Define BizAgi namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.chrono = (typeof (bizagi.chrono) !== "undefined") ? bizagi.chrono : {};


// Default logging variables
bizagi.enableTrace = true;
bizagi.enableDebug = false;
bizagi.enableChrono = false;

bizagi.log = function(message, data, icon) {
    var doc = window.document;

    // Check if trace is enabled
    if (!bizagi.enableTrace) return;

    if (bizagi.logContainer === undefined) {
        bizagi.logContainer = $(".ui-bizagi-log-container", doc);

        if (bizagi.logContainer.length === 0) {
            bizagi.logContainer = createNotificationsBox();

            // Clear localstorage
            bizagi.util.removeItemLocalStorage("bizagi.mobility.trace");
            bizagi.util.setItemLocalStorage("bizagi.mobility.trace", []);
        }
    }

    // Clone data if present
    if (data) {
        try {
            data = JSON.parse(JSON.encode(data));
        } catch (e) {
            data = {};
        }
    }

    // Log messaging, add if has data
    message = message || "";
    var tempMessage = message.replace(BIZAGI_PATH_TO_BASE, "");
    bizagi.logContainer.bizagi_notifications("addNotification", tempMessage, data, getIcon(icon));    

    // No resources multilanguage
    if (tempMessage.indexOf("Rest/Multilanguage/Client") === -1) {

        var trace = bizagi.util.getItemLocalStorage("bizagi.mobility.trace") ? JSON.parse(bizagi.util.getItemLocalStorage("bizagi.mobility.trace")) : [];
        trace.push([tempMessage, data]);

        bizagi.util.setItemLocalStorage("bizagi.mobility.trace", JSON.stringify(trace));
    }

    // Helper method
    function createNotificationsBox() {
        var logContainer = $("<div />").appendTo($("body", doc));
        var device = typeof bizagi.detectDevice !== "undefined" ? bizagi.detectDevice() : bizagi.util.detectDevice();

        // Apply plugin
        logContainer.bizagi_notifications({
            headerAdditionalClass: "ui-bizagi-log-container-header",
            containerAdditionalClass: "ui-bizagi-notifications-container ui-bizagi-log-container",
            itemIcon: "ui-icon-info",
            title: "Debugging Log",
            location: "top",
            device: device,
            sendEnabled: bizagi.util.isCordovaSupported()
        });

        // Advanced log view
        logContainer.bind("itemClick", function(e, ui) {

            // Remove preview items 
            $(".bz-render-popup-log").remove();

            // If not data not show popup
            if (!ui.data || bizagi.util.isEmpty(ui.data)) return;

            // Create trace container
            var popup = $("<div class='bz-render-popup-log' />").appendTo($("body"), doc);
            var contentViewer = $("<pre class='bz-render-popup-json' readonly=true />");

            // Create text area
            contentViewer.height("90%");
            contentViewer.width("100%");

            // format json
            var currentData = bizagi.util.syntaxHighlight(typeof (ui.data) == "string" ? ui.data : JSON.stringify((ui.data), null, 2));
            contentViewer.html(currentData);

            // Add content to popup            
            popup.html(contentViewer);

            // Shows dialog
            popup.dialog({
                width: 640,
                height: 480,
                modal: true,
                title: "Object Hierarchy",
                close: function() {
                    popup.dialog("destroy");
                    popup.detach();
                }
            });

        });

        return logContainer;
    }

    // Returns the icon associated to the messageType
    function getIcon(_icon) {
        _icon = _icon || "bz-workonit default";

        if (_icon === "info") {
            return "bz-information-icon " + _icon;
        }

        if (_icon === "warning") {
            return "bz-warning-icon " + _icon;
        }

        if (_icon === "error") {
            return "bz-minus " + _icon;
        }

        if (_icon === "timer") {
            return "bz-counterclock-input " + _icon;
        }

        if (_icon === "success") {
            return "bz-check-symbol " + _icon;
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
bizagi.chrono.init = function (timer) {    
    if (!timer) bizagi.chronos = {};
    else bizagi.chronos[timer] = { millis: 0, timestamp: 0 };
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
    bizagi.chronos[timer].running = false;

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
bizagi.chrono.log = function(timer) {
    if (!bizagi.chronos[timer]) return;    
    if (!bizagi.enableChrono) return;  
    
    console.log("Timer " + timer + ": " + bizagi.chronos[timer].millis + "ms");
    //bizagi.log("Timer " + timer + ": " + bizagi.chronos[timer].millis + "ms", null, "timer");
};

/*
*   Returns the current value of a timer
*/
bizagi.chrono.logTimers = function () {
    if (!bizagi.enableChrono) return;
    for (key in bizagi.chronos) {
        bizagi.chrono.log(key);
    }
};

bizagi.chrono.init();