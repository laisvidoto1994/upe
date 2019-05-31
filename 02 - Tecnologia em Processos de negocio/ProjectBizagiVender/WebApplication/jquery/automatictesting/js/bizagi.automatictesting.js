var mainDialog = null;
var queryStringParams = bizagi.automatictesting.host.getQueryStringParams();
var recorderOptions = {
    userName: queryStringParams["userName"], 
    domain: queryStringParams["domain"], 
    allowQueryForms: queryStringParams["allowQF"] === "true"
};

if (window.location.protocol === "https:")
    bizagi.automatictesting.host.setRecorderHostUrl("https://localhost/AutoTesting.svc/Recorder");
else
    bizagi.automatictesting.host.setRecorderHostUrl("http://localhost/AutoTesting.svc/Recorder");

var recorder = new bizagi.automatictesting.recorder(recorderOptions);
recorder.render();

var autotest = {};
autotest.getParams = function(input) {
    var i, pos, name, value, 
        pairs = input.split("&"),
        l = pairs.length,
        result = {};
    
    for (i = 0; i < l; i++) {
        pos = pairs[i].indexOf("=");
        if (pos === -1) continue;
        
        name = pairs[i].substring(0, pos);
        value = pairs[i].substring(pos + 1);
        result[name] = unescape(value);
    }
    return result;
};


/**
 * QAF-5129: Workaround for reloading recorder if 
 * there is no user activity after resetting web server.
 * The timeout waits 15 seconds and then tries to reload recorder
 */

$(function () {
    var isVisible = function () {
        return $(".ui-dialog-titlebar span.ui-dialog-title:contains('Quick Login')").is(":visible");
    };
    var reloadIfNotVisible = function () {
        var quickLoginVisible = isVisible();
        if (!recorder.userActivityDetected && !quickLoginVisible) {
            console.log("No user response... Reloading");
            //window.location.reload();

            $("div#dialog-login").remove();
            $("div#dialog-upload").remove();
            $("div#dialog-soa").remove();
            $("div.bz-at-init-panel").remove();
            $("div.bz-at-recorder").remove();
            recorder.render();
            quickLoginVisible = isVisible();
            if (!quickLoginVisible)
                $("#dialog-login").dialog("open");
        }
    };

    setTimeout(reloadIfNotVisible, 15000);
});
