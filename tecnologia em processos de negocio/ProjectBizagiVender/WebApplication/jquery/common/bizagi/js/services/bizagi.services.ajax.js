/*
 *   Name: BizAgi Ajax Services
 *   Author: Diego Parra
 *   Comments:
 *   -   This class will provide a low level ajax handling over jquery
 *       that will let us switch between plain ajax and json-rpc 2.0 protocol
 *   -   http://groups.google.com/group/json-rpc/web/json-rpc-2-0
 */

// Create or define namespace
var bizagiConfig = bizagiConfig || {};

bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.services = (typeof (bizagi.services) !== "undefined") ? bizagi.services : {};
bizagi.services.ajax = (typeof (bizagi.services.ajax) !== "undefined") ? bizagi.services.ajax : {};
//bizagi.override = bizagi.override || {};
bizagi.log = bizagi.log || new Function();
bizagi.assert = bizagi.assert || new Function();
// Global variables
bizagi.services.ajax.useAbsolutePath = typeof (BIZAGI_USE_ABSOLUTE_PATH) !== "undefined" ? BIZAGI_USE_ABSOLUTE_PATH : false;
bizagi.services.ajax.pathToBase = bizagi.services.ajax.useAbsolutePath ? (bizagi.loader.getLocationPrefix()) : (typeof (BIZAGI_PATH_TO_BASE) !== "undefined" ? BIZAGI_PATH_TO_BASE : "");
bizagi.services.ajax.loginPage = bizagi.services.ajax.pathToBase || "default.htm";
bizagi.services.ajax.errorPage = bizagi.services.ajax.pathToBase + "error.html";
bizagi.services.ajax.logEnabled = true;
bizagi.services.ajax.logSuccess = true;
bizagi.services.ajax.logSubmits = true;
bizagi.services.ajax.logFail = true;
bizagi.services.ajax.batch = {};
bizagi.services.ajax.batchCount = 0;
bizagi.services.ajax.batchTimer = 100;
bizagi.services.ajax.batchTimeoutInstance = null;
bizagiConfig.proxyPrefix = bizagiConfig.proxyPrefix ? bizagiConfig.proxyPrefix : (typeof (BIZAGI_PROXY_PREFIX) !== "undefined" ? BIZAGI_PROXY_PREFIX : "");

// Initialize batch request
bizagi.services.batchRequest = new batchRequest({
	endPoint: bizagiConfig.proxyPrefix + "Api/Batch"
});

/**
 * Redirect to Login Page
 */
bizagi.services.redirectToLoginPage = function(){
	if(typeof bizagi.services.ajax.loginPage === "string") {
		// Remove session storage of authentication data
		sessionStorage.removeItem("bizagiAuthentication");
		if(localStorage.getItem("clientLog") != "true") {
			// Reload page
			window.location = bizagi.services.ajax.loginPage;
		}
	}
	else {
		bizagi.services.ajax.loginPage();
	}
};

/**
 * Capture request with dataType same to json
 * Capture batch request and their headers
 */
$.ajaxTransport("json", function(options, originalOptions, jqXHR) {
	if(bizagi.override.enableBatchRequest && options.batchRequest) {
		return {
			send: function(headers, completeCallback) {
				options.headers = headers;
				// We don't do anything here, because this is a fake request
			},
			abort: function() {
				// We don't do anything here, because this is a fake request
			}
		};
	}
});

// use this transport for "binary" data type
$.ajaxTransport("+binary", function(options, originalOptions, jqXHR){
	// check for conditions and support for blob / arraybuffer response type
	if (window.FormData && ((options.dataType && (options.dataType == "binary")) || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer) || (window.Blob && options.data instanceof Blob)))))
	{
		return {
			// create new XMLHttpRequest
			send: function(headers, callback){
				// setup all variables
				var xhr = new XMLHttpRequest(),
					url = options.url,
					type = options.type,
					async = options.async || true,
				// blob or arraybuffer. Default is blob
					dataType = options.responseType || "blob",
					data = options.data || null,
					username = options.username || null,
					password = options.password || null;

				xhr.addEventListener("load", function(){
					var data = {};
					data[options.dataType] = xhr.response;
					// make callback and send data
					callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
				});

				xhr.open(type, url, async, username, password);

				// setup custom headers
				for (var i in headers ) {
					xhr.setRequestHeader(i, headers[i] );
				}

				xhr.responseType = dataType;
				xhr.send(data);
			},
			abort: function(){
				jqXHR.abort();
			}
		};
	}
});


