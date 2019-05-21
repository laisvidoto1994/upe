bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.util = (typeof (bizagi.util) !== "undefined") ? bizagi.util : {};
bizagi.context = (typeof (bizagi.context) !== "undefined") ? bizagi.context : {};

/**
 * Method to detect iPad visitors
 */
bizagi.util.randomNumber = function (min, max) {
    min = min || 1;
    max = max || 10000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 *   Returns the resolved result from a promise when the promise has been executed already
 */
bizagi.resolveResult = function (promise) {
    var result;
    promise.done(function (data) {
        result = data;
    });
    return result;
};

/**
 *   Returns a boolean if there are two equal objects
 */
bizagi.util.identicalObjects = function (obj1, obj2) {
    var self = this;

    if (typeof (obj1) !== typeof (obj2)) {
        return false;
    }

    if (typeof (obj1) === "function") {
        return obj1.toString() === obj2.toString();
    }

    if (obj1 instanceof Object && obj2 instanceof Object) {

        // Count properties
        if (bizagi.util.countProps(obj1) !== bizagi.util.countProps(obj2)) {
            return false;
        }

        var r = true;
        for (k in obj1) {
            r = bizagi.util.identicalObjects(obj1[k], obj2[k]);
            if (!r) {
                return false;
            }
        }
        return true;
    } else {
        return obj1 === obj2;
    }
};


bizagi.util.countProps = function (obj) {
    var count = 0;
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            count++;
        }
    }
    return count;
};

/**
 *   Encode a html string
 */
bizagi.util.encodeHtml = function (text) {
    if (text === undefined || text === null) {
        return "";
    }
    if (typeof (text) == "string") {
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    return text;
};

/**
 *   Encodes the xpath
 */
bizagi.util.encodeXpath = function (xpath) {
    if (bizagi.util.isEmpty(xpath))
        return "";
    return xpath.replaceAll(".", "_").replaceAll("=", "_").replaceAll("[", "_").replaceAll("]", "_");
};

/**
 *   Add a clone to the object prototype
 */
bizagi.clone = function (obj) {
    return JSON.parse(JSON.encode(obj));
};

/**
 *   Generates a random guid
 */
Math.guid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * Execute deferreds in order
 * @example var a = new bizagiQueue(); a.add(function);
 *
 */
function bizagiQueue() {
    var self = this;
    var queue = [];

    self.add = function (callback) {
        queue.push({ callbacks: [callback] });
    };

    self.addParallel = function (callback) {
        if (queue.length == 0)
            return self.add(callback);

        // Put a parallel on last item
        var last = queue[queue.length - 1];
        last.callbacks.push(callback);
    };

    self.execute = function () {
        var starter = new $.Deferred();
        var promise = starter.promise();
        var queueLength = queue.length;
        for (var i = 0; i < queueLength; i++) {
            promise = promise.pipe(function () {
                var element = queue.shift();
                return $.when.apply($, $.map(element.callbacks, function (callback) {
                    // Function support
                    if (typeof (callback) == "function")
                        return callback();
                    // Deferred support
                    return callback;
                }))
            });
        };

        starter.resolve();
        promise = promise.done(function () {
            // Reset queue
            queue = [];
        });

        return promise;
    };
};

/**
 *   Check if a map object is empty
 */
bizagi.util.isMapEmpty = function (map) {
    // First we validate a special case
    if (map.length == 1 && map[0].length == 0)
        return true;
    // Then we do normal validation
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
};

/**
 * Find element to make scroll top
 */
bizagi.util.scrollTop = function (canvas) {
    if (canvas && canvas[0]) {
        while (canvas[0].tagName !== "HTML" && canvas.css("overflow-y") != "scroll" && canvas.css("overflow-y") != "auto" && canvas.parent().length > 0) {
            canvas = canvas.parent();
        }
    }
    return canvas;
};

/*
*   Read the query string parameteres
*/
bizagi.util.getQueryString = function (url) {
    var params = {};
    url = url || window.location.href;
    var query = url.indexOf("?") > 0 ? url.substring(url.indexOf("?") + 1) : "";
    var pairs = query.split("&");
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');
        if (pos == -1)
            continue;
        var argname = pairs[i].substring(0, pos);
        var value = pairs[i].substring(pos + 1);
        params[argname] = unescape(value);
    }
    return params;
};


