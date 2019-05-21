/**
 * Implementation of bath request
 *
 * @example    $.ajax({
 * 	url: bizagi.com,
 * 	batchRequest: true
 * });
 * @author Edward J Morales
 */

/**
 * Create multi replace within a string
 * @param map
 * @return {String}
 */
String.prototype.replaceMultiple = function(map) {
	var string = this, map = map || {};
	$.each(map, function(key, value) {
		string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), map[key]);
	});
	return string
};


/**
 * Create a GUID
 * @return {string}
 */
Math.guid = function() {
	var d = new Date().getTime();
	if(window.performance && typeof window.performance.now === "function") {
		//use high-precision timer if available
		d += performance.now();
	}

	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
};

/**
 * Implementation of Batch Request
 * @type {Function}
 */
var batchRequest = (function(options) {
	var self = this;
	self.intervalLap = 400;
	self.queueOfRequest = [];
	self.queueToDistpatch = [];
	self.options = {
		boundary: "batch_" + Math.guid(),
		newLine: "\r\n",
		endPoint: "/"
	};

	self.options = $.extend(self.options, options);

	/**
	 * Add request to queue
	 * @param options
	 * @param originalOptions
	 * @param def
	 * @param jqXHR
	 */
	self.addBatchRequest = function(options, originalOptions, def, jqXHR) {
		var guid = Math.guid();

		/**
		 * Sent from Rest Lib, its necessary take only data
		 */
		if(originalOptions.fromRestLib) {
			originalOptions = originalOptions.data;
		}

		self.queueOfRequest.push({
			guid: guid,
			options: options,
			originalOptions: originalOptions,
			deferred: def,
			jqXHR: jqXHR
		});


	};

	/**
	 * Parse headers object to string
	 * @param objHeaders
	 * @return {string}
	 */
	self.getHeadersToString = function(objHeaders) {
		objHeaders = objHeaders || {};
		var strHeaders = "";
		$.each(objHeaders, function(key, value) {
			strHeaders += key + ": " + value + self.options.newLine;
		});
		return strHeaders;
	};


	/**
	 * Parse url to get base endpoint
	 * @param url
	 * @return {*}
	 */
	self.parseUrl = function(url) {
		url = url || "";
		// Remove relative path
		url = url.replace("./", "/");
		// Add pathname
		var pathName = location.pathname.split("/").reduce(function (acum, current, index, vector) {
			if((index + 1) < vector.length){
				acum.push(current);
			}
			return acum;
		},[]).join("/");

		url = pathName + url;
		// Remove double slash
		url = url.replace("//", "/");
		return url;
	};

	self.tryParseURL = function(urlIn, urlOut) {
		try{
			urlOut.url = new URL(urlIn);
			return true;
		}catch (e){
			return false;
		}
	};

	/**
	 * Make a header of request within a batch
	 * @param request
	 * @return {string}
	 */
	self.getRequestHeaders = function(request) {
		var headers = "";

		var tmpUrl = {
			url : undefined
		};
		if (self.tryParseURL(request.originalOptions.url, tmpUrl)){
			request.originalOptions.url = request.originalOptions.url.replace(tmpUrl.url.origin, "");
		}

		var data = JSON.stringify(request.originalOptions);
		if(data == '""') {
			data = "";
		}

		// Prevent comment strings within code
		var acceptAll = Array("*", "/", "*").join("");
		headers += "--{boundary}{newLine}";
		headers += "Content-Type: {contentType}{newLine}{newLine}";
		headers += "{method} {url} {protocol}{newLine}";
		headers += "Host: {host}{newLine}";
		headers += "X-Request-ID: {requestId}{newLine}";
		// Merge headers setted in original request
		headers += "{originalHeaders}";
		headers += "content-length: {contentLength}{newLine}";
		headers += "{newLine}{data}{newLine}";


		var map = {
			newLine: self.options.newLine,
			boundary: self.options.boundary,
			contentType: "application/http; msgtype=request",
			method: request.options.type,
			url: tmpUrl.url ? request.options.url.replace(tmpUrl.url.origin, "") : self.parseUrl(request.options.url),
			protocol: "HTTP/1.1",
			accept: (request.options.headers && request.options.headers.Accept) ? request.options.headers.Accept : acceptAll,
			requestId: Math.guid(),
			originalHeaders: self.getHeadersToString(request.options.headers),
			contentLength: data.length,
			host: tmpUrl.url ? tmpUrl.url.host : location.host,
			data: data
		};
		headers = headers.replaceMultiple(map);

		return headers;
	};

	/**
	 * Make a request with all queued request
	 * @return {string}
	 */
	self.buildBatchRequest = function() {
		var request;
		var requestBuffer = "";
		var requestFooter = "--{boundary}--{newLine}";
		while(request = self.queueOfRequest.shift()) {
			self.queueToDistpatch.push(request);
			requestBuffer += self.getRequestHeaders(request);
		}
		// add end boundary
		if(requestBuffer) {
			requestBuffer += requestFooter.replaceMultiple({
				newLine: self.options.newLine,
				boundary: self.options.boundary
			})
		}
		return requestBuffer;
	};

	/**
	 * Get information about response
	 * @param response
	 * @return {{status: {code, codeMessage}, headers, data}}
	 */
	self.parseResponse = function(response) {
		/**
		 * Get the status code of response
		 * @param response
		 * @return {{code: *, codeMessage: *}}
		 */
		var getStatusCode = function(response) {
			var statusReg = /(HTTP\/1\.1) (\d{3}) (\w{1,})/g;
			var responseStatus = statusReg.exec(response);
			return {
				code: responseStatus[2],
				codeMessage: responseStatus[3]
			}
		};
		/**
		 * Get all headers within response
		 * @param response
		 * @return {{}}
		 */
		var getHeaders = function(response) {
			var headerReg = /([A-Z]{1}[\w|-]{1,}):[ \t]*([^\r\n]*)$/mg;

			var match;
			var responseHeaders = {};
			while((match = headerReg.exec(response))) {
				responseHeaders[match[1].toLowerCase()] = match[2];
			}

			return responseHeaders;
		};

		/**
		 * Get data of response
		 * @param response
		 * @return {*}
		 */
		var getData = function(response) {
			var blankReg = /^\s*$/gm;
			var responseData = {};
			var arrBlankLines = response.split(blankReg);
			var arrBlankLinesLength = arrBlankLines.length;
			var line;

			for(var i = arrBlankLinesLength - 1; i > 0; i--) {
				try {
					line = bizagi.util.trim(arrBlankLines[i]);
					if(line != "" && ( line.charAt(0) == "[" || line.charAt(0) == "{" )) {
						JSON.parse(line);
						responseData = line;
					}
				} catch(e) {
					// Just try the next one
				}
			}
			return responseData;
		};
		/**
		 * Public interface of parseResponse
		 */
		return {
			status: getStatusCode(response),
			headers: getHeaders(response),
			data: getData(response)
		}
	};

	/**
	 * Split response by boundary and process each one
	 * @param responses
	 * @param boundary
	 * @return {Array}
	 */
	self.processResponses = function(responses, boundary) {
		var response, parsedResponse = [];
		var arrResponses = responses.split(boundary);
		// Remove first and latest because contain part of boundary separator "--"
		arrResponses.shift();
		arrResponses.pop();

		while(response = arrResponses.shift()) {
			parsedResponse.push(self.parseResponse(response));
		}
		return parsedResponse;
	};

	/**
	 * Get value of boundary based on jqXHR response
	 * @param jqXHR
	 * @return {string}
	 */
	self.getBoundary = function(jqXHR) {
		var contentType = jqXHR.getResponseHeader("Content-Type");
		var boundaryReg = /boundary=(.*)/g;
		var boundary = boundaryReg.exec(contentType);
		boundary = (boundary.length > 0) ? boundary[1] : "";
		boundary = boundary.replace(/\"/g, "");
		return "--" + boundary;
	};

	/**
	 * Send batch request with all queued request
	 */
	self.execute = function() {
		var data = self.buildBatchRequest();
		if(!data) {
			return;
		}

		$.when($.ajax(self.options.endPoint, {
			method: "POST",
			contentType: "multipart/mixed; boundary=\"" + self.options.boundary + "\"",
			data: data
		})).done(function(responseMain, textStatusMain, jqXHRMain) {
			var response;
			var boundary = self.getBoundary(jqXHRMain);
			var processResponses = self.processResponses(responseMain, boundary);
			while(response = processResponses.shift()) {
				var def = self.queueToDistpatch.shift();
				var converter, data;
				try {
					// Apply data converters
					converter = (typeof def.options.converters["text " + def.options.dataType] == "function") ? def.options.converters["text " + def.options.dataType] : def.options.converters["* text"];
					data = converter(response.data);
				} catch(e) {
					data = response.data;
				}

				switch(response.status.code) {
					case "200": // OK
					case "201": // Created
						def.jqXHR.getAllResponseHeaders = function() {
							return self.getHeadersToString(def.options.headers);
						};
						def.jqXHR.getResponseHeader = function(key) {
							return def.options.headers[key];
						};

						def.deferred.resolve(data, textStatusMain, def.jqXHR);
						break;

					case "400": // Bad Request
					case "401": // Not authorized
					case "404": // Not Found
					case "500": // Server Error
						def.deferred.reject(def.jqXHR, response.status.code, data);
						break;

					default:
						def.deferred.reject("Status code " + response.status.code + " is unrecognized");
				}
			}
		});
	};

	/**
	 * Stop window interval, all request through batch will be stopped
	 */
	self.stop = function() {
		window.clearInterval(self.interval);
	};


	window.setInterval(
		function() {
			if(self.queueOfRequest) {
				self.execute();
				// Refresh guid value
				self.options.boundary = "batch_" + Math.guid();
			}
		}, self.intervalLap);

	/**
	 * Public interface
	 */
	return {
		add: self.addBatchRequest,
		execute: self.execute,
		getInterval: self.interval,
		stop: self.stop
	}
});