/**
 * Capture all ajax request and set a respective filters
 */
$.ajaxPrefilter(function(options, originalOptions, jqXHR) {
	options = options || {};

	// Set gateway to batch request
	if(bizagi.override.enableBatchRequest && options.batchRequest && bizagi.services.batchRequest) {
		var def = $.Deferred();
		def.promise(jqXHR);

		bizagi.services.batchRequest.add(options, originalOptions, def, jqXHR);
	}
});


/*
 *   Ajax prefilter to to fix text "& scripts urls
 */
$.ajaxPrefilter("*", function(options, originalOptions, jqXHR) {

	var rpcEnabled = (options.rpcEnabled !== undefined) ? options.rpcEnabled : bizagi.services.ajax.rpcEnabled;
	// Don't convert the trigger batch request, neither the non-rpc requests
	if (options.triggerBatch || !rpcEnabled) {
		// Fix urls
		var finalUrl = options.url.indexOf("http") == 0 ? options.url : bizagi.services.ajax.pathToBase + options.url;
		options.url = finalUrl;
		if (options.dataType == "json" && !options.cache) {
			options.cache = false;
		}

		// Add log option
		if (bizagi.services.ajax.logEnabled) {
			if (bizagi.services.ajax.logSubmits && finalUrl.indexOf("tmpl") == -1 && finalUrl.indexOf("resources.json") == -1) {
				bizagi.log("Sending data to " + finalUrl, options.data, "success");
			}

			if (options.crossDomain == true) {
				options.xhrFields = {
					withCredentials: true
				};
			}

			jqXHR.done(function(result) {
				if (bizagi.services.ajax.logSuccess && finalUrl.indexOf("tmpl") == -1 && finalUrl.indexOf("resources.json") == -1) {
					bizagi.log(finalUrl + " succeded", result, "success");
				}
			}).fail(function(_, __, message) {
				// Log data sent
				bizagi.log("Sent data to" + finalUrl, options.data, "error");
				// Log error
				if (bizagi.services.ajax.logFail) {
					// Log result
					if (typeof message == "object" && message.name == "SyntaxError") {
						bizagi.log(finalUrl + " failed - syntax error", arguments[0].responseText, "error");
					} else {
						bizagi.log(finalUrl + " failed", message, "error");
					}
				}
			});
		}
	}
	return;
});

/*
 *   Extend parse JSON to parse error messages from server
 *   then apply a new converter and assign the new function
 */
bizagi.services.ajax.parseJSON = function(data) {
	var result = {};
	// Remove break line
	data = data ? data : "{}";
	data = data.replace(/(\r\n|\n|\r)/gm, "");

	try {
		result = $.parseJSON(data);
	} catch(e) {

		try {
			// Try to fix some known problems regarding rare ascii characters
			result = $.parseJSON(data.replace(/\x1d/g, "."));
		} catch(ex) {
			result.type = "error";
			result.code = e.errorCode;
			result.message = data;
			//Throw exception in next layer
		}
	}

	if ((result.type && result.type == "error") || (result.status && result.status == "error") || (result.http_status_code && result.http_status_code == 401)) {
		if (result.code == "AUTH_ERROR" || result.code == "AUTHENTICATION_ERROR" || result.message == "AUTHENTICATION_ERROR" || result.http_status_code == 401) {
			bizagi.services.redirectToLoginPage();
		} else if (result.code == "FED_AUTHENTICATION_ERROR") {
			if (typeof bizagi.services.ajax.loginPage === "string") {
				sessionStorage.setItem("FED_AUTHENTICATION_ERROR", true);
				window.location = result.message;
			} else {
				bizagi.services.ajax.loginPage();
			}

		} else if (result.code == "AUTHENTICATION_USER_NOT_FOUND") {
			window.location = bizagi.services.ajax.errorPage + "?message=" + result.message + "&type=" + result.type;
		}
		else if (result.http_status_code && result.http_status_code == 401) {
			var type = result.code ? result.code : (result.error ? result.error : "AuthenticationError");
			var message = result.message ? result.message : (result.error_description ? result.error_description : "Authentication Configuration Error");
			window.location = bizagi.services.ajax.errorPage + "?message=" + message + "&type=" + type;
		}

		if(result.code == "licenseError") {

			window.location = bizagi.services.ajax.errorPage + "?message=" + result.message + "&type=" + result.type;
		}
		var message = (result.code && result.code != "UNKNOWN_ERROR" ? result.code+": " : "") + (result.message ? "" + result.message : "");
		jQuery.error(message);
	}
	localStorage.setItem("clientLog", "false");
	return result;
};