/*
*   Info scenarios
*/
var scenarioInfo = (function(params) {
    var self = this;
    var _state = {};

    /**
    * Return url where is located specific scenario
    *
    * @param params
    * @returns {string}
    */
    self.getFileScenario = function(params) {
        params = params || {};
        var url = "";
        var scenario = params.scenario.split(".") || [];
        var category = scenario[0];

        url = BIZAGI_SMARTPHONE_PATH + "scenarios/" + category + "/" + params.scenario + ".js";

        return url;
    };

    return {
        getFileScenario: self.getFileScenario
    };
});

/**
 *   Determines if parameter 'n' is numeric
 */
bizagi.util.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

/**
 *   Determines if a element has visibility
 */
bizagi.util.isScrolledIntoView = function (elem, layout) {
    if (elem == undefined) {
        return false;
    }

    layout = layout || $(window);
    var scrollTop = layout.scrollTop();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();
    var docViewBottom = scrollTop + $(layout).height();
    return ((elemBottom <= docViewBottom) && (elemTop >= scrollTop));
};

/**
 * determines whether the element in the browser supports the event we are looking for, eg 'paste', 'input', 'blur', etc. More info check modernizer.js.
 * @param  {string|*}           eventName  is the name of an event to test for (e.g. "resize")
 * @param  {(Object|string|*)=} element    is the element|document|window|tagName to test on
 * @return {boolean}
 */