$.ajaxSetup({
	converters: {
		"text json": bizagi.services.ajax.parseJSON
	},
	complete: function(jqXHR) {
		
		if (jqXHR.status === 401) {
		    if (jqXHR.responseJSON && jqXHR.responseJSON.validationMethod === "implicitPrincipalInjection") {
				return;
			}

			bizagi.services.redirectToLoginPage();
		}
	}
});


//---------------------------------------//
//---------------------------------------//
//-------------- OAUTH ------------------//
//---------------------------------------//
//---------------------------------------//

if (typeof jqOAuth !== "undefined" && bizagi.isOAuth2Enabled()) {

	$.ajaxSetup({
		converters: {
			"text json": function(data){
				var result = {};
				// Remove break line
				data = data ? data : "{}";
				data = data.replace(/(\r\n|\n|\r)/gm, "");

				try {
					result = $.parseJSON(data);
				} catch(e) {

					try {
						// Try to fix some known problems regarding rare ascii characters
						result = $.parseJSON(data.replace(/\x1d/g, "."));
					} catch(ex) {
						result.type = "error";
						result.code = e.errorCode;
						result.message = data;
						//Throw exception in next layer
					}
				}
				if ((result.type && result.type == "error") || (result.status && result.status == "error")){
					var message = (result.code && result.code != "UNKNOWN_ERROR" ? result.code+": " : "") + (result.message ? "" + result.message : "");
					jQuery.error(message);
				}
				localStorage.setItem("clientLog", "false");
				return result;
			}
		},
		complete: function(jqXHR) {
		}
	});

	var Oauth2_Credentials = {
		client_id: "2a80addc628db6f12788ed842f873260066c9d6c",
		client_secret: "672b11ff612225ff018b87252d8d3a1116ecc574",
		redirect_uri: "bz:oauth:2.0:server:mobiletitlebarbrowser"
	}

	var authorization = btoa(Oauth2_Credentials.client_id + ":" + Oauth2_Credentials.client_secret);

	// Initialize library
	bizagi.authentication = bizagi.authentication || {};

    bizagi.authentication.oauth = new jqOAuth({
        //csrfToken: "token",
        events: {
            logout: function() {},
            login: function() {},
            tokenExpiration: function() {
                var nativeComponent = bizagi.getNativeComponent();

                if (bizagi.util.isNativePluginSupported() && nativeComponent !== "tablet") {
                    var deferred = $.Deferred();
                    bizagiapp.setAccessToken(bizagi.authentication.oauth.getAccessToken(),
                        bizagi.authentication.oauth.getRefreshToken(), nativeComponent, function(params) {
                            var jsonParams = jQuery.parseJSON(params);
                            bizagi.authentication.oauth.setAccessToken(jsonParams.accessToken, jsonParams.refreshToken);

                            deferred.resolve();
                        });

                    return deferred.promise();
                } else {
                    return $.ajax({
                        type: "POST",
                        url: BIZAGI_PROXY_PREFIX + "oauth2/server/token",
                        headers: {
                            "Authorization": "Basic " + authorization
                        },
                        data: {
                            "grant_type": "refresh_token",
                            "scope": "login api",
                            "refresh_token": bizagi.authentication.oauth.getRefreshToken()
                        }
                    }).then(function(response) {
                        if (bizagi.util.isNativePluginSupported() && nativeComponent === "tablet") {
                            bizagiapp.setAccessToken(response.access_token, response.refresh_token, nativeComponent);
                        }

                        bizagi.authentication.oauth.setAccessToken(response.access_token, response.refresh_token);

                    });
                }
            }
        }
    });

	bizagi.authentication.resetToken = function(accesToken, refreshToken) {
	    this.oauth.setAccessToken(accesToken, refreshToken);

		// Validar si es nativo
		if (bizagi.util.isNativePluginSupported()) {
			bizagiapp.setAccessToken(accesToken, refreshToken);
		}
	}
}

// Add x-domain support for ie7-ie8-ie9
if (typeof jQuery.browser != "undefined" && jQuery.browser.msie && window.XDomainRequest &&
    (document.documentMode == 7 || document.documentMode == 8 || document.documentMode == 9)) {
    jQuery.support.cors = true;
}