bizagi.util.isEventSupported = function (eventName, element) {
    var needsFallback = !('onblur' in document.documentElement);
    var isSupported;

    if (!eventName) {
        return false;
    }
    if (!element || typeof element === 'string') {
        element = document.createElement(element || 'div');
    }

    // Testing via the `in` operator is sufficient for modern browsers and IE.
    // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and
    // "resize", whereas `in` "catches" those.
    eventName = 'on' + eventName;
    isSupported = eventName in element;

    // Fallback technique for old Firefox - bit.ly/event-detection
    if (!isSupported && needsFallback) {
        if (!element.setAttribute) {
            // Switch to generic element if it lacks `setAttribute`.
            // It could be the `document`, `window`, or something else.
            element = document.createElement('div');
        }
        if (element.setAttribute && element.removeAttribute) {
            element.setAttribute(eventName, '');
            isSupported = typeof element[eventName] === 'function';

            if (element[eventName] !== undefined) {
                // If property was created, "remove it" by setting value to `undefined`.
                element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
        }
    }
    return isSupported;
};
/*
 * Method to detect Android visitors
 */
bizagi.util.isAndroid = function(){
    return (navigator.userAgent.toLowerCase().indexOf("android") > -1);
};

/**
 * Functions to loading
 */
(function ($) {
    $.fn.startLoading = function (params) {
        bizagi.util.smartphone.startLoading();
    };

    $.fn.endLoading = function () {
        bizagi.util.smartphone.stopLoading();
    };
})(jQuery);

/***
 * Removes the objects and dispose
 * @param obj
 */

bizagi.util.dispose = function (obj) {
    for (key in obj) {
        if (typeof (obj[key]) == "object") delete obj[key];
        if (typeof (obj[key]) == "function") { obj[key] = null; delete obj[key]; }
    }
};

/**
* Remove all backslashes that represent scape of characters
*/
bizagi.util.stripslashes = function (str) {
    return str.replace(/\\'/g, '\'').replace(/\"/g, '"').replace(/\\\\/g, '\\').replace(/\\0/g, '\0');
};

/**
 * CryptoJS MD5 
 * @param {} message 
 * @returns {} 
 */
bizagi.util.md5 = function (message) {
    // Code here will be linted with JSHint.
    /* jshint ignore:start */    
    var CryptoJS = CryptoJS || function (s, p) { var m = {}, l = m.lib = {}, n = function () { }, r = l.Base = { extend: function (b) { n.prototype = this; var h = new n; b && h.mixIn(b); h.hasOwnProperty("init") || (h.init = function () { h.$super.init.apply(this, arguments) }); h.init.prototype = h; h.$super = this; return h }, create: function () { var b = this.extend(); b.init.apply(b, arguments); return b }, init: function () { }, mixIn: function (b) { for (var h in b) b.hasOwnProperty(h) && (this[h] = b[h]); b.hasOwnProperty("toString") && (this.toString = b.toString) }, clone: function () { return this.init.prototype.extend(this) } }, q = l.WordArray = r.extend({ init: function (b, h) { b = this.words = b || []; this.sigBytes = h != p ? h : 4 * b.length }, toString: function (b) { return (b || t).stringify(this) }, concat: function (b) { var h = this.words, a = b.words, j = this.sigBytes; b = b.sigBytes; this.clamp(); if (j % 4) for (var g = 0; g < b; g++) h[j + g >>> 2] |= (a[g >>> 2] >>> 24 - 8 * (g % 4) & 255) << 24 - 8 * ((j + g) % 4); else if (65535 < a.length) for (g = 0; g < b; g += 4) h[j + g >>> 2] = a[g >>> 2]; else h.push.apply(h, a); this.sigBytes += b; return this }, clamp: function () { var b = this.words, h = this.sigBytes; b[h >>> 2] &= 4294967295 << 32 - 8 * (h % 4); b.length = s.ceil(h / 4) }, clone: function () { var b = r.clone.call(this); b.words = this.words.slice(0); return b }, random: function (b) { for (var h = [], a = 0; a < b; a += 4) h.push(4294967296 * s.random() | 0); return new q.init(h, b) } }), v = m.enc = {}, t = v.Hex = { stringify: function (b) { var a = b.words; b = b.sigBytes; for (var g = [], j = 0; j < b; j++) { var k = a[j >>> 2] >>> 24 - 8 * (j % 4) & 255; g.push((k >>> 4).toString(16)); g.push((k & 15).toString(16)) } return g.join("") }, parse: function (b) { for (var a = b.length, g = [], j = 0; j < a; j += 2) g[j >>> 3] |= parseInt(b.substr(j, 2), 16) << 24 - 4 * (j % 8); return new q.init(g, a / 2) } }, a = v.Latin1 = { stringify: function (b) { var a = b.words; b = b.sigBytes; for (var g = [], j = 0; j < b; j++) g.push(String.fromCharCode(a[j >>> 2] >>> 24 - 8 * (j % 4) & 255)); return g.join("") }, parse: function (b) { for (var a = b.length, g = [], j = 0; j < a; j++) g[j >>> 2] |= (b.charCodeAt(j) & 255) << 24 - 8 * (j % 4); return new q.init(g, a) } }, u = v.Utf8 = { stringify: function (b) { try { return decodeURIComponent(escape(a.stringify(b))) } catch (g) { throw Error("Malformed UTF-8 data"); } }, parse: function (b) { return a.parse(unescape(encodeURIComponent(b))) } }, g = l.BufferedBlockAlgorithm = r.extend({ reset: function () { this._data = new q.init; this._nDataBytes = 0 }, _append: function (b) { "string" == typeof b && (b = u.parse(b)); this._data.concat(b); this._nDataBytes += b.sigBytes }, _process: function (b) { var a = this._data, g = a.words, j = a.sigBytes, k = this.blockSize, m = j / (4 * k), m = b ? s.ceil(m) : s.max((m | 0) - this._minBufferSize, 0); b = m * k; j = s.min(4 * b, j); if (b) { for (var l = 0; l < b; l += k) this._doProcessBlock(g, l); l = g.splice(0, b); a.sigBytes -= j } return new q.init(l, j) }, clone: function () { var b = r.clone.call(this); b._data = this._data.clone(); return b }, _minBufferSize: 0 }); l.Hasher = g.extend({ cfg: r.extend(), init: function (b) { this.cfg = this.cfg.extend(b); this.reset() }, reset: function () { g.reset.call(this); this._doReset() }, update: function (b) { this._append(b); this._process(); return this }, finalize: function (b) { b && this._append(b); return this._doFinalize() }, blockSize: 16, _createHelper: function (b) { return function (a, g) { return (new b.init(g)).finalize(a) } }, _createHmacHelper: function (b) { return function (a, g) { return (new k.HMAC.init(b, g)).finalize(a) } } }); var k = m.algo = {}; return m }(Math); (function (s) { function p(a, k, b, h, l, j, m) { a = a + (k & b | ~k & h) + l + m; return (a << j | a >>> 32 - j) + k } function m(a, k, b, h, l, j, m) { a = a + (k & h | b & ~h) + l + m; return (a << j | a >>> 32 - j) + k } function l(a, k, b, h, l, j, m) { a = a + (k ^ b ^ h) + l + m; return (a << j | a >>> 32 - j) + k } function n(a, k, b, h, l, j, m) { a = a + (b ^ (k | ~h)) + l + m; return (a << j | a >>> 32 - j) + k } for (var r = CryptoJS, q = r.lib, v = q.WordArray, t = q.Hasher, q = r.algo, a = [], u = 0; 64 > u; u++) a[u] = 4294967296 * s.abs(s.sin(u + 1)) | 0; q = q.MD5 = t.extend({ _doReset: function () { this._hash = new v.init([1732584193, 4023233417, 2562383102, 271733878]) }, _doProcessBlock: function (g, k) { for (var b = 0; 16 > b; b++) { var h = k + b, w = g[h]; g[h] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360 } var b = this._hash.words, h = g[k + 0], w = g[k + 1], j = g[k + 2], q = g[k + 3], r = g[k + 4], s = g[k + 5], t = g[k + 6], u = g[k + 7], v = g[k + 8], x = g[k + 9], y = g[k + 10], z = g[k + 11], A = g[k + 12], B = g[k + 13], C = g[k + 14], D = g[k + 15], c = b[0], d = b[1], e = b[2], f = b[3], c = p(c, d, e, f, h, 7, a[0]), f = p(f, c, d, e, w, 12, a[1]), e = p(e, f, c, d, j, 17, a[2]), d = p(d, e, f, c, q, 22, a[3]), c = p(c, d, e, f, r, 7, a[4]), f = p(f, c, d, e, s, 12, a[5]), e = p(e, f, c, d, t, 17, a[6]), d = p(d, e, f, c, u, 22, a[7]), c = p(c, d, e, f, v, 7, a[8]), f = p(f, c, d, e, x, 12, a[9]), e = p(e, f, c, d, y, 17, a[10]), d = p(d, e, f, c, z, 22, a[11]), c = p(c, d, e, f, A, 7, a[12]), f = p(f, c, d, e, B, 12, a[13]), e = p(e, f, c, d, C, 17, a[14]), d = p(d, e, f, c, D, 22, a[15]), c = m(c, d, e, f, w, 5, a[16]), f = m(f, c, d, e, t, 9, a[17]), e = m(e, f, c, d, z, 14, a[18]), d = m(d, e, f, c, h, 20, a[19]), c = m(c, d, e, f, s, 5, a[20]), f = m(f, c, d, e, y, 9, a[21]), e = m(e, f, c, d, D, 14, a[22]), d = m(d, e, f, c, r, 20, a[23]), c = m(c, d, e, f, x, 5, a[24]), f = m(f, c, d, e, C, 9, a[25]), e = m(e, f, c, d, q, 14, a[26]), d = m(d, e, f, c, v, 20, a[27]), c = m(c, d, e, f, B, 5, a[28]), f = m(f, c, d, e, j, 9, a[29]), e = m(e, f, c, d, u, 14, a[30]), d = m(d, e, f, c, A, 20, a[31]), c = l(c, d, e, f, s, 4, a[32]), f = l(f, c, d, e, v, 11, a[33]), e = l(e, f, c, d, z, 16, a[34]), d = l(d, e, f, c, C, 23, a[35]), c = l(c, d, e, f, w, 4, a[36]), f = l(f, c, d, e, r, 11, a[37]), e = l(e, f, c, d, u, 16, a[38]), d = l(d, e, f, c, y, 23, a[39]), c = l(c, d, e, f, B, 4, a[40]), f = l(f, c, d, e, h, 11, a[41]), e = l(e, f, c, d, q, 16, a[42]), d = l(d, e, f, c, t, 23, a[43]), c = l(c, d, e, f, x, 4, a[44]), f = l(f, c, d, e, A, 11, a[45]), e = l(e, f, c, d, D, 16, a[46]), d = l(d, e, f, c, j, 23, a[47]), c = n(c, d, e, f, h, 6, a[48]), f = n(f, c, d, e, u, 10, a[49]), e = n(e, f, c, d, C, 15, a[50]), d = n(d, e, f, c, s, 21, a[51]), c = n(c, d, e, f, A, 6, a[52]), f = n(f, c, d, e, q, 10, a[53]), e = n(e, f, c, d, y, 15, a[54]), d = n(d, e, f, c, w, 21, a[55]), c = n(c, d, e, f, v, 6, a[56]), f = n(f, c, d, e, D, 10, a[57]), e = n(e, f, c, d, t, 15, a[58]), d = n(d, e, f, c, B, 21, a[59]), c = n(c, d, e, f, r, 6, a[60]), f = n(f, c, d, e, z, 10, a[61]), e = n(e, f, c, d, j, 15, a[62]), d = n(d, e, f, c, x, 21, a[63]); b[0] = b[0] + c | 0; b[1] = b[1] + d | 0; b[2] = b[2] + e | 0; b[3] = b[3] + f | 0 }, _doFinalize: function () { var a = this._data, k = a.words, b = 8 * this._nDataBytes, h = 8 * a.sigBytes; k[h >>> 5] |= 128 << 24 - h % 32; var l = s.floor(b / 4294967296); k[(h + 64 >>> 9 << 4) + 15] = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360; k[(h + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360; a.sigBytes = 4 * (k.length + 1); this._process(); a = this._hash; k = a.words; for (b = 0; 4 > b; b++) h = k[b], k[b] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360; return a }, clone: function () { var a = t.clone.call(this); a._hash = this._hash.clone(); return a } }); r.MD5 = t._createHelper(q); r.HmacMD5 = t._createHmacHelper(q) })(Math);
    /* jshint ignore:end */
    return CryptoJS.MD5(message).toString();
};


/***
* Transform base64 image to blob
* @b64Data 
* @contentType 
* @sliceSize 
*/
bizagi.util.b64toBlob = function (b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
};

bizagi.util.arrayEach = function (array, callback) {
    if (!!array) {
        if (Object.prototype.toString.apply(array) === "[object Array]" && Object.prototype.toString.apply(callback) === "[object Function]") {
            var index, value;
            for (index in array) {
                if (array.hasOwnProperty(index)) {
                    value = callback.call(array[index], index, array[index]);
                    if (value === false) {
                        return;
                    }
                }
            }
        } else {
            $.each(array, callback);
        }
    }
};

function printf(msg) {
    var args = Array.prototype.slice.call(arguments, 1), arg;
    return msg.replace(/(%[disv])/g, function (a, val) {
        arg = args.shift();
        if (arg !== undefined) {
            switch (val.charCodeAt(1)) {
                case 100:
                    return +arg; // d
                case 105:
                    return Math.round(+arg); // i
                case 115:
                    return String(arg); // s
                case 118:
                    return arg; // v
            }
        }
        return val;
    });
}

/*
* Validates if the text is a valid opening and closing tags, including classes
*/
bizagi.util.isHTMLValidText = function (text) {
    var ex = new RegExp(/<(.|\n)*?>/g);
    return ex.test(text);
};


/*
*   Determines if a control as a scrollbar 
*/
bizagi.util.hasScroll = function (el, direction) {
    if (el.length)
        el = el[0];
    direction = (direction === 'vertical') ? 'scrollTop' : 'scrollLeft';
    var result = !!el[direction];
    if (!result) {
        el[direction] = 1;
        result = !!el[direction];
        el[direction] = 0;
    }
    return result;
};

/**
 * Convert String to Base64 Unicode
 * @param {} str 
 * @returns {} 
 */
bizagi.util.b64EncodeUnicode = function(string) {
    return btoa(encodeURIComponent(string).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode("0x" + p1);
    }));
};

/**
* Method to detect iOS version Higher than 5
*/
bizagi.util.isIphoneHigherIOS5 = function () {

    if (this.value != undefined)
        return this.value;
    return this.value = RegExp("OS\\s*(5|6|7|8)_*\\d").test(navigator.userAgent) && RegExp(" AppleWebKit/").test(navigator.userAgent);
};

//remove all the character except the +, - and decimal point
bizagi.util.getStandardNotation = function (number, decimalSymbol) {
    var plusCharacter = '+';
    var minusCharacter = '-';
    var decimalSymbol = decimalSymbol || '.';
    var expSymbol = 'e';
    var tmp = '';
    //remove all the character except the +, -, decimal point and the numbers
    var decimalNumber = false;
    var exponentialNumber = false;
    number = (number.length > 0 ? number.toString().toLowerCase() : '').replace(/ /g, '');
    for (var i = 0; i < number.length; i++) {
        if ((number[i] === plusCharacter || number[i] === minusCharacter) && (i === 0 || number[i - 1] == expSymbol)) {
            tmp += number[i];
        } else if (!isNaN(Number(number[i]))) {
            tmp += number[i];
        }
        else if ((number[i] === decimalSymbol) && !decimalNumber) {
            tmp += number[i];
            decimalNumber = true;
        }
        else if ((number[i] === expSymbol) && !exponentialNumber) {
            tmp += number[i];
            exponentialNumber = true;
        }
    }
    return tmp;
};

//Return it in normalized scientific notation
bizagi.util.scientificNotationFormat = function (number, decimalSymbol, sdLimit, expMinLimit, expMaxLimit) {
    decimalSymbol = decimalSymbol || '.';
    number = bizagi.util.getStandardNotation(number, decimalSymbol);
    sdLimit = (sdLimit > 0) ? sdLimit : 38;
    expMinLimit = (expMinLimit > 0) ? expMinLimit : -125;
    expMaxLimit = (expMaxLimit > 0) ? expMaxLimit : 125;
    var expSimbol = 'e';
    var sNregex = new RegExp('[0-9]+(' + decimalSymbol + '[0-9]+)?(e[+-]?[0-9]+)?');
    var sNFormat = number.match(sNregex);

    //get que prefix
    var exp = 0;

    var prefix = number[0] === '-' ? number[0] : '';
    var originalPointIndex = 0;

    number = number.replace(prefix, '');

    //if the number is not in scientific notation
    if (sNFormat && sNFormat[0] && sNFormat[2]) {
        var tempParts = sNFormat[0] ? (sNFormat[0].replace(sNFormat[2], '').split(decimalSymbol)) : '';

        var significantDigits = '';
        var intPart = '';

        //calculate significant digits
        //remove zeros at the left
        tempParts[0] = tempParts[0].replace(/^0+/g, '');

        if (tempParts[0].length > 1) {
            significantDigits = tempParts[0].slice(1);
            originalPointIndex = significantDigits.length;
            intPart = tempParts[0][0] || '';
            significantDigits = significantDigits.concat(sNFormat[1] || '');
        }
        else if (tempParts[0].length === 1) {
            intPart = tempParts[0][0] || '';
            significantDigits = significantDigits.concat(tempParts[1] || '');
        }
        else {
            originalPointIndex = tempParts[1].length;
            tempParts[1] = tempParts[1].replace(/^0+/g, '');
            originalPointIndex = (tempParts[1].length - 1) - originalPointIndex;
            intPart = tempParts[1][0];
            significantDigits = tempParts[1].slice(1);
        }
        //remove . and zeros from significant digits
        significantDigits = significantDigits.replace(decimalSymbol, '').replace(/0+$/g, '');

        if (significantDigits.length >= sdLimit) {
            significantDigits = significantDigits.slice(0, sdLimit - 1);
        }
        exp = Number(sNFormat[2].replace(expSimbol, '')) + originalPointIndex;
        exp = (exp > expMaxLimit) ? expMaxLimit : (exp < expMinLimit) ? expMinLimit : exp;
        return prefix + intPart + (significantDigits ? (decimalSymbol + significantDigits) : '') + expSimbol + (exp > 0 ? '+' + exp : exp);
    }
    else if (number) {

        originalPointIndex = number.indexOf(decimalSymbol);
        var from = 0;
        var to = number.length - 1;

        //remove decimal point
        number = number.replace(decimalSymbol, '');

        //from
        var i = from;
        while (!significantFlag) {
            if (number[i] !== '0' && number[i] !== decimalSymbol) { significantFlag = true; from = i; }
            else { i++; }
        }
        //to
        var significantFlag = false;
        var j = to;
        while (!significantFlag) {
            if (number[j] !== '0' && number[j] !== decimalSymbol && '-') { significantFlag = true; to = j + 1; }
            else { j--; }
        }
        to = to > sdLimit + from ? sdLimit + from : to;
        if (originalPointIndex !== -1) {
            //find significant digits
            var significantFlag = false;
            var significantDigits = number.slice(from, to);
            var pointIndex = from + 1;
            exp = originalPointIndex - pointIndex;
            if (significantDigits.length > 0 && !isNaN(Number(significantDigits[0]))) {
                return prefix + significantDigits[0] + (significantDigits.length > 1 ? decimalSymbol + significantDigits.slice(1) : '') + expSimbol + (exp > 0 ? '+' + exp : exp);
            }
            else { return '0'; }

        }
        else {
            //Int numbers
            var firstDigit = number.slice(from, from + 1);
            var restDigits = number.slice(from + 1, number.length);
            exp = restDigits.length;
            restDigits = restDigits.replace(/0+$/g, '');
            if (restDigits.length > sdLimit) {
                restDigits = number.slice(from + 1, sdLimit + from);
            }
            if (Number(firstDigit)) {
                return prefix + firstDigit + (restDigits.length > 0 ? decimalSymbol + restDigits : '') + expSimbol + (exp > 0 ? '+' + exp : exp);
            } else { return '0'; }
        }
    }
    else { return ''; }
};
